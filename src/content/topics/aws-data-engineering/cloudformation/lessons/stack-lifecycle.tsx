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

export function StackLifecycle() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Stacks are living deployments — create, change, rollback, drift">
        A data platform stack provisioning VPC endpoints, Glue jobs, and EventBridge rules goes through many
        lifecycle operations. Understanding <strong className="text-white">create/update/delete</strong>,{' '}
        <strong className="text-white">change sets</strong>, <strong className="text-white">rollback</strong>,
        and <strong className="text-white">drift detection</strong> prevents accidental prod outages during
        Friday deploys.
      </Callout>

      <Definition term="CloudFormation stack lifecycle">
        <p>
          A <strong className="text-white">stack</strong> is the unit of deployment: template + parameters +
          current resource state. CloudFormation drives resources through create, update, and delete
          operations in dependency order. Failed updates can roll back automatically.{' '}
          <strong className="text-white">Drift</strong> occurs when console or CLI changes resources outside
          the template — the stack no longer matches declared intent.
        </p>
      </Definition>

      <LessonSection title="Create / Update / Delete Stack">
        <ContentStep number={1} title="Create stack">
          <p className="text-slate-300">
            CloudFormation validates template, expands transforms (AWS::Serverless), creates change plan,
            provisions resources in dependency order. DE first deploy: network stack exports VPC/subnet IDs;
            data stack imports them. Create can take 30+ minutes for RDS + Redshift — monitor Events tab.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Update stack">
          <p className="text-slate-300">
            Submit modified template or new parameters. CloudFormation diffs desired vs current state,
            applies only necessary changes. Some updates are disruptive: RDS instance class change, replacing
            immutable resources (new logical ID forces replacement). Use{' '}
            <span className="font-mono text-sm">DeletionPolicy</span> and{' '}
            <span className="font-mono text-sm">UpdateReplacePolicy</span> on S3 buckets and DynamoDB tables
            holding lake data.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Delete stack">
          <p className="text-slate-300">
            Deletes resources in reverse dependency order unless retained by policy.{' '}
            <span className="font-mono text-sm">DeletionPolicy: Retain</span> on prod S3 buckets prevents
            accidental lake wipe when stack is deleted. Empty buckets before delete if no Retain policy.
            Nested stacks delete child stacks first.
          </p>
        </ContentStep>
        <Example title="Retain lake bucket on stack delete">
{`Resources:
  CuratedLakeBucket:
    Type: AWS::S3::Bucket
    DeletionPolicy: Retain
    UpdateReplacePolicy: Retain
    Properties:
      BucketEncryption:
        ServerSideEncryptionConfiguration:
          - ServerSideEncryptionByDefault:
              SSEAlgorithm: aws:kms`}
        </Example>
      </LessonSection>

      <LessonSection title="Change Sets">
        <ContentStep number={1} title="Preview before apply">
          <p className="text-slate-300">
            Change set shows add/modify/remove/replace actions before execution — mandatory for prod data
            stacks. Review whether Glue job logical ID change will replace job and lose bookmarks. IAM policy
            narrowing may break running pipelines — catch in preview, not at 2 a.m.
          </p>
        </ContentStep>
        <ContentStep number={2} title="CI/CD integration">
          <p className="text-slate-300">
            Pipeline stage: create change set → manual or automated approval → execute change set. Name change
            sets with ticket ID and commit SHA. Failed execution leaves stack in{' '}
            <span className="font-mono text-sm">UPDATE_ROLLBACK_COMPLETE</span> — investigate Events before
            retry.
          </p>
        </ContentStep>
        <ContentStep number={3} title="No-op updates">
          <p className="text-slate-300">
            Template metadata-only changes may produce empty change sets — still valuable as deploy
            verification. Parameter-only updates (scaling Glue workers) appear clearly in change set resource
            property diffs.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Rollback">
        <ContentStep number={1} title="Automatic rollback on failure">
          <p className="text-slate-300">
            Default: failed update rolls back to last stable state. Partial updates unwind — but not always
            cleanly for stateful resources. RDS rollback may restore previous parameter group while data
            remains. EventBridge rule replacement can cause brief ingest gap during rollback window.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Disable rollback (advanced)">
          <p className="text-slate-300">
            <span className="font-mono text-sm">DisableRollback: true</span> on create leaves failed resources
            for debugging — use sparingly in dev sandboxes. Prod data stacks should keep rollback enabled;
            fix template and re-deploy rather than leaving stack in{' '}
            <span className="font-mono text-sm">CREATE_FAILED</span>.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Continue rollback">
          <p className="text-slate-300">
            Stuck rollback (resource cannot delete): skip failing resource via continue update rollback, fix
            dependency manually, then update stack again. Common with S3 buckets not empty or ENI-attached
            Lambda in VPC — empty bucket, delete ENI, retry.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Drift Detection">
        <ContentStep number={1} title="What causes drift">
          <p className="text-slate-300">
            Console edits to bucket policy, manual SG rule for emergency JDBC access, CLI tag changes on Glue
            job — stack template unchanged but AWS reality diverged. Drift undermines IaC trust and audit
            compliance for regulated data platforms.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Detect and remediate">
          <p className="text-slate-300">
            Run drift detection on stack or resource subset. Report shows modified/deleted/added properties.
            Remediation: import change into template and update, or revert manual change to match template.
            Schedule periodic drift scans on prod lake stacks; alert on any drift.
          </p>
        </ContentStep>
        <ContentStep number={3} title="DE anti-drift culture">
          <p className="text-slate-300">
            Block console edits on prod via IAM SCP except break-glass roles. All Glue connection SG changes
            via PR to network stack. Document that emergency console fix must be backported to template within
            24 hours or drift scan will page.
          </p>
        </ContentStep>
        <Flowchart
          title="Stack update lifecycle for DE deploy"
          chart={`flowchart TB
  PR[Template PR merged]
  CS[Create change set]
  REV[Review replace actions]
  APP{Approved?}
  EXEC[Execute change set]
  OK[UPDATE_COMPLETE]
  FAIL[UPDATE_FAILED]
  RB[Automatic rollback]
  EVT[Check Events tab]
  FIX[Fix template redeploy]
  PR --> CS
  CS --> REV
  REV --> APP
  APP -->|yes| EXEC
  APP -->|no| PR
  EXEC --> OK
  EXEC --> FAIL
  FAIL --> RB
  RB --> EVT
  EVT --> FIX
  FIX --> CS`}
        />
      </LessonSection>

      <KeyTakeaways
        items={[
          'Create/update/delete operate in dependency order — Retain on S3/DynamoDB lake resources prevents delete accidents.',
          'Change sets preview add/modify/replace before prod — review Glue/RDS replacement and IAM narrowing.',
          'Failed updates roll back by default; continue rollback when stuck on undeletable resources.',
          'Drift: manual console/CLI changes vs template — detect regularly, remediate via template or revert.',
          'DE ops: Events tab first on failure; CI/CD change set approval; no prod console edits without backport.',
        ]}
      />
    </LessonArticle>
  )
}
