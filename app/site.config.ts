export const siteConfig = {
  name: "Rauf Pashabayli",
  monogram: "RJ",
  role: {
    en: "Creative Frontend Engineer · Product Systems & WebGL",
    ru: "Creative Frontend Engineer · Product Systems & WebGL",
    uk: "Creative Frontend Engineer · Product Systems & WebGL",
  },
  tagline: {
    en: "I ship product interfaces that feel like systems: realtime ops desks, multi-role portals, and WebGL control surfaces — not landing pages.",
    ru: "Собираю продуктовые интерфейсы как системы: realtime ops-столы, multi-role порталы и WebGL control surfaces — не лендинги.",
    uk: "Збираю продуктові інтерфейси як системи: realtime ops-столи, multi-role портали та WebGL control surfaces — не лендінги.",
  },
  introWord: "RJ",
  introKicker: "OPEN TO WORK · FRONTEND SYSTEMS",
  introSub: {
    en: "NEXT · REALTIME · WEBGL · PRODUCT UI",
    ru: "NEXT · REALTIME · WEBGL · PRODUCT UI",
    uk: "NEXT · REALTIME · WEBGL · PRODUCT UI",
  },
  hire: {
    status: {
      en: "Open to work",
      ru: "Открыт к офферам",
      uk: "Відкритий до оферів",
    },
    availability: {
      en: "Remote / Hybrid",
      ru: "Remote / Hybrid",
      uk: "Remote / Hybrid",
    },
    focus: {
      en: "Frontend · Creative Eng",
      ru: "Frontend · Creative Eng",
      uk: "Frontend · Creative Eng",
    },
    reply: {
      en: "Reply < 24h",
      ru: "Ответ < 24ч",
      uk: "Відповідь < 24г",
    },
  },
  links: {
    email: "hello@example.com",
    /** Public GitHub intentionally omitted — commercial IP. Access via NDA flow. */
    github: null as string | null,
    linkedin: "https://www.linkedin.com/in/beyli/",
  },
  source: {
    policy: "nda" as const,
    label: {
      en: "Source · NDA",
      ru: "Код · NDA",
      uk: "Код · NDA",
    },
  },
  stack: [
    "Next.js",
    "React Three Fiber",
    "GSAP",
    "Framer Motion",
    "Realtime",
    "TypeScript",
    "Supabase",
  ],
  meta: {
    title: "Rauf Pashabayli · Creative Frontend Engineer",
    description:
      "Rauf Pashabayli — Creative Frontend Engineer. Product systems, realtime desks, WebGL interfaces, Next.js.",
  },
} as const;

export type SiteLang = "en" | "ru" | "uk";
