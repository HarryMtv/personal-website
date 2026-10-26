import { formatPeriod, type Position } from '../model/positions';

/** The left-bordered career timeline. */
export function Timeline({ positions }: { positions: Position[] }) {
  return (
    <ol className="border-ink m-0 flex list-none flex-col gap-0 border-l-2 p-0">
      {positions.map((position, index) => (
        <li
          key={position.id}
          className={index === positions.length - 1 ? 'pb-1 pl-6' : 'pb-7 pl-6'}
        >
          <div className="flex flex-col gap-1.5">
            <span className="text-muted font-mono text-xs font-medium">
              {formatPeriod(position.start, position.end)}
            </span>
            <h2 className="font-display m-0 text-[22px] font-bold">
              {position.title} · {position.company}
            </h2>
            <span className="text-muted-2 font-mono text-xs">{position.location}</span>
            <p className="text-[15px]/1.6 text-ink-2 m-0">{position.summary}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
