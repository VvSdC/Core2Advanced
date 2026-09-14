import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function PythonBoto3Logging() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Production Lambda is Python + boto3 + structured logs">
        Console tutorials use inline handlers; data pipelines need consistent boto3 client reuse,
        structured logging for traceability, and explicit exception handling so DLQs and Step Functions
        catch states fire with actionable context — not silent partial writes to curated S3.
      </Callout>

      <Definition term="Execution role credentials">
        <p>
          Inside Lambda, boto3 automatically uses the function&apos;s{' '}
          <strong className="text-white">execution role</strong> via the container credentials endpoint —
          no hardcoded keys. Set default region from{' '}
          <span className="font-mono text-sm">AWS_REGION</span>. For local tests, use AWS SSO or named
          profiles; never ship keys in deployment packages.
        </p>
      </Definition>

      <LessonSection title="Boto3 patterns for DE handlers">
        <ContentStep number={1} title="Reuse clients outside handler">
          <p className="text-slate-300">
            Create <span className="font-mono text-sm">s3</span>,{' '}
            <span className="font-mono text-sm">glue</span>, and{' '}
            <span className="font-mono text-sm">dynamodb</span> clients at module scope — warm containers
            reuse TCP connections and avoid per-invoke client construction overhead.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Resource vs client">
          <p className="text-slate-300">
            Use <span className="font-mono text-sm">boto3.client</span> for low-level API (
            <span className="font-mono text-sm">start_job_run</span>). Use{' '}
            <span className="font-mono text-sm">boto3.resource(&apos;s3&apos;)</span> for ergonomic
            object uploads. For high-throughput streaming, prefer client{' '}
            <span className="font-mono text-sm">get_object</span> Body iter chunks.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Paginators for large listings">
          <p className="text-slate-300">
            Housekeeping Lambdas listing <span className="font-mono text-sm">athena-results/</span> use{' '}
            <span className="font-mono text-sm">get_paginator(&apos;list_objects_v2&apos;)</span> — never
            assume single-page ListObjects responses on large prefixes.
          </p>
        </ContentStep>
        <Example title="Module-scope clients + handler sketch">
{`import json
import logging
import os
import boto3
from botocore.exceptions import ClientError

logger = logging.getLogger()
logger.setLevel(logging.INFO)

s3 = boto3.client("s3")
glue = boto3.client("glue")

GLUE_JOB = os.environ["GLUE_JOB_NAME"]

def handler(event, context):
    for record in event.get("Records", []):
        bucket = record["s3"]["bucket"]["name"]
        key = record["s3"]["object"]["key"]
        logger.info("Processing s3://%s/%s", bucket, key)
        try:
            glue.start_job_run(
                JobName=GLUE_JOB,
                Arguments={"--source_key": key},
            )
        except ClientError as exc:
            logger.exception("Glue start failed for %s", key)
            raise`}
        </Example>
      </LessonSection>

      <LessonSection title="Logging best practices">
        <ContentStep number={1} title="Structured JSON logs">
          <p className="text-slate-300">
            Emit one JSON line per milestone:{' '}
            <span className="font-mono text-sm">{'{ "event": "glue_started", "key": "...", "request_id": "..." }'}</span>.
            CloudWatch Logs Insights queries filter on fields. Include{' '}
            <span className="font-mono text-sm">context.aws_request_id</span> for AWS support correlation.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Log levels">
          <p className="text-slate-300">
            INFO for normal path; WARNING for retryable issues; ERROR/exception for failures that should
            trigger DLQ. Avoid logging full file contents or PII — log key, size, etag, row counts only.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Metrics alongside logs">
          <p className="text-slate-300">
            Publish custom CloudWatch metrics (<span className="font-mono text-sm">FilesProcessed</span>,{' '}
            <span className="font-mono text-sm">ValidationFailures</span>) via{' '}
            <span className="font-mono text-sm">cloudwatch.put_metric_data</span> for dashboards — logs
            alone are hard to alarm on at scale.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Exception handling">
        <ContentStep number={1} title="ClientError taxonomy">
          <p className="text-slate-300">
            Catch <span className="font-mono text-sm">botocore.exceptions.ClientError</span>; inspect{' '}
            <span className="font-mono text-sm">error_response[&apos;Error&apos;][&apos;Code&apos;]</span>.
            <span className="font-mono text-sm">AccessDenied</span> → fix IAM, do not retry blindly.{' '}
            <span className="font-mono text-sm">SlowDown</span>,{' '}
            <span className="font-mono text-sm">ThrottlingException</span> → retry with backoff.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Raise vs swallow">
          <p className="text-slate-300">
            Re-raise after logging for async invokes so retries/DLQ engage. For known bad schema, write
            quarantine record and return without raise only when you explicitly want to skip retries.
            Document that branch — silent success hides data quality issues.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Partial batch failures (SQS)">
          <p className="text-slate-300">
            Return <span className="font-mono text-sm">batchItemFailures</span> with failed message IDs;
            log each failure with message body hash, not full payload if large.
          </p>
        </ContentStep>
        <Callout variant="tip">
          Add <span className="font-mono text-sm">AWS_LAMBDA_LOG_FORMAT=JSON</span> (where supported) for
          native structured logs — simplifies Insights queries across dozens of pipeline functions.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Reuse boto3 clients at module scope in warm Lambda containers — faster and fewer connection leaks.',
          'Execution role supplies credentials automatically — never embed access keys in deployment packages.',
          'Structured JSON logs with request_id, S3 key, and stage names enable CloudWatch Insights triage.',
          'Catch ClientError by code — retry throttling, fail fast on AccessDenied, quarantine schema errors deliberately.',
          'Re-raise unhandled exceptions for async retry/DLQ unless you explicitly choose skip-retry quarantine path.',
        ]}
      />
    </LessonArticle>
  )
}
