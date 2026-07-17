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

export function Metatool() {
  return (
    <LessonArticle>
      <Definition term="MetaTool">
        <p>
          <strong className="text-white">MetaTool</strong> focuses on{' '}
          <strong className="text-white">tool decisioning</strong>:{' '}
          <em>whether</em> to use a tool at all, and <em>which</em> tool to pick when several are available —
          before deep argument-filling contests.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: a light switch panel — do you need a switch, and which one? Not yet “how hard to twist the
          dial.”
        </p>
      </Definition>

      <Callout variant="beginner" title="What MetaTool measures">
        Awareness and selection: abstain when no tool helps; choose the right tool among candidates when one
        does.
      </Callout>

      <LessonSection title="What does this benchmark measure?">
        <ContentStep number={1} title="Whether to use a tool">
          <p className="text-slate-300">
            “What is 2+2?” should not trigger <span className="font-mono text-sm text-genai-400">get_weather</span>.
            Unnecessary calls waste cost and can inject noise.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Which tool to use">
          <p className="text-slate-300">
            Given <span className="font-mono text-sm text-genai-400">get_weather</span> and{' '}
            <span className="font-mono text-sm text-genai-400">search_docs</span>, weather asks should pick the
            first; documentation asks the second.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Decisioning vs execution depth">
          <p className="text-slate-300">
            MetaTool shines on the meta-choice. Detailed AST argument trees and long agent policies are other
            benchmarks’ jobs.
          </p>
        </ContentStep>
        <Flowchart
          title="MetaTool decision sketch"
          chart={`flowchart TB
  U[User ask] --> W{Any tool helpful?}
  W -->|No| A[Abstain — answer in text]
  W -->|Yes| C{Which tool?}
  C --> T1[get_weather]
  C --> T2[search_docs]
  C --> TX[Other candidate]
  A --> S[Decision score]
  T1 --> S
  T2 --> S
  TX --> S`}
        />
      </LessonSection>

      <LessonSection title="What high and low scores mean">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">High</strong> — good when-to-call and which-to-call judgment.
          </li>
          <li>
            <strong className="text-white">Low</strong> — over-calling, under-calling, or systematic wrong-tool
            selection.
          </li>
          <li>
            A model can have <strong className="text-white">pretty JSON</strong> and still fail MetaTool by
            calling the wrong tool every time.
          </li>
        </ul>
        <Example title="Decision cases (fictional)">
{`Ask: "Capital of France?"     → abstain (no tool)
Ask: "Weather in Austin?"    → get_weather
Ask: "Find refund policy doc"→ search_docs`}
        </Example>
      </LessonSection>

      <LessonSection title="What MetaTool does NOT measure">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            Fine <strong className="text-white">AST argument</strong> matching (BFCL depth).
          </li>
          <li>
            Large-scale live API reliability (ToolBench / StableToolBench).
          </li>
          <li>
            Multi-session <strong className="text-white">domain agent</strong> success (τ-bench).
          </li>
          <li>
            Whether tool results are used truthfully in long answers (partially other suites / ToolQA).
          </li>
        </ul>
        <Callout variant="insight" title="Product link">
          Chat-with-many-tools products fail first on decisioning: wrong tool or spammy tools. MetaTool-style
          checks catch that early.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'MetaTool = whether and which tool to use (decisioning).',
          'High = smart abstain + correct selection; low = over/under/wrong calls.',
          'Does not deeply grade argument AST or domain agent policies.',
          'Pair with BFCL for “selected the right tool AND filled args correctly.”',
        ]}
      />
    </LessonArticle>
  )
}
