import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StickyNote } from './sticky-note';

describe('StickyNote', () => {
  it('shows its filename label and content', () => {
    render(
      <StickyNote label="note.txt">
        <p>All windows closed.</p>
      </StickyNote>,
    );
    expect(screen.getByText('note.txt')).toBeInTheDocument();
    expect(screen.getByText('All windows closed.')).toBeInTheDocument();
  });

  it('rotates by the requested angle', () => {
    render(
      <StickyNote label="elsewhere.txt" rotate={1.2}>
        hello
      </StickyNote>,
    );
    expect(screen.getByText('elsewhere.txt').parentElement).toHaveStyle({
      transform: 'rotate(1.2deg)',
    });
  });
});
