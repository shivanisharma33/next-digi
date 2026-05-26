import React from 'react';
import { motion } from 'framer-motion';

export default function NeoCloudVisual() {
  return (
    <div className="relative w-full h-full bg-[#0a0a0a] p-8 font-mono overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)', backgroundSize: '24px 24px' }} />
      
      {/* HUD Frame */}
      <div className="absolute inset-4 border border-white/10" />
      <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-[#f5c518]" />
      <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-[#f5c518]" />

      <div className="relative z-10 h-full flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#f5c518] animate-pulse" />
            <span className="text-[10px] font-bold text-white tracking-widest uppercase">CLUSTER_ALPHA_B200</span>
          </div>
          <span className="text-[10px] text-white/30 uppercase">Uptime: 242d 14h 02m</span>
        </div>

        {/* GPU Grid */}
        <div className="grid grid-cols-4 gap-3 mb-8">
          {[...Array(16)].map((_, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              className="h-12 bg-white/5 border border-white/10 relative overflow-hidden group"
            >
              <motion.div 
                animate={{ height: ['20%', '80%', '40%', '90%', '60%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: i * 0.1 }}
                className="absolute bottom-0 left-0 right-0 bg-[#f5c518]/20"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[8px] text-white/20">GPU_{i}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Telemetry Charts */}
        <div className="flex-1 grid grid-cols-2 gap-6">
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-[8px] text-white/40 mb-2 uppercase tracking-widest">
                <span>VRAM_Utilization</span>
                <span className="text-[#f5c518]">141.2 GB / 192 GB</span>
              </div>
              <div className="h-1 w-full bg-white/5 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '74%' }}
                  transition={{ duration: 2 }}
                  className="h-full bg-[#f5c518]" 
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[8px] text-white/40 mb-2 uppercase tracking-widest">
                <span>Thermal_Load</span>
                <span className="text-white">62.4°C</span>
              </div>
              <div className="h-1 w-full bg-white/5 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '58%' }}
                  transition={{ duration: 2, delay: 0.2 }}
                  className="h-full bg-white/40" 
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[8px] text-white/40 mb-2 uppercase tracking-widest">
                <span>InfiniBand_NDR</span>
                <span className="text-white">384.2 Gbps</span>
              </div>
              <div className="h-1 w-full bg-white/5 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '92%' }}
                  transition={{ duration: 2, delay: 0.4 }}
                  className="h-full bg-white/20" 
                />
              </div>
            </div>
          </div>

          {/* Scrolling Logs */}
          <div className="bg-black/50 border border-white/5 p-4 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/80 pointer-events-none" />
            <div className="text-[7px] text-green-500/60 space-y-1">
              {[...Array(20)].map((_, i) => (
                <p key={i} className="truncate">
                  {`[${new Date().toISOString()}] NODE_${Math.floor(Math.random()*100)} : GPU_CHECK_PASS : OFFSET_0x${Math.random().toString(16).slice(2, 6).toUpperCase()}`}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Stats */}
        <div className="mt-8 pt-4 border-t border-white/5 flex gap-8 items-center">
          <div>
            <p className="text-[14px] font-bold text-white">1.8 PFLOPS</p>
            <p className="text-[7px] text-white/30 uppercase">Compute_Performance</p>
          </div>
          <div>
            <p className="text-[14px] font-bold text-white">99.98%</p>
            <p className="text-[7px] text-white/30 uppercase">SLA_Guarantee</p>
          </div>
        </div>
      </div>
    </div>
  );
}
