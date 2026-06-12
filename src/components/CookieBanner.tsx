"use client";

import React, { useEffect, useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { Shield } from 'lucide-react';
import Link from 'next/link';

const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const checkCookie = () => {
      const name = "cookie_consent=";
      const decodedCookie = decodeURIComponent(document.cookie);
      const ca = decodedCookie.split(';');
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
          c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
          return c.substring(name.length, c.length);
        }
      }
      return null;
    };

    const consent = checkCookie();
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleChoice = (choice: 'accepted' | 'rejected') => {
    // Set cookie for 1 year (365 days)
    const date = new Date();
    date.setTime(date.getTime() + (365 * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = `cookie_consent=${choice}; ${expires}; path=/; SameSite=Lax`;
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <m.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed bottom-6 right-6 z-[9999] max-w-md w-[calc(100vw-3rem)] border border-white/[0.08] rounded-2xl p-6 shadow-2xl backdrop-blur-xl bg-dark-surface-2/90"
          style={{ background: 'linear-gradient(160deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)' }}
        >
          {/* Top highlight line */}
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#f5c518]/20 to-transparent" />
          
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-xl border border-[#f5c518]/25 bg-[#f5c518]/[0.06] flex items-center justify-center flex-shrink-0">
              <Shield size={18} className="text-[#f5c518]" />
            </div>
            
            <div className="flex-1 space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-white tracking-wide uppercase mb-1">
                  Cookie Preference
                </h4>
                <p className="text-xs text-white/60 leading-relaxed">
                  We use cookies and platform hosting technologies to enhance security, support site delivery, and personalize your experience. Read our <Link href="/cookie-policy" className="text-[#f5c518] hover:underline">Cookie Policy</Link> for details.
                </p>
              </div>
              
              <div className="flex gap-3">
                <button
                  id="cookie-accept-btn"
                  onClick={() => handleChoice('accepted')}
                  className="flex-1 py-2 px-4 rounded-xl border border-[#f5c518] bg-[#f5c518] text-black text-xs font-bold transition-all duration-200 hover:bg-[#ffda47] hover:border-[#ffda47] active:scale-95 cursor-pointer"
                >
                  Accept
                </button>
                <button
                  id="cookie-reject-btn"
                  onClick={() => handleChoice('rejected')}
                  className="flex-1 py-2 px-4 rounded-xl border border-white/10 bg-white/5 text-white text-xs font-bold transition-all duration-200 hover:bg-white/10 hover:border-white/20 active:scale-95 cursor-pointer"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
};

export default CookieBanner;
