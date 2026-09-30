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

export function CrossAccountKms() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Sharing the bucket is not sharing the data">
        The producer account <span className="font-mono text-sm">111122223333</span> owns the lake{' '}
        <span className="font-mono text-sm">acme-lake-prod</span>, encrypted with a customer managed key. The
        analytics account <span className="font-mono text-sm">444455556666</span> runs Athena and Redshift. You
        add a bucket policy granting the analytics role <span className="font-mono text-sm">s3:GetObject</span>{' '}
        — and every query still fails with AccessDenied. The objects are readable; the key is not. Cross-account
        encrypted data needs three policies to line up.
      </Callout>

      <Definition term="Cross-account KMS access">
        <p>
          Using a KMS key owned by one account from a principal in another. It requires{' '}
          <strong className="text-white">both</strong> sides to agree: the key policy in the owning account must
          allow the external account (or a specific role in it), and an IAM policy in the external account must
          allow the principal to call the KMS actions on the key&apos;s full ARN. Aliases cannot be used across
          accounts — always reference the key ARN.
        </p>
      </Definition>

      <LessonSection title="The three policies that must line up">
        <Flowchart
          title="Analytics role reads producer lake"
          chart={`flowchart LR
  ROLE[Analytics role in 444455556666]
  IAMP[IAM policy allows s3 Get and kms Decrypt on key ARN]
  BP[Producer bucket policy allows analytics account]
  KP[Producer key policy allows analytics account]
  OBJ[(acme-lake-prod objects)]
  KEY[CMK in 111122223333]
  ROLE --> IAMP
  IAMP --> BP --> OBJ
  IAMP --> KP --> KEY
  KEY -->|unwraps data key| OBJ`}
        />
        <ContentStep number={1} title="Producer key policy">
          <p className="text-slate-300">
            Add a statement to the key policy of <span className="font-mono text-sm">alias/de-lake-prod</span>{' '}
            allowing principal <span className="font-mono text-sm">arn:aws:iam::444455556666:root</span> (or a
            specific role ARN) to call <span className="font-mono text-sm">kms:Decrypt</span> and{' '}
            <span className="font-mono text-sm">kms:DescribeKey</span>. Trusting the account root delegates the
            choice of which roles to the consumer&apos;s IAM administrators.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Consumer IAM policy">
          <p className="text-slate-300">
            In the analytics account, attach an IAM policy to the Athena or Glue role allowing{' '}
            <span className="font-mono text-sm">kms:Decrypt</span> on the producer key ARN. The key policy alone
            is not enough — cross-account access always needs the consumer side to opt in too.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Producer bucket policy">
          <p className="text-slate-300">
            Grant <span className="font-mono text-sm">s3:GetObject</span> and{' '}
            <span className="font-mono text-sm">s3:ListBucket</span> to the analytics account. Also enable S3 Object
            Ownership as bucket owner enforced so objects written by other accounts do not end up owned by the
            writer.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Policy examples">
        <Example title="Producer key policy statement" caption="Account 111122223333 — key behind alias/de-lake-prod">
{`{
  "Sid": "AllowAnalyticsAccountDecrypt",
  "Effect": "Allow",
  "Principal": { "AWS": "arn:aws:iam::444455556666:root" },
  "Action": ["kms:Decrypt", "kms:DescribeKey"],
  "Resource": "*",
  "Condition": {
    "StringEquals": { "kms:ViaService": "s3.us-east-1.amazonaws.com" }
  }
}`}
        </Example>
        <Example title="Consumer IAM policy" caption="Account 444455556666 — attached to athena-analyst role">
{`{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:ListBucket"],
      "Resource": ["arn:aws:s3:::acme-lake-prod", "arn:aws:s3:::acme-lake-prod/*"]
    },
    {
      "Effect": "Allow",
      "Action": ["kms:Decrypt", "kms:DescribeKey"],
      "Resource": "arn:aws:kms:us-east-1:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab"
    }
  ]
}`}
        </Example>
        <Callout variant="info">
          If the consumer also writes back to the producer bucket, add{' '}
          <span className="font-mono text-sm">kms:GenerateDataKey</span> on both sides — but most designs keep
          consumers read-only and write derived data to their own bucket and key.
        </Callout>
      </LessonSection>

      <LessonSection title="Why aws/s3 cannot be shared, and Lake Formation">
        <ContentStep number={1} title="AWS managed keys are account-locked">
          <p className="text-slate-300">
            The key policy of an AWS managed key like <span className="font-mono text-sm">aws/s3</span> is written
            by AWS and cannot be edited, and it only allows principals in the owning account. Objects encrypted
            with <span className="font-mono text-sm">aws/s3</span> are therefore unreadable from any other account.
            Any bucket intended for sharing must use a customer managed key — or be re-encrypted before sharing.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Lake Formation cross-account sharing">
          <p className="text-slate-300">
            With Lake Formation, consumers get table-level grants and LF vends temporary credentials using the role
            that registered the S3 location. That registration role in the producer account needs Decrypt on the
            lake key; consumer principals then do not need direct key access. If the Data Catalog itself is
            encrypted, the catalog key must also allow the consumer side — check the current Lake Formation docs for
            the exact requirements.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Common AccessDenied causes">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Symptom or cause</th>
                <th className="px-4 py-3">Fix</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Objects encrypted with aws/s3', 'Re-encrypt with a CMK via Batch Operations copy'],
                ['Key policy missing consumer account', 'Add principal 444455556666 with Decrypt and DescribeKey'],
                ['Consumer IAM policy missing kms:Decrypt', 'Allow Decrypt on the producer key ARN'],
                ['IAM policy uses the alias', 'Aliases do not work cross-account — use the full key ARN'],
                ['Wrong Region', 'Keys are Regional; the ARN Region must match where data was encrypted'],
                ['Condition mismatch', 'kms:ViaService or kms:CallerAccount values exclude the caller'],
                ['VPC endpoint policy', 'KMS or S3 endpoint policy in the consumer VPC blocks the producer resources'],
              ].map(([cause, fix]) => (
                <tr key={cause} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{cause}</td>
                  <td className="px-4 py-3">{fix}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip">
          Check CloudTrail in <strong className="text-white">both</strong> accounts: the producer trail shows the
          denied KMS call against its key, and the error message usually names which policy failed.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Cross-account encrypted reads need three policies: producer key policy, producer bucket policy, consumer IAM policy.',
          'Both sides must allow KMS: key policy trusts the consumer account; consumer IAM allows kms:Decrypt on the key ARN.',
          'AWS managed keys such as aws/s3 cannot be shared — shared buckets must use customer managed keys.',
          'Aliases do not resolve across accounts — always use the full key ARN in consumer policies.',
          'Lake Formation shifts key access to the location registration role; check CloudTrail in both accounts when debugging.',
        ]}
      />
    </LessonArticle>
  )
}
