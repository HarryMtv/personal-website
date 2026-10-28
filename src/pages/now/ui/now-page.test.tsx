import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithRouter } from '@/shared/lib/test/render-with-router';
import { NowPage } from './now-page';

describe('NowPage', () => {
  it('shows the updated stamp and the current focus items', async () => {
    await renderWithRouter(<NowPage />);
    expect(screen.getByText('Updated October 2026')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: /doing now/i })).toBeInTheDocument();
    expect(screen.getByText(/czech lessons, a2 in sight/i)).toBeInTheDocument();
  });
});
