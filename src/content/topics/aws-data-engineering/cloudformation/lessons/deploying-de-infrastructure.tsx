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

export function DeployingDeInfrastructure() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="From template to production lake — deploying DE infrastructure">
        CloudFormation turns a version-controlled design into running S3 buckets, Glue jobs, EventBridge rules,
        and IAM roles. Data engineering platforms deploy in <strong className="text-white">layers</strong> —
        network, data, compute, observability — each stack owning a slice of the pipeline with clear dependencies.
      </Callout>

      <Definition term="Layered DE infrastructure deployment">
        <p>
          Production data platforms rarely deploy as one monolithic stack. Teams split templates by change
          frequency and ownership: <strong className="text-white">network</strong> (VPC, endpoints),{' '}
          <strong className="text-white">data</strong> (S3, KMS, RDS),{' '}
          <strong className="text-white">compute</strong> (Glue, Lambda, Step Functions),{' '}
          <strong className="text-white">observability</strong> (alarms, dashboards, log groups). CloudFormation
          exports, nested stacks, or CI/CD pipeline stages wire layers together.
        </p>
      </Definition>

      <LessonSection title="Deploying complete data engineering infrastructure with CFN">
        <ContentStep number={1} title="End-to-end scope">
          <p className="text-slate-300">
            A complete DE baseline includes: landing and curated S3 buckets with encryption and lifecycle;
            EventBridge rules on S3 Object Created; SQS buffer and Lambda validators; Glue connections to VPC
            RDS; Glue jobs and workflows for bronze/silver/gold; Step Functions orchestration; CloudWatch alarms
            and DLQs; IAM roles per job with least privilege; optional RDS/Redshift for serving layer.
          </p>
        </ContentStep>
        <ContentStep number={2} title="CI/CD pipeline stages">
          <p className="text-slate-300">
            Stage 1: validate template (cfn-lint, cfn-guard). Stage 2: deploy network (or skip if shared).
            Stage 3: deploy storage + KMS. Stage 4: deploy ingest (EventBridge, Lambda, SQS). Stage 5: deploy
            processing (Glue, Step Functions). Stage 6: smoke test (PutObject → rule fires → job runs). Artifact
            bucket stores packaged templates and Lambda zip/Glue scripts.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Environment promotion">
          <p className="text-slate-300">
            Same template artifact promotes dev → staging → prod with parameter files. Prod adds Retain policies,
            Multi-AZ RDS, longer retention, stricter SCP alignment. Git tag triggers prod pipeline; change set
            approval gate mandatory.
          </p>
        </ContentStep>
        <Example title="Minimal ingest stack fragment — S3 + EventBridge + SQS">
{`Resources:
  LandingBucket:
    Type: AWS::S3::Bucket
    Properties:
      NotificationConfiguration:
        EventBridgeConfiguration:
          EventBridgeEnabled: true

  IngestRule:
    Type: AWS::Events::Rule
    Properties:
      EventPattern:
        source: [aws.s3]
        detail-type: [Object Created]
        detail:
          bucket:
            name: [!Ref LandingBucket]
      Targets:
        - Id: BufferQueue
          Arn: !GetAtt IngestQueue.Arn

  IngestQueue:
    Type: AWS::SQS::Queue
    Properties:
      VisibilityTimeout: 300`}
        </Example>
      </LessonSection>

      <LessonSection title="Suggested stack layering (network, data, compute, observability)">
        <ContentStep number={1} title="Network layer">
          <p className="text-slate-300">
            VPC, public/private subnets, NAT (or NAT-less with endpoints-only design), S3 gateway endpoint on
            private route tables, interface endpoints for Secrets Manager/Glue/Logs, security groups for Glue
            and Lambda. Exports: VpcId, PrivateSubnetIds, GlueSecurityGroupId. Owned by platform/network team;
            changes quarterly or on new Region onboarding.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Data layer">
          <p className="text-slate-300">
            S3 buckets (landing, bronze, silver, gold, scripts, logs), KMS keys, bucket policies, lifecycle
            rules, RDS/Aurora for metadata or OLTP replica, optional DynamoDB for job state. Exports: bucket
            names/ARNs, KMS key ARN, JDBC endpoint. Owned by data platform; moderate change frequency.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Compute layer">
          <p className="text-slate-300">
            Glue connections (imports network), Glue jobs and workflows, Lambda functions, Step Functions state
            machines, EventBridge rules and buses. Imports network + data outputs. Highest change frequency —
            daily job updates via CI/CD without touching VPC.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Observability layer">
          <p className="text-slate-300">
            CloudWatch log groups with retention, metric filters, alarms (Glue failures, DLQ depth, S3 4xx),
            SNS topics to PagerDuty/Slack, optional OpenSearch dashboard. Imports ARNs from compute stack for
            alarm dimensions. Can deploy as StackSet baseline across all data accounts.
          </p>
        </ContentStep>
        <Flowchart
          title="DE infrastructure stack layering"
          chart={`flowchart TB
  subgraph network [Network stack]
    VPC[VPC subnets]
    EP[S3 and interface endpoints]
    SG[Security groups]
  end
  subgraph data [Data stack]
    S3[S3 lake buckets]
    KMS[KMS keys]
    RDS[(RDS metadata OLTP)]
  end
  subgraph compute [Compute stack]
    EB[EventBridge rules]
    GLUE[Glue jobs workflows]
    SF[Step Functions Lambda]
  end
  subgraph obs [Observability stack]
    CW[CloudWatch alarms logs]
    SNS[SNS alerting]
  end
  network -->|exports VPC subnets SG| compute
  data -->|exports buckets KMS JDBC| compute
  compute -->|exports job names ARNs| obs
  S3 --> EB
  EB --> GLUE
  GLUE --> S3`}
        />
        <Callout variant="tip">
          Deploy order: network → data → compute → observability. Each layer validates imports exist before
          apply. Failed compute deploy must not roll back network — independent stack lifecycles.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Complete DE CFN: S3, EventBridge, SQS/Lambda, Glue, Step Functions, IAM, alarms — split by ownership.',
          'Four layers: network (VPC endpoints SG), data (S3 KMS RDS), compute (Glue EB Lambda), observability.',
          'CI/CD: lint → layered deploy → smoke test; same artifact, parameter files per env.',
          'Compute changes most often — isolate from network to avoid risky VPC updates on every job deploy.',
          'Exports/imports or SSM wire layers; StackSet for observability baseline across org accounts.',
        ]}
      />
    </LessonArticle>
  )
}
