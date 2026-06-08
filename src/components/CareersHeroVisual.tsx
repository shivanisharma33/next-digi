"use client";

import { useEffect, useRef } from 'react';

/* â”€â”€â”€ Careers Hero Visual â”€â”€â”€ 
   A constellation talent-network animation:
   - Glowing nodes that pulse and breathe
   - Dynamic connection lines between nearby nodes
   - Rising spark particles (career growth metaphor)
   - Mouse-reactive parallax depth
   - Warm amber/gold brand palette
*/

interface Node {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  radius: number;
  pulsePhase: number;
  pulseSpeed: number;
  brightness: number;
  isGold: boolean;
}

interface Spark {
  x: number;
  y: number;
  vy: number;
  vx: number;
  life: number;
  maxLife: number;
  size: number;
  isGold: boolean;
}

export default function CareersHeroVisual() {
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
    let time = 0;
    let nodes: Node[] = [];
    let sparks: Spark[] = [];
    const mouse = { x: -9999, y: -9999 };

    const GOLD = { r: 245, g: 197, b: 24 };
    const WHITE = { r: 255, g: 255, b: 255 };
    const NODE_COUNT = 35;
    const SPARK_COUNT = 50;
    const LINK_DISTANCE = 180;
    const MOUSE_RADIUS = 250;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const seedNodes = () => {
      nodes = [];
      for (let i = 0; i < NODE_COUNT; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        nodes.push({
          x,
          y,
          baseX: x,
          baseY: y,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          radius: 1.5 + Math.random() * 2.5,
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.02 + Math.random() * 0.03,
          brightness: 0.4 + Math.random() * 0.6,
          isGold: Math.random() < 0.55,
        });
      }
    };

    const seedSparks = () => {
      sparks = [];
      for (let i = 0; i < SPARK_COUNT; i++) {
        sparks.push(createSpark());
      }
    };

    const createSpark = (): Spark => ({
      x: Math.random() * width,
      y: height + Math.random() * 40,
      vy: -(0.4 + Math.random() * 1.2),
      vx: (Math.random() - 0.5) * 0.4,
      life: 0,
      maxLife: 120 + Math.random() * 200,
      size: 0.8 + Math.random() * 1.5,
      isGold: Math.random() < 0.7,
    });

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      time += 1;

      // Mouse local position
      const rect = canvas.getBoundingClientRect();
      const mx = mouse.x - rect.left;
      const my = mouse.y - rect.top;
      const mouseInside = mouse.x >= rect.left && mouse.x <= rect.right &&
                          mouse.y >= rect.top && mouse.y <= rect.bottom;

      // â”€â”€â”€ Update nodes â”€â”€â”€
      for (const node of nodes) {
        // Gentle drift
        node.x += node.vx;
        node.y += node.vy;

        // Soft return to base with elastic spring
        node.vx += (node.baseX - node.x) * 0.0008;
        node.vy += (node.baseY - node.y) * 0.0008;

        // Add flow field organic movement
        const flowAngle = Math.sin(node.x * 0.003 + time * 0.008) * Math.cos(node.y * 0.003 + time * 0.006) * Math.PI;
        node.vx += Math.cos(flowAngle) * 0.012;
        node.vy += Math.sin(flowAngle) * 0.012;

        // Damping
        node.vx *= 0.985;
        node.vy *= 0.985;

        // Mouse attraction with orbit
        if (mouseInside) {
          const dx = mx - node.x;
          const dy = my - node.y;
          const dist = Math.hypot(dx, dy);
          if (dist < MOUSE_RADIUS && dist > 1) {
            const force = (1 - dist / MOUSE_RADIUS) * 0.15;
            // Pull toward mouse
            node.vx += (dx / dist) * force * 0.5;
            node.vy += (dy / dist) * force * 0.5;
            // Orbital swirl
            node.vx += (-dy / dist) * force * 0.35;
            node.vy += (dx / dist) * force * 0.35;
          }
        }

        // Wrap edges softly
        if (node.x < -20) { node.x = width + 20; node.baseX = node.x; }
        if (node.x > width + 20) { node.x = -20; node.baseX = node.x; }
        if (node.y < -20) { node.y = height + 20; node.baseY = node.y; }
        if (node.y > height + 20) { node.y = -20; node.baseY = node.y; }

        // Update pulse
        node.pulsePhase += node.pulseSpeed;
      }

      // â”€â”€â”€ Draw connection lines â”€â”€â”€
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist < LINK_DISTANCE) {
            const alpha = (1 - dist / LINK_DISTANCE);
            const bothGold = nodes[i].isGold && nodes[j].isGold;

            // Draw gradient line
            const gradient = ctx.createLinearGradient(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
            if (bothGold) {
              gradient.addColorStop(0, `rgba(${GOLD.r},${GOLD.g},${GOLD.b},${alpha * 0.25})`);
              gradient.addColorStop(1, `rgba(${GOLD.r},${GOLD.g},${GOLD.b},${alpha * 0.25})`);
            } else {
              gradient.addColorStop(0, `rgba(${GOLD.r},${GOLD.g},${GOLD.b},${alpha * 0.15})`);
              gradient.addColorStop(1, `rgba(${WHITE.r},${WHITE.g},${WHITE.b},${alpha * 0.08})`);
            }

            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = gradient;
            ctx.lineWidth = alpha * 1.2;
            ctx.stroke();
          }
        }
      }

      // â”€â”€â”€ Draw mouse connection lines to nearby nodes â”€â”€â”€
      if (mouseInside) {
        for (const node of nodes) {
          const dist = Math.hypot(mx - node.x, my - node.y);
          if (dist < MOUSE_RADIUS) {
            const alpha = (1 - dist / MOUSE_RADIUS) * 0.3;
            ctx.beginPath();
            ctx.moveTo(mx, my);
            ctx.lineTo(node.x, node.y);
            ctx.strokeStyle = `rgba(${GOLD.r},${GOLD.g},${GOLD.b},${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      // â”€â”€â”€ Draw nodes â”€â”€â”€
      for (const node of nodes) {
        const pulse = Math.sin(node.pulsePhase) * 0.5 + 0.5; // 0â†’1
        const currentRadius = node.radius * (1 + pulse * 0.5);
        const col = node.isGold ? GOLD : WHITE;
        const alpha = node.brightness * (0.6 + pulse * 0.4);

        // Outer glow
        const glowRadius = currentRadius * 4;
        const glow = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, glowRadius);
        glow.addColorStop(0, `rgba(${col.r},${col.g},${col.b},${alpha * 0.35})`);
        glow.addColorStop(0.5, `rgba(${col.r},${col.g},${col.b},${alpha * 0.08})`);
        glow.addColorStop(1, `rgba(${col.r},${col.g},${col.b},0)`);
        ctx.beginPath();
        ctx.arc(node.x, node.y, glowRadius, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(node.x, node.y, currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${col.r},${col.g},${col.b},${alpha})`;
        ctx.fill();

        // Bright center
        ctx.beginPath();
        ctx.arc(node.x, node.y, currentRadius * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha * 0.8})`;
        ctx.fill();
      }

      // â”€â”€â”€ Update & draw sparks â”€â”€â”€
      for (let i = 0; i < sparks.length; i++) {
        const s = sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vx += Math.sin(time * 0.01 + i) * 0.008; // Gentle horizontal sway
        s.life++;

        // Fade in/out envelope
        const lifeRatio = s.life / s.maxLife;
        let alpha: number;
        if (lifeRatio < 0.15) {
          alpha = lifeRatio / 0.15;
        } else if (lifeRatio > 0.7) {
          alpha = (1 - lifeRatio) / 0.3;
        } else {
          alpha = 1;
        }
        alpha *= 0.6;

        const col = s.isGold ? GOLD : WHITE;

        // Spark glow
        const glowR = s.size * 3;
        const glow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, glowR);
        glow.addColorStop(0, `rgba(${col.r},${col.g},${col.b},${alpha * 0.5})`);
        glow.addColorStop(1, `rgba(${col.r},${col.g},${col.b},0)`);
        ctx.beginPath();
        ctx.arc(s.x, s.y, glowR, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        // Spark core
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * alpha, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${col.r},${col.g},${col.b},${alpha})`;
        ctx.fill();

        // Respawn if dead or off screen
        if (s.life >= s.maxLife || s.y < -20) {
          sparks[i] = createSpark();
        }
      }

      // â”€â”€â”€ Mouse cursor glow â”€â”€â”€
      if (mouseInside) {
        const cursorGlow = ctx.createRadialGradient(mx, my, 0, mx, my, 80);
        cursorGlow.addColorStop(0, `rgba(${GOLD.r},${GOLD.g},${GOLD.b},0.06)`);
        cursorGlow.addColorStop(1, `rgba(${GOLD.r},${GOLD.g},${GOLD.b},0)`);
        ctx.beginPath();
        ctx.arc(mx, my, 80, 0, Math.PI * 2);
        ctx.fillStyle = cursorGlow;
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    resize();
    seedNodes();
    seedSparks();
    draw();

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleResize = () => {
      resize();
      seedNodes();
      seedSparks();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
