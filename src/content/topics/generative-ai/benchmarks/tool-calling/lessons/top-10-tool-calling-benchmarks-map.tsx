import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function Top10ToolCallingBenchmarksMap() {
  return (
    <LessonArticle>
      <Definition term="Top 10 tool-calling benchmarks map">
        <p>
          Tool calling is not one score. This lesson is your{' '}
          <strong className="text-white">cheat sheet</strong> for the ten most-used tool-calling benchmarks —
          focus (schema / API / agent / QA), single vs multi-turn, and a starter suite you can actually run.
        </p>
      </Definition>

      <Callout variant="beginner" title="If you only remember one rule…">
        Match the benchmark to the <span className="text-genai-400">failure you fear</span>. AST accuracy ≠
        API-scale skill ≠ domain agent success. One green number never means “tools are solved.”
      </Callout>

      <LessonSection title="Master table — top 10">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-3 py-3">Benchmark</th>
                <th className="px-3 py-3">Focus</th>
                <th className="px-3 py-3">Turns</th>
                <th className="px-3 py-3">High / good means</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['BFCL', 'Schema / AST + live', 'Single + multi', 'Correct structured calls'],
                ['ToolBench', 'API-scale / ToolLLM', 'Often multi-step', 'Works across many APIs'],
                ['API-Bank', 'Plan + retrieve + call', 'Task levels', 'Strong on each stage'],
                ['Gorilla APIBench', 'API + docs', 'Mostly single', 'Doc-faithful API calls'],
                ['ToolAlpaca', 'Imitation / generalize', 'Mostly short', 'Transfers tool patterns'],
                ['T-Eval', 'Step-wise agent', 'Multi-step', 'Good scores per step'],
                ['MetaTool', 'Whether / which tool', 'Decision', 'Smart abstain + select'],
                ['ToolQA', 'QA needing tools', 'Tool loop', 'Correct answers via tools'],
                ['StableToolBench', 'Stable API-scale', 'Multi-step', 'Reproducible ToolBench skill'],
                ['τ-bench', 'Domain agent', 'Multi-turn', 'Task success under policy'],
              ].map(([bench, focus, turns, good]) => (
                <tr key={bench} className="hover:bg-surface-800/50">
                  <td className="px-3 py-3 font-semibold text-white">{bench}</td>
                  <td className="px-3 py-3 text-genai-400">{focus}</td>
                  <td className="px-3 py-3">{turns}</td>
                  <td className="px-3 py-3">{good}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Focus axes at a glance">
        <Flowchart
          title="Pick a focus, then a suite"
          chart={`flowchart TB
  START[What failure worries you?] --> SCH[Wrong JSON / wrong args]
  START --> API[Many unfamiliar APIs]
  START --> DEC[Wrong tool or over-calling]
  START --> QA[Answers need external ops]
  START --> AG[Support-style domain agent]
  SCH --> BFCL[BFCL]
  API --> TB[ToolBench / StableToolBench]
  API --> GOR[Gorilla APIBench]
  DEC --> MT[MetaTool]
  QA --> TQA[ToolQA]
  AG --> TAU[τ-bench]
  START --> STEP[Debug agent steps]
  STEP --> TE[T-Eval / API-Bank]
  START --> LIGHT[Lightweight generalize]
  LIGHT --> TA[ToolAlpaca]`}
        />
        <ContentStep number={1} title="Schema column">
          <p className="text-slate-300">
            <span className="text-genai-400">BFCL</span> is the default for structured call correctness (AST
            + live + multi-turn splits).
          </p>
        </ContentStep>
        <ContentStep number={2} title="API column">
          <p className="text-slate-300">
            ToolBench / StableToolBench / Gorilla stress large or doc-grounded API calling.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Agent / QA column">
          <p className="text-slate-300">
            τ-bench for domain agents; ToolQA for tool-necessary QA; T-Eval / API-Bank / MetaTool for
            decision and step diagnosis.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Starter suite recommendation">
        <p className="text-slate-300">
          Beginners can start with three pillars, then expand:
        </p>
        <div className="mt-4 space-y-3">
          {[
            ['1. BFCL', 'De facto standard: schema/AST, live, multi-turn call quality.'],
            ['2. One agentic — τ-bench', 'Realistic multi-turn domain success (retail/airline style).'],
            ['3. One API-scale — ToolBench or StableToolBench', 'Prefer StableToolBench when you need quieter regressions.'],
          ].map(([label, text]) => (
            <div key={label} className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
              <p className="text-sm font-semibold text-white">{label}</p>
              <p className="mt-1 text-sm text-slate-400">{text}</p>
            </div>
          ))}
        </div>
        <Callout variant="tip" title="Add when relevant">
          Add MetaTool for over-calling, ToolQA for tool-grounded QA, Gorilla when docs retrieval is core,
          API-Bank/T-Eval when debugging stages, ToolAlpaca for lightweight generalization checks.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Top 10 cover schema, API-scale, decisioning, QA-with-tools, and domain agents.',
          'Read focus + turn shape before comparing headline numbers.',
          'Starter suite: BFCL + τ-bench + ToolBench/StableToolBench.',
          'Never treat one tool benchmark as a full product certificate.',
        ]}
      />
    </LessonArticle>
  )
}
