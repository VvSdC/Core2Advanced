import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function CloudwatchIntegrations() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="An alarm nobody receives is decoration">
        CloudWatch Alarms expose a problem. <strong className="text-white">Integrations</strong> — SNS,
        Lambda, EventBridge — deliver that signal to humans, runbooks, and automated remediation. Data
        engineering platforms wire alarm actions into Slack, PagerDuty, ticket queues, and safe auto-retry
        Lambdas so Glue failures and DLQ depth do not wait for someone to refresh a dashboard.
      </Callout>

      <Definition term="Alarm action">
        <p>
          When an alarm enters <span className="font-mono text-sm">ALARM</span> (or optionally{' '}
          <span className="font-mono text-sm">OK</span>), configured actions fire: publish to SNS topic,
          invoke Lambda, send to EventBridge, scale Application Auto Scaling, or stop/terminate EC2 (rare
          in DE). Multiple actions per transition are supported — SNS for humans plus Lambda for runbook
          start.
        </p>
      </Definition>

      <LessonSection title="CloudWatch → SNS">
        <ContentStep number={1} title="Primary paging path">
          <p className="text-slate-300">
            Create SNS topic <span className="font-mono text-sm">data-ops-critical</span>; subscribe email,
            SMS, HTTPS (PagerDuty/Slack webhook), or SQS for audit. Alarm action targets topic ARN. Message
            includes alarm name, account, region, reason — enrich with CloudWatch alarm description field
            linking runbook URL.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Fan-out">
          <p className="text-slate-300">
            One SNS topic → many subscribers: on-call phone, Slack integration Lambda, SQS archive for
            compliance. Separate topics by severity so low-priority S3 4xx warnings do not wake primary
            on-call for Lambda ingest failures.
          </p>
        </ContentStep>
        <ContentStep number={3} title="SNS → SQS pattern">
          <p className="text-slate-300">
            Subscribe SQS queue to SNS for durable alert log — replay notifications during postmortems.
            Another Lambda consumes queue to format Slack blocks with Links to Logs Insights saved query.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="CloudWatch → Lambda">
        <ContentStep number={1} title="Runbook automation">
          <p className="text-slate-300">
            Alarm invokes remediation Lambda with event payload describing alarm name and state. Safe actions:
            snapshot diagnostic context to S3, post enriched Slack message, scale ASG, disable canary alias.
            Avoid infinite loops — remediation Lambda errors should not trigger same alarm uncapped.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Auto-retry with guardrails">
          <p className="text-slate-300">
            DLQ depth alarm → Lambda reads first message, checks error class, replays to main queue only
            if schema fix deployed — cap retries via DynamoDB counter. Glue failure → Lambda gathers JobRunId
            logs snippet and attaches to ticket API.
          </p>
        </ContentStep>
        <ContentStep number={3} title="IAM">
          <p className="text-slate-300">
            CloudWatch Alarms need permission to invoke Lambda (resource policy on function allowing{' '}
            <span className="font-mono text-sm">lambda:InvokeFunction</span> from alarms.amazonaws.com).
            Least privilege on remediation role — read DLQ, write Slack, no blanket S3 delete.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="CloudWatch → EventBridge">
        <ContentStep number={1} title="Content-based routing">
          <p className="text-slate-300">
            Put alarm events on EventBridge (via direct integration or SNS/Lambda relay) and route by
            alarm name prefix: <span className="font-mono text-sm">ingest-*</span> → ingest team bus,
            <span className="font-mono text-sm">glue-*</span> → ETL team targets. Decouples alarm definition
            from subscriber list — new team adds rule without editing every alarm.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Combine with service events">
          <p className="text-slate-300">
            Same EventBridge bus handles Glue FAILED events and custom application events — unified
            orchestration: failed job rule triggers Step Functions cleanup; CloudWatch alarm on lag triggers
            scale-out Lambda. Single observability-to-action layer in large accounts.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Alerting fan-out flowchart">
        <Flowchart
          title="DE alerting fan-out from CloudWatch Alarm"
          chart={`flowchart TB
  MET[Metric breach Lambda Errors DLQ depth]
  ALM[CloudWatch Alarm ALARM state]
  MET --> ALM
  ALM --> SNS[SNS data-ops-critical]
  ALM --> LAM[Remediation Lambda]
  ALM --> EB[EventBridge optional bus]
  SNS --> EMAIL[Email on-call]
  SNS --> SLACK[Slack via HTTPS or Lambda]
  SNS --> PD[PagerDuty]
  SNS --> ARCH[SQS alert archive]
  LAM --> RUN[Runbook gather logs snapshot]
  LAM --> RETRY[Guarded DLQ replay]
  EB --> TEAM[Team-specific rules Step Functions]`}
        />
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Integration</th>
                <th className="px-4 py-3">Best for</th>
                <th className="px-4 py-3">DE example</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['SNS', 'Human notification, simple fan-out', 'Lambda Errors → Slack + PagerDuty'],
                ['Lambda', 'Enrichment, guarded automation', 'DLQ alarm → diagnostic Lambda + conditional replay'],
                ['EventBridge', 'Multi-team routing, event-driven ops', 'Alarm signal + Glue FAILED → unified workflow'],
                ['SNS → SQS', 'Durable alert history', 'Compliance audit of all pipeline pages'],
              ].map(([integration, best, example]) => (
                <tr key={integration} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{integration}</td>
                  <td className="px-4 py-3">{best}</td>
                  <td className="px-4 py-3">{example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="insight">
          Test alarm actions in staging with manual alarm state or low thresholds — prod first page during
          misconfigured SNS subscription is a common onboarding mistake.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Alarm actions fire on ALARM/OK — SNS, Lambda, EventBridge, Auto Scaling; multiple actions allowed.',
          'SNS is default human paging path — fan-out to Slack, PagerDuty, email; severity-split topics.',
          'Lambda remediation: enrich alerts, guarded DLQ replay, log snapshots — avoid unbounded retry loops.',
          'EventBridge routes alarm-related signals with service events for multi-team DE platforms.',
          'Test subscriptions in staging; include runbook links in alarm descriptions and Slack formatters.',
        ]}
      />
    </LessonArticle>
  )
}
