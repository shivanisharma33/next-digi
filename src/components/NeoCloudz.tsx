import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Zap, 
  Cpu, 
  Activity, 
  Server, 
  Droplets, 
  ShieldCheck, 
  Target, 
  ChevronRight, 
  Radio, 
  Network,
  Database,
  BarChart3,
  Layers,
  Maximize2,
  Lock,
  Box
} from 'lucide-react';
import { CTASection } from './Footer';
import NeuralCube3D from './NeuralCube3D';
import NeoCloudzHeroVisual3D from './NeoCloudzHeroVisual3D';
import GpuClusterDashboard from './GpuClusterDashboard';

// =========================================================
// LIVE CLUSTER TELEMETRY VISUAL
// =========================================================
const ClusterTelemetry = () => {
  const [nodes, setNodes] = React.useState(
    Array.from({ length: 32 }, (_, i) => ({
      id: i,
      util: Math.floor(Math.random() * 40) + 55,
      temp: Math.floor(Math.random() * 20) + 60,
    }))
  );

  React.useEffect(() => {
    const interval = setInterval(() => {
      setNodes(prev => prev.map(node => ({
        ...node,
        util: Math.max(50, Math.min(99, node.util + (Math.random() * 4 - 2))),
        temp: Math.max(55, Math.min(85, node.temp + (Math.random() * 2 - 1))),
      })));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full space-y-6">
      {/* 4x8 GRID OF NODES */}
      <div className="relative p-0 bg-transparent min-h-[320px] flex items-center justify-center overflow-hidden">
        {/* SVG INTERCONNECT FABRIC */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30" viewBox="0 0 1000 500" preserveAspectRatio="none">
          <defs>
            <filter id="glow-green-intense" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Core Spider-Web Paths */}
          <g className="opacity-20">
            <path id="path1" d="M 100 100 L 300 200 L 500 150 L 700 250" stroke="#00e878" strokeWidth="1" fill="none" />
            <path id="path2" d="M 200 300 L 400 250 L 600 350 L 800 300" stroke="#00e878" strokeWidth="1" fill="none" />
            <path id="path3" d="M 150 50 L 150 450" stroke="#00e878" strokeWidth="1" fill="none" />
            <path id="path4" d="M 850 50 L 850 450" stroke="#00e878" strokeWidth="1" fill="none" />
            <path id="path5" d="M 300 200 L 400 400 L 700 350" stroke="#00e878" strokeWidth="1" fill="none" />
          </g>
          
          {/* Animated Particles */}
          {[...Array(4)].map((_, i) => (
            <circle key={`p1-${i}`} r="3.5" fill="#00e878" filter="url(#glow-green-intense)" className="opacity-100">
              <animateMotion dur="4s" begin={`${i * 1.5}s`} repeatCount="indefinite">
                <mpath href="#path1" />
              </animateMotion>
            </circle>
          ))}
          {[...Array(4)].map((_, i) => (
            <circle key={`p2-${i}`} r="3.5" fill="#00e878" filter="url(#glow-green-intense)" className="opacity-100">
              <animateMotion dur="5s" begin={`${i * 2}s`} repeatCount="indefinite">
                <mpath href="#path2" />
              </animateMotion>
            </circle>
          ))}
          {[...Array(3)].map((_, i) => (
            <circle key={`p3-${i}`} r="3.5" fill="#00e878" filter="url(#glow-green-intense)" className="opacity-100">
              <animateMotion dur="3s" begin={`${i * 1.5}s`} repeatCount="indefinite">
                <mpath href="#path3" />
              </animateMotion>
            </circle>
          ))}
          
          {/* Static Nodes */}
          <circle cx="300" cy="200" r="4.5" fill="#00e878" filter="url(#glow-green-intense)" className="opacity-80" />
          <circle cx="500" cy="150" r="4.5" fill="#00e878" filter="url(#glow-green-intense)" className="opacity-80" />
          <circle cx="400" cy="250" r="4.5" fill="#00e878" filter="url(#glow-green-intense)" className="opacity-80" />
        </svg>

        <div className="grid grid-cols-4 md:grid-cols-8 gap-2.5 w-full max-w-5xl relative z-10">
          {nodes.map((node) => (
            <div 
              key={node.id}
              className="bg-black/95 border border-[#00e878]/30 rounded-[4px] p-2.5 flex flex-col justify-between h-[72px] relative"
            >
              <div className="flex flex-col gap-0.5">
                <div className="text-[10px] font-mono font-bold text-[#00e878]">{Math.round(node.util)}%</div>
                <div className="text-[9px] font-mono text-[#00e878]/70">{Math.round(node.temp)}C</div>
              </div>

              {/* Status Bar */}
              <div className="h-[3px] w-full bg-white/5 rounded-full overflow-hidden mt-1.5">
                <motion.div 
                  initial={false}
                  animate={{ width: `${node.util}%` }}
                  className="h-full bg-[#00e878]" 
                  style={{ boxShadow: '0 0 10px rgba(0, 232, 120, 0.6)' }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TERMINAL SUMMARY PANEL */}
      <div className="bg-[#050806] rounded-md border border-[#00e878]/10 overflow-hidden font-mono text-[11px] md:text-[12px] shadow-2xl">
        <div className="bg-[#0a0f0c] px-6 py-4 flex items-center border-b border-[#00e878]/10">
          <span className="text-[#00e878]/60 font-bold tracking-tight">neocloudz-cluster-01 // live telemetry</span>
        </div>
        
        <div className="p-8 space-y-4">
          <div className="flex flex-wrap items-center gap-x-3">
            <span className="text-[#00e878]/60">cluster_id:</span> <span className="text-[#00e878] font-bold">ncz-prod-b200-01</span>
            <span className="text-white/10 mx-1">|</span>
            <span className="text-[#00e878]/60">nodes:</span> <span className="text-[#00e878] font-bold">16x B200</span>
            <span className="text-white/10 mx-1">|</span>
            <span className="text-[#00e878]/60">fabric:</span> <span className="text-[#00e878] font-bold">400G InfiniBand</span>
          </div>
          
          <div className="flex flex-wrap items-center gap-x-3">
            <span className="text-[#f5c518]/60">util_avg:</span> <span className="text-[#f5c518] font-bold">80%</span>
            <span className="text-white/10 mx-1">|</span>
            <span className="text-[#f5c518]/60">temp_avg:</span> <span className="text-[#f5c518] font-bold">55°C</span>
            <span className="text-white/10 mx-1">|</span>
            <span className="text-[#f5c518]/60">vram:</span> <span className="text-[#f5c518] font-bold">3.07 TB / 3.20 TB</span>
          </div>

          <div className="flex flex-wrap items-center gap-x-3">
            <span className="text-[#3b82f6]/60">throughput:</span> <span className="text-[#3b82f6] font-bold">150k tok/s</span>
            <span className="text-white/10 mx-1">|</span>
            <span className="text-[#3b82f6]/60">job:</span> <span className="text-[#3b82f6] font-bold">llm-finetune-7b</span>
            <span className="text-white/10 mx-1">|</span>
            <span className="text-[#3b82f6]/60">checkpoint:</span> <span className="text-[#3b82f6]/60 font-bold">step_827</span>
          </div>

          <div className="flex flex-wrap items-center gap-x-3 text-white/30">
            <span>interconnect:</span> <span className="text-[#00e878] font-bold">healthy</span>
            <span className="text-white/10 mx-1">|</span>
            <span>fabric_util:</span> <span className="text-white/60 font-bold">69%</span>
            <span className="text-white/10 mx-1">|</span>
            <span>nccl:</span> <span className="text-[#00e878] font-bold">OK</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const NeoCloudz = () => {
  return (
    <div className="bg-[#050505] text-white overflow-x-hidden font-sans selection:bg-[#00e878]/20">
      
      {/* ── HERO SECTION ── */}
      <section className="relative min-h-screen flex items-center pt-28 md:pt-32 lg:pt-36 pb-10 md:pb-14 px-6 overflow-hidden">
        {/* Subtle dot grid */}
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #fff 1px, transparent 0)', backgroundSize: '40px 40px' }}
        />

        <div className="relative z-10 w-full max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start lg:pt-12">
          {/* LEFT: Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-start text-left"
          >
            <div className="inline-flex items-center gap-4 px-6 py-2 rounded-full border border-[#00e878]/20 bg-[#00e878]/5 backdrop-blur-xl mb-8 shadow-[0_0_30px_rgba(0,232,120,0.05)]">
              <a href="https://www.neocloudz.com/" target="_blank" rel="noopener noreferrer" className="text-[10px] font-semibold tracking-[0.6em] text-[#00e878] uppercase underline underline-offset-4">NEO CLOUDZ</a>
              <span className="text-[10px] font-semibold tracking-[0.6em] text-white/40 uppercase">Bare-Metal GPU Compute</span>
            </div>

            <h1 className="text-[clamp(2.5rem,6vw,5.5rem)] font-semibold leading-[0.95] tracking-tighter uppercase mb-8 text-white">
              NEO <br />
              <span className="text-[#00e878] drop-shadow-[0_0_20px_rgba(0,232,120,0.3)]">CLOUDZ.</span>
            </h1>

            <p className="text-white/60 max-w-xl text-sm md:text-base font-medium leading-relaxed mb-8 tracking-tight">
              NeoCloudz is the bare-metal GPU compute layer built on DigiPowerX infrastructure — dedicated cluster access, 400G fabric, and performance-first architecture for AI training, inference, and HPC.
            </p>

            <div className="flex flex-wrap gap-8">
              <Link to="/contact" className="px-10 py-4 md:px-14 md:py-6 bg-[#00e878] text-black font-semibold text-[11px] uppercase tracking-[0.3em] rounded-sm hover:bg-white transition-all shadow-[0_10px_50px_rgba(0,232,120,0.3)]">
                Request Capacity
              </Link>
              <Link to="/investors" className="px-10 py-4 md:px-14 md:py-6 border border-white/10 bg-white/5 backdrop-blur-md font-semibold text-[11px] uppercase tracking-[0.3em] rounded-sm hover:bg-white/10 transition-all">
                Investor Info
              </Link>
            </div>
          </motion.div>

          {/* RIGHT: 3D Animation */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full min-h-[400px] md:min-h-[500px] lg:min-h-[580px] relative"
          >
            <NeoCloudzHeroVisual3D />
          </motion.div>
        </div>
      </section>

      {/* ── OPERATIONAL MATRIX ── */}
      <section className="bg-[#080808] py-12 px-6 relative border-y border-white/5">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5 border border-white/5">
          {[
            { val: "B200", label: "Architecture", sub: "NVIDIA Blackwell cluster architecture", status: "NEXT-GEN" },
            { val: "400G", label: "Interconnect", sub: "InfiniBand NDR fabric per node", status: "FAST" },
            { val: "<60s", label: "Provisioning", sub: "Target bare-metal setup time", status: "LIVE" },
            { val: "16×", label: "Module Density", sub: "B200 nodes per cluster module", status: "DENSE" }
          ].map((card, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-12 bg-[#080808] group hover:bg-black transition-all duration-500 relative"
            >
              <div className="flex justify-between items-start mb-10">
                <span className="text-[10px] font-semibold text-[#00e878] tracking-[0.4em] uppercase">{card.label}</span>
                <div className="px-3 py-1 bg-white/5 border border-white/10 text-[7px] font-semibold tracking-widest group-hover:bg-[#00e878] group-hover:text-black transition-colors">{card.status}</div>
              </div>
              <div className="text-5xl font-semibold text-white tracking-tighter mb-4">{card.val}</div>
              <p className="text-[10px] font-medium text-white/30 tracking-widest leading-relaxed uppercase">{card.sub}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── LIVE TELEMETRY SECTION ── */}
      <section className="bg-black py-16 px-6 relative overflow-hidden border-b border-white/5">
        <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-20 items-center">
          <div className="lg:w-1/2 space-y-12">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-px bg-[#00e878]" />
                <span className="text-[10px] font-semibold tracking-[0.6em] text-[#00e878] uppercase">Live Cluster Telemetry</span>
              </div>
              <h2 className="text-[clamp(2.5rem,6vw,5rem)] font-semibold leading-[0.95] tracking-tighter uppercase text-white mb-8 relative z-10">
                FULL CLUSTER <br />
                <span className="text-[#00e878]">VISIBILITY.</span>
              </h2>
              <p className="text-base font-medium text-white/40 tracking-tight leading-relaxed max-w-xl">
                Every NeoCloudz deployment provides real-time node utilization, temperature, memory, and fabric throughput — giving teams the operational visibility that shared cloud environments cannot offer.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { t: "Deep Metrics", d: "Per-GPU utilization, VRAM, temp, and power", icon: Activity },
                { t: "Fabric Health", d: "Node-to-node traffic across InfiniBand", icon: Network },
                { t: "Job Status", d: "Checkpoint tracking and throughput telemetry", icon: Target },
                { t: "No Overhead", d: "No noisy neighbor or virtualization interference", icon: Zap }
              ].map((item, i) => (
                <div key={i} className="flex gap-6 group">
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-[#00e878] group-hover:bg-[#00e878] group-hover:text-black transition-all">
                    <item.icon size={18} />
                  </div>
                  <div className="space-y-1">
                    <div className="text-[11px] font-semibold tracking-widest uppercase">{item.t}</div>
                    <div className="text-[10px] font-medium text-white/30 leading-relaxed uppercase">{item.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:w-1/2 w-full relative">
            <div className="absolute top-0 left-0 w-full h-full bg-[#00e878]/10 blur-[100px] rounded-full pointer-events-none" />
            <div className="relative">
              <div className="absolute -top-8 right-0 text-[9px] font-mono font-medium text-[#00e878] tracking-[0.4em] uppercase">NeoCloudz Cluster — Live Node Telemetry</div>
              <GpuClusterDashboard />
            </div>
          </div>
        </div>
      </section>

      {/* ── SUPPORTED WORKLOADS ── */}
      <section className="bg-black py-16 px-6 relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-6 mb-10">
              <div className="w-16 h-[1px] bg-[#00e878]" />
              <span className="text-[11px] font-semibold tracking-[0.6em] text-[#00e878] uppercase">02 / Supported Workloads</span>
              <div className="w-16 h-[1px] bg-[#00e878]" />
            </div>
            <h2 className="text-[clamp(2.5rem,6vw,5.5rem)] font-semibold leading-[0.95] tracking-tighter uppercase text-white mb-8 relative z-10">
              WHAT THIS <br />
              <span className="text-[#00e878]">RUNS.</span>
            </h2>
            <p className="text-white/40 text-sm md:text-base font-medium leading-relaxed max-w-4xl mx-auto tracking-tight">
              NeoCloudz is purpose-built for workloads that demand predictable performance, direct hardware control, and high-speed node-to-node communication.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {[
              {
                title: "TRAINING",
                subtitle: "Large Model Training",
                icon: Cpu,
                desc: "Dedicated multi-node clusters for training foundation models where interconnect and utilization are critical.",
                items: [
                  "LLM pre-training and fine-tuning at scale",
                  "Distributed training with NCCL / MPI",
                  "Persistent NVMe checkpoint storage",
                  "Sustained 94%+ GPU utilization"
                ]
              },
              {
                title: "INFERENCE",
                subtitle: "Production Inference",
                icon: Activity,
                desc: "Bare-metal GPU capacity for predictable latency and the ability to run proprietary model weights securely.",
                items: [
                  "Real-time inference with low-latency SLA",
                  "Batch processing and offline pipelines",
                  "Private deployment with no shared surface",
                  "Multi-billion parameter model serving"
                ]
              },
              {
                title: "HPC",
                subtitle: "High-Performance Computing",
                icon: Target,
                desc: "GPU-accelerated simulation and rendering that benefits from dense capacity and power cost advantages.",
                items: [
                  "Physics simulation and molecular dynamics",
                  "3D rendering and generative media",
                  "Scientific computing and numerical analysis",
                  "Financial modeling and quantitative workloads"
                ]
              }
            ].map((w, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative bg-[#080808] border border-white/5 p-16 rounded-2xl hover:border-[#00e878]/30 transition-all overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#00e878]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-[#00e878]/10 transition-all" />
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-14 h-14 rounded-xl bg-[#00e878]/10 flex items-center justify-center text-[#00e878]">
                    <w.icon size={24} />
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-[#00e878] tracking-[0.5em] block mb-1 uppercase">{w.title}</span>
                    <span className="text-xl font-semibold text-white tracking-tight uppercase">{w.subtitle}</span>
                  </div>
                </div>
                <p className="text-white/40 text-[13px] font-semibold tracking-tight leading-relaxed mb-8 group-hover:text-white/60 transition-colors uppercase">{w.desc}</p>
                <div className="space-y-4">
                  {w.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 py-3 border-t border-white/5">
                      <div className="w-1 h-1 rounded-full bg-[#00e878]" />
                      <span className="text-[10px] font-semibold text-white/60 tracking-widest uppercase">{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GPU CLUSTER ARCHITECTURE - (NEW ATTRACTIVE REDESIGN) ── */}
      <section className="bg-[#050505] py-16 px-6 relative overflow-hidden border-t border-white/5">
        {/* Advanced Background Grid */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }}
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#00e878]/5 rounded-full blur-[140px]" />
        </div>

        <div className="max-w-[1400px] mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-start">
            
            {/* Left: Content & Vertical Specs */}
            <div className="lg:col-span-5 space-y-16">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-4">
                  <span className="w-8 h-px bg-[#00e878]" />
                  <span className="text-[11px] font-semibold tracking-[0.6em] text-[#00e878] uppercase">Technical Infrastructure</span>
                </div>
                <h2 className="text-[clamp(2.5rem,6vw,4.5rem)] font-semibold leading-[0.95] tracking-tighter uppercase text-white">
                  GPU CLUSTER <br />
                  <span className="text-[#00e878]">ARCHITECTURE.</span>
                </h2>
                <p className="text-base font-medium text-white/40 tracking-tight leading-relaxed max-w-xl">
                  A performance-first architecture designed to eliminate the common bottlenecks found in virtualized cloud environments. Direct bare-metal access meets high-density accelerator fabric.
                </p>
              </div>

              {/* Vertical Spec Sheet */}
              <div className="space-y-4 border-l border-white/10 pl-10">
                {[
                  { label: "VIRTUALIZATION", val: "NONE (BARE METAL DIRECT)" },
                  { label: "ACCELERATOR TYPE", val: "NVIDIA BLACKWELL B200" },
                  { label: "INTERCONNECT FABRIC", val: "400G INFINIBAND NDR" },
                  { label: "STORAGE PROTOCOL", val: "NVME-OVER-FABRIC (NVMEOF)" },
                ].map((spec, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ x: 10 }}
                    className="group flex flex-col gap-1 cursor-default"
                  >
                    <span className="text-[10px] font-mono font-medium text-white/20 group-hover:text-[#00e878] transition-colors tracking-widest">{spec.label}</span>
                    <span className="text-[12px] font-semibold text-white tracking-widest uppercase">{spec.val}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right: Command Center Metric Modules */}
            <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { 
                  icon: ShieldCheck, 
                  val: "BARE METAL", 
                  label: "Hardware Integrity", 
                  desc: "Dedicated hardware units with no hypervisor overhead or noisy neighbor interference.",
                  meta: "SLA: 99.99%"
                },
                { 
                  icon: Server, 
                  val: "H100/B200", 
                  label: "Module Density", 
                  desc: "High-density multi-node clusters optimized for distributed training workloads.",
                  meta: "16x NODES/CLUSTER"
                },
                { 
                  icon: Zap, 
                  val: "<$0.05", 
                  label: "Energy Efficiency", 
                  desc: "Strategic Alabama facility location provides a permanent power cost advantage.",
                  meta: "PER KWH COST"
                },
                { 
                  icon: Maximize2, 
                  val: "400G NDR", 
                  label: "Fabric Throughput", 
                  desc: "Unrestricted node-to-node communication for high-performance NCCL operations.",
                  meta: "LOW-LATENCY"
                }
              ].map((m, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ y: -5, borderColor: 'rgba(0, 232, 120, 0.4)' }}
                  className="bg-white/[0.02] border border-white/5 rounded-3xl p-10 backdrop-blur-md group relative overflow-hidden transition-all"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#00e878]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-[#00e878]/10 transition-all" />
                  
                  <div className="flex justify-between items-start mb-12">
                    <div className="w-12 h-12 rounded-2xl bg-[#00e878]/10 flex items-center justify-center text-[#00e878] group-hover:bg-[#00e878] group-hover:text-black transition-all">
                      <m.icon size={20} />
                    </div>
                    <span className="text-[9px] font-mono font-bold text-[#00e878]/40 tracking-widest uppercase border border-[#00e878]/20 px-3 py-1 rounded-full">
                      {m.meta}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div className="text-3xl font-semibold text-white tracking-tighter uppercase group-hover:text-[#00e878] transition-colors">{m.val}</div>
                    <div className="text-[11px] font-semibold text-[#00e878] tracking-[0.4em] uppercase">{m.label}</div>
                    <p className="text-[11px] font-medium text-white/30 tracking-widest leading-relaxed uppercase pt-4 border-t border-white/5">
                      {m.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── DEPLOYMENT FLOW ── */}
      <section className="bg-[#050505] pt-16 pb-10 px-6 relative border-t border-white/5">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-end mb-16 gap-10">
            <div className="max-w-4xl">
              <div className="flex items-center gap-6 mb-10">
                <div className="w-16 h-[1px] bg-[#00e878]" />
                <span className="text-[11px] font-semibold tracking-[0.6em] text-[#00e878] uppercase">01 / Deployment Flow</span>
              </div>
              <h2 className="text-[clamp(2.5rem,6vw,5.5rem)] font-semibold leading-[0.95] tracking-tighter uppercase text-white mb-8 relative z-10">
                FROM REQUEST TO <br />
                <span className="text-[#00e878]">RUNNING.</span>
              </h2>
            </div>
            <p className="text-[11px] font-medium text-white/40 tracking-widest leading-relaxed border-l-2 border-[#00e878] pl-8 max-w-sm">
              A streamlined path from capacity request to dedicated bare-metal GPU cluster — without queuing or overhead.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-px bg-white/10 border border-white/10">
            {[
              { stepNum: "01", t: "REQUEST", l: "Workload Profile", d: "Define cluster size, GPU type, interconnect, and storage requirements." },
              { stepNum: "02", t: "PROVISION", l: "Allocate Hardware", d: "Dedicated bare-metal nodes allocated with InfiniBand fabric configured." },
              { stepNum: "03", t: "DEPLOY", l: "Environment Live", d: "Direct hardware access with networking and OS image ready to run." },
              { stepNum: "04", t: "MONITOR", l: "Full Telemetry", d: "GPU utilization, temp, and memory stream in real time to dashboard." },
              { stepNum: "05", t: "SCALE", l: "Expand On Demand", d: "Additional nodes allocated as training jobs grow or demand increases." }
            ].map((s, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-12 bg-[#050505] group hover:bg-black transition-all relative overflow-hidden"
              >
                <span className="text-[10px] font-mono font-medium text-white/10 group-hover:text-[#00e878] transition-colors mb-8 block">{s.stepNum}</span>
                <div className="text-[10px] font-semibold text-[#00e878] tracking-[0.5em] mb-4">{s.t}</div>
                <h3 className="text-xl font-semibold text-white mb-6 uppercase tracking-tight">{s.l}</h3>
                <p className="text-[10px] font-medium text-white/30 tracking-widest leading-relaxed uppercase">{s.d}</p>
                <div className="absolute bottom-0 left-0 h-1 bg-[#00e878] w-0 group-hover:w-full transition-all duration-700" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );
};

export default NeoCloudz;
