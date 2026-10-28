/** Window frame with pulsing bars, shown while a lazy route loads. */
export function WindowSkeleton() {
  return (
    <div className="window rounded-window border-ink/25 shadow-window mx-auto flex w-full max-w-[1080px] flex-col overflow-hidden border">
      <div className="border-ink/15 bg-paper-2 flex items-center gap-2.5 border-b px-4 py-2">
        <span className="bg-ink/15 h-4 w-4 animate-pulse rounded-sm" aria-hidden="true" />
        <span className="bg-ink/10 h-3.5 w-40 animate-pulse rounded" aria-hidden="true" />
      </div>
      <div className="bg-paper flex flex-col gap-4 p-10">
        <span className="bg-ink/10 h-8 w-2/3 animate-pulse rounded-md" aria-hidden="true" />
        <span className="bg-ink/5 h-4 w-full animate-pulse rounded" aria-hidden="true" />
        <span className="bg-ink/5 h-4 w-5/6 animate-pulse rounded" aria-hidden="true" />
        <span className="rounded-card bg-ink/5 h-24 w-full animate-pulse" aria-hidden="true" />
      </div>
      <span className="sr-only" role="status">
        Loading window
      </span>
    </div>
  );
}
