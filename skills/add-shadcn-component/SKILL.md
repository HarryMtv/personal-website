---
name: add-shadcn-component
description: Add a shadcn/ui component via the CLI into src/shared/ui/, respecting Tailwind v4, components.json and the FSD path aliases.
---

# Add a shadcn/ui component

This project uses **shadcn/ui v4 on Tailwind v4** (CSS-first, no
`tailwind.config.js`). Components land in `src/shared/ui/` and import `cn`
from `@/shared/lib/cn`.

## Steps

1. Add the component:
   ```sh
   pnpm ui:add <component>     # e.g. pnpm ui:add dialog
   ```
   `ui:add` is an alias for `shadcn add`, configured by `components.json`
   (aliases point at `@/shared/ui` and `@/shared/lib`).
2. Verify the generated file imports from `@/shared/lib/cn` and
   `@/shared/ui/...` aliases (it should by default).
3. If you need a block (e.g. a login form) instead of a single component, use the shadcn MCP server (`.mcp.json`) to browse the registry.
4. Import and use it anywhere:
   ```tsx
   import { Dialog } from '@/shared/ui/dialog';
   ```

## Conventions

- Do not edit `src/app/styles/index.css` tokens unless adding a new theme
  variable; semantic variables map onto the design tokens there.
- `react-refresh/only-export-components` is disabled for `src/shared/ui/**`,
  so variant exports are fine.
- After adding, run `pnpm lint` and `pnpm typecheck` to confirm the new file passes.
