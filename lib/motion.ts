import type { Variants, Transition } from "framer-motion";

export const liquidEase: Transition = {
  duration: 1.1,
  ease: [0.22, 1, 0.36, 1],
};

export const neuralEase: Transition = {
  duration: 0.9,
  ease: [0.16, 1, 0.3, 1],
};

export const warpEase: Transition = {
  duration: 1.4,
  ease: [0.76, 0, 0.24, 1],
};

export const fadeRise: Variants = {
  hidden: { opacity: 0, y: 48, filter: "blur(12px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: liquidEase,
  },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
      when: "beforeChildren",
    },
  },
};

export const staggerFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.05,
    },
  },
};

export const clipReveal: Variants = {
  hidden: { opacity: 0, clipPath: "inset(0 0 100% 0)" },
  visible: {
    opacity: 1,
    clipPath: "inset(0 0 0% 0)",
    transition: { ...liquidEase, duration: 1.25 },
  },
};

export const letterPull: Variants = {
  hidden: { y: "110%", rotateX: -40, opacity: 0 },
  visible: {
    y: "0%",
    rotateX: 0,
    opacity: 1,
    transition: neuralEase,
  },
};

export const hudPulse: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: liquidEase,
  },
};

export const formField: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: neuralEase,
  },
};
