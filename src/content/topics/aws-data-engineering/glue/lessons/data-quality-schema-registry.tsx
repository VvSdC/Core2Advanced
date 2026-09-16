import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function DataQualitySchemaRegistry() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Trust curated data — enforce schema and quality in the pipeline">
        Landing zones accept messy data; silver and gold require{' '}
        <strong className="text-white">contracts</strong>. Glue Data Quality rules catch bad batches before
        BI consumes them. Glue Schema Registry governs Avro/JSON schema evolution for streaming and API
        feeds. Connections secure JDBC paths to RDS and Redshift — three pillars of governed lake ingest.
      </Callout>

      <Definition term="Glue Data Quality">
        <p>
          A rules engine that evaluates datasets against declarative checks — row counts, null rates, column
          ranges, referential patterns — and publishes results to CloudWatch and the Data Quality console.
          Integrates with Glue jobs and crawlers so quality gates run inside ETL, not as an afterthought.
        </p>
      </Definition>

      <LessonSection title="Glue Data Quality overview">
        <ContentStep number={1} title="Rule types">
          <p className="text-slate-300">
            Built-in analyzers detect schema drift, completeness, and uniqueness. Custom rules express SQL-like
            constraints:{' '}
            <span className="font-mono text-sm">ColumnValues &quot;order_id&quot; between 1 and 999999999</span>,
            or{' '}
            <span className="font-mono text-sm">CustomSql &quot;SELECT COUNT(*) FROM primary WHERE x IS NULL&quot; = 0</span>.
            Fail fast on landing before silver DPU spend.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Where to run checks">
          <p className="text-slate-300">
            Attach recommendations to crawlers for profiling raw data. Embed{' '}
            <span className="font-mono text-sm">EvaluateDataQuality</span> transform in Glue ETL — branch to
            quarantine prefix on failure. Pair with SNS/EventBridge for pager duty when SLA-critical tables
            breach thresholds.
          </p>
        </ContentStep>
        <ContentStep number={3} title="DE workflow">
          <p className="text-slate-300">
            Define rules per table tier: bronze (looser completeness), silver (strict types and keys), gold
            (aggregate reconciliation vs source). Store rule sets in IaC. Interview talking point: quality is
            not one SQL COUNT — it is layered contracts aligned to medallion stage.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Glue Schema Registry overview">
        <Definition term="Schema Registry">
          <p>
            Central repository for Avro, JSON, and Protobuf schemas with versioning and compatibility modes
            (backward, forward, full). Producers register schemas; consumers (Glue streaming jobs, Kafka
            consumers, Lambda) fetch compatible versions — prevents silent field drops breaking downstream
            parsers.
          </p>
        </Definition>
        <ContentStep number={1} title="Compatibility modes">
          <p className="text-slate-300">
            <strong className="text-white">Backward</strong> — new schema readable by old consumers (add
            optional fields). <strong className="text-white">Forward</strong> — old data readable by new
            consumers. Lake DE teams default backward for append-only event streams where Spark jobs lag
            producer deploys.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Integration with Glue streaming">
          <p className="text-slate-300">
            Glue streaming jobs can deserialize Kinesis/Kafka records against registry schemas — typed
            DynamicFrames without brittle JSON inference. Pair with Delta/Iceberg or Parquet sinks for curated
            stream-batch unity.
          </p>
        </ContentStep>
        <ContentStep number={3} title="vs crawler inference">
          <p className="text-slate-300">
            Crawlers infer after the fact; registry enforces before write. Use registry when producers own
            schema contracts (product analytics events). Use crawlers when vendors dump ad hoc CSV without
            schema docs.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Connections (JDBC) overview">
        <ContentStep number={1} title="What a connection stores">
          <p className="text-slate-300">
            JDBC URL, VPC subnet, security groups, and optional Secrets Manager credential reference. Jobs and
            crawlers attach connections to reach private RDS/Redshift — no hardcoded passwords in scripts.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Extract patterns">
          <p className="text-slate-300">
            Full JDBC read for small dims; bookmarked incremental on monotonic key or timestamp; parallel
            read with hash partition column for large tables. Redshift UNLOAD to S3 often beats JDBC pull for
            bulk history — Glue orchestrates UNLOAD via Lambda or reads S3 result.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Network prerequisites">
          <p className="text-slate-300">
            Glue job must run in VPC with route to database security group ingress. Cold start adds ENI
            provisioning latency. Deep networking belongs in the VPC topic — here, remember: no connection
            without correct subnet + SG + IAM trifecta.
          </p>
        </ContentStep>
        <Example title="Quality gate sketch — silver orders">
{`Ruleset: orders_silver_v1
- RowCount > 0
- Completeness "order_id" = 1.0
- Uniqueness "order_id" = 1.0
- ColumnValues "amount" >= 0

On failure → write to s3://lake/quarantine/orders/run_date=...
             → fail job → workflow stops before gold`}
        </Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Glue Data Quality: declarative rules in ETL/crawlers — fail bad batches before silver/gold promotion.',
          'Schema Registry: versioned Avro/JSON contracts with compatibility modes for streaming ingest.',
          'Connections: VPC + JDBC + Secrets Manager for RDS/Redshift extract — no plaintext creds in scripts.',
          'Layer quality strictness by medallion tier; registry for producer-owned schemas, crawlers for ad hoc files.',
          'Quality failures should quarantine data and block workflow downstream — not just log and continue.',
        ]}
      />
    </LessonArticle>
  )
}
