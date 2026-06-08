"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Check, AlertCircle, Loader2 } from 'lucide-react';

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
        'https://thankful-miracle-1ed8bdfdaf.strapiapp.com/api/early-access',
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
    <section className="relative overflow-hidden bg-[#050505] pt-0 pb-12 md:pb-16 px-6">
      {/* Background grids and glowing spheres for rich premium look */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#f5c518] rounded-full blur-[150px] opacity-[0.03] pointer-events-none" />
      
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)'
        }}
      />

      <div className="max-w-[1400px] mx-auto relative z-10 flex flex-col items-center">
        {/* Subscription Console Form wrapper */}
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.form
                key="early-access-form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <div className="text-center mb-4">
                  <h3 className="text-[15px] sm:text-[18px] uppercase tracking-[0.25em] font-mono text-brand-yellow font-bold">
                    Subscribe to DigiPowerX
                  </h3>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch justify-center gap-3">
                  {/* Input container */}
                  <div className="flex-1 relative">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none">
                      <Mail size={16} />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError('');
                      }}
                      placeholder="Enter your email to subscribe"
                      className={`w-full bg-[#07080b] text-white text-[13px] pl-12 pr-6 py-3.5 rounded border outline-none transition-all duration-300 font-medium placeholder:text-white/20
                        ${error 
                          ? 'border-red-500/40 focus:border-red-500 focus:shadow-[0_0_15px_rgba(239,68,68,0.15)]' 
                          : 'border-white/10 hover:border-brand-yellow/30 focus:border-brand-yellow focus:shadow-[0_0_15px_rgba(245,197,24,0.15)]'
                        }
                      `}
                    />
                  </div>

                  {/* Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-global btn-primary disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={13} className="animate-spin text-black" />
                        <span>Subscribing...</span>
                      </>
                    ) : (
                      <>
                        <span>Subscribe</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Validation Error Message */}
                <div className="min-h-[20px] px-6 text-left">
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center gap-2 text-red-400 text-[12px] font-medium"
                      >
                        <AlertCircle size={14} className="flex-shrink-0" />
                        <span>{error}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.form>
            ) : (
              <motion.div
                key="early-access-success"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="flex flex-col items-center justify-center p-6 rounded-2xl border border-brand-yellow/20 bg-brand-yellow/[0.02] backdrop-blur-md text-center max-w-md mx-auto"
              >
                <div className="w-12 h-12 rounded-full border border-brand-yellow/40 bg-brand-yellow/10 flex items-center justify-center text-brand-yellow mb-4 shadow-[0_0_12px_rgba(245,197,24,0.15)]">
                  <Check size={20} strokeWidth={2.5} />
                </div>
                
                <h4 className="text-white text-[16px] uppercase tracking-wider font-bold mb-2">
                  Subscription Active
                </h4>
                
                <p className="text-white/50 text-[12px] leading-relaxed max-w-xs">
                  Thank you! You have successfully subscribed to DigiPowerX updates.
                </p>

                <button
                  onClick={() => setIsSubmitted(false)}
                  className="mt-4 text-[9px] font-mono font-bold uppercase tracking-widest text-brand-yellow/55 hover:text-brand-yellow transition-colors"
                >
                  Subscribe Another Email
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default EarlyAccess;
