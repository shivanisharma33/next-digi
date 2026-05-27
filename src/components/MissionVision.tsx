import { motion } from 'framer-motion';
import { Target, Compass, Zap, ShieldCheck, Globe2, Cpu } from 'lucide-react';
import { CTASection } from './Footer';
import MissionVisionHeroVisual3D from './MissionVisionHeroVisual3D';



const values = [
  {
    icon: Zap,
    title: 'Power First',
    body: 'We own and operate the energy stack — generation, substations, and high-density facilities — so our customers never wait on the grid.',
  },
  {
    icon: ShieldCheck,
    title: 'Sovereign Compute',
    body: 'Dedicated, single-tenant infrastructure with no virtualization tax and no noisy neighbors. Your models, your hardware, your rules.',
  },
  {
    icon: Globe2,
    title: 'Built in the U.S.',
    body: 'Domestic supply chain, U.S.-sited facilities, and a 450 MW development pipeline keep AI workloads on American soil.',
  },
  {
    icon: Cpu,
    title: 'Engineered for Superintelligence',
    body: 'Liquid-cooled racks, 400 Gb/s fabric, and modular factory builds — designed for the next generation of frontier models.',
  },
];

const usNodes = [
  { x: 60, y: 45, major: true, label: 'Seattle' },
  { x: 55, y: 60, major: false, label: 'Portland' },
  { x: 50, y: 95, major: true, label: 'SF' },
  { x: 65, y: 120, major: true, label: 'LA' },
  { x: 75, y: 130, major: false, label: 'San Diego' },
  { x: 95, y: 115, major: false, label: 'Las Vegas' },
  { x: 110, y: 135, major: false, label: 'Phoenix' },
  { x: 120, y: 90, major: false, label: 'Salt Lake City' },
  { x: 170, y: 100, major: true, label: 'Denver' },
  { x: 160, y: 130, major: false, label: 'Albuquerque' },
  { x: 175, y: 165, major: false, label: 'El Paso' },
  { x: 245, y: 160, major: true, label: 'Dallas' },
  { x: 255, y: 185, major: false, label: 'Houston' },
  { x: 235, y: 175, major: false, label: 'Austin' },
  { x: 225, y: 185, major: false, label: 'San Antonio' },
  { x: 240, y: 110, major: false, label: 'Kansas City' },
  { x: 270, y: 115, major: false, label: 'St. Louis' },
  { x: 310, y: 85, major: true, label: 'Chicago' },
  { x: 345, y: 80, major: false, label: 'Detroit' },
  { x: 270, y: 70, major: false, label: 'Minneapolis' },
  { x: 320, y: 130, major: false, label: 'Nashville' },
  { x: 345, y: 145, major: true, label: 'Atlanta' },
  { x: 385, y: 210, major: true, label: 'Miami' },
  { x: 375, y: 190, major: false, label: 'Tampa' },
  { x: 380, y: 170, major: false, label: 'Jacksonville' },
  { x: 365, y: 135, major: false, label: 'Charlotte' },
  { x: 390, y: 110, major: true, label: 'DC' },
  { x: 405, y: 100, major: false, label: 'Philadelphia' },
  { x: 415, y: 90, major: true, label: 'New York' },
  { x: 435, y: 75, major: false, label: 'Boston' },
  { x: 370, y: 100, major: false, label: 'Pittsburgh' },
  { x: 310, y: 105, major: false, label: 'Indianapolis' },
  { x: 285, y: 138, major: false, label: 'Memphis' },
  { x: 300, y: 185, major: false, label: 'New Orleans' },
  { x: 215, y: 140, major: false, label: 'Oklahoma City' },
  { x: 220, y: 95, major: false, label: 'Omaha' },
  { x: 230, y: 65, major: false, label: 'Fargo' },
  { x: 140, y: 70, major: false, label: 'Billings' },
  { x: 120, y: 60, major: false, label: 'Helena' },
  { x: 80, y: 45, major: false, label: 'Spokane' },
  { x: 48, y: 90, major: false, label: 'Sacramento' },
  { x: 345, y: 100, major: false, label: 'Columbus' },
  { x: 325, y: 115, major: false, label: 'Louisville' },
  { x: 320, y: 150, major: false, label: 'Birmingham' }
];

