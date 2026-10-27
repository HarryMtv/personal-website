import { getPosts, PostCard } from '@/entities/post';
import { Window } from '@/shared/ui/window';

/** The writing/ window: post cards or the empty state. */
export function WritingPage() {
  const posts = getPosts();

  return (
    <Window path={[{ label: 'writing/' }]} closeTo="/desktop">
      <div className="mx-auto flex max-w-[760px] flex-col gap-6 p-[clamp(24px,5vw,56px)]">
        <h1 className="font-display text-[40px]/1.05 m-0 font-extrabold tracking-[-0.02em]">
          Writing
        </h1>
        {posts.length > 0 ? (
          <div className="flex flex-col gap-4">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <p className="text-ink-2 m-0">Nothing published yet.</p>
        )}
      </div>
    </Window>
  );
}
