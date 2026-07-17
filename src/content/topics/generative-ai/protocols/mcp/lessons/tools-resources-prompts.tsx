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

export function ToolsResourcesPrompts() {
  return (
    <LessonArticle>
      <Definition term="Tools, Resources, and Prompts">
        <p>
          These are MCP’s <strong className="text-white">core primitives</strong> — the three kinds of
          capability a server can advertise to a client.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: a workshop. <strong className="text-white">Tools</strong> are power tools you run.{" "}
          <strong className="text-white">Resources</strong> are labeled drawers of materials.{" "}
          <strong className="text-white">Prompts</strong> are laminated instruction cards for common jobs.
        </p>
      </Definition>

      <Callout variant="beginner" title="Pick the right primitive">
        Need an action with side effects? Tool. Need to read context? Resource. Need a reusable starting
        template? Prompt.
      </Callout>

      <LessonSection title="Tools — actions">
        <p className="text-slate-300">
          A <strong className="text-white">tool</strong> has a name, description, and input schema. The model
          (via the host) calls it; the server runs code and returns a result.
        </p>
        <CodeBlock title="Conceptual tool advertisement">
{`name: search_docs
description: Search the internal wiki
input: { query: string, limit?: number }`}
        </CodeBlock>
        <Callout variant="insight" title="Jargon: side effect">
          A <strong className="text-white">side effect</strong> changes the world (send email, delete row).
          Prefer tools for those; keep reads as resources when you can.
        </Callout>
      </LessonSection>

      <LessonSection title="Resources — readable context">
        <p className="text-slate-300">
          A <strong className="text-white">resource</strong> is addressable data (often a URI) the client can
          fetch into context — files, configs, dataset slices — without inventing a new “read_X” tool every
          time.
        </p>
        <Example title="Resource mental model">
{`resource://project/README.md
resource://db/customers/schema
→ host may attach contents to the prompt window`}
        </Example>
        <ContentStep number={1} title="List">
          <p className="text-slate-300">Client asks what resources exist (or templates for parameterized ones).</p>
        </ContentStep>
        <ContentStep number={2} title="Read">
          <p className="text-slate-300">Client fetches content for selected URIs into the session.</p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Prompts — reusable starters">
        <p className="text-slate-300">
          <strong className="text-white">Prompts</strong> are named templates (often with arguments) that
          produce a structured message sequence — e.g. “incident triage” or “PR review checklist.”
        </p>
        <Flowchart
          title="Three primitives, three jobs"
          chart={`flowchart TB
  Q[What do you need?] --> T[Tool<br/>execute an action]
  Q --> R[Resource<br/>read context]
  Q --> P[Prompt<br/>start a guided workflow]`}
        />
        <Example title="Prompt template idea">
{`name: code_review
args: { pr_url, focus }
→ fills a multi-message review checklist for the host`}
        </Example>
      </LessonSection>

      <LessonSection title="How they work together">
        <Flowchart
          title="A typical coding-assistant flow"
          chart={`flowchart TB
  A[User opens chat] --> B[Prompt: debug_session]
  B --> C[Resource: stacktrace.log]
  C --> D[Tool: search_codebase]
  D --> E[Tool: apply_patch]
  E --> F[Answer to user]`}
        />
        <Callout variant="tip" title="Design hygiene">
          Keep tool names boring and specific. Vague mega-tools (
          <span className="font-mono text-sm text-genai-400">do_anything</span>) are hard to authorize and
          harder for models to call correctly.
        </Callout>
      </LessonSection>

      <LessonSection title="Choosing the right primitive">
        <p className="text-slate-300">
          When designing a server, ask whether the model needs to <strong className="text-white">change</strong>{' '}
          something or just <strong className="text-white">see</strong> something. That single question prevents
          half of schema mistakes.
        </p>
        <Flowchart
          title="Primitive decision tree"
          chart={`flowchart TB
  Q[What is the operation?] --> R[Read-only data]
  Q --> A[Action with side effects]
  Q --> W[Guided multi-step starter]
  R --> RES[Resource]
  A --> TOOL[Tool]
  W --> PR[Prompt]
  RES --> C{Parameterized URI?}
  C -->|Yes| RT[Resource template]
  C -->|No| RF[Fixed resource]`}
        />
        <ContentStep number={1} title="Anti-pattern: read tools everywhere">
          <p className="text-slate-300">
            Do not expose{' '}
            <span className="font-mono text-sm text-genai-400">read_file</span>,{' '}
            <span className="font-mono text-sm text-genai-400">read_config</span>, and{' '}
            <span className="font-mono text-sm text-genai-400">read_log</span> as three tools if resources can
            represent the same data with clearer URIs.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Prompts for consistency">
          <p className="text-slate-300">
            Prompts shine when every user should start the same workflow — incident triage, migration checklist,
            security review — with optional arguments.
          </p>
        </ContentStep>
        <Callout variant="info" title="Specs evolve">
          Exact list/read/get method names for resources and prompts vary by MCP version. Learn the three
          primitive <em>roles</em> here; confirm wire details in the{' '}
          <strong className="text-white">current MCP specification</strong>.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Tools = actions with schemas; Resources = readable context; Prompts = reusable starters.',
          'Prefer resources for reads and tools for side-effecting actions when the split is clear.',
          'Servers advertise primitives; hosts decide what the model may see.',
          'Good naming and narrow tools beat one giant “do everything” endpoint.',
        ]}
      />
    </LessonArticle>
  )
}
