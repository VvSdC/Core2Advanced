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

export function BuildingYourFirstMcpServer() {
  return (
    <LessonArticle>
      <Definition term="Your first MCP server">
        <p>
          A minimal MCP server advertises at least one <strong className="text-white">tool</strong>, answers
          the initialize handshake, and executes that tool when called. SDKs differ by language — this lesson
          is a <strong className="text-white">walkthrough of ideas</strong>, not a pinned package version.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: build one USB gadget that only has a single button labeled{' '}
          <span className="font-mono text-sm text-genai-400">echo</span>. Once that works, add real tools.
        </p>
      </Definition>

      <Callout variant="beginner" title="Success criteria">
        Host connects → sees your tool → calls it → gets a string back. Celebrate that before adding databases.
      </Callout>

      <LessonSection title="Walkthrough steps">
        <Flowchart
          title="Minimal server build path"
          chart={`flowchart TB
  A[Pick SDK / language] --> B[Implement initialize]
  B --> C[Advertise one tool]
  C --> D[Handle tools/call]
  D --> E[Run under stdio]
  E --> F[Point a host at it]`}
        />
        <ContentStep number={1} title="Choose a stack">
          <p className="text-slate-300">
            Official and community SDKs exist for popular languages. Prefer a maintained SDK over hand-rolling
            JSON-RPC framing on day one.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Implement handshake">
          <p className="text-slate-300">
            Respond to initialize with server info and capabilities (at least tools).
          </p>
        </ContentStep>
        <ContentStep number={3} title="Register a tiny tool">
          <p className="text-slate-300">
            Name, description, input schema — keep args simple (one string is enough).
          </p>
        </ContentStep>
        <ContentStep number={4} title="Execute and return">
          <p className="text-slate-300">
            On tools/call, validate inputs, run logic, return text (or structured content per your SDK).
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Illustrative pseudo-server">
        <CodeBlock title="Conceptual — not version-fragile SDK code">
{`on initialize:
  return { name: "demo-server", capabilities: { tools: {} } }

on tools/list:
  return [{
    name: "echo",
    description: "Return the same text",
    inputSchema: { message: string }
  }]

on tools/call(name="echo", arguments):
  return text(arguments.message)`}
        </CodeBlock>
        <Example title="What the model might do">
{`User: "Ping the echo tool with hello"
Model → echo(message="hello")
Server → "hello"
Model → "The echo tool returned hello."`}
        </Example>
      </LessonSection>

      <LessonSection title="Local run checklist">
        <Flowchart
          title="Debug loop"
          chart={`flowchart TB
  A[Start server via host config] --> B{Initialize OK?}
  B -->|No| C[Check logs / framing]
  C --> A
  B -->|Yes| D{Tool listed?}
  D -->|No| E[Fix tools/list]
  E --> A
  D -->|Yes| F[Call tool from chat]
  F --> G{Result OK?}
  G -->|No| H[Validate args + errors]
  H --> F
  G -->|Yes| I[Add next real tool]`}
        />
        <Callout variant="tip" title="Practical tips">
          Log every request id and method. Fail with clear errors. Never ship a demo tool that can delete
          files or run shell commands “for convenience.”
        </Callout>
        <Callout variant="info" title="Specs and SDKs evolve">
          Follow the <strong className="text-white">current MCP spec</strong> and your SDK’s quickstart for
          exact APIs — concepts above stay stable even when package names change.
        </Callout>
      </LessonSection>

      <LessonSection title="First-server mistakes to skip">
        <p className="text-slate-300">
          Beginners often over-build before the echo tool works. Ship the smallest safe loop first, then add
          real integrations one tool at a time.
        </p>
        <ContentStep number={1} title="Skipping initialize">
          <p className="text-slate-300">
            Jumping straight to tools/call without a successful handshake produces confusing host errors. Always
            verify initialize in logs first.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Mega first tool">
          <p className="text-slate-300">
            Your v1 tool should not wrap shell access or arbitrary SQL. Prove framing with{' '}
            <span className="font-mono text-sm text-genai-400">echo</span> or{' '}
            <span className="font-mono text-sm text-genai-400">ping</span>, then add narrow real tools.
          </p>
        </ContentStep>
        <Flowchart
          title="Expand safely"
          chart={`flowchart TB
  A[echo tool works] --> B[One read-only real tool]
  B --> C[One write tool with approval]
  C --> D[Resources for large reads]
  D --> E[Prompts for workflows]`}
        />
        <Example title="Host config smoke test">
{`1. Add server to Claude Desktop / IDE config
2. Restart host — server shows connected
3. Ask model to call echo with a test string
4. Only then add search_docs or similar`}
        </Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'First server goal: initialize + one safe tool + successful call.',
          'Use an SDK; treat framing and method names as conceptual until you pin a version.',
          'stdio + host config is the usual local learning path.',
          'Clear logs and narrow tools beat clever mega-servers early on.',
        ]}
      />
    </LessonArticle>
  )
}
