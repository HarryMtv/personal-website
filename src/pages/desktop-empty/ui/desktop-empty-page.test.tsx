import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithRouter } from '@/shared/lib/test/render-with-router';
import { DesktopEmptyPage } from './desktop-empty-page';

describe('DesktopEmptyPage', () => {
  it('shows the sticky note linking back to About me', async () => {
    await renderWithRouter(<DesktopEmptyPage />);
    expect(screen.getByText('note.txt')).toBeInTheDocument();
    expect(screen.getByText(/all windows closed/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /about me/i })).toHaveAttribute('href', '/');
  });
});
