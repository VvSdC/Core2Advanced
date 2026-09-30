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

export function GrantsAndEncryptionContext() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Two quieter KMS features you already rely on">
        When you attach an encrypted EBS volume or launch an encrypted Redshift cluster, you never edit a key
        policy — yet the service can use your key. That is a <strong className="text-white">grant</strong>. And
        when S3 decrypts an object, it proves the ciphertext belongs to that exact object using{' '}
        <strong className="text-white">encryption context</strong>. Both show up constantly in CloudTrail and in
        AccessDenied debugging, so it pays to understand them.
      </Callout>

      <Definition term="Grant and encryption context">
        <p>
          A <strong className="text-white">grant</strong> is a programmatic, delegated permission on one KMS key
          that lets a grantee principal perform listed operations, optionally only with a given encryption
          context. <strong className="text-white">Encryption context</strong> is a set of non-secret key-value
          pairs passed to Encrypt or GenerateDataKey and cryptographically bound to the ciphertext as additional
          authenticated data — Decrypt fails unless the exact same context is supplied.
        </p>
      </Definition>

      <LessonSection title="Grants — delegated, temporary permissions">
        <ContentStep number={1} title="Create, retire, revoke">
          <p className="text-slate-300">
            <span className="font-mono text-sm">CreateGrant</span> names a key, a grantee principal, allowed
            operations (Decrypt, GenerateDataKey, and so on), optional constraints, and an optional retiring
            principal. The grantee or retiring principal calls <span className="font-mono text-sm">RetireGrant</span>{' '}
            when done; a key administrator can force removal with{' '}
            <span className="font-mono text-sm">RevokeGrant</span>. Grants never expire on their own.
          </p>
        </ContentStep>
        <ContentStep number={2} title="How AWS services use grants">
          <p className="text-slate-300">
            EBS creates a grant so the EC2 host can decrypt the volume data key while it is attached. Redshift
            creates a grant for the cluster so it can use your key for the lifetime of the cluster. RDS and
            Secrets Manager do the same. This is why a service role needs{' '}
            <span className="font-mono text-sm">kms:CreateGrant</span> — ideally limited with{' '}
            <span className="font-mono text-sm">kms:GrantIsForAWSResource</span> set to true.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Grant tokens and eventual consistency">
          <p className="text-slate-300">
            A new grant is eventually consistent — it can take a short time before every KMS endpoint honors it.
            <span className="font-mono text-sm"> CreateGrant</span> returns a{' '}
            <strong className="text-white">grant token</strong>; pass it in the next Decrypt or GenerateDataKey
            call to use the grant immediately. Services handle this for you; custom code that creates grants
            should too.
          </p>
        </ContentStep>
        <Example title="Grant a batch role temporary decrypt" caption="Constrained to one dataset context">
{`aws kms create-grant \\
  --key-id alias/de-lake-prod \\
  --grantee-principal arn:aws:iam::111122223333:role/backfill-orders-2024 \\
  --retiring-principal arn:aws:iam::111122223333:role/platform-kms-admin \\
  --operations Decrypt DescribeKey \\
  --constraints EncryptionContextSubset={dataset=orders}

# Returns GrantId and GrantToken
aws kms list-grants --key-id alias/de-lake-prod
aws kms retire-grant --key-id <key-arn> --grant-id <grant-id>`}
        </Example>
        <Callout variant="info">
          Grants are useful for short-lived backfills, but for steady-state pipeline roles prefer key policy plus
          IAM — policies are easier to review than grants scattered across a key.
        </Callout>
      </LessonSection>

      <LessonSection title="Encryption context — binding ciphertext to its purpose">
        <ContentStep number={1} title="Non-secret, but must match">
          <p className="text-slate-300">
            Context is plain text — never put PII or passwords in it. Its power is binding: ciphertext created with
            context <span className="font-mono text-sm">dataset=orders</span> will not decrypt with{' '}
            <span className="font-mono text-sm">dataset=customers</span>. An attacker who copies an encrypted data
            key from one record to another fails the integrity check.
          </p>
        </ContentStep>
        <ContentStep number={2} title="How S3 uses it">
          <p className="text-slate-300">
            With SSE-KMS, S3 sets context to the object ARN, for example{' '}
            <span className="font-mono text-sm">aws:s3:arn = arn:aws:s3:::acme-lake-prod/silver/orders/part-0001.parquet</span>.
            With S3 Bucket Keys enabled, the context becomes the bucket ARN instead. Policies that pin context to
            object ARNs break when you turn on Bucket Keys — a classic migration surprise.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Visible in CloudTrail">
          <p className="text-slate-300">
            Every Decrypt and GenerateDataKey event records the context in{' '}
            <span className="font-mono text-sm">requestParameters.encryptionContext</span>. That gives auditors a
            precise answer to &quot;which object or dataset was decrypted&quot; without ever logging plaintext.
          </p>
        </ContentStep>
        <Flowchart
          title="Encryption context lifecycle"
          chart={`flowchart LR
  W[Writer GenerateDataKey]
  CTX[Context dataset orders]
  CT[Ciphertext bound to context]
  R[Reader Decrypt]
  MATCH[Same context supplied]
  BAD[Different context]
  OK[Plaintext data key]
  FAIL[InvalidCiphertextException]
  W --> CTX --> CT
  CT --> R
  R --> MATCH --> OK
  R --> BAD --> FAIL`}
        />
      </LessonSection>

      <LessonSection title="Using context in policies">
        <ContentStep number={1} title="Condition keys">
          <p className="text-slate-300">
            <span className="font-mono text-sm">kms:EncryptionContext:dataset</span> matches a specific key and
            value; <span className="font-mono text-sm">kms:EncryptionContextKeys</span> requires certain keys to be
            present. Use them to let the finance Glue role decrypt only finance datasets under one shared key.
          </p>
        </ContentStep>
        <Example title="Key policy statement scoped by context" caption="Glue role decrypts only its S3 prefix">
{`{
  "Sid": "OrdersEtlDecryptOrdersPrefixOnly",
  "Effect": "Allow",
  "Principal": { "AWS": "arn:aws:iam::111122223333:role/glue-orders-silver-etl" },
  "Action": ["kms:Decrypt", "kms:GenerateDataKey"],
  "Resource": "*",
  "Condition": {
    "StringLike": {
      "kms:EncryptionContext:aws:s3:arn": "arn:aws:s3:::acme-lake-prod/silver/orders/*"
    }
  }
}`}
        </Example>
        <Callout variant="tip">
          If Bucket Keys are enabled, match the bucket ARN in that condition instead — the object path is no
          longer part of the context KMS sees.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Grants delegate specific KMS operations to a principal programmatically — CreateGrant, RetireGrant, RevokeGrant.',
          'EBS, Redshift, RDS, and other services use grants behind the scenes; limit CreateGrant with kms:GrantIsForAWSResource.',
          'Grants are eventually consistent — pass the grant token to use a new grant immediately.',
          'Encryption context is non-secret AAD bound to ciphertext; Decrypt fails unless the context matches exactly.',
          'S3 uses the object ARN as context, or the bucket ARN with Bucket Keys; context appears in CloudTrail and policy conditions.',
        ]}
      />
    </LessonArticle>
  )
}
