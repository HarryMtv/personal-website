---
name: add-query-hook
description: Add the features/<slice> data layer — a typed fetch function in api/, a useQuery/useMutation hook in model/, query keys and invalidation, exported via index.ts.
---

# Add a Query data layer

Server-state lives in **TanStack Query** — never mirror it into Zustand. The
data layer lives in a feature slice with FSD segments; the slice's `index.ts`
is the only import path other layers may use.

## Steps

1. Create `src/features/<feature>/api/users.ts`:
   ```ts
   export type User = { id: string; name: string };

   export async function fetchUsers(): Promise<User[]> {
     const res = await fetch('/api/users');
     if (!res.ok) throw new Error(`fetchUsers failed: ${res.status}`);
     return res.json();
   }

   // Centralized query keys → safe invalidation.
   export const usersKeys = {
     all: ['users'] as const,
     list: () => [...usersKeys.all, 'list'] as const,
     detail: (id: string) => [...usersKeys.all, 'detail', id] as const,
   };

   export function usersQuery() {
     return { queryKey: usersKeys.list(), queryFn: fetchUsers };
   }
   ```
2. Create `src/features/<feature>/model/use-users.ts`:
   ```ts
   import { useQuery } from '@tanstack/react-query';
   import { usersQuery } from '../api/users';

   export function useUsers() {
     return useQuery(usersQuery());
   }
   ```
3. For mutations, invalidate the relevant keys on success:
   ```ts
   import { useMutation, useQueryClient } from '@tanstack/react-query';
   import { fetchCreateUser } from '../api/users';
   import { usersKeys } from '../api/users';

   export function useCreateUser() {
     const qc = useQueryClient();
     return useMutation({
       mutationFn: (input: { name: string }) => fetchCreateUser(input),
       onSuccess: () => qc.invalidateQueries({ queryKey: usersKeys.all }),
     });
   }
   ```
4. Export the public API from `src/features/<feature>/index.ts` — only what
   pages/widgets may import.
5. Run `pnpm typecheck && pnpm test`.

## Conventions

- One source of truth for keys (an `xxxKeys` object) — never inline raw arrays.
- Reuse `queryClient` from `@/shared/lib/query-client` for loaders and prefetching.
- Return typed data; let Query own loading/error state.
- Live example: `src/features/send-contact-message` (mutation + injected transport).
