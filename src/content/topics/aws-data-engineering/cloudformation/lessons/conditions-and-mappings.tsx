import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function ConditionsAndMappings() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="One template, many environments — Conditions and Mappings">
        Data platform teams deploy the same Glue job, S3 bucket layout, and EventBridge rules to dev, staging,
        and prod. <strong className="text-white">Conditions</strong> gate resource creation;{' '}
        <strong className="text-white">Mappings</strong> hold lookup tables for environment-specific values —
        without copying three nearly identical YAML files.
      </Callout>

      <Definition term="Conditions and Mappings in CloudFormation">
        <p>
          <strong className="text-white">Conditions</strong> are boolean expressions evaluated at stack
          creation/update time — they control whether resources, properties, or outputs are included.{' '}
          <strong className="text-white">Mappings</strong> are static key-value tables (Region, environment,
          instance size) resolved via <span className="font-mono text-sm">Fn::FindInMap</span>. Together they
          keep DE infrastructure templates DRY while supporting env-specific branches.
        </p>
      </Definition>

      <LessonSection title="Conditions">
        <ContentStep number={1} title="When DE teams use Conditions">
          <p className="text-slate-300">
            Create prod-only resources: multi-AZ RDS, longer S3 lifecycle transitions, stricter bucket
            encryption. Skip expensive NAT gateways in dev. Enable EventBridge archive only in prod. Attach
            VPC endpoints in staging and prod but not in sandbox accounts with no private subnets.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Common condition patterns">
          <p className="text-slate-300">
            Compare <span className="font-mono text-sm">Environment</span> parameter to{' '}
            <span className="font-mono text-sm">prod</span>. Use{' '}
            <span className="font-mono text-sm">Fn::Equals</span>,{' '}
            <span className="font-mono text-sm">Fn::And</span>,{' '}
            <span className="font-mono text-sm">Fn::Or</span>,{' '}
            <span className="font-mono text-sm">Fn::Not</span>. Reference conditions in resource{' '}
            <span className="font-mono text-sm">Condition</span> key or wrap property values in{' '}
            <span className="font-mono text-sm">Fn::If</span>.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Conditions vs separate stacks">
          <p className="text-slate-300">
            Conditions suit toggles inside one stack (enable Redshift in analytics env only). Separate stacks
            per environment suit different AWS accounts, IAM boundaries, or blast-radius isolation — common in
            landing zones. Do not cram unrelated prod-only databases into a dev stack with Conditions alone.
          </p>
        </ContentStep>
        <Example title="Condition — create archive only in prod">
{`Parameters:
  Environment:
    Type: String
    AllowedValues: [dev, staging, prod]

Conditions:
  IsProd: !Equals [!Ref Environment, prod]

Resources:
  IngestArchive:
    Type: AWS::Events::Archive
    Condition: IsProd
    Properties:
      ArchiveName: s3-landing-archive
      SourceArn: !GetAtt IngestEventBus.Arn
      RetentionDays: 90`}
        </Example>
      </LessonSection>

      <LessonSection title="Mappings">
        <ContentStep number={1} title="Static lookup tables">
          <p className="text-slate-300">
            Mappings hold values that do not change during a single deployment — Glue worker type per env,
            S3 prefix roots, log retention days, RDS instance class. Top-level key is often Region or
            environment name; nested keys are setting names. Resolved at deploy time only — not runtime.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Fn::FindInMap">
          <p className="text-slate-300">
            Syntax: three arguments — map name, top-level key, second-level key. Optional fourth default value
            if key missing. Pair with <span className="font-mono text-sm">Ref: AWS::Region</span> or{' '}
            <span className="font-mono text-sm">Ref: Environment</span> parameter for dynamic lookup. Use in
            resource properties, not in Conditions directly (use Parameters + Conditions for booleans).
          </p>
        </ContentStep>
        <ContentStep number={3} title="DE mapping examples">
          <p className="text-slate-300">
            Map <em>dev → G.1X workers, 7-day log retention</em>; <em>prod → G.2X, 90-day retention</em>.
            Map Region to KMS key ARNs for cross-Region DR templates. Map environment to EventBridge bus name
            suffixes — <span className="font-mono text-sm">data-ingest-dev</span> vs{' '}
            <span className="font-mono text-sm">data-ingest-prod</span>.
          </p>
        </ContentStep>
        <Example title="Mapping — Glue worker type by environment">
{`Mappings:
  EnvConfig:
    dev:
      GlueWorkerType: G.1X
      GlueNumberOfWorkers: 2
      LogRetentionDays: 7
    prod:
      GlueWorkerType: G.2X
      GlueNumberOfWorkers: 10
      LogRetentionDays: 90

Resources:
  BronzeEtlJob:
    Type: AWS::Glue::Job
    Properties:
      Name: !Sub bronze-etl-\${Environment}
      WorkerType: !FindInMap [EnvConfig, !Ref Environment, GlueWorkerType]
      NumberOfWorkers: !FindInMap [EnvConfig, !Ref Environment, GlueNumberOfWorkers]
      Command:
        Name: glueetl
        ScriptLocation: !Sub s3://\${ScriptsBucket}/bronze_etl.py`}
        </Example>
      </LessonSection>

      <LessonSection title="When DE uses env-specific branches">
        <ContentStep number={1} title="Parameter-driven topology">
          <p className="text-slate-300">
            Single data-lake stack accepts <span className="font-mono text-sm">Environment</span> and{' '}
            <span className="font-mono text-sm">EnableRedshift</span> parameters. Conditions create Redshift
            only when flag true. Mappings set bucket names and Glue DPU. CI/CD pipeline passes different
            parameter files per env — same template artifact, auditable promotion path.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Region-specific branches">
          <p className="text-slate-300">
            Multi-Region DR template uses Mapping on <span className="font-mono text-sm">AWS::Region</span>{' '}
            for backup bucket names and replica KMS keys. Condition{' '}
            <span className="font-mono text-sm">IsPrimaryRegion</span> enables active ingestion; secondary
            Region stack deploys read-only replicas and failover EventBridge rules.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Account-level divergence">
          <p className="text-slate-300">
            In Organizations, dev account may use Conditions to skip AWS Config or GuardDuty integrations
            owned by the security account. Prod data account stack always enables S3 Block Public Access,
            bucket encryption, and access logging — gated by{' '}
            <span className="font-mono text-sm">IsProd</span> or separate StackSet parameters per OU.
          </p>
        </ContentStep>
        <Callout variant="tip">
          Interview pattern: explain how one Glue + S3 + EventBridge template deploys to dev with smaller
          workers and no archive, and to prod with archive + stricter lifecycle — Parameters, Mappings, and
          Conditions, not three forked repos.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Conditions: boolean gates for prod-only resources (archive, multi-AZ, endpoints) via Fn::If and resource Condition key.',
          'Mappings: static env/Region lookup tables resolved with Fn::FindInMap — worker types, retention, KMS ARNs.',
          'DE pattern: one template + parameter files per env; Conditions for optional tiers; Mappings for sizing tables.',
          'Separate stacks/accounts when blast radius or IAM boundaries differ — Conditions alone do not replace account isolation.',
          'Pair with Parameters (Environment, EnableRedshift) and CI/CD promotion — same artifact, different deploy inputs.',
        ]}
      />
    </LessonArticle>
  )
}
