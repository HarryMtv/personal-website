import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CvDocument } from './cv-document';

describe('CvDocument', () => {
  it('renders all 7 sections', () => {
    render(<CvDocument zoom={100} />);
    for (const name of [
      'Summary',
      'Experience',
      'Education',
      'Skills',
      'Certifications',
      'Languages',
    ]) {
      expect(screen.getByRole('heading', { name })).toBeInTheDocument();
    }
    expect(screen.getByRole('heading', { name: 'Igor Martynov' })).toBeInTheDocument();
  });

  it('renders the 5 positions with the 70% data-grid highlight', () => {
    render(<CvDocument zoom={100} />);
    // Two positions carry the Staff title (Wrike and Citrix).
    expect(screen.getAllByText('Staff Software Engineer')).toHaveLength(2);
    expect(screen.getByText(/Motorola Solutions/)).toBeInTheDocument();
    expect(screen.getByText(/cutting render time by 70%/i)).toBeInTheDocument();
  });

  it('renders the 9 skill groups and 2 certifications', () => {
    render(<CvDocument zoom={100} />);
    for (const group of [
      'Frontend',
      'Build & Tooling',
      'Testing & QA',
      'Runtime & API',
      'Artificial intelligence (AI)',
      'DevOps & CI/CD',
      'Monitoring & Observability',
      'Mobile',
      'Methodologies',
    ]) {
      expect(screen.getByText(group)).toBeInTheDocument();
    }
    expect(screen.getByText(/Claude Code 101/)).toBeInTheDocument();
    expect(screen.getByText(/Building with the Claude API/)).toBeInTheDocument();
  });

  it('renders the language meters with accessible labels', () => {
    render(<CvDocument zoom={100} />);
    expect(screen.getByLabelText('English: 5 of 5')).toBeInTheDocument();
    expect(screen.getByLabelText('Russian: 5 of 5')).toBeInTheDocument();
    expect(screen.getByLabelText('Czech: 2 of 5')).toBeInTheDocument();
  });

  it('applies the zoom scale', () => {
    const { rerender } = render(<CvDocument zoom={100} />);
    const sheet = screen.getByTestId('cv-sheet');
    expect(sheet).toHaveStyle({ zoom: '1' });
    rerender(<CvDocument zoom={130} />);
    expect(sheet).toHaveStyle({ zoom: '1.3' });
  });

  it('never renders the phone number', () => {
    render(<CvDocument zoom={100} />);
    expect(screen.queryByText(/\+420/)).not.toBeInTheDocument();
  });
});
