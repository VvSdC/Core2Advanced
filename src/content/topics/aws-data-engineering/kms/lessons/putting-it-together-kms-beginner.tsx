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

export function PuttingItTogetherKmsBeginner() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Checkpoint before key policies and SSE-KMS">
        You now know what plaintext, ciphertext, and keys are, how at rest differs from in transit, what KMS
        does and why key material never leaves it, the three key ownership levels, how envelope encryption
        handles big data, and which DE resources get which key. This lesson ties those threads into a{' '}
        <strong className="text-white">beginner KMS checklist</strong> — the mental model you need before key
        policies, grants, rotation, and SSE-KMS in the intermediate module.
      </Callout>

      <Definition term="Beginner KMS mental model">
        <p>
          A <strong className="text-white">beginner KMS mental model</strong> for DE includes: encryption at
          rest on every data store plus TLS in transit, customer managed keys for shared or sensitive data,
          aliases named by domain and environment, envelope encryption understood as the reason writers need{' '}
          <code className="text-core-400">kms:GenerateDataKey</code> and readers need{' '}
          <code className="text-core-400">kms:Decrypt</code>, Athena results encrypted like source data, and
          the reflex to check KMS whenever a valid S3 permission still returns AccessDenied.
        </p>
      </Definition>

      <LessonSection title="Architecture checklist — can you draw this?">
        <ContentStep number={1} title="Keys beside the data path — not in it">
          <p className="text-slate-300">
            S3, Glue, Athena, and Redshift sit in the pipeline; KMS sits to the side answering GenerateDataKey
            and Decrypt calls. Diagram shows each store pointing at a named key.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Customer managed key for the lake">
          <p className="text-slate-300">
            Bucket default encryption on <code className="text-core-400">acme-lake-prod</code> is SSE-KMS
            with <code className="text-core-400">alias/de-lake-prod</code> — not{' '}
            <code className="text-core-400">aws/s3</code>, because analytics accounts and restricted roles are
            coming.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Separate keys per environment and sensitivity">
          <p className="text-slate-300">
            Dev and prod never share a key. PII lives under{' '}
            <code className="text-core-400">alias/de-lake-pii-prod</code>; the warehouse uses{' '}
            <code className="text-core-400">alias/de-redshift-prod</code>.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Athena results and Glue output encrypted">
          <p className="text-slate-300">
            Athena workgroup encrypts query results with SSE-KMS; Glue security configuration covers S3 output,
            CloudWatch Logs, and job bookmarks.
          </p>
        </ContentStep>
        <ContentStep number={5} title="IAM names the key actions explicitly">
          <p className="text-slate-300">
            The Glue role has <code className="text-core-400">kms:Decrypt</code> and{' '}
            <code className="text-core-400">kms:GenerateDataKey</code> on the lake key ARN — not{' '}
            <code className="text-core-400">kms:*</code> on every key in the account.
          </p>
        </ContentStep>
        <Flowchart
          title="Beginner DE KMS stack"
          chart={`flowchart TD
  RAW[S3 bronze landing] --> GLUE[Glue job orders-silver-etl]
  GLUE --> SILVER[S3 silver Parquet]
  SILVER --> ATH[Athena workgroup]
  ATH --> RES[S3 Athena results]
  RAW -.-> LAKE[KMS alias de-lake-prod]
  SILVER -.-> LAKE
  RES -.-> LAKE
  GLUE -.-> LAKE
  RS[Redshift Serverless] -.-> WH[KMS alias de-redshift-prod]
  CFN[CloudFormation stack] --> LAKE
  CFN --> WH`}
        />
      </LessonSection>

      <LessonSection title="Self-check — can you explain these?">
        <ContentStep number={1} title="What is KMS in one sentence?">
          <p className="text-slate-300">
            Managed service that creates and controls encryption keys inside HSMs, authorizes every use through
            key policies and IAM, and logs each call to CloudTrail.
          </p>
        </ContentStep>
        <ContentStep number={2} title="At rest vs in transit">
          <p className="text-slate-300">
            At rest = stored data encrypted on disk (KMS); in transit = network traffic encrypted with TLS. Two
            separate controls.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Symmetric vs asymmetric">
          <p className="text-slate-300">
            Symmetric = one AES-256 key, used by every AWS service for data at rest; asymmetric = public and
            private key pair for signing or small payloads.
          </p>
        </ContentStep>
        <ContentStep number={4} title="AWS managed vs customer managed key">
          <p className="text-slate-300">
            AWS managed (aws/s3) = visible, auto-rotated, but policy not editable and no cross-account use.
            Customer managed = you own policy, rotation, grants, and deletion.
          </p>
        </ContentStep>
        <ContentStep number={5} title="Why envelope encryption?">
          <p className="text-slate-300">
            Encrypt caps at 4 KB and sending gigabytes to KMS is slow; a data key encrypts data locally and only
            the small encrypted data key goes back to KMS.
          </p>
        </ContentStep>
        <ContentStep number={6} title="Which permissions for writing vs reading SSE-KMS objects?">
          <p className="text-slate-300">
            Writer: <code className="text-core-400">s3:PutObject</code> +{' '}
            <code className="text-core-400">kms:GenerateDataKey</code>. Reader:{' '}
            <code className="text-core-400">s3:GetObject</code> + <code className="text-core-400">kms:Decrypt</code>.
          </p>
        </ContentStep>
        <ContentStep number={7} title="First debug when Glue gets AccessDenied on an S3 read?">
          <p className="text-slate-300">
            Check the object&apos;s encryption key, then whether the Glue role has{' '}
            <code className="text-core-400">kms:Decrypt</code> in IAM and is allowed by that key&apos;s policy —
            before rewriting the bucket policy.
          </p>
        </ContentStep>
        <Example title="Beginner KMS concept drill" caption="No console required yet — explain aloud">
{`1. Draw: S3 bronze -> Glue -> S3 silver -> Athena -> results, each pointing at a KMS key
2. Why can a role with s3:GetObject still fail to read an object?
3. Name one resource where an AWS owned key is fine and one that needs a CMK
4. Walk through GenerateDataKey: what comes back, what is kept, what is discarded?
5. Why should Athena query results use the same key as the source tables?
6. Why not one key for the whole account? Why not one key per bucket?
7. What does encryption at rest NOT protect you from?`}
        </Example>
        <Callout variant="insight">
          Strong KMS beginners ask three questions for every data store: which key encrypts it, who may use
          that key, and would we see it in CloudTrail if someone decrypted it — weak answers to the second
          question are where real data exposures come from.
        </Callout>
      </LessonSection>

      <LessonSection title="Mini scenario — end-to-end story">
        <p className="text-slate-300">
          Acme&apos;s CloudFormation stack <code className="text-core-400">acme-de-platform-prod</code> creates
          customer managed key <code className="text-core-400">alias/de-lake-prod</code> and sets it as the
          SSE-KMS default on <code className="text-core-400">acme-lake-prod</code> and the Athena results
          bucket. The Glue role for <code className="text-core-400">orders-silver-etl</code> gets{' '}
          <code className="text-core-400">kms:Decrypt</code> and{' '}
          <code className="text-core-400">kms:GenerateDataKey</code> on that key ARN. Each night the job reads{' '}
          <code className="text-core-400">bronze/orders/</code> — S3 calls Decrypt on each object&apos;s data
          key — and writes <code className="text-core-400">silver/orders/</code>, where S3 calls
          GenerateDataKey for each new object. The <code className="text-core-400">analytics</code> workgroup
          writes query results encrypted with the same key. A new analyst role is given{' '}
          <code className="text-core-400">s3:GetObject</code> on silver but nobody adds it to the key — the
          first Athena query fails with AccessDenied from KMS. On-call checks the key inventory, confirms the
          analyst should see non-PII silver data, and adds the role to the key policy through a reviewed
          template change.
        </p>
        <ContentStep number={1} title="Infrastructure tier — CloudFormation">
          <p className="text-slate-300">Keys, aliases, bucket encryption defaults — Git-reviewed, per environment.</p>
        </ContentStep>
        <ContentStep number={2} title="Data tier — S3 and Athena results">
          <p className="text-slate-300">Every object encrypted with SSE-KMS under the lake key.</p>
        </ContentStep>
        <ContentStep number={3} title="Compute tier — Glue">
          <p className="text-slate-300">Role allowed GenerateDataKey to write and Decrypt to read — nothing more.</p>
        </ContentStep>
        <ContentStep number={4} title="Access tier — IAM plus key policy">
          <p className="text-slate-300">S3 permission alone is not enough; the key must also trust the role.</p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="What's next">
        <p className="text-slate-300">
          The intermediate lessons in the KMS track go hands-on with the topics this beginner pass introduced:
        </p>
        <ContentStep number={1} title="Key policies — the resource policy on every key">
          <p className="text-slate-300">
            The default key policy, how it combines with IAM, and why a key with no admin statement can lock
            everyone out.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Grants and encryption context">
          <p className="text-slate-300">
            Temporary delegated access that services like Redshift use, and binding ciphertext to a purpose such
            as the bucket and object it belongs to.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Key rotation and lifecycle">
          <p className="text-slate-300">
            Automatic and on-demand rotation, disabling keys, and the deletion waiting period that protects you
            from losing data forever.
          </p>
        </ContentStep>
        <ContentStep number={4} title="S3 encryption with SSE-KMS deep dive">
          <p className="text-slate-300">
            SSE-S3 vs SSE-KMS vs DSSE-KMS, enforcing encryption with bucket policies, and S3 Bucket Keys to cut
            KMS request costs on lakes with millions of objects.
          </p>
        </ContentStep>
        <Callout variant="tip" title="Before your first prod key">
          Decide who administers the key and who only uses it before you create it — retrofitting a key policy
          onto a lake that already holds terabytes is far harder than getting it right in the first template.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Beginner model: encryption at rest plus TLS, customer managed keys for shared or sensitive data, aliases by domain and environment.',
          'Self-check: KMS definition, at rest vs in transit, symmetric vs asymmetric, key types, envelope encryption, write vs read permissions.',
          'End-to-end: CloudFormation key → SSE-KMS lake and Athena results → Glue role with Decrypt and GenerateDataKey → analyst AccessDenied until the key trusts them.',
          'Next in KMS track: key policies, grants and encryption context, rotation and lifecycle, SSE-KMS deep dive.',
        ]}
      />
    </LessonArticle>
  )
}
