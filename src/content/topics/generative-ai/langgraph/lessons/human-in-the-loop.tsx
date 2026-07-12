import {
  ContentStep,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function HumanInTheLoop() {
  return (
    <LessonArticle>
      <LessonSection title="Why pause execution?">
        <p>
          Production agents sometimes need to <strong className="text-white">stop and wait for human input</strong>{' '}
          — approve a database write, confirm a payment, or edit a draft before sending. LangGraph supports this
          natively with <strong className="text-white">interrupts</strong>.
        </p>
        <Flowchart
          title="Human-in-the-loop flow"
          chart={`flowchart TB
  A[Agent proposes action] --> B[interrupt_before tools]
  B --> C{Human approves?}
  C -- yes --> D[Execute tool]
  C -- no --> E[Revise plan]
  E --> A
  D --> F[Continue graph]`}
        />
      </LessonSection>

      <LessonSection title="interrupt_before / interrupt_after">
        <Example
          title="Pause before tool execution"
        >{`app = graph.compile(
    checkpointer=memory,
    interrupt_before=["tools"],  # pause HERE before tools node runs
)

# First invoke — runs until interrupt, then stops
config = {"configurable": {"thread_id": "session-1"}}
result = app.invoke(input_state, config)
# Graph is paused — tool has NOT run yet

# Human reviews proposed tool call in result["messages"][-1].tool_calls
# Human approves → resume
result = app.invoke(None, config)  # None = continue from checkpoint`}</Example>
      </LessonSection>

      <LessonSection title="Editing state at interrupt">
        <ContentStep number={1} title="Human modifies the plan">
          <p>
            While paused, you can read the checkpoint state, let the user edit messages or tool arguments, then
            resume with the modified state using <code className="font-mono text-sm">update_state</code>.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Reject and redirect">
          <p>
            Inject a human message like "Don't delete that row — try a SELECT first" and resume. The agent sees
            the correction in message history.
          </p>
        </ContentStep>
      </LessonSection>

      <KeyTakeaways
        items={[
          'interrupt_before / interrupt_after pause the graph at specific nodes.',
          'Requires a checkpointer — state must be saved to resume.',
          'Humans can approve, reject, or edit state before continuing.',
        ]}
      />
    </LessonArticle>
  )
}
