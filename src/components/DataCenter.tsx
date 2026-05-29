import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Zap,
  Cpu,
  Activity,
  Server,
  Droplets,
  Thermometer,
  Wind,
  ShieldCheck,
  Target,
  ChevronRight,
  Radio,
  Layers,
  ArrowRight,
  Globe,
  Database,
  Network,
  TrendingDown,
  Rocket,
  Maximize2,
} from 'lucide-react';

import { CTASection } from './Footer';
import NeuralCube3D from './NeuralCube3D';
import DataCenter3D from './DataCenter3D';
import DataCenterHeroScene from './DataCenterHeroScene';
import StackedLayersVisual from './StackedLayersVisual';

// =========================================================
// COOLING VISUAL COMPONENT
// =========================================================
const CoolingVisual = () => {
  return (
    <div className="relative w-full h-full min-h-[600px] bg-[#050608] flex items-center justify-center p-0 overflow-hidden">
      <svg viewBox="0 0 800 550" className="w-full h-full max-w-[850px] scale-95">
        <defs>
          <filter id="glow-red">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-blue">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect x="100" y="50" width="180" height="180" rx="10" fill="#0d0e11" stroke="#f5c518" strokeWidth="1.5" strokeOpacity="0.5" />
        <text x="190" y="135" textAnchor="middle" fill="#f5c518" fontSize="10" fontWeight="600" className="uppercase tracking-[0.2em] opacity-80">Cooling</text>
        <text x="190" y="152" textAnchor="middle" fill="#f5c518" fontSize="10" fontWeight="600" className="uppercase tracking-[0.2em] opacity-80">Tower</text>

        <rect x="100" y="320" width="180" height="110" rx="10" fill="#0d0e11" stroke="#3b82f6" strokeWidth="1.5" strokeOpacity="0.5" />
        <text x="190" y="380" textAnchor="middle" fill="#3b82f6" fontSize="10" fontWeight="600" className="uppercase tracking-[0.2em] opacity-80">Chiller</text>

        <rect x="380" y="100" width="90" height="300" rx="10" fill="#0d0e11" stroke="#ffffff" strokeWidth="1.5" strokeOpacity="0.15" />
        <text x="425" y="250" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="600" className="uppercase tracking-[0.2em] opacity-40">CDU</text>

        {[0, 1, 2].map((i) => (
          <g key={i} transform={`translate(${560 + i * 80}, 50)`}>
            <rect x="0" y="0" width="60" height="380" rx="4" fill="#050608" stroke="#0cff00" strokeWidth="1.5" strokeOpacity="0.2" />
            {Array.from({ length: 18 }).map((_, j) => (
              <rect key={j} x="6" y={12 + j * 20} width="48" height="6" fill="#0cff00" className="opacity-10" />
            ))}
            <text x="30" y="410" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="600" className="uppercase tracking-[0.3em] opacity-20">Rack-0{i + 1}</text>
          </g>
        ))}

        <path id="path-red" d="M 560 140 L 490 140 L 490 110 L 380 110 L 280 110" fill="none" stroke="#ef4444" strokeWidth="2.5" opacity="0.6" />
        <path id="path-blue" d="M 190 230 L 190 320 M 190 430 L 190 480 L 410 480 L 410 400 M 470 300 L 520 280 L 560 280" fill="none" stroke="#3b82f6" strokeWidth="2.5" opacity="0.6" />

        {[0, 1.3, 2.6].map((delay, i) => (
          <motion.circle key={`red-${i}`} r="4" fill="#ef4444" filter="url(#glow-red)">
            <animateMotion dur="4s" begin={`${delay}s`} repeatCount="indefinite" path="M 560 140 L 490 140 L 490 110 L 380 110 L 280 110" />
          </motion.circle>
        ))}

        {[0, 2, 4].map((delay, i) => (
          <motion.circle key={`blue-${i}`} r="4" fill="#3b82f6" filter="url(#glow-blue)">
            <animateMotion dur="6s" begin={`${delay}s`} repeatCount="indefinite" path="M 190 230 L 190 320 M 190 430 L 190 480 L 410 480 L 410 400 M 470 300 L 520 280 L 560 280" />
          </motion.circle>
        ))}
      </svg>
    </div>
  );
};

