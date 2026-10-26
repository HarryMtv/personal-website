import { Window } from '@/shared/ui/window';

export function NowPage() {
  return (
    <Window path={[{ label: 'now.md' }]} closeTo="/desktop">
      <div className="p-8">
        <h1 className="m-0 font-display text-[40px]/1.05 font-extrabold tracking-[-0.02em]">
          What I&rsquo;m doing now
        </h1>
      </div>
    </Window>
  );
}
