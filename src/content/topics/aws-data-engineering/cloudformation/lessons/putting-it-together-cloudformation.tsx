import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function PuttingItTogetherCloudformation() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="CloudFormation provisions the lake — IaC checkpoint">
        You covered Conditions and Mappings, intrinsic functions, stack lifecycle, nested stacks, StackSets,
        cross-stack exports, dynamic references, Registry and custom resources, layered DE deploy, best
        practices, and troubleshooting. This checkpoint ties intermediate and advanced CloudFormation lessons
        before <strong className="text-white">Amazon DynamoDB</strong> — operational stores for pipeline state
        and streaming ingest.
      </Callout>

      <Definition term="CloudFormation mental model for data engineering">
        <p>
          AWS CloudFormation is the <strong className="text-white">declarative deployment engine</strong> for
          data platforms: version-controlled YAML defines S3, Glue, EventBridge, IAM, and RDS; parameters and
          mappings adapt per env; nested stacks and exports modularize ownership; StackSets baseline org
          accounts; dynamic references keep secrets out of Git — with change sets and drift detection guarding
          prod lake stability.
        </p>
      </Definition>

      <LessonSection title="CloudFormation sub-topic map">
        <Flowchart
          title="CloudFormation lesson map — intermediate through advanced"
          chart={`flowchart TB
  START[CloudFormation complete path]
  START --> COND[Conditions and Mappings]
  START --> INTR[Intrinsic functions]
  START --> LIFE[Stack lifecycle]
  START --> NEST[Nested stacks]
  START --> SS[StackSets]
  START --> XSTK[Cross-stack exports imports]
  START --> DYN[Dynamic references SSM Secrets]
  START --> REG[Registry and custom resources]
  START --> DEP[Deploying DE infrastructure]
  START --> BP[CFN best practices DE]
  START --> TRO[Troubleshooting stacks]
  COND --> DDBNEXT
  INTR --> DDBNEXT
  LIFE --> DDBNEXT
  NEST --> DDBNEXT
  SS --> DDBNEXT
  XSTK --> DDBNEXT
  DYN --> DDBNEXT
  REG --> DDBNEXT
  DEP --> DDBNEXT
  BP --> DDBNEXT
  TRO --> DDBNEXT
  DDBNEXT[DynamoDB operational store next]`}
        />
      </LessonSection>

      <LessonSection title="Full CloudFormation checkpoint — can you explain…">
        <ContentStep number={1} title="Template logic">
          <p className="text-slate-300">
            When Conditions vs Mappings vs Parameters? Ref vs GetAtt for EventBridge target ARN? Sub vs Join
            for bucket naming? FindInMap for Glue worker sizing per env?
          </p>
        </ContentStep>
        <ContentStep number={2} title="Lifecycle and safety">
          <p className="text-slate-300">
            Change set before prod — what Replace means for RDS? Retain on S3 lake bucket delete? Drift after
            emergency SG console edit? Rollback stuck on non-empty bucket?
          </p>
        </ContentStep>
        <ContentStep number={3} title="Modularity and scale">
          <p className="text-slate-300">
            Nested stack vs cross-stack export tradeoff? StackSet for landing zone baseline vs team workload
            stack? Deploy order network → data → compute?
          </p>
        </ContentStep>
        <ContentStep number={4} title="Secrets and extensions">
          <p className="text-slate-300">
            Dynamic reference syntax for Secrets Manager JDBC password? SSM vs Secrets Manager for DE config?
            When Custom Resource vs native AWS::Glue::Job?
          </p>
        </ContentStep>
        <ContentStep number={5} title="Operations">
          <p className="text-slate-300">
            First place to look on CREATE_FAILED? PassRole error fix? ImportValue not found root cause?
          </p>
        </ContentStep>
        <ContentStep number={6} title="Best practices">
          <p className="text-slate-300">
            Mandatory DE tags? IAM scope for bronze Glue role? Why no plain-text secrets in Git templates?
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Interview-style quick checks">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Question</th>
                <th className="px-4 py-3">Strong answer sketch</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                [
                  'Conditions vs Mappings?',
                  'Conditions: boolean gates (prod-only archive). Mappings: static lookup tables (worker type by env).',
                ],
                [
                  'Ref vs GetAtt?',
                  'Ref: ID/name. GetAtt: ARN, endpoint, attribute — IAM policies and EventBridge targets need GetAtt.',
                ],
                [
                  'Change set purpose?',
                  'Preview add/modify/replace/remove before execute — catch RDS/Glue replacement in prod.',
                ],
                [
                  'DeletionPolicy Retain?',
                  'Stack delete keeps resource — mandatory on prod lake S3 buckets and critical DynamoDB tables.',
                ],
                [
                  'Nested vs export?',
                  'Nested: parent owns child lifecycle. Export/Import: independent stacks, same account/Region contract.',
                ],
                [
                  'StackSets use case?',
                  'Org-wide baseline to many accounts/Regions — logging, guardrails — not daily Glue job edits.',
                ],
                [
                  'Dynamic reference?',
                  '{{resolve:secretsmanager:...}} — secret at deploy time, masked in change sets, not in Git.',
                ],
                [
                  'ImportValue limitation?',
                  'Same account and Region only — cross-account uses SSM, RAM, or StackSets.',
                ],
                [
                  'Custom Resource when?',
                  'Lambda-backed Create/Update/Delete for APIs CFN lacks — idempotent, implement Delete, last resort.',
                ],
                [
                  'DE stack layers?',
                  'Network (VPC endpoints) → data (S3 KMS RDS) → compute (Glue EB) → observability (alarms).',
                ],
                [
                  'Top stack failure?',
                  'PassRole missing, ImportValue typo, Glue subnet/SG mismatch — Events tab first FAILED resource.',
                ],
                [
                  'Drift meaning?',
                  'Manual console change diverged from template — detect, backport or revert.',
                ],
                [
                  'IAM DE best practice?',
                  'One role per job; s3:GetObject on specific prefix ARNs — not s3:* on *.',
                ],
              ].map(([question, answer]) => (
                <tr key={question} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{question}</td>
                  <td className="px-4 py-3">{answer}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip" title="Ready for DynamoDB when…">
          You can whiteboard layered stacks (network exports → Glue imports), explain change set Replace on
          RDS, and resolve PassRole failure from Events tab — without opening the docs.
        </Callout>
      </LessonSection>

      <LessonSection title="What comes next — Amazon DynamoDB">
        <p className="text-slate-300">
          CloudFormation provisions the lake infrastructure; pipelines also need fast operational stores for
          job state, deduplication keys, and streaming metadata.{' '}
          <strong className="text-white">Amazon DynamoDB</strong> provides millisecond key-value and document
          storage — Kinesis checkpoint leases, pipeline watermarks, and serving hot dimensions alongside S3
          and Glue in modern DE architectures.
        </p>
        <Flowchart
          title="After CloudFormation — course thread"
          chart={`flowchart LR
  EB[EventBridge checkpoint]
  CF[CloudFormation IaC]
  S3[(S3 lake)]
  GLUE[Glue jobs]
  DDB[(DynamoDB state)]
  EB --> CF
  CF --> S3
  CF --> GLUE
  CF --> DDB
  GLUE --> DDB
  GLUE --> S3`}
        />
        <Callout variant="insight">
          Revisit this checkpoint when onboarding to a new data platform team, debugging failed lake deploys,
          or designing multi-account landing zones — answers trace to lifecycle, exports, secrets, and
          troubleshooting lessons covered here.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'CloudFormation: declarative IaC for S3, Glue, EventBridge, IAM, RDS — parameters/mappings/conditions per env.',
          'Intermediate: intrinsic functions, lifecycle, change sets, rollback, drift — prod safety before execute.',
          'Advanced: nested stacks, StackSets, exports, dynamic references, Registry/custom, layered deploy.',
          'Best practices: tags, least-privilege IAM, no plain-text secrets, Retain on lake data, cfn-lint CI.',
          'Next sub-topic: Amazon DynamoDB — pipeline state, checkpoints, and operational metadata beside the lake.',
        ]}
      />
    </LessonArticle>
  )
}
