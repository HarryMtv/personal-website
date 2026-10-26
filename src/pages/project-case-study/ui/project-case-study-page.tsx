import { Window } from '@/shared/ui/window';

export function ProjectCaseStudyPage() {
  return (
    <Window
      path={[{ label: 'projects/', to: '/projects' }, { label: 'README.md' }]}
      closeTo="/projects"
    >
      <div className="p-8">
        <h1 className="m-0 font-display text-[40px]/1.05 font-extrabold tracking-[-0.02em]">
          Case study
        </h1>
      </div>
    </Window>
  );
}
