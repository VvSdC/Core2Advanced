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

export function TroubleshootingStacks() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Stack failed — systematic troubleshooting for DE on-call">
        CloudFormation failures during lake deploys range from IAM typos to RDS subnet group mismatches. Knowing
        where to look — <strong className="text-white">Events tab</strong>, rollback state, and{' '}
        <strong className="text-white">drift</strong> — shortens mean time to recovery for data platform incidents.
      </Callout>

      <Definition term="CloudFormation stack troubleshooting">
        <p>
          Every stack operation emits chronological <strong className="text-white">events</strong> with status
          reason per resource. Failed resources block dependents. Update failures trigger{' '}
          <strong className="text-white">rollback</strong> unless disabled.{' '}
          <strong className="text-white">Drift detection</strong> explains prod behaving differently from template
          after emergency console fixes — common when JDBC access was patched manually during an outage.
        </p>
      </Definition>

      <LessonSection title="Common failure modes">
        <ContentStep number={1} title="IAM and permissions">
          <p className="text-slate-300">
            <em>User is not authorized to perform iam:PassRole</em> — deploying role lacks PassRole on Glue
            execution role. <em>Cannot assume role</em> — trust policy missing service principal. Fix: scope
            PassRole to specific role ARN in deployer policy; verify AssumeRolePolicyDocument on target role.
          </p>
        </ContentStep>
        <ContentStep number={2} title="VPC and Glue connection">
          <p className="text-slate-300">
            Glue connection CREATE_FAILED: subnet not in VPC, SG does not exist, AZ mismatch. Lambda in VPC:
            ENI limit exceeded in subnet — check available IPs. ImportValue not found — network stack not
            deployed or wrong export name / environment prefix typo.
          </p>
        </ContentStep>
        <ContentStep number={3} title="S3 and naming">
          <p className="text-slate-300">
            Bucket already exists globally — BucketName collision; remove fixed name or add account suffix via
            Sub. NotificationConfiguration requires EventBridgeEnabled for EventBridge integration — missing
            property means rules never fire (runtime issue, stack succeeds).
          </p>
        </ContentStep>
        <ContentStep number={4} title="RDS and stateful resources">
          <p className="text-slate-300">
            Invalid DB subnet group — subnets in one AZ only when Multi-AZ requested. Storage full on update —
            check allocated storage parameter. Replacement forced on property change — change set showed Replace,
            team missed review.
          </p>
        </ContentStep>
        <ContentStep number={5} title="Template syntax and limits">
          <p className="text-slate-300">
            Circular dependency between resources — refactor with nested stack or explicit DependsOn break.
            Template body size limit — split into nested stacks. Invalid YAML: intrinsic function indentation
            errors caught by cfn-lint before deploy if CI configured.
          </p>
        </ContentStep>
        <Example title="Typical Events tab failure snippet">
{`Resource: BronzeGlueJob
Status: CREATE_FAILED
Reason: Resource handler returned message:
  "User: arn:aws:iam::123456789012:user/cicd-deployer
   is not authorized to perform: iam:PassRole on resource:
   arn:aws:iam::123456789012:role/BronzeJobRole"

Fix: Add iam:PassRole for BronzeJobRole ARN to cicd-deployer policy.`}
        </Example>
      </LessonSection>

      <LessonSection title="Rollback">
        <ContentStep number={1} title="Reading rollback state">
          <p className="text-slate-300">
            <span className="font-mono text-sm">UPDATE_ROLLBACK_COMPLETE</span>: safe to retry after fix.{' '}
            <span className="font-mono text-sm">UPDATE_ROLLBACK_FAILED</span>: stuck — use continue rollback,
            skip failing resource, manual cleanup. <span className="font-mono text-sm">ROLLBACK_COMPLETE</span>{' '}
            on create: stack exists but empty/failed — delete stack and redeploy fixed template.
          </p>
        </ContentStep>
        <ContentStep number={2} title="DE impact during rollback">
          <p className="text-slate-300">
            Partial update may have replaced EventBridge rule before Glue job failed — brief ingest gap. RDS
            rollback does not restore deleted data — replacement is destructive. Always review change set Replace
            actions on prod lake stacks before execute.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Recovery playbook">
          <p className="text-slate-300">
            1) Events tab → first FAILED resource. 2) Fix root cause in template or AWS quota. 3) If rollback
            stuck, continue rollback. 4) Re-run change set on fixed template. 5) Verify pipeline smoke test
            (test object landing → job success).
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Events tab">
        <ContentStep number={1} title="How to read events">
          <p className="text-slate-300">
            Events list newest first — scroll to find first red FAILED in chronological order (bottom-up in
            time). Status reason often contains AWS API error verbatim. Logical ID maps to template resource —
            grep template for that name. Nested stack failures: click child stack link for deeper events.
          </p>
        </ContentStep>
        <ContentStep number={2} title="CloudTrail correlation">
          <p className="text-slate-300">
            Cross-reference CloudTrail for API call that failed (CreateJob, CreateConnection). CloudFormation
            events show CFN perspective; CloudTrail shows exact API parameter for Glue/Lambda debugging.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Drift">
        <ContentStep number={1} title="When drift causes mysterious behavior">
          <p className="text-slate-300">
            Stack UPDATE_COMPLETE but Glue cannot reach RDS — someone added manual SG rule later removed by
            drift remediation. S3 bucket policy edited in console blocks EventBridge — template shows correct
            policy, drift detection flags difference.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Triage workflow">
          <p className="text-slate-300">
            Run drift detection → export report → compare to template intent → either update template to codify
            emergency fix or revert manual change → stack update to reconcile. For DE teams: treat drift as
            incident — emergency console fix must become PR within SLA.
          </p>
        </ContentStep>
        <Flowchart
          title="DE stack failure triage flow"
          chart={`flowchart TB
  FAIL[Stack CREATE or UPDATE failed]
  EVT[Open Events tab]
  FIRST[Find first FAILED resource]
  CAT{Categorize error}
  IAM[IAM PassRole trust fix]
  VPC[VPC subnet SG import fix]
  NAME[S3 naming collision fix]
  RDS[RDS subnet storage fix]
  FIX[Fix template or quota]
  CS[Create change set]
  EXEC[Execute update]
  SMOKE[Smoke test pipeline]
  FAIL --> EVT
  EVT --> FIRST
  FIRST --> CAT
  CAT --> IAM
  CAT --> VPC
  CAT --> NAME
  CAT --> RDS
  IAM --> FIX
  VPC --> FIX
  NAME --> FIX
  RDS --> FIX
  FIX --> CS
  CS --> EXEC
  EXEC --> SMOKE`}
        />
        <Callout variant="tip">
          On-call shortcut: 80% of DE stack failures are PassRole, ImportValue missing, or subnet/SG mismatch —
          check those three before deep-diving template syntax.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Events tab: first FAILED resource + status reason — maps to logical ID in template.',
          'Common DE failures: PassRole, ImportValue typo, Glue subnet/SG, S3 global name collision, RDS subnet group.',
          'Rollback states: UPDATE_ROLLBACK_COMPLETE safe to retry; FAILED needs continue rollback or manual skip.',
          'Change set Replace on RDS/EventBridge — preview prevents destructive prod surprises.',
          'Drift explains template vs reality gap — detect, backport console fixes, or revert manual changes.',
        ]}
      />
    </LessonArticle>
  )
}
