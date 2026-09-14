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

export function AthenaWithLambdaAndGlue() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Athena rarely runs alone in production pipelines">
        Glue builds and catalogs curated Parquet; Athena validates, explores, and materializes subsets.
        Lambda orchestrates lightweight checks after ingest — start query, poll status, branch on row count.
        Together they form the <strong className="text-white">serverless query layer</strong> of the lake.
      </Callout>

      <Definition term="Athena + Lambda pattern">
        <p>
          Lambda calls <span className="font-mono text-sm">athena:StartQueryExecution</span> with partition-scoped
          SQL, polls <span className="font-mono text-sm">GetQueryExecution</span>, reads CSV results from the
          workgroup output prefix in S3. Fits post-ETL validation, SLA checks, and triggering alerts — not
          multi-TB transforms (use Glue Spark instead).
        </p>
      </Definition>

      <LessonSection title="Athena + Lambda patterns">
        <ContentStep number={1} title="Post-ingest validation">
          <p className="text-slate-300">
            S3 event → Lambda runs{' '}
            <span className="font-mono text-sm">SELECT COUNT(*), COUNT(DISTINCT pk) … WHERE year=? AND month=?</span>.
            Compare to expected thresholds; on failure publish to SNS and quarantine prefix. Keep queries
            partition-bound — sub-second to few-minute runtime.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Step Functions + Athena integration">
          <p className="text-slate-300">
            Step Functions native Athena integration starts query and waits for completion without Lambda
            polling loops. Chain: Glue job success → Athena row count check → SNS success → trigger downstream
            COPY. Cleaner than sleep loops in Lambda for long-running checks.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Result handling in Lambda">
          <p className="text-slate-300">
            Parse small result CSV from{' '}
            <span className="font-mono text-sm">s3://lake/athena-results/pipeline/query-id.csv</span> with boto3.
            For large outputs use UNLOAD to Parquet prefix and let Glue consume — do not load millions of rows
            into Lambda memory.
          </p>
        </ContentStep>
        <Example title="boto3 StartQueryExecution sketch">
{`resp = athena.start_query_execution(
    QueryString=sql,
    QueryExecutionContext={'Database': 'curated'},
    WorkGroup='wg-de-pipeline',
    ResultConfiguration={
        'OutputLocation': 's3://my-lake/athena-results/pipeline/'
    },
)
qid = resp['QueryExecutionId']`}
        </Example>
      </LessonSection>

      <LessonSection title="Athena + Glue patterns">
        <ContentStep number={1} title="Glue writes, Athena reads">
          <p className="text-slate-300">
            Glue ETL outputs Snappy Parquet with{' '}
            <span className="font-mono text-sm">partitionBy('year','month')</span> and updates catalog. Athena
            is the first consumer for QA and ad hoc — same metadata, no duplicate registration. Glue bookmarks
            align incremental paths with Athena partition filters.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Crawler → Athena exploration">
          <p className="text-slate-300">
            New raw prefix → scheduled crawler registers schema → DE explores with Athena before committing
            Glue ETL logic. Crawler-inferred types may need DDL fixes — Athena is the feedback loop for schema
            design.
          </p>
        </ContentStep>
        <ContentStep number={3} title="When to choose Glue over Athena CTAS">
          <p className="text-slate-300">
            TB-scale transforms, complex joins, UDF-heavy cleansing → Glue Spark. GB-scale promotion, one-off
            Parquet convert, analyst-driven materialization → Athena CTAS. Cost: Glue DPU-hours vs Athena scan
            — profile both for your data volume.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Glue job triggered after Athena check">
          <p className="text-slate-300">
            Lambda Athena validation passes → <span className="font-mono text-sm">glue:StartJobRun</span> for
            curated build. Prevents Spark job from processing corrupt landing batch — fail fast at SQL layer
            before DPU spend.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Integrated pipeline flowchart">
        <Flowchart
          title="Glue catalog + Athena validation + Lambda orchestration"
          chart={`flowchart TB
  LAND[S3 landing new batch]
  LAM1[Lambda on S3 event]
  ATHCHK[Athena partition-scoped QA SQL]
  RES[S3 athena-results CSV]
  DEC{Pass validation?}
  GLUE[Glue Spark ETL]
  CUR[S3 curated Parquet]
  CAT[Glue Data Catalog]
  LAM2[Lambda notify Step Functions]
  ATHADH[Athena ad hoc BI]
  LAND --> LAM1
  LAM1 --> ATHCHK
  ATHCHK --> RES
  ATHCHK --> DEC
  DEC -->|yes| GLUE
  DEC -->|no| QUAR[S3 quarantine + SNS alert]
  GLUE --> CUR
  GLUE --> CAT
  CUR --> CAT
  CAT --> ATHADH
  GLUE --> LAM2`}
        />
        <Callout variant="tip">
          Single IAM role per concern: Lambda validator needs Athena + result S3 read + SNS; Glue job role needs
          raw read + curated write + catalog — avoid one super-role for all pipeline steps.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Lambda + Athena: StartQueryExecution for partition-scoped QA after ingest — poll or use Step Functions wait.',
          'Keep Lambda result sets small; use UNLOAD for large exports — parse CSV from workgroup output prefix.',
          'Glue ETL writes curated Parquet + catalog; Athena validates and explores before and after Spark jobs.',
          'Choose Glue Spark for TB/complex transform; Athena CTAS for GB-scale materialization and conversions.',
          'Fail fast: Athena SQL checks on landing before expensive Glue DPU runs on bad batches.',
        ]}
      />
    </LessonArticle>
  )
}
