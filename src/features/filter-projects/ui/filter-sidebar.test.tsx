import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { renderWithRouter } from '@/shared/lib/test/render-with-router';
import { FilterSidebar } from './filter-sidebar';

describe('FilterSidebar', () => {
  it('marks the active kind and tag', async () => {
    await renderWithRouter(<FilterSidebar search={{ kind: 'work', tag: 'typescript' }} />, {
      path: '/projects',
    });
    expect(screen.getByRole('button', { name: 'Work' })).toHaveAttribute('aria-current', 'true');
    expect(screen.getByRole('button', { name: 'TypeScript' })).toHaveAttribute(
      'aria-current',
      'true',
    );
    expect(screen.getByRole('button', { name: 'All projects' })).not.toHaveAttribute(
      'aria-current',
    );
  });

  it('writes the kind to the URL and clears the selection', async () => {
    const user = userEvent.setup();
    const { router } = await renderWithRouter(<FilterSidebar search={{ kind: 'all' }} />, {
      path: '/projects?selected=telegram-content-engine',
    });
    await user.click(screen.getByRole('button', { name: 'Side projects' }));
    expect(router.state.location.pathname).toBe('/projects');
    expect(router.state.location.search).toMatchObject({ kind: 'side' });
    expect(router.state.location.search).not.toHaveProperty('selected');
  });

  it('clears a tag when it is clicked again', async () => {
    const user = userEvent.setup();
    const { router } = await renderWithRouter(
      <FilterSidebar search={{ kind: 'all', tag: 'ai' }} />,
      {
        path: '/projects?tag=ai',
      },
    );
    await user.click(screen.getByRole('button', { name: 'AI' }));
    expect(router.state.location.search).not.toHaveProperty('tag');
  });
});
