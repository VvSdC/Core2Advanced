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

export function S3Boto3Basics() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Boto3 — S3 from Python pipelines">
        Boto3 is the AWS SDK for Python. Glue scripts, Lambda functions, Airflow tasks, and notebooks on
        EC2 all use the same client pattern: create an S3 client, call{' '}
        <code className="text-core-400">upload_file</code>,{' '}
        <code className="text-core-400">download_file</code>, or{' '}
        <code className="text-core-400">list_objects_v2</code>. If you learned IAM roles on EC2, Boto3
        picks up those credentials automatically — no keys in source code.
      </Callout>

      <Definition term="Boto3 client vs resource">
        <p>
          <strong className="text-white">boto3.client(&apos;s3&apos;)</strong> maps closely to S3 REST API
          operations — what most DE code uses.{' '}
          <strong className="text-white">boto3.resource(&apos;s3&apos;)</strong> offers a higher-level
          object-oriented interface (<code className="text-core-400">Bucket.objects.filter</code>). Start
          with the client; switch to resource when it reads cleaner for loops.
        </p>
      </Definition>

      <LessonSection title="Setup — credentials without hard-coded keys">
        <ContentStep number={1} title="Default credential chain">
          <p className="text-slate-300">
            Boto3 searches in order: environment variables,{' '}
            <code className="text-core-400">~/.aws/credentials</code>, EC2 instance profile, ECS task role,
            Lambda execution role. On your EC2 DE sandbox with{' '}
            <code className="text-core-400">EC2DevETLRole</code> attached, this just works.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Prefer IAM roles over access keys">
          <p className="text-slate-400">
            Tie-in from the IAM sub-topic: long-lived access keys in{' '}
            <code className="text-core-400">export AWS_ACCESS_KEY_ID=...</code> rot poorly and leak from
            git. Production ETL uses a role with{' '}
            <code className="text-core-400">s3:GetObject</code> and{' '}
            <code className="text-core-400">s3:PutObject</code> scoped to{' '}
            <code className="text-core-400">arn:aws:s3:::company-lake-dev/raw/*</code>. Lambda and Glue
            execution roles follow the same pattern.
          </p>
        </ContentStep>
        <Flowchart
          title="Boto3 credential resolution on EC2"
          chart={`flowchart LR
  P[Python script on EC2]
  P --> B[boto3.client s3]
  B --> I[Instance metadata IMDSv2]
  I --> R[EC2DevETLRole temporary keys]
  R --> S3[S3 API calls allowed by policy]`}
        />
        <Callout variant="tip" title="Local dev only">
          On a laptop, <code className="text-core-400">aws configure</code> or SSO profile is fine for
          learning. Never paste the same keys into a repo that deploys to Lambda.
        </Callout>
      </LessonSection>

      <LessonSection title="List objects under a prefix">
        <Example
          title="list_prefix.py"
          output={`raw/sample/orders.csv — 1024 bytes
raw/sample/events.json — 512 bytes`}
          caption="Toy bucket yourname-lake-dev-2024"
        >
{`import boto3

BUCKET = "yourname-lake-dev-2024"
PREFIX = "raw/sample/"

s3 = boto3.client("s3")
paginator = s3.get_paginator("list_objects_v2")

for page in paginator.paginate(Bucket=BUCKET, Prefix=PREFIX):
    for obj in page.get("Contents", []):
        key = obj["Key"]
        size = obj["Size"]
        print(f"{key} — {size} bytes")`}
        </Example>
        <p className="text-slate-300">
          Always use a paginator for prefixes that may grow — a single{' '}
          <code className="text-core-400">list_objects_v2</code> returns at most 1,000 keys per call.
        </p>
      </LessonSection>

      <LessonSection title="Upload a local file">
        <Example title="upload_file.py" caption="High-level helper — handles multipart for large files">
{`import boto3
from pathlib import Path

BUCKET = "yourname-lake-dev-2024"
LOCAL_PATH = Path("./orders.csv")
S3_KEY = "raw/sample/orders.csv"

s3 = boto3.client("s3")
s3.upload_file(str(LOCAL_PATH), BUCKET, S3_KEY)
print(f"Uploaded to s3://{BUCKET}/{S3_KEY}")`}
        </Example>
        <ContentStep number={1} title="Extra args">
          <p className="text-slate-300">
            Pass <code className="text-core-400">ExtraArgs</code> for ContentType, ServerSideEncryption,
            or Metadata:{' '}
            <code className="text-core-400">ExtraArgs=&#123;&quot;ContentType&quot;: &quot;text/csv&quot;&#125;</code>{' '}
            in code — keeps Athena and downstream tools informed.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Download an object">
        <Example title="download_file.py">
{`import boto3

BUCKET = "yourname-lake-dev-2024"
S3_KEY = "processed/sample/orders.parquet"
LOCAL_PATH = "./orders.parquet"

s3 = boto3.client("s3")
s3.download_file(BUCKET, S3_KEY, LOCAL_PATH)
print(f"Downloaded {S3_KEY} to {LOCAL_PATH}")`}
        </Example>
        <p className="text-slate-300">
          For in-memory processing (small JSON events), use{' '}
          <code className="text-core-400">get_object</code> and read{' '}
          <code className="text-core-400">response[&quot;Body&quot;].read()</code> instead of writing to
          disk first.
        </p>
      </LessonSection>

      <LessonSection title="Put and get object — streaming style">
        <Example title="put_get_bytes.py" caption="Useful in Lambda when files are small">
{`import boto3
import json

s3 = boto3.client("s3")
BUCKET = "yourname-lake-dev-2024"
KEY = "raw/sample/metrics.json"

payload = json.dumps({"rows": 42, "source": "toy-etl"}).encode("utf-8")
s3.put_object(Bucket=BUCKET, Key=KEY, Body=payload, ContentType="application/json")

response = s3.get_object(Bucket=BUCKET, Key=KEY)
body = response["Body"].read().decode("utf-8")
print(body)`}
        </Example>
      </LessonSection>

      <LessonSection title="Error handling DE scripts need">
        <ContentStep number={1} title="ClientError for AccessDenied">
          <p className="text-slate-300">
            Catch <code className="text-core-400">botocore.exceptions.ClientError</code> and inspect{' '}
            <code className="text-core-400">error_response[&quot;Error&quot;][&quot;Code&quot;]</code>.
            Log the role ARN from STS when debugging IAM in shared dev accounts.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Idempotent uploads">
          <p className="text-slate-300">
            Re-running ETL often overwrites the same key. Versioning (later lesson) preserves history;
            without it, last writer wins — design keys with date partitions so reruns do not clobber
            unrelated data.
          </p>
        </ContentStep>
        <Callout variant="insight">
          Glue and PySpark often use{' '}
          <code className="text-core-400">spark.read.parquet(&quot;s3://bucket/path/&quot;)</code> instead
          of raw Boto3 — but Boto3 remains essential for Lambda ingest, custom orchestration, and
          pre-flight checks before a heavy Spark job starts.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'boto3.client("s3") is the default for DE — upload_file, download_file, list_objects_v2 with paginator.',
          'Credentials come from the environment chain — EC2/Lambda/Glue roles, not embedded access keys.',
          'Scope IAM policies to bucket and prefix ARNs; AccessDenied in Boto3 means fix the role.',
          'Use put_object/get_object for small in-memory payloads; upload_file for local file paths.',
        ]}
      />
    </LessonArticle>
  )
}
