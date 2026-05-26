import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  MapPin,
  Briefcase,
  Cpu,
  ShieldCheck,
  Settings,
  Users,
  ChevronRight,
  CheckCircle2,
  Terminal,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { CTASection } from './Footer';
import CareersHeroVisual3D from './CareersHeroVisual3D';

/* ─── Strapi API base ─── */
const STRAPI_BASE = "https://thankful-miracle-1ed8bdfdaf.strapiapp.com";
const OPEN_POSITIONS_API = `${STRAPI_BASE}/api/open-positions`;

// Upgraded Glassmorphic Card Container
const GlassCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`relative group ${className}`}>
    <div className="absolute -inset-[1px] bg-gradient-to-r from-brand-yellow/20 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    <div className="relative h-full bg-[#0d0f14]/80 backdrop-blur-2xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
      {children}
    </div>
  </div>
);

/* ─── Types ─── */
interface StrapiPosition {
  id: number;
  documentId: string;
  title: string;
  location: string | null;
  jobType: string | null;
  description: string | null;
  roleSummary: string | null;
  responsibilities: string | null;
  requiredExperience: string | null;
  reportsTo: string | null;
}

interface JobPosition {
  id: number;
  title: string;
  location: string;
  type: string;
  dept: string;
  description: string;
  responsibilities: string[];
  qualifications: string[];
}

/* ─── Helpers ─── */
// Helper to parse markdown-like bullet points from Strapi text fields
const parseBullets = (text: string | null): string[] => {
  if (!text) return [];
  return text
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.startsWith('-') || line.startsWith('•'))
    .map(line => line.replace(/^[-•]\s*/, ''));
};

const mapStrapiToJob = (item: StrapiPosition): JobPosition => {
  return {
    id: item.id,
    title: item.title || "Untitled Position",
    location: item.location || "Remote",
    type: item.jobType || "Full-time",
    // Use reportsTo or a default for department
    dept: item.reportsTo ? "Engineering" : "Operations",
    description: item.roleSummary || item.description || "",
    responsibilities: parseBullets(item.responsibilities),
    qualifications: parseBullets(item.requiredExperience),
  };
};

