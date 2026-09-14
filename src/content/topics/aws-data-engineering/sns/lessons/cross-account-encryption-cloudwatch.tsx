import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function CrossAccountEncryptionCloudwatch() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Production SNS spans accounts, keys, and metrics">
        Enterprise lake platforms centralize ops topics in a shared account while workload accounts publish
        pipeline events. <strong className="text-white">Cross-account SNS</strong>,{' '}
        <strong className="text-white">KMS encryption</strong>, and{' '}
        <strong className="text-white">CloudWatch metrics</strong> on delivery failures form the security
        and operability layer around the fan-out patterns you built in earlier lessons.
      </Callout>

      <Definition term="Cross-account SNS">
        <p>
          A topic in account A accepts publishes from account B via topic policy and (for encrypted topics)
          KMS key policy. Subscribers can live in any account with appropriate IAM and subscription
          confirmation. DE pattern: platform account hosts{' '}
          <span className="font-mono text-sm">data-ops-alerts</span>; prod/staging workload accounts
          publish Glue failures without duplicating paging infrastructure.
        </p>
      </Definition>

      <LessonSection title="Cross-account SNS overview">
        <ContentStep number={1} title="Topic policy for publishers">
          <p className="text-slate-300">
            Topic owner adds policy statement allowing{' '}
            <span className="font-mono text-sm">sns:Publish</span> from workload account root or specific
            IAM roles (Glue service role, Lambda execution role). Scope by{' '}
            <span className="font-mono text-sm">aws:SourceAccount</span> condition to prevent confused
            deputy — only trusted accounts may publish.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Cross-account subscribers">
          <p className="text-slate-300">
            SQS in account B subscribes to topic in account A — queue policy must allow SNS ARN from A;
            topic owner confirms subscription. Lambda cross-account invoke requires resource policy on
            function in subscriber account. Email/SMS subscribers are account-agnostic once confirmed.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Organization-wide standards">
          <p className="text-slate-300">
            AWS Organizations SCPs may restrict who creates public SNS topics or who can subscribe HTTP
            endpoints. Platform team exports topic ARNs via SSM Parameter Store; workload teams reference
            parameters in IaC — single source of truth for ops routing.
          </p>
        </ContentStep>
        <Flowchart
          title="Cross-account publish and subscribe"
          chart={`flowchart LR
  GLUE[Glue account B]
  LAM[Lambda account B]
  TOPIC[SNS topic account A platform]
  Q[SQS subscriber account B]
  EMAIL[Email on-call account A]
  GLUE -->|Publish pipeline fail| TOPIC
  LAM -->|Publish custom metric| TOPIC
  TOPIC --> Q
  TOPIC --> EMAIL`}
        />
      </LessonSection>

      <LessonSection title="Encryption (KMS teaser)">
        <Definition term="SNS server-side encryption">
          <p>
            Enable SSE on SNS with AWS managed key (<span className="font-mono text-sm">alias/aws/sns</span>)
            or customer managed CMK. Encrypted topics require publishers and subscribers to have{' '}
            <span className="font-mono text-sm">kms:Decrypt</span> and{' '}
            <span className="font-mono text-sm">kms:GenerateDataKey</span> on the key. SQS subscriptions
            need matching encryption — SNS cannot deliver to unencrypted queue if topic mandates KMS without
            key policy alignment.
          </p>
        </Definition>
        <ContentStep number={1} title="CMK policy for DE">
          <p className="text-slate-300">
            Key policy grants <span className="font-mono text-sm">sns.amazonaws.com</span> use of key in
            topic account; grants workload account roles <span className="font-mono text-sm">kms:GenerateDataKey*</span>{' '}
            for Publish. Missing key permission surfaces as cryptic AccessDenied on publish — check KMS
            before SNS topic policy.
          </p>
        </ContentStep>
        <ContentStep number={2} title="SQS KMS chain">
          <p className="text-slate-300">
            If both topic and queue use CMKs, both key policies must trust SNS and the consuming Lambda
            role needs decrypt on queue key. Standard pattern: one platform CMK for ops topics and
            subscribed queues in platform account; cross-account publish uses key policy with source account
            condition.
          </p>
        </ContentStep>
        <Callout variant="insight">
          Full KMS deep dive lives in security lessons — for SNS interviews: &quot;encrypted topic means
          publisher, SNS, and SQS subscriber all need aligned KMS permissions.&quot;
        </Callout>
      </LessonSection>

      <LessonSection title="SNS + CloudWatch (metrics/alarms on delivery)">
        <ContentStep number={1} title="Key SNS metrics">
          <p className="text-slate-300">
            Namespace <span className="font-mono text-sm">AWS/SNS</span>:{' '}
            <span className="font-mono text-sm">NumberOfMessagesPublished</span>,{' '}
            <span className="font-mono text-sm">NumberOfNotificationsDelivered</span>,{' '}
            <span className="font-mono text-sm">NumberOfNotificationsFailed</span>,{' '}
            <span className="font-mono text-sm">PublishSize</span>. Dimensions: TopicName, optional
            subscription filter for per-subscriber troubleshooting.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Alarms DE teams need">
          <p className="text-slate-300">
            Alarm when <span className="font-mono text-sm">NumberOfNotificationsFailed</span> &gt; 0 for
            critical ingest topic — indicates SQS policy, KMS, or Lambda permission regression. Compare
            published vs delivered during replay drills — large gap means subscription outage.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Closing the loop">
          <p className="text-slate-300">
            SNS delivery failure alarm → same ops topic (if healthy) or fallback email/SMS → runbook:
            check subscription DLQ depth, queue policy, KMS key policy, recent IaC change. Meta-alerting:
            monitor the monitor without infinite SNS recursion — use separate fallback channel.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Dashboards">
          <p className="text-slate-300">
            Platform dashboard widget per topic: publish rate, delivery success rate, failed count. Overlay
            with SQS ApproximateNumberOfMessagesVisible on downstream queues — distinguishes SNS delivery
            failure from consumer backlog.
          </p>
        </ContentStep>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Cross-account SNS: topic policy + kms key policy for publishers; queue/function policies for subscribers.',
          'Use aws:SourceAccount condition on topic policy to prevent confused deputy cross-account publish.',
          'Encrypted SNS requires KMS permissions for publishers, SNS service, and encrypted SQS subscribers.',
          'CloudWatch AWS/SNS metrics: alert on NumberOfNotificationsFailed for critical pipeline topics.',
          'Platform account centralizes ops topics; workload accounts publish via SSM-published topic ARNs.',
        ]}
      />
    </LessonArticle>
  )
}
