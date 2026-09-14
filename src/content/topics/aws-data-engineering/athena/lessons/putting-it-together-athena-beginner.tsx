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

export function PuttingItTogetherAthenaBeginner() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Checkpoint before catalog deep dives">
        You now know what Athena is, how databases and external tables map to S3, how to run a first{' '}
        <code className="text-core-400">SELECT</code>, why Parquet beats CSV for scan cost, where query
        results land, and how Athena compares to a warehouse like Redshift. This lesson ties those threads
        into a{' '}
        <strong className="text-white">beginner Athena checklist</strong> — minimum lake SQL wiring on your
        dev account before Glue crawlers, partition repair, CTAS, and cost workgroups enter the picture.
      </Callout>

      <Definition term="Beginner lake SQL stack">
        <p>
          A <strong className="text-white">beginner lake SQL stack</strong> for a DE dev account includes: S3
          curated prefix with at least one small dataset (or sample table), Glue/Athena database and external
          table pointing at that prefix, query result location configured, one successful partition-filtered{' '}
          <code className="text-core-400">SELECT</code>, and awareness of data scanned — all before prod
          workgroups, Lake Formation fine-grained access, or Redshift COPY.
        </p>
      </Definition>

      <LessonSection title="Setup checklist — lake SQL in one afternoon">
        <ContentStep number={1} title="Confirm S3 data exists">
          <p className="text-slate-300">
            S3 → <code className="text-core-400">s3://acme-lake-dev/curated/sample_orders/</code> (or your
            dev path) — at least one file, ideally Parquet with hive-style partitions if you have them.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Create or verify catalog entry">
          <p className="text-slate-300">
            Glue or Athena DDL: database <code className="text-core-400">de_lake_dev</code>, external table{' '}
            <code className="text-core-400">sample_orders</code> with correct{' '}
            <code className="text-core-400">LOCATION</code> and <code className="text-core-400">STORED AS</code>{' '}
            matching file format.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Set query result location">
          <p className="text-slate-300">
            Athena → Settings →{' '}
            <code className="text-core-400">s3://acme-athena-results/</code>. Confirm IAM allows PutObject on
            that prefix for your user or role.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Run validation SELECT">
          <p className="text-slate-300">
            Start with{' '}
            <code className="text-core-400">SELECT * ... LIMIT 10</code>, then run{' '}
            <code className="text-core-400">SELECT COUNT(*) FROM de_lake_dev.sample_orders WHERE year =
            &apos;2026&apos;;</code> — note data scanned in execution details.
          </p>
        </ContentStep>
        <ContentStep number={5} title="Inspect results in S3">
          <p className="text-slate-300">
            Open results bucket — see query-id folder with CSV output. Connects the Console grid to physical
            objects (same pattern as lake files themselves).
          </p>
        </ContentStep>
        <Flowchart
          title="Beginner Athena verification flow"
          chart={`flowchart TD
  A[Files in S3 curated prefix]
  A --> B[Glue database and external table]
  B --> C[Configure Athena result location]
  C --> D[Partition-filtered SELECT succeeds]
  D --> E[Review data scanned metric]
  E --> F[Find result CSV in S3 output prefix]`}
        />
      </LessonSection>

      <LessonSection title="Mini scenario — prove SQL on the lake end-to-end">
        <p className="text-slate-300">
          Athena is not real until metadata, storage, IAM, and the editor agree on one query — not just
          reading about external tables.
        </p>
        <ContentStep number={1} title="Storage: S3 curated Parquet">
          <p className="text-slate-300">
            Glue job or manual upload wrote{' '}
            <code className="text-core-400">year=2026/month=03/part-000.parquet</code> — same layout Lambda/S3
            lessons described for lake zones.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Catalog: external table">
          <p className="text-slate-300">
            <code className="text-core-400">de_lake_dev.orders</code> points at prefix; columns match Parquet
            schema. Glue console shows table; Athena editor lists it under database dropdown.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Query: analyst validation">
          <p className="text-slate-300">
            <code className="text-core-400">SELECT day, COUNT(*) FROM de_lake_dev.orders WHERE year='2026'
            AND month='03' GROUP BY day;</code> — confirms daily load shape before SNS-all-clear to
            stakeholders.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Output: results prefix">
          <p className="text-slate-300">
            CSV lands under <code className="text-core-400">acme-athena-results/</code> — lifecycle will expire
            it; curated data untouched.
          </p>
        </ContentStep>
        <Example title="Beginner Athena drill checklist" caption="Dev-only — use sample or synthetic data">
{`1. S3 curated prefix contains at least one readable file
2. Database de_lake_dev exists in Glue catalog
3. External table LOCATION matches S3 path and format
4. Query result location set and writable
5. SELECT with partition WHERE returns expected rows
6. Data scanned looks reasonable (not full bucket)
7. Result files visible in athena-results prefix
8. Can explain: metadata in Glue, bytes in S3, scratch in results bucket`}
        </Example>
        <Callout variant="insight">
          Teams that skip result location setup burn an hour on IAM errors. Teams that query unpartitioned
          raw CSV wonder why Athena is &quot;expensive.&quot; This checklist catches both before prod access
          grants.
        </Callout>
      </LessonSection>

      <LessonSection title="Self-check — can you explain these?">
        <ContentStep number={1} title="External table vs files in S3">
          <p className="text-slate-300">
            Table = catalog metadata. Files = data. Drop table → files remain. Delete files → table returns
            fewer rows.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Why query result location is mandatory">
          <p className="text-slate-300">
            Distributed engine writes output to S3; Console reads from there. No location → query fails
            immediately.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Parquet vs CSV for Athena cost">
          <p className="text-slate-300">
            Parquet enables column pruning and compression — fewer bytes scanned. CSV reads whole rows — fine
            for tiny raw peeks, costly at scale.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Athena vs Redshift in one sentence">
          <p className="text-slate-300">
            Athena: serverless ad hoc SQL on S3 pay-per-scan. Redshift: provisioned warehouse for concurrent
            BI and loaded marts — complementary.
          </p>
        </ContentStep>
        <ContentStep number={5} title="What data scanned means">
          <p className="text-slate-300">
            Bytes Athena read from S3 to execute query — billing driver. Filters and column lists reduce it;
            SELECT * on huge unpartitioned tables increase it.
          </p>
        </ContentStep>
        <ContentStep number={6} title="Zero rows troubleshooting order">
          <p className="text-slate-300">
            Check S3 path → partition registration → WHERE filters → column types/SerDe mismatch — in that
            order before blaming Athena.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="What's next">
        <p className="text-slate-300">
          The next lessons in the Athena track go deeper on topics this beginner pass introduced:
        </p>
        <ContentStep number={1} title="Glue Catalog integration">
          <p className="text-slate-300">
            Crawlers vs explicit DDL, syncing partitions with{' '}
            <code className="text-core-400">MSCK REPAIR</code>, partition projection for date ranges, and
            keeping catalog entries aligned when Glue jobs add new folders nightly.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Partitions and performance">
          <p className="text-slate-300">
            Hive-style layout, choosing partition keys, avoiding the small-file problem, and writing queries
            that prune prefixes instead of scanning the full lake history.
          </p>
        </ContentStep>
        <ContentStep number={3} title="CTAS and INSERT INTO">
          <p className="text-slate-300">
            Materialize query results as new curated tables on S3 —{' '}
            <code className="text-core-400">CREATE TABLE AS SELECT</code> for silver-to-gold promotion
            without a separate Spark job, plus when CTAS beats repeated ad hoc scans.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Cost control and workgroups">
          <p className="text-slate-300">
            Workgroup quotas, CloudWatch metrics on scan volume, enforcing result locations per team, SSE-KMS,
            and analyst guardrails — turning pay-per-scan from surprise bills into predictable ops.
          </p>
        </ContentStep>
        <p className="mt-4 text-slate-300">
          Athena connects everything you built so far: IAM grants S3 and Athena access, S3 holds lake zones,
          Glue names them as tables, Lambda and Glue land files, CloudWatch and SNS tell you when loads fail
          — Athena confirms what actually landed. Redshift, QuickSight, and advanced Glue modules ahead assume
          you can run a partition-filtered SELECT and read data scanned without looking up the console path.
        </p>
        <Callout variant="insight">
          Strong Athena beginners do not memorize every SerDe on day one. They ask: where are the files, what
          catalog entry points there, is result location set, and did my WHERE clause match partition columns?
          Answer those four before CTAS, federated queries, or Iceberg tables.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Beginner checklist: S3 curated data, external table in Glue, result location set, successful partition-filtered SELECT, data scanned reviewed.',
          'Prove end-to-end: bytes in S3, metadata in catalog, SQL in editor, scratch CSV in results bucket — four layers, one query.',
          'Next in Athena track: Glue catalog sync, partitions, CTAS/INSERT, workgroups and cost governance.',
          'Athena closes the loop on the lake — storage (S3), metadata (Glue), validation SQL (Athena), alerts (SNS/CloudWatch) form the operable DE minimum.',
        ]}
      />
    </LessonArticle>
  )
}
