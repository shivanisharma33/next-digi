import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Handshake,
  Cpu,
  Globe,
  Layers,
  Link2,
  Rocket,
  GraduationCap,
  TrendingUp,
  Headphones,
  Eye,
  Megaphone,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { CTASection } from './Footer';
import PartnershipHeroVisual3D from './PartnershipHeroVisual3D';

/* ──────────────────────── helpers ──────────────────────── */

const SectionBadge = ({ label }: { label: string }) => (
  <div className="inline-flex items-center gap-4 px-6 py-2 rounded-full border border-white/20 mb-8 backdrop-blur-sm">
    <div className="flex items-center gap-1.5">
      <div className="h-[2px] w-8 bg-brand-yellow" />
      <div className="h-[2px] w-2 bg-white/20" />
    </div>
    <span className="text-[10px] font-semibold uppercase tracking-[0.4em] text-white/80">{label}</span>
  </div>
);

const FadeUp = ({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    viewport={{ once: true }}
    className={className}
  >
    {children}
  </motion.div>
);

/* ──────────────────────── data ──────────────────────── */

const benefits = [
  { text: 'Access to the latest AI and data infrastructure technologies', icon: <Cpu className="w-5 h-5" /> },
  { text: 'Joint marketing and brand visibility across global networks', icon: <Megaphone className="w-5 h-5" /> },
  { text: 'Dedicated partner growth and enablement programs', icon: <Rocket className="w-5 h-5" /> },
  { text: 'Comprehensive training and technical certifications', icon: <GraduationCap className="w-5 h-5" /> },
  { text: 'Revenue growth through co-developed solutions', icon: <TrendingUp className="w-5 h-5" /> },
  { text: '24/7 support from our global success team', icon: <Headphones className="w-5 h-5" /> },
];

const partnershipModels = [
  {
    tag: '01',
    title: 'Technology Alliance',
    desc: 'Collaborate on modern digital infrastructure and AI-driven cloud innovations to transform industries.',
    icon: <Cpu className="w-7 h-7" />,
    gradient: 'from-brand-yellow/20 to-brand-yellow/5',
  },
  {
    tag: '02',
    title: 'Channel Partner',
    desc: 'Co-sell and co-market advanced technology solutions for shared global success.',
    icon: <Globe className="w-7 h-7" />,
    gradient: 'from-blue-500/20 to-blue-500/5',
  },
  {
    tag: '03',
    title: 'Strategic Partner',
    desc: 'Shape the future through deep collaboration and mutual growth strategies.',
    icon: <Layers className="w-7 h-7" />,
    gradient: 'from-emerald-500/20 to-emerald-500/5',
  },
  {
    tag: '04',
    title: 'Integration Partner',
    desc: 'Integrate our technologies to deliver seamless, end-to-end enterprise solutions.',
    icon: <Link2 className="w-7 h-7" />,
    gradient: 'from-purple-500/20 to-purple-500/5',
  },
];

/* ──────────────────────── component ──────────────────────── */

const Partnership = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  return (
    <div className="bg-black text-white min-h-screen selection:bg-brand-yellow selection:text-black overflow-x-hidden">

      {/* ═══════════════════ HERO ═══════════════════ */}
      <section className="relative min-h-screen flex flex-col justify-center pt-32 pb-12 px-6 overflow-hidden bg-black">
        {/* Radial depth glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-brand-yellow/[0.03] blur-[140px] pointer-events-none" />

        <div className="relative z-10 max-w-[1400px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start lg:pt-12 px-4 mb-16">
          {/* Left Column: Text Narratives */}
          <motion.div
            initial={{ opacity: 0, x: -35 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6 flex flex-col items-start text-left"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-4 px-6 py-2 rounded-full border border-white/20 mb-8 backdrop-blur-sm">
              <div className="flex items-center gap-1.5">
                <div className="h-[2px] w-8 bg-brand-yellow" />
                <div className="h-[2px] w-2 bg-white/20" />
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.4em] text-white/80">Partnership</span>
            </div>

            <h1 className="text-[clamp(2.2rem,6vw,4.5rem)] font-semibold leading-[0.95] tracking-tighter uppercase mb-6 text-white text-left">
              <span className="block text-white mb-2">Partner with DigiPowerX</span>
              <span className="block text-brand-yellow">to Build Tomorrow</span>
            </h1>

            <p className="text-sm md:text-base text-white/50 max-w-[550px] leading-relaxed mb-10 font-medium text-left">
              We collaborate with visionary organizations to deliver intelligent, scalable, and future-ready solutions that transform industries and empower innovation.
            </p>

            <div className="flex flex-wrap gap-5 w-full sm:w-auto justify-start">
              <Link
                to="/contact"
                className="group bg-brand-yellow text-black px-10 py-4 font-semibold text-[12px] uppercase tracking-[0.2em] rounded shadow-[0_0_30px_rgba(245,197,24,0.2)] hover:bg-white transition-all flex items-center justify-center gap-3 w-full sm:w-auto"
              >
                Become a Partner
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/about"
                className="border border-white/10 bg-white/[0.03] text-white px-10 py-4 font-semibold text-[12px] uppercase tracking-[0.2em] rounded hover:bg-white/10 transition-all backdrop-blur-sm text-center w-full sm:w-auto"
              >
                Learn About Us
              </Link>
            </div>
          </motion.div>

          {/* Right Column: 3D Animation Visualizer */}
          <motion.div
            initial={{ opacity: 0, x: 35 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            className="lg:col-span-6 w-full relative aspect-square max-w-[500px] lg:max-w-none mx-auto flex items-center justify-center"
          >
            <div className="w-full h-full min-h-[400px] md:min-h-[500px] lg:min-h-[550px] relative z-10">
              <PartnershipHeroVisual3D />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ WHY PARTNER ═══════════════════ */}
      <section className="relative py-16 bg-black overflow-hidden">
        <div className="container mx-auto px-6 max-w-[1400px]">
          <div className="flex flex-col items-center text-center mb-16">
            <SectionBadge label="Why Partner With Us" />

            <h2 className="text-[clamp(2rem,5vw,4.5rem)] font-semibold leading-[0.95] tracking-tighter uppercase mb-8 text-white max-w-5xl">
              Built on Trust, Innovation <br className="hidden md:block" />
              & <span className="text-brand-yellow">Mutual Success</span>
            </h2>

            <p className="text-white/40 text-sm md:text-lg max-w-3xl mx-auto leading-relaxed font-medium">
              Our partnership model enables you to scale faster, reach wider audiences, and deliver greater impact.
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, i) => (
              <FadeUp key={i} delay={i * 0.08}>
                <div
                  className="group relative p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-brand-yellow/30 transition-all duration-500 h-full"
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
                  }}
                >
                  {/* Hover glow */}
                  <div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(245,197,24,0.06), transparent 40%)`,
                    }}
                  />

                  <div className="relative z-10 flex items-start gap-5">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-brand-yellow/10 border border-brand-yellow/20 flex items-center justify-center text-brand-yellow group-hover:bg-brand-yellow/20 transition-colors duration-500">
                      {benefit.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-white/80 text-sm md:text-[15px] leading-relaxed font-medium group-hover:text-white transition-colors">
                        {benefit.text}
                      </p>
                    </div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ PARTNERSHIP MODELS ═══════════════════ */}
      <section className="relative py-16 bg-[#060708] overflow-hidden">
        {/* Subtle background accent */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-brand-yellow/[0.03] blur-[150px] pointer-events-none" />

        <div className="container mx-auto px-6 max-w-[1400px]">
          <div className="flex flex-col items-center text-center mb-16">
            <SectionBadge label="Partnership Models" />

            <h2 className="text-[clamp(2rem,5vw,4.5rem)] font-semibold leading-[0.95] tracking-tighter uppercase mb-8 text-white max-w-5xl">
              Choose Your <span className="text-brand-yellow">Partnership</span> Path
            </h2>
          </div>

          {/* Models Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {partnershipModels.map((model, i) => (
              <FadeUp key={i} delay={i * 0.1}>
                <div className="group relative p-10 md:p-12 rounded-2xl bg-[#0a0c0f] border border-white/5 hover:border-brand-yellow/20 transition-all duration-700 overflow-hidden h-full">
                  {/* Background gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${model.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />

                  <div className="relative z-10">
                    {/* Tag number */}
                    <div className="flex items-center justify-between mb-8">
                      <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-brand-yellow/60">{model.tag}</span>
                      <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 group-hover:text-brand-yellow group-hover:border-brand-yellow/30 transition-all duration-500">
                        {model.icon}
                      </div>
                    </div>

                    <h3 className="text-2xl md:text-3xl font-semibold uppercase tracking-tight text-white mb-4 group-hover:text-brand-yellow transition-colors duration-500">
                      {model.title}
                    </h3>

                    <p className="text-white/40 text-sm md:text-[15px] leading-relaxed font-medium group-hover:text-white/60 transition-colors duration-500">
                      {model.desc}
                    </p>

                    {/* Arrow indicator */}
                    <div className="mt-8 flex items-center gap-2 text-brand-yellow/0 group-hover:text-brand-yellow transition-all duration-500">
                      <span className="text-[11px] font-bold uppercase tracking-widest">Learn More</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ FINAL CTA ═══════════════════ */}
      <section className="relative py-20 bg-black overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 z-0 opacity-[0.08]">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(245,197,24,0.15)_1px,transparent_1px),linear-gradient(to_bottom,rgba(245,197,24,0.15)_1px,transparent_1px)] bg-[size:40px_40px]" />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-brand-yellow/[0.05] blur-[100px] pointer-events-none" />

        <div className="relative z-10 container mx-auto px-6 max-w-[900px] text-center">
          <FadeUp>
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-brand-yellow/20 bg-brand-yellow/5 mb-10">
              <Sparkles className="w-3.5 h-3.5 text-brand-yellow" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-yellow">Join Our Network</span>
            </div>

            <h2 className="text-[clamp(2rem,5vw,4rem)] font-semibold leading-[0.95] tracking-tighter uppercase mb-6 text-white">
              Let's Build the Future <br />
              — <span className="text-brand-yellow">Together</span>
            </h2>

            <p className="text-white/45 text-sm md:text-lg max-w-2xl mx-auto leading-relaxed font-medium mb-12">
              Join our global network of innovators, strategists, and technology leaders. Let's shape the next era of digital infrastructure together.
            </p>

            <Link
              to="/contact"
              className="group inline-flex items-center gap-3 bg-brand-yellow text-black px-14 py-5 font-bold text-[13px] uppercase tracking-[0.2em] rounded shadow-[0_0_40px_rgba(245,197,24,0.25)] hover:bg-white transition-all active:scale-[0.98]"
            >
              Apply for Partnership
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </FadeUp>
        </div>
      </section>

      {/* Footer CTA */}
      <CTASection />
    </div>
  );
};

export default Partnership;
