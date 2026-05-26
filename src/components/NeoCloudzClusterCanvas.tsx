import { useEffect, useRef } from "react";

export default function NeoCloudzClusterCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0;
    let H = 0;
    let t = 0;
    let visible = true;
    let rafId = 0;

    const size = () => {
      const rect = canvas.getBoundingClientRect();
      W = rect.width || canvas.offsetWidth || 800;
      H = rect.height || canvas.offsetHeight || 480;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const rr = (x: number, y: number, w: number, h: number, r: number) => {
      ctx.beginPath();
      // roundRect is widely available; fall back to rect if missing
      const c = ctx as CanvasRenderingContext2D & {
        roundRect?: (x: number, y: number, w: number, h: number, r: number) => void;
      };
      if (typeof c.roundRect === "function") c.roundRect(x, y, w, h, r);
      else ctx.rect(x, y, w, h);
      ctx.closePath();
    };

    const clearDark = () => {
      ctx.fillStyle = "#0a0c10";
      ctx.fillRect(0, 0, W, H);
    };

    const drawGrid = (divs: number, alpha: number) => {
      ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
      ctx.lineWidth = 1;
      for (let i = 0; i < divs; i++) {
        ctx.beginPath();
        ctx.moveTo((i * W) / divs, 0);
        ctx.lineTo((i * W) / divs, H);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, (i * H) / divs);
        ctx.lineTo(W, (i * H) / divs);
        ctx.stroke();
      }
    };

    const draw = () => {
      clearDark();
      drawGrid(28, 0.022);

      const cols = 8;
      const rows = 4;
      const padX = W * 0.06;
      const padY = H * 0.06;
      const cw = (W - padX * 2) / cols;
      const ch = (H * 0.56 - padY) / rows;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = padX + c * cw + 4;
          const y = padY + r * ch + 4;
          const w = cw - 8;
          const h = ch - 8;
          const load =
            0.58 + 0.4 * Math.abs(Math.sin(t * 1.0 + r * 0.7 + c * 0.42));
          const temp = 56 + Math.round(13 * load);

          rr(x, y, w, h, 3);
          ctx.fillStyle = "rgba(0,12,8,.94)";
          ctx.fill();
          ctx.strokeStyle = `rgba(0,217,110,${0.18 + load * 0.32})`;
          ctx.lineWidth = 1;
          ctx.stroke();

          const ng = ctx.createRadialGradient(
            x + w / 2, y + h / 2, 0,
            x + w / 2, y + h / 2, w * 0.6,
          );
          ng.addColorStop(0, `rgba(0,217,110,${load * 0.16})`);
          ng.addColorStop(1, "rgba(0,217,110,0)");
          ctx.fillStyle = ng;
          ctx.fillRect(x, y, w, h);

          ctx.fillStyle = "rgba(0,217,110,.1)";
          ctx.fillRect(x + 4, y + h - 7, w - 8, 4);
          ctx.fillStyle = `rgba(0,217,110,${0.55 + load * 0.4})`;
          ctx.fillRect(x + 4, y + h - 7, (w - 8) * load, 4);

          ctx.fillStyle = "rgba(255,255,255,.42)";
          ctx.font = "8px 'JetBrains Mono', ui-monospace, monospace";
          ctx.textAlign = "left";
          ctx.fillText(`${Math.round(load * 100)}%`, x + 5, y + 13);
          ctx.fillStyle = "rgba(245,197,24,.5)";
          ctx.fillText(`${temp}C`, x + 5, y + 24);
        }
      }

      // Inter-node fabric pulses
      const pairs: [number, number][] = [
        [0, 9], [5, 14], [3, 20], [12, 27],
        [7, 18], [1, 24], [15, 6], [22, 11],
      ];
      pairs.forEach((pair, i) => {
        const ac = pair[0] % cols;
        const ar = Math.floor(pair[0] / cols);
        const bc = pair[1] % cols;
        const br = Math.floor(pair[1] / cols);
        const ax = padX + ac * cw + cw / 2;
        const ay = padY + ar * ch + ch / 2;
        const bx = padX + bc * cw + cw / 2;
        const by = padY + br * ch + ch / 2;
        ctx.strokeStyle = "rgba(0,217,110,.06)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(bx, by);
        ctx.stroke();
        const u = (t * 0.5 + i * 0.12) % 1;
        const px = ax + (bx - ax) * u;
        const py = ay + (by - ay) * u;
        const pg = ctx.createRadialGradient(px, py, 0, px, py, 6);
        pg.addColorStop(0, "rgba(0,217,110,.85)");
        pg.addColorStop(1, "rgba(0,217,110,0)");
        ctx.fillStyle = pg;
        ctx.beginPath();
        ctx.arc(px, py, 5, 0, Math.PI * 2);
        ctx.fill();
      });

      // Terminal panel
      const ty = H * 0.7;
      const tw = W * 0.88;
      const tx = W * 0.06;
      ctx.fillStyle = "rgba(0,0,0,.65)";
      rr(tx, ty, tw, H * 0.24, 4);
      ctx.fill();
      ctx.strokeStyle = "rgba(0,217,110,.2)";
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = "rgba(0,217,110,.1)";
      ctx.fillRect(tx, ty, tw, 22);
      ctx.fillStyle = "rgba(0,217,110,.6)";
      ctx.font = "700 10px 'JetBrains Mono', ui-monospace, monospace";
      ctx.textAlign = "left";
      ctx.fillText("● neocloudz-cluster-01 // live telemetry", tx + 12, ty + 15);

      const utilAvg = Math.round(82 + 8 * Math.sin(t * 0.7));
      const tempAvg = Math.round(59 + 4 * Math.sin(t * 0.5));
      const tps = 138 + Math.round(12 * Math.sin(t * 0.9));
      const step = Math.floor(t * 10 + 820);
      const fabUtil = 62 + Math.round(8 * Math.sin(t * 1.2));

      const lines: [string, string][] = [
        ["rgba(0,217,110,.95)", "cluster_id: ncz-prod-b200-01  |  nodes: 32× B200  |  fabric: 400G InfiniBand NDR"],
        ["rgba(245,197,24,.78)", `util_avg: ${utilAvg}%   |  temp_avg: ${tempAvg}°C  |  vram: 6.14 / 6.40 TB`],
        ["rgba(77,200,255,.72)", `throughput: ${tps}k tok/s  |  job: llm-finetune-7b  |  step: ${step}`],
        ["rgba(255,255,255,.32)", `interconnect: healthy  |  fabric_util: ${fabUtil}%  |  nccl: OK  |  power: 1.24MW`],
      ];
      lines.forEach((l, i) => {
        ctx.fillStyle = l[0];
        ctx.font = "11px 'JetBrains Mono', ui-monospace, monospace";
        ctx.fillText(l[1], tx + 12, ty + 40 + i * 22);
      });
    };

    const loop = () => {
      if (visible) draw();
      t += 0.014;
      rafId = requestAnimationFrame(loop);
    };

    const onResize = () => size();
    window.addEventListener("resize", onResize, { passive: true });
    size();

    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => (visible = e.isIntersecting)),
      { threshold: 0 },
    );
    io.observe(canvas);

    loop();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      io.disconnect();
    };
  }, []);

  return (
    <div className="aspect-[16/10] bg-[#0a0c10] rounded-lg overflow-hidden border border-white/5 shadow-2xl relative">
      <canvas
        ref={canvasRef}
        className="block w-full h-full"
        aria-label="NeoCloudz Cluster — Live Node Telemetry"
      />
      <div className="pointer-events-none absolute bottom-3 left-4 text-[10px] font-mono uppercase tracking-[0.18em] text-white/25">
        NeoCloudz Cluster — Live Node Telemetry
      </div>
    </div>
  );
}
