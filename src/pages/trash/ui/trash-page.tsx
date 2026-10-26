import { Window } from '@/shared/ui/window';

export function TrashPage() {
  return (
    <Window path={[{ label: '.trash/' }]} closeTo="/desktop">
      <div className="p-8">
        <h1 className="m-0 font-display text-[40px]/1.05 font-extrabold tracking-[-0.02em]">
          Trash
        </h1>
      </div>
    </Window>
  );
}
