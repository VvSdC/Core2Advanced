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

export function KmsInPipelines() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="From individual features to a key strategy">
        You now know key policies, grants, rotation, SSE-KMS, service encryption, cross-account access, and costs.
        This lesson turns them into patterns a data platform team can apply consistently: how many keys to create,
        how pipelines reference them, how to split permissions, how to migrate safely, and a runbook for the error
        you will see most — <span className="font-mono text-sm">AccessDenied</span> from KMS.
      </Callout>

      <Definition term="Key strategy">
        <p>
          The set of rules deciding which KMS key protects which data, who administers each key, and how code
          refers to keys. A good strategy keeps the blast radius of any one key small, makes permissions readable
          in key policies, and lets infrastructure as code wire keys into Glue, Athena, Redshift, SQS, and Secrets
          Manager without hard-coded key IDs.
        </p>
      </Definition>

      <LessonSection title="Patterns that scale">
        <ContentStep number={1} title="Key per environment and data domain or sensitivity">
          <p className="text-slate-300">
            Separate keys for dev, staging, and prod — usually in separate accounts — then split prod by domain or
            sensitivity: <span className="font-mono text-sm">alias/de-lake-prod</span> for general lake data,{' '}
            <span className="font-mono text-sm">alias/de-pii-prod</span> for customer PII,{' '}
            <span className="font-mono text-sm">alias/de-catalog-prod</span> for the Data Catalog. Dozens of keys
            is fine; thousands becomes unmanageable.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Alias-based references in IaC">
          <p className="text-slate-300">
            Create keys and aliases in a platform stack and export the ARN. Pipeline stacks import it or resolve the
            alias; application code uses the alias where the API accepts it. Swapping a key then means updating one
            alias, not twenty job definitions.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Least privilege — split Encrypt and Decrypt">
          <p className="text-slate-300">
            Ingest writers landing to bronze get <span className="font-mono text-sm">kms:GenerateDataKey</span>{' '}
            (plus Decrypt only if they do multipart uploads). Readers such as BI roles get only{' '}
            <span className="font-mono text-sm">kms:Decrypt</span>. Transform jobs like{' '}
            <span className="font-mono text-sm">orders-silver-etl</span> get both, scoped by{' '}
            <span className="font-mono text-sm">kms:ViaService</span>.
          </p>
        </ContentStep>
        <Example title="CloudFormation — key, alias, and export" caption="Platform stack consumed by pipeline stacks">
{`LakeKey:
  Type: AWS::KMS::Key
  Properties:
    Description: General lake data - prod
    EnableKeyRotation: true
    PendingWindowInDays: 30
    KeyPolicy:
      Version: '2012-10-17'
      Statement:
        - Sid: KeyAdmins
          Effect: Allow
          Principal:
            AWS: !Sub arn:aws:iam::\${AWS::AccountId}:role/platform-kms-admin
          Action: ['kms:Describe*', 'kms:Put*', 'kms:Enable*', 'kms:Disable*',
                   'kms:List*', 'kms:Get*', 'kms:TagResource', 'kms:ScheduleKeyDeletion',
                   'kms:CancelKeyDeletion']
          Resource: '*'
        - Sid: TransformJobs
          Effect: Allow
          Principal:
            AWS: !Sub arn:aws:iam::\${AWS::AccountId}:role/glue-orders-silver-etl
          Action: ['kms:Decrypt', 'kms:GenerateDataKey', 'kms:DescribeKey']
          Resource: '*'
          Condition:
            StringEquals:
              kms:ViaService: !Sub s3.\${AWS::Region}.amazonaws.com

LakeKeyAlias:
  Type: AWS::KMS::Alias
  Properties:
    AliasName: alias/de-lake-prod
    TargetKeyId: !Ref LakeKey

Outputs:
  LakeKeyArn:
    Value: !GetAtt LakeKey.Arn
    Export:
      Name: de-lake-prod-key-arn`}
        </Example>
      </LessonSection>

      <LessonSection title="Migrating from SSE-S3 to SSE-KMS">
        <ContentStep number={1} title="Permissions before encryption">
          <p className="text-slate-300">
            Inventory every principal reading or writing the bucket (CloudTrail data events or S3 access logs), add
            them to the key policy and IAM, and deploy that first. Then switch bucket default encryption with Bucket
            Keys enabled, re-encrypt old objects with Batch Operations, and finally add the bucket policy that
            enforces the key.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Migrate one prefix or domain at a time">
          <p className="text-slate-300">
            Start with a low-risk prefix, watch KMS request metrics and pipeline error rates for a few days, then
            continue. Keep the old default reversible until every consumer has run successfully at least once.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="AccessDenied runbook">
        <Flowchart
          title="Debugging KMS AccessDenied"
          chart={`flowchart TB
  ERR[KMS AccessDenied in job logs]
  CT[Find denied call in CloudTrail]
  KP[Key policy allows principal or account]
  IAM[IAM policy allows action on key ARN]
  GR[Grant or service grant present]
  REG[Key ARN Region matches data]
  CTX[Encryption context matches]
  VPCE[VPC endpoint policy allows KMS]
  FIX[Fix the failing layer]
  ERR --> CT --> KP --> IAM --> GR --> REG --> CTX --> VPCE --> FIX`}
        />
        <ContentStep number={1} title="Work through the layers in order">
          <p className="text-slate-300">
            Start from the CloudTrail event: it names the principal, action, and key ARN. Check the key policy, then
            IAM, then grants for service-driven calls. Confirm the key lives in the same Region as the data — keys
            are Regional. A context mismatch usually shows as{' '}
            <span className="font-mono text-sm">InvalidCiphertextException</span> rather than AccessDenied. Finally,
            Glue jobs in private subnets calling KMS through an interface endpoint are subject to its endpoint
            policy.
          </p>
        </ContentStep>
        <Callout variant="tip">
          Record the answer in the job&apos;s runbook: which key, which role, which statement. The second time the
          same job breaks, the fix takes minutes instead of hours.
        </Callout>
      </LessonSection>

      <LessonSection title="Anti-patterns">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Anti-pattern</th>
                <th className="px-4 py-3">Why it hurts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['One key for everything', 'Any decrypt grant exposes all data; audit cannot separate PII from logs'],
                ['Deleting keys to clean up', 'Permanently destroys data encrypted under them — disable instead'],
                ['kms:* on pipeline roles', 'Pipelines can change policies or schedule deletion; grant only crypto actions'],
                ['aws/ managed keys for shared data', 'Cannot be shared cross-account; forces re-encryption later'],
                ['Hard-coded key IDs in job scripts', 'Key swaps require code changes; use aliases or IaC exports'],
              ].map(([pattern, why]) => (
                <tr key={pattern} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{pattern}</td>
                  <td className="px-4 py-3">{why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Create keys per environment and per data domain or sensitivity — small blast radius, readable policies.',
          'Reference keys through aliases and IaC exports so swapping a key is a one-line change.',
          'Split permissions: writers GenerateDataKey, readers Decrypt, transforms both — scoped with kms:ViaService.',
          'Migrate SSE-S3 to SSE-KMS by granting permissions first, then default encryption, re-encryption, and enforcement.',
          'Debug AccessDenied by layer: key policy, IAM, grants, Region, encryption context, VPC endpoint policy.',
          'Avoid one key for everything, deleting keys, kms:* on pipeline roles, and aws/ managed keys for shared data.',
        ]}
      />
    </LessonArticle>
  )
}
