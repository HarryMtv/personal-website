import { Window } from '@/shared/ui/window';
import { Card } from '@/shared/ui/card';
import { profile } from '@/entities/profile';

/** The hobbies.md window: the "Off the clock" card grid. */
export function HobbiesPage() {
  return (
    <Window path={[{ label: 'hobbies.md' }]} closeTo="/desktop">
      <div className="flex flex-col gap-7 p-[clamp(24px,5vw,56px)]">
        <h1 className="font-display text-[40px]/1.05 m-0 font-extrabold tracking-[-0.02em]">
          Off the clock
        </h1>
        <div className="grid gap-4 max-[760px]:grid-cols-[repeat(auto-fit,minmax(min(240px,100%),1fr))]">
          {profile.hobbies.map((hobby) => (
            <Card key={hobby.title} className="gap-2.5 p-5">
              <h2 className="font-display m-0 text-xl font-bold">{hobby.title}</h2>
              <p className="text-[15px]/1.55 text-ink-2 m-0">{hobby.text}</p>
            </Card>
          ))}
        </div>
      </div>
    </Window>
  );
}
