import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function GettingStartedWithKms() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Why KMS after Secrets Manager in the DE path">
        In the Secrets Manager and Parameter Store lessons, every secret and every SecureString was quietly
        encrypted with a <strong className="text-white">KMS key</strong> — and you already wrote{' '}
        <code className="text-core-400">kms:Decrypt</code> into Glue and Lambda role policies. Now zoom out:{' '}
        <strong className="text-white">the lake buckets, the Glue Data Catalog, Athena query results, SQS
        queues, and the Redshift warehouse all need encryption keys too.</strong> Who owns those keys, who is
        allowed to use them, and why does a perfectly valid S3 policy still return AccessDenied? That is{' '}
        <strong className="text-white">AWS Key Management Service (KMS)</strong>.
      </Callout>

      <Definition term="What is KMS in a DE pipeline?">
        <p>
          <strong className="text-white">AWS KMS</strong> is the managed service that creates, stores, and
          controls the cryptographic keys AWS services use to encrypt your data. For data engineering, KMS is
          the <strong className="text-white">second lock on every dataset</strong> — a Glue job needs S3
          permissions to read <code className="text-core-400">acme-lake-prod</code> and KMS permissions to
          decrypt the objects inside it.
        </p>
        <p className="mt-2 text-slate-300">
          Think of KMS as{' '}
          <span className="text-core-400">the key cabinet for your whole data platform — the data lives in S3,
          Redshift, and SQS, but the keys that unlock it live in one audited place</span>.
        </p>
      </Definition>

      <LessonSection title="Roadmap for this sub-topic">
        <p className="text-slate-300">
          We build KMS in layers so key policies, grants, and cross-account sharing do not overwhelm you on day
          one. Follow this order:
        </p>
        <ContentStep number={1} title="Encryption basics — plaintext, ciphertext, keys">
          <p className="text-slate-300">
            At rest vs in transit, symmetric vs asymmetric, server-side vs client-side — the plain-English
            vocabulary every later lesson assumes.
          </p>
        </ContentStep>
        <ContentStep number={2} title="What KMS is and which key types exist">
          <p className="text-slate-300">
            The core APIs, the fact that key material never leaves KMS unencrypted, and the difference between
            AWS owned, AWS managed, and customer managed keys.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Envelope encryption — how big data gets encrypted">
          <p className="text-slate-300">
            Why S3 never sends your 5 GB Parquet file to KMS, and how data keys make encryption fast and cheap.
          </p>
        </ContentStep>
        <ContentStep number={4} title="KMS across the DE stack and the next module">
          <p className="text-slate-300">
            Which lake, catalog, queue, and warehouse resources get which key — then key policies, grants,
            rotation, and SSE-KMS in the intermediate section.
          </p>
        </ContentStep>
        <Flowchart
          title="KMS sub-topic path"
          chart={`flowchart LR
  A[Getting started] --> B[Encryption basics]
  B --> C[What is KMS]
  C --> D[Key types]
  D --> E[Envelope encryption]
  E --> F[KMS for DE]
  F --> G[Beginner checkpoint]
  G --> H[Key policies grants SSE-KMS next]`}
        />
      </LessonSection>

      <LessonSection title="Vocabulary you will use every day">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Word</th>
                <th className="px-4 py-3">Friendly meaning</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                [
                  'KMS key',
                  'The logical key resource in KMS (formerly called a CMK) — has an ID, policy, state, and the secret key material inside',
                ],
                [
                  'Key ID / ARN / alias',
                  'Three ways to name a key: a UUID, the full ARN arn:aws:kms:region:111122223333:key/UUID, or a friendly alias like alias/de-lake-prod',
                ],
                [
                  'Key material',
                  'The actual secret bits used for the math — stays inside KMS hardware and is never shown to you',
                ],
                [
                  'Data key',
                  'A short-lived key KMS generates for you to encrypt large data locally — you store only its encrypted copy',
                ],
                [
                  'Plaintext vs ciphertext',
                  'Plaintext is readable data (or a readable key); ciphertext is the scrambled version that is useless without the key',
                ],
                [
                  'Key policy',
                  'The resource policy attached to every KMS key — decides which accounts, roles, and services may use or manage it',
                ],
                [
                  'Grant',
                  'A delegated, often temporary permission to use a key — services like EBS and Redshift create them for you',
                ],
                [
                  'Encryption context',
                  'Extra non-secret key-value pairs bound to a ciphertext — must match on decrypt and show up in CloudTrail',
                ],
                [
                  'Rotation',
                  'KMS generating new key material on a schedule while keeping old versions so existing ciphertext still decrypts',
                ],
              ].map(([word, meaning]) => (
                <tr key={word} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{word}</td>
                  <td className="px-4 py-3">{meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip" title="Naming — quick check">
          Put domain and environment in every alias:{' '}
          <code className="text-core-400">alias/de-lake-prod</code>,{' '}
          <code className="text-core-400">alias/de-redshift-prod</code>,{' '}
          <code className="text-core-400">alias/de-lake-pii-prod</code>. When on-call reads an AccessDenied
          message at 2 a.m., a clear alias beats a bare key UUID with no owner documented. Code and templates
          should reference the alias or ARN — never copy key IDs around by hand.
        </Callout>
      </LessonSection>

      <LessonSection title="How KMS fits into a data platform">
        <p className="text-slate-300">
          KMS is not in the data path the way Glue or S3 is — it sits to the side. Each service asks KMS for a
          data key when it writes and asks KMS to decrypt that data key when it reads. Every one of those calls
          is checked against the key policy and IAM, and logged in CloudTrail.
        </p>
        <Flowchart
          title="DE services that call KMS"
          chart={`flowchart LR
  S3[S3 lake bronze silver gold]
  GLUE[Glue jobs and catalog]
  ATH[Athena query results]
  RS[Redshift warehouse]
  SQS[SQS queues]
  SM[Secrets Manager]
  LAKE[KMS key alias de-lake-prod]
  WH[KMS key alias de-redshift-prod]
  OPS[KMS key alias de-platform-prod]
  S3 --> LAKE
  GLUE --> LAKE
  ATH --> LAKE
  RS --> WH
  SQS --> OPS
  SM --> OPS`}
        />
        <Callout variant="insight">
          Interview framing: IAM decides who can call S3; KMS decides who can read what S3 stored. A role with{' '}
          <code className="text-core-400">s3:GetObject</code> but no <code className="text-core-400">kms:Decrypt</code>{' '}
          on the bucket key still cannot read a single row.
        </Callout>
      </LessonSection>

      <LessonSection title="Why data engineers care about KMS">
        <ContentStep number={1} title="Compliance and audits">
          <p className="text-slate-300">
            Regulations and customer contracts often require encryption at rest with keys you control and can
            audit. KMS gives you customer managed keys, rotation, and a CloudTrail record of every Decrypt.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Blast radius">
          <p className="text-slate-300">
            Separate keys per environment and data domain mean a leaked dev role or a misconfigured analyst
            role cannot decrypt production PII — even if an S3 bucket policy is too broad.
          </p>
        </ContentStep>
        <ContentStep number={3} title="AccessDenied debugging">
          <p className="text-slate-300">
            A large share of &quot;my Glue job suddenly fails with AccessDenied&quot; tickets are KMS, not S3.
            Knowing to check the key policy and <code className="text-core-400">kms:GenerateDataKey</code> on
            the writer role saves hours of staring at bucket policies.
          </p>
        </ContentStep>
      </LessonSection>

      <KeyTakeaways
        items={[
          'KMS follows Secrets Manager because every secret already used a KMS key — now the lake, catalog, queues, and warehouse need keys too.',
          'Roadmap: encryption basics → what KMS is → key types → envelope encryption → KMS across the DE stack → checkpoint.',
          'Core vocabulary: KMS key, key ID/ARN/alias, key material, data key, plaintext vs ciphertext, key policy, grant, encryption context, rotation.',
          'Name keys by domain and environment, e.g. alias/de-lake-prod and alias/de-redshift-prod.',
          'Reading encrypted data needs two permissions: the service action (s3:GetObject) and the key action (kms:Decrypt).',
        ]}
      />
    </LessonArticle>
  )
}
