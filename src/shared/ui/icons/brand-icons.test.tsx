import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { GithubIcon, ImMonogram, LinkedinIcon, MediumIcon, TelegramIcon } from './brand-icons';

describe('brand icons', () => {
  it('render hidden decorative SVGs', () => {
    render(
      <>
        <GithubIcon />
        <TelegramIcon />
        <LinkedinIcon />
        <MediumIcon />
      </>,
    );
    const svgs = document.querySelectorAll('svg[aria-hidden="true"]');
    expect(svgs).toHaveLength(4);
  });

  it('renders the IM monogram tile', () => {
    render(<ImMonogram />);
    expect(screen.getByText('IM')).toBeInTheDocument();
  });
});
