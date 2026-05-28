import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Calendar, Tag, Download, Newspaper } from 'lucide-react';
import { Link } from 'react-router-dom';

/* ─── Strapi config (same as PressRelease page) ─── */
const STRAPI_BASE = 'https://thankful-miracle-1ed8bdfdaf.strapiapp.com';
const PRESS_API = `${STRAPI_BASE}/api/press-releases`;

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

/* ─── Helpers ─── */
function formatDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatDateShort(iso: string): string {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function categorize(title: string): string {
  const t = title.toLowerCase();
  if (t.includes('financial') || t.includes('revenue') || t.includes('earnings') || t.includes('ebitda'))
    return 'Financial';
  if (t.includes('stock option') || t.includes('rsu') || t.includes('offering') || t.includes('prospectus') || t.includes('atm') || t.includes('at-the-market'))
    return 'Corporate';
  if (t.includes('arms') || t.includes('tier') || t.includes('data center') || t.includes('gpu') || t.includes('supermicro') || t.includes('neocloudz') || t.includes('neocloud'))
    return 'Infrastructure';
  if (t.includes('patent'))
    return 'Innovation';
  if (t.includes('appoints') || t.includes('board') || t.includes('leadership'))
    return 'Leadership';
  if (t.includes('shareholder') || t.includes('letter'))
    return 'Shareholder Update';
  if (t.includes('production') || t.includes('operational') || t.includes('operations update') || t.includes('bitcoin') || t.includes('crypto'))
    return 'Operations';
  return 'Announcement';
}

function getExcerpt(content: string, maxLen = 140): string {
  if (!content) return '';
  const lines = content.split('\n').filter((l) => l.trim().length > 0);
  const body = lines.length > 1 ? lines.slice(1).join(' ') : lines[0];
  const clean = body.replace(/\s+/g, ' ').trim();
  return clean.length > maxLen ? clean.slice(0, maxLen).trimEnd() + '…' : clean;
}

/* ─── Category color map ─── */
function getCategoryColor(cat: string): { bg: string; text: string; border: string } {
  switch (cat) {
    case 'Financial':
      return { bg: 'rgba(16,185,129,0.1)', text: '#10b981', border: 'rgba(16,185,129,0.2)' };
    case 'Infrastructure':
      return { bg: 'rgba(59,130,246,0.1)', text: '#3b82f6', border: 'rgba(59,130,246,0.2)' };
    case 'Corporate':
      return { bg: 'rgba(168,85,247,0.1)', text: '#a855f7', border: 'rgba(168,85,247,0.2)' };
    case 'Innovation':
      return { bg: 'rgba(236,72,153,0.1)', text: '#ec4899', border: 'rgba(236,72,153,0.2)' };
    case 'Leadership':
      return { bg: 'rgba(245,158,11,0.1)', text: '#f59e0b', border: 'rgba(245,158,11,0.2)' };
    default:
      return { bg: 'rgba(255,198,41,0.1)', text: '#ffc629', border: 'rgba(255,198,41,0.2)' };
  }
}

/* ─── News Card ─── */
const NewsCard = ({
  release,
  index,
}: {
  release: StrapiPressRelease;
  index: number;
}) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  const category = categorize(release.title);
  const colors = getCategoryColor(category);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className="group relative bg-[#0a0a0a] border border-white/[0.06] rounded-2xl overflow-hidden flex flex-col transition-all duration-500 hover:border-white/[0.12] hover:shadow-[0_20px_60px_-20px_rgba(0,0,0,0.5)]"
    >
      {/* Glow effect on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          background: `radial-gradient(500px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,198,41,0.04), transparent 40%)`,
        }}
      />

      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#ffc629]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

      <div className="relative z-10 p-6 sm:p-8 flex flex-col flex-1">
        {/* Date & Category row */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2 text-white/30">
            <Calendar size={12} />
            <span className="text-[11px] font-semibold tracking-wide">
              {formatDateShort(release.date)}
            </span>
          </div>
          <div
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-[0.15em]"
            style={{
              background: colors.bg,
              color: colors.text,
              border: `1px solid ${colors.border}`,
            }}
          >
            <Tag size={8} />
            {category}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-[17px] sm:text-lg font-semibold text-white/90 leading-[1.35] mb-4 tracking-tight group-hover:text-white transition-colors duration-300 line-clamp-2">
          {release.title}
        </h3>

        {/* Excerpt */}
        <p className="text-white/30 text-[13px] leading-relaxed mb-6 flex-1 line-clamp-3 group-hover:text-white/40 transition-colors duration-300">
          {getExcerpt(release.content)}
        </p>

        {/* Bottom action */}
        <div className="pt-5 border-t border-white/[0.05] flex items-center justify-between">
          {release.pdf_file?.url ? (
            <a
              href={release.pdf_file.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 hover:text-[#ffc629] transition-all duration-300 group/link"
            >
              <div className="w-7 h-7 rounded-full border border-white/10 flex items-center justify-center group-hover/link:border-[#ffc629]/50 group-hover/link:bg-[#ffc629]/10 transition-all duration-300">
                <Download size={12} />
              </div>
              Download PDF
            </a>
          ) : (
            <span className="flex items-center gap-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 group-hover:text-white/50 transition-all duration-300">
              <div className="w-7 h-7 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white/20 transition-all duration-300">
                <Newspaper size={12} />
              </div>
              Press Release
            </span>
          )}

          <div className="w-8 h-8 rounded-full border border-white/[0.06] flex items-center justify-center text-white/20 group-hover:border-[#ffc629]/40 group-hover:text-[#ffc629] group-hover:bg-[#ffc629]/10 transition-all duration-500">
            <ArrowUpRight size={14} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ─── Skeleton ─── */
const SkeletonCard = () => (
  <div className="bg-[#0a0a0a] border border-white/[0.06] rounded-2xl p-6 sm:p-8 animate-pulse">
    <div className="flex items-center justify-between mb-5">
      <div className="h-3 w-24 bg-white/5 rounded" />
      <div className="h-5 w-20 bg-white/5 rounded-full" />
    </div>
    <div className="h-5 w-full bg-white/[0.06] rounded mb-2" />
    <div className="h-5 w-3/4 bg-white/[0.06] rounded mb-4" />
    <div className="space-y-2 mb-6">
      <div className="h-3 w-full bg-white/[0.03] rounded" />
      <div className="h-3 w-5/6 bg-white/[0.03] rounded" />
    </div>
    <div className="pt-5 border-t border-white/[0.05]">
      <div className="h-3 w-24 bg-white/[0.04] rounded" />
    </div>
  </div>
);

/* ─── Main Section ─── */
const LatestNews = () => {
  const [releases, setReleases] = useState<StrapiPressRelease[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const url = `${PRESS_API}?populate[pdf_file][fields]=url,name&fields=title,date,content&sort[0]=date:desc&pagination[page]=1&pagination[pageSize]=3`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`API ${res.status}`);
        const json = await res.json();
        setReleases(json.data || []);
      } catch (err) {
        console.error('Failed to fetch latest news:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLatest();
  }, []);

  // Don't render if no news and not loading
  if (!loading && releases.length === 0) return null;

  return (
    <section className="relative bg-[#050505] py-20 sm:py-28 px-4 sm:px-6 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        {/* Top fade from previous section */}
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-black to-transparent" />
        {/* Corner glow */}
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(255,198,41,0.03)_0%,transparent_70%)]" />
        <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(255,198,41,0.02)_0%,transparent_70%)]" />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-14 sm:mb-16">
          <div>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-3 mb-6"
            >
              <div className="flex items-center gap-2 px-4 py-2 bg-white/[0.03] border border-white/[0.06] rounded-full backdrop-blur-sm">
                <div className="h-1.5 w-1.5 rounded-full bg-[#ffc629] animate-pulse" />
                <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-white/40">
                  Latest News
                </span>
              </div>
              <div className="h-[1px] w-12 bg-gradient-to-r from-[#ffc629]/40 to-transparent" />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-[clamp(2rem,5vw,3.5rem)] font-semibold leading-[1] tracking-[-0.03em] text-white"
            >
              Corporate <span className="text-[#ffc629]">Updates</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="mt-5 text-white/35 text-[14px] sm:text-[15px] max-w-xl leading-relaxed"
            >
              The latest press releases, infrastructure milestones, and strategic announcements from DigiPowerX.
            </motion.p>
          </div>

          {/* View All CTA */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link
              to="/press-release"
              className="group/cta inline-flex items-center gap-3 px-6 py-3.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-[11px] font-bold uppercase tracking-[0.2em] text-white/50 hover:text-white hover:border-[#ffc629]/30 hover:bg-[#ffc629]/[0.04] transition-all duration-500"
            >
              View All Releases
              <div className="w-6 h-6 rounded-full border border-white/10 flex items-center justify-center group-hover/cta:border-[#ffc629]/50 group-hover/cta:bg-[#ffc629] group-hover/cta:text-black transition-all duration-300">
                <ArrowUpRight size={12} />
              </div>
            </Link>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="h-[1px] bg-gradient-to-r from-transparent via-white/[0.06] to-transparent mb-14 sm:mb-16" />

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
            : releases.map((release, index) => (
              <NewsCard key={release.documentId} release={release} index={index} />
            ))}
        </div>

        {/* Bottom accent line */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.5 }}
          className="mt-16 sm:mt-20 h-[1px] bg-gradient-to-r from-transparent via-[#ffc629]/20 to-transparent origin-center"
        />
      </div>
    </section>
  );
};

export default LatestNews;
