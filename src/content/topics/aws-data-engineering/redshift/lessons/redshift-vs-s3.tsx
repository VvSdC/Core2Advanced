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

export function RedshiftVsS3() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Storage vs compute warehouse">
        Amazon S3 and Amazon Redshift both hold data — but S3 is{' '}
        <strong className="text-white">durable object storage</strong> for the lake; Redshift is a{' '}
        <strong className="text-white">compute warehouse</strong> with local columnar storage optimized for
        SQL analytics. Confusing them leads to expensive mistakes: treating S3 like a query engine, or
        loading every raw file into Redshift. Data engineers use S3 as the system of record and Redshift as
        the performance serving layer on top.
      </Callout>

      <Definition term="Lake on S3 vs warehouse serving layer">
        <p>
          <strong className="text-white">S3 (data lake storage):</strong> cheap, virtually unlimited,
          eleven-nines durability — stores raw, processed, and curated files (CSV, JSON, Parquet) organized
          by prefix and partition. Query engines (Athena, Spark, Spectrum){' '}
          <em>read</em> S3; S3 itself does not run SQL.{' '}
          <strong className="text-white">Redshift (warehouse serving layer):</strong> managed cluster that{' '}
          <em>loads</em> selected datasets into MPP columnar tables for fast repeatable BI — fed from S3 via{' '}
          <code className="text-core-400">COPY</code>, not a replacement for the entire lake.
        </p>
      </Definition>

      <LessonSection title="What each layer does best">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Dimension</th>
                <th className="px-4 py-3">S3 (lake)</th>
                <th className="px-4 py-3">Redshift (warehouse)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                [
                  'Primary role',
                  'Store all files — raw through curated — cheap and durable',
                  'Serve analytics SQL on hot curated subsets with low latency',
                ],
                [
                  'Data format',
                  'Objects (files) — you choose Parquet, CSV, etc.',
                  'Internal columnar tables — loaded via COPY from files',
                ],
                [
                  'Query capability',
                  'None native — Athena/Spark/Redshift read it',
                  'Full SQL warehouse — joins, WLM, materialized views',
                ],
                [
                  'Cost driver',
                  'GB-months stored + requests + lifecycle transitions',
                  'Cluster node hours / Serverless RPU + stored data on RA3',
                ],
                [
                  'Scale limit',
                  'Virtually unlimited objects',
                  'Petabyte-scale but sized deliberately — not infinite cheap storage',
                ],
                [
                  'Retention',
                  'Years of history economical with Glacier tiers',
                  'Hot working data — archive cold history back to S3 with UNLOAD',
                ],
                [
                  'DE pattern',
                  'Medallion zones: raw, processed, curated prefixes',
                  'Gold marts: fact_sales, dim_customer for BI',
                ],
              ].map(([dim, s3, rs]) => (
                <tr key={dim} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{dim}</td>
                  <td className="px-4 py-3">{s3}</td>
                  <td className="px-4 py-3">{rs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Flowchart
          title="S3 lake vs Redshift serving layer"
          chart={`flowchart TB
  subgraph LAKE[S3 data lake]
    RAW[raw zone]
    PROC[processed zone]
    CUR[curated Parquet]
  end
  CUR --> ATH[Athena ad hoc SQL]
  CUR --> COPY[Redshift COPY]
  COPY --> RS[Redshift local marts]
  RS --> BI[Dashboards]
  RS --> UNL[UNLOAD archive]
  UNL --> CUR`} 
        />
      </LessonSection>

      <LessonSection title="Why the lake stays on S3">
        <ContentStep number={1} title="Single durable source of truth">
          <p className="text-slate-300">
            Every pipeline stage writes verifiable objects with versioning and lifecycle policies. Replay
            a failed warehouse load from the same S3 keys — no re-extracting from prod RDS.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Multiple consumers, one copy of bytes">
          <p className="text-slate-300">
            Glue Spark, Athena, SageMaker, Redshift COPY, and external partners all read the same curated
            prefix — no N-way replication into separate database silos.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Cost-effective long retention">
          <p className="text-slate-300">
            Ten years of Parquet history on S3 with Intelligent-Tiering costs far less than keeping every
            byte in warehouse local SSD. Redshift holds months of hot data; S3 holds the archive.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Schema-on-read flexibility">
          <p className="text-slate-300">
            Raw JSON lands first; schema evolves in ETL. External tables and Athena probe new shapes before
            warehouse DDL commits — agility the serving layer inherits after validation.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Why add Redshift when S3 already has the data">
        <ContentStep number={1} title="Query performance on hot paths">
          <p className="text-slate-300">
            Scanning Parquet on S3 via Athena works — but repeated dashboard queries re-read the same bytes.
            Loaded columnar tables with sort and dist keys answer in seconds consistently.
          </p>
        </ContentStep>
        <ContentStep number={2} title="SQL features and governance">
          <p className="text-slate-300">
            Materialized views, stored procedures, fine-grained WLM, and JDBC ecosystem integrations target
            warehouse users — beyond what ad hoc lake SQL alone provides.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Controlled working set">
          <p className="text-slate-300">
            Load only gold tables analysts need — not every raw log file ever collected. Warehouse size
            tracks BI scope, not total lake volume.
          </p>
        </ContentStep>
        <Example title="DE scenario — right data in each tier" caption="E-commerce analytics platform">
{`S3 lake (100 TB total):
  raw/clickstream/     — 70 TB JSON (Athena for debug only)
  curated/orders/      — 25 TB Parquet (Athena QA + Spectrum)
  curated/customers/   — 5 TB Parquet

Redshift (8 TB loaded):
  fact_orders, dim_customer, mart_daily_revenue — last 24 months for BI

Older orders stay on S3 — Spectrum or UNLOAD/re-COPY for rare historical studies.`}
        </Example>
      </LessonSection>

      <LessonSection title="How they work together in pipelines">
        <ContentStep number={1} title="COPY — S3 to Redshift">
          <p className="text-slate-300">
            Bulk load from <code className="text-core-400">s3://lake/curated/sales/</code> using an IAM role
            attached to the cluster — Parquet preferred, manifest files for large batches. Primary ingest
            path for DE nightly jobs.
          </p>
        </ContentStep>
        <ContentStep number={2} title="UNLOAD — Redshift back to S3">
          <p className="text-slate-300">
            Export query results or entire tables to S3 for ML feature stores, cross-account sharing, or
            cold archival — closes the loop so warehouse is not the only copy.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Spectrum — query S3 without full load">
          <p className="text-slate-300">
            External tables in Redshift point at Glue-cataloged S3 locations — join local dimensions with
            cold S3 facts without loading petabytes locally.
          </p>
        </ContentStep>
        <Flowchart
          title="Data lifecycle across S3 and Redshift"
          chart={`flowchart LR
  INGEST[Lambda Glue Kinesis]
  INGEST --> S3W[S3 write curated files]
  S3W --> QA[Athena validation]
  QA --> COPY2[COPY hot tables]
  COPY2 --> RS2[Redshift marts]
  RS2 --> BI2[BI queries]
  RS2 --> UNL2[UNLOAD cold or extracts]
  UNL2 --> S3W`} 
        />
        <Callout variant="tip" title="Medallion mindset">
          Bronze and silver live comfortably on S3. Gold may live on S3 <em>and</em> in Redshift — S3 for
          replay and open formats, Redshift for speed. Never delete S3 curated data just because COPY
          succeeded.
        </Callout>
      </LessonSection>

      <LessonSection title="Common mistakes">
        <ContentStep number={1} title="Warehouse as only storage">
          <p className="text-slate-300">
            Loading all raw logs into Redshift — storage and compute costs explode; you lose cheap replay and
            multi-engine access. Keep raw on S3.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Skipping S3 entirely">
          <p className="text-slate-300">
            COPY straight from RDS forever without a lake — works short term but blocks Athena QA, reprocessing,
            and ML teams that expect S3 paths.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Duplicate ungoverned copies">
          <p className="text-slate-300">
            Curated Parquet on S3 plus a divergent manual load into Redshift — metrics disagree. Single ETL
            output to S3, then COPY (or dbt snapshot both targets) keeps logic one place.
          </p>
        </ContentStep>
        <Callout variant="insight">
          S3 answers &quot;where do we durably store everything?&quot; Redshift answers &quot;how do we serve
          BI fast on the subset that matters today?&quot; — storage layer vs serving layer, both required in
          modern AWS DE architectures.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'S3 is durable cheap lake storage — files with no native SQL; Redshift is a compute warehouse with local columnar tables for fast BI.',
          'Keep all history and medallion zones on S3; load hot gold marts into Redshift for dashboard performance.',
          'COPY loads S3 → Redshift; UNLOAD exports back; Spectrum queries S3 external tables without full load.',
          'Never replace the lake with the warehouse — S3 remains system of record; Redshift is the serving layer on curated subsets.',
        ]}
      />
    </LessonArticle>
  )
}
