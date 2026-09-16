import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function DynamicReferencesSecretsSsm() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Secrets at deploy time — Dynamic References">
        JDBC passwords, API keys, and connection strings must not sit in Git as plain text. CloudFormation{' '}
        <strong className="text-white">dynamic references</strong> resolve values from{' '}
        <strong className="text-white">SSM Parameter Store</strong> and{' '}
        <strong className="text-white">Secrets Manager</strong> during stack operations — the standard pattern
        for Glue and RDS credentials in DE templates.
      </Callout>

      <Definition term="Dynamic reference">
        <p>
          Syntax <span className="font-mono text-sm">{'{{resolve:service:name:version}}'}</span> embedded in
          template strings. CloudFormation fetches secret at create/update — value never appears in template
          body or change sets (shown as asterisks). Supports SSM (<span className="font-mono text-sm">ssm</span>,{' '}
          <span className="font-mono text-sm">ssm-secure</span>) and Secrets Manager (
          <span className="font-mono text-sm">secretsmanager</span>). Version can be version id, stage, or{' '}
          <span className="font-mono text-sm">AWSCURRENT</span>.
        </p>
      </Definition>

      <LessonSection title="Dynamic References">
        <ContentStep number={1} title="Where DE templates use them">
          <p className="text-slate-300">
            RDS master password (when not auto-generated), Glue connection JDBC URL password field, Lambda
            environment variables for API tokens, Redshift admin credentials. Prefer Secrets Manager rotation
            for database passwords; SSM for non-rotating config (bucket names, feature flags).
          </p>
        </ContentStep>
        <ContentStep number={2} title="IAM for CloudFormation execution role">
          <p className="text-slate-300">
            Stack execution role needs <span className="font-mono text-sm">ssm:GetParameters</span>,{' '}
            <span className="font-mono text-sm">secretsmanager:GetSecretValue</span>, and KMS decrypt on CMK
            protecting secrets. Missing permission fails stack with access denied — not a vague resource error.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Update behavior">
          <p className="text-slate-300">
            Changing secret value in Secrets Manager does not auto-update stack resources — RDS password
            already applied. To push new secret: update stack (no-op template bump) or rotate via RDS native
            rotation. Document that dynamic reference resolves at deploy time, not continuously.
          </p>
        </ContentStep>
        <Example title="Dynamic reference — SSM String parameter">
{`Resources:
  BronzeLambda:
    Type: AWS::Lambda::Function
    Properties:
      Environment:
        Variables:
          CURATED_BUCKET: '{{resolve:ssm:/data/prod/curated-bucket-name}}'
          API_KEY: '{{resolve:ssm-secure:/data/prod/vendor-api-key:1}}'`}
        </Example>
      </LessonSection>

      <LessonSection title="Secrets Manager integration">
        <ContentStep number={1} title="Secret resource vs external secret">
          <p className="text-slate-300">
            Template can create <span className="font-mono text-sm">AWS::SecretsManager::Secret</span> with
            GenerateSecretString for RDS — CloudFormation manages initial password. Or reference pre-created
            secret by name/ARN in dynamic reference — common when security team owns secret lifecycle.
          </p>
        </ContentStep>
        <ContentStep number={2} title="RDS + Secrets Manager pattern">
          <p className="text-slate-300">
            <span className="font-mono text-sm">ManageMasterUserPassword: true</span> on RDS lets RDS integrate
            with Secrets Manager automatically — preferred over manual dynamic reference for new databases. Glue
            job reads same secret via connection or job parameter resolved at runtime (Glue native), not CFN
            deploy time.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Rotation and CFN">
          <p className="text-slate-300">
            Secrets Manager rotation Lambda updates secret value; RDS IAM auth or automatic master password
            sync handles DB side. CloudFormation stack unchanged — Glue connections using runtime secret fetch
            pick up rotation; properties baked at deploy time need stack update to refresh.
          </p>
        </ContentStep>
        <Example title="Secrets Manager dynamic reference for Glue connection">
{`Resources:
  OltpGlueConnection:
    Type: AWS::Glue::Connection
    Properties:
      ConnectionProperties:
        JDBC_CONNECTION_URL: jdbc:postgresql://oltp.internal:5432/orders
        USERNAME: glue_reader
        PASSWORD: '{{resolve:secretsmanager:arn:aws:secretsmanager:us-east-1:123456789012:secret:oltp/glue-reader:AWSCURRENT::password}}'
      PhysicalConnectionRequirements:
        SubnetId: !Ref PrivateSubnetA
        SecurityGroupIdList:
          - !Ref GlueSecurityGroup`}
        </Example>
      </LessonSection>

      <LessonSection title="SSM Parameter Store">
        <ContentStep number={1} title="Hierarchy for DE config">
          <p className="text-slate-300">
            Organize paths: <span className="font-mono text-sm">/data/prod/network/vpc-id</span>,{' '}
            <span className="font-mono text-sm">/data/prod/lake/bronze-bucket</span>,{' '}
            <span className="font-mono text-sm">/data/dev/glue/worker-type</span>. Standard String for
            non-sensitive; SecureString for credentials (KMS encrypted). Cross-stack: network pipeline writes
            VPC ID to SSM; data stack reads via dynamic reference — alternative to Export/Import.
          </p>
        </ContentStep>
        <ContentStep number={2} title="SSM vs Secrets Manager">
          <p className="text-slate-300">
            SSM: cheaper, good for config and non-rotating secrets, Parameter Store throughput limits at scale.
            Secrets Manager: rotation, cross-Region replication, higher cost — default for RDS JDBC credentials.
            Interview: config → SSM String; rotatable DB password → Secrets Manager.
          </p>
        </ContentStep>
        <ContentStep number={3} title="AWS::SSM::Parameter in templates">
          <p className="text-slate-300">
            Create parameters in same stack for outputs other stacks consume:{' '}
            <span className="font-mono text-sm">AWS::SSM::Parameter</span> with Value from Ref GetAtt. Data
            platform publishes bucket ARN to SSM; downstream analytics templates reference without export
            coupling.
          </p>
        </ContentStep>
        <Callout variant="tip">
          Never commit <span className="font-mono text-sm">NoEcho</span> parameters with default passwords in
          templates — use dynamic references or RDS managed password. Change sets mask resolved secrets.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Dynamic references: {{resolve:ssm|ssm-secure|secretsmanager:...}} — fetch at deploy, masked in change sets.',
          'Execution role needs GetParameters/GetSecretValue + KMS decrypt — missing IAM fails stack clearly.',
          'RDS ManageMasterUserPassword + Secrets Manager preferred; Glue JDBC may use SM dynamic reference.',
          'SSM hierarchy for cross-stack config (/data/prod/...); SecureString for sensitive non-rotating values.',
          'Secret rotation updates store — redeploy or runtime fetch needed for resources baked at deploy time.',
        ]}
      />
    </LessonArticle>
  )
}
