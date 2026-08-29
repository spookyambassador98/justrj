import type { Lang } from "../components/LanguageProvider";

export type Localized = { en: string; ru: string; uk?: string };
export type Shot = { ru: string; en: string; uk: string };

export type Feature = {
  id: string;
  title: Localized;
  body: Localized;
  image?: Shot | string;
  caption?: Localized;
};

export type Project = {
  id: string;
  index: string;
  title: Localized;
  accent: Localized;
  nav: Localized;
  hook: Localized;
  role: Localized;
  year: string;
  tech: string[];
  glow: string;
  image: Shot | string;
  imageCaption: Localized;
  link: string;
  overview: { en: string[]; ru: string[]; uk?: string[] };
  features: Feature[];
  architecture: Localized;
  code: string;
  /** Hire narrative triad */
  problem: Localized;
  build: Localized;
  result: Localized;
};

export function shot(
  folder:
    | "orbital"
    | "eye-master"
    | "asema"
    | "foamcore"
    | "lead-desk"
    | "hire-desk"
    | "drift",
  name: string
): Shot {
  return {
    ru: `/showcase-images/${folder}/ru/${name}`,
    en: `/showcase-images/${folder}/en/${name}`,
    uk: `/showcase-images/${folder}/uk/${name}`,
  };
}

/** Pick localized screenshot path for portfolio language. */
export function resolveShot(image: Shot | string, lang?: Lang): string {
  if (typeof image === "string") return image;
  if (lang && image[lang]) return image[lang];
  return image.en || image.uk || image.ru;
}

export function L(loc: Localized | undefined, lang?: Lang): string {
  if (!loc) return "";
  if (lang && loc[lang]) return loc[lang]!;
  return loc.en || loc.ru || loc.uk || "";
}

export function LList(
  block: { en: string[]; ru: string[]; uk?: string[] } | undefined,
  lang?: Lang
): string[] {
  if (!block) return [];
  if (lang && block[lang]?.length) return block[lang]!;
  return block.en || block.ru || block.uk || [];
}

