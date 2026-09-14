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

export function PuttingItTogetherLambdaBeginner() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Checkpoint before triggers and concurrency">
        You now know what Lambda and serverless mean, how handler and runtime fit together, what arrives
        in event and context, how to tune env vars / timeout / memory, why Layers matter for pandas, and
        how execution roles connect to IAM. This lesson ties those threads into a{' '}
        <strong className="text-white">beginner Lambda checklist</strong> — a dev function you can test
        with manual invoke before wiring S3 notifications.
      </Callout>

      <Definition term="Beginner DE Lambda function">
        <p>
          A <strong className="text-white">beginner DE Lambda function</strong> is a Python 3.12 function
          in your dev account with: a minimal handler that logs and parses a sample S3 event, 512 MB /
          1-minute timeout, env vars for bucket and output prefix,{' '}
          <code className="text-core-400">AWSLambdaBasicExecutionRole</code> plus prefix-scoped S3
          policy, and no production triggers yet — tested via Console test event or CLI invoke.
        </p>
      </Definition>

      <LessonSection title="Setup checklist — dev function in one afternoon">
        <ContentStep number={1} title="Create the function">
          <p className="text-slate-300">
            Name <code className="text-core-400">de-s3-ingest-validator-dev</code>. Runtime Python 3.12.
            Handler <code className="text-core-400">app.lambda_handler</code>. Upload inline editor code
            first; zip deploy later when you add layers.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Environment variables">
          <p className="text-slate-300">
            Set <code className="text-core-400">LAKE_BUCKET=yourname-lake-dev-2024</code>,{' '}
            <code className="text-core-400">OUTPUT_PREFIX=processed/orders/</code>,{' '}
            <code className="text-core-400">LOG_LEVEL=INFO</code> — match your S3 beginner bucket from
            the S3 track.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Execution role">
          <p className="text-slate-300">
            Create <code className="text-core-400">de-lambda-ingest-dev-role</code>: trust{' '}
            <code className="text-core-400">lambda.amazonaws.com</code>, attach basic logging, add inline
            S3 Get on <code className="text-core-400">raw/incoming/*</code> and Put on{' '}
            <code className="text-core-400">processed/orders/*</code> for your dev bucket only.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Memory and timeout">
          <p className="text-slate-300">
            Start 512 MB, 60 s timeout. After a test invoke, read the REPORT line — adjust before adding
            pandas or large downloads.
          </p>
        </ContentStep>
        <ContentStep number={5} title="Manual test invoke">
          <p className="text-slate-300">
            Use the Console &quot;Test&quot; tab with the built-in S3 put template. Confirm CloudWatch
            logs show bucket/key parsing and <code className="text-core-400">aws_request_id</code> from
            context.
          </p>
        </ContentStep>
        <Flowchart
          title="Beginner Lambda verification flow"
          chart={`flowchart TD
  A[Create function Python 3.12]
  A --> B[Set env vars for dev bucket]
  B --> C[Create execution role least privilege]
  C --> D[Configure 512 MB 60 s timeout]
  D --> E[Test with sample S3 event]
  E --> F[Read CloudWatch REPORT and logs]
  F --> G[Self-check vocabulary]`}
        />
      </LessonSection>

      <LessonSection title="Mini scenario — handler stub for lake edge">
        <p className="text-slate-300">
          Before S3 triggers fire automatically, prove the handler logic with a test event shaped like a
          real upload to your dev lake:
        </p>
        <Example title="Beginner handler stub" caption="Extend after manual invoke succeeds">
{`import json
import logging
import os
import urllib.parse

import boto3

logger = logging.getLogger()
logger.setLevel(os.environ.get("LOG_LEVEL", "INFO"))

s3 = boto3.client("s3")
OUTPUT_PREFIX = os.environ["OUTPUT_PREFIX"]

def lambda_handler(event, context):
    logger.info("request_id=%s", context.aws_request_id)

    for record in event.get("Records", []):
        bucket = record["s3"]["bucket"]["name"]
        key = urllib.parse.unquote_plus(record["s3"]["object"]["key"])
        logger.info("Processing s3://%s/%s", bucket, key)

        if not key.startswith("raw/incoming/"):
            logger.warning("Skipping key outside raw/incoming/: %s", key)
            continue

        # TODO: validate headers, transform, write to OUTPUT_PREFIX
        dest_key = OUTPUT_PREFIX + key.split("/")[-1].replace(".csv", ".json")
        logger.info("Would write to s3://%s/%s", bucket, dest_key)

    return {"status": "ok", "records": len(event.get("Records", []))}`}
        </Example>
        <Callout variant="insight">
          The TODO marks intentional scope — this beginner checkpoint validates wiring (role, env, event
          parsing, logging). Real transforms and Layers come when you attach S3 triggers and heavier
          libraries.
        </Callout>
      </LessonSection>

      <LessonSection title="Self-check — can you explain these?">
        <ContentStep number={1} title="Function vs handler vs runtime">
          <p className="text-slate-300">
            Function is the AWS resource; handler is module.function; runtime is managed Python version
            with boto3 included.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Event vs context">
          <p className="text-slate-300">
            Event has S3 Records with bucket/key; context has request ID, memory limit, remaining time.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Why serverless for sporadic uploads">
          <p className="text-slate-300">
            Pay per invocation; no idle EC2; scale out on bursts — ideal for file-trigger edge work.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Memory and timeout tuning">
          <p className="text-slate-300">
            Memory affects CPU; timeout max 15 min; use REPORT logs and remaining time before long steps.
          </p>
        </ContentStep>
        <ContentStep number={5} title="Layers purpose">
          <p className="text-slate-300">
            Shared dependency zips for pandas/pyarrow — build on Linux, pin versions, keep handler zip small.
          </p>
        </ContentStep>
        <ContentStep number={6} title="Execution role basics">
          <p className="text-slate-300">
            Trust lambda.amazonaws.com; scope S3 Get/Put to prefixes; add logging; separate from S3 invoke
            permission on the function.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="What comes next">
        <p className="text-slate-300">
          The next lessons in the Lambda track go deeper on topics this beginner pass introduced:
        </p>
        <ContentStep number={1} title="S3 and EventBridge triggers">
          <p className="text-slate-300">
            Wire <code className="text-core-400">s3:ObjectCreated</code> on{' '}
            <code className="text-core-400">raw/incoming/</code> to invoke your function automatically.
            Add Lambda resource policy so S3 may invoke; idempotent handlers for retries.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Concurrency and scaling">
          <p className="text-slate-300">
            Reserved vs provisioned concurrency, account limits, and throttling when 10,000 files land at
            once — buffer with SQS between S3 and Lambda when needed.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Production patterns">
          <p className="text-slate-300">
            Dead-letter queues, Step Functions orchestration, Glue handoff, monitoring dashboards, and cost
            alarms — turn the dev stub into a pipeline edge you trust in prod.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Connect back to S3 and Glue">
          <p className="text-slate-300">
            Lambda writes <code className="text-core-400">processed/</code>; Glue crawler registers tables;
            Athena queries the same keys — the hub-and-spoke lake from the S3 checkpoint, now with
            serverless compute on the rim.
          </p>
        </ContentStep>
        <p className="mt-4 text-slate-300">
          Hybrid pipelines remain normal: Firehose or app uploads to <code className="text-core-400">raw/</code>,
          Lambda validates, Glue transforms heavy aggregates, EC2 runs legacy batch — all on one bucket
          with different IAM roles per service.
        </p>
        <Callout variant="insight">
          Strong Lambda beginners do not memorize every trigger type on day one. They ask: What event
          starts the run? What does the role allow? How long and how much memory? Is the handler
          idempotent? Those four questions prevent most day-one pipeline failures.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Dev checklist: Python function, env vars, least-privilege execution role, 512 MB / 60 s, test S3 event, read CloudWatch.',
          'Handler stub parses Records, filters prefix, logs context.request_id — extend before live triggers.',
          'Next: S3/EventBridge triggers, concurrency limits, DLQ and Step Functions, Glue/Athena on same lake.',
          'Lambda is the event-driven edge; S3 is storage; IAM roles tie every invoke to scoped permissions.',
        ]}
      />
    </LessonArticle>
  )
}
