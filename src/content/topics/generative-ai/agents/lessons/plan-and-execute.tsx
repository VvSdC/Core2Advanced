import {
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function PlanAndExecute() {
  return (
    <LessonArticle>
      <LessonSection title="Separate planning from execution">
        <p>
          A <strong className="text-white">planner agent</strong> breaks the task into steps without using tools.
          An <strong className="text-white">executor agent</strong> carries out each step with tools. Planning
          uses a smarter (expensive) model; execution can use a cheaper one.
        </p>
        <Flowchart
          title="Plan-and-execute loop"
          chart={`flowchart TB
  User --> P[Planner: create step list]
  P --> E[Executor: run step 1]
  E --> C{More steps?}
  C -- yes --> E2[Executor: run step 2]
  E2 --> C
  C -- no --> R[Replanner: revise plan if needed]
  R --> E
  R --> Done[Final answer]`}
        />
      </LessonSection>

      <LessonSection title="State design">
        <Example
          title="Plan-and-execute state"
        >{`class PlanExecuteState(TypedDict):
    input: str
    plan: list[str]          # ["Search docs", "Summarise", "Format JSON"]
    past_steps: list[tuple]  # [(step, result), ...]
    response: str`}</Example>
      </LessonSection>

      <LessonSection title="When to use">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li><strong className="text-white">Use</strong> — multi-step tasks where the plan is visible and editable.</li>
          <li><strong className="text-white">Use</strong> — cost optimisation (GPT-4 plans, GPT-4o-mini executes).</li>
          <li><strong className="text-white">Skip</strong> — simple single-tool queries (ReAct is enough).</li>
        </ul>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Planner creates steps; executor runs them with tools; replanner adjusts on failure.',
          'Cheaper executor model saves cost; visible plan is debuggable.',
          'LangGraph: planner node → executor loop → replanner conditional edge.',
        ]}
      />
    </LessonArticle>
  )
}
