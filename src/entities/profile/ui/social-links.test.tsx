import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { socials } from '../model/profile';
import { SocialLinks } from './social-links';

describe('SocialLinks', () => {
  it('renders only socials that have a URL', () => {
    render(<SocialLinks socials={socials} />);
    expect(screen.getByRole('link', { name: /github/i })).toHaveAttribute(
      'href',
      'https://github.com/HarryMtv',
    );
    expect(screen.getByRole('link', { name: /linkedin/i })).toHaveAttribute(
      'href',
      'https://www.linkedin.com/in/ig-martynov',
    );
    expect(screen.queryByRole('link', { name: /telegram/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /medium/i })).not.toBeInTheDocument();
  });
});
