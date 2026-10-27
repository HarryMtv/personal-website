import type { Project } from '../model/project';

/** The ROLE / BUILT IN / STACK / HOSTED ON facts grid. */
export function CaseStudyFacts({ project }: { project: Project }) {
  const facts = project.facts ?? [
    { label: 'Role', value: project.role },
    { label: 'Stack', value: project.stack.join(', ') },
    ...(project.status ? [{ label: 'Status', value: project.status }] : []),
  ];

  return (
    <dl className="border-ink/18 m-0 grid gap-5 border-t border-b py-5 max-[760px]:grid-cols-[repeat(auto-fit,minmax(min(200px,100%),1fr))]">
      {facts.map((fact) => (
        <div key={fact.label} className="flex flex-col gap-1.5">
          <dt className="text-muted font-mono text-xs font-medium">{fact.label.toUpperCase()}</dt>
          <dd className="m-0 text-base">{fact.value}</dd>
        </div>
      ))}
    </dl>
  );
}
