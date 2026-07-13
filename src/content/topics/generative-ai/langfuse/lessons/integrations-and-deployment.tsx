import {
  Callout,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function IntegrationsAndDeployment() {
  return (
    <LessonArticle>
      <LessonSection title="Framework integrations">
        <p className="text-slate-300">
          Langfuse is framework-agnostic. You do not rewrite your app — add a callback handler or wrap your client
          and traces flow automatically.
        </p>
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Integration</th>
                <th className="px-4 py-3">How to connect</th>
                <th className="px-4 py-3">What gets traced</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['LangChain', 'CallbackHandler on chains/agents', 'LLM calls, retrievers, tools, LCEL steps'],
                ['LangGraph', 'CallbackHandler on graph invoke', 'Nodes, edges, state updates, tool calls'],
                ['OpenAI SDK', 'Langfuse OpenAI wrapper or manual spans', 'Chat completions, tokens, cost'],
                ['LiteLLM', 'Langfuse callback in LiteLLM config', 'Unified tracing across 100+ model providers'],
                ['OpenTelemetry', 'OTel exporter → Langfuse', 'Existing OTel spans mapped to traces/observations'],
              ].map(([integration, how, traced]) => (
                <tr key={integration} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{integration}</td>
                  <td className="px-4 py-3 text-slate-400">{how}</td>
                  <td className="px-4 py-3 text-slate-400">{traced}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip">
          If you already completed <em>LangChain</em> and <em>LangGraph</em> lessons, start with{' '}
          <code className="font-mono text-sm">LangfuseCallbackHandler</code> — one line on your chain or graph
          invoke and you get full trace trees.
        </Callout>
      </LessonSection>

      <LessonSection title="LangChain example (conceptual)">
        <div className="rounded-xl border border-surface-600 bg-surface-900 p-4 text-sm font-mono text-slate-300">
          <div>{`from langfuse.callback import CallbackHandler`}</div>
          <div className="mt-1">{`handler = CallbackHandler()`}</div>
          <div className="mt-1">{`result = chain.invoke(`}</div>
          <div className="pl-4">{`{"question": user_query},`}</div>
          <div className="pl-4">{`config={"callbacks": [handler]},`}</div>
          <div>{`)`}</div>
        </div>
        <p className="mt-3 text-sm text-slate-400">
          Every LLM call, retrieval, and tool step in the chain appears as nested observations in Langfuse.
        </p>
      </LessonSection>

      <LessonSection title="Cloud vs self-hosted">
        <Flowchart
          title="Deployment options"
          chart={`flowchart TB
  A[Langfuse] --> B[Cloud — langfuse.com]
  A --> C[Self-host — Docker]
  B --> D[Fast setup, managed updates]
  C --> E[Full data control, air-gapped OK]
  B --> F[EU/US region choice]
  C --> G[Your VPC, your Postgres + ClickHouse]`}
        />
        <div className="mt-4 space-y-3">
          <div className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
            <p className="text-sm font-semibold text-white">Langfuse Cloud</p>
            <p className="mt-1 text-sm text-slate-400">
              Sign up, get API keys, instrument your app. Best for startups and teams that want zero ops. Free tier
              available; paid plans for volume and SSO.
            </p>
          </div>
          <div className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
            <p className="text-sm font-semibold text-white">Self-host with Docker</p>
            <p className="mt-1 text-sm text-slate-400">
              Run Langfuse on your infrastructure via Docker Compose or Kubernetes. All trace data stays in your
              database. Required for strict compliance, healthcare, or finance environments.
            </p>
          </div>
        </div>
      </LessonSection>

      <LessonSection title="Data privacy considerations">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li><strong className="text-white">Prompts and completions</strong> are stored in Langfuse — scrub PII before tracing or use self-host.</li>
          <li><strong className="text-white">Sampling</strong> — trace 10% of traffic if full capture is too sensitive or costly.</li>
          <li><strong className="text-white">Retention</strong> — configure how long traces are kept; delete old data on schedule.</li>
          <li><strong className="text-white">EU hosting</strong> — Langfuse Cloud offers EU data residency for GDPR workloads.</li>
        </ul>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Integrations: LangChain, LangGraph, OpenAI SDK, LiteLLM, OpenTelemetry — mostly one callback handler.',
          'Langfuse Cloud for fast setup; self-host Docker for full data control and compliance.',
          'Traces contain prompts and outputs — consider PII scrubbing, sampling, and retention policies.',
          'Start with LangfuseCallbackHandler on your existing LangChain/LangGraph app — minimal code change.',
        ]}
      />
    </LessonArticle>
  )
}