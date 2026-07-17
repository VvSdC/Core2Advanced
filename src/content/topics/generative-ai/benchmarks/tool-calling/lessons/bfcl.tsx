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

export function Bfcl() {
  return (
    <LessonArticle>
      <Definition term="BFCL — Berkeley Function Calling Leaderboard">
        <p>
          <strong className="text-white">BFCL</strong> is the de facto standard leaderboard for{' '}
          <strong className="text-white">function / tool calling</strong>. It covers{' '}
          <strong className="text-white">AST matching</strong>, <strong className="text-white">live</strong>{' '}
          execution-style checks, and <strong className="text-white">multi-turn</strong> tool use so labs can
          compare models fairly.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: a driver’s license test with a written (AST), on-road (live), and multi-intersection
          (multi-turn) section — not just one parking attempt.
        </p>
      </Definition>

      <Callout variant="beginner" title="What BFCL measures">
        Whether the model emits the right structured tool call(s) — correct tool, arguments, and (in harder
        splits) sequencing across turns — under a shared protocol.
      </Callout>

      <LessonSection title="What does this benchmark measure?">
        <ContentStep number={1} title="AST accuracy">
          <p className="text-slate-300">
            Compare the model’s call tree to a gold call. Example gold:{' '}
            <span className="font-mono text-sm text-genai-400">get_weather(city=&quot;Austin&quot;)</span>. Wrong
            city or wrong tool name fails.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Live / execution-oriented splits">
          <p className="text-slate-300">
            Some items check whether calls work in a live or executable setting — closer to product reality
            than tree match alone.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Multi-turn tool use">
          <p className="text-slate-300">
            Later turns may depend on earlier tool results (search docs, then call another tool). Single-shot
            luck is not enough.
          </p>
        </ContentStep>
        <Flowchart
          title="BFCL-style pipeline (conceptual)"
          chart={`flowchart TB
  P[Prompt + tool list] --> M[Model emits call]
  M --> A{AST match?}
  A -->|Fail| F[Score 0 on item]
  A -->|Pass / live path| L[Optional live check]
  L --> S[Aggregate accuracy by split]`}
        />
      </LessonSection>

      <LessonSection title="What high and low scores mean">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">High</strong> — reliable tool selection and argument filling on that
            split (AST and/or live).
          </li>
          <li>
            <strong className="text-white">Low</strong> — frequent wrong tools, bad args, broken structure, or
            failed multi-turn plans.
          </li>
          <li>
            Always read the <strong className="text-white">split name</strong> (AST vs live vs multi-turn). One
            headline number can hide a weak mode.
          </li>
        </ul>
        <Example title="Reporting style (fictional tools)">
{`Split: AST simple
Gold: get_weather(city="Austin")
Model: get_weather(city="Austin") → correct

Split: multi-turn
Need search_docs then get_weather → both steps must succeed`}
        </Example>
      </LessonSection>

      <LessonSection title="What BFCL does NOT measure">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">General knowledge exams</strong> like MMLU — different track.
          </li>
          <li>
            <strong className="text-white">Safety / jailbreak refusal</strong> — use the Secure Text Generation
            track.
          </li>
          <li>
            Full <strong className="text-white">customer-support domain agents</strong> (retail/airline style)
            — see τ-bench for that flavor.
          </li>
          <li>
            Whether your private APIs are documented well — BFCL uses its own tool definitions.
          </li>
        </ul>
        <Callout variant="tip" title="Starter suite role">
          BFCL is the default first number for “does this model call tools correctly?” Pair with an agentic
          suite and an API-scale suite later.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'BFCL is the de facto standard for function-calling comparison.',
          'Covers AST match, live-oriented checks, and multi-turn tool use.',
          'High = right calls; low = wrong tools/args or broken multi-turn plans.',
          'Does not replace safety, MMLU, or domain agent (τ-bench) evals.',
        ]}
      />
    </LessonArticle>
  )
}
