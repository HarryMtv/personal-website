/**
 * Igor's profile. Facts (summary, skills, education, certifications,
 * languages) are transcribed from docs CV — keep public/cv/igor-martynov.pdf
 * and this file in sync (see ADR 0002). Copy (hero, right now, stack, hobbies,
 * now, trash) comes from the design mock. The phone number is published in the
 * PDF only and deliberately not rendered in HTML.
 */
export const profile = {
  name: 'Igor Martynov',
  /** Hero/menu role, per the mock. */
  role: 'Staff Software Engineer',
  /** CV headline, shown verbatim on the CV sheet. */
  cvHeadline: 'Senior Frontend Engineer · React · TypeScript',
  location: 'Prague',
  email: 'igor.myv@gmail.com',

  hero: {
    eyebrow: 'Staff Software Engineer · Prague',
    title: 'Frontend that stays fast at',
    /** The accent-colored tail of the H1. */
    titleAccent: 'enterprise scale.',
    paragraphs: [
      "I'm Igor — 10+ years in React, TypeScript and Redux Toolkit. At Wrike I work on the heavy parts of the product: Reporting, Table View, Budgeting and the Automation Engine, where performance is a feature, not a nice-to-have.",
      'I started as a QA automation engineer, so I write code that expects to be tested — and specs that expect to be argued with.',
    ] as [string, string],
    /** Highlighted inline text inside the first paragraph. */
    mark: 'React, TypeScript and Redux Toolkit',
    primaryCta: { label: 'See my projects', to: '/projects' },
    secondaryCta: { label: 'Get in touch', to: '/contact' },
  },

  rightNow: [
    'Consulting and developing applications for business',
    'Shipping side projects with an AI-assisted workflow',
    'Learning Czech, aiming for A2',
  ],
  // TODO(content): replace the bracketed placeholder with real availability.
  openTo: '[Consulting / frontend performance audits / interesting roles]',

  stack: [
    {
      label: 'Every day',
      text: 'React, TypeScript, Redux Toolkit (memoized selectors, listener middleware), Feature-Sliced Design',
    },
    { label: 'Backend, when needed', text: 'Node, Fastify, Supabase, SQLite' },
    { label: 'Testing', text: 'Playwright, Allure, Vitest — and a QA habit that never left' },
    { label: 'Infra', text: 'My own VPS with Coolify, Docker, Traefik' },
    {
      label: 'AI workflow',
      text: 'Spec first with OpenSpec, Claude for architecture and UI, a second model for bulk implementation',
    },
    { label: 'Notes', text: 'Obsidian as a notes-as-context vault for coding agents' },
  ],

  hobbies: [
    {
      title: 'Games',
      text: 'Kingdom Come: Deliverance, HumanitZ, The Long Dark, The Last of Us.',
    },
    {
      title: 'Outdoors',
      text: 'Camping and hiking with a two-person tent, still chasing the perfect sleeping setup.',
    },
    { title: 'Music', text: 'Making tracks with AI music tools like Suno.' },
    {
      title: 'Photo & Video',
      text: 'Making beautiful photos and videos, then processing the stills and editing the footage.',
    },
    {
      title: 'Languages',
      text: 'Russian, English, and Czech in progress after five-plus years in Prague.',
    },
  ],

  now: {
    updatedAt: '2026-10',
    items: [
      'Polishing PM Telegram Hub and writing up how it was built',
      'Moving my notes into Obsidian so agents can use them as context',
      'Czech lessons, A2 in sight',
    ],
  },

  trash: {
    files: ['ClassComponents.jsx', 'jquery-plugins/', 'we-will-add-tests-later.txt'],
    note: 'Not emptying it. Some of these are load-bearing somewhere.',
  },

  /** CV SUMMARY section, verbatim from the PDF (ligature artefacts fixed). */
  summary: [
    'Senior Software Engineer with deep front-end expertise and a proven track record of technical leadership in enterprise software. At Wrike, I lead complex technical initiatives, mentor engineers, and shape architectural decisions for large-scale applications.',
    'Core stack: TypeScript, JavaScript, React, Angular, Redux, Node.js, and Webpack. Having evolved from a QA Automation Engineer into a Staff role, I bring a quality-first mindset — designing robust, scalable systems while holding a high bar for code quality and reliability.',
    'M.Sc. in Applied Mathematics and Computer Science, Saint Petersburg State Electrotechnical University "LETI".',
  ],

  skills: [
    {
      group: 'Frontend',
      items:
        'TypeScript, JavaScript, React, Angular, HTML5, CSS, Redux / Redux Toolkit, RxJS, React Query, SCSS/Sass, Next.js, Storybook, Web Performance, Lighthouse, Accessibility',
    },
    {
      group: 'Build & Tooling',
      items:
        'Webpack, Vite, Babel, ESLint, Prettier, npm / pnpm, Module Federation, Micro-frontends',
    },
    {
      group: 'Testing & QA',
      items:
        'Unit Testing, React Testing Library, Jest, Playwright, Vitest, Selenium WebDriver, TestNG, JUnit, Test Automation',
    },
    { group: 'Runtime & API', items: 'REST API, Node.js, Microservices, GraphQL' },
    {
      group: 'Artificial intelligence (AI)',
      items:
        'LLM API integration, Prompt engineering, MCP (Model Context Protocol), AI-assisted development (Claude Code / Cursor / Gemini / Codex), Claude Agent Skills',
    },
    { group: 'DevOps & CI/CD', items: 'Git, GitLab, Docker, TeamCity, GitHub Actions, GitLab CI' },
    { group: 'Monitoring & Observability', items: 'Grafana, Graylog, Sentry' },
    { group: 'Mobile', items: 'React Native, Dart' },
    { group: 'Methodologies', items: 'Scrum, Agile' },
  ],

  languages: [
    { name: 'English', level: 5 },
    { name: 'Russian', level: 5 },
    { name: 'Czech', level: 2 },
  ] as { name: string; level: 1 | 2 | 3 | 4 | 5 }[],

  education: [
    {
      school: 'Saint Petersburg State Electrotechnical University "LETI"',
      degree: "Master's degree",
      field: 'Applied Mathematics and Computer Science',
      period: '2016 – 2018',
    },
    {
      school: 'Saint Petersburg State Electrotechnical University "LETI"',
      degree: "Bachelor's degree",
      field: 'Applied Mathematics and Computer Science',
      period: '2012 – 2016',
    },
  ],

  certifications: [
    { title: 'Claude Code 101', issuer: 'Anthropic Education', date: 'July 12, 2026' },
    { title: 'Building with the Claude API', issuer: 'Anthropic Education', date: 'July, 2026' },
  ],
} as const;

export interface Social {
  id: 'github' | 'telegram' | 'linkedin' | 'medium';
  label: string;
  url?: string;
}

export const socials: Social[] = [
  { id: 'github', label: 'GitHub', url: 'https://github.com/HarryMtv' },
  { id: 'linkedin', label: 'LinkedIn', url: 'https://www.linkedin.com/in/ig-martynov' },
  // TODO(content): set the Telegram and Medium URLs when they exist.
  { id: 'telegram', label: 'Telegram', url: undefined },
  { id: 'medium', label: 'Medium', url: undefined },
];
