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

export function PuttingItTogetherCloudtrailBeginner() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Checkpoint before org trails and Athena">
        You now know what CloudTrail records and what it misses, how free event history differs from trails
        in S3, why data events are off by default and cost money, how to read a raw event including assumed
        roles, and which DE questions CloudTrail answers. This lesson ties those threads into a{' '}
        <strong className="text-white">beginner CloudTrail checklist</strong> — the mental model you need
        before organization trails, log integrity, Athena queries, and CloudTrail Lake.
      </Callout>

      <Definition term="Beginner CloudTrail mental model">
        <p>
          A <strong className="text-white">beginner CloudTrail mental model</strong> for DE includes: event
          history as the free 90-day safety net, one multi-Region trail delivering to a protected S3 bucket
          with log file validation, management events on by default, data events scoped to sensitive prefixes
          with advanced event selectors, S3 lifecycle for retention, the habit of reading{' '}
          <code className="text-core-400">userIdentity</code>, <code className="text-core-400">eventName</code>,{' '}
          and <code className="text-core-400">errorCode</code> first, and tracing assumed roles back to a
          person — all before org-wide trails and SQL analysis in production.
        </p>
      </Definition>

      <LessonSection title="Architecture checklist — can you draw this?">
        <ContentStep number={1} title="Event history — always there">
          <p className="text-slate-300">
            Every account, every Region, 90 days of management events at no cost. First stop for &quot;what
            happened last night?&quot;
          </p>
        </ContentStep>
        <ContentStep number={2} title="Multi-Region trail to S3">
          <p className="text-slate-300">
            <code className="text-core-400">acme-trail-prod</code> writes to{' '}
            <code className="text-core-400">acme-cloudtrail-logs-archive</code> with log file validation on
            and <code className="text-core-400">IsLogging: true</code> confirmed.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Data events — scoped, not everywhere">
          <p className="text-slate-300">
            Advanced event selectors log S3 object reads and writes on{' '}
            <code className="text-core-400">acme-lake-prod/gold/pii/</code> only — not every dashboard read on
            the whole lake.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Protected, lifecycle-managed bucket">
          <p className="text-slate-300">
            Block Public Access, tight delete permissions, SSE-KMS optional, lifecycle to Glacier and expiry
            matching the retention policy.
          </p>
        </ContentStep>
        <ContentStep number={5} title="Consumers of the logs">
          <p className="text-slate-300">
            On-call uses event history and the S3 logs today; Athena, CloudWatch Logs metric filters, and
            EventBridge alerts come next in this sub-topic.
          </p>
        </ContentStep>
        <Flowchart
          title="Beginner DE CloudTrail setup"
          chart={`flowchart TD
  API[Glue S3 KMS IAM API calls] --> EH[Event history 90 days]
  API --> TR[acme-trail-prod multi-Region]
  SEL[Data events gold pii prefix] --> TR
  TR --> S3[acme-cloudtrail-logs-archive]
  S3 --> LC[Lifecycle to Glacier then expire]
  S3 --> NEXT[Athena and alerts — next]`}
        />
      </LessonSection>

      <LessonSection title="Self-check — can you explain these?">
        <ContentStep number={1} title="What is CloudTrail in one sentence?">
          <p className="text-slate-300">
            The record of API calls in your account — who, what, when, where, and result — from the console,
            CLI, SDKs, and AWS services.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Event history vs trail">
          <p className="text-slate-300">
            Event history = free, 90 days, management events, per Region. Trail = log files in your S3 bucket
            with retention you control.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Management vs data events">
          <p className="text-slate-300">
            Management = configuration changes such as DeleteTable or PutBucketPolicy. Data = object and item
            access such as GetObject — off by default and billed per event.
          </p>
        </ContentStep>
        <ContentStep number={4} title="What does CloudTrail not see?">
          <p className="text-slate-300">
            Commands inside EC2, SQL inside Redshift or RDS, network packets, and S3 reads without data
            events.
          </p>
        </ContentStep>
        <ContentStep number={5} title="Which fields do you read first?">
          <p className="text-slate-300">
            <code className="text-core-400">eventName</code>, <code className="text-core-400">eventTime</code>{' '}
            (UTC), <code className="text-core-400">userIdentity</code>,{' '}
            <code className="text-core-400">requestParameters</code>, and{' '}
            <code className="text-core-400">errorCode</code>.
          </p>
        </ContentStep>
        <ContentStep number={6} title="How do you attribute an AssumedRole event?">
          <p className="text-slate-300">
            Session issuer for the role, session name as a hint, and the matching AssumeRole event via the
            temporary <code className="text-core-400">accessKeyId</code> for the real caller.
          </p>
        </ContentStep>
        <ContentStep number={7} title="First debug when a pipeline role gets AccessDenied?">
          <p className="text-slate-300">
            Filter events for that role with an <code className="text-core-400">errorCode</code>, read the
            eventSource, then look for a policy change just before the first failure.
          </p>
        </ContentStep>
        <Example title="Beginner CloudTrail concept drill" caption="No console required yet — explain aloud">
{`1. Draw: API calls → event history + trail → S3 log bucket → lifecycle
2. Why is event history not enough for a SOC 2 audit covering 12 months?
3. Name three management events and two data events a DE team cares about
4. Estimate the data event cost of a job that reads 2 million S3 objects nightly
5. In a DeleteTable event, which field tells you the table name?
6. userIdentity.type is AssumedRole — what are your next two lookups?
7. How does CloudTrail fit after KMS in the learning path?`}
        </Example>
        <Callout variant="insight">
          Strong CloudTrail beginners ask three questions before an incident, not during one: is there a trail
          beyond 90 days, are data events on for the sensitive prefixes, and can we attribute role sessions to
          people — a &quot;no&quot; on any of them turns a 10-minute investigation into a guess.
        </Callout>
      </LessonSection>

      <LessonSection title="Mini scenario — end-to-end story">
        <p className="text-slate-300">
          At 07:00 the Acme revenue dashboard is empty: the Glue table{' '}
          <code className="text-core-400">silver.orders</code> no longer exists. On-call opens CloudTrail event
          history in <code className="text-core-400">us-east-1</code>, filters by event name{' '}
          <code className="text-core-400">DeleteTable</code>, and finds one event at{' '}
          <code className="text-core-400">23:41:18Z</code>: type <code className="text-core-400">AssumedRole</code>,
          session issuer <code className="text-core-400">de-dev-admin</code>, session name{' '}
          <code className="text-core-400">priya.sharma</code>, user agent{' '}
          <code className="text-core-400">aws-cli</code>. Priya confirms she ran a dev cleanup script with the
          wrong profile. The S3 Parquet under <code className="text-core-400">silver/orders/</code> is intact
          because deleting a catalog table does not delete data. Table versions go away with a deleted table,
          so the team recreates the definition from the CloudFormation template (the earlier{' '}
          <code className="text-core-400">CreateTable</code> event&apos;s request parameters would also work)
          and re-runs the crawler to register partitions. Follow-ups: a multi-Region trail so evidence survives
          past 90 days, data events on <code className="text-core-400">gold/pii/</code>, and an IAM deny on{' '}
          <code className="text-core-400">glue:DeleteTable</code> for prod silver and gold databases from the
          dev admin role.
        </p>
        <ContentStep number={1} title="Detection tier — the symptom">
          <p className="text-slate-300">Empty dashboard and failed Athena query — table not found.</p>
        </ContentStep>
        <ContentStep number={2} title="Evidence tier — CloudTrail">
          <p className="text-slate-300">DeleteTable event with role, session name, time, and tool.</p>
        </ContentStep>
        <ContentStep number={3} title="Recovery tier — catalog and S3">
          <p className="text-slate-300">Data untouched in S3; definition rebuilt from IaC; partitions re-crawled.</p>
        </ContentStep>
        <ContentStep number={4} title="Prevention tier — trail, data events, IAM">
          <p className="text-slate-300">Long-term trail, PII data events, and least privilege on destructive Glue APIs.</p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="What's next">
        <p className="text-slate-300">
          The next lessons in the CloudTrail track build on everything this beginner pass introduced:
        </p>
        <ContentStep number={1} title="Organization and multi-Region trails">
          <p className="text-slate-300">
            One <code className="text-core-400">org-trail-prod</code> for every account and Region, delivered
            to a central log archive account that member accounts cannot tamper with.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Log integrity and encryption">
          <p className="text-slate-300">
            Digest files and validation, SSE-KMS with the key policies from the KMS lessons, and Object Lock
            for tamper-resistant evidence.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Querying CloudTrail with Athena">
          <p className="text-slate-300">
            Partition-projected tables over the S3 layout and the SQL questions auditors and on-call actually
            ask.
          </p>
        </ContentStep>
        <ContentStep number={4} title="CloudTrail Lake">
          <p className="text-slate-300">
            Managed event data stores with built-in SQL and retention — and when they beat a DIY Athena setup.
          </p>
        </ContentStep>
        <p className="mt-4 text-slate-300">
          CloudTrail connects everything you built in prior modules: IAM roles are the identities it records,
          S3 stores its logs, KMS encrypts them, Athena will query them, and EventBridge will react to them.
          Advanced lessons assume you can read a raw event and attribute an assumed-role session without
          opening the docs.
        </p>
        <Callout variant="tip" title="Before your first production incident">
          Run a drill in dev: delete a throwaway Glue table, then time how long it takes a teammate to find
          who did it using only CloudTrail. Teams that practice this find the gaps — missing trails, vague
          session names — before an auditor or outage does.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Beginner model: event history as safety net, multi-Region trail to a protected S3 bucket, scoped data events, lifecycle retention.',
          'Self-check: CloudTrail definition, event history vs trail, management vs data events, blind spots, key fields, AssumedRole attribution, AccessDenied triage.',
          'End-to-end: missing Glue table → DeleteTable event → role session traced to a person → rebuild from IaC and re-crawl → prevention controls.',
          'Next in CloudTrail track: organization trails, log integrity and encryption, Athena queries, and CloudTrail Lake.',
        ]}
      />
    </LessonArticle>
  )
}
