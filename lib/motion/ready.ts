"use client";

type Listener = () => void;

const listeners = new Set<Listener>();
let ready = false;

export function isIntroReady() {
  return ready;
}

export function onIntroReady(cb: Listener) {
  if (ready) {
    cb();
    return () => undefined;
  }
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export function markIntroReady() {
  if (ready) return;
  ready = true;
  listeners.forEach((cb) => cb());
  listeners.clear();
  if (typeof document !== "undefined") {
    document.documentElement.dataset.intro = "ready";
  }
}
