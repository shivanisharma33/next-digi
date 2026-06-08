"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { dgxxLogo } from "./dgxxLogo";

/** Tiny helper: CSS custom property `--d` (animation delay) typed for React. */
const delay = (seconds: number): CSSProperties =>
  ({ ["--d" as never]: `${seconds}s` } as CSSProperties);

type CubePos = { x: number; y: number; label: string; d: number };

const STD_CUBES: CubePos[] = [
  { x: 580, y: 130, label: "EDGE COMPUTE", d: 0.05 },
  { x: 800, y: 175, label: "AI WORKLOAD", d: 0.11 },
  { x: 870, y: 335, label: "HIGH DENSITY", d: 0.17 },
  { x: 260, y: 365, label: "MODULAR POD", d: 0.23 },
  { x: 1080, y: 405, label: "GPU CLUSTER", d: 0.29 },
  { x: 450, y: 425, label: "SCALABLE", d: 0.35 },
  { x: 170, y: 530, label: "EDGE NODE", d: 0.41 },
  { x: 1010, y: 565, label: "LIQUID COOLED", d: 0.47 },
  { x: 910, y: 685, label: "ENTERPRISE", d: 0.53 },
  { x: 340, y: 700, label: "MONITORING", d: 0.59 },
  { x: 810, y: 735, label: "POWER GRID", d: 0.65 },
  { x: 625, y: 770, label: "COLOCATION", d: 0.71 },
  { x: 950, y: 815, label: "FIBER NETWORK", d: 0.77 },
  { x: 740, y: 880, label: "STORAGE", d: 0.83 },
];

const GHOST_CUBES: CubePos[] = [
  { x: 415, y: 240, label: "EXPANSION SLOT", d: 0.4 },
  { x: 620, y: 555, label: "FUTURE CAPACITY", d: 0.55 },
  { x: 265, y: 580, label: "RESERVED", d: 0.7 },
];

const HERO_GLOWS: { cx: number; cy: number; d: number }[] = [
  { cx: 583, cy: 239, d: 1.3 },
  { cx: 886, cy: 547, d: 1.55 },
  { cx: 348, cy: 877, d: 1.8 },
];

