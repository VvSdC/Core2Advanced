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

export function GlueConnectionsAndSecrets() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Let Glue fetch the password — you just name the secret">
        A <strong className="text-white">Glue connection</strong> is a saved recipe for reaching a database:
        JDBC URL, network placement, and credentials. Instead of typing a username and password into it, you
        point the connection at a Secrets Manager secret. Crawlers, Glue Studio jobs, and scripts that use the
        connection then read the current credentials at run time — rotation included.
      </Callout>

      <Definition term="Glue JDBC connection with SECRET_ID">
        <p>
          A Data Catalog connection of type <code className="text-core-400">JDBC</code> whose{' '}
          <code className="text-core-400">ConnectionProperties</code> contain{' '}
          <code className="text-core-400">JDBC_CONNECTION_URL</code> and{' '}
          <code className="text-core-400">SECRET_ID</code> (the secret name or ARN) instead of{' '}
          <code className="text-core-400">USERNAME</code> and <code className="text-core-400">PASSWORD</code>.{' '}
          <code className="text-core-400">PhysicalConnectionRequirements</code> — subnet, security group,
          Availability Zone — tell Glue where to place the network interfaces it creates to reach the database.
        </p>
      </Definition>

      <LessonSection title="Why SECRET_ID beats stored username and password">
        <ContentStep number={1} title="One source of truth">
          <p className="text-slate-300">
            Credentials typed into a connection are a second copy that rotation does not update. With{' '}
            <code className="text-core-400">SECRET_ID: de/prod/rds/orders-reader</code>, the connection always
            resolves the AWSCURRENT version, so a rotated password never breaks the nightly crawler.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Permissions move to the job role">
          <p className="text-slate-300">
            The Glue job or crawler role needs <code className="text-core-400">secretsmanager:GetSecretValue</code>{' '}
            on the secret and <code className="text-core-400">kms:Decrypt</code> on its key if it is a customer
            managed key. People who can edit the connection no longer see a password field.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Using it in scripts and Glue Studio">
          <p className="text-slate-300">
            In Glue Studio, pick the connection on the source or target node. In a script, pass{' '}
            <code className="text-core-400">connectionName</code> with{' '}
            <code className="text-core-400">useConnectionProperties</code> and Glue fills in URL and credentials
            for you — no <code className="text-core-400">boto3</code> call in your code.
          </p>
        </ContentStep>
        <Example title="Glue script reading through a connection" caption="Credentials come from SECRET_ID on the connection">
{`orders = glueContext.create_dynamic_frame.from_options(
    connection_type="postgresql",
    connection_options={
        "useConnectionProperties": "true",
        "connectionName": "orders-rds-conn",
        "dbtable": "public.orders",
    },
)

glueContext.write_dynamic_frame.from_options(
    frame=orders_silver,
    connection_type="redshift",
    connection_options={
        "useConnectionProperties": "true",
        "connectionName": "acme-redshift-conn",
        "dbtable": "analytics.orders",
        "redshiftTmpDir": "s3://acme-lake-prod/tmp/redshift/",
    },
)`}
        </Example>
      </LessonSection>

      <LessonSection title="Networking — Glue must reach both the DB and the Secrets Manager API">
        <ContentStep number={1} title="Subnet and security group">
          <p className="text-slate-300">
            Glue places elastic network interfaces in the connection&apos;s private subnet. The security group
            needs a <strong className="text-white">self-referencing inbound rule</strong> for all TCP (Glue
            workers talk to each other), and the database security group must allow the Glue group on port 5432
            (PostgreSQL) or 5439 (Redshift).
          </p>
        </ContentStep>
        <ContentStep number={2} title="Reaching AWS APIs from a private subnet">
          <p className="text-slate-300">
            A private subnet has no internet route, so calls to Secrets Manager time out unless you add an
            interface VPC endpoint <code className="text-core-400">com.amazonaws.us-east-1.secretsmanager</code>{' '}
            with private DNS, or a NAT gateway. You also need the S3 gateway endpoint for scripts and temp
            directories. Secrets Manager calls KMS on your behalf, so no separate KMS endpoint is needed just to
            read the secret.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Test the connection">
          <p className="text-slate-300">
            The console&apos;s <em>Test connection</em> uses a role you choose and actually opens a JDBC session
            from inside the VPC. Typical failures: timeout (security group or missing endpoint), access denied
            on the secret (role policy), or authentication failed (wrong secret keys or stale password).
          </p>
        </ContentStep>
        <Flowchart
          title="Glue in a private subnet using a secret-backed connection"
          chart={`flowchart LR
  JOB[Glue job orders-silver-etl]
  ENI[Glue ENIs private subnet]
  VPCE[Secrets Manager VPC endpoint]
  SM[Secrets Manager]
  S3E[S3 gateway endpoint]
  RDS[(RDS orders)]
  RS[(Redshift)]
  JOB --> ENI
  ENI --> VPCE
  VPCE --> SM
  ENI --> S3E
  ENI -->|JDBC 5432| RDS
  ENI -->|JDBC 5439| RS`}
        />
        <Callout variant="tip">
          If a job hangs for minutes before failing with a timeout while fetching the secret, the problem is
          almost always networking — no Secrets Manager endpoint or NAT — not IAM. IAM failures come back fast
          as AccessDenied.
        </Callout>
      </LessonSection>

      <LessonSection title="Infrastructure as code">
        <ContentStep number={1} title="Declare the connection and endpoint together">
          <p className="text-slate-300">
            Define the connection, the VPC endpoint, and the job role in one CloudFormation stack so a new
            environment gets working networking and permissions on day one. The template references the secret
            by name only.
          </p>
        </ContentStep>
        <Example title="CloudFormation — Glue connection and Secrets Manager endpoint" caption="No credentials in the template">
{`OrdersRdsConnection:
  Type: AWS::Glue::Connection
  Properties:
    CatalogId: !Ref AWS::AccountId
    ConnectionInput:
      Name: orders-rds-conn
      ConnectionType: JDBC
      ConnectionProperties:
        JDBC_CONNECTION_URL: jdbc:postgresql://orders-prod.REPLACE_ME.us-east-1.rds.amazonaws.com:5432/orders
        SECRET_ID: de/prod/rds/orders-reader
        JDBC_ENFORCE_SSL: "true"
      PhysicalConnectionRequirements:
        SubnetId: subnet-REPLACE_ME
        AvailabilityZone: us-east-1a
        SecurityGroupIdList:
          - !Ref GlueSecurityGroup

SecretsManagerEndpoint:
  Type: AWS::EC2::VPCEndpoint
  Properties:
    VpcId: vpc-REPLACE_ME
    ServiceName: !Sub com.amazonaws.\${AWS::Region}.secretsmanager
    VpcEndpointType: Interface
    PrivateDnsEnabled: true
    SubnetIds: [subnet-REPLACE_ME]
    SecurityGroupIds: [!Ref EndpointSecurityGroup]`}
        </Example>
        <Callout variant="insight">
          The secret for a Glue connection must use the keys Glue expects —{' '}
          <code className="text-core-400">username</code> and <code className="text-core-400">password</code>.
          Secrets created by RDS rotation templates already follow that shape.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Glue JDBC connections should reference SECRET_ID instead of storing a username and password.',
          'Rotation then flows through automatically — crawlers and jobs always resolve AWSCURRENT.',
          'The job or crawler role needs GetSecretValue on the secret plus kms:Decrypt for customer managed keys.',
          'Private-subnet Glue needs a self-referencing security group and a Secrets Manager VPC endpoint or NAT.',
          'Declare connection, endpoint, and role in CloudFormation — the template holds only the secret name.',
        ]}
      />
    </LessonArticle>
  )
}
