import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function PolicyJsonStructure() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Policies are permission documents">
        Every IAM permission you grant — whether to a human analyst, a Glue job, or a Lambda function —
        ultimately lives in a JSON document called a <strong className="text-white">policy</strong>. Learning
        to read that JSON is like learning to read a contract: once you see the pattern, bucket policies,
        role trust policies, and SCPs all start to look familiar.
      </Callout>

      <Definition term="IAM policy document">
        <p>
          An IAM policy is a JSON document with a <strong className="text-white">Version</strong>, one or
          more <strong className="text-white">Statement</strong> blocks, and optional fields inside each
          statement like <strong className="text-white">Sid</strong>,{' '}
          <strong className="text-white">Effect</strong>, <strong className="text-white">Action</strong>,{' '}
          <strong className="text-white">Resource</strong>, <strong className="text-white">Condition</strong>,
          and <strong className="text-white">Principal</strong>. Identity-based policies attach to users,
          groups, or roles; resource-based policies attach to resources like S3 buckets or KMS keys.
        </p>
      </Definition>

      <LessonSection title="Top-level structure: Version and Statement">
        <ContentStep number={1} title="Version">
          <p className="text-slate-300">
            Always use <span className="font-mono text-sm text-core-400">&quot;2012-10-17&quot;</span> for
            modern IAM. Older versions exist but you should never write them in new policies. The Version
            field tells AWS which grammar rules apply when evaluating the document.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Statement array">
          <p className="text-slate-300">
            Each element in <span className="font-mono text-sm text-core-400">Statement</span> is one rule.
            A Glue job role might have one statement allowing <span className="font-mono text-sm">s3:GetObject</span>{' '}
            on a raw-data prefix and another allowing <span className="font-mono text-sm">logs:CreateLogStream</span>{' '}
            on CloudWatch. Multiple statements combine — all applicable rules are considered during evaluation.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Sid (optional statement ID)">
          <p className="text-slate-300">
            <span className="font-mono text-sm text-core-400">Sid</span> is a friendly label for humans
            and diffs — like <span className="font-mono text-sm">&quot;AllowReadRawParquet&quot;</span>.
            AWS ignores Sid during authorization; it never grants or denies access by itself. Use it in
            team repos so code review comments map to a specific block.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Statement fields — the permission vocabulary">
        <ContentStep number={1} title="Effect">
          <p className="text-slate-300">
            <span className="font-mono text-sm text-core-400">Allow</span> or{' '}
            <span className="font-mono text-sm text-core-400">Deny</span>. Almost every statement you write
            is Allow. Deny is powerful and permanent within that policy — use sparingly for guardrails
            (covered in the explicit-deny lesson).
          </p>
        </ContentStep>
        <ContentStep number={2} title="Action">
          <p className="text-slate-300">
            Which API operations are permitted — e.g.{' '}
            <span className="font-mono text-sm">s3:ListBucket</span>,{' '}
            <span className="font-mono text-sm">glue:StartJobRun</span>,{' '}
            <span className="font-mono text-sm">redshift-data:ExecuteStatement</span>. Wildcards work:{' '}
            <span className="font-mono text-sm">s3:Get*</span> matches GetObject and GetObjectVersion.
            Prefer specific actions over <span className="font-mono text-sm">*</span> in production.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Resource">
          <p className="text-slate-300">
            Which ARNs the actions apply to. S3 object ARNs look like{' '}
            <span className="font-mono text-sm">arn:aws:s3:::my-lake/raw/*</span>. Glue job ARNs include
            the job name. Use prefix ARNs so a transform role reads only{' '}
            <span className="font-mono text-sm">raw/</span> and writes only{' '}
            <span className="font-mono text-sm">curated/</span> — not the entire account.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Condition (optional)">
          <p className="text-slate-300">
            Extra gates: IP address, MFA present, encryption required, or tag match. Example: allow{' '}
            <span className="font-mono text-sm">s3:PutObject</span> only when{' '}
            <span className="font-mono text-sm">s3:x-amz-server-side-encryption</span> is{' '}
            <span className="font-mono text-sm">aws:kms</span>. Conditions are how ABAC with tags
            scales — covered later in this sub-topic.
          </p>
        </ContentStep>
        <ContentStep number={5} title="Principal (resource-based policies only)">
          <p className="text-slate-300">
            <span className="font-mono text-sm text-core-400">Principal</span> appears in bucket policies,
            KMS key policies, and SNS topic policies — not in identity policies attached to roles. It
            names <em>who</em> is allowed: an account ID, a role ARN, or{' '}
            <span className="font-mono text-sm">*</span> (avoid in production). A cross-account lake
            bucket policy says which external role may call <span className="font-mono text-sm">s3:GetObject</span>.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Mini policy — S3 List and Get on a prefix">
        <p className="text-slate-300">
          Below is a realistic identity policy fragment for a read-only analytics role. It can list the
          bucket (needed before GetObject on keys) and download objects under the{' '}
          <span className="font-mono text-sm">curated/sales/</span> prefix only.
        </p>
        <Example title="Read-only curated sales prefix" caption="Identity policy attached to a role">
{`{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ListCuratedSalesPrefix",
      "Effect": "Allow",
      "Action": "s3:ListBucket",
      "Resource": "arn:aws:s3:::acme-data-lake",
      "Condition": {
        "StringLike": {
          "s3:prefix": ["curated/sales/*"]
        }
      }
    },
    {
      "Sid": "GetCuratedSalesObjects",
      "Effect": "Allow",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::acme-data-lake/curated/sales/*"
    }
  ]
}`}
        </Example>
        <Callout variant="tip">
          <span className="font-mono text-sm">s3:ListBucket</span> applies to the{' '}
          <em>bucket</em> ARN; <span className="font-mono text-sm">s3:GetObject</span> applies to{' '}
          <em>object</em> ARNs with the key path appended. Mixing them up is a common policy editor mistake.
        </Callout>
        <Callout variant="insight">
          Interview sound bite: &quot;A policy is JSON with Version and Statement blocks; each statement
          has Effect, Action, Resource, and optional Condition. Principal appears in resource policies,
          not identity policies.&quot;
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Every IAM permission document uses Version "2012-10-17" and a Statement array — Sid is optional and human-readable only.',
          'Effect (Allow/Deny), Action (API ops), Resource (ARNs), and Condition (extra gates) are the core statement fields.',
          'Principal names who can access a resource — used in S3 bucket policies and KMS keys, not in role-attached identity policies.',
          'Data-engineering pattern: scope S3 actions to bucket + prefix ARNs; split ListBucket (with prefix condition) from GetObject on object ARNs.',
        ]}
      />
    </LessonArticle>
  )
}
