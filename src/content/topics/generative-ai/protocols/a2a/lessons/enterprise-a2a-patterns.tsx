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

export function EnterpriseA2aPatterns() {
  return (
    <LessonArticle>
      <Definition term="Enterprise A2A patterns">
        <p>
          In the enterprise, A2A is less about demos and more about{' '}
          <strong className="text-white">governed multi-vendor agent interoperability</strong>: catalogs,
          identity, quotas, audit, and clear ownership of tasks that cross team and vendor boundaries.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: an airport. Many airlines (vendors) share runways and radio protocols, but security,
          scheduling, and incident logs are institutional — not left to each pilot&apos;s improvisation.
        </p>
      </Definition>

      <Callout variant="beginner" title="Protocol + platform">
        Buy or build a thin control plane around A2A: registry, policy, observability — not only SDKs in apps.
      </Callout>

      <LessonSection title="Pattern 1 — Internal agent marketplace">
        <ContentStep number={1} title="Publish">
          <p className="text-slate-300">
            Teams publish Agent Cards to a private registry with owners, SLAs, and cost centers.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Consume">
          <p className="text-slate-300">
            Products hire only registry-approved peers — no shadow URLs.
          </p>
        </ContentStep>
        <Flowchart
          title="Private catalog"
          chart={`flowchart TB
  Team[Team publishes card] --> Reg[Enterprise agent registry]
  Reg --> Review[Security + architecture review]
  Review --> Approved[Approved catalog]
  App[Product agent] --> Approved
  Approved --> A2A[A2A tasks under policy]`}
        />
      </LessonSection>

      <LessonSection title="Pattern 2 — Vendor boundary with federation">
        <Example title="Best-of-breed stack">
{`CRM agent (Vendor A)  ↔  A2A  ↔  Compliance agent (Vendor B)
Identity: enterprise SSO / workload identity federation
Data: only fields allowed by DLP classification
Audit: both sides emit task lifecycle events to SIEM`}
        </Example>
        <CodeBlock title="Policy gate sketch">
{`def allow_delegate(caller, peer, message):
    assert peer in approved_catalog
    assert caller.has_role(peer.required_roles)
    assert dlp.ok(message.parts)
    assert quota.remaining(caller, peer) > 0
    return True`}
        </CodeBlock>
      </LessonSection>

      <LessonSection title="Pattern 3 — Tiered autonomy">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Tier 0</strong> — read-only peers (summarize, classify).
          </li>
          <li>
            <strong className="text-white">Tier 1</strong> — write within sandbox (draft tickets).
          </li>
          <li>
            <strong className="text-white">Tier 2</strong> — irreversible actions need human approval node
            before A2A send or before peer commits.
          </li>
        </ul>
        <Flowchart
          title="Human gate before high-impact hire"
          chart={`flowchart TB
  Orch[Orchestrator] --> Risk{High impact skill?}
  Risk -->|No| Send[A2A send_task]
  Risk -->|Yes| HITL[Human approval]
  HITL -->|Approved| Send
  HITL -->|Denied| Stop[Do not delegate]
  Send --> Peer[Vendor / internal peer]`}
        />
      </LessonSection>

      <LessonSection title="Pattern 4 — Observability contract">
        <ContentStep number={1} title="Correlate">
          <p className="text-slate-300">
            Propagate a trace id across A2A tasks so support can follow a user journey across vendors.
          </p>
        </ContentStep>
        <ContentStep number={2} title="SLOs on states">
          <p className="text-slate-300">
            Alert when tasks stuck in <span className="font-mono text-sm text-genai-400">working</span> too
            long; track failed rates per peer.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Cost attribution">
          <p className="text-slate-300">
            Tag tasks with product and cost center — multi-agent bills surprise finance otherwise.
          </p>
        </ContentStep>
        <Callout variant="tip" title="Version pinning">
          Pin A2A protocol / SDK versions per peer. Specs evolve; enterprises change on purpose, not on surprise.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Enterprise A2A needs registry, identity, policy, and audit — not only happy-path SDKs.',
          'Patterns: private marketplace, federated vendors, tiered autonomy, observability contracts.',
          'Gate high-impact delegation with human approval and DLP on message parts.',
          'Pin versions and watch official A2A docs as the ecosystem matures.',
        ]}
      />
    </LessonArticle>
  )
}
