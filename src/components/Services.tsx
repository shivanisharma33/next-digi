import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CTASection } from './Footer';
import {
  Zap, Server, Cpu, Layers, Activity,
  ChevronRight, ArrowUpRight, CheckCircle2,
  Terminal, Database, Globe, Clock, Shield,
  ArrowRight, Brain, Cloud, Radio, RefreshCw
} from 'lucide-react';
import HeroBg from './HeroBg';
import IsometricEnergyGen from './IsometricEnergyGen';
import NeoCloudVisual from './NeoCloudVisual';
import GpuClusterDashboard from './GpuClusterDashboard';
import ARMSVisual from './ARMSVisual';
import ARMSModularVisual from './ARMSModularVisual';
import Arms3D from './Arms3D';
import ServicesHeroVisual3D from './ServicesHeroVisual3D';
import DGXXCubeAnimation from './DGXXCubeAnimation';

/* ─── Shared Components ─── */
const SectionLabel = ({ num, text, dark = false }: { num: string, text: string, dark?: boolean }) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="mb-8 lg:mb-12 relative z-10 flex justify-center"
  >
    <div className={`inline-flex items-center gap-3 ${dark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100 shadow-sm'} border rounded-full px-6 py-2.5`}>
      <span className={`text-[10px] font-semibold tracking-widest ${dark ? 'text-white/40' : 'text-gray-400'}`}>{num} /</span>
      <div className="h-[2px] w-12 bg-[#f5c518]" />
      <span className={`text-[10px] font-semibold tracking-[0.25em] ${dark ? 'text-white' : 'text-black'} uppercase`}>{text}</span>
    </div>
  </motion.div>
);

const FeatureItem = ({ text, dark = false }: { text: string, dark?: boolean }) => (
  <li className="flex items-start gap-4 group">
    <div className="mt-1 w-5 h-5 rounded-md bg-[#f5c518]/10 border border-[#f5c518]/20 flex items-center justify-center shrink-0 group-hover:bg-[#f5c518] group-hover:text-black transition-colors">
      <CheckCircle2 size={12} />
    </div>
    <span className={`${dark ? 'text-gray-400 group-hover:text-white' : 'text-gray-500 group-hover:text-black'} transition-colors leading-tight font-medium`}>{text}</span>
  </li>
);

/* ─── ModularDCGraphic (ARMS) ─── */
const ModularDCGraphic = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d')!;
    let W: number, H: number, t = 0;

    const setSize = () => {
      const dpr = window.devicePixelRatio || 1;
      W = c.offsetWidth; H = c.offsetHeight;
      c.width = W * dpr; c.height = H * dpr;
      c.style.width = W + 'px'; c.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    window.addEventListener('resize', setSize);
    setSize();

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const cx = W / 2, cy = H / 2;
      const mw = W * 0.7, mh = H * 0.45;

      ctx.strokeStyle = 'rgba(255,255,255,0.03)';
      ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
      for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

      ctx.fillStyle = 'rgba(20,20,20,0.95)';
      ctx.beginPath(); ctx.roundRect(cx - mw / 2, cy - mh / 2, mw, mh, 4); ctx.fill();
      ctx.strokeStyle = 'rgba(245, 197, 24, 0.2)'; ctx.lineWidth = 2; ctx.stroke();

      const fx = cx + mw / 2 - 60, fy = cy, fr = 35;
      ctx.fillStyle = 'rgba(10,10,10,1)';
      ctx.beginPath(); ctx.arc(fx, fy, fr, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = 'rgba(245, 197, 24, 0.3)'; ctx.stroke();

      ctx.save();
      ctx.translate(fx, fy);
      ctx.rotate(t * 8);
      ctx.strokeStyle = '#f5c518';
      ctx.lineWidth = 3;
      for (let i = 0; i < 4; i++) {
        ctx.rotate(Math.PI / 2);
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(fr - 5, 0); ctx.stroke();
      }
      ctx.restore();

      t += 0.015;
      requestAnimationFrame(draw);
    };

    draw();
    return () => window.removeEventListener('resize', setSize);
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full" />;
};