const MissionVision = () => {
  // Generate dense triangulation grid connections
  const mapConnections: [number, number][] = [];
  for (let i = 0; i < usNodes.length; i++) {
    for (let j = i + 1; j < usNodes.length; j++) {
      const dx = usNodes[i].x - usNodes[j].x;
      const dy = usNodes[i].y - usNodes[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 46) {
        mapConnections.push([i, j]);
      }
    }
  }

  return (
    <div className="bg-black min-h-screen text-white selection:bg-brand-yellow selection:text-black">
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center pt-28 md:pt-32 pb-8 px-6 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-yellow/[0.03] rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 w-full flex flex-col lg:flex-row items-center justify-between px-6 md:px-12 lg:px-20 max-w-none">
          {/* LEFT: Text */}
          <motion.div
            initial={{ opacity: 0, x: -35 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="w-full lg:w-[42%] flex flex-col items-start text-left z-10 mb-12 lg:mb-0"
          >
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-brand-yellow/30 bg-brand-yellow/5 backdrop-blur-sm mb-10">
              <span className="text-brand-yellow font-bold text-xs select-none">✦</span>
              <span className="text-[10px] uppercase tracking-[0.35em] font-bold text-white/90">Our Purpose</span>
            </div>

            <h1 className="text-[clamp(2.8rem,6.5vw,6rem)] font-normal leading-[0.92] tracking-tighter uppercase mb-10 text-white font-[Archivo,sans-serif]">
              MISSION <br /> <span className="text-brand-yellow">& VISION</span>
            </h1>

            <div className="relative mb-10 pl-6">
              <span className="text-brand-yellow font-serif text-5xl leading-none absolute left-0 top-[-8px] select-none">"</span>
              <p className="text-base md:text-lg text-white/70 max-w-lg leading-relaxed font-normal">
                We exist to power the AI/AAI factory — power, cooling, compute, and connectivity — which reach of every dream building toward a superintelligent era.
              </p>
            </div>

            <motion.button
              onClick={() => {
                document.getElementById('vision-mission-details')?.scrollIntoView({ behavior: 'smooth' });
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-4 px-7 py-3 rounded-md border border-brand-yellow/40 bg-black/60 text-[11px] font-bold uppercase tracking-[0.25em] text-brand-yellow hover:border-brand-yellow hover:bg-brand-yellow/10 transition-all duration-300 cursor-pointer shadow-[0_0_15px_rgba(245,197,24,0.05)]"
            >
              <span>Explore Our Journey</span>
              <span className="text-sm font-semibold select-none">↗</span>
            </motion.button>
          </motion.div>

          {/* RIGHT: 3D Animation */}
          <motion.div
            initial={{ opacity: 0, x: 35 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            className="w-full lg:absolute lg:right-0 lg:top-0 lg:w-[62vw] lg:h-full min-h-[350px] md:min-h-[450px] lg:min-h-[600px] z-0 overflow-visible pointer-events-none"
          >
            <MissionVisionHeroVisual3D />
          </motion.div>
        </div>
      </section>

      {/* Mission + Vision side-by-side */}
      <section id="vision-mission-details" className="py-16 lg:py-24 bg-black relative border-t border-white/5">
        <div className="container mx-auto px-6 max-w-[1400px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6">
            {/* ═══ MISSION CARD ═══ */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative rounded-xl border border-[#1c1c1c] bg-[#0c0c0c] overflow-hidden flex flex-col"
              style={{
                background: 'linear-gradient(180deg, #0e0e0e 0%, #090909 100%)',
              }}
            >
              {/* Subtle top-right amber glow */}
              <div className="absolute top-0 right-0 w-60 h-60 rounded-full bg-brand-yellow/[0.025] blur-[80px] pointer-events-none" />

              <div className="relative z-10 flex-1 p-10 lg:p-12">
                {/* Icon Badge */}
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl border border-brand-yellow/25 bg-brand-yellow/[0.06] mb-7">
                  <Target size={20} className="text-brand-yellow" />
                </div>

                {/* Label */}
                <div className="text-[10px] font-semibold uppercase tracking-[0.45em] text-brand-yellow/80 mb-5">Mission</div>

                {/* Heading — serif style like the reference */}
                <h2
                  className="text-[1.9rem] md:text-[2.4rem] lg:text-[2.6rem] font-extrabold uppercase tracking-tight text-white mb-7 leading-[1.08]"
                >
                  BUILD THE <span className="text-brand-yellow">FACTORIES</span>
                  <br />AI RUNS ON.
                </h2>

                {/* Body */}
                <p className="text-white/55 text-[14px] leading-[1.75] mb-4 max-w-lg">
                  DigiPowerX develops, owns, and operates the high-density power and computing infrastructure required to train and serve frontier AI. We integrate generation, liquid-cooled facilities, and NVIDIA-based GPU clusters into one vertically owned stack.
                </p>
                <p className="text-white/40 text-[14px] leading-[1.75] mb-0 max-w-lg">
                  Our customers bring the models. We bring the megawatts, the cooling, the silicon, and the orchestration — delivered as one operational system, not a stack of vendors.
                </p>
              </div>
            </motion.div>

            {/* ═══ VISION CARD ═══ */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="relative rounded-xl border border-[#1c1c1c] bg-[#0c0c0c] overflow-hidden flex flex-col"
              style={{
                background: 'linear-gradient(180deg, #0e0e0e 0%, #090909 100%)',
              }}
            >
              {/* Subtle bottom-left amber glow */}
              <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full bg-brand-yellow/[0.025] blur-[80px] pointer-events-none" />

              <div className="relative z-10 flex-1 p-10 lg:p-12">
                {/* Icon Badge */}
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl border border-brand-yellow/25 bg-brand-yellow/[0.06] mb-7">
                  <Compass size={20} className="text-brand-yellow" />
                </div>

                {/* Label */}
                <div className="text-[10px] font-semibold uppercase tracking-[0.45em] text-brand-yellow/80 mb-5">Vision</div>

                {/* Heading — serif style like the reference */}
                <h2
                  className="text-[1.9rem] md:text-[2.4rem] lg:text-[2.6rem] font-extrabold uppercase tracking-tight text-white mb-7 leading-[1.08]"
                >
                  A NATION <span className="text-brand-yellow italic">READY</span> FOR
                  <br />SUPERINTELLIGENCE.
                </h2>

                {/* Body */}
                <p className="text-white/55 text-[14px] leading-[1.75] mb-4 max-w-lg">
                  We see a future where AI capability is bounded by ambition — not by access to power, land, or accelerators. DigiPowerX is building the domestic backbone so American researchers, startups, and enterprises can scale without waiting on hyperscalers.
                </p>
                <p className="text-white/40 text-[14px] leading-[1.75] mb-0 max-w-lg">
                  By 2030, our pipeline targets multi-gigawatt AI factory capacity across U.S. markets — purpose-built, customer-controlled, and powered for the densest workloads on the planet.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ OPERATING PRINCIPLES ═══ */}
      <section className="py-16 lg:py-24 bg-[#050505] relative border-t border-white/5 overflow-hidden">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-brand-yellow/[0.02] blur-[120px] pointer-events-none" />

        <div className="container mx-auto px-6 max-w-[1400px] relative z-10">
          <div className="mb-14 max-w-3xl">
            <div className="flex items-center gap-2.5 mb-6">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-yellow" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.45em] text-brand-yellow/80">Operating Principles</span>
            </div>
            <h2
              className="text-[clamp(2.5rem,6vw,4.5rem)] font-normal leading-[0.95] tracking-tighter uppercase text-white mb-5"
            >
              WHAT WE <span className="text-white/30">STAND FOR</span>
            </h2>
            <p className="text-white/40 text-[14px] leading-relaxed max-w-xl">
              Four principles guide every site we acquire, every megawatt we deploy, and every cluster we ship.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <motion.div
                  key={v.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.55 }}
                  className="group relative p-7 rounded-xl border border-[#1a1a1a] bg-[#0a0a0a] hover:border-brand-yellow/20 transition-all duration-500"
                >
                  {/* Icon */}
                  <div className="w-11 h-11 rounded-lg border border-brand-yellow/20 bg-brand-yellow/[0.05] flex items-center justify-center mb-5 group-hover:border-brand-yellow/35 group-hover:bg-brand-yellow/[0.08] transition-all duration-300">
                    <Icon size={17} className="text-brand-yellow" />
                  </div>

                  {/* Title */}
                  <h3 className="text-[14px] font-bold uppercase tracking-wide text-white mb-3">
                    {v.title}
                  </h3>

                  {/* Body */}
                  <p className="text-white/40 text-[13px] leading-[1.7]">{v.body}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );
};

export default MissionVision;
