"use client";

import React from "react";
import { motion } from "framer-motion";
import visual from "../assets/ChatGPT Image May 15, 2026, 05_30_05 PM.png";

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#050505] text-white flex items-center">

      {/* ===================================================== */}
      {/* MINIMALIST BACKGROUND */}
      {/* ===================================================== */}

      {/* SUBTLE DOT GRID */}
      <div className="absolute inset-0 opacity-[0.05] hidden sm:block">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* SOFT RADIAL VIGNETTE */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(255,255,255,0.03)_0%,transparent_70%)] hidden sm:block" />

      {/* ===================================================== */}
      {/* MAIN CONTENT */}
      {/* ===================================================== */}

      <div className="relative z-10 mx-auto grid w-full max-w-[1500px] grid-cols-1 items-center gap-24 px-6 lg:grid-cols-2 lg:px-16">

        {/* LEFT SIDE: Technical Narrative */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-[620px]"
        >
          {/* MINIMALIST BADGE */}
          <div className="mb-8 inline-flex items-center gap-4 rounded-full border border-white/5 bg-white/[0.03] px-5 py-2 backdrop-blur-md">
            <div className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
            <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-white/40">
              AI Infrastructure Platform
            </span>
          </div>

          {/* CLEAN HEADING */}
          <h1 className="leading-[1.05] tracking-tight">
            <span className="block text-[clamp(50px,5vw,90px)] font-semibold text-white">
              Powering AI
            </span>
            <span className="block text-[clamp(50px,5vw,90px)] font-semibold text-white/40">
              From the
            </span>
            <span className="block text-[clamp(50px,5vw,90px)] font-semibold text-[#ffc629]">
              Energy Layer Up
            </span>
          </h1>

          {/* REFINED DESCRIPTION */}
          <p className="mt-8 max-w-[540px] text-[17px] leading-[1.8] text-white/50 font-medium">
            DigiPower X builds vertically integrated AI infrastructure —
            combining owned power assets, Tier III data centers, and
            high-density GPU compute clusters.
          </p>

          {/* CLEAN BUTTONS */}
          <div className="mt-12 flex flex-wrap gap-5">
            <button className="rounded-xl bg-white px-9 py-4 text-[11px] font-bold uppercase tracking-widest text-black transition-all hover:bg-white/90 active:scale-95">
              Launch Console
            </button>
            <button className="rounded-xl border border-brand-yellow bg-white/5 px-9 py-4 text-[11px] font-bold uppercase tracking-widest text-white backdrop-blur-xl transition-all hover:bg-brand-yellow/10 active:scale-95">
              View Roadmap
            </button>
          </div>
        </motion.div>

        {/* RIGHT SIDE: Architectural Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, x: 50 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative flex items-center justify-center lg:justify-end"
        >
          <div className="relative w-full max-w-[580px]">
            <img
              src={visual}
              alt="Infrastructure Visual"
              className="relative w-full h-auto object-contain opacity-90 transition-opacity duration-500 hover:opacity-100"
            />
          </div>
        </motion.div>

      </div>
    </section>
  );
}