import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { renderWithRouter } from '@/shared/lib/test/render-with-router';

// The list test drives the real content; the empty state mocks the registry.
vi.mock('@/entities/post', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/entities/post')>();
  return { ...actual, getPosts: vi.fn(actual.getPosts) };
});

import { getPosts } from '@/entities/post';
import { WritingPage } from './writing-page';

describe('WritingPage', () => {
  it('lists the published posts', async () => {
    await renderWithRouter(<WritingPage />);
    expect(getPosts()).toHaveLength(1);
    const card = screen.getByRole('link', { name: /building a telegram pm hub/i });
    expect(card).toHaveAttribute('href', '/writing/telegram-pm-hub-in-5-days');
    expect(screen.getByText(/read post/i)).toBeInTheDocument();
  });

  it('shows the empty state when nothing is published', async () => {
    vi.mocked(getPosts).mockReturnValueOnce([]);
    await renderWithRouter(<WritingPage />);
    expect(screen.getByText('Nothing published yet.')).toBeInTheDocument();
  });
});
