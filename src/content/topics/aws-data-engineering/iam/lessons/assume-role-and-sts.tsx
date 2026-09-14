import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function AssumeRoleAndSts() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Roles are identities you wear temporarily">
        A Glue job does not store access keys in its script. Instead, AWS gives the job an IAM role,
        and at runtime the job calls <strong className="text-white">STS</strong> (Security Token Service)
        to obtain short-lived credentials. Humans do the same when they sign in via SSO and pick a
        data-engineer role in the Console or CLI.
      </Callout>

      <Definition term="AssumeRole and STS">
        <p>
          <strong className="text-white">Role assumption</strong> is the act of using the STS API{' '}
          <span className="font-mono text-sm">AssumeRole</span> (or federated variants) to obtain
          temporary security credentials for a role you are trusted to use.{' '}
          <strong className="text-white">STS</strong> is the AWS service that issues those credentials —
          AccessKeyId, SecretAccessKey, and SessionToken — valid for minutes to hours, then they expire.
        </p>
      </Definition>

      <LessonSection title="How role assumption works">
        <ContentStep number={1} title="Trust policy on the role">
          <p className="text-slate-300">
            Every role has a trust policy stating <em>who may assume it</em>. A Lambda execution role
            trusts the Lambda service principal{' '}
            <span className="font-mono text-sm">lambda.amazonaws.com</span>. A cross-account analytics
            role trusts a specific role ARN in another account. Without trust,{' '}
            <span className="font-mono text-sm">AssumeRole</span> fails even if permission policies
            look correct.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Permission policies on the role">
          <p className="text-slate-300">
            After assumption, the session credentials carry the role&apos;s permissions — e.g. read{' '}
            <span className="font-mono text-sm">s3://lake/raw/*</span>, call{' '}
            <span className="font-mono text-sm">glue:StartJobRun</span>. Trust and permissions are
            separate documents answering different questions: who can wear the hat vs what the hat
            allows.
          </p>
        </ContentStep>
        <ContentStep number={3} title="sts:AssumeRole API call">
          <p className="text-slate-300">
            The caller (human via CLI, EC2 instance profile, Lambda runtime) invokes STS with the role
            ARN and optional session name (shows up in CloudTrail — use meaningful names like{' '}
            <span className="font-mono text-sm">glue-nightly-sales-etl</span>). STS returns temporary
            credentials if trust + caller permissions allow.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Temporary credentials — three pieces">
        <ContentStep number={1} title="AccessKeyId and SecretAccessKey">
          <p className="text-slate-300">
            Look like long-lived access keys but expire automatically. Boto3 uses them to sign AWS API
            requests for S3, Glue, Redshift Data API, etc.
          </p>
        </ContentStep>
        <ContentStep number={2} title="SessionToken (required third field)">
          <p className="text-slate-300">
            Temporary credentials <em>always</em> include a session token. SDKs and the CLI attach it
            automatically. Using only AccessKeyId + SecretAccessKey from an assumed role session will
            fail — a common copy-paste mistake in notebooks.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Expiration">
          <p className="text-slate-300">
            Default role session duration is often one hour (configurable up to the role&apos;s max,
            typically 12 hours). Long-running Glue jobs refresh credentials automatically; short Lambda
            invocations finish well within the window.
          </p>
        </ContentStep>
        <Flowchart
          title="AssumeRole flow for a Glue job"
          chart={`flowchart LR
  TRUST[Role trust policy allows glue.amazonaws.com]
  JOB[Glue starts job run]
  JOB --> STS[STS AssumeRole]
  TRUST --> STS
  STS --> CREDS[Temp credentials — key secret token]
  CREDS --> S3[Read write S3 prefixes]
  CREDS --> CW[Write CloudWatch logs]
  CREDS --> GLUE[Glue API calls as job role]`}
        />
      </LessonSection>

      <LessonSection title="Data engineering touchpoints">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Principal</th>
                <th className="px-4 py-3">How it assumes a role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Glue ETL job', 'Service assumes job role on your behalf — no keys in job parameters'],
                ['Lambda function', 'Execution role credentials injected at cold start via instance metadata pattern'],
                ['EC2 ETL worker', 'Instance profile → automatic AssumeRole for attached role'],
                ['Human via SSO', 'Identity Center → role in account → Console/CLI uses STS session'],
                ['Cross-account pipeline', 'Account A role AssumeRole into Account B lake-read role'],
              ].map(([principal, how]) => (
                <tr key={principal} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{principal}</td>
                  <td className="px-4 py-3">{how}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip">
          In CloudTrail, look for <span className="font-mono text-sm">AssumeRole</span> events to trace
          who assumed the Redshift loader role before a suspicious S3 delete — session names and source
          identities matter.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'AssumeRole via STS exchanges trust + permission for temporary credentials — no long-lived keys on Glue or Lambda.',
          'Trust policy defines who can assume the role; permission policies define what the role can do once assumed.',
          'Temporary credentials = AccessKeyId + SecretAccessKey + SessionToken — all three required until expiry.',
          'DE pattern: Glue job role, Lambda execution role, and EC2 instance profile all rely on STS under the hood.',
        ]}
      />
    </LessonArticle>
  )
}