export default function DGXXCubeAnimation() {
  const stageRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const svg = svgRef.current;
    const tooltip = tooltipRef.current;
    if (!stage || !svg || !tooltip) return;

    // ---- Tooltip hover ----
    const hoverables = stage.querySelectorAll<SVGElement>(
      ".c-anim, .c-ghost, .hero-top, .hero-right, .hero-bottom"
    );

    const onEnter = (e: Event) => {
      const el = e.currentTarget as SVGElement;
      const label = el.getAttribute("data-label");
      if (label) {
        tooltip.textContent = label;
        tooltip.classList.add("show");
      }
    };
    const onMove = (e: Event) => {
      const me = e as MouseEvent;
      const rect = stage.getBoundingClientRect();
      tooltip.style.left = `${me.clientX - rect.left}px`;
      tooltip.style.top = `${me.clientY - rect.top - 50}px`;
      tooltip.style.transform = "translateX(-50%)";
    };
    const onLeave = () => tooltip.classList.remove("show");

    // Attach after the intro animation finishes (matches original 2.5s delay).
    const attachTimer = window.setTimeout(() => {
      hoverables.forEach((el) => {
        el.addEventListener("mouseenter", onEnter);
        el.addEventListener("mousemove", onMove);
        el.addEventListener("mouseleave", onLeave);
      });
    }, 2500);

    // ---- Mouse-driven parallax tilt ----
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let raf = 0;

    const onStageMove = (e: MouseEvent) => {
      const rect = stage.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      targetX = ((e.clientY - cy) / rect.height) * -3;
      targetY = ((e.clientX - cx) / rect.width) * 3;
    };
    const onStageLeave = () => {
      targetX = 0;
      targetY = 0;
    };
    stage.addEventListener("mousemove", onStageMove);
    stage.addEventListener("mouseleave", onStageLeave);

    const tick = () => {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;
      svg.style.transform = `rotateX(${currentX}deg) rotateY(${currentY}deg)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      window.clearTimeout(attachTimer);
      cancelAnimationFrame(raf);
      stage.removeEventListener("mousemove", onStageMove);
      stage.removeEventListener("mouseleave", onStageLeave);
      hoverables.forEach((el) => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mousemove", onMove);
        el.removeEventListener("mouseleave", onLeave);
      });
    };
  }, []);

  return (
    <div className="dgxx-root">
      <style>{CSS}</style>

      <div className="stage" ref={stageRef}>
        <div className="grid-bg" />

        <svg
          className="cube-svg"
          ref={svgRef}
          viewBox="0 0 1297 1014"
          preserveAspectRatio="xMidYMid meet"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="glowGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFC107" stopOpacity="0.55" />
              <stop offset="40%" stopColor="#FFC107" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#FFC107" stopOpacity="0" />
            </radialGradient>

            <g id="cubeStd">
              <polygon
                points="0,-124 124,-62 0,0 -124,-62"
                fill="#1a1a1a"
                stroke="#FFC107"
                strokeWidth="2"
              />
              <polygon
                points="0,0 124,-62 124,62 0,124"
                fill="#000000"
                stroke="#FFC107"
                strokeWidth="2"
              />
              <polygon
                points="0,0 -124,-62 -124,62 0,124"
                fill="#0d0d0d"
                stroke="#FFC107"
                strokeWidth="2"
              />
            </g>

            <g id="cubeHero">
              <polygon
                points="0,-124 124,-62 0,0 -124,-62"
                fill="#FFC107"
                stroke="#FFC107"
                strokeWidth="2"
              />
              <polygon
                points="0,0 124,-62 124,62 0,124"
                fill="#000000"
                stroke="#FFC107"
                strokeWidth="2"
              />
              <polygon
                points="0,0 -124,-62 -124,62 0,124"
                fill="#1a1a1a"
                stroke="#FFC107"
                strokeWidth="2"
              />
            </g>

            <g id="cubeGhost">
              <polygon
                points="0,-124 124,-62 0,0 -124,-62"
                fill="none"
                stroke="#FFC107"
                strokeWidth="2"
                strokeDasharray="8,8"
                opacity="0.6"
              />
              <polygon
                points="0,0 124,-62 124,62 0,124"
                fill="none"
                stroke="#FFC107"
                strokeWidth="2"
                strokeDasharray="8,8"
                opacity="0.6"
              />
              <polygon
                points="0,0 -124,-62 -124,62 0,124"
                fill="none"
                stroke="#FFC107"
                strokeWidth="2"
                strokeDasharray="8,8"
                opacity="0.6"
              />
            </g>
          </defs>

          <g className="cluster">
            {HERO_GLOWS.map((g, i) => (
              <ellipse
                key={`glow-${i}`}
                className="hero-glow"
                cx={g.cx}
                cy={g.cy}
                rx={200}
                ry={170}
                fill="url(#glowGrad)"
                style={delay(g.d)}
              />
            ))}

            {STD_CUBES.map((c, i) => (
              <use
                key={`std-${i}`}
                href="#cubeStd"
                x={c.x}
                y={c.y}
                className="c-anim"
                data-label={c.label}
                style={delay(c.d)}
              />
            ))}

            {GHOST_CUBES.map((c, i) => (
              <use
                key={`ghost-${i}`}
                href="#cubeGhost"
                x={c.x}
                y={c.y}
                className="c-ghost"
                data-label={c.label}
                style={delay(c.d)}
              />
            ))}

            <g
              className="hero-right"
              data-label="40 MW AI DATA HALL"
              style={delay(1.55)}
            >
              <use href="#cubeHero" x={810} y={510} />
            </g>

            <g
              className="hero-top"
              data-label="DGXX CORE PLATFORM"
              style={delay(1.3)}
            >
              <g transform="translate(595,305)">
                <polygon
                  points="0,-124 124,-62 0,0 -124,-62"
                  fill="#FFC107"
                  stroke="#FFC107"
                  strokeWidth="2"
                />
                <polygon
                  points="0,0 124,-62 124,62 0,124"
                  fill="#000000"
                  stroke="#FFC107"
                  strokeWidth="2"
                />
                <polygon
                  points="0,0 -124,-62 -124,62 0,124"
                  fill="#1a1a1a"
                  stroke="#FFC107"
                  strokeWidth="2"
                />

                <g className="dgxx-logo" style={delay(1.3)}>
                  <g transform="translate(-109,-47)">
                    <image
                      href={dgxxLogo}
                      x={0}
                      y={0}
                      width={95}
                      height={95}
                      transform="skewY(28.5)"
                      preserveAspectRatio="xMidYMid meet"
                    />
                  </g>
                </g>
              </g>
            </g>

            <g
              className="hero-bottom"
              data-label="5 MW MODULAR POD"
              style={delay(1.8)}
            >
              <use href="#cubeHero" x={420} y={815} />
            </g>
          </g>
        </svg>

        <div className="tooltip" ref={tooltipRef} />
      </div>
    </div>
  );
}

/* ---------- Scoped styles (mirrors the original HTML/CSS) ---------- */
const CSS = `
.dgxx-root {
  position: absolute;
  inset: 0;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}
.dgxx-root .stage {
  position: relative;
  width: 100%;
  height: 100%;
  aspect-ratio: 1297 / 1014;
  max-width: 1300px;
  max-height: 100%;
  background: transparent;
  overflow: hidden;
  perspective: 1500px;
}
.dgxx-root .grid-bg {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255,193,7,0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,193,7,0.04) 1px, transparent 1px);
  background-size: 60px 60px;
  opacity: 0.5;
  pointer-events: none;
}
.dgxx-root .cube-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transform-style: preserve-3d;
}

