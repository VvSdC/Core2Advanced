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

export function ReadingSecretsInCode() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Your code asks AWS for the password at runtime — it never ships with it">
        Instead of a password in a config file, your Lambda or Glue job calls{' '}
        <strong className="text-white">Secrets Manager</strong> or{' '}
        <strong className="text-white">Parameter Store</strong> with its IAM role, gets the value back in
        memory, uses it to open a connection, and forgets it when the process ends. The code only knows the
        secret&apos;s <em>name</em> — like <code className="text-core-400">de/prod/rds/orders-reader</code> —
        never the value.
      </Callout>

      <Definition term="Runtime secret retrieval">
        <p>
          Calling <code className="text-core-400">secretsmanager:GetSecretValue</code> or{' '}
          <code className="text-core-400">ssm:GetParameter</code> from application code using the
          execution role&apos;s temporary credentials. The response carries the decrypted value (KMS decryption
          happens server-side when the caller also has <code className="text-core-400">kms:Decrypt</code>),
          which the code parses and passes straight to a database driver or HTTP client — never to logs, job
          arguments, or return payloads.
        </p>
      </Definition>

      <LessonSection title="Boto3 basics — Secrets Manager and SSM">
        <ContentStep number={1} title="GetSecretValue and SecretString">
          <p className="text-slate-300">
            <code className="text-core-400">get_secret_value(SecretId=...)</code> returns{' '}
            <code className="text-core-400">SecretString</code> (text, usually JSON) or{' '}
            <code className="text-core-400">SecretBinary</code>. Database secrets store a JSON object with keys
            like <code className="text-core-400">username</code>, <code className="text-core-400">password</code>,{' '}
            <code className="text-core-400">host</code>, <code className="text-core-400">port</code> — parse it
            with <code className="text-core-400">json.loads</code>. By default you receive the version labelled
            AWSCURRENT.
          </p>
        </ContentStep>
        <ContentStep number={2} title="GetParameter with decryption">
          <p className="text-slate-300">
            For config like <code className="text-core-400">/de/prod/orders/batch_size</code> call{' '}
            <code className="text-core-400">ssm.get_parameter(Name=..., WithDecryption=True)</code>. The flag
            only matters for SecureString parameters — without it you get the ciphertext blob. Values are always
            strings, so cast numbers yourself.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Batch reads with GetParameters">
          <p className="text-slate-300">
            <code className="text-core-400">get_parameters(Names=[...])</code> fetches up to 10 parameters in
            one call. Missing names do not raise — they come back in{' '}
            <code className="text-core-400">InvalidParameters</code>, so check that list and fail fast instead of
            running a job with half its config.
          </p>
        </ContentStep>
        <Example title="Lambda — fetch once, reuse across warm invocations" caption="Module scope runs on cold start only">
{`import json
import os
import boto3

secrets = boto3.client("secretsmanager")
ssm = boto3.client("ssm")

# Runs once per execution environment (cold start), reused while warm
_secret = json.loads(
    secrets.get_secret_value(SecretId=os.environ["DB_SECRET_ID"])["SecretString"]
)
_resp = ssm.get_parameters(
    Names=["/de/prod/orders/batch_size", "/de/prod/orders/api_token"],
    WithDecryption=True,
)
if _resp["InvalidParameters"]:
    raise RuntimeError(f"Missing parameters: {_resp['InvalidParameters']}")
_config = {p["Name"].rsplit("/", 1)[-1]: p["Value"] for p in _resp["Parameters"]}
BATCH_SIZE = int(_config["batch_size"])

def handler(event, context):
    conn = connect(host=_secret["host"], user=_secret["username"],
                   password=_secret["password"], dbname=_secret["dbname"])
    ...`}
        </Example>
        <Callout variant="tip">
          Put only the secret <em>name or ARN</em> in the Lambda environment variable (
          <code className="text-core-400">DB_SECRET_ID=de/prod/rds/orders-reader</code>). Rotating the value
          then needs no redeploy — the next cold start picks up the new AWSCURRENT version.
        </Callout>
      </LessonSection>

      <LessonSection title="Glue PySpark — secret to JDBC URL">
        <ContentStep number={1} title="Pass the secret name as a job argument">
          <p className="text-slate-300">
            Job <code className="text-core-400">orders-silver-etl</code> gets{' '}
            <code className="text-core-400">--secret_id de/prod/rds/orders-reader</code> as a default argument.
            Job arguments are visible in the console and in <code className="text-core-400">GetJobRun</code>{' '}
            responses, so the name is fine there but the password never is.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Fetch on the driver, not per executor">
          <p className="text-slate-300">
            Read the secret once in the driver script and hand the values to the Spark JDBC reader. Calling
            Secrets Manager inside a UDF or <code className="text-core-400">mapPartitions</code> multiplies API
            calls by the number of partitions and can hit throttling.
          </p>
        </ContentStep>
        <Flowchart
          title="Glue job reading a secret before a JDBC extract"
          chart={`flowchart LR
  ARGS[Job arg secret_id]
  DRV[Glue driver]
  SM[Secrets Manager]
  KMS[KMS decrypt]
  JDBC[Spark JDBC read]
  RDS[(RDS orders DB)]
  S3[(S3 silver)]
  ARGS --> DRV
  DRV -->|GetSecretValue| SM
  SM --> KMS
  SM -->|SecretString| DRV
  DRV --> JDBC
  JDBC --> RDS
  JDBC --> S3`}
        />
        <Example title="Glue job — build the JDBC URL from a secret" caption="orders-silver-etl driver script">
{`import sys, json, boto3
from awsglue.utils import getResolvedOptions
from awsglue.context import GlueContext
from pyspark.context import SparkContext

args = getResolvedOptions(sys.argv, ["JOB_NAME", "secret_id"])
sm = boto3.client("secretsmanager")
creds = json.loads(sm.get_secret_value(SecretId=args["secret_id"])["SecretString"])

jdbc_url = f"jdbc:postgresql://{creds['host']}:{creds['port']}/{creds['dbname']}"
spark = GlueContext(SparkContext.getOrCreate()).spark_session

orders = (spark.read.format("jdbc")
    .option("url", jdbc_url)
    .option("dbtable", "public.orders")
    .option("user", creds["username"])
    .option("password", creds["password"])
    .load())
orders.write.mode("overwrite").parquet("s3://acme-lake-prod/silver/orders/")`}
        </Example>
      </LessonSection>

      <LessonSection title="Error handling and never logging values">
        <ContentStep number={1} title="Know the common exceptions">
          <p className="text-slate-300">
            <code className="text-core-400">ResourceNotFoundException</code> — wrong name, wrong Region, or
            secret scheduled for deletion. <code className="text-core-400">AccessDeniedException</code> — role
            lacks <code className="text-core-400">GetSecretValue</code> or a resource policy denies it.{' '}
            <code className="text-core-400">DecryptionFailure</code> — the role cannot use the KMS key. In SSM the
            missing-name error is <code className="text-core-400">ParameterNotFound</code>.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Fail fast with a useful message">
          <p className="text-slate-300">
            Log the secret <em>name</em>, the error code, and the Region — that is enough to debug IAM or
            naming issues. Do not retry AccessDenied in a loop; it will not fix itself. Throttling (
            <code className="text-core-400">ThrottlingException</code>) is the one worth backing off on.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Never print, log, or return the value">
          <p className="text-slate-300">
            No <code className="text-core-400">print(creds)</code>, no logging the full response dict, no
            putting the password into a Spark config that shows up in the Spark UI, and no returning it from a
            Lambda that feeds Step Functions history. CloudWatch Logs are readable by far more people than the
            secret is.
          </p>
        </ContentStep>
        <Example title="Defensive fetch helper" caption="Log names and error codes — never values">
{`import logging
from botocore.exceptions import ClientError

log = logging.getLogger()

def fetch_secret(secret_id: str) -> dict:
    try:
        resp = secrets.get_secret_value(SecretId=secret_id)
    except ClientError as e:
        code = e.response["Error"]["Code"]
        if code in ("ResourceNotFoundException", "AccessDeniedException", "DecryptionFailure"):
            log.error("Cannot read secret %s: %s", secret_id, code)
        raise
    return json.loads(resp["SecretString"])  # do NOT log this dict`}
        </Example>
        <Callout variant="insight">
          CloudTrail records that <code className="text-core-400">GetSecretValue</code> was called and by whom,
          but never the value. Your own logs are the most likely place for a leak — treat any log line
          containing a credential as an incident.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'get_secret_value returns SecretString — json.loads it; get_parameter needs WithDecryption=True for SecureString.',
          'get_parameters batches up to 10 names and reports missing ones in InvalidParameters instead of raising.',
          'Fetch at Lambda module scope or once on the Glue driver so warm invocations and executors reuse the value.',
          'Pass secret names or ARNs through env vars and job args — never the values themselves.',
          'Handle ResourceNotFound, AccessDenied, and DecryptionFailure by logging the name and code, never the secret.',
        ]}
      />
    </LessonArticle>
  )
}
