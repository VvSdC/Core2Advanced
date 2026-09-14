import {
  Callout,
  ContentStep,
  Definition,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function TemporaryCredentials() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Short-lived beats stored forever">
        Long-lived IAM access keys sitting in a Git repo, a Jupyter notebook, or an EC2 user-data script
        are a top cause of data lake breaches. Temporary credentials from STS expire on their own — even
        if someone copies them, the window of abuse is hours, not years. Production pipelines should
        almost never depend on static keys.
      </Callout>

      <Definition term="Temporary security credentials">
        <p>
          <strong className="text-white">Temporary credentials</strong> are AccessKeyId, SecretAccessKey,
          and SessionToken issued by STS with a built-in expiration time. They come from assumed IAM
          roles, federated SSO login, or EC2/Lambda instance metadata. When they expire, AWS rejects
          API calls until fresh credentials are obtained — automatically in most SDK default chains.
        </p>
      </Definition>

      <LessonSection title="Why temporary beats long-lived keys">
        <ContentStep number={1} title="Blast radius">
          <p className="text-slate-300">
            A leaked key with no expiration lets an attacker exfiltrate your entire S3 lake until someone
            notices and rotates the key. Temporary role credentials from a Glue job limit damage to that
            role&apos;s permissions and the remaining session lifetime.
          </p>
        </ContentStep>
        <ContentStep number={2} title="No secret storage in code">
          <p className="text-slate-300">
            Lambda and Glue pull credentials from the execution environment. Your deploy artifact contains
            business logic — not <span className="font-mono text-sm">AKIA...</span> strings. CI/CD stays
            simpler and scanners stop flagging false positives in every commit.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Audit clarity">
          <p className="text-slate-300">
            Each session has a role ARN and session name in CloudTrail. You see{' '}
            <span className="font-mono text-sm">arn:aws:sts::123:assumed-role/GlueETL/glue-job-run-abc</span>{' '}
            — not a generic IAM user that five people share.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Session duration concept">
        <ContentStep number={1} title="Role max session setting">
          <p className="text-slate-300">
            Each IAM role defines a maximum session duration (1 hour default, up to 12 hours for many
            roles). When you call AssumeRole you can request a shorter duration; you cannot exceed the
            role max.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Service-managed refresh">
          <p className="text-slate-300">
            AWS SDKs refresh credentials before expiry when using the default credential chain on EC2,
            Lambda, and Glue. A three-hour Spark job on Glue should not fail at the 60-minute mark —
            the runtime handles renewal for service roles.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Human SSO sessions">
          <p className="text-slate-300">
            Identity Center sessions have their own TTL (often 8–12 hours). Analysts querying Athena
            inherit that boundary — good for security, occasionally surprising when a long SQL session
            hits expiry mid-query.
          </p>
        </ContentStep>
        <Callout variant="insight">
          Rule of thumb: if a credential does not expire, treat it as debt. Migrate EC2 cron jobs from
          embedded keys to instance profiles; migrate local scripts from IAM user keys to{' '}
          <span className="font-mono text-sm">aws sso login</span>.
        </Callout>
      </LessonSection>

      <LessonSection title="How CLI and SDK use them (high level)">
        <ContentStep number={1} title="Credential provider chain">
          <p className="text-slate-300">
            Boto3 and the AWS CLI try sources in order: environment variables, shared credentials file,
            SSO cache, then container/ instance metadata for roles. Whichever resolves first wins. On
            Lambda, the chain stops at the execution role — no config file needed.
          </p>
        </ContentStep>
        <ContentStep number={2} title="aws sts get-caller-identity">
          <p className="text-slate-300">
            After SSO or <span className="font-mono text-sm">aws configure</span>, run this to confirm
            which principal you are — user, assumed role, or federated. Before a destructive S3 sync,
            verify you are not using prod credentials in a dev shell.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Explicit AssumeRole in scripts">
          <p className="text-slate-300">
            Cross-account tooling sometimes calls STS explicitly, then passes returned credentials to a
            new Boto3 session. That is advanced but common in data platform CLIs that hop from a tooling
            account into a lake account — covered in cross-account roles.
          </p>
        </ContentStep>
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Environment</th>
                <th className="px-4 py-3">Credential source</th>
                <th className="px-4 py-3">Typical lifetime</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Lambda ingestion', 'Execution role via runtime', 'Duration of invocation + refresh if needed'],
                ['Glue Spark job', 'Job role via Glue service', 'Job run length; auto-refreshed'],
                ['EC2 Airflow worker', 'Instance profile', 'Role max session; SDK refresh'],
                ['Developer laptop', 'IAM Identity Center (SSO)', 'Admin-configured SSO session hours'],
                ['Legacy anti-pattern', 'Static IAM user access key in ~/.aws/credentials', 'Until manual rotation — avoid'],
              ].map(([env, source, lifetime]) => (
                <tr key={env} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{env}</td>
                  <td className="px-4 py-3">{source}</td>
                  <td className="px-4 py-3">{lifetime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip">
          Enable IAM Access Analyzer and rotate or delete unused access keys — any key older than 90 days
          on a human IAM user is a candidate for SSO migration.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Temporary STS credentials expire automatically — prefer them over long-lived access keys in every pipeline.',
          'Session duration is capped by the role max; SDKs refresh credentials for long-running Glue/EC2 workloads.',
          'CLI and Boto3 use a credential chain — Lambda/Glue resolve roles without storing secrets in code.',
          'DE best practice: instance profiles on EC2, execution roles on Lambda/Glue, SSO for humans — no keys in Git.',
        ]}
      />
    </LessonArticle>
  )
}
