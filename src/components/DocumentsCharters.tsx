import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  FileText, 
  ChevronRight, 
  Download, 
  Lock, 
  ShieldCheck, 
  X,
  Printer,
  Calendar,
  AlertCircle,
  Terminal
} from 'lucide-react';
import { CTASection } from './Footer';
import DocumentsVisual3D from './DocumentsVisual3D';

/* ─── Motion Stagger Variants ─── */
const parentVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1
    }
  }
};

const badgeVariants = {
  hidden: { opacity: 0, y: -25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 110,
      damping: 14
    }
  }
};

const titleVariants = {
  hidden: { opacity: 0, y: 35 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.85,
      ease: [0.215, 0.61, 0.355, 1]
    }
  }
};

const descVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.75,
      ease: "easeOut"
    }
  }
};

// Sleek Glassmorphic Container
const GlassCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`relative group ${className}`}>
    <div className="absolute -inset-[1px] bg-gradient-to-r from-brand-yellow/20 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    <div className="relative h-full bg-[#0d0f14]/80 backdrop-blur-2xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
      {children}
    </div>
  </div>
);

const DocumentsCharters = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedDoc, setSelectedDoc] = useState<any | null>(null);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  // Categories list
  const categories = ["All Categories", "Governance", "Policies", "Charters", "Resolutions"];

  // Corporate Documents Data
  const documents = [
    {
      id: 1,
      ref: "DPX-GOV-001",
      category: "Governance",
      title: "Code of Business Conduct and Ethics",
      description: "Our company code of conduct for employees and leadership.",
      date: "Amended Q1 2026",
      fullText: `DigiPowerX is committed to maintaining the highest standards of integrity, ethical behavior, and corporate stewardship. This Code of Business Conduct and Ethics establishes critical boundaries for conflicts of interest, corporate opportunity, fair dealing, protection of proprietary high-density computing algorithms, public reporting standards, and absolute compliance with state and federal laws.\n\nAll directors, officers, consultants, and developers are required to align their activities with this code. Compliance failures are subject to immediate audit review, termination, and legal prosecution where applicable.`
    },
    {
      id: 2,
      ref: "DPX-POL-002",
      category: "Policies",
      title: "Disclosure and Confidentiality Policy",
      description: "Policies to ensure proper disclosure and confidentiality of information.",
      date: "Updated Q4 2025",
      fullText: `To safeguard DigiPowerX's market positioning and intellectual assets, this Disclosure and Confidentiality Policy regulates all external releases of proprietary data center telemetry, network layouts, energy integration solutions, and computational capacities.\n\nOnly authorized Sec-16 reporting officers may execute public disclosures. Unauthorized dissemination of internal documents, customer architectures, or infrastructure properties constitutes a critical security breach and a direct violation of regulatory protocols.`
    },
    {
      id: 3,
      ref: "DPX-GOV-003",
      category: "Governance",
      title: "DGXX Compiled Constating Documents",
      description: "Official constating documents for DigiPowerX and related entities.",
      date: "Registered 2025",
      fullText: `This ledger represents the legally compiled Articles of Incorporation, regulatory bylaws, corporate registries, and state franchise documentation constituting the legal basis of DigiPowerX and its energy-integrated subsidiaries.\n\nAny internal bylaws amendments require a complete board review, director validation, and major shareholding approval before state registry updates.`
    },
    {
      id: 4,
      ref: "DPX-POL-004",
      category: "Policies",
      title: "Majority Voting Policy",
      description: "Policy governing majority voting procedures for DigiPowerX.",
      date: "Ratified Q2 2025",
      fullText: `In uncontested director elections, nominees must obtain a clear majority of votes cast (votes 'For' must exceed votes 'Withheld') to assume corporate board authority. \n\nIf a sitting director fails to achieve a majority, they must proffer their immediate resignation to the Governance & Nominating Committee. The committee will evaluate the resignation and present structural recommendations to the full board within 90 days.`
    },
    {
      id: 5,
      ref: "DPX-CHAR-005",
      category: "Charters",
      title: "Audit Committee Charter",
      description: "Charter establishing the roles and responsibilities of the Audit Committee.",
      date: "Updated Q3 2025",
      fullText: `The Audit Committee Charter outlines the oversight responsibilities regarding the integrity of DigiPowerX's financial statements, internal control perimeters, independent auditor qualifications, and strict regulatory disclosures.\n\nThe committee has direct authority to retain independent legal, financial, or technical counsel to investigate operational anomalies or check computing resource allocations.`
    },
    {
      id: 6,
      ref: "DPX-RES-006",
      category: "Resolutions",
      title: "Board Resolution Amending Compensation Committee Charter",
      description: "BOD Resolution amending CC Charter, Confirm Director Independence, and Designation of Sec 16 Reporting Persons.",
      date: "Passed Q4 2025",
      fullText: `RESOLVED, that the Board of Directors hereby approves the targeted amendments to the Compensation Committee Charter to align executive incentives with long-term computational power goals.\n\nBE IT FURTHER RESOLVED, that the Board confirms the independent status of all serving Compensation Committee directors and designates designated executive leadership as Section 16 reporting persons under Exchange Act standards.`
    },
    {
      id: 7,
      ref: "DPX-GOV-007",
      category: "Governance",
      title: "Board Mandate",
      description: "Official mandate outlining the Board's governance structure and authority.",
      date: "Ratified Q1 2026",
      fullText: `The Board Mandate defines the formal authority, stewardship framework, and compliance-driven responsibilities of DigiPowerX's Board of Directors.\n\nResponsibilities include reviewing corporate direction, verifying physical asset security, approving multi-megawatt energy purchases, managing executive successions, and protecting long-term investor equity.`
    }
  ];

  // Search and category filtering
  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All Categories" || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDownload = (docId: number) => {
    setDownloadingId(docId);
    setTimeout(() => {
      setDownloadingId(null);
    }, 1500);
  };

  return (
    <div className="bg-[#050608] min-h-screen text-white selection:bg-brand-yellow selection:text-black">
      
      {/* Centered Hero Section with 3D Neural Overlay */}
      <section className="relative min-h-[60vh] flex flex-col items-center justify-center pt-48 pb-20 px-6 overflow-hidden">
        
        {/* Background Grid Accent */}
        <div className="absolute inset-0 z-0 opacity-15">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(245,197,24,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(245,197,24,0.08)_1px,transparent_1px)] bg-[size:40px_40px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,197,24,0.15),transparent_60%)]" />
        </div>

        {/* Holographic Compliance Vault 3D Background */}
        <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
          <div className="w-full h-full max-w-6xl">
            <DocumentsVisual3D />
          </div>
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center flex flex-col items-center">
          <motion.div
            variants={parentVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center w-full"
          >
            <motion.div 
              variants={badgeVariants}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-yellow/30 bg-brand-yellow/5 backdrop-blur-sm mb-8"
            >
              <Lock size={12} className="text-brand-yellow" />
              <span className="text-[9px] uppercase tracking-[0.4em] font-mono text-brand-yellow font-semibold">
                SECURE INVESTOR COMPLIANCE VAULT
              </span>
            </motion.div>

            <div className="overflow-hidden mb-8">
              <motion.h1 
                variants={titleVariants}
                className="text-[clamp(2.5rem,6vw,5.5rem)] font-semibold leading-[0.95] tracking-tighter uppercase text-white"
              >
                DOCUMENTS & <span className="text-brand-yellow">CHARTERS</span>
              </motion.h1>
            </div>

            <motion.p 
              variants={descVariants}
              className="text-white/60 text-sm md:text-lg max-w-2xl mx-auto leading-relaxed font-medium tracking-wide"
            >
              Access all official governance documents, charters, and regulatory compliance policies for DigiPowerX.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Interactive Search Console & Grid */}
      <section className="py-20 relative border-t border-white/5 bg-[#0a0a0c]">
        <div className="container mx-auto px-6 max-w-[1400px]">
          
          {/* Controls Bar */}
          <div className="max-w-6xl mx-auto mb-16">
            <GlassCard className="p-1">
              <div className="grid grid-cols-1 md:grid-cols-3 items-center">
                
                {/* Search Bar */}
                <div className="p-6 border-b md:border-b-0 md:border-r border-white/5 col-span-2">
                  <h3 className="text-[10px] font-mono font-semibold uppercase tracking-widest text-brand-yellow mb-2">Search Ledger</h3>
                  <div className="flex items-center gap-3">
                    <Search size={18} className="text-white/40" />
                    <input 
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Title or Keyword" 
                      className="bg-transparent border-none outline-none text-white text-base font-semibold w-full placeholder:text-white/20 focus:ring-0"
                    />
                  </div>
                </div>

                {/* Category Selector */}
                <div className="p-6">
                  <h3 className="text-[10px] font-mono font-semibold uppercase tracking-widest text-brand-yellow mb-2">Category</h3>
                  <div className="flex flex-wrap gap-2">
                    <select 
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="bg-transparent border-none outline-none text-white text-base font-semibold w-full appearance-none cursor-pointer focus:ring-0"
                    >
                      {categories.map((cat, i) => (
                        <option key={i} className="bg-[#0d0f14]" value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

              </div>
            </GlassCard>
          </div>

          {/* Grid Layout of Document Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {filteredDocs.map((doc, idx) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                viewport={{ once: true }}
                className="group relative border border-white/5 rounded-3xl p-8 bg-[#0d0f14]/50 hover:border-brand-yellow/30 transition-all duration-500 flex flex-col justify-between min-h-[300px]"
              >
                <div>
                  {/* Top Metadata */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-[9px] font-mono font-semibold uppercase tracking-widest text-brand-yellow bg-brand-yellow/5 px-2.5 py-1 rounded border border-brand-yellow/20">
                      {doc.ref}
                    </span>
                    <span className="text-[9px] text-white/30 font-mono uppercase">
                      {doc.category}
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold uppercase tracking-tighter mb-4 text-white group-hover:text-brand-yellow transition-colors duration-300">
                    {doc.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-white/55 font-medium mb-6">
                    {doc.description}
                  </p>
                </div>

                {/* Bottom Actions */}
                <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-auto">
                  <button 
                    onClick={() => setSelectedDoc(doc)}
                    className="text-[10px] font-mono font-semibold uppercase tracking-widest text-white/60 hover:text-brand-yellow flex items-center gap-1.5 transition-colors group/btn"
                  >
                    Read More 
                    <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>

                  <button 
                    onClick={() => handleDownload(doc.id)}
                    className="w-8 h-8 rounded-full bg-white/5 hover:bg-brand-yellow hover:text-black flex items-center justify-center text-white/60 transition-all"
                    title="Download Document"
                  >
                    {downloadingId === doc.id ? (
                      <div className="w-4 h-4 rounded-full border border-current border-t-transparent animate-spin" />
                    ) : (
                      <Download size={14} />
                    )}
                  </button>
                </div>
              </motion.div>
            ))}

            {filteredDocs.length === 0 && (
              <div className="col-span-full text-center py-20 border border-white/5 bg-white/[0.01] rounded-3xl space-y-4">
                <div className="text-white/30 text-lg font-medium">No governance documents matched your filter parameters</div>
                <button 
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All Categories");
                  }}
                  className="text-xs font-mono font-semibold uppercase tracking-widest text-brand-yellow hover:underline"
                >
                  Reset Parameters
                </button>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* Advanced Technical PDF/Document Viewer Modal */}
      <AnimatePresence>
        {selectedDoc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedDoc(null)}
            className="fixed inset-0 z-[99999] flex items-center justify-center p-4 md:p-12 bg-black/95 backdrop-blur-2xl"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-4xl w-full bg-[#0d0f14] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh] relative"
            >

              {/* Secure Header console */}
              <div className="bg-[#050608] border-b border-white/5 px-8 py-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/50 flex items-center gap-2">
                    <span>SECURE STREAM</span>
                    <span className="text-white/20">•</span>
                    <span className="text-brand-yellow font-semibold">{selectedDoc.ref}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDownload(selectedDoc.id)}
                    className="p-2 text-white/40 hover:text-white transition-colors"
                    title="Download"
                  >
                    <Download size={16} />
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="p-2 text-white/40 hover:text-white transition-colors"
                    title="Print"
                  >
                    <Printer size={16} />
                  </button>
                  <button
                    onClick={() => setSelectedDoc(null)}
                    className="ml-2 flex items-center justify-center w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
                    title="Close"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Document Text Body Area */}
              <div className="p-8 md:p-12 overflow-y-auto space-y-8 flex-1">
                
                {/* Meta details */}
                <div className="flex flex-wrap items-center gap-4 justify-between border-b border-white/5 pb-6">
                  <div>
                    <span className="text-[10px] font-mono text-brand-yellow uppercase tracking-widest">{selectedDoc.category}</span>
                    <h2 className="text-2xl md:text-3xl font-semibold uppercase tracking-tighter text-white mt-1">
                      {selectedDoc.title}
                    </h2>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-mono text-white/40 uppercase">Archived Date</div>
                    <div className="text-xs font-semibold text-white/70 uppercase tracking-widest">{selectedDoc.date}</div>
                  </div>
                </div>

                {/* Secure Verification Box */}
                <div className="border border-emerald-500/20 rounded-xl p-4 bg-emerald-500/[0.02] flex items-start gap-4">
                  <ShieldCheck size={20} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                  <div className="space-y-1">
                    <div className="text-[10px] font-mono uppercase tracking-widest text-emerald-500 font-semibold">Integrity Hash Verified</div>
                    <p className="text-[10px] font-mono text-white/40 break-all">
                      SHA-256: 3a7f8b9c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a
                    </p>
                  </div>
                </div>

                {/* The formal policy content paragraphs */}
                <div className="prose prose-invert max-w-none text-white/70 text-sm md:text-base leading-relaxed space-y-6 font-medium">
                  {selectedDoc.fullText.split("\n\n").map((para: string, pIdx: number) => (
                    <p key={pIdx}>{para}</p>
                  ))}
                </div>

              </div>

              {/* Secure Footer Console */}
              <div className="bg-[#050608] border-t border-white/5 px-8 py-4 flex items-center justify-between text-[10px] font-mono text-white/30">
                <span>DIGIPOWERX COMPLIANCE ARCHIVE</span>
                <span>STATUS: STABLE</span>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <CTASection />
    </div>
  );
};

export default DocumentsCharters;
