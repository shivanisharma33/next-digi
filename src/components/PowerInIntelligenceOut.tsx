import { useState } from "react";
import "./PowerInIntelligenceOut.css";

const PowerInIntelligenceOut = () => {
  const [speed, setSpeed] = useState(6);

  return (
    <section className="pio" style={{ ["--speed" as string]: `${speed}s` }}>
      <div className="pio-stage-bg" />
      <div className="pio-grid-tex" />

      <div className="pio-wrap">
        <div className="pio-headline">
          <h1>
            POWER IN.<br />
            <span className="pio-amber">INTELLIGENCE</span> OUT.
          </h1>
          <div className="pio-sub">From Megawatts to Models — One Continuous Stack</div>
        </div>

        <div className="pio-rule" />

        <div className="pio-pipeline">
          {/* 01 · POWER GENERATION */}
          <div className="pio-stage">
            <div className="pio-box">
              <span className="pio-tag">01 / SOURCE</span>
              <span className="pio-status" />
              <svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice">
                <defs>
                  <linearGradient id="ground-s1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1a1a1a" />
                    <stop offset="100%" stopColor="#050505" />
                  </linearGradient>
                  <linearGradient id="metal-s1" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#5a5a5a" />
                    <stop offset="50%" stopColor="#c8c8c8" />
                    <stop offset="100%" stopColor="#3a3a3a" />
                  </linearGradient>
                  <linearGradient id="building-s1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7a7a7a" />
                    <stop offset="50%" stopColor="#3a3a3a" />
                    <stop offset="100%" stopColor="#0a0a0a" />
                  </linearGradient>
                  <linearGradient id="building-side-s1" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#5a5a5a" />
                    <stop offset="100%" stopColor="#1a1a1a" />
                  </linearGradient>
                  <linearGradient id="transformer-s1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#9a9a9a" />
                    <stop offset="100%" stopColor="#2a2a2a" />
                  </linearGradient>
                  <radialGradient id="ambient-s1" cx="50%" cy="50%">
                    <stop offset="0%" stopColor="#F5B106" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#F5B106" stopOpacity="0" />
                  </radialGradient>
                  <radialGradient id="windowGlow-s1">
                    <stop offset="0%" stopColor="#FFD54F" stopOpacity="1" />
                    <stop offset="100%" stopColor="#F5B106" stopOpacity="0.4" />
                  </radialGradient>
                  <linearGradient id="godRay-s1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F5B106" stopOpacity="0" />
                    <stop offset="50%" stopColor="#F5B106" stopOpacity="0.08" />
                    <stop offset="100%" stopColor="#F5B106" stopOpacity="0" />
                  </linearGradient>
                </defs>

                <polygon points="155,0 175,0 200,180 130,180" fill="url(#godRay-s1)" opacity="0.6" />
                <ellipse cx="160" cy="180" rx="155" ry="22" fill="url(#ambient-s1)" />

                <g opacity="0.4">
                  <circle cx="50" cy="25" r="0.5" fill="#F5B106"><animate attributeName="opacity" values="0;1;0" dur="4s" repeatCount="indefinite" /></circle>
                  <circle cx="250" cy="35" r="0.5" fill="#F5B106"><animate attributeName="opacity" values="1;0;1" dur="3s" repeatCount="indefinite" /></circle>
                  <circle cx="280" cy="60" r="0.4" fill="#F5B106"><animate attributeName="opacity" values="1;0;1" dur="3.5s" repeatCount="indefinite" /></circle>
                </g>

                <polygon points="15,175 305,175 315,195 5,195" fill="url(#ground-s1)" stroke="#2a2a2a" strokeWidth="0.5" />

                {/* Power house building */}
                <g>
                  <polygon points="14,170 110,170 115,178 9,178" fill="#1a1a1a" stroke="#000" strokeWidth="0.4" />
                  <polygon points="18,110 100,110 100,170 18,170" fill="url(#building-s1)" stroke="#000" strokeWidth="0.5" />
                  <polygon points="100,110 115,98 115,162 100,170" fill="url(#building-side-s1)" stroke="#000" strokeWidth="0.5" />
                  <polygon points="18,110 33,98 115,98 100,110" fill="#7a7a7a" stroke="#000" strokeWidth="0.5" />
                  <polygon points="18,110 33,98 115,98 100,110" fill="#5a5a5a" opacity="0.3" />
                  <line x1="18" y1="110" x2="100" y2="110" stroke="#aaa" strokeWidth="0.4" />
                  <line x1="100" y1="110" x2="115" y2="98" stroke="#999" strokeWidth="0.3" />
                  <rect x="42" y="100" width="36" height="4" fill="#2a2a2a" stroke="#000" strokeWidth="0.3" />
                  <rect x="42" y="100" width="36" height="1" fill="#888" />
                  <rect x="82" y="102" width="14" height="6" fill="#3a3a3a" stroke="#000" strokeWidth="0.3" />
                  <rect x="83" y="103" width="12" height="1" fill="#5a5a5a" />
                  <line x1="84" y1="105" x2="94" y2="105" stroke="#1a1a1a" strokeWidth="0.3" />
                  <line x1="84" y1="107" x2="94" y2="107" stroke="#1a1a1a" strokeWidth="0.3" />

                  <rect x="44" y="138" width="20" height="32" fill="#0a0a0a" stroke="#4a4a4a" strokeWidth="0.4" />
                  <line x1="54" y1="138" x2="54" y2="170" stroke="#3a3a3a" strokeWidth="0.3" />
                  <rect x="46" y="142" width="6" height="4" fill="#1a1a1a" stroke="#3a3a3a" strokeWidth="0.2" />
                  <rect x="56" y="142" width="6" height="4" fill="#1a1a1a" stroke="#3a3a3a" strokeWidth="0.2" />
                  <circle cx="52" cy="155" r="0.6" fill="#F5B106" />
                  <circle cx="56" cy="155" r="0.6" fill="#F5B106" />
                  <rect x="48" y="160" width="12" height="4" fill="#F5B106" />
                  <text x="54" y="163.3" textAnchor="middle" fontSize="2.8" fill="#000" fontWeight="800">⚡ HV</text>

                  <rect x="22" y="118" width="9" height="7" fill="url(#windowGlow-s1)" />
                  <rect x="33" y="118" width="9" height="7" fill="url(#windowGlow-s1)" opacity="0.7" />
                  <rect x="68" y="118" width="9" height="7" fill="url(#windowGlow-s1)" />
                  <rect x="79" y="118" width="9" height="7" fill="url(#windowGlow-s1)" opacity="0.6" />
                  <rect x="90" y="118" width="8" height="7" fill="url(#windowGlow-s1)" opacity="0.8" />
                  <line x1="26.5" y1="118" x2="26.5" y2="125" stroke="#000" strokeWidth="0.5" />
                  <line x1="37.5" y1="118" x2="37.5" y2="125" stroke="#000" strokeWidth="0.5" />
                  <line x1="72.5" y1="118" x2="72.5" y2="125" stroke="#000" strokeWidth="0.5" />
                  <line x1="83.5" y1="118" x2="83.5" y2="125" stroke="#000" strokeWidth="0.5" />
                  <rect x="22" y="128" width="9" height="6" fill="url(#windowGlow-s1)" opacity="0.65" />
                  <rect x="33" y="128" width="9" height="6" fill="url(#windowGlow-s1)" />
                  <rect x="68" y="128" width="9" height="6" fill="url(#windowGlow-s1)" opacity="0.55" />
                  <rect x="79" y="128" width="9" height="6" fill="url(#windowGlow-s1)" opacity="0.7" />
                  <rect x="90" y="128" width="8" height="6" fill="url(#windowGlow-s1)" opacity="0.5" />

                  <g stroke="#000" strokeWidth="0.3" opacity="0.5">
                    <line x1="18" y1="137" x2="100" y2="137" />
                    <line x1="18" y1="160" x2="100" y2="160" />
                  </g>
                  <line x1="42" y1="110" x2="42" y2="170" stroke="#000" strokeWidth="0.3" opacity="0.4" />
                  <line x1="66" y1="110" x2="66" y2="170" stroke="#000" strokeWidth="0.3" opacity="0.4" />

                  <rect x="25" y="148" width="14" height="6" fill="#0a0a0a" stroke="#F5B106" strokeWidth="0.3" />
                  <text x="32" y="152.5" textAnchor="middle" fontSize="3.5" fill="#F5B106" fontWeight="800" fontFamily="monospace">DGX</text>

                  <rect x="20" y="113" width="3" height="2" fill="#444" stroke="#000" strokeWidth="0.2" />
                  <polygon points="22,115 25,123 19,123" fill="#F5B106" opacity="0.15" />
                  <rect x="96" y="113" width="3" height="2" fill="#444" stroke="#000" strokeWidth="0.2" />
                  <polygon points="97.5,115 100,123 95,123" fill="#F5B106" opacity="0.15" />
                </g>

                {/* Lightning protection tower */}
                <g transform="translate(0 21) scale(1 0.78)">
                  <rect x="50" y="96" width="20" height="4" fill="#1a1a1a" stroke="#000" strokeWidth="0.4" />
                  <rect x="50" y="96" width="20" height="1.2" fill="#5a5a5a" />
                  <circle cx="52" cy="98" r="0.7" fill="#666" stroke="#000" strokeWidth="0.2" />
                  <circle cx="59" cy="98" r="0.7" fill="#666" stroke="#000" strokeWidth="0.2" />
                  <circle cx="61" cy="98" r="0.7" fill="#666" stroke="#000" strokeWidth="0.2" />
                  <circle cx="68" cy="98" r="0.7" fill="#666" stroke="#000" strokeWidth="0.2" />

                  <line x1="52" y1="96" x2="56" y2="24" stroke="url(#metal-s1)" strokeWidth="1.8" />
                  <line x1="68" y1="96" x2="64" y2="24" stroke="url(#metal-s1)" strokeWidth="1.8" />
                  <line x1="56" y1="94" x2="58" y2="24" stroke="#666" strokeWidth="1.2" opacity="0.6" />
                  <line x1="64" y1="94" x2="62" y2="24" stroke="#666" strokeWidth="1.2" opacity="0.6" />

                  <g stroke="#999" strokeWidth="0.7">
                    <line x1="56" y1="32" x2="64" y2="28" />
                    <line x1="64" y1="32" x2="56" y2="28" />
                    <line x1="56" y1="32" x2="64" y2="32" />
                    <line x1="56" y1="28" x2="64" y2="28" />
                    <line x1="55" y1="42" x2="65" y2="36" />
                    <line x1="65" y1="42" x2="55" y2="36" />
                    <line x1="55" y1="42" x2="65" y2="42" />
                    <line x1="55" y1="36" x2="65" y2="36" />
                    <line x1="54" y1="52" x2="66" y2="46" />
                    <line x1="66" y1="52" x2="54" y2="46" />
                    <line x1="54" y1="52" x2="66" y2="52" />
                    <line x1="54" y1="46" x2="66" y2="46" />
                    <line x1="53" y1="62" x2="67" y2="56" />
                    <line x1="67" y1="62" x2="53" y2="56" />
                    <line x1="53" y1="62" x2="67" y2="62" />
                    <line x1="53" y1="56" x2="67" y2="56" />
                    <line x1="52" y1="74" x2="68" y2="68" />
                    <line x1="68" y1="74" x2="52" y2="68" />
                    <line x1="52" y1="74" x2="68" y2="74" />
                    <line x1="52" y1="68" x2="68" y2="68" />
                    <line x1="52" y1="86" x2="68" y2="80" />
                    <line x1="68" y1="86" x2="52" y2="80" />
                    <line x1="52" y1="86" x2="68" y2="86" />
                    <line x1="52" y1="80" x2="68" y2="80" />
                    <line x1="52" y1="94" x2="68" y2="94" />
                  </g>

                  <g stroke="#bbb" strokeWidth="0.5">
                    <line x1="52" y1="92" x2="55" y2="92" />
                    <line x1="52" y1="85" x2="55" y2="85" />
                    <line x1="53" y1="78" x2="56" y2="78" />
                    <line x1="53" y1="71" x2="56" y2="71" />
                    <line x1="54" y1="64" x2="57" y2="64" />
                    <line x1="54" y1="57" x2="57" y2="57" />
                    <line x1="55" y1="50" x2="58" y2="50" />
                    <line x1="55" y1="43" x2="58" y2="43" />
                    <line x1="55" y1="36" x2="58" y2="36" />
                  </g>
                  <line x1="51.5" y1="96" x2="55" y2="32" stroke="#aaa" strokeWidth="0.4" opacity="0.7" />
                  <line x1="54.5" y1="96" x2="58" y2="32" stroke="#aaa" strokeWidth="0.4" opacity="0.7" />

                  <rect x="50" y="60" width="20" height="1.5" fill="#3a3a3a" stroke="#000" strokeWidth="0.2" />
                  <rect x="50" y="59" width="20" height="0.5" fill="#888" />

                  <rect x="69" y="75" width="6" height="10" fill="#2a2a2a" stroke="#000" strokeWidth="0.3" />
                  <rect x="70" y="76.5" width="4" height="1.5" fill="#0a0a0a" />
                  <circle cx="71" cy="80" r="0.4" fill="#1ED98A"><animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" /></circle>
                  <circle cx="73" cy="80" r="0.4" fill="#F5B106" />
                  <rect x="70" y="82" width="4" height="0.8" fill="#F5B106" opacity="0.6" />
                  <line x1="69" y1="78" x2="64" y2="78" stroke="#444" strokeWidth="0.3" />

                  <polygon points="54,24 66,24 64,22 56,22" fill="#3a3a3a" stroke="#000" strokeWidth="0.2" />
                  <polygon points="56,22 64,22 62,20 58,20" fill="#5a5a5a" stroke="#000" strokeWidth="0.2" />

                  <rect x="57" y="18" width="6" height="2.5" fill="#4a4a4a" stroke="#000" strokeWidth="0.2" />
                  <circle cx="58" cy="19.2" r="0.4" fill="#666" />
                  <circle cx="62" cy="19.2" r="0.4" fill="#666" />

                  <ellipse cx="60" cy="16.5" rx="3.2" ry="0.7" fill="#d4a574" stroke="#8a6a1a" strokeWidth="0.2" />
                  <ellipse cx="60" cy="15" rx="2.8" ry="0.7" fill="#d4a574" stroke="#8a6a1a" strokeWidth="0.2" />
                  <ellipse cx="60" cy="13.5" rx="2.4" ry="0.6" fill="#d4a574" stroke="#8a6a1a" strokeWidth="0.2" />

                  <polygon points="59,12.5 61,12.5 60.8,5 59.2,5" fill="#b8860b" stroke="#8a6a1a" strokeWidth="0.2" />
                  <line x1="59.8" y1="6" x2="59.8" y2="12" stroke="#FFD54F" strokeWidth="0.4" opacity="0.9" />

                  <polygon points="59.2,5 60.8,5 60,1" fill="#FFD54F" stroke="#8a6a1a" strokeWidth="0.25" />
                  <polygon points="59.6,4.5 60.4,4.5 60,2" fill="#FFE082" />

                  <circle cx="60" cy="1.5" r="1.5" fill="#FFD54F" opacity="0.3">
                    <animate attributeName="opacity" values="0.2;0.5;0.2" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="r" values="1;2;1" dur="2s" repeatCount="indefinite" />
                  </circle>

                  <circle cx="60" cy="40" r="1.8" fill="#A32D2D">
                    <animate attributeName="opacity" values="1;0.15;1" dur="1.4s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="60" cy="40" r="3" fill="#A32D2D" opacity="0.4">
                    <animate attributeName="opacity" values="0.5;0;0.5" dur="1.4s" repeatCount="indefinite" />
                    <animate attributeName="r" values="2;6;2" dur="1.4s" repeatCount="indefinite" />
                  </circle>
                  <rect x="58" y="39.5" width="4" height="1" fill="#444" stroke="#000" strokeWidth="0.2" />

                  <path d="M 63 19 Q 70 50 75 96" stroke="#8a5a2a" strokeWidth="0.7" fill="none" opacity="0.85" />
                </g>

                {/* Grounding cable along building wall (untransformed so it reaches ground) */}
                <path d="M 75 100 Q 78 130 80 175" stroke="#8a5a2a" strokeWidth="0.7" fill="none" opacity="0.75" />
                <rect x="74.5" y="115" width="1.5" height="1" fill="#3a3a3a" />
                <rect x="75" y="135" width="1.5" height="1" fill="#3a3a3a" />
                <rect x="78" y="155" width="1.5" height="1" fill="#3a3a3a" />

                {/* Guy wire (anchored to compressed tower) */}
                <g transform="translate(0 21) scale(1 0.78)">
                  <line x1="60" y1="55" x2="42" y2="100" stroke="#666" strokeWidth="0.35" opacity="0.5" />
                  <circle cx="42" cy="100" r="0.6" fill="#3a3a3a" />
                </g>

                {/* Transmission tower */}
                <g>
                  <line x1="160" y1="178" x2="170" y2="32" stroke="url(#metal-s1)" strokeWidth="1.5" />
                  <line x1="197" y1="178" x2="187" y2="32" stroke="url(#metal-s1)" strokeWidth="1.5" />
                  <line x1="168" y1="178" x2="174" y2="32" stroke="#5a5a5a" strokeWidth="0.9" opacity="0.7" />
                  <line x1="189" y1="178" x2="183" y2="32" stroke="#5a5a5a" strokeWidth="0.9" opacity="0.7" />

                  <g stroke="#888" strokeWidth="0.55">
                    <line x1="160" y1="170" x2="197" y2="150" />
                    <line x1="197" y1="170" x2="160" y2="150" />
                    <line x1="162" y1="145" x2="195" y2="125" />
                    <line x1="195" y1="145" x2="162" y2="125" />
                    <line x1="164" y1="120" x2="193" y2="100" />
                    <line x1="193" y1="120" x2="164" y2="100" />
                    <line x1="166" y1="95" x2="191" y2="78" />
                    <line x1="191" y1="95" x2="166" y2="78" />
                    <line x1="168" y1="74" x2="189" y2="58" />
                    <line x1="189" y1="74" x2="168" y2="58" />
                    <line x1="169" y1="54" x2="187" y2="42" />
                    <line x1="187" y1="54" x2="169" y2="42" />
                    <line x1="160" y1="150" x2="197" y2="150" />
                    <line x1="162" y1="125" x2="195" y2="125" />
                    <line x1="164" y1="100" x2="193" y2="100" />
                    <line x1="166" y1="78" x2="191" y2="78" />
                    <line x1="168" y1="58" x2="189" y2="58" />
                    <line x1="169" y1="42" x2="187" y2="42" />
                  </g>

                  <line x1="135" y1="64" x2="222" y2="64" stroke="#999" strokeWidth="1.3" />
                  <line x1="143" y1="48" x2="214" y2="48" stroke="#999" strokeWidth="1.3" />
                  <line x1="150" y1="34" x2="207" y2="34" stroke="#999" strokeWidth="1.3" />

                  <g stroke="#888" strokeWidth="0.5">
                    <line x1="140" y1="66" x2="168" y2="58" />
                    <line x1="217" y1="66" x2="189" y2="58" />
                    <line x1="148" y1="50" x2="169" y2="42" />
                    <line x1="209" y1="50" x2="187" y2="42" />
                    <line x1="154" y1="36" x2="171" y2="34" />
                    <line x1="203" y1="36" x2="186" y2="34" />
                  </g>

                  <line x1="170" y1="32" x2="178" y2="20" stroke="url(#metal-s1)" strokeWidth="1.3" />
                  <line x1="187" y1="32" x2="178" y2="20" stroke="url(#metal-s1)" strokeWidth="1.3" />
                  <line x1="174" y1="32" x2="178" y2="20" stroke="#5a5a5a" strokeWidth="0.9" opacity="0.7" />
                  <line x1="183" y1="32" x2="178" y2="20" stroke="#5a5a5a" strokeWidth="0.9" opacity="0.7" />
                  <g stroke="#888" strokeWidth="0.5">
                    <line x1="170" y1="32" x2="178" y2="26" />
                    <line x1="187" y1="32" x2="178" y2="26" />
                    <line x1="172" y1="28" x2="184" y2="28" />
                  </g>

                  <line x1="170" y1="20" x2="186" y2="20" stroke="#999" strokeWidth="1" />
                  <path d="M 178 20 Q 200 30 222 64" stroke="#888" strokeWidth="0.4" fill="none" opacity="0.6" />
                  <path d="M 178 20 Q 156 30 135 64" stroke="#888" strokeWidth="0.4" fill="none" opacity="0.6" />

                  <rect x="177" y="17" width="2" height="3" fill="#666" stroke="#000" strokeWidth="0.2" />

                  <circle cx="178" cy="14" r="1.6" fill="#A32D2D">
                    <animate attributeName="opacity" values="1;0.2;1" dur="1.2s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="178" cy="14" r="2.5" fill="#A32D2D" opacity="0.3">
                    <animate attributeName="opacity" values="0.4;0;0.4" dur="1.2s" repeatCount="indefinite" />
                    <animate attributeName="r" values="2;4;2" dur="1.2s" repeatCount="indefinite" />
                  </circle>

                  <g>
                    <line x1="139" y1="64" x2="139" y2="72" stroke="#ddd" strokeWidth="1" />
                    <line x1="179" y1="64" x2="179" y2="72" stroke="#ddd" strokeWidth="1" />
                    <line x1="219" y1="64" x2="219" y2="72" stroke="#ddd" strokeWidth="1" />
                    <circle cx="139" cy="66" r="0.9" fill="#e0e0e0" />
                    <circle cx="139" cy="69" r="0.9" fill="#e0e0e0" />
                    <circle cx="139" cy="72" r="0.9" fill="#e0e0e0" />
                    <circle cx="179" cy="66" r="0.9" fill="#e0e0e0" />
                    <circle cx="179" cy="69" r="0.9" fill="#e0e0e0" />
                    <circle cx="179" cy="72" r="0.9" fill="#e0e0e0" />
                    <circle cx="219" cy="66" r="0.9" fill="#e0e0e0" />
                    <circle cx="219" cy="69" r="0.9" fill="#e0e0e0" />
                    <circle cx="219" cy="72" r="0.9" fill="#e0e0e0" />

                    <line x1="148" y1="48" x2="148" y2="55" stroke="#ddd" strokeWidth="0.8" />
                    <line x1="209" y1="48" x2="209" y2="55" stroke="#ddd" strokeWidth="0.8" />
                    <circle cx="148" cy="50" r="0.8" fill="#e0e0e0" />
                    <circle cx="148" cy="52.5" r="0.8" fill="#e0e0e0" />
                    <circle cx="148" cy="55" r="0.8" fill="#e0e0e0" />
                    <circle cx="209" cy="50" r="0.8" fill="#e0e0e0" />
                    <circle cx="209" cy="52.5" r="0.8" fill="#e0e0e0" />
                    <circle cx="209" cy="55" r="0.8" fill="#e0e0e0" />

                    <line x1="154" y1="34" x2="154" y2="40" stroke="#ddd" strokeWidth="0.8" />
                    <line x1="203" y1="34" x2="203" y2="40" stroke="#ddd" strokeWidth="0.8" />
                    <circle cx="154" cy="36" r="0.7" fill="#e0e0e0" />
                    <circle cx="154" cy="38" r="0.7" fill="#e0e0e0" />
                    <circle cx="154" cy="40" r="0.7" fill="#e0e0e0" />
                    <circle cx="203" cy="36" r="0.7" fill="#e0e0e0" />
                    <circle cx="203" cy="38" r="0.7" fill="#e0e0e0" />
                    <circle cx="203" cy="40" r="0.7" fill="#e0e0e0" />
                  </g>

                  <circle cx="148" cy="55" r="0.6" fill="#F5B106" />
                  <circle cx="209" cy="55" r="0.6" fill="#F5B106" />
                  <circle cx="154" cy="40" r="0.5" fill="#F5B106" />
                  <circle cx="203" cy="40" r="0.5" fill="#F5B106" />
                </g>

                <path id="line1-s1" d="M 139 74 Q 187 120 232 145" stroke="#F5B106" strokeWidth="1.2" fill="none" opacity="0.85" />
                <path id="line2-s1" d="M 179 74 Q 212 125 244 145" stroke="#F5B106" strokeWidth="1.2" fill="none" opacity="0.85" />
                <path id="line3-s1" d="M 219 74 Q 237 130 257 145" stroke="#F5B106" strokeWidth="1.2" fill="none" opacity="0.85" />
                <circle r="1.5" fill="#FFD54F"><animateMotion dur="2s" repeatCount="indefinite"><mpath href="#line1-s1" /></animateMotion></circle>
                <circle r="1.5" fill="#FFD54F"><animateMotion dur="2.2s" repeatCount="indefinite" begin="0.4s"><mpath href="#line2-s1" /></animateMotion></circle>
                <circle r="1.5" fill="#FFD54F"><animateMotion dur="1.8s" repeatCount="indefinite" begin="0.8s"><mpath href="#line3-s1" /></animateMotion></circle>

                {/* Substation transformer */}
                <g>
                  <polygon points="220,172 295,172 300,182 225,182" fill="#252525" stroke="#0a0a0a" strokeWidth="0.4" />
                  <polygon points="230,145 290,145 290,172 230,172" fill="url(#transformer-s1)" stroke="#000" strokeWidth="0.5" />
                  <polygon points="290,145 300,138 300,164 290,172" fill="#3a3a3a" stroke="#000" strokeWidth="0.4" />
                  <polygon points="230,145 240,138 300,138 290,145" fill="#6a6a6a" stroke="#000" strokeWidth="0.4" />
                  <g stroke="#000" strokeWidth="0.3">
                    <line x1="230" y1="150" x2="290" y2="150" />
                    <line x1="230" y1="154" x2="290" y2="154" />
                    <line x1="230" y1="158" x2="290" y2="158" />
                    <line x1="230" y1="162" x2="290" y2="162" />
                    <line x1="230" y1="166" x2="290" y2="166" />
                  </g>
                  <rect x="240" y="130" width="3" height="10" fill="#d4a574" />
                  <rect x="257" y="130" width="3" height="10" fill="#d4a574" />
                  <rect x="274" y="130" width="3" height="10" fill="#d4a574" />
                  <circle cx="241.5" cy="130" r="2" fill="#f0c896" stroke="#8a6a3a" strokeWidth="0.3" />
                  <circle cx="258.5" cy="130" r="2" fill="#f0c896" stroke="#8a6a3a" strokeWidth="0.3" />
                  <circle cx="275.5" cy="130" r="2" fill="#f0c896" stroke="#8a6a3a" strokeWidth="0.3" />
                  <rect x="225" y="150" width="5" height="20" fill="#1a1a1a" />
                  <rect x="290" y="150" width="5" height="20" fill="#1a1a1a" />
                  <rect x="251" y="158" width="16" height="8" fill="#F5B106" />
                  <text x="259" y="163.5" textAnchor="middle" fontSize="5" fill="#000" fontWeight="800">⚡HV</text>
                </g>
              </svg>
              <div className="pio-grade" />
              <div className="pio-grain" />
            </div>
            <div className="pio-card">
              <div className="pio-ctop">
                <span className="pio-cstage">Stage 01 — Source</span>
                <span className="pio-cdot"><i className="pio-on" /><i /><i /></span>
              </div>
              <h3>Power Generation</h3>
              <div className="pio-cmeta">Natural Gas · Solar · Grid</div>
              <div className="pio-cbar" />
              <div className="pio-cspec"><span>Capacity</span><b>400 MW+</b></div>
            </div>
          </div>

          <div className="pio-conn">
            <span className="pio-track" />
            <span className="pio-pulse" />
            <span className="pio-pulse" />
            <span className="pio-pulse" />
          </div>

          {/* 02 · HV SUBSTATION */}
          <div className="pio-stage">
            <div className="pio-box">
              <span className="pio-tag">02 / TRANSFORM</span>
              <span className="pio-status" />
              <svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice">
                <defs>
                  <linearGradient id="ground-s2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1a1a1a" />
                    <stop offset="100%" stopColor="#050505" />
                  </linearGradient>
                  <linearGradient id="tformer-s2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#9a9a9a" />
                    <stop offset="100%" stopColor="#2a2a2a" />
                  </linearGradient>
                  <radialGradient id="ambient-s2">
                    <stop offset="0%" stopColor="#F5B106" stopOpacity="0.32" />
                    <stop offset="100%" stopColor="#F5B106" stopOpacity="0" />
                  </radialGradient>
                </defs>

                <ellipse cx="160" cy="180" rx="155" ry="22" fill="url(#ambient-s2)" />

                <g opacity="0.4">
                  <circle cx="40" cy="30" r="0.5" fill="#F5B106"><animate attributeName="opacity" values="0;1;0" dur="4s" repeatCount="indefinite" /></circle>
                  <circle cx="270" cy="25" r="0.5" fill="#F5B106"><animate attributeName="opacity" values="1;0;1" dur="3.2s" repeatCount="indefinite" /></circle>
                </g>

                <polygon points="15,175 305,175 315,195 5,195" fill="url(#ground-s2)" stroke="#2a2a2a" strokeWidth="0.5" />

                <g stroke="#888" strokeWidth="0.9" fill="none">
                  <line x1="35" y1="175" x2="35" y2="40" />
                  <line x1="285" y1="175" x2="285" y2="40" />
                  <line x1="35" y1="40" x2="285" y2="40" />
                  <line x1="35" y1="54" x2="285" y2="54" />
                  <line x1="32" y1="175" x2="38" y2="115" />
                  <line x1="38" y1="175" x2="32" y2="115" />
                  <line x1="282" y1="175" x2="288" y2="115" />
                  <line x1="288" y1="175" x2="282" y2="115" />
                </g>

                <g>
                  <line x1="35" y1="47" x2="285" y2="47" stroke="#F5B106" strokeWidth="2" opacity="0.9" />
                  <g fill="#e0e0e0">
                    <rect x="78" y="49" width="2" height="7" />
                    <rect x="158" y="49" width="2" height="7" />
                    <rect x="238" y="49" width="2" height="7" />
                    <circle cx="79" cy="50" r="1" /><circle cx="79" cy="53" r="1" /><circle cx="79" cy="56" r="1" />
                    <circle cx="159" cy="50" r="1" /><circle cx="159" cy="53" r="1" /><circle cx="159" cy="56" r="1" />
                    <circle cx="239" cy="50" r="1" /><circle cx="239" cy="53" r="1" /><circle cx="239" cy="56" r="1" />
                  </g>
                </g>

                <g>
                  <polygon points="62,113 110,113 110,175 62,175" fill="url(#tformer-s2)" stroke="#000" strokeWidth="0.5" />
                  <polygon points="110,113 121,103 121,165 110,175" fill="#3a3a3a" stroke="#000" strokeWidth="0.4" />
                  <polygon points="62,113 73,103 121,103 110,113" fill="#5a5a5a" stroke="#000" strokeWidth="0.4" />
                  <g stroke="#000" strokeWidth="0.3">
                    <line x1="62" y1="125" x2="110" y2="125" /><line x1="62" y1="135" x2="110" y2="135" />
                    <line x1="62" y1="145" x2="110" y2="145" /><line x1="62" y1="155" x2="110" y2="155" />
                    <line x1="62" y1="165" x2="110" y2="165" />
                  </g>
                  <rect x="71" y="93" width="3" height="11" fill="#d4a574" /><rect x="84" y="93" width="3" height="11" fill="#d4a574" /><rect x="97" y="93" width="3" height="11" fill="#d4a574" />
                  <circle cx="72.5" cy="93" r="2" fill="#f0c896" stroke="#8a6a3a" strokeWidth="0.3" />
                  <circle cx="85.5" cy="93" r="2" fill="#f0c896" stroke="#8a6a3a" strokeWidth="0.3" />
                  <circle cx="98.5" cy="93" r="2" fill="#f0c896" stroke="#8a6a3a" strokeWidth="0.3" />
                  <rect x="76" y="140" width="20" height="10" fill="#F5B106" opacity="0.9" />
                  <text x="86" y="147" textAnchor="middle" fontSize="6" fill="#000" fontWeight="800">T1</text>
                </g>
                <g>
                  <polygon points="136,113 184,113 184,175 136,175" fill="url(#tformer-s2)" stroke="#000" strokeWidth="0.5" />
                  <polygon points="184,113 195,103 195,165 184,175" fill="#3a3a3a" stroke="#000" strokeWidth="0.4" />
                  <polygon points="136,113 147,103 195,103 184,113" fill="#5a5a5a" stroke="#000" strokeWidth="0.4" />
                  <g stroke="#000" strokeWidth="0.3">
                    <line x1="136" y1="125" x2="184" y2="125" /><line x1="136" y1="135" x2="184" y2="135" />
                    <line x1="136" y1="145" x2="184" y2="145" /><line x1="136" y1="155" x2="184" y2="155" />
                    <line x1="136" y1="165" x2="184" y2="165" />
                  </g>
                  <rect x="145" y="93" width="3" height="11" fill="#d4a574" /><rect x="158" y="93" width="3" height="11" fill="#d4a574" /><rect x="171" y="93" width="3" height="11" fill="#d4a574" />
                  <circle cx="146.5" cy="93" r="2" fill="#f0c896" stroke="#8a6a3a" strokeWidth="0.3" />
                  <circle cx="159.5" cy="93" r="2" fill="#f0c896" stroke="#8a6a3a" strokeWidth="0.3" />
                  <circle cx="172.5" cy="93" r="2" fill="#f0c896" stroke="#8a6a3a" strokeWidth="0.3" />
                  <rect x="150" y="140" width="20" height="10" fill="#F5B106" opacity="0.9" />
                  <text x="160" y="147" textAnchor="middle" fontSize="6" fill="#000" fontWeight="800">T2</text>
                </g>
                <g>
                  <polygon points="210,113 258,113 258,175 210,175" fill="url(#tformer-s2)" stroke="#000" strokeWidth="0.5" />
                  <polygon points="258,113 269,103 269,165 258,175" fill="#3a3a3a" stroke="#000" strokeWidth="0.4" />
                  <polygon points="210,113 221,103 269,103 258,113" fill="#5a5a5a" stroke="#000" strokeWidth="0.4" />
                  <g stroke="#000" strokeWidth="0.3">
                    <line x1="210" y1="125" x2="258" y2="125" /><line x1="210" y1="135" x2="258" y2="135" />
                    <line x1="210" y1="145" x2="258" y2="145" /><line x1="210" y1="155" x2="258" y2="155" />
                    <line x1="210" y1="165" x2="258" y2="165" />
                  </g>
                  <rect x="219" y="93" width="3" height="11" fill="#d4a574" /><rect x="232" y="93" width="3" height="11" fill="#d4a574" /><rect x="245" y="93" width="3" height="11" fill="#d4a574" />
                  <circle cx="220.5" cy="93" r="2" fill="#f0c896" stroke="#8a6a3a" strokeWidth="0.3" />
                  <circle cx="233.5" cy="93" r="2" fill="#f0c896" stroke="#8a6a3a" strokeWidth="0.3" />
                  <circle cx="246.5" cy="93" r="2" fill="#f0c896" stroke="#8a6a3a" strokeWidth="0.3" />
                  <rect x="224" y="140" width="20" height="10" fill="#F5B106" opacity="0.9" />
                  <text x="234" y="147" textAnchor="middle" fontSize="6" fill="#000" fontWeight="800">T3</text>
                </g>

                <g stroke="#F5B106" strokeWidth="1.2" opacity="0.85">
                  <line x1="86" y1="56" x2="86" y2="93" />
                  <line x1="160" y1="56" x2="160" y2="93" />
                  <line x1="234" y1="56" x2="234" y2="93" />
                </g>

                <circle cx="86" cy="47" r="2.5" fill="#F5B106"><animate attributeName="opacity" values="1;0.3;1" dur="1.8s" repeatCount="indefinite" /></circle>
                <circle cx="160" cy="47" r="2.5" fill="#F5B106"><animate attributeName="opacity" values="0.3;1;0.3" dur="1.8s" repeatCount="indefinite" /></circle>
                <circle cx="234" cy="47" r="2.5" fill="#F5B106"><animate attributeName="opacity" values="1;0.3;1" dur="1.8s" begin="0.6s" repeatCount="indefinite" /></circle>

                <circle r="2" fill="#FFD54F" opacity="0.95"><animateMotion dur="3s" repeatCount="indefinite" path="M 40 47 L 280 47" /></circle>
                <circle r="1.6" fill="#FFD54F" opacity="0.7"><animateMotion dur="3s" repeatCount="indefinite" begin="1s" path="M 40 47 L 280 47" /></circle>
              </svg>
              <div className="pio-grade" />
              <div className="pio-grain" />
            </div>
            <div className="pio-card">
              <div className="pio-ctop">
                <span className="pio-cstage">Stage 02 — Transform</span>
                <span className="pio-cdot"><i className="pio-on" /><i className="pio-on" /><i /></span>
              </div>
              <h3>HV Substation</h3>
              <div className="pio-cmeta">2N Redundant · Owned</div>
              <div className="pio-cbar" />
              <div className="pio-cspec"><span>Topology</span><b>2N · ON-SITE</b></div>
            </div>
          </div>

          <div className="pio-conn">
            <span className="pio-track" />
            <span className="pio-pulse" />
            <span className="pio-pulse" />
            <span className="pio-pulse" />
          </div>

          {/* 03 · DATA CENTER */}
          <div className="pio-stage">
            <div className="pio-box">
              <span className="pio-tag">03 / FACILITY</span>
              <span className="pio-status" />
              <svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice">
                <defs>
                  <linearGradient id="ground-s3" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1a1a1a" />
                    <stop offset="100%" stopColor="#050505" />
                  </linearGradient>
                  <linearGradient id="cab-s3" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#888" />
                    <stop offset="100%" stopColor="#1a1a1a" />
                  </linearGradient>
                  <linearGradient id="cabside-s3" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4a4a4a" />
                    <stop offset="100%" stopColor="#0a0a0a" />
                  </linearGradient>
                  <radialGradient id="ambient-s3">
                    <stop offset="0%" stopColor="#F5B106" stopOpacity="0.32" />
                    <stop offset="100%" stopColor="#F5B106" stopOpacity="0" />
                  </radialGradient>
                </defs>

                <ellipse cx="160" cy="180" rx="155" ry="22" fill="url(#ambient-s3)" />

                <g opacity="0.4">
                  <circle cx="50" cy="25" r="0.5" fill="#F5B106"><animate attributeName="opacity" values="0;1;0" dur="4s" repeatCount="indefinite" /></circle>
                  <circle cx="260" cy="32" r="0.5" fill="#F5B106"><animate attributeName="opacity" values="1;0;1" dur="3.2s" repeatCount="indefinite" /></circle>
                </g>

                <polygon points="15,175 305,175 315,195 5,195" fill="url(#ground-s3)" stroke="#2a2a2a" strokeWidth="0.5" />

                <line x1="15" y1="40" x2="305" y2="40" stroke="#A32D2D" strokeWidth="3.5" opacity="0.8" />
                <circle r="1.4" fill="#FF6B6B" opacity="0.9"><animateMotion dur="3.5s" repeatCount="indefinite" path="M 300 40 L 20 40" /></circle>
                <circle r="1.2" fill="#FF6B6B" opacity="0.7"><animateMotion dur="3.5s" repeatCount="indefinite" begin="1.2s" path="M 300 40 L 20 40" /></circle>

                <line x1="15" y1="46" x2="305" y2="46" stroke="#4FC3F7" strokeWidth="2.5" opacity="0.8" />
                <circle r="1.4" fill="#81D4FA" opacity="0.9"><animateMotion dur="3s" repeatCount="indefinite" path="M 20 46 L 300 46" /></circle>
                <circle r="1.2" fill="#81D4FA" opacity="0.7"><animateMotion dur="3s" repeatCount="indefinite" begin="1s" path="M 20 46 L 300 46" /></circle>

                <g stroke="#444" strokeWidth="0.5">
                  <line x1="50" y1="38" x2="50" y2="50" />
                  <line x1="150" y1="38" x2="150" y2="50" />
                  <line x1="250" y1="38" x2="250" y2="50" />
                </g>

                <g stroke="#555" strokeWidth="0.5" fill="none">
                  <line x1="15" y1="58" x2="305" y2="58" />
                  <line x1="15" y1="62" x2="305" y2="62" />
                </g>
                <circle r="1" fill="#1ED98A" opacity="0.9"><animateMotion dur="2.5s" repeatCount="indefinite" path="M 20 60 L 300 60" /></circle>
                <circle r="0.8" fill="#1ED98A" opacity="0.7"><animateMotion dur="2.5s" repeatCount="indefinite" begin="0.8s" path="M 20 60 L 300 60" /></circle>

                <g>
                  <polygon points="42,72 80,72 80,175 42,175" fill="url(#cab-s3)" stroke="#000" strokeWidth="0.5" />
                  <polygon points="80,72 88,65 88,168 80,175" fill="url(#cabside-s3)" stroke="#000" strokeWidth="0.4" />
                  <polygon points="42,72 50,65 88,65 80,72" fill="#5a5a5a" stroke="#000" strokeWidth="0.4" />
                  <rect x="46" y="80" width="30" height="14" fill="#0a0a0a" stroke="#3a3a3a" strokeWidth="0.3" />
                  <circle cx="50" cy="84" r="1" fill="#1ED98A"><animate attributeName="opacity" values="1;0.3;1" dur="1s" repeatCount="indefinite" /></circle>
                  <circle cx="54" cy="84" r="1" fill="#1ED98A" />
                  <circle cx="58" cy="84" r="1" fill="#F5B106" />
                  <rect x="48" y="88" width="26" height="2" fill="#F5B106" opacity="0.85" />
                  <rect x="48" y="91" width="20" height="2" fill="#1ED98A" opacity="0.75" />
                  <rect x="46" y="100" width="30" height="12" fill="#0a0a0a" />
                  <rect x="48" y="105" width="2" height="7" fill="#F5B106" />
                  <rect x="52" y="107" width="2" height="5" fill="#F5B106" />
                  <rect x="56" y="103" width="2" height="9" fill="#F5B106" />
                  <rect x="60" y="106" width="2" height="6" fill="#1ED98A" />
                  <rect x="64" y="104" width="2" height="8" fill="#1ED98A" />
                  <rect x="68" y="108" width="2" height="4" fill="#1ED98A" />
                  <rect x="72" y="105" width="2" height="7" fill="#1ED98A" />
                  <rect x="46" y="118" width="30" height="55" fill="#1a1a1a" stroke="#000" strokeWidth="0.3" />
                  <g stroke="#000" strokeWidth="0.3">
                    <line x1="46" y1="128" x2="76" y2="128" /><line x1="46" y1="138" x2="76" y2="138" />
                    <line x1="46" y1="148" x2="76" y2="148" /><line x1="46" y1="158" x2="76" y2="158" />
                    <line x1="46" y1="168" x2="76" y2="168" />
                  </g>
                </g>

                <g>
                  <polygon points="110,60 168,60 168,175 110,175" fill="url(#cab-s3)" stroke="#000" strokeWidth="0.5" />
                  <polygon points="168,60 178,52 178,168 168,175" fill="url(#cabside-s3)" stroke="#000" strokeWidth="0.4" />
                  <polygon points="110,60 120,52 178,52 168,60" fill="#5a5a5a" stroke="#000" strokeWidth="0.4" />
                  <rect x="116" y="70" width="46" height="26" fill="#0a0a0a" stroke="#4FC3F7" strokeWidth="0.5" />
                  <rect x="119" y="74" width="22" height="2.5" fill="#4FC3F7" />
                  <rect x="119" y="79" width="32" height="2" fill="#4FC3F7" opacity="0.7" />
                  <rect x="119" y="84" width="16" height="2" fill="#F5B106" />
                  <text x="151" y="91" textAnchor="middle" fontSize="5" fill="#1ED98A" fontFamily="monospace" fontWeight="700">99.982%</text>
                  <text x="151" y="95.5" textAnchor="middle" fontSize="3" fill="#1ED98A" fontFamily="monospace" opacity="0.7">UPTIME</text>
                  <rect x="116" y="100" width="46" height="4" fill="#1a1a1a" />
                  <rect x="117" y="101" width="7" height="2" fill="#1ED98A"><animate attributeName="opacity" values="1;0.3;1" dur="1.2s" repeatCount="indefinite" /></rect>
                  <rect x="125" y="101" width="7" height="2" fill="#1ED98A" />
                  <rect x="133" y="101" width="7" height="2" fill="#F5B106" />
                  <rect x="141" y="101" width="7" height="2" fill="#1ED98A" />
                  <rect x="149" y="101" width="7" height="2" fill="#1ED98A" />
                  <rect x="116" y="108" width="46" height="14" fill="#0a0a0a" />
                  <rect x="118" y="114" width="3" height="7" fill="#F5B106" />
                  <rect x="123" y="111" width="3" height="10" fill="#F5B106" />
                  <rect x="128" y="113" width="3" height="8" fill="#F5B106" />
                  <rect x="133" y="110" width="3" height="11" fill="#1ED98A" />
                  <rect x="138" y="112" width="3" height="9" fill="#1ED98A" />
                  <rect x="143" y="114" width="3" height="7" fill="#1ED98A" />
                  <rect x="148" y="111" width="3" height="10" fill="#1ED98A" />
                  <rect x="153" y="113" width="3" height="8" fill="#1ED98A" />
                  <rect x="158" y="115" width="3" height="6" fill="#1ED98A" />
                  <rect x="116" y="128" width="46" height="45" fill="#1a1a1a" stroke="#000" strokeWidth="0.3" />
                  <g stroke="#000" strokeWidth="0.3">
                    <line x1="116" y1="138" x2="162" y2="138" /><line x1="116" y1="148" x2="162" y2="148" />
                    <line x1="116" y1="158" x2="162" y2="158" /><line x1="116" y1="168" x2="162" y2="168" />
                  </g>
                </g>

                <g>
                  <polygon points="200,72 238,72 238,175 200,175" fill="url(#cab-s3)" stroke="#000" strokeWidth="0.5" />
                  <polygon points="238,72 246,65 246,168 238,175" fill="url(#cabside-s3)" stroke="#000" strokeWidth="0.4" />
                  <polygon points="200,72 208,65 246,65 238,72" fill="#5a5a5a" stroke="#000" strokeWidth="0.4" />
                  <rect x="204" y="80" width="30" height="14" fill="#0a0a0a" stroke="#3a3a3a" strokeWidth="0.3" />
                  <circle cx="208" cy="84" r="1" fill="#1ED98A" />
                  <circle cx="212" cy="84" r="1" fill="#F5B106"><animate attributeName="opacity" values="0.3;1;0.3" dur="0.8s" repeatCount="indefinite" /></circle>
                  <circle cx="216" cy="84" r="1" fill="#1ED98A" />
                  <rect x="206" y="88" width="26" height="2" fill="#F5B106" opacity="0.85" />
                  <rect x="206" y="91" width="22" height="2" fill="#1ED98A" opacity="0.75" />
                  <rect x="204" y="100" width="30" height="12" fill="#0a0a0a" />
                  <rect x="206" y="105" width="2" height="7" fill="#F5B106" />
                  <rect x="210" y="107" width="2" height="5" fill="#F5B106" />
                  <rect x="214" y="103" width="2" height="9" fill="#1ED98A" />
                  <rect x="218" y="106" width="2" height="6" fill="#1ED98A" />
                  <rect x="222" y="104" width="2" height="8" fill="#1ED98A" />
                  <rect x="226" y="108" width="2" height="4" fill="#1ED98A" />
                  <rect x="230" y="105" width="2" height="7" fill="#1ED98A" />
                  <rect x="204" y="118" width="30" height="55" fill="#1a1a1a" stroke="#000" strokeWidth="0.3" />
                  <g stroke="#000" strokeWidth="0.3">
                    <line x1="204" y1="128" x2="234" y2="128" /><line x1="204" y1="138" x2="234" y2="138" />
                    <line x1="204" y1="148" x2="234" y2="148" /><line x1="204" y1="158" x2="234" y2="158" />
                    <line x1="204" y1="168" x2="234" y2="168" />
                  </g>
                </g>

                <g>
                  <rect x="266" y="125" width="10" height="42" rx="2" fill="#A32D2D" stroke="#501313" strokeWidth="0.3" />
                  <rect x="267" y="121" width="8" height="6" fill="#1a1a1a" />
                  <rect x="265" y="128" width="12" height="2.5" fill="#F5B106" />
                  <text x="271" y="150" textAnchor="middle" fontSize="3.5" fill="#fff" fontWeight="700">FM200</text>
                </g>
              </svg>
              <div className="pio-grade" />
              <div className="pio-grain" />
            </div>
            <div className="pio-card">
              <div className="pio-ctop">
                <span className="pio-cstage">Stage 03 — Facility</span>
                <span className="pio-cdot"><i className="pio-on" /><i className="pio-on" /><i className="pio-on" /></span>
              </div>
              <h3>Data Center</h3>
              <div className="pio-cmeta">Tier III · TIA-942</div>
              <div className="pio-cbar" />
              <div className="pio-cspec"><span>Uptime</span><b>99.982%</b></div>
            </div>
          </div>

          <div className="pio-conn">
            <span className="pio-track" />
            <span className="pio-pulse" />
            <span className="pio-pulse" />
            <span className="pio-pulse" />
          </div>

          {/* 04 · GPU CLUSTER */}
          <div className="pio-stage">
            <div className="pio-box">
              <span className="pio-tag">04 / COMPUTE</span>
              <span className="pio-status" />
              <svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice">
                <defs>
                  <linearGradient id="ground-s4" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1a1a1a" />
                    <stop offset="100%" stopColor="#050505" />
                  </linearGradient>
                  <linearGradient id="rack-s4" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#5a5a5a" />
                    <stop offset="50%" stopColor="#2a2a2a" />
                    <stop offset="100%" stopColor="#0a0a0a" />
                  </linearGradient>
                  <linearGradient id="rackside-s4" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3a3a3a" />
                    <stop offset="100%" stopColor="#050505" />
                  </linearGradient>
                  <radialGradient id="ambient-s4">
                    <stop offset="0%" stopColor="#4FC3F7" stopOpacity="0.32" />
                    <stop offset="100%" stopColor="#4FC3F7" stopOpacity="0" />
                  </radialGradient>
                </defs>

                <ellipse cx="160" cy="180" rx="155" ry="22" fill="url(#ambient-s4)" />

                <g opacity="0.4">
                  <circle cx="50" cy="25" r="0.5" fill="#4FC3F7"><animate attributeName="opacity" values="0;1;0" dur="4s" repeatCount="indefinite" /></circle>
                  <circle cx="270" cy="30" r="0.5" fill="#4FC3F7"><animate attributeName="opacity" values="1;0;1" dur="3.2s" repeatCount="indefinite" /></circle>
                </g>

                <polygon points="15,175 305,175 315,195 5,195" fill="url(#ground-s4)" stroke="#2a2a2a" strokeWidth="0.5" />

                <g>
                  <line x1="15" y1="38" x2="305" y2="38" stroke="#444" strokeWidth="0.5" />
                  <line x1="15" y1="54" x2="305" y2="54" stroke="#444" strokeWidth="0.5" />
                  <line x1="15" y1="42" x2="305" y2="42" stroke="#4FC3F7" strokeWidth="1.4" opacity="0.9" />
                  <line x1="15" y1="46" x2="305" y2="46" stroke="#4FC3F7" strokeWidth="1.4" opacity="0.7" />
                  <line x1="15" y1="50" x2="305" y2="50" stroke="#F5B106" strokeWidth="1.2" opacity="0.85" />
                </g>

                <circle r="1.6" fill="#4FC3F7"><animateMotion dur="2.5s" repeatCount="indefinite" path="M 20 42 L 300 42" /></circle>
                <circle r="1.4" fill="#4FC3F7" opacity="0.7"><animateMotion dur="2.5s" repeatCount="indefinite" begin="0.8s" path="M 20 42 L 300 42" /></circle>
                <circle r="1.2" fill="#4FC3F7" opacity="0.5"><animateMotion dur="2.5s" repeatCount="indefinite" begin="1.6s" path="M 20 42 L 300 42" /></circle>
                <circle r="1.4" fill="#81D4FA" opacity="0.8"><animateMotion dur="2.8s" repeatCount="indefinite" path="M 300 46 L 20 46" /></circle>
                <circle r="1.2" fill="#81D4FA" opacity="0.6"><animateMotion dur="2.8s" repeatCount="indefinite" begin="1.4s" path="M 300 46 L 20 46" /></circle>
                <circle r="1.3" fill="#FFD54F" opacity="0.9"><animateMotion dur="3s" repeatCount="indefinite" path="M 20 50 L 300 50" /></circle>
                <circle r="1.1" fill="#FFD54F" opacity="0.6"><animateMotion dur="3s" repeatCount="indefinite" begin="1s" path="M 20 50 L 300 50" /></circle>

                <g stroke="#4FC3F7" strokeWidth="0.9" opacity="0.7">
                  <path d="M 58 54 Q 58 62 58 70" />
                  <path d="M 108 54 Q 108 62 108 70" />
                  <path d="M 158 54 Q 158 62 158 70" />
                  <path d="M 208 54 Q 208 62 208 70" />
                  <path d="M 258 54 Q 258 62 258 70" />
                </g>

                <circle r="1.2" fill="#FFFFFF" opacity="0.9"><animateMotion dur="1.5s" repeatCount="indefinite" path="M 58 54 L 58 90" /></circle>
                <circle r="1.2" fill="#FFFFFF" opacity="0.9"><animateMotion dur="1.5s" repeatCount="indefinite" begin="0.3s" path="M 108 54 L 108 90" /></circle>
                <circle r="1.2" fill="#FFFFFF" opacity="0.9"><animateMotion dur="1.5s" repeatCount="indefinite" begin="0.6s" path="M 158 54 L 158 90" /></circle>
                <circle r="1.2" fill="#FFFFFF" opacity="0.9"><animateMotion dur="1.5s" repeatCount="indefinite" begin="0.9s" path="M 208 54 L 208 90" /></circle>
                <circle r="1.2" fill="#FFFFFF" opacity="0.9"><animateMotion dur="1.5s" repeatCount="indefinite" begin="1.2s" path="M 258 54 L 258 90" /></circle>

                <g>
                  <polygon points="40,70 76,70 76,175 40,175" fill="url(#rack-s4)" stroke="#000" strokeWidth="0.5" />
                  <polygon points="76,70 82,65 82,170 76,175" fill="url(#rackside-s4)" stroke="#000" strokeWidth="0.4" />
                  <polygon points="40,70 46,65 82,65 76,70" fill="#4a4a4a" stroke="#000" strokeWidth="0.4" />
                </g>
                <g>
                  <polygon points="90,70 126,70 126,175 90,175" fill="url(#rack-s4)" stroke="#000" strokeWidth="0.5" />
                  <polygon points="126,70 132,65 132,170 126,175" fill="url(#rackside-s4)" stroke="#000" strokeWidth="0.4" />
                  <polygon points="90,70 96,65 132,65 126,70" fill="#4a4a4a" stroke="#000" strokeWidth="0.4" />
                </g>
                <g>
                  <polygon points="140,70 176,70 176,175 140,175" fill="url(#rack-s4)" stroke="#000" strokeWidth="0.5" />
                  <polygon points="176,70 182,65 182,170 176,175" fill="url(#rackside-s4)" stroke="#000" strokeWidth="0.4" />
                  <polygon points="140,70 146,65 182,65 176,70" fill="#4a4a4a" stroke="#000" strokeWidth="0.4" />
                </g>
                <g>
                  <polygon points="190,70 226,70 226,175 190,175" fill="url(#rack-s4)" stroke="#000" strokeWidth="0.5" />
                  <polygon points="226,70 232,65 232,170 226,175" fill="url(#rackside-s4)" stroke="#000" strokeWidth="0.4" />
                  <polygon points="190,70 196,65 232,65 226,70" fill="#4a4a4a" stroke="#000" strokeWidth="0.4" />
                </g>
                <g>
                  <polygon points="240,70 276,70 276,175 240,175" fill="url(#rack-s4)" stroke="#000" strokeWidth="0.5" />
                  <polygon points="276,70 282,65 282,170 276,175" fill="url(#rackside-s4)" stroke="#000" strokeWidth="0.4" />
                  <polygon points="240,70 246,65 282,65 276,70" fill="#4a4a4a" stroke="#000" strokeWidth="0.4" />
                </g>

                <g id="r1-s4">
                  <rect x="42" y="76" width="32" height="6" fill="#0a0a0a" stroke="#2a2a2a" strokeWidth="0.2" />
                  <circle cx="45" cy="79" r="0.7" fill="#1ED98A"><animate attributeName="opacity" values="1;0.3;1" dur="0.7s" repeatCount="indefinite" /></circle>
                  <circle cx="48" cy="79" r="0.7" fill="#1ED98A" />
                  <rect x="51" y="78.5" width="20" height="1.3" fill="#4FC3F7" opacity="0.7" />
                  <rect x="42" y="83" width="32" height="6" fill="#0a0a0a" />
                  <circle cx="45" cy="86" r="0.7" fill="#1ED98A" />
                  <rect x="51" y="85.5" width="16" height="1.3" fill="#F5B106" opacity="0.7" />
                  <rect x="42" y="90" width="32" height="6" fill="#0a0a0a" />
                  <circle cx="45" cy="93" r="0.7" fill="#1ED98A"><animate attributeName="opacity" values="0.3;1;0.3" dur="0.9s" repeatCount="indefinite" /></circle>
                  <rect x="51" y="92.5" width="18" height="1.3" fill="#4FC3F7" opacity="0.7" />
                  <rect x="42" y="97" width="32" height="6" fill="#0a0a0a" />
                  <rect x="51" y="100" width="17" height="1.3" fill="#4FC3F7" opacity="0.7" />
                  <rect x="42" y="104" width="32" height="6" fill="#0a0a0a" />
                  <circle cx="45" cy="107" r="0.7" fill="#1ED98A" />
                  <rect x="51" y="106.5" width="20" height="1.3" fill="#4FC3F7" opacity="0.7" />
                  <rect x="42" y="111" width="32" height="6" fill="#0a0a0a" />
                  <rect x="51" y="114" width="15" height="1.3" fill="#4FC3F7" opacity="0.7" />
                  <rect x="42" y="118" width="32" height="6" fill="#0a0a0a" />
                  <circle cx="45" cy="121" r="0.7" fill="#F5B106" />
                  <rect x="51" y="120.5" width="19" height="1.3" fill="#4FC3F7" opacity="0.7" />
                  <rect x="42" y="125" width="32" height="6" fill="#0a0a0a" />
                  <rect x="51" y="128" width="16" height="1.3" fill="#4FC3F7" opacity="0.7" />
                  <rect x="42" y="132" width="32" height="6" fill="#0a0a0a" />
                  <circle cx="45" cy="135" r="0.7" fill="#1ED98A"><animate attributeName="opacity" values="1;0.3;1" dur="0.6s" repeatCount="indefinite" /></circle>
                  <rect x="51" y="134.5" width="18" height="1.3" fill="#4FC3F7" opacity="0.7" />
                  <rect x="42" y="139" width="32" height="6" fill="#0a0a0a" />
                  <rect x="51" y="142" width="17" height="1.3" fill="#4FC3F7" opacity="0.7" />
                  <rect x="42" y="146" width="32" height="6" fill="#0a0a0a" />
                  <rect x="51" y="149" width="16" height="1.3" fill="#4FC3F7" opacity="0.7" />
                  <rect x="42" y="153" width="32" height="6" fill="#0a0a0a" />
                  <circle cx="45" cy="156" r="0.7" fill="#1ED98A" />
                  <rect x="51" y="155.5" width="20" height="1.3" fill="#4FC3F7" opacity="0.7" />
                  <rect x="42" y="160" width="32" height="6" fill="#0a0a0a" />
                  <rect x="51" y="163" width="17" height="1.3" fill="#4FC3F7" opacity="0.7" />
                </g>
                <use href="#r1-s4" transform="translate(50, 0)" />
                <use href="#r1-s4" transform="translate(100, 0)" />
                <use href="#r1-s4" transform="translate(150, 0)" />
                <use href="#r1-s4" transform="translate(200, 0)" />

                <g opacity="0.5">
                  <circle r="0.6" fill="#FF6B6B"><animate attributeName="opacity" values="0;0.7;0" dur="2s" repeatCount="indefinite" /><animateMotion dur="2s" repeatCount="indefinite" path="M 58 75 L 58 60" /></circle>
                  <circle r="0.6" fill="#FF6B6B"><animate attributeName="opacity" values="0;0.7;0" dur="2.2s" repeatCount="indefinite" begin="0.5s" /><animateMotion dur="2.2s" repeatCount="indefinite" begin="0.5s" path="M 158 75 L 158 60" /></circle>
                  <circle r="0.6" fill="#FF6B6B"><animate attributeName="opacity" values="0;0.7;0" dur="1.9s" repeatCount="indefinite" begin="1s" /><animateMotion dur="1.9s" repeatCount="indefinite" begin="1s" path="M 258 75 L 258 60" /></circle>
                </g>
              </svg>
              <div className="pio-grade" />
              <div className="pio-grain" />
            </div>
            <div className="pio-card">
              <div className="pio-ctop">
                <span className="pio-cstage">Stage 04 — Compute</span>
                <span className="pio-cdot"><i className="pio-on" /><i className="pio-on" /><i className="pio-on" /></span>
              </div>
              <h3>GPU Cluster</h3>
              <div className="pio-cmeta">NVIDIA Blackwell B200</div>
              <div className="pio-cbar" />
              <div className="pio-cspec"><span>Fabric</span><b>NVLINK</b></div>
            </div>
          </div>

          <div className="pio-conn pio-to-green">
            <span className="pio-track" />
            <span className="pio-pulse" />
            <span className="pio-pulse" />
            <span className="pio-pulse" />
          </div>

          {/* 05 · NEOCLOUDZ */}
          <div className="pio-stage pio-out">
            <div className="pio-box">
              <span className="pio-tag">05 / DELIVERY</span>
              <span className="pio-status" />
              <svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice">
                <defs>
                  <radialGradient id="ambient-s5">
                    <stop offset="0%" stopColor="#1ED98A" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#1ED98A" stopOpacity="0" />
                  </radialGradient>
                  <radialGradient id="coreNucleus-s5">
                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
                    <stop offset="40%" stopColor="#54f0ac" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#1ED98A" stopOpacity="0" />
                  </radialGradient>
                  <radialGradient id="haloGlow-s5">
                    <stop offset="0%" stopColor="#1ED98A" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#1ED98A" stopOpacity="0" />
                  </radialGradient>
                  <linearGradient id="ground-s5" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1a1a1a" />
                    <stop offset="100%" stopColor="#050505" />
                  </linearGradient>
                </defs>

                <ellipse cx="160" cy="180" rx="155" ry="26" fill="url(#ambient-s5)" />

                <g>
                  <circle cx="40" cy="35" r="0.5" fill="#1ED98A"><animate attributeName="opacity" values="0;1;0" dur="3s" repeatCount="indefinite" /></circle>
                  <circle cx="280" cy="50" r="0.5" fill="#1ED98A"><animate attributeName="opacity" values="1;0;1" dur="2.5s" repeatCount="indefinite" /></circle>
                  <circle cx="60" cy="70" r="0.4" fill="#1ED98A"><animate attributeName="opacity" values="0;0.8;0" dur="4s" repeatCount="indefinite" /></circle>
                  <circle cx="260" cy="90" r="0.4" fill="#1ED98A"><animate attributeName="opacity" values="0.8;0;0.8" dur="3.5s" repeatCount="indefinite" /></circle>
                  <circle cx="25" cy="105" r="0.4" fill="#1ED98A"><animate attributeName="opacity" values="0;1;0" dur="2.8s" repeatCount="indefinite" /></circle>
                  <circle cx="295" cy="120" r="0.4" fill="#1ED98A"><animate attributeName="opacity" values="1;0;1" dur="3.2s" repeatCount="indefinite" /></circle>
                  <circle cx="100" cy="40" r="0.4" fill="#1ED98A"><animate attributeName="opacity" values="0;1;0" dur="4.2s" repeatCount="indefinite" /></circle>
                  <circle cx="220" cy="38" r="0.4" fill="#1ED98A"><animate attributeName="opacity" values="1;0;1" dur="3.8s" repeatCount="indefinite" /></circle>
                </g>

                <polygon points="15,175 305,175 315,195 5,195" fill="url(#ground-s5)" stroke="#2a2a2a" strokeWidth="0.5" />

                <g fill="none" stroke="#1ED98A" strokeWidth="0.6">
                  <circle cx="160" cy="92" r="20" opacity="0.6">
                    <animate attributeName="r" values="20;65;20" dur="4s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.7;0;0.7" dur="4s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="160" cy="92" r="20" opacity="0.5">
                    <animate attributeName="r" values="20;65;20" dur="4s" begin="1.3s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.5;0;0.5" dur="4s" begin="1.3s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="160" cy="92" r="20" opacity="0.4">
                    <animate attributeName="r" values="20;65;20" dur="4s" begin="2.6s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.4;0;0.4" dur="4s" begin="2.6s" repeatCount="indefinite" />
                  </circle>
                </g>

                <circle cx="160" cy="92" r="38" fill="url(#haloGlow-s5)" opacity="0.5">
                  <animate attributeName="r" values="36;44;36" dur="3s" repeatCount="indefinite" />
                </circle>

                <g>
                  <g fill="none" stroke="#1ED98A" strokeWidth="0.5" opacity="0.9">
                    <ellipse cx="160" cy="92" rx="26" ry="4" opacity="0.4" />
                    <ellipse cx="160" cy="92" rx="26" ry="10" opacity="0.5" />
                    <ellipse cx="160" cy="92" rx="26" ry="16" opacity="0.6" />
                    <ellipse cx="160" cy="92" rx="26" ry="22" opacity="0.7" />
                    <ellipse cx="160" cy="92" rx="26" ry="26" opacity="0.9" />
                    <ellipse cx="160" cy="92" rx="4" ry="26" opacity="0.4" />
                    <ellipse cx="160" cy="92" rx="10" ry="26" opacity="0.5" />
                    <ellipse cx="160" cy="92" rx="16" ry="26" opacity="0.6" />
                    <ellipse cx="160" cy="92" rx="22" ry="26" opacity="0.7" />
                  </g>

                  <g>
                    <animateTransform attributeName="transform" type="rotate" from="0 160 92" to="360 160 92" dur="20s" repeatCount="indefinite" />
                    <ellipse cx="160" cy="92" rx="28" ry="9" fill="none" stroke="#1ED98A" strokeWidth="0.8" opacity="0.8" />
                    <circle cx="188" cy="92" r="1.4" fill="#1ED98A" />
                    <circle cx="132" cy="92" r="1.4" fill="#1ED98A" />
                  </g>
                  <g>
                    <animateTransform attributeName="transform" type="rotate" from="60 160 92" to="420 160 92" dur="15s" repeatCount="indefinite" />
                    <ellipse cx="160" cy="92" rx="9" ry="28" fill="none" stroke="#1ED98A" strokeWidth="0.8" opacity="0.7" />
                    <circle cx="160" cy="120" r="1.4" fill="#1ED98A" />
                    <circle cx="160" cy="64" r="1.4" fill="#1ED98A" />
                  </g>
                  <g>
                    <animateTransform attributeName="transform" type="rotate" from="30 160 92" to="-330 160 92" dur="18s" repeatCount="indefinite" />
                    <ellipse cx="160" cy="92" rx="26" ry="13" fill="none" stroke="#54f0ac" strokeWidth="0.7" opacity="0.6" />
                  </g>

                  <circle cx="160" cy="92" r="12" fill="url(#coreNucleus-s5)">
                    <animate attributeName="r" values="10;13;10" dur="2s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="160" cy="92" r="4" fill="#FFFFFF">
                    <animate attributeName="opacity" values="1;0.6;1" dur="1.2s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="160" cy="92" r="2" fill="#FFFFFF">
                    <animate attributeName="opacity" values="1;0.3;1" dur="0.6s" repeatCount="indefinite" />
                  </circle>
                </g>

                <g>
                  <animateTransform attributeName="transform" type="rotate" from="0 160 92" to="360 160 92" dur="8s" repeatCount="indefinite" />
                  <circle cx="195" cy="92" r="1.6" fill="#1ED98A" />
                  <circle cx="195" cy="92" r="3" fill="#1ED98A" opacity="0.3" />
                </g>
                <g>
                  <animateTransform attributeName="transform" type="rotate" from="120 160 92" to="480 160 92" dur="10s" repeatCount="indefinite" />
                  <circle cx="190" cy="92" r="1.4" fill="#54f0ac" />
                  <circle cx="190" cy="92" r="2.6" fill="#54f0ac" opacity="0.3" />
                </g>
                <g>
                  <animateTransform attributeName="transform" type="rotate" from="240 160 92" to="600 160 92" dur="12s" repeatCount="indefinite" />
                  <circle cx="200" cy="92" r="1.4" fill="#1ED98A" />
                  <circle cx="200" cy="92" r="2.6" fill="#1ED98A" opacity="0.3" />
                </g>

                <g>
                  <rect x="40" y="142" width="20" height="32" fill="#2a2a2a" stroke="#000" strokeWidth="0.4" />
                  <rect x="42" y="145" width="16" height="3" fill="#0a0a0a" />
                  <circle cx="44" cy="146.5" r="0.6" fill="#1ED98A"><animate attributeName="opacity" values="0;1;0" dur="3s" repeatCount="indefinite" /></circle>
                  <rect x="42" y="150" width="16" height="3" fill="#0a0a0a" />
                  <circle cx="44" cy="151.5" r="0.6" fill="#1ED98A"><animate attributeName="opacity" values="0;1;0" dur="3s" begin="0.2s" repeatCount="indefinite" /></circle>
                  <rect x="42" y="155" width="16" height="3" fill="#0a0a0a" />
                  <circle cx="44" cy="156.5" r="0.6" fill="#1ED98A"><animate attributeName="opacity" values="0;1;0" dur="3s" begin="0.4s" repeatCount="indefinite" /></circle>
                  <rect x="42" y="160" width="16" height="3" fill="#0a0a0a" />
                  <rect x="42" y="165" width="16" height="3" fill="#0a0a0a" />
                  <rect x="42" y="170" width="16" height="3" fill="#0a0a0a" />
                  <text x="50" y="140" textAnchor="middle" fontSize="3.2" fill="#1ED98A" fontFamily="monospace">N-01</text>

                  <rect x="78" y="142" width="20" height="32" fill="#2a2a2a" stroke="#000" strokeWidth="0.4" />
                  <rect x="80" y="145" width="16" height="3" fill="#0a0a0a" />
                  <circle cx="82" cy="146.5" r="0.6" fill="#1ED98A"><animate attributeName="opacity" values="0;1;0" dur="3s" begin="0.4s" repeatCount="indefinite" /></circle>
                  <rect x="80" y="150" width="16" height="3" fill="#0a0a0a" />
                  <circle cx="82" cy="151.5" r="0.6" fill="#1ED98A"><animate attributeName="opacity" values="0;1;0" dur="3s" begin="0.6s" repeatCount="indefinite" /></circle>
                  <rect x="80" y="155" width="16" height="3" fill="#0a0a0a" />
                  <rect x="80" y="160" width="16" height="3" fill="#0a0a0a" />
                  <rect x="80" y="165" width="16" height="3" fill="#0a0a0a" />
                  <rect x="80" y="170" width="16" height="3" fill="#0a0a0a" />
                  <text x="88" y="140" textAnchor="middle" fontSize="3.2" fill="#1ED98A" fontFamily="monospace">N-02</text>

                  <rect x="116" y="142" width="20" height="32" fill="#2a2a2a" stroke="#000" strokeWidth="0.4" />
                  <rect x="118" y="145" width="16" height="3" fill="#0a0a0a" />
                  <circle cx="120" cy="146.5" r="0.6" fill="#1ED98A"><animate attributeName="opacity" values="0;1;0" dur="3s" begin="0.8s" repeatCount="indefinite" /></circle>
                  <rect x="118" y="150" width="16" height="3" fill="#0a0a0a" />
                  <rect x="118" y="155" width="16" height="3" fill="#0a0a0a" />
                  <rect x="118" y="160" width="16" height="3" fill="#0a0a0a" />
                  <rect x="118" y="165" width="16" height="3" fill="#0a0a0a" />
                  <rect x="118" y="170" width="16" height="3" fill="#0a0a0a" />
                  <text x="126" y="140" textAnchor="middle" fontSize="3.2" fill="#1ED98A" fontFamily="monospace">N-03</text>

                  <rect x="184" y="142" width="20" height="32" fill="#2a2a2a" stroke="#000" strokeWidth="0.4" />
                  <rect x="186" y="145" width="16" height="3" fill="#0a0a0a" />
                  <circle cx="188" cy="146.5" r="0.6" fill="#1ED98A"><animate attributeName="opacity" values="0;1;0" dur="3s" begin="1.0s" repeatCount="indefinite" /></circle>
                  <rect x="186" y="150" width="16" height="3" fill="#0a0a0a" />
                  <circle cx="188" cy="151.5" r="0.6" fill="#1ED98A"><animate attributeName="opacity" values="0;1;0" dur="3s" begin="1.2s" repeatCount="indefinite" /></circle>
                  <rect x="186" y="155" width="16" height="3" fill="#0a0a0a" />
                  <rect x="186" y="160" width="16" height="3" fill="#0a0a0a" />
                  <rect x="186" y="165" width="16" height="3" fill="#0a0a0a" />
                  <rect x="186" y="170" width="16" height="3" fill="#0a0a0a" />
                  <text x="194" y="140" textAnchor="middle" fontSize="3.2" fill="#1ED98A" fontFamily="monospace">N-04</text>

                  <rect x="222" y="142" width="20" height="32" fill="#2a2a2a" stroke="#000" strokeWidth="0.4" />
                  <rect x="224" y="145" width="16" height="3" fill="#0a0a0a" />
                  <circle cx="226" cy="146.5" r="0.6" fill="#1ED98A"><animate attributeName="opacity" values="0;1;0" dur="3s" begin="1.4s" repeatCount="indefinite" /></circle>
                  <rect x="224" y="150" width="16" height="3" fill="#0a0a0a" />
                  <circle cx="226" cy="151.5" r="0.6" fill="#1ED98A"><animate attributeName="opacity" values="0;1;0" dur="3s" begin="1.6s" repeatCount="indefinite" /></circle>
                  <rect x="224" y="155" width="16" height="3" fill="#0a0a0a" />
                  <rect x="224" y="160" width="16" height="3" fill="#0a0a0a" />
                  <rect x="224" y="165" width="16" height="3" fill="#0a0a0a" />
                  <rect x="224" y="170" width="16" height="3" fill="#0a0a0a" />
                  <text x="232" y="140" textAnchor="middle" fontSize="3.2" fill="#1ED98A" fontFamily="monospace">N-05</text>

                  <rect x="260" y="142" width="20" height="32" fill="#2a2a2a" stroke="#000" strokeWidth="0.4" />
                  <rect x="262" y="145" width="16" height="3" fill="#0a0a0a" />
                  <circle cx="264" cy="146.5" r="0.6" fill="#1ED98A"><animate attributeName="opacity" values="0;1;0" dur="3s" begin="1.8s" repeatCount="indefinite" /></circle>
                  <rect x="262" y="150" width="16" height="3" fill="#0a0a0a" />
                  <rect x="262" y="155" width="16" height="3" fill="#0a0a0a" />
                  <rect x="262" y="160" width="16" height="3" fill="#0a0a0a" />
                  <rect x="262" y="165" width="16" height="3" fill="#0a0a0a" />
                  <rect x="262" y="170" width="16" height="3" fill="#0a0a0a" />
                  <text x="270" y="140" textAnchor="middle" fontSize="3.2" fill="#1ED98A" fontFamily="monospace">N-06</text>
                </g>

                <g stroke="#1ED98A" strokeWidth="0.5" fill="none" opacity="0.5">
                  <path d="M 145 110 Q 100 130 50 142"><animate attributeName="opacity" values="0.2;0.8;0.2" dur="2s" repeatCount="indefinite" /></path>
                  <path d="M 150 115 Q 120 135 88 142"><animate attributeName="opacity" values="0.8;0.2;0.8" dur="2.2s" repeatCount="indefinite" /></path>
                  <path d="M 155 118 Q 140 135 126 142"><animate attributeName="opacity" values="0.2;0.8;0.2" dur="1.8s" repeatCount="indefinite" /></path>
                  <path d="M 165 118 Q 180 135 194 142"><animate attributeName="opacity" values="0.8;0.2;0.8" dur="2.1s" repeatCount="indefinite" /></path>
                  <path d="M 170 115 Q 200 135 232 142"><animate attributeName="opacity" values="0.2;0.8;0.2" dur="2.3s" repeatCount="indefinite" /></path>
                  <path d="M 175 110 Q 220 130 270 142"><animate attributeName="opacity" values="0.8;0.2;0.8" dur="2.5s" repeatCount="indefinite" /></path>
                </g>

                <circle r="1.6" fill="#FFFFFF" opacity="0.95"><animateMotion dur="2s" repeatCount="indefinite" path="M 160 92 Q 100 130 50 148" /></circle>
                <circle r="1.6" fill="#FFFFFF" opacity="0.95"><animateMotion dur="2.2s" repeatCount="indefinite" begin="0.3s" path="M 160 92 Q 120 135 88 148" /></circle>
                <circle r="1.6" fill="#FFFFFF" opacity="0.95"><animateMotion dur="1.8s" repeatCount="indefinite" begin="0.6s" path="M 160 92 Q 140 135 126 148" /></circle>
                <circle r="1.6" fill="#FFFFFF" opacity="0.95"><animateMotion dur="2.1s" repeatCount="indefinite" begin="0.9s" path="M 160 92 Q 180 135 194 148" /></circle>
                <circle r="1.6" fill="#FFFFFF" opacity="0.95"><animateMotion dur="2.3s" repeatCount="indefinite" begin="1.2s" path="M 160 92 Q 200 135 232 148" /></circle>
                <circle r="1.6" fill="#FFFFFF" opacity="0.95"><animateMotion dur="2.5s" repeatCount="indefinite" begin="1.5s" path="M 160 92 Q 220 130 270 148" /></circle>
              </svg>
              <div className="pio-grade" />
              <div className="pio-grain" />
            </div>
            <div className="pio-card">
              <div className="pio-ctop">
                <span className="pio-cstage">Output — Delivery</span>
                <span className="pio-cdot"><i className="pio-on" /><i className="pio-on" /><i className="pio-on" /></span>
              </div>
              <h3>NeoCloudz</h3>
              <div className="pio-cmeta">Bare Metal · &lt;60s Provision</div>
              <div className="pio-cbar" />
              <div className="pio-cspec"><span>Provision</span><b>&lt; 60 SEC</b></div>
            </div>
          </div>
        </div>

        <div className="pio-footer-note">
          One Continuous Stack — <b>From Power</b> to <b>Provisioned Compute</b>
        </div>
      </div>

      <div className="pio-ctl">
        Flow Speed
        <input
          type="range"
          min={2}
          max={12}
          step={0.5}
          value={speed}
          onChange={(e) => setSpeed(parseFloat(e.target.value))}
        />
      </div>
    </section>
  );
};

export default PowerInIntelligenceOut;
