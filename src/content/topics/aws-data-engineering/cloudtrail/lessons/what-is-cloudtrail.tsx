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

export function WhatIsCloudtrail() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Everything in AWS is an API call">
        Clicking &quot;Delete table&quot; in the Glue console, running{' '}
        <code className="text-core-400">aws s3api put-bucket-policy</code> from your laptop, a boto3 script
        starting a job, and Step Functions invoking Lambda all end up as the same thing: a signed request to
        an AWS API endpoint. <strong className="text-white">CloudTrail writes down those requests</strong> so
        you can answer questions about them later — even after the person who made the change has forgotten
        they did.
      </Callout>

      <Definition term="AWS CloudTrail">
        <p>
          <strong className="text-white">AWS CloudTrail</strong> records API activity in your AWS account as{' '}
          <strong className="text-white">events</strong>. Each event captures{' '}
          <span className="text-core-400">who</span> made the call (IAM user, assumed role, or AWS service),{' '}
          <span className="text-core-400">what</span> they called (for example{' '}
          <code className="text-core-400">glue:DeleteTable</code>),{' '}
          <span className="text-core-400">when</span> (UTC timestamp),{' '}
          <span className="text-core-400">where</span> (Region and source IP), and the{' '}
          <span className="text-core-400">result</span> (success, or an error such as AccessDenied).
        </p>
      </Definition>

      <LessonSection title="What gets recorded">
        <ContentStep number={1} title="Console, CLI, and SDK calls">
          <p className="text-slate-300">
            A human clicking in the console, an engineer running the AWS CLI, and a Python script using boto3
            all produce events. The <code className="text-core-400">userAgent</code> field hints at which
            tool was used.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Service-to-service calls">
          <p className="text-slate-300">
            When Glue reads a KMS key to decrypt S3 data, or CloudFormation creates a bucket for you, the
            call is recorded too — often with the service shown as the caller or via the role it assumed.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Failed calls as well as successful ones">
          <p className="text-slate-300">
            Denied requests are recorded with an <code className="text-core-400">errorCode</code>. That makes
            CloudTrail one of the fastest ways to debug a pipeline role that suddenly gets{' '}
            <code className="text-core-400">AccessDenied</code>.
          </p>
        </ContentStep>
        <Example title="The five questions every event answers" caption="Simplified — the full JSON comes in a later lesson">
{`WHO    : assumed-role/de-glue-etl-role/GlueJobRunnerSession
WHAT   : glue.amazonaws.com  StartJobRun  jobName=orders-nightly
WHEN   : 2026-09-30T02:15:07Z  (always UTC)
WHERE  : us-east-1  from 10.0.12.34 via aws-sdk-python
RESULT : success   (or errorCode=AccessDeniedException)`}
        </Example>
        <Flowchart
          title="From API call to recorded event"
          chart={`flowchart LR
  U[Console CLI SDK or service] --> API[AWS API endpoint]
  API --> R[Request succeeds or fails]
  API --> CT[CloudTrail records event]
  CT --> EH[Event history 90 days]
  CT --> TR[Trail to S3 optional]`}
        />
      </LessonSection>

      <LessonSection title="On by default — but only the basics">
        <p className="text-slate-300">
          Every AWS account has CloudTrail <strong className="text-white">event history</strong> turned on
          from day one, at no charge. You can open the CloudTrail console right now and see the last 90 days
          of management events in each Region — including the IAM roles and buckets you created in earlier
          lessons. For longer retention, data events, or cross-account analysis, you create a{' '}
          <strong className="text-white">trail</strong> (next lesson).
        </p>
        <Callout variant="info" title="Delivery is fast, not instant">
          Events usually show up within minutes, not seconds. AWS documents that trails typically deliver log
          files within about 5 minutes of the API call, and this timing is not guaranteed. For
          seconds-level reactions to risky calls, you will use EventBridge rules later in this sub-topic.
        </Callout>
        <Callout variant="beginner" title="Analogy — the security camera for APIs">
          A badge reader at an office door logs every swipe: badge ID, door, time, and whether the door
          opened. CloudTrail is that log for AWS APIs. It does not prevent the call — IAM, SCPs, and bucket
          policies do that — it just makes sure every swipe is remembered.
        </Callout>
      </LessonSection>

      <LessonSection title="CloudTrail vs CloudWatch — a teaser">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Question</th>
                <th className="px-4 py-3">CloudTrail</th>
                <th className="px-4 py-3">CloudWatch</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Main job', 'Audit — who called which API', 'Operations — metrics, logs, alarms'],
                ['Typical DE question', 'Who deleted the Glue table?', 'Why is the Glue job running slowly?'],
                ['Data shape', 'Structured JSON events per API call', 'Time-series metrics and free-form log lines'],
                ['Default state', 'Event history on for 90 days', 'Service metrics on; app logs depend on config'],
              ].map(([q, ct, cw]) => (
                <tr key={q} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{q}</td>
                  <td className="px-4 py-3">{ct}</td>
                  <td className="px-4 py-3">{cw}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-slate-300">
          They work together: a trail can stream events into CloudWatch Logs so you can alarm on patterns
          such as repeated <code className="text-core-400">AccessDenied</code> errors.
        </p>
      </LessonSection>

      <LessonSection title="What CloudTrail does NOT record">
        <ContentStep number={1} title="Activity inside an EC2 instance">
          <p className="text-slate-300">
            CloudTrail sees <code className="text-core-400">RunInstances</code> and{' '}
            <code className="text-core-400">StopInstances</code>, but not the shell commands someone typed
            after SSH-ing in. Use OS logs, the CloudWatch agent, or Systems Manager Session Manager logging.
          </p>
        </ContentStep>
        <ContentStep number={2} title="SQL inside databases">
          <p className="text-slate-300">
            Creating a Redshift cluster or RDS instance is recorded; the{' '}
            <code className="text-core-400">SELECT</code> a user runs inside it is not. Redshift audit
            logging and RDS database audit logs cover what happens inside the engine.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Network traffic and object reads by default">
          <p className="text-slate-300">
            Packets between subnets need VPC Flow Logs. S3 object reads are data events — invisible until you
            explicitly enable them on a trail or event data store.
          </p>
        </ContentStep>
        <Callout variant="insight">
          A common audit gap: teams assume &quot;CloudTrail is on&quot; means they can prove who read a PII
          file. Without data events on that bucket, the answer is simply not in the logs.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'CloudTrail records API calls from the console, CLI, SDKs, and AWS services — who, what, when, where, and result.',
          'Event history is on by default in every account: free, 90 days, management events.',
          'Events arrive within minutes, not instantly; trails typically deliver within about 5 minutes.',
          'CloudTrail answers audit questions; CloudWatch answers operational ones — they complement each other.',
          'Not recorded: commands inside EC2, SQL inside Redshift or RDS, network packets, and S3 object reads unless data events are enabled.',
        ]}
      />
    </LessonArticle>
  )
}
