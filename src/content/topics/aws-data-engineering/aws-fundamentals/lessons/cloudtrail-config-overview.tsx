import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function CloudTrailConfigOverview() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Everyday idea">
        Security cameras record <em>who walked through the door and when</em>. Inventory audits record{' '}
        <em>what is on the shelves right now</em>. In AWS, <strong className="text-white">CloudTrail</strong>{' '}
        is the camera for API actions; <strong className="text-white">AWS Config</strong> is the ongoing
        inventory check for resource configuration. Data platforms need both to answer &quot;who changed
        our lake?&quot; and &quot;is our bucket still encrypted?&quot;
      </Callout>

      <Definition term="AWS CloudTrail">
        <p>
          <strong className="text-white">CloudTrail</strong> logs AWS API activity in your account — who
          (IAM principal), what (API name), when (timestamp), and where (Region, source IP). Management
          events cover control plane actions (CreateBucket, PutBucketPolicy, RunJobFlow). Data events
          (optional, extra cost) can log object-level S3 activity for sensitive buckets.
        </p>
        <p className="mt-2 text-slate-300">
          Trails deliver logs to S3 (long-term archive) and optionally CloudWatch Logs (real-time alerting).
          Organization trails aggregate activity across member accounts into a security account.
        </p>
      </Definition>

      <Definition term="AWS Config">
        <p>
          <strong className="text-white">AWS Config</strong> continuously records configuration snapshots
          and changes for supported resources — S3 bucket settings, security group rules, IAM role policies
          attached to instances, etc. It answers: &quot;What did this resource look like at 9 a.m.?&quot;
          and &quot;Does it comply with our rules?&quot;
        </p>
        <p className="mt-2 text-slate-300">
          <strong className="text-white">Config rules</strong> evaluate resources against desired state
          (e.g. s3-bucket-public-read-prohibited). Non-compliant resources trigger SNS or remediation via
          Systems Manager — compliance drift detection, not just logging.
        </p>
      </Definition>

      <LessonSection title="CloudTrail vs Config — complementary, not interchangeable">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Question</th>
                <th className="px-4 py-3">CloudTrail</th>
                <th className="px-4 py-3">AWS Config</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Primary focus', 'API calls and identity audit', 'Resource configuration over time'],
                ['Example event', 'alice@corp DeleteBucket on prod-lake', 'Bucket prod-lake encryption changed from AES256 to none'],
                ['DE use case', 'Forensics after suspicious IAM activity', 'Detect public S3 bucket or open security group'],
                ['Typical output', 'JSON event log in S3', 'Configuration items + compliance timeline'],
              ].map(([question, trail, config]) => (
                <tr key={question} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{question}</td>
                  <td className="px-4 py-3">{trail}</td>
                  <td className="px-4 py-3">{config}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Flowchart
          title="Audit vs compliance drift"
          chart={`flowchart TB
  USER[IAM user or role]
  USER -->|API call| API[AWS service API]
  API --> CT[CloudTrail — who did what]
  API --> RES[Resource state changes]
  RES --> CFG[AWS Config — what state is / was]
  CFG --> RULES[Config rules — compliant?]
  CT --> S3LOG[(Trail log bucket)]
  CFG --> SNS[SNS alert / remediation]`}
        />
      </LessonSection>

      <LessonSection title="Why DE platforms need both (high level)">
        <ContentStep number={1} title="Protect the data plane boundary">
          <p className="text-slate-300">
            Lake buckets, Glue connections, and Redshift security groups are frequent audit targets.
            CloudTrail shows who disabled encryption or exported a snapshot. Config proves whether buckets
            stayed private between audits — continuous guardrail, not point-in-time checklist.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Pipeline and platform changes">
          <p className="text-slate-300">
            Creating a Glue job, updating a Step Functions state machine, or attaching a broader IAM policy
            leaves CloudTrail fingerprints. When a nightly job suddenly accesses a new database, trails help
            trace the policy change.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Compliance and incident response">
          <p className="text-slate-300">
            Regulators ask for access logs and configuration evidence. CloudTrail supplies access; Config
            supplies configuration history and rule status. Store trail logs in a locked-down log archive
            account with MFA delete on the bucket — attackers target logs first.
          </p>
        </ContentStep>
        <Callout variant="insight">
          CloudTrail tells the story of <em>actions</em>. Config tells the story of <em>state</em>. Together
          they cover &quot;someone did something&quot; and &quot;something is wrong right now.&quot; Deep
          dives on trail organization, data events, and custom Config rules come in the dedicated CloudTrail
          sub-topic later in this course.
        </Callout>
      </LessonSection>

      <LessonSection title="Starter checklist for data accounts">
        <ul className="list-inside list-disc space-y-2 text-slate-300">
          <li>Enable a multi-Region CloudTrail in all production and data accounts</li>
          <li>Deliver trails to a central S3 bucket with encryption and restricted IAM</li>
          <li>Turn on AWS Config recorder in primary Regions where lake and warehouse live</li>
          <li>Enable managed rules for S3 public access, encrypted volumes, and unrestricted security groups</li>
          <li>Alert on root user activity and IAM policy changes via CloudWatch metric filters</li>
        </ul>
        <Callout variant="tip">
          Config and CloudTrail have per-resource costs at scale. Start with prod accounts and expand — but
          do not run a production lake with zero audit trail.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'CloudTrail = audit log of API calls (who did what, when); optional S3 data events for object-level sensitivity.',
          'AWS Config = configuration history and compliance rules (what state resources are in, drift detection).',
          'DE platforms need both for lake security forensics and continuous compliance — detailed setup comes in the CloudTrail module.',
        ]}
      />
    </LessonArticle>
  )
}
