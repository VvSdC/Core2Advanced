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

export function DynamicframeVsDataframe() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Two ways to hold rows in Glue Spark">
        Apache Spark jobs use <strong className="text-white">DataFrames</strong> — typed, columnar datasets
        with a fixed schema. AWS Glue adds <strong className="text-white">DynamicFrames</strong>, a wrapper
        designed for messy lake data where schema varies row to row. Most Glue ETL reads start as
        DynamicFrames, convert to DataFrames for SQL-style transforms, then convert back for catalog-aware
        writes.
      </Callout>

      <Definition term="DynamicFrame">
        <p>
          A <strong className="text-white">DynamicFrame</strong> is Glue&apos;s distributed collection of
          records where each row can carry its own schema metadata — useful when ingesting semi-structured
          JSON, evolving API payloads, or CSV files with inconsistent columns. Glue provides{' '}
          <strong className="text-white">DynamicFrame</strong> transforms (
          <code className="text-core-400">ResolveChoice</code>,{' '}
          <code className="text-core-400">Relationalize</code>,{' '}
          <code className="text-core-400">DropFields</code>) that understand schema variations without
          failing the whole job on the first bad row.
        </p>
      </Definition>

      <Definition term="DataFrame">
        <p>
          A Spark <strong className="text-white">DataFrame</strong> is a dataset with a single enforced schema
          — every row conforms to the same column names and types. DataFrames support Spark SQL, joins,
          window functions, and the full PySpark API. They are stricter and faster for curated transforms once
          schema is known or resolved.
        </p>
      </Definition>

      <LessonSection title="Side-by-side comparison">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Aspect</th>
                <th className="px-4 py-3">DynamicFrame</th>
                <th className="px-4 py-3">DataFrame</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Schema model', 'Per-record schema flexibility; handles optional and nested fields', 'Single schema for all rows — strict'],
                ['Best at ingest', 'Raw JSON, API dumps, mixed CSV columns', 'Curated Parquet, typed JDBC reads after cast'],
                ['Transform API', 'Glue DynamicFrame methods + convert to DataFrame', 'Spark SQL, DataFrame DSL, UDFs'],
                ['Write to catalog', 'Native Glue sinks and DynamicFrame writers', 'Convert back to DynamicFrame or write via Spark with extra steps'],
                ['Performance', 'Slightly more overhead for schema resolution', 'Optimized Catalyst plans once schema is fixed'],
              ].map(([aspect, dyf, df]) => (
                <tr key={aspect} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{aspect}</td>
                  <td className="px-4 py-3">{dyf}</td>
                  <td className="px-4 py-3">{df}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Why DynamicFrame for semi-structured lake data">
        <ContentStep number={1} title="Evolving JSON from APIs">
          <p className="text-slate-300">
            Mobile app releases add fields weekly. Raw landing JSON has different keys per day. DynamicFrame
            ingest tolerates missing and new fields;{' '}
            <code className="text-core-400">ResolveChoice</code> picks consistent types before you lock schema
            for curated Parquet.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Nested structures without upfront DDL">
          <p className="text-slate-300">
            Arrays of structs (line items, event properties) are common in lake bronze. DynamicFrame{' '}
            <code className="text-core-400">Relationalize</code> flattens nested records into joinable tables
            — a frequent step before star-schema facts and dimensions.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Glue-native I/O">
          <p className="text-slate-300">
            <code className="text-core-400">create_dynamic_frame.from_catalog</code> and{' '}
            <code className="text-core-400">write_dynamic_frame</code> integrate bookmarks and catalog
            partition registration — patterns that map cleanly to DynamicFrame pipelines.
          </p>
        </ContentStep>
        <Flowchart
          title="Typical read-transform-write pattern"
          chart={`flowchart LR
  RAW[S3 raw JSON CSV]
  RAW --> DYF1[DynamicFrame read]
  DYF1 --> RES[ResolveChoice Relationalize]
  RES --> DF[DataFrame SQL joins]
  DF --> DYF2[DynamicFrame for sink]
  DYF2 --> CUR[S3 Parquet curated]
  DYF2 --> CAT[Catalog partitions]`}
        />
      </LessonSection>

      <LessonSection title="Conversion teaser — crossing the boundary">
        <p className="text-slate-300">
          Glue makes conversion explicit — you choose when to enforce schema strictness.
        </p>
        <ContentStep number={1} title="DynamicFrame → DataFrame">
          <p className="text-slate-300">
            Call <code className="text-core-400">dynamic_frame.toDF()</code> after schema resolution to use
            Spark SQL — register temp view, run{' '}
            <code className="text-core-400">spark.sql(&quot;SELECT ...&quot;)</code>, apply window functions
            for deduplication.
          </p>
        </ContentStep>
        <ContentStep number={2} title="DataFrame → DynamicFrame">
          <p className="text-slate-300">
            Wrap with <code className="text-core-400">DynamicFrame.fromDF(df, glueContext, name)</code> before
            Glue catalog sink or bookmark-enabled write — required when your transform ended in plain Spark
            DataFrame land.
          </p>
        </ContentStep>
        <Example title="Conversion snippet" caption="Conceptual PySpark in Glue">
{`# After ResolveChoice on messy JSON
clean_dyf = ResolveChoice.apply(raw_dyf, choice="make_cols")

# SQL transforms on strict schema
df = clean_dyf.toDF()
df.createOrReplaceTempView("orders")
deduped = spark.sql("""
  SELECT * FROM (
    SELECT *, ROW_NUMBER() OVER (PARTITION BY order_id ORDER BY event_ts DESC) rn
    FROM orders
  ) WHERE rn = 1
""")

# Back to DynamicFrame for Glue sink + bookmark
out_dyf = DynamicFrame.fromDF(deduped, glueContext, "curated_orders")`}
        </Example>
        <Callout variant="tip" title="When to skip DynamicFrame">
          If source is already curated Parquet with stable schema from a prior job stage, reading directly
          to DataFrame via Spark is fine — less conversion overhead mid-pipeline. DynamicFrame pays off most
          at bronze ingest boundaries.
        </Callout>
      </LessonSection>

      <LessonSection title="Practical decision guide">
        <ContentStep number={1} title="Start with DynamicFrame when">
          <p className="text-slate-300">
            Reading raw JSON/CSV from catalog or S3, schema may vary, nested fields need flattening, or you
            use bookmark-enabled Glue sources.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Use DataFrame when">
          <p className="text-slate-300">
            Schema is fixed, you need complex SQL joins across multiple temp views, or you are mid-pipeline
            on typed Parquet silver tables.
          </p>
        </ContentStep>
        <ContentStep number={3} title="End with DynamicFrame when">
          <p className="text-slate-300">
            Writing through Glue sink APIs with catalog and partition updates — convert back before{' '}
            <code className="text-core-400">write_dynamic_frame</code> unless using Spark write with separate
            crawler partition sync.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Common pitfalls">
        <ContentStep number={1} title="Forgetting to convert back">
          <p className="text-slate-300">
            DataFrame write to S3 works, but catalog partitions and bookmarks may not update — Athena shows
            stale or empty tables until crawler or manual DDL catches up.
          </p>
        </ContentStep>
        <ContentStep number={2} title="ResolveChoice too late">
          <p className="text-slate-300">
            Joining two unresolved DynamicFrames can produce ambiguous column types. Resolve schema before
            heavy joins and before casting for Redshift-compatible types.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Over-using DynamicFrame in silver/gold">
          <p className="text-slate-300">
            Curated layers should be strict Parquet — stay in DataFrame for performance once bronze messiness
            is handled upstream.
          </p>
        </ContentStep>
      </LessonSection>

      <KeyTakeaways
        items={[
          'DynamicFrame handles semi-structured, schema-varying lake ingest; DataFrame enforces one schema for strict Spark SQL transforms.',
          'Typical pattern: DynamicFrame read → ResolveChoice/Relationalize → toDF() for SQL → fromDF() for Glue catalog sink.',
          'Use DynamicFrame at bronze boundaries; prefer DataFrame mid-pipeline on stable Parquet; convert back for bookmark-aware writes.',
          'Glue-native I/O and nested JSON flattening are why DynamicFrame exists — not a replacement for Spark, but a ingest-friendly layer on top.',
        ]}
      />
    </LessonArticle>
  )
}
