import React from 'react';
import { motion } from 'framer-motion';
import NeoCloudzClusterCanvas from './NeoCloudzClusterCanvas';
import DigiPowerXMap from './DigiPowerXMap';
import ModularUnitVisual from './ModularUnitVisual';
import USDataCenter3D from './USDataCenter3D';

const WorldMapVisual = () => {
  return (
    <div className="relative w-full h-full bg-black rounded-lg overflow-hidden border border-white/5 shadow-2xl flex items-center justify-center p-0">
      {/* High-Fidelity World Map Background */}
      <div className="absolute inset-0 opacity-40 mix-blend-screen">
        <img
          src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=2066&auto=format&fit=crop"
          alt="World Map Texture"
          className="w-full h-full object-cover grayscale brightness-50"
        />
      </div>

      <svg viewBox="0 0 1000 500" className="relative w-full h-full z-10 select-none">
        {/* Abstract World Path */}
        <path
          fill="#111"
          d="M150,120 L220,100 L300,120 L350,200 L320,280 L250,350 L180,300 L150,200 Z M450,100 L550,80 L650,120 L700,200 L650,300 L550,350 L450,300 Z"
          className="opacity-50"
        />

        {/* Highlighted USA Silhouette */}
        <g transform="translate(60, 130) scale(1.2)">
          <path
            d="M0,20 L10,15 L25,20 L40,10 L60,15 L80,10 L100,20 L115,40 L125,70 L110,100 L90,110 L70,105 L50,110 L30,105 L15,115 L0,100 L-10,60 Z"
            fill="none"
            stroke="#f5c518"
            strokeWidth="1.5"
            strokeOpacity="0.8"
          />
          <path d="M20,20 L20,110 M40,15 L40,110 M60,15 L60,105 M80,10 L80,105 M100,20 L100,110" stroke="#f5c518" strokeWidth="0.5" strokeOpacity="0.1" fill="none" />
        </g>

        {/* Connection Arcs */}
        <g fill="none" stroke="#f5c518" strokeWidth="1.5" strokeLinecap="round">
          <motion.path
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.8 }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            d="M210,175 Q380,50 500,320"
          />
          <motion.path
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.6 }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            d="M210,175 Q500,150 780,350"
            strokeDasharray="6 4"
          />
        </g>

        {/* Animated Particles */}
        <circle r="3" fill="#f5c518" filter="blur(2px)">
          <animateMotion dur="3s" repeatCount="indefinite" path="M210,175 Q380,50 500,320" />
        </circle>
        <circle r="2" fill="#f5c518">
          <animateMotion dur="4s" repeatCount="indefinite" path="M210,175 Q500,150 780,350" />
        </circle>

        {/* Focal Nodes */}
        {[
          { x: 210, y: 175 }, { x: 210, y: 210 }, { x: 500, y: 320 }, { x: 780, y: 350 }
        ].map((node, i) => (
          <g key={i}>
            <circle cx={node.x} cy={node.y} r="4" fill="#f5c518">
              <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx={node.x} cy={node.y} r="12" fill="#f5c518" opacity="0.15" />
          </g>
        ))}
      </svg>

      {/* HTML Labels */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[22%] left-[16%] flex flex-col items-center">
          <div className="bg-black border border-[#f5c518] px-3 py-1.5 rounded shadow-xl">
            <span className="text-[10px] font-black text-white uppercase tracking-widest">Buffalo, NY</span>
          </div>
          <div className="w-px h-12 bg-gradient-to-b from-[#f5c518] to-transparent" />
        </div>
        <div className="absolute top-[42%] left-[23%] flex items-center">
          <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#f5c518]" />
          <div className="bg-black border border-[#f5c518] px-3 py-1.5 rounded shadow-xl ml-2 whitespace-nowrap">
            <span className="text-[10px] font-black text-white uppercase tracking-widest">North Tonawanda, NY</span>
          </div>
        </div>
        <div className="absolute top-[70%] left-[45%] flex flex-col items-center">
          <div className="w-px h-10 bg-gradient-to-t from-[#f5c518] to-transparent" />
          <div className="bg-black border border-[#f5c518] px-3 py-1.5 rounded shadow-xl">
            <span className="text-[10px] font-black text-white uppercase tracking-widest">Columbiana, AL</span>
          </div>
        </div>
        <div className="absolute top-[76%] left-[68%] flex flex-col items-center">
          <div className="w-px h-12 bg-gradient-to-t from-[#f5c518] to-transparent" />
          <div className="bg-black border border-[#f5c518] px-4 py-2 rounded shadow-xl text-center">
            <span className="text-[10px] font-black text-white uppercase tracking-widest block leading-tight">North Carolina<br/>Development Site</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const FourPillars = () => {
  return (
    <section className="bg-black py-15 md:py-15 px-6">
      <div className="max-w-[1400px] mx-auto">

        


        {/* 2x2 Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 md:gap-x-16 gap-y-12 md:gap-y-16">

          {/* Pillar 1: WE OWN THE POWER */}
          <div className="flex flex-col">
            <div className="text-[10px] font-semibold tracking-[0.3em] text-[#f5c518] uppercase mb-8">VERTICAL INTEGRATION</div>
            <h3 className="text-3xl font-semibold uppercase tracking-tighter text-white mb-6">WE OWN THE POWER</h3>
            <p className="text-white/60 text-sm leading-relaxed mb-10 max-w-lg">
              DigiPowerX controls the full energy stack — from owned power plants and utility-connected sites to 400MW+ of pipeline development across the U.S.
            </p>
            <ul className="space-y-4 mb-12">
              {[
                "Owned power generation assets",
                "Utility-powered & substation-connected sites",
                "400MW+ development pipeline",
                "Future-site acquisitions underway"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-wider text-white/70">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#f5c518]" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="aspect-[16/10] relative">
              <DigiPowerXMap />
            </div>
          </div>

          {/* Pillar 2: DIRECT-TO-CHIP LIQUID COOLING (REVERTED TO ORIGINAL) */}
          <div className="flex flex-col">
            <div className="text-[10px] font-semibold tracking-[0.3em] text-[#f5c518] uppercase mb-8">DATA CENTER ARCHITECTURE</div>
            <h3 className="text-3xl font-semibold uppercase tracking-tighter text-white mb-6">DIRECT-TO-CHIP LIQUID COOLING</h3>
            <p className="text-white/60 text-sm leading-relaxed mb-10 max-w-lg">
              Purpose-built for NVIDIA Blackwell and next-gen AI accelerators. Cold plates deliver coolant directly to the chip — no air cooling required at rack-level.
            </p>
            <ul className="space-y-4 mb-12">
              {[
                "Direct-to-chip cold plates per GPU",
                "Rear-door heat exchanger capture",
                "Chiller + cooling tower rejection loop",
                "PUE <1.15 · Zero thermal throttling"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-wider text-white/70">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#f5c518]" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="aspect-[16/10] relative flex items-center justify-center p-8">
              <div className="w-full h-full relative flex items-center justify-between gap-4">
                <div className="w-[30%] h-full flex flex-col justify-end items-center pb-4 relative">
                  <div className="absolute top-[10%] w-[80%] aspect-[4/3] bg-[#2d3a33] rounded-t-xl flex flex-col items-center justify-center border-x-4 border-t-4 border-[#3a4a42] relative overflow-hidden">
                    <div className="flex gap-4 mb-2">
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="w-8 h-8 border-4 border-dashed border-[#f5c518] rounded-full" />
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="w-8 h-8 border-4 border-dashed border-[#f5c518] rounded-full" />
                    </div>
                    <div className="text-[8px] font-mono text-[#f5c518] opacity-60">COOLING TOWER</div>
                    <div className="absolute top-2 right-2 flex items-center gap-1">
                      <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-[6px] font-mono text-white/40">PUE: 1.15</span>
                    </div>
                  </div>
                  <div className="w-[90%] h-[50%] bg-[#42524a] rounded-b-lg border-x-4 border-b-4 border-[#3a4a42]" />
                  <div className="absolute bottom-4 left-0 w-full flex flex-col gap-2 px-2">
                    <div className="h-6 bg-[#4a6d8c] rounded-full border border-white/10" />
                    <div className="h-6 bg-[#4a6d8c] rounded-full border border-white/10" />
                  </div>
                </div>

                <div className="w-[15%] h-[80%] bg-[#1a1f1d] rounded-lg border-2 border-[#2d3a33] flex flex-col items-center py-4 gap-4 relative">
                  <div className="w-10 h-10 rounded-full border-2 border-[#f5c518]/40 flex items-center justify-center">
                    <motion.div animate={{ rotate: -360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-6 h-6 border-2 border-t-[#f5c518] border-transparent rounded-full" />
                  </div>
                  <div className="flex flex-col gap-1 w-[70%]">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="h-3 bg-gradient-to-r from-[#f5c518]/20 to-transparent rounded-sm" />
                    ))}
                  </div>
                  <div className="absolute -top-6 text-[8px] font-mono text-[#4a6d8c] font-black tracking-widest">CDU</div>
                </div>

                <div className="w-[45%] h-full flex gap-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex-1 bg-[#0d0f0e] rounded border border-white/5 p-2 flex flex-col gap-1">
                      {[...Array(12)].map((_, j) => (
                        <div key={j} className="flex-1 flex gap-1">
                          <div className="w-1 h-full bg-green-500/10 rounded-full overflow-hidden">
                            <motion.div animate={{ y: [-10, 10] }} transition={{ duration: 1, repeat: Infinity, delay: j * 0.1 }} className="w-full h-2 bg-green-500" />
                          </div>
                          <div className="flex-1 flex gap-0.5">
                            {[...Array(4)].map((_, k) => (
                              <div key={k} className="flex-1 bg-white/5 rounded-sm" />
                            ))}
                          </div>
                          {j % 4 === 0 && <div className="w-2 h-full bg-green-500/40 rounded-sm" />}
                        </div>
                      ))}
                    </div>
                  ))}
                  <div className="absolute -bottom-6 right-0 text-[8px] font-mono text-green-500 font-black tracking-widest">GPU SERVER RACKS</div>
                </div>

                <div className="absolute inset-0 pointer-events-none">
                  <svg className="w-full h-full" viewBox="0 0 400 250">
                    <path id="hot-return" d="M300,50 L200,50 L200,100 L50,100 L50,150" stroke="#ff4d4d" strokeWidth="1.5" fill="none" strokeOpacity="0.4" />
                    <path id="cold-supply" d="M50,180 L200,180 L200,150 L300,150" stroke="#4a6d8c" strokeWidth="1.5" fill="none" strokeOpacity="0.4" />
                    {[...Array(3)].map((_, i) => (
                      <circle key={`hot-${i}`} r="2" fill="#ff4d4d">
                        <animateMotion dur="3s" repeatCount="indefinite" begin={`${i * 1}s`}>
                          <mpath href="#hot-return" />
                        </animateMotion>
                      </circle>
                    ))}
                    {[...Array(3)].map((_, i) => (
                      <circle key={`cold-${i}`} r="2" fill="#4a6d8c">
                        <animateMotion dur="3s" repeatCount="indefinite" begin={`${i * 1}s`}>
                          <mpath href="#cold-supply" />
                        </animateMotion>
                      </circle>
                    ))}
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Pillar 3: MEET NEOCLOUDZ (REVERTED TO ORIGINAL) */}
          <div className="flex flex-col">
            <div className="text-[10px] font-semibold tracking-[0.3em] text-[#f5c518] uppercase mb-8">FULLY OWNED SUBSIDIARY</div>
            <h3 className="text-3xl font-semibold uppercase tracking-tighter text-white mb-6">MEET NEOCLOUDZ</h3>
            <p className="text-white/60 text-sm leading-relaxed mb-10 max-w-lg">
              NeoCloudz is DigiPowerX's GPU compute platform — bare-metal NVIDIA Blackwell clusters delivered directly from our owned data centers.
            </p>
            <ul className="space-y-4 mb-12">
              {[
                "NVIDIA Blackwell GPU clusters",
                "Bare-metal · no virtualization overhead",
                "400Gb/s InfiniBand fabric",
                "Provisioned in <58 seconds"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-wider text-white/70">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#f5c518]" />
                  {item}
                </li>
              ))}
            </ul>
            <NeoCloudzClusterCanvas />
          </div>

          {/* Pillar 4: US DATA CENTERS INC. (REVERTED TO ORIGINAL) */}
          <div className="flex flex-col">
            <div className="text-[10px] font-semibold tracking-[0.3em] text-[#f5c518] uppercase mb-8">STRATEGIC PARTNER</div>
            <h3 className="text-3xl font-semibold uppercase tracking-tighter text-white mb-6">US DATA CENTERS INC.</h3>
            <p className="text-white/60 text-sm leading-relaxed mb-10 max-w-lg">
              A majority shareholder in US Data Centers Inc. — a modular data center manufacturer purpose-built for rapid & scalable infrastructure deployment.
            </p>
            <ul className="space-y-4 mb-12">
              {[
                "800kW – 1.5MW self-contained modules",
                "Tier III design · TIA-942 compliant",
                "Rapid deployment — operational in weeks",
                "Factory-built & commissioned off-site"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-wider text-white/70">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#f5c518]" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="aspect-[16/10] bg-[#050505] rounded-lg overflow-hidden border border-white/5 shadow-2xl relative">
              <USDataCenter3D />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default FourPillars;
