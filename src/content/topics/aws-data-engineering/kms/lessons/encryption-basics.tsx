import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function EncryptionBasics() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="No math required — just three words">
        You do not need to understand the algorithms to use KMS well. You need three words —{' '}
        <strong className="text-white">plaintext, ciphertext, and key</strong> — plus a few distinctions:
        at rest vs in transit, symmetric vs asymmetric, and server-side vs client-side. With those, every
        encryption checkbox in S3, Glue, Athena, and Redshift starts to make sense.
      </Callout>

      <Definition term="Encryption">
        <p>
          <strong className="text-white">Encryption</strong> turns readable data (
          <span className="text-core-400">plaintext</span>) into scrambled data (
          <span className="text-core-400">ciphertext</span>) using a secret{' '}
          <span className="text-core-400">key</span>. Decryption reverses it — and only works with the right
          key. The algorithm is public; the security comes entirely from keeping the key secret.
        </p>
        <p className="mt-2 text-slate-300">
          A row like <code className="text-core-400">customer_id=42, email=ana@example.com</code> becomes a
          blob of random-looking bytes. Anyone who steals the blob but not the key learns nothing useful.
        </p>
      </Definition>

      <LessonSection title="At rest vs in transit">
        <ContentStep number={1} title="Encryption at rest — data sitting on disk">
          <p className="text-slate-300">
            Parquet files in <code className="text-core-400">acme-lake-prod</code>, Redshift blocks, SQS
            messages waiting in a queue, DynamoDB items — all stored somewhere physical. Encryption at rest
            means that storage holds only ciphertext. <strong className="text-white">This is where KMS
            lives.</strong>
          </p>
        </ContentStep>
        <ContentStep number={2} title="Encryption in transit — data moving over a network">
          <p className="text-slate-300">
            When Glue reads from S3 or a Lambda calls the Redshift Data API, bytes travel over the network.{' '}
            <strong className="text-white">TLS</strong> (the S in HTTPS) encrypts that connection. AWS SDKs
            use HTTPS endpoints by default; you enforce it with bucket policies using{' '}
            <code className="text-core-400">aws:SecureTransport</code>.
          </p>
        </ContentStep>
        <ContentStep number={3} title="You need both">
          <p className="text-slate-300">
            TLS protects data on the wire but not the file once it lands. Encryption at rest protects the
            stored file but not a sniffed connection. Security reviews ask about both separately.
          </p>
        </ContentStep>
        <Flowchart
          title="Where each kind of encryption applies"
          chart={`flowchart LR
  SRC[Source system] -->|TLS in transit| GLUE[Glue job]
  GLUE -->|TLS in transit| S3[(S3 lake at rest SSE-KMS)]
  S3 -->|TLS in transit| ATH[Athena]
  ATH -->|TLS in transit| RES[(Query results at rest)]`}
        />
      </LessonSection>

      <LessonSection title="Symmetric vs asymmetric keys">
        <p className="text-slate-300">
          There are two families of keys. For data engineering, symmetric does almost all the work.
        </p>
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Aspect</th>
                <th className="px-4 py-3">Symmetric</th>
                <th className="px-4 py-3">Asymmetric</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Keys', 'One key — the same key encrypts and decrypts', 'A key pair — public key and private key'],
                ['Typical algorithm', 'AES-256-GCM', 'RSA or elliptic curve (ECC)'],
                ['Speed', 'Very fast — fine for terabytes', 'Much slower — only small payloads'],
                ['Typical use', 'Encrypting S3 objects, Redshift blocks, SQS messages', 'Digital signatures, verifying tokens, sharing with outside parties'],
                ['In KMS', 'Default key spec SYMMETRIC_DEFAULT', 'RSA and ECC key specs — public key can be downloaded'],
              ].map(([aspect, sym, asym]) => (
                <tr key={aspect} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{aspect}</td>
                  <td className="px-4 py-3">{sym}</td>
                  <td className="px-4 py-3">{asym}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="info">
          Every AWS service that encrypts your data at rest — S3, Glue, Athena, Redshift, SQS, DynamoDB —
          uses <strong className="text-white">symmetric</strong> KMS keys. Asymmetric keys show up when a
          partner needs to verify a file signature or encrypt something for you without an AWS account.
        </Callout>
      </LessonSection>

      <LessonSection title="Server-side vs client-side encryption">
        <ContentStep number={1} title="Server-side encryption — the service does it">
          <p className="text-slate-300">
            You upload plaintext over TLS; S3 encrypts it before writing to disk and decrypts it when an
            authorized caller reads it. This is <strong className="text-white">SSE</strong> — for example
            SSE-S3 or SSE-KMS. Almost all lake data uses server-side encryption because it is transparent to
            Glue, Athena, and Spark.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Client-side encryption — your code does it">
          <p className="text-slate-300">
            Your application encrypts before upload, so AWS only ever stores ciphertext it cannot read by
            itself. Stronger isolation, but Athena and Glue cannot query the contents without your decryption
            code — use it for a narrow set of ultra-sensitive fields, not whole tables.
          </p>
        </ContentStep>
        <Callout variant="tip" title="Analogy — the safe deposit box">
          Your data is the valuables, the box is S3, and the bank vault key is the KMS key. Server-side
          encryption is the bank locking the box for you when you hand it over; client-side is you locking
          your own padlock before the bank ever touches it. Either way, the master key never leaves the
          vault — you only ever ask the bank to open the box for you.
        </Callout>
      </LessonSection>

      <LessonSection title="What encryption does NOT protect against">
        <p className="text-slate-300">
          Encryption at rest defends against stolen disks, leaked backups, and someone copying raw storage. It
          does <strong className="text-white">not</strong> defend against a principal that is{' '}
          <strong className="text-white">allowed</strong> to decrypt. If the Glue role behind{' '}
          <code className="text-core-400">orders-silver-etl</code> has{' '}
          <code className="text-core-400">kms:Decrypt</code> and gets compromised, the attacker reads
          plaintext exactly like the job does.
        </p>
        <ContentStep number={1} title="So key permissions are the real control">
          <p className="text-slate-300">
            Who can use a key matters as much as whether data is encrypted. That is why the intermediate
            lessons spend so long on key policies and grants.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Encryption also does not fix bad queries">
          <p className="text-slate-300">
            An analyst allowed to decrypt the PII bucket can still run{' '}
            <code className="text-core-400">SELECT *</code> and export emails. Pair KMS with Lake Formation
            column controls, masking, and least-privilege roles.
          </p>
        </ContentStep>
        <Callout variant="insight">
          &quot;Is it encrypted?&quot; is the beginner question. &quot;Who can decrypt it, and how would we
          know if they did?&quot; is the question a security reviewer actually cares about.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Plaintext + key → ciphertext; the algorithm is public, the key is the secret.',
          'At rest (disk — KMS territory) and in transit (network — TLS) are separate controls; you need both.',
          'Symmetric AES-256-GCM encrypts bulk data; asymmetric RSA/ECC is for signing and small payloads.',
          'Server-side encryption is transparent to Glue and Athena; client-side hides data even from the service.',
          'Encryption does not stop a role that is allowed to decrypt — key permissions are the real control.',
        ]}
      />
    </LessonArticle>
  )
}
