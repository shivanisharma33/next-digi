import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import logoImg from '../assets/Digi new color logo.png';

const Footer = () => {
  return (
    <footer className="bg-[#050505] pt-10 pb-8 px-4 md:px-8 border-t border-white/5 relative overflow-hidden">
      <div className="max-w-[1800px] mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 lg:gap-24 mb-24">
          
          {/* Brand Column */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <div className="mb-8">
                <img src={logoImg} alt="DigiPowerX Logo" className="h-20 md:h-16 w-auto brightness-0 invert opacity-90" />
              </div>
              
              <p className="text-white/50 text-[15px] leading-relaxed mb-8 max-w-sm">
                DigiPowerX is an innovative energy infrastructure company that develops cutting-edge data centers to drive the expansion of sustainable energy assets.
              </p>
              
              <div className="mb-10">
                <a href="mailto:ir@digipowerx.com" className="text-white hover:text-[#f5c518] font-medium text-[15px] transition-colors flex items-center gap-3">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  ir@digipowerx.com
                </a>
              </div>

              <div className="flex gap-4">
                 {/* Social Icons */}
                 <a href="https://x.com/DigipowerX" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-white/30 transition-all duration-300">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                  </svg>
                </a>
                <a href="https://www.linkedin.com/company/digi-power-x/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-white/30 transition-all duration-300">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <a href="https://www.facebook.com/DigiPowerX/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-white/30 transition-all duration-300">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a href="https://www.instagram.com/digipowerx/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-white/30 transition-all duration-300">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </a>
                <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-white/30 transition-all duration-300">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12">
            <div>
              <h4 className="text-[11px] font-bold tracking-[0.1em] uppercase text-white mb-6">Company</h4>
              <ul className="space-y-3 text-[14px] font-medium text-white/50">
                <li><Link to="/" className="hover:text-[#f5c518] transition-colors">Home</Link></li>
                <li><Link to="/investors" className="hover:text-[#f5c518] transition-colors">Investor Relations</Link></li>
                <li><Link to="/press-release" className="hover:text-[#f5c518] transition-colors">Press Release</Link></li>
                <li><Link to="/careers" className="hover:text-[#f5c518] transition-colors">Career</Link></li>
            
              </ul>
            </div>

            <div>
              <h4 className="text-[11px] font-bold tracking-[0.1em] uppercase text-white mb-6">Financials</h4>
              <ul className="space-y-3 text-[14px] font-medium text-white/50">
                <li><Link to="/investors" className="hover:text-[#f5c518] transition-colors">Stock Information</Link></li>
                <li><Link to="/sec-filings" className="hover:text-[#f5c518] transition-colors">SEC Filings</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[11px] font-bold tracking-[0.1em] uppercase text-white mb-6">Governance</h4>
              <ul className="space-y-3 text-[14px] font-medium text-white/50">
                <li><Link to="/documents-charters" className="hover:text-[#f5c518] transition-colors">Documents & Charters</Link></li>
                <li><Link to="/leadership" className="hover:text-[#f5c518] transition-colors">Leadership & Committees</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[11px] font-bold tracking-[0.1em] uppercase text-white mb-6">IR Resources</h4>
              <ul className="space-y-3 text-[14px] font-medium text-white/50">
                <li><Link to="/email-alerts" className="hover:text-[#f5c518] transition-colors">Email Alerts</Link></li>
                <li><Link to="/contact" className="hover:text-[#f5c518] transition-colors">Contact Us</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Bottom Line */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6">
            <span className="text-[13px] font-medium text-white/40">© {new Date().getFullYear()} DigiPowerX</span>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[#00e878] rounded-full animate-pulse shadow-[0_0_8px_rgba(0,232,120,0.8)]" />
              <span className="text-[13px] font-medium text-white/40">All Systems Operational</span>
            </div>
          </div>
          
          <div className="text-[13px] font-medium text-white/40 flex flex-wrap items-center justify-center gap-6">
            <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms-of-use" className="hover:text-white transition-colors">Terms of Use</Link>
            <a href="https://trust.digipowerx.com/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Trust Center</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const CTASection = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d')!;
    let W: number, H: number, t = 0;
    let animId: number;

    const setSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = c.offsetWidth;
      H = c.offsetHeight;
      c.width = W * dpr;
      c.height = H * dpr;
      c.style.width = W + 'px';
      c.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    window.addEventListener('resize', setSize);
    setSize();

    // Particle system for the golden terrain
    interface Particle {
      x: number;
      y: number;
      baseY: number;
      size: number;
      speed: number;
      brightness: number;
      phase: number;
      layer: number;
    }

    const particles: Particle[] = [];
    const PARTICLE_COUNT = 280;

    const initParticles = () => {
      particles.length = 0;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const layer = Math.random();
        const baseY = H * (0.55 + layer * 0.42);
        particles.push({
          x: Math.random() * W,
          y: baseY,
          baseY,
          size: 0.5 + Math.random() * 2.5 * (1 - layer * 0.5),
          speed: 0.15 + Math.random() * 0.4,
          brightness: 0.3 + Math.random() * 0.7,
          phase: Math.random() * Math.PI * 2,
          layer,
        });
      }
    };

    initParticles();

    // Wave layer definitions — multiple layered terrain waves
    const waveLayers = [
      { yOffset: 0.62, amplitude: 35, frequency: 0.003, speed: 0.25, opacity: 0.06, color: '245, 197, 24' },
      { yOffset: 0.66, amplitude: 30, frequency: 0.004, speed: 0.35, opacity: 0.08, color: '245, 197, 24' },
      { yOffset: 0.70, amplitude: 25, frequency: 0.005, speed: 0.45, opacity: 0.12, color: '200, 160, 20' },
      { yOffset: 0.74, amplitude: 22, frequency: 0.006, speed: 0.55, opacity: 0.15, color: '180, 140, 15' },
      { yOffset: 0.78, amplitude: 18, frequency: 0.007, speed: 0.65, opacity: 0.18, color: '150, 120, 10' },
      { yOffset: 0.82, amplitude: 15, frequency: 0.008, speed: 0.75, opacity: 0.22, color: '120, 100, 8' },
      { yOffset: 0.86, amplitude: 12, frequency: 0.009, speed: 0.85, opacity: 0.28, color: '100, 80, 5' },
      { yOffset: 0.90, amplitude: 8, frequency: 0.01, speed: 0.95, opacity: 0.35, color: '80, 60, 3' },
    ];

    const getWaveY = (x: number, layer: typeof waveLayers[0], time: number) => {
      const y1 = Math.sin(x * layer.frequency + time * layer.speed) * layer.amplitude;
      const y2 = Math.sin(x * layer.frequency * 1.8 + time * layer.speed * 0.7 + 1.2) * layer.amplitude * 0.5;
      const y3 = Math.sin(x * layer.frequency * 3.2 + time * layer.speed * 0.4 + 2.8) * layer.amplitude * 0.2;
      return H * layer.yOffset + y1 + y2 + y3;
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      // Dark background
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, W, H);

      // Draw wave terrain layers (back to front)
      waveLayers.forEach((layer) => {
        ctx.beginPath();
        ctx.moveTo(0, H);

        for (let x = 0; x <= W; x += 2) {
          const y = getWaveY(x, layer, t);
          ctx.lineTo(x, y);
        }

        ctx.lineTo(W, H);
        ctx.closePath();

        // Fill with gradient
        const grad = ctx.createLinearGradient(0, H * layer.yOffset - layer.amplitude, 0, H);
        grad.addColorStop(0, `rgba(${layer.color}, ${layer.opacity})`);
        grad.addColorStop(0.5, `rgba(${layer.color}, ${layer.opacity * 0.6})`);
        grad.addColorStop(1, `rgba(${layer.color}, ${layer.opacity * 0.2})`);
        ctx.fillStyle = grad;
        ctx.fill();

        // Edge glow line
        ctx.beginPath();
        for (let x = 0; x <= W; x += 2) {
          const y = getWaveY(x, layer, t);
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(245, 197, 24, ${layer.opacity * 0.6})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      });

      // Draw particles that float on the terrain waves
      particles.forEach((p) => {
        // Move particle
        p.x += p.speed * 0.3;
        if (p.x > W + 10) {
          p.x = -10;
        }

        // Calculate Y based on which wave layer the particle is on
        const layerIdx = Math.floor(p.layer * (waveLayers.length - 1));
        const waveLayer = waveLayers[layerIdx];
        const waveY = getWaveY(p.x, waveLayer, t);

        // Add some floating oscillation
        const floatY = Math.sin(t * 1.5 + p.phase) * 8;
        p.y = waveY + floatY - 5 - p.layer * 15;

        // Pulse brightness
        const pulse = 0.6 + Math.sin(t * 2 + p.phase) * 0.4;
        const alpha = p.brightness * pulse;

        // Glow
        const glowSize = p.size * 4;
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowSize);
        glow.addColorStop(0, `rgba(245, 197, 24, ${alpha * 0.8})`);
        glow.addColorStop(0.4, `rgba(245, 197, 24, ${alpha * 0.2})`);
        glow.addColorStop(1, 'rgba(245, 197, 24, 0)');
        ctx.fillStyle = glow;
        ctx.fillRect(p.x - glowSize, p.y - glowSize, glowSize * 2, glowSize * 2);

        // Core dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 230, 120, ${alpha})`;
        ctx.fill();
      });

      // Top ambient glow (golden haze where waves start)
      const ambientGlow = ctx.createRadialGradient(W * 0.5, H * 0.75, 0, W * 0.5, H * 0.75, W * 0.6);
      ambientGlow.addColorStop(0, 'rgba(245, 197, 24, 0.06)');
      ambientGlow.addColorStop(0.5, 'rgba(245, 197, 24, 0.02)');
      ambientGlow.addColorStop(1, 'rgba(245, 197, 24, 0)');
      ctx.fillStyle = ambientGlow;
      ctx.fillRect(0, 0, W, H);

      t += 0.02;
      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', setSize);
    };
  }, []);

  return (
    <section id="contact" className="relative overflow-hidden bg-[#050505] border-t border-white/5" style={{ minHeight: '600px' }}>
      {/* Animated golden terrain canvas — full background */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Top gradient fade from pure black into the scene */}
      <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-[#050505] to-transparent z-[1] pointer-events-none" />

      {/* Subtle radial glow behind content */}
      <div className="absolute top-1/3 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-[#f5c518] opacity-[0.03] blur-[120px] rounded-full pointer-events-none z-[1]" />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-16 relative z-10 pt-20 pb-32 md:pb-40">
        <div className="flex flex-col lg:flex-row items-start gap-10 lg:gap-20">

          {/* ═══ LEFT SIDE: Large heading + subtitle ═══ */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-[48%] flex flex-col justify-start"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2.5 mb-8">
              <div className="w-2.5 h-2.5 rounded-full bg-[#f5c518] animate-pulse shadow-[0_0_10px_#f5c518]" />
              <span className="text-[#f5c518] text-[10px] font-bold tracking-[0.35em] uppercase">Partner With Us</span>
            </div>

            {/* Heading */}
            <h2
              className="text-[clamp(2.2rem,4.5vw,4.2rem)] text-white uppercase tracking-tight leading-[1] mb-8 font-bold"
            >
              READY TO OWN<br />
              THE{' '}
              <span
                className="text-transparent bg-clip-text bg-gradient-to-r from-[#f5c518] via-[#ffda47] to-[#f5c518]"
                style={{ WebkitBackgroundClip: 'text' }}
              >
                INFRASTRUCTURE
              </span>
              <br />
              LAYER?
            </h2>

            {/* Subtitle */}
            <p className="text-white/40 text-[15px] leading-[1.75] max-w-md">
              Whether you need co-location, a turnkey data center build, or bare-metal GPU compute — DigiPowerX has the infrastructure, the scale, and the team to deliver.
            </p>
          </motion.div>

          {/* ═══ RIGHT SIDE: Feature card ═══ */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full lg:flex-1"
          >
            <div className="relative rounded-2xl border border-white/[0.08] overflow-hidden" style={{ background: 'linear-gradient(160deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)' }}>
              {/* Top highlight edge */}
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

              <div className="p-8 md:p-10 backdrop-blur-sm">
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl border border-brand-yellow/25 bg-brand-yellow/[0.06] flex items-center justify-center mb-6">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f5c518" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="8" rx="2" />
                    <rect x="2" y="14" width="20" height="8" rx="2" />
                    <line x1="6" y1="6" x2="6.01" y2="6" />
                    <line x1="6" y1="18" x2="6.01" y2="18" />
                  </svg>
                </div>

                {/* Card heading */}
                <h3 className="text-white text-[1.5rem] md:text-[1.75rem] leading-[1.25] font-semibold mb-8">
                  Build the future.
                  <br />
                  <span className="text-brand-yellow italic">Power the intelligence era.</span>
                </h3>

                {/* Feature items */}
                <div className="space-y-5 mb-8">
                  {/* Feature 1 */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg border border-brand-yellow/20 bg-brand-yellow/[0.05] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f5c518" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="4" y="4" width="16" height="16" rx="2" />
                        <rect x="9" y="9" width="6" height="6" />
                        <path d="M15 2v2" /><path d="M15 20v2" />
                        <path d="M2 15h2" /><path d="M20 15h2" />
                        <path d="M9 2v2" /><path d="M9 20v2" />
                        <path d="M2 9h2" /><path d="M20 9h2" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-white text-[13px] font-bold uppercase tracking-wide mb-1">Scale Without Limits</h4>
                      <p className="text-white/40 text-[13px] leading-relaxed">Purpose-built facilities designed to grow with you.</p>
                    </div>
                  </div>

                  {/* Feature 2 */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg border border-brand-yellow/20 bg-brand-yellow/[0.05] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f5c518" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-white text-[13px] font-bold uppercase tracking-wide mb-1">Performance Without Compromise</h4>
                      <p className="text-white/40 text-[13px] leading-relaxed">High-density power, advanced cooling, and elite connectivity.</p>
                    </div>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center gap-3 bg-[#f5c518] text-black px-6 py-3.5 rounded-lg font-bold text-[11px] uppercase tracking-[0.15em] hover:bg-[#ffda47] hover:shadow-[0_0_25px_rgba(245,197,24,0.3)] transition-all duration-300 active:scale-[0.97]"
                  >
                    <span>Talk to Our Team</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14" /><path d="M12 5l7 7-7 7" />
                    </svg>
                  </Link>
                  <Link
                    to="/documents-charters"
                    className="inline-flex items-center justify-center gap-3 bg-transparent border border-white/15 text-white px-6 py-3.5 rounded-lg font-bold text-[11px] uppercase tracking-[0.15em] hover:bg-white/[0.05] hover:border-white/25 transition-all duration-300 active:scale-[0.97]"
                  >
                    <span>Capability Deck</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export { Footer, CTASection };






