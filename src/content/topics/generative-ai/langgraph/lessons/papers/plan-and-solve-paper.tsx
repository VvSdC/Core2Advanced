import {
  Callout,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
  ResearchPaperHeader,
} from '../../../../../../components/content'

const PAPER_URL = 'https://arxiv.org/abs/2304.05128'

export function PlanAndSolvePaper() {
  return (
    <LessonArticle>
      <ResearchPaperHeader
        title="Plan-and-Solve Prompting: Improving Zero-Shot Chain-of-Thought Reasoning"
        authors="Wang et al."
        year="2023"
        url={PAPER_URL}
      >
        Split agent work into <strong className="text-white">plan first, execute second</strong> — maps directly
        to a two-node LangGraph: planner → executor.
      </ResearchPaperHeader>

      <Callout variant="beginner" title="Read this after">
        <em>StateGraphs & Nodes</em> lesson. Plan-and-Solve is a linear two-node graph before adding cycles.
      </Callout>

      <LessonSection title="Two-phase pattern">
        <Flowchart
          title="Plan-and-Solve as LangGraph"
          chart={`flowchart LR
  START --> P[planner node: decompose task]
  P --> E[executor node: solve each step]
  E --> END`}
        />
        <p className="mt-4 text-slate-300">
          State carries <code className="font-mono text-sm">plan: list[str]</code> and{' '}
          <code className="font-mono text-sm">current_step: int</code>. Executor loops through plan steps —
          extend with conditional edge for multi-step execution.
        </p>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Plan-and-Solve: explicit planning node before execution node.',
          'Reduces reasoning errors vs single-shot CoT.',
          'Foundation for plan-and-execute agent architectures in the Agents sub-topic.',
        ]}
      />
    </LessonArticle>
  )
}
