import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithRouter } from '@/shared/lib/test/render-with-router';
import { HobbiesPage } from './hobbies-page';

describe('HobbiesPage', () => {
  it('renders the hobby cards', async () => {
    await renderWithRouter(<HobbiesPage />);
    expect(screen.getByRole('heading', { level: 1, name: /off the clock/i })).toBeInTheDocument();
    for (const title of ['Games', 'Outdoors', 'Music', 'Photo & Video', 'Languages']) {
      expect(screen.getByRole('heading', { name: title })).toBeInTheDocument();
    }
  });
});
