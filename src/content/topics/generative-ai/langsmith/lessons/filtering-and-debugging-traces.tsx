import {
  Callout,
  CodeBlock,
  ContentStep,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function FilteringAndDebuggingTraces() {
  return (
    <LessonArticle>
      <LessonSection title="Why filtering matters">
        <p className="text-slate-300">
          After a week in production you might have thousands of traces. Filtering lets you find the{' '}
          <strong className="text-white">needles</strong> — failed runs, slow requests, bad user sessions, or
          traces tagged <code className="font-mono text-sm">env:production</code>. The LangSmith UI and Python
          SDK both support rich filters.
        </p>
      </LessonSection>

      <LessonSection title="Dashboard filters — the everyday toolkit">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Filter by</th>
                <th className="px-4 py-3">Use case</th>
                <th className="px-4 py-3">How</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Error', 'Find crashes and exceptions', 'Status filter → Error, or search error message text'],
                ['Latency', 'Find slow requests', 'Sort by duration; filter runs over N seconds'],
                ['Tags', 'Environment, feature, version', 'Add tags in config: {"tags": ["prod", "v2"]}'],
                ['Metadata', 'user_id, thread_id, plan tier', 'Filter UI by metadata key=value pairs'],
                ['Feedback', 'User thumbs-down or low eval score', 'Filter by feedback key and score range'],
                ['Run type', 'Only LLM calls or only tools', 'Filter run_type: llm, tool, retriever, chain'],
              ].map(([by, use, how]) => (
                <tr key={by} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{by}</td>
                  <td className="px-4 py-3 text-slate-400">{use}</td>
                  <td className="px-4 py-3 text-slate-400">{how}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Example
          title="Add tags and metadata when invoking"
        >{`result = chain.invoke(
    {"question": "Refund policy?"},
    config={
        "tags": ["production", "support-bot"],
        "metadata": {
            "user_id": "user-42",
            "thread_id": "session-7",
            "plan": "enterprise",
        },
    },
)
# Filter dashboard: metadata.user_id = user-42
# Or tags contains production`}</Example>
      </LessonSection>

      <LessonSection title="list_runs filter DSL — programmatic access">
        <p className="text-slate-300">
          The Python SDK's <code className="font-mono text-sm">list_runs()</code> accepts a{' '}
          <code className="font-mono text-sm">filter</code> string — a small query language to search runs from
          scripts, notebooks, or CI regression checks.
        </p>
        <CodeBlock title="Filter DSL basics">{`# Syntax: field operator value
# Operators: eq, neq, gt, gte, lt, lte, has, search, and, or

eq(status, "error")                          # failed runs only
and(eq(status, "success"), gt(latency, 5))   # slow successful runs (>5s)
has(tags, "production")                      # runs tagged "production"
search("refund policy")                      # full-text search in inputs/outputs
eq(metadata_key, "user_id")                  # runs with user_id metadata`}</CodeBlock>
        <Example
          title="Query failed runs from Python"
        >{`from langsmith import Client

client = Client()

# All errors in the last 24 hours for a project
failed_runs = client.list_runs(
    project_name="support-bot-prod",
    filter='eq(status, "error")',
    limit=20,
)

for run in failed_runs:
    print(run.id, run.name, run.error)
    # Open run.id in dashboard for full trace tree`}</Example>
        <Callout variant="tip">
          Use <code className="font-mono text-sm">list_runs</code> in eval pipelines: fetch yesterday's errors,
          re-run inputs in Playground, confirm fix, ship.
        </Callout>
      </LessonSection>

      <LessonSection title="Debug workflow — find, inspect, fix">
        <Flowchart
          title="Production debugging loop"
          chart={`flowchart LR
  A[Alert or user report] --> B[Filter traces]
  B --> C[Find bad trace]
  C --> D[Inspect run tree]
  D --> E[Identify root cause]
  E --> F[Fix code or prompt]
  F --> G[Verify with new trace]`}
        />
        <ContentStep number={1} title="Find the bad trace">
          <p>
            Filter by <code className="font-mono text-sm">user_id</code>,{' '}
            <code className="font-mono text-sm">thread_id</code>, error status, or low feedback score. Narrow
            the time window to when the user reported the issue.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Inspect the run tree">
          <p>
            Open the trace. Expand children top-down: Did retrieval return wrong docs? Did the LLM get an empty
            context? Did a tool throw? Did the supervisor route to the wrong agent?
          </p>
        </ContentStep>
        <ContentStep number={3} title="Read inputs and outputs at each step">
          <p>
            Click each child run. Compare <strong className="text-white">expected vs actual</strong> at the
            step that first diverged — that is your fix target, not the final wrong answer.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Fix and verify">
          <p>
            Patch the retriever, prompt, tool, or routing logic. Re-run with the same input (Playground or
            local script). Confirm the new trace shows correct intermediate steps before deploying.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Common debugging patterns">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Bad RAG answer</strong> — filter successful runs, sort by low
            feedback; check retriever child for missing or irrelevant chunks.
          </li>
          <li>
            <strong className="text-white">Agent loop</strong> — filter by high latency; count repeated agent/tool
            node runs in LangGraph traces.
          </li>
          <li>
            <strong className="text-white">Prod-only bug</strong> — compare tags{' '}
            <code className="font-mono text-sm">production</code> vs <code className="font-mono text-sm">dev</code>{' '}
            for the same input metadata.
          </li>
          <li>
            <strong className="text-white">Regression after deploy</strong> — filter by tag{' '}
            <code className="font-mono text-sm">v2</code>, list errors with{' '}
            <code className="font-mono text-sm">list_runs(filter='eq(status, "error")')</code>.
          </li>
        </ul>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Filter by error, latency, tags, metadata, feedback, and run_type in the dashboard.',
          'Pass tags and metadata in invoke config so production traces are searchable by user and session.',
          'list_runs filter DSL (eq, gt, has, search, and, or) queries runs programmatically from Python.',
          'Debug loop: filter → open trace → inspect run tree at first bad step → fix → verify new trace.',
        ]}
      />
    </LessonArticle>
  )
}
