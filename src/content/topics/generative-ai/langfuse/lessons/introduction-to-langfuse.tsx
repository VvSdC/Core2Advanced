import {
  Callout,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function IntroductionToLangfuse() {
  return (
    <LessonArticle>
      <Definition term="Langfuse">
        <p>
          <strong className="text-white">Langfuse</strong> is an open-source AI engineering platform for{' '}
          <strong className="text-white">observing, debugging, and improving</strong> LLM applications in
          production. It records every step of your RAG pipeline or agent workflow — LLM calls, retrievals,
          tool invocations, costs, and latencies — so you can see what actually happened instead of guessing.
        </p>
      </Definition>

      <LessonSection title="Why Langfuse is required after you build">
        <p className="text-slate-300">
          By the time you finish <em>RAG</em>, <em>LangChain</em>, <em>LangGraph</em>, and <em>Agents</em>, you
          can build working AI apps. But building is only half the job. In production, users report wrong answers,
          costs spike overnight, and latency creeps up — and you have no idea which step failed.
        </p>
        <div className="mt-4 space-y-3">
          {[
            ['Without Langfuse', 'User: "The bot gave a wrong refund answer." You: open logs, see a 200 OK, have no idea which chunk was retrieved or what prompt was sent.'],
            ['With Langfuse', 'Open the trace: see retrieval returned 3 chunks (wrong one ranked first), prompt version v4, GPT-4o at temperature 0.7. Fix retrieval k or prompt in 10 minutes.'],
          ].map(([label, scenario]) => (
            <div key={label} className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
              <p className="text-sm font-semibold text-white">{label}</p>
              <p className="mt-1 text-sm text-slate-400">{scenario}</p>
            </div>
          ))}
        </div>
        <Callout variant="insight">
          Langfuse is not another framework to build apps — it is the <em>operations layer</em> on top of
          LangChain/LangGraph. You build with LangChain; you monitor, evaluate, and improve with Langfuse.
        </Callout>
      </LessonSection>

      <LessonSection title="The full Langfuse platform — six capabilities">
        <Flowchart
          title="Langfuse feature map"
          chart={`flowchart TB
  A[Your LLM App] --> B[Tracing / Observability]
  A --> C[Prompt Management]
  A --> D[Evaluation]
  A --> E[Datasets & Experiments]
  B --> F[Analytics Dashboards]
  B --> G[Playground]
  D --> H[Scores & Feedback]`}
        />
        <div className="mt-4 overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Capability</th>
                <th className="px-4 py-3">What it solves</th>
                <th className="px-4 py-3">Lesson</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Tracing & Observability', 'See every LLM call, retrieval, and tool step in a tree', 'Tracing lessons'],
                ['Prompt Management', 'Version prompts in UI, deploy labels, link to traces', 'Prompt Management'],
                ['Scores & Feedback', 'Rate answers — human, user thumbs, automated', 'Scores & Feedback'],
                ['LLM-as-a-Judge', 'Automated quality scoring on production traces', 'LLM-as-a-Judge Evaluators'],
                ['Datasets & Experiments', 'Offline test sets, compare prompt/model versions', 'Datasets & Experiments'],
                ['Analytics & Playground', 'Cost/latency dashboards; debug traces in playground', 'Analytics / Playground'],
              ].map(([cap, solves, lesson]) => (
                <tr key={cap} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{cap}</td>
                  <td className="px-4 py-3 text-slate-400">{solves}</td>
                  <td className="px-4 py-3 text-genai-400">{lesson}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Langfuse vs LangSmith vs plain logging">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Tool</th>
                <th className="px-4 py-3">Best for</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Langfuse', 'Open-source, self-hostable, full stack (tracing + prompts + evals + datasets). Framework-agnostic.'],
                ['LangSmith', 'LangChain-native tracing and evals. Best if you are 100% LangChain/LangGraph.'],
                ['print() / logging', 'Prototyping only. No trace trees, no cost tracking, no prompt versioning.'],
              ].map(([tool, best]) => (
                <tr key={tool} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{tool}</td>
                  <td className="px-4 py-3 text-slate-400">{best}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <Callout variant="beginner" title="Read this after">
        Complete <em>LangChain</em> and at least <em>RAG → Evaluating RAG</em>. Langfuse assumes you have a
        working LLM app to instrument. Agents and LangGraph lessons help for multi-step tracing.
      </Callout>

      <KeyTakeaways
        items={[
          'Langfuse = observe, debug, and improve LLM apps in production — not build them.',
          'Required because LLM apps are non-deterministic black boxes without structured tracing.',
          'Six pillars: tracing, prompt management, scores, LLM-as-judge evals, datasets/experiments, analytics.',
          'Open-source and self-hostable — works with LangChain, LangGraph, OpenAI SDK, OpenTelemetry.',
        ]}
      />
    </LessonArticle>
  )
}
