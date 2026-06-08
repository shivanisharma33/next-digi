"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  Calendar,
  AlertTriangle,
  Loader2,
  FileText,
  TrendingUp,
  Zap
} from 'lucide-react';
import { extractDocumentId } from '../utils/slugify';
import PDFViewer from './PDFViewer';
import { CTASection } from './Footer';

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

/* Helper functions (consistent with listing page) */
function formatDate(iso: string): string {
  if (!iso) return '';
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
    } else if (type === "10-K" || type === "20-F") {
      return `Annual Report — Fiscal Year ${year - 1}`;
    } else if (type === "8-K" || type === "6-K" || type === "6-K/A") {
      return `Current Report — ${date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
    }
    return `${type} Report — ${date.toLocaleDateString("en-US", { month: "short", year: "numeric" })}`;
  } catch (e) {
    return `${type} Filing`;
  }
}

export default function FilingDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [filing, setFiling] = useState<StrapiSecFiling | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const documentId = slug ? extractDocumentId(slug) : '';

  useEffect(() => {
    const fetchDetail = async () => {
      if (!documentId) {
        setError('Invalid document slug');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const url = `https://thankful-miracle-1ed8bdfdaf.strapiapp.com/api/sec-filings/${documentId}?populate=*`;
        const res = await fetch(url);
        
        if (!res.ok) {
          throw new Error(`API returned ${res.status}`);
        }
        
        const json = await res.json();
        if (json && json.data) {
          setFiling(json.data);
          
          // Generate Title
          const formType = String(json.data.form_type || json.data.type || 'Filing');
          const title = getFilingTitle(formType, json.data.date);
          
          // SEO Tag Updates
          document.title = `${title} | DigiPowerX SEC Filing`;
          
          const metaDescText = json.data.description || `Access the regulatory SEC filing ${title} for DigiPowerX Corporation.`;
          let metaDesc = document.querySelector('meta[name="description"]');
          if (metaDesc) {
            metaDesc.setAttribute('content', metaDescText);
          } else {
            const meta = document.createElement('meta');
            meta.name = 'description';
            meta.content = metaDescText;
            document.head.appendChild(meta);
          }
        } else {
          throw new Error('Filing not found');
        }
      } catch (err: any) {
        console.error('Failed to fetch SEC filing detail:', err);
        setError(err.message || 'Failed to load SEC filing details.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
    
    // Cleanup/reset document title on unmount
    return () => {
      document.title = 'DigiPowerX - SEC Filings';
    };
  }, [documentId]);

  // Determine docType styling elements
  let displayType = 'SEC Filing';
  let IconComponent = FileText;
  let colorClasses = {
    badge: 'border-purple-500/20 text-purple-400 bg-purple-500/5',
  };

  if (filing) {
    const docType = String(filing.form_type || filing.type || "10-Q");
    displayType = docType;
    if (docType.includes("10-Q")) {
      displayType = "10-Q";
      IconComponent = TrendingUp;
      colorClasses = {
        badge: "border-[#f5c518]/20 text-[#f5c518] bg-[#f5c518]/5",
      };
    } else if (docType.includes("10-K")) {
      displayType = "10-K";
      IconComponent = FileText;
      colorClasses = {
        badge: "border-blue-500/20 text-blue-400 bg-blue-500/5",
      };
    } else if (docType.includes("20-F")) {
      displayType = "20-F";
      IconComponent = FileText;
      colorClasses = {
        badge: "border-blue-500/20 text-blue-400 bg-blue-500/5",
      };
    } else if (docType.includes("8-K") || docType.includes("6-K")) {
      displayType = "8-K";
      IconComponent = Zap;
      colorClasses = {
        badge: "border-emerald-500/20 text-emerald-400 bg-emerald-500/5",
      };
    } else if (docType.toLowerCase().includes("13g") || docType.toLowerCase().includes("schedule")) {
      displayType = "S-13G";
      IconComponent = FileText;
      colorClasses = {
        badge: "border-purple-500/20 text-purple-400 bg-purple-500/5",
      };
    }
  }

  const filingTitle = filing ? getFilingTitle(displayType, filing.date) : 'SEC Filing';

  return (
    <div className="bg-dark-base min-h-screen text-white selection:bg-brand-yellow selection:text-black flex flex-col">
      {/* Detail Main Area */}
      <div className="flex-1 w-full max-w-[1400px] mx-auto px-6 pt-32 pb-20">
        
        {/* Navigation / Breadcrumbs Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-dark-border-subtle">
          <Link href="/sec-filings"
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-white/40 hover:text-brand-yellow transition-colors group"
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to SEC Filings
          </Link>
          
          {/* Breadcrumbs */}
          <nav className="text-[10px] font-bold uppercase tracking-widest text-white/20 flex items-center gap-2">
            <Link href="/" className="hover:text-white/40 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/investors" className="hover:text-white/40 transition-colors">Investors</Link>
            <span>/</span>
            <Link href="/sec-filings" className="hover:text-white/40 transition-colors">SEC Filings</Link>
            <span>/</span>
            <span className="text-brand-yellow">Detail</span>
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
            <Link href="/sec-filings"
              className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] text-white/60 hover:text-white hover:border-brand-yellow transition-all"
            >
              Return to Listing
            </Link>
          </div>
        )}

        {/* Content & PDF viewer */}
        {!loading && !error && filing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-12"
          >
            {/* Header info */}
            <div className="max-w-4xl space-y-6">
              {/* Form Type Badge */}
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-black tracking-wider ${colorClasses.badge}`}>
                <IconComponent size={12} className="stroke-[3]" />
                <span className="leading-none">{displayType}</span>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.1] uppercase text-white">
                {filingTitle}
              </h1>

              {/* Description */}
              <p className="text-white/60 text-sm md:text-base leading-relaxed font-medium">
                {filing.description || 'Regulatory SEC Disclosures'}
              </p>

              {/* Publish Date */}
              <div className="flex items-center gap-3 text-white/40">
                <Calendar size={14} />
                <span className="text-xs font-bold uppercase tracking-widest">
                  Filing Date: {formatDate(filing.date)}
                </span>
              </div>
            </div>

            {/* Embedded PDF Viewer */}
            <div className="w-full">
              <PDFViewer
                pdfUrl={filing.pdf_file?.url || null}
                title={filingTitle}
              />
            </div>
          </motion.div>
        )}
      </div>

      <CTASection />
    </div>
  );
}