export const projectsData: Project[] = [
  {
    id: "orbital",
    index: "01",
    title: { en: "Orbital C2", ru: "Orbital C2", uk: "Orbital C2" },
    accent: { en: "Space control", ru: "Контроль орбиты", uk: "Контроль орбіти" },
    nav: { en: "Orbital C2", ru: "Orbital C2", uk: "Orbital C2" },
    hook: {
      en: "A control screen for satellites: Earth in 3D, live orbits, ground stations, solar activity and debris risk — six pages, one system.",
      ru: "Экран управления спутниками: Земля в 3D, живые орбиты, связь с Землёй, Солнце и космический мусор — шесть экранов в одной системе.",
    },
    role: {
      en: "Product · Realtime interface",
      ru: "Продукт · Живой интерфейс",
    },
    year: "2026",
    tech: ["React", "3D", "WebSockets", "Vite"],
    glow: "radial-gradient(ellipse 90% 75% at 48% 30%, rgba(15, 23, 42, 0.05) 0%, rgba(30, 58, 138, 0.03) 40%, transparent 72%)",
    image: shot("orbital", "page-01-hud-viewport.png"),
    imageCaption: {
      en: "Main screen — Earth, stations, pass timer",
      ru: "Главный экран — Земля, станции, таймер пролёта",
    },
    link: "https://demo-cosmo.vercel.app/",
    problem: {
      en: "Operators needed a flight deck, not a static dashboard of satellite charts.",
      ru: "Операторам нужен flight deck, а не статичный дашборд с орбитальными графиками.",
      uk: "Операторам потрібен flight deck, а не статичний дашборд з орбітальними графіками.",
    },
    build: {
      en: "R3F Earth scene + Socket.IO telemetry + TLE propagation in a six-screen HUD.",
      ru: "R3F-сцена Земли + Socket.IO телеметрия + TLE-пропагация в шестиэкранном HUD.",
      uk: "R3F-сцена Землі + Socket.IO телеметрія + TLE-пропагація в шестиекранному HUD.",
    },
    result: {
      en: "Live orbital control UI with real DSN / GOES feeds and continuous 60fps motion.",
      ru: "Живой орбитальный UI с DSN / GOES фидами и непрерывным motion на 60fps.",
      uk: "Живий орбітальний UI з DSN / GOES фідами і безперервним motion на 60fps.",
    },
    overview: {
      en: [
        "Looks like a film command deck — but the numbers are real: satellite paths, NASA ground dishes, solar flares.",
        "Six screens you switch between without leaving the product. Built so the picture keeps moving even when data updates every second.",
      ],
      ru: [
        "Выглядит как командный мостик из фильма — но цифры настоящие: траектории спутников, антенны NASA, вспышки на Солнце.",
        "Шесть экранов, между которыми переключаешься, не выходя из продукта. Картинка не зависает, даже когда данные обновляются каждую секунду.",
      ],
      uk: [
        "Выглядит как командный мостик из фильма — но цифры настоящие: траектории спутников, антенны NASA, вспышки на Солнце.",
        "Шесть экранов, между которыми переключаешься, не выходя из продукта. Картинка не зависает, даже когда данные обновляются каждую секунду.",
      ]
    },
    features: [
      {
        id: "page-01",
        title: { ru: "Главный экран", en: "Main screen" },
        body: {
          ru: "Вращающаяся Земля, спутники с подписями, панель связи с наземной станцией и таймер ближайшего пролёта. Сюда смотришь в первую очередь.",
          en: "A spinning Earth, labeled satellites, a ground-station link panel and a countdown to the next pass. This is the home view.",
        },
        image: shot("orbital", "page-01-hud-viewport.png"),
        caption: { ru: "Страница 1 — основной пульт", en: "Page 1 — main console" },
      },
      {
        id: "page-02",
        title: { ru: "Орбиты — матрица 2×2", en: "Orbits — 2×2 matrix" },
        body: {
          ru: "Четыре карточки по спутникам сразу: высота, скорость, широта и долгота в реальном времени. Удобно сравнивать объекты рядом.",
          en: "Four satellite cards at once: altitude, speed, latitude and longitude updating live. Easy to compare objects side by side.",
        },
        image: shot("orbital", "page-02-orbits-viewport.png"),
        caption: { ru: "Страница 2 — ОРБИТЫ", en: "Page 2 — ORBITS" },
      },
      {
        id: "page-03",
        title: { ru: "Сенсоры", en: "Sensors" },
        body: {
          ru: "Глубокие показатели канала связи: плазма, спектр, температура, ключи шифрования. Экран для тех, кому мало «просто картинки».",
          en: "Deeper link metrics: plasma, spectrum, temperature, crypto keys. For when a pretty globe is not enough.",
        },
        image: shot("orbital", "page-03-sensors-viewport.png"),
        caption: { ru: "Страница 3 — СЕНСОРЫ", en: "Page 3 — SENSORS" },
      },
      {
        id: "page-04",
        title: { ru: "Солнце", en: "Solar" },
        body: {
          ru: "Что происходит на Солнце прямо сейчас: класс вспышки, солнечный ветер, геомагнитная активность. Отдельно — живая анимация частиц.",
          en: "What the Sun is doing right now: flare class, solar wind, geomagnetic activity — plus a live particle animation.",
        },
        image: shot("orbital", "page-04-solar-viewport.png"),
        caption: { ru: "Страница 4 — СОЛНЦЕ", en: "Page 4 — SOLAR" },
      },
      {
        id: "page-05",
        title: { ru: "Чёрная дыра", en: "Black hole" },
        body: {
          ru: "Экран-супервизор сингулярности: визуализация аккреционного диска, масса, горизонт событий, индекс приливных сил. Научная витрина внутри того же продукта.",
          en: "A singularity supervisor: accretion-disk visual, mass, event horizon, tidal-force index. A science showcase inside the same product.",
        },
        image: shot("orbital", "page-05-blackhole-viewport.png"),
        caption: { ru: "Страница 5 — ДЫРА", en: "Page 5 — BLACK HOLE" },
      },
      {
        id: "page-06",
        title: { ru: "Космический мусор", en: "Space debris" },
        body: {
          ru: "Радар угроз: как близко обломок, сколько времени до сближения, насколько «забит» низкий орбитальный слой. Риск видно сразу, без таблиц на десять экранов.",
          en: "A threat radar: how close the fragment is, time to closest approach, how crowded low Earth orbit is. Risk at a glance — no ten-screen spreadsheets.",
        },
        image: shot("orbital", "page-06-debris-viewport.png"),
        caption: { ru: "Страница 6 — МУСОР", en: "Page 6 — DEBRIS" },
      },
    ],
    architecture: {
      en: "The browser draws the 3D Earth; a small server feeds live satellite and station data. Pages switch without reloading the whole app.",
      ru: "Браузер рисует 3D-Землю, маленький сервер подкидывает живые данные по спутникам и станциям. Экраны меняются без полной перезагрузки.",
    },
    code: `// данные приходят сами — экран только показывает
socket.on("update", (data) => screen.draw(data));`,
  },
  {
    id: "eye_master",
    index: "02",
    title: { en: "The Art of Look", ru: "Искусство Взгляда", uk: "Мистецтво Погляду" },
    accent: { en: "Beauty salon", ru: "Салон красоты", uk: "Салон краси" },
    nav: { en: "The Art of Look", ru: "Искусство Взгляда", uk: "Мистецтво Погляду" },
    hook: {
      en: "A booking site for a lash artist: the client picks a time and sends photos, the master manages everything from a private cabinet.",
      ru: "Сайт записи к мастеру ресниц: клиент выбирает время и шлёт фото, мастер ведёт всё из закрытого кабинета.",
    },
    role: {
      en: "Brand site · Salon ops",
      ru: "Сайт бренда · Работа салона",
    },
    year: "2026",
    tech: ["Next.js", "Supabase", "Framer Motion"],
    glow: "radial-gradient(ellipse 90% 75% at 48% 30%, rgba(41, 24, 28, 0.05) 0%, rgba(69, 26, 39, 0.03) 42%, transparent 72%)",
    image: shot("eye-master", "public-hero-viewport.png"),
    imageCaption: {
      en: "Public page — brand, portfolio, booking",
      ru: "Публичная страница — бренд, портфолио, заявка",
    },
    link: "https://demo-beautymaster.vercel.app/",
    problem: {
      en: "Salon brands need booking that looks premium — not a generic calendar widget.",
      ru: "Салону нужен премиальный booking, а не шаблонный виджет календаря.",
      uk: "Салону потрібен преміальний booking, а не шаблонний віджет календаря.",
    },
    build: {
      en: "Next.js brand site + PIN master cabinet + realtime bookings/photos on Supabase.",
      ru: "Next.js витрина + PIN-кабинет мастера + realtime заявки/фото на Supabase.",
      uk: "Next.js вітрина + PIN-кабінет майстра + realtime заявки/фото на Supabase.",
    },
    result: {
      en: "Client booking funnel + private ops cabinet in one product surface.",
      ru: "Клиентский funnel записи + приватный ops-кабинет в одном продукте.",
      uk: "Клієнтський funnel запису + приватний ops-кабінет в одному продукті.",
    },
    overview: {
      en: [
        "Not a generic calendar. The page looks like the brand, and booking is a short guided flow.",
        "The master unlocks a private cabinet with a PIN: schedule, incoming requests with photos, and portfolio uploads.",
      ],
      ru: [
        "Не очередной шаблонный календарь. Страница выглядит как бренд, а запись — короткий понятный сценарий.",
        "Мастер открывает кабинет пин-кодом: расписание, входящие заявки с фото и загрузка работ в портфолио.",
      ],
      uk: [
        "Не очередной шаблонный календарь. Страница выглядит как бренд, а запись — короткий понятный сценарий.",
        "Мастер открывает кабинет пин-кодом: расписание, входящие заявки с фото и загрузка работ в портфолио.",
      ]
    },
    features: [
      {
        id: "public-hero",
        title: { ru: "Витрина для клиентов", en: "Client-facing showcase" },
        body: {
          ru: "Крупный заголовок, телефон, адрес и портфолио работ. С первого экрана понятно, куда писать и как выглядит результат.",
          en: "Big headline, phone, address and a portfolio of work. From the first screen you know who to call and what the result looks like.",
        },
        image: shot("eye-master", "public-hero-viewport.png"),
        caption: { ru: "Главная для гостя", en: "Guest homepage" },
      },
      {
        id: "booking-funnel",
        title: { ru: "Запись в несколько шагов", en: "Step-by-step booking" },
        body: {
          ru: "Клиент выбирает свободное время, прикладывает фото «как сейчас» и референс «как хочу», пишет пожелания и отправляет заявку.",
          en: "The client picks a free slot, attaches a ‘before’ photo and a desired look, adds notes and sends the request.",
        },
        image: shot("eye-master", "home-viewport.png"),
        caption: { ru: "Форма «Оставить заявку»", en: "Booking form" },
      },
      {
        id: "admin-gate",
        title: { ru: "Вход в кабинет мастера", en: "Master cabinet login" },
        body: {
          ru: "Отдельный экран с пин-кодом. Посторонний не увидит расписание и заявки клиентов — только тот, кто знает код.",
          en: "A separate PIN screen. Outsiders never see the schedule or client requests — only someone with the code.",
        },
        image: shot("eye-master", "admin-gate-viewport.png"),
        caption: { ru: "Пин-код перед кабинетом", en: "PIN before the cabinet" },
      },
      {
        id: "admin-schedule",
        title: { ru: "Расписание и заявки", en: "Schedule & requests" },
        body: {
          ru: "Слева мастер добавляет свободные окна. Справа — входящие записи: имя, время, комментарий и фото глаз. Всё обновляется само, без обновления страницы вручную.",
          en: "On the left the master adds free slots. On the right — incoming bookings: name, time, notes and eye photos. It refreshes on its own.",
        },
        image: shot("eye-master", "admin-cabinet-viewport.png"),
        caption: { ru: "Кабинет — расписание и входящие", en: "Cabinet — schedule & inbox" },
      },
      {
        id: "admin-portfolio",
        title: { ru: "Портфолио из кабинета", en: "Portfolio from the cabinet" },
        body: {
          ru: "Загрузил фото работы, дал название — и оно сразу появляется на публичной витрине. Можно переименовать или удалить.",
          en: "Upload a finished look, give it a title — it shows on the public page. Rename or delete anytime.",
        },
        image: shot("eye-master", "admin-portfolio-viewport.png"),
        caption: { ru: "Управление портфолио", en: "Portfolio management" },
      },
    ],
    architecture: {
      en: "A public page for clients and a private cabinet for the master. Photos and bookings live in one cloud database.",
      ru: "Публичная страница для клиентов и закрытый кабинет для мастера. Фото и записи лежат в одном облаке.",
    },
    code: `// заявка = слот + фото + комментарий
booking.create({ slot, photos, note });`,
  },
  {
    id: "asema",
    index: "03",
    title: { en: "Trading Platform", ru: "Trading Platform", uk: "Trading Platform" },
    accent: { en: "Education portal", ru: "Образовательный портал", uk: "Освітній портал" },
    nav: { en: "Trading Platform", ru: "Trading Platform", uk: "Trading Platform" },
    hook: {
      en: "A trading school in one portal: lessons and practice for the student, review and risk control for the curator.",
      ru: "Школа трейдинга в одном портале: уроки и практика для ученика, проверка и контроль риска для куратора.",
    },
    role: {
      en: "Education platform",
      ru: "Образовательная платформа",
    },
    year: "2026",
    tech: ["React", "Node", "Database", "Realtime chat"],
    glow: "radial-gradient(ellipse 90% 75% at 48% 30%, rgba(6, 78, 59, 0.05) 0%, rgba(6, 78, 59, 0.03) 42%, transparent 72%)",
    image: shot("asema", "coord-radar-viewport.png"),
    imageCaption: {
      en: "Curator desk — trade review board",
      ru: "Стол куратора — проверка сделок",
    },
    link: "https://demo-trading-one.vercel.app/auth",
    problem: {
      en: "Trading schools drown in chats — student practice and curator review live in different tools.",
      ru: "Школы трейдинга тонут в чатах: практика ученика и проверка куратора в разных инструментах.",
      uk: "Школи трейдингу тонуть у чатах: практика учня і перевірка куратора в різних інструментах.",
    },
    build: {
      en: "Dual-role portal: student journal/practice + curator review board with realtime chat and risk signals.",
      ru: "Двухролевой портал: дневник/практика ученика + доска проверки куратора с realtime-чатом и риск-сигналами.",
      uk: "Дворольовий портал: щоденник/практика учня + дошка перевірки куратора з realtime-чатом і ризик-сигналами.",
    },
    result: {
      en: "One workspace for learning ops — pending trades, homework, dossiers, risk alerts.",
      ru: "Одно рабочее место для learning ops — сделки, домашки, досье, риск-алерты.",
      uk: "Одне робоче місце для learning ops — угоди, домашки, досьє, ризик-алерти.",
    },
    overview: {
      en: [
        "Student side: course, trade journal, chat with the mentor, and a demo chart to practice entries.",
        "Curator side: pending trades, homework, student dossiers, chats and risk alerts — the whole group in one workspace.",
      ],
      ru: [
        "Сторона ученика: обучение, дневник сделок, чат с куратором и демо-график для практики входов.",
        "Сторона куратора: сделки на проверку, домашки, досье, чаты и риск-сигналы — вся группа в одном рабочем месте.",
      ],
      uk: [
        "Сторона ученика: обучение, дневник сделок, чат с куратором и демо-график для практики входов.",
        "Сторона куратора: сделки на проверку, домашки, досье, чаты и риск-сигналы — вся группа в одном рабочем месте.",
      ]
    },
    features: [
      {
        id: "auth",
        title: { ru: "Вход в портал", en: "Portal sign-in" },
        body: {
          ru: "Один экран входа по почте и паролю. Ученик открывает свой кабинет, куратор — операционную панель. Роли не пересекаются.",
          en: "One email/password gate. Students open their cabinet, curators open the ops panel. Roles stay separate.",
        },
        image: shot("asema", "auth-viewport.png"),
        caption: { ru: "Экран входа", en: "Login screen" },
      },
      {
        id: "student-course",
        title: { ru: "Ученик — Обучение", en: "Student — Course" },
        body: {
          ru: "Модули и уроки с прогрессом: что уже пройдено, что ещё впереди. Квизы и домашние задания привязаны к программе — ученик не теряется в материале.",
          en: "Modules and lessons with clear progress. Quizzes and homework sit inside the curriculum so the student always knows what is next.",
        },
        image: shot("asema", "student-course-viewport.png"),
        caption: { ru: "Раздел обучения", en: "Learning section" },
      },
      {
        id: "student-journal",
        title: { ru: "Ученик — Дневник сделок", en: "Student — Trade journal" },
        body: {
          ru: "Сюда ученик заносит сделки с рынка или симулятора. Куратор потом принимает или отклоняет запись — и только после проверки меняется демо-баланс.",
          en: "Where students log trades from the market or simulator. The curator accepts or rejects each entry — and only then does the demo balance move.",
        },
        image: shot("asema", "student-journal-viewport.png"),
        caption: { ru: "Дневник сделок", en: "Trade journal" },
      },
      {
        id: "student-chat",
        title: { ru: "Ученик — Чат с куратором", en: "Student — Mentor chat" },
        body: {
          ru: "Переписка прямо в портале: вопрос по уроку или по конкретной сделке — без ухода в Telegram и без потери контекста.",
          en: "Chat inside the portal: ask about a lesson or a specific trade without jumping to Telegram and losing context.",
        },
        image: shot("asema", "student-chat-viewport.png"),
        caption: { ru: "Чат с куратором", en: "Chat with curator" },
      },
      {
        id: "student-sim",
        title: { ru: "Ученик — Симулятор", en: "Student — Simulator" },
        body: {
          ru: "Демо-счёт и график для отработки входов. Можно сбросить баланс и начать заново — история сделок при этом остаётся для разбора с куратором.",
          en: "A demo balance and chart for practicing entries. Reset the balance anytime — the trade history stays for review with the curator.",
        },
        image: shot("asema", "student-sim-viewport.png"),
        caption: { ru: "Практика на графике", en: "Chart practice" },
      },
      {
        id: "coord-radar",
        title: { ru: "Куратор — Проверка сделок", en: "Curator — Trade review" },
        body: {
          ru: "Очередь группы: на проверку, принятые, отклонённые. Фильтры Long/Short. Из карточки сделки можно сразу открыть ученика или написать в чат.",
          en: "Group queue: pending, accepted, rejected. Long/Short filters. From a trade card you can open the student file or jump into chat.",
        },
        image: shot("asema", "coord-radar-viewport.png"),
        caption: { ru: "Очередь сделок", en: "Trade queue" },
      },
      {
        id: "coord-homework",
        title: { ru: "Куратор — Проверка ДЗ", en: "Curator — Homework review" },
        body: {
          ru: "Все домашние работы группы в одном списке. Не нужно собирать скрины из переписок — проверка идёт по факту сдачи в портале.",
          en: "The whole group's homework in one list. No collecting screenshots from chats — review follows what was submitted in the portal.",
        },
        image: shot("asema", "coord-homework-viewport.png"),
        caption: { ru: "Домашние задания", en: "Homework board" },
      },
      {
        id: "coord-crm",
        title: { ru: "Куратор — Досье учеников", en: "Curator — Student dossiers" },
        body: {
          ru: "Список группы и карточка каждого: прогресс по курсу, сделки, заметки куратора. Можно временно запретить отправку сделок, если человек «перегрелся».",
          en: "Group list and a file for each student: course progress, trades, curator notes. Freeze new trade submits if someone is tilting.",
        },
        image: shot("asema", "coord-crm-viewport.png"),
        caption: { ru: "Досье группы", en: "Group dossiers" },
      },
      {
        id: "coord-comms",
        title: { ru: "Куратор — Чаты с учениками", en: "Curator — Student inbox" },
        body: {
          ru: "Все диалоги группы в одном инбоксе. Можно разобрать конкретную сделку или урок, не теряя нить переписки.",
          en: "All group threads in one inbox. Walk through a trade or a lesson without losing the conversation thread.",
        },
        image: shot("asema", "coord-comms-viewport.png"),
        caption: { ru: "Чаты с учениками", en: "Student chats" },
      },
      {
        id: "coord-alerts",
        title: { ru: "Куратор — Риск-менеджер", en: "Curator — Risk manager" },
        body: {
          ru: "Система подсвечивает опасные ситуации: серия убытков, сильная просадка, зависшие на проверке сделки. Куратор видит, к кому подойти первым.",
          en: "The system flags danger: loss streaks, deep drawdown, reviews stuck in the queue. The curator sees who needs attention first.",
        },
        image: shot("asema", "coord-alerts-viewport.png"),
        caption: { ru: "Сигналы риска", en: "Risk signals" },
      },
    ],
    architecture: {
      en: "One login, two workspaces: student and curator. Balance and trade status change only after a real review — not from a decorative UI button.",
      ru: "Один вход, два рабочих места: ученик и куратор. Баланс и статус сделки меняются только после настоящей проверки — не от «кнопки ради кнопки».",
    },
    code: `// сначала проверка куратора — потом баланс
review.approve(trade) → balance.update()`,
  },
  {
    id: "foamcore",
    index: "04",
    title: { en: "FOAMCORE Portal", ru: "FOAMCORE Portal", uk: "FOAMCORE Portal" },
    accent: { en: "B2B production", ru: "B2B производство", uk: "B2B виробництво" },
    nav: { en: "FOAMCORE Portal", ru: "FOAMCORE Portal", uk: "FOAMCORE Portal" },
    hook: {
      en: "A B2B portal for foam production: public catalog and RFQ, live order tracking, and four workspaces — client, shop floor, sales manager, admin.",
      ru: "B2B-портал завода пенопласта: каталог и заявка с сайта, живой трекинг заказа и четыре кабинета — клиент, цех, менеджер, админ.",
    },
    role: {
      en: "Industrial portal · RFQ & ops",
      ru: "Портал завода · заявки и производство",
    },
    year: "2026",
    tech: ["Next.js", "Realtime", "Kanban", "Auth"],
    glow: "radial-gradient(ellipse 90% 75% at 48% 30%, rgba(234, 88, 12, 0.06) 0%, rgba(67, 20, 7, 0.04) 42%, transparent 72%)",
    image: shot("foamcore", "public-hero-viewport.png"),
    imageCaption: {
      en: "Public site — grades, lab proof, RFQ",
      ru: "Публичный сайт — марки, лаборатория, заявка",
    },
    link: "https://demo-foamcore.vercel.app/",
    problem: {
      en: "Foam plant sales ran on phone/email — buyers couldn't track RFQ → production without calling.",
      ru: "Продажи завода шли через телефон/почту — покупатель не видел путь RFQ → производство без звонков.",
      uk: "Продажі заводу йшли через телефон/пошту — покупець не бачив шлях RFQ → виробництво без дзвінків.",
    },
    build: {
      en: "Public catalog + RFQ, track codes, and four role cabinets (client, floor, manager, admin).",
      ru: "Публичный каталог + RFQ, трек-коды и четыре ролевых кабинета (клиент, цех, менеджер, админ).",
      uk: "Публічний каталог + RFQ, трек-коди і чотири рольові кабінети (клієнт, цех, менеджер, адмін).",
    },
    result: {
      en: "End-to-end B2B ops portal — RFQ to shop-floor kanban with audit trail.",
      ru: "Сквозной B2B ops-портал — от RFQ до цехового kanban с audit trail.",
      uk: "Наскрізний B2B ops-портал — від RFQ до цехового kanban з audit trail.",
    },
    overview: {
      en: [
        "A buyer sees real grades and lab claims, sends an RFQ, and gets a track code — no phone tag for status updates.",
        "Inside: the client watches their orders, the executor marks production steps, the manager runs a kanban and the team, the admin sees money, people and the audit trail.",
      ],
      ru: [
        "Покупатель видит марки и лабораторные цифры, оставляет заявку и получает трек-код — статус не нужно выпрашивать по телефону.",
        "Внутри: клиент смотрит свои заказы, исполнитель двигает производство, менеджер ведёт kanban и команду, админ — выручку, людей и журнал действий.",
      ],
      uk: [
        "Покупатель видит марки и лабораторные цифры, оставляет заявку и получает трек-код — статус не нужно выпрашивать по телефону.",
        "Внутри: клиент смотрит свои заказы, исполнитель двигает производство, менеджер ведёт kanban и команду, админ — выручку, людей и журнал действий.",
      ]
    },
    features: [
      {
        id: "public-hero",
        title: { ru: "Витрина завода", en: "Plant showcase" },
        body: {
          ru: "Главный экран для инженера и снабженца: ГОСТ, горючесть Г1, три марки ПСБ-С и понятный призыв оставить заявку на поставку.",
          en: "The first screen for engineers and buyers: GOST, G1 flammability, three PSB-S grades and a clear path to request a quote.",
        },
        image: shot("foamcore", "public-hero-viewport.png"),
        caption: { ru: "Лендинг — первый экран", en: "Landing — first screen" },
      },
      {
        id: "public-catalog",
        title: { ru: "Каталог марок", en: "Grade catalog" },
        body: {
          ru: "ПСБ-С-15 / 25 / 35 с плотностью, прочностью, теплопроводностью и сферами применения. Можно сразу запросить нужную марку.",
          en: "PSB-S-15 / 25 / 35 with density, strength, conductivity and use cases. Request the grade you need in one click.",
        },
        image: shot("foamcore", "public-catalog-viewport.png"),
        caption: { ru: "Характеристики марок", en: "Grade specs" },
      },
      {
        id: "public-lab",
        title: { ru: "Лаборатория", en: "Laboratory" },
        body: {
          ru: "Аргумент доверия до сделки: сжатие, теплопроводность, водопоглощение, класс Г1 и сравнение «12 см пенопласта ≈ 2 м кирпича».",
          en: "Trust before the deal: compression, conductivity, water uptake, G1 class and the “12 cm foam ≈ 2 m brick” comparison.",
        },
        image: shot("foamcore", "public-lab-viewport.png"),
        caption: { ru: "Контроль качества", en: "Quality control" },
      },
      {
        id: "public-rfq",
        title: { ru: "Заявка RFQ", en: "RFQ form" },
        body: {
          ru: "Имя, контакт, марка, объём и толщина. После отправки клиент получает трек-код — заявка сразу попадает в работу менеджера.",
          en: "Name, contact, grade, volume and thickness. After submit the buyer gets a track code — and sales sees the request live.",
        },
        image: shot("foamcore", "public-rfq-viewport.png"),
        caption: { ru: "Форма поставки", en: "Supply request form" },
      },
      {
        id: "public-tracking",
        title: { ru: "Публичный трекинг", en: "Public tracking" },
        body: {
          ru: "Без входа в кабинет: ввёл трек-код — увидел марку, объём, историю статусов и сумму. Удобно для клиента и диспетчера.",
          en: "No login needed: enter a track code and see grade, volume, status history and total. Handy for buyers and dispatch.",
        },
        image: shot("foamcore", "public-tracking-viewport.png"),
        caption: { ru: "Трекинг по коду", en: "Track by code" },
      },
      {
        id: "auth-login",
        title: { ru: "Вход в портал", en: "Portal sign-in" },
        body: {
          ru: "Один экран для всех ролей. Почта решает, куда попадёшь: клиент, исполнитель цеха, менеджер или админ.",
          en: "One gate for every role. Email decides where you land: client, shop-floor executor, manager or admin.",
        },
        image: shot("foamcore", "auth-login-viewport.png"),
        caption: { ru: "Экран входа", en: "Login screen" },
      },
      {
        id: "client-dashboard",
        title: { ru: "Клиент — мои заказы", en: "Client — my orders" },
        body: {
          ru: "Список заказов с фильтром по статусу и кнопкой новой заявки. Как только менеджер сдвигает этап — карточка обновляется сама.",
          en: "Order list with status filters and a new-RFQ button. When sales moves a stage, the card refreshes on its own.",
        },
        image: shot("foamcore", "client-dashboard-viewport.png"),
        caption: { ru: "Кабинет клиента", en: "Client cabinet" },
      },
      {
        id: "client-order",
        title: { ru: "Клиент — карточка и чат", en: "Client — order & chat" },
        body: {
          ru: "Трек-код, марка, толщина, объём, сумма и переписка с заводом в одном экране. Можно повторить заказ одним действием.",
          en: "Track code, grade, thickness, volume, total and a chat with the plant on one screen. Reorder in one tap.",
        },
        image: shot("foamcore", "client-order-viewport.png"),
        caption: { ru: "Детали заказа клиента", en: "Client order detail" },
      },
      {
        id: "executor-dashboard",
        title: { ru: "Исполнитель — задачи цеха", en: "Executor — shop tasks" },
        body: {
          ru: "Только назначенные заказы: сколько в работе, что просрочено. Исполнитель отмечает этапы производства — менеджер видит это сразу.",
          en: "Only assigned jobs: how many active, what’s overdue. The executor marks production steps — the manager sees it live.",
        },
        image: shot("foamcore", "executor-dashboard-viewport.png"),
        caption: { ru: "Кабинет исполнителя", en: "Executor cabinet" },
      },
      {
        id: "manager-dashboard",
        title: { ru: "Менеджер — сводка дня", en: "Manager — day overview" },
        body: {
          ru: "Всего заказов, новых за сегодня, в работе и просроченных дольше двух дней. График за неделю и выручка — чтобы быстро понять нагрузку.",
          en: "Total orders, new today, in progress and overdue over two days. A 7-day chart and revenue so load is obvious at a glance.",
        },
        image: shot("foamcore", "manager-dashboard-viewport.png"),
        caption: { ru: "Дашборд менеджера", en: "Manager dashboard" },
      },
      {
        id: "manager-kanban",
        title: { ru: "Менеджер — kanban", en: "Manager — kanban" },
        body: {
          ru: "Доска: новый → в обработке → на производстве → готов → отгружен. Карточку можно двигать по этапам — статус уходит клиенту и исполнителю.",
          en: "Board: new → processing → production → ready → shipped. Drag stages and the status reaches both the client and the shop floor.",
        },
        image: shot("foamcore", "manager-kanban-viewport.png"),
        caption: { ru: "Доска заказов", en: "Order board" },
      },
      {
        id: "manager-order",
        title: { ru: "Менеджер — карточка заказа", en: "Manager — order card" },
        body: {
          ru: "Смена статуса, назначение исполнителя, дедлайн, счёт и чат. Вся операционка по одному заказу без переписок в мессенджерах.",
          en: "Change status, assign an executor, set a deadline, attach an invoice and chat. One order, no messenger ping-pong.",
        },
        image: shot("foamcore", "manager-order-viewport.png"),
        caption: { ru: "Операции по заказу", en: "Order operations" },
      },
      {
        id: "manager-team",
        title: { ru: "Менеджер — команда", en: "Manager — team" },
        body: {
          ru: "Кто из исполнителей чем занят, сколько активных и просроченных задач. Назначение людей делается в карточке заказа.",
          en: "Who on the shop floor owns what, how many active and overdue jobs. People are assigned from the order card.",
        },
        image: shot("foamcore", "manager-team-viewport.png"),
        caption: { ru: "Нагрузка команды", en: "Team workload" },
      },
      {
        id: "manager-clients",
        title: { ru: "Менеджер — клиенты", en: "Manager — clients" },
        body: {
          ru: "База клиентов с поиском по имени, телефону и компании — чтобы быстро найти повторного заказчика.",
          en: "Client directory with search by name, phone and company — find a returning buyer in seconds.",
        },
        image: shot("foamcore", "manager-clients-viewport.png"),
        caption: { ru: "Справочник клиентов", en: "Client directory" },
      },
      {
        id: "admin-dashboard",
        title: { ru: "Админ — аналитика", en: "Admin — analytics" },
        body: {
          ru: "Сводка по заказам, выручке и маркам. Можно выгрузить CSV для бухгалтерии — без ручного сбора таблиц.",
          en: "Orders, revenue and grades at a glance. Export CSV for accounting — no hand-built spreadsheets.",
        },
        image: shot("foamcore", "admin-dashboard-viewport.png"),
        caption: { ru: "Аналитика завода", en: "Plant analytics" },
      },
      {
        id: "admin-monitor",
        title: { ru: "Админ — контроль", en: "Admin — oversight" },
        body: {
          ru: "Иерархия: менеджеры, исполнители, просрочки и журнал — кто назначил, кто сменил статус, кто поставил дедлайн.",
          en: "Hierarchy view: managers, executors, overdues and an audit log — who assigned, who moved status, who set a deadline.",
        },
        image: shot("foamcore", "admin-monitor-viewport.png"),
        caption: { ru: "Журнал контроля", en: "Control journal" },
      },
      {
        id: "admin-users",
        title: { ru: "Админ — пользователи", en: "Admin — users" },
        body: {
          ru: "Список людей портала и смена роли: клиент, исполнитель, менеджер, админ. Доступы не размазаны по чатам.",
          en: "Portal people list and role changes: client, executor, manager, admin. Access stays in one place.",
        },
        image: shot("foamcore", "admin-users-viewport.png"),
        caption: { ru: "Роли и доступы", en: "Roles & access" },
      },
      {
        id: "admin-catalog",
        title: { ru: "Админ — каталог цен", en: "Admin — price catalog" },
        body: {
          ru: "Цены за м³ и наличие по маркам. Обновил прайс — форма заявки на сайте считает от новых цифр.",
          en: "Price per m³ and stock by grade. Update the list — the public RFQ form follows the new numbers.",
        },
        image: shot("foamcore", "admin-catalog-viewport.png"),
        caption: { ru: "Прайс и наличие", en: "Price & stock" },
      },
    ],
    architecture: {
      en: "Public site brings the RFQ in. Four role cabinets move the same order through production with live status and chat — trackable even without login.",
      ru: "Сайт приводит заявку. Четыре кабинета ведут один и тот же заказ по производству с живым статусом и чатом — трек работает даже без входа.",
    },
    code: `// заявка → трек-код → kanban → отгрузка
rfq.create() → track.watch() → status.ship()`,
  },
  {
    id: "lead_desk",
    index: "05",
    title: { en: "Lead Desk", ru: "Lead Desk", uk: "Lead Desk" },
    accent: { en: "Outreach console", ru: "Консоль аутрича", uk: "Консоль аутрічу" },
    nav: { en: "Lead Desk", ru: "Lead Desk", uk: "Lead Desk" },
    hook: {
      en: "Ops console for UA + US leads: daily queue, industry filters, social handles, and a live parser that fills the pipeline.",
      ru: "Ops-консоль для лидов UA + US: очередь дня, фильтры по отраслям, соцсети и живой парсер, который наполняет воронку.",
      uk: "Ops-консоль для лідів UA + US: черга дня, фільтри за галузями, соцмережі й живий парсер, який наповнює воронку.",
    },
    role: {
      en: "Ops tool · Lead harvest",
      ru: "Ops-инструмент · сбор лидов",
      uk: "Ops-інструмент · збір лідів",
    },
    year: "2026",
    tech: ["Next.js", "Firebase", "Parser", "Framer Motion"],
    glow: "radial-gradient(ellipse 90% 75% at 48% 30%, rgba(34, 211, 238, 0.06) 0%, rgba(8, 47, 73, 0.04) 42%, transparent 72%)",
    image: shot("lead-desk", "queue-viewport.jpg"),
    imageCaption: {
      en: "Daily queue — priority targets",
      ru: "Очередь дня — приоритетные цели",
      uk: "Черга дня — пріоритетні цілі",
    },
    link: "https://lead-desk-liart-six.vercel.app",
    problem: {
      en: "Outreach lived in spreadsheets — no scored daily queue, no live harvest into the same HUD.",
      ru: "Аутрич жил в таблицах — не было скоринговой очереди дня и живого сбора в одном HUD.",
      uk: "Аутріч жив у таблицях — не було скорингової черги дня й живого збору в одному HUD.",
    },
    build: {
      en: "Next.js ops HUD + Firebase + parser workers with industry lanes and promote-to-queue.",
      ru: "Next.js ops HUD + Firebase + парсер с отраслевыми полосами и promote в очередь.",
      uk: "Next.js ops HUD + Firebase + парсер з галузевими смугами і promote в чергу.",
    },
    result: {
      en: "One command deck: score, geo, social, MAX LIVE harvest, CSV export.",
      ru: "Один командный мостик: скор, гео, соцсети, MAX LIVE сбор, CSV-экспорт.",
      uk: "Один командний місток: скор, гео, соцмережі, MAX LIVE збір, CSV-експорт.",
    },
    overview: {
      en: [
        "Not a CRM graveyard — a command deck: score, geo, email, social, status. One queue for what to touch today.",
        "MAX LIVE harvest pulls OSM + secondary sources into the buffer. Promote, purge, export — without leaving the HUD.",
      ],
      ru: [
        "Не склад CRM — командный мостик: скор, гео, email, соцсети, статус. Одна очередь на то, кого трогать сегодня.",
        "MAX LIVE тянет OSM и вторичные источники в буфер. Promote, purge, export — не выходя из HUD.",
      ],
      uk: [
        "Не склад CRM — командний місток: скор, гео, email, соцмережі, статус. Одна черга на те, кого чіпати сьогодні.",
        "MAX LIVE тягне OSM і вторинні джерела в буфер. Promote, purge, export — не виходячи з HUD.",
      ],
    },
    features: [
      {
        id: "gate",
        title: { en: "Access gate", ru: "Шлюз доступа", uk: "Шлюз доступу" },
        body: {
          en: "Team code unlocks the console. Outsiders stay out — ops stay private.",
          ru: "Код команды открывает консоль. Посторонним вход закрыт.",
          uk: "Код команди відкриває консоль. Стороннім вхід закритий.",
        },
        image: shot("lead-desk", "gate-viewport.jpg"),
        caption: { en: "Access lock screen", ru: "Экран входа", uk: "Екран входу" },
      },
      {
        id: "queue",
        title: { en: "Daily queue", ru: "Очередь дня", uk: "Черга дня" },
        body: {
          en: "Priority targets with score, offer angle, email and social columns — filter by geo and status.",
          ru: "Приоритетные цели со скором, оффером, email и соцсетями — фильтры по гео и статусу.",
          uk: "Пріоритетні цілі зі скором, офером, email і соцмережами — фільтри за гео і статусом.",
        },
        image: shot("lead-desk", "queue-viewport.jpg"),
        caption: { en: "Queue board", ru: "Доска очереди", uk: "Дошка черги" },
      },
      {
        id: "beauty",
        title: { en: "Industry lanes", ru: "Отраслевые полосы", uk: "Галузеві смуги" },
        body: {
          en: "Beauty, shops, medicine, hotels — segment the day by vertical without leaving the HUD.",
          ru: "Бьюти, магазины, медицина, отели — сегментируй день по вертикали, не выходя из HUD.",
          uk: "Б'юті, магазини, медицина, готелі — сегментуй день за вертикаллю, не виходячи з HUD.",
        },
        image: shot("lead-desk", "beauty-viewport.jpg"),
        caption: { en: "Beauty segment", ru: "Сегмент бьюти", uk: "Сегмент б'юті" },
      },
      {
        id: "parser",
        title: { en: "MAX LIVE harvest", ru: "MAX LIVE сбор", uk: "MAX LIVE збір" },
        body: {
          en: "Parser jobs fill the buffer from OSM and secondary sources — stop, live log, promote to queue.",
          ru: "Парсер наполняет буфер из OSM и вторичных источников — стоп, живой лог, promote в очередь.",
          uk: "Парсер наповнює буфер з OSM і вторинних джерел — стоп, живий лог, promote у чергу.",
        },
        image: shot("lead-desk", "parser-viewport.jpg"),
        caption: { en: "Parser control", ru: "Пульт парсера", uk: "Пульт парсера" },
      },
      {
        id: "admin",
        title: { en: "Admin console", ru: "Админка", uk: "Адмінка" },
        body: {
          en: "Team access, segment rules and system health — keep the ops layer under control.",
          ru: "Доступы команды, правила сегментов и здоровье системы — ops-слой под контролем.",
          uk: "Доступи команди, правила сегментів і здоров'я системи — ops-шар під контролем.",
        },
        image: shot("lead-desk", "admin-viewport.jpg"),
        caption: { en: "Admin surface", ru: "Админ-поверхность", uk: "Адмін-поверхня" },
      },
      {
        id: "exports",
        title: { en: "CSV export", ru: "Экспорт CSV", uk: "Експорт CSV" },
        body: {
          en: "Pull scored targets out of the HUD for outreach tools — filters carry into the export.",
          ru: "Выгружай цели со скором из HUD в outreach-инструменты — фильтры уходят в экспорт.",
          uk: "Вивантажуй цілі зі скором з HUD в outreach-інструменти — фільтри йдуть в експорт.",
        },
        image: shot("lead-desk", "exports-viewport.jpg"),
        caption: { en: "Export desk", ru: "Стол экспорта", uk: "Стіл експорту" },
      },
    ],
    architecture: {
      en: "Next.js HUD + Firebase storage + cron/parser workers. Access code gate.",
      ru: "Next.js HUD + Firebase + cron/парсер. Вход по коду.",
      uk: "Next.js HUD + Firebase + cron/парсер. Вхід за кодом.",
    },
    code: `// harvest → buffer → promote → queue
parser.run() → buffer.flush() → leads.queue()`,
  },
  {
    id: "hire_desk",
    index: "06",
    title: { en: "Hire Desk", ru: "Hire Desk", uk: "Hire Desk" },
    accent: { en: "Career command", ru: "Карьерный штаб", uk: "Кар'єрний штаб" },
    nav: { en: "Hire Desk", ru: "Hire Desk", uk: "Hire Desk" },
    hook: {
      en: "Career command center for EU / America roles: Fit · Reach · Priority scoring, people outreach and MAX LIVE harvest.",
      ru: "Карьерный штаб для ролей EU / America: скоринг Fit · Reach · Priority, люди и MAX LIVE сбор вакансий.",
      uk: "Кар'єрний штаб для ролей EU / America: скоринг Fit · Reach · Priority, люди й MAX LIVE збір вакансій.",
    },
    role: {
      en: "Ops tool · Job hunt",
      ru: "Ops-инструмент · поиск работы",
      uk: "Ops-інструмент · пошук роботи",
    },
    year: "2026",
    tech: ["Next.js", "Firebase", "Harvest", "Scoring"],
    glow: "radial-gradient(ellipse 90% 75% at 48% 30%, rgba(168, 85, 247, 0.07) 0%, rgba(30, 27, 75, 0.04) 42%, transparent 72%)",
    image: shot("hire-desk", "queue-viewport.jpg"),
    imageCaption: {
      en: "Queue — Fit · Reach · Priority",
      ru: "Очередь — Fit · Reach · Priority",
      uk: "Черга — Fit · Reach · Priority",
    },
    link: "https://hire-desk-iota.vercel.app",
    problem: {
      en: "Job hunt was scatter — no Fit/Reach/Priority scoring, no region caps, no single ops HUD.",
      ru: "Поиск работы был разбросан — без Fit/Reach/Priority, без региональных квот и единого ops HUD.",
      uk: "Пошук роботи був розкиданий — без Fit/Reach/Priority, без регіональних квот і єдиного ops HUD.",
    },
    build: {
      en: "Ops HUD for permanent roles: scored queue, EU/US rails, individuals and harvest.",
      ru: "Ops HUD для permanent-ролей: очередь со скором, рельсы EU/US, люди и harvest.",
      uk: "Ops HUD для permanent-ролей: черга зі скором, рейки EU/US, люди й harvest.",
    },
    result: {
      en: "Daily apply system with honest caps and scored cards — clear next actions.",
      ru: "Дневная система откликов с честными лимитами и карточками со скором.",
      uk: "Денна система відгуків з чесними лімітами і картками зі скором.",
    },
    overview: {
      en: [
        "Same ops HUD language as Lead Desk — but for permanent roles, not client outreach.",
        "Queue by region, score every role, track Applied follow-ups, harvest from ATS boards and job feeds.",
      ],
      ru: [
        "Тот же язык ops HUD, что у Lead Desk — но для permanent-ролей, не для аутрича клиентам.",
        "Очередь по регионам, скоринг каждой роли, follow-up по Applied, harvest с ATS и джоб-фидов.",
      ],
      uk: [
        "Та сама мова ops HUD, що в Lead Desk — але для permanent-ролей, не для аутрічу клієнтам.",
        "Черга за регіонами, скоринг кожної ролі, follow-up по Applied, harvest з ATS і джоб-фідів.",
      ],
    },
    features: [
      {
        id: "gate",
        title: { en: "Access gate", ru: "Шлюз доступа", uk: "Шлюз доступу" },
        body: {
          en: "Code-locked console. EN / UK / RU UI for the same ops surface.",
          ru: "Консоль под кодом. UI EN / UK / RU на одной поверхности.",
          uk: "Консоль під кодом. UI EN / UK / RU на одній поверхні.",
        },
        image: shot("hire-desk", "gate-viewport.jpg"),
        caption: { en: "Hire lock screen", ru: "Экран входа Hire", uk: "Екран входу Hire" },
      },
      {
        id: "queue",
        title: { en: "Priority queue", ru: "Приоритетная очередь", uk: "Пріоритетна черга" },
        body: {
          en: "Cards show Fit, Reach and Priority so you know what to apply to next — not what looks shiny.",
          ru: "На карточках Fit, Reach и Priority — понятно, куда откликаться следующим, а не что «красиво выглядит».",
          uk: "На картках Fit, Reach і Priority — зрозуміло, куди відгукуватись наступним, а не що «гарно виглядає».",
        },
        image: shot("hire-desk", "queue-viewport.jpg"),
        caption: { en: "Scored job cards", ru: "Карточки со скором", uk: "Картки зі скором" },
      },
      {
        id: "regions",
        title: { en: "Europe & America", ru: "Европа и Америка", uk: "Європа й Америка" },
        body: {
          en: "Region rails keep EU and US quotas separate — daily apply caps stay honest.",
          ru: "Региональные рельсы держат квоты EU и US раздельно — дневные лимиты откликов честные.",
          uk: "Регіональні рейки тримають квоти EU і US окремо — денні ліміти відгуків чесні.",
        },
        image: shot("hire-desk", "europe-viewport.jpg"),
        caption: { en: "Europe lane", ru: "Полоса Europe", uk: "Смуга Europe" },
      },
      {
        id: "individuals",
        title: { en: "Individuals", ru: "Люди", uk: "Люди" },
        body: {
          en: "HR / HM / senior / founder cards with Access · Leverage · Fit — direct email, not spray.",
          ru: "Карточки HR / HM / senior / founder с Access · Leverage · Fit — прямой email, не спрей.",
          uk: "Картки HR / HM / senior / founder з Access · Leverage · Fit — прямий email, не спрей.",
        },
        image: shot("hire-desk", "individuals-viewport.jpg"),
        caption: { en: "People board", ru: "Доска людей", uk: "Дошка людей" },
      },
      {
        id: "harvest",
        title: { en: "MAX LIVE harvest", ru: "MAX LIVE сбор", uk: "MAX LIVE збір" },
        body: {
          en: "Remotive / ATS boards / HTML+proxy — stop, live log, segment quotas.",
          ru: "Remotive / ATS / HTML+proxy — стоп, живой лог, квоты по сегментам.",
          uk: "Remotive / ATS / HTML+proxy — стоп, живий лог, квоти за сегментами.",
        },
        image: shot("hire-desk", "harvest-viewport.jpg"),
        caption: { en: "Harvest control", ru: "Пульт сбора", uk: "Пульт збору" },
      },
    ],
    architecture: {
      en: "Next.js HUD + Firebase/local jobs store + harvest workers. Scoring in lib.",
      ru: "Next.js HUD + Firebase/локальный store + harvest. Скоринг в lib.",
      uk: "Next.js HUD + Firebase/локальний store + harvest. Скоринг у lib.",
    },
    code: `// fit × reach → priority → queue
score(job) → queue.sort() → apply.next()`,
  },
  {
    id: "drift",
    index: "07",
    title: { en: "DRIFT Dealership", ru: "DRIFT автосалон", uk: "DRIFT автосалон" },
    accent: { en: "Auto retail", ru: "Автосалон", uk: "Автосалон" },
    nav: { en: "DRIFT", ru: "DRIFT", uk: "DRIFT" },
    hook: {
      en: "A bilingual dealership: live inventory, car order, buyout, and an owner desk — UA / EN, no CRM graveyard.",
      ru: "Двуязычный автосалон: живой каталог, заказ авто, выкуп и кабинет хозяина — UA / EN, без склада CRM.",
      uk: "Двомовний автосалон: живий каталог, замовлення авто, викуп і кабінет господаря — UA / EN, без складу CRM.",
    },
    role: {
      en: "Product · Dealership site",
      ru: "Продукт · сайт автосалона",
      uk: "Продукт · сайт автосалону",
    },
    year: "2026",
    tech: ["Next.js", "Three.js", "Framer Motion", "Upstash"],
    glow: "radial-gradient(ellipse 90% 75% at 48% 30%, rgba(255, 140, 40, 0.08) 0%, rgba(67, 20, 7, 0.05) 42%, transparent 72%)",
    image: shot("drift", "hero-viewport.jpg"),
    imageCaption: {
      en: "Hero — dealership, source, inspect, paperwork",
      ru: "Главный экран — автосалон, подбор, проверка, оформление",
      uk: "Головний екран — автосалон, підбір, перевірка, оформлення",
    },
    link: "https://drift-pro.vercel.app",
    problem: {
      en: "A lot that only spoke one language, with inventory stuck in chats — no public catalog, no owner desk.",
      ru: "Салон на одном языке, каталог в переписках — без публичной витрины и кабинета хозяина.",
      uk: "Салон однією мовою, каталог у листуванні — без публічної вітрини і кабінету господаря.",
    },
    build: {
      en: "Next.js dealership with UA/EN UI, live stock, order + buyout forms, PIN owner desk.",
      ru: "Автосалон на Next.js: UI UA/EN, живое наличие, формы заказа и выкупа, кабинет хозяина за PIN.",
      uk: "Next.js автосалон: UI UA/EN, жива наявність, форми замовлення і викупу, кабінет господаря за PIN.",
    },
    result: {
      en: "A working lot in two languages — English clients and UA speakers see matching screens.",
      ru: "Рабочий салон на двух языках — EN-клиенты и UA видят свои экраны.",
      uk: "Робочий салон двома мовами — EN-клієнти і UA бачать свої екрани.",
    },
    overview: {
      en: [
        "Not a brochure — a working lot: stock and sold cars, Telegram, order matching, and same-day buyout.",
        "Owner desk is a PIN-locked control surface: inventory, orders and buyout requests update in real time.",
      ],
      ru: [
        "Не брошюра — рабочий салон: наличие и проданные, Telegram, подбор под заказ и выкуп в тот же день.",
        "Кабинет хозяина под PIN: каталог, заявки на подбор и выкуп обновляются в реальном времени.",
      ],
      uk: [
        "Не брошура — робочий салон: наявність і продані, Telegram, підбір під замовлення і викуп того ж дня.",
        "Кабінет господаря під PIN: каталог, заявки на підбір і викуп оновлюються в реальному часі.",
      ],
    },
    features: [
      {
        id: "hero",
        title: { en: "Hero", ru: "Главный экран", uk: "Головний екран" },
        body: {
          en: "Dark dealership HUD with 3D mark, UA / EN toggle, and a ticker of sourcing · buyout · inspection.",
          ru: "Тёмный HUD салона с 3D-маркой, тумблером UA / EN и тикером: подбор · выкуп · проверка.",
          uk: "Темний HUD салону з 3D-маркою, тумблером UA / EN і тікером: підбір · викуп · перевірка.",
        },
        image: shot("drift", "hero-viewport.jpg"),
        caption: { en: "Home — EN", ru: "Главная — RU", uk: "Головна — UA" },
      },
      {
        id: "catalog",
        title: { en: "Inventory", ru: "Каталог", uk: "Каталог" },
        body: {
          en: "Available / sold rails with live counts. Cards carry price, year, engine and gearbox.",
          ru: "Полосы «в наличии» и «продано» с живым счётчиком. На карточках цена, год, мотор и коробка.",
          uk: "Смуги «в наявності» і «продано» з живим лічильником. На картках ціна, рік, мотор і коробка.",
        },
        image: shot("drift", "catalog-viewport.jpg"),
        caption: { en: "Stock grid", ru: "Сетка наличия", uk: "Сітка наявності" },
      },
      {
        id: "detail",
        title: { en: "Car page", ru: "Карточка авто", uk: "Картка авто" },
        body: {
          en: "Gallery, specs, save / compare, and a direct message to the owner about this car.",
          ru: "Галерея, паспорт машины, избранное / сравнение и сообщение хозяину по этой машине.",
          uk: "Галерея, паспорт машини, добірка / порівняння і повідомлення господарю по цій машині.",
        },
        image: shot("drift", "detail-viewport.jpg"),
        caption: { en: "Golf · 2018", ru: "Golf · 2018", uk: "Golf · 2018" },
      },
      {
        id: "order",
        title: { en: "Order a car", ru: "Заказ авто", uk: "Замовлення авто" },
        body: {
          en: "Budget, make, year, mileage — match against stock, or send a request to the owner.",
          ru: "Бюджет, марка, год, пробег — сверка с наличием или заявка хозяину.",
          uk: "Бюджет, марка, рік, пробіг — звірка з наявністю або заявка господарю.",
        },
        image: shot("drift", "order-viewport.jpg"),
        caption: { en: "Sourcing form", ru: "Форма подбора", uk: "Форма підбору" },
      },
      {
        id: "sell",
        title: { en: "Buyout", ru: "Выкуп", uk: "Викуп" },
        body: {
          en: "Sell-side passport plus photos. Owner sees the request in the desk the same day.",
          ru: "Паспорт машины на продажу плюс фото. Хозяин видит заявку в кабинете в тот же день.",
          uk: "Паспорт машини на продаж плюс фото. Господар бачить заявку в кабінеті того ж дня.",
        },
        image: shot("drift", "sell-viewport.jpg"),
        caption: { en: "Buyout form", ru: "Форма выкупа", uk: "Форма викупу" },
      },
      {
        id: "how",
        title: { en: "How it works", ru: "Как купить", uk: "Як купити" },
        body: {
          en: "Three steps: budget, inspection, paperwork. No fairy tales, no unique offers.",
          ru: "Три шага: бюджет, проверка, оформление. Без сказок и «уникальных предложений».",
          uk: "Три кроки: бюджет, перевірка, оформлення. Без казок і «унікальних пропозицій».",
        },
        image: shot("drift", "how-viewport.jpg"),
        caption: { en: "Three steps", ru: "Три шага", uk: "Три кроки" },
      },
      {
        id: "owner",
        title: { en: "Owner desk", ru: "Кабинет хозяина", uk: "Кабінет господаря" },
        body: {
          en: "PIN-locked ops: inventory, add car, customer orders, buyout queue — live.",
          ru: "Операционка под PIN: каталог, добавление авто, заказы клиентов, очередь выкупа.",
          uk: "Операційка під PIN: каталог, додавання авто, замовлення клієнтів, черга викупу.",
        },
        image: shot("drift", "owner-viewport.jpg"),
        caption: { en: "Owner control", ru: "Пульт хозяина", uk: "Пульт господаря" },
      },
    ],
    architecture: {
      en: "Next.js App Router + UA/EN dictionaries. Catalog and leads persist to Upstash on Vercel, local JSON in dev. Owner desk behind a PIN.",
      ru: "Next.js App Router + словари UA / EN. Каталог и заявки — Upstash на Vercel, локальный JSON в dev. Кабинет хозяина за PIN.",
      uk: "Next.js App Router + словники UA / EN. Каталог і заявки — Upstash на Vercel, локальний JSON у dev. Кабінет господаря за PIN.",
    },
    code: `// inventory → order → owner desk
catalog.filter() → order.submit() → owner.sync()`,
  },
];
