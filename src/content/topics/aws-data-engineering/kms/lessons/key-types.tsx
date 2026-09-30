import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function KeyTypes() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Not every key is yours">
        When you tick &quot;encrypt&quot; on an SQS queue or a Glue catalog, a key is used — but who owns it?
        KMS has three ownership levels: keys AWS owns and hides from you, keys AWS creates in your account and
        manages for you, and keys you create and control yourself. Picking the right level decides whether you
        can share data across accounts, restrict who decrypts it, and pass a security audit.
      </Callout>

      <Definition term="Customer managed key">
        <p>
          A <strong className="text-white">customer managed key</strong> is a KMS key you create in your own
          account. You write its key policy, decide on rotation, create grants, tag it, and can disable or
          schedule its deletion. It is the only key type that supports{' '}
          <strong className="text-white">cross-account use</strong> and fine-grained access control — which
          is why production data lakes almost always run on keys like{' '}
          <code className="text-core-400">alias/de-lake-prod</code>.
        </p>
      </Definition>

      <LessonSection title="The three ownership levels">
        <ContentStep number={1} title="AWS owned keys — invisible and free">
          <p className="text-slate-300">
            Owned and operated by an AWS service and shared across many customer accounts. You cannot see them
            in the KMS console, cannot view their policy, and do not get CloudTrail entries for their use. They
            cost nothing. Examples: the default encryption for DynamoDB tables and SQS queues using SSE-SQS.
          </p>
        </ContentStep>
        <ContentStep number={2} title="AWS managed keys — visible but not editable">
          <p className="text-slate-300">
            Created in your account the first time a service needs one, with aliases like{' '}
            <code className="text-core-400">aws/s3</code>, <code className="text-core-400">aws/glue</code>,{' '}
            <code className="text-core-400">aws/redshift</code>, or{' '}
            <code className="text-core-400">aws/secretsmanager</code>. You can see them and audit their use in
            CloudTrail, and AWS rotates them automatically every year. You{' '}
            <strong className="text-white">cannot edit their key policy</strong>, so you cannot restrict them to
            specific roles or share them with another account.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Customer managed keys — full control">
          <p className="text-slate-300">
            You own the policy, rotation schedule, grants, tags, and lifecycle. Around $1 per month each plus
            requests. Required when a consumer account must read your lake, when only specific roles may decrypt
            PII, or when auditors want to see who controls the key.
          </p>
        </ContentStep>
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Capability</th>
                <th className="px-4 py-3">AWS owned</th>
                <th className="px-4 py-3">AWS managed</th>
                <th className="px-4 py-3">Customer managed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Visible in your account', 'No', 'Yes', 'Yes'],
                ['Edit key policy', 'No', 'No', 'Yes'],
                ['Use cross-account', 'No', 'No', 'Yes'],
                ['Rotation', 'AWS decides', 'Automatic yearly', 'You choose — optional automatic or on demand'],
                ['CloudTrail usage logs', 'No', 'Yes', 'Yes'],
                ['Delete or disable', 'No', 'No', 'Yes — with a waiting period'],
                ['Monthly key fee', 'None', 'None', 'About $1 per key'],
              ].map(([capability, owned, managed, customer]) => (
                <tr key={capability} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{capability}</td>
                  <td className="px-4 py-3">{owned}</td>
                  <td className="px-4 py-3">{managed}</td>
                  <td className="px-4 py-3">{customer}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="insight">
          Interview framing: &quot;We used aws/s3 on the lake&quot; is fine for a sandbox. The moment a second
          account, a PII restriction, or an auditor appears, you need a customer managed key — and migrating
          later means re-encrypting existing objects.
        </Callout>
      </LessonSection>

      <LessonSection title="Choosing a key type">
        <p className="text-slate-300">
          Walk through these questions for each dataset or resource. Most production DE resources end on the
          right-hand branch.
        </p>
        <Flowchart
          title="Which key type should this resource use?"
          chart={`flowchart TD
  START[New encrypted resource] --> XA{Another account must read it}
  XA -->|yes| CMK[Customer managed key]
  XA -->|no| RESTRICT{Only some roles may decrypt}
  RESTRICT -->|yes| CMK
  RESTRICT -->|no| AUDIT{Need key usage in CloudTrail}
  AUDIT -->|yes| AMK[AWS managed key is enough]
  AUDIT -->|no| AOK[AWS owned key default is fine]
  CMK --> ALIAS[Alias like de-lake-prod]`}
        />
        <ContentStep number={1} title="Lake buckets — customer managed">
          <p className="text-slate-300">
            <code className="text-core-400">acme-lake-prod</code> is shared with analytics accounts and holds
            PII, so it uses <code className="text-core-400">alias/de-lake-prod</code> with a policy listing the
            exact Glue and Athena roles.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Internal scratch queue — AWS owned is fine">
          <p className="text-slate-300">
            A dev SQS queue passing file names between two Lambdas in one account can stay on SSE-SQS. No
            sharing, no PII, no audit requirement.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Key specs — symmetric, asymmetric, HMAC">
        <p className="text-slate-300">
          Separate from ownership, every KMS key has a <strong className="text-white">key spec</strong> that
          fixes what it can do. You choose it at creation time and cannot change it later.
        </p>
        <ContentStep number={1} title="Symmetric — SYMMETRIC_DEFAULT">
          <p className="text-slate-300">
            A 256-bit AES-GCM key used for encrypt and decrypt. This is the default and the only kind AWS
            services use to encrypt your data at rest. It also supports automatic rotation.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Asymmetric — RSA and ECC">
          <p className="text-slate-300">
            Key pairs for signing and verifying (for example a data provider signing export files) or for
            encrypting small payloads outside AWS with the downloadable public key. Not used for bulk lake data.
          </p>
        </ContentStep>
        <ContentStep number={3} title="HMAC — generate and verify MACs">
          <p className="text-slate-300">
            Keys like <code className="text-core-400">HMAC_256</code> produce message authentication codes —
            handy for tamper-evident tokens or consistent hashing of identifiers without exposing the secret.
          </p>
        </ContentStep>
        <Callout variant="tip" title="Default answer">
          If you are unsure, create a symmetric customer managed key. AWS has been adding newer specs over time
          (including post-quantum signing keys), but those are niche for data engineering — check the KMS docs
          when a signing use case appears.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'AWS owned keys: invisible, free, no control — fine for low-risk internal resources.',
          'AWS managed keys (aws/s3, aws/glue, aws/redshift): visible, rotated yearly, but policy cannot be edited or shared cross-account.',
          'Customer managed keys: you control policy, rotation, grants, and deletion — required for cross-account and fine-grained access.',
          'Choose a customer managed key when another account reads the data, only some roles may decrypt, or auditors ask who controls the key.',
          'Key spec is fixed at creation: symmetric for data encryption, asymmetric RSA/ECC for signing, HMAC for MACs.',
        ]}
      />
    </LessonArticle>
  )
}
