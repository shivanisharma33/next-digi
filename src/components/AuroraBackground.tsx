import React, { useEffect, useRef } from 'react';

const AuroraBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w: number, h: number;
    let time = 0;

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    const animate = () => {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, w, h);

      time += 0.005;

      // Draw large, blurry aurora-like blobs
      const blobs = [
        { x: 0.2, y: 0.3, r: 0.4, c: 'rgba(245, 197, 24, 0.15)' },
        { x: 0.8, y: 0.7, r: 0.5, c: 'rgba(193, 245, 24, 0.1)' },
        { x: 0.5, y: 0.5, r: 0.6, c: 'rgba(245, 197, 24, 0.05)' },
      ];

      blobs.forEach((b, i) => {
        const x = w * (b.x + Math.sin(time + i) * 0.1);
        const y = h * (b.y + Math.cos(time * 0.8 + i) * 0.1);
        const r = Math.min(w, h) * b.r;

        const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
        grad.addColorStop(0, b.c);
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.globalCompositeOperation = 'screen';
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Add a subtle grid overlay
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      const step = 60;
      for (let x = 0; x < w; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, zIndex: 0 }} />;
};

export default AuroraBackground;
