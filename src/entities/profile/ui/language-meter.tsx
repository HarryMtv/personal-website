import { cn } from '@/shared/lib/cn';

/** Five-dot language level meter, e.g. "English: 5 of 5". */
export function LanguageMeter({ name, level }: { name: string; level: number }) {
  return (
    <span
      role="img"
      aria-label={`${name}: ${level} of 5`}
      className="inline-flex items-center gap-1"
    >
      {[1, 2, 3, 4, 5].map((dot) => (
        <span
          key={dot}
          aria-hidden="true"
          className={cn('size-[7px] rounded-full', dot <= level ? 'bg-ink' : 'bg-ink/20')}
        />
      ))}
    </span>
  );
}
