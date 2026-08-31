export const siteConfig = {
  name: "Rauf Pashabayli",
  monogram: "RJ",
  role: {
    en: "AI-Native Product Engineer · Full-Stack Builder",
    ru: "AI-Native Product Engineer · Full-Stack Builder",
    uk: "AI-Native Product Engineer · Full-Stack Builder",
  },
  tagline: {
    en: "I architect and ship production web products with Claude and Cursor — live demos, not slide decks. Auth, queues, scoring, realtime, failure paths — validated end to end.",
    ru: "Проектирую и шиплю production web-продукты с Claude и Cursor — live demos, не слайды. Auth, queues, scoring, realtime, failure paths — проверяю end to end.",
    uk: "Проектую і шиплю production web-продукти з Claude і Cursor — live demos, не слайди. Auth, queues, scoring, realtime, failure paths — перевіряю end to end.",
  },
  introWord: "RJ",
  introKicker: "OPEN TO WORK · US REMOTE",
  introSub: {
    en: "CURSOR · CLAUDE · NEXT · PRODUCTION DEMOS",
    ru: "CURSOR · CLAUDE · NEXT · PRODUCTION DEMOS",
    uk: "CURSOR · CLAUDE · NEXT · PRODUCTION DEMOS",
  },
  hire: {
    status: {
      en: "Open to work",
      ru: "Открыт к офферам",
      uk: "Відкритий до оферів",
    },
    availability: {
      en: "Remote · US W2 / contract",
      ru: "Remote · US W2 / contract",
      uk: "Remote · US W2 / contract",
    },
    focus: {
      en: "Product Engineer · Builder",
      ru: "Product Engineer · Builder",
      uk: "Product Engineer · Builder",
    },
    reply: {
      en: "Reply < 24h",
      ru: "Ответ < 24ч",
      uk: "Відповідь < 24г",
    },
  },
  links: {
    email: "rauf.pashabayli@outlook.com",
    /** Public GitHub intentionally omitted — commercial IP. Access via NDA flow. */
    github: null as string | null,
    linkedin: "https://www.linkedin.com/in/beyli/",
  },
  source: {
    policy: "nda" as const,
    label: {
      en: "Private repos · on request",
      ru: "Код · по запросу",
      uk: "Код · на запит",
    },
  },
  stack: [
    "Next.js",
    "TypeScript",
    "React",
    "Firebase",
    "PostgreSQL",
    "Playwright",
    "Cursor",
    "Claude",
  ],
  meta: {
    title: "Rauf Pashabayli · AI-Native Product Engineer",
    description:
      "Rauf Pashabayli — AI-Native Product Engineer. Six live production demos built with Cursor and Claude. Full-stack 0→1 delivery.",
  },
} as const;

export type SiteLang = "en" | "ru" | "uk";
