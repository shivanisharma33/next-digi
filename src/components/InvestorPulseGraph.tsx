import React from 'react';
import { motion } from 'framer-motion';

const YELLOW = '#ffc629';
const YELLOW_SOFT = '#ffdb6e';
const OFFWHITE = '#e7e6d9';

// 10-point stock-chart polyline (lower-left → upper-right) in 545×545 viewBox
const GRAPH_POINTS: [number, number][] = [
  [14.65, 358.88],
  [58.59, 308.22],
  [98.88, 321.04],
  [145.26, 244.75],
  [177.61, 302.73],
  [203.86, 250.85],
  [243.53, 249.63],
  [272.83, 217.89],
  [314.94, 261.84],
  [358.88, 186.77],
];

const GRAPH_PATH = GRAPH_POINTS
  .map(([x, y], i) => (i === 0 ? `M${x},${y}` : `L${x},${y}`))
  .join(' ');

// Dotted "next reading" trail extending past the endpoint to upper-right corner
const TRAIL_POINTS: [number, number][] = [
  [359.74, 186.56],
  [395.29, 167.96],
  [410.29, 140.57],
  [436.38, 122.96],
  [474.54, 136.65],
  [498.68, 101.43],
  [521.18, 82.51],
  [531.95, 76.97],
];
const TRAIL_PATH = TRAIL_POINTS
  .map(([x, y], i) => (i === 0 ? `M${x},${y}` : `L${x},${y}`))
  .join(' ');

const InvestorPulseGraph: React.FC = () => {
  return (
    <div className="relative w-full max-w-[545px] aspect-square mx-auto">
      <svg
        viewBox="0 0 545 545"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Background */}
        <rect width="545" height="545" fill="#0b0b0b" />

        {/* Upper-right frame */}
        <rect
          x="186.08"
          y="12.78"
          width="345.84"
          height="345.84"
          fill="#0b0b0b"
          stroke={OFFWHITE}
          strokeWidth="1"
          opacity="0.6"
        />

        {/* Lower-left frame */}
        <rect
          x="11.93"
          y="185.86"
          width="345.84"
          height="345.84"
          fill="#0b0b0b"
          stroke="#252525"
          strokeWidth="1"
        />

        {/* Dashed crosshair guides through lower-left frame center (184.83, 358.78) */}
        <line
          x1="184.83" y1="185.30" x2="184.83" y2="358.78"
          stroke={OFFWHITE} strokeWidth="1" strokeDasharray="1 6" opacity="0.5"
        />
        <line
          x1="184.83" y1="358.78" x2="184.83" y2="531.59"
          stroke={OFFWHITE} strokeWidth="1" strokeDasharray="1 6" opacity="0.5"
        />
        <line
          x1="11.42" y1="358.78" x2="184.83" y2="358.78"
          stroke={OFFWHITE} strokeWidth="1" strokeDasharray="1 6" opacity="0.5"
        />
        <line
          x1="184.83" y1="358.78" x2="357.56" y2="358.78"
          stroke={OFFWHITE} strokeWidth="1" strokeDasharray="1 6" opacity="0.5"
        />

        {/* Dashed crosshair guides through upper-right frame center (359, 186.78) */}
        <line
          x1="359" y1="13.30" x2="359" y2="186.78"
          stroke={OFFWHITE} strokeWidth="1" strokeDasharray="1 6" opacity="0.35"
        />
        <line
          x1="359" y1="186.78" x2="531.56" y2="186.78"
          stroke={OFFWHITE} strokeWidth="1" strokeDasharray="1 6" opacity="0.35"
        />

        {/* Ambient yellow glow behind chart */}
        <defs>
          <radialGradient id="pulseGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={YELLOW} stopOpacity="0.18" />
            <stop offset="60%" stopColor={YELLOW} stopOpacity="0.04" />
            <stop offset="100%" stopColor={YELLOW} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="lineGrad" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor={YELLOW} stopOpacity="0.4" />
            <stop offset="50%" stopColor={YELLOW} stopOpacity="1" />
            <stop offset="100%" stopColor={YELLOW_SOFT} stopOpacity="1" />
          </linearGradient>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={YELLOW} stopOpacity="0.25" />
            <stop offset="100%" stopColor={YELLOW} stopOpacity="0" />
          </linearGradient>
          <filter id="lineGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <circle cx="186.78" cy="358.78" r="170" fill="url(#pulseGlow)" />

        {/* Faint echo lines (originally R/G/B offset paths — re-themed as yellow echoes) */}
        <path
          d={GRAPH_PATH}
          stroke={YELLOW}
          strokeWidth="1.2"
          fill="none"
          opacity="0.18"
          transform="translate(2, 1)"
          style={{ mixBlendMode: 'screen' }}
        />
        <path
          d={GRAPH_PATH}
          stroke={YELLOW_SOFT}
          strokeWidth="1.2"
          fill="none"
          opacity="0.22"
          transform="translate(-1, -1)"
          style={{ mixBlendMode: 'screen' }}
        />

        {/* Area fill under chart */}
        <motion.path
          d={`${GRAPH_PATH} L358.88,358.78 L14.65,358.78 Z`}
          fill="url(#areaGrad)"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.9, 0.9, 0] }}
          transition={{
            duration: 5,
            times: [0, 0.35, 0.85, 1],
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Main graph line — animates draw + fade-out loop */}
        <motion.path
          d={GRAPH_PATH}
          stroke="url(#lineGrad)"
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
          fill="none"
          filter="url(#lineGlow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{
            pathLength: [0, 1, 1, 0],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 5,
            times: [0, 0.55, 0.85, 1],
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Dotted forecast trail beyond endpoint */}
        <motion.path
          d={TRAIL_PATH}
          stroke={YELLOW}
          strokeWidth="1.5"
          strokeDasharray="1 8"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{
            pathLength: [0, 0, 1, 1, 0],
            opacity: [0, 0, 0.9, 0.9, 0],
          }}
          transition={{
            duration: 5,
            times: [0, 0.55, 0.78, 0.85, 1],
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Small tracking dot at curve inflection (~point index 4: 177.61, 302.73 vicinity) */}
        <motion.circle
          cx="186.51"
          cy="360.03"
          r="5"
          fill={OFFWHITE}
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: [0, 1, 1, 0],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 5,
            times: [0, 0.18, 0.85, 1],
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{ transformOrigin: '186.51px 360.03px' }}
        />

        {/* Big endpoint dot with concentric pulse halo */}
        <motion.circle
          cx="359.18"
          cy="187.38"
          r="22"
          fill={YELLOW}
          opacity="0"
          animate={{
            scale: [0.6, 1.6, 0.6],
            opacity: [0, 0.35, 0],
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: 'easeOut',
            delay: 0.5,
          }}
          style={{ transformOrigin: '359.18px 187.38px' }}
        />
        <motion.circle
          cx="359.18"
          cy="187.38"
          r="10"
          fill={YELLOW}
          stroke="#0b0b0b"
          strokeWidth="2"
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: [0, 0, 1, 1, 0],
            opacity: [0, 0, 1, 1, 0],
          }}
          transition={{
            duration: 5,
            times: [0, 0.5, 0.58, 0.85, 1],
            repeat: Infinity,
            ease: 'easeOut',
          }}
          style={{ transformOrigin: '359.18px 187.38px' }}
        />
      </svg>
    </div>
  );
};

export default InvestorPulseGraph;
