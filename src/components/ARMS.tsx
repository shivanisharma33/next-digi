import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Cpu, TrendingUp, Clock, Gauge, Layers, Database, Zap, Share2, Box } from 'lucide-react';
import NeuralCube3D from './NeuralCube3D';
import Arms3D from './Arms3D';
import { CTASection } from './Footer';



const ARMS = () => {
  const [showCertModal, setShowCertModal] = useState(false);
  return (
    <div className="bg-black min-h-screen text-white selection:bg-brand-yellow selection:text-black">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-36 pb-16 px-6 overflow-hidden">
        {/* Background Grid */}
        <div className="absolute inset-0 z-0 opacity-[0.12] pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(245,197,24,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(245,197,24,0.08)_1px,transparent_1px)] bg-[size:40px_40px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-[1400px] mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

            {/* Left: Content Column */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-5 flex flex-col items-center text-center lg:items-start lg:text-left"
            >
              <div className="relative mb-6">
                <div className="w-24 h-[1px] bg-white/15" />
                <div className="absolute top-1/2 left-0 -translate-y-1/2 flex items-center gap-2 bg-black pr-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#f5c518] animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#f5c518]">ARMS PLATFORM</span>
                </div>
              </div>

              <h1 className="text-[clamp(2.2rem,5vw,4.5rem)] font-extrabold leading-[0.98] tracking-tighter uppercase mb-6 text-white">
                <span className="block text-white mb-1">ARMS</span>
                <span className="block text-[#f5c518]">MODULAR SYSTEMS</span>
              </h1>

              <p className="text-sm md:text-base text-white/60 max-w-xl leading-relaxed mb-10 font-normal">
                DigiPowerX's proprietary modular data-center platform. Deploy up to 600 kW of critical compute power with Tier III redundancy in a rapidly scalable package, built for next-generation AI and high-density workloads.
              </p>

              {/* Stats Highlight Grid */}
              <div className="w-full max-w-lg grid grid-cols-2 gap-6 p-6 rounded-2xl border border-white/5 bg-[#08090c]/40 backdrop-blur-xl mb-6">
                {[
                  { val: "40 MW", label: "TOTAL CAPACITY" },
                  { val: "12 MONTHS", label: "DEPLOYMENT SPEED" }
                ].map((stat, i) => (
                  <div key={i} className="text-left border-l border-white/10 pl-4 first:border-0 first:pl-0">
                    <div className="text-[#f5c518] font-bold text-2xl md:text-3xl mb-1 tracking-tight font-mono">{stat.val}</div>
                    <div className="text-[9px] font-semibold text-white/40 uppercase tracking-widest leading-none">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right: Interactive 3D Model Display */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
              className="lg:col-span-7 w-full h-[420px] sm:h-[480px] md:h-[540px] lg:h-[600px] relative rounded-3xl overflow-hidden shadow-2xl border border-white/5"
              style={{ background: 'radial-gradient(ellipse at center 55%, #0E0E0E 0%, #050505 80%)' }}
            >
              <Arms3D theme="dark" />
            </motion.div>

          </div>
        </div>
      </section>

      {/* Advantages Section */}
      <section className="pt-5 pb-24 bg-black ">
        <div className="container mx-auto px-6 max-w-[1400px] text-center">
          <div className="inline-flex items-center gap-4 px-6 py-2 rounded-full border border-white/10 mb-12">
            <div className="h-[1px] w-12 bg-[#f5c518]" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.4em] text-white/60">ARMS</span>
            <div className="h-[1px] w-12 bg-white/10" />
          </div>
          <h2 className="text-[clamp(2.5rem,6vw,5.5rem)] font-semibold leading-[0.95] tracking-tighter uppercase text-white mb-8 relative z-10">
            <span className="text-[#f5c518]">ARMS 200</span> <span className="text-white">ADVANTAGES</span>
          </h2>
          <p className="text-white/40 text-lg md:text-xl max-w-5xl mx-auto leading-relaxed mb-16 font-medium">
            DigiPowerX is built around a simple but powerful thesis: the company that controls power controls the compute. By owning the full infrastructure stack from energy generation through GPU compute, DigiPowerX can serve AI and HPC customers faster, cheaper, and at greater scale than any pure-play competitor.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 border border-white/10 rounded-2xl overflow-hidden">
            {[
              {
                tag: "POWER",
                title: "ENERGY INFRASTRUCTURE",
                desc: "Owned power generation assets and substation access create a structural cost and speed advantage that competitors building on leased utility power cannot replicate. The North Tonawanda plant produces at approximately $0.04/kWh."
              },
              {
                tag: "DATA CENTERS",
                title: "AI-READY FACILITIES",
                desc: "The company converts owned power assets into high-density, AI-ready data center capacity — targeting Tier III classification, direct liquid cooling, and 80kW+ per-rack GPU density at the Alabama facility."
              },
              {
                tag: "COMPUTE",
                title: "GPU COMPUTE PLATFORM",
                desc: "NeoCloudz is the compute layer on top of the DigiPowerX infrastructure stack — providing bare-metal GPU access, 400G InfiniBand fabric, and enterprise-grade telemetry for AI training, inference, and HPC workloads."
              }
            ].map((item, i) => (
              <div key={i} className="p-12 text-left border-r border-white/10 last:border-r-0 hover:bg-white/[0.02] transition-colors group">
                <div className="text-[10px] font-semibold text-[#f5c518] uppercase tracking-[0.3em] mb-6">{item.tag}</div>
                <h3 className="text-xl font-semibold uppercase mb-6 tracking-tight group-hover:text-[#f5c518] transition-colors">{item.title}</h3>
                <p className="text-white/30 text-sm leading-relaxed font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ARMS 200 System Section (As depicted in User Screenshot) */}
      <section className="py-10 bg-[#f8f9fa] relative overflow-hidden border-t border-black/5">

        {/* Dynamic Telemetry Wireframe Grid Background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 1000 1000" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 100H200V300H400V100H600V500H800V300H1000" stroke="#f5c518" strokeWidth="2" />
            <path d="M100 0V200H300V400H100V600H500V800H300V1000" stroke="#f5c518" strokeWidth="2" />
            <circle cx="200" cy="100" r="4" fill="#f5c518" />
            <circle cx="400" cy="300" r="4" fill="#f5c518" />
            <circle cx="600" cy="100" r="4" fill="#f5c518" />
            <circle cx="800" cy="500" r="4" fill="#f5c518" />
          </svg>
        </div>

        <div className="container mx-auto px-6 max-w-[1400px] relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center max-w-6xl mx-auto">

            {/* Left Column: Descriptions and Stats Cards */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-6 space-y-8 text-left"
            >
              <div className="space-y-6">
                <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-none">
                  ARMS 200 <span className="text-[#f5c518]">System</span>
                </h2>
                <p className="text-slate-600 text-sm md:text-[15px] leading-relaxed max-w-xl font-medium">
                  The ARMS 200 is DigiPowerX’s proprietary modular data-center platform. Each module delivers up to 600 kW of critical IT load and is designed for Tier III redundancy (concurrent maintainability).
                </p>
                <p className="text-slate-600 text-sm md:text-[15px] leading-relaxed max-w-xl font-medium">
                  The system's prefabricated architecture allows rapid on-site assembly and integration with chilled-water or direct-to-chip cooling systems, making it the ideal solution for AI-ready infrastructure.
                </p>
              </div>

              {/* Stat Highlight Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-xl pt-4">

                {/* Power Capacity Card */}
                <div className="bg-[#f5c518]/5 border border-[#f5c518]/25 rounded-2xl p-6 flex flex-col justify-between min-h-[120px] shadow-sm">
                  <div className="flex items-center gap-2 text-[#f5c518] font-bold text-xs tracking-wider uppercase">
                    <Zap size={14} className="fill-current" />
                    <span>Power Capacity</span>
                  </div>
                  <div className="text-3xl font-black text-slate-900 tracking-tight mt-4">
                    40 MW
                  </div>
                </div>

                {/* Deployment Card */}
                <div className="bg-[#f5c518]/5 border border-[#f5c518]/25 rounded-2xl p-6 flex flex-col justify-between min-h-[120px] shadow-sm">
                  <div className="flex items-center gap-2 text-[#f5c518] font-bold text-xs tracking-wider uppercase">
                    <Clock size={14} />
                    <span>Deployment</span>
                  </div>
                  <div className="text-3xl font-black text-slate-900 tracking-tight mt-4">
                    ≤ 12 Mo
                  </div>
                </div>

              </div>
            </motion.div>

            {/* Right Column: Standalone Technical Schematic Enclosure Mockup */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-6 relative flex justify-center w-full"
            >

              {/* Outer Card Container */}
              <div className="bg-[#eef2f5] border border-slate-200/60 rounded-3xl p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.03)] relative w-full max-w-md">

                {/* Floating "Certified Tier III" badge */}
                <div className="absolute -top-4 right-6 bg-white border border-slate-100 rounded-2xl px-5 py-3.5 shadow-[0_10px_30px_rgba(0,0,0,0.06)] flex items-center gap-2.5 z-20">
                  <div className="w-8 h-8 rounded-full bg-[#f5c518]/10 border border-[#f5c518]/25 flex items-center justify-center text-[#f5c518]">
                    <Shield size={16} className="fill-[#f5c518]/10" />
                  </div>
                  <div className="flex flex-col leading-tight">
                    <span className="text-[8px] font-mono uppercase tracking-widest text-slate-400">Certified</span>
                    <span className="text-xs font-bold text-slate-800">Tier III</span>
                  </div>
                </div>

                {/* Inner Certification Frame */}
                <div
                  onClick={() => setShowCertModal(true)}
                  className="bg-white border border-slate-300 p-6 md:p-8 rounded-lg shadow-sm flex flex-col justify-between aspect-[1/1.4] w-full font-sans text-center relative cursor-pointer overflow-hidden group/cert hover:border-[#f5c518] transition-all duration-300"
                >
                  <div className="text-left pb-3 border-b border-slate-100 flex justify-between items-start">
                    <div>
                      <span className="text-[7px] font-mono uppercase tracking-widest text-[#d4a313] font-bold">DIGIPOWERX // ARMS 200</span>
                      <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-tight mt-0.5">CERTIFICATE OF CONFORMANCE</h4>
                    </div>
                    <span className="text-[7.5px] bg-[#f5c518]/10 text-[#d4a313] border border-[#f5c518]/25 font-mono px-2 py-0.5 rounded uppercase font-bold tracking-tight">TIA-942 READY</span>
                  </div>

                  {/* Certificate Image View */}
                  <div className="flex-1 w-full min-h-[250px] sm:min-h-[300px] relative bg-white border border-slate-100 rounded-md my-4 overflow-hidden group flex items-center justify-center">
                    <img
                      src="/images/arms.webp"
                      alt="ARMS 200 Certification"
                      className="w-full h-full object-contain transition-transform duration-500 group-hover/cert:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/cert:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="bg-white/95 text-slate-900 text-[10px] font-bold px-3 py-1.5 rounded-full shadow-md backdrop-blur-sm transform translate-y-2 group-hover/cert:translate-y-0 transition-all duration-300">
                        View Certificate
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-[7px] font-mono text-slate-400">
                    <span>STANDARD: ANSI/TIA-942-C-2024</span>
                    <span>RATING: RATED-3 (TIER III)</span>
                  </div>
                </div>

              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* EVERYTHING YOU NEED. NOTHING YOU DON'T. Section */}
      <section className="py-5 bg-white relative overflow-hidden border-t border-slate-100">

        {/* Technical yellow/orange telemetry line art background exactly like image */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <svg className="w-full h-full opacity-35" viewBox="0 0 1440 800" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M 0,200 L 1440,200 M 0,500 L 1440,500" stroke="#f5c518" strokeWidth="0.5" strokeDasharray="3 6" />
            <path d="M 200,0 L 200,800 M 1200,0 L 1200,800" stroke="#f5c518" strokeWidth="0.5" strokeDasharray="3 6" />

            <path d="M150,150 L350,150 L400,200 L600,200" stroke="#f5c518" strokeWidth="1" />
            <circle cx="150" cy="150" r="3" fill="#f5c518" />
            <circle cx="600" cy="200" r="3" fill="#f5c518" />

            <path d="M1250,650 L1050,650 L1000,600 L800,600" stroke="#f5c518" strokeWidth="1" />
            <circle cx="1250" cy="650" r="3" fill="#f5c518" />
            <circle cx="800" cy="600" r="3" fill="#f5c518" />

            <text x="120" y="80" fill="#f5c518" className="font-mono text-xs font-bold" opacity="0.8">&gt;&gt;&gt;</text>
            <text x="1320" y="320" fill="#f5c518" className="font-mono text-xs font-bold" opacity="0.8">&gt;&gt;&gt;</text>
            <text x="420" y="520" fill="#f5c518" className="font-mono text-xs font-bold" opacity="0.8">&gt;&gt;&gt;</text>
            <text x="1100" y="760" fill="#f5c518" className="font-mono text-xs font-bold" opacity="0.8">&gt;&gt;&gt;</text>
            <text x="380" y="280" fill="#f5c518" className="font-mono text-xs font-bold" opacity="0.8">&gt;&gt;&gt;</text>
          </svg>
        </div>

        <div className="container mx-auto px-6 max-w-[1400px] relative z-10 text-center">

          {/* Centered pill capsule badge */}
          <div className="flex justify-center mb-8 relative z-10">
            <div className="bg-white border border-slate-300 rounded-full px-8 py-2 flex items-center gap-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
              <span className="text-[10px] font-mono font-bold tracking-widest text-slate-800">04</span>
              <div className="w-[1px] h-3 bg-slate-300" />
              <span className="text-[10px] font-mono font-bold tracking-[0.3em] uppercase text-slate-800">ARMS</span>
            </div>
          </div>

          {/* Heading */}
          <h2 className="text-[clamp(2.2rem,5vw,4.5rem)] font-extrabold tracking-tight uppercase leading-[1.1] text-slate-900 mb-8 relative z-10 flex flex-col items-center">
            <span className="relative inline-block mb-2">
              TIER III RELIABILITY.
            </span>
            <span className="relative inline-block">
              <span className="text-[#f5c518]">MODULAR</span> SCALABILITY.
            </span>
          </h2>

          {/* Description Subtitle */}
          <p className="text-slate-600 text-sm md:text-base max-w-3xl mx-auto leading-relaxed mb-16 relative z-10 font-semibold px-4">
            DigiPowerX facilities are purpose-built for the density and reliability demands of AI infrastructure — not retrofitted from legacy enterprise data centers.
          </p>

          {/* 6 Premium Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10 max-w-[1200px] mx-auto">
            {[
              {
                icon: <Shield className="w-10 h-10 text-[#f5c518] fill-[#f5c518]/10" strokeWidth={1.8} />,
                title: "TIER III RATED",
                desc: "Certified under TIA-942 design standards for concurrent maintainability."
              },
              {
                icon: <Cpu className="w-10 h-10 text-[#f5c518]" strokeWidth={1.8} />,
                title: "FLEXIBLE COOLING",
                desc: "Pre-engineered for liquid or air-cooled workloads with direct-to-chip options."
              },
              {
                icon: <Layers className="w-10 h-10 text-[#f5c518]" strokeWidth={1.8} />,
                title: "FULLY INTEGRATED",
                desc: "Complete power, cooling, and network distribution in one package."
              },
              {
                icon: <TrendingUp className="w-10 h-10 text-[#f5c518]" strokeWidth={1.8} />,
                title: "HIGHLY SCALABLE",
                desc: "Expand from 200 kW to 58 MW+ campuses as your needs grow."
              },
              {
                icon: <Clock className="w-10 h-10 text-[#f5c518]" strokeWidth={1.8} />,
                title: "RAPID DEPLOYMENT",
                desc: "Deployable in ≤ 12 months with prefabricated architecture."
              },
              {
                icon: <Gauge className="w-10 h-10 text-[#f5c518]" strokeWidth={1.8} />,
                title: "HIGH PERFORMANCE",
                desc: "Up to 600 kW of computing power per compact module."
              }
            ].map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-[#eef2f5] border border-slate-200/60 rounded-2xl p-8 text-left shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.04)] transition-all duration-300 flex flex-col justify-between min-h-[190px]"
              >
                <div>
                  <div className="mb-5">{card.icon}</div>
                  <h3 className="text-lg font-bold text-slate-800 uppercase tracking-tight mb-2">
                    {card.title}
                  </h3>
                  <p className="text-slate-500 text-xs md:text-sm font-semibold leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* TECHNICAL SPECIFICATIONS & FUTURE READY PLATFORM Section */}
      <section className="py-24 sm:py-32 lg:py-24 bg-black text-white relative overflow-hidden border-t border-white/5">

        {/* Technical yellow/orange telemetry circuitry backdrop exactly like image */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <img
            src="/assets/circuitry_bg.png"
            alt="Technical Circuitry Background"
            className="w-full h-full object-cover opacity-60 pointer-events-none mix-blend-screen"
          />
          <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-[#f5c518]/25 rounded-full filter blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-[#f5c518]/25 rounded-full filter blur-[120px]" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 max-w-[1400px] relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl mx-auto items-stretch">

            {/* Left Column: TECHNICAL SPECIFICATIONS */}
            <div className="lg:col-span-6 flex flex-col text-center lg:text-left">
              <div className="text-left mb-6">
                <span className="text-xs font-light uppercase tracking-widest text-white/50 block mb-1">TECHNICAL</span>
                <span className="text-2xl font-black uppercase tracking-wider text-[#f5c518] block">SPECIFICATIONS</span>
              </div>

              {/* Main Technical Specs Card with Yellow Gradients */}
              <div className="flex-1 w-full bg-gradient-to-br from-[#0c0d0a]/90 via-[#070806]/95 to-[#0b0c0a]/90 border border-white/10 rounded-3xl p-6 sm:p-8 relative shadow-[0_20px_50px_rgba(0,0,0,0.4)] overflow-hidden flex flex-col justify-between group hover:border-[#f5c518]/25 transition-all duration-500">
                {/* Yellow glows in corners */}
                <div className="absolute -top-12 -left-12 w-24 h-24 bg-[#f5c518]/15 rounded-full filter blur-xl group-hover:bg-[#f5c518]/25 transition-colors" />
                <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-[#f5c518]/15 rounded-full filter blur-xl group-hover:bg-[#f5c518]/25 transition-colors" />

                <div className="space-y-6 relative z-10">
                  {[
                    {
                      icon: <Gauge className="w-5 h-5 text-[#f5c518]" />,
                      label: "Critical IT Load",
                      val: "Up To 600 KW\nPer Module"
                    },
                    {
                      icon: <Shield className="w-5 h-5 text-[#f5c518]" />,
                      label: "Redundancy",
                      val: "Tier III (N+1)"
                    },
                    {
                      icon: <Cpu className="w-5 h-5 text-[#f5c518]" />,
                      label: "Cooling Systems",
                      val: "Chilled-Water Or\nDirect-To-Chip"
                    },
                    {
                      icon: <Clock className="w-5 h-5 text-[#f5c518]" />,
                      label: "Depolyment Time", // Match exact spelling from user image
                      val: "≤ 12 Months"
                    },
                    {
                      icon: <TrendingUp className="w-5 h-5 text-[#f5c518]" />,
                      label: "Scalability",
                      val: "200 KW To\n50 MW+"
                    },
                    {
                      icon: <Box className="w-5 h-5 text-[#f5c518]" />,
                      label: "Architecture",
                      val: "Modular\nPrefabricated Pods"
                    }
                  ].map((spec, i) => (


                    <div key={i} className="grid grid-cols-1 sm:grid-cols-2 items-center py-3 border-b border-white/5 last:border-b-0">
                      <div className="flex flex-col items-center sm:flex-row sm:items-center gap-2 justify-center sm:justify-start">
                        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                          {spec.icon}
                        </div>
                        <span className="text-xs font-semibold text-white/70 uppercase tracking-wider text-center sm:text-left">{spec.label}</span>
                      </div>
                      <div className="text-center sm:text-left">
                        <span className="text-xs font-extrabold text-[#f5c518] whitespace-pre-line leading-relaxed uppercase tracking-wider font-mono break-words">{spec.val}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: FUTURE READY PLATFORM */}
            <div className="lg:col-span-6 flex flex-col gap-8 text-left">
              <div>
                <div className="text-left mb-6">
                  <span className="text-xs font-light uppercase tracking-widest text-white/50 block mb-1">FUTURE READY</span>
                  <span className="text-2xl font-black uppercase tracking-wider text-[#f5c518] block">PLATFORM</span>
                </div>

                {/* Top Card: ARMS 300 COMING SOON */}
                <div className="bg-gradient-to-br from-[#0c0d0a]/90 via-[#070806]/95 to-[#0b0c0a]/90 border border-white/10 rounded-3xl p-8 relative shadow-[0_20px_50px_rgba(0,0,0,0.4)] overflow-hidden hover:border-[#f5c518]/25 transition-all duration-500 flex flex-col md:flex-row items-center gap-6">
                  <div className="flex-1 text-left relative z-10">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-[#f5c518]/10 border border-[#f5c518]/25 flex items-center justify-center text-[#f5c518]">
                        <Layers className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-lg font-black text-white leading-tight uppercase tracking-tight">ARMS 300</h4>
                        <span className="text-[10px] font-bold text-[#f5c518] uppercase tracking-widest font-mono">COMMING SOON</span> {/* Match exact spelling from user image */}
                      </div>
                    </div>
                    <p className="text-white/40 text-xs leading-relaxed max-w-sm">
                      The next evolution of our ARMS platform, delivering even greater capacity and efficiency for next-generation AI workloads.
                    </p>
                  </div>

                  <div className="relative w-36 h-36 flex items-center justify-center mx-auto md:mx-0 bg-black/40 border border-white/5 rounded-2xl overflow-hidden group/cube shrink-0 z-10">
                    <div className="absolute inset-0 bg-[#f5c518]/10 pointer-events-none filter blur-xl" />

                    {/* Animated custom 3D isometric glowing cube */}
                    <div className="w-16 h-16 relative transform -rotate-x-[30deg] -rotate-y-[45deg] animate-[spin_12s_linear_infinite] [transform-style:preserve-3d]">
                      {/* Top Face */}
                      <div className="absolute inset-0 border border-[#f5c518]/80 bg-[#f5c518]/10 [transform:rotateX(90deg)_translateZ(32px)] flex items-center justify-center">
                        <div className="w-8 h-8 border border-[#f5c518]/30 border-dashed rounded-full" />
                      </div>
                      {/* Bottom Face */}
                      <div className="absolute inset-0 border border-[#f5c518]/80 bg-[#f5c518]/10 [transform:rotateX(-90deg)_translateZ(32px)]" />
                      {/* Front Face */}
                      <div className="absolute inset-0 border border-[#f5c518]/80 bg-[#f5c518]/10 [transform:translateZ(32px)] flex flex-wrap p-1 gap-1">
                        {[...Array(9)].map((_, i) => (
                          <div key={i} className="w-3.5 h-3.5 bg-[#f5c518]/20 rounded-sm border border-[#f5c518]/30" />
                        ))}
                      </div>
                      {/* Back Face */}
                      <div className="absolute inset-0 border border-[#f5c518]/80 bg-[#f5c518]/10 [transform:rotateY(180deg)_translateZ(32px)]" />
                      {/* Left Face */}
                      <div className="absolute inset-0 border border-[#f5c518]/80 bg-[#f5c518]/10 [transform:rotateY(-90deg)_translateZ(32px)]" />
                      {/* Right Face */}
                      <div className="absolute inset-0 border border-[#f5c518]/80 bg-[#f5c518]/10 [transform:rotateY(90deg)_translateZ(32px)]" />
                    </div>

                    {/* Floor grid effect */}
                    <div className="absolute bottom-0 inset-x-0 h-8 bg-gradient-to-t from-[#f5c518]/10 to-transparent border-t border-[#f5c518]/20" />
                  </div>
                </div>
              </div>

              {/* Bottom Card: STRATEGIC PARTNERSHIPS */}
              <div className="bg-gradient-to-br from-[#0c0d0a]/90 via-[#070806]/95 to-[#0b0c0a]/90 border border-white/10 rounded-3xl p-8 relative shadow-[0_20px_50px_rgba(0,0,0,0.4)] overflow-hidden hover:border-[#f5c518]/25 transition-all duration-500 flex flex-col justify-between text-left">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-[#f5c518]/10 border border-[#f5c518]/25 flex items-center justify-center text-[#f5c518]">
                    {/* Handshake Icon */}
                    <svg className="w-6 h-6 stroke-current" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-black text-white uppercase tracking-wider">STRATEGIC PARTNERSHIPS</h4>
                </div>
                <p className="text-white/40 text-xs mb-6 font-medium">
                  DigiPowerX leverages industry-leading technology through partnerships with:
                </p>

                {/* Partner list */}
                <div className="space-y-4">
                  {/* Super Micro */}
                  <div className="flex items-center gap-4 p-4 bg-black/40 border border-white/5 rounded-2xl hover:border-[#f5c518]/20 transition-all duration-300 group">
                    <div className="flex items-center justify-center bg-white rounded-xl p-2 w-36 h-20 shadow-sm border border-white/10 flex-shrink-0 group-hover:shadow-[0_0_15px_rgba(245,197,24,0.1)] transition-all duration-300">
                      <img
                        src="/images/Super_Micro_Computer_Logo.svg"
                        alt="Supermicro Logo"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-[1px] h-8 bg-white/10" />
                      <div className="text-left">
                        <span className="text-xs font-bold text-white block uppercase tracking-wide">Super Micro Computer</span>
                        <span className="text-[10px] font-bold text-[#f5c518] uppercase tracking-wider font-mono">Advanced Server Solutions</span>
                      </div>
                    </div>
                  </div>

                  {/* NVIDIA */}
                  <div className="flex items-center gap-4 p-4 bg-black/40 border border-white/5 rounded-2xl hover:border-[#76b900]/20 transition-all duration-300 group">
                    <div className="flex items-center justify-center bg-white rounded-xl p-0 w-36 h-20 shadow-sm border border-white/10 flex-shrink-0 group-hover:shadow-[0_0_15px_rgba(118,185,0,0.15)] transition-all duration-300 overflow-hidden">
                      <img
                        src="/images/nvidia.png"
                        alt="NVIDIA Logo"
                        className="w-full h-full object-contain scale-[1.9]"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling!.style.display = 'flex';
                        }}
                      />
                      <div style={{ display: 'none' }} className="items-center justify-center">
                        <span className="text-[#76b900] font-extrabold text-xs tracking-widest">N</span>
                        <span className="text-black font-black text-xs tracking-wider">VIDIA</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-[1px] h-8 bg-white/10" />
                      <div className="text-left">
                        <span className="text-xs font-bold text-white block uppercase tracking-wide">NVIDIA</span>
                        <span className="text-[10px] font-bold text-[#f5c518] uppercase tracking-wider font-mono">GPU Acceleration & AI Compute</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      <CTASection />

      {/* Full-screen Certificate Modal */}
      <AnimatePresence>
        {showCertModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCertModal(false)}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out animate-fade-in"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-2xl w-full max-h-[95vh] bg-white rounded-3xl overflow-hidden shadow-2xl p-2 cursor-default flex flex-col"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowCertModal(false)}
                className="absolute top-4 right-4 bg-black/60 hover:bg-black text-white p-2.5 rounded-full transition-colors z-50 shadow-md"
                aria-label="Close modal"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="overflow-y-auto max-h-[calc(95vh-16px)] flex items-center justify-center bg-white rounded-2xl p-4">
                <img
                  src="/images/arms.webp"
                  alt="ARMS 200 Certificate of Conformance"
                  className="max-h-[85vh] w-auto object-contain rounded-lg shadow-sm"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ARMS;
