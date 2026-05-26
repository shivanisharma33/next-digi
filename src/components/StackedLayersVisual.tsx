import React from 'react';

/**
 * StackedLayersVisual
 * Recreates the Lottie-style isometric stacked layers diagram with
 * RGB-split outlines, animated dashed connector lines and pulsing nodes.
 *
 * Usage:
 *   <StackedLayersVisual />
 *   <StackedLayersVisual className="w-[600px]" />
 */
interface StackedLayersVisualProps {
  className?: string;
  width?: number | string;
  height?: number | string;
}

/**
 * Renders a continuous stream of cubes traveling along a single path.
 * Each cube starts WHITE, then instantly snaps to YELLOW once it crosses the
 * `colorSwitchAt` fraction of the path (used to mark "passed the last slide").
 */
const CubeStream: React.FC<{
  pathId: string;
  count: number;
  dur: number; // seconds
  startColor?: string;
  endColor?: string;
  colorSwitchAt?: number; // 0..1 fraction along the path
}> = ({
  pathId,
  count,
  dur,
  startColor = '#ffffff',
  endColor = '#f5c518',
  colorSwitchAt = 0.85,
}) => {
  const t = Math.min(0.999, Math.max(0.001, colorSwitchAt));
  const colorValues = `${startColor};${startColor};${endColor};${endColor}`;
  const keyTimes = `0;${t.toFixed(3)};${t.toFixed(3)};1`;

  return (
    <g>
      {Array.from({ length: count }).map((_, i) => {
        const begin = `${-((i * dur) / count).toFixed(3)}s`;
        return (
          <use key={i} href="#sl-cube" color={startColor}>
            <animateMotion
              dur={`${dur}s`}
              begin={begin}
              repeatCount="indefinite"
              rotate="0"
            >
              <mpath href={pathId} />
            </animateMotion>
            <animate
              attributeName="color"
              dur={`${dur}s`}
              begin={begin}
              repeatCount="indefinite"
              values={colorValues}
              keyTimes={keyTimes}
              calcMode="discrete"
            />
          </use>
        );
      })}
    </g>
  );
};

