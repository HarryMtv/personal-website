import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithRouter } from '@/shared/lib/test/render-with-router';
import { ExperiencePage } from './experience-page';

describe('ExperiencePage', () => {
  it('shows the 5-position timeline from the CV', async () => {
    await renderWithRouter(<ExperiencePage />);
    expect(screen.getByRole('heading', { level: 1, name: /experience/i })).toBeInTheDocument();
    expect(screen.getByText('Staff Software Engineer · Wrike')).toBeInTheDocument();
    expect(screen.getByText('Jul 2022 — now')).toBeInTheDocument();
    expect(screen.getByText('QA Automation Engineer · Motorola Solutions')).toBeInTheDocument();
    expect(screen.getByText(/100k\+ rows/i)).toBeInTheDocument();
  });

  it('offers both CV links', async () => {
    await renderWithRouter(<ExperiencePage />);
    expect(screen.getByRole('link', { name: /open cv/i })).toHaveAttribute('href', '/cv');
    const download = screen.getByRole('link', { name: /download cv \(pdf\)/i });
    expect(download).toHaveAttribute('href', '/cv/igor-martynov.pdf');
    expect(download).toHaveAttribute('download', 'Igor-Martynov-CV.pdf');
  });
});
