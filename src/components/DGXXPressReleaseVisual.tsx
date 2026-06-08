"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { GLASS_LAYERS } from './dgxxGlassLayers';

/**
 * DGXXPressReleaseVisual
 * The "DGXX · Glass Stack" press-release animation: four overlapping brand
 * layers (embedded as base64 PNGs) drift together in a slow 7s float loop on a
 * transparent background, so it sits directly over the page. Self-contained,
 * fills its parent, no external assets. The leftmost layer sits on top
 * ("logo on front").
 */

const DGXXPressReleaseVisual: React.FC = () => {
  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Floating group — the whole stack drifts as one unit (transparent bg) */}
      <motion.div
        className="absolute inset-0"
        style={{ willChange: 'transform' }}
        animate={{
          y: ['0%', '-3.2%', '-1.2%', '-3.8%', '0%'],
          x: ['0%', '0.8%', '0%', '-0.8%', '0%'],
        }}
        transition={{
          duration: 7,
          ease: 'easeInOut',
          repeat: Infinity,
          times: [0, 0.25, 0.5, 0.75, 1],
        }}
      >
        {GLASS_LAYERS.map((layer, i) => (
          <img
            key={i}
            src={layer.src}
            alt=""
            className="absolute top-0 h-full"
            style={{
              left: `${layer.left}%`,
              width: `${layer.width}%`,
              zIndex: layer.z,
              objectFit: 'fill',
            }}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default DGXXPressReleaseVisual;
