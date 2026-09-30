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

export function EnvelopeEncryption() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="You cannot send 5 GB to KMS">
        KMS <code className="text-core-400">Encrypt</code> accepts at most 4 KB. Your nightly{' '}
        <code className="text-core-400">orders-silver-etl</code> output is gigabytes of Parquet — and even if
        KMS accepted it, shipping every byte over the network to an HSM would be slow and expensive. The
        answer is <strong className="text-white">envelope encryption</strong>: KMS protects a small key, and
        that small key protects the big data. It is how S3, Glue, Redshift, and EBS all encrypt at scale.
      </Callout>

      <Definition term="Envelope encryption">
        <p>
          <strong className="text-white">Envelope encryption</strong> means encrypting data with a{' '}
          <span className="text-core-400">data key</span>, then encrypting that data key with a{' '}
          <span className="text-core-400">KMS key</span>. The encrypted data key is stored right next to the
          ciphertext — like a sealed envelope stapled to a locked box. To read the data you first ask KMS to
          open the envelope, then use the key inside to unlock the box locally.
        </p>
      </Definition>

      <LessonSection title="The encrypt path — step by step">
        <ContentStep number={1} title="Ask KMS for a data key">
          <p className="text-slate-300">
            Call <code className="text-core-400">GenerateDataKey</code> with{' '}
            <code className="text-core-400">alias/de-lake-prod</code>. KMS returns the same 256-bit key twice:{' '}
            <strong className="text-white">Plaintext</strong> and{' '}
            <strong className="text-white">CiphertextBlob</strong> (the key encrypted under your KMS key).
          </p>
        </ContentStep>
        <ContentStep number={2} title="Encrypt the data locally">
          <p className="text-slate-300">
            Use the plaintext data key with AES-256-GCM on your own machine or inside the service. Gigabytes are
            fine — this is fast local CPU work, and no data goes to KMS.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Throw away the plaintext key">
          <p className="text-slate-300">
            Remove the plaintext data key from memory as soon as encryption is done. Never write it to disk,
            logs, or S3.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Store the encrypted key with the data">
          <p className="text-slate-300">
            Save the CiphertextBlob beside the ciphertext — in the file header, object metadata, or a sidecar
            field. It is safe to store in the open because only KMS can decrypt it.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="The decrypt path — and the whole picture">
        <ContentStep number={1} title="Send only the encrypted data key to KMS">
          <p className="text-slate-300">
            The reader calls <code className="text-core-400">Decrypt</code> with the small CiphertextBlob. KMS
            checks that the caller has <code className="text-core-400">kms:Decrypt</code> on the key, then
            returns the plaintext data key.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Decrypt the data locally and discard the key">
          <p className="text-slate-300">
            The reader decrypts the large ciphertext with the data key and again throws the plaintext key away.
            KMS only ever saw 32 bytes, not your dataset.
          </p>
        </ContentStep>
        <Flowchart
          title="Envelope encryption in both directions"
          chart={`flowchart TD
  subgraph WRITE[Encrypt path]
    W1[Writer calls GenerateDataKey] --> W2[KMS returns plaintext and encrypted data key]
    W2 --> W3[Encrypt data locally with plaintext key]
    W3 --> W4[Discard plaintext key]
    W4 --> W5[Store ciphertext plus encrypted key]
  end
  subgraph READ[Decrypt path]
    R1[Reader sends encrypted key to KMS Decrypt] --> R2[KMS checks policy and returns plaintext key]
    R2 --> R3[Decrypt data locally]
    R3 --> R4[Discard plaintext key]
  end
  W5 --> R1`}
        />
        <Callout variant="insight">
          This is why AccessDenied on a Glue read often mentions KMS: the S3 GET succeeded, but S3 then had to
          call <code className="text-core-400">Decrypt</code> on the object&apos;s data key on behalf of the
          Glue role — and the key policy said no.
        </Callout>
      </LessonSection>

      <LessonSection title="How S3 SSE-KMS does this for you">
        <p className="text-slate-300">
          With SSE-KMS on <code className="text-core-400">acme-lake-prod</code>, S3 runs envelope encryption
          behind every PUT and GET. You never touch a data key, but the permissions still follow the same path.
        </p>
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">What S3 does</th>
                <th className="px-4 py-3">Permission the caller needs</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['PUT object', 'Calls GenerateDataKey, encrypts the object, stores the encrypted data key in object metadata', 's3:PutObject + kms:GenerateDataKey'],
                ['Multipart upload', 'Same as PUT, but must also decrypt the data key to encrypt later parts', 's3:PutObject + kms:GenerateDataKey + kms:Decrypt'],
                ['GET object', 'Sends the stored encrypted data key to KMS Decrypt, then decrypts the object', 's3:GetObject + kms:Decrypt'],
              ].map(([action, what, perm]) => (
                <tr key={action} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{action}</td>
                  <td className="px-4 py-3">{what}</td>
                  <td className="px-4 py-3">{perm}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip" title="Teaser — S3 Bucket Keys">
          Calling KMS for every object in a bucket with millions of small files adds up in cost and request
          rate. S3 Bucket Keys let S3 derive per-object keys from a bucket-level key and call KMS far less
          often — covered in the SSE-KMS lesson.
        </Callout>
      </LessonSection>

      <LessonSection title="Doing it yourself in Python">
        <p className="text-slate-300">
          You rarely need client-side envelope encryption in DE, but writing it once makes the idea stick. This
          sketch uses boto3 and the <code className="text-core-400">cryptography</code> package.
        </p>
        <Example title="Envelope encryption with boto3 and AES-GCM" caption="Learning sketch — use the AWS Encryption SDK in production">
{`import os
import boto3
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

kms = boto3.client("kms")

def encrypt_bytes(data: bytes) -> dict:
    resp = kms.generate_data_key(KeyId="alias/de-lake-prod", KeySpec="AES_256")
    plaintext_key = resp["Plaintext"]        # use, then discard
    encrypted_key = resp["CiphertextBlob"]   # safe to store
    nonce = os.urandom(12)
    ciphertext = AESGCM(plaintext_key).encrypt(nonce, data, None)
    del plaintext_key
    return {"encrypted_key": encrypted_key, "nonce": nonce, "ciphertext": ciphertext}

def decrypt_bytes(bundle: dict) -> bytes:
    resp = kms.decrypt(CiphertextBlob=bundle["encrypted_key"])  # needs kms:Decrypt
    return AESGCM(resp["Plaintext"]).decrypt(bundle["nonce"], bundle["ciphertext"], None)

bundle = encrypt_bytes(b"customer_id,email\\n42,ana@example.com")
print(decrypt_bytes(bundle))`}
        </Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'KMS Encrypt handles only 4 KB, so large data is encrypted locally with a data key.',
          'GenerateDataKey returns the data key in plaintext (use and discard) and encrypted (store beside the data).',
          'Decrypt sends only the small encrypted data key to KMS — your dataset never leaves your service.',
          'S3 SSE-KMS does envelope encryption per object: writers need kms:GenerateDataKey, readers need kms:Decrypt.',
          'For real client-side encryption use the AWS Encryption SDK rather than hand-rolled code.',
        ]}
      />
    </LessonArticle>
  )
}
