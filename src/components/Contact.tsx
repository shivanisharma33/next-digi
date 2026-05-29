import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WaveVisual from './WaveVisual';

type FormState = {
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  phone: string;
  title: string;
  message: string;
};

const INITIAL: FormState = {
  firstName: '',
  lastName: '',
  company: '',
  email: '',
  phone: '',
  title: '',
  message: '',
};

export default function Contact() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        firstName: form.firstName,
        lastName: form.lastName,
        companyName: form.company,
        title: form.title,
        workEmail: form.email,
        phoneNumber: form.phone,
        message: form.message
      };

      const res = await fetch("https://thankful-miracle-1ed8bdfdaf.strapiapp.com/api/contact-forms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: payload }),
      });
      if (!res.ok) throw new Error("Failed to send message. Please try again later.");
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };



  return (
    <div className="contact-page-wrapper">
      {/* Scope CSS variables and styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .contact-page-wrapper {
          --gold: #f5c518;
          --gold-dim: #c8a400;
          --gold-light: rgba(245,197,24,0.10);
          --gold-border: rgba(245,197,24,0.30);
          --blue: #185fa5;
          --blue-light: rgba(24,95,165,0.10);
          --blue-border: rgba(24,95,165,0.35);
          --bg: #0a0a0a;
          --surface: #111111;
          --surface2: #181818;
          --border: rgba(255,255,255,0.07);
          --border-hover: rgba(255,255,255,0.13);
          --text: #f0ede8;
          --text-muted: rgba(240,237,232,0.5);
          --text-dim: rgba(240,237,232,0.28);
          --radius-sm: 10px;
          --radius-md: 16px;
          --radius-lg: 24px;
          --radius-xl: 32px;
          background: var(--bg);
          color: var(--text);
          font-family: 'Inter', sans-serif;
          min-height: 100vh;
        }

        .contact-section {
          position: relative;
          border-top: 0.5px solid var(--border);
          padding: 130px 32px 100px;
          text-align: center;
          overflow: hidden;
          background: var(--bg);
        }
        .contact-section::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 55% 40% at 50% 0%, rgba(245,197,24,0.05) 0%, transparent 65%);
          pointer-events: none;
        }
        .contact-inner { position: relative; z-index: 1; max-width: 860px; margin: 0 auto; }

        .ct-eyebrow {
          display: inline-flex; align-items: center; gap: 14px;
          font-size: 10px; font-weight: 600; letter-spacing: 0.28em; text-transform: uppercase;
          color: var(--text-dim); margin-bottom: 20px;
        }
        .ct-eyebrow-line {
          display: block; width: 36px; height: 1px;
          background: linear-gradient(90deg, var(--border-hover), transparent);
        }

        .ct-title {
          font-size: clamp(40px, 7vw, 78px);
          font-weight: 900; line-height: 0.9; letter-spacing: -0.04em;
          color: var(--text); margin-bottom: 20px;
        }

        .ct-sub {
          font-size: 15px; line-height: 1.75; color: var(--text-muted);
          max-width: 500px; margin: 0 auto 52px;
        }

        .ct-info-cards {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
          margin-bottom: 32px;
          text-align: left;
        }
        .ct-info-card {
          display: flex; flex-direction: column; gap: 14px;
          padding: 24px 24px 26px;
          border: 0.5px solid var(--border-hover);
          border-radius: var(--radius-md);
          background: var(--surface);
          text-decoration: none; color: inherit;
          transition: border-color 0.2s, background 0.2s;
        }
        .ct-info-card:hover { border-color: var(--gold-border); background: var(--surface2); }
        .ct-info-card--active { border-color: var(--gold-border); }
        .ct-info-icon {
          width: 40px; height: 40px;
          border-radius: 10px;
          background: rgba(245,197,24,0.08);
          border: 0.5px solid var(--gold-border);
          display: flex; align-items: center; justify-content: center;
          color: var(--gold);
        }
        .ct-info-icon svg { width: 18px; height: 18px; }
        .ct-info-label {
          font-size: 10px; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--text-dim); margin-top: 4px;
        }
        .ct-info-value {
          font-size: 16px; font-weight: 700; color: var(--text); letter-spacing: -0.01em;
        }

        .ct-body {
          display: grid;
          grid-template-columns: 340px 1fr;
          gap: 16px;
          text-align: left;
          margin-bottom: 16px;
        }

        .ct-left {
          border-radius: var(--radius-lg);
          overflow: hidden;
          position: relative;
          min-height: 480px;
          background: var(--surface2);
          border: 0.5px solid var(--border);
        }
        .ct-left-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to bottom, transparent 40%, rgba(8,8,8,0.92) 100%);
        }
        .ct-quote {
          position: absolute; bottom: 0; left: 0; right: 0;
          padding: 28px 28px 32px;
          z-index: 2;
        }
        .ct-quote-text {
          font-size: 15px; font-weight: 600; line-height: 1.55;
          color: #fff; 
        }
        .ct-quote-text em { font-style: normal; font-weight: 700; }
        .ct-quote-author {
          display: flex; align-items: center; gap: 10px;
        }
        .ct-avatar {
          width: 36px; height: 36px; border-radius: 50%;
          background: linear-gradient(135deg, #c8a400, #f5c518);
          border: 2px solid rgba(245,197,24,0.5);
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; font-weight: 800; color: #000;
          flex-shrink: 0;
          letter-spacing: 0.02em;
        }
        .ct-author-name {
          font-size: 12px; font-weight: 600; color: rgba(255,255,255,0.7);
        }

        .ct-left-placeholder {
          width: 100%; height: 100%; min-height: 480px;
          background: linear-gradient(135deg, #111 0%, #1a1a0d 50%, #0d0d00 100%);
          display: flex; align-items: center; justify-content: center;
          position: relative;
          overflow: hidden;
        }
        .ct-left-placeholder::before {
          content: '';
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(245,197,24,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(245,197,24,0.04) 1px, transparent 1px);
          background-size: 32px 32px;
        }
        .ct-left-placeholder::after {
          content: '';
          position: absolute; bottom: -40px; left: -40px;
          width: 260px; height: 260px; border-radius: 50%;
          background: rgba(245,197,24,0.07); filter: blur(60px);
        }

        .ct-left-placeholder #hero3d {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: auto;
          z-index: 1;
        }
        .ct-left-placeholder #hero3d canvas {
          display: block;
          width: 100% !important;
          height: 100% !important;
          background: transparent;
        }

        .ct-form-panel {
          border: 0.5px solid var(--border);
          border-radius: var(--radius-lg);
          background: var(--surface);
          padding: 36px 36px 40px;
          display: flex; flex-direction: column; gap: 0;
        }
        .ct-form-title {
          font-size: 20px; font-weight: 700; color: var(--text);
          margin-bottom: 28px; letter-spacing: -0.02em;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }
        .form-group { display: flex; flex-direction: column; gap: 6px; }
        .form-group.full { grid-column: 1 / -1; }
        .form-label {
          font-size: 11px; font-weight: 600; letter-spacing: 0.04em;
          color: var(--text-muted);
        }
        .form-label .req { color: var(--gold); margin-left: 2px; }
        .form-input, .form-textarea, .form-select {
          background: var(--surface2);
          border: 0.5px solid var(--border-hover);
          border-radius: 8px;
          padding: 11px 14px;
          font-family: 'Inter', sans-serif;
          font-size: 13.5px; color: var(--text);
          transition: border-color 0.18s, box-shadow 0.18s;
          outline: none; width: 100%;
        }
        .form-input::placeholder, .form-textarea::placeholder { color: var(--text-dim); font-size: 13px; }
        .form-input:focus, .form-textarea:focus, .form-select:focus {
          border-color: var(--gold-border);
          box-shadow: 0 0 0 3px rgba(245,197,24,0.06);
        }
        .form-textarea { resize: vertical; min-height: 100px; line-height: 1.6; }
        .form-select {
          appearance: none; cursor: pointer;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='rgba(240,237,232,0.3)' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
          background-repeat: no-repeat; background-position: right 13px center; padding-right: 34px;
        }
        .form-select option { background: #181818; }

        .ct-send-row {
          display: flex; align-items: center; justify-content: space-between;
          margin-top: 20px; flex-wrap: wrap; gap: 12px;
        }
        .send-btn {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 12px 28px;
          border-radius: 8px;
          background: transparent;
          border: 1.5px solid var(--text-muted);
          font-family: 'Inter', sans-serif;
          font-size: 11px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--text); cursor: pointer;
          transition: border-color 0.18s, color 0.18s, background 0.18s, transform 0.15s;
        }
        .send-btn:hover { border-color: var(--gold); color: var(--gold); transform: translateY(-1px); }
        .send-btn svg { width: 13px; height: 13px; transition: transform 0.18s; }
        .send-btn:hover svg { transform: translateX(3px); }
        .ct-response-note {
          font-size: 12px; color: var(--text-dim); text-align: right;
        }
        .ct-response-note strong { color: var(--text-muted); font-weight: 600; }

        .ct-bottom {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .ct-email-card {
          display: flex; align-items: center; gap: 16px;
          padding: 18px 22px;
          border: 0.5px solid var(--border);
          border-radius: var(--radius-md);
          background: var(--surface);
          text-decoration: none; color: inherit;
          transition: border-color 0.2s;
        }
        .ct-email-card:hover { border-color: var(--gold-border); }
        .ct-email-icon {
          width: 40px; height: 40px; flex-shrink: 0;
          border-radius: 8px;
          background: var(--surface2);
          border: 0.5px solid var(--border-hover);
          display: flex; align-items: center; justify-content: center;
          color: var(--text-muted);
        }
        .ct-email-icon svg { width: 18px; height: 18px; }
        .ct-email-small { font-size: 11px; color: var(--text-dim); margin-bottom: 2px; }
        .ct-email-addr { font-size: 15px; font-weight: 600; color: var(--text); }

        .ct-call-card {
          display: flex; align-items: center; justify-content: center; gap: 10px;
          padding: 18px 22px;
          border: 0.5px solid var(--border-hover);
          border-radius: var(--radius-md);
          background: var(--surface2);
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
          font-family: 'Inter', sans-serif;
          font-size: 11px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--text);
        }
        .ct-call-card:hover { border-color: var(--gold-border); background: rgba(245,197,24,0.04); color: var(--gold); }
        .ct-call-card svg { width: 15px; height: 15px; }

        @media (max-width: 780px) {
          .ct-info-cards { grid-template-columns: 1fr; }
          .ct-body { grid-template-columns: 1fr; }
          .ct-left { min-height: 300px; }
          .ct-form-panel { padding: 24px 20px; }
          .form-grid { grid-template-columns: 1fr; }
          .ct-bottom { grid-template-columns: 1fr; }
          .contact-section { padding: 100px 20px 80px; }
        }
      `}} />

      <section className="contact-section">
        <div className="contact-inner">

          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl mb-8">
            <span className="w-8 h-[2px] bg-[#f5c518] shrink-0" style={{ display: 'inline-block', width: '32px', height: '2px', backgroundColor: '#f5c518' }} />
            <span className="w-1.5 h-[2px] bg-white/20 shrink-0" style={{ display: 'inline-block', width: '6px', height: '2px', backgroundColor: 'rgba(255,255,255,0.2)' }} />
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/80">Get in Touch</span>
          </div>

          {/* Title */}
          <h2 className="ct-title">Talk to Us</h2>
          <p className="ct-sub">Tell us what you want to build or automate. Our team will review your needs and respond with clear next steps.</p>

          {/* 3 contact info cards */}
          <div className="ct-info-cards">
            <a className="ct-info-card" href="mailto:ir@digipowerx.com">
              <div className="ct-info-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><polyline points="2,4 12,13 22,4" /></svg>
              </div>
              <div className="ct-info-label">Investor Relations</div>
              <div className="ct-info-value">ir@digipowerx.com</div>
            </a>
            <a className="ct-info-card" href="tel:8884749222">
              <div className="ct-info-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.35 2 2 0 0 1 3.58 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.56a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16v.92z" /></svg>
              </div>
              <div className="ct-info-label">Sales &amp; Support</div>
              <div className="ct-info-value">888-474-9222</div>
            </a>
            <div className="ct-info-card ct-info-card--active">
              <div className="ct-info-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
              </div>
              <div className="ct-info-label">Headquarters</div>
              <div className="ct-info-value">Dallas, Texas, USA</div>
            </div>
          </div>

          {/* 2-col body */}
          <div className="ct-body">

            {/* Left: visual + testimonial */}
            <div className="ct-left">
              <div className="ct-left-placeholder">
                <WaveVisual />
              </div>
              <div className="ct-left-overlay"></div>
              <div className="ct-quote">
                <p className="ct-quote-text">"DigiPowerX delivers infrastructure that simply performs — <em>reliable, scalable, and built for the future.</em>"</p>
              </div>
            </div>

            {/* Right: form */}
            <div className="ct-form-panel">
              <div className="ct-form-title">Start a Conversation</div>
              <AnimatePresence mode="wait">
                {!submitted ? (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="form-grid"
                  >
                    <div className="form-group">
                      <label className="form-label">First Name <span className="req">*</span></label>
                      <input
                        name="firstName"
                        value={form.firstName}
                        onChange={handleChange}
                        className="form-input"
                        type="text"
                        placeholder="Jane"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Last Name <span className="req">*</span></label>
                      <input
                        name="lastName"
                        value={form.lastName}
                        onChange={handleChange}
                        className="form-input"
                        type="text"
                        placeholder="Doe"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Company <span className="req">*</span></label>
                      <input
                        name="company"
                        value={form.company}
                        onChange={handleChange}
                        className="form-input"
                        type="text"
                        placeholder="Your organization"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Work Email <span className="req">*</span></label>
                      <input
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className="form-input"
                        type="email"
                        placeholder="you@company.com"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Phone <span className="req">*</span></label>
                      <input
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        className="form-input"
                        type="tel"
                        placeholder="+1 (000) 000-0000"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Role</label>
                      <select
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        className="form-select"
                        required
                      >
                        <option value="" disabled>Select role</option>
                        <option value="CTO / CIO">CTO / CIO</option>
                        <option value="Head of Infrastructure">Head of Infrastructure</option>
                        <option value="VP Engineering">VP Engineering</option>
                        <option value="Investor / Analyst">Investor / Analyst</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="form-group full">
                      <label className="form-label">Message <span className="req">*</span></label>
                      <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        className="form-textarea"
                        placeholder="Tell us about your project or what you'd like to automate"
                        required
                      ></textarea>
                    </div>

                    {error && (
                      <div className="form-group full p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-center">
                        <span className="text-red-500 text-xs font-semibold">{error}</span>
                      </div>
                    )}

                    <div className="ct-send-row form-group full">
                      <div className="flex items-center justify-between w-full flex-wrap gap-4">
                        <button type="submit" disabled={submitting} className="btn-global btn-primary">
                          {submitting ? 'Sending...' : 'Send Message'}
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{width: 14, height: 14}}><polyline points="9 18 15 12 9 6" /></svg>
                        </button>
                        <div className="ct-response-note">Response: usually under <strong>12 hours</strong></div>
                      </div>
                    </div>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-12 w-full"
                  >
                    <div className="w-16 h-16 rounded-full border border-brand-yellow/30 bg-brand-yellow/10 flex items-center justify-center mx-auto mb-6">
                      <svg className="w-8 h-8 text-[#f5c518]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold uppercase tracking-tighter text-white mb-3">
                      Message received
                    </h3>
                    <p className="text-white/60 text-sm max-w-sm mx-auto mb-8 leading-relaxed">
                      Thanks for reaching out — a member of our team will be in touch within 12 hours.
                    </p>
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setForm(INITIAL);
                      }}
                      className="text-[#f5c518] font-bold uppercase tracking-widest text-[10px] hover:text-white transition-colors border-b border-[#f5c518]/30 pb-0.5"
                    >
                      Send another message
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Bottom row */}
          <div className="ct-bottom">
            <a className="ct-email-card" href="mailto:ir@digipowerx.com">
              <div className="ct-email-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><polyline points="2,4 12,13 22,4" /></svg>
              </div>
              <div className="ct-email-info">
                <div className="ct-email-small">Reach us directly at</div>
                <div className="ct-email-addr">ir@digipowerx.com</div>
              </div>
            </a>
            <a className="ct-call-card" href="tel:8884749222">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.35 2 2 0 0 1 3.58 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.56a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16v.92z" /></svg>
              Book an Intro Call
            </a>
          </div>

        </div>
      </section>
    </div>
  );
}
