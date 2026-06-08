"use client";


import React, { useState, useEffect, useRef } from 'react';
import './InfraHero.css';

const InfraHero = () => {
  const [activeLayer, setActiveLayer] = useState(4);
  const pxFieldRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const layers = [
    { id: 4, title: "NeoCloudz Compute", num: "04", desc: "Enterprise-grade B200 GPU clusters for massive AI training & low-latency inference." },
    { id: 3, title: "Liquid Cooled Rows", num: "03", desc: "Tier III-ready data center modules designed for 100kW+ rack density with sub-1.1 PUE." },
    { id: 2, title: "Technical Matrix", num: "02", desc: "Software-defined networking layer managing cross-site connectivity and load balancing." },
    { id: 1, title: "BTM Power Ingest", num: "01", desc: "Behind-the-meter energy integration providing high-uptime power at industrial rates." }
  ];

  useEffect(() => {
    const glowPos = { 4: 18, 3: 35, 2: 52, 1: 78 };
    if (glowRef.current) {
      glowRef.current.style.top = `${glowPos[activeLayer as keyof typeof glowPos]}%`;
    }

    const interval = setInterval(() => {
      if (pxFieldRef.current && activeLayer !== 0) {
        const px = document.createElement('div');
        px.className = 'infra-px';
        const s = 1 + Math.random() * 2.5;
        px.style.cssText = `width:${s}px;height:${s}px;left:${20 + Math.random() * 60}%;top:${20 + Math.random() * 60}%;animation:infra-pxRise ${3 + Math.random() * 3}s ease-in-out forwards`;
        pxFieldRef.current.appendChild(px);
        setTimeout(() => px.remove(), 6000);
      }
    }, 450);

    return () => clearInterval(interval);
  }, [activeLayer]);

  return (
    <section id="infra-hero">
      <div className="infra-ambient"></div>
      
      <div className="infra-inner">
        <div className="infra-left">
          <div className="infra-tag">
            <span className="infra-dot"></span>
            NASDAQ : DGXX Â· AI Infrastructure Platform
          </div>
          <h1 className="infra-title">
            layer <span>AI</span><br />
            runs on.
          </h1>
          <p className="infra-desc">
            DigiPowerX integrates power infrastructure, Tier III-ready data centers, and bare-metal GPU compute platforms â€” engineered to support the next generation of AI training, inference, and high-performance computing workloads.
          </p>
          <div className="infra-actions">
            <a href="/energy" className="infra-btn yellow">Explore Infrastructure</a>
            <a href="/neocloudz" className="infra-btn outline">Deploy Compute</a>
          </div>
        </div>

        <div className="infra-right">
          <div className="infra-stage" id="stage">
            <div className="infra-glow" ref={glowRef} id="glow"></div>
            <div className="infra-pxfield" ref={pxFieldRef} id="pxfield"></div>
            
            <svg className="infra-iso-svg" viewBox="0 0 820 860" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="gY" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#ffd84d" /><stop offset="1" stopColor="#d99e12" />
                </linearGradient>
                <linearGradient id="sheenG" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#fff" stopOpacity="0.09" />
                  <stop offset="0.5" stopColor="#fff" stopOpacity="0.02" />
                  <stop offset="1" stopColor="#fff" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="sheenYG" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#ffd84d" stopOpacity="0.2" />
                  <stop offset="0.5" stopColor="#ffd84d" stopOpacity="0.04" />
                  <stop offset="1" stopColor="#ffd84d" stopOpacity="0" />
                </linearGradient>
                <radialGradient id="shadowG" cx="0.5" cy="0.5" r="0.5">
                  <stop offset="0" stopColor="#000" stopOpacity="0.7" />
                  <stop offset="0.65" stopColor="#000" stopOpacity="0.3" />
                  <stop offset="1" stopColor="#000" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="beamG" x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0" stopColor="#ffc629" stopOpacity="0.3" />
                  <stop offset="0.6" stopColor="#ffc629" stopOpacity="0.1" />
                  <stop offset="1" stopColor="#ffc629" stopOpacity="0" />
                </linearGradient>
                <filter id="sg" x="-70%" y="-70%" width="240%" height="240%">
                  <feGaussianBlur stdDeviation="3.5" result="b" />
                  <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <filter id="blur8" x="-60%" y="-60%" width="220%" height="220%">
                  <feGaussianBlur stdDeviation="8" />
                </filter>
                <filter id="blur14" x="-80%" y="-80%" width="260%" height="260%">
                  <feGaussianBlur stdDeviation="14" />
                </filter>
              </defs>

              <g style={{ pointerEvents: 'none' }}>
                <ellipse fill="url(#shadowG)" filter="url(#blur8)" cx="370" cy="168" rx="118" ry="40" />
                <ellipse fill="url(#shadowG)" filter="url(#blur14)" cx="370" cy="314" rx="210" ry="72" />
                <ellipse fill="url(#shadowG)" filter="url(#blur14)" cx="370" cy="472" rx="218" ry="74" />
                <ellipse fill="url(#shadowG)" filter="url(#blur14)" cx="370" cy="710" rx="228" ry="52" />
              </g>

              <polygon id="lightBeam" className={`infra-beam ${activeLayer === 4 ? 'active' : ''}`} points="318,582 422,582 388,80 352,80" fill="url(#beamG)" />

              <g>
                <line className="infra-connector" x1="302" y1="470" x2="302" y2="504" />
                <line className="infra-connector" x1="370" y1="470" x2="370" y2="504" />
                <line className="infra-connector" x1="438" y1="470" x2="438" y2="504" />
                <line className="infra-connector" x1="302" y1="314" x2="302" y2="346" />
                <line className="infra-connector" x1="370" y1="314" x2="370" y2="346" />
                <line className="infra-connector" x1="438" y1="314" x2="438" y2="346" />
              </g>

              {/* Layer 4 */}
              <g className={`infra-lg infra-lflt infra-lf4 ${activeLayer === 4 ? 'active' : 'inactive'}`} id="layer4">
                <polygon className="infra-pd" points="84.9,57.8 454.5,242.6 454.5,256.6 84.9,71.8" />
                <polygon className="infra-pf" points="454.5,242.6 655.1,142.2 655.1,156.2 454.5,256.6" />
                <polygon className="infra-pt" points="285.5,-42.6 655.1,142.2 454.5,242.6 84.9,57.8" />
                <polygon className="infra-ps" points="470.3,49.8 205.3,-2.4 269.7,150.2 513.8,137.1" />
                <g className="det">
                  <polygon className="infra-lm" points="290.8,-14.4 267.9,-3.0 267.9,-48.7 290.8,-60.2" />
                  <polygon className="infra-ld" points="290.8,-14.4 313.7,-3.0 313.7,-48.7 290.8,-60.2" />
                  <polygon className="infra-lt" points="290.8,-60.2 313.7,-48.7 290.8,-37.3 267.9,-48.7" />
                  <line className="infra-ig infra-gls" x1="313.7" y1="-35.9" x2="290.8" y2="-24.5" strokeWidth="1.8" />
                  <rect className="infra-ig infra-blink" x="299.2" y="-17.7" width="6" height="2.4" rx="1" />
                  <polygon className="infra-lm" points="370.0,85.0 340.1,100.0 340.1,22.6 370.0,7.6" />
                  <polygon className="infra-ld" points="370.0,85.0 399.9,100.0 399.9,22.6 370.0,7.6" />
                  <polygon className="infra-lt" points="370.0,7.6 399.9,22.6 370.0,37.5 340.1,22.6" />
                  <circle className="infra-lh" cx="370.0" cy="22.6" r="6" />
                  <circle className="infra-ig infra-pls" cx="370.0" cy="22.6" r="5" filter="url(#sg)" />
                </g>
              </g>

              {/* Layer 3 */}
              <g className={`infra-lg infra-lflt infra-lf3 ${activeLayer === 3 ? 'active' : 'inactive'}`} id="layer3">
                <polygon className="infra-pd" points="40.9,197.8 470.3,412.6 470.3,428.6 40.9,213.8" />
                <polygon className="infra-pf" points="470.3,412.6 699.1,298.2 699.1,314.2 470.3,428.6" />
                <polygon className="infra-pt" points="269.7,83.4 699.1,298.2 470.3,412.6 40.9,197.8" />
                <polygon className="infra-ps" points="484.4,190.8 178.2,129.2 255.6,305.2 516.0,337.3" />
                <g className="det">
                  <polygon className="infra-lm" points="349.8,173.6 326.9,185.1 326.9,121.7 349.8,110.3" />
                  <polygon className="infra-ld" points="349.8,173.6 369.1,183.3 369.1,120.0 349.8,110.3" />
                  <polygon className="infra-lt" points="349.8,110.3 369.1,120.0 346.2,131.4 326.9,121.7" />
                  <rect className="infra-ig infra-blink" x="354.7" y="159.0" width="6" height="3" rx="1.5" />
                </g>
              </g>

              {/* Layer 2 */}
              <g className={`infra-lg infra-lflt infra-lf2 ${activeLayer === 2 ? 'active' : 'inactive'}`} id="layer2">
                <polygon className="infra-pd" points="28.6,353.0 472.1,574.7 472.1,590.7 28.6,369.0" />
                <polygon className="infra-pf" points="472.1,574.7 711.4,455.0 711.4,471.0 472.1,590.7" />
                <polygon className="infra-pt" points="267.9,233.3 711.4,455.0 472.1,574.7 28.6,353.0" />
                <polygon className="infra-ps" points="489.7,344.2 172.2,281.2 250.3,463.8 516.6,548.0" />
              </g>

              {/* Layer 1 */}
              <g className={`infra-lg infra-lflt infra-lf1 ${activeLayer === 1 ? 'active' : 'inactive'}`} id="layer1">
                <polygon className="infra-pd" points="18.0,509.2 475.6,738.0 475.6,754.0 18.0,525.2" />
                <polygon className="infra-pf" points="475.6,738.0 722.0,614.8 722.0,630.8 475.6,754.0" />
                <polygon className="infra-pt" points="264.4,386.0 722.0,614.8 475.6,738.0 18.0,509.2" />
                <polygon className="infra-ps" points="493.2,500.4 165.8,435.3 246.8,623.6 517.1,761.3" />
              </g>
            </svg>

            <div className="infra-meta">
              <div className="infra-live"></div>
              DGXX INFRA: ACTIVE
            </div>
          </div>

          <div className="infra-points">
            {layers.map((layer) => (
              <div 
                key={layer.id}
                className={`infra-point ${activeLayer === layer.id ? 'active' : ''}`}
                data-layer={layer.id}
                onClick={() => setActiveLayer(layer.id)}
              >
                <span className="infra-pnum">{layer.num}</span>
                <span className="infra-ptitle">{layer.title}</span>
                <div className="infra-pdesc-wrap">
                  <p className="infra-pdesc">{layer.desc}</p>
                  <div className="infra-pbar"><span></span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default InfraHero;
