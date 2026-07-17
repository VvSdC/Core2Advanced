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

export function Toolqa() {
  return (
    <LessonArticle>
      <Definition term="ToolQA">
        <p>
          <strong className="text-white">ToolQA</strong> evaluates whether models can answer questions that{' '}
          <strong className="text-white">require external operations</strong> — tools — instead of relying
          only on memorized text. The question is answerable if (and often only if) the model uses tools well.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: an open-book exam where the “book” is a button panel —{' '}
          <span className="font-mono text-sm text-genai-400">search_docs</span>, calculators,{' '}
          <span className="font-mono text-sm text-genai-400">get_weather</span>-like ops — not your memory.
        </p>
      </Definition>

      <Callout variant="beginner" title="What ToolQA measures">
        Question answering that depends on tool use: retrieve or compute externally, then produce the right
        answer.
      </Callout>

      <LessonSection title="What does this benchmark measure?">
        <ContentStep number={1} title="Questions needing external ops">
          <p className="text-slate-300">
            Items are designed so pure parametric knowledge is insufficient or unreliable — you should call a
            tool to be correct.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Tool use for QA">
          <p className="text-slate-300">
            Select tools, run them (or simulate), and ground the final answer in results — e.g. look up a
            fact via <span className="font-mono text-sm text-genai-400">search_docs</span> then answer.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Answer correctness as the north star">
          <p className="text-slate-300">
            Unlike pure AST benches, the headline is often whether the{' '}
            <strong className="text-white">final answer</strong> is right after tool use.
          </p>
        </ContentStep>
        <Flowchart
          title="ToolQA loop"
          chart={`flowchart TB
  Q[Hard QA item] --> T{Need tool?}
  T -->|Yes| C[Call tool e.g. search_docs]
  C --> R[Tool result]
  R --> A[Final answer]
  T -->|Model skips wrongly| X[Likely wrong]
  A --> S[Score answer]`}
        />
      </LessonSection>

      <LessonSection title="What high and low scores mean">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">High</strong> — answers tool-necessary questions correctly by using
            tools effectively.
          </li>
          <li>
            <strong className="text-white">Low</strong> — guesses without tools, misuses tools, or fails to
            integrate results.
          </li>
          <li>
            A model might emit a <strong className="text-white">valid call</strong> (AST OK) yet still answer
            wrong — ToolQA catches that gap.
          </li>
        </ul>
        <Example title="Why tools matter (fictional)">
{`Q: "What does our packing FAQ say about liquids?"
Without search_docs: model invents a policy
With search_docs(query="packing liquids"): grounded answer`}
        </Example>
      </LessonSection>

      <LessonSection title="What ToolQA does NOT measure">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            Broad MMLU-style <strong className="text-white">closed-book knowledge</strong> as its main goal.
          </li>
          <li>
            Pure function-calling AST leaderboards (BFCL).
          </li>
          <li>
            Full retail/airline <strong className="text-white">transactional agents</strong> (τ-bench).
          </li>
          <li>
            Safety of the tools themselves.
          </li>
        </ul>
        <Callout variant="tip" title="Pairing tip">
          BFCL for call format + ToolQA for “did the answer become correct because of tools?” is a clear
          beginner duo.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'ToolQA = QA that needs external tool operations to be answered well.',
          'High = correct answers via tools; low = guessing or broken tool loops.',
          'Focuses on answer success, not only AST beauty.',
          'Does not replace BFCL schema scores or domain agent suites.',
        ]}
      />
    </LessonArticle>
  )
}
