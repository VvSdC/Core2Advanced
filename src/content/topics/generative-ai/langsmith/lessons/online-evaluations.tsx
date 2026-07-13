import {
  Callout,
  ContentStep,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function OnlineEvaluations() {
  return (
    <LessonArticle>
      <LessonSection title="What are online evaluations?">
        <p className="text-slate-300">
          Offline experiments test against a fixed dataset. <strong className="text-white">Online evaluations</strong>{' '}
          run evaluators automatically on <em>live production traces</em> — scoring real user traffic as it
          happens. You catch quality drift before users complain.
        </p>
        <Flowchart
          title="Online eval pipeline"
          chart={`flowchart LR
  U[User request] --> C[Chain runs + trace logged]
  C --> S{Sampling rule}
  S -- 10% sample --> E[Faithfulness evaluator]
  E --> F[Score on trace]
  F --> A[Alert if avg drops]`}
        />
      </LessonSection>

      <LessonSection title="Set up online evaluators">
        <ContentStep number={1} title="Choose evaluators">
          <p>
            In LangSmith, go to <strong className="text-white">Online Evaluations</strong>. Attach built-in
            evaluators (faithfulness, relevance) or custom ones you wrote for experiments.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Define sampling rules">
          <p>
            Do not score 100% of traffic — LLM-as-judge calls cost money. Sample{' '}
            <strong className="text-white">10–20%</strong> of production traces, or filter to high-risk paths
            (e.g. only RAG answers, only new prompt version).
          </p>
        </ContentStep>
        <ContentStep number={3} title="Filter by project or metadata">
          <p>
            Run online evals only on your <code className="font-mono text-sm">production</code> project. Tag traces
            with environment metadata so staging noise does not skew scores.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Alert on score drops">
        <p className="text-slate-300">
          Online eval scores feed into LangSmith dashboards. Set up alerts when averages fall below a threshold —
          e.g. faithfulness below 0.75 for three consecutive days triggers a Slack notification.
        </p>
        <div className="mt-4 overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Signal</th>
                <th className="px-4 py-3">Possible cause</th>
                <th className="px-4 py-3">Response</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Faithfulness drops 15%', 'Retrieval index stale or prompt changed', 'Check recent Hub commits; re-index docs'],
                ['Relevance drops', 'Model provider update or temperature drift', 'Compare in Playground; pin model version'],
                ['Thumbs-down rate spikes', 'New user segment or edge case', 'Add traces to dataset; run experiment'],
              ].map(([signal, cause, response]) => (
                <tr key={signal} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{signal}</td>
                  <td className="px-4 py-3 text-slate-400">{cause}</td>
                  <td className="px-4 py-3 text-slate-400">{response}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Catch drift before users complain">
        <Callout variant="insight">
          Offline datasets go stale — production traffic shifts. Online evals watch the live stream. Combine both:
          datasets catch regressions you know about; online evals catch surprises you did not.
        </Callout>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-300">
          <li>Run the same faithfulness evaluator offline (experiments) and online (production sample).</li>
          <li>When online scores diverge from offline, your dataset needs new rows from recent failures.</li>
          <li>Review low-scoring traces weekly in annotation queues — human + automated coverage.</li>
        </ul>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Online evaluations score live production traces automatically — not just offline datasets.',
          'Use sampling rules (10–20%) to control cost; filter by project and metadata.',
          'Alert on average score drops to catch drift before user complaints spike.',
          'Combine offline experiments and online evals for full regression + surprise detection.',
        ]}
      />
    </LessonArticle>
  )
}
