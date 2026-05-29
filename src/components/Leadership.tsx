import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Shield,
  Users,
  Target,
  TrendingUp,
  ChevronRight,
  X,
  Mail
} from 'lucide-react';
import LeadershipHeroVisual3D from './LeadershipHeroVisual3D';
import { CTASection } from './Footer';

// Leadership Portraits from public/images
const Leadership = () => {
  const [selectedLeader, setSelectedLeader] = useState(null);
  const [expandedBoardMember, setExpandedBoardMember] = useState(null);
  const [expandedCommittee, setExpandedCommittee] = useState(null);

  const executives = [
    {
      name: "Michel Amar",
      role: "Chief Executive Officer",
      img: "/images/96.jpg",
      bio: "Michel Amar is a French-American businessman and entrepreneur known for his success in innovative technology, such as blockchain and electronics, as well as developing branded fashion. With a Bachelor's degree in accounting and business management, Michel has worked and consulted with some of the most famous international brands, playing a vital role in their profitability and continued relevance."
    },
    {
      name: "Alec Amar",
      role: "President",
      img: "/images/95.jpg",
      bio: "Mr. Amar is an entrepreneur and infrastructure executive with deep experience in energy, high-density data-center development, and advanced digital infrastructure. Under Mr. Amar's leadership, DigiPowerX has expanded into multiple U.S. markets with a growing portfolio of high-power data-center properties."
    },
    {
      name: "Jagan Jeyapal",
      role: "Chief Technology Officer",
      img: "/images/ChatGPT Image May 18, 2026, 04_04_34 PM.png",
      bio: "Technical visionary driving the architecture of DigiPowerX's high-performance computing platforms and sustainable infrastructure solutions."
    },
    {
      name: "Paul Ciullo",
      role: "Chief Financial Officer",
      img: "/images/ChatGPT Image May 18, 2026, 04_04_37 PM.png",
      bio: "Financial strategist overseeing the company's fiscal health and capital allocation for massive infrastructure scaling."
    },
    {
      name: "Daniel Rotunno",
      role: "VP of Operations",
      img: "/images/ChatGPT Image May 18, 2026, 04_04_39 PM.png",
      bio: "Operations expert managing the complex logistics and site deployments for modular data centers."
    },
    {
      name: "Luke Marchiori",
      role: "Chief Renewable Energy Officer",
      img: "/images/ChatGPT Image May 18, 2026, 04_04_40 PM.png",
      bio: "Leading the integration of clean power sources with high-density compute facilities."
    },
    {
      name: "Jim McCabe",
      role: "Advisor",
      img: "/images/ChatGPT Image May 18, 2026, 04_04_42 PM.png",
      bio: "Real estate and infrastructure development veteran with 15+ years of experience leading hyperscale site acquisitions and construction."
    },
    {
      name: "Eddie Cloud",
      role: "Infrastructure and Development Lead",
      img: "/images/ChatGPT Image May 18, 2026, 04_04_43 PM.png",
      bio: "Specialist in thermal dynamics and structural engineering, pioneering innovative liquid cooling architectures for high-density AI clusters."
    },
    {
      name: "Venkat Rangasamy",
      role: "VP of AI Infrastructure",
      img: "/images/ChatGPT Image May 18, 2026, 04_04_45 PM.png",
      bio: "Energy sector expert specializing in grid-scale renewable integration, microgrids, and high-voltage substation designs."
    },
    {
      name: "Hans Vestberg",
      role: "Senior Advisor",
      img: "/images/97.jpg",
      bio: "Cybersecurity strategist safeguarding DigiPowerX's high-performance compute networks, physical assets, and data sovereignty."
    }
  ];

  const boardMembers = [
    {
      name: "Michel Amar",
      role: "Chairman of the Board",
      img: "/images/michal (1).webp",
      bio: "Michel Amar is a French-American businessman and entrepreneur known for his success in innovative technology, such as blockchain and electronics, as well as developing branded fashion."
    },
    {
      name: "Alec Amar",
      role: "Board Member",
      img: "/images/alec.webp",
      bio: "Mr. Amar is an entrepreneur and infrastructure executive with deep experience in energy, high-density data-center development, and advanced digital infrastructure."
    },
    {
      name: "Gerard Rotonda",
      role: "Board Member",
      img: "/images/hans.webp",
      bio: "Mr. Rotonda was the Chief Financial Officer for Deutsche Bank Wealth Management Americas. He has over 30 years of experience in business development and financial analysis."
    },
    {
      name: "Adam S. Rossman",
      role: "Board Member",
      img: "/images/eddie.webp",
      bio: "Mr. Rossman is a business and real estate attorney with extensive experience in commercial real estate and trademark licensing."
    },
    {
      name: "Ajay Gupta",
      role: "Board Member",
      img: "/images/venkat.webp",
      bio: "Seasoned wealth management executive and Principal of Robbins Gupta Holdings. Advisor to global financial organizations."
    }
  ];

  return (
    <div className="bg-black min-h-screen text-white selection:bg-brand-yellow selection:text-black">
      {/* Hero Section */}
      <section className="relative min-h-0 lg:min-h-screen flex items-center pt-32 pb-8 lg:pt-10 lg:pb-16 px-4 lg:px-6 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-yellow/[0.03] rounded-full blur-[140px] pointer-events-none" />

        <div className="relative z-10 max-w-[1400px] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-16 items-center lg:pt-0 px-4">
          {/* LEFT: Text */}
          <motion.div
            initial={{ opacity: 0, x: -35 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center text-center lg:items-start lg:text-left"
          >
            {/* Top Company Badge (Matching Reference Image) */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-brand-yellow/30 bg-brand-yellow/5 backdrop-blur-sm mb-12">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-yellow shadow-[0_0_8px_#f5c518]"></span>
              <span className="text-[10px] uppercase tracking-[0.35em] font-bold text-brand-yellow">Governance</span>
            </div>

            <h1 className="text-[clamp(2.5rem,6vw,5.5rem)] font-semibold leading-[0.95] tracking-tighter uppercase mb-8 text-white text-center lg:text-left">
              LEADERSHIP <br /> <span className="text-brand-yellow">& COMMITTEES</span>
            </h1>

            <p className="text-xl text-white/50 max-w-xl leading-relaxed font-medium text-center lg:text-left">
              "Meet the experienced executives driving DigiPowerX's vision of revolutionizing AI infrastructure and sustainable data center operations."
            </p>
          </motion.div>

          {/* RIGHT: 3D Animation */}
          <motion.div
            initial={{ opacity: 0, x: 35 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            className="w-full h-[340px] sm:h-[380px] lg:h-[550px] lg:min-h-[600px] relative overflow-hidden"
          >
            <LeadershipHeroVisual3D />
          </motion.div>
        </div>
      </section>

      {/* Executive Team Grid */}
      <section className="py-16 bg-black relative border-t border-white/5">
        <div className="container mx-auto px-6 max-w-[1400px]">
          <div className="mb-24">
            <div className="text-[10px] font-semibold uppercase tracking-[0.5em] text-brand-yellow mb-6">Executive Council</div>
            <h2 className="text-[clamp(2.5rem,6vw,5.5rem)] font-semibold leading-[0.95] tracking-tighter uppercase text-white mb-8 relative z-10">THE <span className="text-white/40">TEAM</span></h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {executives.map((exec, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                onClick={() => setSelectedLeader(exec)}
                className="group cursor-pointer"
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl mb-8 border border-white/10">
                  <img
                    src={exec.img}
                    alt={exec.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                  <div className="absolute bottom-8 left-8">
                    <div className="h-0.5 w-12 bg-brand-yellow mb-4 group-hover:w-20 transition-all duration-500" />
                    <h3 className="text-3xl font-semibold uppercase tracking-tighter mb-1">{exec.name}</h3>
                    <div className="text-[10px] font-semibold text-brand-yellow uppercase tracking-widest">{exec.role}</div>
                  </div>

                  <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 rounded-full bg-brand-yellow text-black flex items-center justify-center">
                      <ChevronRight size={20} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Board of Directors Section */}
      <section className="py-16 bg-[#050608] text-white relative overflow-hidden border-t border-white/5">
        {/* Soft Ambient Technical Background Glows */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-brand-yellow/[0.02] blur-[120px] pointer-events-none" />

        <div className="container mx-auto px-6 max-w-[1400px] relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">

            {/* Title & Info Pane */}
            <div className="lg:col-span-5 space-y-8 order-1 lg:order-2">
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.5em] text-brand-yellow mb-6">Governance Body</div>
                <h2 className="text-[clamp(2.5rem,6vw,5.5rem)] font-semibold leading-[0.95] tracking-tighter uppercase text-white mb-8 relative z-10">
                  BOARD OF <br /> <span className="text-white/40">DIRECTORS</span>
                </h2>
              </div>

              <div className="space-y-6">
                <p className="text-white/60 text-lg font-medium leading-relaxed max-w-md">
                  A distinguished assembly of industry veterans and legal counsel providing compliance-driven, corporate stewardship for DigiPowerX's global energy and high-density computing scaling.
                </p>
                <div className="h-0.5 w-16 bg-brand-yellow/30" />
                <div className="text-[10px] font-semibold text-white/30 uppercase tracking-[0.25em]">
                  Interactive Roster • Click a name to view biography
                </div>
              </div>
            </div>

            {/* Roster & Interactive Accordion Pane */}
            <div className="lg:col-span-7 space-y-4 order-2 lg:order-1">
              {boardMembers.map((member, i) => {
                const isExpanded = expandedBoardMember === i;
                return (
                  <div
                    key={i}
                    onClick={() => setExpandedBoardMember(isExpanded ? null : i)}
                    className={`group border transition-all duration-500 p-6 rounded-3xl cursor-pointer flex flex-col items-start gap-4 ${isExpanded
                      ? 'border-brand-yellow/40 bg-white/[0.03] shadow-[0_12px_40px_rgba(245,197,24,0.05)]'
                      : 'border-white/5 bg-white/[0.01] hover:border-white/20 hover:bg-white/[0.02]'
                      }`}
                  >
                    {/* Header Row */}
                    <div className="flex items-center gap-6 w-full">
                      <div className={`w-16 h-16 rounded-full overflow-hidden border flex-shrink-0 bg-white/5 transition-all duration-500 ${isExpanded ? 'border-brand-yellow/40 ring-4 ring-brand-yellow/10' : 'border-white/10'
                        }`}>
                        <img
                          src={member.img}
                          alt={member.name}
                          className={`w-full h-full object-cover transition-all duration-500 scale-[1.02] ${isExpanded ? 'grayscale-0' : 'grayscale group-hover:grayscale-0 group-hover:scale-110'
                            }`}
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className={`text-2xl font-semibold uppercase tracking-tighter transition-colors ${isExpanded ? 'text-brand-yellow' : 'text-white group-hover:text-brand-yellow'
                          }`}>{member.name}</h4>
                        <div className="text-[10px] font-semibold text-white/40 uppercase tracking-widest mt-1">{member.role}</div>
                      </div>

                      {/* Interactive Chevron Indicators */}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-500 ${isExpanded
                        ? 'border-brand-yellow/40 bg-brand-yellow/10 text-brand-yellow rotate-90'
                        : 'border-white/10 text-white/40 group-hover:border-white/20 group-hover:text-white'
                        }`}>
                        <ChevronRight size={18} />
                      </div>
                    </div>

                    {/* Expandable Biography Section */}
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden w-full"
                        >
                          <div className="pt-6 mt-6 border-t border-white/10 flex flex-col md:flex-row gap-6 items-start text-white/70">
                            <div className="w-24 h-24 rounded-2xl overflow-hidden border border-white/10 flex-shrink-0 bg-white/5 self-center md:self-start shadow-xl">
                              <img src={member.img} alt={member.name} className="w-full h-full object-cover scale-[1.02]" />
                            </div>
                            <div className="flex-1 space-y-4">
                              <p className="text-base font-medium leading-relaxed text-white/80">
                                {member.bio}
                              </p>
                              {/* Corporate Contact Utility Handles */}
                              <div className="flex gap-3 pt-2">
                                <a href="https://www.linkedin.com/company/digi-power-x/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-xl font-semibold text-[10px] uppercase tracking-widest hover:bg-brand-yellow transition-all duration-300">
                                  <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0h.003z" />
                                  </svg>
                                  LinkedIn
                                </a>
                                <Link to="/contact" className="flex items-center gap-2 bg-white/5 border border-white/10 text-white px-5 py-2.5 rounded-xl font-semibold text-[10px] uppercase tracking-widest hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                                  <Mail size={12} className="text-white/60" />
                                  Contact
                                </Link>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </section>

      {/* Leader Bio Modal */}
      <AnimatePresence>
        {selectedLeader && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-6 md:p-12 bg-black/95 backdrop-blur-2xl"
          >
            <button
              onClick={() => setSelectedLeader(null)}
              className="absolute top-12 right-12 text-white/50 hover:text-white transition-colors"
            >
              <X size={40} />
            </button>

            <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="aspect-[4/5] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                <img src={selectedLeader.img} alt={selectedLeader.name} className="w-full h-full object-cover" />
              </div>
              <div className="space-y-8">
                <div>
                  <div className="h-1 w-24 bg-brand-yellow mb-8" />
                  <h3 className="text-[clamp(2.5rem,6vw,5.5rem)] font-semibold leading-[0.95] tracking-tighter uppercase text-white mb-8 relative z-10 leading-none mb-4">{selectedLeader.name}</h3>
                  <div className="text-xl font-semibold text-brand-yellow uppercase tracking-[0.2em]">{selectedLeader.role}</div>
                </div>
                <p className="text-lg md:text-xl text-white/60 font-medium leading-relaxed italic">
                  "{selectedLeader.bio}"
                </p>
                <div className="flex gap-6 pt-8">
                  <a href="https://www.linkedin.com/company/digi-power-x/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-white text-black px-8 py-4 rounded-xl font-semibold text-xs uppercase tracking-widest hover:bg-brand-yellow transition-all">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    LinkedIn
                  </a>
                  <Link to="/contact" className="flex items-center gap-3 bg-white/5 border border-white/10 text-white px-8 py-4 rounded-xl font-semibold text-xs uppercase tracking-widest hover:bg-white/10 transition-all">
                    <Mail size={18} />
                    Contact
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Committees Section */}
      <section className="py-16 bg-[#050608] text-white relative border-t border-white/5 overflow-hidden">
        {/* Soft Ambient Technical Background Glows */}
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-brand-yellow/[0.02] blur-[120px] pointer-events-none" />

        <div className="container mx-auto px-6 max-w-[1400px] relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">

            {/* Title & Info Pane */}
            <div className="lg:col-span-5 space-y-8 order-1">
              <div>
                <div className="inline-flex items-center gap-3 mb-6">
                  <div className="w-1.5 h-1.5 bg-brand-yellow rounded-full" />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.4em] text-white/50">Corporate Governance</span>
                </div>
                <h2 className="text-[clamp(2.5rem,5vw,4.5rem)] font-semibold leading-[0.95] tracking-tighter uppercase text-white">
                  BOARD <br /><span className="text-white/40">COMMITTEES</span>
                </h2>
              </div>

              <div className="space-y-6">
                <p className="text-white/60 text-lg font-medium leading-relaxed max-w-md">
                  Dedicated oversight ensuring financial integrity, strategic alignment, and rigorous compliance across all operations.
                </p>
                <div className="h-0.5 w-16 bg-brand-yellow/30" />
                <div className="text-[10px] font-semibold text-white/30 uppercase tracking-[0.25em]">
                  Select a committee to view its mandate
                </div>
              </div>
            </div>

            {/* Accordion Pane */}
            <div className="lg:col-span-7 space-y-4 order-2">
              {[
                {
                  title: "Audit Committee",
                  desc: "Responsible for overseeing the company's financial reporting process, internal controls, and compliance with legal and regulatory requirements.",
                  chair: "Gerard Rotonda",
                  members: ["Adam S. Rossman", "Ajay Gupta"]
                },
                {
                  title: "Compensation Committee",
                  desc: "Responsible for overseeing executive compensation and ensuring alignment with long-term shareholder value.",
                  chair: "Adam S. Rossman",
                  members: ["Gerard Rotonda"]
                },
                {
                  title: "Governance & Nomination",
                  desc: "Responsible for overseeing the company's corporate governance practices and identifying qualified individuals to become board members.",
                  chair: "Adam S. Rossman",
                  members: ["Alec Amar", "Ajay Gupta"]
                },
                {
                  title: "Disclosure Committee",
                  desc: "Responsible for ensuring that the company's public disclosures are accurate, complete, and timely.",
                  chair: "Michel Amar",
                  members: ["Gerard Rotonda", "Adam S. Rossman"]
                }
              ].map((committee, i) => {
                const isExpanded = expandedCommittee === i;
                return (
                  <div
                    key={i}
                    onClick={() => setExpandedCommittee(isExpanded ? null : i)}
                    className={`group border transition-all duration-500 p-6 rounded-3xl cursor-pointer flex flex-col items-start gap-4 ${isExpanded
                      ? 'border-brand-yellow/40 bg-white/[0.03] shadow-[0_12px_40px_rgba(245,197,24,0.05)]'
                      : 'border-white/5 bg-white/[0.01] hover:border-white/20 hover:bg-white/[0.02]'
                      }`}
                  >
                    {/* Header Row */}
                    <div className="flex items-center gap-6 w-full">
                      <div className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center font-mono font-semibold text-lg flex-shrink-0 transition-all duration-500 border ${isExpanded ? 'bg-brand-yellow text-black border-brand-yellow/40 ring-4 ring-brand-yellow/10' : 'bg-white/5 text-white/40 border-white/10 group-hover:border-white/20 group-hover:text-white'
                        }`}>
                        0{i + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className={`text-xl md:text-2xl font-semibold uppercase tracking-tighter transition-colors ${isExpanded ? 'text-brand-yellow' : 'text-white group-hover:text-brand-yellow'
                          }`}>{committee.title}</h4>
                      </div>

                      {/* Interactive Chevron Indicators */}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-500 ${isExpanded
                        ? 'border-brand-yellow/40 bg-brand-yellow/10 text-brand-yellow rotate-90'
                        : 'border-white/10 text-white/40 group-hover:border-white/20 group-hover:text-white'
                        }`}>
                        <ChevronRight size={18} />
                      </div>
                    </div>

                    {/* Expandable Description and Members Section */}
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden w-full"
                        >
                          <div className="pt-6 mt-6 border-t border-white/10 text-white/70">
                            <p className="text-base font-medium leading-relaxed text-white/80 mb-8">
                              {committee.desc}
                            </p>

                            <div className="bg-black/40 rounded-2xl p-6 border border-white/5">
                              <div className="flex justify-between items-center pb-4 mb-4 border-b border-white/10">
                                <div>
                                  <div className="text-sm font-semibold uppercase tracking-wider text-white">{committee.chair}</div>
                                  <div className="text-[10px] uppercase tracking-widest text-white/40 mt-1">Committee Chair</div>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-brand-yellow/10 text-brand-yellow flex items-center justify-center border border-brand-yellow/20">
                                  <span className="text-xs">✦</span>
                                </div>
                              </div>

                              <div className="space-y-4">
                                {committee.members.map((member, mIdx) => (
                                  <div key={mIdx} className="flex justify-between items-center">
                                    <div className="text-sm font-semibold uppercase tracking-wider text-white/70">{member}</div>
                                    <div className="text-[10px] uppercase tracking-widest text-white/30">Member</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </section>



      <CTASection />
    </div>
  );
};

export default Leadership;
