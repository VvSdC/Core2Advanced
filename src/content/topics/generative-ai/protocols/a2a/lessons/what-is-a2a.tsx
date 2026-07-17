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

export function WhatIsA2a() {
  return (
    <LessonArticle>
      <Definition term="A2A (Agent2Agent)">
        <p>
          <strong className="text-white">A2A</strong> (Agent2Agent) is an{' '}
          <strong className="text-white">open protocol</strong> — originally from Google and now evolved in the
          open community — that lets independent AI agents{' '}
          <strong className="text-white">discover</strong> each other,{' '}
          <strong className="text-white">delegate work</strong>, and{' '}
          <strong className="text-white">collaborate</strong> over a shared contract.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: if a single agent is one specialist on a team, A2A is the shared language and handshake so
          specialists from different companies can hire each other without reinventing every integration.
        </p>
      </Definition>

      <Callout variant="beginner" title="One sentence version">
        A2A is how agents talk to other agents — not how agents talk to tools (that is closer to MCP).
      </Callout>

      <LessonSection title="The problem A2A solves">
        <p className="text-slate-300">
          Teams build agents with different frameworks, clouds, and vendors. Without a protocol, every
          &quot;my travel agent should ask your booking agent&quot; becomes a custom API glue project.
        </p>
        <ContentStep number={1} title="Discovery">
          <p className="text-slate-300">
            Find what another agent can do via a machine-readable profile (an{' '}
            <strong className="text-white">Agent Card</strong>).
          </p>
        </ContentStep>
        <ContentStep number={2} title="Delegation">
          <p className="text-slate-300">
            Hand off a unit of work as a <strong className="text-white">task</strong> with clear lifecycle
            states.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Collaboration">
          <p className="text-slate-300">
            Exchange <strong className="text-white">messages</strong> (text, files, structured data) and
            optionally stream progress for long jobs.
          </p>
        </ContentStep>
        <Flowchart
          title="From lonely agent to collaborating peers"
          chart={`flowchart TB
  U[User goal] --> A[Your agent]
  A --> D{Need a specialist?}
  D -->|No| Done[Answer directly]
  D -->|Yes| Card[Discover Agent Card]
  Card --> Task[Create A2A task]
  Task --> Peer[Remote agent]
  Peer --> Result[Task result / messages]
  Result --> A`}
        />
      </LessonSection>

      <LessonSection title="What A2A is not">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            Not a replacement for <strong className="text-white">MCP</strong> — MCP connects agents to tools
            and context; A2A connects agents to agents.
          </li>
          <li>
            Not a specific LLM or framework — LangGraph, custom servers, and vendor agents can all speak A2A.
          </li>
          <li>
            Not a frozen textbook — <strong className="text-white">specs evolve</strong>; learn concepts here,
            then verify details in official A2A docs.
          </li>
        </ul>
        <Callout variant="insight" title="Open + multi-vendor">
          The point of openness is enterprise interoperability: a finance agent from Vendor A should be able to
          call a compliance agent from Vendor B when both speak A2A and auth is configured.
        </Callout>
      </LessonSection>

      <LessonSection title="Tiny conceptual sketch">
        <Example title="Hire a research agent">
{`You (client agent): "Summarize Q3 risks from these PDFs."
Discover: peer Agent Card → skills: research, cite_sources
Send: A2A task + message parts (text + files)
Peer: state working → streaming updates → completed
You: fold the artifact into your final answer`}
        </Example>
        <CodeBlock title="Mental model (not a live SDK)">
{`# Client agent thinking in A2A terms:
peer = discover("agent-card://research.example")
task = peer.send_task(
  message={
    "parts": [
      {"type": "text", "text": "Summarize Q3 risks"},
      {"type": "file", "uri": "s3://.../q3.pdf"},
    ]
  }
)
# Later: task.state in {working, completed, failed, ...}`}
        </CodeBlock>
      </LessonSection>

      <LessonSection title="Learning map — A2A track">
        <Flowchart
          title="Foundations → Core → Building → Advanced"
          chart={`flowchart TB
  F[Foundations<br/>what / MCP vs A2A / interop / cards] --> C[Core<br/>tasks / messages / streaming / auth]
  C --> B[Building<br/>agent / delegation / orchestration / frameworks]
  B --> A[Advanced<br/>enterprise / landscape / pitfalls / mastery]`}
        />
        <p className="mt-3 text-slate-300">
          Start here. Next lesson draws a hard line between{' '}
          <span className="font-mono text-sm text-genai-400">MCP</span> (agent↔tools) and{' '}
          <span className="font-mono text-sm text-genai-400">A2A</span> (agent↔agent).
        </p>
      </LessonSection>

      <KeyTakeaways
        items={[
          'A2A = open Agent2Agent protocol for discovery, delegation, and collaboration.',
          'Analogy: shared handshake so specialist agents from different vendors can hire each other.',
          'Complements MCP: MCP is agent↔tools; A2A is agent↔agent.',
          'Specs evolve — master concepts, then check official A2A documentation for current details.',
        ]}
      />
    </LessonArticle>
  )
}
