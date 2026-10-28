import { m } from 'motion/react';
import { formatPeriod, type Position } from '../model/positions';

const list = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04 } },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

/** The left-bordered career timeline, staggering in. */
export function Timeline({ positions }: { positions: Position[] }) {
  return (
    <m.ol
      variants={list}
      initial="hidden"
      animate="show"
      className="border-ink m-0 flex list-none flex-col gap-0 border-l-2 p-0"
    >
      {positions.map((position, index) => (
        <m.li
          key={position.id}
          variants={item}
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
            <p className="text-ink-2 m-0 text-[15px]/[1.6]">{position.summary}</p>
          </div>
        </m.li>
      ))}
    </m.ol>
  );
}
