import {
  Callout,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function IntroductionToLangsmith() {
  return (
    <LessonArticle>
      <Definition term="LangSmith">
        <p>
          <strong className="text-white">LangSmith</strong> is LangChain's platform for{' '}
          <strong className="text-white">tracing, evaluating, and monitoring</strong> LLM applications.
          Built by the same team behind LangChain and LangGraph, it is the native observability layer —
          often enabled with a single environment variable for LangChain apps.
        </p>
      </Definition>

      <LessonSection title="Why LangSmith exists">
        <p className="text-slate-300">
          You learned to build with <em>LangChain</em> and <em>LangGraph</em>. LangSmith answers the next
          question: <strong className="text-white">"Is my chain/agent actually working in production?"</strong>{' '}
          It records every run — prompts, tool calls, retrievals, token usage, latency, and errors — in a
          visual trace tree you can inspect, score, and improve.
        </p>
        <Callout variant="insight">
          LangChain builds the app. LangSmith operates it. If you are all-in on LangChain/LangGraph, LangSmith
          is the lowest-friction observability choice — tracing often works with zero code changes.
        </Callout>
      </LessonSection>

      <LessonSection title="Six capabilities — the full agent engineering loop">
        <Flowchart
          title="LangSmith platform map"
          chart={`flowchart LR
  Build[Build — LangChain / LangGraph] --> Trace[Trace — every run logged]
  Trace --> Debug[Debug — trace tree UI]
  Debug --> Eval[Evaluate — datasets + evaluators]
  Eval --> Prompt[Prompt Hub — version prompts]
  Prompt --> Monitor[Monitor — online evals]
  Monitor --> Deploy[Deploy — production confidence]`}
        />
        <div className="mt-4 overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Capability</th>
                <th className="px-4 py-3">What it does</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Tracing', 'Automatic run trees for LangChain chains, LangGraph agents, and @traceable functions'],
                ['Projects', 'Organise traces by app, environment, or team — dev vs prod'],
                ['Datasets & Experiments', 'Offline test sets; compare prompt/model versions before deploy'],
                ['Evaluators', 'LLM-as-judge, heuristics, human annotation — 30+ templates'],
                ['Prompt Hub', 'Central prompt store with version history — pull into LangChain code'],
                ['Online evaluation', 'Score production traffic automatically — catch quality drift early'],
                ['Playground', 'Test prompts against datasets without deploying code changes'],
              ].map(([cap, does]) => (
                <tr key={cap} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{cap}</td>
                  <td className="px-4 py-3 text-slate-400">{does}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="When LangSmith is the right choice">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li><strong className="text-white">You use LangChain or LangGraph</strong> — tracing is nearly automatic.</li>
          <li><strong className="text-white">You want one vendor</strong> for build (LangChain) + observe (LangSmith) + deploy (LangGraph Platform).</li>
          <li><strong className="text-white">You need evaluation built in</strong> — datasets, experiments, and evaluator templates are first-class.</li>
          <li><strong className="text-white">Consider Langfuse instead</strong> if you need open-source self-hosting or a framework-agnostic stack — see the comparison lesson.</li>
        </ul>
      </LessonSection>

      <Callout variant="beginner" title="Read this after">
        Complete <em>LangChain</em> and <em>LangGraph</em> first. Also helpful: <em>RAG → Evaluating RAG</em> and
        the <em>Langfuse</em> sub-topic for comparison. LangSmith and Langfuse solve similar problems — this
        sub-topic goes deep on the LangChain-native path.
      </Callout>

      <KeyTakeaways
        items={[
          'LangSmith = LangChain team\'s tracing, evaluation, and monitoring platform.',
          'Near-zero setup for LangChain/LangGraph apps — set env vars and runs appear automatically.',
          'Full loop: trace → debug → evaluate offline → monitor online → improve prompts via Hub.',
          'Best when your stack is LangChain/LangGraph; compare with Langfuse for open-source needs.',
        ]}
      />
    </LessonArticle>
  )
}