const DataCenter = () => {
  return (
    <div className="bg-[#050505] text-white overflow-x-hidden font-sans selection:bg-[#f5c518]/20">

      {/* ========================================================= */}
      {/* HERO SECTION - REFACTORED DUAL-COLUMN LAYOUT */}
      {/* ========================================================= */}
      <section className="relative min-h-0 lg:min-h-[85vh] flex items-center justify-center pt-32 pb-8 lg:pt-28 lg:pb-16 px-4 lg:px-6 overflow-hidden">


        <div className="relative z-10 w-full max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center">

            {/* Left Content column */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left"
            >

              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-[#f5c518]/30 bg-[#f5c518]/5 backdrop-blur-sm mb-8 shadow-[0_0_30px_rgba(245,197,24,0.05)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f5c518] shadow-[0_0_8px_#f5c518]"></span>
                <span className="text-[10px] uppercase tracking-[0.35em] font-bold text-[#f5c518]">
                  AI-Ready Facilities
                </span>
              </div>

              <h1 className="text-[clamp(2.2rem,5.5vw,5rem)] font-semibold leading-[0.95] tracking-tighter uppercase mb-6 text-white text-center lg:text-left">
                DATA <br />
                <span className="text-[#f5c518]">CENTERS</span>
              </h1>

              <p className="text-white/60 max-w-lg text-sm md:text-base font-medium leading-relaxed mb-10 tracking-tight text-center lg:text-left">
                High-density, liquid-cooled data center environments engineered explicitly for GPU clusters, power reliability, and extreme compute efficiency.
              </p>

              <div className="flex flex-wrap gap-4 w-full sm:w-auto justify-center lg:justify-start">
                <Link to="/contact" className="px-10 py-5 bg-[#f5c518] text-black font-semibold text-[10px] uppercase tracking-[0.3em] rounded-sm hover:bg-white hover:text-black transition-all shadow-[0_10px_40px_rgba(245,197,24,0.2)] text-center">
                  Talk to Team
                </Link>
                <Link to="/investors" className="px-10 py-5 border border-white/10 bg-white/5 backdrop-blur-md font-semibold text-[10px] uppercase tracking-[0.3em] rounded-sm hover:bg-white/10 transition-all text-center">
                  Investor Info
                </Link>
              </div>
            </motion.div>

            {/* Right 3D Visual column */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-7 w-full h-[250px] sm:h-[350px] lg:h-[550px]"
            >
              <DataCenterHeroScene />
            </motion.div>

          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* COOLING ARCHITECTURE SECTION - (LEAVE AS IS: LEFT CONTENT) */}
      {/* ========================================================= */}
      <section className="flex flex-col lg:flex-row items-stretch min-h-[600px] relative overflow-hidden bg-[#050608] border-y border-white/5" style={{ backgroundColor: '#050608' }}>
        <div className="w-full lg:w-1/2 px-12 lg:px-24 py-0 flex flex-col justify-center">
          <div className="py-12 lg:py-0">
            <span className="text-[10px] font-semibold tracking-[0.4em] uppercase text-[#f5c518]">Cooling Architecture</span>
            <h2 className="text-[clamp(2.5rem,5vw,5rem)] font-semibold leading-[0.9] tracking-tighter uppercase text-white mt-6 mb-8">
              HEAT OUT. <br />
              <span className="text-[#f5c518]">PERFORMANCE IN.</span>
            </h2>
            <p className="text-white/60 text-lg leading-relaxed max-w-xl mb-12 font-medium">
              A closed-loop direct liquid cooling system connects every GPU rack to CDU distribution, chiller plant, and heat rejection — eliminating thermal throttle as a constraint on AI compute density.
            </p>
            <ul className="space-y-4">
              {[
                { label: 'Red path:', text: 'hot coolant return from rack to CDU', color: '#ef4444' },
                { label: 'Blue path:', text: 'cold supply loop back to compute', color: '#3b82f6' },
                { label: '', text: 'CDU, chiller, and cooling tower integrated in one flow', color: '#f5c518' },
                { label: '', text: 'Supports 200kW+ per-rack GPU power envelopes', color: '#f5c518' },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <ArrowRight size={16} className="mt-0.5 shrink-0 text-[#f5c518]" />
                  <p className="text-white text-sm font-semibold">
                    {item.label && <span className="mr-2 text-white">{item.label}</span>}
                    {item.text}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="w-full lg:w-1/2 min-h-[500px]">
          <StackedLayersVisual />
        </div>
      </section>

      {/* ========================================================= */}
      {/* FACILITY ARCHITECTURE - (CENTERED HEADING) */}
      {/* ========================================================= */}
      <section className="bg-black py-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="max-w-[1400px] mx-auto relative z-10">
          <div className="flex flex-col items-center text-center mb-20">
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl mb-8">
              <span className="w-8 h-[2px] bg-[#f5c518] shrink-0" />
              <span className="w-1.5 h-[2px] bg-white/20 shrink-0" />
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/80">01 / Facility Architecture</span>
            </div>
            <h2 className="text-[clamp(2.5rem,6vw,6rem)] font-semibold leading-[0.9] tracking-tighter uppercase text-white mb-8">
              BUILT FOR AI, <br />
              <span className="text-[#f5c518]">NOT RETROFITTED</span> <br />
              ENTERPRISE LOADS.
            </h2>
            <p className="text-white/40 max-w-2xl text-sm md:text-base font-medium leading-relaxed">
              The full facility stack — incoming power, rack density, cooling infrastructure, network fabric, and controlled operations — is engineered around accelerator workloads from the ground up.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {[
              {
                tag: 'RACKS',
                title: 'GPU-Dense Row Architecture',
                desc: 'Rack layouts are planned around accelerator power draw, heat removal path, cable routing, and structured service access — not legacy 1U server assumptions.',
                bullets: [
                  'High-density GPU rack rows with per-cabinet PDU monitoring',
                  'Hot-aisle containment and cable tray infrastructure',
                  'Expansion-ready room layouts with conditioned floor space',
                  'Rack-level power metering and environmental sensing'
                ]
              },
              {
                tag: 'COOLING',
                title: 'Direct Liquid Cooling Loop',
                desc: 'DLC architecture brings coolant directly to compute components, avoiding the inefficiencies of air-only systems at high GPU densities.',
                bullets: [
                  'Direct-to-chip coolant distribution units (CDU)',
                  'Hot-return and cold-supply manifold design',
                  'Chiller plant and dry-cooler heat rejection',
                  'Redundant pumping and leak detection systems'
                ]
              },
              {
                tag: 'POWER',
                title: 'Redundant Electrical Infrastructure',
                desc: 'Reliable AI compute starts with the electrical path — utility interconnection, switchgear, transformation, and UPS architecture before the first server powers on.',
                bullets: [
                  'HV/MV utility feed with backup protection',
                  'Switchgear, transformers, and distribution panels',
                  'UPS and generator strategy for critical loads',
                  'Metered, monitored power delivery to every rack'
                ]
              }
            ].map((section, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="group relative bg-[#0a0a0a] border border-white/10 rounded-[32px] p-10 flex flex-col hover:border-[#f5c518]/40 transition-all duration-500 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#f5c518]/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10 text-left">
                  <div className="text-[10px] font-semibold text-[#f5c518] uppercase tracking-[0.4em] mb-8">{section.tag}</div>
                  <h3 className="text-2xl font-semibold tracking-tighter uppercase text-white mb-6 group-hover:text-[#f5c518] transition-colors">{section.title}</h3>
                  <p className="text-white/40 text-[13px] leading-relaxed mb-10 font-medium">{section.desc}</p>
                  <div className="space-y-4">
                    {section.bullets.map((bullet, idx) => (
                      <div key={idx} className="flex items-start gap-3 group/item">
                        <span className="text-[#f5c518] text-xs mt-1 shrink-0 group-hover/item:translate-x-1 transition-transform">→</span>
                        <span className="text-white/60 text-[12px] font-bold leading-relaxed">{bullet}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#f5c518] group-hover:w-full transition-all duration-700" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* FULL-STACK FACILITY SPECIFICATION - (CENTERED HEADING) */}
      {/* ========================================================= */}
      <section className="bg-[#f7f7f5] py-16 px-6 relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col items-center text-center mb-20">
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-black/10 bg-black/5 backdrop-blur-xl mb-8">
              <span className="w-8 h-[2px] bg-[#f5c518] shrink-0" />
              <span className="w-1.5 h-[2px] bg-black/20 shrink-0" />
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-black/80">02 / Technical Specification</span>
            </div>
            <h2 className="text-[clamp(2.5rem,6vw,6rem)] font-semibold leading-[0.9] tracking-tighter uppercase text-black mb-8">
              FULL-STACK FACILITY <br />
              <span className="text-[#f5c518]">SPECIFICATION.</span>
            </h2>
            <p className="text-black/60 max-w-2xl text-lg font-medium leading-relaxed">
              From incoming utility to GPU rack output — each layer of the facility is designed with AI workload performance as the primary constraint.
            </p>
          </div>

          <div className="relative border-t border-black/10">
            <div className="hidden lg:grid grid-cols-12 gap-8 py-6 px-4 text-[10px] font-bold uppercase tracking-[0.3em] text-black/30 border-b border-black/5">
              <div className="col-span-3">Layer</div>
              <div className="col-span-6">Design Direction</div>
              <div className="col-span-3 text-right">Specification</div>
            </div>

            {[
              { layer: 'Power Density', dir: 'High-density rack architecture targeting AI/HPC accelerator loads', spec: '200kW+ per cabinet' },
              { layer: 'Cooling', dir: 'Direct liquid cooling with closed-loop CDU and chiller plant', spec: 'PUE target <1.3' },
              { layer: 'Network', dir: 'Low-latency fabric with carrier-neutral interconnect access', spec: '400G fabric capable' },
              { layer: 'Operations', dir: '24/7 NOC monitoring, remote hands, biometric access control', spec: 'Tier III design path' },
              { layer: 'Power Base', dir: 'Owned generation and utility-connected sites across the U.S. footprint', spec: '400MW+ owned & pipeline' },
              { layer: 'Connectivity', dir: 'Diverse carrier access and dark fiber pathway', spec: 'Multi-carrier ready' },
            ].map((row, i) => (
              <motion.div
                key={i}
                whileHover={{ backgroundColor: 'rgba(245,197,24,0.02)', x: 10 }}
                className="group grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 py-8 px-4 border-b border-black/5 transition-all cursor-pointer relative overflow-hidden"
              >
                <div className="absolute left-0 top-0 w-[2px] h-0 bg-[#f5c518] group-hover:h-full transition-all duration-300" />
                <div className="col-span-3">
                  <div className="text-lg font-bold text-black tracking-tighter uppercase">{row.layer}</div>
                </div>
                <div className="col-span-6">
                  <p className="text-black/60 text-sm font-medium leading-relaxed">{row.dir}</p>
                </div>
                <div className="col-span-3 lg:text-right">
                  <div className="text-lg font-mono font-bold text-[#f5c518] tracking-tight">{row.spec}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* INTEGRATED INFRASTRUCTURE ADVANTAGE - (CENTERED HEADING) */}
      {/* ========================================================= */}
      <section className="bg-[#050505] py-16 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[50rem] h-[50rem] bg-[#f5c518]/5 blur-[160px] rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-[#f5c518]/5 blur-[140px] rounded-full -translate-x-1/2 translate-y-1/2" />

        <div className="max-w-[1400px] mx-auto relative z-10">
          {/* Centered Heading and Intro */}
          <div className="flex flex-col items-center text-center mb-24">
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl mb-8">
              <span className="w-8 h-[2px] bg-[#f5c518] shrink-0" />
              <span className="w-1.5 h-[2px] bg-white/20 shrink-0" />
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/80">Why DigiPowerX</span>
            </div>
            <h2 className="text-[clamp(2.5rem,5vw,5.5rem)] font-semibold leading-[0.95] tracking-tighter uppercase text-white mb-10">
              THE ADVANTAGE IS <br />
              <span className="text-[#f5c518]">INTEGRATED</span> <br />
              INFRASTRUCTURE.
            </h2>
            <div className="space-y-6 max-w-3xl">
              <p className="text-white/60 text-lg font-medium leading-relaxed">
                The strongest data center story is not only the room. It is the integration of power generation, site control, direct liquid cooling, network access, and deployment speed — <span className="text-white">owned at every layer.</span>
              </p>
              <p className="text-white/40 text-sm font-medium leading-relaxed">
                DigiPower X controls the infrastructure stack from energy assets through compute-ready colocation, compressing deployment timelines and improving long-term operating economics for AI and HPC customers.
              </p>
            </div>
          </div>



          {/* Bento Cards Grid */}
          <div className="grid lg:grid-cols-4 gap-6">
            {[
              {
                icon: Zap,
                title: 'Power + Data Center',
                desc: 'Infrastructure strategy starts with energy access and site capacity — not with a leased building.',
                color: 'from-yellow-500/20 to-transparent'
              },
              {
                icon: Rocket,
                title: 'Faster Deployment',
                desc: 'Existing electrical infrastructure and approved load studies compress development timelines.',
                color: 'from-blue-500/20 to-transparent'
              },
              {
                icon: TrendingDown,
                title: 'Lower OPEX',
                desc: 'Sub-$0.05/kWh power-cost visibility supports better long-term AI infrastructure economics.',
                color: 'from-green-500/20 to-transparent'
              },
              {
                icon: Maximize2,
                title: 'AI / HPC Ready',
                desc: 'Designed for 200kW+ rack densities and liquid-cooled accelerator clusters — not legacy workloads.',
                color: 'from-purple-500/20 to-transparent'
              }
            ].map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -10 }}
                className="group relative bg-gradient-to-br from-white/[0.05] to-white/[0.01] border border-white/10 rounded-[32px] p-10 overflow-hidden text-left"
              >
                <div className={`absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br ${card.color} blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-8 border border-white/10 group-hover:bg-[#f5c518] group-hover:text-black transition-all duration-500">
                    <card.icon size={24} />
                  </div>
                  <h3 className="text-xl font-semibold text-white uppercase tracking-tighter mb-4 group-hover:text-[#f5c518] transition-colors">{card.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed font-medium group-hover:text-white/60 transition-colors">{card.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );
};

export default DataCenter;