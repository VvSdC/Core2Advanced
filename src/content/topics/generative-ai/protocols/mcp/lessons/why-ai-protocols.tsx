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

export function WhyAiProtocols() {
  return (
    <LessonArticle>
      <Definition term="Why AI protocols?">
        <p>
          An <strong className="text-white">AI protocol</strong> is a shared agreement for how systems
          exchange messages — so every product does not invent its own “how do I call a tool?” wire format.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: shipping containers. Without a standard container size, every port, ship, and truck needs
          custom adapters. Standards make the ecosystem scale.
        </p>
      </Definition>

      <Callout variant="beginner" title="The pain in one line">
        N AI apps × M tools without a protocol = N×M fragile integrations. With a protocol ≈ N + M.
      </Callout>

      <LessonSection title="The N×M integration trap">
        <p className="text-slate-300">
          Suppose you have 5 chat hosts and 20 backends (GitHub, Slack, Postgres, CRM…). Without MCP-like
          standards, each host team writes a custom connector to each backend. That is 100 projects — and
          every schema change breaks something.
        </p>
        <Flowchart
          title="N×M vs N+M"
          chart={`flowchart TB
  subgraph Bad[Without protocol]
    H1[Host A] --> T1[Tool 1]
    H1 --> T2[Tool 2]
    H2[Host B] --> T1
    H2 --> T2
  end
  subgraph Good[With MCP-style protocol]
    HA[Host A] --> P[Shared protocol]
    HB[Host B] --> P
    P --> S1[Server 1]
    P --> S2[Server 2]
  end`}
        />
        <Example title="What “custom” actually costs">
{`Host-specific Slack plugin
Host-specific Slack plugin (again, different JSON)
Host-specific Slack plugin (again, different auth)
→ three teams, three bugs, zero reuse`}
        </Example>
      </LessonSection>

      <LessonSection title="What a good protocol gives you">
        <ContentStep number={1} title="Discoverability">
          <p className="text-slate-300">
            Clients can ask: “What tools/resources/prompts do you offer?” instead of hard-coding names.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Interoperability">
          <p className="text-slate-300">
            One MCP server can plug into Claude Desktop, an IDE host, or an agent runner that speaks the
            protocol.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Separation of concerns">
          <p className="text-slate-300">
            Tool authors focus on the server. App authors focus on UX and the model. The protocol is the USB
            cable between them.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Safer boundaries">
          <p className="text-slate-300">
            Capability advertisement and auth live at the boundary — you can gate dangerous tools instead of
            baking them into every prompt.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Protocols are not magic — they are contracts">
        <p className="text-slate-300">
          A protocol does not make a bad tool safe or a weak model smart. It{' '}
          <strong className="text-white">standardizes the socket</strong>. You still design least privilege,
          observability, and good tool schemas.
        </p>
        <Flowchart
          title="Where protocols sit in the stack"
          chart={`flowchart TB
  U[User] --> H[AI host / IDE / desktop app]
  H --> M[Model]
  H --> C[Protocol client]
  C --> Proto[MCP messages]
  Proto --> S[Tool / data / prompt servers]`}
        />
        <Callout variant="insight" title="Jargon: interoperability">
          <strong className="text-white">Interoperability</strong> means different vendors’ software can work
          together because they share message shapes and roles — not because they share the same codebase.
        </Callout>
        <Callout variant="tip" title="Specs evolve">
          MCP details (transports, fields) change over time. Learn the concepts here; verify against the{' '}
          <strong className="text-white">current MCP specification</strong> when you ship code.
        </Callout>
      </LessonSection>

      <LessonSection title="Before and after a protocol">
        <p className="text-slate-300">
          Without a shared protocol, every integration is a snowflake: custom auth, custom discovery, custom
          error shapes. With MCP-style standards, the host team learns{' '}
          <strong className="text-white">one client pattern</strong> and the tool team learns{' '}
          <strong className="text-white">one server pattern</strong>.
        </p>
        <Flowchart
          title="Integration maturity curve"
          chart={`flowchart TB
  A[Ad hoc scripts] --> B[In-app function calling only]
  B --> C[Shared MCP servers]
  C --> D[Multi-server + policy + observability]
  D --> E[Agents + A2A on top of MCP]`}
        />
        <Example title="Same Slack capability, two eras">
{`Before protocol: 4 hosts × custom Slack plugins = 4 codebases
After MCP: 1 Slack MCP server + 4 hosts that speak MCP = reuse + one place to patch`}
        </Example>
        <Callout variant="insight" title="Why Anthropic open-sourced the idea">
          MCP emerged because powerful models without portable tool wiring recreate the N×M trap at every
          company. An <strong className="text-white">open standard</strong> lets the ecosystem invest once in
          servers (GitHub, filesystem, databases) instead of once per chat product.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Without standards, AI↔tool wiring becomes an N×M explosion of custom connectors.',
          'Protocols shrink that to N+M: clients once, servers once.',
          'Benefits: discoverability, interoperability, clearer security boundaries.',
          'Protocols are contracts at the socket — not a substitute for good tools or safety.',
        ]}
      />
    </LessonArticle>
  )
}
