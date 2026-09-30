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

export function OrchestratingGlueAthenaRedshift() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="One state machine, the whole nightly lake run">
        This lesson assembles everything so far into de-orders-nightly-sfn-prod: transform with Glue, refresh
        the catalog with a crawler, prove the data is sane with Athena, load the warehouse with the Redshift
        Data API, and tell the team how it went. Each service needs a slightly different integration pattern —
        knowing which is the real skill.
      </Callout>

      <Definition term="Lake pipeline orchestration">
        <p>
          A Standard workflow that sequences services with the right wait strategy: .sync where AWS provides
          it (Glue jobs, Athena queries), an SDK call plus a Wait → describe → Choice poll loop where it does
          not (Glue crawlers, Redshift Data API), and a Catch on every stage that routes to one SNS alert and a
          Fail state.
        </p>
      </Definition>

      <LessonSection title="Pipeline shape">
        <Flowchart
          title="de-orders-nightly-sfn-prod"
          chart={`flowchart TB
  G[Glue orders-silver-etl sync]
  CR[StartCrawler SDK]
  W1[Wait 60s]
  GC[GetCrawler]
  CC{Crawler READY}
  AQ[Athena DQ query sync]
  AR[GetQueryResults]
  RC{Row count above 0}
  RS[Redshift ExecuteStatement]
  W2[Wait 30s]
  DS[DescribeStatement]
  SC{Statement FINISHED}
  OK[SNS success]
  FAIL[SNS alert then Fail]
  G --> CR --> W1 --> GC --> CC
  CC -->|RUNNING or STOPPING| W1
  CC -->|READY| AQ --> AR --> RC
  RC -->|no| FAIL
  RC -->|yes| RS --> W2 --> DS --> SC
  SC -->|SUBMITTED PICKED STARTED| W2
  SC -->|FINISHED| OK
  SC -->|FAILED or ABORTED| FAIL`}
        />
        <ContentStep number={1} title="Glue job — .sync">
          <p className="text-slate-300">
            <span className="font-mono text-sm">glue:startJobRun.sync</span> runs orders-silver-etl for{' '}
            <code className="text-core-400">$.run_date</code> and holds until SUCCEEDED or FAILED. Retry
            throttling, catch everything else.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Crawler — SDK call plus poll loop">
          <p className="text-slate-300">
            Crawlers have no .sync. <span className="font-mono text-sm">aws-sdk:glue:startCrawler</span> returns
            immediately; loop Wait → <span className="font-mono text-sm">aws-sdk:glue:getCrawler</span> → Choice
            on <code className="text-core-400">Crawler.State</code> until READY, then check{' '}
            <code className="text-core-400">Crawler.LastCrawl.Status</code>. Retry{' '}
            <span className="font-mono text-sm">Glue.CrawlerRunningException</span> if a previous crawl is still
            going. If partitions are predictable, partition projection or an Athena{' '}
            <span className="font-mono text-sm">ALTER TABLE ADD PARTITION</span> can replace the crawler.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Athena data-quality gate">
          <p className="text-slate-300">
            <span className="font-mono text-sm">athena:startQueryExecution.sync</span> runs a count or null-check
            query; <span className="font-mono text-sm">athena:getQueryResults</span> fetches the single row.
            Values come back as strings, so <span className="font-mono text-sm">States.StringToJson</span>{' '}
            converts &quot;15230&quot; to a number the Choice state can compare.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Redshift Data API load">
          <p className="text-slate-300">
            <span className="font-mono text-sm">aws-sdk:redshiftdata:executeStatement</span> submits SQL — a{' '}
            <span className="font-mono text-sm">COPY</span> from the gold prefix or a stored procedure that
            deletes the partition then copies it (idempotent reruns). It returns an Id immediately; poll{' '}
            <span className="font-mono text-sm">describeStatement</span> until Status is FINISHED, FAILED, or
            ABORTED. Authenticate with a Serverless workgroup and IAM, or a <span className="font-mono text-sm">SecretArn</span>{' '}
            from Secrets Manager — never a password in ASL.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Full ASL">
        <Example title="de-orders-nightly-sfn-prod (abridged Retry and Catch)" caption="Add the same Catch to every Task; shown on the first only">
{`{
  "Comment": "Nightly orders lake pipeline",
  "StartAt": "RunSilverJob",
  "States": {
    "RunSilverJob": {
      "Type": "Task", "Resource": "arn:aws:states:::glue:startJobRun.sync",
      "Parameters": { "JobName": "orders-silver-etl", "Arguments": { "--run_date.$": "$.run_date" } },
      "ResultSelector": { "run_id.$": "$.Id" }, "ResultPath": "$.glue", "TimeoutSeconds": 7200,
      "Retry": [{ "ErrorEquals": ["Glue.ConcurrentRunsExceededException"], "IntervalSeconds": 60,
                  "BackoffRate": 2, "MaxAttempts": 4, "JitterStrategy": "FULL" }],
      "Catch": [{ "ErrorEquals": ["States.ALL"], "ResultPath": "$.error", "Next": "NotifyFailure" }],
      "Next": "StartCrawler"
    },
    "StartCrawler": {
      "Type": "Task", "Resource": "arn:aws:states:::aws-sdk:glue:startCrawler",
      "Parameters": { "Name": "orders-silver-crawler" }, "ResultPath": null,
      "Retry": [{ "ErrorEquals": ["Glue.CrawlerRunningException"], "IntervalSeconds": 60, "MaxAttempts": 10 }],
      "Next": "WaitCrawler"
    },
    "WaitCrawler": { "Type": "Wait", "Seconds": 60, "Next": "GetCrawler" },
    "GetCrawler": {
      "Type": "Task", "Resource": "arn:aws:states:::aws-sdk:glue:getCrawler",
      "Parameters": { "Name": "orders-silver-crawler" },
      "ResultSelector": { "state.$": "$.Crawler.State", "last.$": "$.Crawler.LastCrawl.Status" },
      "ResultPath": "$.crawler", "Next": "CrawlerDone"
    },
    "CrawlerDone": {
      "Type": "Choice",
      "Choices": [
        { "And": [{ "Variable": "$.crawler.state", "StringEquals": "READY" },
                  { "Variable": "$.crawler.last", "StringEquals": "SUCCEEDED" }], "Next": "RunDqQuery" },
        { "Variable": "$.crawler.state", "StringEquals": "READY", "Next": "NotifyFailure" }
      ],
      "Default": "WaitCrawler"
    },
    "RunDqQuery": {
      "Type": "Task", "Resource": "arn:aws:states:::athena:startQueryExecution.sync",
      "Parameters": {
        "QueryString.$": "States.Format('SELECT count(*) FROM silver.orders WHERE dt = \\'{}\\' AND order_id IS NOT NULL', $.run_date)",
        "WorkGroup": "de-prod",
        "ResultConfiguration": { "OutputLocation": "s3://acme-lake-prod/athena-results/" }
      },
      "ResultSelector": { "id.$": "$.QueryExecution.QueryExecutionId" }, "ResultPath": "$.dq",
      "Next": "GetDqResult"
    },
    "GetDqResult": {
      "Type": "Task", "Resource": "arn:aws:states:::athena:getQueryResults",
      "Parameters": { "QueryExecutionId.$": "$.dq.id", "MaxResults": 2 },
      "ResultSelector": { "rows.$": "States.StringToJson($.ResultSet.Rows[1].Data[0].VarCharValue)" },
      "ResultPath": "$.dq.result", "Next": "RowCountOk"
    },
    "RowCountOk": {
      "Type": "Choice",
      "Choices": [{ "Variable": "$.dq.result.rows", "NumericGreaterThan": 0, "Next": "LoadRedshift" }],
      "Default": "NotifyFailure"
    },
    "LoadRedshift": {
      "Type": "Task", "Resource": "arn:aws:states:::aws-sdk:redshiftdata:executeStatement",
      "Parameters": {
        "WorkgroupName": "acme-analytics-wg", "Database": "analytics",
        "Sql.$": "States.Format('CALL etl.load_orders_gold(\\'{}\\')', $.run_date)"
      },
      "ResultSelector": { "id.$": "$.Id" }, "ResultPath": "$.rs", "Next": "WaitRedshift"
    },
    "WaitRedshift": { "Type": "Wait", "Seconds": 30, "Next": "DescribeLoad" },
    "DescribeLoad": {
      "Type": "Task", "Resource": "arn:aws:states:::aws-sdk:redshiftdata:describeStatement",
      "Parameters": { "Id.$": "$.rs.id" },
      "ResultSelector": { "status.$": "$.Status" }, "ResultPath": "$.rs.check", "Next": "LoadDone"
    },
    "LoadDone": {
      "Type": "Choice",
      "Choices": [
        { "Variable": "$.rs.check.status", "StringEquals": "FINISHED", "Next": "NotifySuccess" },
        { "Or": [{ "Variable": "$.rs.check.status", "StringEquals": "FAILED" },
                 { "Variable": "$.rs.check.status", "StringEquals": "ABORTED" }], "Next": "NotifyFailure" }
      ],
      "Default": "WaitRedshift"
    },
    "NotifySuccess": {
      "Type": "Task", "Resource": "arn:aws:states:::sns:publish",
      "Parameters": { "TopicArn": "arn:aws:sns:us-east-1:111122223333:de-alerts-prod",
                      "Message.$": "States.Format('orders {} loaded', $.run_date)" }, "End": true
    },
    "NotifyFailure": {
      "Type": "Task", "Resource": "arn:aws:states:::sns:publish",
      "Parameters": { "TopicArn": "arn:aws:sns:us-east-1:111122223333:de-alerts-prod",
                      "Message.$": "States.Format('orders {} FAILED', $.run_date)" }, "Next": "Failed"
    },
    "Failed": { "Type": "Fail", "Error": "PipelineFailed" }
  }
}`}
        </Example>
        <Callout variant="info">
          Athena result row 0 is the header, so the count lives at{' '}
          <code className="text-core-400">Rows[1].Data[0].VarCharValue</code>. Keep QA queries to a single
          aggregated row — GetQueryResults output counts toward the 256 KB payload limit.
        </Callout>
      </LessonSection>

      <LessonSection title="Production hardening">
        <ContentStep number={1} title="IAM for the execution role">
          <p className="text-slate-300">
            glue:StartJobRun, GetJobRun, GetJobRuns, BatchStopJobRun on the job; glue:StartCrawler and
            GetCrawler on the crawler; athena:StartQueryExecution, GetQueryExecution, GetQueryResults plus S3 on
            the results prefix and Glue Catalog read; redshift-data:ExecuteStatement and DescribeStatement plus{' '}
            <span className="font-mono text-sm">redshift-serverless:GetCredentials</span>; sns:Publish on
            de-alerts-prod.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Bound every poll loop">
          <p className="text-slate-300">
            A stuck crawler or long-running statement can loop until the 25,000-event history limit. Set
            TimeoutSeconds on the execution or track an attempt counter with{' '}
            <span className="font-mono text-sm">States.MathAdd</span> and exit after N polls.
          </p>
        </ContentStep>
        <Callout variant="tip">
          Redshift also supports <span className="font-mono text-sm">BatchExecuteStatement</span> — a DELETE for
          the partition and a COPY in one transaction — when you prefer SQL in the workflow over a stored
          procedure.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Glue jobs and Athena queries use .sync; crawlers and Redshift Data API need SDK calls plus Wait-describe-Choice loops.',
          'Check crawler State READY and LastCrawl.Status SUCCEEDED before querying new partitions.',
          'Athena GetQueryResults returns strings — States.StringToJson turns a count into a number for Choice.',
          'Redshift loads should be idempotent (delete-then-COPY or MERGE) and authenticate via IAM or SecretArn.',
          'Every stage catches into one SNS alert and a Fail state; bound every poll loop.',
        ]}
      />
    </LessonArticle>
  )
}
