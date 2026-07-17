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

export function ProductionMcpPatterns() {
  return (
    <LessonArticle>
      <Definition term="Production MCP patterns">
        <p>
          Shipping MCP beyond a laptop means <strong className="text-white">versioning</strong>,{' '}
          <strong className="text-white">observability</strong>, and{' '}
          <strong className="text-white">gating tools</strong> so changes do not silently break hosts or open
          unsafe capabilities.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: a USB gadget sold in stores needs a version sticker, a recall path, and a switch that
          disables the laser, not just a breadboard demo.
        </p>
      </Definition>

      <Callout variant="beginner" title="Production bar">
        If you cannot answer “which server version ran tool X for user Y?”, you are not production-ready.
      </Callout>

      <LessonSection title="Versioning">
        <ContentStep number={1} title="Protocol version">
          <p className="text-slate-300">
            Negotiate MCP protocol versions at initialize; fail loudly on unsupported pairs.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Server semver">
          <p className="text-slate-300">
            Treat tool schema changes as API breaks. Renaming{' '}
            <span className="font-mono text-sm text-genai-400">search</span> →{' '}
            <span className="font-mono text-sm text-genai-400">search_v2</span> needs a migration plan.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Compat windows">
          <p className="text-slate-300">
            Keep old tool names as aliases for one release when hosts cannot update in lockstep.
          </p>
        </ContentStep>
        <CodeBlock title="Conceptual change log entry">
{`server tickets@2.1.0
BREAKING: create_issue requires project_key
ADDED: list_sprints
DEPRECATED: legacy_search (remove in 3.0)`}
        </CodeBlock>
      </LessonSection>

      <LessonSection title="Observability">
        <Flowchart
          title="What to log and trace"
          chart={`flowchart TB
  A[Request id] --> B[Server + tool name]
  B --> C[Latency + status]
  C --> D[Error code]
  D --> E[Policy decision]
  E --> F[Dashboards / alerts]`}
        />
        <Example title="Minimum fields">
{`timestamp, request_id, tenant, server, tool,
args_digest (not raw secrets), duration_ms, outcome`}
        </Example>
        <Callout variant="insight" title="Jargon: args digest">
          A <strong className="text-white">digest</strong> is a hash or redacted summary of arguments so you
          can debug without storing passwords in logs.
        </Callout>
      </LessonSection>

      <LessonSection title="Gating tools">
        <Flowchart
          title="Defense in depth for tools"
          chart={`flowchart TB
  A[Tool call] --> B{Allowlisted?}
  B -->|No| X[Reject]
  B -->|Yes| C{Rate limit OK?}
  C -->|No| X
  C -->|Yes| D{Needs approval?}
  D -->|Yes| E[Human / policy engine]
  E --> F{Approved?}
  F -->|No| X
  F -->|Yes| G[Execute]
  D -->|No| G`}
        />
        <ContentStep number={1} title="Environment gates">
          <p className="text-slate-300">
            Dev servers may expose write tools; prod may be read-only clones with synthetic data.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Feature flags">
          <p className="text-slate-300">
            Flip dangerous tools off instantly without redeploying every host config.
          </p>
        </ContentStep>
        <Callout variant="tip" title="SLOs for tools">
          Track error rate and p95 latency per tool. A flaky MCP server feels like a “dumb model” to users.
        </Callout>
      </LessonSection>

      <LessonSection title="Rollout checklist">
        <p className="text-slate-300">
          Moving from laptop demo to team-wide MCP means CI, staged deploys, and host config management — not
          only prettier tool descriptions.
        </p>
        <ContentStep number={1} title="Staging host">
          <p className="text-slate-300">
            Run smoke tests against a staging Claude Desktop / IDE / agent config before pointing production
            users at a new server version.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Breaking change comms">
          <p className="text-slate-300">
            Publish semver, changelog, and deprecation windows. Hosts cache tool lists — silent renames break
            automations.
          </p>
        </ContentStep>
        <Flowchart
          title="Safe rollout path"
          chart={`flowchart TB
  A[Dev server + smoke test] --> B[Staging host config]
  B --> C[Canary users / internal team]
  C --> D[Monitor errors + latency]
  D --> E[General availability]
  E --> F[Deprecate old tool aliases]`}
        />
        <CodeBlock title="Conceptual deploy metadata">
{`server: tickets-mcp
version: 2.3.1
protocol: (pinned MCP revision)
owners: platform-team
runbook: /wiki/mcp-tickets-oncall`}
        </CodeBlock>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Version protocol + server schemas; plan breaking tool changes.',
          'Trace request id, server, tool, outcome — redact secrets.',
          'Gate with allowlists, rate limits, approvals, and feature flags.',
          'Treat MCP servers as production APIs, not casual scripts.',
        ]}
      />
    </LessonArticle>
  )
}
