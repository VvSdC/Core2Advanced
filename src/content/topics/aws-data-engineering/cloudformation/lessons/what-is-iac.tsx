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

export function WhatIsIac() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="In simple terms">
        <strong className="text-white">Infrastructure as Code (IaC)</strong> means you describe servers,
        networks, buckets, roles, and alarms in text files — then use automation to create and update them.
        Instead of &quot;Alice clicked Create Bucket yesterday,&quot; the team says &quot;here is the template
        in Git; deploy it.&quot; For data engineering, IaC is how lake landing zones, Glue IAM roles, and
        EventBridge rules stay consistent across dev, staging, and prod.
      </Callout>

      <Definition term="Infrastructure as Code">
        <p>
          <strong className="text-white">Infrastructure as Code</strong> is the practice of managing and
          provisioning cloud resources through machine-readable definition files rather than manual console
          changes. Those files are version-controlled, reviewed in pull requests, and applied by tools like
          AWS CloudFormation, Terraform, or the AWS CDK. The infrastructure becomes{' '}
          <strong className="text-white">repeatable, auditable, and recoverable</strong> — the same qualities
          you expect from application code.
        </p>
      </Definition>

      <LessonSection title="What IaC means in practice">
        <p className="text-slate-300">
          A data platform is not only Spark scripts and SQL. It is S3 buckets with encryption, IAM roles for
          Glue and Lambda, VPC endpoints, CloudWatch alarms on failed jobs, and EventBridge rules on raw
          prefixes. IaC captures all of that in files your team can diff, review, and redeploy.
        </p>
        <ContentStep number={1} title="Declarative — describe the desired end state">
          <p className="text-slate-300">
            You write <em>what</em> should exist: an S3 bucket with versioning enabled, a Glue role that can
            read raw and write curated. The IaC engine figures out create vs update steps — you do not script
            every API call by hand.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Version controlled — Git is the source of truth">
          <p className="text-slate-300">
            Templates live beside dbt models and Glue job scripts. A pull request that adds public read on a
            lake bucket gets caught in review — something console-only teams discover after a security scan.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Automated — CI/CD deploys environments">
          <p className="text-slate-300">
            Merge to main triggers a pipeline that updates the dev stack. Promote to prod with the same
            template and different parameters — not a separate checklist someone forgot on Friday.
          </p>
        </ContentStep>
        <Flowchart
          title="IaC loop for a data platform"
          chart={`flowchart LR
  DEV[Engineer edits template]
  DEV --> PR[Pull request review]
  PR --> GIT[Merge to main]
  GIT --> CI[CI deploy stack]
  CI --> AWS[S3 IAM Glue live]
  AWS --> MON[CloudWatch alarms]
  MON --> DEV`}
        />
      </LessonSection>

      <LessonSection title="Why clicking the Console alone fails at scale for DE">
        <ContentStep number={1} title="Environment drift">
          <p className="text-slate-300">
            Dev has S3 versioning and SSE-KMS; prod was created in a hurry and missed both. Glue jobs work in
            dev but fail in prod with opaque AccessDenied — because nobody documented the bucket policy
            difference. IaC makes dev and prod the same template with different parameters.
          </p>
        </ContentStep>
        <ContentStep number={2} title="No audit trail">
          <p className="text-slate-300">
            Console changes log who clicked what, but not <em>why</em> or the intended design. Git history
            shows the lake baseline policy change, the reviewer, and the ticket — compliance teams prefer
            that story for regulated data.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Slow onboarding and recovery">
          <p className="text-slate-300">
            A new DE hire needs a sandbox with raw/curated buckets, a Glue role, and a test EventBridge rule.
            Without IaC, they wait for a senior engineer to click through the console. With IaC, they deploy
            the sandbox stack in minutes.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Complex dependencies">
          <p className="text-slate-300">
            A lake template wires bucket names into IAM policies, Glue crawlers, and Lambda environment
            variables. Manual creation invites typos —{' '}
            <code className="text-core-400">acme-lake-raw</code> in the policy but{' '}
            <code className="text-core-400">acme-lake-raw-prod</code> on the bucket. IaC references tie
            resources together automatically (CloudFormation intrinsics — covered in the next module).
          </p>
        </ContentStep>
        <Example title="Console-only vs IaC — same lake requirement" caption="Three environments, one policy">
{`Requirement: raw S3 bucket with versioning, SSE-KMS, public access block, lifecycle to Glacier after 90 days

Console-only team:
  - Alice creates dev bucket Tuesday
  - Bob creates prod bucket Friday, forgets lifecycle rule
  - Staging bucket named differently, Glue role policy still points at dev name
  - Incident: prod crawler AccessDenied, 2 hours tracing manual IAM

IaC team:
  - One lake-baseline.yaml in Git
  - Parameters: EnvironmentName = dev | staging | prod
  - CI deploys all three; drift visible in change sets
  - Incident: diff template vs live stack, fix in PR, redeploy`}
        </Example>
        <Callout variant="insight">
          IaC does not replace good architecture — it makes good architecture reproducible. You still design
          medallion prefixes and least-privilege IAM; IaC ensures nobody accidentally unpublishes that design
          in prod at midnight.
        </Callout>
      </LessonSection>

      <LessonSection title="IaC options on AWS — where CloudFormation fits">
        <p className="text-slate-300">
          Terraform, Pulumi, AWS CDK, and SAM are all valid IaC tools. This track focuses on{' '}
          <strong className="text-white">AWS CloudFormation</strong> because it is native, deeply integrated
          with new AWS features, and the lingua franca for many enterprise DE platform teams — especially
          where security mandates AWS-only provisioning paths.
        </p>
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Approach</th>
                <th className="px-4 py-3">DE platform note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                [
                  'CloudFormation YAML/JSON',
                  'Native stacks, change sets, StackSets — great for S3/IAM/Glue baselines',
                ],
                [
                  'AWS CDK (TypeScript/Python)',
                  'Generates CloudFormation; popular when DE teams already live in Python for Glue',
                ],
                [
                  'Terraform',
                  'Multi-cloud; common in orgs with AWS + Snowflake + other vendors',
                ],
                [
                  'Console + spreadsheets',
                  'Works for one sandbox; fails when you need three environments and audit history',
                ],
              ].map(([approach, note]) => (
                <tr key={approach} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{approach}</td>
                  <td className="px-4 py-3">{note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="What belongs in DE IaC">
        <ContentStep number={1} title="Lake storage baseline">
          <p className="text-slate-300">
            Raw, curated, and quarantine buckets; encryption; lifecycle; bucket policies denying insecure
            transport.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Identity for ETL">
          <p className="text-slate-300">
            Glue job roles, Lambda execution roles, EventBridge invoke permissions — scoped to bucket ARNs
            and catalog databases, not blanket admin.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Catalog and jobs">
          <p className="text-slate-300">
            Glue databases, crawlers, job definitions (or references to scripts in S3), workflows and
            triggers — often split across nested stacks in larger platforms.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Observability">
          <p className="text-slate-300">
            CloudWatch alarms on Glue failures, S3 4xx spikes, and Lambda errors — declared beside the
            resources they monitor.
          </p>
        </ContentStep>
        <Callout variant="tip" title="Start small">
          Your first template might be only two buckets and one Glue role. That is real IaC — expand to VPC,
          EventBridge, and nested stacks as the platform matures.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'IaC defines infrastructure in version-controlled files and deploys it with automation — repeatable, auditable, recoverable.',
          'Console-only DE platforms drift across environments, lack design history, and slow onboarding and disaster recovery.',
          'Lake buckets, IAM roles, Glue catalog objects, and alarms are all IaC candidates — not just EC2 or VPC.',
          'CloudFormation is AWS-native IaC; this track uses it as the foundation before intrinsics, nested stacks, and StackSets.',
        ]}
      />
    </LessonArticle>
  )
}
