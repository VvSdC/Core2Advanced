import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function PuttingItTogetherCloudwatch() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Observability closes the loop on everything you built">
        Lambda handlers, Glue jobs, SQS buffers, and Step Functions orchestration only matter in production
        if you can detect failure, find root cause, and alert the right team. CloudWatch — metrics, logs,
        alarms, Insights, integrations — is the ops layer that makes your lake pipeline{' '}
        <strong className="text-white">operable</strong>. This checkpoint ties intermediate and advanced
        CloudWatch lessons before SNS fan-out and deeper service topics.
      </Callout>

      <Definition term="CloudWatch mental model for data engineering">
        <p>
          CloudWatch is your <strong className="text-white">unified observability plane</strong>: native AWS
          metrics in service namespaces, custom business metrics via PutMetricData, centralized logs with
          Insights queries, alarms with correct evaluation semantics, agent-based OS metrics on EC2 fleets,
          and integrations that turn ALARM state into human and automated response across the ingest →
          transform → serve chain.
        </p>
      </Definition>

      <LessonSection title="CloudWatch sub-topic map">
        <Flowchart
          title="CloudWatch lesson map — intermediate through advanced"
          chart={`flowchart TB
  START[CloudWatch complete path]
  START --> NS[AWS metrics namespaces dimensions]
  START --> INS[Logs Insights queries]
  START --> CUST[Custom metrics PutMetricData]
  START --> ALM[Alarms deep dive states]
  START --> AGENT[CloudWatch Agent EC2]
  START --> MF[Metric filters composite anomaly]
  START --> EBNAME[EventBridge vs CW Events naming]
  START --> INT[Integrations SNS Lambda EB]
  START --> ETLMON[ETL pipeline monitoring]
  START --> TRIAGE[Troubleshooting failed pipelines]
  NS --> SNSNEXT
  INS --> SNSNEXT
  CUST --> SNSNEXT
  ALM --> SNSNEXT
  AGENT --> SNSNEXT
  MF --> SNSNEXT
  EBNAME --> SNSNEXT
  INT --> SNSNEXT
  ETLMON --> SNSNEXT
  TRIAGE --> SNSNEXT
  SNSNEXT[SNS — alerting fan-out next]`}
        />
      </LessonSection>

      <LessonSection title="Full CloudWatch checkpoint — can you explain…">
        <ContentStep number={1} title="Metrics and namespaces">
          <p className="text-slate-300">
            Which namespace for Lambda Errors vs custom RowsIngested? How do FunctionName and QueueName
            dimensions affect alarms? When do you use metric math error rate vs absolute Errors?
          </p>
        </ContentStep>
        <ContentStep number={2} title="Logs and Insights">
          <p className="text-slate-300">
            How do you find the top failing S3 keys in an ingest Lambda log group in under two minutes?
            Where do Glue driver stack traces live? Why structured JSON beats plain text for Insights?
          </p>
        </ContentStep>
        <ContentStep number={3} title="Alarms">
          <p className="text-slate-300">
            Difference between OK, ALARM, and INSUFFICIENT_DATA? When should missing data treat as breaching
            for a nightly Glue heartbeat? What does 2-of-3 evaluation periods buy you on noisy Lambda metrics?
          </p>
        </ContentStep>
        <ContentStep number={4} title="Advanced signals">
          <p className="text-slate-300">
            When install CloudWatch Agent on EC2 vs rely on Lambda/Glue native logging? How metric filters
            turn ERROR logs into alarmable metrics? Composite AND vs OR for pipeline paging?
          </p>
        </ContentStep>
        <ContentStep number={5} title="Operations">
          <p className="text-slate-300">
            Walk the troubleshooting runbook from SNS page to DLQ replay. What belongs on row 1 of a lake
            pipeline dashboard? How EventBridge naming relates to CloudWatch Events legacy docs?
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Interview-style quick checks">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Question</th>
                <th className="px-4 py-3">Strong answer sketch</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                [
                  'Lambda vs custom metrics?',
                  'AWS/Lambda publishes Duration Errors automatically; PutMetricData for RowsIngested IngestLag business signals.',
                ],
                [
                  'INSUFFICIENT_DATA on daily job?',
                  'Often no datapoint — configure treat missing as breaching or use explicit heartbeat metric after job success.',
                ],
                [
                  'Logs Insights vs opening log stream?',
                  'Insights aggregates across streams/time with stats — faster for error counts and top keys at scale.',
                ],
                [
                  'Metric filter vs PutMetricData?',
                  'Filter derives metric from existing log patterns without code change; PutMetricData from app logic at emit time.',
                ],
                [
                  'CloudWatch Events vs EventBridge?',
                  'Same default bus — EventBridge is current name plus custom buses Scheduler schemas.',
                ],
                [
                  'Alarm → SNS vs Lambda action?',
                  'SNS for human fan-out; Lambda for enrichment guarded replay — often both on same alarm.',
                ],
                [
                  'What to alarm on DLQ?',
                  'ApproximateNumberOfMessagesVisible > 0 — any poison message needs triage before silent loss.',
                ],
                [
                  'EC2 ETL missing memory metric?',
                  'Default EC2 metrics lack mem/disk — install CloudWatch Agent with SSM-managed config.',
                ],
              ].map(([question, answer]) => (
                <tr key={question} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{question}</td>
                  <td className="px-4 py-3">{answer}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip" title="Ready for SNS when…">
          You can whiteboard a pipeline dashboard with ingest lag, Lambda error rate, Glue failure, DLQ depth,
          and freshness SLA — and explain which alarm actions hit SNS vs remediation Lambda without opening
          the console.
        </Callout>
      </LessonSection>

      <LessonSection title="What comes next — SNS">
        <p className="text-slate-300">
          CloudWatch Alarms produce signal; <strong className="text-white">Amazon SNS</strong> delivers it —
          topics, subscriptions, fan-out to Slack, PagerDuty, email, and SQS audit queues. You configured
          alarm → SNS in integrations; the SNS sub-topic goes deeper on pub/sub patterns, message filtering,
          and multi-team alerting architecture for data platforms.
        </p>
        <Flowchart
          title="After CloudWatch — course thread"
          chart={`flowchart LR
  LAM[Lambda compute]
  CW[CloudWatch checkpoint]
  SNS[SNS notifications fan-out]
  GLUE[Glue ETL deep dive]
  ATH[Athena SQL on lake]
  LAM --> CW
  CW --> SNS
  SNS --> GLUE
  GLUE --> ATH`}
        />
        <Callout variant="insight">
          Revisit this checkpoint when tuning alarm noise, onboarding a new vendor ingest path, or designing
          a postmortem — the answers usually trace to dimensions, missing-data treatment, or missing custom
          lag metrics covered in these lessons.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'CloudWatch DE stack: namespaces + custom metrics, Logs Insights, alarms with correct states, agent on EC2.',
          'Pipeline monitor: ingest lag, Lambda/Glue failures, durations, DLQ depth, freshness SLA on one dashboard.',
          'Triage runbook: alarm → metrics → logs → Insights → root cause → fix/retry — classify Lambda/Glue/S3 patterns.',
          'Advanced: metric filters, composite alarms, anomaly bands; EventBridge is renamed CloudWatch Events.',
          'Next sub-topic: SNS — pub/sub fan-out from CloudWatch alarms to on-call and automation.',
        ]}
      />
    </LessonArticle>
  )
}
