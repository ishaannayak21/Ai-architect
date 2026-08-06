export function formatDate(value: string): string {
  const date = new Date(value);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(value: string): string {
  const date = new Date(value);
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function timeAgo(value: string): string {
  const date = new Date(value);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  const units: Array<[number, string]> = [
    [60, "second"],
    [60, "minute"],
    [24, "hour"],
    [7, "day"],
    [4.348, "week"],
    [12, "month"],
    [Infinity, "year"],
  ];
  let amount = seconds;
  let unit = "second";
  for (const [factor, nextUnit] of units) {
    if (amount < factor) {
      unit = nextUnit;
      break;
    }
    amount = Math.floor(amount / factor);
  }
  const label = `${amount} ${unit}${amount === 1 ? "" : "s"}`;
  return `${label} ago`;
}
