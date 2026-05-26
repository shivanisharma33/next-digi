import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import infraStackSvg from "../assets/infraStack.svg?raw";
import "./InfraStackHero.css";

type LayerId = 1 | 2 | 3 | 4;

const LAYERS: { id: LayerId; num: string; title: string; desc: string }[] = [
  {
    id: 4,
    num: "04",
    title: "NeoCloudz AI Cloud Platform",
    desc: "A fully owned DigiPower X platform delivering scalable GPU cloud services for the next generation of AI demand.",
  },
  {
    id: 3,
    num: "03",
    title: "GPU Compute Layer",
    desc: "High-density GPU clusters with in-row liquid cooling, supporting AI training, inference, and enterprise workloads.",
  },
  {
    id: 2,
    num: "02",
    title: "Tier III Data Center Layer",
    desc: "Modular, scalable facilities with redundant cooling, power, and fiber — built for continuous high-performance workloads.",
  },
  {
    id: 1,
    num: "01",
    title: "Owned Energy Infrastructure",
    desc: "Solar farms, wind turbines, SMR reactors, substations, and grid-connected assets designed for high-demand AI compute.",
  },
];

const CYCLE_MS = 7000;
const CMAP: Record<LayerId, string[]> = {
  1: [],
  2: ["cn1a", "cn1b", "cn1c"],
  3: ["cn2a", "cn2b", "cn2c"],
  4: ["cn3a", "cn3b", "cn3c"],
};
const ALL_CONNECTORS = [
  "cn1a",
  "cn1b",
  "cn1c",
  "cn2a",
  "cn2b",
  "cn2c",
  "cn3a",
  "cn3b",
  "cn3c",
];
const LAYER_TOP: Record<LayerId, string> = {
  1: "80%",
  2: "62%",
  3: "44%",
  4: "18%",
};
// SVG viewBox is 820x860; platform cy values per layer
const CY: Record<LayerId, number> = { 4: 100, 3: 248, 2: 404, 1: 562 };
const SVG_VH = 860;

