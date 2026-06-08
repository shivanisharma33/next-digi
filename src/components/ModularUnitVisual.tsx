"use client";

import { useEffect, useRef } from "react";
import "./ModularUnitVisual.css";

interface Orbit {
  radiusMul: number;
  speed: number;
  phase: number;
  dotSize: number;
  dotOpacity: number;
  arcStart: number;
  arcLen: number;
  arcOpacity: number;
}

interface FreeParticle {
  rMul: number;
  angle: number;
  speed: number;
  size: number;
  opacity: number;
  twinkleSpeed: number;
  twinklePhase: number;
}

const ORBITS: Orbit[] = [
  { radiusMul: 1.00, speed: 0.18, phase: 0.0, dotSize: 2.4, dotOpacity: 0.55, arcStart: 1.05, arcLen: 0.55, arcOpacity: 0.55 },
  { radiusMul: 1.16, speed: -0.13, phase: 1.6, dotSize: 4.2, dotOpacity: 0.95, arcStart: 3.85, arcLen: 0.45, arcOpacity: 0.45 },
  { radiusMul: 1.32, speed: 0.09, phase: 3.2, dotSize: 3.0, dotOpacity: 0.65, arcStart: 0.0, arcLen: 0.0, arcOpacity: 0 },
  { radiusMul: 1.50, speed: -0.07, phase: 4.8, dotSize: 2.6, dotOpacity: 0.45, arcStart: 0.0, arcLen: 0.0, arcOpacity: 0 },
];

const FREE_PARTICLES: FreeParticle[] = [
  { rMul: 0.18, angle: 0.05, speed: 0.0, size: 1.6, opacity: 0.45, twinkleSpeed: 1.4, twinklePhase: 0.1 },
  { rMul: 0.32, angle: 1.6, speed: 0.0, size: 2.0, opacity: 0.45, twinkleSpeed: 1.1, twinklePhase: 1.2 },
  { rMul: 0.40, angle: 4.1, speed: 0.0, size: 1.5, opacity: 0.35, twinkleSpeed: 1.7, twinklePhase: 2.3 },
  { rMul: 1.65, angle: 1.2, speed: 0.02, size: 2.4, opacity: 0.55, twinkleSpeed: 1.3, twinklePhase: 0.6 },
  { rMul: 1.85, angle: 2.5, speed: -0.03, size: 1.8, opacity: 0.5, twinkleSpeed: 1.0, twinklePhase: 1.8 },
  { rMul: 2.05, angle: 0.7, speed: 0.025, size: 2.0, opacity: 0.6, twinkleSpeed: 1.5, twinklePhase: 3.0 },
  { rMul: 1.95, angle: 4.2, speed: -0.02, size: 1.4, opacity: 0.4, twinkleSpeed: 1.6, twinklePhase: 4.0 },
  { rMul: 2.20, angle: 5.7, speed: 0.018, size: 1.6, opacity: 0.5, twinkleSpeed: 1.2, twinklePhase: 2.0 },
];

