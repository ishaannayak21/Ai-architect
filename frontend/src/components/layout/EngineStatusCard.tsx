import { useEffect, useRef } from "react";

export function EngineStatusCard() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let angleX = 0.3;
    let angleY = 0.5;

    const mediaReduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    // 8 Vertices of a 3D Cube
    const cubeVertices = [
      [-1, -1, -1],
      [1, -1, -1],
      [1, 1, -1],
      [-1, 1, -1],
      [-1, -1, 1],
      [1, -1, 1],
      [1, 1, 1],
      [-1, 1, 1],
    ];

    // 12 Edges connecting cube vertices
    const cubeEdges = [
      [0, 1], [1, 2], [2, 3], [3, 0],
      [4, 5], [5, 6], [6, 7], [7, 4],
      [0, 4], [1, 5], [2, 6], [3, 7],
    ];

    // Inner Core Octahedron
    const innerVertices = [
      [0, -0.65, 0],
      [0, 0.65, 0],
      [-0.65, 0, 0],
      [0.65, 0, 0],
      [0, 0, -0.65],
      [0, 0, 0.65],
    ];

    const innerEdges = [
      [0, 2], [0, 3], [0, 4], [0, 5],
      [1, 2], [1, 3], [1, 4], [1, 5],
      [2, 4], [4, 3], [3, 5], [5, 2],
    ];

    // Orbiting Particles
    const particles = Array.from({ length: 6 }).map((_, i) => ({
      orbitAngle: (i * Math.PI) / 3,
      radius: 1.5 + (i % 2) * 0.3,
      speed: 0.012 + (i % 3) * 0.004,
      yOffset: ((i % 3) - 1) * 0.25,
    }));

    const render = () => {
      if (document.hidden) {
        animId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      if (!mediaReduced.matches) {
        angleY += 0.007;
        angleX += 0.0035;
      }

      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);
      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);

      function project(x: number, y: number, z: number): [number, number] {
        const x1 = x * cosY + z * sinY;
        const z1 = -x * sinY + z * cosY;
        const y1 = y * cosX - z1 * sinX;
        const z2 = y * sinX + z1 * cosX;
        const scale = 34 / (3.2 + z2);
        return [cx + x1 * scale, cy + y1 * scale];
      }

      // 1. Draw Outer Cube Wireframe
      ctx.strokeStyle = "rgba(234, 88, 12, 0.7)";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      for (const [start, end] of cubeEdges) {
        const [x1, y1, z1] = cubeVertices[start];
        const [x2, y2, z2] = cubeVertices[end];
        const [p1x, p1y] = project(x1, y1, z1);
        const [p2x, p2y] = project(x2, y2, z2);
        ctx.moveTo(p1x, p1y);
        ctx.lineTo(p2x, p2y);
      }
      ctx.stroke();

      // 2. Draw Cube Corner Nodes
      ctx.fillStyle = "#f97316";
      for (const [x, y, z] of cubeVertices) {
        const [px, py] = project(x, y, z);
        ctx.beginPath();
        ctx.arc(px, py, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }

      // 3. Draw Inner Octahedron Core
      ctx.strokeStyle = "rgba(251, 146, 60, 0.4)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (const [start, end] of innerEdges) {
        const [x1, y1, z1] = innerVertices[start];
        const [x2, y2, z2] = innerVertices[end];
        const [p1x, p1y] = project(x1, y1, z1);
        const [p2x, p2y] = project(x2, y2, z2);
        ctx.moveTo(p1x, p1y);
        ctx.lineTo(p2x, p2y);
      }
      ctx.stroke();

      // 4. Draw Orbital Ring 1
      ctx.strokeStyle = "rgba(234, 88, 12, 0.25)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      const ringSteps = 28;
      for (let i = 0; i <= ringSteps; i++) {
        const theta = (i / ringSteps) * Math.PI * 2;
        const rx = Math.cos(theta) * 1.75;
        const rz = Math.sin(theta) * 1.75;
        const ry = Math.sin(theta * 2) * 0.15;
        const [px, py] = project(rx, ry, rz);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // 5. Draw Orbital Ring 2 (Emerald hint)
      ctx.strokeStyle = "rgba(16, 185, 129, 0.25)";
      ctx.beginPath();
      for (let i = 0; i <= ringSteps; i++) {
        const theta = (i / ringSteps) * Math.PI * 2;
        const rx = Math.cos(theta) * 1.55;
        const ry = Math.sin(theta) * 1.55;
        const rz = Math.cos(theta * 2) * 0.25;
        const [px, py] = project(rx, ry, rz);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // 6. Draw Orbiting Glowing Particles
      for (const pt of particles) {
        if (!mediaReduced.matches) {
          pt.orbitAngle += pt.speed;
        }
        const px = Math.cos(pt.orbitAngle) * pt.radius;
        const pz = Math.sin(pt.orbitAngle) * pt.radius;
        const py = pt.yOffset;
        const [sx, sy] = project(px, py, pz);

        ctx.fillStyle = "#ea580c";
        ctx.beginPath();
        ctx.arc(sx, sy, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-stone-200 bg-white p-4 text-stone-900 shadow-sm dark:border-stone-800 dark:bg-[#0c0c0c] dark:text-white dark:shadow-[0_0_15px_rgba(234,88,12,0.12)]">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[11px] font-bold text-orange-500 tracking-wider mb-1 uppercase">
            [ V2.0 SYSTEM ONLINE ]
          </p>
          <p className="font-sans text-xs font-bold text-stone-900 dark:text-stone-100 leading-snug">
            AI Blueprint &amp; Architecture Engine
          </p>
          <div className="mt-2 flex items-center gap-1.5 font-mono text-[11px] text-stone-500 dark:text-stone-400">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>active</span>
          </div>
        </div>

        {/* 3D Wireframe Engine Canvas */}
        <div className="relative shrink-0">
          <canvas
            ref={canvasRef}
            width={84}
            height={84}
            className="size-21 select-none pointer-events-none"
          />
        </div>
      </div>
    </div>
  );
}
