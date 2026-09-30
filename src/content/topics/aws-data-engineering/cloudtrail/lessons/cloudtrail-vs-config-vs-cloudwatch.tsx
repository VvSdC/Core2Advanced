import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function CloudtrailVsConfigVsCloudwatch() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Three services, three different questions">
        Interviewers love this one because the names blur together. The trick is to anchor each service to the
        question it answers. <strong className="text-white">CloudTrail</strong>: who did what, when, from where?{' '}
        <strong className="text-white">AWS Config</strong>: what does this resource look like now, what did it look
        like last Tuesday, and is it compliant? <strong className="text-white">CloudWatch</strong>: how is the
        system behaving at runtime — metrics, logs, alarms?
      </Callout>

      <Definition term="AWS Config">
        <p>
          A service that records <strong className="text-white">configuration items</strong> — point-in-time
          snapshots of supported resources such as S3 buckets, IAM roles, security groups, and Glue jobs — every
          time they change, building a configuration timeline. <strong className="text-white">Config rules</strong>{' '}
          (AWS managed or custom Lambda or Guard rules) continuously evaluate resources for compliance, for example{' '}
          <code className="text-core-400">s3-bucket-public-read-prohibited</code>, with optional automatic
          remediation through Systems Manager documents.
        </p>
      </Definition>

      <LessonSection title="Side by side">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Aspect</th>
                <th className="px-4 py-3">CloudTrail</th>
                <th className="px-4 py-3">AWS Config</th>
                <th className="px-4 py-3">CloudWatch</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Core question', 'Who called which API, when, from where', 'What is the resource state now and over time', 'How is the workload performing right now'],
                ['Unit of data', 'API event record', 'Configuration item and compliance result', 'Metric data point, log event, alarm state'],
                ['Typical DE use', 'Who deleted silver.orders; who changed the bucket policy', 'Is acme-lake-prod encrypted and non-public; drift history', 'Glue job duration, Lambda errors, Redshift CPU, pipeline logs'],
                ['Alerting', 'EventBridge rules, metric filters, Insights', 'Noncompliant rule evaluations, remediation', 'Metric alarms, anomaly detection, composite alarms'],
                ['History', '90-day Event history; trails to S3 for years', 'Timeline retained per configured retention period', 'Metrics up to 15 months; logs per retention setting'],
                ['Blind spot', 'Current state; SQL inside databases', 'Who made the change; runtime health', 'Who changed what; resource configuration'],
              ].map(([aspect, ct, cfg, cw]) => (
                <tr key={aspect} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{aspect}</td>
                  <td className="px-4 py-3">{ct}</td>
                  <td className="px-4 py-3">{cfg}</td>
                  <td className="px-4 py-3">{cw}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="info">
          Config links each configuration change to the related CloudTrail events, so the two are designed to be
          used together: Config shows the diff, CloudTrail shows the caller.
        </Callout>
      </LessonSection>

      <LessonSection title="One incident through three lenses">
        <p className="text-slate-300">
          Tuesday morning, the nightly <code className="text-core-400">orders_silver</code> Glue job failed and the
          dashboard is stale. Here is what each service contributes.
        </p>
        <ContentStep number={1} title="CloudWatch sees the symptom">
          <p className="text-slate-300">
            The Glue job failure alarm fired at 02:14 to <code className="text-core-400">de-alerts-prod</code>. Job
            logs in CloudWatch Logs show <code className="text-core-400">AccessDenied</code> on{' '}
            <code className="text-core-400">s3:GetObject</code> for{' '}
            <code className="text-core-400">acme-lake-prod/bronze/orders/</code>. You know what broke, not why.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Config sees what changed">
          <p className="text-slate-300">
            The Config timeline for the bucket shows a new bucket policy version at 23:52 the previous evening —
            with an added explicit deny for principals outside a VPC endpoint. The{' '}
            <code className="text-core-400">s3-bucket-ssl-requests-only</code> rule is still compliant, but the diff
            is right there.
          </p>
        </ContentStep>
        <ContentStep number={3} title="CloudTrail sees who did it">
          <p className="text-slate-300">
            The linked <code className="text-core-400">PutBucketPolicy</code> event shows the platform team&apos;s
            Terraform role, invoked from their CI runner, during an approved hardening change that forgot the Glue
            job does not run inside the VPC. Fix: give the job a Glue network connection so its S3 traffic uses the
            gateway endpoint, and add pipeline roles to the change checklist.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Prevent the repeat">
          <p className="text-slate-300">
            Add a custom Config rule that flags lake bucket policies missing the pipeline role exceptions, an
            EventBridge rule on <code className="text-core-400">PutBucketPolicy</code> for{' '}
            <code className="text-core-400">acme-lake-prod</code>, and keep the CloudWatch job alarm. Each service
            now covers the stage it is best at: prevention, notification, and symptom detection.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Security Hub and GuardDuty on top">
        <ContentStep number={1} title="GuardDuty: threat detection">
          <p className="text-slate-300">
            Consumes CloudTrail, VPC Flow Logs, DNS, and optional S3 or runtime signals to flag malicious activity
            — credential exfiltration, crypto mining, anomalous S3 access. It detects threats; you still use
            CloudTrail to investigate.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Security Hub: posture and aggregation">
          <p className="text-slate-300">
            Runs security standards (AWS Foundational Security Best Practices, CIS) largely using Config under the
            hood, and aggregates findings from GuardDuty, Inspector, Macie, and others across accounts into one
            prioritized view. Enable it org-wide from a delegated admin account.
          </p>
        </ContentStep>
        <Flowchart
          title="Which service answers my question"
          chart={`flowchart TB
  Q[What do you need to know]
  Q -->|who made a change| CT[CloudTrail]
  Q -->|resource state or compliance| CFG[AWS Config]
  Q -->|runtime health or logs| CW[CloudWatch]
  Q -->|is this an active threat| GD[GuardDuty]
  Q -->|overall posture across accounts| SH[Security Hub]
  CFG -->|linked events| CT
  GD -->|investigate with| CT
  SH -->|aggregates| GD
  SH -->|uses rules from| CFG`}
        />
        <Callout variant="tip">
          In interviews, answer with the question-first framing, then give the incident story. It shows you know
          the services are complementary layers, not competitors.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'CloudTrail answers who did what, when, and from where — the API history.',
          'AWS Config records resource configuration over time and evaluates compliance rules with optional remediation.',
          'CloudWatch covers runtime behavior: metrics, logs, alarms for Glue, Lambda, Redshift, and pipelines.',
          'Real incidents use all three: CloudWatch shows the symptom, Config the diff, CloudTrail the caller.',
          'GuardDuty detects threats and Security Hub aggregates posture and findings on top of these sources.',
        ]}
      />
    </LessonArticle>
  )
}
