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

export function LayersIntro() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="When boto3 is not enough">
        The Python runtime includes boto3, but most DE transforms need{' '}
        <strong className="text-white">pandas</strong>, <strong className="text-white">pyarrow</strong>,
        or custom wheels. Lambda Layers let you attach shared dependency bundles to one or many functions
        without stuffing a 50 MB zip into every deployment — cleaner pipelines and faster iteration on
        handler code alone.
      </Callout>

      <Definition term="Lambda Layer">
        <p>
          A <strong className="text-white">Lambda Layer</strong> is a zip archive published separately
          from your function code, containing libraries or binaries in paths the runtime expects (for
          Python: <code className="text-core-400">python/lib/python3.12/site-packages/</code>). You
          attach layers to a function; at cold start Lambda mounts them alongside your handler zip.
        </p>
        <p className="mt-2 text-slate-300">
          Think of layers as <span className="text-core-400">shared site-packages you maintain once</span>{' '}
          — ten ingestion functions reuse the same pandas+pyarrow layer instead of ten duplicate zips.
        </p>
      </Definition>

      <LessonSection title="Why packaging matters for DE">
        <ContentStep number={1} title="Deployment package limits">
          <p className="text-slate-300">
            Direct-upload zips are capped at 50 MB compressed (250 MB uncompressed). pandas, numpy, and
            pyarrow together often exceed comfortable sizes — especially when built on the wrong OS
            architecture. Layers and S3-based deployments exist to stay within limits.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Build on Linux">
          <p className="text-slate-300">
            Lambda runs Amazon Linux. Wheels compiled on Windows or macOS may fail with import errors.
            Build layers in Docker (<code className="text-core-400">public.ecr.aws/lambda/python:3.12</code>),
            CI on Amazon Linux, or use managed layer ARNs from trusted publishers for common stacks.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Separate code from dependencies">
          <p className="text-slate-300">
            Ship a small handler zip (your <code className="text-core-400">app.py</code> and helpers)
            that changes daily, and a slow-changing layer with heavy libs. Deploy handler updates in
            seconds without re-uploading 80 MB of numpy every time you fix a log message.
          </p>
        </ContentStep>
        <Flowchart
          title="Function zip + layer at runtime"
          chart={`flowchart TB
  subgraph Deploy["What you publish"]
    Z[Handler zip — app.py logic]
    L[Layer zip — pandas pyarrow]
  end
  subgraph Runtime["Lambda execution environment"]
    M[Mounted /opt/python site-packages]
    H[Your handler module]
  end
  Z --> H
  L --> M
  H --> M`}
        />
      </LessonSection>

      <LessonSection title="Using layers in practice">
        <ContentStep number={1} title="Attach up to five layers">
          <p className="text-slate-300">
            Order matters when paths overlap — later layers can shadow earlier ones. Typical DE stack: one
            layer for scientific Python, optional second for internal shared utilities (validation
            schemas, key naming helpers).
          </p>
        </ContentStep>
        <ContentStep number={2} title="Versioning">
          <p className="text-slate-300">
            Each layer publish creates an immutable version. Functions pin layer version numbers in IaC so
            upgrading pandas is a deliberate change — roll forward in dev, then bump prod function
            configs.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Alternatives when layers are not enough">
          <p className="text-slate-300">
            Container images package OS libs + Python deps up to 10 GB — common for heavy ML or custom
            C extensions. Managed services (Glue) skip packaging entirely for Spark. Choose layers for
            mid-weight Python ETL on Lambda.
          </p>
        </ContentStep>
        <Example title="Layer directory layout (Python 3.12)" caption="Contents of layer.zip">
{`python/
  lib/
    python3.12/
      site-packages/
        pandas/
        pyarrow/
        numpy/
        ...`}
        </Example>
        <Example title="Import after layer attach" caption="Handler unchanged — imports just work">
{`import pandas as pd
import pyarrow as pa
import boto3  # still from runtime, not layer

def lambda_handler(event, context):
    df = pd.read_csv(...)
    # write Parquet to S3 with pyarrow
    ...`}
        </Example>
        <Callout variant="tip" title="Cold start trade-off">
          Larger layers increase cold start time — AWS extracts and mounts more bytes on first invoke.
          Shared layer amortizes that cost across functions but still plan warm-up tests for latency-sensitive
          paths.
        </Callout>
      </LessonSection>

      <LessonSection title="Packaging checklist for DE beginners">
        <ContentStep number={1} title="Start without layers">
          <p className="text-slate-300">
            Prove handler + boto3 + env vars + role on a trivial S3 copy. Add pandas only when the lesson
            requires it — fewer moving parts while learning events and IAM.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Add one layer for shared deps">
          <p className="text-slate-300">
            Build pandas/pyarrow once; attach to every raw-zone validator in the account. Document the
            layer ARN and version in your team README or Terraform module.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Never commit secrets into layers">
          <p className="text-slate-300">
            Layers are read-only library storage — not a place for config files with passwords. Same rule
            as env vars: secrets via Secrets Manager at runtime.
          </p>
        </ContentStep>
        <Callout variant="insight">
          Packaging is where junior DE projects stall on Lambda. Master layers (or containers) early and
          you treat Lambda like any other Python project — import what you need, test on Linux builds,
          deploy reproducibly.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Layers = shared dependency zips mounted at /opt — reuse pandas/pyarrow across functions.',
          'Build on Amazon Linux (Docker/CI); Windows-built wheels often break in Lambda.',
          'Keep handler zip small and fast-deploying; pin layer versions in IaC for controlled upgrades.',
          'Watch package size limits and cold starts — containers or Glue when deps exceed layer comfort zone.',
        ]}
      />
    </LessonArticle>
  )
}
