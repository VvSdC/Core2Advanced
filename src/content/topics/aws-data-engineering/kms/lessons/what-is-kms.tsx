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

export function WhatIsKms() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Keys you can use but never hold">
        The hardest part of encryption is not the math — it is keeping keys safe. Store a key in a config
        file and you are back to the hardcoded-password problem from the Secrets Manager lessons.{' '}
        <strong className="text-white">AWS KMS</strong> solves this by keeping the key material locked inside
        AWS hardware. You never download it; you send requests like &quot;encrypt this&quot; or &quot;give me a
        data key&quot; and KMS checks permissions, does the work, and logs the call.
      </Callout>

      <Definition term="AWS Key Management Service (KMS)">
        <p>
          <strong className="text-white">AWS KMS</strong> is a managed service for creating and controlling
          cryptographic keys. Key material is generated and used inside hardware security modules (HSMs) that
          are validated under <strong className="text-white">FIPS 140-3</strong>, and it never leaves them
          unencrypted — not to you, not to AWS operators. Every use of a key is authorized by the key policy
          and IAM, and recorded in CloudTrail.
        </p>
        <p className="mt-2 text-slate-300">
          Think of KMS as{' '}
          <span className="text-core-400">a locked room with a slot in the door — you pass data or keys in, KMS
          passes encrypted or decrypted results out, and the master key never comes through the slot</span>.
        </p>
      </Definition>

      <LessonSection title="The four APIs you will see everywhere">
        <ContentStep number={1} title="Encrypt — small data only">
          <p className="text-slate-300">
            Send up to <strong className="text-white">4 KB</strong> of plaintext and a key ID; get ciphertext
            back. Good for a password or a token — not for a Parquet file. That size limit is why envelope
            encryption exists.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Decrypt — the one that fails most often">
          <p className="text-slate-300">
            Send ciphertext; if the caller has <code className="text-core-400">kms:Decrypt</code> on the key
            that produced it, get plaintext back. For symmetric keys the ciphertext already records which key
            was used, so you do not have to pass the key ID (though it is good practice).
          </p>
        </ContentStep>
        <ContentStep number={3} title="GenerateDataKey — how big data is encrypted">
          <p className="text-slate-300">
            Ask KMS for a fresh data key. You get the key twice: once in plaintext (use it, then throw it
            away) and once encrypted under your KMS key (store it next to the data). S3, Glue, and Redshift call
            this for you behind the scenes.
          </p>
        </ContentStep>
        <ContentStep number={4} title="ReEncrypt — change keys without seeing plaintext">
          <p className="text-slate-300">
            Moves ciphertext from one KMS key to another entirely inside KMS. Useful when migrating from an
            AWS managed key to a customer managed key without exposing plaintext in your code.
          </p>
        </ContentStep>
        <Flowchart
          title="Every KMS request follows the same path"
          chart={`flowchart LR
  CALLER[Glue role or Lambda] --> API[KMS API request]
  API --> AUTH{Key policy and IAM allow}
  AUTH -->|yes| HSM[HSM does crypto]
  AUTH -->|no| DENY[AccessDeniedException]
  HSM --> OUT[Result returned]
  API --> CT[CloudTrail event logged]`}
        />
      </LessonSection>

      <LessonSection title="Integrated with the services you already use">
        <p className="text-slate-300">
          KMS integrates with well over 100 AWS services. For data engineering, the important point is that you
          rarely call KMS directly — you pick a key in a service setting and the service calls KMS for you:
        </p>
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Where you choose the key</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['S3', 'Bucket default encryption set to SSE-KMS with alias/de-lake-prod'],
                ['Glue', 'Security configuration for job output, CloudWatch Logs, and bookmarks; Data Catalog settings'],
                ['Athena', 'Workgroup query result encryption (SSE-KMS)'],
                ['Redshift', 'Cluster or Serverless namespace encryption key'],
                ['SQS / SNS', 'Server-side encryption on the queue or topic'],
                ['Secrets Manager', 'The KMS key chosen when you created each secret'],
              ].map(([service, where]) => (
                <tr key={service} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{service}</td>
                  <td className="px-4 py-3">{where}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="info" title="Pricing at a glance">
          Roughly: each customer managed key costs about <strong className="text-white">$1 per month</strong>,
          plus a per-request charge in the region of <strong className="text-white">$0.03 per 10,000
          requests</strong> for symmetric keys, with a small free tier of requests. Rotated key versions and
          asymmetric requests are priced differently. AWS owned keys and the key storage of AWS managed keys are
          free. Always check the KMS pricing page for your region before estimating a busy pipeline.
        </Callout>
      </LessonSection>

      <LessonSection title="Hands-on with the CLI">
        <p className="text-slate-300">
          You will mostly create keys with CloudFormation, but trying the raw APIs once makes the concepts
          concrete. Use a sandbox account.
        </p>
        <Example title="Create a key, alias it, encrypt and decrypt" caption="AWS CLI v2 — sandbox only">
{`# 1. Create a symmetric customer managed key
KEY_ID=$(aws kms create-key \\
  --description "Data lake key - prod" \\
  --tags TagKey=team,TagValue=data-platform \\
  --query KeyMetadata.KeyId --output text)

# 2. Give it a friendly alias
aws kms create-alias \\
  --alias-name alias/de-lake-prod \\
  --target-key-id $KEY_ID

# 3. Encrypt a small value (4 KB max) - CLI returns base64 ciphertext
echo -n "vendor-api-token-123" > token.txt
aws kms encrypt \\
  --key-id alias/de-lake-prod \\
  --plaintext fileb://token.txt \\
  --query CiphertextBlob --output text | base64 --decode > token.enc

# 4. Decrypt it again - only works with kms:Decrypt on this key
aws kms decrypt \\
  --key-id alias/de-lake-prod \\
  --ciphertext-blob fileb://token.enc \\
  --query Plaintext --output text | base64 --decode`}
        </Example>
        <Callout variant="tip">
          Notice you never saw the key itself — only an ID, an alias, and ciphertext. That is the whole point.
          If a teammate asks you to &quot;export the KMS key&quot; for a local script, the answer is to grant
          their role <code className="text-core-400">kms:Decrypt</code>, not to move key material around.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'KMS is a managed key service — key material stays inside FIPS 140-3 validated HSMs and never leaves unencrypted.',
          'Core APIs: Encrypt and Decrypt (up to 4 KB directly), GenerateDataKey for big data, ReEncrypt to switch keys.',
          'Every request is checked against the key policy and IAM, and logged in CloudTrail.',
          'You usually pick a key in S3, Glue, Athena, Redshift, or SQS settings and the service calls KMS for you.',
          'Cost is about $1 per customer managed key per month plus per-request charges — check the pricing page.',
        ]}
      />
    </LessonArticle>
  )
}
