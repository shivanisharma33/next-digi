import React, { useEffect, useRef } from 'react';

const WaveBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w: number, h: number;
    
    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    const rings = 24; 
    
    let time = 0;
    const animate = () => {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, w, h);
      
      time += 0.015;
      
      const centerX = w * 0.7; // Back to the right side
      const centerY = h * 0.5;
      
      // Draw grid-like dots background
      ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
      const step = 60;
      for (let x = 0; x < w; x += step) {
        for (let y = 0; y < h; y += step) {
          ctx.fillRect(x, y, 1, 1);
        }
      }

      for (let r_idx = 0; r_idx < rings; r_idx++) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.05 + (1 - r_idx / rings) * 0.2})`;
        ctx.lineWidth = 1;
        
        const baseRadius = Math.min(w, h) * 0.2 + r_idx * 6;
        const points = 240;
        
        for (let i = 0; i <= points; i++) {
          const a = (i / points) * Math.PI * 2;
          const noise = Math.sin(a * 6 + time + r_idx * 0.1) * 20;
          const noise2 = Math.cos(a * 4 - time * 0.5) * 12;
          
          const r = baseRadius + noise + noise2;
          
          const x = centerX + Math.cos(a) * r;
          const y = centerY + Math.sin(a) * r;
          
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
      }

      // Bright yellow dots
      for (let i = 0; i < 4; i++) {
        const a = time * 0.2 + (i * Math.PI * 0.5);
        const r = Math.min(w, h) * 0.25 + Math.sin(time + i) * 40;
        const x = centerX + Math.cos(a) * r;
        const y = centerY + Math.sin(a) * r;
        
        ctx.fillStyle = '#f5c518';
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
        
        const grad = ctx.createRadialGradient(x, y, 0, x, y, 15);
        grad.addColorStop(0, 'rgba(245, 197, 24, 0.4)');
        grad.addColorStop(1, 'rgba(245, 197, 24, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, 15, 0, Math.PI * 2);
        ctx.fill();
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

export default WaveBackground;
