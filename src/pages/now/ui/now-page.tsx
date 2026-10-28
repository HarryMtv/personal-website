import { Window } from '@/shared/ui/window';
import { profile } from '@/entities/profile';

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

/** The now.md window. */
export function NowPage() {
  const [year, month] = profile.now.updatedAt.split('-');
  const updated = `${MONTHS[Number(month) - 1]} ${year}`;

  return (
    <Window path={[{ label: 'now.md' }]} closeTo="/desktop">
      <div className="mx-auto flex max-w-[680px] flex-col gap-5 p-[clamp(24px,5vw,56px)]">
        <p className="text-muted m-0 font-mono text-[13px] font-medium">Updated {updated}</p>
        <h1 className="font-display m-0 text-[40px]/[1.05] font-extrabold tracking-[-0.02em]">
          What I&rsquo;m doing now
        </h1>
        <ul className="m-0 flex list-disc flex-col gap-3 pl-5 text-[17px]/[1.55]">
          {profile.now.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </Window>
  );
}
