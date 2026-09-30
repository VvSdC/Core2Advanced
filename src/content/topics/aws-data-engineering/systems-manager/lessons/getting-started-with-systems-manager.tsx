import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function GettingStartedWithSystemsManager() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Why Systems Manager after CloudTrail in the DE path">
        CloudTrail taught you how to answer{' '}
        <strong className="text-white">&quot;who changed which AWS resource, and when?&quot;</strong> — the
        API-level audit trail for buckets, roles, and Glue jobs. But many data platforms still run real
        servers: EC2 ETL workers, EMR cluster nodes, a self-managed Airflow box, a Kafka Connect host. The
        next question is:{' '}
        <strong className="text-white">how do we log in, run commands, and patch those servers safely —
        without SSH keys, open port 22, or a bastion host?</strong> The answer is{' '}
        <strong className="text-white">AWS Systems Manager (SSM)</strong>, the last security and operations
        service in this track before API Gateway and ECS.
      </Callout>

      <Definition term="What is Systems Manager in a DE platform?">
        <p>
          <strong className="text-white">AWS Systems Manager</strong> is a collection of tools for operating
          compute nodes — EC2 instances, EMR nodes, even on-prem servers — through a small agent that talks
          to the SSM service over HTTPS. For data engineering, SSM is the{' '}
          <strong className="text-white">safe operations layer for the servers behind your pipelines</strong>{' '}
          — shell access, fleet-wide commands, patching, and tunnels to private databases, with every session
          and command recorded.
        </p>
        <p className="mt-2 text-slate-300">
          Think of it as{' '}
          <span className="text-core-400">a remote control for your fleet that checks IAM before every button
          press and writes down everything you did</span>.
        </p>
      </Definition>

      <LessonSection title="Roadmap for this sub-topic">
        <p className="text-slate-300">
          You already used one SSM capability — <strong className="text-white">Parameter Store</strong> —
          in the Secrets Manager &amp; Parameter Store module. Here we cover the rest of the toolbox in
          layers so you are not buried in fifteen feature names on day one:
        </p>
        <ContentStep number={1} title="The big picture — what SSM is and how it is grouped">
          <p className="text-slate-300">
            Node tools, change management, application tools, and operations — which ones a DE actually
            touches, and roughly what they cost.
          </p>
        </ContentStep>
        <ContentStep number={2} title="The foundation — SSM Agent and managed nodes">
          <p className="text-slate-300">
            Nothing works until a server shows up as a managed node: agent running, IAM instance profile,
            and a network path to the SSM endpoints.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Daily tools — Session Manager and Run Command">
          <p className="text-slate-300">
            A logged shell with no SSH, and one command sent to one node or a hundred — the two features
            on-call data engineers use most.
          </p>
        </ContentStep>
        <ContentStep number={4} title="DE use cases, checkpoint, and what comes next">
          <p className="text-slate-300">
            Where SSM fits in a data platform (and where it does not), then Patch Manager, State Manager,
            Automation runbooks, and port forwarding to private RDS and Redshift.
          </p>
        </ContentStep>
        <Flowchart
          title="Systems Manager sub-topic path"
          chart={`flowchart LR
  A[Getting started] --> B[What is Systems Manager]
  B --> C[SSM Agent and managed nodes]
  C --> D[Session Manager]
  D --> E[Run Command]
  E --> F[SSM for DE]
  F --> G[Beginner checkpoint]
  G --> H[Patching Automation Tunnels next]`}
        />
      </LessonSection>

      <LessonSection title="Vocabulary you will use every day">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Word</th>
                <th className="px-4 py-3">Friendly meaning</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                [
                  'Managed node',
                  'Any machine SSM can see and control — an EC2 ETL worker, an EMR core node, or a registered on-prem server',
                ],
                [
                  'SSM Agent',
                  'Small open-source program on the node that polls SSM over HTTPS and executes sessions and commands',
                ],
                [
                  'Instance profile',
                  'The IAM role attached to EC2 — it needs AmazonSSMManagedInstanceCore so the agent may talk to SSM',
                ],
                [
                  'SSM document',
                  'A JSON or YAML definition of what to run — e.g. AWS-RunShellScript; AWS provides hundreds, you can write your own',
                ],
                [
                  'Session Manager',
                  'Interactive shell (or port forward) to a node from the console or CLI — no SSH keys, no inbound ports',
                ],
                [
                  'Run Command',
                  'Send one document to many nodes at once, with rate control and output saved to S3 or CloudWatch Logs',
                ],
                [
                  'Patch Manager',
                  'Scans and installs OS patches on a schedule using patch baselines (intermediate lessons)',
                ],
                [
                  'State Manager association',
                  'A rule that keeps nodes in a desired state — e.g. CloudWatch agent always installed — re-applied on a schedule',
                ],
                [
                  'Automation runbook',
                  'A multi-step operational workflow — stop instance, snapshot, patch, start — AWS-owned or custom',
                ],
                [
                  'Parameter Store',
                  'Already learned: hierarchical config and SecureString values under paths like /de/prod/orders/batch-size',
                ],
              ].map(([word, meaning]) => (
                <tr key={word} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{word}</td>
                  <td className="px-4 py-3">{meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip" title="Tagging — quick check">
          SSM targets nodes by tag, so tag every data host consistently:{' '}
          <code className="text-core-400">Role=etl-worker</code>,{' '}
          <code className="text-core-400">Env=prod</code>,{' '}
          <code className="text-core-400">Team=data-platform</code>. Then &quot;restart the loader on every
          prod ETL worker&quot; becomes one Run Command, and IAM can say &quot;juniors may open sessions only
          on <code className="text-core-400">Env=dev</code>&quot;. Untagged nodes are invisible to both.
        </Callout>
      </LessonSection>

      <LessonSection title="How Systems Manager fits after CloudTrail">
        <p className="text-slate-300">
          An engineer signs in with IAM (or IAM Identity Center). IAM decides whether they may start a
          session or send a command to nodes with a given tag. SSM relays the request to the SSM Agent on a
          private EC2 or EMR node — reached through VPC interface endpoints, so the subnet needs no internet
          route. Session output lands in S3 or CloudWatch Logs, and CloudTrail records the API call such as{' '}
          <code className="text-core-400">StartSession</code> or{' '}
          <code className="text-core-400">SendCommand</code>.
        </p>
        <Flowchart
          title="Engineer to private node through SSM"
          chart={`flowchart LR
  ENG[Data engineer] --> IAM[IAM permission check]
  IAM --> SSM[Systems Manager service]
  SSM --> VPCE[VPC interface endpoints]
  VPCE --> AG1[SSM Agent on EC2 ETL worker]
  VPCE --> AG2[SSM Agent on EMR node]
  SSM --> LOGS[Session logs S3 and CloudWatch]
  SSM --> CT[CloudTrail audit trail]`}
        />
        <Callout variant="insight">
          CloudTrail and SSM work as a pair: CloudTrail proves <em>who</em> opened a session on which node;
          SSM session logs show <em>what they typed</em> once inside. Together they replace the old
          &quot;shared SSH key on a bastion&quot; setup that nobody could audit.
        </Callout>
      </LessonSection>

      <LessonSection title="Why data engineers care about Systems Manager">
        <ContentStep number={1} title="Not everything is serverless">
          <p className="text-slate-300">
            Glue, Athena, and Lambda need no server access — but EC2 ETL workers, self-managed Airflow,
            Kafka Connect, and EMR nodes do. When a nightly job fills a disk at 2 a.m., you need a shell.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Private networking without bastions">
          <p className="text-slate-300">
            Data hosts and databases live in private subnets. Session Manager and port forwarding reach
            them with no inbound security group rules — a smaller attack surface and one less box to patch.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Fleet-wide operations with an audit trail">
          <p className="text-slate-300">
            Run Command, Patch Manager, and Automation apply the same fix to every tagged node, with output
            stored and every invocation visible in CloudTrail — ideal for compliance reviews.
          </p>
        </ContentStep>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Systems Manager follows CloudTrail — CloudTrail audits AWS API changes; SSM is how you safely operate the servers themselves.',
          'Roadmap: capability map → SSM Agent and managed nodes → Session Manager → Run Command → DE use cases → patching and automation next.',
          'Core vocabulary: managed node, SSM Agent, instance profile with AmazonSSMManagedInstanceCore, SSM document, association, runbook.',
          'Parameter Store is already covered — it is one SSM capability among many.',
          'Consistent tags like Role=etl-worker and Env=prod drive both targeting and IAM permissions.',
        ]}
      />
    </LessonArticle>
  )
}
