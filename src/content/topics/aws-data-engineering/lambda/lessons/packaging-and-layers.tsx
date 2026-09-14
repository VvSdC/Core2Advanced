import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function PackagingAndLayers() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="What you zip determines cold starts and deploy speed">
        Lambda runs your code from a <strong className="text-white">deployment package</strong> — a ZIP
        uploaded to S3 or built inline. Data engineering functions often need pandas, pyarrow, or internal
        libraries — packaging strategy (ZIP layout, layers, container images) directly affects the 250 MB
        limit and InitDuration.
      </Callout>

      <Definition term="Deployment package">
        <p>
          The <strong className="text-white">deployment package</strong> contains handler code and
          optionally dependencies. For Python, dependencies install into the package root so imports resolve
          at runtime. Maximum 50 MB zipped direct upload; 250 MB unzipped total including layers. Larger
          workloads use S3 upload or container images (up to 10 GB).
        </p>
      </Definition>

      <LessonSection title="Packaging dependencies">
        <ContentStep number={1} title="pip install target layout">
          <p className="text-slate-300">
            Build in Amazon Linux 2/2023 environment (Docker or CI) matching Lambda runtime:
          </p>
          <Example title="Build script pattern">
{`pip install -r requirements.txt -t package/
cp -r src/handler.py package/
cd package && zip -r ../deploy.zip .`}
          </Example>
          <p className="mt-3 text-slate-300">
            Manylinux wheels for numpy/pandas must match Lambda&apos;s glibc — building on Mac/Windows
            without Docker often produces broken native extensions.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Slim handler package">
          <p className="text-slate-300">
            Keep <span className="font-mono text-sm">deploy.zip</span> to handler + small local modules
            only. Move pandas/pyarrow to a layer. Faster uploads, clearer separation between app logic and
            dependency versions.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Container image alternative">
          <p className="text-slate-300">
            For deps exceeding layer limits (full Spark client, heavy ML stack), package as{' '}
            <strong className="text-white">Lambda container image</strong> from AWS base Python image.
            Same 15-minute timeout — not a runtime extension. DE teams use sparingly when layers cannot
            fit pyarrow + custom C libs.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Layer creation overview">
        <Definition term="Layer build structure">
          <p>
            Python layers use path <span className="font-mono text-sm">python/lib/python3.12/site-packages/</span>{' '}
            inside the ZIP. At runtime Lambda mounts layers under{' '}
            <span className="font-mono text-sm">/opt</span> — imports resolve automatically.
          </p>
        </Definition>
        <ContentStep number={1} title="Publish org layer">
          <p className="text-slate-300">
            CI job builds <span className="font-mono text-sm">deps-layer.zip</span>, publishes with{' '}
            <span className="font-mono text-sm">PublishLayerVersion</span>, outputs LayerVersionArn.
            Functions reference ARN; updating layer does not auto-update functions — pin or automate
            attachment in IaC.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Multiple layers">
          <p className="text-slate-300">
            Stack up to five: e.g. (1) AWS SDK extras, (2) pandas/pyarrow, (3){' '}
            <span className="font-mono text-sm">lake_utils</span> internal SDK. Order matters for file
            overrides — later layers shadow earlier paths on conflict.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Version and rollback">
          <p className="text-slate-300">
            Layer versions are immutable. Roll back functions to previous layer version ARN alongside
            function alias rollback — test layer upgrades in staging alias first.
          </p>
        </ContentStep>
        <Example title="Layer directory layout">
{`layer/
  python/
    lib/
      python3.12/
        site-packages/
          pandas/
          pyarrow/`}
        </Example>
        <Callout variant="insight">
          AWS publishes public layers (e.g. AWS SDK extensions, Lambda Powertools) — prefer maintained
          public layers over rebuilding common deps yourself.
        </Callout>
      </LessonSection>

      <LessonSection title="CI/CD packaging checklist">
        <ContentStep number={1} title="Reproducible builds">
          <p className="text-slate-300">
            Pin <span className="font-mono text-sm">requirements.txt</span> hashes; build in Docker
            matching Lambda runtime tag. Store artifact in S3 versioned bucket per deploy.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Size audit">
          <p className="text-slate-300">
            Fail CI if unzipped size approaches 250 MB. Strip tests, <span className="font-mono text-sm">*.dist-info</span>{' '}
            where safe, exclude boto3/botocore (already in runtime — though pinning versions sometimes
            requires bundling).
          </p>
        </ContentStep>
        <ContentStep number={3} title=".dockerignore / .zipignore">
          <p className="text-slate-300">
            Exclude <span className="font-mono text-sm">__pycache__</span>, <span className="font-mono text-sm">.git</span>, notebooks,
            sample data files — accidental 50 MB test CSV in the ZIP has happened in real pipelines.
          </p>
        </ContentStep>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Build deployment packages on Amazon Linux matching Lambda runtime — native wheels break cross-platform builds.',
          'Keep handler ZIP slim; move heavy deps to layers (python/lib/python3.12/site-packages layout).',
          '250 MB unzipped limit includes all layers — audit size in CI; container images for exceptional deps.',
          'Layer versions are immutable — pin ARNs; roll back with function alias repointing.',
          'Exclude tests, cache, and sample data from ZIPs — accidental bloat slows every cold start.',
        ]}
      />
    </LessonArticle>
  )
}
