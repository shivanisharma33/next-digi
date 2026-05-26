import React from 'react';
import { motion } from 'framer-motion';

const WhatWeDo = () => {
  return (
    <section className="bg-white pt-10 relative overflow-hidden flex flex-col items-center text-center font-sans min-h-fit">

      {/* Premium Background Effects */}
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#f5c518] rounded-full blur-[160px] opacity-[0.06] pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.08]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #000 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }}
      />

      {/* Top Label */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mb-10 relative z-10"
      >

        <div className="inline-flex items-center gap-3 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-gray-100 rounded-full px-6 py-2.5 hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] transition-shadow duration-500 cursor-default">
          <span className="text-[9px] font-semibold tracking-[0.2em] text-black">01 /</span>
          <div className="h-[2px] w-12 bg-[#f5c518] rounded-full" />
          <span className="text-[9px] font-semibold tracking-[0.2em] text-black uppercase">WHAT WE DO</span>
        </div>
      </motion.div>

      {/* Main Heading */}
      <motion.h2
        initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="text-[clamp(2.5rem,6vw,5.5rem)] font-semibold leading-[0.95] tracking-tighter uppercase mb-8 text-black relative z-10"
      >
        BUILT FROM <br />
        THE GROUND UP.<br />
        <span className="text-[#f5c518] relative inline-block">
          OWNED
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
            className="absolute -bottom-2 left-0 w-full h-[3px] bg-[#f5c518] origin-left opacity-60"
          />
        </span> AT EVERY LAYER.
      </motion.h2>

      {/* Subtext */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="text-gray-500 text-[13px] md:text-[15px] max-w-2xl leading-relaxed mx-auto mb-12 px-6 font-medium relative z-10"
      >
        From land and power to physical infrastructure and compute — DigiPowerX controls<br className="hidden md:block" />
        the entire chain, eliminating third-party dependencies and compressing time-to-compute.
      </motion.p>

      {/* Bottom Tabs / Grid */}
      <div className="w-full border-y border-gray-200 mt-auto bg-white/50 backdrop-blur-sm relative z-10">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-3">
          {[
            { num: '01', text: 'OWN THE ENERGY SOURCE' },
            { num: '02', text: 'BUILD THE DATA CENTERS' },
            { num: '03', text: 'OPERATE THE GPU CLUSTERS' },
          ].map((item, i) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + (i * 0.1), duration: 0.6 }}
              key={i}
              className={`group relative flex justify-center items-center py-8 px-4 border-b md:border-b-0 border-gray-200 cursor-pointer overflow-hidden transition-all duration-500 hover:bg-gradient-to-t hover:from-[#f5c518]/10 hover:to-transparent ${i !== 2 ? 'md:border-r' : ''
                } ${i === 0 ? 'md:border-l' : ''}`}
            >
              {/* Hover animated bottom border */}
              <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#f5c518] scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-out" />

              <div className="flex items-center gap-4 relative z-10">
                <span className="text-[10px] font-semibold text-[#f5c518] group-hover:scale-125 group-hover:-translate-y-1 transition-all duration-300">{item.num}</span>
                <span className="text-[10px] font-semibold text-black tracking-[0.2em] uppercase group-hover:text-gray-600 transition-colors duration-300">{item.text}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

    </section>
  );
};

export default WhatWeDo;
