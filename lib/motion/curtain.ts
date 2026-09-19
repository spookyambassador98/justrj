"use client";

type Listener = (href: string) => void;

const waiters: Listener[] = [];

export function requestCurtain(href: string) {
  if (!waiters.length && typeof window !== "undefined") {
    window.location.assign(href);
    return;
  }
  waiters.forEach((fn) => fn(href));
}

export function subscribeCurtain(fn: Listener) {
  waiters.push(fn);
  return () => {
    const i = waiters.indexOf(fn);
    if (i >= 0) waiters.splice(i, 1);
  };
}
