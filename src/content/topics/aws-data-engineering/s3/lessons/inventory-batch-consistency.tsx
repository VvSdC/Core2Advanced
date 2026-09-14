import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function InventoryBatchConsistency() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Petabyte lakes need operations at scale">
        Listing billions of keys with CLI scripts does not scale. S3{' '}
        <strong className="text-white">Inventory</strong> and{' '}
        <strong className="text-white">Batch Operations</strong> automate audits and bulk changes; the{' '}
        <strong className="text-white">consistency model</strong> explains what your pipelines can assume
        immediately after a write — essential for orchestration and interview depth.
      </Callout>

      <Definition term="S3 Inventory">
        <p>
          <strong className="text-white">S3 Inventory</strong> periodically exports CSV, ORC, or Parquet
          reports listing objects (and optional metadata: size, storage class, encryption, replication
          status) to a destination bucket. Schedule daily/weekly — feed Athena for cost analytics,
          compliance attestation, and reconciliation against the Glue catalog.
        </p>
      </Definition>

      <LessonSection title="S3 Inventory for data platforms">
        <ContentStep number={1} title="What to inventory">
          <p className="text-slate-300">
            Configure per bucket or prefix: all objects, or filter groups. Include optional fields:
            Size, LastModifiedDate, StorageClass, Intelligent-Tiering access tier, Encryption status,
            ObjectLockRetainUntilDate — DE teams track orphaned IA objects and encryption drift.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Athena on inventory">
          <p className="text-slate-300">
            Point Athena external table at inventory output prefix — SQL: &quot;Which{' '}
            <span className="font-mono text-sm">raw/</span> objects are still Standard after 120 days?&quot;
            or &quot;List unencrypted objects.&quot; Cheaper than ListObjectsV2 at scale.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Operational reconciliation">
          <p className="text-slate-300">
            Compare inventory row counts vs pipeline metrics (expected daily file count). Detect silent
            ingest failures or duplicate writes before downstream SLA misses.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="S3 Batch Operations">
        <Definition term="S3 Batch Operations">
          <p>
            Run a single job against millions of objects from an{' '}
            <strong className="text-white">manifest</strong> (Inventory report or CSV list): copy, restore
            from Glacier, apply tags, invoke Lambda, replace ACLs (legacy), or re-encrypt. Data engineers
            use Batch for migration, retroactive encryption, and mass restore before reprocessing archived raw.
          </p>
        </Definition>
        <ContentStep number={1} title="Manifest-driven jobs">
          <p className="text-slate-300">
            Generate manifest from Inventory → Batch job: transition 2020 partitions to Deep Archive, or
            copy objects to new bucket during account migration. Progress and failure reports to a
            destination prefix — retry failed keys.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Lambda per object">
          <p className="text-slate-300">
            Batch can invoke Lambda for each object — custom metadata extraction, format validation, or
            generating sidecar index files. Mind concurrency limits and cost at billions of keys — chunk
            manifests.
          </p>
        </ContentStep>
        <ContentStep number={3} title="IAM and completion">
          <p className="text-slate-300">
            Dedicated Batch Operations IAM role with scoped S3 and optional KMS permissions. Jobs run
            asynchronously — track in Console or EventBridge completion events for orchestration handoff.
          </p>
        </ContentStep>
        <Flowchart
          title="Inventory → analyze → Batch Operations"
          chart={`flowchart LR
  BUCKET[S3 lake bucket]
  INV[S3 Inventory scheduled]
  REPORT[Inventory report Parquet]
  ATH[Athena SQL analysis]
  MAN[Manifest CSV]
  BATCH[S3 Batch Operations]
  ACT[Copy tag restore re-encrypt Lambda]
  BUCKET --> INV
  INV --> REPORT
  REPORT --> ATH
  ATH --> MAN
  MAN --> BATCH
  BATCH --> ACT
  ACT --> BUCKET`}
        />
      </LessonSection>

      <LessonSection title="S3 consistency model">
        <Definition term="S3 read-after-write consistency">
          <p>
            S3 provides <strong className="text-white">strong read-after-write consistency</strong> for
            all operations (since Dec 2020): after a successful PUT, subsequent GET, LIST, or HEAD
            immediately reflects the write — no stale read window for new objects. Overwrites and deletes
            are also strongly consistent. DE pipelines can chain PUT → Lambda → GET without artificial sleep
            delays that legacy architectures required.
          </p>
        </Definition>
        <ContentStep number={1} title="What this means for orchestration">
          <p className="text-slate-300">
            Step Functions: upload to landing → invoke validator Lambda → Glue start — safe without
            eventual-consistency retries for new keys. LIST after PUT sees new prefix entries immediately —
            partition discovery in same-run crawlers is reliable.
          </p>
        </ContentStep>
        <ContentStep number={2} title="What consistency does not guarantee">
          <p className="text-slate-300">
            Cross-service propagation (Glue catalog update, CloudFront cache) still async. Replication and
            Event Notifications remain eventually consistent — replica lag and event delay are separate from
            read-after-write on the primary bucket.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Interview framing">
          <p className="text-slate-300">
            Strong consistency applies to S3 data plane in a region. Do not confuse with DynamoDB tiers or
            S3 replication RPO — state &quot;new object visible immediately on GET/LIST in same region.&quot;
          </p>
        </ContentStep>
        <Callout variant="insight">
          Pre-2020 exam answers claimed eventual consistency for LIST — outdated. Modern DE design assumes
          strong read-after-write; still handle replication lag and catalog sync explicitly.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'S3 Inventory exports object lists and metadata on schedule — feed Athena for cost, encryption, and compliance audits.',
          'Batch Operations run manifest-driven bulk copy, restore, tag, re-encrypt, or Lambda-per-object at scale.',
          'Strong read-after-write consistency for PUT/overwrite/delete — safe immediate GET/LIST in same region.',
          'Replication, events, and Glue catalog updates remain eventually consistent — separate from S3 read-after-write.',
          'Pipeline: Inventory → Athena findings → Batch manifest → remediate — operational maturity for large lakes.',
        ]}
      />
    </LessonArticle>
  )
}
