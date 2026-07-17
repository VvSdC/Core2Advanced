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

export function Toolbench() {
  return (
    <LessonArticle>
      <Definition term="ToolBench">
        <p>
          <strong className="text-white">ToolBench</strong> is a large-scale benchmark in the{' '}
          <strong className="text-white">ToolLLM</strong> lineage. It stresses models with many real-world-style
          APIs / tools — far beyond a handful of toy functions — to see if tool use{' '}
          <strong className="text-white">scales</strong>.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: not a 10-question quiz with <span className="font-mono text-sm text-genai-400">get_weather</span>,
          but a huge library of buttons — can the model still pick and use the right ones?
        </p>
      </Definition>

      <Callout variant="beginner" title="What ToolBench measures">
        Ability to instruct, retrieve, and call tools across a large, diverse API pool — closer to “many
        real APIs” than a tiny curated list.
      </Callout>

      <LessonSection title="What does this benchmark measure?">
        <ContentStep number={1} title="Scale of APIs">
          <p className="text-slate-300">
            Thousands of tool-like APIs appear in the ecosystem. The model must cope with variety: names,
            parameters, and domains — not memorize three demos.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Instruction → tool path">
          <p className="text-slate-300">
            Given a user ask, build a plan that may include selecting and calling tools (conceptually like
            choosing <span className="font-mono text-sm text-genai-400">search_docs</span> then another API).
          </p>
        </ContentStep>
        <ContentStep number={3} title="ToolLLM lineage">
          <p className="text-slate-300">
            ToolBench is tightly linked to research on training models that use tools at scale. Scores are
            often discussed alongside those training recipes.
          </p>
        </ContentStep>
        <Flowchart
          title="ToolBench idea (simplified)"
          chart={`flowchart TB
  U[User instruction] --> P[Plan / select tools]
  P --> C[Emit API-style calls]
  C --> E[Execute or simulate]
  E --> S[Success / quality score]`}
        />
      </LessonSection>

      <LessonSection title="What high and low scores mean">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">High</strong> — better at navigating a large tool space and
            producing usable call sequences for diverse tasks.
          </li>
          <li>
            <strong className="text-white">Low</strong> — struggles when tools are many, unfamiliar, or require
            multi-step API use.
          </li>
          <li>
            Live API evals can be <strong className="text-white">noisy</strong> (rate limits, downtime) — that
            is a known pain point motivating StableToolBench.
          </li>
        </ul>
        <Example title="Tiny fictional flavor (not the real catalog)">
{`Task: "Find packing tips and Austin weather"
Possible path:
  search_docs(query="packing list")
  get_weather(city="Austin")
ToolBench stress-tests this idea across MANY more APIs.`}
        </Example>
      </LessonSection>

      <LessonSection title="What ToolBench does NOT measure">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            Clean, ultra-stable leaderboard numbers when live APIs flake — prefer{' '}
            <span className="text-genai-400">StableToolBench</span> for that goal.
          </li>
          <li>
            Pure <strong className="text-white">schema AST</strong> purity like BFCL’s main AST track.
          </li>
          <li>
            <strong className="text-white">Safety</strong> of tool use (calling a dangerous API you should not).
          </li>
          <li>
            Domain-faithful retail/airline agent policy (τ-bench).
          </li>
        </ul>
        <Callout variant="insight" title="When to use it">
          Use ToolBench (or StableToolBench) when your product talks to a <strong className="text-white">large
          API surface</strong>, not just two demo tools.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'ToolBench = large-scale real-API-style tool use (ToolLLM lineage).',
          'High scores suggest better scaling across many tools; low means brittle at scale.',
          'Live APIs can make scores unstable — see StableToolBench.',
          'Complements BFCL; does not replace AST-focused or domain-agent evals.',
        ]}
      />
    </LessonArticle>
  )
}
