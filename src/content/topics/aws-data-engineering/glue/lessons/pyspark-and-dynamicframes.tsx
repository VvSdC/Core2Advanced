import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function PysparkAndDynamicframes() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Glue runs PySpark — DynamicFrame is the Glue-native wrapper">
        AWS Glue Spark jobs execute <strong className="text-white">PySpark</strong> under the hood. Glue adds{' '}
        <strong className="text-white">DynamicFrame</strong> — a schema-flexible abstraction with built-in
        transforms for messy semi-structured data. Production jobs often mix DynamicFrame for ingest and
        DataFrame for typed Spark SQL — knowing both is core DE Glue literacy.
      </Callout>

      <Definition term="DynamicFrame">
        <p>
          A Glue collection of records where each record carries its own schema metadata — unlike a Spark
          DataFrame with a single rigid schema. DynamicFrames handle evolving JSON, optional fields, and mixed
          types via transforms like ResolveChoice before you commit to a fixed silver schema.
        </p>
      </Definition>

      <LessonSection title="PySpark in Glue">
        <ContentStep number={1} title="GlueContext and SparkSession">
          <p className="text-slate-300">
            Every Glue Spark script starts with{' '}
            <span className="font-mono text-sm">GlueContext</span> wrapping a{' '}
            <span className="font-mono text-sm">SparkContext</span>. Access Spark SQL via{' '}
            <span className="font-mono text-sm">glueContext.spark_session</span>. Use Spark for joins,
            window functions, and UDFs once schema is stable; use DynamicFrame readers for catalog and
            semi-structured sources.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Reading data">
          <p className="text-slate-300">
            <span className="font-mono text-sm">create_dynamic_frame.from_catalog</span> reads Glue catalog
            tables with partition pushdown.{' '}
            <span className="font-mono text-sm">from_options</span> reads S3 directly with connection type
            (parquet, csv, jdbc). Job bookmarks track incremental JDBC or S3 reads when enabled on the
            source node.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Writing data">
          <p className="text-slate-300">
            <span className="font-mono text-sm">write_dynamic_frame.from_options</span> with{' '}
            <span className="font-mono text-sm">partitionKeys</span> writes Hive-style folders and should
            pair with catalog updates. Prefer Snappy Parquet for curated zones — same format Athena and
            Redshift Spectrum expect downstream.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="DynamicFrame common operations (teaser)">
        <ContentStep number={1} title="Inspect schema">
          <p className="text-slate-300">
            <span className="font-mono text-sm">dyf.printSchema()</span> shows nested struct and choice types.
            <span className="font-mono text-sm">show()</span> samples rows. Always inspect raw landing DynamicFrames
            before ApplyMapping — crawler-inferred types often need correction.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Map and filter">
          <p className="text-slate-300">
            <span className="font-mono text-sm">Map</span> applies row-level functions;{' '}
            <span className="font-mono text-sm">Filter</span> drops rows by predicate. For complex SQL-like
            logic, convert to DataFrame and use{' '}
            <span className="font-mono text-sm">filter</span> /{' '}
            <span className="font-mono text-sm">where</span> — often clearer for team maintenance.
          </p>
        </ContentStep>
        <ContentStep number={3} title="ResolveChoice and relationalize">
          <p className="text-slate-300">
            Ambiguous columns (string and int in different files) appear as{' '}
            <strong className="text-white">choice</strong> types. ResolveChoice picks a canonical type or
            casts. Relationalize flattens nested arrays into linked tables — useful for exploding event
            payloads before silver normalization.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="DynamicFrame ↔ DataFrame conversion">
        <ContentStep number={1} title="To DataFrame">
          <p className="text-slate-300">
            <span className="font-mono text-sm">dyf.toDF()</span> produces a Spark DataFrame with a fixed
            schema. Do this after ResolveChoice and ApplyMapping when you need Spark SQL, typed aggregations,
            or broadcast joins with explicit control.
          </p>
        </ContentStep>
        <ContentStep number={2} title="From DataFrame">
          <p className="text-slate-300">
            <span className="font-mono text-sm">DynamicFrame.fromDF(df, glueContext, name)</span> wraps a
            DataFrame back for Glue-native sinks and catalog writes. Round-trip when mid-pipeline you need
            Spark optimizations then Glue partition writer.
          </p>
        </ContentStep>
        <ContentStep number={3} title="When to stay in each API">
          <p className="text-slate-300">
            Stay DynamicFrame for catalog I/O, bookmarks, and schema-evolving raw reads. Switch to DataFrame
            for multi-table joins,{' '}
            <span className="font-mono text-sm">groupBy</span>, window functions, and{' '}
            <span className="font-mono text-sm">spark.sql</span>. Many teams: DynamicFrame ingest → convert →
            Spark transform → convert → DynamicFrame write.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Toy example sketch">
        <Example title="Landing JSON → typed silver Parquet">
{`from awsglue.context import GlueContext
from awsglue.job import Job
from awsglue.utils import getResolvedOptions
from pyspark.context import SparkContext

sc = SparkContext()
glueContext = GlueContext(sc)
spark = glueContext.spark_session
job = Job(glueContext)
args = getResolvedOptions(sys.argv, ['JOB_NAME'])
job.init(args['JOB_NAME'], args)

# Read semi-structured landing data
raw = glueContext.create_dynamic_frame.from_catalog(
    database="lake_raw",
    table_name="events_json",
    transformation_ctx="raw_events",
)

# Resolve mixed types, map to silver schema (details in ApplyMapping lesson)
# cleaned = ApplyMapping(...)

# Spark SQL for aggregation
df = raw.toDF()
daily = df.groupBy("event_date", "event_type").count()

# Write curated Parquet with partitions
out = DynamicFrame.fromDF(daily, glueContext, "daily_counts")
glueContext.write_dynamic_frame.from_options(
    frame=out,
    connection_type="s3",
    connection_options={"path": "s3://lake/curated/event_daily/", "partitionKeys": ["event_date"]},
    format="parquet",
)

job.commit()`}
        </Example>
        <Callout variant="tip">
          Always pass <span className="font-mono text-sm">transformation_ctx</span> on read/write nodes when
          using job bookmarks — Glue uses the context string to persist incremental state per source/sink pair.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Glue Spark jobs are PySpark plus GlueContext — DynamicFrame for flexible schema, DataFrame for typed SQL.',
          'Read from catalog or S3 options; write Parquet with partitionKeys to curated prefixes.',
          'ResolveChoice handles schema drift; Relationalize flattens nested arrays for relational silver.',
          'Convert with toDF() for Spark joins/aggregations; fromDF() to write with Glue sinks and bookmarks.',
          'Typical pattern: DynamicFrame ingest → clean → DataFrame transform → DynamicFrame partitioned write.',
        ]}
      />
    </LessonArticle>
  )
}
