import React, { useEffect, useRef } from 'react';

const HeroBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;

    let W: number, H: number;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let t = 0;

    const resize = () => {
      const r = c.getBoundingClientRect();
      W = r.width;
      H = r.height;
      c.width = W * dpr;
      c.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    window.addEventListener('resize', resize);
    resize();

    const draw = () => {
      ctx.fillStyle = '#06070a';
      ctx.fillRect(0, 0, W, H);

      const horizon = H * 0.42;
      const cx = W * 0.62;

      // Floor grid (perspective)
      ctx.save();
      ctx.strokeStyle = 'rgba(245,197,24,.04)';
      ctx.lineWidth = 1;
      const gridLines = 18;
      for (let i = 0; i < gridLines; i++) {
        const depth = i / gridLines;
        const y = horizon + (H - horizon) * depth * depth;
        ctx.globalAlpha = (1 - depth) * 0.5;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }
      for (let i = -8; i <= 8; i++) {
        const fx = cx + i * W * 0.12;
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        ctx.moveTo(fx, horizon);
        ctx.lineTo(cx + (fx - cx) * 5, H + 100);
        ctx.stroke();
      }
      ctx.restore();

      // Horizon glow
      const grd = ctx.createRadialGradient(cx, horizon, 0, cx, horizon, W * 0.6);
      grd.addColorStop(0, 'rgba(245,197,24,.12)');
      grd.addColorStop(0.4, 'rgba(245,197,24,.04)');
      grd.addColorStop(1, 'rgba(245,197,24,0)');
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, W, H);

      // Rack rows — two parallel lines of GPU racks receding
      const rackCount = 14;
      for (let side = 0; side < 2; side++) {
        const sideOffset = side === 0 ? -1 : 1;
        for (let i = 0; i < rackCount; i++) {
          const depth = i / rackCount;
          const perspectiveScale = 0.15 + depth * depth * 1.2;
          const rowY = horizon + (H - horizon) * (depth * depth * 1.05);
          const rackBaseX = cx + sideOffset * (W * 0.12 + W * 0.18 * perspectiveScale);
          const rackW = 70 * perspectiveScale;
          const rackH = 180 * perspectiveScale;
          const rackY = rowY - rackH * 0.85;

          if (rackY > H || rackY + rackH < 0) continue;

          ctx.fillStyle = 'rgba(8,10,14,.94)';
          ctx.strokeStyle = 'rgba(245,197,24,' + (0.08 + depth * 0.18) + ')';
          ctx.lineWidth = 1;
          ctx.fillRect(rackBaseX - rackW / 2, rackY, rackW, rackH);
          ctx.strokeRect(rackBaseX - rackW / 2, rackY, rackW, rackH);

          const unitCount = Math.max(4, Math.floor(12 * perspectiveScale));
          for (let u = 0; u < unitCount; u++) {
            const uy = rackY + 4 + (rackH - 8) * (u / unitCount);
            const uh = (rackH - 8) / unitCount - 1.5;
            if (uh < 0.5) continue;

            const pulse = 0.3 + 0.5 * Math.abs(Math.sin(t * 2.2 + i * 0.7 + u * 0.4 + side * 1.3));
            const col = (u + i + side) % 7 === 0 ? 'rgba(0,232,120,' : 'rgba(245,197,24,';
            ctx.fillStyle = col + (pulse * (0.4 + depth * 0.5)) + ')';
            ctx.fillRect(rackBaseX - rackW / 2 + 3, uy, rackW - 6, uh);
          }

          ctx.fillStyle = 'rgba(245,197,24,' + (0.3 + depth * 0.6) + ')';
          ctx.fillRect(rackBaseX - rackW / 2, rackY, rackW, Math.max(1, 2 * perspectiveScale));

          if (depth > 0.4) {
            const glowR = rackW * 0.9;
            const glow = ctx.createRadialGradient(rackBaseX, rackY + rackH / 2, 0, rackBaseX, rackY + rackH / 2, glowR);
            glow.addColorStop(0, 'rgba(245,197,24,' + (0.06 * depth) + ')');
            glow.addColorStop(1, 'rgba(245,197,24,0)');
            ctx.fillStyle = glow;
            ctx.fillRect(rackBaseX - glowR, rackY - glowR / 2, glowR * 2, rackH + glowR);
          }
        }
      }

      // Data flow particles streaming toward viewer along center aisle
      for (let p = 0; p < 24; p++) {
        const u = ((t * 0.18) + p / 24) % 1;
        const pdepth = u;
        const py = horizon + (H - horizon) * (pdepth * pdepth * 1.05);
        const px = cx + (Math.sin(p * 1.7) * 0.05) * W * pdepth;
        const psize = 1 + pdepth * 3;
        const palpha = pdepth * 0.9;

        const pcol = (p % 5 === 0) ? 'rgba(0,232,120,' : 'rgba(245,197,24,';
        ctx.fillStyle = pcol + palpha + ')';
        ctx.beginPath();
        ctx.arc(px, py, psize, 0, Math.PI * 2);
        ctx.fill();

        if (pdepth > 0.3) {
          const pglow = ctx.createRadialGradient(px, py, 0, px, py, psize * 4);
          pglow.addColorStop(0, pcol + (palpha * 0.3) + ')');
          pglow.addColorStop(1, pcol + '0)');
          ctx.fillStyle = pglow;
          ctx.beginPath();
          ctx.arc(px, py, psize * 4, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Top scan line
      const scanY = ((t * 0.4) % 1) * H;
      const scanGrd = ctx.createLinearGradient(0, scanY - 40, 0, scanY + 40);
      scanGrd.addColorStop(0, 'rgba(245,197,24,0)');
      scanGrd.addColorStop(0.5, 'rgba(245,197,24,.06)');
      scanGrd.addColorStop(1, 'rgba(245,197,24,0)');
      ctx.fillStyle = scanGrd;
      ctx.fillRect(0, scanY - 40, W, 80);

      // Atmospheric haze
      const haze = ctx.createLinearGradient(0, 0, 0, H);
      haze.addColorStop(0, 'rgba(6,7,10,0)');
      haze.addColorStop(0.5, 'rgba(6,7,10,.2)');
      haze.addColorStop(1, 'rgba(6,7,10,.6)');
      ctx.fillStyle = haze;
      ctx.fillRect(0, 0, W, H);

      // Tech grid overlay
      ctx.strokeStyle = 'rgba(255,255,255,.015)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 40; i++) {
        ctx.beginPath();
        ctx.moveTo(i * W / 40, 0);
        ctx.lineTo(i * W / 40, H);
        ctx.stroke();
      }

      t += 0.012;
      requestAnimationFrame(draw);
    };

    draw();
    return () => window.removeEventListener('resize', resize);
  }, []);

  return <canvas ref={canvasRef} id="heroBg" />;
};

export default HeroBackground;
