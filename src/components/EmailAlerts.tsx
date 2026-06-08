"use client";

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  User,
  Building,
  Check,
  Send,
  Terminal,
  ShieldCheck,
  Wifi,
  Server,
  AlertTriangle
} from 'lucide-react';
import { CTASection } from './Footer';
import dynamic from 'next/dynamic';

const FuturisticDataRain = dynamic(() => import('./FuturisticDataRain'), { ssr: false });

const EmailAlerts = () => {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [company, setCompany] = useState("");

  // Interactive mouse spotlight state
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  // Custom futuristic toggle states
  const [subPress, setSubPress] = useState(true);
  const [subSec, setSubSec] = useState(false);
  const [subStock, setSubStock] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionLogs, setSubmissionLogs] = useState<string[]>([]);

  const handleSubscribe = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!email) return;

  setIsSubmitting(true);
  setSubmissionLogs([]);

  // Simulated technical logs before actual network request
  const preLogs = [
    "ESTABLISHING SMTP SECURE CONNECTIONS...",
    "VERIFYING NODE INTEGRITY...",
    "COMPILING SUBSCRIPTION PAYLOAD DATA...",
    "ENCRYPTING CHANNELS (SHA-512)..."
  ];
  preLogs.forEach((log, idx) => {
    setTimeout(() => {
      setSubmissionLogs(prev => [...prev, log]);
    }, (idx + 1) * 400);
  });

  // Prepare payload matching API schema
  const payload = {
    email,
    firstName,
    lastName,
    company,
    pressReleases: subPress,
    secFilings: subSec,
    stockDetailEndOfDay: subStock,
  };
  console.log('Sending payload to API:', payload);

  try {
    const response = await fetch(
      "https://thankful-miracle-1ed8bdfdaf.strapiapp.com/api/email-alerts",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ data: payload })
      }
    );
    if (!response.ok) {
        const errText = await response.text();
        console.error('API error response:', errText);
        throw new Error(`Server responded with ${response.status}: ${errText}`);
      }
    // Optionally process response data
    await response.json();
    setSubmissionLogs(prev => [...prev, "TRANSMISSION COMPLETED SUCCESSFULLY."]);
    setIsSubmitted(true);
  } catch (err: any) {
    const errorMessage = err?.message || "Unknown error";
    setSubmissionLogs(prev => [...prev, `ERROR: ${errorMessage}`]);
  } finally {
    // Ensure the submitting flag is cleared after the simulated logs finish
    setTimeout(() => setIsSubmitting(false), preLogs.length * 400 + 1200);
  }
};

  return (
    <div className="bg-[#050608] min-h-screen text-white selection:bg-brand-yellow selection:text-black">

      {/* Centered Hero Section */}
      <section
        ref={heroRef}
        onMouseMove={handleMouseMove}
        className="relative min-h-[60vh] flex flex-col items-center justify-center pt-32 pb-16 px-4 sm:px-6 overflow-hidden group"
      >
        {/* Futuristic yellow data stream animation background */}
        <FuturisticDataRain />
        {/* Dynamic Spotlight Glow that follows cursor */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-700 ease-out opacity-0 group-hover:opacity-100"
          style={{
            background: `radial-gradient(500px circle at ${mousePos.x}px ${mousePos.y}px, rgba(245, 197, 24, 0.045), transparent 80%)`,
          }}
        />

        {/* Subtle geometric digital background pattern */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.02]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
            maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
          }}
        />

        <div className="container mx-auto px-6 relative z-10 text-center flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-yellow/30 bg-brand-yellow/5 backdrop-blur-sm mb-8 hover:border-brand-yellow/60 transition-colors cursor-default"
          >
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
              transition={{ repeat: Infinity, repeatDelay: 4, duration: 0.6, ease: "easeInOut" }}
            >
              <Mail size={12} className="text-brand-yellow" />
            </motion.div>
            <span className="text-[9px] uppercase tracking-[0.4em] font-mono text-brand-yellow font-semibold">
              REAL-TIME DISCLOSURE HUB
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
            className="text-[clamp(2.5rem,6vw,5.5rem)] font-semibold leading-[0.95] tracking-tighter uppercase text-white mb-8 select-none"
          >
            EMAIL{' '}
            <motion.span
              animate={{ textShadow: ['0 0 10px rgba(245,197,24,0)', '0 0 20px rgba(245,197,24,0.3)', '0 0 10px rgba(245,197,24,0)'] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              className="text-brand-yellow drop-shadow-[0_0_15px_rgba(245,197,24,0.15)]"
            >
              ALERTS
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
            className="text-white/60 text-sm md:text-lg max-w-2xl mx-auto leading-relaxed font-medium tracking-wide"
          >
            Sign up to receive important corporate updates, press releases, and SEC filings from DigiPowerX directly inside your computational node.
          </motion.p>

          {/* Dotted anchor layout guide connector */}
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 48, opacity: 0.25 }}
            transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
            className="w-px bg-gradient-to-b from-brand-yellow to-transparent mt-12 mb-2"
          />
        </div>
      </section>

      {/* Subscription Grid Console Section */}
      <section className="py-12 sm:py-16 relative border-t border-white/5 bg-[#0a0a0c]">
        <div className="container mx-auto px-4 sm:px-6 max-w-[1400px]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 max-w-6xl mx-auto items-start">

            {/* Left Column: Technical Console Form */}
            <div className="lg:col-span-7">
              <div className="border border-white/5 rounded-3xl p-8 md:p-12 bg-[#0d0f14]/50 backdrop-blur-md relative overflow-hidden">

                <AnimatePresence mode="wait">
                  {!isSubmitted ? (
                    <motion.form
                      key="sub-form"
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleSubscribe}
                      className="space-y-8 relative z-10"
                    >
                      <div className="space-y-2">
                        <h3 className="text-xl font-semibold uppercase tracking-tight text-white">
                          Stay Updated with DigiPowerX
                        </h3>
                        <p className="text-xs text-white/40">
                          Field parameters marked with * represent mandatory registry indicators.
                        </p>
                      </div>

                      {/* Inputs Row 1: Email */}
                      <div className="space-y-2">
                        <label className="block text-[9px] font-mono uppercase tracking-widest text-brand-yellow">
                          Email Address *
                        </label>
                        <div className="relative">
                          <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="w-full bg-[#050608] border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm text-white placeholder:text-white/20 outline-none focus:border-brand-yellow/40 transition-colors"
                          />
                        </div>
                      </div>

                      {/* Inputs Row 2: Name */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="block text-[9px] font-mono uppercase tracking-widest text-white/40">
                            First Name
                          </label>
                          <div className="relative">
                            <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                            <input
                              type="text"
                              value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                              placeholder="Enter your first name"
                              className="w-full bg-[#050608] border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm text-white placeholder:text-white/20 outline-none focus:border-brand-yellow/30 transition-colors"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-[9px] font-mono uppercase tracking-widest text-white/40">
                            Last Name
                          </label>
                          <div className="relative">
                            <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                            <input
                              type="text"
                              value={lastName}
                              onChange={(e) => setLastName(e.target.value)}
                              placeholder="Enter your last name"
                              className="w-full bg-[#050608] border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm text-white placeholder:text-white/20 outline-none focus:border-brand-yellow/30 transition-colors"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Inputs Row 3: Company */}
                      <div className="space-y-2">
                        <label className="block text-[9px] font-mono uppercase tracking-widest text-white/40">
                          Company Name
                        </label>
                        <div className="relative">
                          <Building size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                          <input
                            type="text"
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            placeholder="Enter your company name"
                            className="w-full bg-[#050608] border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm text-white placeholder:text-white/20 outline-none focus:border-brand-yellow/30 transition-colors"
                          />
                        </div>
                      </div>

                      {/* Checkboxes Area */}
                      <div className="space-y-4 pt-4 border-t border-white/5">
                        <label className="block text-[9px] font-mono uppercase tracking-widest text-brand-yellow">
                          Subscribe To:
                        </label>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                          {/* Option 1: Press Releases */}
                          <div
                            onClick={() => setSubPress(!subPress)}
                            className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${subPress
                              ? 'border-brand-yellow/30 bg-brand-yellow/[0.02]'
                              : 'border-white/5 bg-[#050608] hover:border-white/10'
                              }`}
                          >
                            <div className={`w-4 h-4 rounded flex items-center justify-center border-2 shrink-0 transition-all ${subPress ? 'border-brand-yellow bg-brand-yellow text-black' : 'border-white/40'
                              }`}>
                              {subPress && <Check size={10} strokeWidth={3} />}
                            </div>
                            <span className="text-xs font-semibold uppercase tracking-wider text-white">Press Releases</span>
                          </div>

                          {/* Option 2: SEC Filings */}
                          <div
                            onClick={() => setSubSec(!subSec)}
                            className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${subSec
                              ? 'border-brand-yellow/30 bg-brand-yellow/[0.02]'
                              : 'border-white/5 bg-[#050608] hover:border-white/10'
                              }`}
                          >
                            <div className={`w-4 h-4 rounded flex items-center justify-center border-2 shrink-0 transition-all ${subSec ? 'border-brand-yellow bg-brand-yellow text-black' : 'border-white/40'
                              }`}>
                              {subSec && <Check size={10} strokeWidth={3} />}
                            </div>
                            <span className="text-xs font-semibold uppercase tracking-wider text-white">All SEC Filings</span>
                          </div>

                          {/* Option 3: Stock Detail */}
                          <div
                            onClick={() => setSubStock(!subStock)}
                            className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${subStock
                              ? 'border-brand-yellow/30 bg-brand-yellow/[0.02]'
                              : 'border-white/5 bg-[#050608] hover:border-white/10'
                              }`}
                          >
                            <div className={`w-4 h-4 rounded flex items-center justify-center border-2 shrink-0 transition-all ${subStock ? 'border-brand-yellow bg-brand-yellow text-black' : 'border-white/40'
                              }`}>
                              {subStock && <Check size={10} strokeWidth={3} />}
                            </div>
                            <span className="text-xs font-semibold uppercase tracking-wider text-white">Stock Detail</span>
                          </div>

                        </div>
                      </div>

                      {/* Submit button / Loading logs area */}
                      <div className="pt-6 border-t border-white/5 space-y-4">
                        {!isSubmitting ? (
                          <button
                            type="submit"
                            className="w-full bg-white hover:bg-brand-yellow text-black font-semibold uppercase tracking-widest text-xs py-4.5 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                          >
                            <Send size={14} />
                            Establish Subscription Node
                          </button>
                        ) : (
                          <div className="bg-[#050608] border border-white/10 rounded-2xl p-6 space-y-3 font-mono text-[10px] text-white/50">
                            <div className="flex items-center gap-2 text-brand-yellow">
                              <Terminal size={14} className="animate-pulse" />
                              <span>UPLINK TRANSMISSION IN PROGRESS</span>
                            </div>
                            <div className="space-y-1">
                              {submissionLogs.map((log, lIdx) => (
                                <div key={lIdx} className="flex gap-2">
                                  <span className="text-white/20">&gt;</span>
                                  <span>{log}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                    </motion.form>
                  ) : (
                    <motion.div
                      key="sub-success"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center justify-center py-12 text-center space-y-6 relative z-10"
                    >
                      <div className="w-20 h-20 rounded-full bg-brand-yellow/10 border border-brand-yellow/30 flex items-center justify-center text-brand-yellow">
                        <ShieldCheck size={40} className="animate-pulse" />
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-2xl font-semibold uppercase tracking-tight text-brand-yellow">Subscription Registered</h4>
                        <p className="text-[10px] font-mono text-white/40">
                          PROTOCOL: STABLE • DISTRIBUTION PIPELINE SET ACTIVE
                        </p>
                      </div>

                      <p className="text-sm font-medium text-white/70 max-w-md leading-relaxed">
                        Thank you, <span className="text-white font-semibold">{firstName || "Subscriber"}</span>. Your email node <span className="text-white font-semibold">{email}</span> has been securely validated and mapped to:
                      </p>

                      <div className="flex flex-wrap gap-2 justify-center max-w-sm pt-2">
                        {subPress && (
                          <span className="text-[9px] font-mono uppercase bg-white/5 border border-white/10 px-2.5 py-1 rounded">Press Releases</span>
                        )}
                        {subSec && (
                          <span className="text-[9px] font-mono uppercase bg-white/5 border border-white/10 px-2.5 py-1 rounded">SEC Filings</span>
                        )}
                        {subStock && (
                          <span className="text-[9px] font-mono uppercase bg-white/5 border border-white/10 px-2.5 py-1 rounded">Stock Detail (EOD)</span>
                        )}
                      </div>

                      <button
                        onClick={() => {
                          setIsSubmitted(false);
                          setEmail("");
                          setFirstName("");
                          setLastName("");
                          setCompany("");
                        }}
                        className="text-[10px] font-mono font-semibold uppercase tracking-widest text-brand-yellow/55 hover:text-brand-yellow transition-colors pt-6"
                      >
                        Register Another Node
                      </button>

                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            </div>

            {/* Right Column: Distribution Center Telemetry Status */}
            <div className="lg:col-span-5 space-y-6 self-stretch h-full flex flex-col">

              {/* Telemetry Status Board */}
              <div className="border border-white/5 rounded-3xl p-8 bg-[#0d0f14]/50 backdrop-blur-md flex-1 space-y-8 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-mono font-semibold uppercase tracking-widest text-brand-yellow mb-6 flex items-center gap-2">
                    <Server size={14} className="text-brand-yellow" />
                    Distribution Center Telemetry
                  </h4>

                  <div className="space-y-6">
                    {[
                      { label: "Relay Protocol", val: "SMTP Secure SSL" },
                      { label: "Signature Type", val: "SHA-512 Certified" },
                      { label: "CAN-SPAM Safeguard", val: "100% Compliant" },
                      { label: "Active Subscriber Nodes", val: "12,845 Nodes" },
                      { label: "Target Relay Latency", val: "< 150 ms" }
                    ].map((stat, i) => (
                      <div key={i} className="flex justify-between items-center border-b border-white/5 pb-3 last:border-0 last:pb-0">
                        <span className="text-[10px] font-mono uppercase text-white/30">{stat.label}</span>
                        <span className="text-xs font-semibold text-white/90">{stat.val}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border border-brand-yellow/20 rounded-xl p-4 bg-brand-yellow/[0.01] flex gap-3.5 items-start">
                  <Wifi size={16} className="text-brand-yellow flex-shrink-0 mt-0.5 animate-pulse" />
                  <div className="space-y-1">
                    <div className="text-[10px] font-mono uppercase tracking-widest text-brand-yellow font-semibold">Uplink Gateway Status</div>
                    <p className="text-[10px] font-medium leading-relaxed text-white/40">
                      All disclosure pipeline relays are operational. Real-time updates sync dynamically with SEC databases.
                    </p>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );
};

export default EmailAlerts;
