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

export function CrossAccountAndMultiRegion() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Secrets that cross account and Region boundaries">
        Real data platforms span accounts — a producer account that owns the orders database, an analytics
        account that runs Glue — and often more than one Region for disaster recovery. You could copy the
        password everywhere, but then rotation breaks in every copy. Instead, share one secret across accounts
        with policies, and replicate it across Regions with Secrets Manager&apos;s built-in replicas.
      </Callout>

      <Definition term="Cross-account secret access">
        <p>
          A role in account B reading a secret owned by account A. It needs three permissions to line up: a{' '}
          <strong className="text-white">resource policy</strong> on the secret allowing the role, a{' '}
          <strong className="text-white">customer managed KMS key policy</strong> in account A allowing the role
          to decrypt, and an <strong className="text-white">identity policy</strong> in account B allowing both
          actions on account A&apos;s ARNs. The AWS managed key{' '}
          <code className="text-core-400">aws/secretsmanager</code> cannot be used cross-account because you
          cannot edit its key policy.
        </p>
      </Definition>

      <LessonSection title="Sharing a secret with another account">
        <ContentStep number={1} title="Producer: switch to a customer managed key">
          <p className="text-slate-300">
            In the data-source account (111122223333), encrypt{' '}
            <code className="text-core-400">de/prod/rds/orders-reader</code> with a customer managed key. Changing
            the key re-encrypts the labelled versions (AWSCURRENT, AWSPENDING, AWSPREVIOUS); keep the old key
            enabled until you have tested reads.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Producer: resource policy and key policy">
          <p className="text-slate-300">
            Attach a secret resource policy allowing{' '}
            <code className="text-core-400">arn:aws:iam::444455556666:role/analytics-glue-role</code> to call{' '}
            <code className="text-core-400">GetSecretValue</code>. Add a key policy statement allowing that role{' '}
            <code className="text-core-400">kms:Decrypt</code> with{' '}
            <code className="text-core-400">kms:ViaService</code> set to Secrets Manager in that Region.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Consumer: identity policy and full ARN">
          <p className="text-slate-300">
            In the analytics account (444455556666), the Glue role allows{' '}
            <code className="text-core-400">GetSecretValue</code> on the producer secret ARN and{' '}
            <code className="text-core-400">kms:Decrypt</code> on the producer key ARN. Code must pass the{' '}
            <strong className="text-white">full ARN</strong> as <code className="text-core-400">SecretId</code> — a
            bare name is looked up in the caller&apos;s own account.
          </p>
        </ContentStep>
        <Flowchart
          title="Cross-account read path"
          chart={`flowchart LR
  subgraph Analytics account
    GLUE[Glue role analytics]
  end
  subgraph Source account
    SEC[Secret orders-reader]
    RP[Secret resource policy]
    KEY[Customer managed key]
  end
  GLUE -->|GetSecretValue full ARN| SEC
  SEC --> RP
  SEC -->|Decrypt via service| KEY`}
        />
        <Example title="Producer key policy statement" caption="Added to the CMK in account 111122223333">
{`{
  "Sid": "AllowAnalyticsGlueDecryptViaSecretsManager",
  "Effect": "Allow",
  "Principal": { "AWS": "arn:aws:iam::444455556666:role/analytics-glue-role" },
  "Action": "kms:Decrypt",
  "Resource": "*",
  "Condition": {
    "StringEquals": { "kms:ViaService": "secretsmanager.us-east-1.amazonaws.com" }
  }
}`}
        </Example>
        <Example title="Consumer code — full ARN, explicit Region" caption="Runs in account 444455556666">
{`import boto3, json

SECRET_ARN = ("arn:aws:secretsmanager:us-east-1:111122223333:"
              "secret:de/prod/rds/orders-reader-AbC123")
sm = boto3.client("secretsmanager", region_name="us-east-1")
creds = json.loads(sm.get_secret_value(SecretId=SECRET_ARN)["SecretString"])`}
        </Example>
      </LessonSection>

      <LessonSection title="Parameter Store across accounts">
        <ContentStep number={1} title="Sharing via AWS RAM — advanced tier only">
          <p className="text-slate-300">
            Parameter Store added the ability to share <strong className="text-white">advanced-tier</strong>{' '}
            parameters through AWS Resource Access Manager. Consumers get read-only access and reference the
            parameter by full ARN. It is a relatively recent capability — check current docs for supported
            parameter types and KMS requirements before designing around it.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Often simpler: copy non-secret config">
          <p className="text-slate-300">
            For plain config like <code className="text-core-400">/de/prod/orders/batch_size</code>, many teams
            just deploy the same values into each account through CloudFormation StackSets or a CI pipeline.
            Keep anything that rotates in Secrets Manager and share that one copy instead.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Multi-region replicas for DR">
        <ContentStep number={1} title="Replica secrets">
          <p className="text-slate-300">
            Add <code className="text-core-400">ReplicaRegions</code> (or call{' '}
            <code className="text-core-400">replicate-secret-to-regions</code>) and Secrets Manager keeps a
            read-only copy in each target Region, encrypted with a key you choose there. The replica has the
            same name; its ARN differs only in the Region. Value changes and rotations in the primary propagate
            automatically.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Promote during failover">
          <p className="text-slate-300">
            If the primary Region is impaired, run{' '}
            <code className="text-core-400">stop-replication-to-replica</code> on the replica to promote it to a
            standalone secret you can update and rotate. Pair this with an Aurora Global Database or cross-Region
            RDS replica so the credentials and the database fail over together.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Region-aware code">
          <p className="text-slate-300">
            Build clients with <code className="text-core-400">region_name=os.environ[&quot;AWS_REGION&quot;]</code>{' '}
            and reference the secret by name, so the DR copy of the Glue job reads the local replica instead of
            reaching back to the failed Region.
          </p>
        </ContentStep>
        <Example title="CLI — replicate and promote" caption="Primary us-east-1, DR us-west-2">
{`aws secretsmanager replicate-secret-to-regions \\
  --secret-id de/prod/rds/orders-reader \\
  --add-replica-regions Region=us-west-2,KmsKeyId=alias/de-secrets-usw2

# During a regional failover, in us-west-2:
aws secretsmanager stop-replication-to-replica \\
  --secret-id de/prod/rds/orders-reader --region us-west-2`}
        </Example>
        <Callout variant="tip">
          Rotation runs only in the primary Region. After promoting a replica, attach a rotation schedule in the
          new primary — otherwise the DR secret silently stops rotating.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Cross-account secrets need a resource policy, a customer managed key policy, and a consumer identity policy.',
          'The aws/secretsmanager managed key cannot be shared — switch to a CMK before sharing.',
          'Consumers must call GetSecretValue with the full secret ARN, not the bare name.',
          'Advanced-tier parameters can be shared via AWS RAM; plain config is often simpler to deploy per account.',
          'Replica secrets keep DR Regions in sync; promote with stop-replication-to-replica and re-enable rotation.',
        ]}
      />
    </LessonArticle>
  )
}
