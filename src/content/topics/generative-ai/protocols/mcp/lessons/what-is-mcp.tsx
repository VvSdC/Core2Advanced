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

export function WhatIsMcp() {
  return (
    <LessonArticle>
      <Definition term="Model Context Protocol (MCP)">
        <p>
          <strong className="text-white">MCP</strong> is an{' '}
          <strong className="text-white">open standard</strong> (originated by Anthropic) for connecting AI
          apps and agents to <strong className="text-white">tools</strong>,{' '}
          <strong className="text-white">data</strong>, and <strong className="text-white">prompts</strong> in a
          shared, interoperable way.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: USB for AI tools. Before USB, every mouse and keyboard needed a custom plug. With USB, one
          port speaks one language. MCP aims to do that for model ↔ context connections.
        </p>
      </Definition>

      <Callout variant="beginner" title="One sentence version">
        MCP lets an AI host discover and use external capabilities (files, APIs, databases, prompt templates)
        through a standard handshake instead of one-off integrations.
      </Callout>

      <LessonSection title="What problem does MCP solve?">
        <p className="text-slate-300">
          Without a protocol, every AI product reinvents how to expose a calendar API, a repo, or a wiki. That
          is the classic <strong className="text-white">N×M</strong> problem: N apps × M integrations = chaos.
          A standard shrinks that to N + M: apps implement a client once; tools expose a server once.
        </p>
        <Flowchart
          title="From custom wires to a shared protocol"
          chart={`flowchart TB
  A[AI app / agent] --> B[MCP client]
  B --> C[MCP protocol]
  C --> D[MCP server A<br/>tools + data]
  C --> E[MCP server B<br/>prompts + files]
  C --> F[MCP server C<br/>APIs]`}
        />
      </LessonSection>

      <LessonSection title="Three core primitives">
        <ContentStep number={1} title="Tools">
          <p className="text-slate-300">
            Actions the model can invoke — e.g.{' '}
            <span className="font-mono text-sm text-genai-400">search_docs</span>,{' '}
            <span className="font-mono text-sm text-genai-400">create_ticket</span>. Think “buttons the AI can
            press.”
          </p>
        </ContentStep>
        <ContentStep number={2} title="Resources">
          <p className="text-slate-300">
            Readable context (files, records, URIs) the host can pull into the conversation. Think “documents
            on a shelf,” not always an action.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Prompts">
          <p className="text-slate-300">
            Reusable prompt templates / workflows a server can offer so clients start tasks consistently.
          </p>
        </ContentStep>
        <Example title="Mental model">
{`Tools     → do something   (write a file, call an API)
Resources → read something (open a doc, list rows)
Prompts   → start something (a guided checklist template)`}
        </Example>
      </LessonSection>

      <LessonSection title="Who uses MCP today?">
        <p className="text-slate-300">
          You will see MCP in <strong className="text-white">Claude Desktop</strong>, IDE assistants (e.g.
          Cursor-style hosts), and agent frameworks that attach tool servers. Specs evolve — always check the
          current MCP specification for exact message shapes and transports.
        </p>
        <CodeBlock title="Conceptual shape (not a pinned SDK)">
{`// Host starts an MCP client → talks to a server
// Server advertises: tools, resources, prompts
// Model (via host) can call tools / read resources`}
        </CodeBlock>
        <Callout variant="insight" title="MCP vs A2A">
          <strong className="text-white">MCP</strong> connects a model/app to tools and context.{' '}
          <strong className="text-white">A2A</strong> (agent-to-agent) connects agents to each other. They
          complement; they are not rivals.
        </Callout>
      </LessonSection>

      <LessonSection title="Learning map — Protocols → MCP">
        <Flowchart
          title="MCP track map"
          chart={`flowchart TB
  A[1. Foundations<br/>what / why / vs tools / roles] --> B[2. Core<br/>primitives / JSON-RPC / transports]
  B --> C[3. Building<br/>server / clients / security]
  C --> D[4. Advanced<br/>multi-server / A2A / mastery]`}
        />
      </LessonSection>

      <LessonSection title="When MCP is the right tool">
        <p className="text-slate-300">
          Reach for MCP when you want <strong className="text-white">reusable tool servers</strong> that plug
          into multiple AI hosts — not when you only need one hard-coded API call inside a single script.
        </p>
        <ContentStep number={1} title="Good fit">
          <p className="text-slate-300">
            A team ships a docs search server once; Claude Desktop, an IDE, and an internal agent runner all
            consume it without rewriting connectors.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Overkill">
          <p className="text-slate-300">
            A one-off notebook that calls one REST endpoint for one demo — function calling or plain HTTP is
            enough.
          </p>
        </ContentStep>
        <Flowchart
          title="Should I use MCP?"
          chart={`flowchart TB
  Q[Will multiple hosts reuse this capability?] -->|Yes| M[Consider MCP server]
  Q -->|No| F[Function calling or direct API]
  M --> S[Will you expose tools/resources/prompts?]
  S -->|Yes| G[Build MCP server]
  S -->|No| R[Rethink — MCP shines on discoverable primitives]`}
        />
        <Callout variant="tip" title="Open standard, open ecosystem">
          Because MCP is an <strong className="text-white">open standard</strong> (Anthropic-originated, now
          community-driven), you are not locked to one vendor’s chat API — but always verify host support and
          the <strong className="text-white">current MCP specification</strong> before you bet a product on it.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'MCP is an open standard (Anthropic-originated) for AI apps ↔ tools, data, and prompts.',
          'USB analogy: one protocol, many pluggable servers instead of custom plugs.',
          'Core primitives: Tools, Resources, Prompts.',
          'Complements A2A; used by Claude Desktop, IDEs, and agent frameworks — check current spec details.',
        ]}
      />
    </LessonArticle>
  )
}
