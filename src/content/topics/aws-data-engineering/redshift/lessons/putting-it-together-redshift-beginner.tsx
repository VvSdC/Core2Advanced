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

export function PuttingItTogetherRedshiftBeginner() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Checkpoint before cluster deep dives">
        You now know what Redshift is, how OLTP differs from OLAP, and how the warehouse compares to RDS,
        Athena, and S3. This lesson ties those threads into a{' '}
        <strong className="text-white">beginner Redshift checklist</strong> — the mental model and vocabulary
        you need before provisioning nodes, writing COPY commands, or tuning distribution keys in a dev
        account.
      </Callout>

      <Definition term="Beginner warehouse mental model">
        <p>
          A <strong className="text-white">beginner warehouse mental model</strong> for DE includes: S3 as
          durable lake storage, Athena for ad hoc lake SQL and QA, Redshift as the optional serving layer for
          loaded curated marts, clear OLTP vs OLAP boundaries (RDS is source, not BI target), and vocabulary
          for cluster, COPY, UNLOAD, distribution, and sort keys — all before hands-on cluster setup in the
          next lessons.
        </p>
      </Definition>

      <LessonSection title="Architecture checklist — can you draw this?">
        <ContentStep number={1} title="S3 holds the lake">
          <p className="text-slate-300">
            Raw, processed, and curated zones with Parquet in gold — the durable layer every engine reads
            from or loads from.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Athena validates before warehouse load">
          <p className="text-slate-300">
            Partition-filtered SELECT confirms row counts and schema — QA gate before COPY burns warehouse
            load windows.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Redshift serves hot marts">
          <p className="text-slate-300">
            Local columnar tables for fact and dimension models BI tools query — not a copy of the entire
            lake, only certified subsets.
          </p>
        </ContentStep>
        <ContentStep number={4} title="RDS and apps stay OLTP">
          <p className="text-slate-300">
            Production databases feed pipelines via export or CDC — analysts never run heavy GROUP BY on prod
            Postgres.
          </p>
        </ContentStep>
        <ContentStep number={5} title="Round-trip to S3 when needed">
          <p className="text-slate-300">
            UNLOAD for ML features, archival, or sharing — warehouse is not the only exit point.
          </p>
        </ContentStep>
        <Flowchart
          title="Beginner AWS analytics stack"
          chart={`flowchart TD
  RDS[RDS OLTP source]
  RDS --> ETL[Glue Lambda ETL]
  ETL --> S3[S3 lake curated]
  S3 --> ATH[Athena QA and explore]
  ATH --> OK[Validation pass]
  OK --> COPY[Redshift COPY]
  COPY --> RS[Redshift marts]
  RS --> BI[QuickSight dashboards]
  RS --> UNL[UNLOAD to S3 optional]`}
        />
      </LessonSection>

      <LessonSection title="Self-check — can you explain these?">
        <ContentStep number={1} title="What is a data warehouse in one sentence?">
          <p className="text-slate-300">
            A database optimized for analytical queries over large integrated historical data — OLAP, not
            live app transactions.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Columnar vs row storage — why BI cares">
          <p className="text-slate-300">
            Columnar reads only selected columns for aggregations — less I/O than row stores scanning full
            records on billion-row facts.
          </p>
        </ContentStep>
        <ContentStep number={3} title="MPP in plain English">
          <p className="text-slate-300">
            Split query work across many nodes in parallel; leader merges partial results — scales analytics
            with cluster size.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Redshift vs Athena in one sentence">
          <p className="text-slate-300">
            Athena: serverless ad hoc SQL on S3 pay-per-scan. Redshift: provisioned warehouse on loaded
            data for concurrent BI — complementary.
          </p>
        </ContentStep>
        <ContentStep number={5} title="Redshift vs RDS in one sentence">
          <p className="text-slate-300">
            RDS runs the app (OLTP); Redshift serves analytics (OLAP) — pipeline extracts from RDS, loads
            Redshift via S3.
          </p>
        </ContentStep>
        <ContentStep number={6} title="Redshift vs S3 in one sentence">
          <p className="text-slate-300">
            S3 stores all files cheaply; Redshift computes fast SQL on loaded hot subsets — storage layer vs
            serving layer.
          </p>
        </ContentStep>
        <ContentStep number={7} title="COPY and UNLOAD purpose">
          <p className="text-slate-300">
            COPY bulk-loads files from S3 into Redshift tables; UNLOAD exports Redshift query results back
            to S3 — primary DE ingest and export verbs.
          </p>
        </ContentStep>
        <Example title="Beginner Redshift concept drill" caption="No cluster required yet — explain aloud">
{`1. Why not run executive dashboards on RDS?
2. When would you use Athena instead of Redshift?
3. Why keep curated data on S3 after COPY succeeds?
4. What problem does MPP solve?
5. Name two physical design concepts you will tune later (dist key, sort key)
6. Draw: S3 → Athena QA → COPY → Redshift → BI
7. What OLTP vs OLAP means for your pipeline arrows`}
        </Example>
        <Callout variant="insight">
          Strong Redshift beginners do not memorize node families on day one. They ask: where is the lake,
          what is loaded vs queried in place, who serves BI, and where OLTP stops — four questions that
          prevent architecture mistakes before anyone clicks Create cluster.
        </Callout>
      </LessonSection>

      <LessonSection title="Mini scenario — end-to-end story">
        <p className="text-slate-300">
          A mid-size e-commerce team runs Postgres on RDS for orders. Nightly Glue job exports changes to
          S3 curated Parquet. Athena confirms yesterday&apos;s partition row count matches source. On success,
          orchestration runs COPY into <code className="text-core-400">analytics.fact_orders</code>.
          QuickSight dashboards on Redshift refresh for morning standup. An analyst explores a new raw JSON
          feed in Athena only — not ready for warehouse load. Finance requests a one-off historical extract;
          UNLOAD writes Parquet to S3 for audit. Every tier does its job.
        </p>
        <ContentStep number={1} title="OLTP tier — RDS">
          <p className="text-slate-300">Checkout writes orders — milliseconds, transactional.</p>
        </ContentStep>
        <ContentStep number={2} title="Lake tier — S3">
          <p className="text-slate-300">Curated Parquet — durable, replayable, multi-consumer.</p>
        </ContentStep>
        <ContentStep number={3} title="Explore tier — Athena">
          <p className="text-slate-300">QA and ad hoc on lake — pay per scan, no cluster.</p>
        </ContentStep>
        <ContentStep number={4} title="Serve tier — Redshift">
          <p className="text-slate-300">Certified marts — concurrent BI, COPY-loaded columnar tables.</p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="What's next">
        <p className="text-slate-300">
          The next lessons in the Redshift track go hands-on on topics this beginner pass introduced:
        </p>
        <ContentStep number={1} title="Cluster and nodes">
          <p className="text-slate-300">
            Leader vs compute nodes, RA3 vs DC2, provisioned vs Serverless, VPC security groups, and
            choosing a dev-sized cluster without overspending.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Distribution and sort keys">
          <p className="text-slate-300">
            DISTSTYLE KEY/EVEN/ALL, choosing DISTKEY for join columns, SORTKEY for date filters — the
            physical design that separates slow warehouses from fast ones.
          </p>
        </ContentStep>
        <ContentStep number={3} title="COPY from S3">
          <p className="text-slate-300">
            IAM roles for COPY, Parquet and CSV formats, manifest files, compression, error handling, and
            integrating COPY into Glue-orchestrated nightly loads.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Spectrum, WLM, and tuning">
          <p className="text-slate-300">
            External tables on Glue-cataloged S3, workload management queues, concurrency scaling, vacuum
            and analyze, and when UNLOAD beats keeping cold data local.
          </p>
        </ContentStep>
        <p className="mt-4 text-slate-300">
          Redshift connects everything you built so far: IAM grants S3 and Redshift access, S3 holds lake
          zones, Glue lands curated files, Athena validates them, CloudWatch and SNS alert on pipeline
          failures — Redshift serves the metrics stakeholders act on. Advanced modules (dbt, Lake Formation,
          cross-account sharing) assume you can explain warehouse vs lake SQL without opening the console.
        </p>
        <Callout variant="tip" title="Before you create a cluster">
          Re-read the Athena vs warehouse and Redshift vs S3 lessons. Teams that skip the storage-vs-serving
          distinction load raw logs into Redshift on day one and wonder why costs spike — the architecture
          map saves money before the first COPY runs.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Beginner model: S3 lake (storage) → Athena (QA/explore) → Redshift (loaded marts for BI) → UNLOAD when exports needed.',
          'OLTP stays on RDS; OLAP on Redshift — never large BI on production operational databases.',
          'Self-check: warehouse definition, columnar/MPP, COPY/UNLOAD, and comparisons to Athena, RDS, and S3.',
          'Next in Redshift track: cluster nodes, distribution/sort keys, COPY from S3, then Spectrum and WLM tuning.',
        ]}
      />
    </LessonArticle>
  )
}
