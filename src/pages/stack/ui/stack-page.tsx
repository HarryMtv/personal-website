import { Window } from '@/shared/ui/window';
import { SectionLabel } from '@/shared/ui/section-label';
import { profile } from '@/entities/profile';

/** The uses.md window: the stack grid. */
export function StackPage() {
  return (
    <Window path={[{ label: 'uses.md' }]} closeTo="/desktop">
      <div className="flex flex-col gap-7 p-[clamp(24px,5vw,56px)]">
        <h1 className="font-display m-0 text-[40px]/[1.05] font-extrabold tracking-[-0.02em]">
          Stack &amp; uses
        </h1>
        <div className="grid gap-7 gap-x-9 max-[760px]:grid-cols-[repeat(auto-fit,minmax(min(280px,100%),1fr))]">
          {profile.stack.map((group) => (
            <div key={group.label} className="flex flex-col gap-2.5">
              <SectionLabel>{group.label}</SectionLabel>
              <p className="m-0 text-base/[1.6]">{group.text}</p>
            </div>
          ))}
        </div>
      </div>
    </Window>
  );
}
