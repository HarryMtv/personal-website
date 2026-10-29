import { Link } from '@tanstack/react-router';
import type { MDXComponents } from 'mdx/types';
import type { ReactNode } from 'react';
import { ExternalLink } from '../external-link';
import { PullQuote } from './pull-quote';

/**
 * Component mapping for MDX bodies: heading/paragraph/list styles, the dark
 * code figure, the pull-quote blockquote and link handling (internal routes
 * via TanStack Link, everything else as a safe external link).
 */
export const mdxComponents: MDXComponents = {
  h2: (props) => (
    <h2
      className="font-display text-ink m-0 scroll-mt-28 text-[28px] font-bold tracking-[-0.01em] min-[900px]:scroll-mt-20"
      {...props}
    />
  ),
  p: (props) => <p className="m-0 text-pretty" {...props} />,
  ul: (props) => <ul className="m-0 flex list-disc flex-col gap-2 pl-5" {...props} />,
  li: (props) => <li className="text-ink-2 text-[17px]/[1.5]" {...props} />,
  pre: (props) => (
    <figure className="bg-code-bg text-code-fg m-0 overflow-x-auto rounded-[10px] p-[18px] pr-5 font-mono text-[14px]/[1.7]">
      <pre className="m-0" {...props} />
    </figure>
  ),
  code: (props) => <code className="font-mono" {...props} />,
  blockquote: ({ children }) => <PullQuote>{children}</PullQuote>,
  a: ({ href, children }: { href?: string; children?: ReactNode }) => {
    if (href?.startsWith('/')) {
      return (
        <Link to={href} className="text-accent underline underline-offset-2">
          {children}
        </Link>
      );
    }
    return (
      <ExternalLink href={href} className="underline">
        {children}
      </ExternalLink>
    );
  },
};
