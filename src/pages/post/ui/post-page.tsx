import { Window } from '@/shared/ui/window';

export function PostPage() {
  return (
    <Window path={[{ label: 'writing/', to: '/writing' }, { label: '.md' }]} closeTo="/writing" variant="reader">
      <div className="p-8">
        <h1 className="m-0 font-display text-[40px]/1.05 font-extrabold tracking-[-0.02em]">
          Post
        </h1>
      </div>
    </Window>
  );
}
