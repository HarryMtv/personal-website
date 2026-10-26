import { Window } from '@/shared/ui/window';

export function ContactPage() {
  return (
    <Window path={[{ label: 'New message' }]} hidePrefix closeTo="/desktop">
      <div className="p-8">
        <h1 className="m-0 font-display text-[40px]/1.05 font-extrabold tracking-[-0.02em]">
          Say hello
        </h1>
      </div>
    </Window>
  );
}
