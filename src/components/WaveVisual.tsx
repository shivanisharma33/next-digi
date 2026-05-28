import React, { useEffect, useRef } from 'react';

const WaveVisual: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let rafId = 0;
    let t = 0;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = container.clientWidth || 340;
      h = container.clientHeight || 480;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    const numCols = 24; // Fits nicely inside the 340px width card
    const numTicks = 12; // 12 vertical segment bands per column

    // Active state helper function using sine waves
    const getActiveState = (colIdx: number, tickIdx: number, time: number) => {
      // Create superimposed wave patterns for clusters of activity
      const w1 = Math.sin(colIdx * 0.28 - time * 1.4) * Math.cos(tickIdx * 0.35 + time * 0.8);
      const w2 = Math.sin(colIdx * 0.15 + tickIdx * 0.2 - time * 0.6);
      const combined = w1 * 0.7 + w2 * 0.3;
      return combined > 0.35; // Returns true if tick is "active" (glowing white)
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      // Increment time
      t += 0.016;

      const colWidth = w / (numCols + 1);
      const centerY = h * 0.46;
      const baseHalfLen = h * 0.22;

      // Draw each column
      for (let i = 0; i < numCols; i++) {
        const x = (i + 1) * colWidth;

        // Calculate dynamic spine height (top & bottom boundaries forming a wave contour)
        const spineWave = Math.sin(i * 0.24 - t * 0.85) * Math.cos(i * 0.12 + t * 0.4);
        const spineHalfLen = baseHalfLen * (0.68 + 0.32 * spineWave);
        const yTop = centerY - spineHalfLen;
        const yBottom = centerY + spineHalfLen;

        // 1. Draw Golden Vertical Spine
        ctx.strokeStyle = '#f5c518';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(x, yTop);
        ctx.lineTo(x, yBottom);
        ctx.stroke();

        // 2. Draw small horizontal golden end-caps at top and bottom
        ctx.fillStyle = '#f5c518';
        ctx.fillRect(x - 3, yTop - 0.5, 6, 1);
        ctx.fillRect(x - 3, yBottom - 0.5, 6, 1);

        // 3. Draw stacked horizontal segment bands (ticks)
        const tickStep = (yBottom - yTop) / (numTicks - 1);
        for (let j = 0; j < numTicks; j++) {
          const ty = yTop + j * tickStep;
          const isActive = getActiveState(i, j, t);

          if (isActive) {
            // Draw active glowing white segment
            ctx.save();
            ctx.fillStyle = '#ffffff';
            ctx.shadowColor = 'rgba(255, 255, 255, 0.9)';
            ctx.shadowBlur = 6;
            ctx.fillRect(x - 6, ty - 1, 12, 2);
            ctx.restore();
          } else {
            // Draw regular dark gray segment
            ctx.fillStyle = 'rgba(100, 105, 115, 0.4)';
            ctx.fillRect(x - 4, ty - 0.75, 8, 1.5);
          }
        }
      }

      // 4. Draw diagonal connection links between active segments on adjacent columns
      for (let i = 0; i < numCols - 1; i++) {
        const x1 = (i + 1) * colWidth;
        const x2 = (i + 2) * colWidth;

        // Dynamic spine heights for endpoints
        const spineWave1 = Math.sin(i * 0.24 - t * 0.85) * Math.cos(i * 0.12 + t * 0.4);
        const spineHalfLen1 = baseHalfLen * (0.68 + 0.32 * spineWave1);
        const yTop1 = centerY - spineHalfLen1;
        const yBottom1 = centerY + spineHalfLen1;
        const tickStep1 = (yBottom1 - yTop1) / (numTicks - 1);

        const spineWave2 = Math.sin((i + 1) * 0.24 - t * 0.85) * Math.cos((i + 1) * 0.12 + t * 0.4);
        const spineHalfLen2 = baseHalfLen * (0.68 + 0.32 * spineWave2);
        const yTop2 = centerY - spineHalfLen2;
        const yBottom2 = centerY + spineHalfLen2;
        const tickStep2 = (yBottom2 - yTop2) / (numTicks - 1);

        for (let j = 0; j < numTicks; j++) {
          const isActive1 = getActiveState(i, j, t);
          if (!isActive1) continue;

          // Connect to nearby active segments on the adjacent column
          for (let offset = -1; offset <= 1; offset++) {
            const nextJ = j + offset;
            if (nextJ >= 0 && nextJ < numTicks) {
              const isActive2 = getActiveState(i + 1, nextJ, t);
              if (isActive2) {
                // Determine connection link intensity
                const connectPhase = i * 0.45 + j * 0.65 - t * 1.6;
                const linkVal = Math.sin(connectPhase);

                // Only draw a sparse set of active links
                if (linkVal > 0.78) {
                  const ty1 = yTop1 + j * tickStep1;
                  const ty2 = yTop2 + nextJ * tickStep2;

                  ctx.strokeStyle = `rgba(255, 255, 255, ${(linkVal - 0.78) * 4.5})`;
                  ctx.lineWidth = 1.0;
                  ctx.beginPath();
                  ctx.moveTo(x1, ty1);
                  ctx.lineTo(x2, ty2);
                  ctx.stroke();
                }
              }
            }
          }
        }
      }

      rafId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};

export default WaveVisual;
