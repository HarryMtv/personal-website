import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { getProjects } from '@/entities/project';
import { filterProjects, resolveSelected } from '@/features/filter-projects';
import { renderWithRouter } from '@/shared/lib/test/render-with-router';
import { ProjectExplorer } from './project-explorer';

function mountExplorer(search: {
  kind: 'all' | 'side' | 'work' | 'experiment';
  tag?: 'typescript' | 'telegram' | 'ai' | '3d';
  selected?: string;
}) {
  const filtered = filterProjects(getProjects(), search);
  const selected = resolveSelected(filtered, search.selected);
  return renderWithRouter(
    <ProjectExplorer projects={filtered} search={search} selected={selected} />,
    { path: '/projects' },
  );
}

describe('ProjectExplorer', () => {
  it('lists all projects with the first one selected', async () => {
    const { router } = await mountExplorer({ kind: 'all' });
    const rows = screen.getAllByRole('link').filter((link) => link.dataset.selected !== undefined);
    expect(rows).toHaveLength(4);
    expect(screen.getByText('PM Telegram Hub')).toBeInTheDocument();
    // The preview shows the first project by default.
    expect(screen.getByRole('complementary', { name: 'Preview' })).toHaveTextContent(
      'PM Telegram Hub',
    );
    expect(router.state.location.search).toEqual({});
  });

  it('selects a row via the URL and marks only the selected row with aria-current="true"', async () => {
    const user = userEvent.setup();
    const { router } = await mountExplorer({ kind: 'all' });
    const rows = screen.getAllByRole('link').filter((link) => link.dataset.selected !== undefined);
    expect(rows[0]).toHaveAttribute('aria-current', 'true');
    expect(rows[1]).not.toHaveAttribute('aria-current');

    await user.click(screen.getByText('distill'));
    // The widget is pure; the page re-derives the preview from this URL state.
    expect(router.state.location.search).toMatchObject({ selected: 'distill' });
  });

  it('ignores modified clicks on a row so the browser can open a new tab', async () => {
    const user = userEvent.setup();
    const { router } = await mountExplorer({ kind: 'all' });
    await user.keyboard('{Meta>}');
    await user.click(screen.getByText('distill'));
    await user.keyboard('{/Meta}');
    expect(router.state.location.search).toEqual({});
  });

  it('previews the URL-selected project', async () => {
    await mountExplorer({ kind: 'all', selected: 'distill' });
    expect(screen.getByRole('complementary', { name: 'Preview' })).toHaveTextContent('Distill');
  });

  it('shows the empty state when nothing matches', async () => {
    await mountExplorer({ kind: 'experiment', tag: 'telegram' });
    expect(screen.getByText('No files match these filters.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Clear filters' })).toBeInTheDocument();
    expect(screen.queryByRole('complementary', { name: 'Preview' })).not.toBeInTheDocument();
  });

  it('offers the case study only for projects that have one', async () => {
    await mountExplorer({ kind: 'all', selected: 'splat-tours' });
    expect(screen.queryByRole('link', { name: /open case study/i })).not.toBeInTheDocument();
  });
});
