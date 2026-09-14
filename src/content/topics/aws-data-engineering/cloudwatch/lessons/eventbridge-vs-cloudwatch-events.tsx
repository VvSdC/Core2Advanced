import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function EventbridgeVsCloudwatchEvents() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Same bus, new name — do not let naming confuse your pipeline wiring">
        AWS renamed and expanded <strong className="text-white">CloudWatch Events</strong> into{' '}
        <strong className="text-white">Amazon EventBridge</strong>. Docs, console labels, and IAM actions
        still mix legacy and current names. Data engineers use EventBridge for scheduled Glue kicks, S3
        event routing, and alarm-driven automation — understanding the rename prevents broken Terraform
        modules and interview stumbles.
      </Callout>

      <Definition term="CloudWatch Events (legacy name)">
        <p>
          Original service: default event bus, rules matching event patterns, targets (Lambda, SQS, SNS,
          Step Functions). API namespace <span className="font-mono text-sm">events:</span> and metrics
          under <span className="font-mono text-sm">AWS/Events</span>. Many tutorials still say &quot;CloudWatch
          Events rule&quot; — functionally the default EventBridge bus today.
        </p>
      </Definition>

      <Definition term="Amazon EventBridge (current name)">
        <p>
          Superset of CloudWatch Events: <strong className="text-white">custom event buses</strong>,{' '}
          <strong className="text-white">Schema Registry</strong>,{' '}
          <strong className="text-white">API destinations</strong>,{' '}
          <strong className="text-white">Scheduler</strong> (successor to cron on rules), and{' '}
          <strong className="text-white">partner event sources</strong>. Default bus behavior unchanged —
          existing rules keep working.
        </p>
      </Definition>

      <LessonSection title="How they relate">
        <ContentStep number={1} title="Default event bus = CloudWatch Events bus">
          <p className="text-slate-300">
            AWS service events (S3 Object Created, Glue Job State Change, CloudTrail API calls) land on the{' '}
            <strong className="text-white">default bus</strong>. Rules you created as &quot;CloudWatch Events&quot;
            appear under EventBridge in the console. No migration required for standard DE patterns.
          </p>
        </ContentStep>
        <ContentStep number={2} title="CloudWatch Alarms as event sources">
          <p className="text-slate-300">
            Alarm state changes can trigger EventBridge via alarm action (where configured) or SNS → Lambda →
            custom event. More common: alarm → SNS directly; EventBridge used when multiple subscribers need
            the same alarm signal with content-based routing.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Metrics namespace AWS/Events">
          <p className="text-slate-300">
            Monitor <span className="font-mono text-sm">FailedInvocations</span> and{' '}
            <span className="font-mono text-sm">Invocations</span> on rules that trigger ingest Lambdas —
            silent target failures mean files land in S3 with no processing.
          </p>
        </ContentStep>
        <Flowchart
          title="Naming vs architecture — DE scheduled ingest"
          chart={`flowchart TB
  subgraph legacy [Legacy naming]
    CWE[CloudWatch Events rule cron]
  end
  subgraph current [Current naming]
    EB[EventBridge rule on default bus]
    SCH[EventBridge Scheduler]
  end
  CWE -.->|same default bus| EB
  SCH --> LAM[Lambda start Glue workflow]
  EB --> LAM
  S3[S3 ObjectCreated event] --> EB
  GLUE[Glue Job State Change] --> EB
  EB --> SF[Step Functions notify]`}
        />
      </LessonSection>

      <LessonSection title="Scheduling and routing for DE">
        <ContentStep number={1} title="Cron on EventBridge rules">
          <p className="text-slate-300">
            Rule with schedule expression <span className="font-mono text-sm">cron(0 6 * * ? *)</span> invokes
            Lambda to scan landing prefix or start Glue workflow. Still valid; for complex schedules and
            one-off runs, prefer <strong className="text-white">EventBridge Scheduler</strong> with flexible
            time windows and dead-letter support.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Event pattern routing">
          <p className="text-slate-300">
            Match <span className="font-mono text-sm">source: aws.glue</span>,{' '}
            <span className="font-mono text-sm">detail-type: Glue Job State Change</span>,{' '}
            <span className="font-mono text-sm">detail.state: FAILED</span> → SNS ops topic. Same bus pattern
            for S3 events with prefix filter in event pattern — decouple bucket notifications from Lambda
            ARNs for cleaner IaC.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Custom buses for multi-team lakes">
          <p className="text-slate-300">
            Publish pipeline lifecycle events (<span className="font-mono text-sm">CuratedPartitionReady</span>)
            to a custom bus — analytics team rules subscribe without touching ingest team Lambda permissions.
            CloudWatch Events name never had custom buses; EventBridge does.
          </p>
        </ContentStep>
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Task</th>
                <th className="px-4 py-3">Use</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Nightly Glue kickoff', 'EventBridge Scheduler → Step Functions or Lambda'],
                ['S3 landing → process', 'S3 Event Notifications → EventBridge → SQS/Lambda'],
                ['Glue FAILED alert', 'Event pattern on default bus → SNS/Slack Lambda'],
                ['Cross-account pipeline events', 'Custom event bus + resource policy'],
                ['Alarm fan-out to ticketing', 'SNS (simple) or EventBridge (multi-subscriber routing)'],
              ].map(([task, use]) => (
                <tr key={task} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{task}</td>
                  <td className="px-4 py-3">{use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="CloudWatch vs EventBridge — scope clarity">
        <Callout variant="tip" title="Interview clarity">
          CloudWatch = metrics, logs, alarms, dashboards. EventBridge = event routing and scheduling on
          buses. &quot;CloudWatch Events&quot; is the old name for the default bus feature now under EventBridge —
          not a separate product you choose instead of EventBridge.
        </Callout>
        <ContentStep number={1} title="Observability vs orchestration">
          <p className="text-slate-300">
            CloudWatch answers &quot;how healthy?&quot; EventBridge answers &quot;what happened and who should
            react?&quot; Glue failure metric in CloudWatch + EventBridge rule on FAILED state = metric alarm
            for trends, event rule for immediate workflow (disable downstream, open ticket).
          </p>
        </ContentStep>
      </LessonSection>

      <KeyTakeaways
        items={[
          'CloudWatch Events is the legacy name; EventBridge is the current service — default bus rules unchanged.',
          'EventBridge adds custom buses, Scheduler, schemas, API destinations beyond original CloudWatch Events.',
          'DE: schedule Glue/Lambda via rules or Scheduler; route S3/Glue events with event patterns on default bus.',
          'Monitor AWS/Events FailedInvocations on rules targeting ingest Lambdas — silent delivery failures.',
          'CloudWatch = metrics/logs/alarms; EventBridge = routing/scheduling — names overlap historically, not functionally.',
        ]}
      />
    </LessonArticle>
  )
}
