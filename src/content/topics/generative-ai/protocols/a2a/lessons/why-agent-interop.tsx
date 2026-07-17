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

export function WhyAgentInterop() {
  return (
    <LessonArticle>
      <Definition term="Agent interoperability">
        <p>
          <strong className="text-white">Agent interoperability</strong> means agents built by different
          teams, frameworks, or vendors can still <strong className="text-white">discover</strong>,{' '}
          <strong className="text-white">authenticate</strong>, and{' '}
          <strong className="text-white">complete work together</strong> without a one-off integration for
          every pair.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: USB and HTTP won because devices and sites did not each invent a private plug. A2A aims at
          that kind of shared plug for agents.
        </p>
      </Definition>

      <Callout variant="beginner" title="Why beginners should care">
        Without interop, every cool demo dies at the company boundary: &quot;our LangGraph agent cannot talk
        to their vendor support agent.&quot;
      </Callout>

      <LessonSection title="The pain without a protocol">
        <ContentStep number={1} title="Multi-framework chaos">
          <p className="text-slate-300">
            Team A uses LangGraph. Team B uses a custom FastAPI agent. Team C buys a SaaS agent. Each has a
            different JSON shape for &quot;please do this.&quot;
          </p>
        </ContentStep>
        <ContentStep number={2} title="Multi-vendor walls">
          <p className="text-slate-300">
            Procurement wants best-of-breed: CRM agent from one vendor, compliance from another. Without A2A,
            you write N×M adapters.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Opaque capabilities">
          <p className="text-slate-300">
            You cannot safely delegate if you cannot machine-read what the peer offers — skills, auth, input
            modes, streaming support.
          </p>
        </ContentStep>
        <Flowchart
          title="N×M glue vs shared protocol"
          chart={`flowchart TB
  subgraph Without[Without A2A]
    A1[Agent A] --> G12[Custom glue]
    G12 --> A2[Agent B]
    A1 --> G13[More glue]
    G13 --> A3[Agent C]
    A2 --> G23[Even more glue]
    G23 --> A3
  end
  subgraph With[With A2A]
    B1[Agent A] --> P[Shared A2A contract]
    B2[Agent B] --> P
    B3[Agent C] --> P
  end`}
        />
      </LessonSection>

      <LessonSection title="What &quot;interop&quot; actually buys you">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Discovery</strong> via Agent Cards instead of tribal knowledge.
          </li>
          <li>
            <strong className="text-white">Task semantics</strong> so long jobs report submitted / working /
            completed / failed consistently.
          </li>
          <li>
            <strong className="text-white">Message parts</strong> so text, files, and structured data travel
            predictably.
          </li>
          <li>
            <strong className="text-white">Auth hooks</strong> for enterprise identity — who may call whom.
          </li>
        </ul>
        <Example title="Enterprise story">
{`Travel desk agent (Vendor A)
  → discovers Hotel agent (Vendor B) via Agent Card
  → sends A2A task with dates + preferences
  → streams status while booking runs
  → receives structured confirmation artifact
Finance agent (internal) never rewrites Vendor B's API.`}
        </Example>
      </LessonSection>

      <LessonSection title="Interop is not magic">
        <p className="text-slate-300">
          A protocol removes <em>wire-format</em> pain. You still design trust boundaries, SLAs, cost limits,
          and human escalation. Specs also <strong className="text-white">evolve</strong> — lock versions and
          read official A2A docs for production.
        </p>
        <CodeBlock title="Anti-pattern vs protocol mindset">
{`# Anti-pattern: peer-specific RPCs forever
call_vendor_b_book_hotel_v3(payload)

# Protocol mindset: capability + task
card = discover(peer)
assert "hotel.book" in card.skills
task = send_task(peer, message_parts=[...])`}
        </CodeBlock>
        <Callout variant="insight" title="Framework-agnostic on purpose">
          A2A does not ask everyone to rewrite their agent loop. It asks them to expose a common edge:
          card + tasks + messages — so orchestration frameworks and vendors can meet in the middle.
        </Callout>
      </LessonSection>

      <LessonSection title="When interop matters most">
        <Flowchart
          title="Decide if you need A2A yet"
          chart={`flowchart TB
  Q[Do agents cross team or vendor boundaries?]
  Q -->|No — single process graph| Maybe[Maybe internal APIs only]
  Q -->|Yes| Need[A2A-style interop pays off]
  Need --> Card[Publish / consume Agent Cards]
  Card --> Auth[Wire enterprise auth]
  Auth --> Ops[Observe task lifecycles]`}
        />
        <p className="mt-3 text-slate-300">
          Next: the discovery document itself — the <strong className="text-white">Agent Card</strong>.
        </p>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Interop = different teams/frameworks/vendors collaborating without N×M custom glue.',
          'Pain is multi-framework and multi-vendor walls plus opaque capabilities.',
          'A2A buys shared discovery, tasks, message parts, and auth-friendly collaboration.',
          'Protocol ≠ trust/SLA design; still version and verify against official A2A docs.',
        ]}
      />
    </LessonArticle>
  )
}
