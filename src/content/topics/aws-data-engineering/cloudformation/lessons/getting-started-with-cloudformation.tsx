import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function GettingStartedWithCloudformation() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Why CloudFormation after EventBridge in the DE path">
        You know how EventBridge turns S3 landings and cron windows into Lambda and Glue triggers without
        polling servers. The next question every data platform team asks is:{' '}
        <strong className="text-white">how do we stand up the same lake buckets, IAM roles, Glue jobs, and
        alarms in dev, staging, and prod — without clicking the Console fifty times and hoping nobody
        forgot a setting?</strong> In most AWS data platforms, the answer is{' '}
        <strong className="text-white">AWS CloudFormation</strong> — the native Infrastructure as Code (IaC)
        service that turns a version-controlled template into a repeatable stack of AWS resources.
      </Callout>

      <Definition term="What is CloudFormation in a DE platform?">
        <p>
          <strong className="text-white">AWS CloudFormation</strong> reads a template file — usually YAML or
          JSON — that describes the resources you want (S3 buckets, IAM roles, Glue databases, Lambda
          functions, CloudWatch alarms). When you create or update a <strong className="text-white">stack</strong>,
          CloudFormation provisions, configures, and tracks those resources as a single unit. For data
          engineering, CloudFormation is the{' '}
          <strong className="text-white">repeatable platform layer</strong> that turns &quot;we need a lake
          in prod like dev&quot; into &quot;run the same template with prod parameters.&quot;
        </p>
        <p className="mt-2 text-slate-300">
          Think of CloudFormation as{' '}
          <span className="text-core-400">the blueprint and construction crew for your data platform — one
          document defines the layout, and AWS builds it the same way every time</span>.
        </p>
      </Definition>

      <LessonSection title="Repeatable platforms — why order matters">
        <p className="text-slate-300">
          EventBridge lessons taught you how pipelines start when files land or clocks tick. Glue and VPC
          lessons taught you where ETL runs and how JDBC traffic flows. CloudFormation explains{' '}
          <strong className="text-white">how the whole environment gets created and updated safely</strong> —
          the same raw landing bucket, Glue service role, and EventBridge rule in every account without
          manual drift.
        </p>
        <ContentStep number={1} title="Dev/staging/prod parity">
          <p className="text-slate-300">
            A platform template parameterizes environment name and bucket prefixes. Dev gets{' '}
            <code className="text-core-400">acme-lake-dev</code>; prod gets{' '}
            <code className="text-core-400">acme-lake-prod</code> — same encryption, lifecycle, and IAM
            patterns, different names. No &quot;prod bucket missing versioning because someone clicked
            through the wizard too fast.&quot;
          </p>
        </ContentStep>
        <ContentStep number={2} title="Audit and rollback">
          <p className="text-slate-300">
            Templates live in Git. Every stack update produces a change set you can review before apply.
            Failed updates roll back automatically — far safer than editing live S3 policies by hand during
            an incident.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Onboarding new accounts">
          <p className="text-slate-300">
            A new analytics account needs VPC endpoints, lake buckets, Glue catalog databases, and baseline
            alarms. StackSets or a CI pipeline deploy the same nested templates platform-wide — minutes, not
            weeks of console archaeology.
          </p>
        </ContentStep>
        <Callout variant="insight">
          Interview framing: EventBridge is when the pipeline runs; CloudFormation is how the pipeline&apos;s
          infrastructure exists. Most &quot;dev works, prod is missing a role&quot; DE incidents are manual
          console drift, not bad Spark code.
        </Callout>
      </LessonSection>

      <LessonSection title="Roadmap for this sub-topic">
        <p className="text-slate-300">
          We build CloudFormation in layers so intrinsics, nested stacks, and StackSets do not overwhelm you
          on day one. Follow this order:
        </p>
        <ContentStep number={1} title="IaC mindset — why templates beat clicking">
          <p className="text-slate-300">
            Understand Infrastructure as Code, why console-only platforms fail at scale, and what
            CloudFormation adds as AWS-native IaC for lakes and ETL.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Templates and YAML — the document">
          <p className="text-slate-300">
            Learn template structure, why YAML is preferred for readability, and how{' '}
            <code className="text-core-400">AWS::Service::Resource</code> declarations describe S3, IAM,
            and Glue resources.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Resources, Parameters, Outputs — the core trio">
          <p className="text-slate-300">
            Resources define what to create; Parameters let callers customize environment and names; Outputs
            expose bucket names and role ARNs to humans and other stacks.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Create stack mental model — template to live AWS">
          <p className="text-slate-300">
            Walk through creating a stack from a template in the console or CLI — the lifecycle from
            <code className="text-core-400"> CREATE_IN_PROGRESS</code> to{' '}
            <code className="text-core-400">CREATE_COMPLETE</code>.
          </p>
        </ContentStep>
        <ContentStep number={5} title="DE platform templates and next module">
          <p className="text-slate-300">
            After this beginner pass: intrinsic functions (<code className="text-core-400">Ref</code>,{' '}
            <code className="text-core-400">Fn::GetAtt</code>), change sets, nested stacks, StackSets, and
            full medallion lake templates wired to EventBridge and Glue.
          </p>
        </ContentStep>
        <Flowchart
          title="CloudFormation sub-topic path"
          chart={`flowchart LR
  A[Getting started] --> B[What is IaC]
  B --> C[What is CloudFormation]
  C --> D[Templates and YAML]
  D --> E[Resources Parameters Outputs]
  E --> F[Create stack mental model]
  F --> G[IaC for data platforms]
  G --> H[Putting it together beginner]
  H --> I[Intrinsics nested StackSets — next]`}
        />
      </LessonSection>

      <LessonSection title="Vocabulary you will use every day">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Word</th>
                <th className="px-4 py-3">Friendly meaning</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                [
                  'Template',
                  'The YAML or JSON file that describes resources, parameters, and outputs — your platform blueprint checked into Git',
                ],
                [
                  'Stack',
                  'A live instance of a template in one Region/account — CloudFormation creates, updates, and deletes the resources as a unit',
                ],
                [
                  'Resource',
                  'One AWS object declared in the template — e.g. an S3 bucket, IAM role, Glue database, or CloudWatch alarm',
                ],
                [
                  'Parameter',
                  'An input the deployer supplies at stack create time — environment name, bucket prefix, VPC ID — without editing the template body',
                ],
                [
                  'Output',
                  'A value CloudFormation returns after deploy — bucket name, role ARN, queue URL — for runbooks, CI, or other stacks',
                ],
                [
                  'Change set',
                  'A preview of what an update will add, modify, or delete before you commit — essential for prod lake template changes',
                ],
              ].map(([word, meaning]) => (
                <tr key={word} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{word}</td>
                  <td className="px-4 py-3">{meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip" title="Naming — quick check">
          Use environment and purpose in stack names:{' '}
          <code className="text-core-400">acme-lake-platform-dev</code> or{' '}
          <code className="text-core-400">acme-etl-iam-baseline-prod</code>. When an on-call engineer
          searches CloudFormation at 2 a.m., clear stack names beat fifty generic &quot;test-stack-2&quot;
          entries.
        </Callout>
      </LessonSection>

      <LessonSection title="How CloudFormation fits after EventBridge in a pipeline">
        <p className="text-slate-300">
          A platform template creates the raw S3 bucket, Glue service role, and EventBridge rule that
          triggers a Lambda validator. EventBridge carries the &quot;file landed&quot; signal; CloudFormation
          ensures the bucket, role, and rule exist identically in every environment — two layers, one
          production platform.
        </p>
        <Flowchart
          title="YAML template → Create Stack → AWS resources (S3 / IAM / Glue)"
          chart={`flowchart LR
  GIT[Template in Git]
  GIT --> CFN[CloudFormation Create Stack]
  CFN --> S3[S3 raw and curated buckets]
  CFN --> IAM[Glue and Lambda IAM roles]
  CFN --> GLUE[Glue database and crawler]
  CFN --> EB[EventBridge rule optional]
  S3 --> EB
  EB --> LAM[Lambda validate]
  IAM --> GLUE
  GLUE --> CUR[S3 curated Parquet]`}
        />
        <Callout variant="insight">
          Mature DE platforms treat the lake landing zone as code: encryption, public access block, lifecycle
          rules, and least-privilege IAM in one template — not tribal knowledge in a wiki screenshot.
        </Callout>
      </LessonSection>

      <LessonSection title="Why data engineers care about CloudFormation">
        <ContentStep number={1} title="Same lake baseline everywhere">
          <p className="text-slate-300">
            Versioning, SSE-KMS, bucket policies, and lifecycle transitions for raw and curated prefixes
            deploy consistently. Auditors read Git diffs, not console screenshots from three months ago.
          </p>
        </ContentStep>
        <ContentStep number={2} title="IAM roles as first-class resources">
          <p className="text-slate-300">
            Glue job roles, Lambda execution roles, and EventBridge invoke permissions are declared beside
            the buckets they access — fewer orphaned policies and accidental{' '}
            <code className="text-core-400">s3:*</code> on prod.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Faster recovery and new regions">
          <p className="text-slate-300">
            Disaster recovery or a new Region means redeploying a known template with updated parameters —
            not reconstructing fifty console clicks from memory while stakeholders wait.
          </p>
        </ContentStep>
      </LessonSection>

      <KeyTakeaways
        items={[
          'CloudFormation follows EventBridge in the track — EventBridge triggers pipelines; CloudFormation creates repeatable lake and ETL infrastructure.',
          'Roadmap: IaC mindset → templates/YAML → resources/parameters/outputs → create stack → DE platform templates → intrinsics and nested stacks next.',
          'Core vocabulary: template, stack, resource, parameter, output, change set.',
          'Typical pattern: YAML template in Git → Create Stack → S3 buckets, IAM roles, Glue catalog, and optional EventBridge rules — identical across environments.',
        ]}
      />
    </LessonArticle>
  )
}
