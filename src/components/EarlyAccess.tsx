"use client";

import React, { useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { Mail, Check, AlertCircle, Loader2, Send } from 'lucide-react';
import { STRAPI_URL } from '../lib/config';

const EarlyAccess = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateEmail = (emailStr: string) => {
    if (!emailStr) {
      return 'Please enter an email.';
    }
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(emailStr)) {
      return 'Please enter a valid email address.';
    }
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateEmail(email);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      // Send payload to the early-access Strapi endpoint
      const response = await fetch(
        `${STRAPI_URL}/api/early-access`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            data: {
              email,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error('API submission failed');
      }

      setIsSubmitted(true);
      setEmail('');
    } catch (err) {
      console.error('Error submitting subscription:', err);
      setError('Failed to subscribe. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative overflow-hidden bg-[#030406] py-16 md:py-24 px-6 border-t border-white/5">
      {/* Background grid and glowing effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-brand-yellow/10 rounded-full blur-[140px] pointer-events-none" />
      
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
          maskImage: 'radial-gradient(ellipse at center, black 60%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 60%, transparent 100%)'
        }}
      />

      <div className="max-w-[1400px] mx-auto relative z-10 flex flex-col items-center">
        {/* Glowing glass card wrapper */}
        <div className="w-full max-w-xl bg-gradient-to-b from-white/[0.04] to-transparent border border-white/10 rounded-2xl p-8 sm:p-10 shadow-2xl relative overflow-hidden backdrop-blur-xl group">
          {/* Top border ambient glow line */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-brand-yellow/40 to-transparent" />
          
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <m.form
                key="early-access-form"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                onSubmit={handleSubmit}
                className="space-y-6 flex flex-col items-center"
              >
                {/* Visual badge top */}
                <div className="w-12 h-12 rounded-full border border-brand-yellow/25 bg-brand-yellow/[0.05] flex items-center justify-center text-brand-yellow shadow-[0_0_20px_rgba(245,197,24,0.05)] mb-1 group-hover:scale-105 group-hover:border-brand-yellow/40 transition-all duration-500">
                  <Mail size={20} className="group-hover:rotate-12 transition-transform duration-500" />
                </div>

                <div className="text-center space-y-2">
                  <span className="text-[10px] font-mono font-bold tracking-[0.3em] text-brand-yellow uppercase">
                    Stay Connected
                  </span>
                  <h3 className="text-[20px] sm:text-[24px] uppercase tracking-wider font-extrabold text-white">
                    Subscribe to DigiPowerX
                  </h3>
                  <p className="text-white/50 text-xs sm:text-[13px] leading-relaxed max-w-md">
                    Get the latest reports on our high-density data centers, sustainable energy assets, and NeoCloudz updates.
                  </p>
                </div>

                <div className="w-full flex flex-col sm:flex-row items-stretch gap-3 pt-2">
                  {/* Input container */}
                  <div className="flex-1 relative">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none group-focus-within/item:text-brand-yellow transition-colors">
                      <Mail size={16} />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError('');
                      }}
                      placeholder="Enter your email address"
                      className={`w-full bg-[#030406]/60 text-white text-[13px] pl-12 pr-6 py-4 rounded-xl border outline-none transition-all duration-300 font-medium placeholder:text-white/20
                        ${error 
                          ? 'border-red-500/40 focus:border-red-500 focus:shadow-[0_0_20px_rgba(239,68,68,0.15)] bg-red-950/[0.02]' 
                          : 'border-white/10 hover:border-brand-yellow/30 focus:border-brand-yellow focus:shadow-[0_0_20px_rgba(245,197,24,0.15)]'
                        }
                      `}
                    />
                  </div>

                  {/* Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-brand-yellow text-black px-8 py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-white hover:shadow-[0_0_25px_rgba(255,255,255,0.3)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={14} className="animate-spin text-black" />
                        <span>Subscribing...</span>
                      </>
                    ) : (
                      <>
                        <span>Subscribe</span>
                        <Send size={12} className="text-black" />
                      </>
                    )}
                  </button>
                </div>

                {/* Validation Error Message */}
                {error && (
                  <m.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-2 text-red-400 text-[12px] font-medium pt-1 self-start sm:self-center"
                  >
                    <AlertCircle size={14} className="flex-shrink-0" />
                    <span>{error}</span>
                  </m.div>
                )}
              </m.form>
            ) : (
              <m.div
                key="early-access-success"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto space-y-4"
              >
                <div className="w-14 h-14 rounded-full border border-brand-yellow/30 bg-brand-yellow/10 flex items-center justify-center text-brand-yellow shadow-[0_0_20px_rgba(245,197,24,0.18)]">
                  <Check size={24} strokeWidth={2.5} />
                </div>
                
                <div className="space-y-1">
                  <h4 className="text-white text-[18px] uppercase tracking-wider font-extrabold">
                    Subscription Confirmed
                  </h4>
                  
                  <p className="text-white/60 text-[13px] leading-relaxed max-w-xs">
                    You have successfully subscribed to DigiPowerX updates. We will keep you updated.
                  </p>
                </div>

                <button
                  onClick={() => setIsSubmitted(false)}
                  className="mt-2 text-[10px] font-mono font-bold uppercase tracking-widest text-brand-yellow/60 hover:text-brand-yellow hover:underline transition-all cursor-pointer"
                >
                  Subscribe another email
                </button>
              </m.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default EarlyAccess;
