/**
 * The 5 CV positions, transcribed verbatim from the PDF (ligature artefacts
 * fixed). Keep in sync with public/cv/igor-martynov.pdf (see ADR 0002).
 */
export interface Position {
  id: string;
  company: string;
  title: string;
  location: string;
  /** 'YYYY-MM' */
  start: string;
  /** 'YYYY-MM', or null while ongoing. */
  end: string | null;
  url?: string;
  /** One-liner for the timeline. */
  summary: string;
  highlights: { label?: string; text: string }[];
}

export const positions: Position[] = [
  {
    id: 'wrike-staff',
    company: 'Wrike',
    title: 'Staff Software Engineer',
    location: 'Prague',
    start: '2022-07',
    end: null,
    url: 'https://wrike.com/',
    summary:
      'Re-architected the data-grid to render 100k+ rows, cutting render time by 70% (10s → 3s), while guiding architecture, mentorship and innovation across teams.',
    highlights: [
      {
        label: 'Technical Leadership',
        text: 'Guiding engineering teams on architecture, design, and best practices.',
      },
      {
        label: 'Mentorship',
        text: 'Coaching and supporting junior and mid-level engineers, helping them grow technically and professionally.',
      },
      {
        label: 'Project Ownership',
        text: 'Re-architected the data-grid to render 100k+ rows, cutting render time by 70% (10s → 3s) and eliminating recurring performance incidents.',
      },
      {
        label: 'Collaboration',
        text: 'Working closely with product managers, designers, QA, and other stakeholders to define requirements and deliver solutions that align with business goals.',
      },
      {
        label: 'Innovation',
        text: 'Researching and implementing new technologies or methodologies to improve the product and development process.',
      },
      {
        label: 'Problem Solving',
        text: 'Addressing and resolving critical issues, both in production and during development.',
      },
    ],
  },
  {
    id: 'citrix-staff',
    company: 'Citrix',
    title: 'Staff Software Engineer',
    location: 'Prague',
    start: '2021-07',
    end: '2022-07',
    url: 'https://citrix.com/',
    summary:
      'Developing architecture for high-load services, rewriting slow parts of the product to the new architecture.',
    highlights: [
      {
        text: 'Developing architecture for high-load services, rewriting slow parts of the product to the new architecture.',
      },
    ],
  },
  {
    id: 'wrike-frontend',
    company: 'Wrike',
    title: 'Frontend Developer',
    location: 'Saint Petersburg',
    start: '2018-09',
    end: '2021-06',
    summary:
      'Wrike Resource, Wrike for Professional Services & Automation Engine; Reporting, Table View, Budgeting, Time tracking, Request forms, Automation.',
    highlights: [
      {
        text: 'Working in development group which created key product solutions including Wrike Resource, Wrike for Professional Services & Automation Engine. Most experience at Reporting, Table View, Budgeting, Time tracking, Request forms, Automation etc.',
      },
    ],
  },
  {
    id: 'wrike-qa',
    company: 'Wrike',
    title: 'Senior QA Automation Engineer',
    location: 'Saint Petersburg',
    start: '2016-06',
    end: '2018-09',
    summary:
      "The company's main test framework: JUnit, TestNG, Selenium, Retrofit, Allure, code generation, dependency injection.",
    highlights: [
      {
        text: 'Participated in the development of the main test framework in the company, the main task of which is to quickly write autotests. Main technologies: JUnit, TestNG, Selenium, Retrofit, Allure, Code generation, Dependency injection.',
      },
    ],
  },
  {
    id: 'motorola-qa',
    company: 'Motorola Solutions',
    title: 'QA Automation Engineer',
    location: 'Saint Petersburg',
    start: '2014-02',
    end: '2016-06',
    summary:
      'Manual and automated testing in Java and Perl; scenarios parsed from txt/xml/Google Sheets; Selenium and Appium on smartphones.',
    highlights: [
      {
        text: 'Performed manual testing, wrote automated tests + automation tools in Java and Perl. Parsing test scenarios from txt, xml and Google Sheets and uploading reports to Google Sheets. Worked mainly with smartphones with Selenium and Appium.',
      },
    ],
  },
];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatMonth(iso: string): string {
  const [year, month] = iso.split('-');
  return `${MONTHS[Number(month) - 1]} ${year}`;
}

/** "Jul 2022 — now" / "Sep 2018 — Jun 2021". */
export function formatPeriod(start: string, end: string | null): string {
  return `${formatMonth(start)} — ${end ? formatMonth(end) : 'now'}`;
}
