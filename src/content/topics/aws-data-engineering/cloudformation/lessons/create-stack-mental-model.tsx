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

export function CreateStackMentalModel() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Template to live AWS">
        Creating a <strong className="text-white">stack</strong> is the moment your YAML leaves Git and
        becomes real S3 buckets, IAM roles, and Glue databases. CloudFormation walks a predictable lifecycle:
        validate template, resolve parameters, create resources in order, report success or roll back.
        Understanding that lifecycle prevents panic when a stack sits in{' '}
        <code className="text-core-400">CREATE_IN_PROGRESS</code> for ten minutes while IAM propagates.
      </Callout>

      <Definition term="Create stack">
        <p>
          <strong className="text-white">Create stack</strong> is the CloudFormation operation that takes a
          template (inline body or S3 URL), a stack name, parameter values, optional IAM capabilities, and
          optional tags — then provisions every resource in the{' '}
          <code className="text-core-400">Resources</code> section. The stack record tracks status, events,
          and physical IDs until you update or delete it.
        </p>
      </Definition>

      <LessonSection title="The create-stack lifecycle">
        <ContentStep number={1} title="Validate template">
          <p className="text-slate-300">
            CloudFormation checks syntax and resource types before creating anything. Invalid YAML or unknown
            property names fail fast with <code className="text-core-400">ValidationError</code> — fix locally
            with cfn-lint when possible.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Resolve parameters and capabilities">
          <p className="text-slate-300">
            You supply <code className="text-core-400">EnvironmentName=dev</code>. IAM resources with custom
            names may require acknowledging{' '}
            <code className="text-core-400">CAPABILITY_NAMED_IAM</code> — AWS warns before broad IAM creates.
          </p>
        </ContentStep>
        <ContentStep number={3} title="CREATE_IN_PROGRESS">
          <p className="text-slate-300">
            Resources appear one by one in the Events tab. S3 buckets often finish quickly; Glue crawlers or
            Lambda functions may take longer. Dependencies dictate order — policies after roles, roles after
            buckets they reference.
          </p>
        </ContentStep>
        <ContentStep number={4} title="CREATE_COMPLETE or ROLLBACK">
          <p className="text-slate-300">
            All resources healthy → <code className="text-core-400">CREATE_COMPLETE</code>. Any required
            resource fails → CloudFormation deletes what it already created and marks{' '}
            <code className="text-core-400">ROLLBACK_COMPLETE</code> — investigate the first{' '}
            <code className="text-core-400">CREATE_FAILED</code> event, fix template, delete failed stack,
            retry.
          </p>
        </ContentStep>
        <Flowchart
          title="Create stack state machine (simplified)"
          chart={`flowchart TD
  START[Submit template plus parameters]
  START --> VAL{Valid template?}
  VAL -->|No| ERR[ValidationError]
  VAL -->|Yes| PROG[CREATE_IN_PROGRESS]
  PROG --> RES[Create resources in order]
  RES --> OK{All succeeded?}
  OK -->|Yes| DONE[CREATE_COMPLETE]
  OK -->|No| RB[Rollback deletes partial]
  RB --> FAIL[ROLLBACK_COMPLETE]`}
        />
      </LessonSection>

      <LessonSection title="What you need before clicking Create">
        <ContentStep number={1} title="Template location">
          <p className="text-slate-300">
            Upload YAML in the console wizard, point to an S3 URL, or paste the body in CLI{' '}
            <code className="text-core-400">--template-body</code>. CI pipelines almost always use S3 or
            packaged artifacts.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Unique stack name">
          <p className="text-slate-300">
            Stack names are unique per Region/account —{' '}
            <code className="text-core-400">acme-lake-platform-dev</code> not{' '}
            <code className="text-core-400">test</code>.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Parameter values">
          <p className="text-slate-300">
            Match AllowedValues — pass prod only when targeting the prod account. Wrong account + prod
            parameters has caused real incidents.
          </p>
        </ContentStep>
        <ContentStep number={4} title="IAM permissions">
          <p className="text-slate-300">
            The deployer role needs CloudFormation plus pass-role and service permissions — creating Glue
            roles requires <code className="text-core-400">iam:PassRole</code> on the trust boundary your
            org allows.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Console vs CLI — two doors, same stack">
        <p className="text-slate-300">
          Beginners often start in the console; production pipelines use CLI or CI. Both invoke the same
          CloudFormation API.
        </p>
        <ContentStep number={1} title="Console — visual learning">
          <p className="text-slate-300">
            CloudFormation → Stacks → Create stack → choose template → enter parameters → watch Events tab.
            Ideal for first lake sandbox and understanding rollback behavior.
          </p>
        </ContentStep>
        <ContentStep number={2} title="CLI — repeatable automation">
          <p className="text-slate-300">
            <code className="text-core-400">aws cloudformation create-stack</code> with{' '}
            <code className="text-core-400">--template-file</code>,{' '}
            <code className="text-core-400">--parameters</code>, and{' '}
            <code className="text-core-400">--capabilities CAPABILITY_NAMED_IAM</code> — scriptable for GitHub
            Actions or CodePipeline.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Describe and wait">
          <p className="text-slate-300">
            <code className="text-core-400">aws cloudformation describe-stacks</code> and{' '}
            <code className="text-core-400">wait stack-create-complete</code> block CI until Outputs are
            ready for smoke tests.
          </p>
        </ContentStep>
        <Example title="CLI create-stack teaser" caption="Dev lake stack — illustrative">
{`aws cloudformation create-stack \\
  --stack-name acme-lake-platform-dev \\
  --template-file lake-baseline.yaml \\
  --parameters ParameterKey=EnvironmentName,ParameterValue=dev \\
  --capabilities CAPABILITY_NAMED_IAM

aws cloudformation wait stack-create-complete \\
  --stack-name acme-lake-platform-dev

aws cloudformation describe-stacks \\
  --stack-name acme-lake-platform-dev \\
  --query 'Stacks[0].Outputs'`}
        </Example>
        <Callout variant="tip" title="Events tab is your friend">
          When create hangs, refresh Events — the resource currently{' '}
          <code className="text-core-400">CREATE_IN_PROGRESS</code> tells you where to look (IAM vs S3 vs
          Glue). Do not restart blindly; read the failure reason on the first red event.
        </Callout>
      </LessonSection>

      <LessonSection title="After CREATE_COMPLETE — what operators do">
        <ContentStep number={1} title="Read Outputs">
          <p className="text-slate-300">
            Copy raw/curated bucket names and Glue role ARN into runbook or parameter store — Glue job scripts
            and smoke tests need them immediately.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Smoke test the platform">
          <p className="text-slate-300">
            Upload a test file to raw prefix, confirm IAM role can list and read, run a minimal Glue job or
            Lambda — validates template intent, not just green stack status.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Tag and cost allocate">
          <p className="text-slate-300">
            Stack-level tags propagate when configured — Environment, CostCenter, DataClassification for
            finance and compliance reports.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Updates and deletes — preview of next module">
        <p className="text-slate-300">
          Create stack is day one. Mature platforms spend more time on{' '}
          <strong className="text-white">update stack</strong> with change sets — preview IAM policy edits
          before prod. Delete stack removes resources; for buckets with prod data, teams use retention policies
          or remove resources from template before delete — covered in advanced lessons.
        </p>
        <Callout variant="insight">
          Mental model: stack = lifecycle wrapper. Template version in Git is intent; stack status in AWS is
          reality. Drift detection (manual console changes) is when intent and reality diverge — another reason
          IaC beats click-ops.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Create stack validates the template, applies parameters, creates resources in dependency order, then reaches CREATE_COMPLETE or rolls back.',
          'Prepare template source, unique stack name, parameter values, and IAM capabilities (often CAPABILITY_NAMED_IAM) before deploy.',
          'Console teaches the lifecycle; CLI/CI automates the same API for dev/prod pipelines.',
          'After success, read Outputs and smoke-test S3/IAM/Glue — green stack status alone does not prove the lake works.',
        ]}
      />
    </LessonArticle>
  )
}
