import {
  Callout,
  ContentStep,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function LlmAsJudgeEvaluators() {
  return (
    <LessonArticle>
      <LessonSection title="Connect to Evaluating RAG">
        <p className="text-slate-300">
          In <em>RAG → Evaluating RAG</em> you learned metrics like <strong className="text-white">faithfulness</strong>{' '}
          (is the answer grounded in retrieved context?) and <strong className="text-white">answer relevancy</strong>{' '}
          (does it address the question?). Langfuse evaluators run those same checks automatically on production
          traces — not just on a static test set.
        </p>
        <div className="mt-4 overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">RAG metric</th>
                <th className="px-4 py-3">What the judge checks</th>
                <th className="px-4 py-3">Langfuse evaluator</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Faithfulness', 'Answer supported by context chunks?', 'LLM judge or RAGAS integration'],
                ['Answer relevancy', 'Answer addresses the user question?', 'LLM judge prompt'],
                ['Context precision', 'Retrieved chunks actually useful?', 'Score on retrieval span'],
              ].map(([metric, check, evaluator]) => (
                <tr key={metric} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{metric}</td>
                  <td className="px-4 py-3 text-slate-400">{check}</td>
                  <td className="px-4 py-3 text-genai-400">{evaluator}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Run evaluators on production traces">
        <Flowchart
          title="Automated eval pipeline"
          chart={`flowchart LR
  A[User request] --> B[Trace recorded]
  B --> C{Evaluator trigger}
  C --> D[Sample 10% of traces]
  C --> E[All traces with thumbs down]
  D --> F[LLM-as-judge]
  E --> F
  F --> G[Score attached to trace]
  G --> H[Dashboard: avg faithfulness]`}
        />
        <ContentStep number={1} title="Configure an evaluator in Langfuse">
          <p>
            Define a judge prompt: "Given context and answer, rate faithfulness 0–1." Point it at a cheap model
            (GPT-4o-mini) to keep eval costs low.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Trigger on new traces">
          <p>
            Run on every trace, a random sample (e.g. 10%), or only traces flagged by users. Sampling balances
            coverage with cost.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Scores appear on the trace">
          <p>
            The judge output becomes a score on the trace. Filter "faithfulness &lt; 0.5" to find bad answers
            without waiting for user complaints.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="LLM-as-judge vs code evaluators">
        <div className="space-y-3">
          <div className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
            <p className="text-sm font-semibold text-white">LLM-as-judge — flexible, semantic</p>
            <p className="mt-1 text-sm text-slate-400">
              Best for faithfulness, tone, completeness, and nuanced quality. Costs tokens per eval. Can disagree
              with humans occasionally — calibrate against human scores weekly.
            </p>
          </div>
          <div className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
            <p className="text-sm font-semibold text-white">Code evaluators — fast, deterministic</p>
            <p className="mt-1 text-sm text-slate-400">
              JSON schema validation, regex checks, exact-match on IDs, latency thresholds. Free and instant. Use
              when the rule is objective: "response must be valid JSON" or "must cite source URL".
            </p>
          </div>
        </div>
        <Callout variant="tip">
          Use both: code evaluators for hard constraints (schema, format), LLM-as-judge for semantic quality
          (faithfulness, helpfulness). Failed code evals are cheaper to run on 100% of traces.
        </Callout>
      </LessonSection>

      <LessonSection title="Catch regressions before users do">
        <p className="text-slate-300">
          Deploy prompt v5 on Monday. By Wednesday, average faithfulness dropped from 0.88 to 0.71 — visible on
          the score trend chart before support tickets spike. That is the payoff of automated evals on real
          production traffic.
        </p>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Langfuse evaluators apply RAG metrics (faithfulness, relevancy) to live production traces.',
          'Configure judge prompts, trigger on all traces or a sample, scores attach automatically.',
          'LLM-as-judge for semantic quality; code evaluators for deterministic rules (JSON, regex).',
          'Score trends detect prompt/model regressions days before user complaints pile up.',
        ]}
      />
    </LessonArticle>
  )
}
