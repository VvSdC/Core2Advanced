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

export function CachingAndLambdaExtension() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Don’t ask for the same password a million times a day">
        A Lambda that processes every S3 object or every SQS message can run hundreds of times per second. If
        each invocation calls <code className="text-core-400">GetSecretValue</code>, you pay for every call,
        add latency to every record, and eventually hit API throttling. Caching keeps a copy in memory for a
        short time — and the tricky part is doing that without breaking when the secret rotates.
      </Callout>

      <Definition term="Secret caching">
        <p>
          Keeping a retrieved secret or parameter in process memory (or in a local sidecar) with a time-to-live
          (TTL), so repeated reads within the TTL skip the AWS API. Options range from a hand-written module
          cache to the <code className="text-core-400">aws-secretsmanager-caching</code> library, Powertools
          for AWS Lambda, and the AWS Parameters and Secrets Lambda Extension.
        </p>
      </Definition>

      <LessonSection title="Why caching matters at pipeline scale">
        <ContentStep number={1} title="Cost and throttling">
          <p className="text-slate-300">
            Secrets Manager charges per 10,000 API calls, and Parameter Store standard throughput has a low
            default TPS limit unless you enable higher throughput (which is billed). A burst from an SQS-driven
            ingest Lambda can produce <code className="text-core-400">ThrottlingException</code> and failed
            batches that have nothing to do with your data.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Module-level cache with TTL">
          <p className="text-slate-300">
            The simplest fix: store the value and a timestamp at module scope. Warm invocations reuse it; after
            the TTL (say 5 minutes) the next call refreshes. A TTL — rather than caching forever — bounds how long
            a warm container keeps using a rotated-out password.
          </p>
        </ContentStep>
        <Example title="Hand-rolled TTL cache" caption="Good enough for many single-secret Lambdas">
{`import json, time, boto3

_sm = boto3.client("secretsmanager")
_cache: dict[str, tuple[float, dict]] = {}
TTL_SECONDS = 300

def get_secret(secret_id: str, force_refresh: bool = False) -> dict:
    now = time.time()
    hit = _cache.get(secret_id)
    if hit and not force_refresh and now - hit[0] < TTL_SECONDS:
        return hit[1]
    value = json.loads(_sm.get_secret_value(SecretId=secret_id)["SecretString"])
    _cache[secret_id] = (now, value)
    return value`}
        </Example>
      </LessonSection>

      <LessonSection title="Libraries — caching client and Powertools">
        <ContentStep number={1} title="aws-secretsmanager-caching">
          <p className="text-slate-300">
            AWS&apos;s Python caching client wraps a boto3 client. <code className="text-core-400">SecretCache</code>{' '}
            refreshes entries in the background after <code className="text-core-400">secret_refresh_interval</code>{' '}
            (default one hour). Shorten that interval if your rotation strategy gives old credentials only a short
            overlap. Works in Lambda, Glue Python shell, ECS, anywhere.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Powertools parameters utility">
          <p className="text-slate-300">
            Powertools for AWS Lambda (Python) offers <code className="text-core-400">get_secret</code>,{' '}
            <code className="text-core-400">get_parameter</code>, and <code className="text-core-400">get_parameters</code>{' '}
            (by path) with built-in <code className="text-core-400">max_age</code> caching,{' '}
            <code className="text-core-400">transform=&quot;json&quot;</code> parsing, and{' '}
            <code className="text-core-400">force_fetch=True</code> to bypass the cache.
          </p>
        </ContentStep>
        <Example title="Caching client and Powertools side by side" caption="Pick one per codebase">
{`# Option A: aws-secretsmanager-caching
import boto3
from aws_secretsmanager_caching import SecretCache, SecretCacheConfig

cache = SecretCache(
    config=SecretCacheConfig(secret_refresh_interval=900),
    client=boto3.client("secretsmanager"),
)
creds_json = cache.get_secret_string("de/prod/rds/orders-reader")

# Option B: Powertools for AWS Lambda
from aws_lambda_powertools.utilities import parameters

creds = parameters.get_secret("de/prod/rds/orders-reader", transform="json", max_age=300)
config = parameters.get_parameters("/de/prod/orders", decrypt=True, max_age=300)
batch_size = int(config["batch_size"])   # keys are relative to the path`}
        </Example>
      </LessonSection>

      <LessonSection title="The Parameters and Secrets Lambda Extension">
        <ContentStep number={1} title="A local cache over HTTP">
          <p className="text-slate-300">
            Add the AWS-provided <strong className="text-white">AWS Parameters and Secrets Lambda Extension</strong>{' '}
            layer. It runs alongside your function and serves cached values from{' '}
            <code className="text-core-400">http://localhost:2773</code>. Because it is plain HTTP, it works the
            same from Python, Node.js, Java, or a shell script — no SDK caching code in your function.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Authentication header and settings">
          <p className="text-slate-300">
            Every request must send header <code className="text-core-400">X-Aws-Parameters-Secrets-Token</code>{' '}
            set to the function&apos;s <code className="text-core-400">AWS_SESSION_TOKEN</code> environment
            variable. Tune with <code className="text-core-400">SECRETS_MANAGER_TTL</code> and{' '}
            <code className="text-core-400">SSM_PARAMETER_STORE_TTL</code> (seconds, default 300). The execution
            role still needs <code className="text-core-400">GetSecretValue</code>,{' '}
            <code className="text-core-400">GetParameter</code>, and <code className="text-core-400">kms:Decrypt</code>.
          </p>
        </ContentStep>
        <Flowchart
          title="Lambda extension cache path"
          chart={`flowchart LR
  H[Lambda handler]
  EXT[Extension localhost 2773]
  C[Cache fresh check]
  SM[Secrets Manager]
  SSM[Parameter Store]
  H -->|HTTP GET with token| EXT
  EXT --> C
  C -->|yes| H
  C -->|no| SM
  C -->|no| SSM
  SM --> EXT
  SSM --> EXT`}
        />
        <Example title="Calling the extension from Python" caption="Call from the handler — the extension may not be ready during init">
{`import json, os, urllib.parse, urllib.request

HEADERS = {"X-Aws-Parameters-Secrets-Token": os.environ["AWS_SESSION_TOKEN"]}
BASE = "http://localhost:2773"

def _get(path: str) -> dict:
    req = urllib.request.Request(BASE + path, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=2) as resp:
        return json.loads(resp.read())

def handler(event, context):
    sid = urllib.parse.quote("de/prod/rds/orders-reader", safe="")
    secret = json.loads(_get(f"/secretsmanager/get?secretId={sid}")["SecretString"])
    name = urllib.parse.quote("/de/prod/orders/batch_size", safe="")
    param = _get(f"/systemsmanager/parameters/get?name={name}&withDecryption=true")
    batch_size = int(param["Parameter"]["Value"])
    ...`}
        </Example>
        <ContentStep number={3} title="Rotation and caches">
          <p className="text-slate-300">
            Any cache can hand you a password that was just rotated out. Keep the TTL shorter than the overlap
            your rotation strategy provides (alternating users helps a lot), and on an authentication failure
            bypass the cache once — <code className="text-core-400">force_refresh</code>,{' '}
            <code className="text-core-400">force_fetch=True</code>, or a direct boto3 call — before retrying.
          </p>
        </ContentStep>
        <Callout variant="tip">
          For Glue Spark jobs, caching rarely matters: fetch once on the driver. Caching is a Lambda and
          container concern, where the same code path runs thousands of times per hour.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'High-rate Lambdas calling GetSecretValue per invocation waste money and risk ThrottlingException.',
          'A module-level cache with a TTL is the simplest fix and bounds staleness after rotation.',
          'aws-secretsmanager-caching and Powertools parameters add refresh intervals, JSON transforms, and forced refresh.',
          'The Parameters and Secrets Lambda Extension serves cached values on localhost:2773 using the AWS_SESSION_TOKEN header.',
          'Tune SECRETS_MANAGER_TTL and SSM_PARAMETER_STORE_TTL, and bypass the cache once on auth failure.',
        ]}
      />
    </LessonArticle>
  )
}
