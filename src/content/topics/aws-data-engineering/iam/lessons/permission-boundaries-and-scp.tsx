import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function PermissionBoundariesAndScp() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Allow lists inside Allow lists">
        Your Glue role might Allow S3 read on the lake — but can it also create IAM users or delete
        production Redshift clusters? <strong className="text-white">Permission boundaries</strong> and{' '}
        <strong className="text-white">Service Control Policies (SCPs)</strong> set maximum guardrails so
        even a misattached AdministratorAccess cannot escape the fence your platform team defined.
      </Callout>

      <Definition term="Permission boundary">
        <p>
          A <strong className="text-white">permissions boundary</strong> is a managed policy attached to
          a user or role that sets the <em>maximum</em> permissions that identity can ever have. Effective
          permissions = intersection of identity policies and the boundary (plus resource policies, with
          deny still winning). Boundaries do not grant access by themselves — they cap what other policies
          can grant.
        </p>
      </Definition>

      <Definition term="Service Control Policy (SCP)">
        <p>
          An <strong className="text-white">SCP</strong> is an Organizations policy attached to the root,
          OU, or account that defines guardrails for <em>every</em> principal in that scope. SCPs also
          use Allow/Deny JSON but they never grant permissions by themselves — they filter what identity
          and resource policies are allowed to permit. Think: &quot;nothing in sandbox may call{' '}
          <span className="font-mono text-sm">redshift:DeleteCluster</span>&quot; regardless of local IAM.
        </p>
      </Definition>

      <LessonSection title="Permission boundaries in data teams">
        <ContentStep number={1} title="Delegate role creation safely">
          <p className="text-slate-300">
            A data platform lead can create new Glue job roles for squads — but each role gets a boundary
            policy <span className="font-mono text-sm">DataEng-MaxPermissions</span> that Allow-lists only
            S3, Glue, CloudWatch, and KMS in the lake account. They cannot accidentally attach a policy
            that grants <span className="font-mono text-sm">iam:CreateUser</span> or org admin paths.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Break-glass vs daily roles">
          <p className="text-slate-300">
            Emergency Redshift admin role carries a boundary that includes Redshift modify actions; normal
            analyst SSO role boundary excludes them. Same human, different caps depending on which role
            they assume.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Boundary ≠ identity policy">
          <p className="text-slate-300">
            You still attach least-privilege identity policies inside the boundary. A role with an empty
            identity policy and a permissive boundary still cannot do anything — boundary alone does not
            grant API access.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="SCPs in AWS Organizations">
        <ContentStep number={1} title="Guardrails at scale">
          <p className="text-slate-300">
            FinOps attaches an SCP to the prod OU: Deny launching EC2 without tag{' '}
            <span className="font-mono text-sm">CostCenter</span>. Security Denies{' '}
            <span className="font-mono text-sm">s3:PutBucketPublicAccessBlock</span> changes in prod.
            Every account in that OU inherits the rules — no per-account drift.
          </p>
        </ContentStep>
        <ContentStep number={2} title="SCP Deny beats local Allow">
          <p className="text-slate-300">
            A Glue role with Allow on everything still cannot pass an SCP explicit Deny on{' '}
            <span className="font-mono text-sm">glue:DeleteJob</span> in prod. That is why AccessDenied
            surprises often trace to org policies, not the role you just edited.
          </p>
        </ContentStep>
        <ContentStep number={3} title="SCP does not replace IAM">
          <p className="text-slate-300">
            SCPs filter the maximum; identity policies still required for Allow. An SCP that Allow-lists
            only certain regions does not automatically grant S3 read — it just prevents actions outside
            approved regions when combined with default deny.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="How boundaries, SCPs, and identity policies interact">
        <Flowchart
          title="Effective permissions (high level)"
          chart={`flowchart TB
  ID[Identity policies on role — what role should do]
  BND[Permission boundary — max for this role]
  SCP[SCP on account or OU — org guardrail]
  RES[Resource policy — e.g. S3 bucket]
  EVAL[IAM evaluation]
  ID --> EVAL
  BND --> EVAL
  SCP --> EVAL
  RES --> EVAL
  EVAL --> DENY{Explicit Deny anywhere?}
  DENY -->|Yes| NO[Denied]
  DENY -->|No| ALLOW{Allow matches and within boundary and SCP?}
  ALLOW -->|Yes| YES[Allowed]
  ALLOW -->|No| NO`}
        />
        <Callout variant="insight">
          Memory aid: identity policies say what you <em>should</em> do; permission boundaries say what
          you <em>at most</em> can do; SCPs say what the <em>account</em> is allowed to permit org-wide.
        </Callout>
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Control</th>
                <th className="px-4 py-3">Attached to</th>
                <th className="px-4 py-3">DE example</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Identity policy', 'User, group, role', 'Glue job role Allow s3:GetObject on raw/*'],
                ['Permission boundary', 'User or role', 'Cap role at S3 + Glue + logs — no IAM admin'],
                ['SCP', 'Org root, OU, account', 'Deny redshift:DeleteCluster in prod OU'],
                ['Resource policy', 'S3, KMS, SNS…', 'Bucket Allow analytics account role GetObject'],
              ].map(([control, attached, example]) => (
                <tr key={control} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{control}</td>
                  <td className="px-4 py-3">{attached}</td>
                  <td className="px-4 py-3">{example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip">
          When onboarding a new lake account into Organizations, test Glue and Lambda in a sandbox OU
          with SCPs enabled <em>before</em> promoting to prod OU — SCP Denies are silent until something breaks.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Permission boundaries cap maximum permissions for a user or role — intersect with identity policies; never grant alone.',
          'SCPs are Organization guardrails on accounts/OUs — explicit SCP Deny overrides local IAM Allows.',
          'Effective access = identity + resource policies, filtered by boundary and SCP, with explicit Deny winning.',
          'DE ops: use boundaries when delegating role creation; use SCPs to block destructive actions (DeleteCluster, public S3) in prod.',
        ]}
      />
    </LessonArticle>
  )
}
