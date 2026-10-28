import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithRouter } from '@/shared/lib/test/render-with-router';
import { AboutPage } from './about-page';

describe('AboutPage', () => {
  it('renders the hero with the accent tail, mark and CTAs', async () => {
    await renderWithRouter(<AboutPage />);
    const heading = screen.getByRole('heading', {
      level: 1,
      name: /frontend that stays fast at enterprise scale/i,
    });
    expect(heading).toBeInTheDocument();
    expect(screen.getByText('React, TypeScript and Redux Toolkit')).toHaveClass('mark');
    expect(screen.getByRole('link', { name: /see my projects/i })).toHaveAttribute(
      'href',
      '/projects',
    );
    expect(screen.getByRole('link', { name: /get in touch/i })).toHaveAttribute('href', '/contact');
  });

  it('shows the Right now aside with the OPEN TO block', async () => {
    await renderWithRouter(<AboutPage />);
    expect(screen.getByRole('heading', { name: /right now/i })).toBeInTheDocument();
    expect(
      screen.getByText(/consulting and developing applications for business/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/open to/i)).toBeInTheDocument();
  });
});
