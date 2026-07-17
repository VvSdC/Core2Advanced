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

export function ConnectingClientsAndHosts() {
  return (
    <LessonArticle>
      <Definition term="Connecting clients and hosts">
        <p>
          Hosts like <strong className="text-white">Claude Desktop</strong> and IDE assistants (e.g.
          Cursor-style setups) embed an MCP client and read a{' '}
          <strong className="text-white">config</strong> that lists which servers to launch or reach.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: the host is a USB hub. Config entries are “which gadgets to plug in at startup.”
        </p>
      </Definition>

      <Callout variant="beginner" title="Mental model only">
        Exact JSON keys differ by product and change over time. Learn the shape: named server → command/URL →
        env/auth.
      </Callout>

      <LessonSection title="What the host does with config">
        <Flowchart
          title="Host startup → connected servers"
          chart={`flowchart TB
  A[Read MCP config] --> B[For each server entry]
  B --> C{Local or remote?}
  C -->|Local| D[Spawn command stdio]
  C -->|Remote| E[Open HTTP-family session]
  D --> F[Initialize + negotiate]
  E --> F
  F --> G[Tools/resources available to model]`}
        />
        <ContentStep number={1} title="Declare servers">
          <p className="text-slate-300">
            Give each server a stable name used in UI and logs (
            <span className="font-mono text-sm text-genai-400">filesystem</span>,{' '}
            <span className="font-mono text-sm text-genai-400">tickets</span>).
          </p>
        </ContentStep>
        <ContentStep number={2} title="Provide launch or URL">
          <p className="text-slate-300">
            Local: command + args + cwd. Remote: endpoint the client understands for your transport.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Pass secrets via env">
          <p className="text-slate-300">
            API keys belong in environment variables or a secret store — not in chat prompts.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Illustrative config shape">
        <CodeBlock title="Conceptual host config (not a product-specific schema)">
{`{
  "mcpServers": {
    "demo": {
      "command": "node",
      "args": ["./servers/demo.js"],
      "env": { "API_KEY": "..." }
    },
    "remote-tools": {
      "url": "https://tools.example.com/mcp"
    }
  }
}`}
        </CodeBlock>
        <Example title="What you should verify in the UI">
{`1) Server shows as connected
2) Tool names appear
3) A test call succeeds
4) Disconnect removes those tools`}
        </Example>
      </LessonSection>

      <LessonSection title="Client responsibilities inside the host">
        <Flowchart
          title="Client jobs"
          chart={`flowchart TB
  A[Manage connections] --> B[Negotiate capabilities]
  B --> C[Cache tool / resource lists]
  C --> D[Translate model tool calls]
  D --> E[Enforce host allowlists]
  E --> F[Return results to the model]`}
        />
        <Callout variant="insight" title="Jargon: allowlist">
          An <strong className="text-white">allowlist</strong> is an explicit set of permitted servers or
          tools. Prefer allowlists over “connect everything on the machine.”
        </Callout>
        <Callout variant="tip" title="Debugging tip">
          When a tool “vanishes,” check: process crashed, config typo, failed initialize, or host policy
          hiding it — not only the model prompt.
        </Callout>
      </LessonSection>

      <LessonSection title="Hosts you will meet">
        <p className="text-slate-300">
          The connection pattern is the same; config file location and JSON shape differ. Always read the host’s
          MCP docs — Claude Desktop, IDE assistants, and agent frameworks each wrap the client slightly
          differently.
        </p>
        <Flowchart
          title="Same protocol, different hosts"
          chart={`flowchart TB
  S[Your MCP server] --> C[MCP protocol]
  C --> H1[Claude Desktop]
  C --> H2[IDE assistant]
  C --> H3[Agent framework runner]
  H1 --> U1[End user chat]
  H2 --> U2[Developer in editor]
  H3 --> U3[Automated workflow]`}
        />
        <ContentStep number={1} title="Desktop apps">
          <p className="text-slate-300">
            Often use stdio entries in a JSON config the app reads at startup. Good for personal productivity
            servers.
          </p>
        </ContentStep>
        <ContentStep number={2} title="IDEs">
          <p className="text-slate-300">
            May scope servers per workspace, merge with project roots, and show tool status in a sidebar — same
            initialize/list/call underneath.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Agent runners">
          <p className="text-slate-300">
            Connect servers programmatically at graph startup; env vars usually come from deployment secrets,
            not checked-in config files.
          </p>
        </ContentStep>
        <Callout variant="insight" title="Jargon: transport-agnostic client">
          A well-built <strong className="text-white">MCP client</strong> should treat stdio and HTTP the same
          after connect — only the connector module changes.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Hosts embed clients and start servers from configuration.',
          'Mental model: name → command/URL → env; product JSON differs.',
          'Clients negotiate, list, translate model calls, and enforce policy.',
          'Verify connection in the UI before blaming the model for missing tools.',
        ]}
      />
    </LessonArticle>
  )
}
