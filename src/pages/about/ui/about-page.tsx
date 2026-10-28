import { Link } from '@tanstack/react-router';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { SectionLabel } from '@/shared/ui/section-label';
import { Window } from '@/shared/ui/window';
import { profile } from '@/entities/profile';

/** The about.md window: hero plus the "Right now" aside. */
export function AboutPage() {
  return (
    <Window path={[{ label: 'about.md' }]} closeTo="/desktop">
      <div className="grid gap-10 p-[clamp(24px,5vw,56px)] max-[760px]:grid-cols-[repeat(auto-fit,minmax(min(340px,100%),1fr))]">
        <div className="flex flex-col gap-5">
          <p className="text-muted m-0 font-mono text-[13px] font-medium">{profile.hero.eyebrow}</p>
          <h1 className="font-display m-0 text-[clamp(38px,5vw,58px)]/[1.02] font-extrabold tracking-[-0.03em] text-balance">
            {profile.hero.title} <span className="text-accent">{profile.hero.titleAccent}</span>
          </h1>
          <p className="text-ink-2 m-0 text-lg/[1.6] text-pretty">
            {renderWithMark(profile.hero.paragraphs[0], profile.hero.mark)}
          </p>
          <p className="text-ink-2 m-0 text-lg/[1.6] text-pretty">{profile.hero.paragraphs[1]}</p>
          <div className="flex flex-wrap gap-3 pt-1">
            <Button asChild>
              <Link to={profile.hero.primaryCta.to}>{profile.hero.primaryCta.label}</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link to={profile.hero.secondaryCta.to}>{profile.hero.secondaryCta.label}</Link>
            </Button>
          </div>
        </div>
        <Card elevated className="gap-4">
          <h2 className="font-display m-0 text-xl font-bold">Right now</h2>
          <ul className="m-0 flex list-none flex-col gap-3 p-0 text-[15px]/[1.5]">
            {profile.rightNow.map((item) => (
              <li key={item} className="flex gap-2.5">
                <span aria-hidden="true" className="text-accent font-mono">
                  →
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="border-ink/25 flex flex-col gap-1.5 border-t border-dashed pt-4">
            <SectionLabel>Open to</SectionLabel>
            <span className="text-[15px]/[1.5]">{profile.openTo}</span>
          </div>
        </Card>
      </div>
    </Window>
  );
}

/** Renders the paragraph with the marked phrase highlighted. */
function renderWithMark(paragraph: string, mark: string) {
  const index = paragraph.indexOf(mark);
  if (index === -1) {
    return paragraph;
  }
  return (
    <>
      {paragraph.slice(0, index)}
      <span className="mark">{mark}</span>
      {paragraph.slice(index + mark.length)}
    </>
  );
}
