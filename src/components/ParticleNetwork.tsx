"use client";

import { useEffect, useRef } from 'react';

interface ParticleNetworkProps {
  /** Number of particles. Default 60. */
  count?: number;
  /** Max distance (px) at which two particles are linked. Default 120. */
  linkDistance?: number;
  /** Particle / line color. Default brand yellow. */
  color?: string;
  /** Drift speed multiplier. Default 1. */
  speed?: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  history: { x: number; y: number }[];
  maxHistory: number;
  phaseOffset: number;
}

export default function ParticleNetwork({
  count = 60,
  linkDistance = 120,
  color = '245, 197, 24',
  speed = 1,
}: ParticleNetworkProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let raf = 0;
    let particles: Particle[] = [];
    let time = 0;

    // Track mouse globally to prevent capturing mouse clicks
    const mouse = { x: -1000, y: -1000 };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const seed = () => {
      particles = Array.from({ length: count }, () => {
        const pSpeed = (0.2 + Math.random() * 0.3) * speed;
        const angle = Math.random() * Math.PI * 2;
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          vx: Math.cos(angle) * pSpeed,
          vy: Math.sin(angle) * pSpeed,
          history: [],
          maxHistory: 5 + Math.floor(Math.random() * 5), // dynamic trail length
          phaseOffset: Math.random() * Math.PI * 2,
        };
      });
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.008;

      // Local mouse position from global coordinates
      const rect = canvas.getBoundingClientRect();
      const localMouseX = mouse.x - rect.left;
      const localMouseY = mouse.y - rect.top;
      const isMouseInside =
        mouse.x >= rect.left &&
        mouse.x <= rect.right &&
        mouse.y >= rect.top &&
        mouse.y <= rect.bottom;

      // Update and move particles
      for (const p of particles) {
        // 1. Vector Flow Field using multi-frequency trigonometric noise
        const flowAngle =
          Math.sin(p.x * 0.004 + time + p.phaseOffset) *
            Math.cos(p.y * 0.004 + time * 0.8) *
            Math.PI * 1.5;
        const targetVx = Math.cos(flowAngle) * 0.45 * speed;
        const targetVy = Math.sin(flowAngle) * 0.45 * speed;

        // Blend flow field force
        p.vx += (targetVx - p.vx) * 0.035;
        p.vy += (targetVy - p.vy) * 0.035;

        // 2. Interactive Mouse Vortex Attraction and Orbit Physics
        if (isMouseInside) {
          const dx = localMouseX - p.x;
          const dy = localMouseY - p.y;
          const dist = Math.hypot(dx, dy);
          const maxInfluence = 220;

          if (dist < maxInfluence) {
            const force = (1 - dist / maxInfluence) * 0.22;
            
            // Vector pointing to mouse
            const pullX = (dx / dist) * force;
            const pullY = (dy / dist) * force;

            // Perpendicular swirl vector (clockwise orbital rotation)
            const swirlX = (-dy / dist) * force * 0.9;
            const swirlY = (dx / dist) * force * 0.9;

            p.vx += pullX + swirlX;
            p.vy += pullY + swirlY;
          }
        }

        // Speed limit clamp
        const velocity = Math.hypot(p.vx, p.vy);
        const maxSpeed = 3.2 * speed;
        if (velocity > maxSpeed) {
          p.vx = (p.vx / velocity) * maxSpeed;
          p.vy = (p.vy / velocity) * maxSpeed;
        }

        // Record coordinates in history for trail rendering
        p.history.push({ x: p.x, y: p.y });
        if (p.history.length > p.maxHistory) {
          p.history.shift();
        }

        // Apply velocities
        p.x += p.vx;
        p.y += p.vy;

        // Soft screen edge wraparound (like computational wind flow)
        if (p.x < -10) {
          p.x = width + 10;
          p.history = [];
        } else if (p.x > width + 10) {
          p.x = -10;
          p.history = [];
        }

        if (p.y < -10) {
          p.y = height + 10;
          p.history = [];
        } else if (p.y > height + 10) {
          p.y = -10;
          p.history = [];
        }
      }

      // 3. Draw Connecting Network Lines between adjacent nodes
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist < linkDistance) {
            const alpha = 0.16 * (1 - dist / linkDistance);
            ctx.strokeStyle = `rgba(${color}, ${alpha})`;
            ctx.lineWidth = 0.55;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // 4. Draw Cinematic Glowing History Trails
      for (const p of particles) {
        if (p.history.length > 1) {
          ctx.beginPath();
          ctx.moveTo(p.history[0].x, p.history[0].y);
          for (let k = 1; k < p.history.length; k++) {
            ctx.lineTo(p.history[k].x, p.history[k].y);
          }
          ctx.strokeStyle = `rgba(${color}, 0.13)`;
          ctx.lineWidth = 1.0;
          ctx.stroke();
        }

        // Draw particle head
        ctx.fillStyle = `rgba(${color}, 0.7)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    resize();
    seed();
    draw();

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleResize = () => {
      resize();
      seed();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, [count, linkDistance, color, speed]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
