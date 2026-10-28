import { Link } from '@tanstack/react-router';
import { Window } from '@/shared/ui/window';

/** The 404.md window for unknown paths, slugs and drafts. */
export function NotFoundPage() {
  return (
    <Window path={[{ label: '404.md' }]} closeTo="/">
      <div className="mx-auto flex max-w-[560px] flex-col items-start gap-4 p-[clamp(24px,5vw,56px)]">
        <h1 className="font-display text-[40px]/1.05 m-0 font-extrabold tracking-[-0.02em]">404</h1>
        <p className="text-lg/1.6 text-ink-2 m-0">This file doesn&rsquo;t exist.</p>
        <Link to="/" className="text-accent font-medium underline-offset-2 hover:underline">
          ← Back to ~/igor/
        </Link>
      </div>
    </Window>
  );
}
