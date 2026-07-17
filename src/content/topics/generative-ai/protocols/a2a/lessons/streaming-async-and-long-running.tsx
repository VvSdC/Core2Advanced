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

export function StreamingAsyncAndLongRunning() {
  return (
    <LessonArticle>
      <Definition term="Streaming and async A2A work">
        <p>
          Many agent jobs outlive a single synchronous request. A2A treats{' '}
          <strong className="text-white">long-running tasks</strong> as normal: clients can{' '}
          <strong className="text-white">stream</strong> progress or work{' '}
          <strong className="text-white">asynchronously</strong> — submit, disconnect, resume — while the peer
          keeps the task lifecycle moving.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: food delivery. You do not hold the phone open for 40 minutes; you get status pings
          (&quot;preparing,&quot; &quot;on the way&quot;) and a final delivered event.
        </p>
      </Definition>

      <Callout variant="beginner" title="Why this exists">
        Multi-step agents call tools, wait on humans, and fan out to other agents. Blocking HTTP forever is a
        bad product.
      </Callout>

      <LessonSection title="Three client patterns">
        <ContentStep number={1} title="Synchronous short task">
          <p className="text-slate-300">
            Rare for serious agents, fine for tiny skills: wait until completed, then read artifacts.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Streaming updates">
          <p className="text-slate-300">
            Subscribe to events as the peer works — partial text, status changes, early artifacts.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Async fire-and-resume">
          <p className="text-slate-300">
            Persist <span className="font-mono text-sm text-genai-400">task_id</span>, return later via get-task
            or webhook-style callbacks if your stack supports them.
          </p>
        </ContentStep>
        <Flowchart
          title="Long-running collaboration"
          chart={`flowchart TB
  Client[Client] --> Submit[Submit task]
  Submit --> Peer[Peer agent working]
  Peer -->|stream events| Client
  Peer --> Done[completed / failed]
  Done --> Art[Client fetches artifacts]
  Client -.->|disconnect / reconnect| Peer`}
        />
      </LessonSection>

      <LessonSection title="What streaming is for">
        <Example title="UX wins">
{`User: "Analyze these 50 contracts"
UI: show working + "12/50 scanned"
Stream: intermediate risk hits
Complete: final artifact report.pdf
Without streaming: spinner lies for 8 minutes.`}
        </Example>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Progress honesty</strong> — users and orchestrators see movement.
          </li>
          <li>
            <strong className="text-white">Early abort</strong> — cancel when intermediate results look wrong.
          </li>
          <li>
            <strong className="text-white">Orchestration</strong> — parent agents can start the next hop sooner.
          </li>
        </ul>
      </LessonSection>

      <LessonSection title="Conceptual client code">
        <CodeBlock title="Stream-oriented sketch">
{`task = a2a.send_task(peer, message, stream=True)
for event in task.events():
    if event.type == "status":
        ui.set_state(event.state)      # working → ...
    elif event.type == "message":
        ui.append(event.parts)
    elif event.type == "artifact":
        store(event.artifact)
assert task.state in ("completed", "failed", "canceled")`}
        </CodeBlock>
        <Callout variant="insight" title="Advertise capability">
          Agent Cards should indicate streaming support so clients choose peers that match UX needs. Do not
          assume every peer streams.
        </Callout>
      </LessonSection>

      <LessonSection title="Operational realities">
        <Flowchart
          title="Design for disconnects"
          chart={`flowchart TB
  Start[Task submitted] --> Work[Peer keeps working]
  Work --> Drop{Client dropped?}
  Drop -->|Yes| Persist[Task id persisted server-side]
  Persist --> Resume[Client resumes / polls]
  Drop -->|No| Stream[Continue stream]
  Resume --> Terminal[Terminal state]
  Stream --> Terminal`}
        />
        <ContentStep number={1} title="Idempotent resume">
          <p className="text-slate-300">
            Reconnecting must not restart irreversible side effects unless intentionally designed.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Backpressure">
          <p className="text-slate-300">
            Chatty peers can flood clients — buffer, sample, or ask for coarser status events.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Timeouts ≠ failure forever">
          <p className="text-slate-300">
            Client timeout may mean &quot;I stopped waiting,&quot; not &quot;peer stopped working.&quot; Cancel
            explicitly when you need the peer to stop.
          </p>
        </ContentStep>
      </LessonSection>

      <KeyTakeaways
        items={[
          'A2A expects long-running work: streaming and async resume are first-class ideas.',
          'Patterns: short sync wait, stream events, or persist task_id and resume later.',
          'Streaming improves UX, cancelability, and multi-agent orchestration.',
          'Confirm streaming APIs and event shapes in official A2A docs — they evolve.',
        ]}
      />
    </LessonArticle>
  )
}
