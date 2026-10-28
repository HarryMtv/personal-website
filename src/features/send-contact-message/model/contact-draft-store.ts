import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { ContactTopic } from './contact-schema';

export interface ContactDraftFields {
  from: string;
  subject: string;
  topic: ContactTopic;
  message: string;
  /** Honeypot mirror; stays empty unless a bot fills it. */
  botcheck: string;
}

interface ContactDraftState extends ContactDraftFields {
  setField: <K extends keyof ContactDraftFields>(name: K, value: ContactDraftFields[K]) => void;
  reset: () => void;
}

const EMPTY: ContactDraftFields = {
  from: '',
  subject: '',
  topic: 'A role',
  message: '',
  botcheck: '',
};

/**
 * The compose draft, persisted in sessionStorage so unsent values survive
 * navigation within the tab. Server state it is not — hence Zustand, not
 * TanStack Query.
 */
export const useContactDraftStore = create<ContactDraftState>()(
  persist(
    (set) => ({
      ...EMPTY,
      setField: (name, value) => set({ [name]: value }),
      reset: () => set(EMPTY),
    }),
    {
      name: 'contact-draft',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) =>
        ({
          from: state.from,
          subject: state.subject,
          topic: state.topic,
          message: state.message,
          botcheck: state.botcheck,
        }) satisfies ContactDraftFields,
    },
  ),
);
