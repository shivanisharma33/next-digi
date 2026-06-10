"use client";

import { LazyMotion, domAnimation } from "framer-motion";
import React from "react";

/**
 * Loads Framer Motion's DOM animation features once for the whole app so that
 * lightweight `m` components (from `framer-motion`) can animate without each
 * page pulling in the full `motion` bundle. Use `m.div` etc. inside the tree.
 */
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return <LazyMotion features={domAnimation}>{children}</LazyMotion>;
}
