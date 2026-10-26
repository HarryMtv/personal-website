import { Window } from '@/shared/ui/window';

export function WritingPage() {
  return (
    <Window path={[{ label: 'writing/' }]} closeTo="/desktop">
      <div className="p-8">
        <h1 className="font-display text-[40px]/1.05 m-0 font-extrabold tracking-[-0.02em]">
          Writing
        </h1>
      </div>
    </Window>
  );
}
