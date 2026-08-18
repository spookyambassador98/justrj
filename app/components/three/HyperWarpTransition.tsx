"use client";

import { AnimatePresence, motion } from "framer-motion";

/** Simple page-to-form transition — no 3D warp theatrics. */
export function HyperWarpTransition({ active }: { active: boolean }) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-40 bg-[#020202]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          aria-hidden
        />
      )}
    </AnimatePresence>
  );
}
