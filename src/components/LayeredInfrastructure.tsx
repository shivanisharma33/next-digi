import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";

type LayerId = 1 | 2 | 3 | 4;

interface Layer {
  id: LayerId;
  num: string;
  kicker: string;
  title: string;
  description: string;
  bullets: string[];
  cta: string;
  href: string;
  src: string;
  alt: string;
  topPct: number;
  widthPct: number;
  leftPct: number;
  markerYPct: number;
  markerSide: "left" | "right";
}

const LAYERS: Layer[] = [
  {
    id: 1,
    num: "01",
    kicker: "FULLY OWNED SUBSIDIARY",
    title: "MEET NEOCLOUDZ",
    description:
      "NeoCloudz is DigiPowerX's GPU compute platform — bare-metal NVIDIA Blackwell clusters delivered directly from our owned data centers.",
    bullets: [
      "NVIDIA Blackwell GPU clusters",
      "Bare-metal · no virtualization overhead",
      "400Gb/s InfiniBand fabric",
      "Provisioned in <58 seconds",
    ],
    cta: "Explore NeoCloudz",
    href: "https://www.neocloudz.com/",
    src: "/layers/1.svg",
    alt: "Stylized cloud shapes representing the NeoCloudz GPU compute platform.",
    topPct: 0,
    widthPct: 58,
    leftPct: 21,
    markerYPct: 12,
    markerSide: "right",
  },
  {
    id: 2,
    num: "02",
    kicker: "DATA CENTER ARCHITECTURE",
    title: "DIRECT-TO-CHIP LIQUID COOLING",
    description:
      "Purpose-built for NVIDIA Blackwell and next-gen AI accelerators. Cold plates deliver coolant directly to the chip — no air cooling required at rack-level.",
    bullets: [
      "Direct-to-chip cold plates per GPU",
      "Rear-door heat exchanger capture",
      "Chiller + cooling tower rejection loop",
      "PUE <1.15 · Zero thermal throttling",
    ],
    cta: "Explore liquid cooling",
    href: "/data-centers",
    src: "/layers/2.svg",
    alt: "Isometric grid of GPU server racks with liquid-cooled cold plates.",
    topPct: 14,
    widthPct: 100,
    leftPct: 0,
    markerYPct: 35,
    markerSide: "left",
  },
  {
    id: 3,
    num: "03",
    kicker: "STRATEGIC PARTNER",
    title: "US DATA CENTERS INC.",
    description:
      "A majority shareholder in US Data Centers Inc. — a modular data center manufacturer purpose-built for rapid & scalable infrastructure deployment.",
    bullets: [
      "800kW – 1.5MW self-contained modules",
      "Tier III design · TIA-942 compliant",
      "Rapid deployment — operational in weeks",
      "Factory-built & commissioned off-site",
    ],
    cta: "Explore US Data Centers",
    href: "/data-centers",
    src: "/layers/3.svg",
    alt: "Modular data center campus with figures and storage elements on the platform.",
    topPct: 32,
    widthPct: 100,
    leftPct: 0,
    markerYPct: 53,
    markerSide: "right",
  },
  {
    id: 4,
    num: "04",
    kicker: "VERTICAL INTEGRATION",
    title: "WE OWN THE POWER",
    description:
      "DigiPowerX controls the full energy stack — from owned power plants and utility-connected sites to 400MW+ of pipeline development across the U.S.",
    bullets: [
      "Owned power generation assets",
      "Utility-powered & substation-connected sites",
      "400MW+ development pipeline",
      "Future-site acquisitions underway",
    ],
    cta: "Explore owned power",
    href: "/energy",
    src: "/layers/4.svg",
    alt: "Solar arrays, wind turbines and substations powering the infrastructure.",
    topPct: 45,
    widthPct: 100,
    leftPct: 0,
    markerYPct: 78,
    markerSide: "left",
  },
];

const ACCENT = "#f5c518";

