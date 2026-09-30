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

export function PortForwardingToDatabases() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Open DBeaver on your laptop, query a private RDS — no bastion, no port 22">
        Your <code className="text-core-400">orders-db-prod</code> RDS instance and{' '}
        <code className="text-core-400">acme-dw-prod</code> Redshift cluster live in private subnets, as they
        should. You still need to run a query, check a replication slot, or debug a COPY. Session Manager
        can forward a local port on your laptop, through a small managed EC2 instance, to the database endpoint
        — authenticated by IAM, logged in CloudTrail, with zero inbound rules from the internet.
      </Callout>

      <Definition term="Port forwarding to a remote host">
        <p>
          The AWS-owned Session document <code className="text-core-400">AWS-StartPortForwardingSessionToRemoteHost</code>{' '}
          tells the SSM Agent on a target instance to open a TCP connection to another host (the database
          endpoint) and relay bytes between it and a local port on your machine. The Session Manager plugin on
          your laptop listens on <code className="text-core-400">localPortNumber</code>; traffic flows over the
          same outbound HTTPS channel the agent already uses.
        </p>
      </Definition>

      <LessonSection title="How the tunnel works">
        <Flowchart
          title="Laptop to private database through Session Manager"
          chart={`flowchart LR
  LAP[Laptop DBeaver or psql localhost 15432]
  PLUG[Session Manager plugin]
  SSM[Systems Manager service]
  JUMP[Jump instance Role db-jump private subnet]
  RDS[(RDS orders-db-prod port 5432)]
  RS[(Redshift acme-dw-prod port 5439)]
  LAP --> PLUG
  PLUG -->|HTTPS 443 IAM auth| SSM
  SSM -->|agent outbound channel| JUMP
  JUMP -->|TCP inside VPC| RDS
  JUMP -->|TCP inside VPC| RS`}
        />
        <ContentStep number={1} title="The jump instance">
          <p className="text-slate-300">
            A tiny managed EC2 instance (for example <code className="text-core-400">t4g.nano</code>) in a private
            subnet, tagged <code className="text-core-400">Role=db-jump</code>, with an instance profile that
            includes <code className="text-core-400">AmazonSSMManagedInstanceCore</code>, a recent SSM Agent
            (remote-host forwarding needs a 3.1.x-or-later agent), and a path to SSM via NAT or VPC endpoints.
            Its security group needs <strong className="text-white">no inbound rules at all</strong>.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Database security groups">
          <p className="text-slate-300">
            The RDS and Redshift security groups allow 5432 or 5439 only from the jump instance&apos;s security
            group. The database never sees your laptop&apos;s IP, and nothing is open to{' '}
            <code className="text-core-400">0.0.0.0/0</code>.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Your laptop">
          <p className="text-slate-300">
            Install the AWS CLI and the Session Manager plugin, sign in (IAM Identity Center profile), and start
            the session. Database credentials still apply — fetch them from Secrets Manager, or use IAM database
            authentication — the tunnel only provides the network path.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Starting a tunnel">
        <Example title="Forward localhost:15432 to orders-db-prod" caption="Leave this running; connect in another terminal">
{`aws ssm start-session \\
  --profile de-prod \\
  --target i-0abc123def4567890 \\
  --document-name AWS-StartPortForwardingSessionToRemoteHost \\
  --parameters '{"host":["orders-db-prod.abc123xyz.us-east-1.rds.amazonaws.com"],"portNumber":["5432"],"localPortNumber":["15432"]}'

# Second terminal - psql against the local end of the tunnel
psql "host=localhost port=15432 dbname=orders user=analyst_ro sslmode=require"

# Redshift: same idea, different endpoint and port
aws ssm start-session --target i-0abc123def4567890 \\
  --document-name AWS-StartPortForwardingSessionToRemoteHost \\
  --parameters '{"host":["acme-dw-prod.xyz789.us-east-1.redshift.amazonaws.com"],"portNumber":["5439"],"localPortNumber":["15439"]}'`}
        </Example>
        <ContentStep number={1} title="DBeaver, DataGrip, or any SQL client">
          <p className="text-slate-300">
            Point the connection at host <code className="text-core-400">localhost</code>, port{' '}
            <code className="text-core-400">15432</code>. TLS still works, but hostname verification fails
            because the certificate names the RDS endpoint, not localhost — use{' '}
            <code className="text-core-400">sslmode=require</code>, or map the real endpoint name to 127.0.0.1 in
            your hosts file if you need full verification.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Idle timeouts and PowerShell quoting">
          <p className="text-slate-300">
            Sessions end after the idle timeout in Session Manager preferences (20 minutes by default), so a
            long-idle SQL client will drop. On Windows PowerShell, the JSON parameters need different quoting —
            the shorthand form <code className="text-core-400">host=...,portNumber=5432,localPortNumber=15432</code>{' '}
            avoids most escaping problems.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Locking it down with IAM">
        <Example title="Tunnel-only access to prod jump hosts" caption="Grants port forwarding, not an interactive shell">
{`{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "StartSessionOnDbJumpHostsOnly",
      "Effect": "Allow",
      "Action": "ssm:StartSession",
      "Resource": "arn:aws:ec2:us-east-1:111122223333:instance/*",
      "Condition": {
        "StringEquals": {
          "ssm:resourceTag/Role": "db-jump",
          "ssm:resourceTag/Env": "prod"
        },
        "BoolIfExists": { "ssm:SessionDocumentAccessCheck": "true" }
      }
    },
    {
      "Sid": "OnlyThePortForwardingDocument",
      "Effect": "Allow",
      "Action": "ssm:StartSession",
      "Resource": "arn:aws:ssm:us-east-1::document/AWS-StartPortForwardingSessionToRemoteHost"
    },
    {
      "Sid": "ManageOwnSessions",
      "Effect": "Allow",
      "Action": ["ssm:TerminateSession", "ssm:ResumeSession"],
      "Resource": "arn:aws:ssm:*:*:session/\${aws:userid}-*"
    }
  ]
}`}
        </Example>
        <ContentStep number={1} title="Why the document restriction matters">
          <p className="text-slate-300">
            Without it, anyone who can tunnel can also open a root-capable shell on the jump host. With{' '}
            <code className="text-core-400">ssm:SessionDocumentAccessCheck</code> and only the port-forwarding
            document allowed, analysts get a network path and nothing else. Session transcripts are not recorded
            for port-forwarding sessions, so rely on CloudTrail <code className="text-core-400">StartSession</code>{' '}
            events plus database audit logs.
          </p>
        </ContentStep>
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Option</th>
                <th className="px-4 py-3">Network exposure</th>
                <th className="px-4 py-3">Good for</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Bastion + SSH tunnel', 'Port 22 open, SSH keys to rotate', 'Legacy setups; avoid for new work'],
                ['SSM port forwarding', 'No inbound ports; IAM and CloudTrail', 'Any SQL client, any engine, prod debugging'],
                ['Redshift Query Editor v2', 'None — browser console', 'Quick Redshift queries, sharing saved SQL'],
                ['RDS Query Editor', 'None — uses the RDS Data API', 'Aurora clusters with Data API enabled only'],
              ].map(([option, exposure, fit]) => (
                <tr key={option} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{option}</td>
                  <td className="px-4 py-3">{exposure}</td>
                  <td className="px-4 py-3">{fit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <KeyTakeaways
        items={[
          'AWS-StartPortForwardingSessionToRemoteHost relays a local port through a managed EC2 instance to a private DB endpoint.',
          'Jump host needs no inbound rules; database security groups allow only the jump host security group.',
          'Restrict ssm:StartSession by resource tag and to the port-forwarding document so users cannot get a shell.',
          'The tunnel is only a network path — DB credentials still come from Secrets Manager or IAM auth.',
          'Prefer this over bastions; use Query Editor v2 or RDS Query Editor for quick console-only queries.',
        ]}
      />
    </LessonArticle>
  )
}
