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

export function CrawlersIntro() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Crawlers discover what is on disk">
        You landed files in S3 — maybe CSV exports from RDS, JSON from an API, or Parquet from a partner.
        Before Athena can run <code className="text-core-400">SELECT</code>, something must record column
        names, types, and partition folders in the Glue Data Catalog. A{' '}
        <strong className="text-white">Glue Crawler</strong> automates that discovery: it scans a data
        store, infers schema, and creates or updates catalog tables for you.
      </Callout>

      <Definition term="Glue Crawler">
        <p>
          A <strong className="text-white">Glue Crawler</strong> is a managed scan job that connects to a
          data source — most often S3, but also JDBC databases, DynamoDB, MongoDB, and others — classifies
          files, infers column schemas, detects partitions, and writes or updates{' '}
          <strong className="text-white">table</strong> definitions in the Glue Data Catalog. Crawlers run
          on a schedule, on demand, or as part of a Glue Workflow when new data arrives.
        </p>
      </Definition>

      <LessonSection title="What crawlers do — schema and partitions">
        <ContentStep number={1} title="Schema inference">
          <p className="text-slate-300">
            The crawler samples files in the target path, detects format (CSV, JSON, Parquet, etc.), and
            proposes column names and Hive-compatible types. For Parquet and ORC, it reads embedded schemas;
            for JSON it may flatten nested structures or create complex types depending on classifier settings.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Partition discovery">
          <p className="text-slate-300">
            When folder names follow hive-style patterns (
            <code className="text-core-400">year=2026/month=03/</code>), the crawler registers partition
            keys and values in the catalog — the same entries Athena uses to prune scans in{' '}
            <code className="text-core-400">WHERE year = &apos;2026&apos;</code> filters.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Create vs update behavior">
          <p className="text-slate-300">
            You configure whether a crawler adds new tables, updates existing ones, or deletes stale
            metadata. Production teams often use &quot;update existing&quot; on curated paths and explicit
            DDL for gold tables where schema must never drift silently.
          </p>
        </ContentStep>
        <Flowchart
          title="Crawler scan flow"
          chart={`flowchart LR
  SRC[S3 prefix or JDBC]
  SRC --> CRAWL[Glue Crawler run]
  CRAWL --> INFER[Infer schema and format]
  INFER --> PART[Detect partitions]
  PART --> CAT[Write to Data Catalog]
  CAT --> ATH[Athena Spectrum ready]`}
        />
      </LessonSection>

      <LessonSection title="Crawler building blocks">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Setting</th>
                <th className="px-4 py-3">What it controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                [
                  'Data source',
                  'Where to scan — S3 bucket/prefix, JDBC URL via Connection, DynamoDB table, etc.',
                ],
                [
                  'IAM role',
                  'Permissions to list/read S3, write catalog, and reach VPC JDBC sources',
                ],
                [
                  'Database target',
                  'Which Glue database receives new or updated tables — e.g. de_lake_dev',
                ],
                [
                  'Table prefix / grouping',
                  'Optional naming prefix so one crawler can create multiple tables from subfolders',
                ],
                [
                  'Schedule',
                  'Cron expression for nightly discovery — or on-demand only for dev',
                ],
                [
                  'Classifiers',
                  'Custom rules when default inference fails on proprietary CSV or log formats',
                ],
              ].map(([setting, control]) => (
                <tr key={setting} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{setting}</td>
                  <td className="px-4 py-3">{control}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="S3 crawler — typical lake bootstrap">
        <p className="text-slate-300">
          The most common DE pattern: point a crawler at a bronze or curated S3 prefix and let it register
          tables for Athena exploration before you invest in a full Glue ETL job.
        </p>
        <ContentStep number={1} title="Choose the prefix carefully">
          <p className="text-slate-300">
            One crawler per logical dataset —{' '}
            <code className="text-core-400">s3://acme-lake/raw/events/</code> not the entire bucket root —
            avoids one giant table with mixed schemas and keeps catalog names readable.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Expect multiple tables in subfolders">
          <p className="text-slate-300">
            If subdirectories have different schemas, the crawler may create separate tables per folder group.
            Use a table prefix like <code className="text-core-400">raw_</code> for clarity in the database.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Re-run after new partitions land">
          <p className="text-slate-300">
            Nightly job adds <code className="text-core-400">year=2026/month=09/day=16/</code> — schedule
            crawler after the job or register partitions in the job itself to avoid stale catalog entries.
          </p>
        </ContentStep>
        <Example title="S3 crawler mental checklist" caption="Before first run in dev">
{`1. IAM role: s3:ListBucket/GetObject on target prefix + glue:CreateTable/UpdateTable
2. Target database: de_lake_dev (create if missing)
3. S3 path: s3://acme-lake-dev/raw/orders/ (not whole bucket)
4. Schedule: on-demand first, then cron after pipeline stabilizes
5. After run: verify table in Glue console, test SELECT in Athena with partition filter
6. If schema wrong: check file format mix, add custom classifier, or switch to explicit DDL`}
        </Example>
        <Callout variant="insight">
          Crawlers excel at discovery and dev velocity. Production curated layers often pair a one-time
          crawler with a Glue job that writes Parquet and registers partitions explicitly — crawlers alone
          do not apply business transforms or PII masking.
        </Callout>
      </LessonSection>

      <LessonSection title="Crawlers vs Glue Jobs — when to use which">
        <ContentStep number={1} title="Use a crawler when">
          <p className="text-slate-300">
            You need quick metadata for exploration, schema is stable or inferred types are good enough,
            and files already land in a consistent layout — common for raw/bronze zones and partner drops.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Use a job when">
          <p className="text-slate-300">
            You must transform data — dedupe, join dimensions, cast types, drop columns, write Parquet with
            a enforced schema — and optionally update catalog in the same run.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Use both in sequence">
          <p className="text-slate-300">
            Crawler on raw for analyst peek; job promotes to curated; second crawler or job sink updates gold
            catalog — a standard medallion bootstrap pattern.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Limitations to know early">
        <ContentStep number={1} title="Inference is not business logic">
          <p className="text-slate-300">
            Crawlers guess types from samples — a column that mixes integers and strings may become string
            everywhere; edge values in unscanned files can still break Athena queries later.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Nested JSON can explode columns">
          <p className="text-slate-300">
            Deep nesting creates wide or struct-heavy schemas. Often you still want a Glue job to flatten
            before gold — crawler output is a starting point, not the final model.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Cost on huge prefixes">
          <p className="text-slate-300">
            Crawlers bill per DPU-hour of scan time. Scanning millions of small files repeatedly adds up —
            narrow prefixes, schedules aligned with loads, and partition registration in jobs reduce churn.
          </p>
        </ContentStep>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Glue Crawlers scan data stores (usually S3) and register or update schema and partitions in the Data Catalog.',
          'They infer column types and hive-style partitions — enabling Athena and Spectrum without manual DDL for every folder.',
          'S3 crawler teaser: one prefix per dataset, IAM role with S3 + catalog write, re-run or sync when new partitions land.',
          'Crawlers discover metadata; Glue Jobs transform data — production pipelines use both, with explicit DDL for critical gold tables.',
        ]}
      />
    </LessonArticle>
  )
}
