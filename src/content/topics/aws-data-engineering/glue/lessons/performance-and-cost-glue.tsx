import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function PerformanceAndCostGlue() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Glue cost is DPU-hours times wall clock — optimize both">
        Unlike Athena scan pricing, Glue bills for <strong className="text-white">provisioned capacity
        while the job runs</strong>. A 20-worker job that finishes in 10 minutes may cost less than a
        5-worker job that shuffles for an hour. Cost-aware DEs tune data layout before scaling workers.
      </Callout>

      <Definition term="DPU cost mindset">
        <p>
          Total cost ≈ (workers × DPU per worker type) × runtime in hours. G.1X = 1 DPU, G.2X = 2 DPU,
          Standard worker = 2 DPU. Failed long runs still charge until failure. Right-sizing is reducing
          DPU-seconds through faster jobs, not always fewer workers.
        </p>
      </Definition>

      <LessonSection title="DPU and worker economics">
        <ContentStep number={1} title="Measure baseline">
          <p className="text-slate-300">
            Track DPU-hours per job per day in Cost Explorer with job name tags. Compare p50 vs p95 runtime —
            p95 often reveals skew or landing anomalies. Benchmark one representative partition before doubling
            workers in production.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Worker type tradeoff">
          <p className="text-slate-300">
            G.2X for memory-bound wide joins; G.1X default for balanced ETL; G.025X for tiny micro-batch.
            More DPUs without fixing shuffle may linearly increase bill without linear speedup — Amdahl&apos;s
            law on Spark stages.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Python Shell vs Spark">
          <p className="text-slate-300">
            Do not pay Spark cluster DPUs to rename S3 objects — Python Shell at fractional DPU. Conversely,
            do not force pandas in Shell on 50 GB — failed approach then expensive Spark retry.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Reduce shuffle">
        <ContentStep number={1} title="Filter and project early">
          <p className="text-slate-300">
            Drop columns and rows before join — less bytes over network. Broadcast small dimensions. Avoid
            unnecessary <span className="font-mono text-sm">distinct</span> before join when keys already unique.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Partition-aware joins">
          <p className="text-slate-300">
            When both facts share partition key (same event_date), filter both to same partition before join —
            smaller shuffle or co-located read. Bucketed tables (advanced) eliminate shuffle on equi-join key.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Adaptive Query Execution">
          <p className="text-slate-300">
            Enable Spark AQE in newer Glue versions — runtime shuffle partition coalescing and skew join
            optimization. Reduces over-partitioned shuffles from default 200 partitions on modest data.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Fewer small files and partition pruning">
        <ContentStep number={1} title="Compaction ROI">
          <p className="text-slate-300">
            Daily compaction job costs fixed DPU minutes but cuts every downstream silver/gold job and Athena
            query cost. Model: 15 min compaction vs 30 min saved × N consumers — usually positive ROI at N ≥ 2.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Write fewer larger files">
          <p className="text-slate-300">
            <span className="font-mono text-sm">coalesce</span> before write; avoid default one file per task
            per micro-batch without tuning. Target 128–512 MB Parquet per file in curated zones.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Partition pruning on read">
          <p className="text-slate-300">
            Pass <span className="font-mono text-sm">run_date</span> into job; filter catalog reads to one
            partition — reads gigabytes not terabytes. Missing partition filter is the #1 silent cost leak in
            scheduled Glue jobs that &quot;used to be fast.&quot;
          </p>
        </ContentStep>
        <Example title="Cost comparison sketch — one daily job">
{`Scenario A: 10 G.1X workers, 60 min, full scan raw (no partition filter)
  → 10 DPU × 1 hr = 10 DPU-hr/day

Scenario B: 6 G.1X workers, 18 min, partition filter + compact input
  → 6 DPU × 0.3 hr ≈ 1.8 DPU-hr/day

Same business output — layout and filters dominate bill.`}
        </Example>
      </LessonSection>

      <LessonSection title="Operational cost controls">
        <ContentStep number={1} title="Schedule smartly">
          <p className="text-slate-300">
            Run after landing complete — not overlapping partial files requiring rerun. Chain with workflows
            instead of fixed cron guess.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Fail fast">
          <p className="text-slate-300">
            Pre-validation with Athena or Python Shell before long Spark — saves DPU on known-bad batches.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Incremental over full">
          <p className="text-slate-300">
            Bookmarks and CDC reduce daily processed volume — linear reduction in runtime when logic is sound.
          </p>
        </ContentStep>
        <Callout variant="insight">
          Interview frame: &quot;I optimize Glue cost in order — partition pruning, file compaction, shuffle
          reduction, then worker count/type.&quot; Shows DE systems thinking, not knob turning.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Glue bills DPU-hours while running — workers × DPU type × duration; tag jobs for Cost Explorer.',
          'Reduce shuffle: filter/project early, broadcast dims, partition-aligned joins, enable AQE.',
          'Compact small files; coalesce writes — downstream Glue and Athena jobs get cheaper together.',
          'Always partition-filter scheduled jobs — full scans are the most common avoidable cost leak.',
          'Use Python Shell for tiny tasks, bookmarks for incremental, fail-fast QA before long Spark runs.',
        ]}
      />
    </LessonArticle>
  )
}
