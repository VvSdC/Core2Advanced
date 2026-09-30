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

export function EncryptingGlueAthenaRedshift() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Encrypting the bucket is only half the lake">
        Your silver Parquet files sit under SSE-KMS — but Glue also writes temporary shuffle data, job bookmarks,
        and CloudWatch logs; the Data Catalog stores table metadata and JDBC passwords; Athena writes query
        results to its own bucket; Redshift stores copies of the data on its own disks. Each of those needs its
        own encryption setting, and each service role needs permission on the key.
      </Callout>

      <Definition term="Glue security configuration">
        <p>
          A named set of encryption settings attached to Glue jobs, crawlers, and development endpoints. It
          controls three things: how data the job writes to S3 is encrypted (SSE-S3 or SSE-KMS), whether
          CloudWatch Logs from the job are encrypted with a KMS key, and whether job bookmarks are encrypted with
          client-side KMS encryption.
        </p>
      </Definition>

      <LessonSection title="AWS Glue">
        <ContentStep number={1} title="Security configuration on every job">
          <p className="text-slate-300">
            Create one security configuration per environment and attach it to{' '}
            <span className="font-mono text-sm">orders-silver-etl</span> and every crawler. The job role then needs{' '}
            <span className="font-mono text-sm">kms:GenerateDataKey</span> and{' '}
            <span className="font-mono text-sm">kms:Decrypt</span> on the key. For log encryption, the key policy
            must also allow the CloudWatch Logs service principal{' '}
            <span className="font-mono text-sm">logs.us-east-1.amazonaws.com</span> to use the key — otherwise the
            job fails to start writing logs.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Data Catalog encryption">
          <p className="text-slate-300">
            Catalog encryption is an account-and-Region setting: metadata for databases, tables, and partitions is
            encrypted with your CMK. Separately, <strong className="text-white">connection password encryption</strong>{' '}
            encrypts JDBC passwords in Glue connections so <span className="font-mono text-sm">GetConnection</span>{' '}
            returns ciphertext. Once enabled, every principal that reads the catalog — Athena users, Redshift
            Spectrum, EMR — needs Decrypt on that key.
          </p>
        </ContentStep>
        <Example title="CloudFormation — Glue security configuration" caption="S3, logs, and bookmarks encrypted">
{`GlueSecurityConfig:
  Type: AWS::Glue::SecurityConfiguration
  Properties:
    Name: de-prod-secure
    EncryptionConfiguration:
      S3Encryptions:
        - S3EncryptionMode: SSE-KMS
          KmsKeyArn: !Sub arn:aws:kms:\${AWS::Region}:\${AWS::AccountId}:key/\${LakeKeyId}
      CloudWatchEncryption:
        CloudWatchEncryptionMode: SSE-KMS
        KmsKeyArn: !Sub arn:aws:kms:\${AWS::Region}:\${AWS::AccountId}:key/\${LakeKeyId}
      JobBookmarksEncryption:
        JobBookmarksEncryptionMode: CSE-KMS
        KmsKeyArn: !Sub arn:aws:kms:\${AWS::Region}:\${AWS::AccountId}:key/\${LakeKeyId}`}
        </Example>
        <Example title="CLI — catalog and connection password encryption" caption="Account-level setting per Region">
{`aws glue put-data-catalog-encryption-settings --data-catalog-encryption-settings '{
  "EncryptionAtRest": {
    "CatalogEncryptionMode": "SSE-KMS",
    "SseAwsKmsKeyId": "alias/de-catalog-prod"
  },
  "ConnectionPasswordEncryption": {
    "ReturnConnectionPasswordEncrypted": true,
    "AwsKmsKeyId": "alias/de-catalog-prod"
  }
}'`}
        </Example>
      </LessonSection>

      <LessonSection title="Amazon Athena">
        <ContentStep number={1} title="Query result encryption per workgroup">
          <p className="text-slate-300">
            Athena results often contain the most sensitive slice of the lake — a SELECT on customer emails lands as
            CSV in the results bucket. Configure the workgroup with{' '}
            <span className="font-mono text-sm">SSE_S3</span>, <span className="font-mono text-sm">SSE_KMS</span>,
            or <span className="font-mono text-sm">CSE_KMS</span> result encryption and a CMK.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Enforce the workgroup settings">
          <p className="text-slate-300">
            Set <span className="font-mono text-sm">EnforceWorkGroupConfiguration</span> to true so client-side
            settings from JDBC drivers or notebooks cannot override the output location or encryption. Users need
            Decrypt on both the lake key (to read source data) and the results key (to fetch results).
          </p>
        </ContentStep>
        <Example title="CloudFormation — Athena workgroup" caption="Enforced SSE-KMS results">
{`AnalystsWorkGroup:
  Type: AWS::Athena::WorkGroup
  Properties:
    Name: analysts-prod
    WorkGroupConfiguration:
      EnforceWorkGroupConfiguration: true
      ResultConfiguration:
        OutputLocation: s3://acme-athena-results-prod/analysts/
        EncryptionConfiguration:
          EncryptionOption: SSE_KMS
          KmsKey: !Sub arn:aws:kms:\${AWS::Region}:\${AWS::AccountId}:key/\${ResultsKeyId}`}
        </Example>
      </LessonSection>

      <LessonSection title="Amazon Redshift and EMR">
        <ContentStep number={1} title="Redshift provisioned and Serverless">
          <p className="text-slate-300">
            Redshift uses a key hierarchy: your KMS key wraps a cluster key, which wraps database keys, which wrap
            block keys. Specify a CMK at cluster or Serverless namespace creation to control access and audit usage.
            Newer clusters are encrypted by default, but with an AWS owned key unless you choose your own. You can
            switch to a different KMS key later (modify-cluster for provisioned, update-namespace for Serverless);
            Redshift migrates in the background — test the current behavior and downtime expectations in dev first.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Redshift also touches S3">
          <p className="text-slate-300">
            COPY from SSE-KMS objects needs Decrypt on the lake key for the cluster IAM role; UNLOAD should specify{' '}
            <span className="font-mono text-sm">KMS_KEY_ID</span> with <span className="font-mono text-sm">ENCRYPTED</span>{' '}
            so exported files use your CMK rather than the bucket default.
          </p>
        </ContentStep>
        <ContentStep number={3} title="EMR security configuration">
          <p className="text-slate-300">
            EMR has its own security configuration: at-rest encryption for EMRFS data in S3 (SSE-KMS or CSE-KMS),
            local disk encryption with a KMS key, and in-transit TLS. The EC2 instance profile role needs the KMS
            permissions, not just the EMR service role.
          </p>
        </ContentStep>
        <Flowchart
          title="Which role needs which key"
          chart={`flowchart TB
  LAKE[alias de-lake-prod]
  CAT[alias de-catalog-prod]
  RES[alias de-athena-results-prod]
  GLUE[Glue job role]
  ATH[Athena analyst role]
  RS[Redshift cluster role]
  EMR[EMR instance profile]
  GLUE --> LAKE
  GLUE --> CAT
  ATH --> LAKE
  ATH --> CAT
  ATH --> RES
  RS --> LAKE
  RS --> CAT
  EMR --> LAKE
  EMR --> CAT`}
        />
        <Callout variant="tip">
          Keep a matrix of service roles versus keys in your IaC repo. Most &quot;Glue worked yesterday&quot;
          outages after enabling catalog encryption are a reader role missing Decrypt on the catalog key.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Glue security configurations encrypt S3 output (SSE-KMS), CloudWatch Logs, and job bookmarks (CSE-KMS).',
          'Catalog encryption and connection password encryption are per-Region settings — every catalog reader then needs Decrypt.',
          'Athena workgroups encrypt query results with SSE_S3, SSE_KMS, or CSE_KMS; enforce them with EnforceWorkGroupConfiguration.',
          'Redshift and Redshift Serverless can use a CMK and switch keys later; COPY and UNLOAD also need lake key access.',
          'Every service role — Glue, Athena users, Redshift, EMR instance profile — needs matching IAM and key policy permissions.',
        ]}
      />
    </LessonArticle>
  )
}
