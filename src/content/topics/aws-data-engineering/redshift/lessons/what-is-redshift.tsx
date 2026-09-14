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

export function WhatIsRedshift() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="In simple terms">
        Amazon Redshift is AWS&apos;s managed{' '}
        <strong className="text-white">cloud data warehouse</strong>. You load analytics-ready tables,
        write SQL with joins and aggregations, and many users query at once without each query re-reading
        the entire lake from S3. For data engineers, Redshift is where curated gold data becomes the
        trusted metrics layer — revenue by region, daily active users, inventory snapshots — that BI tools
        and executives depend on.
      </Callout>

      <Definition term="Amazon Redshift">
        <p>
          <strong className="text-white">Amazon Redshift</strong> is a fully managed, petabyte-scale data
          warehouse service optimized for online analytical processing (OLAP). It stores data in{' '}
          <strong className="text-white">columnar</strong> format on cluster nodes, executes queries using{' '}
          <strong className="text-white">massively parallel processing (MPP)</strong>, and integrates with S3
          for bulk load (<code className="text-core-400">COPY</code>), unload, and Spectrum external
          queries. You manage schema, load jobs, and performance tuning; AWS manages hardware, patching, and
          backups.
        </p>
      </Definition>

      <LessonSection title="What does data warehouse mean?">
        <p className="text-slate-300">
          A <strong className="text-white">data warehouse</strong> is a database designed for{' '}
          <em>reading and analyzing</em> large historical datasets — not for processing individual customer
          checkout clicks in real time. Data lands from operational systems (RDS exports, SaaS APIs, event
          streams), gets cleaned and modeled (star schema, wide tables), and supports questions like
          &quot;What was total revenue by product line last quarter?&quot; across millions of rows.
        </p>
        <ContentStep number={1} title="Optimized for analytics, not transactions">
          <p className="text-slate-300">
            Warehouses favor bulk loads and read-heavy SQL. Single-row updates and high-frequency inserts —
            the bread and butter of OLTP apps — are the wrong workload shape for Redshift.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Historical and integrated view">
          <p className="text-slate-300">
            DE pipelines combine orders, marketing spend, and support tickets into one place so analysts
            join across domains without logging into twelve source systems.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Serving layer for BI">
          <p className="text-slate-300">
            QuickSight, Tableau, Mode, and custom JDBC apps connect to Redshift endpoints. The warehouse
            becomes the single front door for certified metrics — with IAM, VPC, and audit controls
            centralized.
          </p>
        </ContentStep>
        <Flowchart
          title="Data warehouse in the analytics stack"
          chart={`flowchart TB
  SRC[Operational sources RDS APIs logs]
  SRC --> ETL[Glue Spark Lambda dbt]
  ETL --> S3[S3 lake curated zone]
  S3 --> WH[Redshift warehouse]
  WH --> BI[Dashboards and ad hoc SQL]
  WH --> EXP[UNLOAD exports ML audit]`}
        />
      </LessonSection>

      <LessonSection title="Columnar storage — why it matters">
        <p className="text-slate-300">
          Traditional row-oriented databases store all columns of a row together on disk. Analytic queries
          often need only a few columns —{' '}
          <code className="text-core-400">SELECT region, SUM(revenue)</code> — but row storage still reads
          customer name, address, and notes you never selected.{' '}
          <strong className="text-white">Columnar</strong> storage groups values per column, so Redshift
          reads only the columns your SQL references and benefits from better compression within homogeneous
          column data.
        </p>
        <ContentStep number={1} title="Less I/O per aggregation">
          <p className="text-slate-300">
            Scanning one billion rows for a sum on a single numeric column touches far fewer bytes in
            columnar layout than reading full rows — the core reason warehouses beat general-purpose DBs on
            large GROUP BY workloads.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Compression encodings">
          <p className="text-slate-300">
            Redshift supports encodings (AZ64, ZSTD, etc.) chosen per column — repeated region codes and
            date sequences compress aggressively, shrinking storage and scan cost together.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Sort keys exploit column order">
          <p className="text-slate-300">
            When data is physically sorted on a date column, queries with{' '}
            <code className="text-core-400">WHERE order_date BETWEEN ...</code> skip disk blocks outside the
            range — columnar plus sorted zones is the warehouse performance recipe (details in later lessons).
          </p>
        </ContentStep>
        <Example title="Row vs column — intuitive picture" caption="One billion order rows">
{`Row store read for SUM(revenue):     touches every column in every row
Column store read for SUM(revenue):  touches only the revenue column blocks

Same SQL, vastly different bytes read — why BI on Redshift scales where row DBs struggle.`}
        </Example>
      </LessonSection>

      <LessonSection title="MPP — many nodes, one query">
        <p className="text-slate-300">
          <strong className="text-white">Massively parallel processing (MPP)</strong> means a large query is
          split into pieces, each compute node works on its local slice of data simultaneously, and results
          merge on the leader node. Redshift clusters have one <strong className="text-white">leader
          node</strong> (query planning, client connections) and one or more{' '}
          <strong className="text-white">compute nodes</strong> (storage and execution).
        </p>
        <ContentStep number={1} title="Data sliced across nodes">
          <p className="text-slate-300">
            Each node holds a portion of every distributed table. When you run{' '}
            <code className="text-core-400">SELECT COUNT(*)</code>, all nodes count their slices in parallel
            — the leader sums partial counts.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Joins stay fast when co-located">
          <p className="text-slate-300">
            If two large tables share the same distribution key (e.g. customer_id), matching rows live on
            the same node — local joins without shuffling terabytes across the network. Wrong distribution
            causes expensive redistributions; tuning lessons cover how to avoid that.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Scale out by adding nodes">
          <p className="text-slate-300">
            Need more storage or parallelism? Resize the cluster or add nodes (provisioned model). Redshift
            Serverless abstracts nodes into capacity units — same MPP idea, different ops surface.
          </p>
        </ContentStep>
        <Flowchart
          title="MPP query execution (simplified)"
          chart={`flowchart TB
  CLIENT[BI tool or SQL client]
  CLIENT --> LEAD[Leader node parse and plan]
  LEAD --> N1[Compute node 1 slice]
  LEAD --> N2[Compute node 2 slice]
  LEAD --> N3[Compute node N slice]
  N1 --> MERGE[Leader merges partial results]
  N2 --> MERGE
  N3 --> MERGE
  MERGE --> OUT[Result set to client]`}
        />
      </LessonSection>

      <LessonSection title="What Redshift is not">
        <ContentStep number={1} title="Not a replacement for S3">
          <p className="text-slate-300">
            S3 remains the durable, cheap lake. Redshift holds working sets and marts — not every raw file
            ever ingested. Spectrum extends reach to cold S3 data without loading everything locally.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Not serverless lake SQL (that is Athena)">
          <p className="text-slate-300">
            Athena queries external files with no cluster to size. Redshift requires capacity planning (or
            Serverless RPU limits) and load pipelines — traded for predictable dashboard performance.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Not an OLTP application database">
          <p className="text-slate-300">
            Do not point your checkout microservice at Redshift. Use RDS or Aurora for transactional writes;
            replicate or ETL into Redshift for analytics.
          </p>
        </ContentStep>
        <Callout variant="insight">
          Redshift sits naturally after S3 and Athena in your mental model: lake storage, lake SQL for
          exploration, warehouse for curated serving — three layers, one analytics platform.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Redshift is AWS\'s managed cloud data warehouse — optimized for OLAP analytics, not transactional apps.',
          'Columnar storage reads only needed columns and compresses well; sort keys further reduce scan scope.',
          'MPP splits queries across compute nodes in parallel; distribution keys keep joins local when designed well.',
          'Use Redshift as the serving layer for BI and certified metrics; keep S3 as lake storage and Athena for ad hoc lake SQL.',
        ]}
      />
    </LessonArticle>
  )
}
