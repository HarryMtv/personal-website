---
name: create-react-component
description: Scaffold a typed functional React component in the right FSD layer — shared/ui primitives, entities/<slice>/ui, features/<slice>/ui or pages/<slice>/ui — with a colocated Vitest test.
---

# Create a React component

## Steps

1. Decide where it lives (FSD layers — a layer may only import from layers
   below it):
   - Generic UI primitive → `src/shared/ui/<name>.tsx`
   - Domain piece (a project row, a timeline) → `src/entities/<slice>/ui/<name>.tsx`
   - Interactive feature piece → `src/features/<slice>/ui/<name>.tsx`
   - Page composition → `src/pages/<slice>/ui/<name>-page.tsx`
2. Create the component with a **named export** and an explicit props type. Use `type`-only imports (the project enables `verbatimModuleSyntax`):
   ```tsx
   import type { ComponentProps } from 'react';
   import { cn } from '@/shared/lib/cn';

   export type ExampleProps = ComponentProps<'div'> & {
     title: string;
   };

   export function Example({ title, className, ...props }: ExampleProps) {
     return (
       <div className={cn('rounded-lg border p-4', className)} {...props}>
         {title}
       </div>
     );
   }
   ```
3. Export it from the slice's `index.ts` (slices other than `shared` and
   `app` must expose a public API).
4. Add a colocated test `<name>.test.tsx` (see the `write-vitest-test` skill;
   components with `Link` use `renderWithRouter` from `@/shared/lib/test`).
5. Use `cn()` from `@/shared/lib/cn` to merge classes; prefer Tailwind utilities.

## Conventions

- Named exports only (keeps Fast Refresh happy outside `src/app/routes/**`
  and `src/shared/ui/**`).
- Keep prop types in a `export type … = …` declaration next to the component.
- Never deep-import another slice — go through its `index.ts`.
