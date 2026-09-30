import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function PuttingItTogetherKms() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="KMS for DE — policies, context, rotation, and encrypted lakes">
        You covered key policies, grants and encryption context, rotation and lifecycle, SSE-KMS with Bucket Keys,
        encrypting Glue, Athena, and Redshift, cross-account access, costs and quotas, multi-Region keys and BYOK,
        auditing with CloudTrail, and pipeline patterns. This checkpoint ties intermediate and advanced KMS lessons
        before <strong className="text-white">CloudTrail</strong> — the audit log behind every one of those API
        calls.
      </Callout>

      <Definition term="KMS mental model for data engineering">
        <p>
          AWS KMS is the <strong className="text-white">second lock on every dataset</strong>: S3, Glue, Athena,
          Redshift, SQS, and Secrets Manager encrypt with data keys that only a KMS key can unwrap. Access requires
          both the resource permission and the key permission; key policies are the root of trust; encryption context
          binds ciphertext to its purpose; rotation is free of re-encryption; deletion is irreversible; and every call
          lands in CloudTrail.
        </p>
      </Definition>

      <LessonSection title="KMS sub-topic map">
        <Flowchart
          title="KMS lesson map — intermediate through advanced"
          chart={`flowchart TB
  START[KMS complete path]
  START --> KP[Key policies]
  START --> GC[Grants and encryption context]
  START --> ROT[Rotation and lifecycle]
  START --> SSE[S3 SSE-KMS]
  START --> SVC[Glue Athena Redshift encryption]
  START --> XA[Cross-account KMS]
  START --> COST[Costs and quotas]
  START --> MRK[Multi-Region keys and BYOK]
  START --> AUD[Auditing with CloudTrail]
  START --> PIPE[KMS in pipelines]
  KP --> CTNEXT
  GC --> CTNEXT
  ROT --> CTNEXT
  SSE --> CTNEXT
  SVC --> CTNEXT
  XA --> CTNEXT
  COST --> CTNEXT
  MRK --> CTNEXT
  AUD --> CTNEXT
  PIPE --> CTNEXT
  CTNEXT[CloudTrail audit next]`}
        />
      </LessonSection>

      <LessonSection title="Full KMS checkpoint — can you explain…">
        <ContentStep number={1} title="Access control">
          <p className="text-slate-300">
            Why a role with <span className="font-mono text-sm">kms:*</span> in IAM still gets AccessDenied? What the
            account root statement in the default key policy really means? How to separate key admins from key users?
          </p>
        </ContentStep>
        <ContentStep number={2} title="Grants and context">
          <p className="text-slate-300">
            How EBS and Redshift use grants? What a grant token is for? Why S3 encryption context changes when Bucket
            Keys are enabled, and how that breaks context-based conditions?
          </p>
        </ContentStep>
        <ContentStep number={3} title="Lifecycle">
          <p className="text-slate-300">
            Why rotation does not require re-encrypting the lake? When to use an alias swap instead? What the 7–30 day
            deletion window protects you from?
          </p>
        </ContentStep>
        <ContentStep number={4} title="Service encryption">
          <p className="text-slate-300">
            SSE-S3 vs SSE-KMS vs DSSE-KMS? How to enforce the right key with a bucket policy? What a Glue security
            configuration covers, and how Athena workgroups enforce result encryption?
          </p>
        </ContentStep>
        <ContentStep number={5} title="Sharing and scale">
          <p className="text-slate-300">
            The three policies needed for cross-account reads? Why aws/s3 cannot be shared? How to avoid
            ThrottlingException when Spark reads millions of objects?
          </p>
        </ContentStep>
        <ContentStep number={6} title="Operations">
          <p className="text-slate-300">
            How to find who decrypted the PII key last week? Which events to alert on? Your AccessDenied runbook, layer
            by layer?
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Interview-style quick checks">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Question</th>
                <th className="px-4 py-3">Strong answer sketch</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                [
                  'Key policy vs IAM policy?',
                  'Key policy is mandatory root of trust; IAM counts only if key policy trusts the account root.',
                ],
                [
                  'What is a grant?',
                  'Programmatic delegated permission on one key; services like EBS and Redshift create them.',
                ],
                [
                  'Encryption context?',
                  'Non-secret AAD bound to ciphertext; must match on decrypt; logged in CloudTrail; usable in conditions.',
                ],
                [
                  'Does rotation re-encrypt data?',
                  'No — new material for new ciphertext; old material retained for decrypt; same key ID.',
                ],
                [
                  'Rotation period options?',
                  'Automatic 90–2,560 days, default 365; on-demand rotation limited per key.',
                ],
                [
                  'Deleting a key?',
                  '7–30 day waiting period; after that, all data under it is unrecoverable — disable first.',
                ],
                [
                  'SSE-S3 vs SSE-KMS?',
                  'SSE-S3 default, no key-level control; SSE-KMS adds key permission and CloudTrail audit.',
                ],
                [
                  'What do Bucket Keys do?',
                  'Up to ~99% fewer KMS calls; context and CloudTrail resource become the bucket ARN.',
                ],
                [
                  'Cross-account read needs?',
                  'Producer key policy + producer bucket policy + consumer IAM Decrypt on full key ARN.',
                ],
                [
                  'Why not aws/s3 for shared data?',
                  'AWS managed key policies cannot be edited, so other accounts can never decrypt.',
                ],
                [
                  'ThrottlingException in Spark?',
                  'Shared per-Region quota exceeded — Bucket Keys, compaction, backoff, quota increase.',
                ],
                [
                  'Multi-Region key use case?',
                  'Same material across Regions for DR and client-side encrypted data; per-Region policies.',
                ],
              ].map(([question, answer]) => (
                <tr key={question} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{question}</td>
                  <td className="px-4 py-3">{answer}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip" title="Ready for CloudTrail when…">
          You can write a key policy that separates admins from users, explain why a cross-account Athena query fails
          on an aws/s3 bucket, enable SSE-KMS with Bucket Keys and an enforcing bucket policy, and walk the
          AccessDenied runbook — without opening the docs.
        </Callout>
      </LessonSection>

      <LessonSection title="What comes next — CloudTrail">
        <p className="text-slate-300">
          Every KMS call, IAM change, bucket policy edit, and Glue job start is an AWS API call.{' '}
          <strong className="text-white">AWS CloudTrail</strong> records them — who did what, from where, and when —
          giving you the audit trail for compliance and the evidence for forensics when something goes wrong in the
          data platform.
        </p>
        <Flowchart
          title="After KMS — course thread"
          chart={`flowchart LR
  KMS[KMS checkpoint]
  IAM[IAM changes]
  S3P[Bucket policy edits]
  GLUE[Glue job starts]
  CT[CloudTrail]
  LOG[(Trail logs in S3)]
  ATH[Athena investigations]
  KMS --> CT
  IAM --> CT
  S3P --> CT
  GLUE --> CT
  CT --> LOG
  LOG --> ATH`}
        />
        <Callout variant="insight">
          Revisit this checkpoint when onboarding DEs, debugging KMS AccessDenied in a new pipeline, or planning a
          cross-account data share — answers trace to lessons on key policies, SSE-KMS, cross-account access, and
          pipeline patterns covered here.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'KMS: second lock on lake data — both resource and key permissions required; key policy is the root of trust.',
          'Intermediate: key policies, grants and encryption context, rotation and lifecycle, SSE-KMS with Bucket Keys.',
          'Advanced: service encryption, cross-account keys, costs and quotas, multi-Region and BYOK, CloudTrail audit.',
          'Pipeline patterns: key per environment and domain, alias references, Encrypt vs Decrypt split, layered debugging.',
          'Next sub-topic: CloudTrail — the audit record of every KMS, IAM, S3, and Glue API call.',
        ]}
      />
    </LessonArticle>
  )
}
