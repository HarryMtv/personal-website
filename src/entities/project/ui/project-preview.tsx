import { Link } from '@tanstack/react-router';
import { Button } from '@/shared/ui/button';
import { Chip } from '@/shared/ui/chip';
import { Placeholder } from '@/shared/ui/placeholder';
import type { Project } from '../model/project';

/** The right-hand preview pane for the selected project. */
export function ProjectPreview({ project }: { project: Project }) {
  return (
    <aside
      aria-label="Preview"
      className="border-ink/12 bg-card flex max-w-[400px] min-w-0 flex-1 basis-[320px] flex-col gap-4 border-l p-6 max-[760px]:max-w-none max-[760px]:border-t max-[760px]:border-l-0"
    >
      <Placeholder ratio="4/3" caption={project.screenshotCaption} />
      <h2 className="font-display text-[28px]/1.1 m-0 font-extrabold tracking-[-0.02em]">
        {project.title}
      </h2>
      <p className="text-[15px]/1.55 text-ink-2 m-0">{project.summary}</p>
      <div className="flex flex-wrap gap-1.5">
        {project.stack.map((item) => (
          <Chip key={item}>{item}</Chip>
        ))}
      </div>
      <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
        <dt className="text-muted">Role</dt>
        <dd className="m-0">{project.role}</dd>
        {project.status ? (
          <>
            <dt className="text-muted">Status</dt>
            <dd className="m-0">{project.status}</dd>
          </>
        ) : null}
      </dl>
      <div className="mt-auto flex flex-wrap gap-2.5">
        {project.hasCaseStudy ? (
          <Button asChild size="sm">
            <Link to="/projects/$slug" params={{ slug: project.slug }}>
              Open case study
            </Link>
          </Button>
        ) : null}
        {project.links.map((link) => (
          <Button asChild key={link.url} variant="secondary" size="sm">
            <a href={link.url} target="_blank" rel="noopener noreferrer">
              {link.label}
            </a>
          </Button>
        ))}
      </div>
    </aside>
  );
}
