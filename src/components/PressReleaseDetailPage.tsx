"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { m } from 'framer-motion';
import { ChevronLeft, Calendar, Tag, AlertTriangle, Loader2 } from 'lucide-react';
import { extractDocumentId } from '../utils/slugify';
import { STRAPI_URL } from '../lib/config';
import PDFViewer from './PDFViewer';
import { CTASection } from './Footer';

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

/* Helper functions (consistent with listing page) */
function formatDate(iso: string): string {
  if (!iso) return '';
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

export default function PressReleaseDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [release, setRelease] = useState<StrapiPressRelease | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const documentId = slug ? extractDocumentId(slug) : '';

  useEffect(() => {
    const controller = new AbortController();

    const fetchDetail = async () => {
      if (!documentId) {
        setError('Invalid document slug');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const url = `${STRAPI_URL}/api/press-releases/${documentId}?populate[pdf_file][fields]=url,name`;
        const res = await fetch(url, { signal: controller.signal });

        if (!res.ok) {
          throw new Error(`API returned ${res.status}`);
        }
        
        const json = await res.json();
        if (json && json.data) {
          setRelease(json.data);
          
          // SEO Tag Updates
          const titleText = `${json.data.title} | DigiPowerX Press Release`;
          document.title = titleText;
          
          const excerpt = json.data.content ? json.data.content.slice(0, 160).replace(/\s+/g, ' ').trim() + '...' : 'Read the official DigiPowerX Press Release.';
          let metaDesc = document.querySelector('meta[name="description"]');
          if (metaDesc) {
            metaDesc.setAttribute('content', excerpt);
          } else {
            const meta = document.createElement('meta');
            meta.name = 'description';
            meta.content = excerpt;
            document.head.appendChild(meta);
          }
        } else {
          throw new Error('Document not found');
        }
      } catch (err: any) {
        if (err?.name === 'AbortError') return; // route changed / unmounted
        console.error('Failed to fetch press release detail:', err);
        setError(err.message || 'Failed to load press release details.');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    fetchDetail();

    // Abort any in-flight request and reset the document title on unmount /
    // documentId change so a stale response can't set the wrong title.
    return () => {
      controller.abort();
      document.title = 'DigiPowerX - Newsroom';
    };
  }, [documentId]);

  return (
    <div className="bg-black text-white min-h-screen selection:bg-[#ffc629] selection:text-black flex flex-col">
      {/* Detail Main Area */}
      <div className="flex-1 w-full max-w-[1400px] mx-auto px-6 pt-32 pb-20">
        
        {/* Navigation / Breadcrumbs Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-white/5">
          <Link href="/press-releases"
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-white/40 hover:text-[#ffc629] transition-colors group"
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Press Releases
          </Link>
          
          {/* Breadcrumbs */}
          <nav className="text-[10px] font-bold uppercase tracking-widest text-white/20 flex items-center gap-2">
            <Link href="/" className="hover:text-white/40 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/investors" className="hover:text-white/40 transition-colors">Investors</Link>
            <span>/</span>
            <Link href="/press-releases" className="hover:text-white/40 transition-colors">Press Releases</Link>
            <span>/</span>
            <span className="text-[#ffc629]">Detail</span>
          </nav>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-8 h-8 text-brand-yellow animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/40">Fetching Document Details...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="min-h-[50vh] flex flex-col items-center justify-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 shadow-lg">
              <AlertTriangle size={28} />
            </div>
            <p className="text-white/50 text-sm font-medium text-center max-w-md">{error}</p>
            <Link href="/press-releases"
              className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] text-white/60 hover:text-white hover:border-[#ffc629] transition-all"
            >
              Return to Listing
            </Link>
          </div>
        )}

        {/* Content & PDF viewer */}
        {!loading && !error && release && (
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-12"
          >
            {/* Header info */}
            <div className="max-w-4xl space-y-6">
              {/* Category tag */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-[#ffc629]/20 via-[#ffc629]/5 to-transparent border border-[#ffc629]/20 rounded-xl">
                <Tag size={10} className="text-[#ffc629]" />
                <span className="text-[9px] font-black uppercase tracking-widest text-[#ffc629]">
                  {categorize(release.title)}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight leading-[1.1] uppercase text-white">
                {release.title}
              </h1>

              {/* Publish Date */}
              <div className="flex items-center gap-3 text-white/40">
                <Calendar size={14} />
                <span className="text-xs font-bold uppercase tracking-widest">
                  Published: {formatDate(release.date)}
                </span>
              </div>
            </div>

            {/* Embedded PDF Viewer */}
            <div className="w-full">
              <PDFViewer
                pdfUrl={release.pdf_file?.url || null}
                title={release.title}
              />
            </div>
          </m.div>
        )}
      </div>

      <CTASection />
    </div>
  );
}
