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

export function S3EncryptionSseKms() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Every object in S3 is already encrypted — so why bother?">
        Since January 2023, S3 encrypts every new object with SSE-S3 by default. That protects the disks, but
        anyone with <span className="font-mono text-sm">s3:GetObject</span> can still read the data. Switching{' '}
        <span className="font-mono text-sm">acme-lake-prod</span> to <strong className="text-white">SSE-KMS</strong>{' '}
        adds a second, independent gate: the caller also needs permission on the KMS key, and every decrypt is
        logged in CloudTrail.
      </Callout>

      <Definition term="SSE-KMS">
        <p>
          Server-side encryption where S3 asks KMS for a data key per object (or per bucket with Bucket Keys),
          encrypts the object with it, and stores the encrypted data key alongside the object. Reading requires{' '}
          <span className="font-mono text-sm">kms:Decrypt</span> on the key; writing requires{' '}
          <span className="font-mono text-sm">kms:GenerateDataKey</span>. The key can be the AWS managed{' '}
          <span className="font-mono text-sm">aws/s3</span> key or a customer managed key such as{' '}
          <span className="font-mono text-sm">alias/de-lake-prod</span>.
        </p>
      </Definition>

      <LessonSection title="The four S3 server-side encryption options">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Option</th>
                <th className="px-4 py-3">Who manages the key</th>
                <th className="px-4 py-3">When DE teams use it</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['SSE-S3', 'S3-owned keys, no KMS calls', 'Default baseline; scratch and low-sensitivity buckets'],
                ['SSE-KMS', 'KMS key — aws/s3 or your CMK', 'Lake and warehouse staging with access control and audit'],
                ['DSSE-KMS', 'Two layers of encryption with KMS', 'Regulated workloads that require dual-layer encryption'],
                ['SSE-C', 'You send the key with every request', 'Rare in DE — every reader must hold the raw key'],
              ].map(([opt, who, when]) => (
                <tr key={opt} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{opt}</td>
                  <td className="px-4 py-3">{who}</td>
                  <td className="px-4 py-3">{when}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ContentStep number={1} title="Bucket default encryption">
          <p className="text-slate-300">
            Set default encryption on the bucket to SSE-KMS with your CMK. Any PutObject without encryption headers
            gets the default key. Default encryption affects only new writes — existing objects keep whatever
            encryption they had.
          </p>
        </ContentStep>
        <ContentStep number={2} title="S3 Bucket Keys">
          <p className="text-slate-300">
            Instead of one KMS call per object, S3 derives a short-lived bucket-level key and generates object data
            keys locally. AWS cites up to <strong className="text-white">99% fewer KMS requests</strong> — crucial
            for Spark jobs writing thousands of small files. Side effect: the encryption context and CloudTrail
            resource become the <strong className="text-white">bucket ARN</strong>, not the object ARN.
          </p>
        </ContentStep>
        <Example title="Default SSE-KMS with Bucket Keys" caption="CLI">
{`aws s3api put-bucket-encryption --bucket acme-lake-prod \\
  --server-side-encryption-configuration '{
    "Rules": [{
      "ApplyServerSideEncryptionByDefault": {
        "SSEAlgorithm": "aws:kms",
        "KMSMasterKeyID": "arn:aws:kms:us-east-1:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab"
      },
      "BucketKeyEnabled": true
    }]
  }'`}
        </Example>
      </LessonSection>

      <LessonSection title="Enforcing the right key">
        <ContentStep number={1} title="Deny wrong key or no key">
          <p className="text-slate-300">
            Default encryption is a fallback, not a guarantee — a client can explicitly request SSE-S3 or a
            different key. A bucket policy denying PutObject unless{' '}
            <span className="font-mono text-sm">s3:x-amz-server-side-encryption-aws-kms-key-id</span> matches your
            key ARN closes that gap.
          </p>
        </ContentStep>
        <Example title="Bucket policy — only alias/de-lake-prod key" caption="Deny uploads with SSE-S3 or another key">
{`{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DenyWrongKmsKey",
      "Effect": "Deny",
      "Principal": "*",
      "Action": "s3:PutObject",
      "Resource": "arn:aws:s3:::acme-lake-prod/*",
      "Condition": {
        "StringNotEqualsIfExists": {
          "s3:x-amz-server-side-encryption-aws-kms-key-id":
            "arn:aws:kms:us-east-1:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab"
        }
      }
    },
    {
      "Sid": "DenyNonKmsEncryption",
      "Effect": "Deny",
      "Principal": "*",
      "Action": "s3:PutObject",
      "Resource": "arn:aws:s3:::acme-lake-prod/*",
      "Condition": {
        "StringNotEqualsIfExists": { "s3:x-amz-server-side-encryption": "aws:kms" }
      }
    }
  ]
}`}
        </Example>
        <Callout variant="info">
          The IfExists form lets requests without headers fall through to default encryption. Use the full key
          ARN — the condition compares against the ARN S3 resolves, not an alias.
        </Callout>
      </LessonSection>

      <LessonSection title="Permissions and migrating existing objects">
        <ContentStep number={1} title="Read and write permissions">
          <p className="text-slate-300">
            Writers such as Glue job <span className="font-mono text-sm">orders-silver-etl</span> need{' '}
            <span className="font-mono text-sm">s3:PutObject</span> plus{' '}
            <span className="font-mono text-sm">kms:GenerateDataKey</span>. Readers such as Athena users need{' '}
            <span className="font-mono text-sm">s3:GetObject</span> plus{' '}
            <span className="font-mono text-sm">kms:Decrypt</span>. Multipart uploads also need Decrypt because S3
            decrypts parts to assemble the object — a common surprise for large Spark writes.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Re-encrypt with S3 Batch Operations">
          <p className="text-slate-300">
            To move old SSE-S3 objects to SSE-KMS, generate an S3 Inventory report, then run a Batch Operations{' '}
            <strong className="text-white">Copy</strong> job in place with the new encryption settings. For small
            prefixes, an in-place <span className="font-mono text-sm">aws s3 cp --recursive</span> with SSE flags
            works too.
          </p>
        </ContentStep>
        <Flowchart
          title="Migrating the lake from SSE-S3 to SSE-KMS"
          chart={`flowchart LR
  KEY[Create CMK alias de-lake-prod]
  POL[Grant pipeline roles on key]
  DEF[Set bucket default SSE-KMS with Bucket Key]
  INV[S3 Inventory report]
  BATCH[Batch Operations copy in place]
  ENF[Bucket policy enforces key]
  KEY --> POL --> DEF --> INV --> BATCH --> ENF`}
        />
        <Example title="Small-prefix re-encryption" caption="In-place copy with the CMK">
{`aws s3 cp s3://acme-lake-prod/silver/orders/ s3://acme-lake-prod/silver/orders/ \\
  --recursive \\
  --sse aws:kms \\
  --sse-kms-key-id alias/de-lake-prod`}
        </Example>
        <Callout variant="tip">
          Grant KMS permissions to every reader and writer before switching default encryption — otherwise the
          first job to read new objects fails with AccessDenied from KMS, not S3.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'SSE-S3 is the default since January 2023; SSE-KMS adds key-level access control and CloudTrail audit.',
          'Options: SSE-S3, SSE-KMS, DSSE-KMS (dual layer), SSE-C (customer-supplied key, rare in DE).',
          'S3 Bucket Keys cut KMS requests by up to 99% and change the encryption context to the bucket ARN.',
          'Enforce the right key with a bucket policy on s3:x-amz-server-side-encryption-aws-kms-key-id.',
          'Writers need kms:GenerateDataKey, readers kms:Decrypt; re-encrypt existing objects with a Batch Operations copy.',
        ]}
      />
    </LessonArticle>
  )
}
