import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ExternalLink } from './external-link';

describe('ExternalLink', () => {
  it('opens in a new tab safely', () => {
    render(<ExternalLink href="https://github.com/HarryMtv">GitHub</ExternalLink>);
    const link = screen.getByRole('link', { name: /github/i });
    expect(link).toHaveAttribute('href', 'https://github.com/HarryMtv');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('announces the new tab to screen readers', () => {
    render(<ExternalLink href="https://example.com">Docs</ExternalLink>);
    expect(
      screen.getByRole('link', { name: /^Docs \(opens in a new tab\)$/i }),
    ).toBeInTheDocument();
  });
});
