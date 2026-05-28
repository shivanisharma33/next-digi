import React from 'react';

const ColocationDiagram = () => {
  return (
    <div className="w-full h-full relative overflow-hidden flex items-center justify-center select-none bg-transparent">
      {/* Dynamic CSS animations for the 6 colocation features */}
      <style>{`
        @keyframes spin-rotor {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulse-cooling {
          0%, 100% { stroke: #0284c7; filter: drop-shadow(0 0 2px #38bdf8); }
          50% { stroke: #0ea5e9; filter: none; }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.9; filter: drop-shadow(0 0 6px #f5c518); }
        }
        @keyframes pulse-laser {
          0%, 100% { stroke-opacity: 0.4; }
          50% { stroke-opacity: 0.9; filter: drop-shadow(0 0 4px #dc2626); }
        }
        @keyframes pulse-hologram {
          0%, 100% { opacity: 0.7; filter: drop-shadow(0 0 3px #0891b2); }
          50% { opacity: 0.95; filter: drop-shadow(0 0 8px #0891b2); }
        }
        @keyframes flow-energy {
          to {
            stroke-dashoffset: -30;
          }
        }
        @keyframes blink-led-green {
          0%, 100% { fill: #16a34a; filter: drop-shadow(0 0 2px #22c55e); }
          50% { fill: #166534; filter: none; }
        }
        @keyframes blink-led-yellow {
          0%, 100% { fill: #d97706; filter: drop-shadow(0 0 2px #f5c518); }
          40% { fill: #78350f; filter: none; }
        }
        @keyframes blink-led-blue {
          0%, 100% { fill: #2563eb; filter: drop-shadow(0 0 2px #3b82f6); }
          60% { fill: #1e3a8a; filter: none; }
        }
        @keyframes grid-scroll {
          0% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -30; }
        }
        @keyframes text-glow {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }

        .rotor {
          animation: spin-rotor 5s linear infinite;
          transform-origin: 210px 40px;
        }
        .liquid-tube {
          animation: pulse-cooling 2s ease-in-out infinite;
        }
        .energy-conduit {
          stroke-dasharray: 5, 5;
          animation: flow-energy 1.2s linear infinite;
        }
        .fiber-signal {
          stroke-dasharray: 4, 4;
          animation: flow-energy 0.8s linear infinite;
        }
        .laser-fence {
          animation: pulse-laser 2.5s ease-in-out infinite;
        }
        .hologram-panel {
          animation: pulse-hologram 4s ease-in-out infinite;
        }
        .led-green { animation: blink-led-green 1s infinite; }
        .led-yellow { animation: blink-led-yellow 1.4s infinite; }
        .led-blue { animation: blink-led-blue 1.2s infinite; }
        .hud-text { animation: text-glow 3s infinite; }

        .interactive-element {
          transition: all 0.3s ease;
        }
        .interactive-element:hover {
          filter: drop-shadow(0 0 8px rgba(245, 197, 24, 0.25));
          cursor: pointer;
        }
        
        .floor-grid {
          stroke-dasharray: 10, 15;
          animation: grid-scroll 20s linear infinite;
        }
      `}</style>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 800 500"
        className="w-full h-full block"
      >
        <defs>
          {/* Radial blur filter for glowing lights */}
          <filter id="glow-light" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Hologram Gradient (Light mode compatible) */}
          <linearGradient id="hologramGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0891b2" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#ecfeff" stopOpacity="0.9" />
          </linearGradient>

          {/* Servers Gradients */}
          <linearGradient id="gpuServerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f1f5f9" />
            <stop offset="100%" stopColor="#e2e8f0" />
          </linearGradient>

          <linearGradient id="substationGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#9ca3af" />
            <stop offset="100%" stopColor="#4b5563" />
          </linearGradient>

          {/* Liquid Cooling Pipes Gradient */}
          <linearGradient id="coolPipeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0ea5e9" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>

          {/* Substation Feed Conduit Gradient */}
          <linearGradient id="powerFeedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#ca8a04" />
          </linearGradient>
          
          <linearGradient id="solarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e3a8a" />
            <stop offset="100%" stopColor="#172554" />
          </linearGradient>
        </defs>

        {/* Ambient environment soft glows */}
        <circle cx="500" cy="220" r="160" fill="rgba(6, 182, 212, 0.04)" filter="url(#glow-light)" />
        <circle cx="200" cy="180" r="130" fill="rgba(245, 197, 24, 0.03)" filter="url(#glow-light)" />

        {/* ── BACKGROUND CYBER SYSTEM GRID (Subtle light grid) ── */}
        <g stroke="rgba(0, 0, 0, 0.03)" strokeWidth="1">
          {Array.from({ length: 22 }).map((_, i) => {
            const pos = i * 45;
            return (
              <React.Fragment key={i}>
                <line x1={pos} y1="0" x2={pos - 350} y2="500" className="floor-grid" />
                <line x1={pos} y1="0" x2={pos + 350} y2="500" className="floor-grid" />
              </React.Fragment>
            );
          })}
        </g>

        {/* ── ISOMETRIC GROUND PLATFORMS (Light, modern slate color) ── */}

        {/* 1. POWER & GENERATION YARD (Left Platform) */}
        <g className="interactive-element">
          {/* Top Face */}
          <polygon
            points="100 170, 310 70, 420 120, 210 220"
            fill="#f8fafc"
            stroke="rgba(245, 197, 24, 0.4)"
            strokeWidth="1.5"
          />
          {/* Side Left */}
          <polygon points="100 170, 100 180, 210 230, 210 220" fill="#e2e8f0" />
          {/* Side Right */}
          <polygon points="210 220, 210 230, 420 130, 420 120" fill="#cbd5e1" />
        </g>

        {/* 2. DEDICATED DATA CENTER FLOOR (Right Platform) */}
        <g className="interactive-element">
          {/* Top Face */}
          <polygon
            points="240 260, 540 120, 750 225, 450 365"
            fill="#f1f5f9"
            stroke="rgba(0, 0, 0, 0.1)"
            strokeWidth="1.8"
          />
          {/* Side Left */}
          <polygon points="240 260, 240 272, 450 377, 450 365" fill="#cbd5e1" stroke="rgba(0, 0, 0, 0.05)" strokeWidth="0.8" />
          {/* Side Right */}
          <polygon points="450 365, 450 377, 750 237, 750 225" fill="#94a3b8" stroke="rgba(0, 0, 0, 0.05)" strokeWidth="0.8" />
        </g>


        {/* ── POWER COMPONENT (WIND CO-GEN) ── */}
        <g className="interactive-element">
          {/* Base */}
          <ellipse cx="210" cy="120" rx="10" ry="5" fill="#e2e8f0" stroke="#94a3b8" />
          {/* Mast */}
          <polygon points="208 120, 212 120, 211 40, 209 40" fill="#64748b" />
          {/* Rotating Blades */}
          <g className="rotor">
            <line x1="210" y1="40" x2="210" y2="10" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
            <line x1="210" y1="40" x2="184" y2="55" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
            <line x1="210" y1="40" x2="236" y2="55" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
            <circle cx="210" cy="40" r="3.5" fill="#ffffff" stroke="#475569" strokeWidth="0.8" />
          </g>
        </g>


        {/* ── FEATURE 2: DIRECT SUBSTATION FEED ── */}
        <g className="interactive-element">
          {/* Dedicated Substation Yard on Left Platform */}
          <g transform="translate(260, 110)">
            {/* Substation Base Block */}
            <polygon points="20 10, 60 -10, 80 0, 40 20" fill="url(#substationGrad)" stroke="#6b7280" />
            <polygon points="20 10, 40 20, 40 35, 20 25" fill="#374151" />
            <polygon points="40 20, 80 0, 80 15, 40 25" fill="#4b5563" />

            {/* Insulators */}
            <line x1="35" y1="5" x2="35" y2="-10" stroke="#eab308" strokeWidth="1.2" />
            <circle cx="35" cy="-10" r="2" fill="#eab308" />

            <line x1="48" y1="-1" x2="48" y2="-16" stroke="#eab308" strokeWidth="1.2" />
            <circle cx="48" cy="-16" r="2" fill="#eab308" />
            
            <line x1="60" y1="-7" x2="60" y2="-22" stroke="#6b7280" strokeWidth="1.2" />
            <circle cx="60" cy="-22" r="2" fill="#4b5563" />
          </g>

          {/* Heavy Armored Substation Feed Cable leading directly to Secure Server Cage */}
          <path
            d="M 310 120 C 340 145, 360 170, 390 190 C 410 200, 430 205, 450 200"
            fill="none"
            stroke="#94a3b8"
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.8"
          />
          {/* Active Glowing High-Voltage Electricity flow line */}
          <path
            d="M 310 120 C 340 145, 360 170, 390 190 C 410 200, 430 205, 450 200"
            fill="none"
            stroke="url(#powerFeedGrad)"
            strokeWidth="2"
            strokeLinecap="round"
            className="energy-conduit"
            filter="url(#glow-light)"
          />
        </g>


        {/* ── FEATURE 5: SECURE CUSTOM CAGE (RED LIGHTS/LASERS) ── */}
        <g className="interactive-element">
          {/* Ground border outline for Cage Floor */}
          <polygon
            points="380 230, 490 180, 600 230, 490 280"
            fill="none"
            stroke="#dc2626"
            strokeWidth="1.2"
            strokeDasharray="4, 4"
            opacity="0.5"
          />

          {/* Main Enclosing laser secure cage */}
          {/* Back left column */}
          <line x1="380" y1="230" x2="380" y2="120" stroke="#dc2626" strokeWidth="1.5" className="laser-fence" />
          {/* Back right column */}
          <line x1="490" y1="180" x2="490" y2="70" stroke="#dc2626" strokeWidth="1.2" className="laser-fence" />
          {/* Front right column */}
          <line x1="600" y1="230" x2="600" y2="120" stroke="#dc2626" strokeWidth="1.5" className="laser-fence" />
          {/* Front left column */}
          <line x1="490" y1="280" x2="490" y2="170" stroke="#dc2626" strokeWidth="1.5" className="laser-fence" />

          {/* Secure Cage Roof Wireframe Grid */}
          <polygon
            points="380 120, 490 70, 600 120, 490 170"
            fill="rgba(220, 38, 38, 0.02)"
            stroke="#dc2626"
            strokeWidth="1.5"
            className="laser-fence"
          />
          {/* Cross Diagonal Grid lines on Cage roof */}
          <line x1="380" y1="120" x2="600" y2="120" stroke="#dc2626" strokeWidth="0.8" className="laser-fence" />
          <line x1="490" y1="70" x2="490" y2="170" stroke="#dc2626" strokeWidth="0.8" className="laser-fence" />
        </g>


        {/* ── FEATURE 1: 200KW/RACK HIGH-DENSITY GPU CABINETS ── */}
        <g className="interactive-element" id="gpu-cabinets">
          
          {/* Cabinet 1 (Securely Caged Server Rack - Left) */}
          {/* Top Face */}
          <polygon points="440 145, 480 125, 450 110, 410 130" fill="#6b7280" stroke="#eab308" strokeWidth="0.6" />
          {/* Left Face */}
          <polygon points="410 130, 440 145, 440 215, 410 200" fill="url(#gpuServerGrad)" stroke="#cbd5e1" strokeWidth="0.5" />
          {/* Vents & Liquid Cooling Interface on Left Face */}
          <line x1="416" y1="145" x2="434" y2="154" stroke="#475569" strokeWidth="2.5" />
          <line x1="416" y1="145" x2="434" y2="154" stroke="#0ea5e9" strokeWidth="1" />
          <line x1="416" y1="155" x2="434" y2="164" stroke="#475569" strokeWidth="2.5" />
          <line x1="416" y1="155" x2="434" y2="164" stroke="#0ea5e9" strokeWidth="1" />
          {/* Front Face (Blade server slots - dark rack for high premium contrast) */}
          <polygon points="440 145, 480 125, 480 195, 440 215" fill="#1e293b" stroke="#0f172a" strokeWidth="0.5" />
          {/* Server Blades with LEDs */}
          {Array.from({ length: 5 }).map((_, i) => {
            const y = 151 + i * 11;
            const xLeft = 444;
            const yLeft = y;
            const xRight = 476;
            const yRight = y - 16;
            return (
              <g key={i}>
                <polygon points={`${xLeft} ${yLeft}, ${xRight} ${yRight}, ${xRight} ${yRight+5}, ${xLeft} ${yLeft+5}`} fill="#0f172a" />
                <circle cx={xRight - 8} cy={yRight + 2.5} r="1.2" className="led-green" />
                <circle cx={xRight - 4} cy={yRight + 1.2} r="1.2" className="led-yellow" />
                <circle cx={xRight - 1} cy={yRight + 0.3} r="1.2" className="led-blue" />
              </g>
            );
          })}

          {/* Cabinet 2 (Securely Caged Server Rack - Right) */}
          {/* Top Face */}
          <polygon points="495 170, 535 150, 505 135, 465 155" fill="#6b7280" stroke="#eab308" strokeWidth="0.6" />
          {/* Left Face */}
          <polygon points="465 155, 495 170, 495 240, 465 225" fill="url(#gpuServerGrad)" stroke="#cbd5e1" strokeWidth="0.5" />
          <line x1="471" y1="170" x2="489" y2="179" stroke="#475569" strokeWidth="2.5" />
          <line x1="471" y1="170" x2="489" y2="179" stroke="#0ea5e9" strokeWidth="1" />
          <line x1="471" y1="180" x2="489" y2="189" stroke="#475569" strokeWidth="2.5" />
          <line x1="471" y1="180" x2="489" y2="189" stroke="#0ea5e9" strokeWidth="1" />
          {/* Front Face */}
          <polygon points="495 170, 535 150, 535 220, 495 240" fill="#1e293b" stroke="#0f172a" strokeWidth="0.5" />
          {/* Server Blades with LEDs */}
          {Array.from({ length: 5 }).map((_, i) => {
            const y = 176 + i * 11;
            const xLeft = 499;
            const yLeft = y;
            const xRight = 531;
            const yRight = y - 16;
            return (
              <g key={i}>
                <polygon points={`${xLeft} ${yLeft}, ${xRight} ${yRight}, ${xRight} ${yRight+5}, ${xLeft} ${yLeft+5}`} fill="#0f172a" />
                <circle cx={xRight - 8} cy={yRight + 2.5} r="1.2" className="led-green" />
                <circle cx={xRight - 4} cy={yRight + 1.2} r="1.2" className="led-yellow" />
                <circle cx={xRight - 1} cy={yRight + 0.3} r="1.2" className="led-blue" />
              </g>
            );
          })}

          {/* LIQUID COOLING LOOPS (Cyan pipes showing 200kW/rack density cooling flow) */}
          <path d="M 425 210 Q 450 225, 480 230" fill="none" stroke="#0ea5e9" strokeWidth="2" opacity="0.4" />
          <path d="M 425 210 Q 450 225, 480 230" fill="none" stroke="url(#coolPipeGrad)" strokeWidth="1.2" className="liquid-tube" />
          
          <path d="M 440 180 Q 465 195, 495 190" fill="none" stroke="#0ea5e9" strokeWidth="1.5" opacity="0.4" />
          <path d="M 440 180 Q 465 195, 495 190" fill="none" stroke="#38bdf8" strokeWidth="1" className="liquid-tube" />
        </g>


        {/* ── FEATURE 3: 400G INFINIBAND & CROSS-CONNECT NETWORK FABRIC ── */}
        <g className="interactive-element" id="network-fabric">
          {/* Dedicated High-Speed InfiniBand Switch Rack (Outside Secure Cage, Right) */}
          {/* Top Face */}
          <polygon points="580 215, 620 195, 590 180, 550 200" fill="#475569" stroke="#0ea5e9" strokeWidth="0.8" />
          {/* Left Face (Patch panel) */}
          <polygon points="550 200, 580 215, 580 285, 550 270" fill="#0f172a" stroke="#1e293b" strokeWidth="0.5" />
          {/* Dense optical fiber patch matrix ports */}
          {Array.from({ length: 6 }).map((_, i) => {
            const y = 205 + i * 11;
            return (
              <g key={i}>
                <line x1="555" y1={y} x2="575" y2={y + 10} stroke="#1e293b" strokeWidth="2" />
                <circle cx="560" cy={y + 2.5} r="0.8" fill="#38bdf8" className="led-blue" />
                <circle cx="566" cy={y + 5.5} r="0.8" fill="#c084fc" className="led-blue" />
                <circle cx="572" cy={y + 8.5} r="0.8" fill="#38bdf8" className="led-blue" />
              </g>
            );
          })}
          {/* Right Face */}
          <polygon points="580 215, 620 195, 620 265, 580 285" fill="#334155" stroke="#1e293b" strokeWidth="0.5" />

          {/* Glowing Optical Cross-connect curves linking InfiniBand switch directly to Secure Racks */}
          <path
            d="M 552 210 Q 520 230, 480 190"
            fill="none"
            stroke="#a855f7"
            strokeWidth="1.5"
            className="fiber-signal"
            filter="url(#glow-light)"
          />
          <path
            d="M 552 230 Q 520 250, 495 210"
            fill="none"
            stroke="#0ea5e9"
            strokeWidth="1.5"
            className="fiber-signal"
            filter="url(#glow-light)"
          />
          <path
            d="M 552 250 Q 530 270, 500 220"
            fill="none"
            stroke="#a855f7"
            strokeWidth="1.5"
            className="fiber-signal"
            filter="url(#glow-light)"
          />
        </g>


        {/* ── FEATURE 6: MEET-ME ROOM (MMR) ── */}
        <g className="interactive-element" id="meet-me-room">
          {/* MMR Fiber Console (Front Center/Right) */}
          {/* Top Face */}
          <polygon points="630 285, 670 265, 640 250, 600 270" fill="#475569" stroke="#eab308" strokeWidth="0.8" />
          {/* Left Face */}
          <polygon points="600 270, 630 285, 630 355, 600 340" fill="#1e293b" stroke="#334155" strokeWidth="0.5" />
          {Array.from({ length: 4 }).map((_, i) => {
            const y = 280 + i * 15;
            return (
              <g key={i}>
                <line x1="604" y1={y} x2="626" y2={y + 11} stroke="#0f172a" strokeWidth="2.5" />
                <circle cx="608" cy={y + 2.5} r="1" fill="#eab308" />
                <circle cx="616" cy={y + 6.5} r="1" fill="#64748b" />
                <circle cx="624" cy={y + 10.5} r="1" fill="#eab308" />
              </g>
            );
          })}
          {/* Right Face */}
          <polygon points="630 285, 670 265, 670 335, 630 355" fill="#334155" />

          {/* Thick underground telecom pipes entering MMR console */}
          <path d="M 615 352 C 600 375, 570 395, 540 380" fill="none" stroke="#94a3b8" strokeWidth="4" />
          <path d="M 625 350 C 610 380, 580 405, 550 390" fill="none" stroke="#94a3b8" strokeWidth="4" />

          {/* Fiber patch connections from MMR Console to InfiniBand Switch Rack */}
          <path
            d="M 602 272 Q 580 250, 578 222"
            fill="none"
            stroke="#eab308"
            strokeWidth="1.8"
            className="fiber-signal"
            filter="url(#glow-light)"
          />
        </g>


        {/* ── FEATURE 4: 24/7 NOC & SLA HOLOGRAM ── */}
        <g className="interactive-element" id="noc-hologram">
          {/* Base projector emitter on ground */}
          <ellipse cx="360" cy="275" rx="10" ry="5" fill="#0891b2" stroke="#06b6d4" opacity="0.6" />
          <polygon points="353 275, 367 275, 360 255" fill="rgba(6, 182, 212, 0.15)" />
          
          {/* Hologram projection rays */}
          <polygon points="360 255, 290 190, 430 140" fill="rgba(6, 182, 212, 0.03)" />

          {/* Hologram Floating HUD Panel */}
          {/* Panel back plate */}
          <polygon
            points="280 180, 420 135, 420 235, 280 280"
            fill="url(#hologramGrad)"
            stroke="#0891b2"
            strokeWidth="1.2"
            className="hologram-panel"
          />

          {/* Hologram text & graphs */}
          {/* SLA circle chart */}
          <circle cx="330" cy="190" r="16" fill="none" stroke="rgba(8, 145, 178, 0.1)" strokeWidth="3" className="hologram-panel" />
          <circle cx="330" cy="190" r="16" fill="none" stroke="#ca8a04" strokeWidth="3.2" strokeDasharray="80, 100" className="hologram-panel" />
          <text x="318" y="193" fontFamily="monospace" fontSize="8" fill="#0f172a" fontWeight="bold" className="hologram-panel">99.99</text>

          {/* SLA Text */}
          <text x="355" y="185" fontFamily="monospace" fontSize="9" fontWeight="bold" fill="#0e7490" className="hologram-panel">SLA SECURED</text>
          <text x="355" y="196" fontFamily="monospace" fontSize="7" fill="#475569" fontWeight="bold" className="hologram-panel">SMART SLA 100%</text>

          {/* System status graph */}
          <path d="M 295 240 L 320 235 L 340 245 L 360 230 L 380 238 L 405 225" fill="none" stroke="#16a34a" strokeWidth="1.5" className="hologram-panel" />
          <circle cx="405" cy="225" r="2.5" fill="#16a34a" className="hologram-panel" />

          {/* Technical HUD details */}
          <text x="295" y="260" fontFamily="monospace" fontSize="9" fontWeight="bold" fill="#0f172a" className="hologram-panel">24/7 REMOTE HANDS</text>
          <text x="295" y="270" fontFamily="monospace" fontSize="7" fill="#ca8a04" className="hologram-panel">NOC: ONLINE // ACTIVE</text>
        </g>


        {/* ── LIGHT MODE COMPATIBLE METICULOUS VISUAL LABELS WITH CALLOUT HUD LINES ── */}

        {/* 1. GPU CABINETS & density */}
        <g transform="translate(480, 50)">
          <circle cx="0" cy="0" r="3.5" fill="#ca8a04" />
          <path d="M 0 0 L -30 -15 L -60 -15" fill="none" stroke="#ca8a04" strokeWidth="1" strokeDasharray="1, 1" />
          <text
            x="-185"
            y="-20"
            fontFamily="monospace"
            fontSize="9"
            fontWeight="bold"
            letterSpacing="2.5"
            fill="#0f172a"
            className="hud-text"
          >
            200KW GPU CABINETS
          </text>
          <text
            x="-185"
            y="-8"
            fontFamily="monospace"
            fontSize="7.5"
            letterSpacing="1"
            fill="#475569"
          >
            LIQUID-COOLED HIGH-DENSITY COMPUTE
          </text>
        </g>

        {/* 2. DEDICATED SUBSTATION POWER FEED */}
        <g transform="translate(340, 160)">
          <circle cx="0" cy="0" r="3.5" fill="#ca8a04" />
          <path d="M 0 0 L -40 -40 L -90 -40" fill="none" stroke="#ca8a04" strokeWidth="1" strokeDasharray="1, 1" />
          <text
            x="-250"
            y="-45"
            fontFamily="monospace"
            fontSize="9"
            fontWeight="bold"
            letterSpacing="2.5"
            fill="#ca8a04"
            className="hud-text"
          >
            DIRECT SUBSTATION FEED
          </text>
          <text
            x="-250"
            y="-33"
            fontFamily="monospace"
            fontSize="7.5"
            letterSpacing="1"
            fill="#475569"
          >
            DEDICATED POWER YARD - NO SHARED RISK
          </text>
        </g>

        {/* 3. 400G INFINIBAND & CROSS-CONNECT */}
        <g transform="translate(600, 240)">
          <circle cx="0" cy="0" r="3.5" fill="#0284c7" />
          <path d="M 0 0 L 40 20 L 90 20" fill="none" stroke="#0284c7" strokeWidth="1" strokeDasharray="1, 1" />
          <text
            x="45"
            y="13"
            fontFamily="monospace"
            fontSize="9"
            fontWeight="bold"
            letterSpacing="2.5"
            fill="#0284c7"
            className="hud-text"
          >
            400G INFINIBAND FABRIC
          </text>
          <text
            x="45"
            y="25"
            fontFamily="monospace"
            fontSize="7.5"
            letterSpacing="1"
            fill="#475569"
          >
            ULTRA-LOW LATENCY OPTICAL CROSS-CONNECT
          </text>
        </g>

        {/* 4. REMOTE HANDS & NOC SLA */}
        <g transform="translate(350, 140)">
          <circle cx="0" cy="0" r="3.5" fill="#0891b2" />
          <path d="M 0 0 L -30 -30 L -90 -30" fill="none" stroke="#0891b2" strokeWidth="1" strokeDasharray="1, 1" />
          <text
            x="-225"
            y="-35"
            fontFamily="monospace"
            fontSize="9"
            fontWeight="bold"
            letterSpacing="2.5"
            fill="#0891b2"
            className="hud-text"
          >
            24/7 NOC & SMART SLA
          </text>
          <text
            x="-225"
            y="-23"
            fontFamily="monospace"
            fontSize="7.5"
            letterSpacing="1"
            fill="#475569"
          >
            REMOTE HANDS & SMART SLA COMPLIANT
          </text>
        </g>

        {/* 5. SECURE CAGE & PRIVATE SUITES */}
        <g transform="translate(490, 110)">
          <circle cx="0" cy="0" r="3.5" fill="#dc2626" />
          <path d="M 0 0 L 30 -30 L 70 -30" fill="none" stroke="#dc2626" strokeWidth="1" strokeDasharray="1, 1" />
          <text
            x="40"
            y="-35"
            fontFamily="monospace"
            fontSize="9"
            fontWeight="bold"
            letterSpacing="2.5"
            fill="#dc2626"
            className="hud-text"
          >
            SECURE CUSTOM CAGE
          </text>
          <text
            x="40"
            y="-23"
            fontFamily="monospace"
            fontSize="7.5"
            letterSpacing="1"
            fill="#475569"
          >
            PHYSICAL BARRIER & CUSTOM SUITES
          </text>
        </g>

        {/* 6. MEET-ME ROOM (MMR) */}
        <g transform="translate(630, 310)">
          <circle cx="0" cy="0" r="3.5" fill="#ca8a04" />
          <path d="M 0 0 L 30 20 L 70 20" fill="none" stroke="#ca8a04" strokeWidth="1" strokeDasharray="1, 1" />
          <text
            x="40"
            y="13"
            fontFamily="monospace"
            fontSize="9"
            fontWeight="bold"
            letterSpacing="2.5"
            fill="#0f172a"
            className="hud-text"
          >
            MEET-ME ROOM (MMR)
          </text>
          <text
            x="40"
            y="25"
            fontFamily="monospace"
            fontSize="7.5"
            letterSpacing="1"
            fill="#475569"
          >
            CARRIER-NEUTRAL EXTERNAL ACCESS
          </text>
        </g>
      </svg>
    </div>
  );
};

export default ColocationDiagram;
