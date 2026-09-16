import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function CfnBestPracticesDe() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="IaC that survives audits and on-call — DE CloudFormation best practices">
        Templates provisioning lake infrastructure must be secure, repeatable, and operable. These practices
        reflect what production data platform teams enforce in PR review — parameters for environments, mandatory
        tagging, least-privilege IAM, and zero plain-text secrets.
      </Callout>

      <Definition term="DE CloudFormation best practices">
        <p>
          Templates treat infrastructure as software: parameterized environments, consistent resource tags for
          cost and ownership, IAM scoped to specific bucket prefixes and Glue job ARNs, secrets via dynamic
          references, Retain on stateful lake resources, change sets before prod, and cfn-lint in CI — aligned
          with Well-Architected and SOC2 expectations for data platforms.
        </p>
      </Definition>

      <LessonSection title="Parameters for env">
        <ContentStep number={1} title="Standard parameter set">
          <p className="text-slate-300">
            Every DE template accepts: <span className="font-mono text-sm">Environment</span> (dev/staging/prod
            AllowedValues), <span className="font-mono text-sm">ProjectName</span> or{' '}
            <span className="font-mono text-sm">DataDomain</span>, optional{' '}
            <span className="font-mono text-sm">OwnerEmail</span>. Avoid account-specific hard-coding — use{' '}
            <span className="font-mono text-sm">AWS::AccountId</span> pseudo parameter in Sub. Parameter files
            per env live in Git: <span className="font-mono text-sm">params/prod.json</span>.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Validation constraints">
          <p className="text-slate-300">
            AllowedValues on Environment prevents typo deploy to wrong account context. MinLength/MaxLength on
            bucket name prefixes. Regex for tag compliance. CloudFormation Parameters do not replace org SCPs —
            both layers enforce policy.
          </p>
        </ContentStep>
        <Example title="Environment parameter with AllowedValues">
{`Parameters:
  Environment:
    Type: String
    AllowedValues: [dev, staging, prod]
    Description: Deployment environment — drives sizing and retention mappings

  DataDomain:
    Type: String
    Default: orders
    Description: Business domain for resource naming and cost allocation`}
        </Example>
      </LessonSection>

      <LessonSection title="Tagging">
        <ContentStep number={1} title="Mandatory DE tags">
          <p className="text-slate-300">
            Tag every taggable resource: <em>Environment</em>, <em>Project</em>, <em>Owner</em>,{' '}
            <em>CostCenter</em>, <em>DataClassification</em> (public/internal/confidential). Use stack-level{' '}
            <span className="font-mono text-sm">Tags</span> property propagation on supported resources. FinOps
            allocates Glue DPU spend by CostCenter; audit maps S3 buckets to data classification.
          </p>
        </ContentStep>
        <ContentStep number={2} title="ABAC and IAM">
          <p className="text-slate-300">
            IAM policies condition on <span className="font-mono text-sm">aws:ResourceTag/Environment</span> —
            prod roles cannot modify dev-tagged buckets. Glue job roles tagged consistently for CloudTrail
            attribution when cross-account access occurs.
          </p>
        </ContentStep>
        <Example title="Stack-level tags propagating to resources">
{`Resources:
  CuratedBucket:
    Type: AWS::S3::Bucket
    Properties:
      Tags:
        - Key: Environment
          Value: !Ref Environment
        - Key: DataClassification
          Value: confidential
        - Key: CostCenter
          Value: data-platform-4200`}
        </Example>
      </LessonSection>

      <LessonSection title="Least privilege IAM in templates">
        <ContentStep number={1} title="One role per workload">
          <p className="text-slate-300">
            Separate IAM roles: Glue bronze job, Glue silver job, Lambda validator, EventBridge target
            execution — not one <em>DataAdmin</em> role. Each role grants only required actions on specific
            ARNs built with Sub from resources in same stack.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Scope S3 and Glue actions">
          <p className="text-slate-300">
            S3: <span className="font-mono text-sm">s3:GetObject</span> on{' '}
            <span className="font-mono text-sm">arn:...:bucket/bronze/*</span> — not{' '}
            <span className="font-mono text-sm">s3:*</span> on <span className="font-mono text-sm">*</span>.
            Glue: <span className="font-mono text-sm">glue:GetJob</span>,{' '}
            <span className="font-mono text-sm">glue:StartJobRun</span> on named job only. Pass execution role
            to EventBridge target — do not embed long-lived keys in Lambda env.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Trust policies">
          <p className="text-slate-300">
            Glue role trusts <span className="font-mono text-sm">glue.amazonaws.com</span>. Lambda trusts{' '}
            <span className="font-mono text-sm">lambda.amazonaws.com</span>. EventBridge target role trusts{' '}
            <span className="font-mono text-sm">events.amazonaws.com</span> with source account condition.
            Cross-account trust requires explicit external ID or source ARN condition.
          </p>
        </ContentStep>
        <Example title="Scoped Glue job role — bronze bucket read only">
{`Resources:
  BronzeJobRole:
    Type: AWS::IAM::Role
    Properties:
      AssumeRolePolicyDocument:
        Statement:
          - Effect: Allow
            Principal:
              Service: glue.amazonaws.com
            Action: sts:AssumeRole
      Policies:
        - PolicyName: BronzeLakeRead
          PolicyDocument:
            Statement:
              - Effect: Allow
                Action: [s3:GetObject, s3:ListBucket]
                Resource:
                  - !Sub arn:aws:s3:::\${LandingBucket}
                  - !Sub arn:aws:s3:::\${LandingBucket}/*`}
        </Example>
      </LessonSection>

      <LessonSection title="No secrets in plain text">
        <ContentStep number={1} title="Forbidden patterns">
          <p className="text-slate-300">
            No JDBC passwords in Parameters without NoEcho (still avoid). No API keys in Lambda Environment
            Values as literals. No private keys in UserData. Git history is forever — scanners flag secrets in
            templates even after deletion.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Approved alternatives">
          <p className="text-slate-300">
            Dynamic references to Secrets Manager and SSM SecureString. RDS{' '}
            <span className="font-mono text-sm">ManageMasterUserPassword</span>. Glue connections resolve
            credentials at runtime from Secrets Manager integration. CI/CD injects nothing sensitive into
            template — only references to secret ARNs.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Additional hardening">
          <p className="text-slate-300">
            DeletionPolicy Retain on prod buckets. cfn-lint and cfn-guard in pipeline. Change sets for prod.
            DeletionProtection on stateful RDS. S3 Block Public Access and encryption defaults in every bucket
            resource — no opt-out Parameters in prod.
          </p>
        </ContentStep>
        <Callout variant="tip">
          PR checklist: env Parameters, tags on all resources, IAM scoped ARNs, no literal secrets, Retain on
          lake buckets, cfn-lint green — five items platform reviewers reject without.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Parameters: Environment AllowedValues, domain naming — parameter files per env, no hard-coded account IDs.',
          'Tags: Environment, Owner, CostCenter, DataClassification — FinOps, audit, ABAC IAM conditions.',
          'IAM: one role per workload; S3/Glue scoped ARNs; correct service trust — never s3:* on * for prod jobs.',
          'Secrets: dynamic references or RDS managed passwords — never plain text in Git templates.',
          'Plus: Retain on lake data, cfn-lint/guard CI, change sets prod gate, encryption and Block Public Access default.',
        ]}
      />
    </LessonArticle>
  )
}
