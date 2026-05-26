import React from 'react';

/**
 * DocumentsVisual3D — Flowing Diagonal Data Streaks
 * Thin amber light beams sweeping diagonally across the hero,
 * like data passing through a secure vault aperture.
 * Pure CSS — zero JS.
 */

const STREAKS = [
  { left: '5%',   delay: '0s',   dur: '6s',  width: 1,   opacity: 0.55 },
  { left: '14%',  delay: '1.2s', dur: '8s',  width: 0.5, opacity: 0.30 },
  { left: '25%',  delay: '2.8s', dur: '5.5s',width: 1.5, opacity: 0.45 },
  { left: '38%',  delay: '0.5s', dur: '7s',  width: 1,   opacity: 0.50 },
  { left: '49%',  delay: '3.5s', dur: '6.5s',width: 0.5, opacity: 0.25 },
  { left: '58%',  delay: '1.8s', dur: '9s',  width: 1,   opacity: 0.40 },
  { left: '67%',  delay: '4s',   dur: '5s',  width: 1.5, opacity: 0.55 },
  { left: '76%',  delay: '0.8s', dur: '7.5s',width: 0.5, opacity: 0.30 },
  { left: '85%',  delay: '2.2s', dur: '6s',  width: 1,   opacity: 0.45 },
  { left: '93%',  delay: '5s',   dur: '8s',  width: 0.5, opacity: 0.20 },
];

const DocumentsVisual3D: React.FC = () => {
  return (
    <>
      <style>{`
        @keyframes streak-sweep {
          0%   { transform: skewX(-20deg) translateY(110%); opacity: 0;   }
          8%   { opacity: 1; }
          88%  { opacity: 1; }
          100% { transform: skewX(-20deg) translateY(-110%); opacity: 0; }
        }
        @keyframes glow-pulse {
          0%,100% { opacity: 0.45; }
          50%     { opacity: 0.80; }
        }
        @keyframes grid-fade {
          0%,100% { opacity: 0.06; }
          50%     { opacity: 0.14; }
        }
        @keyframes side-glow-l {
          0%,100% { opacity: 0.35; transform: scaleX(1); }
          50%     { opacity: 0.65; transform: scaleX(1.08); }
        }
        @keyframes side-glow-r {
          0%,100% { opacity: 0.25; transform: scaleX(1); }
          50%     { opacity: 0.55; transform: scaleX(1.08); }
        }
      `}</style>

      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>

        {/* ── Background grid ───────────────────────────────── */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: [
            'linear-gradient(rgba(245,197,24,0.08) 1px, transparent 1px)',
            'linear-gradient(90deg, rgba(245,197,24,0.08) 1px, transparent 1px)',
          ].join(','),
          backgroundSize: '50px 50px',
          animation: 'grid-fade 5s ease-in-out infinite',
        }} />

        {/* ── Diagonal light streaks ────────────────────────── */}
        {STREAKS.map((s, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: 0,
              left: s.left,
              width: s.width,
              height: '100%',
              background: `linear-gradient(
                to top,
                transparent 0%,
                rgba(245,197,24,${s.opacity}) 30%,
                rgba(255,220,80,${s.opacity * 1.3}) 50%,
                rgba(245,197,24,${s.opacity}) 70%,
                transparent 100%
              )`,
              animation: `streak-sweep ${s.dur} ${s.delay} ease-in-out infinite`,
              filter: 'blur(0.5px)',
            }}
          />
        ))}

        {/* ── Left edge amber glow ─────────────────────────── */}
        <div style={{
          position: 'absolute',
          left: 0, top: 0, bottom: 0,
          width: '35%',
          background: 'linear-gradient(to right, rgba(245,197,24,0.08) 0%, transparent 100%)',
          animation: 'side-glow-l 7s ease-in-out infinite',
          transformOrigin: 'left center',
        }} />

        {/* ── Right edge blue-white glow ───────────────────── */}
        <div style={{
          position: 'absolute',
          right: 0, top: 0, bottom: 0,
          width: '30%',
          background: 'linear-gradient(to left, rgba(100,180,255,0.07) 0%, transparent 100%)',
          animation: 'side-glow-r 9s ease-in-out infinite',
          transformOrigin: 'right center',
        }} />

        {/* ── Center radial anchor glow ─────────────────────── */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 60% 45% at 50% 50%, rgba(245,197,24,0.08) 0%, transparent 65%)',
          animation: 'glow-pulse 6s ease-in-out infinite',
        }} />
      </div>
    </>
  );
};

export default DocumentsVisual3D;
