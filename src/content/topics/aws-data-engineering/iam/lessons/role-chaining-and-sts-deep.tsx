import {
  Callout,
  ContentStep,
  Definition,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function RoleChainingAndStsDeep() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Sometimes one AssumeRole is not enough">
        In large orgs a human or automation might assume Role A, then use those credentials to assume
        Role B, then call S3 — that is <strong className="text-white">role chaining</strong>. STS offers
        several credential APIs; picking the wrong mental model causes confusion in interviews and in
        debugging federated data platforms.
      </Callout>

      <Definition term="Role chaining">
        <p>
          <strong className="text-white">Role chaining</strong> occurs when you use credentials from one
          assumed role to call <span className="font-mono text-sm">sts:AssumeRole</span> again and obtain
          a second set of temporary credentials for another role. AWS limits chain depth (typically one
          hop for same-account; cross-account chaining has stricter rules). Each hop should shrink
          permissions — not expand them.
        </p>
      </Definition>

      <LessonSection title="Role chaining overview">
        <ContentStep number={1} title="Why platforms chain">
          <p className="text-slate-300">
            A tooling account runs CI/CD that assumes a <span className="font-mono text-sm">DeployRole</span>{' '}
            in staging, which can only assume (not administer) a{' '}
            <span className="font-mono text-sm">GlueJobRole</span> in the data account. Each hop is a
            deliberate gate — platform team, environment, then workload.
          </p>
        </ContentStep>
        <ContentStep number={2} title="CloudTrail shows the chain">
          <p className="text-slate-300">
            You will see nested assumed-role ARNs: SSO user → power-user role → cross-account lake role.
            Session names and <span className="font-mono text-sm">sourceIdentity</span> (when set) help
            trace who ultimately triggered a Redshift UNLOAD to the wrong bucket.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Prefer direct assumption when possible">
          <p className="text-slate-300">
            Extra hops add latency, complexity, and shorter effective session windows. If Account A can
            trust Account B&apos;s pipeline role directly for lake read, skip intermediate roles unless
            org policy mandates a hop through a security account.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="STS deeper — AssumeRole vs GetSessionToken">
        <Definition term="AssumeRole">
          <p>
            <span className="font-mono text-sm">sts:AssumeRole</span> returns credentials for an{' '}
            <strong className="text-white">IAM role</strong> you are trusted to use. This is the default
            path for Glue, Lambda, cross-account lake access, and SSO role selection. Permissions come
            from the role&apos;s policies.
          </p>
        </Definition>
        <Definition term="GetSessionToken">
          <p>
            <span className="font-mono text-sm">sts:GetSessionToken</span> returns credentials for the{' '}
            <strong className="text-white">same IAM user</strong> that called it — often after MFA — with
            a limited lifetime. It does <em>not</em> switch you to a different role. Legacy pattern for
            MFA-protected API access; most DE teams today use SSO instead of IAM users + GetSessionToken.
          </p>
        </Definition>
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">API (conceptual)</th>
                <th className="px-4 py-3">You get credentials for…</th>
                <th className="px-4 py-3">Common DE usage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['AssumeRole', 'Target IAM role', 'Glue job role, cross-account lake read, SSO permission sets'],
                ['AssumeRoleWithSAML / WebIdentity', 'Federated role mapping', 'Enterprise SSO into AWS Console/CLI'],
                ['GetSessionToken', 'Same IAM user, MFA-bound session', 'Legacy — prefer Identity Center'],
                ['GetFederationToken', 'Federated user with custom policy cap', 'Rare in modern DE platforms'],
              ].map(([api, credsFor, usage]) => (
                <tr key={api} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-mono text-xs text-core-400">{api}</td>
                  <td className="px-4 py-3">{credsFor}</td>
                  <td className="px-4 py-3">{usage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="insight">
          Interview distinction: AssumeRole = become a role; GetSessionToken = refresh/MFA-wrap the
          current IAM user — not a substitute for role assumption in pipelines.
        </Callout>
      </LessonSection>

      <LessonSection title="Risks and when chaining appears in DE platforms">
        <ContentStep number={1} title="Session duration shrinkage">
          <p className="text-slate-300">
            Chained sessions cannot exceed the remaining time of the parent session. A one-hour SSO session
            that chains into two roles may leave only minutes for a long Glue test — plan max session
            durations on intermediate roles.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Permission creep via hop roles">
          <p className="text-slate-300">
            If intermediate Role B has <span className="font-mono text-sm">sts:AssumeRole</span> on ten
            downstream roles including admin, any principal that can assume Role B inherits a wide blast
            radius. Intermediate roles should only AssumeRole into explicitly listed ARNs.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Where you see it in practice">
          <p className="text-slate-300">
            Multi-account data mesh: analytics SSO → account power role → cross-account catalog reader.
            Vendor SaaS: vendor role → customer-provided read role with ExternalId. Some orchestration
            frameworks wrap AssumeRole between steps — document the chain in runbooks.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Debugging AccessDenied in chains">
          <p className="text-slate-300">
            Failures can be trust on Role B, missing <span className="font-mono text-sm">sts:AssumeRole</span>{' '}
            on Role A, SCP Deny, or session policy cap. Test each hop in isolation with{' '}
            <span className="font-mono text-sm">aws sts assume-role</span> before blaming S3 bucket policies.
          </p>
        </ContentStep>
        <Callout variant="tip">
          Platform design goal: humans chain through SSO permission sets; batch jobs assume one job role
          directly — no unnecessary middle roles for overnight Glue workloads.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Role chaining = using one assumed role\'s credentials to AssumeRole into another — limited depth and shrinking session time.',
          'AssumeRole switches identity to a role; GetSessionToken refreshes the same IAM user (MFA) — pipelines use AssumeRole.',
          'DE platforms chain for multi-account mesh and CI gates — minimize hops for long-running Glue/EC2 jobs.',
          'Lock intermediate roles to specific downstream role ARNs; debug chained AccessDenied hop-by-hop.',
        ]}
      />
    </LessonArticle>
  )
}
