"use client";

import React, { useRef, useEffect } from 'react';

/**
 * Energy/Infrastructure Hero Background:
 * - Slow-falling thin line rays (no text/language)
 * - Brand yellow (#f5c518) and white lines
 * - Linear fading tail for a smooth digital rain stream effect
 */

interface RayLine {
  x: number;
  y: number;
  length: number;
  speed: number;
  isYellow: boolean;
  opacity: number;
  width: number;
}

const EnergyHeroCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let W = 0, H = 0, raf = 0;
    let lines: RayLine[] = [];

    const spawnLine = (randomY = false): RayLine => {
      const isYellow = Math.random() < 0.3; // 30% yellow, 70% white
      return {
        x: Math.random() * W,
        y: randomY ? Math.random() * H : -Math.random() * 200 - 50,
        length: 35 + Math.random() * 55,        // slightly longer for beautiful speed streak
        speed: 3.2 + Math.random() * 3.6,     // much faster falling speed (3.2 to 6.8px/f)
        isYellow,
        opacity: 0.2 + Math.random() * 0.5,     // elegant opacity
        width: 0.75 + Math.random() * 0.75,     // thin line width
      };
    };

    const initLines = () => {
      const count = Math.max(50, Math.floor((W * H) / 9000));
      lines = Array.from({ length: count }, () => spawnLine(true));
    };

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width  = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width  = W + 'px';
      canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initLines();
    };

    const draw = () => {
      // base fill background
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, W, H);

      // subtle dot grid
      const spacing = 28;
      ctx.fillStyle = 'rgba(255,255,255,0.04)';
      for (let x = spacing / 2; x < W; x += spacing) {
        for (let y = spacing / 2; y < H; y += spacing) {
          ctx.beginPath();
          ctx.arc(x, y, 0.6, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // draw falling line rays
      lines.forEach((line, i) => {
        const headY = line.y + line.length;
        
        // gradient tail fading upward
        const grad = ctx.createLinearGradient(line.x, line.y, line.x, headY);
        grad.addColorStop(0, line.isYellow ? 'rgba(245,197,24,0)' : 'rgba(255,255,255,0)');
        grad.addColorStop(1, line.isYellow 
          ? `rgba(245,197,24,${line.opacity})` 
          : `rgba(255,255,255,${line.opacity})`
        );

        ctx.strokeStyle = grad;
        ctx.lineWidth = line.width;
        ctx.lineCap = 'round';
        
        ctx.beginPath();
        ctx.moveTo(line.x, line.y);
        ctx.lineTo(line.x, headY);
        ctx.stroke();

        // slow physics fall
        line.y += line.speed;

        // reset line when it exits bottom of screen
        if (line.y > H) {
          lines[i] = spawnLine(false);
        }
      });

      raf = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    resize();
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ display: 'block', opacity: 0.6, pointerEvents: 'none' }}
    />
  );
};

export default EnergyHeroCanvas;
