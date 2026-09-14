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

export function S3Encryption() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Encryption is default expectation, not a premium feature">
        Lake buckets hold PII, financial events, and credentials-adjacent logs. S3 encrypts at rest with
        SSE-S3, SSE-KMS, or SSE-C; in transit via HTTPS. Data engineers set{' '}
        <strong className="text-white">bucket default encryption</strong> and align KMS keys with
        replication, cross-account roles, and Glue/Athena service permissions.
      </Callout>

      <Definition term="Server-side encryption (SSE)">
        <p>
          With <strong className="text-white">SSE</strong>, S3 encrypts objects at rest and transparently
          decrypts on authorized read. Clients can upload plaintext over HTTPS — S3 stores ciphertext.
          Choose key management model: AWS-managed (SSE-S3), KMS (SSE-KMS), or customer-provided keys
          (SSE-C).
        </p>
      </Definition>

      <LessonSection title="SSE-S3, SSE-KMS, SSE-C">
        <ContentStep number={1} title="SSE-S3 (AES-256, AWS managed keys)">
          <p className="text-slate-300">
            Simplest default: no KMS API calls per object, no per-key IAM policies. Sufficient for many
            internal lakes without strict key custody requirements. Enable as bucket default encryption —
            every new object encrypted automatically.
          </p>
        </ContentStep>
        <ContentStep number={2} title="SSE-KMS (KMS CMK)">
          <p className="text-slate-300">
            Uses a KMS key — AWS managed <span className="font-mono text-sm">aws/s3</span> or customer
            managed CMK. Adds audit trail in CloudTrail for key usage, key rotation, cross-account grants,
            and separation of duties. Required in many compliance programs.{' '}
            <strong className="text-white">Cost:</strong> KMS API charges on high-request prefixes — watch
            hot small-file landing zones.
          </p>
        </ContentStep>
        <ContentStep number={3} title="SSE-C (customer-provided keys)">
          <p className="text-slate-300">
            You supply a 256-bit AES key with each request; AWS never stores it. Rare in managed DE stacks
            — operational burden on clients. Appears in hybrid or specialized compliance scenarios; Glue
            and Athena prefer SSE-S3 or SSE-KMS.
          </p>
        </ContentStep>
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Mode</th>
                <th className="px-4 py-3">Key custody</th>
                <th className="px-4 py-3">DE typical use</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['SSE-S3', 'AWS S3 managed', 'Default bucket encryption, dev/staging lakes'],
                ['SSE-KMS', 'KMS CMK', 'Prod PII lakes, cross-account, audit-heavy'],
                ['SSE-C', 'Client per request', 'Rare; custom integrations only'],
              ].map(([mode, custody, use]) => (
                <tr key={mode} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{mode}</td>
                  <td className="px-4 py-3">{custody}</td>
                  <td className="px-4 py-3">{use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Encryption in transit (HTTPS)">
        <ContentStep number={1} title="TLS for all S3 API calls">
          <p className="text-slate-300">
            SDKs and CLI use HTTPS by default. Enforce with bucket policy Deny when{' '}
            <span className="font-mono text-sm">aws:SecureTransport</span> is false — blocks plaintext HTTP
            exfil paths and satisfies many audit controls.
          </p>
        </ContentStep>
        <ContentStep number={2} title="VPC endpoints">
          <p className="text-slate-300">
            Gateway endpoint for S3 keeps traffic on AWS network from private subnets (Glue workers, EMR,
            Redshift Spectrum). Encryption in transit still TLS; endpoint adds network isolation without
            NAT charges for S3-bound traffic.
          </p>
        </ContentStep>
        <Flowchart
          title="Encrypt at rest and in transit"
          chart={`flowchart LR
  CLIENT[Client Glue Lambda Athena]
  TLS[HTTPS TLS in transit]
  S3[S3 bucket]
  SSE[SSE-S3 or SSE-KMS at rest]
  KMS[(KMS CMK optional)]
  CLIENT --> TLS
  TLS --> S3
  S3 --> SSE
  SSE --> KMS`}
        />
      </LessonSection>

      <LessonSection title="DE default recommendations">
        <ContentStep number={1} title="Account baseline">
          <p className="text-slate-300">
            Bucket default encryption SSE-S3 minimum; SSE-KMS CMK per environment (dev/prod) for regulated
            data. Deny unencrypted object uploads with bucket policy{' '}
            <span className="font-mono text-sm">s3:x-amz-server-side-encryption</span> conditions if policy-as-code
            requires KMS specifically.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Service role KMS permissions">
          <p className="text-slate-300">
            Glue job role, Athena workgroup role, and Redshift COPY role need{' '}
            <span className="font-mono text-sm">kms:Decrypt</span> and{' '}
            <span className="font-mono text-sm">kms:GenerateDataKey</span> on the lake CMK — missing KMS
            Allow causes opaque AccessDenied on otherwise valid S3 paths.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Replication and MRKs">
          <p className="text-slate-300">
            Cross-region replication with SSE-KMS needs destination key policy trust. Multi-Region Keys
            (MRKs) simplify DR encryption — plan key policy before enabling CRR on encrypted curated data.
          </p>
        </ContentStep>
        <Example title="Bucket default encryption (SSE-KMS)">
{`{
  "Rules": [{
    "ApplyServerSideEncryptionByDefault": {
      "SSEAlgorithm": "aws:kms",
      "KMSMasterKeyID": "arn:aws:kms:us-east-1:123456789012:key/abc-123"
    },
    "BucketKeyEnabled": true
  }]
}`}
        </Example>
        <Callout variant="tip" title="S3 Bucket Keys">
          Bucket Key reduces KMS API calls (and cost) for SSE-KMS by using a bucket-level key — enable for
          high-throughput landing prefixes without dropping KMS audit benefits.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'SSE-S3 for simple default encryption; SSE-KMS when audit, rotation, and cross-account key policy matter.',
          'SSE-C is rare in managed DE — prefer SSE-S3 or SSE-KMS for Glue/Athena compatibility.',
          'Enforce HTTPS with bucket policy Deny on insecure transport; use VPC gateway endpoints in private subnets.',
          'Grant Glue/Athena/Redshift roles kms:Decrypt + GenerateDataKey on lake CMKs — S3 Allow alone is not enough.',
          'Enable bucket default encryption and S3 Bucket Keys for high-volume SSE-KMS prefixes.',
        ]}
      />
    </LessonArticle>
  )
}
