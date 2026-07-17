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

export function SecurityAuthAndPermissions() {
  return (
    <LessonArticle>
      <Definition term="MCP security basics">
        <p>
          MCP servers can reach files, APIs, and actions with real impact. Treat every connection with{' '}
          <strong className="text-white">least privilege</strong>, strong <strong className="text-white">auth</strong>,
          and deliberate tool gating — never expose dangerous tools blindly.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: USB is convenient; that does not mean you plug unknown sticks into a production laptop. The
          same caution applies to MCP servers.
        </p>
      </Definition>

      <Callout variant="beginner" title="Default posture">
        Deny by default. Allow specific servers and tools. Prefer read-only until a write is justified.
      </Callout>

      <LessonSection title="Threats to keep in mind">
        <ContentStep number={1} title="Over-privileged tools">
          <p className="text-slate-300">
            A single <span className="font-mono text-sm text-genai-400">run_shell</span> tool can undo months
            of careful app security.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Confused deputy">
          <p className="text-slate-300">
            The model may be coaxed into calling a legitimate tool with malicious arguments (prompt injection
            → tool abuse).
          </p>
        </ContentStep>
        <ContentStep number={3} title="Secret leakage">
          <p className="text-slate-300">
            Tools that dump env vars or broad files can exfiltrate keys into the chat transcript.
          </p>
        </ContentStep>
        <Flowchart
          title="Injection → tool risk"
          chart={`flowchart TB
  A[Untrusted content in context] --> B[Model chooses a tool]
  B --> C{Host policy allows?}
  C -->|No| D[Block / ask user]
  C -->|Yes| E[Server executes]
  E --> F[Side effects / data out]`}
        />
      </LessonSection>

      <LessonSection title="Practical controls">
        <Example title="Least privilege checklist">
{`- Separate read vs write tools
- Scope filesystem to project roots
- Short-lived tokens for remote APIs
- Human approval for destructive actions
- Audit logs: who/what/when/args`}
        </Example>
        <CodeBlock title="Conceptual policy layer">
{`allow:
  - server: docs   tools: [search_docs]
  - server: repo   tools: [read_file, list_dir]
deny:
  - tools: [run_shell, delete_*]
require_approval:
  - tools: [send_email, transfer_funds]`}
        </CodeBlock>
        <Callout variant="insight" title="Jargon: least privilege">
          <strong className="text-white">Least privilege</strong> means granting only the minimum access needed
          for the task — not admin “just in case.”
        </Callout>
      </LessonSection>

      <LessonSection title="Auth for remote servers">
        <Flowchart
          title="Remote auth sketch"
          chart={`flowchart TB
  H[Host client] --> T[TLS]
  T --> A[Auth token / OAuth / mTLS]
  A --> S[MCP server]
  S --> P[Per-tool authorization]
  P --> API[Downstream APIs]`}
        />
        <ContentStep number={1} title="Authenticate the client">
          <p className="text-slate-300">Know which host/tenant is calling before any tool runs.</p>
        </ContentStep>
        <ContentStep number={2} title="Authorize each action">
          <p className="text-slate-300">
            Connection auth ≠ permission to delete production data. Check scopes per tool.
          </p>
        </ContentStep>
        <Callout variant="tip" title="Do not expose dangerous tools blindly">
          If a tool can run arbitrary code, move money, or wipe storage, it needs strong gating — or it should
          not be an MCP tool at all.
        </Callout>
      </LessonSection>

      <LessonSection title="Local stdio is still powerful">
        <p className="text-slate-300">
          Remote MCP gets most security attention, but <strong className="text-white">stdio servers run as the
          user</strong> on the laptop. A malicious or over-privileged local server can read any file the OS
          allows — same USB caution applies.
        </p>
        <Flowchart
          title="Local vs remote trust"
          chart={`flowchart TB
  L[stdio server] --> O[OS user permissions]
  R[Remote HTTP server] --> T[TLS + token auth]
  T --> P[Per-tenant policy]
  O --> H[Host allowlist still required]
  P --> H`}
        />
        <ContentStep number={1} title="Only install trusted servers">
          <p className="text-slate-300">
            Treat third-party MCP configs like installing browser extensions — review command, args, and env
            before enabling.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Separate prod credentials">
          <p className="text-slate-300">
            Dev MCP configs should not point at production databases. Use read-only clones and synthetic data
            in chat-driven workflows.
          </p>
        </ContentStep>
        <Example title="Approval pattern">
{`Tool: delete_branch
Host: "Allow once" / "Always for this repo" / "Deny"
→ user stays in the loop for irreversible actions`}
        </Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'MCP expands the attack surface: treat servers like plugins with power.',
          'Least privilege, allowlists, and approvals beat “trust the model.”',
          'Auth identifies the caller; per-tool authorization limits what it can do.',
          'Log privileged calls; never ship unrestricted shell/file wipe tools by default.',
        ]}
      />
    </LessonArticle>
  )
}
