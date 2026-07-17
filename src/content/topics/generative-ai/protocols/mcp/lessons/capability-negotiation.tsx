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

export function CapabilityNegotiation() {
  return (
    <LessonArticle>
      <Definition term="Capability negotiation">
        <p>
          Before useful work, client and server perform an{' '}
          <strong className="text-white">initialize handshake</strong>: they exchange protocol version info and{' '}
          <strong className="text-white">advertised capabilities</strong> so each side knows what the other
          supports.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: two diplomats exchanging credentials and a menu of topics they are allowed to discuss —
          then the meeting starts.
        </p>
      </Definition>

      <Callout variant="beginner" title="One sentence">
        Initialize = “here is who I am and what I can do”; after that, list/call tools and resources safely.
      </Callout>

      <LessonSection title="Handshake flow">
        <Flowchart
          title="Initialize then work"
          chart={`flowchart TB
  A[Connect transport] --> B[initialize request]
  B --> C[initialize result<br/>capabilities + version]
  C --> D[initialized notification]
  D --> E[tools/list resources/list ...]
  E --> F[Normal tool / resource use]`}
        />
        <ContentStep number={1} title="Connect">
          <p className="text-slate-300">stdio spawn or HTTP session — the pipe comes up first.</p>
        </ContentStep>
        <ContentStep number={2} title="Initialize">
          <p className="text-slate-300">
            Parties share protocol version expectations and capability flags (e.g. whether tools, resources,
            prompts, sampling, roots are in play).
          </p>
        </ContentStep>
        <ContentStep number={3} title="Operate">
          <p className="text-slate-300">
            Only call methods both sides agreed they support. Avoid assuming every server has every primitive.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="What “capabilities” means">
        <p className="text-slate-300">
          Capabilities are <strong className="text-white">feature advertisements</strong>, not the full tool
          catalog. Think “I support the tools feature” vs “here are my 12 tools” (which comes from list
          methods afterward).
        </p>
        <CodeBlock title="Conceptual initialize sketch">
{`initialize → {
  protocolVersion: "...",
  capabilities: {
    tools: {},
    resources: {},
    prompts: {}
  },
  clientInfo / serverInfo: { name, version }
}`}
        </CodeBlock>
        <Example title="Mismatch handling">
{`Client wants prompts; server advertises only tools
→ skip prompt APIs; still use tools
→ do not crash the host`}
        </Example>
      </LessonSection>

      <LessonSection title="Why negotiation exists">
        <Flowchart
          title="Without vs with negotiation"
          chart={`flowchart TB
  A[No handshake] --> B[Blind calls]
  B --> C[Mystery failures]
  D[Negotiated capabilities] --> E[Feature-gated calls]
  E --> F[Clear unsupported paths]`}
        />
        <Callout variant="insight" title="Jargon: negotiation">
          <strong className="text-white">Negotiation</strong> means both peers declare support and proceed on
          the intersection — like agreeing on TLS ciphers, not hoping the other side guessed right.
        </Callout>
        <Callout variant="tip" title="Specs evolve">
          Capability field names and optional features change as MCP grows. Teach your team the handshake{' '}
          <em>idea</em>; pin implementations to a documented protocol version and re-read the{' '}
          <strong className="text-white">current MCP spec</strong>.
        </Callout>
      </LessonSection>

      <LessonSection title="Protocol version and graceful degradation">
        <p className="text-slate-300">
          Initialize is also where peers agree on a <strong className="text-white">protocol version</strong>.
          If the client expects features the server lacks, the host should hide or stub those paths instead of
          sending doomed requests.
        </p>
        <Flowchart
          title="Version mismatch handling"
          chart={`flowchart TB
  A[Client sends initialize] --> B{Server version OK?}
  B -->|Yes| C[Full feature set]
  B -->|Partial| D[Intersection only]
  B -->|No| E[Fail with clear error]
  D --> F[Skip unsupported list/call methods]
  C --> G[Normal operation]`}
        />
        <ContentStep number={1} title="Advertise honestly">
          <p className="text-slate-300">
            Servers should not claim tools support if tools/list is unimplemented — hosts rely on capability
            flags to build UI and model tool lists.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Retry after reconnect">
          <p className="text-slate-300">
            If a server hot-reloads, it may send list-changed notifications. Clients should refresh caches
            instead of assuming the first list is forever.
          </p>
        </ContentStep>
        <Example title="Graceful skip">
{`Server capabilities: { tools: {} } only
→ client never calls prompts/get
→ user still gets working search_docs tool`}
        </Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Initialize handshake exchanges version + advertised capabilities before work.',
          'Capabilities = feature support; list methods = concrete tools/resources/prompts.',
          'Call only what both sides support; degrade gracefully otherwise.',
          'Protocol versions matter — check the live specification when shipping.',
        ]}
      />
    </LessonArticle>
  )
}
