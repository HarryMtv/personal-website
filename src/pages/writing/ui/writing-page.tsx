import { getPosts, PostCard } from '@/entities/post';
import { Window } from '@/shared/ui/window';
import { StaggerItem, StaggerList } from '@/shared/ui/motion/stagger-list';

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
          <StaggerList className="flex flex-col gap-4">
            {posts.map((post) => (
              <StaggerItem key={post.slug}>
                <PostCard post={post} />
              </StaggerItem>
            ))}
          </StaggerList>
        ) : (
          <p className="text-ink-2 m-0">Nothing published yet.</p>
        )}
      </div>
    </Window>
  );
}
