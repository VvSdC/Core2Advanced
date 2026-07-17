import {
  Callout,
  CodeBlock,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function ChoosingAToolCallingSuite() {
  return (
    <LessonArticle>
      <Definition term="Tool-calling suite">
        <p>
          A <strong className="text-white">tool-calling suite</strong> is a small, deliberate set of
          benchmarks you run together so you see structured call quality, API-scale skill, and (when needed)
          agentic domain success — not a single vanity metric.
        </p>
      </Definition>

      <Callout variant="beginner" title="Minimal suite for beginners">
        Start with <span className="text-genai-400">BFCL</span> + one agentic (
        <span className="text-genai-400">τ-bench</span>) + one API-scale (
        <span className="text-genai-400">StableToolBench</span> or ToolBench).
      </Callout>

      <LessonSection title="Decision flowchart by product">
        <Flowchart
          title="Choose suites from the product"
          chart={`flowchart TB
  P[What are you shipping?] --> C{Chat with a few tools?}
  C -->|Yes| BFCL[BFCL]
  BFCL --> MT[Add MetaTool if over-calling]
  P --> API{API agent / many OpenAPI tools?}
  API -->|Yes| STB[StableToolBench or ToolBench]
  STB --> GOR[Add Gorilla if doc-grounded]
  P --> CS{Customer support agent?}
  CS -->|Yes| TAU[τ-bench]
  TAU --> BFCL2[Also BFCL for call format]
  P --> QA{Answers need external ops?}
  QA -->|Yes| TQA[Add ToolQA]
  P --> DBG{Debugging agent steps?}
  DBG -->|Yes| TE[Add T-Eval / API-Bank]
  MT --> PRIV[Always: private tool pack]
  GOR --> PRIV
  BFCL2 --> PRIV
  TQA --> PRIV
  TE --> PRIV`}
        />
      </LessonSection>

      <LessonSection title="Three product packs">
        <ContentStep number={1} title="Chat with tools">
          <p className="text-slate-300">
            Users ask free-form questions; a small tool list like{' '}
            <span className="font-mono text-sm text-genai-400">get_weather</span> /{' '}
            <span className="font-mono text-sm text-genai-400">search_docs</span> is available. Prioritize BFCL
            (+ MetaTool if the bot calls tools too often).
          </p>
        </ContentStep>
        <ContentStep number={2} title="API agent">
          <p className="text-slate-300">
            The product’s job is to navigate many endpoints. Prioritize StableToolBench/ToolBench and Gorilla
            when docs retrieval is central.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Customer support agent">
          <p className="text-slate-300">
            Multi-turn goals with policies (orders, bookings). Prioritize τ-bench; keep BFCL so argument
            formatting does not silently rot.
          </p>
        </ContentStep>
        <CodeBlock title="Beginner suite (mental checklist)">{`minimal_tool_calling = [
  "BFCL",                 # schema / AST / live / multi-turn
  "tau-bench",            # agentic domain success
  "StableToolBench|ToolBench",  # API-scale
]

add_if_chat_overcalls = ["MetaTool"]
add_if_doc_rag_apis = ["Gorilla APIBench"]
add_if_tool_qa = ["ToolQA"]`}
        </CodeBlock>
      </LessonSection>

      <LessonSection title="When to expand">
        <div className="mt-2 space-y-3">
          {[
            ['MetaTool', 'Users complain the bot invents unnecessary tool calls.'],
            ['ToolQA', 'Correctness depends on external lookup/compute.'],
            ['Gorilla APIBench', 'Calls must stay faithful to retrieved docs.'],
            ['API-Bank / T-Eval', 'You need stage-level debugging, not one headline.'],
            ['ToolAlpaca', 'You want a cheap generalization smoke test after fine-tuning.'],
          ].map(([label, text]) => (
            <div key={label} className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
              <p className="text-sm font-semibold text-white">{label}</p>
              <p className="mt-1 text-sm text-slate-400">{text}</p>
            </div>
          ))}
        </div>
        <Example title="Example packs">
{`Chat + 5 tools:
  BFCL + MetaTool + private tool pack

OpenAPI agent:
  BFCL + StableToolBench + Gorilla + private APIs

Support agent (retail-like):
  BFCL + τ-bench + private policy scenarios`}
        </Example>
      </LessonSection>

      <LessonSection title="Lock the protocol">
        <p className="text-slate-300">
          Tool scores move when you change tool lists, system prompts, temperature, retrievers, or simulators.
          Document the harness the same way you would for HumanEval.
        </p>
        <Callout variant="insight" title="Product first">
          Choose suites from interaction shape (chat tools vs API agent vs support agent), not from whichever
          paper trended this week.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Beginner suite: BFCL + τ-bench + StableToolBench/ToolBench.',
          'Chat → MetaTool; API agent → Gorilla/ToolBench; support → τ-bench.',
          'Use the flowchart: product shape → suites → always a private tool pack.',
          'Lock tool lists and protocols before comparing models.',
        ]}
      />
    </LessonArticle>
  )
}
