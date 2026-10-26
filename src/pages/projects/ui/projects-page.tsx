import { Window } from '@/shared/ui/window';

export function ProjectsPage() {
  return (
    <Window path={[{ label: 'projects/' }]} closeTo="/desktop" maxWidth="xl">
      <div className="p-8">
        <h1 className="font-display text-[40px]/1.05 m-0 font-extrabold tracking-[-0.02em]">
          Projects
        </h1>
      </div>
    </Window>
  );
}
