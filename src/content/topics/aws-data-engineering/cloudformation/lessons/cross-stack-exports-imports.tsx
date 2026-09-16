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

export function CrossStackExportsImports() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Stacks share outputs — Exports and Imports">
        Network team owns the VPC stack; data team owns the Glue stack.{' '}
        <strong className="text-white">Cross-stack references</strong> let the Glue stack import subnet IDs
        and VPC ID exported by the network stack — without hard-coding or parameter copy-paste across teams.
      </Callout>

      <Definition term="Cross-stack reference">
        <p>
          A stack <strong className="text-white">exports</strong> a named output value. Another stack in the
          same account and Region <strong className="text-white">imports</strong> it via{' '}
          <span className="font-mono text-sm">Fn::ImportValue</span>. Export names must be unique per
          account+Region. Deleting exporting stack fails if imports still exist — prevents orphaned references
          to deleted VPCs.
        </p>
      </Definition>

      <LessonSection title="Cross-stack references">
        <ContentStep number={1} title="DE stack layering">
          <p className="text-slate-300">
            Common split: <em>network-stack</em> exports VpcId, PrivateSubnetIds, S3GatewayRouteTableIds;{' '}
            <em>data-stack</em> imports for Glue connection and Lambda VPC config;{' '}
            <em>observability-stack</em> imports SNS topic ARN from shared-services stack. Each stack updates
            independently with explicit contract via export names.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Export naming convention">
          <p className="text-slate-300">
            Prefix exports with environment and domain:{' '}
            <span className="font-mono text-sm">prod-network-VpcId</span>,{' '}
            <span className="font-mono text-sm">prod-network-PrivateSubnetIds</span>. Version export names when
            breaking changes occur — add <span className="font-mono text-sm">V2</span> suffix rather than
            renaming in place while imports live.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Limitations">
          <p className="text-slate-300">
            Same account and Region only — cross-account sharing uses SSM Parameter Store, RAM, or StackSets
            instead. Export value is static string — cannot import entire JSON object; pass CommaDelimitedList
            as comma-separated export. Max 200 exports per account per Region.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Exports and Imports">
        <ContentStep number={1} title="Export in Outputs">
          <p className="text-slate-300">
            In exporting stack Outputs section: Name (export name), Value (Ref or GetAtt), optional Description.
            Export created only when stack reaches CREATE_COMPLETE or UPDATE_COMPLETE. Removing export from
            template requires deleting importing stacks first.
          </p>
        </ContentStep>
        <ContentStep number={2} title="ImportValue in consuming stack">
          <p className="text-slate-300">
            <span className="font-mono text-sm">Fn::ImportValue</span> takes export name string. Optional
            second argument: default if export missing (rare). Use in Parameters default or resource
            properties — Glue Connection SubnetId from imported list via Select.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Deployment order">
          <p className="text-slate-300">
            Pipeline stage 1: network stack. Stage 2: data stack (imports). CI/CD validates export exists
            before data deploy. Network stack update replacing subnets requires coordinated data stack update —
            plan maintenance window for VPC recreation (usually avoided with stable logical IDs).
          </p>
        </ContentStep>
        <Example title="Network stack export + Glue stack import">
{`# network-stack.yaml — Outputs
Outputs:
  VpcId:
    Value: !Ref DataVpc
    Export:
      Name: !Sub \${Environment}-network-VpcId
  PrivateSubnetIds:
    Value: !Join [',', !Ref PrivateSubnets]
    Export:
      Name: !Sub \${Environment}-network-PrivateSubnetIds

# glue-stack.yaml — Parameters
Parameters:
  Environment:
    Type: String

Resources:
  GlueConnection:
    Type: AWS::Glue::Connection
    Properties:
      PhysicalConnectionRequirements:
        AvailabilityZone: !Select [0, !GetAZs '']
        SubnetId: !Select
          - 0
          - !Split
            - ','
            - Fn::ImportValue: !Sub \${Environment}-network-PrivateSubnetIds`}
        </Example>
        <Flowchart
          title="Cross-stack deploy order — network then data"
          chart={`flowchart LR
  NET[network-stack]
  EXP[Exports VpcId subnets]
  IMP[glue-stack ImportValue]
  GLUE[Glue connection Lambda VPC]
  NET --> EXP
  EXP --> IMP
  IMP --> GLUE`}
        />
        <Callout variant="tip">
          Alternative to exports: SSM Parameter Store String parameters written by network stack, read by data
          stack via dynamic references — works cross-stack with clearer audit trail; exports are simpler for
          same-account tight coupling.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Exports: named Outputs from producer stack; ImportValue: consumer reads by export name — same account/Region.',
          'DE layering: network exports VPC/subnets; data/observability stacks import for Glue and Lambda.',
          'Naming: env-domain prefix (prod-network-VpcId); cannot delete export while imports exist.',
          'Deploy network before data; coordinate breaking network changes — replacement is rare and painful.',
          'Cross-account: use SSM/RAM/StackSets instead of ImportValue — exports do not cross account boundaries.',
        ]}
      />
    </LessonArticle>
  )
}
