import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithRouter } from '@/shared/lib/test/render-with-router';
import { NotFoundPage } from './not-found-page';

describe('NotFoundPage', () => {
  it('shows the 404.md window with a link home', async () => {
    await renderWithRouter(<NotFoundPage />);
    expect(screen.getByText(/this file doesn.t exist/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /back to/i })).toHaveAttribute('href', '/');
  });
});
