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

export function ApiBank() {
  return (
    <LessonArticle>
      <Definition term="API-Bank">
        <p>
          <strong className="text-white">API-Bank</strong> evaluates tool-augmented LLMs by decomposing the
          job into pieces humans recognize: <strong className="text-white">planning</strong>,{' '}
          <strong className="text-white">retrieval</strong> (finding the right API), and{' '}
          <strong className="text-white">calling</strong> (filling arguments and invoking).
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: planning the trip, looking up which button to press, then actually pressing{' '}
          <span className="font-mono text-sm text-genai-400">get_weather</span> with the right city.
        </p>
      </Definition>

      <Callout variant="beginner" title="What API-Bank measures">
        End-to-end API use broken into planning, retrieving the correct API, and calling it correctly — so you
        can see which step fails.
      </Callout>

      <LessonSection title="What does this benchmark measure?">
        <ContentStep number={1} title="Planning">
          <p className="text-slate-300">
            Decide what needs to happen: e.g. “I need weather, then summarize.” Bad plans call the wrong
            sequence even if JSON is pretty.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Retrieval">
          <p className="text-slate-300">
            From a pool of APIs/docs, pick the right one — like choosing{' '}
            <span className="font-mono text-sm text-genai-400">get_weather</span> instead of{' '}
            <span className="font-mono text-sm text-genai-400">search_docs</span> when the user asked for
            temperature.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Calling">
          <p className="text-slate-300">
            Emit correct arguments and invoke. Retrieval can succeed and calling still fail (wrong city
            spelling, missing required arg).
          </p>
        </ContentStep>
        <Flowchart
          title="API-Bank decomposition"
          chart={`flowchart TB
  Q[User question] --> PL[Plan]
  PL --> R[Retrieve API]
  R --> C[Call with args]
  C --> A[Answer with result]
  PL -.-> S1[Plan score]
  R -.-> S2[Retrieval score]
  C -.-> S3[Call score]`}
        />
      </LessonSection>

      <LessonSection title="What high and low scores mean">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">High</strong> — strong across plan → retrieve → call (or strong on
            the reported levels).
          </li>
          <li>
            <strong className="text-white">Low overall / low on one level</strong> — tells you where to fix:
            planner, API finder, or argument filler.
          </li>
          <li>
            Prefer reading <strong className="text-white">level breakdowns</strong> over a single blended
            number when debugging.
          </li>
        </ul>
        <Example title="Where did it fail?">
{`Ask: "Austin weather please"
Plan: OK (need weather tool)
Retrieve: FAIL (picked search_docs)
Call: never reached

Diagnosis: retrieval, not JSON formatting.`}
        </Example>
      </LessonSection>

      <LessonSection title="What API-Bank does NOT measure">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            Massive open-web API scale like ToolBench’s catalog size.
          </li>
          <li>
            Long <strong className="text-white">policy-heavy customer support</strong> dialogues (τ-bench).
          </li>
          <li>
            Pure “should I use a tool at all?” decisioning alone (MetaTool focus).
          </li>
          <li>
            Safety of retrieved APIs.
          </li>
        </ul>
        <Callout variant="tip" title="Debugging tip">
          If BFCL AST is high but product fails, API-Bank-style decomposition often reveals retrieval/planning
          gaps BFCL’s simple splits may not emphasize.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'API-Bank splits tool use into planning, retrieval, and calling.',
          'High means the whole chain works; level scores show which link breaks.',
          'Great for diagnosing “wrong API” vs “wrong args.”',
          'Not a substitute for large-scale ToolBench or domain agent suites.',
        ]}
      />
    </LessonArticle>
  )
}
