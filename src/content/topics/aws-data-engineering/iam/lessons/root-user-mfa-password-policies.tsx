import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function RootUserMfaPasswordPolicies() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="The most powerful login in your account">
        When you create an AWS account, AWS gives you one special identity: the{' '}
        <strong className="text-white">root user</strong>. It has unrestricted access to everything —
        billing, account closure, deleting every S3 bucket, removing all IAM users. Treat it like the
        master key to a building: lock it in a safe, use it rarely, and never use it for daily data
        engineering work.
      </Callout>

      <Definition term="Root user">
        <p>
          The <strong className="text-white">root user</strong> is the account owner identity tied to the
          email address used at sign-up. It bypasses normal IAM policy restrictions for most account-level
          actions. There is only one root user per AWS account, and it cannot be deleted — only secured.
        </p>
      </Definition>

      <LessonSection title="Why the root user is dangerous for daily work">
        <ContentStep number={1} title="Unlimited power">
          <p className="text-slate-300">
            Root can delete production Redshift clusters, remove MFA from other admins, and change billing
            contacts. A leaked root password or access key is a full account compromise — not a single
            misconfigured Glue role.
          </p>
        </ContentStep>
        <ContentStep number={2} title="No least privilege">
          <p className="text-slate-300">
            You cannot attach a restrictive IAM policy to root the way you do for IAM users and roles.
            Every Console click or CLI call as root runs with god-mode permissions.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Audit and blame ambiguity">
          <p className="text-slate-300">
            CloudTrail shows root actions, but teams lose separation of duties when five people share
            root credentials in a password manager. Use named IAM users or SSO for traceability.
          </p>
        </ContentStep>
        <Example title="What root should be used for" caption="Rare account-level tasks only">
{`Appropriate root use (infrequent):
  - Initial account setup and enabling MFA on root
  - Changing account name, root email, or support plan
  - Closing the account
  - Some billing and tax settings
  - Registering as a seller in AWS Marketplace (one-time)

NOT for daily work:
  - Running Glue jobs or uploading to S3
  - Creating IAM roles for pipelines
  - Querying Athena or managing Redshift users
  - Terraform / CI/CD deployments`}
        </Example>
        <Callout variant="insight">
          Rule of thumb: if you are building a data lake, you should spend 99% of your time as an IAM
          user, SSO user, or assumed role — never as root.
        </Callout>
      </LessonSection>

      <LessonSection title="Multi-Factor Authentication (MFA)">
        <Definition term="MFA">
          <p>
            <strong className="text-white">Multi-Factor Authentication</strong> requires two proofs: something
            you know (password) and something you have (authenticator app, hardware key, or SMS — app or
            hardware preferred). Even if a password leaks, the attacker still needs the second factor.
          </p>
        </Definition>
        <ContentStep number={1} title="Enable MFA on root first">
          <p className="text-slate-300">
            Before creating S3 buckets or Glue crawlers, enable MFA on the root user in IAM → Security
            credentials. Store recovery codes offline. This is the single highest-impact security step
            for a new account.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Enable MFA on human IAM users">
          <p className="text-slate-300">
            Require MFA for anyone who can change production IAM policies or read sensitive lake data.
            Many organizations enforce MFA through IAM policies that deny all actions when{' '}
            <code className="text-core-400">aws:MultiFactorAuthPresent</code> is false — covered in
            advanced IAM lessons.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Roles and services do not use MFA">
          <p className="text-slate-300">
            Glue jobs and Lambda functions authenticate via roles, not MFA devices. MFA protects human
            Console and CLI logins; machine identities rely on role trust policies and short-lived tokens.
          </p>
        </ContentStep>
        <Callout variant="tip" title="Use an authenticator app">
          Google Authenticator, Microsoft Authenticator, or a hardware key (FIDO2) beat SMS for MFA.
          SMS can be SIM-swapped. For root, consider a dedicated hardware key stored securely.
        </Callout>
      </LessonSection>

      <LessonSection title="Password policies for IAM users">
        <p className="text-slate-300">
          Password policies apply to <em>IAM users</em> who sign into the AWS Console — not to root
          (configure root password separately) and not to access keys or role sessions.
        </p>
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Setting</th>
                <th className="px-4 py-3">What it does</th>
                <th className="px-4 py-3">Practical recommendation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Minimum length', 'Rejects short passwords', '14+ characters for production accounts'],
                ['Require uppercase / lowercase / numbers / symbols', 'Increases entropy', 'Enable all four for human users'],
                ['Password expiration', 'Forces periodic change', 'Optional — NIST favors strong passwords + MFA over forced rotation'],
                ['Prevent password reuse', 'Blocks last N passwords', 'Set to 5–24 depending on policy'],
                ['Allow users to change password', 'Self-service password updates', 'Keep enabled; combine with MFA'],
              ].map(([setting, what, rec]) => (
                <tr key={setting} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{setting}</td>
                  <td className="px-4 py-3">{what}</td>
                  <td className="px-4 py-3">{rec}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ContentStep number={1} title="Where to configure">
          <p className="text-slate-300">
            IAM → Account settings → Password policy. Changes apply account-wide to IAM users. IAM
            Identity Center (SSO) has its own password and MFA settings if your org uses it.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Passwords vs programmatic access">
          <p className="text-slate-300">
            Console passwords and access keys are independent. A strong password policy does not protect
            leaked access keys — rotate keys, prefer roles, and never commit keys to Git (covered in the
            users and groups lesson).
          </p>
        </ContentStep>
        <Callout variant="tip" title="Day-one security checklist">
          Enable MFA on root, create an admin IAM user for yourself (with MFA), lock root credentials
          away, set a password policy, enable S3 Block Public Access at account level, and turn on a
          billing alarm — many of these overlap with AWS Fundamentals governance lessons.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Root user has unrestricted account access — use only for rare account-level tasks, never daily DE work.',
          'Enable MFA on root immediately, then on all human IAM users who touch production.',
          'Password policies govern IAM Console passwords — set length and complexity; pair with MFA over forced rotation alone.',
          'Machine identities (Glue, Lambda) use roles, not MFA; humans use MFA + least-privilege IAM users or SSO.',
        ]}
      />
    </LessonArticle>
  )
}
