"use client";

import React, { useState, useEffect } from 'react';
import { Loader2, AlertTriangle, FileText, ShieldAlert } from 'lucide-react';

interface PDFViewerProps {
  pdfUrl?: string | null;
  title?: string;
}

export default function PDFViewer({ pdfUrl, title }: PDFViewerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Reset states if URL changes
    setIsLoading(true);
    setHasError(false);

    if (!pdfUrl) {
      setHasError(true);
      setIsLoading(false);
    }
  }, [pdfUrl]);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <div className="w-full bg-dark-surface-2/40 border border-dark-border-subtle rounded-[24px] sm:rounded-[32px] overflow-hidden backdrop-blur-xl flex flex-col h-[650px] sm:h-[800px] transition-all duration-300">
      {/* Top Header Bar (Clean Investor Relations Style) */}
      <div className="px-6 py-4 bg-dark-surface-3/50 border-b border-dark-border-subtle flex items-center justify-between gap-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-brand-yellow/5 border border-brand-yellow/20 flex items-center justify-center text-brand-yellow">
            <FileText size={15} />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#ffc629]">
              Investor Document
            </span>
            <span className="text-xs font-semibold text-white/70 line-clamp-1 max-w-[250px] sm:max-w-md">
              {title || 'Document Viewer'}
            </span>
          </div>
        </div>

        {/* Secure connection status */}
        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/5 border border-emerald-500/20 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
          <span className="text-[9px] font-black uppercase tracking-wider text-emerald-400">
            Secure Viewer
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 relative bg-black/40 overflow-hidden">
        {/* Loading Spinner */}
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-dark-base/90 z-20 gap-4">
            <Loader2 className="w-8 h-8 text-brand-yellow animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/40 animate-pulse">
              Loading Document...
            </p>
          </div>
        )}

        {/* Error State */}
        {hasError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-dark-base/80 z-20 p-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 mb-6 shadow-[0_0_20px_rgba(239,68,68,0.1)]">
              <ShieldAlert size={28} />
            </div>
            <h4 className="text-lg font-bold uppercase tracking-tight text-white mb-2">
              Failed to Load Document
            </h4>
            <p className="text-white/40 text-xs font-medium max-w-sm leading-relaxed mb-6">
              The PDF could not be retrieved from the document repository. Please check your network connection or try again later.
            </p>
            <button
              onClick={() => {
                setIsLoading(true);
                setHasError(false);
                // Trigger reload by re-assigning URL if possible
                const iframe = document.getElementById('pdf-iframe') as HTMLIFrameElement;
                if (iframe && pdfUrl) {
                  iframe.src = pdfUrl;
                } else {
                  setIsLoading(false);
                  setHasError(true);
                }
              }}
              className="px-6 py-3 bg-dark-surface-3 border border-dark-border-default shadow-sm rounded-xl text-[10px] font-black uppercase tracking-[0.3em] text-white/60 hover:text-white hover:border-[#ffc629] transition-all cursor-pointer"
            >
              Retry Loading
            </button>
          </div>
        ) : null}

        {/* PDF iframe */}
        {pdfUrl ? (
          <iframe
            id="pdf-iframe"
            src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=1`}
            className="w-full h-full border-0 rounded-b-[24px] sm:rounded-b-[32px]"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            title={title || 'PDF Document'}
          />
        ) : null}
      </div>
    </div>
  );
}
