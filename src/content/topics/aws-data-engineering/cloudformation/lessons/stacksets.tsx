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

export function Stacksets() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="One template, many accounts and Regions — StackSets">
        Enterprise data lakes span ingest, process, and consume accounts across Regions.{' '}
        <strong className="text-white">CloudFormation StackSets</strong> deploy the same baseline template to
        dozens of accounts from a central administration account — how landing zones roll out logging, guardrails,
        and shared DE infrastructure.
      </Callout>

      <Definition term="CloudFormation StackSet">
        <p>
          A StackSet is a CloudFormation stack deployed across multiple accounts and Regions from one template.
          The <strong className="text-white">administration account</strong> creates the StackSet;{' '}
          <strong className="text-white">target accounts</strong> receive stack instances. AWS Organizations
          integration enables deployment to OUs. Updates propagate to all instances — with optional concurrency
          and failure tolerance controls.
        </p>
      </Definition>

      <LessonSection title="StackSets for multi-account / multi-region">
        <ContentStep number={1} title="When DE platforms use StackSets">
          <p className="text-slate-300">
            Baseline every data account with: S3 Block Public Access guardrails, central CloudTrail log bucket
            policy, mandatory tags, EventBridge forwarding to observability account, Glue service-linked role
            prerequisites, KMS keys for lake encryption. One template version → all accounts in{' '}
            <em>Data-Production</em> OU — no copy-paste deploy scripts per account.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Stack instance vs stack">
          <p className="text-slate-300">
            Each account+Region pair gets a <em>stack instance</em> — a normal CloudFormation stack in the
            target account. Parameters can differ per instance via parameter overrides (dev smaller retention,
            prod stricter). Failed instance does not block others when failure tolerance is configured.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Permissions model">
          <p className="text-slate-300">
            Self-managed: admin account assumes execution role in targets. Service-managed: Organizations
            trusted access — AWS creates roles automatically. DE teams request StackSet from cloud foundation;
            data engineers supply template + parameter matrix, not cross-account role ARNs.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Operational cautions">
          <p className="text-slate-300">
            StackSet update touching IAM or S3 policies affects all targets — use change set on single account
            canary first (deploy to one account OU subset). Regional outages: instances deploy per Region;
            us-east-1 admin can target eu-west-1 data accounts. Document rollback: stack instance delete
            removes resources per target Retain policies.
          </p>
        </ContentStep>
        <Example title="StackSet target — OU and Regions">
{`# Conceptual StackSet configuration (console/API)
StackSetName: data-account-baseline
TemplateURL: s3://org-cfn-artifacts/baseline/v3.2.0/template.yaml
AdministrationAccount: 111122223333
DeploymentTargets:
  OrganizationalUnitIds:
    - ou-data-prod-xxxxx
  Regions:
    - us-east-1
    - eu-west-1
Parameters:
  - ParameterKey: CentralLoggingBucketArn
    ParameterValue: arn:aws:s3:::org-central-logs-111122223333
OperationPreferences:
  FailureToleranceCount: 2
  MaxConcurrentCount: 5`}
        </Example>
      </LessonSection>

      <LessonSection title="Landing zone / org DE pattern teaser">
        <ContentStep number={1} title="Account vending + baseline">
          <p className="text-slate-300">
            New <em>data-analytics</em> account created via Control Tower or AFT → StackSet auto-deploys:
            Config rules, default VPC absent or locked, S3 endpoint policy template, read-only role for central
            SIEM. Data team then deploys workload stack (Glue, lake buckets) inside pre-hardened account.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Multi-Region lake footprint">
          <p className="text-slate-300">
            StackSet deploys identical ingest monitoring stack to us-east-1 and eu-west-1 in each data account
            — CloudWatch alarms, EventBridge rules forwarding to ops account. Regional parameter override sets
            local KMS key ARN while sharing org-wide SNS topic in security account.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Separation from workload stacks">
          <p className="text-slate-300">
            StackSets for <em>platform baseline</em> — not for daily Glue job changes. Application teams deploy
            workload stacks via CI/CD in each account. Interview distinction: StackSet = org-wide guardrails;
            standard stack = team-owned pipeline infrastructure.
          </p>
        </ContentStep>
        <Flowchart
          title="StackSet rollout — org data accounts"
          chart={`flowchart TB
  ADMIN[Admin account StackSet]
  OU[Data Production OU]
  A1[Account ingest us-east-1]
  A2[Account process us-east-1]
  A3[Account consume eu-west-1]
  BASE[Baseline stack instance]
  WORK[Team workload stack CI/CD]
  ADMIN --> OU
  OU --> A1
  OU --> A2
  OU --> A3
  A1 --> BASE
  A2 --> BASE
  A3 --> BASE
  A1 --> WORK
  A2 --> WORK
  A3 --> WORK`}
        />
        <Callout variant="tip">
          StackSets pair with SCPs: template enforces logging bucket; SCP denies S3 public ACLs — defense in
          depth for multi-account DE landing zones covered in org governance lessons.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'StackSets: one template → many account+Region instances from admin account — org baseline deploy.',
          'Use for guardrails, logging, tags, KMS prerequisites — not daily Glue job iteration.',
          'Service-managed + Organizations OU targets; parameter overrides per env; failure tolerance for rollouts.',
          'Landing zone: new data account gets StackSet baseline before team workload stacks via CI/CD.',
          'Canary one account before org-wide StackSet update — IAM/S3 policy changes hit all instances.',
        ]}
      />
    </LessonArticle>
  )
}
