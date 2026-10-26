import { tanstackRouter } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@mdx-js/rollup';
import rehypeSlug from 'rehype-slug';
import rehypeExtractToc from '@stefanprobst/rehype-extract-toc';
import rehypeExtractTocExport from '@stefanprobst/rehype-extract-toc/mdx';
import rehypeShiki from '@shikijs/rehype';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import type { Plugin } from 'vite';
// Typed `test` block requires Vitest's defineConfig, not Vite's.
import { defineConfig } from 'vitest/config';

// Shiki highlights code at build time but slows every cold start; tests
// don't assert on colors, so they skip it.
const rehypePlugins = process.env.VITEST
  ? [rehypeSlug, rehypeExtractToc, [rehypeExtractTocExport, { name: 'tableOfContents' }]]
  : [
      rehypeSlug,
      rehypeExtractToc,
      [rehypeExtractTocExport, { name: 'tableOfContents' }],
      [rehypeShiki, { theme: 'vitesse-dark' }],
    ];

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // Router plugin FIRST so routeTree.gen.ts is available to the rest of the build.
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
      routesDirectory: './src/app/routes',
      generatedRouteTree: './src/app/routeTree.gen.ts',
    }),
    // MDX as a pre plugin so Vite's built-in oxc transform never sees raw
    // .mdx, and before react, so the JSX it emits gets picked up by babel.
    {
      ...mdx({
        remarkPlugins: [
          remarkGfm,
          remarkFrontmatter,
          [remarkMdxFrontmatter, { name: 'frontmatter' }],
        ],
        // The rehype packages each pin their own unified major, so the
        // inferred plugin types never line up with @mdx-js/rollup's
        // PluggableList.
        rehypePlugins: rehypePlugins as never,
      }),
      enforce: 'pre',
    } as unknown as Plugin,
    react({ include: /\.(md|mdx|tsx?)$/ }),
    tailwindcss(),
  ],
  resolve: {
    // Vite 8 resolves tsconfig "paths" natively — single source of truth for @/* aliases.
    tsconfigPaths: true,
  },
  server: {
    // Reliable HMR under Docker when CHOKIDAR_USEPOLLING=true is set (see docker-compose).
    watch: {
      usePolling: process.env.CHOKIDAR_USEPOLLING === 'true',
    },
  },
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./src/shared/lib/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      exclude: ['src/app/routeTree.gen.ts'],
    },
  },
});
