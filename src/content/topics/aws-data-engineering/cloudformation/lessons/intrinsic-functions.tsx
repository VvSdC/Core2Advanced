import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function IntrinsicFunctions() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Intrinsic functions wire templates together">
        CloudFormation templates are not static YAML —{' '}
        <strong className="text-white">intrinsic functions</strong> resolve references, build strings, branch
        on conditions, and read mapping tables at deploy time. DE templates use them constantly to name S3
        buckets, pass ARNs to IAM policies, and inject environment labels into Glue scripts.
      </Callout>

      <Definition term="Intrinsic functions">
        <p>
          Built-in functions available in resource properties, outputs, and metadata. YAML short form:{' '}
          <span className="font-mono text-sm">!Ref</span>,{' '}
          <span className="font-mono text-sm">!GetAtt</span>,{' '}
          <span className="font-mono text-sm">!Sub</span>,{' '}
          <span className="font-mono text-sm">!Join</span>,{' '}
          <span className="font-mono text-sm">!If</span>,{' '}
          <span className="font-mono text-sm">!Select</span>,{' '}
          <span className="font-mono text-sm">!FindInMap</span>. Long form:{' '}
          <span className="font-mono text-sm">Fn::Ref</span>, etc. They run only during stack operations —
          not at Glue job runtime.
        </p>
      </Definition>

      <LessonSection title="Ref">
        <ContentStep number={1} title="What Ref returns">
          <p className="text-slate-300">
            For most resources: physical ID or primary identifier (bucket name, role name). For Parameters:
            parameter value at deploy time. Pseudo parameters:{' '}
            <span className="font-mono text-sm">AWS::Region</span>,{' '}
            <span className="font-mono text-sm">AWS::AccountId</span>,{' '}
            <span className="font-mono text-sm">AWS::StackName</span>. Use to build unique names and pass IDs
            between resources in the same stack.
          </p>
        </ContentStep>
        <Example title="Ref — bucket name and parameter">
{`Parameters:
  Environment:
    Type: String

Resources:
  LandingBucket:
    Type: AWS::S3::Bucket
    Properties:
      BucketName: !Sub data-landing-\${Environment}-\${AWS::AccountId}

Outputs:
  BucketName:
    Value: !Ref LandingBucket`}
        </Example>
      </LessonSection>

      <LessonSection title="Fn::GetAtt">
        <ContentStep number={1} title="Attribute access">
          <p className="text-slate-300">
            Returns a specific attribute of a resource — often ARNs, DNS names, or endpoints not returned by{' '}
            <span className="font-mono text-sm">Ref</span>. Critical for IAM policies, EventBridge targets,
            and Glue connections. Consult AWS docs for each resource type — attribute names are case-sensitive.
          </p>
        </ContentStep>
        <Example title="GetAtt — EventBridge bus ARN and RDS endpoint">
{`Resources:
  IngestBus:
    Type: AWS::Events::EventBus
    Properties:
      Name: data-ingest-bus

  IngestRule:
    Type: AWS::Events::Rule
    Properties:
      EventBusName: !Ref IngestBus
      Targets:
        - Arn: !GetAtt BronzeLambda.Arn
          Id: BronzeTarget

  SourceDb:
    Type: AWS::RDS::DBInstance
    Properties:
      DBInstanceClass: db.r6g.large
      Engine: postgres

Outputs:
  JdbcHost:
    Value: !GetAtt SourceDb.Endpoint.Address`}
        </Example>
      </LessonSection>

      <LessonSection title="Fn::Sub">
        <ContentStep number={1} title="String substitution">
          <p className="text-slate-300">
            Replaces <span className="font-mono text-sm">${'{'}{'}'}Variable{'}'}</span> placeholders in a
            string. Default variables: pseudo parameters and resource refs by logical ID. Pass a map as second
            argument for custom keys. Preferred over <span className="font-mono text-sm">Fn::Join</span> for
            readable bucket names, Glue script paths, and IAM policy ARNs with account/Region.
          </p>
        </ContentStep>
        <Example title="Sub — Glue script path and IAM resource ARN">
{`Resources:
  ScriptsBucket:
    Type: AWS::S3::Bucket

  GlueJobRole:
    Type: AWS::IAM::Role
    Properties:
      Policies:
        - PolicyName: LakeAccess
          PolicyDocument:
            Statement:
              - Effect: Allow
                Action: s3:GetObject
                Resource: !Sub arn:aws:s3:::\${ScriptsBucket}/*

  BronzeJob:
    Type: AWS::Glue::Job
    Properties:
      Command:
        ScriptLocation: !Sub s3://\${ScriptsBucket}/jobs/bronze.py`}
        </Example>
      </LessonSection>

      <LessonSection title="Fn::Join">
        <ContentStep number={1} title="Concatenate strings">
          <p className="text-slate-300">
            Joins array elements with a delimiter. Use when building lists (security group IDs, subnet IDs)
            or legacy patterns before <span className="font-mono text-sm">Fn::Sub</span> was ubiquitous. First
            argument is delimiter (often empty string or comma); second is list of strings or refs.
          </p>
        </ContentStep>
        <Example title="Join — comma-separated subnet list for Glue connection">
{`Resources:
  GlueConnection:
    Type: AWS::Glue::Connection
    Properties:
      PhysicalConnectionRequirements:
        SubnetId: !Select [0, !Ref PrivateSubnetIds]
        SecurityGroupIdList:
          Fn::Join:
            - ','
            - - !Ref GlueSecurityGroup
              - !Ref SharedServicesSecurityGroup`}
        </Example>
      </LessonSection>

      <LessonSection title="Fn::If">
        <ContentStep number={1} title="Conditional property values">
          <p className="text-slate-300">
            Three arguments: condition name, value if true, value if false. Use inside properties when
            resource is always created but settings differ — RDS backup retention, S3 versioning, log
            retention. Pair with <span className="font-mono text-sm">Conditions</span> section defined at
            template top.
          </p>
        </ContentStep>
        <Example title="If — prod vs dev backup retention">
{`Conditions:
  IsProd: !Equals [!Ref Environment, prod]

Resources:
  MetadataDb:
    Type: AWS::RDS::DBInstance
    Properties:
      BackupRetentionPeriod: !If [IsProd, 35, 1]
      MultiAZ: !If [IsProd, true, false]`}
        </Example>
      </LessonSection>

      <LessonSection title="Fn::Select">
        <ContentStep number={1} title="Pick from a list">
          <p className="text-slate-300">
            Returns element at index from a list — often combined with{' '}
            <span className="font-mono text-sm">Fn::GetAZs</span> or a CommaDelimitedList parameter. DE use:
            pick first private subnet for single-AZ dev Glue connection; pick AZ for Lambda VPC config.
          </p>
        </ContentStep>
        <Example title="Select — first AZ and subnet from parameters">
{`Parameters:
  PrivateSubnetIds:
    Type: List<AWS::EC2::Subnet::Id>

Resources:
  LambdaFn:
    Type: AWS::Lambda::Function
    Properties:
      VpcConfig:
        SubnetIds:
          - !Select [0, !Ref PrivateSubnetIds]
        SecurityGroupIds:
          - !Ref LambdaSecurityGroup`}
        </Example>
      </LessonSection>

      <LessonSection title="Fn::FindInMap">
        <ContentStep number={1} title="Mapping lookup">
          <p className="text-slate-300">
            Reads value from <span className="font-mono text-sm">Mappings</span> section. Arguments: map name,
            top-level key (often Region or env), second-level key. Optional fourth: default if missing. Keeps
            sizing tables out of Parameters — cleaner for Glue worker profiles and log retention matrices.
          </p>
        </ContentStep>
        <Example title="FindInMap — worker count by environment">
{`Mappings:
  EnvConfig:
    dev:
      Workers: 2
    prod:
      Workers: 20

Resources:
  SilverJob:
    Type: AWS::Glue::Job
    Properties:
      NumberOfWorkers: !FindInMap [EnvConfig, !Ref Environment, Workers]`}
        </Example>
        <Callout variant="tip">
          DE template hygiene: use <span className="font-mono text-sm">!Sub</span> for names,{' '}
          <span className="font-mono text-sm">!GetAtt</span> for ARNs in IAM,{' '}
          <span className="font-mono text-sm">!FindInMap</span> for sizing tables,{' '}
          <span className="font-mono text-sm">!If</span> for prod toggles — avoid hard-coded account IDs.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Ref: resource ID or parameter value; GetAtt: ARNs, endpoints, attributes for IAM and targets.',
          'Sub: readable string building for bucket names, script paths, policy ARNs — prefer over Join for prose.',
          'Join: concatenate lists (SG IDs, subnet lists); Select: index into CommaDelimitedList or GetAZs.',
          'If: conditional property values paired with Conditions; FindInMap: env/Region sizing from Mappings.',
          'Intrinsic functions resolve at deploy time only — runtime config belongs in SSM, Secrets Manager, or job args.',
        ]}
      />
    </LessonArticle>
  )
}
