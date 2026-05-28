import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CTASection } from './Footer';
import DgxGlobe from './DgxGlobe';
import GlobalNetworkHeroVisual3D from './GlobalNetworkHeroVisual3D';
import EnergyHeroCanvas from './EnergyHeroCanvas';
import UnifiedOpsHub3D from './UnifiedOpsHub3D';
import InvestorHeroVisual3D from './InvestorHeroVisual3D';
import CubeGridNetwork3D from './CubeGridNetwork3D';
import './GlobalNetwork.css';

const BRAND = '#f5c518';
const BG = '#0b0b0d';

const GLOBE_FRAMES = 40;
const GLOBE_FPS = 12;

const GeoDiversitySVG = () => {
  const [frame, setFrame] = useState(1);

  useEffect(() => {
    // Preload all frames so swaps are instant
    const preloaded: HTMLImageElement[] = [];
    for (let i = 1; i <= GLOBE_FRAMES; i++) {
      const img = new Image();
      img.src = `/globe/${i}.svg`;
      preloaded.push(img);
    }

    const id = window.setInterval(() => {
      setFrame((f) => (f % GLOBE_FRAMES) + 1);
    }, 1000 / GLOBE_FPS);

    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="gn-globe-stage" role="img" aria-label="Rotating globe — geographically diverse sites">
      {/* Inline filter — tints any luminance value to brand yellow #f5c518.
          Matrix maps grayscale L to (1.25·L, 1.00·L, 0.10·L); highlights clamp to
          (255, 255, ~26) ≈ light brand yellow. */}
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <defs>
          <filter id="gn-globe-tint" colorInterpolationFilters="sRGB">
            <feColorMatrix
              type="matrix"
              values="1.25 0 0 0 0
                      1.00 0 0 0 0
                      0.10 0 0 0 0
                      0    0 0 1 0"
            />
          </filter>
        </defs>
      </svg>
      <img
        className="gn-globe-frame"
        src={`/globe/${frame}.svg`}
        alt=""
        draggable={false}
      />
    </div>
  );
};

const BackboneFailoverSVG = () => (
  <svg className="gn-bb" viewBox="0 0 680 420" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Inter-site backbone for replication and failover">
    <defs>
      <marker id="gn-bb-arrow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
        <path d="M2 1L8 5L2 9" fill="none" stroke={BRAND} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </marker>

      <path id="gn-bb-p1" d="M160,170 Q340,80 520,170" />
      <path id="gn-bb-p2" d="M160,210 L520,210" />
      <path id="gn-bb-p3" d="M160,250 Q340,340 520,250" />
    </defs>

    {/* Left rack — Site A */}
    <g transform="translate(60,130)">
      <rect width="100" height="160" rx="8" fill={BG} stroke={BRAND} strokeWidth="2" />
      <text x="50" y="22" textAnchor="middle" fill={BRAND} fontSize="11" fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace" letterSpacing="3">SITE A</text>
      <g stroke={BRAND} strokeWidth="1.4" opacity="0.7">
        <line x1="12" y1="42"  x2="88" y2="42"  />
        <line x1="12" y1="62"  x2="88" y2="62"  />
        <line x1="12" y1="82"  x2="88" y2="82"  />
        <line x1="12" y1="102" x2="88" y2="102" />
        <line x1="12" y1="122" x2="88" y2="122" />
        <line x1="12" y1="142" x2="88" y2="142" />
      </g>
      <circle className="gn-bb-led" cx="82" cy="42" r="3.2" fill="#22c55e" />
    </g>

    {/* Right rack — Site B */}
    <g transform="translate(520,130)">
      <rect width="100" height="160" rx="8" fill={BG} stroke={BRAND} strokeWidth="2" />
      <text x="50" y="22" textAnchor="middle" fill={BRAND} fontSize="11" fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace" letterSpacing="3">SITE B</text>
      <g stroke={BRAND} strokeWidth="1.4" opacity="0.7">
        <line x1="12" y1="42"  x2="88" y2="42"  />
        <line x1="12" y1="62"  x2="88" y2="62"  />
        <line x1="12" y1="82"  x2="88" y2="82"  />
        <line x1="12" y1="102" x2="88" y2="102" />
        <line x1="12" y1="122" x2="88" y2="122" />
        <line x1="12" y1="142" x2="88" y2="142" />
      </g>
      <circle className="gn-bb-led" cx="82" cy="42" r="3.2" fill="#22c55e" />
    </g>

    {/* Three diverse fiber paths */}
    <use href="#gn-bb-p1" className="gn-bb-link" fill="none" stroke={BRAND} strokeWidth="1.8" opacity="0.5" strokeLinecap="round" />
    <use href="#gn-bb-p2" className="gn-bb-link" fill="none" stroke={BRAND} strokeWidth="1.8" opacity="0.6" strokeLinecap="round" />
    <use href="#gn-bb-p3" className="gn-bb-link" fill="none" stroke={BRAND} strokeWidth="1.8" opacity="0.5" strokeLinecap="round" />

    {/* Bidirectional packets along each path */}
    <circle r="5" fill={BRAND}>
      <animateMotion dur="4s" repeatCount="indefinite">
        <mpath href="#gn-bb-p1" />
      </animateMotion>
    </circle>
    <circle r="5" fill={BRAND}>
      <animateMotion dur="3.6s" repeatCount="indefinite" calcMode="linear" keyPoints="1;0" keyTimes="0;1">
        <mpath href="#gn-bb-p2" />
      </animateMotion>
    </circle>
    <circle r="5" fill={BRAND}>
      <animateMotion dur="4.4s" repeatCount="indefinite">
        <mpath href="#gn-bb-p3" />
      </animateMotion>
    </circle>
    <circle r="4" fill={BRAND} opacity="0.8">
      <animateMotion dur="5s" begin="1s" repeatCount="indefinite" calcMode="linear" keyPoints="1;0" keyTimes="0;1">
        <mpath href="#gn-bb-p1" />
      </animateMotion>
    </circle>
    <circle r="4" fill={BRAND} opacity="0.8">
      <animateMotion dur="5.4s" begin="0.6s" repeatCount="indefinite">
        <mpath href="#gn-bb-p3" />
      </animateMotion>
    </circle>

    {/* Sync indicator in the middle */}
    <g>
      <circle className="gn-bb-sync" cx="340" cy="210" r="22" fill="none" stroke={BRAND} strokeWidth="1.6" opacity="0.6" />
      <circle cx="340" cy="210" r="6" fill={BRAND} />
      <line x1="330" y1="200" x2="350" y2="200" stroke={BG} strokeWidth="1.6" strokeLinecap="round" markerEnd="url(#gn-bb-arrow)" />
      <line x1="350" y1="220" x2="330" y2="220" stroke={BG} strokeWidth="1.6" strokeLinecap="round" markerEnd="url(#gn-bb-arrow)" />
    </g>
  </svg>
);

const EdgeToCoreSVG = () => (
  <svg className="gn-edge" viewBox="0 0 680 420" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Edge-to-core latency engineered for AI workloads">
    <defs>
      <marker id="gn-edge-arrow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M2 1L8 5L2 9" fill="none" stroke={BRAND} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </marker>
    </defs>

    {/* Outermost faint dashed ring */}
    <circle className="gn-ring-far" cx="340" cy="210" r="210" fill="none" stroke={BRAND} strokeWidth="1" opacity="0.14" />

    {/* OUTER dotted flowing ring */}
    <circle className="gn-ring-outer" cx="340" cy="210" r="178" fill="none" stroke={BRAND} strokeWidth="2.2" strokeLinecap="round" opacity="0.6" />

    {/* second outer dotted ring, opposite flow */}
    <circle className="gn-ring-outer2" cx="340" cy="210" r="142" fill="none" stroke={BRAND} strokeWidth="1.8" strokeLinecap="round" opacity="0.35" />

    {/* INNER SOLID ring, slow rotation */}
    <circle className="gn-ring-inner" cx="340" cy="210" r="92" fill="none" stroke={BRAND} strokeWidth="2" opacity="0.85" />

    {/* orbiting node dot */}
    <g className="gn-orbit">
      <circle cx="340" cy="118" r="3.2" fill={BRAND} opacity="0.9" />
    </g>

    {/* STATIC signal arrow */}
    <g>
      <circle cx="516" cy="210" r="6" fill={BRAND} />
      <line x1="516" y1="210" x2="440" y2="210" stroke={BRAND} strokeWidth="2.4" strokeLinecap="round" markerEnd="url(#gn-edge-arrow)" />
    </g>

    {/* chip glow halo */}
    <circle className="gn-chip-glow" cx="340" cy="210" r="74" fill={BRAND} opacity="0.18" />

    {/* chip body */}
    <rect x="298" y="168" width="84" height="84" rx="12" fill={BG} stroke={BRAND} strokeWidth="2" />

    {/* chip pins */}
    <g stroke={BRAND} strokeWidth="2" strokeLinecap="round">
      <line x1="316" y1="156" x2="316" y2="168" />
      <line x1="340" y1="156" x2="340" y2="168" />
      <line x1="364" y1="156" x2="364" y2="168" />
      <line x1="316" y1="252" x2="316" y2="264" />
      <line x1="340" y1="252" x2="340" y2="264" />
      <line x1="364" y1="252" x2="364" y2="264" />
      <line x1="286" y1="186" x2="298" y2="186" />
      <line x1="286" y1="210" x2="298" y2="210" />
      <line x1="286" y1="234" x2="298" y2="234" />
      <line x1="382" y1="186" x2="394" y2="186" />
      <line x1="382" y1="210" x2="394" y2="210" />
      <line x1="382" y1="234" x2="394" y2="234" />
    </g>

    {/* DGXX logo */}
    <g transform="translate(340,210) scale(0.2955) translate(-150,-150)">
      <path d="M112,62 L156,62 A88,88 0 0 1 156,238 L112,238 Z" fill={BRAND} />
      <g fill={BG}>
        <rect x="104" y="104" width="58" height="26" rx="4" />
        <rect x="104" y="168" width="58" height="26" rx="4" />
      </g>
      <g fill={BRAND}>
        <rect x="62" y="108" width="46" height="22" rx="4" />
        <rect x="62" y="172" width="46" height="22" rx="4" />
        <rect x="130" y="110" width="28" height="18" rx="3" />
        <rect x="130" y="174" width="28" height="18" rx="3" />
      </g>
    </g>
  </svg>
);

const GlobalNetwork = () => {
  return (
    <div className="bg-[#06070a] min-h-screen text-white font-sans selection:bg-[#f5c518]/30 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col pt-28 pb-16 px-6 overflow-hidden">
        {/* Main two-column grid */}
        <div className="flex-1 relative z-10 w-full max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start lg:pt-12 py-10">
          {/* LEFT: Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-start text-left"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f5c518] shadow-[0_0_8px_#f5c518]"></span>
              <span className="text-[9px] uppercase tracking-[0.4em] font-mono text-white/60">
                Live Network · US Footprint
              </span>
            </div>

            <h1 className="text-[clamp(2.5rem,6vw,5.5rem)] font-semibold tracking-tighter leading-[0.95] mb-10 uppercase">
              <span className="block text-white">GLOBAL</span>
              <span className="block text-[#f5c518]">NETWORK</span>
            </h1>

            <p className="text-white/60 text-sm md:text-lg max-w-xl mb-12 leading-relaxed font-medium tracking-wide">
              DigiPowerX connects owned generation, substation access, and compute capacity across a multi-site footprint — one resilient mesh from grid to GPU.
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-6">
              <Link
                to="/contact"
                className="px-12 py-5 bg-[#f5c518] text-black font-semibold uppercase tracking-[0.2em] text-[11px] rounded-md transition-all hover:brightness-110 active:scale-95 shadow-[0_10px_40px_rgba(245,197,24,0.2)]"
              >
                Talk to Team
              </Link>
              <Link
                to="/energy"
                className="px-12 py-5 border border-white/20 text-white font-semibold uppercase tracking-[0.2em] text-[11px] rounded-md bg-white/5 backdrop-blur-sm transition-all hover:bg-white/10"
              >
                Power Infrastructure
              </Link>
            </div>
          </motion.div>

          {/* RIGHT: 3D Animation */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full lg:absolute lg:right-0 lg:top-0 lg:w-[50vw] lg:h-full min-h-[400px] md:min-h-[500px] lg:min-h-[600px] z-0 overflow-hidden"
          >
            <DgxGlobe />
          </motion.div>
        </div>

        {/* Stats Bar (full width below grid) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative z-10 w-full max-w-[1200px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12"
        >
          {[
            { val: "4", label: "Active Sites Across the US Footprint" },
            { val: "400MW+", label: "Pipeline Capacity in Development" },
            { val: "24/7", label: "Multi-region Network Operations" },
            { val: "<10ms", label: "Inter-site Backbone Latency Target" }
          ].map((stat, i) => (
            <div
              key={i}
              className="p-8 bg-[#090a0e]/60 border border-white/[0.04] rounded-2xl relative overflow-hidden group hover:border-[#f5c518]/30 hover:bg-[#0f1118]/80 shadow-2xl hover:shadow-[0_15px_30px_rgba(245,197,24,0.1)] transition-all duration-500 ease-out flex flex-col items-center justify-center text-center"
            >
              {/* Top laser border transition */}
              <div className="absolute top-0 left-0 w-0 h-[2px] bg-gradient-to-r from-[#f5c518] to-[#ffda66] group-hover:w-full transition-all duration-500" />

              {/* Dynamic Inner Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#f5c518]/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f5c518] to-[#ffd84d] font-mono text-4xl md:text-5xl font-extrabold mb-3 tracking-tighter group-hover:brightness-110 transition-all duration-300">
                {stat.val}
              </span>

              <span className="text-white/60 text-[10px] font-bold uppercase tracking-[0.2em] leading-relaxed max-w-[180px] group-hover:text-[#ffda66] transition-colors duration-300">
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Network Flow Section — mirrors /energy's "From Generation to GPU Load" */}
      <section className="bg-white py-20 px-6 relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto">

          {/* Top Badge */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex items-center px-6 py-2.5 rounded-full border border-black/10 bg-black/5 backdrop-blur-sm">
              <div className="w-10 h-[1.5px] bg-[#f5c518] mr-4"></div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.4em] text-black/80">
                Network Flow
              </span>
            </div>
          </div>

          {/* Heading */}
          <div className="text-center mb-8">
            <h2 className="text-[clamp(2.5rem,6vw,5.5rem)] font-semibold leading-[0.95] tracking-tighter uppercase text-black mb-8 relative z-10">
              From Region<br />
              to <span className="text-[#f5c518]">Rack.</span>
            </h2>
          </div>

          {/* Subtext */}
          <div className="max-w-4xl mx-auto text-center mb-24">
            <p className="text-black/55 text-base md:text-[19px] leading-[1.6] font-medium tracking-tight">
              Multi-region sites linked by a redundant backbone and operated as one platform. Power, fiber, and compute provisioned together — without the gaps that slow leased-only competitors.
            </p>
          </div>

          <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 justify-center">
            {[
              {
                num: "01",
                tag: "Geographic Diversity",
                title: "Diverse sites, independent power profiles",
                lead: "Owned nodes spread across distinct ISO regions and grid operators — so a fault in one market never propagates into customer capacity in another.",
                bullets: [
                  "Sites across NY, AL, and NC anchor the active footprint",
                  "Independent generation mix at each node — gas, grid, hybrid",
                  "Customer proximity to East Coast and Southeast demand hubs",
                  "Diverse fiber entries and water/utility paths per site",
                ],
                metrics: [
                  { k: "Regions", v: "4" },
                  { k: "ISOs", v: "3" },
                  { k: "Power Mix", v: "Hybrid" },
                ],
                Visual: GeoDiversitySVG,
              },
              {
                num: "02",
                tag: "Backbone & Failover",
                title: "Inter-site fabric for replication & failover",
                lead: "A managed backbone stitches every node into one operating fabric — replication, failover, and consistent posture across regions without leased-line gaps.",
                bullets: [
                  "Diverse-path fiber between every region",
                  "Active replication paths for customer datasets",
                  "Automated failover for power + connectivity",
                  "Single routing policy across the footprint",
                ],
                metrics: [
                  { k: "Paths", v: "3x" },
                  { k: "RTT Target", v: "<10ms" },
                  { k: "Failover", v: "Auto" },
                ],
                Visual: CubeGridNetwork3D,
              },
              {
                num: "03",
                tag: "Edge-to-Core Latency",
                title: "Latency budget engineered for AI workloads",
                lead: "Routes, optics, and switching are tuned to a strict latency budget — training clusters stay tightly coupled, inference stays close to the user.",
                bullets: [
                  "Latency-budgeted routes for distributed training",
                  "GPU-aware path engineering across the backbone",
                  "On-site inference at the network edge",
                  "Low-jitter optical transport, deterministic switching",
                ],
                metrics: [
                  { k: "Edge RTT", v: "<5ms" },
                  { k: "Core RTT", v: "<10ms" },
                  { k: "Jitter", v: "Sub-ms" },
                ],
                Visual: EdgeToCoreSVG,
              },
              {
                num: "04",
                tag: "Unified Operations",
                title: "One ops team across the full footprint",
                lead: "Network, power, and compute are observed and controlled as one — customers get a single contract, single NOC, single point of accountability.",
                bullets: [
                  "24/7 multi-region NOC coverage",
                  "Unified telemetry across power and compute",
                  "Capacity provisioning across the footprint",
                  "Customer-facing SLAs at the network tier",
                ],
                metrics: [
                  { k: "Coverage", v: "24/7" },
                  { k: "NOC", v: "Single" },
                  { k: "SLA", v: "Unified" },
                ],
                Visual: UnifiedOpsHub3D,
              },
            ].map((card, i) => {
              const { Visual } = card;
              return (
              <div
                key={i}
                className="group relative bg-gradient-to-br from-[#0b0b0e] to-[#070709] rounded-3xl p-8 md:p-10 border border-white/[0.06] hover:border-[#f5c518]/30 shadow-[0_12px_40px_rgba(0,0,0,0.18)] hover:shadow-[0_30px_80px_rgba(245,197,24,0.18)] transition-all duration-500 flex flex-col items-start overflow-hidden hover:-translate-y-1"
              >
                {/* Subtle Mesh Background for texture */}
                <div className="absolute inset-0 opacity-[0.025] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#f5c518 1px, transparent 0)', backgroundSize: '24px 24px' }} />

                {/* Decorative corner element */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-[#f5c518]/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-tr-3xl" />

                {/* Animated visual */}
                <div className="gn-card-visual gn-card-visual--lg relative z-10">
                  <Visual />
                </div>

                {/* Title */}
                <h3 className="text-white text-xl md:text-2xl font-semibold tracking-tight leading-snug mb-3 relative z-10 group-hover:text-[#f5c518] transition-colors duration-500">
                  {card.title}
                </h3>

                {/* Lead paragraph */}
                <p className="text-white/55 text-[13px] md:text-sm leading-relaxed font-medium mb-6 relative z-10">
                  {card.lead}
                </p>

                {/* Detail bullets */}
                <ul className="space-y-2.5 mb-7 relative z-10 w-full">
                  {card.bullets.map((b, bi) => (
                    <li key={bi} className="flex items-start gap-3">
                      <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-[#f5c518]/70 shrink-0" />
                      <span className="text-white/70 text-[13px] leading-relaxed font-medium">
                        {b}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Metric strip */}
                <div className="mt-auto w-full pt-6 border-t border-white/[0.06] relative z-10">
                  <div className="grid grid-cols-3 gap-3">
                    {card.metrics.map((m, mi) => (
                      <div key={mi} className="flex flex-col">
                        <span className="font-mono text-[9px] font-semibold tracking-[0.2em] uppercase text-white/35 mb-1.5">
                          {m.k}
                        </span>
                        <span className="text-[#f5c518] text-base md:text-lg font-bold tracking-tight">
                          {m.v}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom indicator line that stretches out on hover */}
                <div className="mt-6 w-full relative z-10">
                  <div className="h-[2px] w-10 bg-white/5 group-hover:w-full group-hover:bg-[#f5c518] transition-all duration-500 origin-left" />
                </div>
              </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Network Layers Section — mirrors /energy's 3-column "Layers" */}
      <section className="bg-[#06070a] py-15 px-6 border-y border-white/5">
        <div className="max-w-[1400px] mx-auto">

          {/* Top Badge */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex items-center px-6 py-2 rounded-full border border-white/10 bg-white/5">
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-[0.4em] mr-4">02 /</span>
              <div className="w-12 h-[1px] bg-[#f5c518] mr-4"></div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/80">
                Network Layers
              </span>
            </div>
          </div>

          {/* Heading */}
          <div className="text-center mb-8">
            <h2 className="text-[clamp(2.5rem,6vw,5.5rem)] font-semibold leading-[0.95] tracking-tighter uppercase text-white mb-8 relative z-10">
              One Platform.<br />
              Many <span className="text-[#f5c518]">Regions.</span>
            </h2>
          </div>

          {/* Subtext */}
          <div className="max-w-4xl mx-auto text-center mb-20">
            <p className="text-white/40 text-sm md:text-lg leading-relaxed font-medium">
              Each site is engineered as a self-sufficient power-and-compute node, then federated into a single operating fabric — so customers get geographic diversity without operational fragmentation.
            </p>
          </div>

          {/* 3-Column Layers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 border border-white/10 rounded-2xl overflow-hidden bg-white/[0.02]">

            {/* Column 1: Sites */}
            <div className="p-10 md:p-14 border-b md:border-b-0 md:border-r border-white/10 hover:bg-white/[0.02] transition-colors group">
              <div className="text-[#f5c518] text-[10px] font-semibold uppercase tracking-[0.2em] mb-4">Sites</div>
              <h3 className="text-white text-xl md:text-2xl font-semibold uppercase mb-6 tracking-tight">Footprint Nodes</h3>
              <p className="text-white/40 text-sm leading-relaxed mb-10 font-medium">
                Owned and operated sites in NY, AL, and NC anchor the footprint — each selected for power availability and customer proximity.
              </p>
              <ul className="space-y-4">
                {[
                  "North Tonawanda, NY — gas generation node",
                  "Buffalo, NY — urban interconnect",
                  "Columbiana, AL — campus expansion",
                  "Hildebran, NC — mega-site pipeline"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 group/item">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mt-1 flex-shrink-0 transform group-hover/item:translate-x-1 transition-transform">
                      <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="#f5c518" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-white/60 text-[13px] font-semibold leading-tight">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2: Backbone */}
            <div className="p-10 md:p-14 border-b md:border-b-0 md:border-r border-white/10 hover:bg-white/[0.02] transition-colors group">
              <div className="text-[#f5c518] text-[10px] font-semibold uppercase tracking-[0.2em] mb-4">Backbone</div>
              <h3 className="text-white text-xl md:text-2xl font-semibold uppercase mb-6 tracking-tight">Inter-site Fabric</h3>
              <p className="text-white/40 text-sm leading-relaxed mb-10 font-medium">
                A managed backbone links every node — enabling replication, failover, and consistent operating posture across regions.
              </p>
              <ul className="space-y-4">
                {[
                  "Diverse-path fiber between regions",
                  "Latency-budgeted routes for AI training",
                  "Replication of customer datasets across sites",
                  "Failover paths for power and connectivity"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 group/item">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mt-1 flex-shrink-0 transform group-hover/item:translate-x-1 transition-transform">
                      <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="#f5c518" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-white/60 text-[13px] font-bold leading-tight">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Operations */}
            <div className="p-10 md:p-14 hover:bg-white/[0.02] transition-colors group">
              <div className="text-[#f5c518] text-[10px] font-semibold uppercase tracking-[0.2em] mb-4">Operations</div>
              <h3 className="text-white text-xl md:text-2xl font-semibold uppercase mb-6 tracking-tight">Single Control Plane</h3>
              <p className="text-white/40 text-sm leading-relaxed mb-10 font-medium">
                Network, power, and compute are observed and controlled as one — customers get a single contract and a single point of accountability.
              </p>
              <ul className="space-y-4">
                {[
                  "24/7 multi-region NOC coverage",
                  "Unified telemetry across power and compute",
                  "Capacity provisioning across the footprint",
                  "Customer-facing SLAs at the network tier"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 group/item">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mt-1 flex-shrink-0 transform group-hover/item:translate-x-1 transition-transform">
                      <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="#f5c518" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-white/60 text-[13px] font-bold leading-tight">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* Network Pipeline Section — mirrors /energy's 4-card value chain */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-[1400px] mx-auto">

          {/* Top Badge */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex items-center px-6 py-2 rounded-full border border-black/10 bg-black/5">
              <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-black/60">
                Network Pipeline
              </span>
            </div>
          </div>

          {/* Heading */}
          <div className="text-center mb-10">
            <h2 className="text-[clamp(2.5rem,6vw,5.5rem)] font-semibold leading-[0.95] tracking-tighter uppercase text-black mb-8 relative z-10">
              Reach is Built<br />
              Region by <span className="text-[#f5c518]">Region.</span>
            </h2>
          </div>

          {/* Subtext */}
          <div className="max-w-4xl mx-auto text-center mb-20 space-y-6">
            <p className="text-black/55 text-sm md:text-lg leading-relaxed font-medium">
              The DigiPowerX network compounds as each new site comes online: more diversity, more capacity, lower customer latency, and more revenue per megawatt across the footprint.
            </p>
            <p className="text-black/55 text-sm md:text-lg leading-relaxed font-medium">
              Federated by design — every node is operationally independent and operationally consistent.
            </p>
          </div>

          {/* 4-Column Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {[
              {
                title: "Discover",
                desc: "Site selection driven by power, fiber, and customer-proximity — not just real estate availability.",
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    <circle cx="11" cy="11" r="3" />
                  </svg>
                )
              },
              {
                title: "Build",
                desc: "Owned generation and substation control let each node come online without third-party blockers.",
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                  </svg>
                )
              },
              {
                title: "Connect",
                desc: "New sites join the backbone with diverse-path fiber and unified operational tooling.",
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="18" cy="5" r="3" />
                    <circle cx="6" cy="12" r="3" />
                    <circle cx="18" cy="19" r="3" />
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                  </svg>
                )
              },
              {
                title: "Operate",
                desc: "One NOC, one telemetry pane, one accountable team across every region in the footprint.",
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                  </svg>
                )
              }
            ].map((card, i) => (
              <div
                key={i}
                className="relative bg-[#0a0a0a] p-8 rounded-[24px] flex flex-col items-start text-left border border-white/[0.06] hover:border-[#f5c518]/40 transition-all duration-300 hover:shadow-[0_25px_50px_-12px_rgba(245,197,24,0.15)] hover:-translate-y-1 group cursor-pointer min-h-[300px] overflow-hidden"
              >
                {/* Step Pill */}
                <div className="flex items-center justify-between w-full mb-6">
                  <span className="text-[10px] font-mono font-bold tracking-widest text-[#f5c518] bg-[#f5c518]/10 px-3 py-1 rounded-md">
                    {`STEP 0${i + 1}`}
                  </span>
                </div>

                {/* SVG Icon */}
                <div className="text-white/40 group-hover:text-[#f5c518] transition-colors duration-300 mb-5 shrink-0">
                  {card.icon}
                </div>

                {/* Content */}
                <h3 className="text-white group-hover:text-[#f5c518] text-lg font-bold uppercase tracking-tight mb-3 transition-all duration-300">
                  {card.title}
                </h3>
                <p className="text-white/50 group-hover:text-white/75 text-[13px] md:text-sm leading-relaxed font-semibold transition-colors duration-300">
                  {card.desc}
                </p>

                {/* Subtle radial spotlight gradient inside the card */}
                <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-gradient-to-br from-[#f5c518]/[0.06] to-transparent pointer-events-none" />
              </div>
            ))}
          </div>
        </div>

        {/* Black Stats Bar */}
        <div className="bg-[#06070a] py-20 px-8 md:px-12 rounded-3xl mt-16 border border-white/10 relative overflow-hidden shadow-2xl">
          {/* Futuristic ambient grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.02] pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(to right, #f5c518 1px, transparent 1px), linear-gradient(to bottom, #f5c518 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />
          {/* Subtle center gold glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#f5c518]/[0.03] rounded-full blur-[120px] pointer-events-none" />

          <div className="max-w-[1400px] mx-auto relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { val: "4 Regions", label: "ACTIVE OPERATING REGIONS ACROSS THE US — DIVERSIFIED POWER PROFILES AND CUSTOMER PROXIMITY." },
              { val: "Diverse Path", label: "INTER-SITE FIBER ENGINEERED — WITH PHYSICAL ROUTE DIVERSITY FOR REPLICATION AND FAILOVER." },
              { val: "Single NOC", label: "MULTI-REGION OPERATIONS RUN — FROM A UNIFIED CONTROL PLANE, ONE TEAM, ONE PANE OF GLASS." },
              { val: "400MW+ Pipe", label: "PIPELINE CAPACITY IN DEVELOPMENT — EXTENDS THE NETWORK INTO NEW CUSTOMER GEOGRAPHIES." }
            ].map((stat, i) => {
              const [title, desc] = stat.label.split(' — ');
              return (
                <div
                  key={i}
                  className="p-8 bg-[#090a0e]/60 border border-white/[0.04] rounded-2xl relative overflow-hidden group hover:border-[#f5c518]/30 hover:bg-[#0f1118]/80 shadow-2xl hover:shadow-[0_15px_30px_rgba(245,197,24,0.1)] transition-all duration-500 ease-out"
                >
                  {/* Top laser border transition */}
                  <div className="absolute top-0 left-0 w-0 h-[2px] bg-gradient-to-r from-[#f5c518] to-[#ffda66] group-hover:w-full transition-all duration-500" />

                  {/* Dynamic Inner Glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#f5c518]/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  <div className="flex flex-col gap-4 relative z-10">
                    {/* Small gold indicator block */}
                    <div className="w-6 h-[2px] bg-[#f5c518] group-hover:w-10 transition-all duration-300" />

                    <span className="text-white text-3xl font-bold tracking-tight font-sans text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/70 group-hover:from-[#f5c518] group-hover:to-[#ffd84d] transition-all duration-300">
                      {stat.val}
                    </span>

                    <span className="text-[#f5c518] text-[10px] font-bold uppercase tracking-[0.2em] leading-tight group-hover:text-[#ffda66] transition-colors">
                      {title}
                    </span>

                    <span className="text-white/40 text-[13px] font-medium leading-relaxed mt-1 group-hover:text-white/70 transition-colors duration-300">
                      {desc}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );
};

export default GlobalNetwork;
