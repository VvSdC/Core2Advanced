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

export function TauBench() {
  return (
    <LessonArticle>
      <Definition term="τ-bench / Tau-Bench">
        <p>
          <strong className="text-white">τ-bench</strong> (often written{' '}
          <strong className="text-white">Tau-Bench</strong>) evaluates{' '}
          <strong className="text-white">agentic tool use in realistic domains</strong> — classic flavors
          include <strong className="text-white">retail</strong> and <strong className="text-white">airline</strong>{' '}
          style customer workflows with policies, databases, and multi-turn dialogue.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: not “call <span className="font-mono text-sm text-genai-400">get_weather</span> once,” but
          “help a customer change a booking without breaking the rules.”
        </p>
      </Definition>

      <Callout variant="beginner" title="What τ-bench measures">
        Whether an agent can use domain tools across a conversation to complete user goals while respecting
        domain rules — success is task completion, not pretty JSON alone.
      </Callout>

      <LessonSection title="What does this benchmark measure?">
        <ContentStep number={1} title="Realistic domain tools">
          <p className="text-slate-300">
            Agents act through tools that look like business systems (orders, flights, customers) — richer
            than a single weather toy.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Multi-turn agentic dialogue">
          <p className="text-slate-300">
            Users clarify, change minds, or add constraints. The agent must call tools over many turns.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Policy-aware success">
          <p className="text-slate-300">
            Completing the goal the wrong way (violating a refund rule) can count as failure even if tools
            “ran.”
          </p>
        </ContentStep>
        <Flowchart
          title="τ-bench style episode"
          chart={`flowchart TB
  U[User goal in domain] --> A[Agent]
  A --> T[Domain tools]
  T --> DB[Simulated DB / state]
  DB --> A
  A --> U
  U --> D{Goal done + policy OK?}
  D -->|Yes| P[Pass]
  D -->|No| F[Fail]`}
        />
      </LessonSection>

      <LessonSection title="What high and low scores mean">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">High</strong> — finishes more domain tasks correctly under the
            rules.
          </li>
          <li>
            <strong className="text-white">Low</strong> — gets stuck, wrong tool sequences, or policy
            violations.
          </li>
          <li>
            Scores are closer to <strong className="text-white">product agent success rate</strong> than to
            raw AST accuracy.
          </li>
        </ul>
        <Example title="Tiny fictional parallel">
{`Retail-like: cancel order #123 if within policy window
  → look up order tool → check policy → cancel tool

Not the same as:
  get_weather(city="Austin") once and stop`}
        </Example>
      </LessonSection>

      <LessonSection title="What τ-bench does NOT measure">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            Broad closed-book exams (MMLU) or pure coding suites.
          </li>
          <li>
            Maximum diversity of random public APIs (ToolBench scale).
          </li>
          <li>
            Lightweight AST-only function calling (BFCL’s narrowest splits) as its only signal.
          </li>
          <li>
            General chat safety / jailbreaks.
          </li>
        </ul>
        <Callout variant="tip" title="Starter suite role">
          Pair BFCL (call correctness) + τ-bench (agentic domain success) + StableToolBench/ToolBench
          (API-scale) for a balanced beginner suite.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'τ-bench = agentic tool use in realistic domains (retail/airline style).',
          'High = task success under policy; low = stuck or rule-breaking trajectories.',
          'Multi-turn + tools + state — closer to support agents than toy single calls.',
          'Complements BFCL; does not measure MMLU or ToolBench-scale API breadth alone.',
        ]}
      />
    </LessonArticle>
  )
}
