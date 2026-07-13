import {
  Callout,
  ContentStep,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function AnalyticsAndDashboards() {
  return (
    <LessonArticle>
      <LessonSection title="Why dashboards matter">
        <p className="text-slate-300">
          Traces tell you what happened on one request. <strong className="text-white">Analytics</strong> tell you
          what is happening across thousands — cost spikes, latency creep, quality drops. Langfuse aggregates trace
          data into charts you can filter and share with your team.
        </p>
      </LessonSection>

      <LessonSection title="Key metrics to track">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
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
                ['Cost by user / day', 'Which customers burn the most tokens', 'Enterprise user X: $200/day'],
                ['Latency p50 / p95', 'Median and tail response times', 'p95 jumped from 2s to 8s'],
                ['Token usage', 'Input vs output tokens over time', 'Output tokens doubled — prompt too verbose?'],
                ['Score trends', 'Average faithfulness, thumbs-up rate', 'Faithfulness below 0.75 for 3 days'],
                ['Trace volume', 'Requests per hour by feature', 'Support bot traffic 5× normal'],
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

      <LessonSection title="Filter by metadata and environment">
        <ContentStep number={1} title="Environment tags">
          <p>
            Tag traces with <code className="font-mono text-sm">environment: production</code> vs{' '}
            <code className="font-mono text-sm">staging</code>. Dashboards for production only — staging experiments
            do not pollute cost charts.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Custom metadata">
          <p>
            Filter by <code className="font-mono text-sm">feature</code>, <code className="font-mono text-sm">plan</code>,{' '}
            <code className="font-mono text-sm">region</code>, or any key you pass when creating traces. Compare
            latency for "refund_bot" vs "shipping_bot".
          </p>
        </ContentStep>
        <ContentStep number={3} title="Time ranges">
          <p>
            Zoom to "last deploy window" (e.g. Tuesday 2–4pm) to correlate a spike with a release. Compare this
            week vs last week for score trends.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Practical dashboard setups">
        <div className="space-y-3">
          <div className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
            <p className="text-sm font-semibold text-white">Engineering — latency & errors</p>
            <p className="mt-1 text-sm text-slate-400">
              p50/p95 latency by span name (retrieve vs generate). Trace count and error rate. Spot slow retrieval
              or model timeouts.
            </p>
          </div>
          <div className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
            <p className="text-sm font-semibold text-white">Finance — cost attribution</p>
            <p className="mt-1 text-sm text-slate-400">
              Daily cost by model and by userId. Find features that should downgrade to mini models.
            </p>
          </div>
          <div className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
            <p className="text-sm font-semibold text-white">Product — quality scores</p>
            <p className="mt-1 text-sm text-slate-400">
              Average user-feedback and faithfulness scores over time. Did prompt v5 help or hurt?
            </p>
          </div>
        </div>
        <Callout variant="tip">
          Pass consistent metadata from day one — even <code className="font-mono text-sm">environment</code> and{' '}
          <code className="font-mono text-sm">feature</code> tags unlock most useful filters later.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Analytics aggregate traces into cost, latency, token, and score trends — not just one-off debugging.',
          'Track cost by model/user/day and latency p50/p95 to catch spikes and tail slowdowns.',
          'Filter by metadata (environment, feature, plan) to isolate production vs staging or per-product views.',
          'Build separate views for engineering (latency), finance (cost), and product (quality scores).',
        ]}
      />
    </LessonArticle>
  )
}