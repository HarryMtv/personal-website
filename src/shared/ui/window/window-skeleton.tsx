/** Window frame with pulsing bars, shown while a lazy route loads. */
export function WindowSkeleton() {
  return (
    <div className="window mx-auto flex w-full max-w-[1080px] flex-col overflow-hidden rounded-window border border-ink/25 shadow-window">
      <div className="flex items-center gap-2.5 border-b border-ink/15 bg-paper-2 px-4 py-2">
        <span className="h-4 w-4 animate-pulse rounded-sm bg-ink/15" aria-hidden="true" />
        <span className="h-3.5 w-40 animate-pulse rounded bg-ink/10" aria-hidden="true" />
      </div>
      <div className="flex flex-col gap-4 bg-paper p-10">
        <span className="h-8 w-2/3 animate-pulse rounded-md bg-ink/10" aria-hidden="true" />
        <span className="h-4 w-full animate-pulse rounded bg-ink/5" aria-hidden="true" />
        <span className="h-4 w-5/6 animate-pulse rounded bg-ink/5" aria-hidden="true" />
        <span className="h-24 w-full animate-pulse rounded-card bg-ink/5" aria-hidden="true" />
      </div>
      <span className="sr-only" role="status">
        Loading window
      </span>
    </div>
  );
}
