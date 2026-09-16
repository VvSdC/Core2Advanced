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

export function NestedStacks() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Modular templates — Nested Stacks for large DE platforms">
        A monolithic template defining VPC, S3, Glue, EventBridge, RDS, and IAM exceeds maintainability limits.
        <strong className="text-white"> Nested stacks</strong> compose smaller templates from S3 into a parent
        stack — the pattern data platform teams use for reusable network, data, and compute modules.
      </Callout>

      <Definition term="Nested stack">
        <p>
          A stack created as an <span className="font-mono text-sm">AWS::CloudFormation::Stack</span> resource
          inside another stack. Child template lives in S3; parent passes{' '}
          <span className="font-mono text-sm">Parameters</span> and receives{' '}
          <span className="font-mono text-sm">Outputs</span>. Updates propagate: parent update may trigger
          child stack updates. Child stacks belong to parent lifecycle — deleting parent deletes children
          (unless Retain policies on nested resources).
        </p>
      </Definition>

      <LessonSection title="Nested Stacks for modular DE templates">
        <ContentStep number={1} title="Layered module pattern">
          <p className="text-slate-300">
            Typical decomposition: <em>network-nested</em> (VPC, subnets, endpoints),{' '}
            <em>storage-nested</em> (S3 buckets, KMS keys), <em>ingest-nested</em> (EventBridge, Lambda, SQS),{' '}
            <em>processing-nested</em> (Glue jobs, connections, workflows). Parent{' '}
            <span className="font-mono text-sm">data-platform.yaml</span> wires Parameters once and passes
            subnet IDs from network child to Glue child.
          </p>
        </ContentStep>
        <ContentStep number={2} title="TemplateURL and versioning">
          <p className="text-slate-300">
            Child referenced via S3 HTTPS URL — often versioned artifact bucket per account. CI/CD publishes
            module templates with semver paths; parent pins{' '}
            <span className="font-mono text-sm">network/v2.3.1/template.yaml</span>. Avoid unversioned{' '}
            <span className="font-mono text-sm">latest</span> URLs — silent child upgrades break prod.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Parameters and outputs between nested stacks">
          <p className="text-slate-300">
            Parent reads child output:{' '}
            <span className="font-mono text-sm">!GetAtt NetworkStack.Outputs.PrivateSubnetIds</span> (YAML:
            nested stack output via GetAtt on nested resource). Pass CommaDelimitedList for subnet IDs into
            Glue nested Parameters. Keeps modules decoupled — network team owns network template contract.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Nested vs cross-stack exports">
          <p className="text-slate-300">
            Nested stacks: single parent lifecycle, shared rollback, one stack Events view — good for one
            account/env deploy unit. Cross-stack exports: independent lifecycles — network stack updated
            separately from data stack. DE platforms often export VPC from network stack, nest ingest+process
            under one application parent.
          </p>
        </ContentStep>
        <Example title="Parent stack nesting network and Glue modules">
{`Resources:
  NetworkModule:
    Type: AWS::CloudFormation::Stack
    Properties:
      TemplateURL: https://s3.amazonaws.com/cfn-artifacts/network/v2.1.0/template.yaml
      Parameters:
        Environment: !Ref Environment
        VpcCidr: 10.10.0.0/16

  GlueModule:
    Type: AWS::CloudFormation::Stack
    DependsOn: NetworkModule
    Properties:
      TemplateURL: https://s3.amazonaws.com/cfn-artifacts/glue/v1.4.0/template.yaml
      Parameters:
        Environment: !Ref Environment
        PrivateSubnetIds: !GetAtt NetworkModule.Outputs.PrivateSubnetIds
        VpcId: !GetAtt NetworkModule.Outputs.VpcId`}
        </Example>
        <Flowchart
          title="Nested stack composition — data platform parent"
          chart={`flowchart TB
  PARENT[Parent data-platform stack]
  NET[Nested network module]
  STO[Nested storage module]
  ING[Nested ingest module]
  PROC[Nested processing module]
  VPC[VPC subnets endpoints]
  S3[S3 buckets KMS]
  EB[EventBridge Lambda SQS]
  GLUE[Glue jobs connections]
  PARENT --> NET
  PARENT --> STO
  PARENT --> ING
  PARENT --> PROC
  NET --> VPC
  STO --> S3
  ING --> EB
  PROC --> GLUE
  NET -->|Outputs subnets VPC| PROC
  STO -->|Outputs bucket names| PROC
  ING -->|Outputs bus ARN| PROC`}
        />
        <Callout variant="tip">
          Nesting depth limit: stacks can nest up to 60 deep in theory — stay shallow (3–5 modules). Deep
          nesting slows updates and complicates rollback; prefer flat parent with 4–6 child modules for DE.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Nested stacks: AWS::CloudFormation::Stack child templates from S3 — modular network/storage/ingest/process.',
          'Parent passes Parameters, reads child Outputs via GetAtt — versioned TemplateURL per module release.',
          'Single lifecycle with parent — delete/update cascades; use Retain on lake buckets inside children.',
          'vs cross-stack exports: nested = one deploy unit; exports = independent stack lifecycles.',
          'DE pattern: platform parent nests domain modules; network team owns subnet output contract for Glue.',
        ]}
      />
    </LessonArticle>
  )
}
