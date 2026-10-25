import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SectionLabel } from './section-label';

describe('SectionLabel', () => {
  it('renders an uppercase mono label', () => {
    render(<SectionLabel>Open to</SectionLabel>);
    expect(screen.getByRole('heading', { name: 'Open to' })).toHaveClass(
      'font-mono',
      'uppercase',
    );
  });
});
