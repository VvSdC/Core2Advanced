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

export function InsightsEvents() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Alerts for problems you did not know to write rules for">
        EventBridge rules and metric filters catch what you anticipated: StopLogging, root login, AccessDenied
        over a threshold. But what about a Lambda that suddenly calls <code className="text-core-400">PutObject</code>{' '}
        50 times more than usual, or an error spike on an API nobody thought to monitor?{' '}
        <strong className="text-white">CloudTrail Insights</strong> learns what normal looks like and flags
        deviations automatically.
      </Callout>

      <Definition term="CloudTrail Insights">
        <p>
          An optional trail feature that continuously analyzes events to build a per-API baseline (roughly the
          previous seven days in each Region) and logs an <strong className="text-white">Insights event</strong>{' '}
          when activity deviates. Two Insights types exist: <code className="text-core-400">ApiCallRateInsight</code>{' '}
          (unusual volume of calls per minute) and <code className="text-core-400">ApiErrorRateInsight</code>{' '}
          (unusual volume of calls returning errors). Each Insights occurrence is a start event and an end event
          sharing an ID.
        </p>
      </Definition>

      <LessonSection title="What Insights analyzes">
        <ContentStep number={1} title="Management events">
          <p className="text-slate-300">
            For management events, call-rate Insights analyze <strong className="text-white">write</strong>{' '}
            management API calls only — the trail must log write management events. Error-rate Insights analyze
            read or write management calls that return error codes, depending on what the trail logs.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Data events (newer)">
          <p className="text-slate-300">
            Per current AWS documentation, trails can also enable Insights on <strong className="text-white">data
            events</strong> — call rate and error rate for read or write data API calls such as S3{' '}
            <code className="text-core-400">PutObject</code> — provided the trail logs those data events. CloudTrail
            Lake event data stores support management-event Insights only. Older blog posts say Insights covers
            management write events only; that is no longer the full picture, so check the docs for your setup.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Where Insights events go">
          <p className="text-slate-300">
            Insights events are delivered to the trail bucket under a separate prefix,{' '}
            <code className="text-core-400">AWSLogs/111122223333/CloudTrail-Insight/</code>, appear in the console
            Insights view, and are sent to EventBridge — so you can route them to{' '}
            <code className="text-core-400">de-alerts-prod</code>. After enabling, the first Insights events can
            take up to about 36 hours while the baseline forms.
          </p>
        </ContentStep>
        <Example title="Enable Insights on the org trail" caption="Management and data event categories">
{`aws cloudtrail put-insight-selectors \\
  --trail-name org-trail-prod \\
  --insight-selectors '[
    {"InsightType": "ApiCallRateInsight",  "EventCategories": ["Management", "Data"]},
    {"InsightType": "ApiErrorRateInsight", "EventCategories": ["Management", "Data"]}
  ]'`}
        </Example>
        <Example title="EventBridge pattern for Insights" caption="Route every Insights event to the data team topic">
{`{
  "source": ["aws.cloudtrail"],
  "detail-type": ["AWS Insight via CloudTrail"]
}`}
        </Example>
      </LessonSection>

      <LessonSection title="Two data platform stories">
        <ContentStep number={1} title="Runaway Lambda writing to the lake">
          <p className="text-slate-300">
            A bug in the <code className="text-core-400">orders-landing</code> Lambda retries forever and writes
            small objects to <code className="text-core-400">acme-lake-prod/bronze/</code>. Normal rate: about 40
            PutObject calls per minute. After the deploy: 6,000 per minute. With data-event Insights on that
            prefix, a call-rate Insights event fires with the baseline and observed values, the top caller role,
            and the user agent — before the S3 request bill and small-file problem get out of hand.
          </p>
        </ContentStep>
        <ContentStep number={2} title="AccessDenied spike after an IAM change">
          <p className="text-slate-300">
            Someone tightens the <code className="text-core-400">glue-etl-orders-prod</code> role and removes{' '}
            <code className="text-core-400">glue:GetTable</code>. Every nightly job starts failing. An error-rate
            Insights event on <code className="text-core-400">GetTable</code> with{' '}
            <code className="text-core-400">AccessDenied</code> points straight at the change — pair it with an
            Athena query for recent <code className="text-core-400">PutRolePolicy</code> calls to find who made it.
          </p>
        </ContentStep>
        <Flowchart
          title="Insights detection flow"
          chart={`flowchart LR
  EV[Management and data events]
  BASE[Seven day baseline per API]
  CMP[Compare current rate]
  INS[Insights start and end events]
  S3[(CloudTrail-Insight prefix)]
  EB[EventBridge]
  SNS[SNS de-alerts-prod]
  EV --> BASE
  BASE --> CMP
  EV --> CMP
  CMP -->|deviation| INS
  INS --> S3
  INS --> EB
  EB --> SNS`}
        />
      </LessonSection>

      <LessonSection title="Cost and limitations">
        <ContentStep number={1} title="Pricing">
          <p className="text-slate-300">
            Insights is billed per events analyzed, per Insights type (historically around $0.35 per 100,000
            events — verify current pricing). Enabling both types on a busy org trail doubles the analysis charge,
            and data-event Insights on a hot S3 prefix can analyze enormous volumes. Start with management events;
            add data-event Insights on specific sensitive trails.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Limitations">
          <p className="text-slate-300">
            Insights are statistical, not semantic — a single malicious{' '}
            <code className="text-core-400">DeleteTable</code> will never look unusual in volume. Baselines adapt,
            so a slow ramp can become the new normal. Detection is per Region and per API, with delay measured in
            minutes, not seconds. Treat Insights as a complement to explicit EventBridge rules, not a replacement.
          </p>
        </ContentStep>
        <Callout variant="insight">
          Insights shine for operational anomalies on data platforms — runaway retries, throttling storms, broken
          permissions after deploys — as much as for security. Share the alerts with the pipeline on-call, not only
          the security team.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'CloudTrail Insights baselines normal API call and error rates and logs start and end Insights events on deviation.',
          'Management call-rate Insights use write events; error-rate uses read or write; trails can now add data-event Insights.',
          'Insights events land under a separate CloudTrail-Insight prefix and on EventBridge for routing to SNS.',
          'Great for runaway Lambdas writing to S3 and AccessDenied spikes after IAM changes.',
          'Billed per events analyzed per type; statistical, delayed, and blind to single high-impact calls.',
        ]}
      />
    </LessonArticle>
  )
}