@keyframes dgxx-cubeIn {
  0%   { opacity: 0; transform: translateY(-40px) scale(0.5); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes dgxx-ghostFade { 0%{opacity:0;} 100%{opacity:1;} }
@keyframes dgxx-ghostPulse { 0%,100%{opacity:0.45;} 50%{opacity:0.9;} }
@keyframes dgxx-float { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-4px);} }

@keyframes dgxx-heroTopPop {
  0%   { opacity: 0; transform: translate(0,0) scale(0.5); }
  65%  { opacity: 1; transform: translate(-15px,-75px) scale(1.05); }
  100% { opacity: 1; transform: translate(-12px,-66px) scale(1.03); }
}
@keyframes dgxx-heroTopFloat {
  0%,100% { transform: translate(-12px,-66px) scale(1.03); }
  50%     { transform: translate(-12px,-76px) scale(1.03); }
}
@keyframes dgxx-heroRightPop {
  0%   { opacity: 0; transform: translate(0,0) scale(0.5); }
  65%  { opacity: 1; transform: translate(85px,42px) scale(1.05); }
  100% { opacity: 1; transform: translate(76px,37px) scale(1.03); }
}
@keyframes dgxx-heroRightFloat {
  0%,100% { transform: translate(76px,37px) scale(1.03); }
  50%     { transform: translate(84px,39px) scale(1.03); }
}
@keyframes dgxx-heroBottomPop {
  0%   { opacity: 0; transform: translate(0,0) scale(0.5); }
  65%  { opacity: 1; transform: translate(-80px,70px) scale(1.05); }
  100% { opacity: 1; transform: translate(-72px,62px) scale(1.03); }
}
@keyframes dgxx-heroBottomFloat {
  0%,100% { transform: translate(-72px,62px) scale(1.03); }
  50%     { transform: translate(-80px,68px) scale(1.03); }
}
@keyframes dgxx-logoFadeIn { 0%,40%{opacity:0;} 100%{opacity:1;} }
@keyframes dgxx-heroGlowPulse {
  0%,100% { opacity: 0.35; transform: scale(1); }
  50%     { opacity: 0.7;  transform: scale(1.08); }
}

.dgxx-root .c-anim {
  opacity: 0;
  transform-origin: center;
  transform-box: fill-box;
  animation:
    dgxx-cubeIn 0.9s cubic-bezier(0.34,1.56,0.64,1) var(--d) forwards,
    dgxx-float 5s ease-in-out calc(var(--d) + 2.5s) infinite;
}
.dgxx-root .c-ghost {
  opacity: 0;
  transform-origin: center;
  transform-box: fill-box;
  animation:
    dgxx-ghostFade 0.7s ease var(--d) forwards,
    dgxx-ghostPulse 4s ease-in-out calc(var(--d) + 1s) infinite;
}
.dgxx-root .hero-top {
  opacity: 0;
  transform-origin: center;
  transform-box: fill-box;
  animation:
    dgxx-heroTopPop 1.2s cubic-bezier(0.34,1.56,0.64,1) var(--d) forwards,
    dgxx-heroTopFloat 3.5s ease-in-out calc(var(--d) + 1.3s) infinite;
}
.dgxx-root .hero-right {
  opacity: 0;
  transform-origin: center;
  transform-box: fill-box;
  animation:
    dgxx-heroRightPop 1.2s cubic-bezier(0.34,1.56,0.64,1) var(--d) forwards,
    dgxx-heroRightFloat 3.8s ease-in-out calc(var(--d) + 1.3s) infinite;
}
.dgxx-root .hero-bottom {
  opacity: 0;
  transform-origin: center;
  transform-box: fill-box;
  animation:
    dgxx-heroBottomPop 1.2s cubic-bezier(0.34,1.56,0.64,1) var(--d) forwards,
    dgxx-heroBottomFloat 4s ease-in-out calc(var(--d) + 1.3s) infinite;
}
.dgxx-root .dgxx-logo {
  opacity: 0;
  animation: dgxx-logoFadeIn 1.4s ease calc(var(--d) + 0.6s) forwards;
}
.dgxx-root .hero-glow {
  opacity: 0;
  transform-origin: center;
  transform-box: fill-box;
  animation:
    dgxx-ghostFade 1s ease calc(var(--d) + 0.4s) forwards,
    dgxx-heroGlowPulse 3s ease-in-out calc(var(--d) + 1.5s) infinite;
}

/* Tooltip (was referenced by the original JS but missing in the markup). */
.dgxx-root .tooltip {
  position: absolute;
  pointer-events: none;
  padding: 6px 10px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: #FFC107;
  background: rgba(10,10,10,0.9);
  border: 1px solid rgba(255,193,7,0.4);
  border-radius: 4px;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.15s ease;
  z-index: 10;
}
.dgxx-root .tooltip.show { opacity: 1; }
`;
