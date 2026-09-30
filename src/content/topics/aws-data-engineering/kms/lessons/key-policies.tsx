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

export function KeyPolicies() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="IAM alone cannot open a KMS key">
        In S3 or DynamoDB, an IAM policy that allows an action is usually enough. KMS is different: every key
        has its own <strong className="text-white">key policy</strong>, and that resource policy decides whether
        IAM policies are even allowed to count. When a Glue job gets <span className="font-mono text-sm">AccessDenied</span>{' '}
        on <span className="font-mono text-sm">kms:Decrypt</span> even though its role says{' '}
        <span className="font-mono text-sm">kms:*</span>, the key policy is almost always the reason.
      </Callout>

      <Definition term="Key policy">
        <p>
          The resource-based policy attached to a KMS key. Every customer managed key has{' '}
          <strong className="text-white">exactly one</strong> key policy (up to 32 KB), and it is the primary
          access control for the key. No principal — not even the account root user — can use or manage the key
          unless the key policy allows it directly or delegates to IAM by trusting the account principal.
        </p>
      </Definition>

      <LessonSection title="The default key policy and IAM delegation">
        <ContentStep number={1} title="The account root statement">
          <p className="text-slate-300">
            When you create a key in the console or CLI without a custom policy, KMS attaches a default policy with
            one statement: principal <span className="font-mono text-sm">arn:aws:iam::111122223333:root</span>{' '}
            allowed <span className="font-mono text-sm">kms:*</span>. This does not mean the root user only — it
            means &quot;the account trusts its own IAM policies for this key.&quot; Without it, IAM policies on
            roles are ignored for this key.
          </p>
        </ContentStep>
        <ContentStep number={2} title="How key policy and IAM policy combine">
          <p className="text-slate-300">
            If the key policy has the root statement, a principal needs an IAM policy that allows the KMS action on
            the key ARN — both layers must agree. If the key policy names a role directly (for example the{' '}
            <span className="font-mono text-sm">orders-silver-etl</span> Glue role), that role can use the key even
            with no IAM KMS permissions. An explicit <span className="font-mono text-sm">Deny</span> in either
            place always wins.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Why many teams remove the root statement">
          <p className="text-slate-300">
            For <span className="font-mono text-sm">alias/de-pii-prod</span>, security teams often replace the
            root statement with named admin and user roles so a broad IAM policy elsewhere in the account cannot
            silently grant decrypt. The trade-off: every new consumer requires a key policy change, which is
            exactly the review gate you want for PII.
          </p>
        </ContentStep>
        <Flowchart
          title="Is this Decrypt call allowed"
          chart={`flowchart TB
  REQ[Decrypt request from Glue role]
  DENY[Explicit deny anywhere]
  KP[Key policy allows role directly]
  ROOT[Key policy trusts account root]
  IAM[IAM policy allows kms Decrypt on key]
  OK[Allowed]
  NO[AccessDenied]
  REQ --> DENY
  DENY -->|yes| NO
  DENY -->|no| KP
  KP -->|yes| OK
  KP -->|no| ROOT
  ROOT -->|no| NO
  ROOT -->|yes| IAM
  IAM -->|yes| OK
  IAM -->|no| NO`}
        />
      </LessonSection>

      <LessonSection title="Separating key administrators from key users">
        <ContentStep number={1} title="Administrators manage, they do not decrypt">
          <p className="text-slate-300">
            Key administrators get lifecycle actions: <span className="font-mono text-sm">kms:PutKeyPolicy</span>,{' '}
            <span className="font-mono text-sm">kms:EnableKeyRotation</span>,{' '}
            <span className="font-mono text-sm">kms:ScheduleKeyDeletion</span>, tagging. They should not get{' '}
            <span className="font-mono text-sm">kms:Decrypt</span> — the platform team that owns the key should not
            automatically be able to read the PII it protects.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Users get only cryptographic actions">
          <p className="text-slate-300">
            Key users get <span className="font-mono text-sm">kms:Decrypt</span>,{' '}
            <span className="font-mono text-sm">kms:GenerateDataKey</span>, and{' '}
            <span className="font-mono text-sm">kms:DescribeKey</span>. Split further when you can: ingest writers
            need <span className="font-mono text-sm">GenerateDataKey</span>, BI readers need only{' '}
            <span className="font-mono text-sm">Decrypt</span>.
          </p>
        </ContentStep>
        <Example title="Key policy for alias/de-lake-prod" caption="Admins manage, pipeline roles use, only through S3">
{`{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "KeyAdmins",
      "Effect": "Allow",
      "Principal": { "AWS": "arn:aws:iam::111122223333:role/platform-kms-admin" },
      "Action": [
        "kms:Create*", "kms:Describe*", "kms:Enable*", "kms:List*", "kms:Put*",
        "kms:Update*", "kms:Revoke*", "kms:Disable*", "kms:Get*", "kms:Delete*",
        "kms:TagResource", "kms:UntagResource",
        "kms:ScheduleKeyDeletion", "kms:CancelKeyDeletion", "kms:RotateKeyOnDemand"
      ],
      "Resource": "*"
    },
    {
      "Sid": "PipelineUseViaS3Only",
      "Effect": "Allow",
      "Principal": { "AWS": "arn:aws:iam::111122223333:role/glue-orders-silver-etl" },
      "Action": ["kms:Decrypt", "kms:GenerateDataKey", "kms:DescribeKey"],
      "Resource": "*",
      "Condition": {
        "StringEquals": {
          "kms:ViaService": "s3.us-east-1.amazonaws.com",
          "kms:CallerAccount": "111122223333"
        }
      }
    }
  ]
}`}
        </Example>
        <Callout variant="info">
          In a key policy, <span className="font-mono text-sm">&quot;Resource&quot;: &quot;*&quot;</span> means
          &quot;this key&quot; — a key policy can only ever govern the key it is attached to.
        </Callout>
      </LessonSection>

      <LessonSection title="Useful conditions and the lock-out risk">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Condition key</th>
                <th className="px-4 py-3">What it enforces in a data platform</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['kms:ViaService', 'Key usable only when the call comes through S3, Glue, or Redshift — not raw SDK Decrypt from a laptop.'],
                ['kms:CallerAccount', 'Restricts use to principals of a given account, handy alongside ViaService statements.'],
                ['aws:PrincipalArn', 'Match role ARNs with wildcards, e.g. arn:aws:iam::111122223333:role/glue-* for all Glue job roles.'],
                ['kms:EncryptionContext:…', 'Require a specific context key and value — covered in the next lesson.'],
                ['kms:GrantIsForAWSResource', 'Allow CreateGrant only when an integrated AWS service creates it on your behalf.'],
              ].map(([key, use]) => (
                <tr key={key} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-mono text-sm text-white">{key}</td>
                  <td className="px-4 py-3">{use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ContentStep number={1} title="Locking yourself out">
          <p className="text-slate-300">
            If you write a key policy that removes the root statement and names no working admin role, nobody can
            change the policy again — the key becomes unmanageable and only AWS Support can help. KMS runs a{' '}
            <strong className="text-white">policy lockout safety check</strong> on{' '}
            <span className="font-mono text-sm">PutKeyPolicy</span>; never pass{' '}
            <span className="font-mono text-sm">BypassPolicyLockoutSafetyCheck</span> in IaC.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Manage key policies in code">
          <p className="text-slate-300">
            Define the policy in CloudFormation <span className="font-mono text-sm">AWS::KMS::Key</span>{' '}
            <span className="font-mono text-sm">KeyPolicy</span> so changes go through pull requests. Console edits
            drift silently and are the most common way admin statements disappear.
          </p>
        </ContentStep>
        <Callout variant="tip">
          Debug order for KMS AccessDenied: key policy first, then IAM policy, then conditions like ViaService.
          CloudTrail shows the denied call with the exact key ARN and principal.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Every KMS key has exactly one key policy — the primary gate; IAM counts only if the key policy trusts the account.',
          'Default policy trusts arn:aws:iam::ACCOUNT:root, which delegates to IAM — then both key policy and IAM must allow.',
          'Separate key administrators (manage lifecycle) from key users (Decrypt, GenerateDataKey) — admins need not read data.',
          'Use kms:ViaService, kms:CallerAccount, and aws:PrincipalArn to scope keys to services and pipeline roles.',
          'Removing all admin access locks the key forever — keep the lockout safety check and manage policies in IaC.',
        ]}
      />
    </LessonArticle>
  )
}
