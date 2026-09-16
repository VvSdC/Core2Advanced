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

export function IncrementalEtlAndCdc() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Reprocessing the full lake every night does not scale">
        Production pipelines load <strong className="text-white">only what changed</strong> — new S3 files,
        JDBC rows since last watermark, or CDC events from OLTP. Glue job bookmarks, incremental filters, and
        schema evolution handling separate mature DE designs from demo scripts.
      </Callout>

      <Definition term="Full load vs incremental">
        <p>
          <strong className="text-white">Full load</strong> replaces entire dataset each run — simple, idempotent,
          expensive at TB scale. <strong className="text-white">Incremental</strong> processes deltas using
          timestamps, monotonic IDs, file arrival, or change logs — lower DPU cost, harder correctness and
          recovery semantics.
        </p>
      </Definition>

      <LessonSection title="Full load vs incremental">
        <ContentStep number={1} title="When full load is OK">
          <p className="text-slate-300">
            Small dimension tables (under few GB), weekly full refresh marts, or initial historical backfill.
            Overwrite partition with{' '}
            <span className="font-mono text-sm">mode=&quot;overwrite&quot;</span> and dynamic partition
            replace — predictable but watch blast radius on bug.
          </p>
        </ContentStep>
        <ContentStep number={2} title="When incremental wins">
          <p className="text-slate-300">
            Daily fact append, JDBC extract of{' '}
            <span className="font-mono text-sm">updated_at &gt; last_run</span>, landing zone with one file
            per hour. Cumulative DPU savings dominate; invest in bookmark/watermark discipline and reconciliation
            jobs.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Job bookmarks">
        <ContentStep number={1} title="How bookmarks work">
          <p className="text-slate-300">
            Glue persists state per{' '}
            <span className="font-mono text-sm">transformation_ctx</span> — last processed S3 path, JDBC
            high-water mark, etc. Next run reads only new data. Enable on source node; call{' '}
            <span className="font-mono text-sm">job.commit()</span> at end to persist — omit commit and you
            reprocess or skip incorrectly.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Supported sources">
          <p className="text-slate-300">
            S3 JSON/CSV/Parquet (new files), JDBC with incremental column, Kinesis, Kafka (streaming bookmarks).
            Not magic for arbitrary SQL — design explicit watermark table when bookmarks do not fit (complex
            multi-table deps).
          </p>
        </ContentStep>
        <ContentStep number={3} title="Reset and backfill">
          <p className="text-slate-300">
            Reset bookmark via job run property or console to reprocess history after logic bug. Document
            backfill procedure — parallel full partition reload vs reset bookmark and single long run. Always
            validate row counts against source after reset.
          </p>
        </ContentStep>
        <Example title="JDBC incremental predicate sketch">
{`# Bookmark stores last max(updated_at) from prior run
# Job reads:
#   SELECT * FROM orders WHERE updated_at > bookmark_watermark
# Write merge/upsert to silver Parquet (or append + dedupe job)`}
        </Example>
      </LessonSection>

      <LessonSection title="CDC concept for Glue pipelines">
        <ContentStep number={1} title="Change data capture">
          <p className="text-slate-300">
            CDC streams row-level inserts, updates, deletes from OLTP binlog/WAL — often via DMS to S3 or
            Kinesis. Glue consumes CDC files and applies MERGE logic to silver (Iceberg/Delta/Hudi) or append
            + periodic dedupe. Deletes matter — append-only Parquet without delete handling drifts from source.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Glue role in CDC">
          <p className="text-slate-300">
            DMS lands CDC Parquet/CSV; Glue job normalizes operation column (I/U/D), keys by primary key,
            writes typed history or current-state table. Streaming Glue job for near-real-time; batch for
            hourly micro-batch. Pair with Schema Registry when event schema evolves.
          </p>
        </ContentStep>
        <ContentStep number={3} title="vs bookmarked JDBC">
          <p className="text-slate-300">
            Timestamp incremental misses hard deletes and may double-read overlapping updates. CDC is
            authoritative for sync; bookmarks suit append-heavy facts without delete requirements. Interview:
            know tradeoffs, not one-size-fits-all.
          </p>
        </ContentStep>
        <Flowchart
          title="CDC path — OLTP to lake silver"
          chart={`flowchart LR
  OLTP[RDS PostgreSQL]
  DMS[AWS DMS CDC]
  S3CDC[S3 cdc/ prefix]
  GLUE[Glue batch or streaming]
  SILVER[Silver current state]
  ATH[Athena BI]
  OLTP --> DMS
  DMS --> S3CDC
  S3CDC --> GLUE
  GLUE --> SILVER
  SILVER --> ATH`}
        />
      </LessonSection>

      <LessonSection title="Schema evolution">
        <ContentStep number={1} title="Additive changes">
          <p className="text-slate-300">
            New optional columns in landing JSON — ResolveChoice + ApplyMapping with defaults; Parquet merge
            schema on read for backward compat. Register version in Schema Registry for streaming sources.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Breaking changes">
          <p className="text-slate-300">
            Rename or retype columns — version silver table (orders_v2), migrate consumers, deprecate v1.
            Avoid silent crawler overwrite of production curated schema. Iceberg/Delta simplify ADD COLUMN and
            schema commit; plain external Parquet needs explicit job logic.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Reconciliation">
          <p className="text-slate-300">
            Nightly count/compare job: source vs silver keys and sums — catches bookmark gaps, CDC lag, and
            evolution bugs. Non-optional for incremental pipelines claiming financial correctness.
          </p>
        </ContentStep>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Full load: simple overwrite — OK for small dims and backfills; costly at TB scale.',
          'Job bookmarks track per transformation_ctx state — enable source bookmark, always job.commit().',
          'CDC via DMS/Kinesis captures I/U/D — Glue merges to silver; bookmarks alone miss deletes.',
          'Schema evolution: additive via ResolveChoice/mergeSchema; breaking changes need table versioning.',
          'Reconciliation jobs validate incremental correctness — row counts and sums vs source.',
        ]}
      />
    </LessonArticle>
  )
}
