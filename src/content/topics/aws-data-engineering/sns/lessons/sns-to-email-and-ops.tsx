import {
  Callout,
  ContentStep,
  Definition,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function SnsToEmailAndOps() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Email is still the lowest-friction ops channel">
        SNS email subscriptions remain the fastest way to wire CloudWatch alarms to humans — no Lambda,
        no webhook rotation. For data engineering on-call, combine email with Slack (via Lambda or HTTPS)
        and document the <strong className="text-white">subscription confirmation</strong> step so new
        team members actually receive critical Glue failure pages.
      </Callout>

      <Definition term="SNS email subscription">
        <p>
          Email protocol delivers plain-text or JSON alarm bodies to subscribed addresses. Each address must{' '}
          <strong className="text-white">confirm</strong> the subscription via link click before receiving
          messages. Unconfirmed subscriptions silently drop traffic — a common post-deploy surprise when
          alarms show ALARM state but nobody was notified.
        </p>
      </Definition>

      <LessonSection title="SNS → Email for ops alerting">
        <ContentStep number={1} title="CloudWatch alarm wiring">
          <p className="text-slate-300">
            Create topic <span className="font-mono text-sm">data-ops-critical</span> → subscribe team
            distribution list → add SNS action on Lambda Errors, Glue failed runs, DLQ depth, and custom
            IngestLag alarms. Put runbook URL in alarm description — it appears in email body.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Severity tiers">
          <p className="text-slate-300">
            Separate topics: <span className="font-mono text-sm">critical</span> (email + SMS for primary),
            <span className="font-mono text-sm"> warning</span> (email only),{' '}
            <span className="font-mono text-sm">info</span> (digest queue). Prevents nightly staging noise
            from training on-call to ignore prod Glue failures.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Email limitations">
          <p className="text-slate-300">
            No guaranteed ordering, no replay, no DLQ for email protocol. Message size limits apply.
            Sensitive data in alarm JSON may leak via email — scrub bucket keys with PII from custom metric
            payloads before publishing to shared topics.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Beyond email">
          <p className="text-slate-300">
            HTTPS subscriptions to PagerDuty/Opsgenie endpoints. SMS for true wake-up (cost and rate limits).
            SNS → SQS → Lambda for rich Slack blocks with buttons linking to Athena saved queries and Glue
            job run console — email for backup when chat integration fails.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Confirmation / subscription confirmation tip">
        <ContentStep number={1} title="Pending confirmation state">
          <p className="text-slate-300">
            New email subscriptions start as <span className="font-mono text-sm">PendingConfirmation</span>.
            AWS sends Confirm subscription email with unique link — must click within 3 days (default) or
            re-subscribe. Automate checks in IaC pipelines: fail deploy if subscription not confirmed in
            prod account.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Team onboarding runbook">
          <p className="text-slate-300">
            Document: (1) subscribe corporate email to correct topic ARN, (2) click confirmation link from{' '}
            <span className="font-mono text-sm">no-reply@sns.amazonaws.com</span>, (3) verify with test
            publish from console, (4) confirm CloudWatch alarm action points to same topic. Rotation handoff:
            add new on-call email before removing old — overlap one week.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Cross-account email">
          <p className="text-slate-300">
            Central ops account hosts SNS topics; workload accounts publish via topic policy. Email
            subscribers live in ops account — workload team never manages paging lists in twelve accounts.
            Same confirmation rules apply per subscriber ARN.
          </p>
        </ContentStep>
        <Callout variant="tip" title="Confirmation checklist">
          After every IaC apply touching SNS: open Subscriptions tab → filter PendingConfirmation → zero
          rows in prod. Test alarm with manual metric breaching threshold — email arrives within one
          evaluation period.
        </Callout>
        <Callout variant="insight">
          Email confirmation is a security feature — random addresses cannot receive your pipeline failure
          details. Treat unconfirmed subs as a deployment blocker, not an ops afterthought.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'SNS email is the simplest CloudWatch alarm path — subscribe distro list, confirm, attach alarm action.',
          'Subscriptions stay PendingConfirmation until link click — unconfirmed subs receive nothing.',
          'Tier topics by severity; scrub PII from alarm payloads before broad email topics.',
          'Email has no DLQ/replay — pair with SNS → SQS archive or Slack Lambda for durable alert history.',
          'Onboarding runbook: subscribe, confirm no-reply email, test publish, verify alarm topic ARN match.',
        ]}
      />
    </LessonArticle>
  )
}
