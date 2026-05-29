import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Footer, CTASection } from './Footer';
import { Zap, Shield, BatteryCharging, Activity, Server, Cpu } from 'lucide-react';
import EnergyFlowDiagram from './EnergyFlowDiagram';
import CubeGridNetwork3D from './CubeGridNetwork3D';
import DGXXModularScale from './DGXXModularScale';

const Infrastructure = () => {
  return (
    <div className="bg-[#06070a] min-h-screen text-white font-sans selection:bg-[#f5c518]/30 overflow-x-hidden">

      {/* Hero Section */}
      <section className="relative min-h-[70vh] lg:min-h-[100vh] flex flex-col items-center justify-center pt-32 pb-12 md:pt-40 md:pb-24 px-6 overflow-hidden">

        {/* Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-[#f5c518]/[0.06] rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-[#f5c518]/[0.04] rounded-full blur-[120px] pointer-events-none translate-x-1/4" />

        {/* Subtle Grid Overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(to right, #f5c518 1px, transparent 1px), linear-gradient(to bottom, #f5c518 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />

        {/* Content Container */}
        <div className="relative z-10 w-full max-w-[1700px] mx-auto flex flex-col lg:grid lg:grid-cols-12 items-start lg:pt-12 gap-12 lg:gap-8 pt-6 pb-12">

          {/* Left Column: Hero Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 flex flex-col items-center text-center lg:items-start lg:text-left w-full lg:pl-4 xl:pl-8"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#f5c518]/20 bg-[#f5c518]/5 backdrop-blur-md mb-8 shadow-[0_0_20px_rgba(245,197,24,0.1)]">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f5c518] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#f5c518]"></span>
              </span>
              <Zap size={12} className="text-[#f5c518]" />
              <span className="text-[10px] uppercase tracking-[0.3em] font-medium text-[#f5c518]">
                Power Generation & Management
              </span>
            </div>

            {/* Title */}
            <h1 className="text-[clamp(2.5rem,5.5vw,5.5rem)] font-bold tracking-tighter leading-[0.92] text-center lg:text-left mb-6 uppercase relative z-10">
              <span className="block text-white">ENERGY</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#f5c518] via-[#ffda66] to-[#d4a017]">
                PORTFOLIO
              </span>
            </h1>

            {/* Accent Line */}
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
              <div className="h-[2px] w-12 bg-gradient-to-r from-[#f5c518] to-transparent" />
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/40">
                400MW+ Pipeline · Texarkana
              </span>
            </div>

            {/* Subheading */}
            <p className="text-white/60 text-sm md:text-lg max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed font-medium tracking-wide">
              DigiPowerX controls the foundation of the AI revolution: <strong className="text-white">Raw Power</strong>.
              From owned generation assets to advanced grid interconnection, we provide the megawatt capacity required for next-generation computing.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 w-full sm:w-auto mb-8 lg:mb-0">
              <Link
                to="/contact"
                className="group w-full sm:w-auto px-10 py-4 bg-[#f5c518] text-black text-center font-bold uppercase tracking-[0.2em] text-[10px] rounded-md transition-all hover:bg-[#ffd84d] hover:shadow-[0_0_40px_rgba(245,197,24,0.4)] active:scale-95 relative overflow-hidden"
              >
                <span className="relative z-10">Inquire Capacity →</span>
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </Link>
              <Link
                to="/about"
                className="w-full sm:w-auto px-10 py-4 border border-white/10 text-white text-center font-bold uppercase tracking-[0.2em] text-[10px] rounded-md bg-white/5 backdrop-blur-md transition-all hover:bg-white/10 hover:border-[#f5c518]/30"
              >
                Learn More
              </Link>
            </div>
          </motion.div>

          {/* Right Column: Cube Grid Network Animation */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-7 w-full relative flex items-center justify-center"
          >
            <div className="w-full h-[620px] sm:h-[600px] md:h-[660px] lg:h-[720px] xl:h-[760px] relative">

              {/* Outer glow halo */}
              <div className="absolute -inset-10 bg-[radial-gradient(circle_at_center,rgba(245,197,24,0.15),transparent_60%)] blur-2xl pointer-events-none" />

              {/* Inner amber wash */}
              <div className="absolute inset-0 bg-gradient-radial from-[#f5c518]/10 via-transparent to-transparent blur-3xl pointer-events-none" />

              {/* Decorative concentric rings */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] aspect-square rounded-full border border-white/[0.04] pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] aspect-square rounded-full border border-[#f5c518]/[0.08] pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[35%] aspect-square rounded-full border border-[#f5c518]/[0.12] pointer-events-none" />

              {/* Corner accents */}
              <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-[#f5c518]/40 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-[#f5c518]/40 pointer-events-none" />
              <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-white/10 pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-white/10 pointer-events-none" />

              {/* Coordinate markers */}


              {/* The 3D canvas */}
              <div className="absolute inset-0">
                <DGXXModularScale />
              </div>

              {/* Floating label badge */}
              <div className="absolute bottom-4 right-4 lg:bottom-6 lg:right-6 flex items-center gap-2 bg-black/60 backdrop-blur-md border border-white/10 rounded-full px-3 py-1.5 pointer-events-none">
                <div className="h-1.5 w-1.5 rounded-full bg-[#f5c518] animate-pulse" />
                <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-white/60">DGXX · Modular Scale</span>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Power Flow Section: From Generation to GPU Load */}
      <section className="bg-white py-24 px-6 relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto relative z-10">

          {/* Top Badge */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center px-6 py-2.5 rounded-full border border-black/10 bg-[#f5f5f5] shadow-sm">
              <Zap size={14} className="text-[#f5c518] mr-3" />
              <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-black/80">
                Energy Flow Matrix
              </span>
            </div>
          </div>

          {/* Heading */}
          <div className="text-center mb-6">
            <h2 className="text-[clamp(2.5rem,5vw,4.5rem)] font-bold leading-[0.95] tracking-tighter uppercase text-black">
              From Generation<br />
              to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4a017] to-[#f5c518]">GPU Load.</span>
            </h2>
          </div>

          {/* Subtext */}
          <div className="max-w-3xl mx-auto text-center mb-20">
            <p className="text-black/60 text-lg leading-[1.6] font-medium tracking-tight">
              The DigiPowerX infrastructure story starts at the source. By operating our own generation assets and substation distribution paths, we bypass the grid bottlenecks that throttle traditional data center expansion.
            </p>
          </div>

          {/* Main Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Left Column: Feature Cards (2x2) */}
            <div className="lg:col-span-5 grid grid-cols-1 gap-4">
              {[
                { title: "Owned Generation Base", text: "Direct control over power production allows us to dramatically lower energy costs while securing long-term availability.", icon: <Zap size={20} className="text-[#f5c518]" /> },
                { title: "Behind-The-Meter Economics", text: "Bypassing public transmission lines reduces distribution costs, delivering direct-to-compute power efficiency.", icon: <BatteryCharging size={20} className="text-[#f5c518]" /> },
                { title: "Substation Control", text: "Owned switchgear and transformation infrastructure guarantees high-voltage capacity scaling on our own timeline.", icon: <Activity size={20} className="text-[#f5c518]" /> },
                { title: "Compute Conversion", text: "Every megawatt generated is purposefully conditioned for high-density AI and HPC workloads.", icon: <Cpu size={20} className="text-[#f5c518]" /> }
              ].map((feature, i) => (
                <div key={i} className="bg-[#f8f9fa] p-8 rounded-2xl border border-black/[0.04] shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:border-black/[0.08] transition-all duration-300 group">
                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-black font-bold text-lg mb-2">{feature.title}</h3>
                      <p className="text-black/60 text-sm leading-[1.6] font-medium">
                        {feature.text}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column: Existing Animated Visual */}
            <div className="lg:col-span-7 relative flex justify-center lg:justify-end">
              <div className="w-full max-w-[800px] bg-[#f8f9fa] rounded-3xl p-6 md:p-12 border border-black/[0.04] shadow-xl">
                <EnergyFlowDiagram />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Infrastructure Layers Section */}
      <section className="bg-[#06070a] py-24 px-6 border-y border-white/5 relative overflow-hidden">

        {/* Abstract Background */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#f5c518]/5 rounded-full blur-[150px] pointer-events-none translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[150px] pointer-events-none -translate-x-1/3 translate-y-1/3" />

        <div className="max-w-[1400px] mx-auto relative z-10">

          {/* Top Badge */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center px-5 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
              <span className="text-[10px] font-mono text-[#f5c518] uppercase tracking-[0.2em] mr-3">01 /</span>
              <div className="w-8 h-[1px] bg-white/20 mr-3"></div>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white">
                Energy Stack Layers
              </span>
            </div>
          </div>

          {/* Heading */}
          <div className="text-center mb-6">
            <h2 className="text-[clamp(2.5rem,5vw,4.5rem)] font-bold leading-[0.95] tracking-tighter uppercase text-white mb-6">
              Powering Compute <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f5c518] to-[#ffda66]">From The Ground Up.</span>
            </h2>
          </div>

          {/* Subtext */}
          <div className="max-w-3xl mx-auto text-center mb-20">
            <p className="text-white/50 text-lg leading-relaxed font-medium">
              In the high-density computing era, energy is the ultimate currency. We don't just secure power—we generate it, transform it, and deliver it to the rack with unmatched efficiency and scale.
            </p>
          </div>

          {/* 3-Column Layers Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Column 1: Generation */}
            <div className="bg-[#0a0b0f] p-10 md:p-12 rounded-3xl border border-white/5 hover:border-[#f5c518]/30 transition-all duration-500 group relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:via-[#f5c518] transition-all duration-500" />

              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-[#f5c518]/10 transition-all duration-500">
                <Zap size={28} className="text-white group-hover:text-[#f5c518] transition-colors" />
              </div>

              <div className="text-[#f5c518] text-[11px] font-bold uppercase tracking-[0.2em] mb-3">Layer 1</div>
              <h3 className="text-white text-2xl font-bold uppercase mb-4 tracking-tight">Generation Assets</h3>
              <p className="text-white/50 text-sm leading-relaxed mb-8 font-medium">
                Owned power generation secures our foundation, shielding operations from market volatility and eliminating utility queue bottlenecks.
              </p>

              <div className="space-y-4 pt-6 border-t border-white/5">
                {[
                  "Natural gas & renewable integration",
                  "60MW base capacity scaling to 400MW+",
                  "Insulated from grid pricing spikes",
                  "Modular generation expansion capabilities"
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#f5c518] flex-shrink-0" />
                    <span className="text-white/70 text-[13px] font-medium leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 2: Substation */}
            <div className="bg-[#0a0b0f] p-10 md:p-12 rounded-3xl border border-white/5 hover:border-[#f5c518]/30 transition-all duration-500 group relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:via-[#f5c518] transition-all duration-500" />

              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-[#f5c518]/10 transition-all duration-500">
                <Activity size={28} className="text-white group-hover:text-[#f5c518] transition-colors" />
              </div>

              <div className="text-[#f5c518] text-[11px] font-bold uppercase tracking-[0.2em] mb-3">Layer 2</div>
              <h3 className="text-white text-2xl font-bold uppercase mb-4 tracking-tight">Transformation</h3>
              <p className="text-white/50 text-sm leading-relaxed mb-8 font-medium">
                Strategic substation control provides the high-voltage gateway necessary for rapid, large-scale data center deployment.
              </p>

              <div className="space-y-4 pt-6 border-t border-white/5">
                {[
                  "Direct high-voltage grid interconnection",
                  "Redundant transformation architecture",
                  "Tier III equivalent reliability path",
                  "Optimized transmission line efficiency"
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#f5c518] flex-shrink-0" />
                    <span className="text-white/70 text-[13px] font-medium leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 3: Compute */}
            <div className="bg-[#0a0b0f] p-10 md:p-12 rounded-3xl border border-white/5 hover:border-[#f5c518]/30 transition-all duration-500 group relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:via-[#f5c518] transition-all duration-500" />

              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-[#f5c518]/10 transition-all duration-500">
                <Server size={28} className="text-white group-hover:text-[#f5c518] transition-colors" />
              </div>

              <div className="text-[#f5c518] text-[11px] font-bold uppercase tracking-[0.2em] mb-3">Layer 3</div>
              <h3 className="text-white text-2xl font-bold uppercase mb-4 tracking-tight">Compute Delivery</h3>
              <p className="text-white/50 text-sm leading-relaxed mb-8 font-medium">
                We convert raw energy into the highest-margin output: compute-ready capacity optimized for intensive AI workloads.
              </p>

              <div className="space-y-4 pt-6 border-t border-white/5">
                {[
                  "High-density rack power architecture",
                  "Advanced liquid cooling readiness",
                  "Maximized compute-per-megawatt ratio",
                  "Flexible collocation & bare-metal deployment"
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#f5c518] flex-shrink-0" />
                    <span className="text-white/70 text-[13px] font-medium leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Value Chain Section: Pipeline Overview */}
      <section className="bg-white py-24 px-6">
        <div className="max-w-[1400px] mx-auto">

          {/* Heading */}
          <div className="text-center mb-16">
            <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-bold leading-[1] tracking-tight uppercase text-black">
              The Energy Economics Advantage.
            </h2>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            {/* Card 1: Strategic Independence */}
            <div className="bg-gradient-to-br from-[#14151a] via-[#0b0c10] to-[#050608] text-white p-12 rounded-3xl relative overflow-hidden group border border-white/[0.06] hover:border-[#f5c518]/50 hover:from-[#1f1a0e] hover:to-[#090805] shadow-[0_15px_40px_rgba(0,0,0,0.6)] hover:shadow-[0_20px_50px_rgba(245,197,24,0.18)] transition-all duration-500 ease-out">
              {/* Animated Ambient Light */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-b from-[#f5c518]/15 to-transparent rounded-full blur-[90px] -translate-y-1/2 translate-x-1/2 group-hover:scale-135 group-hover:from-[#f5c518]/25 transition-all duration-500 pointer-events-none" />

              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#f5c518]/20 to-[#f5c518]/5 flex items-center justify-center border border-[#f5c518]/30 group-hover:from-[#f5c518]/30 group-hover:to-[#f5c518]/10 group-hover:border-[#f5c518]/60 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(245,197,24,0.3)] transition-all duration-300">
                  <Shield size={20} className="text-[#f5c518] group-hover:rotate-[12deg] transition-transform duration-300" />
                </div>
                <h3 className="text-2xl font-bold uppercase tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#f5c518] group-hover:to-[#ffd84d] transition-all duration-300">Strategic Independence</h3>
              </div>

              <p className="text-white/70 text-lg leading-relaxed font-medium mb-8">
                While competitors lease capacity and wait years in utility interconnection queues, our vertical integration strategy places us years ahead. We control the power source, dictating our own timelines.
              </p>

              <div className="p-6 bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/10 rounded-2xl group-hover:from-[#f5c518]/10 group-hover:to-[#f5c518]/[0.02] group-hover:border-[#f5c518]/30 group-hover:shadow-[inset_0_0_20px_rgba(245,197,24,0.05)] transition-all duration-500">
                <div className="text-transparent bg-clip-text bg-gradient-to-r from-[#f5c518] to-[#ffda66] font-bold text-3xl mb-1">0 Wait Time</div>
                <div className="text-white/50 text-xs font-bold uppercase tracking-widest">For primary grid queue approvals</div>
              </div>
            </div>

            {/* Card 2: Margin Expansion */}
            <div className="bg-gradient-to-br from-[#14151a] via-[#0b0c10] to-[#050608] text-white p-12 rounded-3xl relative overflow-hidden group border border-white/[0.06] hover:border-[#f5c518]/50 hover:from-[#1f1a0e] hover:to-[#090805] shadow-[0_15px_40px_rgba(0,0,0,0.6)] hover:shadow-[0_20px_50px_rgba(245,197,24,0.18)] transition-all duration-500 ease-out">
              {/* Animated Ambient Light */}
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-t from-[#f5c518]/10 to-transparent rounded-full blur-[90px] translate-y-1/2 -translate-x-1/2 group-hover:scale-135 group-hover:from-[#f5c518]/20 transition-all duration-500 pointer-events-none" />

              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#f5c518]/20 to-[#f5c518]/5 flex items-center justify-center border border-[#f5c518]/30 group-hover:from-[#f5c518]/30 group-hover:to-[#f5c518]/10 group-hover:border-[#f5c518]/60 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(245,197,24,0.3)] transition-all duration-300">
                  <Activity size={20} className="text-[#f5c518] group-hover:rotate-[12deg] transition-transform duration-300" />
                </div>
                <h3 className="text-2xl font-bold uppercase tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#f5c518] group-hover:to-[#ffd84d] transition-all duration-300">Margin Expansion</h3>
              </div>

              <p className="text-white/70 text-lg leading-relaxed font-medium mb-8">
                The shift from standard enterprise colocation to AI-centric infrastructure requires massive power density. By owning the generation, we capture the margin at every step of the energy-to-compute conversion.
              </p>

              <div className="p-6 bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/10 rounded-2xl group-hover:from-[#f5c518]/10 group-hover:to-[#f5c518]/[0.02] group-hover:border-[#f5c518]/30 group-hover:shadow-[inset_0_0_20px_rgba(245,197,24,0.05)] transition-all duration-500">
                <div className="text-transparent bg-clip-text bg-gradient-to-r from-[#f5c518] to-[#ffda66] font-bold text-3xl mb-1">Highest Value</div>
                <div className="text-white/50 text-xs font-bold uppercase tracking-widest">Yield per megawatt generated</div>
              </div>
            </div>
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
              { val: "~$0.04/kWh", label: "STRUCTURAL COST ADVANTAGE", desc: "Target power production cost cited for North Texarkana site, beating market rates." },
              { val: "Behind-the-Meter", label: "TRANSMISSION EFFICIENCY", desc: "Direct distribution program drastically reduces grid transmission and delivery fees." },
              { val: "2N Redundancy", label: "REVENUE OPTIONALITY", desc: "Dual-path interconnection enables Tier III equivalent uptime for critical AI loads." },
              { val: "400MW+", label: "PIPELINE CAPACITY", desc: "Combined existing and expansion energy capacity designated for compute conversion." }
            ].map((stat, i) => (
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
                    {stat.label}
                  </span>

                  <span className="text-white/40 text-[13px] font-medium leading-relaxed mt-1 group-hover:text-white/70 transition-colors duration-300">
                    {stat.desc}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <CTASection />
    </div>
  );
};

export default Infrastructure;
