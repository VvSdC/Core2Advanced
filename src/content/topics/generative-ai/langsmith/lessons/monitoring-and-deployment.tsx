import {
  Callout,
  ContentStep,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function MonitoringAndDeployment() {
  return (
    <LessonArticle>
      <LessonSection title="Dashboards — see the big picture">
        <p className="text-slate-300">
          Individual traces show one request. LangSmith <strong className="text-white">dashboards</strong> aggregate
          thousands — cost, latency, error rates, and evaluator scores over time. Filter by project, model, prompt
          version, or custom metadata tags.
        </p>
        <div className="mt-4 overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Metric</th>
                <th className="px-4 py-3">What it shows</th>
                <th className="px-4 py-3">Example alert</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Cost by model', 'Spend per GPT-4o vs GPT-4o-mini call', 'GPT-4o cost up 3× after deploy'],
                ['Latency p50 / p95', 'Median and tail response times', 'p95 jumped from 2s to 8s'],
                ['Error rate', 'Failed runs / total runs', 'Tool-call errors spiked after API change'],
                ['Token usage', 'Input vs output tokens over time', 'Output tokens doubled — verbose prompt?'],
                ['Evaluator scores', 'Average faithfulness, thumbs-up rate', 'Faithfulness below 0.75 for 3 days'],
              ].map(([metric, shows, alert]) => (
                <tr key={metric} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{metric}</td>
                  <td className="px-4 py-3 text-slate-400">{shows}</td>
                  <td className="px-4 py-3 text-slate-400">{alert}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Cost tracking and error rates">
        <p className="text-slate-300">
          LangSmith reads token counts from LangChain runs automatically. Break down cost by model, user, feature
          tag, or day. Pair cost charts with error-rate charts — a cheap model that fails 20% of the time is not
          a bargain.
        </p>
        <Callout variant="tip">
          Tag every trace with <code className="font-mono text-sm">environment</code>,{' '}
          <code className="font-mono text-sm">feature</code>, and{' '}
          <code className="font-mono text-sm">user_id</code> metadata. Dashboards become actionable when you can
          filter "production support bot only" instead of mixing all traffic.
        </Callout>
      </LessonSection>

      <LessonSection title="LangGraph Platform deployment — brief">
        <p className="text-slate-300">
          If you built agents with <em>LangGraph</em>, <strong className="text-white">LangGraph Platform</strong>{' '}
          deploys them as hosted APIs with built-in LangSmith tracing. One vendor for build, deploy, and observe.
        </p>
        <ContentStep number={1} title="Deploy the graph">
          <p>
            Push your LangGraph agent to LangGraph Platform. It runs as a scalable API endpoint — no custom
            infrastructure for state, checkpointing, or human-in-the-loop interrupts.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Tracing is automatic">
          <p>
            Every invocation logs to LangSmith under your project. Dashboards, online evals, and annotation queues
            work out of the box — same env vars you used in dev.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Iterate in Hub + Playground">
          <p>
            Change prompts in Prompt Hub, test in Playground, run experiments on your dataset, then update the
            pinned commit hash — all without redeploying the graph itself.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Production checklist">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li><strong className="text-white">Tracing enabled</strong> — LANGCHAIN_TRACING_V2=true on all environments.</li>
          <li><strong className="text-white">Separate projects</strong> — dev, staging, and prod traces in distinct LangSmith projects.</li>
          <li><strong className="text-white">Metadata tags</strong> — environment, feature, userId on every run.</li>
          <li><strong className="text-white">Prompts in Hub</strong> — version pinned by commit hash, not hard-coded strings.</li>
          <li><strong className="text-white">User feedback wired</strong> — thumbs up/down calls create_feedback().</li>
          <li><strong className="text-white">Online eval running</strong> — faithfulness judge on 10% production sample.</li>
          <li><strong className="text-white">Dataset exists</strong> — 20+ rows from real failures for regression tests.</li>
          <li><strong className="text-white">Dashboards reviewed weekly</strong> — cost, p95 latency, score trends.</li>
          <li><strong className="text-white">Data policy</strong> — PII scrubbing, retention limits, and access controls defined.</li>
        </ul>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Dashboards track cost, latency, errors, and evaluator scores across all production traffic.',
          'Tag traces with metadata so dashboards filter dev vs prod and by feature.',
          'LangGraph Platform deploys LangGraph agents with automatic LangSmith tracing.',
          'Use the production checklist before launching to real users.',
        ]}
      />
    </LessonArticle>
  )
}
