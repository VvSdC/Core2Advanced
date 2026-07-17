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

export function AgentCardsAndDiscovery() {
  return (
    <LessonArticle>
      <Definition term="Agent Card">
        <p>
          An <strong className="text-white">Agent Card</strong> is a{' '}
          <strong className="text-white">machine-readable capability profile</strong> for an A2A agent. Clients
          use it for <strong className="text-white">discovery</strong>: who is this agent, what can it do, how
          do I reach it, and what auth or input modes does it support?
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: a restaurant menu + address + &quot;we take reservations online.&quot; You do not cook
          before reading the card; you read the card to decide whether to place an order (task).
        </p>
      </Definition>

      <Callout variant="beginner" title="Discovery first">
        Before sending work, a client discovers the peer&apos;s Agent Card — like checking a LinkedIn profile
        before assigning a project.
      </Callout>

      <LessonSection title="What a card typically describes">
        <ContentStep number={1} title="Identity and endpoint">
          <p className="text-slate-300">
            Name, description, URL / service endpoint so clients know where A2A calls go.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Skills / capabilities">
          <p className="text-slate-300">
            Human- and machine-oriented skills (e.g. research, booking, code review) so routers can match goals
            to peers.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Interaction hints">
          <p className="text-slate-300">
            Supported input/output modes, streaming or long-running expectations, and auth schemes — exact
            fields evolve with the spec, so treat this as conceptual.
          </p>
        </ContentStep>
        <Flowchart
          title="Discovery then delegation"
          chart={`flowchart TB
  Client[Client agent] --> Fetch[Fetch Agent Card]
  Fetch --> Match{Skills match goal?}
  Match -->|No| Skip[Try another peer]
  Match -->|Yes| Auth[Satisfy auth requirements]
  Auth --> Task[Create A2A task + messages]
  Task --> Peer[Remote agent]`}
        />
      </LessonSection>

      <LessonSection title="Conceptual card shape">
        <CodeBlock title="Illustrative JSON (fields may differ in live specs)">
{`{
  "name": "Research Specialist",
  "description": "Summarizes docs with citations",
  "url": "https://agents.example/research",
  "skills": [
    { "id": "summarize", "description": "Long-doc summaries" },
    { "id": "cite", "description": "Return source pointers" }
  ],
  "defaultInputModes": ["text", "file"],
  "capabilities": { "streaming": true },
  "authentication": { "schemes": ["bearer"] }
}`}
        </CodeBlock>
        <Callout variant="info" title="Specs evolve">
          Field names and nesting change as A2A matures. Learn the <em>idea</em> of a card; confirm the current
          schema in official A2A documentation before shipping parsers.
        </Callout>
      </LessonSection>

      <LessonSection title="How clients use discovery">
        <Example title="Router chooses a peer">
{`Goal: "Review this PR for security issues"
Catalog:
  - coding-helper.card      skills: refactor, tests
  - security-review.card    skills: security, cwe_hints
Pick: security-review → send task with PR diff as message parts`}
        </Example>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Static catalog</strong> — ops publishes known cards in a registry.
          </li>
          <li>
            <strong className="text-white">Well-known URL</strong> — fetch card from a standard location on the
            agent host (pattern used by many discovery systems).
          </li>
          <li>
            <strong className="text-white">Runtime filter</strong> — match skill tags, modalities, and auth you
            can satisfy.
          </li>
        </ul>
      </LessonSection>

      <LessonSection title="Card quality checklist">
        <ContentStep number={1} title="Be honest about skills">
          <p className="text-slate-300">
            Overclaiming skills creates failed tasks and broken trust between vendors.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Document modalities">
          <p className="text-slate-300">
            If you only accept text, say so — do not fail silently on file parts.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Advertise async truthfully">
          <p className="text-slate-300">
            If jobs take minutes, clients need streaming or pollable task states — advertise what you support.
          </p>
        </ContentStep>
        <Flowchart
          title="Bad card → bad hire"
          chart={`flowchart TB
  Bad[Vague or lying Agent Card] --> Hire[Client hires peer]
  Hire --> Fail[Task fails or wrong skill]
  Fail --> Trust[Interop trust drops]
  Good[Accurate Agent Card] --> Fit[Client matches skill]
  Fit --> Ok[Task lifecycle completes cleanly]`}
        />
      </LessonSection>

      <KeyTakeaways
        items={[
          'Agent Card = machine-readable capability profile used for A2A discovery.',
          'Cards cover identity, skills, modalities, and auth/streaming hints at a conceptual level.',
          'Clients discover → match skills → auth → send tasks; discovery comes before delegation.',
          'Treat examples as conceptual — verify live schema in official A2A docs as specs evolve.',
        ]}
      />
    </LessonArticle>
  )
}
