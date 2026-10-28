import { useMemo } from 'react';
import { Link, getRouteApi } from '@tanstack/react-router';
import { flattenToc } from '@/entities/post';
import { formatDate } from '@/shared/lib/format-date';
import { ExternalLink } from '@/shared/ui/external-link';
import { mdxComponents, Prose } from '@/shared/ui/mdx';
import { Window } from '@/shared/ui/window';
import { TableOfContents, useScrollSpy } from '@/features/reading-toc';

const route = getRouteApi('/writing/$slug');

/** The writing/<slug>.md reader window. */
export function PostPage() {
  const { post, Content, tableOfContents } = route.useLoaderData();
  const toc = useMemo(() => flattenToc(tableOfContents), [tableOfContents]);
  const tocIds = useMemo(() => toc.map((item) => item.id), [toc]);
  const activeId = useScrollSpy(tocIds);

  return (
    <Window
      path={[{ label: 'writing/', to: '/writing' }, { label: `${post.slug}.md` }]}
      meta={`${post.readingMinutes} min read`}
      closeTo="/writing"
      variant="reader"
    >
      <div className="flex flex-wrap items-start gap-6 p-[clamp(24px,5vw,64px)]">
        <TableOfContents items={toc} activeId={activeId} />
        <Prose className="flex-1">
          <p className="text-muted m-0 font-mono text-[13px] font-medium">
            {formatDate(post.date)}
            {post.source ? (
              <>
                {' · also on '}
                {post.canonicalUrl ? (
                  <ExternalLink href={post.canonicalUrl}>{post.source}</ExternalLink>
                ) : (
                  post.source
                )}
              </>
            ) : null}
          </p>
          <h1 className="font-display m-0 text-[clamp(36px,5vw,54px)]/[1.05] font-extrabold tracking-[-0.03em] text-balance">
            {post.title}
          </h1>
          <p className="text-ink-3 m-0 text-[21px]">{post.lead}</p>
          <hr className="border-ink/15 m-1.5 w-full border-0 border-t" />
          <Content components={mdxComponents} />
          <div className="border-ink/15 flex flex-wrap justify-between gap-4 border-t pt-6 text-[15px]">
            {post.relatedProject ? (
              <Link
                to="/projects/$slug"
                params={{ slug: post.relatedProject }}
                className="text-accent font-semibold"
              >
                See the project →
              </Link>
            ) : (
              <span />
            )}
            <Link to="/contact">Questions? Write to me</Link>
          </div>
        </Prose>
      </div>
    </Window>
  );
}
