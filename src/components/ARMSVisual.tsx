import React from 'react';
import { motion } from 'framer-motion';

export default function ARMSVisual() {
  return (
    <div className="relative w-full h-full bg-[#0a0a0a] p-8 font-mono overflow-hidden flex flex-col">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      
      {/* HUD Frame */}
      <div className="absolute inset-4 border border-white/10" />
      <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-[#f5c518]" />
      <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-[#f5c518]" />

      <div className="relative z-10 flex-1 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h4 className="text-[10px] font-black text-white tracking-[0.3em] uppercase">Deployment_Matrix</h4>
            <p className="text-[8px] text-white/40 uppercase">Module_v4_Factory_Standard</p>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold text-[#f5c518]">BLOCK_SYNC: 100%</span>
          </div>
        </div>

        {/* Blueprint Visual */}
        <div className="flex-1 relative flex items-center justify-center">
          <div className="relative w-full max-w-[300px] aspect-square border border-white/5 bg-white/[0.02]">
            {/* Center Module */}
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute inset-8 border-2 border-[#f5c518]/50 flex items-center justify-center bg-[#f5c518]/5"
            >
              <div className="text-center">
                <p className="text-[10px] font-bold text-white">CORE_UNIT</p>
                <p className="text-[7px] text-[#f5c518]">600KW</p>
              </div>
            </motion.div>

            {/* Expansion Modules */}
            {[0, 90, 180, 270].map((rot, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: 0, y: 0 }}
                animate={{ 
                  opacity: 1,
                  x: rot === 90 ? 40 : rot === 270 ? -40 : 0,
                  y: rot === 0 ? -40 : rot === 180 ? 40 : 0
                }}
                transition={{ delay: 0.5 + i * 0.2, duration: 1 }}
                className="absolute w-12 h-12 border border-white/20 bg-white/5 flex items-center justify-center left-1/2 top-1/2 -ml-6 -mt-6"
                style={{ transform: `rotate(${rot}deg)` }}
              >
                <span className="text-[6px] text-white/40">EXP_0{i+1}</span>
              </motion.div>
            ))}

            {/* Connecting Lines */}
            <div className="absolute inset-0 border-[0.5px] border-white/10 rotate-45" />
            <div className="absolute inset-0 border-[0.5px] border-white/10 -rotate-45" />
          </div>

          {/* Coordinate Marks */}
          <div className="absolute top-0 left-0 text-[6px] text-white/20 uppercase">Lat: 34.012N</div>
          <div className="absolute bottom-0 right-0 text-[6px] text-white/20 uppercase">Lng: 86.202W</div>
        </div>

        {/* Specs Box */}
        <div className="mt-12 grid grid-cols-3 gap-4 border-t border-white/5 pt-8">
          <div>
            <p className="text-[8px] text-white/30 uppercase mb-1">Time_To_Live</p>
            <p className="text-[12px] font-bold text-white">12 DAYS</p>
          </div>
          <div>
            <p className="text-[8px] text-white/30 uppercase mb-1">Total_Capacity</p>
            <p className="text-[12px] font-bold text-white">1.8 MW</p>
          </div>
          <div>
            <p className="text-[8px] text-white/30 uppercase mb-1">PUE_Target</p>
            <p className="text-[12px] font-bold text-[#f5c518]">1.05</p>
          </div>
        </div>

        {/* Scanline Effect */}
        <motion.div 
          animate={{ translateY: ['0%', '100%'] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute left-0 right-0 h-10 bg-gradient-to-b from-transparent via-[#f5c518]/5 to-transparent pointer-events-none"
        />
      </div>
    </div>
  );
}
