import { tool } from 'ai';
import { z } from 'zod';

export interface CaseStudy {
  id: string;
  title: string;
  problem: string;
  decision: string;
  outcome: string;
}

const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'workflow-discipline',
    title: 'Building a repeatable AI-assisted engineering workflow',
    problem:
      "Building applications was never the hard part. The process didn't scale: every project started differently, documentation was minimal, and AI conversations were scattered instead of part of a repeatable workflow.",
    decision:
      'Treated the capstone repo like a production project: Conventional Commits from the first commit, a deliberately minimal repo, no padding to look more substantial than it was.',
    outcome:
      'Caught a real bug before it shipped: a feature built twice (vague prompt vs. precise prompt with tests) passed all 22 tests, but used Node/CommonJS export syntax while the HTML loaded it as a browser ES module, a mismatch that would have broken the app on load despite every test being green. Caught by reading the code instead of trusting the test count.',
  },
  {
    id: 'onboarding-agro-tourism',
    title: 'Onboarding design for a live agro-tourism platform',
    problem:
      'Discovering authentic agro-tourism experiences in Nigeria was fragmented and largely offline, with no single platform connecting travelers to farms, cultural sites, and local artisans.',
    decision:
      'The hardest problem was onboarding: getting a Tourist, a Farmer, and an Artisan through the same sign-up flow without any feeling like the product wasn\'t built for them. Rejected collecting full profile info immediately at sign-up as too intimidating; built a lightweight sign-up followed by a "How will you join us?" role selector instead.',
    outcome:
      "Still in active development, not yet publicly launched. The onboarding and partner-registration flows have gone through multiple rounds of mentor feedback and usability review.",
  },
];

function findCaseStudy(topic: string): CaseStudy | undefined {
  const q = topic.toLowerCase();
  return CASE_STUDIES.find(
    (cs) =>
      cs.id.includes(q) ||
      cs.title.toLowerCase().includes(q) ||
      (q.includes('workflow') && cs.id === 'workflow-discipline') ||
      ((q.includes('onboarding') || q.includes('agro') || q.includes('tourism')) && cs.id === 'onboarding-agro-tourism')
  );
}

export const getCaseStudy = tool({
  description:
    "Look up a structured case study from Emmanuel's portfolio by topic (e.g. 'workflow', 'onboarding', 'agro-tourism'). Use this whenever the user asks about a specific project in detail, so it renders as a real card instead of plain prose.",
  inputSchema: z.object({
    topic: z
      .string()
      .describe('What the user wants to know about, in their own words, e.g. "the workflow project" or "onboarding".'),
  }),
  execute: async ({ topic }) => {
    // Without this delay the in-memory lookup resolves in microseconds,
    // causing the SDK to batch input-available and output-available into
    // the same React render — the skeleton never paints.
    await new Promise((r) => setTimeout(r, 3000));
    const match = findCaseStudy(topic);
    if (!match) {
      throw new Error(`No case study found matching "${topic}".`);
    }
    return match;
  },
});
