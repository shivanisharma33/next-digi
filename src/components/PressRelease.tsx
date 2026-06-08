"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Newspaper,
  ArrowUpRight,
  Calendar,
  Tag,
  Download,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertTriangle,
  FileText,
} from "lucide-react";
import { CTASection } from "./Footer";
import DGXXPressReleaseVisual from "./DGXXPressReleaseVisual";
import Link from 'next/link';
import { generateSlug } from "../utils/slugify";
import EarlyAccess from "./EarlyAccess";

/* ─── Strapi API base ─── */
const STRAPI_BASE = "https://thankful-miracle-1ed8bdfdaf.strapiapp.com";
const PRESS_API = `${STRAPI_BASE}/api/press-releases`;
const PAGE_SIZE = 9; // 3×3 grid

/* ─── Types ─── */
interface StrapiPdf {
  url: string;
  name: string;
}

interface StrapiPressRelease {
  id: number;
  documentId: string;
  title: string;
  date: string;
  content: string;
  pdf_file?: StrapiPdf | null;
}

interface StrapiResponse {
  data: StrapiPressRelease[];
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
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function categorize(title: string): string {
  const t = title.toLowerCase();
  if (t.includes("financial") || t.includes("revenue") || t.includes("earnings") || t.includes("q1") || t.includes("q2") || t.includes("q3") || t.includes("q4") || t.includes("ebitda"))
    return "Financial";
  if (t.includes("stock option") || t.includes("rsu") || t.includes("offering") || t.includes("prospectus") || t.includes("atm") || t.includes("shares for debt") || t.includes("at-the-market"))
    return "Corporate";
  if (t.includes("arms") || t.includes("tier") || t.includes("data center") || t.includes("gpu") || t.includes("supermicro") || t.includes("neocloudz") || t.includes("neocloud"))
    return "Infrastructure";
  if (t.includes("patent"))
    return "Innovation";
  if (t.includes("appoints") || t.includes("board") || t.includes("leadership"))
    return "Leadership";
  if (t.includes("shareholder") || t.includes("letter"))
    return "Shareholder Update";
  if (t.includes("production") || t.includes("operational") || t.includes("operations update") || t.includes("bitcoin") || t.includes("crypto"))
    return "Operations";
  return "Announcement";
}

function getExcerpt(content: string, maxLen = 350): string {
  if (!content) return "";
  // Remove the first line if it's just a repeat of the title / location header
  const lines = content.split("\n").filter((l) => l.trim().length > 0);
  // Take the first meaningful paragraph after the header
  const body = lines.length > 1 ? lines.slice(1).join(" ") : lines[0];
  const clean = body.replace(/\s+/g, " ").trim();
  return clean.length > maxLen ? clean.slice(0, maxLen).trimEnd() + "…" : clean;
}

/* ─── Card ─── */
const PressReleaseCard = ({
  documentId,
  date,
  title,
  category,
  summary,
  pdfUrl,
  delay,
}: {
  documentId: string;
  date: string;
  title: string;
  category: string;
  summary: string;
  pdfUrl?: string | null;
  delay: number;
}) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const slug = generateSlug(title, documentId);

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ delay, duration: 0.5 }}
      className="group relative bg-[#080808] border border-white/5 p-6 sm:p-8 rounded-3xl sm:rounded-[2.5rem] overflow-hidden transition-all duration-700 hover:border-white/10 flex flex-col"
    >
      {/* Mesh gradient glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          background: `
            radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,198,41,0.08), transparent 40%),
            radial-gradient(300px circle at ${mousePos.x + 50}px ${mousePos.y - 50}px, rgba(255,255,255,0.03), transparent 30%)
          `,
        }}
      />

      {/* Moving shimmer */}
      <motion.div
        animate={{ x: ["100%", "-100%"] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent skew-x-12 pointer-events-none"
      />

      {/* Corner accent */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-[radial-gradient(circle_at_center,rgba(255,198,41,0.05)_0%,transparent_70%)] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

      <div className="relative z-10 flex flex-col flex-1">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/[0.03] border border-white/5 rounded-2xl text-white/30 group-hover:text-white group-hover:bg-[#ffc629] group-hover:border-[#ffc629] transition-all duration-500">
              <Calendar size={16} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 group-hover:text-white/40 transition-colors">
                Date Published
              </span>
              <span className="text-[11px] font-bold text-white/40 group-hover:text-white/80 transition-colors">
                {date}
              </span>
            </div>
          </div>

          {/* Category tag */}
          <div className="flex items-center gap-2 self-start sm:self-auto px-4 py-2 bg-gradient-to-br from-[#ffc629]/20 via-[#ffc629]/5 to-transparent border border-[#ffc629]/20 rounded-xl shadow-[0_0_15px_rgba(255,198,41,0.05)]">
            <Tag size={10} className="text-[#ffc629]" />
            <span className="text-[9px] font-black uppercase tracking-widest text-[#ffc629]">
              {category}
            </span>
          </div>
        </div>

        <Link href={`/press-releases/${slug}`}
          className="block group/title text-white hover:text-[#ffc629] transition-colors"
        >
          <h3 className="text-xl md:text-2xl font-semibold text-current mb-5 leading-[1.2] tracking-tight transition-colors line-clamp-2">
            {title}
          </h3>
        </Link>

        <p className="text-white/30 text-[13px] leading-relaxed mb-6 sm:mb-10 line-clamp-3 font-medium group-hover:text-white/50 transition-colors flex-1">
          {summary}
        </p>

        <div className="flex items-center justify-between pt-6 border-t border-white/5 gap-4">
          <Link href={`/press-releases/${slug}`}
            className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-[#ffc629] transition-all group/btn"
          >
            <div className="relative w-8 h-8 rounded-full border border-white/10 flex items-center justify-center overflow-hidden transition-all group-hover/btn:border-[#ffc629]">
              <motion.div className="absolute inset-0 bg-[#ffc629] translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
              <FileText
                size={14}
                className="relative z-10 group-hover/btn:text-black transition-colors"
              />
            </div>
            View Release
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

/* ─── Skeleton Card ─── */
const SkeletonCard = () => (
  <div className="bg-[#080808] border border-white/5 p-6 sm:p-8 rounded-3xl sm:rounded-[2.5rem] animate-pulse">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-white/5" />
        <div className="space-y-2">
          <div className="h-2 w-16 bg-white/5 rounded" />
          <div className="h-3 w-24 bg-white/5 rounded" />
        </div>
      </div>
      <div className="h-7 w-24 bg-white/5 rounded-xl self-start sm:self-auto" />
    </div>
    <div className="h-6 w-full bg-white/5 rounded mb-3" />
    <div className="h-6 w-3/4 bg-white/5 rounded mb-5" />
    <div className="space-y-2 mb-6 sm:mb-10">
      <div className="h-3 w-full bg-white/[0.03] rounded" />
      <div className="h-3 w-5/6 bg-white/[0.03] rounded" />
      <div className="h-3 w-2/3 bg-white/[0.03] rounded" />
    </div>
    <div className="pt-6 border-t border-white/5">
      <div className="h-3 w-28 bg-white/5 rounded" />
    </div>
  </div>
);

/* ─── Main Component ─── */
const PressRelease = () => {
  const [releases, setReleases] = useState<StrapiPressRelease[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const gridRef = useRef<HTMLDivElement>(null);

  const fetchReleases = useCallback(async (page: number) => {
    try {
      setLoading(true);
      setError(null);

      const url = `${PRESS_API}?populate[pdf_file][fields]=url,name&fields=title,date,content&sort[0]=date:desc&pagination[page]=${page}&pagination[pageSize]=${PAGE_SIZE}`;
      const res = await fetch(url);

      if (!res.ok) throw new Error(`API returned ${res.status}`);

      const json: StrapiResponse = await res.json();

      setReleases(json.data);
      setTotalPages(json.meta.pagination.pageCount);
      setTotalItems(json.meta.pagination.total);
      setCurrentPage(json.meta.pagination.page);
    } catch (err: any) {
      console.error("Failed to fetch press releases:", err);
      setError(err.message || "Failed to load press releases.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReleases(1);
  }, [fetchReleases]);

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    fetchReleases(page);
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
    <div className="bg-black text-white min-h-screen selection:bg-[#ffc629] selection:text-black">
      {/* ═══════════════════════════════════════════ */}
      {/* HERO SECTION */}
      {/* ═══════════════════════════════════════════ */}
      <section className="relative min-h-0 lg:min-h-[70vh] overflow-hidden bg-[#050505] flex items-center pt-32 pb-8 lg:pt-36 lg:pb-16 px-4 sm:px-6">
        <div className="relative z-10 w-full max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-16 items-center lg:pt-0 px-4">
          {/* LEFT: Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center text-center lg:items-start lg:text-left"
          >
            {/* Top Company Badge (Matching Reference Image) */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-[#ffc629]/30 bg-[#ffc629]/5 backdrop-blur-sm mb-8 sm:mb-10">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ffc629] shadow-[0_0_8px_#ffc629]"></span>
              <span className="text-[10px] uppercase tracking-[0.35em] font-bold text-[#ffc629]">
                Newsroom • Official Press Releases
              </span>
            </div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="flex flex-col items-center lg:items-start w-full"
            >
              <h1 className="text-[clamp(2.5rem,5.5vw,5rem)] font-semibold leading-[1.05] tracking-tighter uppercase mb-6 text-center lg:text-left">
                <span className="block text-white mb-2">
                  Official
                </span>
                <span className="block text-[#ffc629]">
                  Press Release
                </span>
              </h1>

              <p className="max-w-xl text-[clamp(15px,1.1vw,18px)] leading-[1.8] text-white/40 font-medium mb-8 text-center lg:text-left">
                Stay updated with the latest corporate developments, infrastructure milestones, and strategic
                announcements from DigiPowerX.
              </p>

              {totalItems > 0 && !loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-3 px-5 py-2 bg-white/[0.03] border border-white/5 rounded-full"
                >
                  <FileText size={14} className="text-[#ffc629]" />
                  <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em] text-white/40">
                    {totalItems} Press Releases
                  </span>
                </motion.div>
              )}
            </motion.div>
          </motion.div>

          {/* RIGHT: Glass-stack animation */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full h-[320px] sm:h-[380px] lg:h-[500px] lg:min-h-[600px] relative -mt-6 md:-mt-16 lg:-mt-4 overflow-hidden"
          >
            <DGXXPressReleaseVisual />
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* PRESS RELEASES GRID */}
      {/* ═══════════════════════════════════════════ */}
      <section ref={gridRef} className="py-20 lg:py-24 px-4 sm:px-6 bg-black relative z-10 scroll-mt-24">
        <div className="max-w-[1400px] mx-auto">
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
              <p className="text-white/50 text-sm font-medium text-center max-w-md">{error}</p>
              <button
                onClick={() => fetchReleases(currentPage)}
                className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] text-white/60 hover:text-white hover:border-[#ffc629] transition-all"
              >
                Try Again
              </button>
            </motion.div>
          )}

          {/* Loading skeleton */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}

          {/* Cards */}
          {!loading && !error && (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
              >
                {releases.map((release, index) => (
                  <PressReleaseCard
                    key={release.documentId}
                    documentId={release.documentId}
                    date={formatDate(release.date)}
                    title={release.title}
                    category={categorize(release.title)}
                    summary={getExcerpt(release.content)}
                    pdfUrl={release.pdf_file?.url || null}
                    delay={0.05 * index}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          )}

          {/* ═══════════════════════════════════════ */}
          {/* PAGINATION */}
          {/* ═══════════════════════════════════════ */}
          {!loading && !error && totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-12 md:mt-20 flex flex-col items-center gap-6 md:gap-8"
            >
              {/* Page info */}
              <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] sm:tracking-[0.4em] text-white/20 text-center px-4">
                Page {currentPage} of {totalPages} • Showing{" "}
                {Math.min((currentPage - 1) * PAGE_SIZE + 1, totalItems)}–
                {Math.min(currentPage * PAGE_SIZE, totalItems)} of {totalItems}
              </p>

              {/* Controls */}
              <div className="flex items-center gap-1 sm:gap-2">
                {/* Prev */}
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-[#ffc629] disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft size={18} />
                </button>

                {/* Page numbers */}
                {getPageNumbers().map((p, i) =>
                  p === "dots" ? (
                    <span
                      key={`dots-${i}`}
                      className="w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center text-white/20 text-sm select-none"
                    >
                      ⋯
                    </span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => goToPage(p)}
                      className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl text-[11px] sm:text-xs font-bold transition-all ${p === currentPage
                        ? "bg-[#ffc629] text-black border border-[#ffc629] shadow-[0_0_20px_rgba(255,198,41,0.25)]"
                        : "border border-white/10 text-white/40 hover:text-white hover:border-white/30"
                        }`}
                    >
                      {p}
                    </button>
                  )
                )}

                {/* Next */}
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-[#ffc629] disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* EARLY ACCESS */}
      <EarlyAccess />

      {/* FOOTER CTA */}
      <CTASection />
    </div>
  );
};

export default PressRelease;
