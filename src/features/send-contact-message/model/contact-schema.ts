import { z } from 'zod';

export const CONTACT_TOPICS = ['A role', 'Consulting', 'A side project', 'Just saying hi'] as const;
export type ContactTopic = (typeof CONTACT_TOPICS)[number];

export const contactMessageSchema = z.object({
  from: z.email('Enter a valid email'),
  subject: z.string().max(150).optional(),
  topic: z.enum(CONTACT_TOPICS),
  message: z.string().trim().min(10, 'Tell me a bit more (10+ characters)').max(5000),
  /** Honeypot: must stay empty. */
  botcheck: z.string().max(0),
});

export type ContactMessage = z.infer<typeof contactMessageSchema>;
