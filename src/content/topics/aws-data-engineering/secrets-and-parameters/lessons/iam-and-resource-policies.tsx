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

export function IamAndResourcePolicies() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Storing a secret safely is half the job — deciding who can read it is the other half">
        A secret in Secrets Manager is only as private as the IAM policies around it. The Glue job{' '}
        <code className="text-core-400">orders-silver-etl</code> should read exactly one database secret and its
        own config path — nothing else. Admins who rotate secrets should not automatically be able to read them.
        This lesson writes those policies.
      </Callout>

      <Definition term="Three layers of access">
        <p>
          Reading a secret requires every layer to allow it: the caller&apos;s{' '}
          <strong className="text-white">identity policy</strong> (attached to the Glue or Lambda role), the
          optional <strong className="text-white">secret resource policy</strong> (attached to the secret
          itself), and the <strong className="text-white">KMS key policy</strong> for the key that encrypts it.
          An explicit Deny in any layer wins. With no Allow anywhere, the answer is deny by default.
        </p>
      </Definition>

      <LessonSection title="Identity policy for a pipeline role">
        <ContentStep number={1} title="Specific secret ARN with the random suffix">
          <p className="text-slate-300">
            Secrets Manager appends a random 6-character suffix to every secret ARN:{' '}
            <code className="text-core-400">secret:de/prod/rds/orders-reader-AbC123</code>. If the secret is
            deleted and recreated, the suffix changes. Grant{' '}
            <code className="text-core-400">orders-reader-??????</code> — six{' '}
            <code className="text-core-400">?</code> match exactly six characters, so it will not also match{' '}
            <code className="text-core-400">orders-reader-admin</code> the way a bare{' '}
            <code className="text-core-400">*</code> would.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Parameter paths">
          <p className="text-slate-300">
            <code className="text-core-400">ssm:GetParameter</code>,{' '}
            <code className="text-core-400">ssm:GetParameters</code>, and{' '}
            <code className="text-core-400">ssm:GetParametersByPath</code> on the pipeline path. Parameter ARNs
            append the name after <code className="text-core-400">parameter</code> without doubling the slash, so{' '}
            <code className="text-core-400">/de/prod/orders</code> becomes{' '}
            <code className="text-core-400">parameter/de/prod/orders</code>.
          </p>
        </ContentStep>
        <ContentStep number={3} title="kms:Decrypt with kms:ViaService">
          <p className="text-slate-300">
            If the secret or SecureString uses a customer managed key, the role needs{' '}
            <code className="text-core-400">kms:Decrypt</code> on that key. The{' '}
            <code className="text-core-400">kms:ViaService</code> condition limits that permission to requests
            coming through Secrets Manager or SSM — the role cannot call KMS directly to decrypt arbitrary data.
            With the AWS managed key <code className="text-core-400">aws/secretsmanager</code>, the key policy
            already delegates to IAM in the same account.
          </p>
        </ContentStep>
        <Example title="Glue job role — least privilege read" caption="orders-silver-etl identity policy">
{`{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ReadOrdersDbSecret",
      "Effect": "Allow",
      "Action": "secretsmanager:GetSecretValue",
      "Resource": "arn:aws:secretsmanager:us-east-1:111122223333:secret:de/prod/rds/orders-reader-??????"
    },
    {
      "Sid": "ReadOrdersConfig",
      "Effect": "Allow",
      "Action": ["ssm:GetParameter", "ssm:GetParameters", "ssm:GetParametersByPath"],
      "Resource": [
        "arn:aws:ssm:us-east-1:111122223333:parameter/de/prod/orders",
        "arn:aws:ssm:us-east-1:111122223333:parameter/de/prod/orders/*"
      ]
    },
    {
      "Sid": "DecryptViaSecretsServicesOnly",
      "Effect": "Allow",
      "Action": "kms:Decrypt",
      "Resource": "arn:aws:kms:us-east-1:111122223333:key/REPLACE_ME-key-id",
      "Condition": {
        "StringEquals": {
          "kms:ViaService": [
            "secretsmanager.us-east-1.amazonaws.com",
            "ssm.us-east-1.amazonaws.com"
          ]
        }
      }
    }
  ]
}`}
        </Example>
      </LessonSection>

      <LessonSection title="Resource policies and ABAC">
        <ContentStep number={1} title="Secret resource policy as a guardrail">
          <p className="text-slate-300">
            A resource policy on the secret can add an explicit Deny for everyone except named roles. Even an
            over-permissive identity policy like <code className="text-core-400">secretsmanager:*</code> on{' '}
            <code className="text-core-400">*</code> then cannot read the prod database password. Resource
            policies are also how you share a secret cross-account (covered later).
          </p>
        </ContentStep>
        <ContentStep number={2} title="Tag-based ABAC">
          <p className="text-slate-300">
            Instead of one statement per secret, tag secrets with <code className="text-core-400">pipeline=orders</code>{' '}
            and tag the role the same way. A single policy allows{' '}
            <code className="text-core-400">GetSecretValue</code> when{' '}
            <code className="text-core-400">secretsmanager:ResourceTag/pipeline</code> equals{' '}
            <code className="text-core-400">aws:PrincipalTag/pipeline</code>. New pipelines get access by tagging,
            not by editing IAM. Protect the tags — whoever can change tags can change access.
          </p>
        </ContentStep>
        <Example title="Resource policy — only the pipeline role may read" caption="Attached to de/prod/rds/orders-reader">
{`{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DenyAllButOrdersEtl",
      "Effect": "Deny",
      "Principal": "*",
      "Action": "secretsmanager:GetSecretValue",
      "Resource": "*",
      "Condition": {
        "StringNotEquals": {
          "aws:PrincipalArn": [
            "arn:aws:iam::111122223333:role/orders-silver-etl-glue-role",
            "arn:aws:iam::111122223333:role/secrets-rotation-lambda-role"
          ]
        }
      }
    }
  ]
}`}
        </Example>
        <Example title="ABAC statement for identity policies" caption="Role tag pipeline must match secret tag pipeline">
{`{
  "Effect": "Allow",
  "Action": "secretsmanager:GetSecretValue",
  "Resource": "arn:aws:secretsmanager:us-east-1:111122223333:secret:de/prod/*",
  "Condition": {
    "StringEquals": {
      "secretsmanager:ResourceTag/pipeline": "\${aws:PrincipalTag/pipeline}"
    }
  }
}`}
        </Example>
      </LessonSection>

      <LessonSection title="Separate readers from admins">
        <ContentStep number={1} title="Reader, writer, rotator are different roles">
          <p className="text-slate-300">
            Pipeline roles get <code className="text-core-400">GetSecretValue</code> and{' '}
            <code className="text-core-400">DescribeSecret</code> only. A platform admin role gets{' '}
            <code className="text-core-400">CreateSecret</code>, <code className="text-core-400">PutSecretValue</code>,{' '}
            <code className="text-core-400">RotateSecret</code>, <code className="text-core-400">UpdateSecret</code>,
            and <code className="text-core-400">DeleteSecret</code> — and can be explicitly denied{' '}
            <code className="text-core-400">GetSecretValue</code>. The rotation Lambda role is the only one that
            needs both read and write on the secret.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Deny by default, audit the exceptions">
          <p className="text-slate-300">
            Avoid <code className="text-core-400">secretsmanager:*</code> and{' '}
            <code className="text-core-400">Resource: *</code> in pipeline roles. Use IAM Access Analyzer to find
            unused permissions and CloudTrail to confirm which principals actually call{' '}
            <code className="text-core-400">GetSecretValue</code>.
          </p>
        </ContentStep>
        <Flowchart
          title="Who touches de/prod/rds/orders-reader"
          chart={`flowchart LR
  GLUE[Glue job role]
  LAM[Lambda role]
  ADM[Platform admin]
  ROT[Rotation Lambda]
  SEC[Secret orders-reader]
  KMS[CMK key policy]
  GLUE -->|GetSecretValue| SEC
  LAM -->|GetSecretValue| SEC
  ADM -->|Put Rotate Delete no read| SEC
  ROT -->|Get and Put| SEC
  SEC -->|Decrypt via service| KMS`}
        />
        <Callout variant="insight">
          Evaluation order to remember in interviews: explicit Deny anywhere wins; otherwise the request needs an
          Allow from identity or resource policy (same account) plus KMS permission for the encryption key.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Grant GetSecretValue on the exact secret ARN ending in -?????? to cover the random 6-character suffix.',
          'Parameter access uses path ARNs like parameter/de/prod/orders/* for GetParameter(s) and GetParametersByPath.',
          'Customer managed keys need kms:Decrypt, ideally constrained with kms:ViaService to Secrets Manager or SSM.',
          'Secret resource policies add explicit-Deny guardrails and enable cross-account sharing.',
          'Tag-based ABAC scales access by pipeline tag; separate reader, admin, and rotation roles.',
        ]}
      />
    </LessonArticle>
  )
}
