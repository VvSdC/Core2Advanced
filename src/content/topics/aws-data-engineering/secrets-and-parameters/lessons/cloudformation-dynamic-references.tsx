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

export function CloudformationDynamicReferences() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Templates should point at secrets, not contain them">
        Templates live in Git, get reviewed in pull requests, and are stored by CloudFormation. If an RDS
        password is typed into one, it has leaked. <strong className="text-white">Dynamic references</strong>{' '}
        let a template say &quot;use whatever is in this secret&quot; — CloudFormation resolves the value at
        deploy time and passes it to the resource without ever writing it into the template.
      </Callout>

      <Definition term="Dynamic reference">
        <p>
          A placeholder string in a CloudFormation template that is resolved during stack create or update. Three
          kinds matter here: <code className="text-core-400">{'{{resolve:ssm:...}}'}</code> for plain parameters,{' '}
          <code className="text-core-400">{'{{resolve:ssm-secure:...}}'}</code> for SecureString parameters, and{' '}
          <code className="text-core-400">{'{{resolve:secretsmanager:...}}'}</code> for Secrets Manager
          secrets. CloudFormation does not show resolved secure values in the console, events, or drift output.
        </p>
      </Definition>

      <LessonSection title="Syntax and where each works">
        <ContentStep number={1} title="Parameter Store references">
          <p className="text-slate-300">
            <code className="text-core-400">{'{{resolve:ssm:/de/prod/orders/batch_size}}'}</code> reads a String
            or StringList parameter (optionally pinned with <code className="text-core-400">:version</code>) and
            can be used broadly in resource properties.{' '}
            <code className="text-core-400">{'{{resolve:ssm-secure:/de/prod/orders/api_token}}'}</code> works only
            in a documented list of supported properties — for example RDS and Redshift master user passwords
            and IAM login profile passwords.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Secrets Manager references">
          <p className="text-slate-300">
            Full form:{' '}
            <code className="text-core-400">
              {'{{resolve:secretsmanager:secret-id:SecretString:json-key:version-stage:version-id}}'}
            </code>
            . Usually you need only the secret and a JSON key, for example{' '}
            <code className="text-core-400">{'{{resolve:secretsmanager:de/prod/rds/orders-admin:SecretString:password}}'}</code>
            . Omitted stage defaults to AWSCURRENT.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Resolution happens at deploy time only">
          <p className="text-slate-300">
            The value is read when the stack is created or updated — not continuously. If the secret rotates
            later, resources that copied the value (like an old-style RDS password property) do not change until
            the next stack update touches them. That is fine for bootstrap passwords that rotation then owns.
          </p>
        </ContentStep>
        <Example title="Dynamic references in resource properties" caption="Values never appear in the template">
{`Parameters:
  GlueJobRoleArn:
    Type: String

Resources:
  OrdersEtlJob:
    Type: AWS::Glue::Job
    Properties:
      Name: orders-silver-etl
      Role: !Ref GlueJobRoleArn
      Command:
        Name: glueetl
        ScriptLocation: s3://acme-lake-prod/scripts/orders_silver_etl.py
      DefaultArguments:
        "--secret_id": de/prod/rds/orders-reader
        "--batch_size": "{{resolve:ssm:/de/prod/orders/batch_size}}"

  LegacyWarehouse:
    Type: AWS::Redshift::Cluster
    Properties:
      MasterUsername: admin_user
      MasterUserPassword: "{{resolve:ssm-secure:/de/prod/redshift/master_password}}"
      # ...other required properties`}
        </Example>
      </LessonSection>

      <LessonSection title="Creating secrets in the template — generated, attached, rotated">
        <ContentStep number={1} title="GenerateSecretString">
          <p className="text-slate-300">
            <code className="text-core-400">AWS::SecretsManager::Secret</code> with{' '}
            <code className="text-core-400">GenerateSecretString</code> lets Secrets Manager create the password.
            Nobody — not even the template author — ever sees it. A{' '}
            <code className="text-core-400">SecretStringTemplate</code> supplies the fixed username and{' '}
            <code className="text-core-400">GenerateStringKey</code> names the generated field.
          </p>
        </ContentStep>
        <ContentStep number={2} title="SecretTargetAttachment and RotationSchedule">
          <p className="text-slate-300">
            After the DB instance exists, <code className="text-core-400">AWS::SecretsManager::SecretTargetAttachment</code>{' '}
            writes host, port, engine, and dbname into the secret so rotation and clients know where to connect.{' '}
            <code className="text-core-400">AWS::SecretsManager::RotationSchedule</code> with a{' '}
            <code className="text-core-400">HostedRotationLambda</code> deploys the rotation function for you
            (this needs the <code className="text-core-400">AWS::SecretsManager-2020-07-23</code> transform).
          </p>
        </ContentStep>
        <Flowchart
          title="Stack wiring for an RDS secret"
          chart={`flowchart LR
  SEC[Secret generated password]
  DB[RDS instance]
  ATT[SecretTargetAttachment]
  ROT[RotationSchedule]
  LAM[Hosted rotation Lambda]
  SEC -->|resolve password| DB
  DB --> ATT
  SEC --> ATT
  ATT --> ROT
  ROT --> LAM
  LAM -->|rotates| DB`}
        />
        <Example title="Generated RDS secret with attachment and rotation" caption="The password exists only in Secrets Manager">
{`Transform: AWS::SecretsManager-2020-07-23
Resources:
  OrdersAdminSecret:
    Type: AWS::SecretsManager::Secret
    Properties:
      Name: de/prod/rds/orders-admin
      GenerateSecretString:
        SecretStringTemplate: '{"username": "orders_admin"}'
        GenerateStringKey: password
        PasswordLength: 32
        ExcludeCharacters: '"@/\\'

  OrdersDb:
    Type: AWS::RDS::DBInstance
    Properties:
      Engine: postgres
      DBInstanceClass: db.t4g.medium
      AllocatedStorage: "50"
      MasterUsername: orders_admin
      MasterUserPassword: !Sub '{{resolve:secretsmanager:\${OrdersAdminSecret}:SecretString:password}}'

  OrdersSecretAttachment:
    Type: AWS::SecretsManager::SecretTargetAttachment
    Properties:
      SecretId: !Ref OrdersAdminSecret
      TargetId: !Ref OrdersDb
      TargetType: AWS::RDS::DBInstance

  OrdersSecretRotation:
    Type: AWS::SecretsManager::RotationSchedule
    DependsOn: OrdersSecretAttachment
    Properties:
      SecretId: !Ref OrdersAdminSecret
      HostedRotationLambda:
        RotationType: PostgreSQLSingleUser
        VpcSubnetIds: subnet-REPLACE_ME
        VpcSecurityGroupIds: sg-REPLACE_ME
      RotationRules:
        ScheduleExpression: rate(30 days)`}
        </Example>
        <Callout variant="tip">
          For new RDS and Aurora databases, <code className="text-core-400">ManageMasterUserPassword: true</code>{' '}
          on the DB resource is even simpler — RDS creates and rotates the master secret, and the template
          references nothing sensitive at all.
        </Callout>
      </LessonSection>

      <LessonSection title="Rules and limits to remember">
        <ContentStep number={1} title="AWS::SSM::Parameter cannot create SecureString">
          <p className="text-slate-300">
            The CloudFormation resource supports <code className="text-core-400">String</code> and{' '}
            <code className="text-core-400">StringList</code> only. Create SecureString values out of band (CLI,
            a pipeline step, or a custom resource) and reference them with ssm-secure — or use a Secrets Manager
            secret with GenerateSecretString instead.
          </p>
        </ContentStep>
        <ContentStep number={2} title="NoEcho is masking, not secret storage">
          <p className="text-slate-300">
            A <code className="text-core-400">NoEcho: true</code> template parameter hides the value in
            DescribeStacks and the console, but someone still has to type it, it may end up in CI logs, and a
            default value would sit in the template. Prefer dynamic references over NoEcho passwords.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Never in Outputs, Metadata, or template text">
          <p className="text-slate-300">
            Outputs are readable by anyone with <code className="text-core-400">cloudformation:DescribeStacks</code>.
            Export the secret <em>ARN</em> as an output so other stacks can reference it — never the value. Keep
            plain passwords out of templates, parameter files, and Git history entirely.
          </p>
        </ContentStep>
        <Callout variant="insight">
          A good review rule: a template may contain secret names, ARNs, and dynamic references — if it contains
          anything a human could type into a database login prompt, the pull request is blocked.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Dynamic references resolve at deploy time — ssm for plain parameters, ssm-secure and secretsmanager for sensitive values.',
          'ssm-secure works only in specific supported properties; secretsmanager references can target a JSON key and version stage.',
          'GenerateSecretString, SecretTargetAttachment, and RotationSchedule build a rotated RDS secret nobody ever sees.',
          'AWS::SSM::Parameter cannot create SecureString values — create them out of band or use Secrets Manager.',
          'NoEcho only masks input; never put secrets in template text, Outputs, or parameter files — export ARNs instead.',
        ]}
      />
    </LessonArticle>
  )
}
