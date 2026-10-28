import { formatPeriod, type Position } from '../model/positions';

/** The CV-sheet variant of a position: labelled bullets with strong labels. */
export function CvPosition({ position }: { position: Position }) {
  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3">
        <span className="text-[15px] font-semibold">{position.company}</span>
        <span className="text-muted-2 font-mono text-xs">
          {formatPeriod(position.start, position.end)}
        </span>
      </div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-3">
        <span className="text-[14px] italic">{position.title}</span>
        <span className="text-muted-2 font-mono text-xs">{position.location}</span>
      </div>
      {position.url ? (
        <a href={position.url} className="text-accent font-mono text-xs">
          {position.url.replace('https://', '')}
        </a>
      ) : null}
      <ul className="m-0 ml-4 list-disc pt-1 text-[13px]/[1.5]">
        {position.highlights.map((highlight, index) => (
          <li key={index}>
            {highlight.label ? <strong>{highlight.label}: </strong> : null}
            {highlight.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
