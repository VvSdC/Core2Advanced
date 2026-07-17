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

export function PuttingItTogetherMcp() {
  return (
    <LessonArticle>
      <Definition term="Putting it together — MCP">
        <p>
          You can explain MCP as an open standard for AI apps ↔ tools/data/prompts, draw host/client/server,
          use Tools/Resources/Prompts, reason about JSON-RPC + transports, negotiate capabilities, and ship
          with security and multi-server discipline.
        </p>
        <p className="mt-2 text-slate-300">
          This lesson is a mastery checklist and a bridge to the <strong className="text-white">A2A</strong>{' '}
          track for agent-to-agent collaboration.
        </p>
      </Definition>

      <Callout variant="beginner" title="Mastery in one breath">
        USB for AI context: standardize the plug (MCP), specialize the gadgets (servers), gate the power
        (security), then let agents talk to each other (A2A).
      </Callout>

      <LessonSection title="Mastery checklist">
        <ContentStep number={1} title="Foundations">
          <p className="text-slate-300">
            Define MCP, the N×M problem, MCP vs function calling, and host/client/server roles.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Core protocol">
          <p className="text-slate-300">
            Map Tools / Resources / Prompts; sketch JSON-RPC requests; choose stdio vs HTTP-family; explain
            initialize + capabilities (and that specs evolve).
          </p>
        </ContentStep>
        <ContentStep number={3} title="Building">
          <p className="text-slate-300">
            Build a minimal tool server, connect it via host config, know sampling/roots at a concept level,
            apply least privilege.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Advanced">
          <p className="text-slate-300">
            Design multi-server profiles, wire MCP into agent frameworks, add versioning/observability/gating,
            and place MCP beside A2A without mixing layers.
          </p>
        </ContentStep>
        <Example title="Whiteboard test">
{`Draw: User → Host → Client → Server(s)
Label: tools vs resources vs prompts
Add: initialize arrow + one tools/call
Circle: where auth and allowlists live
Separate box: A2A between agents`}
        </Example>
      </LessonSection>

      <LessonSection title="End-to-end mental model">
        <Flowchart
          title="MCP mastery map"
          chart={`flowchart TB
  A[Foundations] --> B[Core primitives + messages]
  B --> C[Build + connect + secure]
  C --> D[Multi-server + agents + prod]
  D --> E[A2A track next]`}
        />
        <Flowchart
          title="Runtime path you should recite"
          chart={`flowchart TB
  U[User] --> H[Host]
  H --> M[Model]
  H --> C[MCP client]
  C --> N[initialize / negotiate]
  N --> L[list tools/resources]
  L --> T[tools/call]
  T --> S[MCP server]
  S --> H`}
        />
      </LessonSection>

      <LessonSection title="Next: A2A track">
        <ContentStep number={1} title="What you already have">
          <p className="text-slate-300">
            Solid tool/context plumbing via MCP — agents can act on the world through standard servers.
          </p>
        </ContentStep>
        <ContentStep number={2} title="What A2A adds">
          <p className="text-slate-300">
            How agents discover, authenticate, and collaborate with <em>other agents</em> — the coworker layer
            above the USB-tool layer.
          </p>
        </ContentStep>
        <ContentStep number={3} title="How to study next">
          <p className="text-slate-300">
            Keep MCP servers narrow and safe; learn A2A for orchestration across agent identities and tasks.
          </p>
        </ContentStep>
        <Callout variant="tip" title="Shipping reminder">
          Concepts here are durable; message fields and transports change. Before production code, verify
          against the <strong className="text-white">current MCP specification</strong> and your host’s docs
          (Claude Desktop, IDEs, agent frameworks).
        </Callout>
      </LessonSection>

      <LessonSection title="Self-test — can you explain it?">
        <p className="text-slate-300">
          Use these prompts to verify mastery before moving to the A2A track. If any answer feels fuzzy, revisit
          that lesson — the ideas stack.
        </p>
        <ContentStep number={1} title="Explain MCP in 30 seconds">
          <p className="text-slate-300">
            Open standard, USB analogy, Tools/Resources/Prompts, host embeds client, servers advertise
            capabilities, JSON-RPC over stdio or HTTP-family transports.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Draw the runtime path">
          <p className="text-slate-300">
            User → host → model + MCP client → initialize → list → tools/call → server → result back to model.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Name three production habits">
          <p className="text-slate-300">
            Least privilege, observability (request id + server + tool), multi-server allowlists and version
            pinning.
          </p>
        </ContentStep>
        <Flowchart
          title="Where you are now"
          chart={`flowchart TB
  A[MCP foundations ✓] --> B[Build + secure servers ✓]
  B --> C[Multi-server + frameworks ✓]
  C --> D[You are here]
  D --> E[A2A: agent discovery + collaboration]`}
        />
        <Callout variant="insight" title="Jargon: composable stack">
          <strong className="text-white">Composable</strong> means swapping one MCP server or one agent peer
          without rewiring the entire product — the payoff of learning protocols instead of one-off glue code.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'MCP standardizes AI ↔ tools/data/prompts; hosts embed clients; servers advertise primitives.',
          'Core path: negotiate → list → call; choose transports by local vs remote.',
          'Production = versioning, observability, least privilege, multi-server hygiene.',
          'Next track: A2A for agent-to-agent collaboration layered on top of MCP.',
        ]}
      />
    </LessonArticle>
  )
}
