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

export function PuttingItTogetherSystemsManagerBeginner() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Checkpoint before patching and automation">
        You now know why Systems Manager follows CloudTrail, how its capabilities are grouped, what makes a
        server a managed node, how Session Manager replaces SSH, how Run Command fixes a fleet, and where DE
        teams use SSM vs serverless services. This lesson ties those threads into a{' '}
        <strong className="text-white">beginner Systems Manager checklist</strong> — the mental model you need
        before Patch Manager, State Manager, Automation, and database tunnels.
      </Callout>

      <Definition term="Beginner Systems Manager mental model">
        <p>
          A <strong className="text-white">beginner SSM mental model</strong> for DE includes: data hosts in
          private subnets with no inbound port 22, SSM Agent running with an instance profile that includes
          AmazonSSMManagedInstanceCore, VPC interface endpoints for the SSM services, consistent tags like
          Role and Env, IAM policies that scope sessions by tag, session logs in S3 or CloudWatch Logs,
          Run Command with rate control for fleet fixes, and CloudTrail recording every StartSession and
          SendCommand — all before patch baselines and runbooks in production.
        </p>
      </Definition>

      <LessonSection title="Architecture checklist — can you draw this?">
        <ContentStep number={1} title="Private data hosts — no inbound SSH">
          <p className="text-slate-300">
            ETL workers and Airflow hosts in private subnets. Security groups allow outbound 443 only for
            management traffic — no port 22, no bastion, no public IPs.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Managed node prerequisites">
          <p className="text-slate-300">
            SSM Agent running, instance profile with{' '}
            <code className="text-core-400">AmazonSSMManagedInstanceCore</code>, and interface endpoints for{' '}
            <code className="text-core-400">ssm</code>, <code className="text-core-400">ssmmessages</code>,
            and <code className="text-core-400">ec2messages</code>.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Tags drive targeting and access">
          <p className="text-slate-300">
            Every host tagged <code className="text-core-400">Role=etl-worker</code> and{' '}
            <code className="text-core-400">Env=prod</code>. Run Command targets tags; IAM conditions on{' '}
            <code className="text-core-400">ssm:resourceTag/Env</code> decide who may open sessions.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Logging and audit">
          <p className="text-slate-300">
            Session transcripts to an S3 bucket and CloudWatch Logs group, encrypted with KMS. Run Command
            output to S3. CloudTrail records the API calls.
          </p>
        </ContentStep>
        <ContentStep number={5} title="Config from Parameter Store">
          <p className="text-slate-300">
            Jobs read <code className="text-core-400">/de/prod/...</code> parameters at start — no config
            edited by hand over a shell session.
          </p>
        </ContentStep>
        <Flowchart
          title="Beginner DE Systems Manager setup"
          chart={`flowchart TD
  ENG[On-call engineer] --> IAM[IAM tag-scoped policy]
  IAM --> SSM[Systems Manager]
  SSM --> VPCE[VPC interface endpoints]
  VPCE --> W1[etl-worker 1 private subnet]
  VPCE --> W2[etl-worker 2 private subnet]
  PS[Parameter Store] --> W1
  PS --> W2
  SSM --> LOGS[Session logs S3 and CloudWatch]
  SSM --> CT[CloudTrail StartSession SendCommand]`}
        />
      </LessonSection>

      <LessonSection title="Self-check — can you explain these?">
        <ContentStep number={1} title="What is Systems Manager in one sentence?">
          <p className="text-slate-300">
            A set of tools for operating servers and config through an agent and IAM — DE uses it for the
            self-managed hosts behind pipelines.
          </p>
        </ContentStep>
        <ContentStep number={2} title="What makes a node managed?">
          <p className="text-slate-300">
            Agent running, IAM via instance profile or Default Host Management Configuration, and a network
            path to the SSM endpoints.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Why does SSM need no inbound ports?">
          <p className="text-slate-300">
            The agent connects outbound over HTTPS and polls for work — sessions and commands ride that
            channel.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Session Manager vs SSH bastion">
          <p className="text-slate-300">
            IAM identity instead of shared keys, tag-scoped access, full transcripts, and no bastion to patch.
          </p>
        </ContentStep>
        <ContentStep number={5} title="Run Command essentials">
          <p className="text-slate-300">
            Document plus targets plus rate control — max concurrency and max errors — with output in S3 or
            CloudWatch Logs.
          </p>
        </ContentStep>
        <ContentStep number={6} title="Where is SSM not relevant?">
          <p className="text-slate-300">
            Glue, Athena, Lambda, Redshift Serverless — AWS runs the servers, so you use logs and metrics.
          </p>
        </ContentStep>
        <ContentStep number={7} title="First debug when a node is missing from the managed nodes list?">
          <p className="text-slate-300">
            Check agent status, instance profile policy, then endpoints and security groups — in that order
            — before blaming SSM itself.
          </p>
        </ContentStep>
        <Example title="Beginner Systems Manager concept drill" caption="No console required yet — explain aloud">
{`1. Draw: engineer → IAM → SSM → VPC endpoints → SSM Agent on private EC2 → logs + CloudTrail
2. Name the three requirements for a managed node
3. Why is tag-based targeting better than a list of instance IDs?
4. What do max concurrency and max errors protect against?
5. Where do session transcripts go, and who encrypts them?
6. When would you use Run Command instead of Session Manager?
7. Why does Glue never show up as a managed node?`}
        </Example>
        <Callout variant="insight">
          Strong SSM beginners ask three questions before touching a server: is this node managed, am I
          allowed by tag-scoped IAM, and will this be logged — if the third answer is no, fix logging first.
        </Callout>
      </LessonSection>

      <LessonSection title="Mini scenario — end-to-end story">
        <p className="text-slate-300">
          Acme runs a nightly Python ETL worker fleet — three EC2 instances tagged{' '}
          <code className="text-core-400">Role=etl-worker</code>,{' '}
          <code className="text-core-400">Env=prod</code> — in a private subnet with SSM VPC endpoints and no
          SSH. At 02:10 the orders load fails; CloudWatch alarms on disk usage for{' '}
          <code className="text-core-400">i-0abc123def4567890</code>. On-call engineer Dana runs{' '}
          <code className="text-core-400">aws ssm start-session --target i-0abc123def4567890</code>, finds{' '}
          <code className="text-core-400">/data/tmp</code> full of 40 GB of stale spill files, and reads the
          job log to confirm. Suspecting all workers share the problem, she sends{' '}
          <code className="text-core-400">AWS-RunShellScript</code> to every{' '}
          <code className="text-core-400">Role=etl-worker</code> node with max concurrency 1 and max errors 1:
          delete temp files older than one day, then restart{' '}
          <code className="text-core-400">etl-loader</code>. All three invocations succeed; the rerun
          completes by 03:00. Her session transcript lands in{' '}
          <code className="text-core-400">s3://acme-ssm-session-logs-prod/</code>, and CloudTrail shows{' '}
          <code className="text-core-400">StartSession</code> and{' '}
          <code className="text-core-400">SendCommand</code> under her identity for the morning review.
        </p>
        <ContentStep number={1} title="Access tier — IAM and Session Manager">
          <p className="text-slate-300">Tag-scoped permission, no keys, no port 22 — shell in under a minute.</p>
        </ContentStep>
        <ContentStep number={2} title="Fix tier — Run Command">
          <p className="text-slate-300">One idempotent script, rolled out safely to the whole fleet.</p>
        </ContentStep>
        <ContentStep number={3} title="Evidence tier — session logs and CloudTrail">
          <p className="text-slate-300">What was typed, who did it, and when — ready for the postmortem.</p>
        </ContentStep>
        <ContentStep number={4} title="Follow-up — make it permanent">
          <p className="text-slate-300">Turn the cleanup into a scheduled association or runbook next week.</p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="What's next">
        <p className="text-slate-300">
          The next lessons in the Systems Manager track go hands-on on topics this beginner pass introduced:
        </p>
        <ContentStep number={1} title="Patch Manager — keep data hosts patched">
          <p className="text-slate-300">
            Patch baselines, patch groups, and scan vs install operations — run inside maintenance windows
            so nightly loads are never interrupted.
          </p>
        </ContentStep>
        <ContentStep number={2} title="State Manager — desired state">
          <p className="text-slate-300">
            Associations that keep the CloudWatch agent installed and temp cleanup scheduled on every
            etl-worker — the permanent fix for Dana&apos;s 2 a.m. page.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Automation runbooks">
          <p className="text-slate-300">
            Multi-step workflows — snapshot, resize, restart, verify — using AWS-owned or custom runbooks,
            triggered by people, EventBridge, or alarms.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Inventory and Fleet Manager">
          <p className="text-slate-300">
            Know which Java, Python, and driver versions run on which hosts before a Spark or connector
            upgrade — and browse nodes from the console.
          </p>
        </ContentStep>
        <p className="mt-4 text-slate-300">
          Systems Manager closes the security and operations part of this track: CloudFormation builds the
          infrastructure, IAM and KMS protect it, CloudTrail audits the API, and SSM operates the servers that
          remain. The API Gateway and ECS sub-topics that follow assume you can draw the engineer → IAM → SSM →
          private node path and explain why no one needs an SSH key.
        </p>
        <Callout variant="tip" title="Before your first prod session">
          Turn on session logging to S3 and CloudWatch Logs in every account first — teams that skip this
          discover the gap during their first incident review, when the transcript they need does not exist.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Beginner model: private hosts with no port 22, managed node prerequisites, consistent tags, tag-scoped IAM, and logged sessions.',
          'Self-check: SSM definition, managed node requirements, outbound-only agent, Session Manager vs bastion, Run Command rate control, serverless exceptions.',
          'End-to-end: alarm → Session Manager to investigate → Run Command to fix the fleet → S3 transcripts and CloudTrail for evidence.',
          'Next in the Systems Manager track: Patch Manager, State Manager, Automation runbooks, and Inventory.',
        ]}
      />
    </LessonArticle>
  )
}