const Careers = () => {
  // Data State
  const [positions, setPositions] = useState<JobPosition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Interactive State
  const [expandedJob, setExpandedJob] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [selectedDept, setSelectedDept] = useState("All Domains");
  const [submittedForms, setSubmittedForms] = useState<Record<number, boolean>>({});

  // Mock Form States
  const [applicantNames, setApplicantNames] = useState<Record<number, string>>({});
  const [applicantEmails, setApplicantEmails] = useState<Record<number, string>>({});
  const [applicantLinks, setApplicantLinks] = useState<Record<number, string>>({});

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        setLoading(true);
        setError(null);
        // Fetch up to 100 positions
        const res = await fetch(`${OPEN_POSITIONS_API}?populate=*&pagination[pageSize]=100`);
        if (!res.ok) throw new Error(`API returned ${res.status}`);

        const json = await res.json();
        const mappedData = json.data.map(mapStrapiToJob);
        setPositions(mappedData);
      } catch (err: any) {
        console.error("Failed to fetch open positions:", err);
        setError(err.message || "Failed to load open positions.");
      } finally {
        setLoading(false);
      }
    };

    fetchPositions();
  }, []);

  const pathways = [
    {
      num: "01",
      icon: Cpu,
      title: "HPC Engineering",
      description: "Architect the physical and digital backbone of global high-performance computing. Build high-density power grids and hyper-scale parallel clusters.",
      skills: ["HPC Clusters", "Thermal Modeling", "Liquid Cooling", "RDMA Fabric"]
    },
    {
      num: "02",
      icon: ShieldCheck,
      title: "Cyber Security",
      description: "Enforce ultra-resilient zero-trust architectures for advanced computing pipelines. Shield high-value AI workloads from edge to core.",
      skills: ["Zero-Trust Networking", "HPC Guardrails", "Kubernetes Sec", "Intrusion Defense"]
    },
    {
      num: "03",
      icon: Settings,
      title: "AI Factory Ops",
      description: "Manage hyper-scale data center ecosystems. Deliver mission-critical reliability and power efficiency for enterprise workloads.",
      skills: ["SLA Automation", "GPU Overclocking", "Modular Grid Tech", "Kubernetes"]
    },
    {
      num: "04",
      icon: Users,
      title: "Global Scaling",
      description: "Scale the reach of modular computing resources. Formulate international power acquisitions and key corporate alliances.",
      skills: ["Power Purchasing", "Global Logistics", "Capital Strategy", "Alliances"]
    }
  ];

  // Dynamic Filtering Logic
  const filteredPositions = positions.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLoc = job.location.toLowerCase().includes(searchLocation.toLowerCase());
    const matchesDept = selectedDept === "All Domains" || job.dept === selectedDept;
    return matchesSearch && matchesLoc && matchesDept;
  });

  const handleApplySubmit = (jobId: number, e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantNames[jobId] || !applicantEmails[jobId]) return;
    setSubmittedForms(prev => ({ ...prev, [jobId]: true }));
  };

  return (
    <div className="bg-[#050608] min-h-screen text-white selection:bg-brand-yellow selection:text-black">

      {/* Hero Section */}
      <section className="relative min-h-[80vh] md:min-h-screen flex items-center pt-28 md:pt-36 pb-16 md:pb-24 px-4 sm:px-6 overflow-hidden">
        <div className="relative z-10 w-full max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start lg:pt-12">
          {/* LEFT: Text */}
          <div className="flex flex-col items-start text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-yellow/30 bg-brand-yellow/5 backdrop-blur-sm mb-8"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-brand-yellow shadow-[0_0_8px_#f5c518] animate-ping"></span>
              <span className="text-[9px] uppercase tracking-[0.4em] font-mono text-brand-yellow font-semibold">
                Now Recruiting Technical Nodes Globally
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-[clamp(2.5rem,6vw,5.5rem)] font-semibold leading-[0.95] tracking-tighter uppercase mb-8 text-white"
            >
              <span className="block text-white">BUILDING THE</span>
              <span className="block text-brand-yellow">FUTURE OF COMPUTE</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-white/60 text-sm md:text-lg max-w-xl mb-12 leading-relaxed font-medium tracking-wide"
            >
              Join DigiPowerX in engineering zero-loss, liquid-cooled modular platforms powering the world's most massive AI clusters and high-density technical workloads.
            </motion.p>
          </div>

          {/* RIGHT: 3D Animation */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full min-h-[400px] md:min-h-[500px] lg:min-h-[580px] relative"
          >
            <CareersHeroVisual3D />
          </motion.div>
        </div>
      </section>

      {/* Domain Expertise Pathways Grid */}
      <section className="py-16 md:py-32 bg-[#0a0a0c] border-y border-white/5 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(245,197,24,0.01),transparent_50%)] pointer-events-none" />
        <div className="container mx-auto px-4 sm:px-6 max-w-[1400px]">

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8 mb-12 md:mb-24">
            <div className="max-w-2xl">
              <div className="text-[10px] font-mono font-semibold text-brand-yellow uppercase tracking-[0.3em] mb-4">Domain Expertise</div>
              <h2 className="text-[clamp(2.2rem,5vw,4.5rem)] font-semibold leading-[0.95] tracking-tighter uppercase text-white">Career Pathways</h2>
            </div>
            <p className="text-white/40 max-w-md text-sm md:text-base leading-relaxed md:pb-2">
              Our workforce is decentralized but unified. Choose your computational domain and help us power the next industrial revolution.
            </p>
          </div>

          {/* Upgraded Pathways Tech Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {pathways.map((path, idx) => {
              const Icon = path.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="group relative border border-white/5 rounded-3xl p-6 sm:p-8 bg-[#0d0f14]/40 hover:border-brand-yellow/30 transition-all duration-500 flex flex-col justify-between min-h-[300px] sm:min-h-[360px] overflow-hidden cursor-pointer"
                >
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(245,197,24,0.02),transparent_40%)] pointer-events-none" />

                  <div>
                    <div className="flex items-center justify-between mb-8">
                      <span className="text-3xl font-semibold tracking-tighter text-white/10 font-mono group-hover:text-brand-yellow/30 transition-colors">{path.num}</span>
                      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 group-hover:bg-brand-yellow group-hover:border-brand-yellow group-hover:text-black transition-all duration-500">
                        <Icon size={20} />
                      </div>
                    </div>

                    <h3 className="text-2xl font-semibold uppercase tracking-tighter mb-4 text-white group-hover:text-brand-yellow transition-colors">{path.title}</h3>
                    <p className="text-xs font-medium leading-relaxed text-white/40 mb-6">{path.description}</p>
                  </div>

                  {/* Skill Labels */}
                  <div className="flex flex-wrap gap-2 pt-6 border-t border-white/5">
                    {path.skills.map((skill, sIdx) => (
                      <span key={sIdx} className="px-2.5 py-1 rounded-md bg-white/5 border border-white/5 text-[8px] font-mono font-semibold uppercase tracking-widest text-white/40 group-hover:text-brand-yellow/60 group-hover:border-brand-yellow/10 transition-colors">
                        {skill}
                      </span>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Technical Console Search & Filter */}
      <section className="py-16 md:py-32 relative">
        <div className="container mx-auto px-4 sm:px-6 max-w-[1400px]">
          <div className="max-w-6xl mx-auto">
            <GlassCard className="p-1">
              <div className="grid grid-cols-1 md:grid-cols-4 items-center">

                {/* Text Filter Input */}
                <div className="p-6 sm:p-8 border-b md:border-b-0 md:border-r border-white/5">
                  <h3 className="text-[10px] font-mono font-semibold uppercase tracking-widest text-brand-yellow mb-2">Search Roles</h3>
                  <div className="flex items-center gap-3">
                    <Search size={18} className="text-white/40" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Title or Keyword"
                      className="bg-transparent border-none outline-none text-white text-lg font-semibold w-full placeholder:text-white/20 focus:ring-0"
                    />
                  </div>
                </div>

                {/* Location Filter Input */}
                <div className="p-6 sm:p-8 border-b md:border-b-0 md:border-r border-white/5">
                  <h3 className="text-[10px] font-mono font-semibold uppercase tracking-widest text-brand-yellow mb-2">Location</h3>
                  <div className="flex items-center gap-3">
                    <MapPin size={18} className="text-white/40" />
                    <input
                      type="text"
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      placeholder="Remote or City"
                      className="bg-transparent border-none outline-none text-white text-lg font-semibold w-full placeholder:text-white/20 focus:ring-0"
                    />
                  </div>
                </div>

                {/* Department Dropdown Selector */}
                <div className="p-6 sm:p-8 border-b md:border-b-0 md:border-r border-white/5">
                  <h3 className="text-[10px] font-mono font-semibold uppercase tracking-widest text-brand-yellow mb-2">Department</h3>
                  <div className="flex items-center gap-3">
                    <Briefcase size={18} className="text-white/40" />
                    <select
                      value={selectedDept}
                      onChange={(e) => setSelectedDept(e.target.value)}
                      className="bg-transparent border-none outline-none text-white text-lg font-semibold w-full appearance-none cursor-pointer focus:ring-0"
                    >
                      <option className="bg-[#0d0f14]" value="All Domains">All Domains</option>
                      <option className="bg-[#0d0f14]" value="Engineering">Engineering</option>
                      <option className="bg-[#0d0f14]" value="Operations">Operations</option>
                    </select>
                  </div>
                </div>

                {/* Clear Filters Button */}
                <div className="p-6 sm:p-8">
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSearchLocation("");
                      setSelectedDept("All Domains");
                    }}
                    className="w-full h-full bg-white text-black font-semibold uppercase tracking-[0.2em] text-xs py-4 rounded-xl hover:bg-brand-yellow hover:scale-[1.02] active:scale-95 transition-all duration-300"
                  >
                    Reset Console
                  </button>
                </div>

              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* Open Positions Interactive Roster */}
      <section className="pb-20 md:pb-40">
        <div className="container mx-auto px-4 sm:px-6 max-w-[1400px]">

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 md:mb-16 border-b border-white/5 pb-6 md:pb-8">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
              <h2 className="text-[clamp(2.2rem,5vw,4.5rem)] font-semibold leading-[0.95] tracking-tighter uppercase text-white">Open Positions</h2>
              <div className="px-3 py-1 rounded bg-brand-yellow/10 border border-brand-yellow/20 text-brand-yellow font-mono text-[9px] uppercase tracking-widest font-semibold self-start sm:self-auto">
                Active Directory
              </div>
            </div>
            <div className="text-[10px] font-mono text-white/30 uppercase self-start sm:self-auto">
              Displaying {filteredPositions.length} matches
            </div>
          </div>

          {/* Loading / Error States */}
          {error && (
            <div className="flex flex-col items-center justify-center py-20 gap-4 border border-red-500/20 bg-red-500/5 rounded-3xl">
              <AlertTriangle className="text-red-500" size={32} />
              <p className="text-white/60 font-medium text-sm">{error}</p>
            </div>
          )}

          {loading && !error && (
            <div className="flex flex-col items-center justify-center py-32 gap-6 border border-white/5 bg-white/[0.01] rounded-3xl">
              <Loader2 className="animate-spin text-brand-yellow" size={40} />
              <p className="text-white/40 font-mono text-sm tracking-widest uppercase">Fetching Network Nodes...</p>
            </div>
          )}

          {!loading && !error && (
            <div className="max-w-6xl mx-auto space-y-4">
              {filteredPositions.map((job) => {
                const isExpanded = expandedJob === job.id;
                const isSubmitted = submittedForms[job.id];
                return (
                  <div
                    key={job.id}
                    className={`group border rounded-3xl p-5 sm:p-8 transition-all duration-500 flex flex-col items-start gap-4 ${isExpanded
                        ? 'border-brand-yellow/40 bg-white/[0.02] shadow-[0_12px_45px_rgba(245,197,24,0.03)]'
                        : 'border-white/5 bg-white/[0.01] hover:border-white/10 hover:bg-white/[0.015]'
                      }`}
                  >

                    {/* Job Header Row */}
                    <div
                      onClick={() => setExpandedJob(isExpanded ? null : job.id)}
                      className="flex items-center justify-between gap-4 w-full cursor-pointer"
                    >
                      <div className="flex-1 space-y-3 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                          <span className="text-[9px] sm:text-[10px] font-mono font-semibold uppercase tracking-widest text-brand-yellow bg-brand-yellow/5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded border border-brand-yellow/20">
                            {job.type}
                          </span>
                          <span className="flex items-center gap-1.5 text-[9px] sm:text-[10px] text-white/40 uppercase tracking-wider font-semibold">
                            <MapPin size={11} className="text-white/20" /> {job.location}
                          </span>
                          <span className="text-[9px] sm:text-[10px] text-white/40 font-mono">
                            • {job.dept}
                          </span>
                        </div>
                        <h3 className={`text-lg sm:text-xl md:text-2xl font-semibold tracking-tight transition-colors duration-300 break-words ${isExpanded ? 'text-brand-yellow' : 'text-white group-hover:text-brand-yellow'
                          }`}>
                          {job.title}
                        </h3>
                      </div>

                      <div className={`w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 rounded-full border flex items-center justify-center transition-all duration-500 ${isExpanded
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
                          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden w-full"
                        >
                          <div className="pt-8 mt-8 border-t border-white/10 space-y-8">

                            {/* Role Overview and Specs */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10">

                              <div className="lg:col-span-2 space-y-6">
                                <h4 className="text-xs font-mono font-semibold uppercase tracking-widest text-brand-yellow">Role Overview</h4>
                                <p className="text-sm leading-relaxed text-white/70 font-medium whitespace-pre-line">
                                  {job.description || "No detailed overview provided for this position."}
                                </p>

                                {job.responsibilities.length > 0 && (
                                  <>
                                    <h4 className="text-xs font-mono font-semibold uppercase tracking-widest text-brand-yellow pt-4">Key Responsibilities</h4>
                                    <ul className="space-y-3">
                                      {job.responsibilities.map((resp, rIdx) => (
                                        <li key={rIdx} className="flex gap-3 text-sm leading-relaxed text-white/70 font-medium">
                                          <span className="text-brand-yellow font-mono mt-0.5">•</span>
                                          <span>{resp}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </>
                                )}
                              </div>

                              <div className="p-6 sm:p-8 rounded-2xl bg-white/[0.01] border border-white/5 space-y-6 self-start">
                                <h4 className="text-xs font-mono font-semibold uppercase tracking-widest text-brand-yellow">Minimum Qualifications</h4>
                                {job.qualifications.length > 0 ? (
                                  <ul className="space-y-3">
                                    {job.qualifications.map((qual, qIdx) => (
                                      <li key={qIdx} className="flex gap-2.5 text-xs leading-relaxed text-white/50 font-medium">
                                        <span className="text-brand-yellow/40 font-mono mt-0.5">■</span>
                                        <span>{qual}</span>
                                      </li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p className="text-xs text-white/40">See role overview for specific requirements.</p>
                                )}
                              </div>

                            </div>

                            {/* Live Console Application Form */}
                            <div className="border border-brand-yellow/20 rounded-2xl p-6 sm:p-8 bg-brand-yellow/[0.01] relative overflow-hidden">
                              <div className="absolute top-0 right-0 p-8 opacity-[0.02] text-brand-yellow pointer-events-none">
                                <Terminal size={150} />
                              </div>

                              <AnimatePresence mode="wait">
                                {!isSubmitted ? (
                                  <motion.form
                                    key="apply-form"
                                    initial={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onSubmit={(e) => handleApplySubmit(job.id, e)}
                                    className="space-y-6 relative z-10"
                                  >
                                    <h4 className="text-sm font-mono font-semibold uppercase tracking-widest text-brand-yellow flex items-center gap-2">
                                      <span className="w-2 h-2 rounded-full bg-brand-yellow animate-ping" />
                                      Dynamic Application Console
                                    </h4>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                      <div>
                                        <label className="block text-[9px] font-mono uppercase tracking-widest text-white/40 mb-2">Full Name</label>
                                        <input
                                          type="text"
                                          required
                                          value={applicantNames[job.id] || ""}
                                          onChange={(e) => setApplicantNames(prev => ({ ...prev, [job.id]: e.target.value }))}
                                          placeholder="John Doe"
                                          className="w-full bg-[#050608] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none focus:border-brand-yellow/40 transition-colors"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-[9px] font-mono uppercase tracking-widest text-white/40 mb-2">Email Address</label>
                                        <input
                                          type="email"
                                          required
                                          value={applicantEmails[job.id] || ""}
                                          onChange={(e) => setApplicantEmails(prev => ({ ...prev, [job.id]: e.target.value }))}
                                          placeholder="john@example.com"
                                          className="w-full bg-[#050608] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none focus:border-brand-yellow/40 transition-colors"
                                        />
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                      <div>
                                        <label className="block text-[9px] font-mono uppercase tracking-widest text-white/40 mb-2">Portfolio / LinkedIn / GitHub</label>
                                        <input
                                          type="url"
                                          value={applicantLinks[job.id] || ""}
                                          onChange={(e) => setApplicantLinks(prev => ({ ...prev, [job.id]: e.target.value }))}
                                          placeholder="https://github.com/username"
                                          className="w-full bg-[#050608] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none focus:border-brand-yellow/40 transition-colors"
                                        />
                                      </div>
                                      <div className="flex items-end">
                                        <button
                                          type="submit"
                                          className="w-full bg-white text-black font-semibold uppercase tracking-widest text-xs py-3.5 rounded-xl hover:bg-brand-yellow hover:scale-[1.01] active:scale-95 transition-all duration-300"
                                        >
                                          Submit Application Payload
                                        </button>
                                      </div>
                                    </div>
                                  </motion.form>
                                ) : (
                                  <motion.div
                                    key="success-form"
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex flex-col items-center justify-center py-8 text-center space-y-4 relative z-10"
                                  >
                                    <div className="w-16 h-16 rounded-full bg-brand-yellow/10 border border-brand-yellow/30 flex items-center justify-center text-brand-yellow">
                                      <CheckCircle2 size={36} className="animate-pulse" />
                                    </div>
                                    <div className="space-y-1">
                                      <h4 className="text-xl font-semibold uppercase tracking-tight text-brand-yellow">Application Payload Transmitted</h4>
                                      <p className="text-xs text-white/50 font-mono">
                                        Node state set to: COMPLETED • Transaction recorded.
                                      </p>
                                    </div>
                                    <p className="text-sm font-medium text-white/70 max-w-md">
                                      Thank you, <span className="text-white font-semibold">{applicantNames[job.id]}</span>. Your credentials have been registered in our operational database. Our scaling leads will contact you shortly at <span className="text-white font-semibold">{applicantEmails[job.id]}</span>.
                                    </p>
                                    <button
                                      onClick={() => setSubmittedForms(prev => ({ ...prev, [job.id]: false }))}
                                      className="text-[10px] font-mono font-semibold uppercase tracking-widest text-brand-yellow/60 hover:text-brand-yellow transition-colors pt-4"
                                    >
                                      Reset Application Module
                                    </button>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>

                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}

              {!loading && !error && filteredPositions.length === 0 && (
                <div className="text-center py-20 border border-white/5 bg-white/[0.01] rounded-3xl space-y-4">
                  <div className="text-white/30 text-lg font-medium">No computational nodes matched your filter criteria</div>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSearchLocation("");
                      setSelectedDept("All Domains");
                    }}
                    className="text-xs font-mono font-semibold uppercase tracking-widest text-brand-yellow hover:underline"
                  >
                    Reset Active Filters
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      </section>

      <CTASection />
    </div>
  );
};

export default Careers;