/* ─── Main Component ─── */
export default function Services() {
  const [activeMode, setActiveMode] = useState<'all' | 'ai' | 'cloud' | 'iot' | 'analytics'>('all');

  return (
    <div className="services-page font-sans bg-[#050505] selection:bg-[#f5c518]/30">

      {/* ── 00 / Hero Section ── */}
      <section className="relative min-h-screen flex flex-col overflow-hidden pt-28 pb-0">
        {/* Main two-column grid */}
        <div className="flex-1 relative z-10 w-full max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start lg:pt-12 px-6 lg:px-8 py-10">
          {/* LEFT: Text + tabs */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-start text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8 inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-5 py-2.5 backdrop-blur-md"
            >
              <div className="h-2 w-2 rounded-full bg-[#f5c518] animate-pulse" />
              <span className="text-[10px] font-bold tracking-[0.25em] text-white uppercase">
                Services Platform
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="text-[clamp(2.5rem,6.5vw,5.5rem)] font-bold text-white leading-[1.0] tracking-tighter uppercase mb-6"
            >
              Services & <br />
              <span className="text-[#f5c518] relative inline-block">
                Capabilities
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-gray-300 text-sm md:text-base max-w-xl mb-10 leading-relaxed font-semibold uppercase tracking-tight"
            >
              Enterprise-grade AI infrastructure, designed for scale and high-density performance across all powered DigiPowerX sites.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-wrap items-center gap-6 mb-10"
            >
              <Link to="/contact" className="px-10 py-5 bg-[#f5c518] text-black font-semibold uppercase tracking-[0.2em] text-[11px] rounded-md hover:bg-white hover:text-black transition-all shadow-[0_15px_40px_rgba(245,197,24,0.35)] flex items-center gap-4 group cursor-pointer border border-[#f5c518] hover:border-white">
                Talk to Team <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/investors" className="flex items-center gap-3 px-10 py-5 border border-white/10 text-white font-semibold text-[11px] uppercase tracking-[0.2em] rounded-md bg-white/5 backdrop-blur-md hover:bg-white/10 hover:text-white transition-all group cursor-pointer">
                Investor Info <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Link>
            </motion.div>


          </motion.div>

          {/* RIGHT: 3D Animation */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full min-h-[450px] md:min-h-[550px] lg:min-h-[650px] relative"
          >
            <DGXXCubeAnimation />
          </motion.div>
        </div>

        {/* Bottom Snapshot Metrics (Full Width) */}
        <div className="w-full relative z-20 border-t border-white/5 bg-black/40 backdrop-blur-3xl">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-0 py-6 lg:py-10">
              {[
                { label: "Power Generation", val: "60MW" },
                { label: "Data Center", val: "22MW" },
                { label: "InfiniBand Fabric", val: "400G" },
                { label: "Modular Deploy", val: "ARMS" }
              ].map((item, i) => (
                <div key={i} className={`text-center px-6 ${i !== 3 ? 'md:border-r border-white/5' : ''}`}>
                  <p className="text-[#f5c518] font-semibold text-3xl md:text-4xl tracking-tighter mb-1.5 hover:scale-105 transition-transform duration-500">{item.val}</p>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/40">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 01 / Power & Colocation (Light) ── */}
      <section className="bg-[#f8f9fa] py-10 lg:py-16 relative overflow-hidden">
        {/* Subtle technical grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_10%,transparent_100%)] opacity-[0.03] pointer-events-none" />

        <div className="max-w-[1400px] mx-auto px-6 lg:px-20 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 lg:gap-12 mb-10 lg:mb-16">
            <div className="max-w-2xl">
              {/* <SectionLabel num="01" text="Infrastructure Layer" /> */}
              <h2 className="text-[clamp(2.5rem,6vw,5.5rem)] font-semibold leading-[0.95] tracking-tighter uppercase text-black mb-0 relative z-10 mt-4 lg:mt-8">
                POWER & <br /><span className="text-[#f5c518]">COLOCATION.</span>
              </h2>
            </div>
            <div className="max-w-md lg:text-right">
              <p className="text-gray-500 text-[15px] lg:text-lg font-medium leading-relaxed">
                Vertical integration at the physical layer. We own the generation, the substation, and the high-density floor space.
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Power Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white border border-gray-100 p-6 lg:p-12 relative group overflow-hidden"
            >
              {/* Card Blueprint Detail */}
              <div className="absolute top-0 right-0 p-4 opacity-10 font-mono text-[8px] text-black leading-tight pointer-events-none">
                PWR_GEN_MODULE v2.1<br />
                COORDS: 43.0292° N, 78.8783° W<br />
                STATUS: NOMINAL
              </div>

              <div className="flex flex-col h-full relative z-10">
                <div className="flex items-start justify-between mb-8 lg:mb-12">
                  <div className="w-16 h-16 bg-black text-[#f5c518] flex items-center justify-center shrink-0">
                    <Zap size={32} />
                  </div>
                  <span className="text-[10px] font-semibold text-gray-300 uppercase tracking-[0.3em] vertical-rl rotate-180">GEN_CAPACITY</span>
                </div>

                <h3 className="text-2xl lg:text-3xl font-semibold uppercase tracking-tighter text-black mb-3 lg:mb-4">Power Infrastructure</h3>
                <p className="text-gray-400 font-medium mb-8 lg:mb-12 text-sm uppercase tracking-widest">Generation & BTMG Access</p>

                <p className="text-gray-500 font-medium mb-8 lg:mb-12 text-[14px] lg:text-[15px] leading-relaxed">
                  Owned power generation at the North Tonawanda plant provides the cost foundation for all DigiPowerX services. Behind-the-meter generation reduces power cost to industry-leading levels.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 lg:gap-y-6 gap-x-8 mb-10 lg:mb-16">
                  {[
                    "60MW Gas Plant",
                    "BTMG Program Access",
                    "Grid Sell Optionality",
                    "Dual-Path Redundancy"
                  ].map((feat, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-1 h-1 bg-[#f5c518]" />
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-black/70">{feat}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-auto pt-8 border-t border-gray-50 flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-[#f5c518]">Scale to 500MW+</span>
                  <ArrowRight size={16} className="text-gray-300 group-hover:text-[#f5c518] group-hover:translate-x-2 transition-all" />
                </div>
              </div>
            </motion.div>

            {/* Colocation Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white border border-gray-100 p-6 lg:p-12 relative group overflow-hidden"
            >
              {/* Card Blueprint Detail */}
              <div className="absolute top-0 right-0 p-4 opacity-10 font-mono text-[8px] text-black leading-tight pointer-events-none">
                DC_COLO_FLOOR v4.0<br />
                DENSITY: 80KW/RACK<br />
                COOLING: DLC_ENABLED
              </div>

              <div className="flex flex-col h-full relative z-10">
                <div className="flex items-start justify-between mb-8 lg:mb-12">
                  <div className="w-16 h-16 bg-black text-[#f5c518] flex items-center justify-center shrink-0">
                    <Server size={32} />
                  </div>
                  <span className="text-[10px] font-semibold text-gray-300 uppercase tracking-[0.3em] vertical-rl rotate-180">SPACE_ALLOCATION</span>
                </div>

                <h3 className="text-2xl lg:text-3xl font-semibold uppercase tracking-tighter text-black mb-3 lg:mb-4">Data Center Colocation</h3>
                <p className="text-gray-400 font-medium mb-8 lg:mb-12 text-sm uppercase tracking-widest">AI-Ready High-Density Space</p>

                <p className="text-gray-500 font-medium mb-8 lg:mb-12 text-[14px] lg:text-[15px] leading-relaxed">
                  Our Alabama facility provides high-density colocation designed specifically for GPU workloads, featuring advanced cooling and massive development pathways.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 lg:gap-y-6 gap-x-8 mb-10 lg:mb-16">
                  {[
                    "22MW Operating Base",
                    "80kW+ Rack Density",
                    "Direct Liquid Cooling",
                    "24/7 Biometric Security"
                  ].map((feat, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-1 h-1 bg-[#f5c518]" />
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-black/70">{feat}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-auto pt-8 border-t border-gray-50 flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-[#f5c518]">Tier III Pathway</span>
                  <ArrowRight size={16} className="text-gray-300 group-hover:text-[#f5c518] group-hover:translate-x-2 transition-all" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 02 / Advanced Tech (Dark) ── */}
      <section className="bg-[#06070a] pt-5 pb-10 lg:py-15 relative overflow-hidden text-white border-y border-white/5">

        <div className="max-w-[1400px] mx-auto px-6 lg:px-20 relative z-10">
          <SectionLabel num="02" text="Compute & Modular" dark />

          <div className="grid lg:grid-cols-2 gap-16 lg:gap-32 items-center mb-20 lg:mb-32">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-[clamp(2.5rem,6vw,5.5rem)] font-semibold leading-[0.95] tracking-tighter uppercase text-white mb-6 lg:mb-8 relative z-10">
                NEOCLOUDZ <br /><span className="text-[#f5c518]">GPU CLUSTERS</span>
              </h3>
              <p className="text-gray-400 text-[15px] lg:text-lg mb-8 lg:mb-12 leading-relaxed font-medium">
                Dedicated bare-metal GPU capacity — NVIDIA B200 clusters with 400G InfiniBand fabric, targeting AI training, inference, and HPC workloads.
              </p>
              <ul className="space-y-4 lg:space-y-6 mb-8 lg:mb-12">
                <FeatureItem text="16-node B200 cluster standard modules" dark />
                <FeatureItem text="400G InfiniBand NDR fabric per cluster" dark />
                <FeatureItem text="No virtualization — dedicated hardware access" dark />
                <FeatureItem text="Real-time GPU utilization & VRAM telemetry" dark />
              </ul>
              <Link to="/neocloudz" className="px-10 py-5 bg-[#f5c518] text-black font-semibold uppercase tracking-widest text-[11px] hover:bg-white transition-all inline-block text-center">
                NeoCloudz Platform
              </Link>
            </motion.div>
            <div className="bg-black border border-white/10 overflow-hidden relative group shadow-2xl rounded-lg">
              <GpuClusterDashboard />
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 lg:gap-32 items-center">
            <div className="h-[600px] overflow-hidden relative group order-last lg:order-first rounded-3xl border border-white/5 shadow-2xl" style={{ background: 'radial-gradient(ellipse at center 55%, #0E0E0E 0%, #050505 80%)' }}>
              <Arms3D theme="dark" />
            </div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-[clamp(2.5rem,6vw,5.5rem)] font-semibold leading-[0.95] tracking-tighter uppercase text-white mb-6 lg:mb-8 relative z-10">
                ARMS <br /><span className="text-[#f5c518]">MODULAR SYSTEM</span>
              </h3>
              <p className="text-gray-400 text-[15px] lg:text-lg mb-8 lg:mb-12 leading-relaxed font-medium">
                The ARMS platform provides factory-built, repeatable data center blocks — compressing deployment timelines from months to weeks.
              </p>
              <ul className="space-y-4 lg:space-y-6 mb-8 lg:mb-12">
                <FeatureItem text="600kW base module — repeatable factory build" dark />
                <FeatureItem text="Three-module 1.8MW standard campus block" dark />
                <FeatureItem text="Site install connects to prepared power" dark />
                <FeatureItem text="Scalable across all DigiPowerX sites" dark />
              </ul>
              <Link to="/arms" className="px-10 py-5 bg-white/5 border border-white/10 text-white font-semibold uppercase tracking-widest text-[11px] hover:bg-white/10 transition-all inline-block text-center">
                ARMS Platform
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 03 / Integrated Advantage (Light & Sharp) ── */}
      <section className="bg-white pt-6 pb-6 lg:py-20 relative overflow-hidden">
        {/* Subtle background architecture */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gray-50/50 -skew-x-12 translate-x-32 pointer-events-none" />

        <div className="max-w-[1400px] mx-auto px-6 lg:px-20 relative z-10">
          <div className="flex flex-col items-center gap-2 mb-6 lg:mb-16 text-center">
            <div className="max-w-2xl w-full">
              <SectionLabel num="03" text="Synergy Layer" />
              <h2 className="text-[clamp(2rem,6vw,5.5rem)] font-semibold leading-[0.95] tracking-tighter uppercase text-black mb-0 relative z-10 text-center">
                INTEGRATED <br /><span className="text-[#f5c518]">ADVANTAGE.</span>
              </h2>
            </div>
          </div>
        </div>

        {/* Integration Flow Visual - Full Width */}
        <div className="mb-4 lg:mb-16 w-full bg-black text-white relative overflow-hidden py-6 lg:py-14">
          <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '100px 100px' }} />
          <div className="max-w-[1400px] mx-auto px-6 lg:px-20 relative z-10">

            {/* Mobile: stacked with horizontal dividers */}
            <div className="flex flex-col gap-0 md:hidden">
              {[
                { label: "01_POWER", desc: "60MW Owned Generation" },
                { label: "02_COLOCATION", desc: "AI-Ready High-Density Floor" },
                { label: "03_COMPUTE", desc: "Bare-Metal B200 Clusters" }
              ].map((step, i) => (
                <React.Fragment key={i}>
                  <div className="text-center py-4">
                    <span className="text-[10px] font-semibold text-[#f5c518] tracking-[0.4em] mb-1 block">{step.label}</span>
                    <p className="text-[15px] font-semibold uppercase tracking-tight">{step.desc}</p>
                  </div>
                  {i < 2 && <div className="w-full h-px bg-white/10 relative">
                    <motion.div
                      animate={{ left: ['0%', '100%'] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      className="absolute top-1/2 -translate-y-1/2 w-12 h-[2px] bg-gradient-to-r from-transparent via-[#f5c518] to-transparent"
                    />
                  </div>}
                </React.Fragment>
              ))}
            </div>

            {/* Tablet/Desktop: horizontal row with animated connectors */}
            <div className="hidden md:flex items-center justify-between gap-4 lg:gap-8 xl:gap-12">
              {[
                { label: "01_POWER", desc: "60MW Owned Generation" },
                { label: "02_COLOCATION", desc: "AI-Ready High-Density Floor" },
                { label: "03_COMPUTE", desc: "Bare-Metal B200 Clusters" }
              ].map((step, i) => (
                <React.Fragment key={i}>
                  <div className="text-left group/step min-w-0">
                    <span className="text-[9px] lg:text-[10px] font-semibold text-[#f5c518] tracking-[0.3em] lg:tracking-[0.4em] mb-1 lg:mb-4 block group-hover/step:translate-x-2 transition-transform duration-500">{step.label}</span>
                    <p className="text-sm md:text-base lg:text-xl xl:text-2xl font-semibold uppercase tracking-tighter break-words">{step.desc}</p>
                  </div>
                  {i < 2 && (
                    <div className="h-px flex-1 bg-white/10 relative min-w-[24px] lg:min-w-[40px] shrink-0">
                      <motion.div
                        animate={{ left: ['0%', '100%'] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="absolute top-1/2 -translate-y-1/2 w-8 lg:w-12 h-[2px] bg-gradient-to-r from-transparent via-[#f5c518] to-transparent"
                      />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>

          </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-6 lg:px-20 relative z-10">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-200 border border-gray-200">
            {[
              { title: "Owned Power", desc: "Sub-$0.05/kWh cost structure flows through to every layer of colocation and compute." },
              { title: "Speed to Capacity", desc: "Existing substations and load studies eliminate the primary bottleneck for deployments." },
              { title: "Vertical Integration", desc: "One company owns every layer — no finger-pointing between utility and compute." },
              { title: "Multi-Layer", desc: "Consume power, space, and compute independently or as an integrated package." }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-4 lg:p-10 bg-white group hover:bg-black transition-all duration-500"
              >
                <span className="text-[10px] font-semibold text-[#f5c518] mb-3 lg:mb-6 block">0{i + 1}</span>
                <h4 className="text-base lg:text-2xl font-semibold uppercase tracking-tight text-black group-hover:text-white mb-2 lg:mb-5 transition-colors">{item.title}</h4>
                <p className="text-gray-500 text-[12px] leading-relaxed font-medium group-hover:text-gray-400 transition-colors">{item.desc}</p>
                <div className="mt-4 lg:mt-10 h-1 w-8 bg-[#f5c518] group-hover:w-full transition-all duration-700 origin-left" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 04 / Final CTA (Dark) ── */}
      <CTASection />

    </div>
  );
}







