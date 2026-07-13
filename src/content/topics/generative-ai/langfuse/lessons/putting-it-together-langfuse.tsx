import {
  Callout,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function PuttingItTogetherLangfuse() {
  return (
    <LessonArticle>
      <LessonSection title="The full lifecycle">
        <p className="text-slate-300">
          Langfuse is not a single feature — it is a loop. Build your app, trace production traffic, score
          quality, evaluate automatically, improve prompts, experiment offline, deploy with confidence. Repeat
          every sprint.
        </p>
        <Flowchart
          title="Build → trace → improve → deploy"
          chart={`flowchart LR
  A[Build with LangChain] --> B[Trace with Langfuse]
  B --> C[Score: user + judge]
  C --> D[Eval: faithfulness trends]
  D --> E[Improve prompt in UI]
  E --> F[Experiment on dataset]
  F --> G[Deploy label to production]
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
                <th className="px-4 py-3">Langfuse feature</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Build', 'RAG chain or agent in LangChain/LangGraph', '—'],
                ['Instrument', 'Add CallbackHandler + metadata tags', 'Tracing'],
                ['Manage prompts', 'Move templates to UI, label staging', 'Prompt Management'],
                ['Collect feedback', 'Thumbs buttons → langfuse.score()', 'Scores & Feedback'],
                ['Automate quality', 'Faithfulness judge on 10% sample', 'LLM-as-Judge Evaluators'],
                ['Benchmark', 'Dataset from failures, run experiments', 'Datasets & Experiments'],
                ['Monitor', 'Cost, latency, score dashboards', 'Analytics'],
                ['Debug', 'Support ticket → trace → Playground', 'Playground'],
                ['Deploy', 'Flip production label after experiment passes', 'Prompt labels'],
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
          <li><strong className="text-white">Tracing enabled</strong> — CallbackHandler on all chain/graph invocations.</li>
          <li><strong className="text-white">Metadata tags</strong> — environment, feature, userId on every trace.</li>
          <li><strong className="text-white">Prompts in Langfuse</strong> — not hard-coded; production label pinned.</li>
          <li><strong className="text-white">User feedback wired</strong> — thumbs up/down calls langfuse.score().</li>
          <li><strong className="text-white">Automated eval</strong> — at least faithfulness judge on a sample.</li>
          <li><strong className="text-white">Dataset exists</strong> — 20+ rows from real failures for regression tests.</li>
          <li><strong className="text-white">Dashboards reviewed</strong> — weekly check on cost, p95 latency, score trends.</li>
          <li><strong className="text-white">Experiment before promote</strong> — never flip production label without offline run.</li>
          <li><strong className="text-white">Data policy</strong> — PII scrubbing, retention, cloud vs self-host decided.</li>
        </ul>
      </LessonSection>

      <LessonSection title="Common mistakes">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li><strong className="text-white">Tracing only in dev</strong> — production is where the bugs are.</li>
          <li><strong className="text-white">No prompt versioning</strong> — cannot link bad answers to prompt changes.</li>
          <li><strong className="text-white">100% LLM-as-judge</strong> — expensive; sample 10% and use code evals for hard rules.</li>
          <li><strong className="text-white">Skipping datasets</strong> — deploying prompt changes without offline benchmarks.</li>
          <li><strong className="text-white">Ignoring metadata</strong> — cannot filter staging noise from production metrics.</li>
        </ul>
      </LessonSection>

      <Callout variant="beginner">
        You now have the full Generative AI engineering stack: fundamentals → prompting → RAG → LangChain →
        LangGraph → Agents → <strong className="text-white">Langfuse operations</strong>. Build with frameworks;
        operate and improve with Langfuse.
      </Callout>

      <KeyTakeaways
        items={[
          'Full loop: build (LangChain) → trace → score → eval → improve prompt → experiment → deploy.',
          'Use the production checklist before launching to real users.',
          'Prompt labels + datasets + experiments prevent silent regressions.',
          'Langfuse is the operations layer on top of everything you built in prior lessons.',
        ]}
      />
    </LessonArticle>
  )
}