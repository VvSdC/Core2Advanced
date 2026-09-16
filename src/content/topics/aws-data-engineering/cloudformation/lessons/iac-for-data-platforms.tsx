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

export function IacForDataPlatforms() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Beyond a single bucket">
        A production <strong className="text-white">data platform</strong> is more than one S3 bucket. IaC
        templates bundle networking, lake storage, identity, catalog, orchestration hooks, and observability
        so every environment gets the same baseline. CloudFormation does not replace architecture decisions —
        it encodes them so dev, staging, and prod stay aligned while EventBridge and Glue do the daily ETL
        work.
      </Callout>

      <Definition term="DE platform template">
        <p>
          A <strong className="text-white">DE platform template</strong> (or nested stack family) describes
          the shared infrastructure analytics workloads assume: VPC subnets and endpoints for private ETL,
          medallion S3 buckets with encryption and lifecycle, IAM roles for Glue and Lambda, Glue Data
          Catalog databases and crawlers, EventBridge rules for landing and schedules, and CloudWatch alarms
          for failed jobs. Application teams deploy datasets and jobs on top; platform IaC owns the rails.
        </p>
      </Definition>

      <LessonSection title="What a DE platform template might include">
        <ContentStep number={1} title="Network — VPC and endpoints">
          <p className="text-slate-300">
            Private subnets for Glue JDBC connections, S3 gateway endpoint on route tables, optional interface
            endpoints for Secrets Manager and Glue API — reduces NAT dependency for lake traffic. Often a
            separate network stack imported by the lake stack.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Lake storage — S3 medallion layers">
          <p className="text-slate-300">
            Raw, curated (silver), and optional gold buckets; versioning; SSE-KMS or SSE-S3; public access
            block; lifecycle to Intelligent-Tiering or Glacier for raw retention; bucket policies denying
            insecure transport.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Identity — IAM roles and policies">
          <p className="text-slate-300">
            Glue ETL role scoped to bucket ARNs and catalog databases; Lambda execution role for validators;
            EventBridge invoke permissions; separate read-only analyst role vs pipeline admin — least
            privilege by design, not afterthought.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Catalog and discovery — Glue">
          <p className="text-slate-300">
            Databases per layer (<code className="text-core-400">raw</code>,{' '}
            <code className="text-core-400">curated</code>), crawlers on raw prefix, optional classifiers for
            CSV — connects S3 paths to Athena and Spark table names.
          </p>
        </ContentStep>
        <ContentStep number={5} title="Orchestration hooks — EventBridge and Lambda">
          <p className="text-slate-300">
            Rules for S3 Object Created on raw prefix targeting validation Lambda or Glue workflow; scheduled
            rules for nightly batch — wired in CFN so triggers exist before first prod file lands.
          </p>
        </ContentStep>
        <ContentStep number={6} title="Observability — alarms and logs">
          <p className="text-slate-300">
            CloudWatch alarms on Glue job failures, Lambda errors, S3 4xx rate; log groups with retention;
            SNS topic for on-call — platform team gets paged when silver ETL breaks, not when someone notices
            empty dashboards.
          </p>
        </ContentStep>
        <Flowchart
          title="DE platform stack — logical layers"
          chart={`flowchart TB
  subgraph net [Network stack]
    VPC[VPC private subnets]
    EP[S3 gateway endpoint]
  end
  subgraph lake [Lake stack]
    RAW[S3 raw bucket]
    CUR[S3 curated bucket]
    GLDB[Glue databases]
    CRAW[Glue crawler]
  end
  subgraph id [Identity]
    GROLE[Glue ETL role]
    LROLE[Lambda role]
  end
  subgraph orch [Orchestration]
    EB[EventBridge rules]
    LAM[Lambda validator]
  end
  subgraph obs [Observability]
    ALM[CloudWatch alarms]
    SNS[SNS on-call topic]
  end
  VPC --> GROLE
  EP --> RAW
  RAW --> EB
  EB --> LAM
  GROLE --> CRAW
  CRAW --> GLDB
  RAW --> CUR
  ALM --> SNS`}
        />
      </LessonSection>

      <LessonSection title="Monolith stack vs nested stacks — beginner view">
        <p className="text-slate-300">
          Small sandboxes use one YAML file with everything. Growing platforms split into{' '}
          <strong className="text-white">nested stacks</strong> — network, lake storage, ETL IAM — so teams
          update alarms without touching VPC CIDR blocks. StackSets roll the same parent template to many
          accounts. This beginner lesson names the pattern; nested stacks are the next module.
        </p>
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Pattern</th>
                <th className="px-4 py-3">When DE teams use it</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Single stack', 'Personal sandbox — 2 buckets + 1 Glue role + 2 alarms'],
                ['Nested stacks', 'Platform team — network child, lake child, observability child'],
                ['Separate repo per domain', 'Product team owns job templates; platform owns baseline exports'],
                ['StackSets', 'Deploy identical lake baseline to 20 analytics accounts from org root'],
              ].map(([pattern, when]) => (
                <tr key={pattern} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{pattern}</td>
                  <td className="px-4 py-3">{when}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Parameters that differ per environment">
        <ContentStep number={1} title="EnvironmentName and account context">
          <p className="text-slate-300">
            Drives naming, tag values, and alarm SNS topic ARNs — dev pages a Slack webhook; prod pages PagerDuty.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Retention and encryption">
          <p className="text-slate-300">
            Raw retention days, KMS key ARN (customer-managed in prod, AWS-managed in dev), whether to enable
            cross-region replication — compliance parameters, not code forks.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Optional feature flags">
          <p className="text-slate-300">
            Enable EventBridge archive, add quarantine bucket, attach Lake Formation settings — Conditions
            (advanced) toggle resources without separate templates.
          </p>
        </ContentStep>
        <Example title="Platform parameter sketch" caption="One template, many environments">
{`Parameters:
  EnvironmentName: dev | staging | prod
  ProjectPrefix: acme-lake
  RawRetentionDays: 90 (prod) vs 14 (dev)
  KmsKeyArn: optional CMK for prod SSE-KMS
  EnableLandingLambda: true/false — skip in minimal sandboxes
  OnCallTopicArn: SNS for CloudWatch alarm actions`}
        </Example>
      </LessonSection>

      <LessonSection title="Outputs the downstream team consumes">
        <p className="text-slate-300">
          ETL repos and runbooks import platform Outputs — not hardcoded bucket strings in fifty Glue scripts.
        </p>
        <ContentStep number={1} title="Storage handoff">
          <p className="text-slate-300">
            RawBucketName, CuratedBucketName, QuarantineBucketName — Glue job arguments and dbt profiles
            reference these.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Identity handoff">
          <p className="text-slate-300">
            GlueETLRoleArn — job definitions assume this role; misaligned ARN causes AccessDenied on first
            prod run.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Catalog handoff">
          <p className="text-slate-300">
            GlueDatabaseName for raw and curated — Athena queries and crawlers share catalog boundaries.
          </p>
        </ContentStep>
        <Callout variant="insight">
          Platform IaC is the contract between infrastructure and data teams. Outputs and documented parameters
          are that contract&apos;s API — treat breaking output renames like breaking REST API versions.
        </Callout>
      </LessonSection>

      <LessonSection title="What stays outside CloudFormation">
        <ContentStep number={1} title="Glue ETL script bodies">
          <p className="text-slate-300">
            PySpark lives in S3 or Git; CFN references script location — does not embed 500 lines of Spark in
            YAML.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Business SQL and dbt models">
          <p className="text-slate-300">
            Transform logic versioned in analytics repos; CFN provisions Redshift or Athena workgroup access,
            not every SELECT.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Ad hoc queries and notebooks">
          <p className="text-slate-300">
            Exploratory work stays in SageMaker or local IDE — not every notebook belongs in prod stack updates.
          </p>
        </ContentStep>
      </LessonSection>

      <KeyTakeaways
        items={[
          'DE platform IaC typically covers VPC/endpoints, medallion S3, IAM roles, Glue catalog/crawlers, EventBridge rules, and CloudWatch alarms.',
          'Start with one stack for sandboxes; grow into nested stacks and StackSets as accounts and teams multiply.',
          'Parameters express environment differences (retention, KMS, on-call); Outputs hand bucket names and role ARNs to ETL repos.',
          'CFN encodes platform rails — Glue scripts, SQL, and dbt models stay in application repos referencing stack Outputs.',
        ]}
      />
    </LessonArticle>
  )
}
