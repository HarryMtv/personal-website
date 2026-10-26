import { Window } from '@/shared/ui/window';

export function StackPage() {
  return (
    <Window path={[{ label: 'uses.md' }]} closeTo="/desktop">
      <div className="p-8">
        <h1 className="m-0 font-display text-[40px]/1.05 font-extrabold tracking-[-0.02em]">
          Stack &amp; uses
        </h1>
      </div>
    </Window>
  );
}
