# ADR 0002: Static content as MDX with zod-validated frontmatter

- **Status:** Accepted
- **Date:** 2026-10-27

## Context

Projects and posts are editorial content: they need headings, code blocks and
pull quotes, and they must be addable without touching code. There is no
backend and no CMS.

## Decision

Content lives in `content/projects/*.mdx` and `content/writing/*.mdx`. The
Vite pipeline runs `@mdx-js/rollup` as a **pre** plugin (ahead of Vite 8's
built-in oxc transform) with GFM, YAML frontmatter exported as `frontmatter`,
`rehype-slug` ids, an exported `tableOfContents` and Shiki highlighting
(skipped under Vitest for speed). Entity registries consume it:

- `import.meta.glob('/content/**', { eager: true, import: 'frontmatter' })`
  for metadata, lazy globs for the MDX bodies;
- zod schemas parse every frontmatter at module load and throw a
  `ContentError` naming the offending file;
- slugs come from filenames; ordering from an explicit `order` field.

`content/` is only importable from `entities/*/api/**` (ADR 0001), so nothing
bypasses validation.

**The PDF contract:** `public/cv/igor-martynov.pdf` and
`src/entities/experience/model/positions.ts` (plus the profile entity) must
be updated **together** — the `/cv` window renders the same facts as the PDF.
A follow-up could generate the PDF from the data.

## Consequences

- Adding a project = adding `content/projects/<slug>.mdx`; the explorer,
  filters and case-study route pick it up automatically.
- Bad frontmatter fails loudly at load time with the file's name, not as a
  blank page.
- Case-study bodies are code-split and load in route loaders.

## Alternatives considered

- **Typed TS modules only** — great for facts, terrible for prose.
- **A CMS (Sanity/Contentful)** — a backend we deliberately do not have.
- **Custom remark TOC plugin** — `rehype-slug` +
  `@stefanprobst/rehype-extract-toc` already do it, maintained.
