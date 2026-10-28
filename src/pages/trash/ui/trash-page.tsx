import { Window } from '@/shared/ui/window';
import { profile } from '@/entities/profile';

/** The .trash/ window. */
export function TrashPage() {
  return (
    <Window path={[{ label: '.trash/' }]} closeTo="/desktop">
      <div className="mx-auto flex max-w-[640px] flex-col gap-4.5 p-[clamp(24px,5vw,56px)]">
        <h1 className="font-display text-[40px]/1.05 m-0 font-extrabold tracking-[-0.02em]">
          Trash
        </h1>
        <ul className="m-0 flex list-none flex-col gap-2 p-0 font-mono text-[15px]">
          {profile.trash.files.map((file) => (
            <li key={file} className="border-ink/15 bg-card rounded-lg border px-3.5 py-3">
              {file}
            </li>
          ))}
        </ul>
        <p className="text-ink-3 m-0 text-[15px]">{profile.trash.note}</p>
      </div>
    </Window>
  );
}
