"use client";

import React, { useState } from 'react';
import { m } from 'framer-motion';
import { Shield, Eye, Lock, FileText, CheckCircle2, ChevronRight, CornerDownRight } from 'lucide-react';
import { CTASection } from './Footer';
import dynamic from 'next/dynamic';

const NeuralCube3D = dynamic(() => import('./NeuralCube3D'), { ssr: false });

const sections = [
  { id: "sec-1", num: "01", name: "Use of the Site" },
  { id: "sec-2", num: "02", name: "Intellectual Property" },
  { id: "sec-3", num: "03", name: "No Investment Advice" },
  { id: "sec-4", num: "04", name: "Third-Party Links" },
  { id: "sec-5", num: "05", name: "Disclaimer of Warranties" },
  { id: "sec-6", num: "06", name: "Limitation of Liability" },
  { id: "sec-7", num: "07", name: "Indemnification" },
  { id: "sec-8", num: "08", name: "Privacy Policy Link" },
  { id: "sec-9", num: "09", name: "Changes to the Terms" },
  { id: "sec-10", num: "10", name: "Governing Law" }
];

const TermsOfUse = () => {
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
            <FileText size={12} className="text-brand-yellow" />
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
            TERMS OF <span className="text-brand-yellow">USE</span>
          </m.h1>

          <m.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/60 text-sm md:text-lg max-w-2xl mx-auto leading-relaxed font-medium tracking-wide"
          >
            Please read these Terms of Use carefully before accessing or using DigiPowerX.com.
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
                  <Shield size={14} />
                  Terms Contents
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
                  Welcome to DigiPowerX.com (the “Site”). DigiPowerX, Inc. (“DigiPowerX,” “we,” “our,” or “us”) provides this Site for informational purposes and access to certain services. 
                </p>
                <p className="font-semibold text-white">
                  By using the Site, you (“User,” “you,” or “your”) agree to be bound by these Terms of Use (“Terms”). If you do not agree, you must not use the Site.
                </p>
              </div>

              {/* Section 1 */}
              <div id="sec-1" className="space-y-6 pt-4">
                <div className="flex items-center gap-4 border-b border-dark-border-subtle pb-4">
                  <span className="text-2xl font-semibold tracking-tighter text-brand-yellow font-mono">01</span>
                  <h2 className="text-2xl font-semibold uppercase tracking-tighter text-white">Use of the Site</h2>
                </div>
                <div className="space-y-4 text-sm text-white/70 leading-relaxed font-medium">
                  <p>
                    The Site is provided for general information about DigiPowerX and our services. You may only use the Site for lawful purposes and in accordance with these Terms. You agree not to:
                  </p>
                  <ul className="space-y-2.5 pl-6 list-disc">
                    <li>Attempt to gain unauthorized access to the Site or related systems.</li>
                    <li>Use the Site to transmit harmful code, spam, or malicious content.</li>
                    <li>Interfere with or disrupt the Site’s operation or security.</li>
                  </ul>
                </div>
              </div>

              {/* Section 2 */}
              <div id="sec-2" className="space-y-6 pt-4">
                <div className="flex items-center gap-4 border-b border-dark-border-subtle pb-4">
                  <span className="text-2xl font-semibold tracking-tighter text-brand-yellow font-mono">02</span>
                  <h2 className="text-2xl font-semibold uppercase tracking-tighter text-white">Intellectual Property</h2>
                </div>
                <div className="space-y-4 text-sm text-white/70 leading-relaxed font-medium">
                  <p>
                    All content, logos, graphics, designs, images, software, and materials on the Site are the property of DigiPowerX or its licensors and are protected by intellectual property laws. 
                  </p>
                  <p>
                    You may not copy, distribute, modify, or use any content without written permission, except for personal, non-commercial use.
                  </p>
                </div>
              </div>

              {/* Section 3 */}
              <div id="sec-3" className="space-y-6 pt-4">
                <div className="flex items-center gap-4 border-b border-dark-border-subtle pb-4">
                  <span className="text-2xl font-semibold tracking-tighter text-brand-yellow font-mono">03</span>
                  <h2 className="text-2xl font-semibold uppercase tracking-tighter text-white">No Investment or Professional Advice</h2>
                </div>
                <div className="space-y-4 text-sm text-white/70 leading-relaxed font-medium">
                  <p>
                    All content on the Site is provided for informational purposes only. Nothing on the Site constitutes legal, financial, investment, or technical advice.
                  </p>
                </div>
              </div>

              {/* Section 4 */}
              <div id="sec-4" className="space-y-6 pt-4">
                <div className="flex items-center gap-4 border-b border-dark-border-subtle pb-4">
                  <span className="text-2xl font-semibold tracking-tighter text-brand-yellow font-mono">04</span>
                  <h2 className="text-2xl font-semibold uppercase tracking-tighter text-white">Third-Party Links</h2>
                </div>
                <div className="space-y-4 text-sm text-white/70 leading-relaxed font-medium">
                  <p>
                    The Site may include links to third-party websites. These are provided for convenience and do not imply endorsement. DigiPowerX is not responsible for third-party content or practices.
                  </p>
                </div>
              </div>

              {/* Section 5 */}
              <div id="sec-5" className="space-y-6 pt-4">
                <div className="flex items-center gap-4 border-b border-dark-border-subtle pb-4">
                  <span className="text-2xl font-semibold tracking-tighter text-brand-yellow font-mono">05</span>
                  <h2 className="text-2xl font-semibold uppercase tracking-tighter text-white">Disclaimer of Warranties</h2>
                </div>
                <div className="space-y-4 text-sm text-white/70 leading-relaxed font-medium">
                  <div className="p-6 rounded-2xl border border-brand-yellow/20 bg-brand-yellow/[0.01] text-xs leading-relaxed space-y-2">
                    <p className="text-brand-yellow font-mono uppercase tracking-widest font-semibold">Disclaimer Limit</p>
                    <p className="text-white/70 font-medium">
                      The Site and all content are provided “as is” and “as available” without any warranties. DigiPowerX does not guarantee the Site will be uninterrupted, error-free, or secure.
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 6 */}
              <div id="sec-6" className="space-y-6 pt-4">
                <div className="flex items-center gap-4 border-b border-dark-border-subtle pb-4">
                  <span className="text-2xl font-semibold tracking-tighter text-brand-yellow font-mono">06</span>
                  <h2 className="text-2xl font-semibold uppercase tracking-tighter text-white">Limitation of Liability</h2>
                </div>
                <div className="space-y-4 text-sm text-white/70 leading-relaxed font-medium">
                  <p>
                    DigiPowerX and its affiliates shall not be liable for any damages arising from your use of the Site, including direct, indirect, incidental, or consequential damages.
                  </p>
                </div>
              </div>

              {/* Section 7 */}
              <div id="sec-7" className="space-y-6 pt-4">
                <div className="flex items-center gap-4 border-b border-dark-border-subtle pb-4">
                  <span className="text-2xl font-semibold tracking-tighter text-brand-yellow font-mono">07</span>
                  <h2 className="text-2xl font-semibold uppercase tracking-tighter text-white">Indemnification</h2>
                </div>
                <div className="space-y-4 text-sm text-white/70 leading-relaxed font-medium">
                  <p>
                    You agree to indemnify and hold DigiPowerX harmless against any claims or losses arising from your use of the Site or violation of these Terms.
                  </p>
                </div>
              </div>

              {/* Section 8 */}
              <div id="sec-8" className="space-y-6 pt-4">
                <div className="flex items-center gap-4 border-b border-dark-border-subtle pb-4">
                  <span className="text-2xl font-semibold tracking-tighter text-brand-yellow font-mono">08</span>
                  <h2 className="text-2xl font-semibold uppercase tracking-tighter text-white">Privacy</h2>
                </div>
                <div className="space-y-4 text-sm text-white/70 leading-relaxed font-medium">
                  <p>
                    Your use of the Site is governed by our Privacy Policy.
                  </p>
                </div>
              </div>

              {/* Section 9 */}
              <div id="sec-9" className="space-y-6 pt-4">
                <div className="flex items-center gap-4 border-b border-dark-border-subtle pb-4">
                  <span className="text-2xl font-semibold tracking-tighter text-brand-yellow font-mono">09</span>
                  <h2 className="text-2xl font-semibold uppercase tracking-tighter text-white">Changes to the Terms</h2>
                </div>
                <div className="space-y-4 text-sm text-white/70 leading-relaxed font-medium">
                  <p>
                    DigiPowerX may update these Terms at any time. Updates are effective upon posting. Continued use of the Site means you accept the updated Terms.
                  </p>
                </div>
              </div>

              {/* Section 10 */}
              <div id="sec-10" className="space-y-6 pt-4">
                <div className="flex items-center gap-4 border-b border-dark-border-subtle pb-4">
                  <span className="text-2xl font-semibold tracking-tighter text-brand-yellow font-mono">10</span>
                  <h2 className="text-2xl font-semibold uppercase tracking-tighter text-white">Governing Law</h2>
                </div>
                <div className="space-y-4 text-sm text-white/70 leading-relaxed font-medium">
                  <p>
                    These Terms are governed by the laws of the State of Delaware. Any disputes must be resolved in state or federal courts located in Delaware.
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

export default TermsOfUse;
