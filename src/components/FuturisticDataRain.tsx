"use client";

import React, { useEffect, useRef } from 'react';

interface FiberBeam {
  x: number;
  y: number;
  length: number;
  speed: number;
  width: number;
  alpha: number;
  pulseY: number;
  pulseSpeed: number;
  depth: number;
}

interface CyberParticle {
  x: number;
  y: number;
  size: number;
  speed: number;
  alpha: number;
  depth: number;
  sway: number;
  swaySpeed: number;
}

interface HexStream {
  x: number;
  y: number;
  chars: string[];
  speed: number;
  fontSize: number;
  alpha: number;
  depth: number;
}

export default function FuturisticDataRain() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let raf: number;
    let W = 0, H = 0;
    let tick = 0;

    const BEAMS: FiberBeam[] = [];
    const PARTICLES: CyberParticle[] = [];
    const STREAMS: HexStream[] = [];

    const hexChars = '0123456789ABCDEFÃ˜X#[]_'.split('');

    const initScene = () => {
      BEAMS.length = 0;
      PARTICLES.length = 0;
      STREAMS.length = 0;

      // Initialize fiber optic beams
      const beamCount = Math.floor(W / 24);
      for (let i = 0; i < beamCount; i++) {
        const depth = 0.3 + Math.random() * 0.7; // Depth scaling
        BEAMS.push({
          x: Math.random() * W,
          y: Math.random() * -H,
          length: 120 + Math.random() * 250,
          speed: (1.5 + Math.random() * 2.5) * depth,
          width: (0.6 + Math.random() * 1.4) * depth,
          alpha: (0.15 + Math.random() * 0.45) * depth,
          pulseY: 0,
          pulseSpeed: (3.0 + Math.random() * 4.0) * depth,
          depth,
        });
      }

      // Initialize digital glowing particles
      const particleCount = Math.floor(W / 12);
      for (let i = 0; i < particleCount; i++) {
        const depth = 0.2 + Math.random() * 0.8;
        PARTICLES.push({
          x: Math.random() * W,
          y: Math.random() * H,
          size: (1.0 + Math.random() * 2.0) * depth,
          speed: (0.6 + Math.random() * 1.8) * depth,
          alpha: (0.2 + Math.random() * 0.6) * depth,
          depth,
          sway: Math.random() * Math.PI * 2,
          swaySpeed: 0.01 + Math.random() * 0.02,
        });
      }

      // Initialize Hex stream columns
      const streamCount = Math.floor(W / 45);
      for (let i = 0; i < streamCount; i++) {
        const depth = 0.25 + Math.random() * 0.75;
        const fontSize = Math.floor((8 + Math.random() * 8) * depth);
        const charsLength = 5 + Math.floor(Math.random() * 12);
        const chars: string[] = [];
        for (let j = 0; j < charsLength; j++) {
          chars.push(hexChars[Math.floor(Math.random() * hexChars.length)]);
        }

        STREAMS.push({
          x: Math.random() * W,
          y: Math.random() * -H - 100,
          chars,
          speed: (0.8 + Math.random() * 1.6) * depth,
          fontSize,
          alpha: (0.15 + Math.random() * 0.4) * depth,
          depth,
        });
      }
    };

    const handleResize = () => {
      if (!canvas || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.scale(dpr, dpr);
      initScene();
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    const animate = () => {
      tick++;

      // Cinematic motion blur background: draw translucent black frame
      ctx.fillStyle = 'rgba(5, 6, 8, 0.16)';
      ctx.fillRect(0, 0, W, H);

      // Subtle golden grid line overlay
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = 'rgba(245, 197, 24, 0.006)';
      const gridSize = 40;
      for (let x = 0; x < W; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      for (let y = 0; y < H; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }

      // Draw fiber-optic streams (Vertical Beams)
      BEAMS.forEach(beam => {
        // Move beams down
        beam.y += beam.speed;
        beam.pulseY += beam.pulseSpeed;

        if (beam.y > H) {
          beam.y = -beam.length - 50;
          beam.x = Math.random() * W;
          beam.pulseY = 0;
        }

        // Draw the stream line
        const grad = ctx.createLinearGradient(beam.x, beam.y, beam.x, beam.y + beam.length);
        grad.addColorStop(0, 'rgba(245, 197, 24, 0)');
        grad.addColorStop(0.5, `rgba(245, 197, 24, ${beam.alpha})`);
        grad.addColorStop(1, 'rgba(245, 197, 24, 0)');

        // Mouse attraction: bend stream slightly towards mouse if close
        let drawX = beam.x;
        if (mouseRef.current.active) {
          const dx = mouseRef.current.x - beam.x;
          const dy = mouseRef.current.y - beam.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 220) {
            const influence = (1 - dist / 220) * 15 * beam.depth;
            drawX += dx > 0 ? influence : -influence;
          }
        }

        ctx.strokeStyle = grad;
        ctx.lineWidth = beam.width;
        ctx.beginPath();
        ctx.moveTo(drawX, beam.y);
        ctx.lineTo(drawX, beam.y + beam.length);
        ctx.stroke();

        // Draw pulse traveling along fiber-optic
        const currentPulseY = beam.y + (beam.pulseY % beam.length);
        
        ctx.save();
        ctx.shadowColor = '#f5c518';
        ctx.shadowBlur = 10 * beam.depth;
        
        // High density glow capsule
        const pulseGrad = ctx.createRadialGradient(
          drawX, currentPulseY, 0,
          drawX, currentPulseY, 6 * beam.depth
        );
        pulseGrad.addColorStop(0, '#ffffff');
        pulseGrad.addColorStop(0.3, 'rgba(245, 197, 24, 1)');
        pulseGrad.addColorStop(1, 'rgba(245, 197, 24, 0)');
        
        ctx.fillStyle = pulseGrad;
        ctx.beginPath();
        ctx.arc(drawX, currentPulseY, 6 * beam.depth, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Draw cyber dust / glowing digital particles
      PARTICLES.forEach(p => {
        p.y += p.speed;
        p.sway += p.swaySpeed;
        const driftX = Math.sin(p.sway) * (1.5 * p.depth);

        if (p.y > H) {
          p.y = -10;
          p.x = Math.random() * W;
        }

        let drawX = p.x + driftX;
        let brightnessMultiplier = 1;

        // Interaction: mouse attraction and brightness boost
        if (mouseRef.current.active) {
          const dx = mouseRef.current.x - drawX;
          const dy = mouseRef.current.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            const factor = 1 - dist / 150;
            drawX += dx * factor * 0.08;
            p.y += dy * factor * 0.08;
            brightnessMultiplier = 1.0 + factor * 1.5;
          }
        }

        ctx.fillStyle = `rgba(245, 197, 24, ${Math.min(p.alpha * brightnessMultiplier, 1)})`;
        ctx.beginPath();
        ctx.arc(drawX, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Subtle glow ring for larger foreground particles
        if (p.depth > 0.75 && tick % 2 === 0) {
          ctx.strokeStyle = `rgba(245, 197, 24, ${p.alpha * 0.15})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.arc(drawX, p.y, p.size * 3.5, 0, Math.PI * 2);
          ctx.stroke();
        }
      });

      // Draw digital Hex rain streams
      STREAMS.forEach(stream => {
        stream.y += stream.speed;

        if (stream.y > H + 120) {
          stream.y = -150 - Math.random() * 100;
          stream.x = Math.random() * W;
        }

        ctx.font = `bold ${stream.fontSize}px monospace`;
        ctx.textAlign = 'center';

        // Stagger characters within the stream column
        const len = stream.chars.length;
        for (let i = 0; i < len; i++) {
          const charY = stream.y - (i * stream.fontSize * 1.25);
          if (charY < -20 || charY > H + 20) continue;

          // Fade out characters as they go up the tail
          const tailFade = 1 - (i / len);
          let alpha = stream.alpha * tailFade;

          // Occasionally flicker character value
          if (Math.random() < 0.02) {
            stream.chars[i] = hexChars[Math.floor(Math.random() * hexChars.length)];
          }

          // Top/Head character glows bright white/yellow
          if (i === 0) {
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 2})`;
            ctx.shadowColor = '#f5c518';
            ctx.shadowBlur = 4;
          } else {
            ctx.fillStyle = `rgba(245, 197, 24, ${alpha})`;
            ctx.shadowBlur = 0;
          }

          ctx.fillText(stream.chars[i], stream.x, charY);
        }
      });

      // Interactive ambient mouse radial glow
      if (mouseRef.current.active) {
        const radial = ctx.createRadialGradient(
          mouseRef.current.x, mouseRef.current.y, 0,
          mouseRef.current.x, mouseRef.current.y, 160
        );
        radial.addColorStop(0, 'rgba(245, 197, 24, 0.08)');
        radial.addColorStop(0.5, 'rgba(245, 197, 24, 0.015)');
        radial.addColorStop(1, 'rgba(5, 6, 8, 0)');
        ctx.fillStyle = radial;
        ctx.fillRect(0, 0, W, H);
      }

      raf = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-[#050608]">
      <canvas ref={canvasRef} className="block w-full h-full opacity-75" />
      {/* Dark ambient depth vignette overlays */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_80%_at_50%_40%,rgba(5,6,8,0.0)_15%,rgba(5,6,8,0.7)_85%)] pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#050608] via-[#050608]/40 to-transparent pointer-events-none" />
    </div>
  );
}
