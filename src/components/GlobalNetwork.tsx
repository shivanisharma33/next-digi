import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CTASection } from './Footer';
import DgxGlobe from './DgxGlobe';
import GlobalNetworkHeroVisual3D from './GlobalNetworkHeroVisual3D';
import EnergyHeroCanvas from './EnergyHeroCanvas';

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
            className="w-full min-h-[400px] md:min-h-[500px] lg:min-h-[600px] relative"
          >
            <GlobalNetworkHeroVisual3D />
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
            { val: "450MW", label: "Pipeline Capacity in Development" },
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
      <section className="bg-white py-15 px-6 relative overflow-hidden">
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
            <p className="text-black/50 text-base md:text-[19px] leading-[1.6] font-medium tracking-tight">
              Multi-region sites linked by a redundant backbone and operated as one platform. Power, fiber, and compute provisioned together — without the gaps that slow leased-only competitors.
            </p>
          </div>

          {/* Main Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">

            {/* Left Column: Slim Feature Row-Cards */}
            <div className="flex flex-col gap-3 justify-center">
              {[
                "Geographically diverse sites with independent power profiles",
                "Inter-site backbone for replication and failover",
                "Edge-to-core latency budget engineered for AI workloads",
                "One operations team across the full network footprint"
              ].map((text, i) => (
                <div key={i} className="bg-[#f8f9fa] py-4.5 px-6 rounded-xl flex items-center gap-4 border border-black/[0.04] shadow-sm hover:shadow-md hover:border-[#f5c518]/30 transition-all duration-300 group">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform group-hover:translate-x-0.5 transition-transform">
                      <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="#f5c518" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <p className="text-black/85 font-semibold text-xs md:text-sm leading-relaxed tracking-tight">
                    {text}
                  </p>
                </div>
              ))}
            </div>

            {/* Right Column: Network Animation */}
            <div className="relative h-full flex items-center justify-center">
              <div className="w-full max-w-[680px] aspect-[16/8] rounded-2xl overflow-hidden border border-black/10 shadow-xl">
                <DgxGlobe />
              </div>
            </div>

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
      <section className="bg-white py-15 px-6">
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
            <p className="text-black/50 text-sm md:text-lg leading-relaxed font-medium">
              The DigiPowerX network compounds as each new site comes online: more diversity, more capacity, lower customer latency, and more revenue per megawatt across the footprint.
            </p>
            <p className="text-black/50 text-sm md:text-lg leading-relaxed font-medium">
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
                className="relative bg-gradient-to-br from-[#fffef7] via-[#fffbf0] to-[#fff6d6] p-8 rounded-[24px] flex flex-col items-start text-left border border-[#f5c518]/25 hover:border-[#f5c518]/50 transition-all duration-300 hover:from-[#fffdfa] hover:to-[#ffe8a8] hover:shadow-[0_25px_50px_-12px_rgba(245,197,24,0.12)] hover:-translate-y-1 group cursor-pointer min-h-[300px] overflow-hidden"
              >
                {/* Step Pill */}
                <div className="flex items-center justify-between w-full mb-6">
                  <span className="text-[10px] font-mono font-bold tracking-widest text-[#8a6500] bg-gradient-to-r from-[#f5c518]/25 to-[#ffb000]/15 px-3 py-1 rounded-md">
                    {`STEP 0${i + 1}`}
                  </span>
                </div>

                {/* SVG Icon */}
                <div className="text-[#b38600] group-hover:text-[#8a6500] transition-colors duration-300 mb-5 shrink-0">
                  {card.icon}
                </div>

                {/* Content */}
                <h3 className="text-transparent bg-clip-text bg-gradient-to-r from-[#8a6500] to-[#b38600] group-hover:from-[#b38600] group-hover:to-[#e0ab00] text-lg font-bold uppercase tracking-tight mb-3 transition-all duration-300">
                  {card.title}
                </h3>
                <p className="text-[#3e3e40] text-[13px] md:text-sm leading-relaxed font-semibold">
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
              { val: "450MW Pipe", label: "PIPELINE CAPACITY IN DEVELOPMENT — EXTENDS THE NETWORK INTO NEW CUSTOMER GEOGRAPHIES." }
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
