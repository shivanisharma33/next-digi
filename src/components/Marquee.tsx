import React from 'react';

const Marquee = () => {
  const items = [
    "450MW POWER CAPACITY",
    "NVIDIA BLACKWELL B200",
    "<1.3 PUE EFFICIENCY",
    "100% U.S. OWNED & OPERATED",
    "6 DATA CENTER CAMPUSES",
    "2N POWER REDUNDANCY",
    "LIQUID COOLING READY"
  ];

  return (
    <div className="relative bg-brand-dark py-5 overflow-hidden border-y border-white/10">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-brand-dark to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-brand-dark to-transparent z-10 pointer-events-none" />
      
      <div className="flex animate-marquee whitespace-nowrap">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex gap-16 items-center px-8">
            {items.map((item, index) => (
              <div key={index} className="flex items-center gap-16">
                <span className={`text-[10px] font-black tracking-[0.3em] uppercase ${index % 2 === 1 ? 'text-brand-yellow' : 'text-gray-500'}`}>
                  {item}
                </span>
                <div className="w-1.5 h-1.5 bg-brand-yellow/30 rounded-full" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marquee;
