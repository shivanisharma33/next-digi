import React from 'react';
import { motion } from 'framer-motion';

const ProcessStep = ({ number, title, description, delay }: { number: string, title: string, description: string, delay: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="flex-1 min-w-[200px] p-8 border-r border-gray-100 last:border-r-0 relative group"
    >
      <div className="text-[#f5c518] text-[12px] font-semibold mb-4 tracking-tighter">{number}</div>
      <h3 className="text-black font-semibold text-[14px] uppercase tracking-tight mb-3 group-hover:text-[#f5c518] transition-colors duration-300">{title}</h3>
      <p className="text-gray-500 text-[11px] leading-relaxed font-medium">
        {description}
      </p>

      {/* Hover bottom line */}
      <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#f5c518] group-hover:w-full transition-all duration-500" />
    </motion.div>
  );
};

const HowWeWork = () => {
  const steps = [
    {
      number: "01.",
      title: "Site & Power",
      description: "Land acquisition, utility coordination, and owned generation asset development."
    },
    {
      number: "02.",
      title: "Substation Build",
      description: "HV/MV substation engineering, construction, and commissioning to facility spec."
    },
    {
      number: "03.",
      title: "DC Construction",
      description: "Turnkey facility build — structural, MEP, cooling, and fire suppression systems."
    },
    {
      number: "04.",
      title: "GPU Deployment",
      description: "Rack installation, network fabric, NVIDIA H200 commissioning and burn-in."
    },
    {
      number: "05.",
      title: "NeoCloudz Live",
      description: "Bare-metal compute delivered to customers via NeoCloudz — fully managed."
    }
  ];

  return (
    <section className="bg-white pt-10 pb-0 relative border-t border-gray-50">
      <div className="max-w-[1400px] mx-auto relative z-10">

        {/* Header section */}
        <div className="flex flex-col items-center text-center px-6 mb-20">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-4 bg-[#e5e5e5] rounded-full px-5 py-1.5 shadow-sm border border-black/5 mb-10"
          >
            <span className="text-[9px] font-semibold tracking-widest text-black/60">05 /</span>
            <div className="h-[1px] w-12 bg-[#f5c518]" />
            <span className="text-[9px] font-semibold tracking-[0.2em] text-black/80 uppercase">HOW WE WORK</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-[clamp(2.5rem,6vw,5.5rem)] font-semibold leading-[0.9] tracking-tighter uppercase text-black mb-8"
          >
            FROM SITE TO <br />
            <span className="text-[#f5c518]">LIVE</span> INFRA.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-gray-500 text-[14px] md:text-[16px] max-w-3xl leading-relaxed font-medium"
          >
            DigiPowerX facilities are purpose-built for the density and reliability demands of AI infrastructure — not retrofitted from legacy enterprise data centers.
          </motion.p>
        </div>

        {/* Process Steps Row */}
        <div className="border-y border-gray-100 flex flex-wrap lg:flex-nowrap">
          {steps.map((step, index) => (
            <ProcessStep
              key={index}
              number={step.number}
              title={step.title}
              description={step.description}
              delay={index * 0.1}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default HowWeWork;
