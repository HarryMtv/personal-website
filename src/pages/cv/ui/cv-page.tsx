import { Window } from '@/shared/ui/window';

export function CvPage() {
  return (
    <Window path={[{ label: 'CV.pdf' }]} meta="2 pages" closeTo="/desktop" variant="document">
      <div className="p-8">
        <h1 className="font-display text-[40px]/1.05 m-0 font-extrabold tracking-[-0.02em]">CV</h1>
      </div>
    </Window>
  );
}
