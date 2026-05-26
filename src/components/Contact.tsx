import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, ChevronRight, CheckCircle, Clock } from 'lucide-react';
import { CTASection } from './Footer';

type FormState = {
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  title: string;
  phone: string;
  message: string;
};

const INITIAL: FormState = {
  firstName: '',
  lastName: '',
  company: '',
  email: '',
  title: '',
  phone: '',
  message: '',
};

export default function Contact() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
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
    <div className="bg-black min-h-screen text-white selection:bg-brand-yellow selection:text-black">
      {/* Hero */}
      <section className="relative pt-28 md:pt-36 lg:pt-48 pb-14 md:pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-[0.12] pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(245,197,24,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(245,197,24,0.1)_1px,transparent_1px)] bg-[size:40px_40px]" />
        </div>

        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-brand-yellow/[0.04] blur-[140px] pointer-events-none" />

        <div className="relative z-10 max-w-[1400px] mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center"
          >
            <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-12">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-yellow" />
              <span className="text-[10px] uppercase tracking-[0.5em] font-semibold text-white/60">Contact</span>
            </div>

            <h1 className="text-[clamp(2.5rem,6vw,5.5rem)] font-semibold leading-[0.95] tracking-tighter uppercase mb-8 text-white">
              TALK TO <br /> <span className="text-brand-yellow">OUR TEAM</span>
            </h1>

            <p className="text-xl text-white/55 max-w-2xl mx-auto leading-relaxed font-medium">
              Whether you're scoping a new AI factory, evaluating GPU capacity, or exploring a co-build, our infrastructure team responds within one business day.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact channels */}
      <section className="px-6 py-10 md:py-12">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <ChannelCard
            icon={Mail}
            label="Investor Relations"
            value="ir@digipowerx.com"
            href="mailto:ir@digipowerx.com"
          />
          <ChannelCard
            icon={Phone}
            label="Sales & Support"
            value="888-474-9222"
            href="tel:8884749222"
          />
          <ChannelCard icon={MapPin} label="Headquarters" value="Dallas, Texas, USA" />
        </div>
      </section>

      {/* Form */}
      <section className="py-16 md:py-20 px-6">
        <div className="max-w-[1100px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative p-6 md:p-14 rounded-3xl border border-white/10 bg-white/[0.02] overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-brand-yellow/[0.04] blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <AnimatePresence mode="wait">
                {!submitted ? (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-8"
                  >
                    <div className="mb-10">
                      <div className="text-[10px] font-semibold uppercase tracking-[0.5em] text-brand-yellow mb-4">
                        Send a Message
                      </div>
                      <h2 className="text-3xl md:text-4xl font-semibold uppercase tracking-tighter text-white">
                        Tell us about your <span className="text-brand-yellow">workload</span>.
                      </h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <Field
                        id="firstName"
                        name="firstName"
                        label="First Name"
                        placeholder="Jane"
                        required
                        value={form.firstName}
                        onChange={handleChange}
                      />
                      <Field
                        id="lastName"
                        name="lastName"
                        label="Last Name"
                        placeholder="Doe"
                        required
                        value={form.lastName}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <Field
                        id="company"
                        name="company"
                        label="Company"
                        placeholder="Your organization"
                        required
                        value={form.company}
                        onChange={handleChange}
                      />
                      <Field
                        id="title"
                        name="title"
                        label="Role"
                        placeholder="Head of Infrastructure"
                        required
                        value={form.title}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <Field
                        id="email"
                        name="email"
                        type="email"
                        label="Work Email"
                        placeholder="you@company.com"
                        required
                        value={form.email}
                        onChange={handleChange}
                      />
                      <Field
                        id="phone"
                        name="phone"
                        label="Phone"
                        placeholder="+1 (000) 000-0000"
                        value={form.phone}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="space-y-3">
                      <label
                        htmlFor="message"
                        className="block text-[10px] font-semibold text-white/60 uppercase tracking-[0.25em]"
                      >
                        Message <span className="text-brand-yellow">*</span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={5}
                        placeholder="What are you building, and what kind of compute capacity are you looking for?"
                        value={form.message}
                        onChange={handleChange}
                        className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-white placeholder:text-white/30 focus:outline-none focus:border-brand-yellow/50 transition-colors resize-none"
                      />
                    </div>

                    {error && (
                      <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex flex-col justify-center items-center gap-2">
                        <span className="text-red-500 text-sm font-semibold">{error}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={submitting}
                      className="group w-full md:w-auto inline-flex items-center justify-center gap-3 bg-brand-yellow text-black font-semibold py-4 px-10 rounded-xl uppercase tracking-[0.25em] text-xs transition-colors hover:bg-white disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {submitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                          Sending
                        </>
                      ) : (
                        <>
                          Send Message
                          <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>

                    <p className="text-[11px] text-white/40 leading-relaxed pt-2">
                      By submitting, you agree to be contacted about your inquiry. We typically respond within one
                      business day.
                    </p>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-16"
                  >
                    <div className="w-20 h-20 rounded-full border border-brand-yellow/30 bg-brand-yellow/10 flex items-center justify-center mx-auto mb-8">
                      <CheckCircle size={36} className="text-brand-yellow" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-semibold uppercase tracking-tighter text-white mb-4">
                      Message received.
                    </h2>
                    <p className="text-white/55 max-w-md mx-auto mb-10 leading-relaxed">
                      Thanks for reaching out — a member of our team will be in touch within one business day.
                    </p>
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setForm(INITIAL);
                      }}
                      className="text-brand-yellow font-semibold uppercase tracking-[0.3em] text-[11px] hover:text-white transition-colors border-b border-brand-yellow/30 pb-1"
                    >
                      Send another message
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          <div className="mt-10 flex items-center justify-center gap-3 text-white/40 text-xs">
            <Clock size={14} className="text-brand-yellow/70" />
            <span>Average response time: under 24 hours, Monday–Friday.</span>
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );
}

type IconType = React.ComponentType<{ size?: number; className?: string }>;

function ChannelCard({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: IconType;
  label: string;
  value: string;
  href?: string;
}) {
  const inner = (
    <div className="group h-full p-8 rounded-2xl border border-white/10 bg-white/[0.02] hover:border-brand-yellow/40 hover:bg-white/[0.04] transition-all duration-300">
      <div className="w-12 h-12 rounded-xl border border-white/10 bg-black flex items-center justify-center mb-6 group-hover:border-brand-yellow/40 transition-colors">
        <Icon size={18} className="text-brand-yellow" />
      </div>
      <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/40 mb-2">{label}</div>
      <div className="text-white font-semibold text-lg tracking-tight">{value}</div>
    </div>
  );

  return href ? (
    <a href={href} className="block h-full">
      {inner}
    </a>
  ) : (
    inner
  );
}

function Field({
  id,
  name,
  label,
  placeholder,
  type = 'text',
  required,
  value,
  onChange,
}: {
  id: string;
  name: string;
  label: string;
  placeholder: string;
  type?: string;
  required?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}) {
  return (
    <div className="space-y-3">
      <label htmlFor={id} className="block text-[10px] font-semibold text-white/60 uppercase tracking-[0.25em]">
        {label} {required && <span className="text-brand-yellow">*</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-white/30 focus:outline-none focus:border-brand-yellow/50 transition-colors"
      />
    </div>
  );
}
