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

export function TransportsStdioHttp() {
  return (
    <LessonArticle>
      <Definition term="MCP transports">
        <p>
          A <strong className="text-white">transport</strong> is how MCP messages move between client and
          server. Historically you will hear about <strong className="text-white">stdio</strong> for local
          processes, and remote patterns such as <strong className="text-white">SSE</strong> and{' '}
          <strong className="text-white">Streamable HTTP</strong>.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: the language on the postcard (JSON-RPC/MCP) is separate from the delivery service (mail vs
          courier). Same letter, different pipes.
        </p>
      </Definition>

      <Callout variant="beginner" title="Rule of thumb">
        Local desktop/IDE plugins → often stdio. Shared/cloud tools → HTTP-family transports.
      </Callout>

      <LessonSection title="stdio — local process">
        <p className="text-slate-300">
          The host <strong className="text-white">spawns</strong> a server process and talks over standard
          input/output streams. Great for filesystem, local git, or personal API wrappers — no open port
          required.
        </p>
        <Flowchart
          title="stdio path"
          chart={`flowchart TB
  H[Host] --> P[Spawn server process]
  P --> I[stdin / stdout JSON messages]
  I --> S[MCP server logic]
  S --> I
  I --> H`}
        />
        <Example title="Config mental model">
{`command: node
args: ["./my-mcp-server.js"]
→ host starts it; messages on stdio`}
        </Example>
        <Callout variant="insight" title="Jargon: stdio">
          <strong className="text-white">stdio</strong> means standard input and standard output — the same
          pipes terminals use. Here they carry protocol frames, not human typing.
        </Callout>
      </LessonSection>

      <LessonSection title="HTTP-family — remote">
        <ContentStep number={1} title="SSE (historically common)">
          <p className="text-slate-300">
            <strong className="text-white">Server-Sent Events</strong> push a stream of events from server to
            client over HTTP — useful for long-lived remote sessions.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Streamable HTTP">
          <p className="text-slate-300">
            A newer HTTP-oriented transport direction for remote MCP — designed for practical streaming and
            deployment behind normal web infrastructure. Check the current spec for the exact shape.
          </p>
        </ContentStep>
        <Flowchart
          title="Local vs remote choice"
          chart={`flowchart TB
  Q[Where does the tool live?] --> L[On the user machine]
  Q --> R[In your cloud / shared service]
  L --> S[Prefer stdio]
  R --> H[Prefer HTTP-family transport]`}
        />
      </LessonSection>

      <LessonSection title="What stays the same">
        <p className="text-slate-300">
          Regardless of transport, you still do initialize, advertise capabilities, and call tools. Only the{' '}
          <strong className="text-white">pipe</strong> changes.
        </p>
        <CodeBlock title="Conceptual — same method, different pipe">
{`// Local
stdio:  host ↔ child process

// Remote
HTTP:   host ↔ https://tools.example.com/...

// Both carry MCP methods like tools/list`}
        </CodeBlock>
        <Callout variant="tip" title="Security note">
          Remote transports need auth, TLS, and least privilege. Local stdio still needs OS permissions —
          spawning a server is powerful.
        </Callout>
        <Callout variant="info" title="Specs evolve">
          Transport names and requirements have changed as MCP matured. Learn local-vs-remote intent here;
          confirm details in the <strong className="text-white">current MCP specification</strong>.
        </Callout>
      </LessonSection>

      <LessonSection title="Choosing a transport in practice">
        <p className="text-slate-300">
          Pick transport based on <strong className="text-white">trust boundary</strong> and{' '}
          <strong className="text-white">deployment shape</strong>, not hype. Many teams run stdio locally and
          HTTP-family for shared services — both in the same host.
        </p>
        <Flowchart
          title="Transport comparison"
          chart={`flowchart TB
  subgraph stdio[stdio]
    S1[Pros: simple local spawn]
    S2[Cons: one machine only]
  end
  subgraph http[HTTP-family]
    H1[Pros: shared remote tools]
    H2[Cons: auth TLS ops burden]
  end
  Q[Your server] --> stdio
  Q --> http`}
        />
        <ContentStep number={1} title="stdio gotchas">
          <p className="text-slate-300">
            stderr is for logs, stdout is for protocol frames — mixing debug prints into stdout breaks framing.
            Use structured logging on stderr.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Remote gotchas">
          <p className="text-slate-300">
            SSE and Streamable HTTP differ in how sessions persist behind proxies and load balancers. Read
            current transport guidance before picking one for production.
          </p>
        </ContentStep>
        <Example title="Hybrid host">
{`Local:  stdio filesystem + git servers (user laptop)
Remote: Streamable HTTP company CRM server (central auth)
Same MCP methods — different pipes`}
        </Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Transport = delivery pipe; MCP methods are the letter content.',
          'stdio suits local host-spawned servers; HTTP-family suits remote services.',
          'Historically: stdio, SSE, Streamable HTTP — verify current guidance before shipping.',
          'Remote = auth + TLS; local = process and filesystem privilege still matter.',
        ]}
      />
    </LessonArticle>
  )
}
