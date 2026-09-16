import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function SparkOptimizationGlue() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Glue bill and SLA follow Spark physics">
        A slow Glue job usually means too much shuffle, too many small files, or full scans without partition
        pruning — not always &quot;add more workers.&quot; Data engineers optimize Spark on Glue the same way
        as EMR: partition layout first, then join strategy, then executor count.
      </Callout>

      <Definition term="Predicate pushdown">
        <p>
          When reading Parquet or JDBC, Spark pushes filter predicates to the source — skipping row groups
          (Parquet stats) or pushing WHERE to the database. Glue catalog partition pruning skips entire S3
          prefixes. Without pushdown, every job reads the full dataset — DPU burn with no business value.
        </p>
      </Definition>

      <LessonSection title="Partitioning and predicate pushdown">
        <ContentStep number={1} title="Write partitioned, read filtered">
          <p className="text-slate-300">
            Always write curated outputs with{' '}
            <span className="font-mono text-sm">partitionKeys</span> matching production filters —{' '}
            <span className="font-mono text-sm">event_date</span>,{' '}
            <span className="font-mono text-sm">region</span>. In job code, filter on partition columns
            before wide joins. Pushdown on Parquet requires predicates Spark can translate — avoid wrapping
            partition columns in functions.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Catalog pushdown">
          <p className="text-slate-300">
            <span className="font-mono text-sm">create_dynamic_frame.from_catalog</span> with pushdown
            predicates (where supported) limits S3 listing and file reads. For raw non-partitioned CSV,
            consider pre-partitioning in bronze ETL — downstream silver jobs inherit pruning forever.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Broadcast join and shuffle">
        <ContentStep number={1} title="Broadcast hash join">
          <p className="text-slate-300">
            When one side fits in memory (typically under ~10 MB default threshold, tunable via{' '}
            <span className="font-mono text-sm">spark.sql.autoBroadcastJoinThreshold</span>), Spark broadcasts
            the small table to all executors — no shuffle on the join. Lake pattern: broadcast dim_product,
            dim_calendar; never broadcast fact_events.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Shuffle-heavy joins">
          <p className="text-slate-300">
            Large-large joins repartition both sides by join key — expensive network IO. Mitigate: pre-filter
            facts, bucket both sides by key at write time (advanced), or salting skewed keys. Spark UI
            &quot;Shuffle Read&quot; stage time is the first place to look in CloudWatch logs link.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Skew">
          <p className="text-slate-300">
            One hot key (e.g. null or &quot;UNKNOWN&quot;) sends most rows to one task — stragglers extend job
            runtime. Fix: filter null keys early, split skewed key into sub-queries, or use AQE skew join
            optimization in newer Glue/Spark versions.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Repartition vs coalesce">
        <ContentStep number={1} title="repartition(n)">
          <p className="text-slate-300">
            Full shuffle redistributing rows across n partitions — increases parallelism for writes or balances
            before heavy join. Use when output file count is too low (few giant files) or partitions are
            skewed. Costs shuffle; pay when downstream needs even splits.
          </p>
        </ContentStep>
        <ContentStep number={2} title="coalesce(n)">
          <p className="text-slate-300">
            Narrows partition count without full shuffle — merges partitions on same executor cheaply. Use
            before write to target ~128–512 MB files without reshuffling entire dataset. Cannot increase
            parallelism — only reduce.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Lake write pattern">
          <p className="text-slate-300">
            After groupBy aggregate,{' '}
            <span className="font-mono text-sm">coalesce(10)</span> before Parquet write may yield ten
            right-sized files per partition folder — better than hundreds of KB files from default Spark
            output. Tune n from data volume per day, not a magic constant.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="File size and the small file problem">
        <ContentStep number={1} title="Symptoms">
          <p className="text-slate-300">
            Millions of tiny Parquet files — slow Glue reads (task overhead), slow Athena scans, high S3 LIST
            cost. Common causes: streaming micro-batch default, one file per executor per run without
            compaction, high-cardinality partition keys.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Fixes in Glue">
          <p className="text-slate-300">
            Compact with scheduled job: read partition, coalesce/repartition, overwrite. Enable{' '}
            <span className="font-mono text-sm">spark.sql.files.maxRecordsPerFile</span> or use{' '}
            <span className="font-mono text-sm">repartition</span> by bucket count. Avoid daily job appending
            200 empty-ish files — target handful per partition.
          </p>
        </ContentStep>
        <Example title="Before/after — daily events partition">
{`Before: s3://curated/events/event_date=2026-03-15/ → 847 files avg 90 KB
After compaction job: same prefix → 8 files avg 10 MB
Glue silver job runtime: 45 min → 12 min (fewer tasks, better Parquet stats)`}
        </Example>
      </LessonSection>

      <Callout variant="insight">
        Optimization order for DE interviews: (1) partition layout and filters, (2) file sizing and format,
        (3) join/broadcast/shuffle tuning, (4) worker count. Skipping straight to G.2X workers without fixing
        small files rarely holds at scale.
      </Callout>

      <KeyTakeaways
        items={[
          'Partition writes and filter reads — catalog + Parquet pushdown skip data before shuffle.',
          'Broadcast small dims; large-large joins shuffle — pre-filter facts and watch skewed keys.',
          'repartition shuffles for balance; coalesce cheaply reduces files before write — target 128–512 MB.',
          'Small files kill Glue and Athena — compact curated zones on schedule.',
          'Profile Spark UI stages; add workers last after layout and join strategy are sound.',
        ]}
      />
    </LessonArticle>
  )
}
