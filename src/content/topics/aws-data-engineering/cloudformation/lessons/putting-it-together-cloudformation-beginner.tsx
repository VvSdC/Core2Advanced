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

export function PuttingItTogetherCloudformationBeginner() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Checkpoint before intrinsics and nested stacks">
        You now know why IaC beats console-only lake builds, what CloudFormation templates and stacks are,
        how YAML declares <code className="text-core-400">AWS::</code> resources, how Parameters and Outputs
        pair with Resources, and the create-stack lifecycle from template submit to{' '}
        <code className="text-core-400">CREATE_COMPLETE</code>. This lesson ties those threads into a{' '}
        <strong className="text-white">beginner CloudFormation checklist</strong> — the mental model you need
        before intrinsic functions, change sets, and nested platform stacks in the next module.
      </Callout>

      <Definition term="Beginner CloudFormation mental model">
        <p>
          A <strong className="text-white">beginner CloudFormation mental model</strong> for DE includes:
          templates in Git describing lake buckets and Glue IAM; Parameters for environment name; Outputs for
          bucket names and role ARNs; stacks as live deployed instances per account/Region; create-stack with
          rollback on failure; and platform templates that optionally add VPC endpoints, EventBridge rules,
          and alarms — all before hands-on intrinsics and multi-stack labs.
        </p>
      </Definition>

      <LessonSection title="Architecture checklist — can you draw this?">
        <ContentStep number={1} title="Template in Git with clear sections">
          <p className="text-slate-300">
            Header, Parameters (<code className="text-core-400">EnvironmentName</code>), Resources (S3, IAM,
            Glue), Outputs (bucket names, role ARN) — reviewed in pull requests like application code.
          </p>
        </ContentStep>
        <ContentStep number={2} title="One template, three stacks">
          <p className="text-slate-300">
            <code className="text-core-400">acme-lake-dev</code>,{' '}
            <code className="text-core-400">acme-lake-staging</code>,{' '}
            <code className="text-core-400">acme-lake-prod</code> — same YAML, different parameter values, no
            silent prod-only bucket settings.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Lake resources with DE defaults">
          <p className="text-slate-300">
            Versioning, encryption, public access block on raw and curated buckets; Glue role scoped to those
            ARNs — not AdminAccess for ETL convenience.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Create stack lifecycle understood">
          <p className="text-slate-300">
            Expect <code className="text-core-400">CREATE_IN_PROGRESS</code>, read Events on failure, know
            rollback deletes partial resources — fix template, delete failed stack, redeploy.
          </p>
        </ContentStep>
        <ContentStep number={5} title="Outputs wired to runbooks">
          <p className="text-slate-300">
            Smoke tests and Glue job args pull from stack Outputs — not stale wiki bucket names from last
            quarter.
          </p>
        </ContentStep>
        <Flowchart
          title="Beginner DE IaC stack"
          chart={`flowchart TD
  GIT[Template in Git]
  GIT --> DEV[Stack dev]
  GIT --> PRD[Stack prod]
  DEV --> S3D[S3 raw curated dev]
  PRD --> S3P[S3 raw curated prod]
  S3D --> IAMD[Glue role dev]
  S3P --> IAMP[Glue role prod]
  IAMD --> OUTD[Outputs to runbook]
  IAMP --> OUTP[Outputs to runbook]
  OUTD --> SMK[Smoke test upload]
  OUTP --> SMK2[Prod change set first]`}
        />
      </LessonSection>

      <LessonSection title="Self-check — can you explain these?">
        <ContentStep number={1} title="What is IaC in one sentence?">
          <p className="text-slate-300">
            Define infrastructure in version-controlled files and deploy with automation — repeatable,
            auditable, recoverable lake and ETL platforms.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Template vs stack">
          <p className="text-slate-300">
            Template is the recipe in Git; stack is the live AWS instance in one account/Region with its own
            parameter values and physical resource IDs.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Why Parameters?">
          <p className="text-slate-300">
            Customize environment name, retention, and keys at deploy time without duplicating YAML files for
            dev and prod.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Why Outputs?">
          <p className="text-slate-300">
            Hand bucket names and role ARNs to operators, CI smoke tests, and downstream stacks — the
            post-deploy API of your platform template.
          </p>
        </ContentStep>
        <ContentStep number={5} title="What happens on create failure?">
          <p className="text-slate-300">
            CloudFormation rolls back — deletes resources it already created — stack ends{' '}
            <code className="text-core-400">ROLLBACK_COMPLETE</code>; fix root cause, delete stack, retry.
          </p>
        </ContentStep>
        <ContentStep number={6} title="Console vs CLI for create?">
          <p className="text-slate-300">
            Same API — console for learning Events tab; CLI/CI for repeatable dev and prod pipelines with{' '}
            <code className="text-core-400">wait stack-create-complete</code>.
          </p>
        </ContentStep>
        <ContentStep number={7} title="What belongs in a DE platform template?">
          <p className="text-slate-300">
            At minimum: S3 medallion buckets, Glue/IAM roles, optional VPC endpoints, EventBridge landing
            rules, CloudWatch alarms — not the PySpark business logic itself.
          </p>
        </ContentStep>
        <Example title="Beginner CloudFormation concept drill" caption="No console required — explain aloud">
{`1. Draw: Git template → Create Stack → S3 + IAM + Glue catalog → Outputs → smoke test
2. Why does console-only prod differ from dev on bucket versioning?
3. Name three Parameters and three Outputs for a lake baseline stack
4. What is CAPABILITY_NAMED_IAM and when might create-stack need it?
5. Template vs stack — can one template power five stacks?
6. Where do Glue PySpark scripts live vs what CFN creates?
7. First step when stack shows ROLLBACK_COMPLETE?`}
        </Example>
        <Callout variant="insight">
          Strong CloudFormation beginners do not memorize every resource type on day one. They ask: what does
          the template declare, what varies by parameter, and what do Outputs hand to ETL — three questions
          that prevent undeclared prod buckets and orphaned IAM roles.
        </Callout>
      </LessonSection>

      <LessonSection title="Mini scenario — end-to-end story">
        <p className="text-slate-300">
          Acme platform team maintains <code className="text-core-400">lake-baseline.yaml</code> in Git with
          Parameters for <code className="text-core-400">EnvironmentName</code> and{' '}
          <code className="text-core-400">ProjectPrefix</code>. CI deploys stack{' '}
          <code className="text-core-400">acme-lake-dev</code> on merge; promotion workflow deploys{' '}
          <code className="text-core-400">acme-lake-prod</code> with a change set review. Outputs list{' '}
          <code className="text-core-400">RawBucketName</code> and{' '}
          <code className="text-core-400">GlueETLRoleArn</code> — Glue job repo reads them from Parameter
          Store populated by the pipeline. EventBridge rule for raw prefix exists because the template
          declared it; when JDBC Glue needs VPC, they add a nested network stack export — not manual console
          peering. On-call sees Glue failure alarm from the same template family. When create failed once due
          to typo in bucket name, rollback cleaned partial IAM; engineer fixed YAML, deleted stack, redeployed
          — no orphaned prod policies.
        </p>
        <ContentStep number={1} title="Intent tier — template in Git">
          <p className="text-slate-300">Reviewed YAML — Parameters, Resources, Outputs.</p>
        </ContentStep>
        <ContentStep number={2} title="Deploy tier — stack lifecycle">
          <p className="text-slate-300">Create/update with change sets in prod; rollback understood.</p>
        </ContentStep>
        <ContentStep number={3} title="Handoff tier — Outputs">
          <p className="text-slate-300">ETL and runbooks consume ARNs and bucket names.</p>
        </ContentStep>
        <ContentStep number={4} title="Pipeline tier — EventBridge and Glue">
          <p className="text-slate-300">Same orchestration from prior modules — now on IaC-provisioned rails.</p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="What's next">
        <p className="text-slate-300">
          The next lessons in the CloudFormation track go hands-on on topics this beginner pass introduced:
        </p>
        <ContentStep number={1} title="Intrinsic functions — Ref, GetAtt, Sub, Join">
          <p className="text-slate-300">
            Wire bucket names into IAM policies and Lambda environment variables without hardcoding — the glue
            inside templates that makes Resources and Outputs coherent.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Updates and change sets">
          <p className="text-slate-300">
            Preview prod template changes before apply — critical when S3 or IAM updates might replace or
            disrupt live lake paths.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Nested stacks and StackSets">
          <p className="text-slate-300">
            Split network, lake, and observability into child stacks; deploy identical baselines to many
            analytics accounts from the organization root.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Full medallion platform templates">
          <p className="text-slate-300">
            Combine VPC endpoints, Lake Formation hooks, Glue workflows, EventBridge archive, and Step
            Functions — assuming you can explain template/stack/parameters/outputs without opening the
            CloudFormation console.
          </p>
        </ContentStep>
        <p className="mt-4 text-slate-300">
          CloudFormation connects everything you built in prior modules: IAM grants API access, VPC carries
          JDBC traffic, S3 holds lake data, Glue transforms, EventBridge triggers — IaC ensures those pieces
          exist consistently in every environment. Advanced tracks assume you can draw Git template → Create
          Stack → Outputs → smoke test from memory.
        </p>
        <Callout variant="tip" title="Before your first prod stack update">
          Re-read Parameters vs Outputs and sketch resource dependencies on paper. Teams that skip the diagram
          burn days on rollback loops — the template map saves time before the first change set.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Beginner model: template in Git, Parameters for environment, Resources for S3/IAM/Glue, Outputs for handoff, stack lifecycle with rollback.',
          'Self-check: IaC definition, template vs stack, Parameters/Outputs purpose, rollback behavior, console vs CLI, platform template scope.',
          'Prod DE platforms deploy from reviewed templates — not one-off console buckets that drift from dev.',
          'Next in CloudFormation track: intrinsics (Ref/GetAtt/Sub), change sets, nested stacks, StackSets, and full medallion platform templates.',
        ]}
      />
    </LessonArticle>
  )
}
