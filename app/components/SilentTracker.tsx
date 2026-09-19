"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const VID_KEY = "rj_vid";
const LAND_KEY = "rj_land";
const START_KEY = "rj_start";

function vid() {
  try {
    let id = localStorage.getItem(VID_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(VID_KEY, id);
    }
    return id;
  } catch {
    return "anon";
  }
}

function utmFrom(href: string) {
  const out: Record<string, string> = {};
  try {
    const u = new URL(href);
    ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"].forEach((k) => {
      const v = u.searchParams.get(k);
      if (v) out[k] = v;
    });
  } catch {
    /* ignore */
  }
  return out;
}

function here() {
  return location.pathname + location.search;
}

function send(events: { type: string; path: string; detail?: string }[]) {
  const body = JSON.stringify({
    vid: vid(),
    events: events.map((e) => ({ ...e, at: new Date().toISOString() })),
    referrer: document.referrer || null,
    landing: sessionStorage.getItem(LAND_KEY) || location.href,
    href: location.href,
    ua: navigator.userAgent,
    lang: navigator.language,
    tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
    screen: `${window.screen.width}x${window.screen.height}`,
    utm: utmFrom(location.href),
  });
  if (navigator.sendBeacon) {
    navigator.sendBeacon("/api/logger", new Blob([body], { type: "application/json" }));
    return;
  }
  void fetch("/api/logger", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => undefined);
}

function clickLabel(el: Element) {
  const node = el as HTMLElement;
  return (
    node.getAttribute("data-track") ||
    node.getAttribute("aria-label") ||
    node.getAttribute("title") ||
    node.getAttribute("href") ||
    node.getAttribute("id") ||
    node.innerText?.trim().replace(/\s+/g, " ").slice(0, 80) ||
    node.tagName
  );
}

export function SilentTracker() {
  const pathname = usePathname();

  useEffect(() => {
    try {
      if (!sessionStorage.getItem(LAND_KEY)) {
        sessionStorage.setItem(LAND_KEY, location.href);
      }
      if (!sessionStorage.getItem(START_KEY)) {
        sessionStorage.setItem(START_KEY, String(Date.now()));
      }
    } catch {
      /* ignore */
    }
    send([{ type: "page", path: here(), detail: document.title.slice(0, 80) }]);
  }, [pathname]);

  useEffect(() => {
    const seenScroll = new Set<number>();
    const seenSections = new Set<string>();

    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest(
        "a,button,[role='button'],input[type='submit'],[data-track]",
      );
      if (!el) return;
      send([
        {
          type: "click",
          path: here(),
          detail: `${el.tagName.toLowerCase()}:${clickLabel(el)}`,
        },
      ]);
    };

    const onSubmit = (e: Event) => {
      const form = e.target as HTMLFormElement;
      send([
        {
          type: "form",
          path: here(),
          detail: form?.getAttribute("action") || form?.id || "submit",
        },
      ]);
    };

    const onScroll = () => {
      const doc = document.documentElement;
      const max = Math.max(1, doc.scrollHeight - window.innerHeight);
      const pct = Math.min(100, Math.round((window.scrollY / max) * 100));
      for (const mark of [25, 50, 75, 100]) {
        if (pct >= mark && !seenScroll.has(mark)) {
          seenScroll.add(mark);
          send([{ type: "scroll", path: here(), detail: `${mark}%` }]);
        }
      }
    };

    const observeSections = () => {
      const nodes = Array.from(
        document.querySelectorAll("section[id], [data-section], h1, h2"),
      );
      if (!nodes.length || !("IntersectionObserver" in window)) return null;
      const io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            const el = entry.target as HTMLElement;
            const name =
              el.getAttribute("data-section") ||
              el.id ||
              el.textContent?.trim().replace(/\s+/g, " ").slice(0, 80) ||
              el.tagName;
            if (seenSections.has(name)) continue;
            seenSections.add(name);
            send([{ type: "browse", path: here(), detail: name }]);
          }
        },
        { threshold: 0.45 },
      );
      nodes.forEach((n) => io.observe(n));
      return io;
    };

    const onHide = () => {
      if (document.visibilityState !== "hidden") return;
      const started = Number(sessionStorage.getItem(START_KEY) || Date.now());
      const sec = Math.max(1, Math.round((Date.now() - started) / 1000));
      send([{ type: "leave", path: here(), detail: `${sec}s` }]);
    };

    const dwell = window.setInterval(() => {
      const started = Number(sessionStorage.getItem(START_KEY) || Date.now());
      const sec = Math.max(1, Math.round((Date.now() - started) / 1000));
      send([{ type: "dwell", path: here(), detail: `${sec}s` }]);
    }, 20_000);

    const io = observeSections();
    document.addEventListener("click", onClick, true);
    document.addEventListener("submit", onSubmit, true);
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.clearInterval(dwell);
      io?.disconnect();
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("submit", onSubmit, true);
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return null;
}
