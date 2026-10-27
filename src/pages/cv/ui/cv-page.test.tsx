import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { renderWithRouter } from '@/shared/lib/test/render-with-router';
import { CvPage } from './cv-page';

describe('CvPage', () => {
  it('links the PDF download with the friendly filename', async () => {
    await renderWithRouter(<CvPage />);
    const download = screen.getByRole('link', { name: /download pdf/i });
    expect(download).toHaveAttribute('href', '/cv/igor-martynov.pdf');
    expect(download).toHaveAttribute('download', 'Igor-Martynov-CV.pdf');
  });

  it('shows the page count meta and zooms the sheet', async () => {
    const user = userEvent.setup();
    await renderWithRouter(<CvPage />);
    expect(screen.getByText('2 pages')).toBeInTheDocument();
    expect(screen.getByText('100%')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Zoom in' }));
    expect(screen.getByText('110%')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Zoom out' }));
    await user.click(screen.getByRole('button', { name: 'Zoom out' }));
    expect(screen.getByText('90%')).toBeInTheDocument();
  });
});
