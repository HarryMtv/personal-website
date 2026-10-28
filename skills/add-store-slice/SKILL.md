---
name: add-store-slice
description: Add a typed Zustand store inside a feature's model/ segment — client/UI state only, selectors, optional persistence, exported via index.ts.
---

# Add a Zustand store

Client/UI state (drafts, ephemeral flags) lives in **Zustand**, inside the
feature that owns it — there is no global `src/stores/` directory. **Never**
put server data here; that belongs to TanStack Query (see `add-query-hook`).

## Steps

1. Create `src/features/<feature>/model/<domain>-store.ts`:
   ```ts
   import { create } from 'zustand';

   type CartState = {
     itemCount: number;
     addItem: () => void;
     clear: () => void;
   };

   export const useCartStore = create<CartState>((set) => ({
     itemCount: 0,
     addItem: () => set((s) => ({ itemCount: s.itemCount + 1 })),
     clear: () => set({ itemCount: 0 }),
   }));
   ```
2. Consume with **selectors** to avoid re-rendering on unrelated changes:
   ```ts
   const itemCount = useCartStore((s) => s.itemCount);
   const addItem = useCartStore((s) => s.addItem);
   ```
   For event-handler reads (not reactive), use `useCartStore.getState()`.
3. Persist only when it is genuinely a draft (e.g. sessionStorage):
   `persist(..., { storage: createJSONStorage(() => sessionStorage) })` with
   a `partialize` that omits actions.
4. Export through the slice's `index.ts` and colocate a test in `model/` —
   stores are plain functions and test without a provider.

## Conventions

- One small store per concern, colocated with its feature's `model/` segment.
- Keep state serializable where possible.
- If you're about to store API data → stop and use Query instead.
- Live example: `src/features/send-contact-message/model/contact-draft-store.ts`.
