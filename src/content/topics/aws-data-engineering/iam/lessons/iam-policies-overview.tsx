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

export function IamPoliciesOverview() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Policies are the rulebooks">
        Every Allow or Deny in AWS IAM comes from a <strong className="text-white">policy</strong> — a
        document (usually JSON) listing actions, resources, and conditions. Before you write JSON syntax,
        understand the three places policies live and what each one controls. Data lake security is mostly
        a stack of policies on roles, buckets, and keys.
      </Callout>

      <Definition term="IAM policy">
        <p>
          An <strong className="text-white">IAM policy</strong> states whether a principal may or may not
          perform specific actions on specific resources under optional conditions (IP address, encryption
          context, prefix path). AWS evaluates all applicable policies together; an explicit{' '}
          <strong className="text-white">Deny</strong> always wins.
        </p>
      </Definition>

      <LessonSection title="Three policy types — plain English">
        <ContentStep number={1} title="Identity-based policies">
          <p className="text-slate-300">
            Attached to an <strong className="text-white">identity</strong> — IAM user, group, or role.
            Says: &quot;This role may call <code className="text-core-400">glue:StartJobRun</code> and{' '}
            <code className="text-core-400">s3:PutObject</code> on these ARNs.&quot; This is what you edit
            on a Glue job role.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Resource-based policies">
          <p className="text-slate-300">
            Attached to a <strong className="text-white">resource</strong> — most commonly an S3 bucket
            policy, also KMS key policies, SNS topic policies, Lambda resource policies. Says: &quot;This
            bucket allows account 111222333 to read objects&quot; or &quot;This bucket denies all public
            access.&quot;
          </p>
        </ContentStep>
        <ContentStep number={3} title="Trust policies">
          <p className="text-slate-300">
            A special resource-based policy on an <strong className="text-white">IAM role only</strong>.
            Says: &quot;The Lambda service may assume this role&quot; or &quot;Account B&apos;s admin role
            may assume this cross-account role.&quot; Not about S3 actions — about who can become the role.
          </p>
        </ContentStep>
        <Flowchart
          title="Where each policy type lives"
          chart={`flowchart TB
  subgraph Identity["Identity-based — on users groups roles"]
    I1[GlueETLRole permissions]
    I2[DataAnalyst user policy]
  end
  subgraph Resource["Resource-based — on AWS resources"]
    R1[S3 bucket policy on company-lake]
    R2[KMS key policy]
    R3[Lambda resource policy for S3 invoke]
  end
  subgraph Trust["Trust policy — on roles only"]
    T1[Allow glue.amazonaws.com to assume role]
  end
  REQ[API request] --> EVAL[IAM policy evaluation]
  I1 --> EVAL
  I2 --> EVAL
  R1 --> EVAL
  R2 --> EVAL
  T1 --> EVAL`}
        />
      </LessonSection>

      <LessonSection title="Where each lives — quick reference">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Policy type</th>
                <th className="px-4 py-3">Attached to</th>
                <th className="px-4 py-3">Typical DE example</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Identity-based', 'IAM user, group, or role', 'Glue role allowed s3:GetObject on raw/*'],
                ['Resource-based', 'S3 bucket, KMS key, SNS topic, etc.', 'Bucket policy grants analytics account read on curated/*'],
                ['Trust policy', 'IAM role only', 'Allow lambda.amazonaws.com to assume IngestRole'],
              ].map(([type, attached, example]) => (
                <tr key={type} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{type}</td>
                  <td className="px-4 py-3">{attached}</td>
                  <td className="px-4 py-3">{example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip" title="Both sides must allow (usually)">
          For cross-account S3 access, the role in account A needs identity-based S3 permissions{' '}
          <em>and</em> the bucket in account B often needs a bucket policy trusting account A. If either
          side is missing, you get AccessDenied even when the other policy looks correct.
        </Callout>
      </LessonSection>

      <LessonSection title="Simple data lake examples (conceptual)">
        <Example title="Glue ETL role — identity-based" caption="Permissions on the role">
{`Identity: GlueETLRole
Allow:
  s3:ListBucket on arn:aws:s3:::company-lake (with prefix raw/)
  s3:GetObject on arn:aws:s3:::company-lake/raw/*
  s3:PutObject on arn:aws:s3:::company-lake/processed/*
  glue:* on job-specific resources
  logs:CreateLogStream / PutLogEvents on the job log group`}
        </Example>
        <Example title="Lake bucket — resource-based" caption="Bucket policy excerpt">
{`Resource: s3://company-lake bucket policy
Allow:
  Principal = analytics account root or specific role ARN
  Action = s3:GetObject
  Resource = arn:aws:s3:::company-lake/curated/*
  Condition = aws:PrincipalAccount equals trusted account

Deny (defense in depth):
  Principal = *
  Action = s3:*
  Condition = aws:SecureTransport = false  → force HTTPS`}
        </Example>
        <Example title="Lambda ingest — trust + identity" caption="Two policies on one role">
{`Trust policy on IngestRole:
  Allow lambda.amazonaws.com to sts:AssumeRole

Identity policy on IngestRole:
  Allow s3:GetObject on landing bucket
  Allow glue:StartJobRun on specific job name`}
        </Example>
        <ContentStep number={1} title="Managed vs inline policies">
          <p className="text-slate-300">
            <strong className="text-white">AWS managed policies</strong> (e.g.{' '}
            <code className="text-core-400">AmazonS3ReadOnlyAccess</code>) are maintained by AWS — broad,
            good for learning, often too wide for prod. <strong className="text-white">Customer managed
            policies</strong> are reusable documents you write once and attach to many roles.{' '}
            <strong className="text-white">Inline policies</strong> embed directly on one identity — harder
            to reuse but keeps permissions tightly coupled.
          </p>
        </ContentStep>
        <Callout variant="insight">
          For production lakes, prefer customer managed policies named by function —{' '}
          <code className="text-core-400">LakeRawReadPolicy</code>,{' '}
          <code className="text-core-400">LakeProcessedWritePolicy</code> — composed onto roles rather
          than one giant AdministratorAccess.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Identity-based policies attach to users, groups, roles — define what that identity can do.',
          'Resource-based policies attach to resources (S3 bucket, KMS key) — define who can access that resource.',
          'Trust policies attach only to roles — define who may assume the role, not S3/Glue actions.',
          'Data lake access often needs matching identity AND resource policies; Deny always wins.',
        ]}
      />
    </LessonArticle>
  )
}
