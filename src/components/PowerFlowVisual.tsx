import React from 'react';
import { motion } from 'framer-motion';

const PowerFlowVisual = () => {
  const nodes = [
    { label: 'GENERATION', dotColor: '#f5c518', position: 'low' },
    { label: 'SWITCHYARD', dotColor: '#f5c518', position: 'high' },
    { label: 'SUBSTATION', dotColor: '#00d1ff', position: 'low' },
    { label: 'DATA CENTER', dotColor: '#00d1ff', position: 'high' },
    { label: 'GPU LOAD', dotColor: '#00ff9d', position: 'low', isGreen: true },
  ];

  // Coordinates for SVG lines (relative to grid cells)
  // Each cell is 20% width. Center is at 10, 30, 50, 70, 90.
  const pathD = "M 10 70 L 30 30 L 50 70 L 70 30 L 90 70";

  return (
    <div className="relative w-full h-full min-h-[300px] md:min-h-[400px] lg:min-h-[450px] bg-[#06070a] rounded-[24px] overflow-hidden border border-white/5 shadow-2xl flex flex-col items-center justify-center font-serif">
      {/* 1. Precise Grid Background */}
      <div 
        className="absolute inset-0 pointer-events-none" 
        style={{ 
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '25px 25px',
        }}
      />

      <div className="relative w-full h-full p-4 md:p-8 lg:p-12 flex flex-col justify-center">
        
        {/* SVG for connecting lines - Uses viewBox for perfect responsiveness */}
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none z-10" 
          viewBox="0 0 100 100" 
          preserveAspectRatio="none"
        >
          <motion.path
            d={pathD}
            fill="none"
            stroke="#3d3419" 
            strokeWidth="0.5"
            strokeDasharray="2 2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
          
          {/* Animated Flow Packet */}
          <motion.path
            d={pathD}
            fill="none"
            stroke="#f5c518"
            strokeWidth="0.6"
            strokeDasharray="0.5 10" 
            strokeLinecap="round"
            initial={{ strokeDashoffset: 0 }}
            animate={{ strokeDashoffset: -20 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />
        </svg>

        {/* Nodes and Boxes - Using Flexbox Grid for perfect alignment */}
        <div className="relative w-full h-full z-20 flex justify-between items-center">
          {nodes.map((node, i) => (
            <div 
              key={i} 
              className="flex-1 flex flex-col items-center px-1"
              style={{ 
                transform: `translateY(${node.position === 'high' ? '-20%' : '20%'})` 
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className={`
                  w-full max-w-[160px] aspect-[1.8/1] rounded-lg border-[1px] md:border-[1.5px]
                  flex flex-col items-center justify-center backdrop-blur-md
                  ${node.isGreen 
                    ? 'border-[#00ff9d]/40 bg-[#00ff9d]/[0.02]' 
                    : 'border-[#f5c518]/30 bg-[#f5c518]/[0.02]'}
                `}
              >
                {/* Central Glowing Dot */}
                <div className="relative mb-1 md:mb-4">
                  <motion.div
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-1.5 md:w-3 h-1.5 md:h-3 rounded-full relative z-20 shadow-[0_0_10px_rgba(0,0,0,0.5)]"
                    style={{ backgroundColor: node.dotColor }}
                  />
                  <div 
                    className="absolute inset-0 rounded-full blur-[8px] md:blur-[15px] opacity-30 scale-[4] z-10"
                    style={{ backgroundColor: node.dotColor }}
                  />
                </div>

                {/* Label */}
                <span 
                  className={`
                    text-[6px] xs:text-[8px] md:text-[10px] lg:text-[11px] font-bold tracking-tight uppercase text-center leading-none px-1
                    ${node.isGreen ? 'text-[#00ff9d]' : 'text-white/90'}
                  `}
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  {node.label}
                </span>
              </motion.div>
            </div>
          ))}
        </div>
      </div>

      {/* Grid: Active Label */}
      <div className="absolute top-4 left-6 hidden sm:flex items-center gap-2 opacity-20">
        <div className="w-1 h-1 rounded-full bg-[#f5c518] animate-pulse" />
        <span className="text-[7px] font-mono tracking-[0.2em] text-white uppercase">Grid Status: Nominal</span>
      </div>
    </div>
  );
};

export default PowerFlowVisual;
