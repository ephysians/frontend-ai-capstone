import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CaseStudyCard } from '@/components/CaseStudyCard';

const caseStudy = {
  id: 'workflow-discipline',
  title: 'Building a repeatable AI-assisted engineering workflow',
  problem: 'The process did not scale.',
  decision: 'Adopted a deliberate workflow.',
  outcome: 'Caught a browser module mismatch before shipping.',
};

describe('CaseStudyCard', () => {
  it('presents the structured tool result with semantic sections', () => {
    render(<CaseStudyCard data={caseStudy} />);

    expect(screen.getByRole('heading', { name: caseStudy.title })).toBeVisible();
    expect(screen.getByText('Problem')).toBeVisible();
    expect(screen.getByText(caseStudy.problem)).toBeVisible();
    expect(screen.getByText('Decision')).toBeVisible();
    expect(screen.getByText(caseStudy.decision)).toBeVisible();
    expect(screen.getByText('Outcome')).toBeVisible();
    expect(screen.getByText(caseStudy.outcome)).toBeVisible();
  });
});
