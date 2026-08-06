export function getRenderedSvg(
  container: HTMLElement | null,
): SVGSVGElement | null {
  if (!container) {
    return null;
  }
  const svg = container.querySelector("svg");
  return svg instanceof SVGSVGElement ? svg : null;
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

function serializeSvg(svg: SVGSVGElement): string {
  const clone = svg.cloneNode(true) as SVGSVGElement;
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  clone.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
  return new XMLSerializer().serializeToString(clone);
}

function svgForCanvas(svg: SVGSVGElement): string {
  const clone = svg.cloneNode(true) as SVGSVGElement;
  clone
    .querySelectorAll("foreignObject")
    .forEach((foreignObject) => {
      const parent = foreignObject.parentElement;
      if (!parent) {
        foreignObject.remove();
        return;
      }
      const width = parseFloat(foreignObject.getAttribute("width") ?? "0");
      const height = parseFloat(foreignObject.getAttribute("height") ?? "0");
      const x = parseFloat(foreignObject.getAttribute("x") ?? "0");
      const y = parseFloat(foreignObject.getAttribute("y") ?? "0");
      const text = (foreignObject.textContent ?? "").trim();
      const textElement = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text",
      );
      textElement.setAttribute("x", String(x + width / 2));
      textElement.setAttribute("y", String(y + height / 2));
      textElement.setAttribute("text-anchor", "middle");
      textElement.setAttribute("dominant-baseline", "central");
      textElement.setAttribute(
        "font-family",
        '"Inter", ui-sans-serif, system-ui, sans-serif',
      );
      textElement.setAttribute("font-size", "14");
      textElement.setAttribute("fill", "#333333");
      textElement.textContent = text || "\u00a0";
      parent.replaceChild(textElement, foreignObject);
    });
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  clone.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
  return new XMLSerializer().serializeToString(clone);
}

export function downloadSvg(svg: SVGSVGElement, filename: string) {
  const source = `<?xml version="1.0" encoding="UTF-8"?>\n${serializeSvg(svg)}`;
  const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
  downloadBlob(blob, filename);
}

export function downloadPng(
  svg: SVGSVGElement,
  filename: string,
  background = "#ffffff",
  pixelRatio = 2,
) {
  const source = `<?xml version="1.0" encoding="UTF-8"?>\n${svgForCanvas(svg)}`;
  const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const image = new Image();
  image.onload = () => {
    const width = image.naturalWidth || 800;
    const height = image.naturalHeight || 600;
    const canvas = document.createElement("canvas");
    canvas.width = width * pixelRatio;
    canvas.height = height * pixelRatio;
    const context = canvas.getContext("2d");
    if (!context) {
      URL.revokeObjectURL(url);
      return;
    }
    context.fillStyle = background;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    URL.revokeObjectURL(url);
    canvas.toBlob((pngBlob) => {
      if (pngBlob) {
        downloadBlob(pngBlob, filename);
      }
    }, "image/png");
  };
  image.onerror = () => {
    URL.revokeObjectURL(url);
  };
  image.src = url;
}

export async function copyText(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export function diagramFilename(prefix: string, diagramType: string): string {
  return `${slugify(prefix)}-${slugify(diagramType)}`;
}