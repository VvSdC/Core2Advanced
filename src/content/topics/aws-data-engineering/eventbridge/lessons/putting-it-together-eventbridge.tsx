import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function PuttingItTogetherEventbridge() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="EventBridge wires the lake — schedules, landings, and failures">
        You covered targets, event patterns, S3 Object Created paths, custom and cross-account buses, archive
        and replay, DLQ and retry, input transformers, Schema Registry, end-to-end pipelines, SNS/SQS
        comparison, and CloudWatch monitoring. This checkpoint ties intermediate and advanced EventBridge
        lessons before <strong className="text-white">CloudFormation</strong> — IaC for rules, buses, and
        targets at platform scale.
      </Callout>

      <Definition term="EventBridge mental model for data engineering">
        <p>
          Amazon EventBridge is the <strong className="text-white">serverless event router</strong> for lake
          orchestration: S3 and Glue events on the default bus, application lifecycle on custom buses,
          schedules for SLA batch, content-filtered rules to Lambda/SQS/Step Functions/Glue, with archive,
          DLQ, and metrics for production reliability — not a message queue replacement for SNS or SQS.
        </p>
      </Definition>

      <LessonSection title="EventBridge sub-topic map">
        <Flowchart
          title="EventBridge lesson map — intermediate through advanced"
          chart={`flowchart TB
  START[EventBridge complete path]
  START --> TGT[Common targets]
  START --> PAT[Event pattern JSON]
  START --> S3E[S3 Object Created events]
  START --> BUS[Custom and partner buses]
  START --> XACC[Cross-account event bus]
  START --> ARQ[Archive replay DLQ retry]
  START --> XFORM[Input transformer]
  START --> SCH[Schema Registry]
  START --> PIPE[EventBridge driven pipelines]
  START --> VS[EventBridge vs SNS SQS]
  START --> MON[Monitoring EventBridge]
  TGT --> CFNEXT
  PAT --> CFNEXT
  S3E --> CFNEXT
  BUS --> CFNEXT
  XACC --> CFNEXT
  ARQ --> CFNEXT
  XFORM --> CFNEXT
  SCH --> CFNEXT
  PIPE --> CFNEXT
  VS --> CFNEXT
  MON --> CFNEXT
  CFNEXT[CloudFormation IaC next]`}
        />
      </LessonSection>

      <LessonSection title="Full EventBridge checkpoint — can you explain…">
        <ContentStep number={1} title="Targets and patterns">
          <p className="text-slate-300">
            When Lambda vs SQS vs Step Functions vs Glue workflow target? How S3 Object Created event pattern
            filters prefix and wildcard? Why enable EventBridge on bucket vs direct S3→Lambda?
          </p>
        </ContentStep>
        <ContentStep number={2} title="Buses and cross-account">
          <p className="text-slate-300">
            Default vs custom vs partner bus? When ingest team publishes to custom bus? Cross-account bus
            policy and PutEvents IAM for multi-account lake?
          </p>
        </ContentStep>
        <ContentStep number={3} title="Reliability">
          <p className="text-slate-300">
            Archive vs replay vs DLQ — when each? Retry policy tuning for fast-fail ingest? Idempotency
            requirement on replay?
          </p>
        </ContentStep>
        <ContentStep number={4} title="Transform and schema">
          <p className="text-slate-300">
            Input transformer InputPathsMap and InputTemplate for Step Functions? EventBridge Schema Registry
            vs Glue Schema Registry?
          </p>
        </ContentStep>
        <ContentStep number={5} title="Architecture and messaging">
          <p className="text-slate-300">
            Combine schedule + S3 + Glue state events in one pipeline? EventBridge vs SNS vs SQS roles in DE
            stack?
          </p>
        </ContentStep>
        <ContentStep number={6} title="Operations">
          <p className="text-slate-300">
            Which metric alarms first on silent ingest failure? DLQ triage runbook? Compare Invocations to S3
            PUT rate?
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
                  'S3 → EventBridge vs direct Lambda?',
                  'EventBridge: multi-target, rich patterns, archive/replay; direct: legacy single destination.',
                ],
                [
                  'Default vs custom bus?',
                  'Default: AWS service events. Custom: application PutEvents, team isolation, cross-account hub.',
                ],
                [
                  'EventBridge vs SNS?',
                  'EventBridge routes/filters AWS events with archive; SNS fan-out human alerts, no replay.',
                ],
                [
                  'When SQS in pipeline?',
                  'Buffer/debounce high-volume S3 events before Lambda/Glue — often EB target → SQS → Lambda.',
                ],
                [
                  'FailedInvocations meaning?',
                  'Target delivery failed after retries — usually IAM or invalid target ARN, not bad S3 file.',
                ],
                [
                  'Archive vs DLQ?',
                  'Archive stores matched bus events for replay; DLQ holds failed target deliveries for one rule.',
                ],
                [
                  'Input transformer purpose?',
                  'Reshape event fields into target payload via JSONPath + template — skip pass-through Lambda.',
                ],
                [
                  'Cross-account pattern?',
                  'Bus resource policy allows source PutEvents; consumer account rules invoke local Glue/Lambda.',
                ],
                [
                  'Replay risk?',
                  'Reprocesses historical events through current rules — requires idempotent partition writes.',
                ],
                [
                  'Schedule + event combined why?',
                  'S3 for real-time ingest; cron for nightly compaction/reconciliation when no files arrive.',
                ],
                [
                  'CloudWatch Events vs EventBridge?',
                  'Same default bus — EventBridge is current name plus custom buses, Scheduler, schemas.',
                ],
                [
                  'Schema Registry DE use?',
                  'Document detail-type contracts; discovery on custom bus; distinct from Glue stream registry.',
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
        <Callout variant="tip" title="Ready for CloudFormation when…">
          You can whiteboard S3 landing → EventBridge prefix rule → SQS debounce → Glue, explain cross-account
          bus policy, and alarm FailedInvocations plus DLQ — without opening the docs.
        </Callout>
      </LessonSection>

      <LessonSection title="What comes next — CloudFormation">
        <p className="text-slate-300">
          EventBridge rules, buses, archives, and targets belong in version-controlled IaC alongside Glue jobs
          and S3 buckets. <strong className="text-white">CloudFormation</strong> (and SAM/CDK) modules define
          event patterns, IAM execution roles, DLQ ARNs, and input transformers — preventing console drift when
          twelve teams share a data platform landing zone.
        </p>
        <Flowchart
          title="After EventBridge — course thread"
          chart={`flowchart LR
  VPC[VPC networking]
  EB[EventBridge checkpoint]
  CF[CloudFormation IaC]
  GLUE[Glue jobs]
  S3[(S3 lake)]
  VPC --> EB
  S3 --> EB
  EB --> CF
  CF --> GLUE
  CF --> EB`}
        />
        <Callout variant="insight">
          Revisit this checkpoint when onboarding DEs, debugging silent ingest (FailedInvocations first), or
          designing multi-account event hubs — answers trace to patterns, buses, DLQ, and monitoring lessons
          covered here.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'EventBridge: content-filtered router for S3/Glue/schedule/custom events — orchestration not queuing.',
          'Intermediate: targets, event patterns, S3 Object Created path — enable bucket notification, prefix rules.',
          'Advanced: custom/cross-account buses, archive/replay/DLQ, transformers, schema registry, monitoring.',
          'Combine with SNS (alerts) and SQS (buffer); alarm FailedInvocations and DLQ on every critical ingest rule.',
          'Next sub-topic: CloudFormation — IaC for rules, buses, roles, and DLQs at platform scale.',
        ]}
      />
    </LessonArticle>
  )
}
