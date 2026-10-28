import { Link, getRouteApi } from '@tanstack/react-router';
import { Columns, CaseStudyFacts, FlowDiagram } from '@/entities/project';
import { Button } from '@/shared/ui/button';
import { Placeholder } from '@/shared/ui/placeholder';
import { Screenshot } from '@/shared/ui/screenshot';
import { mdxComponents, Prose } from '@/shared/ui/mdx';
import { Window } from '@/shared/ui/window';

const route = getRouteApi('/projects/$slug');

const caseStudyComponents = {
  ...mdxComponents,
  Columns,
  FlowDiagram,
};

/** The projects/<slug>/README.md window rendering the MDX case study. */
export function ProjectCaseStudyPage() {
  const { project, Content } = route.useLoaderData();

  return (
    <Window
      path={[{ label: 'projects/', to: '/projects' }, { label: `${project.slug}/README.md` }]}
      closeTo="/projects"
      maxWidth="xl"
    >
      <div className="flex flex-col gap-12 p-[clamp(24px,5vw,64px)]">
        <section className="flex max-w-[820px] flex-col gap-4.5">
          <Link
            to="/projects"
            className="text-ink-2 hover:text-accent w-fit font-mono text-[13px] font-medium"
          >
            ← All projects
          </Link>
          <h1 className="font-display m-0 text-[clamp(40px,6vw,68px)]/[1] font-extrabold tracking-[-0.03em] text-balance">
            {project.title}
          </h1>
          <p className="text-ink-2 m-0 text-xl/[1.55] text-pretty">
            {project.lead ?? project.summary}
          </p>
          <div className="flex flex-wrap gap-3">
            {project.links.map((link, index) =>
              index === 0 ? (
                <Button asChild key={link.url}>
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    {link.label}
                  </a>
                </Button>
              ) : (
                <Button asChild variant="secondary" key={link.url}>
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    {link.label}
                  </a>
                </Button>
              ),
            )}
          </div>
        </section>

        <CaseStudyFacts project={project} />
        {project.screenshot ? (
          <Screenshot {...project.screenshot} caption={project.screenshotCaption} />
        ) : project.screenshotCaption ? (
          <Placeholder ratio="16/8" caption={project.screenshotCaption} />
        ) : null}

        <Prose className="mx-auto">
          <Content components={caseStudyComponents} />
        </Prose>
      </div>
    </Window>
  );
}
