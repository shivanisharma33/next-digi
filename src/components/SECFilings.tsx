import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Search,
  ArrowUpRight,
  Clock,
  Download,
  ChevronRight,
  ChevronLeft,
  Calendar,
  Loader2,
  AlertTriangle,
  Zap,
  TrendingUp
} from 'lucide-react';
import NeuralCube3D from './NeuralCube3D';
import { CTASection } from './Footer';

/* ─── Strapi API base ─── */
const STRAPI_BASE = "https://thankful-miracle-1ed8bdfdaf.strapiapp.com";
const SEC_FILINGS_API = `${STRAPI_BASE}/api/sec-filings`;
const PAGE_SIZE = 9; // 3x3 grid

/* ─── Types ─── */
interface StrapiPdf {
  url: string;
  name: string;
}

interface StrapiSecFiling {
  id: number;
  documentId: string;
  type: string;
  date: string;
  description: string;
  pdf_file?: StrapiPdf | null;
  form_type?: string;
}

interface StrapiResponse {
  data: StrapiSecFiling[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

/* ─── Helpers ─── */
function formatDate(iso: string): string {
  if (!iso) return "";
  try {
    const d = new Date(iso + "T00:00:00");
    const formatted = d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    return formatted === "Invalid Date" ? "" : formatted;
  } catch (e) {
    return "";
  }
}

function getFilingTitle(type: string, dateStr: string): string {
  if (!dateStr) return `${type} Filing`;
  try {
    const date = new Date(dateStr + "T00:00:00");
    const year = date.getFullYear();
    const month = date.getMonth(); // 0-11
    
    if (isNaN(year) || isNaN(month)) {
      return `${type} Filing`;
    }
    
    if (type === "10-Q") {
      let q = "Q3";
      let qYear = year;
      if (month >= 0 && month < 3) {
        q = "Q4";
        qYear = year - 1;
      } else if (month >= 3 && month < 6) {
        q = "Q1";
      } else if (month >= 6 && month < 9) {
        q = "Q2";
      } else {
        q = "Q3";
      }
      return `Quarterly Report — ${q} ${qYear}`;
    } else if (type === "10-K") {
      return `Annual Report — Fiscal Year ${year - 1}`;
    } else if (type === "8-K" || type === "6-K" || type === "6-K/A") {
      return `Current Report — ${date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
    }
    return `${type} Report — ${date.toLocaleDateString("en-US", { month: "short", year: "numeric" })}`;
  } catch (e) {
    return `${type} Filing`;
  }
}

function formatFilingMonthYear(iso: string): string {
  if (!iso) return "";
  try {
    const d = new Date(iso + "T00:00:00");
    const formatted = d.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric"
    });
    return formatted === "Invalid Date" ? "" : formatted.toUpperCase();
  } catch (e) {
    return "";
  }
}

/* ─── Skeleton Card ─── */
const SkeletonCard = () => (
  <div className="bg-white border border-slate-100 p-6 md:p-8 rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col justify-between h-full min-h-[420px] animate-pulse">
    <div>
      {/* Date Header Skeleton */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-slate-200" />
        <div className="space-y-2">
          <div className="h-2 w-16 bg-slate-200 rounded" />
          <div className="h-3 w-24 bg-slate-200 rounded" />
        </div>
      </div>

      {/* Form Type Box Skeleton */}
      <div className="bg-slate-50 border border-slate-100 rounded-[14px] p-5 mb-6 text-left flex flex-col justify-center">
        <div className="h-2 w-16 bg-slate-200 rounded mb-2" />
        <div className="h-5 w-24 bg-slate-200 rounded" />
      </div>

      {/* Description Skeleton */}
      <div className="text-left flex-1 mb-8 space-y-2">
        <div className="h-2 w-20 bg-slate-200 rounded mb-3" />
        <div className="h-3 w-full bg-slate-200 rounded" />
        <div className="h-3 w-5/6 bg-slate-200 rounded" />
        <div className="h-3 w-2/3 bg-slate-200 rounded" />
      </div>
    </div>

    {/* Button Skeleton */}
    <div className="pt-2">
      <div className="h-[52px] w-full bg-slate-200 rounded-[14px]" />
    </div>
  </div>
);

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

const hudVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.25
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.94, y: 15 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 140,
      damping: 15
    }
  }
};

const SECFilings = () => {
  const [filings, setFilings] = useState<StrapiSecFiling[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [activeTab, setActiveTab] = useState<"ALL" | "10-K" | "10-Q" | "8-K">("ALL");
  const gridRef = useRef<HTMLDivElement>(null);

  const fetchFilings = useCallback(async (page: number, typeFilter?: string) => {
    try {
      setLoading(true);
      setError(null);

      let filterQuery = "";
      if (typeFilter && typeFilter !== "ALL") {
        if (typeFilter === "8-K") {
          // The database holds foreign current reports as 6-K or 6-K/A. 
          // We filter by 8-K, 6-K, or 6-K/A to ensure they show up in this tab.
          filterQuery = `&filters[form_type][$in][0]=8-K&filters[form_type][$in][1]=6-K&filters[form_type][$in][2]=6-K/A`;
        } else {
          filterQuery = `&filters[form_type][$eq]=${typeFilter}`;
        }
      }

      const url = `${SEC_FILINGS_API}?populate=*&sort[0]=date:desc&pagination[page]=${page}&pagination[pageSize]=${PAGE_SIZE}${filterQuery}`;
      const res = await fetch(url);

      if (!res.ok) throw new Error(`API returned ${res.status}`);

      const json: StrapiResponse = await res.json();

      const dataArray = Array.isArray(json?.data) ? json.data : [];
      setFilings(dataArray);

      const pagination = json?.meta?.pagination;
      setTotalPages(pagination?.pageCount || 1);
      setTotalItems(pagination?.total || 0);
      setCurrentPage(pagination?.page || page);
    } catch (err: any) {
      console.error("Failed to fetch SEC filings:", err);
      setError(err.message || "Failed to load SEC filings.");
      setFilings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFilings(1, activeTab);
  }, [fetchFilings, activeTab]);

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    fetchFilings(page, activeTab);
    // Scroll to grid
    gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  /* Build visible page numbers (show 5 pages around current) */
  const getPageNumbers = (): (number | "dots")[] => {
    const pages: (number | "dots")[] = [];
    const delta = 2;
    const left = Math.max(2, currentPage - delta);
    const right = Math.min(totalPages - 1, currentPage + delta);

    pages.push(1);
    if (left > 2) pages.push("dots");
    for (let i = left; i <= right; i++) pages.push(i);
    if (right < totalPages - 1) pages.push("dots");
    if (totalPages > 1) pages.push(totalPages);

    return pages;
  };

  return (
    <div className="bg-black min-h-screen text-white selection:bg-brand-yellow selection:text-black">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex flex-col items-center pt-32 pb-24 px-6 overflow-hidden">
        {/* Background Matrix Grid */}
        <div className="absolute inset-0 z-0 opacity-[0.14] pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(245,197,24,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(245,197,24,0.08)_1px,transparent_1px)] bg-[size:32px_32px]" />
        </div>

        <div className="absolute inset-0 z-0 opacity-45 pointer-events-none flex items-center justify-center">
          <div className="w-full h-full max-w-6xl">
            <NeuralCube3D />
          </div>
        </div>

        <div className="relative z-10 max-w-[1400px] mx-auto text-center flex flex-col items-center flex-1 justify-center">
          <motion.div
            variants={parentVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center w-full"
          >
            {/* Top Badge */}
            <motion.div
              variants={badgeVariants}
              className="inline-flex items-center gap-4 px-6 py-2 rounded-full border border-white/10 mb-10 backdrop-blur-md bg-white/[0.02]"
            >
              <div className="flex items-center gap-1.5">
                <div className="h-[2px] w-8 bg-brand-yellow animate-pulse" />
                <div className="h-[2px] w-2 bg-white/20" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/80">Investors</span>
            </motion.div>

            {/* Split Reveal Title */}
            <div className="overflow-hidden mb-8">
              <motion.h1
                variants={titleVariants}
                className="text-[clamp(2.5rem,6vw,5.5rem)] font-extrabold leading-[0.95] tracking-tighter uppercase text-white relative z-10"
              >
                <span className="block text-white mb-2">SEC</span>
                <span className="block text-brand-yellow">Filings</span>
              </motion.h1>
            </div>

            <motion.p
              variants={descVariants}
              className="text-sm md:text-lg text-white/50 max-w-2xl mx-auto leading-relaxed mb-14 font-medium"
            >
              Access all regulatory filings, annual reports, and quarterly disclosures for DigiPowerX Corporation (NASDAQ: DGXX).
            </motion.p>

            {/* Premium Glassmorphic Stats HUD Grid - Enhanced 3D Glass & Spotlight Gradients */}
            <motion.div
              variants={hudVariants}
              className="w-full max-w-[960px] grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 px-4"
            >
              {[
                { val: "DGXX", label: "NASDAQ TICKER" },
                { val: "10-K", label: "ANNUAL FILING" },
                { val: "10-Q", label: "QUARTERLY FILING" },
                { val: "8-K", label: "CURRENT EVENTS" }
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  variants={cardVariants}
                  whileHover={{
                    y: -6,
                    scale: 1.02,
                    borderColor: "rgba(255, 215, 0, 0.35)",
                    backgroundColor: "rgba(255, 215, 0, 0.02)",
                    boxShadow: "0 25px 50px -12px rgba(255, 215, 0, 0.15)"
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="relative p-6 rounded-[24px] border border-white/[0.08] bg-white/[0.01] backdrop-blur-xl flex flex-col items-center justify-center text-center cursor-pointer group overflow-hidden"
                >
                  {/* Glass highlight & cursor spotlight/gradient shine */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] via-transparent to-transparent pointer-events-none" />
                  <div className="absolute -inset-px bg-gradient-to-br from-white/[0.08] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[24px] pointer-events-none" />
                  <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-brand-yellow/[0.08] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                  <div className="text-brand-yellow font-extrabold text-2xl md:text-3xl mb-1.5 tracking-wider transition-transform group-hover:scale-105 duration-300 font-mono relative z-10">
                    {stat.val}
                  </div>
                  <div className="text-[9px] font-bold text-white/35 uppercase tracking-[0.25em] group-hover:text-white/75 transition-colors duration-300 relative z-10">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Recent Filings Header (Dark Contrast) */}
      <section className="bg-[#0F0F0E] text-white py-24 border-t border-white/[0.03]" ref={gridRef}>
        <div className="container mx-auto px-6 max-w-[1400px] text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-4 px-6 py-2 rounded-full border border-white/[0.08] mb-10 bg-white/[0.02] backdrop-blur-md">
            <div className="h-[2px] w-6 bg-brand-yellow" />
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#A3A3A3]">Market Disclosures</span>
            <div className="h-[2px] w-6 bg-brand-yellow" />
          </div>

          <h2 className="text-[clamp(2.5rem,6.5vw,5.5rem)] font-extrabold leading-[0.95] tracking-tighter uppercase text-white mb-8 relative z-10">
            RECENT <span className="text-brand-yellow">FILINGS</span>
          </h2>
          <p className="text-white/40 text-sm md:text-base font-medium max-w-lg leading-relaxed">
            View and download our latest filings.
          </p>
        </div>
      </section>

      {/* Filings Grid Section (Dark Premium) */}
      <section className="bg-[#0A0A0A] py-24 relative overflow-hidden border-t border-white/[0.03]">
        {/* Background matrix grids */}
        <div className="absolute inset-0 z-0 opacity-[0.02] pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:48px_48px]" />
        </div>

        <div className="container mx-auto px-6 max-w-[1400px] relative z-10">
          
          {/* Stats Cards Section - Enhanced 3D Glassmorphic Spotlight Panels */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            
            {/* Total Filings Card */}
            <motion.div 
              whileHover={{
                y: -6,
                borderColor: "rgba(255, 215, 0, 0.35)",
                backgroundColor: "rgba(255, 215, 0, 0.02)",
                boxShadow: "0 25px 50px -12px rgba(255, 215, 0, 0.15)"
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="relative bg-white/[0.01] backdrop-blur-xl border border-white/[0.06] rounded-[28px] p-8 text-left cursor-pointer overflow-hidden group"
            >
              {/* Glass spotlight & color washes */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] via-transparent to-transparent pointer-events-none" />
              <div className="absolute -inset-px bg-gradient-to-br from-white/[0.08] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[28px] pointer-events-none" />
              <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-brand-yellow/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              
              <span className="text-[10px] font-black tracking-[0.2em] text-[#8E8E93] uppercase block mb-3 group-hover:text-white/60 transition-colors">Total Filings</span>
              <div className="flex items-baseline gap-2 mb-2 relative z-10">
                <span className="text-4xl font-extrabold text-white tracking-tight group-hover:text-brand-yellow transition-colors duration-300">{totalItems}</span>
                <span className="text-lg font-bold text-white/50">docs</span>
              </div>
              <span className="text-xs font-semibold text-[#8E8E93] group-hover:text-[#A3A3A3] transition-colors">Across 3 filing types</span>
            </motion.div>

            {/* Revenue Card */}
            <motion.div 
              whileHover={{
                y: -6,
                borderColor: "rgba(255, 215, 0, 0.35)",
                backgroundColor: "rgba(255, 215, 0, 0.02)",
                boxShadow: "0 25px 50px -12px rgba(255, 215, 0, 0.15)"
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="relative bg-white/[0.01] backdrop-blur-xl border border-white/[0.06] rounded-[28px] p-8 text-left cursor-pointer overflow-hidden group"
            >
              {/* Glass spotlight & color washes */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] via-transparent to-transparent pointer-events-none" />
              <div className="absolute -inset-px bg-gradient-to-br from-white/[0.08] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[28px] pointer-events-none" />
              <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-brand-yellow/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              
              <span className="text-[10px] font-black tracking-[0.2em] text-[#8E8E93] uppercase block mb-3 group-hover:text-white/60 transition-colors">Revenue (9-MO 2024)</span>
              <div className="flex items-baseline gap-1.5 mb-2 relative z-10">
                <span className="text-4xl font-extrabold text-white tracking-tight group-hover:text-brand-yellow transition-colors duration-300">$31M</span>
                <span className="text-xl font-extrabold text-brand-yellow">+</span>
              </div>
              <span className="text-xs font-semibold text-[#8E8E93] group-hover:text-[#A3A3A3] transition-colors">As of Sep 30, 2024</span>
            </motion.div>

            {/* EBITDA Card */}
            <motion.div 
              whileHover={{
                y: -6,
                borderColor: "rgba(255, 215, 0, 0.35)",
                backgroundColor: "rgba(255, 215, 0, 0.02)",
                boxShadow: "0 25px 50px -12px rgba(255, 215, 0, 0.15)"
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="relative bg-white/[0.01] backdrop-blur-xl border border-white/[0.06] rounded-[28px] p-8 text-left cursor-pointer overflow-hidden group"
            >
              {/* Glass spotlight & color washes */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] via-transparent to-transparent pointer-events-none" />
              <div className="absolute -inset-px bg-gradient-to-br from-white/[0.08] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[28px] pointer-events-none" />
              <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-brand-yellow/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              
              <span className="text-[10px] font-black tracking-[0.2em] text-[#8E8E93] uppercase block mb-3 group-hover:text-white/60 transition-colors">EBITDA (9-MO 2024)</span>
              <div className="flex items-baseline gap-1.5 mb-2 relative z-10">
                <span className="text-4xl font-extrabold text-white tracking-tight group-hover:text-brand-yellow transition-colors duration-300">$5M</span>
                <span className="text-xl font-extrabold text-brand-yellow">+</span>
              </div>
              <span className="text-xs font-semibold text-[#8E8E93] group-hover:text-[#A3A3A3] transition-colors">As of Sep 30, 2024</span>
            </motion.div>
          </div>

               {/* Error state */}
          {error && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-20 gap-6"
            >
              <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <AlertTriangle size={28} className="text-red-500" />
              </div>
              <p className="text-white/40 text-sm font-medium text-center max-w-md">{error}</p>
              <button
                onClick={() => fetchFilings(currentPage, activeTab)}
                className="px-6 py-3 bg-[#0d0d0e] border border-white/[0.08] shadow-sm rounded-xl text-[10px] font-black uppercase tracking-[0.3em] text-white/60 hover:text-white hover:border-brand-yellow transition-all"
              >
                Try Again
              </button>
            </motion.div>
          )}

          {/* Tabs Filter and Row Info */}
          {!error && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
              {/* Tabs */}
              <div className="flex flex-wrap gap-3">
                {[
                  { id: "ALL", label: "All Filings" },
                  { id: "10-K", label: "Annual (10-K)" },
                  { id: "10-Q", label: "Quarterly (10-Q)" },
                  { id: "8-K", label: "Current (8-K)" }
                ].map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id as any);
                      }}
                      className={`w-36 h-10 flex items-center justify-center rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-300 border ${
                        isActive
                          ? "bg-transparent border-[#f5c518] text-[#f5c518] shadow-[0_4px_20px_rgba(245,197,24,0.05)]"
                          : "bg-transparent border-white/[0.05] text-white/40 hover:text-white hover:border-white/20"
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Showing items count */}
              <div className="text-[11px] font-bold text-white/40 tracking-wider">
                Showing <span className="text-white">{filings.length > 0 ? (currentPage - 1) * PAGE_SIZE + 1 : 0}–{Math.min(currentPage * PAGE_SIZE, totalItems)}</span> of <span className="text-white">{totalItems}</span> filings
              </div>
            </div>
          )}

          {/* Loading state */}
          {loading && !error && (
            <div className="bg-[#0B0C0E]/40 border border-white/[0.05] rounded-[32px] overflow-hidden backdrop-blur-xl animate-pulse">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="p-6 md:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-white/[0.03] last:border-b-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-6 text-left flex-1">
                    <div className="w-24 h-8 rounded-full bg-white/[0.03] border border-white/[0.05] flex-shrink-0" />
                    <div className="flex-1 space-y-3">
                      <div className="h-4 w-1/3 bg-white/[0.03] rounded" />
                      <div className="h-3 w-3/4 bg-white/[0.02] rounded" />
                      <div className="h-3 w-1/2 bg-white/[0.02] rounded" />
                    </div>
                  </div>
                  <div className="flex items-center gap-8 flex-shrink-0">
                    <div className="h-3 w-20 bg-white/[0.02] rounded" />
                    <div className="h-10 w-28 bg-white/[0.03] rounded-xl" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Cards */}
          {!loading && !error && filings.length > 0 && (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage + activeTab}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-[#0B0C0E]/40 border border-white/[0.05] rounded-[32px] overflow-hidden backdrop-blur-xl"
              >
                {filings.map((item, i) => {
                  if (!item) return null;
                  const docType = String(item.form_type || item.type || "10-Q");
                  
                  // Map any 6-K or 6-K/A to 8-K for UI, and select appropriate icon
                  let displayType = docType;
                  let IconComponent = FileText;
                  
                  // Color coding based on type
                  let colorClasses = {
                    badge: "border-blue-500/20 text-blue-400 bg-blue-500/5",
                    button: "border-blue-500/20 text-blue-400 hover:bg-blue-500/10",
                  };
                  
                  if (docType.includes("10-Q")) {
                    displayType = "10-Q";
                    IconComponent = TrendingUp;
                    colorClasses = {
                      badge: "border-[#f5c518]/20 text-[#f5c518] bg-[#f5c518]/5",
                      button: "border-[#f5c518]/20 text-[#f5c518] hover:bg-[#f5c518]/10",
                    };
                  } else if (docType.includes("10-K")) {
                    displayType = "10-K";
                    IconComponent = FileText;
                    colorClasses = {
                      badge: "border-blue-500/20 text-blue-400 bg-blue-500/5",
                      button: "border-blue-500/20 text-blue-400 hover:bg-blue-500/10",
                    };
                  } else if (docType.includes("8-K") || docType.includes("6-K")) {
                    displayType = "8-K";
                    IconComponent = Zap;
                    colorClasses = {
                      badge: "border-emerald-500/20 text-emerald-400 bg-emerald-500/5",
                      button: "border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10",
                    };
                  } else if (docType.toLowerCase().includes("13g") || docType.toLowerCase().includes("schedule")) {
                    displayType = "S-13G";
                    IconComponent = FileText;
                    colorClasses = {
                      badge: "border-purple-500/20 text-purple-400 bg-purple-500/5",
                      button: "border-purple-500/20 text-purple-400 hover:bg-purple-500/10",
                    };
                  }

                  return (
                    <motion.div
                      key={item.documentId || `filing-${i}`}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.4 }}
                      viewport={{ once: true }}
                      className="p-6 md:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-white/[0.03] last:border-b-0 transition-all duration-300 hover:bg-white/[0.01]"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center gap-6 text-left flex-1">
                        {/* Badge */}
                        <div className={`w-24 h-8 rounded-full border flex items-center justify-center gap-2 flex-shrink-0 text-xs font-black tracking-wider ${colorClasses.badge}`}>
                          <IconComponent size={12} className="stroke-[3] shrink-0" />
                          <span className="leading-none">{displayType}</span>
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <h3 className="text-white text-base md:text-lg font-bold tracking-tight mb-2">
                            {getFilingTitle(displayType, item.date)}
                          </h3>
                          <p className="text-white/40 text-xs md:text-sm leading-relaxed max-w-4xl font-medium">
                            {item.description || "No description available."}
                          </p>
                        </div>
                      </div>

                      {/* Actions/Info Right Side */}
                      <div className="flex items-center justify-between lg:justify-end gap-8 flex-shrink-0 border-t border-white/[0.03] pt-4 lg:border-t-0 lg:pt-0">
                        {/* Date */}
                        <div className="flex items-center gap-2.5 text-white/30">
                          <Calendar size={14} className="stroke-[2.5]" />
                          <span className="text-[10px] font-black uppercase tracking-widest">
                            {formatFilingMonthYear(item.date)}
                          </span>
                        </div>

                        {/* View Button */}
                        <a
                          href={item.pdf_file?.url || "#"}
                          target={item.pdf_file?.url ? "_blank" : "_self"}
                          rel="noopener noreferrer"
                          className={`inline-flex items-center justify-center gap-2 px-5 h-10 rounded-xl border text-[10px] font-black uppercase tracking-wider transition-all duration-300 ${colorClasses.button}`}
                        >
                          <Download size={12} className="stroke-[3]" />
                          <span className="leading-none">View Filing</span>
                        </a>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          )}

          {/* Empty state */}
          {!loading && !error && filings.length === 0 && (
            <div className="bg-[#0B0C0E]/40 border border-white/[0.05] rounded-[32px] p-20 text-center flex flex-col items-center">
              <span className="text-white/40 text-sm font-semibold mb-2">No documents found</span>
              <span className="text-white/20 text-xs font-medium">There are currently no filings available in this category.</span>
            </div>
          )}

          {/* Pagination */}
          {!loading && !error && totalPages > 1 && (
            <div className="mt-16 bg-[#080808]/60 border border-white/[0.06] rounded-2xl px-6 py-4 flex items-center justify-between w-full">
              {/* Left Side: Page X of Y */}
              <div className="text-xs text-white/50 font-medium">
                Page <strong className="text-white font-bold">{currentPage}</strong> of <strong className="text-white font-bold">{totalPages}</strong>
              </div>

              {/* Right Side: Page buttons */}
              <div className="flex items-center gap-2">
                {/* Back button */}
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="w-9 h-9 rounded-lg border border-white/[0.08] bg-[#0c0d12]/40 flex items-center justify-center text-white/40 hover:text-[#f5c518] hover:border-[#f5c518]/30 transition-all disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronLeft size={16} />
                </button>

                {/* Page numbers */}
                {getPageNumbers().map((p, i) =>
                  p === "dots" ? (
                    <span key={`dots-${i}`} className="text-white/20 px-1">...</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => goToPage(p as number)}
                      className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold transition-all cursor-pointer ${
                        p === currentPage
                          ? "border border-[#f5c518] text-[#f5c518] bg-[#f5c518]/5 shadow-[0_0_15px_rgba(245,197,24,0.1)]"
                          : "border border-white/[0.08] bg-[#0c0d12]/40 text-white/40 hover:text-white hover:border-white/20"
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}

                {/* Forward button */}
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="w-9 h-9 rounded-lg border border-white/[0.08] bg-[#0c0d12]/40 flex items-center justify-center text-white/40 hover:text-[#f5c518] hover:border-[#f5c518]/30 transition-all disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* SEC EDGAR Note Block */}
          {!loading && !error && (
            <div className="mt-4 bg-[#080808]/60 border border-white/[0.06] rounded-2xl p-6 flex items-start sm:items-center gap-5 w-full text-left">
              {/* Yellow File Icon Wrapper */}
              <div className="w-12 h-12 rounded-xl bg-[#f5c518]/5 border border-[#f5c518]/25 flex items-center justify-center text-[#f5c518] shrink-0 shadow-[0_0_15px_rgba(245,197,24,0.05)]">
                <FileText size={20} className="stroke-[2.5]" />
              </div>

              {/* Note text */}
              <p className="text-white/60 text-[13px] md:text-sm leading-relaxed font-medium">
                All filings are available on the SEC EDGAR system. DigiPowerX files under the ticker symbol <strong className="text-white font-bold">DGXX</strong>. For the complete filing history, visit the{" "}
                <a 
                  href="https://www.sec.gov/edgar/searchedgar/companysearch" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-[#f5c518] hover:text-[#ffd84d] underline font-bold transition-colors"
                >
                  EDGAR company page.
                </a>
              </p>
            </div>
          )}
        </div>
      </section>

      <CTASection />
    </div>
  );
};

export default SECFilings;
