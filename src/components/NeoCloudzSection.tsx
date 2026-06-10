"use client";

import React, { useState, useEffect } from 'react';
import { m } from 'framer-motion';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const NeoCloudzClusterCanvas = dynamic(() => import('./NeoCloudzClusterCanvas'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-black/40 rounded-lg animate-pulse" />,
});

const allLines = [
  'GPU 0-7: NVIDIA B200 · 192GB HBM3e each',
  '',
  'neocloudz:~ $ nvidia-smi --query',
  '',
  'All systems nominal · PUE 1.12',
  '',
  '[INFO] Cluster: 16x B200 | InfiniBand: 400G',
  '[INFO] VRAM per node: 192 GB | Total: 3.07 TB',
  '[INFO] Provisioned in 00:00:47 — SLA: <60s ✔',
  '',
  'trainer.train()... [STEP 500] loss=1.0887',
  '',
  'neocloudz:~ $ provision b200 --count 8 --fabric ib400g',
  'Allocating node cluster [██████████] 100%',
  'InfiniBand fabric: 400Gb/s · ready',
];

type TerminalLine = { id: number; text: string };

const Terminal = () => {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const lineIdRef = React.useRef(0);

  useEffect(() => {
    let currentIdx = 0;
    const interval = setInterval(() => {
      const id = lineIdRef.current++;
      setLines(prev => {
        const nextLines = [...prev, { id, text: allLines[currentIdx] }];
        if (nextLines.length > 15) nextLines.shift();
        return nextLines;
      });
      currentIdx = (currentIdx + 1) % allLines.length;
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#020503] rounded-xl border border-[#00e878]/20 overflow-hidden font-mono text-[11px] md:text-[12px] h-[380px] shadow-[0_0_60px_rgba(0,232,120,0.06)] relative group w-full">

      {/* Header */}
      <div className="bg-[#040806] border-b border-[#00e878]/20 px-4 py-3 flex items-center justify-between">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
          <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
        </div>
        <div className="text-[#00e878]/80 text-[10px] md:text-[11px] tracking-[0.25em] font-semibold uppercase">GPU_NODE_ENGINE_V4</div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-[#00e878] rounded-full shadow-[0_0_8px_rgba(0,232,120,0.8)] animate-pulse" />
          <span className="text-[#00e878] text-[9px] tracking-widest uppercase font-bold hidden sm:block">RUNNING</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 md:p-8 space-y-[6px] relative z-10 overflow-y-auto h-full text-left">
        {lines.map((line) => (
          <div key={line.id} className={`${line.text.startsWith('[INFO]') ? 'text-[#00e878]/50' :
            line.text.includes('neocloudz:~ $') ? 'text-[#00e878] font-bold drop-shadow-[0_0_5px_rgba(0,232,120,0.5)]' :
              'text-[#00e878]/70'
            } whitespace-nowrap overflow-hidden text-ellipsis tracking-wide leading-relaxed`}>
            {line.text}
          </div>
        ))}
        <div className="flex items-center gap-2 mt-2">
          <span className="w-2 h-4 bg-[#00e878] animate-pulse" />
        </div>
      </div>
    </div>
  );
};

const NeoCloudzSection = () => {
  return (
    <section id="neocloudz" className="bg-[#050505] pt-10 pb-8 md:pb-12 px-6 lg:px-20 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-[#00e878]/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />

      <div className="max-w-[1200px] mx-auto flex flex-col items-center">

        {/* === TOP CENTERED SECTION === */}
        <div className="flex flex-col items-center text-center w-full mb-20">

          {/* Centered Pill */}
          <m.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-10"
          >
            <div className="inline-flex items-center gap-5 bg-transparent border border-white/20 rounded-full px-6 py-2 hover:border-[#00e878]/40 transition-colors duration-500">
              <div className="h-[1px] w-12 bg-[#00e878]/60" />
              <span className="text-[10px] font-bold tracking-[0.2em] text-[#00e878] uppercase">WHOLLY OWNED SUBSIDIARY</span>
            </div>
          </m.div>

          {/* Main Title (Inline) */}
          <m.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-[clamp(2.5rem,6vw,5.5rem)] font-semibold leading-[1.1] tracking-tight uppercase mb-6"
          >
            <span className="text-white">MEET </span>
            <span className="text-[#00e878] drop-shadow-[0_0_15px_rgba(0,232,120,0.3)]">NEO</span>
            <span className="text-white"> CLOUDZ.</span>
          </m.h2>

          {/* Description */}
          <m.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-gray-300 text-[15px] md:text-[17px] leading-relaxed max-w-[800px]"
          >
            NeoCloudz is DigiPowerX's GPU compute platform — delivering NVIDIA Blackwell bare-metal infrastructure directly from our owned data centers.
          </m.p>
        </div>

        {/* === BOTTOM SPLIT SECTION === */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">

          {/* Left Side: Bullet Points and Buttons */}
          <m.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col space-y-12 lg:pr-4"
          >
            {/* Features List */}
            <ul className="space-y-6">
              {[
                'NVIDIA Blackwell GPU clusters',
                'Bare-metal, no virtualization overhead',
                '400Gb/s InfiniBand fabric',
                'Provisioned in <60 seconds'
              ].map(item => (
                <li key={item} className="flex items-center gap-4 text-white/80 text-[15px] md:text-[16px] font-medium tracking-wide">
                  <span className="text-[#00e878] text-[12px] font-bold">➜</span> {item}
                </li>
              ))}
            </ul>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-5 pt-4">
              <a href="https://www.neocloudz.com/" target="_blank" rel="noopener noreferrer" className="bg-[#00e878] text-[#050505] px-8 py-3.5 rounded-lg font-semibold text-[13px] uppercase tracking-widest hover:bg-[#00e878]/90 hover:shadow-[0_0_20px_rgba(0,232,120,0.3)] transition-all w-full sm:w-auto text-center inline-flex items-center justify-center">
                VISIT NEOCLOUDZ
              </a>
              <Link href="/contact" className="bg-transparent border border-brand-yellow text-white px-8 py-3.5 rounded-lg font-bold text-[14px] hover:bg-brand-yellow/10 transition-all w-full sm:w-auto text-center">
                Talk to Sales
              </Link>
            </div>
          </m.div>

          {/* Right Side: Terminal */}
          <m.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.4, ease: "easeOut" }}
            className="relative w-full"
          >
            {/* Subtle decorative corner accent matching image */}
            <div className="relative pl-6 pt-6">
              <div className="absolute top-0 left-0 w-20 h-20 border-t border-l border-[#00e878]/30 pointer-events-none" />
              <div className="absolute bottom-[-1.5rem] right-[-1.5rem] w-20 h-20 border-b border-r border-[#00e878]/30 pointer-events-none" />
              <NeoCloudzClusterCanvas />
            </div>
          </m.div>

        </div>

      </div>
    </section>
  );
};

export default NeoCloudzSection;
