import { Chip } from '@/shared/ui/chip';
import { cn } from '@/shared/lib/cn';

export interface FlowNode {
  title: string;
  caption: string;
  tone?: 'plain' | 'highlight' | 'accent';
}

export interface FlowDiagramProps {
  nodes: FlowNode[];
  /** Tracker chips under the last node. */
  targets: string[];
  /** Infrastructure chips under the whole diagram. */
  footer: string[];
}

const TONE_STYLES: Record<NonNullable<FlowNode['tone']>, string> = {
  plain: 'border-[1.5px] border-ink',
  highlight: 'border-[1.5px] border-ink bg-highlight',
  accent: 'border-[1.5px] border-accent text-accent',
};

/** The horizontal ⇄ architecture diagram from the case-study mock. */
export function FlowDiagram({ nodes, targets, footer }: FlowDiagramProps) {
  return (
    <div className="rounded-card border-ink/15 bg-card flex flex-wrap items-center gap-3.5 border p-7">
      {nodes.map((node, index) => (
        <div key={node.title} className="flex flex-wrap items-center gap-3.5">
          {index > 0 ? (
            <span aria-hidden="true" className="text-muted font-mono text-xl font-medium">
              ⇄
            </span>
          ) : null}
          <div
            className={cn(
              'flex min-w-[160px] flex-1 flex-col gap-1 rounded-[10px] p-3.5',
              TONE_STYLES[node.tone ?? 'plain'],
            )}
          >
            <span className="font-display text-base font-bold">{node.title}</span>
            <span className="text-ink-3 text-[13px]">{node.caption}</span>
          </div>
        </div>
      ))}
      {targets.length > 0 ? (
        <div className="flex min-w-[120px] flex-col gap-1.5">
          {targets.map((target) => (
            <Chip key={target} className="text-center">
              {target}
            </Chip>
          ))}
        </div>
      ) : null}
      {footer.length > 0 ? (
        <div className="border-ink/25 text-ink-2 flex w-full flex-wrap gap-2.5 border-t border-dashed pt-3.5 text-sm">
          {footer.map((item) => (
            <Chip key={item}>{item}</Chip>
          ))}
        </div>
      ) : null}
    </div>
  );
}
