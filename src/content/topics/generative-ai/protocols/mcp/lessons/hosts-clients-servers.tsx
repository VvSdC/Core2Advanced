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

export function HostsClientsServers() {
  return (
    <LessonArticle>
      <Definition term="Host, Client, and Server">
        <p>
          MCP splits roles like USB: the <strong className="text-white">host</strong> is the AI app the user
          sees; it embeds an <strong className="text-white">MCP client</strong> that speaks the protocol; an{' '}
          <strong className="text-white">MCP server</strong> exposes tools, resources, and prompts.
        </p>
        <p className="mt-2 text-slate-300">
          Jargon: <strong className="text-white">server</strong> here does not always mean “a website.” A
          local process talking over stdio is still an MCP server.
        </p>
      </Definition>

      <Callout variant="beginner" title="Remember the triangle">
        User ↔ Host (with Client) ↔ Server(s). The model lives inside the host’s world; tools live on servers.
      </Callout>

      <LessonSection title="Roles at a glance">
        <Flowchart
          title="Host / Client / Server"
          chart={`flowchart TB
  U[User] --> H[Host<br/>Claude Desktop / IDE / agent app]
  H --> M[Model]
  H --> C[MCP Client]
  C --> S1[MCP Server<br/>filesystem]
  C --> S2[MCP Server<br/>tickets API]
  C --> S3[MCP Server<br/>prompt pack]`}
        />
        <ContentStep number={1} title="Host">
          <p className="text-slate-300">
            Owns UX, auth to the user, conversation state, and policy (which servers are allowed). Examples:
            Claude Desktop, IDE assistants, custom agent UIs.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Client">
          <p className="text-slate-300">
            Library/component inside the host that opens connections, runs the initialize handshake, lists
            capabilities, and forwards tool/resource calls.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Server">
          <p className="text-slate-300">
            Implements MCP and advertises primitives. Can be local (stdio) or remote (HTTP-family transports).
            One host often talks to many servers.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Who does what on a tool call?">
        <Flowchart
          title="Call path"
          chart={`flowchart TB
  A[User asks a question] --> B[Host + model decide a tool is needed]
  B --> C[Client sends tools/call]
  C --> D[Server executes]
  D --> E[Result returns to client]
  E --> F[Host feeds result to model]
  F --> G[User sees answer]`}
        />
        <Example title="Concrete story">
{`User: "Open README and summarize"
Host model → needs read_file
Client → MCP server "filesystem"
Server → returns README text
Model → writes summary in the chat UI`}
        </Example>
      </LessonSection>

      <LessonSection title="Common beginner mix-ups">
        <ContentStep number={1} title="“The model is the MCP client”">
          <p className="text-slate-300">
            Usually false. The <strong className="text-white">host</strong> embeds the client; the model only
            sees tools the host chooses to expose.
          </p>
        </ContentStep>
        <ContentStep number={2} title="“One server per host”">
          <p className="text-slate-300">
            Hosts commonly attach many servers (docs, DB, browser, internal APIs) — a multi-plug USB hub.
          </p>
        </ContentStep>
        <ContentStep number={3} title="“Server must be remote”">
          <p className="text-slate-300">
            Local stdio servers are first-class for desktop/IDE workflows. Remote transports matter for shared
            or cloud-hosted tools.
          </p>
        </ContentStep>
        <Callout variant="tip" title="Design tip">
          Draw the triangle on a whiteboard before coding. If you cannot point to host, client, and server,
          the architecture is fuzzy.
        </Callout>
      </LessonSection>

      <LessonSection title="Connection lifecycle">
        <p className="text-slate-300">
          A healthy host manages servers like apps in a dock: connect, negotiate, list capabilities, call tools,
          and tear down cleanly on exit or config change.
        </p>
        <Flowchart
          title="Server session states"
          chart={`flowchart TB
  A[Configured] --> B[Connecting transport]
  B --> C[Initialize handshake]
  C --> D[Ready — list tools/resources]
  D --> E[Active calls]
  E --> D
  D --> F[Disconnect / crash]
  F --> G[Host removes tools from model view]`}
        />
        <ContentStep number={1} title="Host owns the session">
          <p className="text-slate-300">
            The user talks to the host UI, not to the MCP server directly. Auth, consent, and which servers
            are enabled live in the host.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Client owns the wire">
          <p className="text-slate-300">
            JSON-RPC framing, request ids, and routing tool calls to the right server are client jobs — usually
            a library, not hand-written in every feature.
          </p>
        </ContentStep>
        <Example title="Claude Desktop mental model">
{`User enables "filesystem" server in settings
→ host spawns stdio child
→ client runs initialize
→ chat can use read_file / write_file tools
→ quitting the app kills the child process`}
        </Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Host = AI app; Client = protocol speaker inside the host; Server = tools/resources/prompts.',
          'Servers can be local processes or remote endpoints.',
          'Tool calls flow: model → host/client → server → result → model.',
          'One host typically connects to many MCP servers.',
        ]}
      />
    </LessonArticle>
  )
}
