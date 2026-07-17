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

export function JsonRpcMessageModel() {
  return (
    <LessonArticle>
      <Definition term="JSON-RPC style messages">
        <p>
          MCP exchanges are modeled in a <strong className="text-white">JSON-RPC</strong>-style way: structured
          JSON messages with a method name, parameters, and correlated responses (or notifications without a
          reply).
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: a restaurant ticket system. Each ticket has an ID, a dish name (method), and ingredients
          (params). The kitchen returns a plated dish tagged with the same ID — or shouts a one-way update
          (“order ready”) as a notification.
        </p>
      </Definition>

      <Callout variant="beginner" title="Why this matters">
        You do not need to memorize every field. You need to recognize requests, results, errors, and
        notifications so logs and SDKs make sense.
      </Callout>

      <LessonSection title="Message kinds">
        <ContentStep number={1} title="Request">
          <p className="text-slate-300">
            Client or server asks for work: method + params + id. Expect a matching response.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Response">
          <p className="text-slate-300">
            Success <span className="font-mono text-sm text-genai-400">result</span> or structured{' '}
            <span className="font-mono text-sm text-genai-400">error</span>, same id.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Notification">
          <p className="text-slate-300">
            One-way event (no id / no reply expected) — e.g. capability or list changed.
          </p>
        </ContentStep>
        <Flowchart
          title="Request / response pairing"
          chart={`flowchart TB
  A[Request id=7<br/>tools/call] --> B[Server runs tool]
  B --> C[Response id=7<br/>result or error]
  D[Notification<br/>list changed] --> E[Peer updates cache]
  E --> F[No response required]`}
        />
      </LessonSection>

      <LessonSection title="Illustrative shapes">
        <CodeBlock title="Conceptual request (not a pinned schema)">
{`{
  "jsonrpc": "2.0",
  "id": 7,
  "method": "tools/call",
  "params": {
    "name": "search_docs",
    "arguments": { "query": "MCP transports" }
  }
}`}
        </CodeBlock>
        <CodeBlock title="Conceptual success response">
{`{
  "jsonrpc": "2.0",
  "id": 7,
  "result": { "content": [{ "type": "text", "text": "..." }] }
}`}
        </CodeBlock>
        <Example title="Error idea">
{`Same id, error object with code + message
→ host can show “tool failed” without hanging the session`}
        </Example>
      </LessonSection>

      <LessonSection title="What lives above the envelope">
        <p className="text-slate-300">
          JSON-RPC is the <strong className="text-white">envelope</strong>. MCP defines the{' '}
          <strong className="text-white">methods</strong> (initialize, tools/list, tools/call, resources/read,
          …) and the meaning of params/results. Transports (stdio, HTTP-family) carry those bytes.
        </p>
        <Flowchart
          title="Layers"
          chart={`flowchart TB
  A[MCP methods<br/>tools resources prompts] --> B[JSON-RPC-style envelope]
  B --> C[Transport<br/>stdio / SSE / Streamable HTTP]
  C --> D[Bytes on the wire]`}
        />
        <Callout variant="tip" title="Specs evolve">
          Exact method names and payload fields can change across MCP revisions. Treat examples as conceptual;
          confirm against the <strong className="text-white">current MCP spec</strong> when implementing.
        </Callout>
      </LessonSection>

      <LessonSection title="Reading logs like a protocol engineer">
        <p className="text-slate-300">
          When debugging MCP, scan for <strong className="text-white">method</strong>,{' '}
          <strong className="text-white">id</strong>, and <strong className="text-white">error code</strong>{' '}
          before rewriting prompts. Most failures are handshake, auth, or schema — not “the model forgot.”
        </p>
        <Flowchart
          title="Log triage order"
          chart={`flowchart TB
  A[See error in host] --> B[Find request id]
  B --> C[Match response or timeout]
  C --> D{method?}
  D -->|initialize| E[Version / capabilities]
  D -->|tools/call| F[Args / server bug / policy]
  D -->|resources/read| G[URI / permissions]`}
        />
        <Example title="Fake log snippet">
{`→ id=12 method=tools/call name=search_docs
← id=12 error: invalid params (missing query)
Fix: schema docs + clearer tool description, not new system prompt`}
        </Example>
        <ContentStep number={1} title="Notifications are easy to miss">
          <p className="text-slate-300">
            One-way notifications will not have a matching response line — if your client only logs
            request/response pairs, you may miss list-changed events.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Bidirectional traffic">
          <p className="text-slate-300">
            Some advanced flows (e.g. sampling) may involve server-initiated requests toward the host. Same
            JSON-RPC envelope rules apply — correlate ids when a reply is expected.
          </p>
        </ContentStep>
      </LessonSection>

      <KeyTakeaways
        items={[
          'MCP uses JSON-RPC-style requests, responses, and notifications.',
          'IDs correlate a call with its result or error.',
          'Envelope (JSON-RPC) ≠ semantics (MCP methods) ≠ transport (how bytes move).',
          'Read logs by method + id; verify field details in the live specification.',
        ]}
      />
    </LessonArticle>
  )
}
