"use client";

import React from 'react';
import { m } from 'framer-motion';
import { ArrowUpRight, Cpu, Zap, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function NvidiaRubinDeal() {
  return (
    <section id="nvidia-rubin-deal" className="bg-[#050505] py-20 lg:py-24 px-6 relative overflow-hidden border-t border-white/5">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-[#f5c518]/5 rounded-full blur-[140px] -translate-y-1/2 -translate-x-1/3 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#00e878]/3 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 items-center">
          
          {/* LEFT: Technology Leadership Narrative & Stat Grid */}
          <div className="lg:col-span-7 space-y-10 text-left">
            {/* Tagline */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#ffc629]/20 bg-[#ffc629]/5 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ffc629] animate-ping" />
              <span className="text-[9px] font-black uppercase tracking-[0.25em] font-mono text-[#ffc629]">
                Next-Gen Compute Protocol
              </span>
            </div>

            {/* Headline */}
            <h2 className="text-[clamp(2.2rem,4vw,4.5rem)] font-normal leading-[1.05] tracking-tight uppercase">
              <span className="text-white">NVIDIA</span> <span className="text-[#ffc629]">Vera Rubin Systems</span>
            </h2>

            {/* Sub-headline */}
            <p className="text-white/50 text-[15px] leading-relaxed max-w-xl font-medium">
              DigiPowerX is positioned at the absolute forefront of NVIDIA's next-generation rack-scale Rubin architecture, keeping our NeoCloudz platform at the leading edge of AI compute.
            </p>

            {/* Stat Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-4 border-t border-white/5">
              <div>
                <div className="text-3xl md:text-4.5xl font-black text-white font-mono tracking-tight">Q1 2027</div>
                <div className="text-[#ffc629] text-[9px] font-bold uppercase tracking-wider mt-1 font-mono">Early Access Target</div>
                <div className="text-white/35 text-[10px] mt-1 leading-relaxed">Early deployment timeline for next-gen Rubin systems.</div>
              </div>

              <div>
                <div className="text-3xl md:text-4.5xl font-black text-white font-mono tracking-tight">NVLink 6</div>
                <div className="text-[#ffc629] text-[9px] font-bold uppercase tracking-wider mt-1 font-mono">Ultra-Speed Fabric</div>
                <div className="text-white/35 text-[10px] mt-1 leading-relaxed">Direct CPU-to-GPU mesh with zero bandwidth bottleneck.</div>
              </div>

              <div>
                <div className="text-3xl md:text-4.5xl font-black text-white font-mono tracking-tight">288GB</div>
                <div className="text-[#ffc629] text-[9px] font-bold uppercase tracking-wider mt-1 font-mono">HBM4 Memory</div>
                <div className="text-white/35 text-[10px] mt-1 leading-relaxed">Unparalleled VRAM buffer for large-scale AI training.</div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-2">
              <Link href="/press-releases" className="btn-global btn-primary group">
                Read Press Release
                <ArrowUpRight size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
              </Link>
            </div>
          </div>

          {/* RIGHT: Live Infrastructure Telemetry Dashboard */}
          <div className="lg:col-span-5 relative">
            {/* Outer Decorative Brackets */}
            <div className="absolute top-[-1.5rem] left-[-1.5rem] w-10 h-10 border-t border-l border-white/10 pointer-events-none" />
            <div className="absolute bottom-[-1.5rem] right-[-1.5rem] w-10 h-10 border-b border-r border-white/10 pointer-events-none" />

            <div className="space-y-4">
              {/* Telemetry Card: Rubin Specs */}
              <div className="bg-[#07080b]/75 backdrop-blur-xl border border-white/5 rounded-2xl p-5 hover:border-[#ffc629]/20 transition-all duration-500 shadow-[0_15px_35px_rgba(0,0,0,0.5)]">
                <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2.5">
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-white/30 flex items-center gap-1.5">
                    <Cpu size={12} className="text-[#ffc629]" />
                    Hardware profile
                  </span>
                  <span className="text-[8px] font-mono font-bold text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded">Vera CPU Integrated</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-lg font-bold text-white tracking-tight">RUBIN GPU ARCHITECTURE</span>
                  <span className="text-[9px] font-mono text-[#ffc629] font-bold">288GB HBM4</span>
                </div>
                <p className="text-[10px] text-white/40 leading-relaxed mt-2">
                  Pairing advanced Rubin GPUs with Vera processors over a high-bandwidth NVLink 6 interconnect fabric.
                </p>
              </div>

              {/* Telemetry Card: Technology Leadership */}
              <div className="bg-[#07080b]/75 backdrop-blur-xl border border-white/5 rounded-2xl p-5 hover:border-[#ffc629]/20 transition-all duration-500 shadow-[0_15px_35px_rgba(0,0,0,0.5)]">
                <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2.5">
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-white/30 flex items-center gap-1.5">
                    <TrendingUp size={12} className="text-[#ffc629]" />
                    Market Leadership
                  </span>
                  <span className="text-[8px] font-mono font-bold text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded">Early Access</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-lg font-bold text-white tracking-tight">EARLY ACCESS TIMELINE</span>
                  <span className="text-[9px] font-mono text-[#ffc629] font-bold">Q1 2027 TARGET</span>
                </div>
                <p className="text-[10px] text-white/40 leading-relaxed mt-2">
                  Among the first global operators to deploy NVIDIA Rubin platforms, securing early-access compute nodes for our NeoCloudz customer base.
                </p>
              </div>


            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
