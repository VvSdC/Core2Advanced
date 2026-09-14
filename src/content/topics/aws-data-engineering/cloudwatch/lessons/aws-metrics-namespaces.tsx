import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function AwsMetricsNamespaces() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Every AWS service speaks metrics — learn the namespaces DE uses daily">
        CloudWatch organizes metrics into <strong className="text-white">namespaces</strong>. When you open
        the console or write an alarm, you pick{' '}
        <span className="font-mono text-sm">AWS/Lambda</span> not &quot;Lambda.&quot; Data engineers who
        know the common DE namespaces — and their dimensions — build dashboards and alarms without guessing
        metric names during a 2 AM incident.
      </Callout>

      <Definition term="Metric namespace">
        <p>
          A <strong className="text-white">namespace</strong> is a container for metric names published by
          AWS or your application. Format is typically <span className="font-mono text-sm">AWS/ServiceName</span>{' '}
          for platform metrics or a custom path like{' '}
          <span className="font-mono text-sm">DataPlatform/Ingest</span>. Within a namespace,{' '}
          <strong className="text-white">dimensions</strong> identify the specific resource (FunctionName,
          BucketName, JobName).
        </p>
      </Definition>

      <LessonSection title="Common AWS namespaces for data engineering">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Namespace</th>
                <th className="px-4 py-3">Key metrics</th>
                <th className="px-4 py-3">DE signal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                [
                  'AWS/Lambda',
                  'Invocations, Errors, Duration, Throttles, ConcurrentExecutions, IteratorAge',
                  'Ingest handler health, Kinesis/SQS lag, concurrency saturation',
                ],
                [
                  'AWS/S3',
                  'NumberOfObjects, BucketSizeBytes, AllRequests, 4xxErrors, 5xxErrors',
                  'Lake growth, request errors on landing bucket (Storage Lens adds more)',
                ],
                [
                  'AWS/Glue',
                  'glue.driver.aggregate.numCompletedTasks, glue.ALL.s3.filesystem/read_bytes (job logs/metrics)',
                  'Spark progress; prefer job run status + custom duration metrics for alarms',
                ],
                [
                  'AWS/SQS',
                  'ApproximateNumberOfMessagesVisible, ApproximateAgeOfOldestMessage, NumberOfMessagesDeleted',
                  'Ingest queue backlog, DLQ depth, consumer keep-up',
                ],
                [
                  'AWS/States',
                  'ExecutionsFailed, ExecutionsTimedOut, ExecutionTime',
                  'Step Functions orchestration failures across Glue/Lambda chain',
                ],
                [
                  'AWS/Kinesis',
                  'IncomingRecords, IteratorAgeMilliseconds, ReadProvisionedThroughputExceeded',
                  'Streaming ingest lag, shard capacity',
                ],
                [
                  'AWS/Events',
                  'Invocations, FailedInvocations, TriggeredRules',
                  'EventBridge rule delivery to Lambda/SQS targets',
                ],
                [
                  'AWS/EC2',
                  'CPUUtilization, StatusCheckFailed, NetworkIn/Out',
                  'Self-managed ETL workers; pair with Agent for mem/disk',
                ],
                [
                  'AWS/Redshift',
                  'CPUUtilization, DatabaseConnections, HealthStatus',
                  'Warehouse load during COPY from curated S3',
                ],
              ].map(([ns, metrics, signal]) => (
                <tr key={ns} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-mono text-xs">{ns}</td>
                  <td className="px-4 py-3">{metrics}</td>
                  <td className="px-4 py-3">{signal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip">
          Glue operational alarms often combine EventBridge{' '}
          <span className="font-mono text-sm">Glue Job State Change</span> events with custom{' '}
          <span className="font-mono text-sm">GlueJobDurationMs</span> — native Glue CloudWatch metrics
          vary by job type; know your job&apos;s emitted set in the console first.
        </Callout>
      </LessonSection>

      <LessonSection title="Dimensions practice">
        <ContentStep number={1} title="Lambda dimensions">
          <p className="text-slate-300">
            Primary dimension: <span className="font-mono text-sm">FunctionName</span>. Resource-specific
            metrics add <span className="font-mono text-sm">Resource</span> (e.g. unreserved concurrency).
            Alarm per function — <span className="font-mono text-sm">ingest-handler-prod</span> — not account-wide
            aggregate unless you use SEARCH expressions in metric math.
          </p>
        </ContentStep>
        <ContentStep number={2} title="S3 dimensions">
          <p className="text-slate-300">
            <span className="font-mono text-sm">BucketName</span>,{' '}
            <span className="font-mono text-sm">StorageType</span> for size metrics. Request metrics need
            request metrics enabled on the bucket (cost). Filter alarms to landing vs curated buckets
            separately — different SLAs and traffic patterns.
          </p>
        </ContentStep>
        <ContentStep number={3} title="SQS dimensions">
          <p className="text-slate-300">
            <span className="font-mono text-sm">QueueName</span> — distinguish primary ingest queue from{' '}
            <span className="font-mono text-sm">ingest-dlq</span>. Alarm DLQ on{' '}
            <span className="font-mono text-sm">ApproximateNumberOfMessagesVisible &gt; 0</span>; alarm
            primary on oldest message age for consumer lag.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Metric math across dimensions">
          <p className="text-slate-300">
            CloudWatch metric math can compute error rate:{' '}
            <span className="font-mono text-sm">m1/m2*100</span> where m1 is Errors and m2 is Invocations
            for the same FunctionName dimension. Use consistent period (60s) across operands.
          </p>
        </ContentStep>
        <Flowchart
          title="Namespace → dimension → alarm on ingest path"
          chart={`flowchart TB
  NS1[AWS/Lambda FunctionName ingest-handler]
  NS2[AWS/SQS QueueName ingest-queue]
  NS3[AWS/SQS QueueName ingest-dlq]
  NS4[Custom DataPlatform/Ingest Vendor]
  NS1 --> D1[Errors Duration Throttles]
  NS2 --> D2[OldestMessageAge Visible]
  NS3 --> D3[DLQ depth alarm]
  NS4 --> D4[IngestLagMinutes SLA]
  D1 --> DASH[Pipeline dashboard]
  D2 --> DASH
  D3 --> DASH
  D4 --> DASH`}
        />
      </LessonSection>

      <LessonSection title="Console navigation and SEARCH">
        <ContentStep number={1} title="Browse metrics">
          <p className="text-slate-300">
            CloudWatch → Metrics → All metrics → select namespace → filter by dimension value. Pin frequently
            used series to a dashboard. Use the same dimension values in IaC (CloudFormation/Terraform) as
            in the console to avoid alarm drift.
          </p>
        </ContentStep>
        <ContentStep number={2} title="SEARCH for fleet views">
          <p className="text-slate-300">
            Metric math SEARCH expression aggregates all functions matching a prefix — useful for staging
            account overviews. Production critical alarms should still target explicit resource dimensions
            so one new experimental function does not skew fleet error rates unnoticed.
          </p>
        </ContentStep>
      </LessonSection>

      <KeyTakeaways
        items={[
          'AWS namespaces follow AWS/ServiceName — Lambda, S3, SQS, States, Kinesis, Events are core DE observability.',
          'Dimensions identify resources: FunctionName, BucketName, QueueName — alarm per prod resource not whole account.',
          'Lambda: Errors, Duration, Throttles, IteratorAge; SQS: visible count and oldest message age; DLQ separate queue.',
          'Glue: combine EventBridge job state with custom duration metrics; native Glue metrics vary by job.',
          'Use metric math for error rates; SEARCH for fleet views but pin explicit dimensions for prod alarms.',
        ]}
      />
    </LessonArticle>
  )
}