export default function InfraStackHero() {
  const [active, setActive] = useState<LayerId>(1);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const pointsRef = useRef<HTMLDivElement | null>(null);
  const pxFieldRef = useRef<HTMLDivElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);
  const svgHostRef = useRef<HTMLDivElement | null>(null);
  const pointRefs = useRef<Record<LayerId, HTMLDivElement | null>>({
    1: null,
    2: null,
    3: null,
    4: null,
  });

  // mutate SVG group classes + glow + connectors whenever active layer changes
  useEffect(() => {
    const host = svgHostRef.current;
    if (!host) return;

    ([1, 2, 3, 4] as LayerId[]).forEach((k) => {
      const g = host.querySelector<SVGGElement>(`#layer${k}`);
      if (!g) return;
      g.classList.toggle("active", k === active);
      g.classList.toggle("inactive", k !== active);
    });

    ALL_CONNECTORS.forEach((id) => {
      host.querySelector<SVGElement>(`#${id}`)?.classList.remove("flowing");
    });
    (CMAP[active] || []).forEach((id) => {
      host.querySelector<SVGElement>(`#${id}`)?.classList.add("flowing");
    });

    const beam = host.querySelector<SVGElement>("#lightBeam");
    if (beam) {
      const op =
        active === 1
          ? "0.65"
          : active === 2
            ? "0.4"
            : active === 3
              ? "0.22"
              : "0.1";
      (beam as unknown as HTMLElement).style.opacity = op;
    }

    if (glowRef.current) glowRef.current.style.top = LAYER_TOP[active];
  }, [active]);

  // auto-cycle + pause on tab hidden
  useEffect(() => {
    let timer: number | null = null;
    const tick = () => {
      setActive((c) => (c >= 4 ? 1 : ((c + 1) as LayerId)));
    };
    const start = () => {
      stop();
      timer = window.setInterval(tick, CYCLE_MS);
    };
    const stop = () => {
      if (timer !== null) {
        window.clearInterval(timer);
        timer = null;
      }
    };
    const onVis = () => (document.hidden ? stop() : start());

    start();
    document.addEventListener("visibilitychange", onVis);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  // particle field
  useEffect(() => {
    let id: number | null = null;
    const spawn = () => {
      if (document.hidden) return;
      const field = pxFieldRef.current;
      if (!field) return;
      const el = document.createElement("div");
      el.className = "ish-px";
      const s = 3 + Math.random() * 5;
      const dur = 4.5 + Math.random() * 4.5;
      el.style.cssText =
        `width:${s}px;height:${s}px;` +
        `left:${14 + Math.random() * 72}%;` +
        `top:${13 + Math.random() * 68}%;` +
        `animation:ish-pxRise ${dur}s ease-in-out forwards`;
      field.appendChild(el);
      window.setTimeout(() => el.remove(), dur * 1000 + 200);
    };
    id = window.setInterval(spawn, 660);
    return () => {
      if (id !== null) window.clearInterval(id);
    };
  }, []);

  // position labels by mapping SVG cy → screen px
  useLayoutEffect(() => {
    const stageEl = stageRef.current;
    const pointsEl = pointsRef.current;
    if (!stageEl || !pointsEl) return;

    const positionLabels = () => {
      const sr = stageEl.getBoundingClientRect();
      if (sr.height === 0) return;
      const scale = sr.height / SVG_VH;
      ([1, 2, 3, 4] as LayerId[]).forEach((n) => {
        const ptEl = pointRefs.current[n];
        if (!ptEl) return;
        if (window.innerWidth <= 1060) {
          ptEl.style.top = '';
          ptEl.style.transform = '';
        } else {
          const cyPx = CY[n] * scale;
          ptEl.style.top = `${cyPx}px`;
          ptEl.style.transform = "translateY(-50%)";
        }
      });
    };

    positionLabels();
    const raf = requestAnimationFrame(positionLabels);
    const t1 = window.setTimeout(positionLabels, 200);
    const t2 = window.setTimeout(positionLabels, 800);

    const ro = new ResizeObserver(positionLabels);
    ro.observe(stageEl);
    ro.observe(pointsEl);

    window.addEventListener("resize", positionLabels);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(positionLabels).catch(() => { });
    }

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      ro.disconnect();
      window.removeEventListener("resize", positionLabels);
    };
  }, []);

  // restart pbar animation when active changes
  useEffect(() => {
    const el =
      pointRefs.current[active]?.querySelector<HTMLSpanElement>(
        ".ish-pbar span",
      );
    if (!el) return;
    el.style.animation = "none";
    // force reflow
    void el.offsetWidth;
    el.style.animation = "";
  }, [active]);

  return (
    <section id="infra-stack-hero">
      <div className="ish-inner">
        <div className="ish-left">
          <span className="ish-eyebrow">
            <span className="ish-dot" />
            Vertically Integrated AI Infrastructure
          </span>
          <h1 className="ish-headline">
            THE INFRA LAYER
            <br />
            <span className="ish-acc">AI RUNS ON.</span>
          </h1>
          <p className="ish-sub">
            DigiPowerX owns and operates the full stack — from power generation
            and substations to Tier III data centers and bare-metal GPU compute.
            One company, every layer.
          </p>

          <div className="ish-cta">
            <Link to="/about" className="ish-btn primary">
              Explore Our Stack ↓
            </Link>
            <Link to="/contact" className="ish-btn secondary">
              Talk to Our Team
            </Link>
          </div>

          <div className="ish-stats">
            <div className="ish-stat">
              <div className="ish-stat-value">
                450<span className="ish-stat-unit">MW</span>
              </div>
              <div className="ish-stat-label">Power Capacity</div>
            </div>
            <div className="ish-stat">
              <div className="ish-stat-value">6</div>
              <div className="ish-stat-label">DC Campuses</div>
            </div>
            <div className="ish-stat">
              <div className="ish-stat-value">&lt;1.3</div>
              <div className="ish-stat-label">Avg PUE</div>
            </div>
          </div>
        </div>

        <div className="ish-right">
          <div className="ish-stage" ref={stageRef}>
            <div
              className="ish-glow"
              ref={glowRef}
              style={{ top: LAYER_TOP[1] }}
            />
            <div className="ish-pxfield" ref={pxFieldRef} />
            <div
              ref={svgHostRef}
              style={{ width: "100%", height: "100%" }}
              dangerouslySetInnerHTML={{ __html: infraStackSvg }}
            />
            <div className="ish-meta">
              <span className="ish-live" />
              Infrastructure Stack — Live
            </div>

            <div className="ish-points" ref={pointsRef}>
              {LAYERS.map((l) => {
                const isActive = active === l.id;
                return (
                  <div
                    key={l.id}
                    ref={(el) => {
                      pointRefs.current[l.id] = el;
                    }}
                    className={`ish-point ${isActive ? "active" : "hidden"}`}
                    data-layer={l.id}
                    onClick={() => setActive(l.id)}
                  >
                    <div className="ish-pnum">{l.num}</div>
                    <div className="ish-ptitle">{l.title}</div>
                    <div className="ish-pdesc-wrap">
                      <div className="ish-pdesc">{l.desc}</div>
                      <div className="ish-pbar">
                        <span />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
