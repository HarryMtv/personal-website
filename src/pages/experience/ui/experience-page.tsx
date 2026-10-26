import { Link } from '@tanstack/react-router';
import { Button } from '@/shared/ui/button';
import { Window } from '@/shared/ui/window';
import { CV_FILE, profile } from '@/entities/profile';
import { Timeline, positions } from '@/entities/experience';

/** The experience.md window: timeline from the CV plus CV links. */
export function ExperiencePage() {
  return (
    <Window path={[{ label: 'experience.md' }]} closeTo="/desktop">
      <div className="mx-auto flex max-w-[760px] flex-col gap-7 p-[clamp(24px,5vw,56px)]">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h1 className="font-display text-[40px]/1.05 m-0 font-extrabold tracking-[-0.02em]">
            Experience
          </h1>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="secondary">
              <Link to="/cv">Open CV</Link>
            </Button>
            <Button asChild>
              <a href={CV_FILE.href} download={CV_FILE.downloadName}>
                Download CV (PDF)
              </a>
            </Button>
          </div>
        </div>
        <Timeline positions={positions} />
        <p className="text-muted m-0 text-sm">
          {profile.education[0].degree}, {profile.education[0].field} —{' '}
          {profile.education[0].school}
        </p>
      </div>
    </Window>
  );
}
