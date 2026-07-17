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

export function SamplingRootsAndContext() {
  return (
    <LessonArticle>
      <Definition term="Sampling, roots, and richer context">
        <p>
          Beyond tools/resources/prompts, MCP discussions often include advanced ideas such as{' '}
          <strong className="text-white">sampling</strong> (servers asking the host/model to generate text)
          and <strong className="text-white">roots</strong> (boundaries for filesystem or workspace context).
          Exact surfaces evolve — learn the <em>intent</em> in plain English.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: tools are outbound phone calls from the model. Sampling can be a callback — the server
          asking the host’s model for help. Roots are the fence around the yard the server may play in.
        </p>
      </Definition>

      <Callout variant="beginner" title="Do not panic">
        Many useful servers only need tools + resources. Treat sampling/roots as power features you unlock
        when the basic path is solid.
      </Callout>

      <LessonSection title="Sampling — in plain English">
        <p className="text-slate-300">
          <strong className="text-white">Sampling</strong> means a server can request a model completion from
          the host (subject to user/host policy). That lets a tool server draft text without embedding its own
          model API keys — the host remains the model gateway.
        </p>
        <Flowchart
          title="Sampling idea"
          chart={`flowchart TB
  A[Server needs LLM help] --> B[sampling request to host]
  B --> C[Host policy check]
  C -->|Allowed| D[Host model generates]
  D --> E[Text returns to server]
  C -->|Denied| F[Server falls back / errors]`}
        />
        <Callout variant="insight" title="Jargon: host-mediated">
          <strong className="text-white">Host-mediated</strong> means the desktop/IDE app stays in control of
          model access, billing, and consent — servers do not silently call a raw LLM API.
        </Callout>
      </LessonSection>

      <LessonSection title="Roots — boundaries for context">
        <p className="text-slate-300">
          <strong className="text-white">Roots</strong> describe workspace or filesystem boundaries the client
          shares so servers know which project trees are in scope. Think “these folders are the allowed
          garden,” not the entire disk.
        </p>
        <Example title="Why roots matter">
{`Without roots: server might assume C:\\ or /
With roots: only /Users/you/project is in play
→ fewer accidental path escapes`}
        </Example>
        <ContentStep number={1} title="Host declares roots">
          <p className="text-slate-300">Client informs servers which URIs/paths define the workspace.</p>
        </ContentStep>
        <ContentStep number={2} title="Server respects them">
          <p className="text-slate-300">File tools resolve relative to roots; refuse paths outside policy.</p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Context assembly (the bigger picture)">
        <Flowchart
          title="How context reaches the model"
          chart={`flowchart TB
  R[Resources + roots] --> H[Host context window]
  P[Prompts] --> H
  T[Tool results] --> H
  S[Sampling drafts] --> T
  H --> M[Model reply]`}
        />
        <CodeBlock title="Conceptual checklist for advanced servers">
{`[ ] tools work without sampling
[ ] resources scoped to roots
[ ] sampling only if host allows
[ ] never assume full disk access
[ ] log every privileged call`}
        </CodeBlock>
        <Callout variant="tip" title="Specs evolve">
          Feature names and optionality change. Read the{' '}
          <strong className="text-white">current MCP specification</strong> before relying on sampling or
          roots in production.
        </Callout>
      </LessonSection>

      <LessonSection title="When to adopt advanced primitives">
        <p className="text-slate-300">
          Start with tools and resources. Add <strong className="text-white">roots</strong> when filesystem
          scope matters. Add <strong className="text-white">sampling</strong> only when a server truly needs
          host-mediated model text — not as a shortcut to embed your own API key.
        </p>
        <Flowchart
          title="Adoption ladder"
          chart={`flowchart TB
  A[Tools only] --> B[+ Resources for reads]
  B --> C[+ Roots for path safety]
  C --> D[+ Sampling if policy allows]
  D --> E[Re-check spec each release]`}
        />
        <ContentStep number={1} title="Roots without sampling">
          <p className="text-slate-300">
            A filesystem server should honor roots even if it never requests sampling — that alone prevents
            many path traversal mistakes.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Sampling with guardrails">
          <p className="text-slate-300">
            Hosts should treat sampling like a privileged tool: allowlist which servers may ask, cap tokens, and
            log every request for audit.
          </p>
        </ContentStep>
        <Example title="Skip sampling initially">
{`Tool: summarize_log(path)
Implementation: read file via resource, return text
→ no server-side LLM call needed
→ simpler, cheaper, easier to secure`}
        </Example>
        <Callout variant="insight" title="Jargon: roots vs resources">
          <strong className="text-white">Roots</strong> define <em>where</em> the workspace lives;{' '}
          <strong className="text-white">resources</strong> are <em>what</em> can be read inside that scope.
          Both help the host assemble context safely.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Sampling ≈ server asking the host’s model for text (policy-gated).',
          'Roots ≈ workspace boundaries for safer filesystem/context access.',
          'Most servers start with tools/resources; add advanced primitives later.',
          'Host mediation keeps consent, billing, and allowlists centralized.',
        ]}
      />
    </LessonArticle>
  )
}
