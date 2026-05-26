import React, { useEffect, useRef } from 'react';

const GridBackground = () => {
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

      time += 0.01;

      const centerX = w / 2;
      const centerY = h / 2;
      const perspective = 400;

      // Draw horizontal lines (perspective)
      ctx.strokeStyle = 'rgba(245, 197, 24, 0.15)';
      ctx.lineWidth = 1;

      for (let i = -20; i <= 20; i++) {
        ctx.beginPath();
        const xStart = centerX + i * 100;
        const xEnd = centerX + i * 1000;
        
        // Perspective line
        ctx.moveTo(centerX + (i * 50), centerY - 100);
        ctx.lineTo(centerX + (i * 2000), h);
        ctx.stroke();
      }

      // Draw moving horizontal "waves"
      for (let i = 0; i < 20; i++) {
        const yBase = centerY - 100;
        const progress = (i + time * 2) % 20;
        const y = yBase + (progress * progress * 2);
        const opacity = Math.min(1, progress / 10) * (1 - progress / 20);
        
        ctx.beginPath();
        ctx.strokeStyle = `rgba(245, 197, 24, ${opacity * 0.3})`;
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Atmospheric glow at horizon
      const grad = ctx.createLinearGradient(0, centerY - 150, 0, centerY + 50);
      grad.addColorStop(0, 'rgba(245, 197, 24, 0)');
      grad.addColorStop(0.5, 'rgba(245, 197, 24, 0.1)');
      grad.addColorStop(1, 'rgba(245, 197, 24, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, centerY - 150, w, 200);

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, zIndex: 0 }} />;
};

export default GridBackground;
