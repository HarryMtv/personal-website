import { Link } from '@tanstack/react-router';
import { ImMonogram } from '@/shared/ui/icons/brand-icons';
import { Button } from '@/shared/ui/button';
import { usePragueClock } from '@/shared/lib/use-prague-clock';

const MAIN_NAV = [
  { label: 'Projects', to: '/projects' },
  { label: 'Experience', to: '/experience' },
  { label: 'Writing', to: '/writing' },
  { label: 'Hobbies', to: '/hobbies' },
] as const;

/** The sticky top menu bar: monogram, main nav, Prague clock, CTA. */
export function MenuBar() {
  const clock = usePragueClock();

  return (
    <header className="sticky top-0 z-[5] flex flex-wrap items-center gap-1 border-b border-ink/15 bg-paper/95 px-3.5 py-1.5 backdrop-blur-sm">
      <Link
        to="/"
        className="flex items-center gap-2 rounded-md px-2.5 py-2 text-sm font-semibold text-ink hover:bg-ink/8"
      >
        <ImMonogram />
        <span>Igor Martynov</span>
      </Link>
      <nav aria-label="Main" className="ml-2 hidden gap-0.5 min-[900px]:flex">
        {MAIN_NAV.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="rounded-md px-2.5 py-2 text-sm font-medium text-ink hover:bg-ink/8"
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="ml-auto flex items-center gap-3">
        <span className="font-mono text-[13px] font-medium text-muted-2" aria-live="off">
          Praha · {clock}
        </span>
        <Button asChild size="sm" className="max-[640px]:hidden">
          <Link to="/contact">Say hello</Link>
        </Button>
      </div>
    </header>
  );
}
