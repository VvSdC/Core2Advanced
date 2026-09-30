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

export function CallbacksAndHumanApproval() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Some steps finish outside AWS — or inside a human">
        An on-prem SQL Server extract, a dbt Cloud job, an EMR cluster owned by another team, or a data
        steward who must eyeball numbers before the gold table goes public. None of them have a .sync
        integration. The <strong className="text-white">callback pattern</strong> lets the workflow hand out a
        token, go to sleep for free, and resume the moment someone hands the token back.
      </Callout>

      <Definition term="Task token callback">
        <p>
          A Task whose Resource ends in <span className="font-mono text-sm">.waitForTaskToken</span>. Step
          Functions generates a unique token (<code className="text-core-400">$$.Task.Token</code>), you pass it
          to an external party in Parameters, and the state pauses until that party calls{' '}
          <span className="font-mono text-sm">SendTaskSuccess</span> (with output JSON) or{' '}
          <span className="font-mono text-sm">SendTaskFailure</span> (with error and cause) — or until the task
          times out.
        </p>
      </Definition>

      <LessonSection title="How the token flows">
        <ContentStep number={1} title="Send the token out">
          <p className="text-slate-300">
            The token must appear somewhere in Parameters — usually{' '}
            <span className="font-mono text-sm">&quot;TaskToken.$&quot;: &quot;$$.Task.Token&quot;</span> inside
            an SQS message body, Lambda payload, SNS message, or ECS container override. If the token never
            leaves the workflow, nobody can resume the task and it simply waits until it times out.
          </p>
        </ContentStep>
        <ContentStep number={2} title="The external system calls back">
          <p className="text-slate-300">
            <span className="font-mono text-sm">SendTaskSuccess(taskToken, output)</span> resumes with output as
            the task result. <span className="font-mono text-sm">SendTaskFailure(taskToken, error, cause)</span>{' '}
            raises that error name — match it in Catch like any other.{' '}
            <span className="font-mono text-sm">SendTaskHeartbeat(taskToken)</span> says &quot;still
            working&quot;. The caller needs <span className="font-mono text-sm">states:SendTaskSuccess</span> and
            friends on the state machine ARN.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Timeouts and heartbeats">
          <p className="text-slate-300">
            Without limits, a lost token waits up to a year. Set <span className="font-mono text-sm">TimeoutSeconds</span>{' '}
            (overall) and <span className="font-mono text-sm">HeartbeatSeconds</span> (maximum gap between
            heartbeats). A crashed on-prem worker stops heartbeating, the task raises States.Timeout within
            minutes, and your Catch pages the team.
          </p>
        </ContentStep>
        <Flowchart
          title="Callback via SQS to an external worker"
          chart={`flowchart LR
  SF[Task waitForTaskToken]
  Q[SQS de-onprem-jobs]
  W[On-prem loader]
  API[SendTaskSuccess or Failure]
  HB[SendTaskHeartbeat]
  NX[Next state]
  SF -->|message with token| Q
  Q --> W
  W -->|every 5 min| HB
  W -->|done| API
  API --> NX`}
        />
      </LessonSection>

      <LessonSection title="External systems — SQS worker pattern">
        <Example title="Hand the token to an on-prem job via SQS" caption="Step Functions sends the message and waits">
{`"RunOnPremExtract": {
  "Type": "Task",
  "Resource": "arn:aws:states:::sqs:sendMessage.waitForTaskToken",
  "Parameters": {
    "QueueUrl": "https://sqs.us-east-1.amazonaws.com/111122223333/de-onprem-jobs",
    "MessageBody": {
      "job": "erp_orders_extract",
      "run_date.$": "$.run_date",
      "target": "s3://acme-lake-prod/landing/erp/",
      "task_token.$": "$$.Task.Token"
    }
  },
  "TimeoutSeconds": 14400,
  "HeartbeatSeconds": 900,
  "ResultPath": "$.extract",
  "Catch": [{ "ErrorEquals": ["States.ALL"], "ResultPath": "$.error", "Next": "NotifyFailure" }],
  "Next": "RunSilverJob"
}`}
        </Example>
        <Example title="Worker side (Python, Boto3)" caption="Heartbeat while running, then report the result">
{`sfn = boto3.client("stepfunctions")
token = body["task_token"]
try:
    for chunk in extract_chunks(body["run_date"]):
        upload_to_s3(chunk, body["target"])
        sfn.send_task_heartbeat(taskToken=token)
    sfn.send_task_success(taskToken=token, output=json.dumps({"files": n_files}))
except Exception as exc:
    sfn.send_task_failure(taskToken=token, error="ExtractFailed", cause=str(exc)[:256])`}
        </Example>
        <ContentStep number={1} title="Same shape for dbt Cloud, EMR, and partners">
          <p className="text-slate-300">
            A Lambda started with <span className="font-mono text-sm">lambda:invoke.waitForTaskToken</span>{' '}
            triggers a dbt Cloud job and stores the token in DynamoDB keyed by the dbt run ID. The dbt webhook
            hits API Gateway, a Lambda looks up the token and calls SendTaskSuccess. Tokens are long opaque
            strings — store them, do not put them in URLs you log.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Human approval before publishing gold data">
        <ContentStep number={1} title="The approval email">
          <p className="text-slate-300">
            After the Athena QA step, a Lambda invoked with .waitForTaskToken emails the data steward through SNS
            with a summary (row counts, null rates) and two links: approve and reject. Each link points to an
            API Gateway endpoint carrying the token; the backing Lambda calls SendTaskSuccess or
            SendTaskFailure. Protect the endpoint — anyone with the link can approve.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Gate the publish step">
          <p className="text-slate-300">
            Only on approval does the workflow swap the gold view, COPY into Redshift, or flip the Glue Catalog
            table location. Rejection raises <span className="font-mono text-sm">Rejected</span>, which the Catch
            routes to an SNS notice and a Fail state. Set TimeoutSeconds to the business window — say 8 hours —
            so an ignored email does not block tomorrow&apos;s run.
          </p>
        </ContentStep>
        <Flowchart
          title="Approval gate for gold publish"
          chart={`flowchart TB
  QA[Athena QA sync]
  AP[Request approval waitForTaskToken]
  EM[SNS email with links]
  GW[API Gateway approve or reject]
  CH{Decision}
  PUB[Publish gold and load Redshift]
  REJ[SNS rejected then Fail]
  QA --> AP
  AP --> EM
  EM --> GW
  GW --> CH
  CH -->|SendTaskSuccess| PUB
  CH -->|SendTaskFailure| REJ`}
        />
        <Callout variant="insight">
          Waiting in a callback task costs nothing on a Standard workflow — you pay for state transitions, not
          idle time. Express workflows cannot use .waitForTaskToken, so approval gates always live in Standard.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          '.waitForTaskToken pauses a Task until SendTaskSuccess or SendTaskFailure is called with $$.Task.Token.',
          'Pass the token through SQS, Lambda, SNS, or ECS overrides; the external caller needs states:SendTask* permissions.',
          'Always set TimeoutSeconds and HeartbeatSeconds so lost tokens and crashed workers surface as States.Timeout.',
          'Human approval: SNS email with API Gateway links that call SendTaskSuccess or SendTaskFailure.',
          'Gate gold publication and Redshift loads behind approval in Standard workflows — waiting is free.',
        ]}
      />
    </LessonArticle>
  )
}
