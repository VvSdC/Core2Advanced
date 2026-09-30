import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function PuttingItTogetherCloudtrail() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="CloudTrail for DE — org trails, tamper-proof logs, queries, and alerts">
        You covered organization and multi-Region trails, log integrity and encryption, Athena over CloudTrail,
        CloudTrail Lake, EventBridge real-time alerts, CloudWatch metric filters, Insights events, data access
        auditing, forensics, and how CloudTrail relates to Config and CloudWatch. This checkpoint ties the
        intermediate and advanced lessons together before <strong className="text-white">Systems Manager</strong>{' '}
        — safely operating the servers behind your pipelines.
      </Callout>

      <Definition term="CloudTrail mental model for data engineering">
        <p>
          AWS CloudTrail is the <strong className="text-white">system of record for API activity</strong>: one
          multi-Region organization trail delivering to a locked log-archive bucket with SSE-KMS and integrity
          digests; Athena (or Lake, where available) for questions; EventBridge, metric filters, and Insights for
          detection; targeted data events plus engine audit logs for data access — not a metrics tool, not a
          configuration inventory, and not a record of SQL inside your databases.
        </p>
      </Definition>

      <LessonSection title="CloudTrail sub-topic map">
        <Flowchart
          title="CloudTrail lesson map — intermediate through advanced"
          chart={`flowchart TB
  START[CloudTrail complete path]
  START --> ORG[Org and multi Region trails]
  START --> INT[Log integrity and encryption]
  START --> ATH[Querying with Athena]
  START --> LAKE[CloudTrail Lake]
  START --> EB[EventBridge alerts]
  START --> CWL[Logs and metric filters]
  START --> INS[Insights events]
  START --> DATA[Auditing data access]
  START --> FOR[Forensics and IR]
  START --> CMP[CloudTrail vs Config vs CloudWatch]
  ORG --> SSMNEXT
  INT --> SSMNEXT
  ATH --> SSMNEXT
  LAKE --> SSMNEXT
  EB --> SSMNEXT
  CWL --> SSMNEXT
  INS --> SSMNEXT
  DATA --> SSMNEXT
  FOR --> SSMNEXT
  CMP --> SSMNEXT
  SSMNEXT[Systems Manager next]`}
        />
      </LessonSection>

      <LessonSection title="Full CloudTrail checkpoint — can you explain…">
        <ContentStep number={1} title="Trail architecture">
          <p className="text-slate-300">
            Why multi-Region even if you use one Region? Where do IAM events land? Who can create an organization
            trail, and why can members not disable it? Why a separate log-archive account?
          </p>
        </ContentStep>
        <ContentStep number={2} title="Integrity and encryption">
          <p className="text-slate-300">
            How do digest files prove logs were not altered? What does SSE-KMS add over SSE-S3? Which bucket
            controls stop an admin in the workload account from erasing evidence?
          </p>
        </ContentStep>
        <ContentStep number={3} title="Querying">
          <p className="text-slate-300">
            How does partition projection work for account, Region, and date? How do you find who ran{' '}
            <code className="text-core-400">DeleteTable</code> on <code className="text-core-400">silver.orders</code>?
            When does CloudTrail Lake fit, and what changed about its availability?
          </p>
        </ContentStep>
        <ContentStep number={4} title="Detection">
          <p className="text-slate-300">
            EventBridge pattern for <code className="text-core-400">StopLogging</code> or a public lake bucket? CIS
            metric filter for unauthorized API calls? What Insights detects — and what it never will?
          </p>
        </ContentStep>
        <ContentStep number={5} title="Data access and forensics">
          <p className="text-slate-300">
            Which layers record who read PII, and which are not CloudTrail? Walk through a leaked-key investigation
            from access key ID to GetObject counts, containment, and evidence preservation.
          </p>
        </ContentStep>
        <ContentStep number={6} title="Service boundaries">
          <p className="text-slate-300">
            CloudTrail vs Config vs CloudWatch in one sentence each? Where do GuardDuty and Security Hub sit?
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
                  'Why an organization trail?',
                  'Covers every member account and new accounts automatically; members cannot stop or delete it.',
                ],
                [
                  'Why multi-Region?',
                  'Leaked keys work in every Region; unused-Region activity is a high-signal alert.',
                ],
                [
                  'Where do IAM events appear?',
                  'Global service events are recorded in us-east-1.',
                ],
                [
                  'Proving logs are untampered?',
                  'Log file integrity validation — hourly signed digests; aws cloudtrail validate-logs.',
                ],
                [
                  'Protecting the log bucket?',
                  'Separate log-archive account, SSE-KMS CMK, versioning, Object Lock, deny-delete policy.',
                ],
                [
                  'Querying years of trail logs?',
                  'Athena table with CloudTrail input format and partition projection; always filter dt.',
                ],
                [
                  'CloudTrail Lake status?',
                  'Managed immutable SQL store; closed to new customers since May 31, 2026 — verify current docs.',
                ],
                [
                  'Real-time alert on risky calls?',
                  'EventBridge rule on AWS API Call via CloudTrail to SNS, Lambda remediation, or Step Functions.',
                ],
                [
                  'CIS monitoring controls?',
                  'Trail to CloudWatch Logs, metric filter per pattern, alarm to SNS.',
                ],
                [
                  'What does Insights detect?',
                  'Unusual API call rate and error rate against a baseline — not single malicious calls.',
                ],
                [
                  'Who ran SQL in Redshift?',
                  'Redshift audit logs (user activity log) to S3 or CloudWatch — not CloudTrail.',
                ],
                [
                  'CloudTrail vs Config?',
                  'CloudTrail: who called the API. Config: resource state over time and compliance.',
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
        <Callout variant="tip" title="Ready for Systems Manager when…">
          You can whiteboard an org trail into a locked log-archive bucket, write the Athena query for who deleted a
          Glue table, design EventBridge alerts for StopLogging and public buckets, and walk a leaked-key incident
          end to end — without opening the docs.
        </Callout>
      </LessonSection>

      <LessonSection title="What comes next — Systems Manager">
        <p className="text-slate-300">
          CloudTrail tells you who changed your AWS resources — but data platforms still run servers: self-managed
          ETL hosts, EMR nodes, bastions for database tunnels. <strong className="text-white">AWS Systems
          Manager</strong> is how you operate those machines safely: Session Manager replaces SSH keys and open
          port 22, Run Command and Patch Manager handle fleets, port forwarding reaches private RDS and Redshift
          endpoints, and every session is logged — with the API calls landing in the same trail you just built.
        </p>
        <Flowchart
          title="After CloudTrail — course thread"
          chart={`flowchart LR
  CT[CloudTrail checkpoint]
  SSM[Systems Manager]
  SM[Session Manager]
  HOSTS[ETL hosts and EMR nodes]
  DB[Private RDS and Redshift]
  LOGS[(Session logs in S3)]
  SSM --> SM
  SM --> HOSTS
  SM -->|port forwarding| DB
  SM --> LOGS
  SSM -->|API calls audited by| CT`}
        />
        <Callout variant="insight">
          Revisit this checkpoint when onboarding a new account to the org, answering an auditor&apos;s evidence
          request, or tuning alert noise — the answers trace back to the trail, integrity, query, and detection
          lessons covered here.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'CloudTrail: the API system of record — one multi-Region org trail to a locked, encrypted log-archive bucket.',
          'Intermediate: org and multi-Region trails, integrity validation and SSE-KMS, Athena with projection, CloudTrail Lake.',
          'Advanced: EventBridge alerts, metric filters, Insights, data access auditing, forensics, service boundaries.',
          'Data access needs S3 data events, Lake Formation and Athena events, plus Redshift and RDS audit logs.',
          'Next sub-topic: Systems Manager — operate ETL hosts and database tunnels safely with every session logged.',
        ]}
      />
    </LessonArticle>
  )
}
