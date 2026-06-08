"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Factory, Landmark, Wind, Globe, ShieldCheck } from 'lucide-react';

const CapabilityCard = ({ icon: Icon, title, description, delay }: { icon: any, title: string, description: string, delay: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className="group relative bg-gradient-to-br from-white via-[#f5c518]/3 to-[#f5c518]/8 rounded-2xl p-7 md:p-8 border border-[#f5c518]/10 shadow-[0_8px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(245,197,24,0.1)] hover:border-[#f5c518]/25 transition-all duration-500 h-full flex flex-col items-start overflow-hidden"
    >
      {/* Subtle Mesh Background for texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#f5c518 1px, transparent 0)', backgroundSize: '24px 24px' }} />

      {/* Decorative corner element */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-[#f5c518]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-tr-2xl" />

      {/* Icon Container with animated ring */}
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-[#f5c518] rounded-xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
        <div className="w-12 h-12 bg-white shadow-[0_4px_16px_rgba(0,0,0,0.04)] border border-gray-50 rounded-xl flex items-center justify-center relative z-10 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
          <Icon className="w-6 h-6 text-[#f5c518] group-hover:text-black transition-colors duration-500" />
        </div>
      </div>

      <h3 className="text-lg md:text-[19px] font-semibold uppercase tracking-tight text-black mb-3.5 group-hover:text-[#f5c518] transition-colors duration-500">{title}</h3>
      <p className="text-gray-500 text-[13px] md:text-sm leading-relaxed font-medium group-hover:text-gray-600 transition-colors duration-500">
        {description}
      </p>

      {/* Bottom indicator line */}
      <div className="mt-auto pt-6 w-full">
        <div className="h-[2px] w-6 bg-gray-100 group-hover:w-full group-hover:bg-[#f5c518] transition-all duration-500 origin-left" />
      </div>
    </motion.div>
  );
};

const Capabilities = () => {
  const items = [
    {
      icon: Zap,
      title: "Owned Power Generation",
      description: "Direct ownership of the energy stack. Natural gas, solar, and utility grid interconnects provide total control over uptime and cost structure."
    },
    {
      icon: Factory,
      title: "Substation Infrastructure",
      description: "Dedicated on-site power substations capable of delivering high-voltage capacity required for the next generation of GPU cluster training."
    },
    {
      icon: Landmark,
      title: "Tier III Data Centers",
      description: "Engineered for 99.99% availability with N+1 redundancy across cooling, power, and connectivity — purpose-built for high-density compute."
    },
    {
      icon: Wind,
      title: "Precision Liquid Cooling",
      description: "Direct-to-chip liquid cooling (DLC) and advanced heat rejection systems eliminate thermal bottlenecks and maximize GPU performance."
    },
    {
      icon: Globe,
      title: "400G Network Fabric",
      description: "Low-latency InfiniBand and Ethernet fabric with sub-microsecond east-west speeds — optimized for distributed AI training at scale."
    },
    {
      icon: ShieldCheck,
      title: "Physical Security",
      description: "Multi-layered perimeter defense, 24/7 on-site security forces, biometric access, and SOC 2 Type II compliance protecting critical infrastructure."
    }
  ];

  return (
    <section className="bg-[#fcfcfc] pt-10 pb-16 md:pb-20 relative overflow-hidden">

      {/* Enhanced Technical Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#000_1px,transparent_0)] [background-size:48px_48px] opacity-[0.03] pointer-events-none" />

      {/* Animated subtle grid pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg className="absolute w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="circuit-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M 10 10 L 90 10 L 90 90 L 10 90 Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
              <circle cx="10" cy="10" r="1.5" fill="currentColor" />
              <circle cx="90" cy="10" r="1.5" fill="currentColor" />
              <circle cx="90" cy="90" r="1.5" fill="currentColor" />
              <circle cx="10" cy="90" r="1.5" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit-pattern)" />
        </svg>
      </div>

      {/* Moving decorative elements */}
      <motion.div
        animate={{ y: [0, -40, 0], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 right-10 w-[400px] h-[400px] bg-[#f5c518] rounded-full blur-[160px] pointer-events-none"
      />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-20 relative z-10">

        {/* Header Section with enhanced typography */}
        <div className="flex flex-col items-center text-center mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-4 bg-white shadow-sm border border-gray-100 rounded-full px-6 py-2.5 mb-12 hover:shadow-md transition-shadow duration-500"
          >
            <div className="h-[2px] w-12 bg-[#f5c518]" />
            <span className="text-[10px] font-semibold tracking-[0.25em] text-black uppercase">CAPABILITIES</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-[clamp(2.5rem,6vw,5.5rem)] font-semibold leading-[0.95] tracking-tighter uppercase text-black mb-10"
          >
            FULL-STACK FACILITY <br className="hidden md:block" />
            <span className="text-[#f5c518] relative">
              SPECIFICATIONS.
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
                className="absolute -bottom-2 left-0 w-full h-[3px] bg-[#f5c518] origin-left opacity-60"
              />
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-gray-500 text-[14px] md:text-[17px] max-w-4xl leading-relaxed font-medium"
          >
            From incoming high-voltage utility to GPU rack output — each layer of our owned facilities is designed with high-density AI workload performance as the primary constraint.
          </motion.p>
        </div>

        {/* Grid Section with more spacing */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {items.map((item, index) => (
            <CapabilityCard
              key={index}
              icon={item.icon}
              title={item.title}
              description={item.description}
              delay={index * 0.1}
            />
          ))}
        </div>

        {/* ── CTA Conversion Block ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-16 md:mt-20 relative rounded-2xl overflow-hidden border border-[#f5c518]/20 bg-gradient-to-br from-white to-[#f5c518]/5 p-10 md:p-14 flex flex-col items-center text-center"
        >
          {/* Subtle corner accent */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#f5c518]/10 rounded-bl-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#f5c518]/5 rounded-tr-full pointer-events-none" />

          {/* Badge */}
          <div className="inline-flex items-center gap-2 mb-5 px-4 py-1.5 rounded-full border border-[#f5c518]/30 bg-[#f5c518]/10">
            <div className="w-1.5 h-1.5 rounded-full bg-[#f5c518]" />
            <span className="text-[9px] font-bold tracking-[0.3em] uppercase text-[#c8a400]">Ready to Deploy</span>
          </div>

          <h3 className="text-black font-semibold text-[clamp(1.5rem,3vw,2.5rem)] leading-tight tracking-tight mb-4 uppercase relative z-10">
            Ready to deploy at <span className="text-[#f5c518]">this scale?</span>
          </h3>
          <p className="text-gray-500 text-[15px] max-w-xl leading-relaxed mb-9 relative z-10">
            Our infrastructure team is ready to scope your requirements and deliver a custom proposal for colocation, build-to-suit, or GPU compute capacity.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 relative z-10">
            <a
              href="/contact"
              className="inline-flex items-center justify-center gap-2.5 bg-[#f5c518] text-black px-8 py-3.5 rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-[#ffda47] transition-all duration-300 shadow-lg shadow-[#f5c518]/25 hover:shadow-xl hover:shadow-[#f5c518]/35 hover:-translate-y-0.5 active:scale-95"
            >
              Request Infrastructure Quote
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
            </a>
            <a
              href="/documents-charters"
              className="inline-flex items-center justify-center gap-2.5 border border-black/15 text-black px-8 py-3.5 rounded-xl text-[11px] font-bold uppercase tracking-widest hover:border-[#f5c518] hover:text-[#c8a400] transition-all duration-300 active:scale-95"
            >
              Download Spec Sheet
            </a>
          </div>

          {/* Social proof micro-line */}
          <p className="mt-7 text-gray-400 text-[12px] relative z-10">
            Trusted by enterprise clients across AI, HPC &amp; cloud workloads · Typical response within <strong className="text-gray-500">12 hours</strong>
          </p>
        </motion.div>

      </div>
    </section>
  );
};

export default Capabilities;
