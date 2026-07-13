import {
  Callout,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function PuttingItTogetherLangsmith() {
  return (
    <LessonArticle>
      <LessonSection title="The full lifecycle with the LangChain stack">
        <p className="text-slate-300">
          LangSmith is not a single feature — it is the operations loop on top of everything you built with
          LangChain and LangGraph. Build, trace, evaluate, improve prompts, experiment offline, deploy, monitor
          online. Repeat every sprint.
        </p>
        <Flowchart
          title="Build → trace → evaluate → deploy"
          chart={`flowchart LR
  A[Build — LangChain / LangGraph] --> B[Enable tracing]
  B --> C[Create dataset from traces]
  C --> D[Run experiments + evaluators]
  D --> E[Improve prompts in Hub]
  E --> F[Deploy — LangGraph Platform]
  F --> G[Online eval on live traffic]
  G --> B`}
        />
      </LessonSection>

      <LessonSection title="Stage-by-stage playbook">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Stage</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">LangSmith feature</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Build', 'RAG chain or agent in LangChain/LangGraph', '—'],
                ['Trace', 'Set LANGCHAIN_TRACING_V2=true; runs appear automatically', 'Tracing & Projects'],
                ['Manage prompts', 'Publish to Prompt Hub; pin commit hash', 'Prompt Hub'],
                ['Benchmark', 'Dataset from failures; evaluate() with evaluators', 'Datasets & Experiments'],
                ['Iterate fast', 'Playground for prompt/model tweaks', 'Playground'],
                ['Collect feedback', 'Thumbs buttons → create_feedback()', 'Feedback API'],
                ['Human QA', 'Annotation queue for weekly review', 'Annotation Queues'],
                ['Monitor live', 'Online eval on 10% sample; alert on drops', 'Online Evaluations'],
                ['Operate', 'Cost, latency, error dashboards', 'Monitoring'],
                ['Deploy', 'LangGraph Platform with tracing built in', 'LangGraph Platform'],
              ].map(([stage, action, feature]) => (
                <tr key={stage} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{stage}</td>
                  <td className="px-4 py-3 text-slate-400">{action}</td>
                  <td className="px-4 py-3 text-genai-400">{feature}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Production checklist">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li><strong className="text-white">Tracing enabled</strong> — all chain and graph invocations log to LangSmith.</li>
          <li><strong className="text-white">Projects separated</strong> — dev, staging, prod in distinct projects.</li>
          <li><strong className="text-white">Prompts in Hub</strong> — versioned with commit messages; production hash pinned.</li>
          <li><strong className="text-white">Dataset exists</strong> — 20+ rows from real production failures.</li>
          <li><strong className="text-white">Experiments before promote</strong> — evaluate() new prompt vs current baseline.</li>
          <li><strong className="text-white">User feedback wired</strong> — run.feedback() on thumbs up/down.</li>
          <li><strong className="text-white">Online eval running</strong> — faithfulness judge on sampled production traffic.</li>
          <li><strong className="text-white">Annotation queue active</strong> — weekly human review of flagged traces.</li>
          <li><strong className="text-white">Dashboards reviewed</strong> — weekly check on cost, p95 latency, score trends.</li>
          <li><strong className="text-white">Data policy</strong> — PII scrubbing, retention, and access controls documented.</li>
        </ul>
      </LessonSection>

      <LessonSection title="Common mistakes">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li><strong className="text-white">Tracing only in dev</strong> — production is where the bugs are.</li>
          <li><strong className="text-white">No prompt versioning</strong> — cannot link bad answers to prompt changes.</li>
          <li><strong className="text-white">100% LLM-as-judge online</strong> — expensive; sample 10% and use code evals for hard rules.</li>
          <li><strong className="text-white">Skipping datasets</strong> — deploying Hub changes without offline benchmarks.</li>
          <li><strong className="text-white">Playground only, no experiments</strong> — informal tests miss regressions on edge cases.</li>
        </ul>
      </LessonSection>

      <Callout variant="beginner">
        You now have the full Generative AI engineering stack: fundamentals → prompting → RAG → LangChain →
        LangGraph → Agents → <strong className="text-white">LangSmith operations</strong>. Build with LangChain;
        operate, evaluate, and improve with LangSmith.
      </Callout>

      <KeyTakeaways
        items={[
          'Full loop: build → trace → dataset → experiment → Hub → deploy → online eval → repeat.',
          'LangSmith is the native ops layer for LangChain/LangGraph — tracing often needs zero code changes.',
          'Use the production checklist before launching to real users.',
          'Prompt Hub + datasets + experiments + online evals prevent silent regressions in production.',
        ]}
      />
    </LessonArticle>
  )
}
