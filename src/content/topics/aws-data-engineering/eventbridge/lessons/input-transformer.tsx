import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function InputTransformer() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Targets expect different shapes — reshape at the rule">
        EventBridge delivers the full event envelope to Lambda, SQS, and Step Functions.{' '}
        <strong className="text-white">Input transformer</strong> maps fields from the event into a custom
        payload — so Glue job arguments, Step Functions input, or SNS message body match what downstream code
        expects without an extra pass-through Lambda.
      </Callout>

      <Definition term="Input transformer">
        <p>
          Rule target configuration with <strong className="text-white">InputPathsMap</strong> (JSONPath
          extractions from the event) and <strong className="text-white">InputTemplate</strong> (string
          template with placeholders). EventBridge builds the target input from the template before
          invocation — reducing Lambda boilerplate and keeping contracts in IaC.
        </p>
      </Definition>

      <LessonSection title="How input transformation works">
        <ContentStep number={1} title="InputPathsMap">
          <p className="text-slate-300">
            Define aliases for JSONPath expressions:{' '}
            <span className="font-mono text-sm">bucket: $.detail.bucket.name</span>,{' '}
            <span className="font-mono text-sm">key: $.detail.object.key</span>,{' '}
            <span className="font-mono text-sm">size: $.detail.object.size</span>. Paths must resolve or
            transformation fails and target retries/DLQ.
          </p>
        </ContentStep>
        <ContentStep number={2} title="InputTemplate">
          <p className="text-slate-300">
            Template string with <span className="font-mono text-sm">&lt;alias&gt;</span> placeholders replaced
            by extracted values. Output must be valid JSON for Lambda and Step Functions (quoted strings where
            required). SNS and SQS accept string bodies — still often JSON for consistency.
          </p>
        </ContentStep>
        <ContentStep number={3} title="vs InputConstant and matched event">
          <p className="text-slate-300">
            <strong className="text-white">Matched event</strong> (default): full envelope to target.{' '}
            <strong className="text-white">Constant</strong>: static JSON every time — schedule tick with fixed
            job name. <strong className="text-white">Transformer</strong>: dynamic subset — best for S3-driven
            parameterized starts.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="DE examples">
        <ContentStep number={1} title="S3 event → Step Functions input">
          <p className="text-slate-300">
            Step Functions state machine expects{' '}
            <span className="font-mono text-sm">{`{ "inputPath", "runDate", "bytes" }`}</span> — not full S3
            event. Transformer extracts key and size, adds static pipeline id, starts execution with clean
            contract.
          </p>
        </ContentStep>
        <Example title="Input transformer — S3 to Step Functions">
{`InputPathsMap:
  bucket: $.detail.bucket.name
  key: $.detail.object.key
  size: $.detail.object.size
  eventTime: $.time

InputTemplate: |
  {
    "inputPath": "s3://<bucket>/<key>",
    "runDate": "<eventTime>",
    "bytes": <size>,
    "pipeline": "silver_orders",
    "stage": "validate_and_promote"
  }`}
        </Example>
        <ContentStep number={2} title="Glue failure → SNS human-readable alert">
          <p className="text-slate-300">
            Ops SNS subscription emails plain text — transformer formats job name, state, and error message
            from Glue Job State Change detail without Lambda formatter.
          </p>
        </ContentStep>
        <Example title="Input transformer — Glue FAILED to SNS message">
{`InputPathsMap:
  job: $.detail.jobName
  state: $.detail.state
  runId: $.detail.jobRunId
  msg: $.detail.message

InputTemplate: |
  "Glue job <job> entered state <state>. RunId: <runId>. Message: <msg>. Console: check CloudWatch /aws-glue/jobs/error"`}
        </Example>
        <ContentStep number={3} title="Schedule rule with constant + transformer">
          <p className="text-slate-300">
            Cron rule has minimal event — use InputConstant for scheduled nightly job with fixed parameters.
            Combine with parallel S3 rule using transformer for event-driven path into same Step Functions
            machine accepting unified input schema.
          </p>
        </ContentStep>
        <Callout variant="tip">
          Template strings need escaped quotes for JSON strings — bucket names and keys with special characters
          break naive templates. Validate with test events; for complex transforms, a thin Lambda may still be
          clearer than unmaintainable templates.
        </Callout>
      </LessonSection>

      <LessonSection title="When to use transformer vs Lambda">
        <ContentStep number={1} title="Prefer transformer when">
          <p className="text-slate-300">
            Field extraction and static wrapping only — map S3 key to inputPath, pass run id to SQS message
            body, format SNS alert string. No conditional logic, no external lookups, no secret retrieval.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Prefer Lambda when">
          <p className="text-slate-300">
            Enrichment from DynamoDB watermark, Secrets Manager JDBC creds, or branching on file extension
            with different job names. Business logic belongs in code — transformer for shape normalization
            at the rule boundary.
          </p>
        </ContentStep>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Input transformer: InputPathsMap (JSONPath) + InputTemplate — custom target payload without pass-through Lambda.',
          'Step Functions / Lambda: emit unified JSON contract from S3 events — inputPath, runDate, pipeline id.',
          'SNS alerts: human-readable strings from Glue detail fields — jobName, state, jobRunId, message.',
          'Alternatives: matched event (full envelope), constant (schedules) — pick per target expectations.',
          'Use transformer for simple mapping; Lambda when enrichment, secrets, or conditional routing is needed.',
        ]}
      />
    </LessonArticle>
  )
}
