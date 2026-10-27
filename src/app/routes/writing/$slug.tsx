import { createFileRoute, notFound } from '@tanstack/react-router';
import { PostPage } from '@/pages/post';
import { getPostBySlug, loadPost } from '@/entities/post';
import { pageTitle } from '@/shared/config/site';

export const Route = createFileRoute('/writing/$slug')({
  loader: async ({ params }) => {
    const post = getPostBySlug(params.slug);
    if (!post || post.draft) throw notFound(); // eslint-disable-line @typescript-eslint/only-throw-error -- TanStack's notFound() marker
    return { post, ...(await loadPost(post.slug)) };
  },
  head: ({ loaderData }) =>
    loaderData
      ? {
          meta: [
            { title: pageTitle(loaderData.post.title) },
            { name: 'description', content: loaderData.post.summary },
          ],
        }
      : { meta: [] },
  component: PostPage,
});
