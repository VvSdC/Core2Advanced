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

export function ParameterHierarchiesAndEnvironments() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Folders for config — same shape in dev, staging, and prod">
        Parameter Store names can look like file paths:{' '}
        <code className="text-core-400">/de/prod/orders/batch_size</code>. If every environment uses the same
        folder layout and only the environment segment changes, one pipeline codebase can run anywhere by
        swapping a single prefix — and IAM can lock each role to just its own folder.
      </Callout>

      <Definition term="Parameter hierarchy">
        <p>
          A naming convention where parameter names are slash-separated paths (up to 15 levels deep). SSM treats
          each prefix as a queryable path: <code className="text-core-400">GetParametersByPath</code> returns
          everything under <code className="text-core-400">/de/prod/orders</code>, and IAM policies can grant
          access to <code className="text-core-400">parameter/de/prod/*</code> without listing individual
          names.
        </p>
      </Definition>

      <LessonSection title="Designing the path">
        <ContentStep number={1} title="Pattern: /de/env/pipeline/key">
          <p className="text-slate-300">
            A proven layout is <code className="text-core-400">/de/prod/orders/batch_size</code>: team or
            domain, then environment, then pipeline, then key. Environment high in the path means one IAM
            statement covers all prod config; pipeline next means one{' '}
            <code className="text-core-400">GetParametersByPath</code> loads all config for{' '}
            <code className="text-core-400">orders-silver-etl</code>.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Shared vs pipeline-specific keys">
          <p className="text-slate-300">
            Values used by many pipelines — lake bucket name, Glue database — live in a shared folder like{' '}
            <code className="text-core-400">/de/prod/shared/lake_bucket</code>. Keep pipeline keys under the
            pipeline so deleting a retired pipeline is a single path cleanup.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Environment parity">
          <p className="text-slate-300">
            Every key that exists under <code className="text-core-400">/de/prod/orders/</code> should exist under{' '}
            <code className="text-core-400">/de/dev/orders/</code> and{' '}
            <code className="text-core-400">/de/staging/orders/</code>, even if dev values are small. A missing
            key in prod is a deploy-day surprise; a CI check that diffs key names across environments catches it
            early.
          </p>
        </ContentStep>
        <Flowchart
          title="One hierarchy, three environments"
          chart={`flowchart TB
  ROOT[de root]
  ROOT --> DEV[dev]
  ROOT --> STG[staging]
  ROOT --> PRD[prod]
  PRD --> ORD[orders]
  PRD --> SHR[shared]
  ORD --> BS[batch_size]
  ORD --> SRC[source_table]
  ORD --> TOK[api_token SecureString]
  SHR --> LB[lake_bucket]
  DEV --> DORD[orders same keys]
  STG --> SORD[orders same keys]`}
        />
      </LessonSection>

      <LessonSection title="Loading a whole path in code">
        <ContentStep number={1} title="GetParametersByPath with Recursive">
          <p className="text-slate-300">
            <code className="text-core-400">Recursive=True</code> walks every level below the path. Results are
            paginated (10 per page by default), so always use the paginator. Add{' '}
            <code className="text-core-400">WithDecryption=True</code> if any SecureString values live below it.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Env comes from one variable">
          <p className="text-slate-300">
            The job reads <code className="text-core-400">ENV=prod</code> from an environment variable or Glue
            argument and builds the prefix. Nothing else in the code mentions an environment name — that is what
            makes promoting from staging to prod boring.
          </p>
        </ContentStep>
        <Example title="Load all config for a pipeline" caption="Strip the prefix to get short keys">
{`import os
import boto3

ssm = boto3.client("ssm")
env = os.environ["ENV"]                    # dev | staging | prod
prefix = f"/de/{env}/orders/"

config = {}
for page in ssm.get_paginator("get_parameters_by_path").paginate(
    Path=prefix, Recursive=True, WithDecryption=True
):
    for p in page["Parameters"]:
        config[p["Name"][len(prefix):]] = p["Value"]

batch_size = int(config["batch_size"])     # values are always strings`}
        </Example>
      </LessonSection>

      <LessonSection title="IAM scope, versions, labels, and tags">
        <ContentStep number={1} title="Scope roles to path ARNs">
          <p className="text-slate-300">
            A prod Glue role gets <code className="text-core-400">ssm:GetParametersByPath</code> and{' '}
            <code className="text-core-400">ssm:GetParameter*</code> on{' '}
            <code className="text-core-400">arn:aws:ssm:us-east-1:111122223333:parameter/de/prod/*</code>. The
            dev role gets <code className="text-core-400">parameter/de/dev/*</code>. A dev job can then never
            read prod config — even if someone copies the wrong ENV value.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Versions and labels for safe rollout">
          <p className="text-slate-300">
            Every <code className="text-core-400">PutParameter</code> with{' '}
            <code className="text-core-400">Overwrite=True</code> creates a new version. Attach a label such as{' '}
            <code className="text-core-400">approved</code> to a tested version and have prod read{' '}
            <code className="text-core-400">/de/prod/orders/batch_size:approved</code>. Rolling back is moving the
            label, not editing the value under pressure. You can also pin a version with a{' '}
            <code className="text-core-400">:3</code> suffix.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Same conventions for secrets">
          <p className="text-slate-300">
            Secrets Manager names follow the same idea without the leading slash:{' '}
            <code className="text-core-400">de/prod/rds/orders-reader</code>,{' '}
            <code className="text-core-400">de/prod/redshift/loader</code>. Consistent prefixes let you write IAM
            like <code className="text-core-400">secret:de/prod/*</code> and spot misplaced secrets at a glance.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Tag owner, pipeline, env">
          <p className="text-slate-300">
            Tag every parameter and secret with <code className="text-core-400">owner</code>,{' '}
            <code className="text-core-400">pipeline</code>, and <code className="text-core-400">env</code>. Tags
            power cost reports, cleanup of orphaned values, and attribute-based access control covered in the
            IAM lesson.
          </p>
        </ContentStep>
        <Example title="CLI — version, label, and tag" caption="Promote a tested value by label">
{`aws ssm put-parameter --name /de/prod/orders/batch_size \\
  --type String --value 5000 --overwrite

aws ssm label-parameter-version --name /de/prod/orders/batch_size \\
  --parameter-version 4 --labels approved

aws ssm add-tags-to-resource --resource-type Parameter \\
  --resource-id /de/prod/orders/batch_size \\
  --tags Key=owner,Value=data-platform Key=pipeline,Value=orders Key=env,Value=prod

aws ssm get-parameter --name /de/prod/orders/batch_size:approved`}
        </Example>
        <Callout variant="tip">
          Labels cannot start with a number and a label points to only one version of a parameter at a time —
          moving <code className="text-core-400">approved</code> to version 5 automatically removes it from
          version 4.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Use /de/env/pipeline/key paths — environment high in the path makes IAM and promotion simple.',
          'get_parameters_by_path with Recursive=True and a paginator loads a pipeline’s whole config in one loop.',
          'Keep identical key names across dev, staging, and prod; only the env segment and values differ.',
          'Scope IAM to path ARNs like parameter/de/prod/* so dev roles can never read prod values.',
          'Versions plus labels give safe rollout and instant rollback; tag owner, pipeline, and env everywhere.',
        ]}
      />
    </LessonArticle>
  )
}
