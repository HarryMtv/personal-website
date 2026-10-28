import type { ErrorComponentProps } from '@tanstack/react-router';
import { Button } from '@/shared/ui/button';
import { Window } from '@/shared/ui/window';

/** The error.log window shown when a route throws. */
export function ErrorPage({ error }: ErrorComponentProps) {
  return (
    <Window path={[{ label: 'error.log' }]} closeTo="/">
      <div className="mx-auto flex max-w-[680px] flex-col gap-4 p-[clamp(24px,5vw,56px)]">
        <h1 className="font-display text-[40px]/1.05 m-0 font-extrabold tracking-[-0.02em]">
          error.log
        </h1>
        <p className="text-lg/1.6 text-ink-2 m-0">
          Something broke while opening this window. It&rsquo;s me, not you.
        </p>
        <pre className="rounded-card bg-code-bg text-code-fg m-0 overflow-x-auto p-4 font-mono text-sm">
          {error instanceof Error ? error.message : String(error)}
        </pre>
        <div>
          <Button onClick={() => window.location.reload()}>Reload</Button>
        </div>
      </div>
    </Window>
  );
}
