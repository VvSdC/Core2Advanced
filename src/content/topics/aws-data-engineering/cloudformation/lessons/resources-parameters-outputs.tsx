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

export function ResourcesParametersOutputs() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="The core trio">
        Every beginner CloudFormation template revolves around three sections:{' '}
        <strong className="text-white">Resources</strong> (what AWS builds),{' '}
        <strong className="text-white">Parameters</strong> (what you customize at deploy time), and{' '}
        <strong className="text-white">Outputs</strong> (what you read back after deploy). Master this
        triangle and you can read most DE lake baseline templates — even before intrinsics and nested stacks.
      </Callout>

      <Definition term="Resources, Parameters, Outputs">
        <p>
          <strong className="text-white">Resources</strong> declare AWS objects and their properties.{' '}
          <strong className="text-white">Parameters</strong> are typed inputs — environment name, bucket
          prefix, VPC ID — passed when creating or updating a stack.{' '}
          <strong className="text-white">Outputs</strong> expose selected values — bucket names, role ARNs,
          EventBridge rule names — to the console, CLI, or other stacks. Together they make one template
          reusable across dev, staging, and prod without copy-paste files.
        </p>
      </Definition>

      <LessonSection title="Resources — what gets created">
        <p className="text-slate-300">
          The <code className="text-core-400">Resources</code> section is mandatory. Each entry has a logical
          ID, a <code className="text-core-400">Type</code>, and usually{' '}
          <code className="text-core-400">Properties</code>. CloudFormation creates resources in dependency
          order — IAM roles referenced by Glue crawlers wait for the role to exist first.
        </p>
        <ContentStep number={1} title="Logical ID is local to the template">
          <p className="text-slate-300">
            <code className="text-core-400">GlueETLRole</code> is your name for referencing inside the
            template. AWS assigns the physical role name (often prefixed with the stack name).
          </p>
        </ContentStep>
        <ContentStep number={2} title="DE resources often travel together">
          <p className="text-slate-300">
            Raw bucket, curated bucket, Glue service role, IAM policy allowing{' '}
            <code className="text-core-400">s3:PutObject</code> on curated and{' '}
            <code className="text-core-400">s3:GetObject</code> on raw — declared as sibling resources in
            one stack.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Deletion follows the stack">
          <p className="text-slate-300">
            Deleting the stack deletes most resources by default. For stateful data (S3 with prod Parquet),
            teams use deletion policies or separate stacks — advanced topic; beginners should know deletion
            is stack-scoped.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Parameters — customize without editing the template">
        <p className="text-slate-300">
          Parameters turn a static blueprint into a reusable platform module. The deployer supplies values in
          the console, CLI, or CI pipeline — the template file on disk stays the same.
        </p>
        <ContentStep number={1} title="Common DE parameters">
          <p className="text-slate-300">
            <code className="text-core-400">EnvironmentName</code> (dev/staging/prod),{' '}
            <code className="text-core-400">ProjectPrefix</code> (acme-lake), optional{' '}
            <code className="text-core-400">KmsKeyArn</code> for SSE-KMS buckets, optional existing{' '}
            <code className="text-core-400">VpcId</code> for Glue connections in later modules.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Types and constraints">
          <p className="text-slate-300">
            Parameters have types (<code className="text-core-400">String</code>,{' '}
            <code className="text-core-400">Number</code>, <code className="text-core-400">CommaDelimitedList</code>)
            and optional <code className="text-core-400">AllowedValues</code> — restrict EnvironmentName to
            dev/staging/prod so nobody deploys <code className="text-core-400">prod-test-oops</code> to the
            production account by typo.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Defaults for sandboxes">
          <p className="text-slate-300">
            A default of <code className="text-core-400">dev</code> lets engineers quick-create a stack without
            passing every flag — prod pipelines still override explicitly in CI.
          </p>
        </ContentStep>
        <Example title="EnvironmentName parameter" caption="Typical lake baseline input">
{`Parameters:
  EnvironmentName:
    Type: String
    Default: dev
    AllowedValues:
      - dev
      - staging
      - prod
    Description: Deployment environment — drives bucket names and tags`}
        </Example>
      </LessonSection>

      <LessonSection title="Outputs — expose what operators need">
        <p className="text-slate-300">
          After <code className="text-core-400">CREATE_COMPLETE</code>, CloudFormation shows Outputs in the
          console and CLI. DE runbooks link smoke tests and Glue job configs to these values instead of
          hunting the S3 console.
        </p>
        <ContentStep number={1} title="Human-readable runbook values">
          <p className="text-slate-300">
            Output the raw bucket name, curated bucket name, and Glue role ARN — the three numbers every new
            DE hire copies into their first local test.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Export for cross-stack references">
          <p className="text-slate-300">
            <code className="text-core-400">Export</code> names let a separate ETL stack import the bucket
            name — nested stacks and exports get deeper coverage later; know Outputs are the handshake point.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Description field">
          <p className="text-slate-300">
            Always document what each output means —{' '}
            <code className="text-core-400">CuratedBucketName for silver Parquet writes</code> beats{' '}
            <code className="text-core-400">Bucket2</code>.
          </p>
        </ContentStep>
        <Example title="Outputs for a lake stack" caption="Values returned after deploy">
{`Outputs:
  RawBucketName:
    Description: S3 bucket for vendor CSV landing
    Value: !Ref RawLandingBucket
  CuratedBucketName:
    Description: S3 bucket for Parquet silver layer
    Value: !Ref CuratedBucket
  GlueETLRoleArn:
    Description: IAM role ARN for Glue jobs
    Value: !GetAtt GlueETLRole.Arn`}
        </Example>
        <Callout variant="insight">
          <code className="text-core-400">!Ref</code> and <code className="text-core-400">!GetAtt</code> are
          intrinsic functions linking sections — full lesson in the next module. Here, read them as
          &quot;pull the bucket reference&quot; and &quot;pull the role ARN attribute.&quot;
        </Callout>
      </LessonSection>

      <LessonSection title="How the three sections work together">
        <p className="text-slate-300">
          Parameters flow into Resource properties (bucket names, tags). Resources reference each other (IAM
          policy ARNs include bucket names from sibling resources). Outputs surface the final physical IDs
          for humans and downstream automation.
        </p>
        <Flowchart
          title="Parameters → Resources → Outputs"
          chart={`flowchart LR
  PARAM[Parameter EnvironmentName]
  PARAM --> RAW[Resource RawLandingBucket]
  PARAM --> CUR[Resource CuratedBucket]
  RAW --> POL[IAM Policy S3 paths]
  CUR --> POL
  POL --> ROLE[Resource GlueETLRole]
  RAW --> OUT1[Output RawBucketName]
  CUR --> OUT2[Output CuratedBucketName]
  ROLE --> OUT3[Output GlueETLRoleArn]`}
        />
        <ContentStep number={1} title="Deploy dev">
          <p className="text-slate-300">
            Pass <code className="text-core-400">EnvironmentName=dev</code>. Resources create{' '}
            <code className="text-core-400">acme-lake-raw-dev</code>. Outputs list names for Glue script
            smoke test.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Deploy prod — same template">
          <p className="text-slate-300">
            Pass <code className="text-core-400">EnvironmentName=prod</code>. Identical encryption and IAM
            shape; different bucket names and tags. No second YAML file drifting from dev.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Update parameter or resource">
          <p className="text-slate-300">
            Adding a lifecycle rule modifies Resources only. CI creates a change set; reviewer confirms S3
            update is in-place, not replacement — then executes update stack.
          </p>
        </ContentStep>
        <Callout variant="tip" title="Review order in pull requests">
          Read Parameters first (what can vary), Resources second (what changes), Outputs last (what
          downstream teams consume). Matches how operators troubleshoot live stacks.
        </Callout>
      </LessonSection>

      <LessonSection title="Beginner mistakes to avoid">
        <ContentStep number={1} title="Hardcoding prod names in Resources">
          <p className="text-slate-300">
            Put environment suffixes in Parameters + <code className="text-core-400">!Sub</code>, not literal{' '}
            <code className="text-core-400">acme-lake-raw-prod</code> in three places that will diverge.
          </p>
        </ContentStep>
        <ContentStep number={2} title="No Outputs">
          <p className="text-slate-300">
            Teams without Outputs grep CloudFormation events for physical IDs — slow and error-prone during
            incidents.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Parameters without AllowedValues">
          <p className="text-slate-300">
            Free-text environment names invite <code className="text-core-400">production</code> vs{' '}
            <code className="text-core-400">prod</code> split-brain in tagging and cost reports.
          </p>
        </ContentStep>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Resources (required) declare AWS objects; Parameters customize deploy inputs; Outputs expose bucket names, ARNs, and URLs after create.',
          'One template + EnvironmentName parameter replaces copy-pasted dev/prod YAML files.',
          'Parameters constrain allowed values; Outputs document handoff points for Glue jobs and runbooks.',
          'Data flows Parameters → Resource properties and cross-references → Outputs — the backbone of every DE platform template.',
        ]}
      />
    </LessonArticle>
  )
}
