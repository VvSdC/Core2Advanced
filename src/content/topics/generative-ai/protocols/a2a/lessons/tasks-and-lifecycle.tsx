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

export function TasksAndLifecycle() {
  return (
    <LessonArticle>
      <Definition term="A2A task">
        <p>
          A <strong className="text-white">task</strong> is the main unit of delegated work in A2A. It carries
          a goal (via messages), an identifier, and a <strong className="text-white">lifecycle state</strong>{' '}
          such as submitted, working, completed, or failed (plus related states the live spec may define).
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: a support ticket. Opening it is not the answer — status updates and a final resolution are.
          Agents need the same discipline when hiring peers.
        </p>
      </Definition>

      <Callout variant="beginner" title="Why states matter">
        Long agent jobs are not one HTTP request hope. Clients need to know: queued, running, done, or dead.
      </Callout>

      <LessonSection title="Lifecycle at a glance">
        <Flowchart
          title="Typical task state flow (conceptual)"
          chart={`flowchart TB
  Sub[submitted] --> Work[working]
  Work --> Comp[completed]
  Work --> Fail[failed]
  Work --> Can[canceled / rejected]
  Comp --> Art[Artifacts / final messages available]
  Fail --> Err[Error info for client retry or escalate]`}
        />
        <ContentStep number={1} title="submitted">
          <p className="text-slate-300">
            Client created the task; the peer has accepted it into its queue or handler.
          </p>
        </ContentStep>
        <ContentStep number={2} title="working">
          <p className="text-slate-300">
            Peer is actively reasoning, calling tools (often via MCP internally), or waiting on sub-steps.
          </p>
        </ContentStep>
        <ContentStep number={3} title="completed / failed / canceled">
          <p className="text-slate-300">
            Terminal-ish outcomes: success with results, hard failure, or stop by client/policy. Exact names
            and transitions can vary — check official A2A docs for the current enum.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Tasks vs chat bubbles">
        <Example title="Same goal, different abstraction">
{`Chat-only thinking:
  "Hey peer, can you review this?" → hope for a reply

A2A thinking:
  task_id = create_task(peer, messages=[...])
  while task.state == "working":
      show_progress(task)
  if task.state == "completed":
      use(task.artifacts)
  else:
      escalate(task.error)`}
        </Example>
        <p className="mt-3 text-slate-300">
          Messages live <em>on</em> the task. The task is the folder; messages and artifacts are the contents.
        </p>
      </LessonSection>

      <LessonSection title="Client responsibilities">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Idempotency mindset</strong> — retries should not spawn duplicate
            irreversible side effects blindly.
          </li>
          <li>
            <strong className="text-white">Timeouts and cancel</strong> — enterprise UIs need cancel paths when
            users abandon a goal.
          </li>
          <li>
            <strong className="text-white">Observe transitions</strong> — log state changes for audit and
            debugging across vendors.
          </li>
        </ul>
        <CodeBlock title="Pseudocode poll loop">
{`task = a2a.send_task(peer, message)
while task.state in ("submitted", "working"):
    task = a2a.get_task(task.id)   # or subscribe to stream
    notify_ui(task)
if task.state == "completed":
    return task.artifacts
raise DelegationError(task.state, task.error)`}
        </CodeBlock>
        <Callout variant="tip" title="Streaming lesson next">
          Polling works; many peers prefer push/streaming updates for long-running work. Same lifecycle —
          different transport of progress.
        </Callout>
      </LessonSection>

      <LessonSection title="Failure is a first-class state">
        <Flowchart
          title="Failed task is information"
          chart={`flowchart TB
  Fail[failed] --> Why{Why?}
  Why -->|Auth| FixA[Fix credentials / scopes]
  Why -->|Bad input| FixI[Fix message parts / modalities]
  Why -->|Peer overload| Retry[Backoff or other peer]
  Why -->|Policy| Human[Human escalation]`}
        />
        <p className="mt-3 text-slate-300">
          Treating &quot;no reply&quot; as success is the classic multi-agent bug. Explicit{' '}
          <span className="font-mono text-sm text-genai-400">failed</span> beats silent hope.
        </p>
      </LessonSection>

      <KeyTakeaways
        items={[
          'A2A tasks are the unit of delegated work with an explicit lifecycle.',
          'Core states to know: submitted, working, completed, failed (and related cancel/reject ideas).',
          'Messages/artifacts hang off tasks; clients must poll or stream state changes.',
          'Specs evolve — confirm exact state names and transitions in official A2A docs.',
        ]}
      />
    </LessonArticle>
  )
}
