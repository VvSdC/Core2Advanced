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

export function StableToolbench() {
  return (
    <LessonArticle>
      <Definition term="StableToolBench">
        <p>
          <strong className="text-white">StableToolBench</strong> is a more{' '}
          <strong className="text-white">stable</strong> evaluation setting in the ToolBench family. It
          tackles a practical problem: live APIs change, fail, or rate-limit — so yesterday’s ToolBench score
          may not match today’s.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: same obstacle course as ToolBench, but with locked props so the scoreboard stops shaking.
        </p>
      </Definition>

      <Callout variant="beginner" title="What StableToolBench measures">
        Large-scale, ToolBench-style tool / API use under a more reproducible harness — so model comparisons
        move less because of flaky external APIs.
      </Callout>

      <LessonSection title="What does this benchmark measure?">
        <ContentStep number={1} title="ToolBench-style tasks">
          <p className="text-slate-300">
            Still about instructing models to use many APIs/tools for diverse user asks — the same family of
            skills as ToolBench.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Stability / reproducibility">
          <p className="text-slate-300">
            Uses stabilized environments (e.g. cached or simulated API behavior) so re-runs are comparable.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Fairer model ranking">
          <p className="text-slate-300">
            When APIs do not randomly fail mid-eval, differences between models are more likely to be real
            capability gaps.
          </p>
        </ContentStep>
        <Flowchart
          title="Why 'stable' matters"
          chart={`flowchart TB
  L[Live API eval] --> F[Flakes: downtime / rate limits]
  F --> N[Noisy scores]
  S[StableToolBench harness] --> C[Cached / controlled APIs]
  C --> R[More reproducible ranking]
  N --> W[Hard to trust leaderboard]
  R --> T[Trustier ToolBench-style signal]`}
        />
      </LessonSection>

      <LessonSection title="What high and low scores mean">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">High</strong> — stronger large-scale tool use under the stabilized
            protocol.
          </li>
          <li>
            <strong className="text-white">Low</strong> — still struggles with planning/calling across a big
            tool space — not merely “API was down.”
          </li>
          <li>
            Prefer StableToolBench when you need <strong className="text-white">regression tracking</strong>{' '}
            week to week.
          </li>
        </ul>
        <Example title="Same task, different noise">
{`Task needs: search_docs + get_weather-like API

Live ToolBench day: API 500 error → model "fails"
Stable harness: same mock response every run → fair compare`}
        </Example>
      </LessonSection>

      <LessonSection title="What StableToolBench does NOT measure">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            How your model behaves when <strong className="text-white">real production APIs</strong> are
            flaky — you still need chaos tests separately.
          </li>
          <li>
            Pure BFCL <strong className="text-white">AST</strong> leaderboard positioning.
          </li>
          <li>
            Domain policy agents (τ-bench).
          </li>
          <li>
            Safety of tool invocation.
          </li>
        </ul>
        <Callout variant="tip" title="Starter suite role">
          For API-scale evaluation, StableToolBench is often the calmer sibling to pick alongside BFCL and
          τ-bench.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'StableToolBench = ToolBench-style eval with more reproducible APIs.',
          'High/low reflect tool skill more than network luck.',
          'Best for week-to-week regression on large tool spaces.',
          'Does not replace live chaos testing or BFCL AST / τ-bench.',
        ]}
      />
    </LessonArticle>
  )
}
