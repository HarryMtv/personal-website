import { LanguageMeter, profile } from '@/entities/profile';
import { CvPosition, positions } from '@/entities/experience';

/** The mock's `.sec` heading: mono, letter-spaced, accent, ink underline. */
function Section({ title }: { title: string }) {
  return (
    <h2 className="border-ink text-accent mb-2 border-b pb-1 font-mono text-xs font-medium tracking-[0.08em] uppercase">
      {title}
    </h2>
  );
}

/**
 * The white A4-like sheet: an HTML rendition of the CV built from the same
 * entities as /experience. The phone number is deliberately not rendered
 * (it stays inside the downloadable PDF).
 */
export function CvDocument({ zoom }: { zoom: number }) {
  return (
    <div className="flex justify-center overflow-x-auto px-6 py-8">
      {/*
       * CSS zoom (instead of transform: scale) keeps the layout flow — no
       * wrapper height compensation needed when scaling.
       */}
      <div
        data-testid="cv-sheet"
        style={{ zoom: zoom / 100 }}
        className="text-ink flex w-full max-w-[794px] flex-col gap-5 bg-white px-12 py-10 shadow-[0_10px_40px_rgb(30_27_24/0.15)]"
      >
        <header className="flex flex-col gap-1">
          <h1 className="font-display m-0 text-2xl font-bold">{profile.name}</h1>
          <p className="text-ink-2 m-0 text-sm">{profile.cvHeadline}</p>
          <p className="text-ink-3 m-0 flex flex-wrap gap-x-3 font-mono text-xs">
            <span>{profile.location}</span>
            <span>·</span>
            <a href={`mailto:${profile.email}`} className="text-accent">
              {profile.email}
            </a>
            <span>·</span>
            <span>github.com/HarryMtv</span>
            <span>·</span>
            <span>linkedin.com/in/ig-martynov</span>
          </p>
        </header>

        <section aria-label="Summary">
          <Section title="Summary" />
          {profile.summary.map((paragraph) => (
            <p key={paragraph.slice(0, 24)} className="text-ink-2 m-0 pb-1 text-[13px]/1.5">
              {paragraph}
            </p>
          ))}
        </section>

        <section aria-label="Experience" className="flex flex-col gap-3.5">
          <Section title="Experience" />
          {positions.map((position) => (
            <CvPosition key={position.id} position={position} />
          ))}
        </section>

        <section aria-label="Education" className="flex flex-col gap-2">
          <Section title="Education" />
          {profile.education.map((item) => (
            <div key={item.degree} className="flex flex-wrap justify-between gap-x-4 text-[13px]">
              <span>
                <strong className="font-semibold">{item.school}</strong> — {item.degree},{' '}
                {item.field}
              </span>
              <span className="text-ink-3 font-mono text-xs">{item.period}</span>
            </div>
          ))}
        </section>

        <section aria-label="Skills">
          <Section title="Skills" />
          <dl className="m-0 flex flex-col gap-1 text-[13px]">
            {profile.skills.map((skill) => (
              <div key={skill.group} className="flex flex-wrap gap-x-4">
                <dt className="w-[190px] shrink-0 font-semibold">{skill.group}</dt>
                <dd className="text-ink-2 m-0 min-w-0 flex-1">{skill.items}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-label="Certifications" className="flex flex-col gap-1.5">
          <Section title="Certifications" />
          {profile.certifications.map((certification) => (
            <div
              key={certification.title}
              className="flex flex-wrap justify-between gap-x-4 text-[13px]"
            >
              <span>
                <strong className="font-semibold">{certification.title}</strong> —{' '}
                {certification.issuer}
              </span>
              <span className="text-ink-3 font-mono text-xs">{certification.date}</span>
            </div>
          ))}
        </section>

        <section aria-label="Languages" className="flex flex-wrap gap-x-8 gap-y-2">
          <Section title="Languages" />
          <div className="flex flex-wrap gap-x-8 gap-y-2">
            {profile.languages.map((language) => (
              <span key={language.name} className="flex items-center gap-2.5 text-[13px]">
                {language.name}
                <LanguageMeter name={language.name} level={language.level} />
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
