"use client";

import { AnimatePresence, motion } from "framer-motion";

export function PremiumLoader({
  active,
  text = "INITIALIZING",
}: {
  active: boolean;
  text?: string;
}) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="pointer-events-auto fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#020202]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          role="status"
          aria-live="polite"
        >
          <div className="flex w-64 flex-col gap-5 md:w-80">
            <div className="flex items-end justify-between text-[9px] uppercase tracking-[0.3em] text-white/40 md:text-[10px]">
              <motion.span
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                {text}
              </motion.span>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0.35, 1] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: [0.45, 0, 0.55, 1] }}
                className="font-mono tracking-widest text-cyan-400/80"
              >
                [ SYNC ]
              </motion.span>
            </div>
            <div className="relative h-px w-full overflow-hidden bg-white/5">
              <motion.div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-400 to-blue-500 shadow-[0_0_15px_rgba(34,211,238,0.45)]"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.7, ease: [0.7, 0, 0.3, 1], delay: 0.2 }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
