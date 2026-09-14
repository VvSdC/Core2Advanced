import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function ExplicitDenyAndEvaluation() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Allow is the default question — Deny is the veto">
        When a Glue job tries to read an S3 object, AWS does not ask &quot;Is there an Allow?&quot; alone.
        It gathers every policy that applies — role policies, permission boundaries, SCPs, bucket policies,
        session policies — and runs a strict evaluation. One explicit Deny anywhere stops the request,
        even if ten Allow statements say yes.
      </Callout>

      <Definition term="Explicit Deny">
        <p>
          An <strong className="text-white">explicit Deny</strong> is a statement with{' '}
          <span className="font-mono text-sm">&quot;Effect&quot;: &quot;Deny&quot;</span> that matches the
          request. It overrides any Allow. The opposite — no matching Allow — is an{' '}
          <strong className="text-white">implicit deny</strong>: AWS denies by default when nothing grants
          permission. Explicit Deny is stronger than implicit deny because it blocks even when another
          policy would have allowed access.
        </p>
      </Definition>

      <LessonSection title="Explicit Deny vs Allow">
        <ContentStep number={1} title="Allow opens a door">
          <p className="text-slate-300">
            Your Glue ETL role might Allow <span className="font-mono text-sm">s3:GetObject</span> on{' '}
            <span className="font-mono text-sm">arn:aws:s3:::lake/raw/*</span>. That is necessary but not
            sufficient — other policy types must not Deny, and an Allow must survive all guardrails.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Explicit Deny slams it shut">
          <p className="text-slate-300">
            A security team might attach a Deny on <span className="font-mono text-sm">s3:PutObject</span>{' '}
            when <span className="font-mono text-sm">aws:SecureTransport</span> is false — forcing HTTPS.
            Or an SCP Denies <span className="font-mono text-sm">redshift:DeleteCluster</span> in prod OU
            accounts. Those Denies win over AdministratorAccess Allow on the same action.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Implicit deny — nothing matched">
          <p className="text-slate-300">
            A Lambda with no S3 permissions in its execution role gets Access Denied on{' '}
            <span className="font-mono text-sm">s3:GetObject</span> — not because a Deny exists, but
            because no Allow matched. Fix by adding least-privilege Allow, not by removing a Deny that
            is not there.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Policy evaluation logic — deny always wins">
        <p className="text-slate-300">
          AWS IAM evaluation is deterministic. At a high level (simplified for data engineers):
        </p>
        <ContentStep number={1} title="Step 1 — Is there an explicit Deny?">
          <p className="text-slate-300">
            Collect identity policies, resource policies, permission boundaries, session policies, and
            SCPs (for org accounts). If <em>any</em> matching statement has Effect Deny →{' '}
            <strong className="text-white">request denied</strong>. Stop here.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Step 2 — Is there an Allow?">
          <p className="text-slate-300">
            If no Deny matched, check whether an Allow matches the principal, action, resource, and
            conditions. For same-account requests, both identity and resource policies can grant access.
            Cross-account often requires Allow on <em>both</em> sides.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Step 3 — Default deny">
          <p className="text-slate-300">
            No matching Allow → implicit deny. Your Redshift COPY fails, Glue crawler cannot read the
            bucket, or Athena query returns insufficient permissions — even when the Console UI looked
            fine because a different principal was used.
          </p>
        </ContentStep>
        <Flowchart
          title="High-level IAM evaluation order"
          chart={`flowchart TB
  REQ[API request — e.g. Glue reads S3 object]
  REQ --> GATHER[Gather all applicable policies]
  GATHER --> DENY{Any explicit Deny matches?}
  DENY -->|Yes| STOP[Request DENIED]
  DENY -->|No| ALLOW{Any Allow matches?}
  ALLOW -->|Yes| SCP{SCP allows action in org?}
  ALLOW -->|No| IMPLICIT[Implicit DENY]
  SCP -->|Yes| OK[Request ALLOWED]
  SCP -->|No| STOP`}
        />
        <Callout variant="insight">
          Debugging tip: when access fails unexpectedly, search for Deny statements first — SCPs,
          permission boundaries, and bucket policies with Deny are often the culprit, not the missing
          Allow on the Glue role.
        </Callout>
      </LessonSection>

      <LessonSection title="Data engineering scenarios">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Scenario</th>
                <th className="px-4 py-3">What happened</th>
                <th className="px-4 py-3">Lesson</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                [
                  'Glue role has S3 Allow but SCP Denies s3:* in sandbox OU',
                  'Job fails with Access Denied',
                  'Org guardrail beats role Allow — fix SCP or move account',
                ],
                [
                  'Analyst role Allow on lake/* but bucket policy Deny unless MFA',
                  'CLI works with SSO+MFA; broken automation without',
                  'Deny with Condition still counts as explicit Deny when condition matches',
                ],
                [
                  'Lambda role has no S3 statement',
                  'Function cannot read staging bucket',
                  'Implicit deny — add Allow on specific prefix, not *',
                ],
              ].map(([scenario, happened, lesson]) => (
                <tr key={scenario} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{scenario}</td>
                  <td className="px-4 py-3">{happened}</td>
                  <td className="px-4 py-3">{lesson}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip">
          Use IAM Policy Simulator or CloudTrail{' '}
          <span className="font-mono text-sm">AccessDenied</span> events to see which policy type blocked
          a failed Glue or Lambda call — faster than guessing which Allow to add.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Explicit Deny in any applicable policy overrides all Allow statements — deny always wins.',
          'Implicit deny means no matching Allow; default AWS behavior is deny unless something grants access.',
          'Evaluation: check Deny first, then Allow, with SCPs and boundaries still in the mix for org accounts.',
          'When Glue, Lambda, or Redshift access fails, look for Deny in SCPs, boundaries, and bucket policies before adding broader Allows.',
        ]}
      />
    </LessonArticle>
  )
}
