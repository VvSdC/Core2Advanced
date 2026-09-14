import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function PuttingItTogetherS3() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="S3 is the foundation — you now have the full stack">
        From storage classes and lifecycle through security, encryption, events, lake zones, file formats,
        and Glue/Athena/Redshift integration — this checkpoint ties intermediate and advanced S3 into one
        data-engineering mental model before serverless compute with Lambda.
      </Callout>

      <Definition term="S3 mental model for data engineering">
        <p>
          S3 is your <strong className="text-white">durable, decoupled storage plane</strong>: zone-based
          prefixes (raw → curated), format and partition choices that control scan cost, IAM and encryption
          enforced at bucket and role level, lifecycle and replication for cost and DR, and event-driven
          hooks into pipelines. Everything else in the AWS DE stack reads or writes S3 through cataloged paths.
        </p>
      </Definition>

      <LessonSection title="S3 map — intermediate through advanced">
        <Flowchart
          title="S3 sub-topic map"
          chart={`flowchart TB
  START[S3 complete path]
  START --> SC[Storage classes — hot vs archive]
  START --> VLC[Versioning lifecycle Object Lock]
  START --> REP[Replication CRR and SRR]
  START --> SEC[Security — BPA policies least privilege]
  START --> ENC[Encryption SSE and HTTPS]
  START --> MPU[Multipart and presigned URLs]
  START --> EVT[Events EventBridge Access Points Select]
  START --> INV[Inventory Batch consistency]
  START --> ZONE[Data lake zones bronze silver gold]
  START --> FMT[Formats partitioning compression]
  START --> GLUE[S3 with Glue Athena Redshift]
  SC --> LAMBDANEXT
  VLC --> LAMBDANEXT
  REP --> LAMBDANEXT
  SEC --> LAMBDANEXT
  ENC --> LAMBDANEXT
  MPU --> LAMBDANEXT
  EVT --> LAMBDANEXT
  INV --> LAMBDANEXT
  ZONE --> LAMBDANEXT
  FMT --> LAMBDANEXT
  GLUE --> LAMBDANEXT
  LAMBDANEXT[Lambda — serverless compute next]`}
        />
      </LessonSection>

      <LessonSection title="Full S3 checkpoint — can you explain…">
        <ContentStep number={1} title="Storage and lifecycle">
          <p className="text-slate-300">
            When do you pick Intelligent-Tiering vs Standard-IA vs Glacier Deep Archive for a raw prefix?
            How do lifecycle rules interact with Object Lock retention?
          </p>
        </ContentStep>
        <ContentStep number={2} title="Replication and DR">
          <p className="text-slate-300">
            CRR vs SRR — which for cross-region DR vs same-region log aggregation? What does replication not
            copy from the lake?
          </p>
        </ContentStep>
        <ContentStep number={3} title="Security">
          <p className="text-slate-300">
            Why enable Block Public Access org-wide? Difference between identity policy ListBucket with prefix
            condition vs GetObject on object ARN?
          </p>
        </ContentStep>
        <ContentStep number={4} title="Encryption">
          <p className="text-slate-300">
            SSE-S3 vs SSE-KMS trade-offs for a PII curated bucket? Why might Glue fail with KMS AccessDenied
            despite valid S3 Allow?
          </p>
        </ContentStep>
        <ContentStep number={5} title="Operations at scale">
          <p className="text-slate-300">
            How does S3 Inventory feed a compaction campaign? What changed about read-after-write consistency
            for new objects?
          </p>
        </ContentStep>
        <ContentStep number={6} title="Lake design">
          <p className="text-slate-300">
            Map raw/processed/curated to bronze/silver/gold. Why Parquet over JSON in curated? What causes the
            small file problem and how do you fix it?
          </p>
        </ContentStep>
        <ContentStep number={7} title="Query integration">
          <p className="text-slate-300">
            Trace one SQL query in Athena from console click to S3 bytes scanned. When COPY to Redshift vs
            Spectrum external table?
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
                  'Strong consistency on S3?',
                  'Read-after-write strong for PUT/overwrite/delete in region since 2020; replication/events still eventual.',
                ],
                [
                  'Versioning + delete behavior?',
                  'Delete adds delete marker; prior versions remain until lifecycle expires noncurrent versions.',
                ],
                [
                  'Presigned URL security?',
                  'Temporary SigV4 URL; scope signing role narrowly; short expiry; HTTPS only.',
                ],
                [
                  'Athena cost control?',
                  'Parquet + partition pruning + column select; avoid SELECT * on wide raw JSON.',
                ],
                [
                  'CRR prerequisites?',
                  'Versioning on source; IAM on replication role; KMS key policy if SSE-KMS; async RPO minutes.',
                ],
                [
                  'Block Public Access purpose?',
                  'Overrides public ACLs/policies — prevent accidental world-readable lake buckets.',
                ],
                [
                  'S3 Select vs Athena?',
                  'Select filters one object in app code; Athena SQL over cataloged multi-file tables.',
                ],
                [
                  'Incomplete multipart cost?',
                  'Hidden storage until AbortMultipartUpload or lifecycle abort rule — standard 7-day baseline.',
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
        <Callout variant="tip" title="Ready for Lambda when…">
          You can whiteboard a three-zone lake on one bucket with IAM per stage, sketch lifecycle from Standard
          to Glacier for raw, and explain how an S3 ObjectCreated event triggers ingest — without conflating
          catalog metadata with object storage.
        </Callout>
      </LessonSection>

      <LessonSection title="What comes next — Lambda">
        <p className="text-slate-300">
          Lambda is the serverless compute layer that reacts to S3 events, transforms small payloads, generates
          presigned URLs, and orchestrates lightweight validation before Glue jobs run. You already saw S3
          event destinations — next you implement the handlers: idempotent processing, IAM execution roles
          scoped to landing prefixes, and integration with Kinesis and Step Functions for larger flows.
        </p>
        <Flowchart
          title="After S3 — course thread"
          chart={`flowchart LR
  IAM[IAM roles and policies]
  EC2[EC2 optional compute]
  S3[S3 checkpoint complete]
  LAM[Lambda — event handlers]
  GLUE[Glue — Spark ETL]
  ATH[Athena Redshift — serve]
  PROJ[End-to-end DE project]
  IAM --> EC2
  IAM --> S3
  S3 --> LAM
  LAM --> GLUE
  S3 --> GLUE
  GLUE --> ATH
  ATH --> PROJ`}
        />
        <Callout variant="insight">
          Revisit this checkpoint when onboarding a new dataset, designing cross-account lake access, or
          debugging AccessDenied on Athena — most failures are prefix IAM, KMS, or catalog location mismatch,
          not mysterious S3 outages.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'S3 DE stack: zones + formats/partitions + security/encryption + lifecycle/replication + events + catalog integration.',
          'Cost and performance live in storage class choice, Parquet, partition pruning, and compaction — not only query engine.',
          'Block Public Access, least-privilege prefix IAM, and SSE-KMS with Bucket Keys are modern lake baselines.',
          'Glue Catalog connects S3 layout to Athena and Redshift Spectrum — storage without metadata is not a lake.',
          'Next sub-topic: Lambda — serverless handlers for S3-triggered ingest, validation, and orchestration glue.',
        ]}
      />
    </LessonArticle>
  )
}
