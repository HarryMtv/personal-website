import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { renderWithRouter } from '@/shared/lib/test/render-with-router';
import { ErrorPage } from './error-page';

describe('ErrorPage', () => {
  it('shows the error.log window with the message and a reload button', async () => {
    await renderWithRouter(<ErrorPage error={new Error('boom while loading')} reset={vi.fn()} />);
    expect(screen.getByText('boom while loading')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reload/i })).toBeInTheDocument();
  });
});
