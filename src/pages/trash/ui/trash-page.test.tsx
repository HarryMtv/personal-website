import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithRouter } from '@/shared/lib/test/render-with-router';
import { TrashPage } from './trash-page';

describe('TrashPage', () => {
  it('lists the trashed files with the note', async () => {
    await renderWithRouter(<TrashPage />);
    expect(screen.getByText('ClassComponents.jsx')).toBeInTheDocument();
    expect(screen.getByText('jquery-plugins/')).toBeInTheDocument();
    expect(screen.getByText('we-will-add-tests-later.txt')).toBeInTheDocument();
    expect(screen.getByText(/not emptying it/i)).toBeInTheDocument();
  });
});
