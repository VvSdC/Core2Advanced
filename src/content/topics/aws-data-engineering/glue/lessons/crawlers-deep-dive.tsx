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

export function CrawlersDeepDive() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Crawlers are metadata scouts — not ETL engines">
        AWS Glue crawlers scan data sources, infer schema, discover partitions, and register tables in the{' '}
        <strong className="text-white">Glue Data Catalog</strong>. They do not transform data. Data engineers
        use crawlers to bootstrap catalog entries on raw landing zones before committing Glue Spark job logic
        or Athena exploration.
      </Callout>

      <Definition term="Glue crawler">
        <p>
          A scheduled or on-demand crawler that connects to a <strong className="text-white">target</strong>{' '}
          (S3 prefix, JDBC database, DynamoDB, etc.), classifies files, infers column names and types, detects
          partition keys from folder paths, and writes or updates catalog tables. Output is metadata — the
          underlying S3 objects or JDBC rows are unchanged.
        </p>
      </Definition>

      <LessonSection title="Crawler targets — S3 and JDBC">
        <ContentStep number={1} title="S3 targets">
          <p className="text-slate-300">
            Point the crawler at a bucket prefix such as{' '}
            <span className="font-mono text-sm">s3://lake/raw/events/</span>. The crawler samples files,
            chooses a classifier (CSV, JSON, Parquet, etc.), and infers schema. For partitioned layouts like{' '}
            <span className="font-mono text-sm">year=2026/month=03/day=15/</span>, enable partition discovery
            so each prefix becomes a catalog partition — Athena and Glue jobs can prune without MSCK REPAIR.
          </p>
        </ContentStep>
        <ContentStep number={2} title="JDBC targets">
          <p className="text-slate-300">
            Crawlers can connect to RDS, Redshift, or other JDBC sources via a{' '}
            <strong className="text-white">Glue connection</strong> (VPC, security groups, credentials in
            Secrets Manager). They read table metadata and sample rows to infer types — useful for cataloging
            operational databases before DMS or Glue JDBC extract jobs. JDBC crawlers do not copy data to S3;
            they register external-style tables pointing at the source.
          </p>
        </ContentStep>
        <ContentStep number={3} title="When to crawl vs define DDL manually">
          <p className="text-slate-300">
            Crawl first on messy landing data — explore with Athena, fix types, then lock schema in versioned
            DDL or Glue ETL writes. For curated Parquet with stable schema, skip recurring crawls; register
            tables explicitly to avoid crawler overwriting intentional type choices (e.g. forcing{' '}
            <span className="font-mono text-sm">decimal</span> instead of inferred{' '}
            <span className="font-mono text-sm">double</span>).
          </p>
        </ContentStep>
        <Example title="S3 vs JDBC crawler — DE use case">
{`S3 crawl: new vendor drops daily JSON under s3://lake/landing/vendor_x/
→ Crawler registers raw table → Athena spot-check → Glue job builds silver Parquet.

JDBC crawl: catalog prod Postgres public.orders before nightly extract
→ Crawler registers JDBC table metadata → Glue JDBC job reads with known schema.`}
        </Example>
      </LessonSection>

      <LessonSection title="Schema detection">
        <ContentStep number={1} title="Classifiers and sampling">
          <p className="text-slate-300">
            Glue uses built-in classifiers (CSV, JSON, Parquet, XML, etc.) and custom classifiers you define.
            The crawler samples a subset of files — not every object — so rare edge rows may be missed.
            Nested JSON becomes struct columns; arrays may flatten inconsistently until you normalize in ETL.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Schema change policies">
          <p className="text-slate-300">
            Configure how the crawler handles drift: update the catalog, log changes, or delete and recreate
            tables. Production curated zones usually use{' '}
            <strong className="text-white">log or ignore</strong> on crawl — schema evolution belongs in
            controlled Glue job code, not automatic overwrite from raw landing variance.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Common inference mistakes">
          <p className="text-slate-300">
            Leading-zero IDs inferred as integers lose padding. Timestamps stored as strings stay{' '}
            <span className="font-mono text-sm">string</span> until you cast in ETL. Sparse JSON keys across
            files produce wide sparse schemas — ResolveChoice in Glue jobs handles ambiguous types downstream.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Partition discovery">
        <ContentStep number={1} title="Hive-style paths">
          <p className="text-slate-300">
            Partition discovery reads folder names matching{' '}
            <span className="font-mono text-sm">key=value</span> and registers them as partition columns.
            Queries with{' '}
            <span className="font-mono text-sm">WHERE year='2026' AND month='03'</span> skip unrelated
            prefixes — the same pruning Athena relies on for scan cost control.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Crawler vs MSCK REPAIR">
          <p className="text-slate-300">
            Crawlers add partitions as they scan new folders. For tables created via DDL without a crawler,
            Athena users run MSCK REPAIR TABLE or use partition projection. Glue ETL jobs that write{' '}
            <span className="font-mono text-sm">partitionBy()</span> should also call{' '}
            <span className="font-mono text-sm">catalog.update_partition</span> or rely on a post-job crawler
            on the curated prefix.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Partition discovery pitfalls">
          <p className="text-slate-300">
            Non-standard folder layouts (dates without key=value) are not discovered automatically. Typos in
            partition values (<span className="font-mono text-sm">mnoth=03</span>) create orphan partitions.
            High-cardinality partition keys from crawling (millions of user_id folders) explode metadata —
            fix layout in ETL, not at crawl time.
          </p>
        </ContentStep>
        <Flowchart
          title="Crawler flow — S3 landing to catalog"
          chart={`flowchart TB
  S3[S3 landing prefix]
  CRAWL[Glue crawler run]
  CLASS[Classifiers sample files]
  INF[Infer schema and types]
  PART[Discover partitions from paths]
  CAT[Glue Data Catalog table]
  ATH[Athena explore]
  ETL[Glue Spark ETL]
  S3 --> CRAWL
  CRAWL --> CLASS
  CLASS --> INF
  INF --> PART
  PART --> CAT
  CAT --> ATH
  CAT --> ETL`}
        />
      </LessonSection>

      <LessonSection title="Operational best practices">
        <ContentStep number={1} title="Scheduling and cost">
          <p className="text-slate-300">
            Crawlers bill per DPU-hour while running. Schedule after landing batches arrive — not every
            hour on static curated data. Combine multiple S3 targets in one crawler when prefixes share
            schema; separate crawlers when classifiers or policies differ.
          </p>
        </ContentStep>
        <ContentStep number={2} title="IAM and exclusions">
          <p className="text-slate-300">
            Crawler role needs S3 read on targets and Glue catalog write. Use exclude patterns to skip{' '}
            <span className="font-mono text-sm">_temporary/</span>, quarantine prefixes, and manifest files
            that confuse classifiers. CloudWatch logs show which files were sampled and any classifier failures.
          </p>
        </ContentStep>
        <Callout variant="tip">
          Treat crawlers as <strong className="text-white">schema discovery</strong> on raw and bronze layers.
          Silver and gold tables with governed schemas should be registered by ETL jobs or IaC — not left to
          recurring inference on production curated paths.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Crawlers infer schema and partitions from S3 or JDBC — they update the Glue Data Catalog, not data.',
          'S3 targets: classifiers sample files, discover Hive-style partitions, enable Athena/Glue pruning.',
          'JDBC targets: catalog RDS/Redshift tables via connections — metadata only, no S3 copy.',
          'Schema change policies matter — avoid auto-overwriting curated tables; fix inference errors in ETL.',
          'Schedule crawlers after ingest; exclude junk prefixes; use crawlers for exploration, DDL for production silver/gold.',
        ]}
      />
    </LessonArticle>
  )
}