const StackedLayersVisual: React.FC<StackedLayersVisualProps> = ({
  className,
  width = '100%',
  height = '100%',
}) => {
  return (
    <div className={className} style={{ width, height, background: '#0b0b0b' }}>
      <style>{`
        @keyframes sl-dash-flow {
          to { stroke-dashoffset: -60; }
        }
        @keyframes sl-rgb-jitter-r {
          0%, 100% { transform: translate(-2.07px, 0); }
          50%      { transform: translate(-1px, 0.5px); }
        }
        @keyframes sl-rgb-jitter-b {
          0%, 100% { transform: translate(2.07px, 0); }
          50%      { transform: translate(1px, -0.5px); }
        }
        @keyframes sl-rgb-jitter-g {
          0%, 100% { transform: translate(0, 0); }
          50%      { transform: translate(0.3px, 0.3px); }
        }
        @keyframes sl-node-pulse {
          0%, 100% { opacity: 1; r: 2.14; }
          50%      { opacity: 0.45; r: 3.2; }
        }
        @keyframes sl-tick-blink {
          0%, 70%, 100% { opacity: 1; }
          80%           { opacity: 0.15; }
        }
        /* per-card vertical scan-line sweeps (top -> bottom -> top) */
        @keyframes sl-scan-back  { 0%,100% { transform: translateY(-149px); } 50% { transform: translateY( 149px); } }
        @keyframes sl-scan-mid   { 0%,100% { transform: translateY(-121px); } 50% { transform: translateY( 121px); } }
        @keyframes sl-scan-front { 0%,100% { transform: translateY( -99px); } 50% { transform: translateY(  99px); } }
        .sl-scan-back  { animation: sl-scan-back  4.5s ease-in-out infinite; }
        .sl-scan-mid   { animation: sl-scan-mid   3.8s ease-in-out infinite; animation-delay: -1.2s; }
        .sl-scan-front { animation: sl-scan-front 3.2s ease-in-out infinite; animation-delay: -0.6s; }

        .sl-dash {
          stroke-dasharray: 1 6;
          animation: sl-dash-flow 4s linear infinite;
        }
        .sl-dash.slow  { animation-duration: 6s; }
        .sl-dash.fast  { animation-duration: 2.5s; }

        .sl-split-r { animation: sl-rgb-jitter-r 3.2s ease-in-out infinite; transform-origin: center; transform-box: fill-box; }
        .sl-split-g { animation: sl-rgb-jitter-g 3.2s ease-in-out infinite; transform-origin: center; transform-box: fill-box; }
        .sl-split-b { animation: sl-rgb-jitter-b 3.2s ease-in-out infinite; transform-origin: center; transform-box: fill-box; }

        .sl-node { animation: sl-node-pulse 2.4s ease-in-out infinite; transform-origin: center; transform-box: fill-box; }
        .sl-node.d1 { animation-delay: 0s; }
        .sl-node.d2 { animation-delay: 0.4s; }
        .sl-node.d3 { animation-delay: 0.8s; }
        .sl-node.d4 { animation-delay: 1.2s; }

        .sl-tick { animation: sl-tick-blink 3s ease-in-out infinite; }
        .sl-tick.d1 { animation-delay: 0.2s; }
        .sl-tick.d2 { animation-delay: 0.6s; }
        .sl-tick.d3 { animation-delay: 1.0s; }
        .sl-tick.d4 { animation-delay: 1.4s; }
      `}</style>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 545 450"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
        style={{ display: 'block' }}
      >
        <defs>
          <clipPath id="sl-clip">
            <rect width="545" height="450" x="0" y="0" />
          </clipPath>

          {/* Small hollow (wireframe) isometric cube used as traveler */}
          <symbol id="sl-cube" overflow="visible">
            <path
              d="M0,-4 L3.5,-2 L3.5,2 L0,4 L-3.5,2 L-3.5,-2 Z M0,-4 L0,0 L0,4 M-3.5,-2 L0,0 L3.5,-2"
              fill="none"
              stroke="currentColor"
              strokeOpacity="1"
              strokeWidth="0.8"
              strokeLinejoin="round"
            />
          </symbol>

          {/* Through-paths: long diagonals starting far down-left outside the
              front card and ending far up-right outside the back card — so cubes
              cover a wide span of the canvas while still piercing all 3 slides. */}
          <path id="sl-p-t1" d="M60,240 L475,90" />
          <path id="sl-p-t2" d="M70,300 L485,155" />
          <path id="sl-p-t3" d="M80,365 L490,220" />
          <path id="sl-p-t4" d="M90,420 L495,285" />

          {/* Per-card parallelogram clip-paths so scan lines stay inside */}
          <clipPath id="sl-clip-back">
            <path d="M-63.85,-176.6 L63.85,-121.9 L63.85,176.6 L-63.85,121.9 Z" />
          </clipPath>
          <clipPath id="sl-clip-mid">
            <path d="M-64.31,-148.94 L64.31,-93.85 L64.31,148.94 L-64.31,93.85 Z" />
          </clipPath>
          <clipPath id="sl-clip-front">
            <path d="M-63.85,-126.35 L63.85,-71.65 L63.85,126.35 L-63.85,71.65 Z" />
          </clipPath>

          {/* Arrow / chevron pointing along +X (rotated per-instance) */}
          <symbol id="sl-arrow" overflow="visible">
            <path
              d="M-6,-5 L4,0 L-6,5 L-2.5,0 Z"
              fill="#f5c518"
              stroke="#f5c518"
              strokeLinejoin="round"
              strokeWidth="0.5"
            />
          </symbol>
        </defs>

        <g clipPath="url(#sl-clip)">
          {/* background */}
          <rect width="545" height="450" fill="#0b0b0b" />

          {/* === Three stacked isometric cards === */}
          <g transform="translate(63.5,36)">
            {/* Back card */}
            <g transform="translate(269.24,200.43)">
              <path
                fill="#0b0b0b"
                d="M-63.85,121.9 L63.85,176.6 L63.85,-121.9 L-63.85,-176.6 Z"
              />
              <path
                fill="none"
                stroke="#a07c10"
                strokeOpacity="0.7"
                strokeWidth="1"
                d="M63.85,-121.9 L-63.85,-176.6 L-63.85,121.9 L63.85,176.6 Z"
              />
              {/* vertical scan line (parallel to top edge), sweeping up & down */}
              <g clipPath="url(#sl-clip-back)">
                <g className="sl-scan-back">
                  <line
                    x1="-63.85" y1="-27.35" x2="63.85" y2="27.35"
                    stroke="#fff2a8" strokeOpacity="0.9" strokeWidth="1.2"
                  />
                </g>
              </g>
            </g>

            {/* Middle card with RGB-split outlines */}
            <g transform="translate(204.43,215.77)">
              {/* vertical scan line */}
              <g clipPath="url(#sl-clip-mid)">
                <g className="sl-scan-mid">
                  <line
                    x1="-64.31" y1="-27.55" x2="64.31" y2="27.55"
                    stroke="#ffd84a" strokeOpacity="0.95" strokeWidth="1.2"
                  />
                </g>
              </g>
              <path
                fill="#0b0b0b"
                d="M64.31,-93.85 L-64.31,-148.94 L-64.31,93.85 L64.31,148.94 Z"
              />
              {/* yellow split outline 1 */}
              <g className="sl-split-g" style={{ mixBlendMode: 'lighten' }}>
                <path
                  fill="none"
                  stroke="#ffd84a"
                  strokeOpacity="0.85"
                  strokeWidth="1"
                  d="M63.85,-93.55 L-63.85,-148.24 L-63.85,93.54 L63.85,148.24 Z"
                />
              </g>
              {/* yellow split outline 2 (warmer) */}
              <g className="sl-split-b" style={{ mixBlendMode: 'lighten' }}>
                <path
                  fill="none"
                  stroke="#f5c518"
                  strokeOpacity="0.8"
                  strokeWidth="1"
                  d="M63.85,-93.55 L-63.85,-148.24 L-63.85,93.54 L63.85,148.24 Z"
                />
              </g>
              {/* yellow split outline 3 (lighter cream) */}
              <g className="sl-split-r" style={{ mixBlendMode: 'lighten' }}>
                <path
                  fill="none"
                  stroke="#fff2a8"
                  strokeOpacity="0.75"
                  strokeWidth="1"
                  d="M63.85,-93.55 L-63.85,-148.24 L-63.85,93.54 L63.85,148.24 Z"
                />
              </g>
            </g>

            {/* Front card */}
            <g transform="translate(133.33,237.98)">
              <path
                fill="#0b0b0b"
                stroke="#f5c518"
                strokeOpacity="0.9"
                strokeWidth="1"
                d="M63.85,-71.65 L-63.85,-126.35 L-63.85,71.65 L63.85,126.35 Z"
              />
              {/* vertical scan line */}
              <g clipPath="url(#sl-clip-front)">
                <g className="sl-scan-front">
                  <line
                    x1="-63.85" y1="-27.35" x2="63.85" y2="27.35"
                    stroke="#ffffff" strokeOpacity="0.9" strokeWidth="1.2"
                  />
                </g>
              </g>
            </g>
          </g>

          {/* === Through connectors: faint guide rails (drawn UNDER cards is fine –
               cards are opaque so guide will appear behind them; cubes are drawn
               AFTER the cards so they overlay and visually pierce the slides). === */}
          <g stroke="#ffffff" strokeOpacity="0.12" strokeWidth="0.5" fill="none">
            <use href="#sl-p-t1" />
            <use href="#sl-p-t2" />
            <use href="#sl-p-t3" />
            <use href="#sl-p-t4" />
          </g>

          {/* === Traveling hollow cubes (white → yellow after the last slide) === */}
          {/* Paths reversed: cubes now travel lower-left → upper-right.
              The "last slide" they pass through is the back (right-most) card,
              so the color switch happens near its right-edge exit. */}
          {/* Cubes travel lower-left → upper-right; switch white → yellow right
              after exiting the back (last) slide's right edge. */}
          {[
            { id: '#sl-p-t1', switchAt: 0.812 },
            { id: '#sl-p-t2', switchAt: 0.788 },
            { id: '#sl-p-t3', switchAt: 0.773 },
            { id: '#sl-p-t4', switchAt: 0.758 },
          ].map(({ id, switchAt }) => (
            <CubeStream
              key={id}
              pathId={id}
              count={10}
              dur={6}
              startColor="#ffffff"
              endColor="#f5c518"
              colorSwitchAt={switchAt}
            />
          ))}

          {/* === Entry / exit terminal nodes (long-span) === */}
          <g>
            {/* lower-left entry dots (white) */}
            <circle className="sl-node d1" cx="60" cy="240" r="2.6" fill="#ffffff" stroke="#ffffff" />
            <circle className="sl-node d2" cx="70" cy="300" r="2.6" fill="#ffffff" stroke="#ffffff" />
            <circle className="sl-node d3" cx="80" cy="365" r="2.6" fill="#ffffff" stroke="#ffffff" />
            <circle className="sl-node d4" cx="90" cy="420" r="2.6" fill="#ffffff" stroke="#ffffff" />
            {/* upper-right exit arrows (yellow), each rotated to match its path */}
            <use href="#sl-arrow" transform="translate(475 90) rotate(-19.86)" />
            <use href="#sl-arrow" transform="translate(485 155) rotate(-19.27)" />
            <use href="#sl-arrow" transform="translate(490 220) rotate(-19.48)" />
            <use href="#sl-arrow" transform="translate(495 285) rotate(-18.43)" />
          </g>
        </g>
      </svg>
    </div>
  );
};

export default StackedLayersVisual;
