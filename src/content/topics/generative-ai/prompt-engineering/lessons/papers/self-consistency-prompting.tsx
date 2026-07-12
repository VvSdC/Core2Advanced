import {
  Callout,
  ContentStep,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
  ResearchPaperHeader,
} from '../../../../../../components/content'

const PAPER_URL = 'https://arxiv.org/abs/2203.11171'

export function SelfConsistencyPrompting() {
  return (
    <LessonArticle>
      <ResearchPaperHeader
        title="Self-Consistency Improves Chain of Thought Reasoning in Language Models"
        authors="Wang et al. (Google)"
        year="2022"
        url={PAPER_URL}
      >
        Run chain-of-thought <strong className="text-white">multiple times</strong> and pick the most common
        answer — a free accuracy boost over single-run CoT.
      </ResearchPaperHeader>

      <Callout variant="beginner" title="Read this after">
        Read the Chain-of-Thought technique lesson and CoT paper first. Self-consistency is the next step when
        you need higher accuracy on hard reasoning and can afford extra inference cost.
      </Callout>

      <LessonSection title="Background — CoT is not always right">
        <p>
          Chain-of-thought improves reasoning, but a single run can still produce a wrong reasoning chain —
          especially on ambiguous problems. Humans solve this by trying multiple approaches and picking the
          answer they trust most.
        </p>
      </LessonSection>

      <LessonSection title="How self-consistency works">
        <ContentStep number={1} title="Sample, then vote">
          <ol className="list-decimal space-y-2 pl-5 text-slate-300">
            <li>Run the same CoT prompt <strong className="text-white">N times</strong> (typically 5–40) with temperature above 0.</li>
            <li>Each run may produce a different reasoning path and final answer.</li>
            <li><strong className="text-white">Majority vote</strong> on the final answer — the most frequent answer wins.</li>
          </ol>
          <Callout variant="insight">
            Different reasoning paths that arrive at the same answer suggest that answer is robust. A one-off
            wrong path gets outvoted.
          </Callout>
        </ContentStep>

        <ContentStep number={2} title="Results">
          <p>
            On GSM8K (grade-school math), self-consistency boosted CoT accuracy significantly — e.g. from ~56%
            to ~74% on certain models. Gains were largest on problems where single-run CoT was already partially
            working.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="When to use self-consistency">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li><strong className="text-white">Use</strong> — high-stakes reasoning where accuracy matters more than cost (medical triage drafts, financial calculations).</li>
          <li><strong className="text-white">Skip</strong> — latency-sensitive apps, simple tasks, tight budgets (N× the token cost).</li>
          <li><strong className="text-white">Sweet spot</strong> — 5–10 samples with temperature 0.7; diminishing returns beyond that.</li>
        </ul>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Run CoT multiple times with temperature > 0, majority-vote the final answer.',
          'Meaningful accuracy gains on math and logic benchmarks.',
          'Costs N× inference — use when accuracy outweighs cost.',
          'Stack on top of few-shot or zero-shot CoT — not a replacement.',
        ]}
      />
    </LessonArticle>
  )
}