const ModularUnitVisual = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isMobile = window.innerWidth < 768;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let rafId = 0;
    let disposed = false;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (isMobile) draw();
    };

    resize();
    window.addEventListener("resize", resize);

    const start = performance.now();

    const draw = () => {
      if (disposed) return;
      const t = (performance.now() - start) / 1000;

      ctx.clearRect(0, 0, width, height);

      const cx = width * 0.5;
      const cy = height * 0.52;
      const baseR = Math.min(width, height) * 0.22;

      const haloGrad = ctx.createRadialGradient(cx, cy, baseR * 0.95, cx, cy, baseR * 2.0);
      haloGrad.addColorStop(0, "rgba(255, 196, 0, 0.10)");
      haloGrad.addColorStop(0.5, "rgba(255, 196, 0, 0.035)");
      haloGrad.addColorStop(1, "rgba(255, 196, 0, 0)");
      ctx.fillStyle = haloGrad;
      ctx.fillRect(0, 0, width, height);

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, baseR, 0, Math.PI * 2);
      ctx.fillStyle = "#000000";
      ctx.shadowColor = "rgba(255, 196, 0, 0.45)";
      ctx.shadowBlur = 28;
      ctx.fill();
      ctx.restore();

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, baseR, 0, Math.PI * 2);
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(255, 196, 0, 0.18)";
      ctx.stroke();
      ctx.restore();

      ORBITS.forEach((o) => {
        const r = baseR * o.radiusMul;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.lineWidth = 1;
        ctx.strokeStyle = `rgba(255, 196, 0, ${0.10 + o.radiusMul * 0.04})`;
        ctx.stroke();

        if (o.arcLen > 0) {
          ctx.beginPath();
          ctx.arc(cx, cy, r, o.arcStart, o.arcStart + o.arcLen);
          ctx.lineWidth = 2;
          ctx.strokeStyle = `rgba(255, 196, 0, ${o.arcOpacity})`;
          ctx.lineCap = "round";
          ctx.shadowColor = "rgba(255, 196, 0, 0.7)";
          ctx.shadowBlur = 10;
          ctx.stroke();
          ctx.shadowBlur = 0;
        }
      });

      const innerPoints = [
        { angleSpeed: 0.0, rMul: 0.04, baseAngle: 0.0, size: 2.6, opacity: 0.45 },
        { angleSpeed: 0.0, rMul: 0.30, baseAngle: 0.6, size: 2.0, opacity: 0.4 },
        { angleSpeed: 0.0, rMul: 0.45, baseAngle: 3.1, size: 2.4, opacity: 0.5 },
        { angleSpeed: 0.0, rMul: 0.40, baseAngle: 5.0, size: 1.8, opacity: 0.35 },
      ];
      innerPoints.forEach((p, i) => {
        const r = baseR * p.rMul;
        const a = p.baseAngle;
        const x = cx + Math.cos(a) * r;
        const y = cy + Math.sin(a) * r;
        const twinkle = 0.7 + 0.3 * Math.sin(t * 1.4 + i * 1.3);
        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 196, 0, ${p.opacity * twinkle})`;
        ctx.shadowColor = "rgba(255, 196, 0, 0.6)";
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      ORBITS.forEach((o) => {
        const r = baseR * o.radiusMul;
        const angle = o.phase + t * o.speed * Math.PI * 2;
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;

        const glowR = o.dotSize * 4;
        const grad = ctx.createRadialGradient(x, y, 0, x, y, glowR);
        grad.addColorStop(0, `rgba(255, 196, 0, ${o.dotOpacity * 0.5})`);
        grad.addColorStop(1, "rgba(255, 196, 0, 0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, glowR, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x, y, o.dotSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 196, 0, ${o.dotOpacity})`;
        ctx.shadowColor = "rgba(255, 196, 0, 0.9)";
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      FREE_PARTICLES.forEach((p) => {
        const r = baseR * p.rMul;
        const a = p.angle + t * p.speed * Math.PI * 2;
        const x = cx + Math.cos(a) * r;
        const y = cy + Math.sin(a) * r;
        const twinkle = 0.55 + 0.45 * Math.sin(t * p.twinkleSpeed + p.twinklePhase);
        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 196, 0, ${p.opacity * twinkle})`;
        ctx.shadowColor = "rgba(255, 196, 0, 0.5)";
        ctx.shadowBlur = 5;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      if (isMobile) return;
      rafId = requestAnimationFrame(draw);
    };

    rafId = requestAnimationFrame(draw);

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div ref={containerRef} className="muv">
      <canvas ref={canvasRef} className="muv-canvas" />

      <div className="muv-stats">
        <div>
          <div className="muv-stat-label">Output</div>
          <div className="muv-stat-value">1.25MW</div>
        </div>
        <div>
          <div className="muv-stat-label">Efficiency</div>
          <div className="muv-stat-value">98.4%</div>
        </div>
        <div>
          <div className="muv-stat-label">Thermal</div>
          <div className="muv-stat-value">24Â°C</div>
        </div>
      </div>

      <div className="muv-meta">
        <div className="muv-meta-bar" />
        <div className="muv-meta-text">
          <div className="muv-meta-eyebrow">UNIT_DEPLOYMENT</div>
          <div className="muv-meta-id">USDC_MODULAR_01</div>
        </div>
      </div>
    </div>
  );
};

export default ModularUnitVisual;
