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

export function FunctionHandlerRuntime() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Three names on every Lambda console screen">
        When you create a function, three settings define how AWS runs your code: the{' '}
        <strong className="text-white">function</strong> (the deployed resource), the{' '}
        <strong className="text-white">handler</strong> (which function Python entry point to call), and
        the <strong className="text-white">runtime</strong> (which Python version AWS provides). Data
        engineers live in these three fields before touching triggers or IAM.
      </Callout>

      <Definition term="Function, handler, and runtime">
        <p>
          A <strong className="text-white">Lambda function</strong> is the AWS resource — name, ARN,
          configuration, and uploaded code package. The <strong className="text-white">handler</strong>{' '}
          is a string pointing to your entry function:{' '}
          <code className="text-core-400">filename.function_name</code>. The{' '}
          <strong className="text-white">runtime</strong> is the managed language environment — e.g.{' '}
          <code className="text-core-400">python3.12</code> — including the standard library and AWS
          SDK (boto3) available without you installing the interpreter.
        </p>
      </Definition>

      <LessonSection title="The function — your deployed unit">
        <ContentStep number={1} title="What you upload">
          <p className="text-slate-300">
            A <strong className="text-white">deployment package</strong>: a .zip or container image
            containing your <code className="text-core-400">.py</code> files and third-party wheels if
            needed. For beginner DE handlers, often one file plus boto3 (included in the runtime) is
            enough.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Configuration travels with the resource">
          <p className="text-slate-300">
            Memory, timeout, environment variables, execution role, and layers are properties of the
            function — not embedded in the zip. Change timeout in the Console or IaC without rebuilding
            code unless logic changes.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Naming for pipelines">
          <p className="text-slate-300">
            Use names that say what and where:{' '}
            <code className="text-core-400">de-s3-raw-csv-validator</code>,{' '}
            <code className="text-core-400">de-glue-starter-nightly</code>. One function per clear
            responsibility — easier IAM scoping and log filtering in CloudWatch.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="The handler — entry point AWS calls">
        <p className="text-slate-300">
          Every invocation, AWS loads your deployment package and calls the handler function once. The
          handler must accept two arguments — <code className="text-core-400">event</code> and{' '}
          <code className="text-core-400">context</code> — and return a serializable value (often a dict
          or None). The next lesson goes deep on event and context; here we focus on structure.
        </p>
        <Example title="Minimal Python handler" caption="app.py — logs S3 event keys from a future trigger">
{`import json
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def lambda_handler(event, context):
    """
    Entry point — set handler to: app.lambda_handler
    event: dict from the service that invoked Lambda (e.g. S3 notification)
    context: runtime info (request ID, remaining time) — see next lesson
    """
    logger.info("Received event: %s", json.dumps(event))

    # Example: S3 event records (structure preview)
    for record in event.get("Records", []):
        bucket = record["s3"]["bucket"]["name"]
        key = record["s3"]["object"]["key"]
        logger.info("Would process s3://%s/%s", bucket, key)

    return {"statusCode": 200, "processed": len(event.get("Records", []))}`}
        </Example>
        <ContentStep number={1} title="Handler string in the Console">
          <p className="text-slate-300">
            File <code className="text-core-400">app.py</code> at the zip root + function{' '}
            <code className="text-core-400">lambda_handler</code> → handler value{' '}
            <code className="text-core-400">app.lambda_handler</code>. If the file lives in a subfolder,
            include the path: <code className="text-core-400">src/processor.lambda_handler</code>.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Return value and errors">
          <p className="text-slate-300">
            Uncaught exceptions fail the invocation — CloudWatch logs the stack trace, and the trigger
            may retry (S3 → Lambda retries on failure by default). Return explicit status dicts when
            building API Gateway handlers; for S3-triggered ETL, logging plus clean exceptions is often
            enough.
          </p>
        </ContentStep>
        <Flowchart
          title="One invocation lifecycle"
          chart={`flowchart LR
  T[Trigger fires]
  T --> L[Lambda service]
  L --> C[Cold or warm container]
  C --> H[Call handler event context]
  H --> B[boto3 S3 read/write]
  H --> R[Return or raise]
  R --> LOG[CloudWatch Logs]`}
        />
      </LessonSection>

      <LessonSection title="The runtime — Python focus for DE">
        <ContentStep number={1} title="Managed Python versions">
          <p className="text-slate-300">
            Choose a supported runtime (e.g. Python 3.11 or 3.12). AWS maintains security updates; you
            pick the version that matches local dev and wheel compatibility. Deprecated runtimes block
            new deployments — plan upgrades in non-prod first.
          </p>
        </ContentStep>
        <ContentStep number={2} title="boto3 is already there">
          <p className="text-slate-300">
            Lambda Python runtimes include boto3 and botocore. Your handler can{' '}
            <code className="text-core-400">import boto3</code> and call S3, Glue, or SNS without
            bundling the SDK — ideal for lake I/O from day one.
          </p>
        </ContentStep>
        <ContentStep number={3} title="What is not in the runtime">
          <p className="text-slate-300">
            pandas, pyarrow, and heavy scientific stacks are <em>not</em> preinstalled. Add them to your
            zip or use a Layer (next lessons). For pure boto3 transforms (copy object, head metadata,
            start Glue), the base runtime is enough.
          </p>
        </ContentStep>
        <Callout variant="tip" title="Match local and Lambda Python">
          Develop with the same major.minor Python version locally when packaging deps. A wheel built for
          3.12 on your laptop may fail on a 3.11 runtime if you mismatch versions.
        </Callout>
        <Callout variant="insight">
          The handler signature <code className="text-core-400">(event, context)</code> is convention across
          AWS docs and this course. Other languages use different names, but Python DE examples almost
          always use <code className="text-core-400">lambda_handler</code>.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Function = AWS resource + zip/image; handler = module.function string; runtime = managed Python version.',
          'Handler receives (event, context), runs your DE logic, returns or raises — boto3 included in Python runtimes.',
          'Set handler to app.lambda_handler when app.py defines lambda_handler at zip root.',
          'Heavy libs (pandas, pyarrow) need packaging or Layers — not bundled in the base runtime.',
        ]}
      />
    </LessonArticle>
  )
}
