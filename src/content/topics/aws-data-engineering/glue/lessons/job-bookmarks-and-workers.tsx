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

export function JobBookmarksAndWorkers() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Run only what is new — scale how much compute you need">
        Production lake jobs rarely reprocess ten years of history every night.{' '}
        <strong className="text-white">Job bookmarks</strong> track what was already ingested so the next
        run handles only new S3 files or JDBC rows. <strong className="text-white">Workers</strong> control
        how much Spark capacity spins up for that run. Together they define incremental efficiency and job
        performance — two knobs every DE tunes after the first successful end-to-end script.
      </Callout>

      <Definition term="Job bookmark">
        <p>
          A <strong className="text-white">Glue job bookmark</strong> is persistent state Glue maintains per
          job (and source node) recording the progress of incremental reads — for example, which S3 keys or
          JDBC high-water marks were processed in prior successful runs. When bookmarking is enabled on a
          source, the next run skips already-processed data and reads only new inputs, then advances the
          bookmark on <code className="text-core-400">job.commit()</code>.
        </p>
      </Definition>

      <Definition term="Worker (DPU allocation)">
        <p>
          A <strong className="text-white">worker</strong> is a unit of managed compute for a Glue job. You
          choose a <strong className="text-white">worker type</strong> (e.g. G.1X, G.2X, G.025X) and{' '}
          <strong className="text-white">number of workers</strong>. Glue maps workers to Spark executors
          with associated CPU and memory — more workers enable more parallel tasks for wide transforms and
          large shuffles, at higher DPU-minute cost.
        </p>
      </Definition>

      <LessonSection title="Job bookmarks — incremental processing idea">
        <ContentStep number={1} title="Problem without bookmarks">
          <p className="text-slate-300">
            Nightly job reads <code className="text-core-400">s3://lake/raw/events/</code> with 500 new files
            plus 50,000 old files — full scan every run wastes time, money, and risks duplicate rows in curated
            output unless you dedupe aggressively every time.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Bookmark-enabled source">
          <p className="text-slate-300">
            Enable bookmark on <code className="text-core-400">create_dynamic_frame.from_catalog</code> or S3
            source options. First run processes all files and saves state. Second run sees only files added
            since last commit — true incremental ingest for append-only landing zones.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Commit persists state">
          <p className="text-slate-300">
            Call <code className="text-core-400">job.commit()</code> at successful script end — bookmark
            advances only on success. Failed runs retry the same new batch without marking it done — design
            idempotent sinks (partition overwrite, merge keys) for safe retries.
          </p>
        </ContentStep>
        <Flowchart
          title="Bookmark incremental flow"
          chart={`flowchart TD
  RUN1[Run 1 all files]
  RUN1 --> BM1[Bookmark saved]
  NEW[New files land in S3]
  NEW --> RUN2[Run 2 bookmark read]
  BM1 --> RUN2
  RUN2 --> PROC[Process new only]
  PROC --> BM2[Bookmark updated]`}
        />
        <Callout variant="insight">
          Bookmarks track source progress — they do not replace business deduplication. CDC updates and
          late-arriving corrections may still need merge logic in your transform, not blind append.
        </Callout>
      </LessonSection>

      <LessonSection title="Bookmark requirements and limits">
        <ContentStep number={1} title="Supported sources">
          <p className="text-slate-300">
            S3, JDBC, DynamoDB, and catalog sources support bookmarks when configured — check Glue docs for
            your connector version. Custom Python reads bypass bookmark machinery.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Job name stability">
          <p className="text-slate-300">
            Bookmark state keys off job name — renaming a job resets incremental state. Treat job renames like
            database migrations with a planned backfill.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Reset when needed">
          <p className="text-slate-300">
            Console or API can reset bookmark for full reprocessing after logic bugs — expect a longer, more
            expensive run and coordinate downstream Athena QA.
          </p>
        </ContentStep>
        <Example title="Enable bookmark on S3 read" caption="Conceptual PySpark options">
{`dyf = glueContext.create_dynamic_frame.from_options(
    connection_type="s3",
    connection_options={
        "paths": ["s3://acme-lake/raw/events/"],
        "recurse": True
    },
    format="json",
    transformation_ctx="raw_events"  # required id for bookmark
)

# transformation_ctx ties bookmark to this source node
# job.commit() at end advances bookmark for "raw_events"`}
        </Example>
      </LessonSection>

      <LessonSection title="Worker types and count — performance teaser">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Worker type</th>
                <th className="px-4 py-3">Rough capacity</th>
                <th className="px-4 py-3">When to consider</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                [
                  'G.025X',
                  'Smallest — fractional DPU for light workloads',
                  'Python Shell-adjacent small Spark, low data volume dev tests',
                ],
                [
                  'G.1X',
                  'Standard — 1 DPU per worker (4 vCPU, 16 GB class)',
                  'Default starting point for many PySpark ETL jobs',
                ],
                [
                  'G.2X',
                  'Double memory/CPU per worker vs G.1X',
                  'Heavy shuffles, wide joins, large in-memory broadcast candidates',
                ],
                [
                  'G.4X / G.8X',
                  'High-memory workers for specialized large jobs',
                  'Advanced tuning when profiling shows executor OOM on G.2X',
                ],
              ].map(([type, capacity, when]) => (
                <tr key={type} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{type}</td>
                  <td className="px-4 py-3">{capacity}</td>
                  <td className="px-4 py-3">{when}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ContentStep number={1} title="Number of workers">
          <p className="text-slate-300">
            More workers increase parallel tasks — helpful when reading thousands of small S3 files or
            repartitioning before write. Too many workers on tiny datasets add startup overhead without
            speedup — start with 2–10 G.1X in dev and profile.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Worker type vs count tradeoff">
          <p className="text-slate-300">
            OOM errors often need G.2X (more memory per executor) before blindly doubling worker count.
            CloudWatch Spark UI and Glue job metrics show whether you are CPU-bound or memory-bound.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Autoscaling (optional)">
          <p className="text-slate-300">
            Glue can add workers during run when enabled — useful for skewed stages. Advanced tuning topic;
            fixed worker count is enough for beginner jobs.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Glue version teaser">
        <p className="text-slate-300">
          Each job pins a <strong className="text-white">Glue version</strong> — the managed Spark and Python
          runtime (e.g. Glue 4.0 on Spark 3.3, Glue 5.0 on newer Spark lines). Version choice affects:
        </p>
        <ContentStep number={1} title="Spark and Python compatibility">
          <p className="text-slate-300">
            Library imports, pandas/arrow versions, and SQL syntax — upgrade in dev first; breaking changes
            appear in release notes when AWS bumps the runtime.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Bookmark and connector behavior">
          <p className="text-slate-300">
            Newer versions add Iceberg, Hudi, Delta connectors and improved JDBC parallelism — teams align
            Glue version across jobs in one account for supportability.
          </p>
        </ContentStep>
        <ContentStep number={3} title="End-of-support dates">
          <p className="text-slate-300">
            Older Glue 2.x/3.x versions retire on AWS timelines — plan migration before prod jobs lose security
            patches. Default new jobs to the latest stable Glue version your org certifies.
          </p>
        </ContentStep>
        <Callout variant="tip" title="Dev vs prod parity">
          Run the same Glue version, worker type, and bookmark settings in dev and prod — &quot;worked in
          dev on Glue 3.0 / 2 workers&quot; surprises when prod is still on an older runtime with different
          default serializers.
        </Callout>
      </LessonSection>

      <LessonSection title="Cost and ops mindset">
        <ContentStep number={1} title="Bookmarks reduce scan cost">
          <p className="text-slate-300">
            Incremental reads mean fewer S3 LIST/GET operations and less Spark work — direct savings on DPU
            minutes and faster SLAs for nightly loads.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Right-size before over-provisioning">
          <p className="text-slate-300">
            Doubling workers doubles DPU billing for the run duration if utilization is high — profile first,
            then scale. Failed OOM retries cost more than one G.2X trial run.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Monitor JobRun metrics">
          <p className="text-slate-300">
            Glue console shows DPU hours, execution time, and status — wire FAILED alarms to SNS the same way
            you did for Lambda and RDS extract jobs in earlier modules.
          </p>
        </ContentStep>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Job bookmarks track processed S3/JDBC data — enable on sources with transformation_ctx and commit on success for incremental runs.',
          'Workers = compute units; worker type (G.1X, G.2X, …) sets memory/CPU per executor, count sets parallelism — tune for OOM vs shuffle needs.',
          'Glue version pins Spark/Python runtime — align dev and prod, plan upgrades before end-of-support.',
          'Bookmarks save scan time; workers affect speed and cost — both are production knobs after basic ETL works end-to-end.',
        ]}
      />
    </LessonArticle>
  )
}
