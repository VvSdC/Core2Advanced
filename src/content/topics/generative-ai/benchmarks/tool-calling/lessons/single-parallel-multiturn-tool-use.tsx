import {
  Callout,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function SingleParallelMultiturnToolUse() {
  return (
    <LessonArticle>
      <Definition term="Tool-use modes">
        <p>
          Models do not always make one lonely call. Benchmarks test several{' '}
          <strong className="text-white">modes</strong>: a single call,{' '}
          <strong className="text-white">parallel</strong> calls in one step,{' '}
          <strong className="text-white">sequential multi-turn</strong> calls over a conversation, and{' '}
          <strong className="text-white">abstain</strong> when no tool is needed.
        </p>
      </Definition>

      <Callout variant="beginner" title="Why modes matter">
        A model that aces one-shot <span className="font-mono text-sm text-genai-400">get_weather</span> may
        still fail when it must call two tools at once or wait for results before the next step.
      </Callout>

      <LessonSection title="Four modes beginners should know">
        <ContentStep number={1} title="Single call">
          <p className="text-slate-300">
            One user question → one tool call. Example: “Weather in Austin?” →{' '}
            <span className="font-mono text-sm text-genai-400">get_weather(city=&quot;Austin&quot;)</span>.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Parallel calls">
          <p className="text-slate-300">
            Several independent tools in the <strong className="text-white">same</strong> step. Example:
            weather in Austin <em>and</em> search docs for “packing list” together — no need to wait between
            them.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Sequential multi-turn">
          <p className="text-slate-300">
            Call → get result → decide next call. Example: <span className="font-mono text-sm text-genai-400">search_docs</span>{' '}
            finds an API name, then a second call uses that name. Order matters.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Abstain (no tool)">
          <p className="text-slate-300">
            Some asks need no tool (“What is 2+2?”). Calling a tool anyway is a failure of{' '}
            <strong className="text-white">when-to-call</strong> judgment — MetaTool-style decisioning cares
            about this.
          </p>
        </ContentStep>
        <Example title="Parallel vs sequential (fictional)">
{`Parallel (independent):
  get_weather(city="Austin")
  search_docs(query="packing list")

Sequential (depends on result):
  1) search_docs(query="weather API city param")
  2) get_weather(city=<value learned from docs>)`}
        </Example>
      </LessonSection>

      <LessonSection title="Modes flowchart">
        <Flowchart
          title="Which tool-use mode is this?"
          chart={`flowchart TB
  U[User request] --> N{Need any tool?}
  N -->|No| A[Abstain — answer in text]
  N -->|Yes| I{Independent subtasks?}
  I -->|One tool| S[Single call]
  I -->|Several independent| P[Parallel calls]
  I -->|Later steps need earlier results| M[Sequential multi-turn]
  S --> R[App executes / returns results]
  P --> R
  M --> R
  R --> F[Final answer]`}
        />
      </LessonSection>

      <LessonSection title="What benchmarks usually report">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Accuracy per mode</strong> — single may look strong while multi-turn
            drops.
          </li>
          <li>
            <strong className="text-white">Irrelevance / abstain rate</strong> — not calling when no tool is
            needed.
          </li>
          <li>
            <strong className="text-white">Turn count / success</strong> — finishing a multi-step task without
            looping forever.
          </li>
        </ul>
        <Callout variant="insight" title="Product link">
          Chat-with-tools products need abstain + single + parallel. Support agents and τ-bench-style domains
          lean hard on multi-turn sequential tool use.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Modes: single, parallel, sequential multi-turn, and abstain when no tool is needed.',
          'Parallel = independent calls together; sequential = later calls depend on earlier results.',
          'Strong single-call scores do not guarantee multi-turn agent success.',
          'BFCL and agent suites often break scores down by these modes.',
        ]}
      />
    </LessonArticle>
  )
}
