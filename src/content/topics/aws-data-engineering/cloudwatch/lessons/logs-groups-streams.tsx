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

export function LogsGroupsStreams() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Logs are your pipeline diary">
        Metrics tell you <em>how many</em> errors occurred. Logs tell you <em>why</em> — the stack trace,
        the bad S3 key, the row count you logged before timeout. CloudWatch Logs stores these lines in a
        hierarchy: <strong className="text-white">log group</strong> →{' '}
        <strong className="text-white">log stream</strong> → individual log events. Every Lambda function
        you deploy gets a log group automatically.
      </Callout>

      <Definition term="CloudWatch Logs">
        <p>
          <strong className="text-white">CloudWatch Logs</strong> is a durable store for log text from AWS
          services and applications. A <strong className="text-white">log group</strong> is the top-level
          bucket (named by source). A <strong className="text-white">log stream</strong> is a sequence of
          events within that group — often one stream per Lambda execution environment. Each{' '}
          <strong className="text-white">log event</strong> is one line (or multiline block) with a
          timestamp and message body.
        </p>
      </Definition>

      <LessonSection title="Log groups — the container">
        <ContentStep number={1} title="Naming convention">
          <p className="text-slate-300">
            AWS services use predictable names. Lambda:{' '}
            <code className="text-core-400">/aws/lambda/&lt;function-name&gt;</code>. Glue:{' '}
            <code className="text-core-400">/aws-glue/jobs/output</code> and error logs. API Gateway, ECS,
            and others follow similar patterns — search the console by service prefix when lost.
          </p>
        </ContentStep>
        <ContentStep number={2} title="One group per logical source">
          <p className="text-slate-300">
            Think of a log group as &quot;all logs for this function&quot; or &quot;all logs for this EC2
            app path.&quot; You set retention at the group level — every stream inside inherits it unless
            overridden by export/archival policies.
          </p>
        </ContentStep>
        <ContentStep number={3} title="IAM and encryption">
          <p className="text-slate-300">
            Reading logs requires IAM permissions like{' '}
            <code className="text-core-400">logs:FilterLogEvents</code>. Production groups often use KMS
            encryption. Your Lambda execution role includes basic log write permissions via{' '}
            <code className="text-core-400">AWSLambdaBasicExecutionRole</code> — the same role pattern from
            the Lambda track.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Log streams — sequences inside a group">
        <p className="text-slate-300">
          Within a log group, streams partition events so concurrent writers do not corrupt each other.
          Understanding streams helps when you see duplicate-looking containers or multiple streams for one
          function.
        </p>
        <ContentStep number={1} title="Lambda streams">
          <p className="text-slate-300">
            Lambda creates a stream per execution environment (the reused container that runs your handler).
            Stream names look like{' '}
            <code className="text-core-400">2024/01/15/[$LATEST]abc123def456...</code>. Multiple invocations
            on the same warm container append to the same stream.
          </p>
        </ContentStep>
        <ContentStep number={2} title="START, END, REPORT lines">
          <p className="text-slate-300">
            Every invocation logs a <code className="text-core-400">START RequestId: ...</code>, your
            application output, then <code className="text-core-400">END</code> and{' '}
            <code className="text-core-400">REPORT</code> with duration, billed duration, memory used — free
            performance data without custom metrics.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Finding the right stream">
          <p className="text-slate-300">
            Use <strong className="text-white">Search all log streams</strong> in the group rather than
            clicking streams one by one. Filter by RequestId from the REPORT line to isolate a single failed
            run among thousands.
          </p>
        </ContentStep>
        <Example title="Sample Lambda log events" caption="What you see after one invoke">
{`START RequestId: a1b2c3d4-e5f6-7890-abcd-ef1234567890 Version: $LATEST
[INFO] Processing s3://lake-dev/raw/orders/file.csv
[INFO] Validated 1,024 rows
END RequestId: a1b2c3d4-e5f6-7890-abcd-ef1234567890
REPORT RequestId: a1b2c3d4-e5f6-7890-abcd-ef1234567890
  Duration: 342.50 ms  Billed Duration: 343 ms  Memory Size: 512 MB  Max Memory Used: 89 MB`}
        </Example>
        <Flowchart
          title="Log group → stream → events"
          chart={`flowchart TB
  LG["Log group /aws/lambda/ingest-dev"]
  LG --> S1[Stream container A]
  LG --> S2[Stream container B]
  S1 --> E1[START event]
  S1 --> E2[INFO row count]
  S1 --> E3[REPORT duration]
  S2 --> E4[START event]
  S2 --> E5[ERROR stack trace]`}
        />
      </LessonSection>

      <LessonSection title="Log retention — how long logs survive">
        <ContentStep number={1} title="Default and settings">
          <p className="text-slate-300">
            New log groups may keep logs indefinitely until you set retention. Best practice: choose a
            period — 7 days for noisy dev functions, 30–90 days for prod ingest, longer if compliance
            requires — so storage cost stays predictable as log volume grows with traffic.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Why retention matters for DE">
          <p className="text-slate-300">
            A high-volume ingest Lambda can generate gigabytes of logs monthly. Retention prevents runaway
            cost. Export to S3 (via subscription filter or batch export) when you need year-long audit trails
            for regulated data pipelines.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Dev vs prod">
          <p className="text-slate-300">
            Dev: short retention, verbose DEBUG logging. Prod: INFO or WARN default, longer retention, no PII
            in plain text log lines — align with your security team before logging full row payloads.
          </p>
        </ContentStep>
        <Callout variant="tip" title="Set retention on day one">
          When you create a log group manually, set retention immediately. For Lambda-created groups, open
          the group → Actions → Edit retention. Forgotten infinite retention on a chatty ETL function is a
          common surprise on the AWS bill.
        </Callout>
      </LessonSection>

      <LessonSection title="Where Lambda logs land">
        <p className="text-slate-300">
          Lambda integrates with CloudWatch Logs automatically — no agent install, no extra boto3 calls to
          &quot;send&quot; stdout. This is the first place you look when an alarm fires on Errors.
        </p>
        <ContentStep number={1} title="Automatic creation">
          <p className="text-slate-300">
            On first invoke, Lambda creates the log group{' '}
            <code className="text-core-400">/aws/lambda/&lt;your-function-name&gt;</code> if it does not
            exist and writes to a stream. Your Python <code className="text-core-400">logging</code> module
            and <code className="text-core-400">print()</code> both appear as log events.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Execution role requirement">
          <p className="text-slate-300">
            The function&apos;s execution role needs{' '}
            <code className="text-core-400">logs:CreateLogGroup</code>,{' '}
            <code className="text-core-400">logs:CreateLogStream</code>, and{' '}
            <code className="text-core-400">logs:PutLogEvents</code>. The managed policy{' '}
            <code className="text-core-400">AWSLambdaBasicExecutionRole</code> grants these — missing
            permissions show as invoke failures with access denied in the console.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Structured logging habit">
          <p className="text-slate-300">
            Log the S3 bucket, key, row counts, and job IDs as key=value or JSON lines. When Logs Insights
            arrives in the next module, structured messages become queryable fields instead of grep puzzles.
          </p>
        </ContentStep>
        <Flowchart
          title="Lambda invoke to log event"
          chart={`flowchart LR
  INV[Invoke Lambda]
  INV --> H[Handler runs print and logger]
  H --> PL[Lambda platform]
  PL --> LG["/aws/lambda/function-name"]
  LG --> ENG[Engineer searches or tails logs]`}
        />
        <Callout variant="insight">
          Glue job logs, EC2 Airflow logs, and custom apps on EC2 require explicit setup (Glue console
          options, CloudWatch Agent, or awslogs driver). Lambda is the easiest on-ramp — master its log group
          first, then extend the same Logs console to the rest of the stack.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Log group = container for one source; log stream = sequence of events; log event = one timestamped message.',
          'Lambda logs land in /aws/lambda/&lt;function-name&gt; automatically on first invoke.',
          'Set log retention on every group — dev short, prod longer, export to S3 for compliance archives.',
          'Use START/END/REPORT lines and RequestId to trace a single invocation; search all streams instead of picking one.',
        ]}
      />
    </LessonArticle>
  )
}
