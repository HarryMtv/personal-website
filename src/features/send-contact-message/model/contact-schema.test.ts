import { describe, expect, it } from 'vitest';
import { contactMessageSchema, type ContactMessage } from './contact-schema';

const valid: ContactMessage = {
  from: 'recruiter@company.com',
  subject: 'A frontend role',
  topic: 'A role',
  message: 'We have a role you might like.',
  botcheck: '',
};

describe('contactMessageSchema', () => {
  it('accepts a valid message', () => {
    expect(contactMessageSchema.parse(valid)).toEqual(valid);
  });

  it('rejects an invalid email', () => {
    const result = contactMessageSchema.safeParse({ ...valid, from: 'not-an-email' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Enter a valid email');
    }
  });

  it('rejects a short message', () => {
    const result = contactMessageSchema.safeParse({ ...valid, message: 'hi' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Tell me a bit more (10+ characters)');
    }
  });

  it('rejects a filled honeypot', () => {
    const result = contactMessageSchema.safeParse({ ...valid, botcheck: 'spam' });
    expect(result.success).toBe(false);
  });

  it('caps the subject at 150 characters', () => {
    const result = contactMessageSchema.safeParse({ ...valid, subject: 'x'.repeat(151) });
    expect(result.success).toBe(false);
  });

  it('trims the message before validating', () => {
    const parsed = contactMessageSchema.parse({ ...valid, message: '  hello there  ' });
    expect(parsed.message).toBe('hello there');
  });

  it('rejects a whitespace-padded message that trims below 10 characters', () => {
    const result = contactMessageSchema.safeParse({ ...valid, message: '     short     ' });
    expect(result.success).toBe(false);
  });

  it('accepts exact boundary lengths (10 and 5000 chars for message, 150 for subject) and rejects 5001', () => {
    expect(contactMessageSchema.safeParse({ ...valid, message: 'a'.repeat(10) }).success).toBe(
      true,
    );
    expect(contactMessageSchema.safeParse({ ...valid, message: 'a'.repeat(5000) }).success).toBe(
      true,
    );
    expect(contactMessageSchema.safeParse({ ...valid, message: 'a'.repeat(5001) }).success).toBe(
      false,
    );
    expect(contactMessageSchema.safeParse({ ...valid, subject: 's'.repeat(150) }).success).toBe(
      true,
    );
  });
});
