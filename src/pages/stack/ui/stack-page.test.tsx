import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithRouter } from '@/shared/lib/test/render-with-router';
import { StackPage } from './stack-page';

describe('StackPage', () => {
  it('renders the six stack groups', async () => {
    await renderWithRouter(<StackPage />);
    expect(screen.getByRole('heading', { level: 1, name: /stack & uses/i })).toBeInTheDocument();
    for (const label of [
      'Every day',
      'Backend, when needed',
      'Testing',
      'Infra',
      'AI workflow',
      'Notes',
    ]) {
      expect(screen.getByRole('heading', { name: new RegExp(label, 'i') })).toBeInTheDocument();
    }
  });
});
