import {
  Callout,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function IamRoles() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Temporary identity you can assume">
        An IAM <strong className="text-white">role</strong> is not a person and not a password vault.
        It is a named set of permissions that a <em>principal</em> can <strong className="text-white">assume</strong>{' '}
        to receive short-lived credentials. Data engineers should think in roles first: Glue job role,
        Lambda execution role, Redshift COPY role, EC2 instance profile — all roles.
      </Callout>

      <Definition term="IAM role">
        <p>
          An <strong className="text-white">IAM role</strong> contains two policy types: a{' '}
          <strong className="text-white">trust policy</strong> (who may assume the role) and one or more{' '}
          <strong className="text-white">permissions policies</strong> (what the role may do after
          assumption). Roles have no permanent password or access keys of their own.
        </p>
      </Definition>

      <LessonSection title="Why data engineers prefer roles over long-lived keys">
        <ContentStep number={1} title="Automatic credential rotation">
          <p className="text-slate-300">
            When Lambda runs your function, AWS injects temporary credentials valid for about one hour,
            refreshed automatically. No key rotation tickets, no secrets in environment variables.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Least privilege per workload">
          <p className="text-slate-300">
            A Glue ETL role reads <code className="text-core-400">raw/</code> and writes{' '}
            <code className="text-core-400">processed/</code>. A separate Lambda ingestion role only
            touches the landing bucket. Each role is scoped to one job — not one shared power-user key.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Cross-service trust built in">
          <p className="text-slate-300">
            AWS services assume roles on your behalf. Glue trusts the Glue service; Lambda trusts{' '}
            <code className="text-core-400">lambda.amazonaws.com</code>. You define the trust; AWS handles
            STS token exchange.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Auditable sessions">
          <p className="text-slate-300">
            CloudTrail records{' '}
            <code className="text-core-400">assumed-role/ETLRole/session-name</code> so you know which
            role — not which static key — performed an S3 delete.
          </p>
        </ContentStep>
        <Example title="Common DE roles" caption="Names vary by team">
{`GlueETLRole          → Glue job reads/writes S3, writes CloudWatch logs
LambdaIngestRole     → S3 trigger Lambda, starts downstream Glue job
RedshiftSpectrumRole → Redshift queries external tables in the lake
EC2AirflowRole       → Self-hosted orchestrator on EC2 calls AWS APIs
HumanAdminRole       → Engineer assumes via CLI for break-glass (short session)`}
        </Example>
      </LessonSection>

      <LessonSection title="Trust policy vs permissions policy">
        <p className="text-slate-300">
          New learners mix these up. They answer different questions and attach differently.
        </p>
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Policy type</th>
                <th className="px-4 py-3">Question it answers</th>
                <th className="px-4 py-3">Where it lives</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Trust policy (assume role policy)', 'Who can become this role?', 'Embedded on the role itself — Trust relationships tab'],
                ['Permissions policy', 'What APIs can this role call once assumed?', 'Attached to the role (inline or managed policy)'],
              ].map(([type, question, where]) => (
                <tr key={type} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{type}</td>
                  <td className="px-4 py-3">{question}</td>
                  <td className="px-4 py-3">{where}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ContentStep number={1} title="Trust policy teaser">
          <p className="text-slate-300">
            Example trust: allow <code className="text-core-400">glue.amazonaws.com</code> to assume{' '}
            <code className="text-core-400">GlueETLRole</code>. Without this, Glue cannot hand credentials
            to your job even if permissions policies are perfect.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Permissions policy teaser">
          <p className="text-slate-300">
            Example permission: allow <code className="text-core-400">s3:GetObject</code> on{' '}
            <code className="text-core-400">arn:aws:s3:::company-lake/raw/*</code>. Without this, the job
            authenticates but gets AccessDenied on the first read.
          </p>
        </ContentStep>
        <Callout variant="tip" title="PassRole is its own permission">
          Creating a Glue job requires your IAM user to have{' '}
          <code className="text-core-400">iam:PassRole</code> on the job role ARN — permission to hand
          that role to the Glue service. Missing PassRole is a frequent Console error when junior engineers
          deploy pipelines.
        </Callout>
      </LessonSection>

      <LessonSection title="How role assumption works">
        <Flowchart
          title="Principal assumes role → temporary creds → API calls"
          chart={`flowchart LR
  P[Principal — user Lambda or Glue]
  P --> T{Trust policy allows assume?}
  T -->|No| D1[AccessDenied AssumeRole]
  T -->|Yes| S[STS issues temporary credentials]
  S --> C[Access Key Secret Session Token]
  C --> A[Call AWS APIs as the role]
  A --> Z{Permissions policy allows action?}
  Z -->|Yes| OK[S3 read Glue start etc]
  Z -->|No| D2[AccessDenied on action]`}
        />
        <p className="mt-4 text-slate-300">
          STS (Security Token Service) is the AWS component that mints temporary credentials. Session
          duration ranges from 15 minutes to 12 hours depending on configuration. When credentials expire,
          services refresh them automatically; human CLI sessions need to re-assume the role.
        </p>
        <Callout variant="insight">
          Instance profile is a container that delivers an EC2 role to the machine — same role mechanics,
          friendlier EC2 UX. Airflow on EC2 and self-hosted Spark workers typically use instance profiles.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Roles are temporary identities to assume — no permanent passwords; STS issues short-lived credentials.',
          'Data engineers use roles for Glue, Lambda, Redshift COPY, EC2 orchestrators — not long-lived user keys.',
          'Trust policy = who can assume. Permissions policy = what the role can do after assumption.',
          'Flow: principal → trust check → STS creds → permissions check → API success or AccessDenied.',
        ]}
      />
    </LessonArticle>
  )
}
