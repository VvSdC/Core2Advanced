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

export function AuthSecurityA2a() {
  return (
    <LessonArticle>
      <Definition term="Auth and security in A2A">
        <p>
          A2A enables <strong className="text-white">multi-vendor agent interoperability</strong>, so{' '}
          <strong className="text-white">authentication and authorization</strong> are not optional extras.
          Clients must prove identity; peers must enforce who may create tasks, send which parts, and receive
          which artifacts.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: a corporate visitor badge. Knowing the meeting room (endpoint) is useless without a badge
          (auth) and the right floor access (scopes / policies).
        </p>
      </Definition>

      <Callout variant="beginner" title="Open protocol ≠ open access">
        Open standards make the wire format shared. Security still decides who is allowed on the wire.
      </Callout>

      <LessonSection title="What Agent Cards hint about auth">
        <p className="text-slate-300">
          Cards typically advertise supported schemes (API keys, bearer tokens, OAuth-style flows, mTLS, etc.).
          Exact mechanisms evolve — treat the following as a conceptual map.
        </p>
        <Flowchart
          title="Discover → authenticate → delegate"
          chart={`flowchart TB
  Card[Read Agent Card auth schemes] --> Pick[Pick scheme you support]
  Pick --> Cred[Obtain credentials / token]
  Cred --> Call[Send A2A task with auth context]
  Call --> Peer{Peer policy OK?}
  Peer -->|No| Deny[Reject / failed auth]
  Peer -->|Yes| Work[working → completed]`}
        />
      </LessonSection>

      <LessonSection title="Enterprise concerns">
        <ContentStep number={1} title="Identity of agents">
          <p className="text-slate-300">
            Service identities, not just human users — which agent principal is calling?
          </p>
        </ContentStep>
        <ContentStep number={2} title="Least privilege">
          <p className="text-slate-300">
            A travel agent should book travel, not exfiltrate HR files. Scope tasks and data parts tightly.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Audit trails">
          <p className="text-slate-300">
            Log task ids, callers, state transitions, and artifact access for compliance across vendors.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Data residency & PII">
          <p className="text-slate-300">
            Message parts may cross clouds. Classify data before delegation; redact or tokenize when needed.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Threats unique to agent↔agent">
        <Example title="Things to worry about">
{`- Confused deputy: peer uses your token to overreach
- Prompt/tool injection via message parts from untrusted peers
- Supply-chain peer: malicious Agent Card in a public catalog
- Over-broad skills advertised → social engineering of routers`}
        </Example>
        <CodeBlock title="Security checklist (conceptual)">
{`before send_task(peer, message):
  verify_card_signature_or_registry(peer)   # trust the card source
  token = mint_scoped_token(audience=peer, max_ttl=...)
  sanitize_parts(message)                   # strip secrets / PII policy
  assert skill_in_allowlist(peer, skill)
  return a2a.send_task(peer, message, auth=token)`}
        </CodeBlock>
        <Callout variant="tip" title="Trust registries">
          Enterprises often pin known Agent Cards in an internal catalog instead of trusting arbitrary URLs on
          the open internet.
        </Callout>
      </LessonSection>

      <LessonSection title="Interop without lowering the drawbridge">
        <Flowchart
          title="Multi-vendor safe collaboration"
          chart={`flowchart TB
  V1[Vendor A agent] --> IdP[Shared enterprise IdP / federation]
  V2[Vendor B agent] --> IdP
  IdP --> Policy[Policy engine: who → which skills]
  Policy --> A2A[A2A tasks under policy]
  A2A --> Audit[Central audit of lifecycles]`}
        />
        <p className="mt-3 text-slate-300">
          A2A gives you a common language for delegation. Your IdP and policy layer still decide what that
          language is allowed to say. Always re-check current security guidance in official A2A documentation.
        </p>
      </LessonSection>

      <KeyTakeaways
        items={[
          'A2A multi-vendor interop requires real authn/authz — open protocol ≠ open access.',
          'Agent Cards advertise schemes; clients must satisfy them before tasks succeed.',
          'Watch confused deputy, injection via parts, and untrusted card catalogs.',
          'Pair A2A with enterprise IdP, least privilege, audit, and evolving official security docs.',
        ]}
      />
    </LessonArticle>
  )
}
