"use client";

import React, { useEffect, useState } from 'react';
import { m } from 'framer-motion';
import { Shield, Eye, Lock, FileText, CheckCircle2, ChevronRight, CornerDownRight } from 'lucide-react';
import { CTASection } from './Footer';
import dynamic from 'next/dynamic';

const NeuralCube3D = dynamic(() => import('./NeuralCube3D'), { ssr: false });

const sections = [
  { id: "sec-1", num: "01", name: "Information We Collect" },
  { id: "sec-2", num: "02", name: "How We Use Information" },
  { id: "sec-3", num: "03", name: "Sharing of Information" },
  { id: "sec-4", num: "04", name: "Cookies and Tracking" },
  { id: "sec-5", num: "05", name: "Data Security" },
  { id: "sec-6", num: "06", name: "Your Rights" },
  { id: "sec-7", num: "07", name: "Third-Party Links" },
  { id: "sec-8", num: "08", name: "Children’s Privacy" },
  { id: "sec-9", num: "09", name: "Changes to Policy" }
];

const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState("sec-1");

  const handleScrollTo = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const offset = 120; // accounting for sticky navbar
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="bg-dark-base min-h-screen text-white selection:bg-brand-yellow selection:text-black">
      
      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex flex-col items-center justify-center pt-48 pb-20 px-6 overflow-hidden">
        
        {/* Background Grid */}
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(245,197,24,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(245,197,24,0.08)_1px,transparent_1px)] bg-[size:40px_40px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,197,24,0.15),transparent_60%)]" />
        </div>

        {/* Neural Cube */}
        <div className="absolute inset-0 z-0 opacity-40 pointer-events-none flex items-center justify-center">
          <div className="w-full h-full max-w-6xl">
            <NeuralCube3D />
          </div>
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center flex flex-col items-center">
          <m.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-yellow/30 bg-brand-yellow/5 backdrop-blur-sm mb-8"
          >
            <Shield size={12} className="text-brand-yellow" />
            <span className="text-[9px] uppercase tracking-[0.4em] font-mono text-brand-yellow font-semibold">
              SECURE REGULATORY VAULT
            </span>
          </m.div>

          <m.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-[clamp(2.5rem,6vw,5.5rem)] font-semibold leading-[0.95] tracking-tighter uppercase text-white mb-8"
          >
            PRIVACY <span className="text-brand-yellow">POLICY</span>
          </m.h1>

          <m.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/60 text-sm md:text-lg max-w-2xl mx-auto leading-relaxed font-medium tracking-wide"
          >
            Learn how DigiPowerX collects, uses, protects, and discloses your information in accordance with state and federal regulations.
          </m.p>
        </div>
      </section>

      {/* Content Section with Sticky Sidebar Grid */}
      <section className="py-24 relative border-t border-dark-border-subtle bg-dark-surface-1">
        <div className="container mx-auto px-6 max-w-[1400px]">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 max-w-6xl mx-auto items-start">
            
            {/* Left Sidebar Index (Sticky) */}
            <div className="lg:col-span-4 sticky top-32 space-y-6 hidden lg:block">
              <div className="border border-dark-border-subtle rounded-3xl p-8 bg-dark-surface-2/50 backdrop-blur-md">
                <h3 className="text-xs font-mono font-semibold uppercase tracking-widest text-brand-yellow mb-6 flex items-center gap-2">
                  <Eye size={14} />
                  Policy Contents
                </h3>
                
                <div className="space-y-1.5">
                  {sections.map((sec) => (
                    <button
                      key={sec.id}
                      onClick={() => handleScrollTo(sec.id)}
                      className={`w-full text-left py-3 px-4 rounded-xl flex items-center gap-4 text-xs font-semibold uppercase tracking-wider transition-all border ${
                        activeSection === sec.id
                          ? 'border-brand-yellow/30 bg-brand-yellow/5 text-brand-yellow'
                          : 'border-transparent text-white/40 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <span className="font-mono text-[10px] text-white/30">{sec.num}</span>
                      <span>{sec.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Document Content */}
            <div className="lg:col-span-8 space-y-16">
              
              {/* Introduction Card */}
              <div className="border border-dark-border-subtle rounded-3xl p-8 md:p-10 bg-dark-surface-2/30 leading-relaxed text-sm md:text-base text-white/70 space-y-4">
                <p>
                  DigiPowerX, Inc. (“DigiPowerX,” “we,” “our,” or “us”) values your privacy. This Privacy Policy explains how we collect, use, and share information when you visit or interact with our website, DigiPowerX.com (the “Site”).
                </p>
                <p className="font-semibold text-white">
                  By using the Site, you agree to the practices described here.
                </p>
              </div>

              {/* Section 1 */}
              <div id="sec-1" className="space-y-6 pt-4">
                <div className="flex items-center gap-4 border-b border-dark-border-subtle pb-4">
                  <span className="text-2xl font-semibold tracking-tighter text-brand-yellow font-mono">01</span>
                  <h2 className="text-2xl font-semibold uppercase tracking-tighter text-white">Information We Collect</h2>
                </div>
                <div className="space-y-6 text-sm text-white/70 leading-relaxed font-medium">
                  <div>
                    <h3 className="text-white font-semibold uppercase text-xs tracking-wider flex items-center gap-2 mb-3">
                      <CornerDownRight size={12} className="text-brand-yellow" />
                      a) Information You Provide
                    </h3>
                    <ul className="space-y-2.5 pl-6 list-disc">
                      <li>Name, email address, phone number, or other details submitted through forms or inquiries.</li>
                      <li>Any information you voluntarily provide to us.</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-white font-semibold uppercase text-xs tracking-wider flex items-center gap-2 mb-3">
                      <CornerDownRight size={12} className="text-brand-yellow" />
                      b) Automatically Collected Information
                    </h3>
                    <ul className="space-y-2.5 pl-6 list-disc">
                      <li>Log data: IP address, browser type, operating system, referring pages, and access times.</li>
                      <li>Cookies: Used to improve the Site experience and understand usage behaviors.</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Section 2 */}
              <div id="sec-2" className="space-y-6 pt-4">
                <div className="flex items-center gap-4 border-b border-dark-border-subtle pb-4">
                  <span className="text-2xl font-semibold tracking-tighter text-brand-yellow font-mono">02</span>
                  <h2 className="text-2xl font-semibold uppercase tracking-tighter text-white">How We Use Your Information</h2>
                </div>
                <div className="space-y-4 text-sm text-white/70 leading-relaxed font-medium">
                  <p>We use collected information to:</p>
                  <ul className="space-y-2.5 pl-6 list-disc">
                    <li>Operate, maintain, and improve the Site.</li>
                    <li>Respond to inquiries and provide support.</li>
                    <li>Communicate updates, events, or services (if you opt in).</li>
                    <li>Enhance security and prevent fraudulent activity.</li>
                    <li>Comply with legal and regulatory obligations.</li>
                  </ul>
                </div>
              </div>

              {/* Section 3 */}
              <div id="sec-3" className="space-y-6 pt-4">
                <div className="flex items-center gap-4 border-b border-dark-border-subtle pb-4">
                  <span className="text-2xl font-semibold tracking-tighter text-brand-yellow font-mono">03</span>
                  <h2 className="text-2xl font-semibold uppercase tracking-tighter text-white">Sharing of Information</h2>
                </div>
                <div className="space-y-4 text-sm text-white/70 leading-relaxed font-medium">
                  <p className="text-white font-semibold flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-brand-yellow" />
                    We do not sell your personal information.
                  </p>
                  <p>We may share information:</p>
                  <ul className="space-y-2.5 pl-6 list-disc">
                    <li>With service providers such as hosting, analytics, or IT support partners.</li>
                    <li>When required by law, subpoena, or regulatory authorities.</li>
                    <li>If DigiPowerX undergoes a merger, acquisition, or asset transfer.</li>
                  </ul>
                </div>
              </div>

              {/* Section 4 */}
              <div id="sec-4" className="space-y-6 pt-4">
                <div className="flex items-center gap-4 border-b border-dark-border-subtle pb-4">
                  <span className="text-2xl font-semibold tracking-tighter text-brand-yellow font-mono">04</span>
                  <h2 className="text-2xl font-semibold uppercase tracking-tighter text-white">Cookies and Tracking</h2>
                </div>
                <div className="space-y-4 text-sm text-white/70 leading-relaxed font-medium">
                  <p>We use cookies and tracking technologies to:</p>
                  <ul className="space-y-2.5 pl-6 list-disc">
                    <li>Improve Site functionality.</li>
                    <li>Understand traffic and user behavior.</li>
                    <li>Enhance your overall browsing experience.</li>
                  </ul>
                  <p className="text-white/50 text-xs italic pt-2">
                    You may disable cookies through your browser settings, but certain features of the Site may not work properly.
                  </p>
                </div>
              </div>

              {/* Section 5 */}
              <div id="sec-5" className="space-y-6 pt-4">
                <div className="flex items-center gap-4 border-b border-dark-border-subtle pb-4">
                  <span className="text-2xl font-semibold tracking-tighter text-brand-yellow font-mono">05</span>
                  <h2 className="text-2xl font-semibold uppercase tracking-tighter text-white">Data Security</h2>
                </div>
                <div className="space-y-4 text-sm text-white/70 leading-relaxed font-medium">
                  <p>
                    We implement reasonable administrative, technical, and physical safeguards to protect your personal data.
                  </p>
                  <div className="p-4 rounded-xl border border-dark-border-subtle bg-dark-surface-2/30 text-xs text-white/50">
                    <strong>Disclaimer:</strong> However, no security system is completely secure, and we cannot guarantee absolute protection.
                  </div>
                </div>
              </div>

              {/* Section 6 */}
              <div id="sec-6" className="space-y-6 pt-4">
                <div className="flex items-center gap-4 border-b border-dark-border-subtle pb-4">
                  <span className="text-2xl font-semibold tracking-tighter text-brand-yellow font-mono">06</span>
                  <h2 className="text-2xl font-semibold uppercase tracking-tighter text-white">Your Rights</h2>
                </div>
                <div className="space-y-4 text-sm text-white/70 leading-relaxed font-medium">
                  <p>Depending on your location, you may have rights such as:</p>
                  <ul className="space-y-2.5 pl-6 list-disc">
                    <li>Requesting access to your information.</li>
                    <li>Correcting or deleting your data.</li>
                    <li>Opting out of email communications.</li>
                    <li>Restricting or objecting to certain processing activities.</li>
                    <li>Requesting a portable copy of your data.</li>
                  </ul>
                  <p>To exercise these rights, please contact our privacy operations desk.</p>
                </div>
              </div>

              {/* Section 7 */}
              <div id="sec-7" className="space-y-6 pt-4">
                <div className="flex items-center gap-4 border-b border-dark-border-subtle pb-4">
                  <span className="text-2xl font-semibold tracking-tighter text-brand-yellow font-mono">07</span>
                  <h2 className="text-2xl font-semibold uppercase tracking-tighter text-white">Third-Party Links</h2>
                </div>
                <div className="space-y-4 text-sm text-white/70 leading-relaxed font-medium">
                  <p>
                    Our Site may contain links to third-party websites. We are not responsible for their privacy practices or content.
                  </p>
                </div>
              </div>

              {/* Section 8 */}
              <div id="sec-8" className="space-y-6 pt-4">
                <div className="flex items-center gap-4 border-b border-dark-border-subtle pb-4">
                  <span className="text-2xl font-semibold tracking-tighter text-brand-yellow font-mono">08</span>
                  <h2 className="text-2xl font-semibold uppercase tracking-tighter text-white">Children’s Privacy</h2>
                </div>
                <div className="space-y-4 text-sm text-white/70 leading-relaxed font-medium">
                  <p>
                    The Site is not intended for children under 13. We do not knowingly collect information from children.
                  </p>
                </div>
              </div>

              {/* Section 9 */}
              <div id="sec-9" className="space-y-6 pt-4">
                <div className="flex items-center gap-4 border-b border-dark-border-subtle pb-4">
                  <span className="text-2xl font-semibold tracking-tighter text-brand-yellow font-mono">09</span>
                  <h2 className="text-2xl font-semibold uppercase tracking-tighter text-white">Changes to This Privacy Policy</h2>
                </div>
                <div className="space-y-4 text-sm text-white/70 leading-relaxed font-medium">
                  <p>
                    We may update this Privacy Policy from time to time. Revised versions will be posted on this page with an updated effective date.
                  </p>
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

export default PrivacyPolicy;