const LayeredInfrastructure = () => {
  const [active, setActive] = useState<LayerId>(1);
  const sectionRef = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 50,
    damping: 24,
    mass: 0.8,
    restDelta: 0.0005,
  });

  useMotionValueEvent(smoothProgress, "change", (latest) => {
    const idx = Math.max(
      0,
      Math.min(LAYERS.length - 1, Math.floor(latest * LAYERS.length)),
    );
    const newId = LAYERS[idx].id;
    setActive((prev) => (newId !== prev ? newId : prev));
  });

  const activeLayer = useMemo(
    () => LAYERS.find((l) => l.id === active) ?? LAYERS[0],
    [active],
  );
  const infoOnLeft = activeLayer.markerSide === "left";
  // When the marker sits in the bottom half of the visual, render the large
  // info block ABOVE the marker so its content (bullets + CTA) isn't clipped.
  const flipInfo = activeLayer.markerYPct > 50;

  // Click-to-scroll: jump to the section offset corresponding to a layer
  const scrollToLayer = (id: LayerId) => {
    const node = sectionRef.current;
    if (!node) return;
    const idx = LAYERS.findIndex((l) => l.id === id);
    const rect = node.getBoundingClientRect();
    const sectionTop = window.scrollY + rect.top;
    const scrollableHeight = node.offsetHeight - window.innerHeight;
    // Center each layer roughly at idx/(N-1) of the scrollable range
    const target =
      sectionTop + (scrollableHeight * idx) / Math.max(1, LAYERS.length - 1);
    window.scrollTo({
      top: target,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  // Keyboard navigation when section is in view
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const inView = rect.top < window.innerHeight / 2 && rect.bottom > window.innerHeight / 2;
      if (!inView) return;
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        const next = LAYERS.find((l) => l.id === Math.min(4, active + 1) as LayerId);
        if (next && next.id !== active) {
          e.preventDefault();
          scrollToLayer(next.id);
        }
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        const prev = LAYERS.find((l) => l.id === Math.max(1, active - 1) as LayerId);
        if (prev && prev.id !== active) {
          e.preventDefault();
          scrollToLayer(prev.id);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  return (
    <section
      ref={sectionRef}
      aria-label="DigiPowerX infrastructure stack"
      className="relative bg-white text-[#181717]"
      style={{ minHeight: "350vh" }}
    >
      <div className="sticky top-0 flex min-h-screen min-h-[100dvh] items-center overflow-hidden pt-20 lg:pt-28">
        {/* Top chapter progress strip */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-24 z-20 mx-auto hidden max-w-7xl px-6 lg:block lg:px-12 lg:top-28"
        >
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-neutral-500">
              The DigiPowerX Stack
            </span>
            <span className="h-px flex-1 bg-neutral-200" />
            <div className="flex items-center gap-1.5">
              {LAYERS.map((l) => (
                <span
                  key={`top-seg-${l.id}`}
                  className="block h-[3px] rounded-full transition-all duration-500"
                  style={{
                    width: l.id === active ? 28 : 14,
                    backgroundColor:
                      l.id <= active ? ACCENT : "#e5e5e5",
                  }}
                />
              ))}
            </div>
            <span className="font-mono text-[10px] tabular-nums tracking-widest text-neutral-700">
              {activeLayer.num}
              <span className="text-neutral-400"> / 04</span>
            </span>
          </div>
        </div>

        {/* Vertical edge label */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-4 top-1/2 z-10 hidden -translate-y-1/2 lg:block"
        >
          <span
            className="block whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.5em] text-neutral-400"
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            Infrastructure — Vertically Integrated
          </span>
        </div>

        <div className="relative mx-auto w-full max-w-7xl px-4 pb-8 pt-4 lg:px-12 lg:pb-12 lg:pt-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_400px_1fr] lg:items-stretch lg:gap-16">
            {/* Visual stack — fixed in place; scroll cycles through layers */}
            <div className="relative mx-auto w-full max-w-[250px] sm:max-w-[320px] lg:max-w-[400px] px-4 lg:col-start-2 lg:row-start-1 lg:px-0">
              {/* Decorative corner brackets */}
              <span aria-hidden className="pointer-events-none absolute -left-3 -top-3 h-5 w-5 border-l border-t border-neutral-300" />
              <span aria-hidden className="pointer-events-none absolute -right-3 -top-3 h-5 w-5 border-r border-t border-neutral-300" />
              <span aria-hidden className="pointer-events-none absolute -bottom-3 -left-3 h-5 w-5 border-b border-l border-neutral-300" />
              <span aria-hidden className="pointer-events-none absolute -bottom-3 -right-3 h-5 w-5 border-b border-r border-neutral-300" />

              <div
                className="relative w-full mx-auto max-h-[28dvh] sm:max-h-[34dvh] lg:max-h-none"
                style={{ aspectRatio: "5 / 6" }}
              >
                {/* Visual Graphic Wrapper — stays centered; only markers/pointers move */}
                <div className="absolute inset-0">
                  {/* Soft glow behind active layer */}
                  <motion.div
                    aria-hidden
                    className="absolute left-1/2 -translate-x-1/2 rounded-full blur-3xl"
                    animate={{
                      top: `${activeLayer.markerYPct - 15}%`,
                      opacity: 0.45,
                    }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                      width: "70%",
                      height: "30%",
                      background:
                        "radial-gradient(closest-side, rgba(245,197,24,0.45), rgba(245,197,24,0))",
                    }}
                  />

                  {LAYERS.map((layer) => {
                    const isActive = layer.id === active;
                    const delta = layer.id - active;
                    // Only push the immediate neighbors of the active layer outward,
                    // so the stack never overflows when the first or last layer is active.
                    // 3x spread: neighbors get a big push, distant layers get a softer one
                    const NEIGHBOR_SHIFT = isMobile ? 48 : 88;
                    const FAR_SHIFT = isMobile ? 22 : 40;
                    const absDelta = Math.abs(delta);
                    const offsetY =
                      delta === 0
                        ? -6
                        : absDelta === 1
                          ? Math.sign(delta) * NEIGHBOR_SHIFT
                          : Math.sign(delta) * FAR_SHIFT;
                    return (
                      <button
                        type="button"
                        key={layer.id}
                        onClick={() => scrollToLayer(layer.id)}
                        aria-label={`Jump to ${layer.title}`}
                        aria-pressed={isActive}
                        className="absolute cursor-pointer transition-all duration-700 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f5c518]"
                        style={{
                          top: `${layer.topPct}%`,
                          left: `${layer.leftPct}%`,
                          width: `${layer.widthPct}%`,
                          opacity: isActive ? 1 : 0,
                          pointerEvents: isActive ? "auto" : "none",
                          filter: isActive
                            ? "drop-shadow(0 18px 32px rgba(24,23,23,0.18))"
                            : "none",
                          zIndex: 10 + layer.id,
                          transform: `translateY(${offsetY}px) scale(${isActive ? 1.015 : 1
                            })`,
                          transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
                        }}
                      >
                        <img
                          src={layer.src}
                          alt={layer.alt}
                          loading="lazy"
                          className="pointer-events-none block w-full select-none"
                        />
                      </button>
                    );
                  })}
                </div>

                {LAYERS.map((layer) => {
                  const isActive = layer.id === active;
                  const onLeft = layer.markerSide === "left";
                  const SQUARE = 14;
                  const LINE = 220;
                  const OUTWARD = 24;
                  const delta = layer.id - active;
                  const NEIGHBOR_SHIFT = isMobile ? 48 : 88;
                  const FAR_SHIFT = isMobile ? 22 : 40;
                  const absDelta = Math.abs(delta);
                  const offsetY =
                    delta === 0
                      ? -6
                      : absDelta === 1
                        ? Math.sign(delta) * NEIGHBOR_SHIFT
                        : Math.sign(delta) * FAR_SHIFT;
                  return (
                    <div
                      key={`marker-${layer.id}`}
                      className="pointer-events-none hidden lg:block"
                    >
                      <div
                        className="absolute"
                        style={{
                          top: `${layer.markerYPct}%`,
                          [onLeft ? "left" : "right"]: 0,
                          transform: `translate(${onLeft ? "-100%" : "100%"
                            }, calc(-50% + ${offsetY}px)) rotate(45deg)`,
                          marginLeft: onLeft ? -OUTWARD : 0,
                          marginRight: onLeft ? 0 : -OUTWARD,
                          width: SQUARE,
                          height: SQUARE,
                          backgroundColor: isActive ? ACCENT : "#d4d4d4",
                          boxShadow: isActive
                            ? "0 0 0 6px rgba(245,197,24,0.25)"
                            : "none",
                          zIndex: 30,
                          transition: "transform 700ms cubic-bezier(0.22,1,0.36,1), background-color 500ms, box-shadow 500ms",
                        }}
                      />
                      <div
                        className="absolute"
                        style={{
                          top: `${layer.markerYPct}%`,
                          height: 1,
                          backgroundColor: "#181717",
                          transform: `translateY(calc(-50% + ${offsetY}px))`,
                          width: isActive ? LINE : 0,
                          opacity: isActive ? 1 : 0,
                          ...(onLeft
                            ? { right: "100%", marginRight: SQUARE + OUTWARD + 4 }
                            : { left: "100%", marginLeft: SQUARE + OUTWARD + 4 }),
                          zIndex: 29,
                          transition: "width 500ms, opacity 500ms, transform 700ms cubic-bezier(0.22,1,0.36,1)",
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Info panel (desktop floats next to marker; mobile is below) */}
            <aside
              className={`relative lg:row-start-1 ${infoOnLeft ? "lg:col-start-1" : "lg:col-start-3"
                }`}
            >
              {/* DESKTOP: small num + kicker chip — sits opposite the big block */}
              <motion.div
                className={`hidden lg:absolute lg:flex lg:max-w-[340px] lg:flex-col ${infoOnLeft
                  ? "lg:right-12 lg:items-end lg:text-right"
                  : "lg:left-12 lg:items-start lg:text-left"
                  }`}
                style={
                  flipInfo
                    ? {
                      top: `calc(${activeLayer.markerYPct}% + 18px)`,
                      transform: "translateY(-4px)",
                      transition: "top 700ms cubic-bezier(0.22, 1, 0.36, 1)",
                    }
                    : {
                      bottom: `calc(${100 - activeLayer.markerYPct}% + 18px)`,
                      transform: "translateY(-4px)",
                      transition: "bottom 700ms cubic-bezier(0.22, 1, 0.36, 1)",
                    }
                }
              >
                <motion.div
                  key={`chip-${activeLayer.id}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className={`flex items-center gap-3 ${infoOnLeft ? "flex-row-reverse" : ""
                    }`}
                >
                  <span className="font-mono text-xs tabular-nums tracking-widest text-neutral-500">
                    {activeLayer.num}
                    <span className="text-neutral-300"> / 04</span>
                  </span>
                  <span className="h-px w-8 bg-neutral-300" aria-hidden />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#f5c518]">
                    {activeLayer.kicker}
                  </span>
                </motion.div>
              </motion.div>

              {/* DESKTOP: big info block — flips above the marker for late layers */}
              <motion.div
                className={`hidden lg:absolute lg:flex lg:max-w-[360px] lg:flex-col ${infoOnLeft
                  ? "lg:right-12 lg:items-end lg:text-right"
                  : "lg:left-12 lg:items-start lg:text-left"
                  }`}
                style={
                  flipInfo
                    ? {
                        top: `max(120px, calc(${activeLayer.markerYPct}% - 280px))`,
                        transform: "translateY(-4px)",
                        transition: "all 700ms cubic-bezier(0.22, 1, 0.36, 1)",
                      }
                    : {
                        top: `min(calc(${activeLayer.markerYPct}% + 18px), calc(100dvh - 350px))`,
                        transform: "translateY(-4px)",
                        transition: "all 700ms cubic-bezier(0.22, 1, 0.36, 1)",
                      }
                }
              >
                <motion.div
                  key={`below-${activeLayer.id}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    ease: [0.22, 1, 0.36, 1],
                    delay: 0.05,
                  }}
                  className={`flex flex-col ${infoOnLeft ? "items-end text-right" : "items-start text-left"
                    }`}
                >
                  <h3 className="text-xl font-semibold uppercase leading-tight tracking-tight md:text-2xl">
                    {activeLayer.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-neutral-600">
                    {activeLayer.description}
                  </p>
                  <ul
                    className={`mt-4 flex flex-col gap-1.5 text-xs text-neutral-700 ${infoOnLeft ? "items-end" : "items-start"
                      }`}
                  >
                    {activeLayer.bullets.map((b) => (
                      <li
                        key={b}
                        className={`flex items-start gap-2 ${infoOnLeft ? "flex-row-reverse text-right" : ""
                          }`}
                      >
                        <span
                          aria-hidden
                          className="mt-[6px] inline-block h-1 w-1 shrink-0 rounded-full"
                          style={{ backgroundColor: ACCENT }}
                        />
                        <span className="leading-snug">{b}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    to={activeLayer.href}
                    className="group relative mt-6 inline-flex items-center gap-3 font-mono text-xs uppercase tracking-wide"
                  >
                    <span className="relative pb-1">
                      {activeLayer.cta}
                      <span
                        aria-hidden
                        className="absolute inset-x-0 bottom-0 h-px bg-[#181717]"
                      />
                      <span
                        aria-hidden
                        className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-[#f5c518] transition-transform duration-300 group-hover:scale-x-100"
                      />
                    </span>
                    <span
                      aria-hidden
                      className="transition-transform group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </Link>
                </motion.div>
              </motion.div>

              {/* MOBILE: stacked content below visual */}
              <motion.div
                key={`mobile-${activeLayer.id}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col items-center text-center lg:hidden mt-2"
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-[10px] tracking-widest text-neutral-500">
                    {activeLayer.num}
                  </span>
                  <span className="h-px w-4 bg-neutral-300" aria-hidden />
                  <span className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#f5c518]">
                    {activeLayer.kicker}
                  </span>
                </div>
                <h3 className="mt-2 text-lg sm:text-xl font-bold uppercase leading-tight tracking-tight">
                  {activeLayer.title}
                </h3>
                <p className="mt-2 max-w-md text-xs sm:text-sm leading-relaxed text-neutral-600 px-2">
                  {activeLayer.description}
                </p>
                <ul className="mt-3 grid max-w-md grid-cols-1 gap-1 text-left text-[11px] sm:text-xs text-neutral-700 sm:grid-cols-2 px-2">
                  {activeLayer.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-1.5">
                      <span
                        aria-hidden
                        className="mt-[5px] inline-block h-1 w-1 shrink-0 rounded-full"
                        style={{ backgroundColor: ACCENT }}
                      />
                      <span className="leading-snug">{b}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to={activeLayer.href}
                  className="mt-4 inline-flex items-center gap-2 border-b border-[#181717] pb-0.5 font-mono text-[10px] sm:text-xs uppercase tracking-wide"
                >
                  {activeLayer.cta}
                  <span aria-hidden>→</span>
                </Link>

                {/* Mobile dot navigator */}
                <div className="mt-4 flex items-center gap-1.5">
                  {LAYERS.map((l) => (
                    <button
                      key={`m-dot-${l.id}`}
                      type="button"
                      onClick={() => scrollToLayer(l.id)}
                      aria-label={`Go to ${l.title}`}
                      aria-current={l.id === active ? "step" : undefined}
                      className="h-1.5 rounded-full transition-all"
                      style={{
                        width: l.id === active ? 18 : 6,
                        backgroundColor:
                          l.id === active ? ACCENT : "#d4d4d4",
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LayeredInfrastructure;
