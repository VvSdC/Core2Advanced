import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function LangsmithDataModel() {
  return (
    <LessonArticle>
      <LessonSection title="Four concepts — learn these once">
        <p className="text-slate-300">
          LangSmith organises observability data into a simple hierarchy. Think of it like folders and files:
          a <strong className="text-white">project</strong> holds many{' '}
          <strong className="text-white">traces</strong>, each trace is one user request, and inside each trace
          are <strong className="text-white">runs</strong> — the individual steps (LLM call, retriever, tool).
          You can attach <strong className="text-white">feedback scores</strong> to rate quality.
        </p>
        <Flowchart
          title="LangSmith data hierarchy"
          chart={`flowchart TB
  P[Project — e.g. support-bot-prod]
  P --> T1[Trace — one user request]
  P --> T2[Trace — another request]
  T1 --> R1[Run: chain root]
  R1 --> R2[Child run: retriever]
  R1 --> R3[Child run: ChatOpenAI]
  R3 --> R4[Child run: tool_call]
  T1 --> F[Feedback score — thumbs up / eval]`}
        />
      </LessonSection>

      <Definition term="Project">
        <p>
          A <strong className="text-white">project</strong> is a workspace boundary — one app, one environment,
          or one team. Set <code className="font-mono text-sm">LANGSMITH_PROJECT=my-app</code> so traces land in
          the right bucket. Keep dev, staging, and prod in separate projects.
        </p>
      </Definition>

      <Definition term="Trace">
        <p>
          A <strong className="text-white">trace</strong> represents one end-to-end execution — one chat turn,
          one API call, one agent run. It is the top-level container you click in the UI. All runs for that
          request nest under it as a tree.
        </p>
      </Definition>

      <Definition term="Run">
        <p>
          A <strong className="text-white">run</strong> is a single unit of work: an LLM call, a retriever query,
          a tool invocation, or a chain step. Runs have a <code className="font-mono text-sm">run_type</code>{' '}
          (e.g. <code className="font-mono text-sm">llm</code>, <code className="font-mono text-sm">retriever</code>,{' '}
          <code className="font-mono text-sm">tool</code>, <code className="font-mono text-sm">chain</code>) plus
          inputs, outputs, token counts, latency, and status.
        </p>
      </Definition>

      <LessonSection title="Child runs — the trace tree">
        <p className="text-slate-300">
          When a chain calls an LLM, which calls a tool, LangSmith records each hop as a{' '}
          <strong className="text-white">child run</strong> under its parent. The UI shows this as an expandable
          tree — exactly what you need to answer "which step failed?" or "which retrieval returned bad chunks?"
        </p>
        <ContentStep number={1} title="Parent run = outer wrapper">
          <p>
            A RAG chain's root run might be <code className="font-mono text-sm">run_type: chain</code>. Its
            children are the retriever run and the LLM run.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Child runs nest arbitrarily deep">
          <p>
            An agent might have: chain → LLM (plans tool) → tool run → LLM (final answer). Each level is a
            child run with its own timing and I/O.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Same run, different views">
          <p>
            The Runs list shows flat rows; the Trace view shows the tree. Use the tree for debugging, the list
            for filtering across thousands of runs.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Feedback scores">
        <p className="text-slate-300">
          A <strong className="text-white">feedback score</strong> attaches a quality rating to a run or trace:
          user thumbs up/down, human reviewer label, or automated evaluator result (e.g. faithfulness = 0.85).
          Scores power filtering, regression detection, and experiment comparisons.
        </p>
        <div className="mt-3 space-y-2 text-sm text-slate-400">
          <p>
            <strong className="text-white">Key</strong> — what you measured (e.g.{' '}
            <code className="font-mono text-sm">user_feedback</code>,{' '}
            <code className="font-mono text-sm">correctness</code>)
          </p>
          <p>
            <strong className="text-white">Score</strong> — numeric (0–1), boolean (true/false), or categorical
          </p>
          <p>
            <strong className="text-white">Comment</strong> — optional free-text explanation from reviewer or
            evaluator
          </p>
        </div>
      </LessonSection>

      <LessonSection title="LangSmith vs Langfuse — model mapping">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">LangSmith</th>
                <th className="px-4 py-3">Langfuse equivalent</th>
                <th className="px-4 py-3">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Project', 'Project', 'Same idea — workspace boundary'],
                ['Trace', 'Trace', 'One end-to-end user request'],
                ['Run', 'Observation (span or generation)', 'LangSmith uses "run" for all step types; Langfuse splits LLM calls as "generations"'],
                ['Child run', 'Nested observation', 'Both support arbitrary nesting'],
                ['Feedback score', 'Score', 'Attached to runs/traces for quality tracking'],
                ['Metadata / tags', 'Metadata / tags', 'Custom key-value filters on any run'],
              ].map(([smith, fuse, notes]) => (
                <tr key={smith} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{smith}</td>
                  <td className="px-4 py-3 text-slate-400">{fuse}</td>
                  <td className="px-4 py-3 text-slate-400">{notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="insight">
          If you know Langfuse's trace → observation model, LangSmith's trace → run tree is the same mental
          picture with different names. "Run" in LangSmith ≈ "observation" in Langfuse.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Project = workspace. Trace = one user request. Run = one step inside that request.',
          'Child runs form the trace tree — parent chain contains child LLM, retriever, and tool runs.',
          'Feedback scores attach quality ratings (human or automated) to runs for filtering and evals.',
          'LangSmith "run" maps to Langfuse "observation"; both nest steps in a trace tree.',
        ]}
      />
    </LessonArticle>
  )
}
