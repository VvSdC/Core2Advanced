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

export function SystemsManagerForDataEngineering() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Where SSM shows up in a data platform">
        You have the building blocks: managed nodes, Session Manager, and Run Command. Now map them onto a
        real data platform. The rule of thumb is simple —{' '}
        <strong className="text-white">wherever your pipeline runs on a server you own, SSM is how you
        operate it</strong>. Wherever AWS owns the server (Glue, Athena, Lambda), SSM node tools stay out of
        the picture.
      </Callout>

      <Definition term="SSM in the DE operations layer">
        <p>
          In data engineering, Systems Manager is the{' '}
          <strong className="text-white">operations layer for self-managed compute</strong> — EC2 ETL
          workers, self-managed Airflow, Kafka Connect hosts, and EMR on EC2 clusters. It provides shell
          access for debugging, fleet commands for fixes, tunnels to private databases, patching for data
          hosts, and (through Parameter Store) configuration that jobs read at runtime.
        </p>
        <p className="mt-2 text-slate-300">
          Think of it as{' '}
          <span className="text-core-400">the maintenance crew for the machines in your data factory — the
          serverless parts maintain themselves</span>.
        </p>
      </Definition>

      <LessonSection title="Five places DEs use Systems Manager">
        <ContentStep number={1} title="EC2 ETL workers, Airflow, and Kafka Connect hosts">
          <p className="text-slate-300">
            A Python loader on EC2, a self-managed Airflow scheduler, or a Kafka Connect worker writing to
            S3 — when a task hangs, Session Manager gets you a shell to read logs; Run Command restarts the
            service on every node tagged <code className="text-core-400">Role=etl-worker</code>.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Debugging EMR cluster nodes">
          <p className="text-slate-300">
            Open a session on the EMR primary node to inspect YARN applications, tail Spark driver logs, or
            check disk on a core node — no EC2 key pair baked into the cluster config.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Port forwarding to private RDS and Redshift">
          <p className="text-slate-300">
            Your SQL client on a laptop needs to reach a database in a private subnet. A port-forwarding
            session through any managed node in that VPC creates a local tunnel — no bastion, no public
            endpoint on the database. The advanced lesson covers this in depth.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Patching data hosts">
          <p className="text-slate-300">
            Patch Manager scans and patches ETL and Airflow hosts in a maintenance window that avoids the
            nightly load — security keeps its compliance report, pipelines keep their SLA.
          </p>
        </ContentStep>
        <ContentStep number={5} title="Config and runbooks for common operations">
          <p className="text-slate-300">
            Jobs read settings like <code className="text-core-400">/de/prod/orders/batch-size</code> from
            Parameter Store (already learned). Repeated fixes — clear disk, restart a service, rotate logs —
            become custom documents or Automation runbooks anyone on-call can run.
          </p>
        </ContentStep>
        <Flowchart
          title="SSM touchpoints in a DE platform"
          chart={`flowchart TD
  ENG[On-call data engineer] --> SSM[Systems Manager]
  SSM --> ETL[EC2 ETL workers]
  SSM --> AF[Self-managed Airflow]
  SSM --> EMR[EMR on EC2 nodes]
  SSM --> TUN[Port forward via managed node]
  TUN --> RDS[Private RDS]
  TUN --> RS[Private Redshift]
  PS[Parameter Store config] --> ETL
  PS --> AF
  ETL --> S3[S3 data lake]`}
        />
      </LessonSection>

      <LessonSection title="A taste of port forwarding">
        <p className="text-slate-300">
          The AWS-owned document <code className="text-core-400">AWS-StartPortForwardingSessionToRemoteHost</code>{' '}
          forwards a local port through a managed node to a remote host — here, a private Postgres RDS
          instance.
        </p>
        <Example title="Tunnel to a private RDS database" caption="Keep this terminal open while you query">
{`aws ssm start-session \\
  --target i-0abc123def4567890 \\
  --document-name AWS-StartPortForwardingSessionToRemoteHost \\
  --parameters '{"host":["orders-db.abc123xyz.us-east-1.rds.amazonaws.com"],"portNumber":["5432"],"localPortNumber":["15432"]}'

# In a second terminal, connect as if the database were local:
psql -h localhost -p 15432 -U analyst -d orders`}
        </Example>
        <Callout variant="tip" title="Credentials still come from Secrets Manager">
          The tunnel only solves networking. The database password should still come from Secrets Manager or
          IAM database authentication — never from a sticky note next to the tunnel command.
        </Callout>
      </LessonSection>

      <LessonSection title="When SSM is not relevant">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">SSM node access?</th>
                <th className="px-4 py-3">How you operate it instead</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['EC2 ETL worker', 'Yes', 'Session Manager, Run Command, Patch Manager'],
                ['EMR on EC2', 'Yes', 'Sessions on primary and core nodes'],
                ['AWS Glue', 'No — serverless', 'CloudWatch Logs, job metrics, Glue console'],
                ['Amazon Athena', 'No — serverless', 'Query history, workgroup metrics'],
                ['AWS Lambda', 'No — serverless', 'CloudWatch Logs and metrics, X-Ray'],
                ['Redshift Serverless', 'No — managed', 'System tables, query monitoring; SSM only as a tunnel path'],
                ['RDS', 'No shell', 'Performance Insights, logs; SSM only as a tunnel path'],
              ].map(([service, access, instead]) => (
                <tr key={service} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{service}</td>
                  <td className="px-4 py-3">{access}</td>
                  <td className="px-4 py-3">{instead}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="insight">
          Every server you replace with a serverless service is one less thing to patch and one less reason
          to open a session. Mature teams use SSM heavily for what remains — and keep shrinking what remains.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'SSM operates self-managed compute: EC2 ETL workers, self-managed Airflow, Kafka Connect, and EMR on EC2.',
          'Session Manager debugs, Run Command fixes fleets, Patch Manager keeps data hosts patched.',
          'Port forwarding through a managed node reaches private RDS and Redshift without a bastion.',
          'Parameter Store supplies runtime config; custom documents and runbooks capture common ops fixes.',
          'Glue, Athena, Lambda, and Redshift Serverless are managed — operate them with logs and metrics, not SSM node tools.',
        ]}
      />
    </LessonArticle>
  )
}
