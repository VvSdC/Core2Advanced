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

export function SessionManager() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="SSH keys are a liability">
        The classic way into a private ETL server is a bastion host with port 22 open and a shared{' '}
        <code className="text-core-400">.pem</code> key passed around on Slack. Keys leak, people leave,
        and nobody knows who ran <code className="text-core-400">rm -rf</code> last Tuesday.{' '}
        <strong className="text-white">Session Manager</strong> replaces all of that with an IAM-checked,
        fully logged shell — and no inbound ports at all.
      </Callout>

      <Definition term="Session Manager">
        <p>
          <strong className="text-white">Session Manager</strong> is a Systems Manager capability that opens
          an interactive shell (or a port-forwarding tunnel) to a managed node from the AWS console or the
          CLI. The connection travels through the SSM Agent&apos;s outbound channel, so the node needs{' '}
          <strong className="text-white">no SSH keys, no open port 22, and no bastion host</strong>. Who may
          connect is decided by IAM, and what they type can be logged to S3 or CloudWatch Logs.
        </p>
        <p className="mt-2 text-slate-300">
          Think of it as{' '}
          <span className="text-core-400">a badge-controlled door with a camera — your AWS identity is the
          badge, and the session log is the recording</span>.
        </p>
      </Definition>

      <LessonSection title="Starting a session">
        <ContentStep number={1} title="From the console">
          <p className="text-slate-300">
            In the EC2 console choose the instance, then <strong className="text-white">Connect</strong> →{' '}
            <strong className="text-white">Session Manager</strong>. A browser terminal opens as the default{' '}
            <code className="text-core-400">ssm-user</code>. Handy for quick checks with nothing installed.
          </p>
        </ContentStep>
        <ContentStep number={2} title="From the CLI — install the Session Manager plugin">
          <p className="text-slate-300">
            The AWS CLI needs the separate <strong className="text-white">Session Manager plugin</strong>{' '}
            to handle the interactive stream. Once installed, one command opens a shell on any node your IAM
            identity is allowed to reach.
          </p>
        </ContentStep>
        <Example title="Open a shell on a private ETL worker" caption="No key pair, no bastion, no public IP">
{`aws ssm start-session --target i-0abc123def4567890

Starting session with SessionId: dana-0f1e2d3c4b5a69788
sh-5.2$ sudo -i
[root@ip-10-20-3-15 ~]# df -h /data
Filesystem      Size  Used Avail Use% Mounted on
/dev/nvme1n1    200G  196G  4.0G  98% /data
[root@ip-10-20-3-15 ~]# exit
sh-5.2$ exit

Exiting session with sessionId: dana-0f1e2d3c4b5a69788.`}
        </Example>
        <ContentStep number={3} title="Run As a specific OS user">
          <p className="text-slate-300">
            By default Linux sessions start as <code className="text-core-400">ssm-user</code>. With{' '}
            <strong className="text-white">Run As</strong> enabled in Session Manager preferences, sessions
            can start as a named OS user such as <code className="text-core-400">etl</code> — set a default,
            or map each IAM principal with the <code className="text-core-400">SSMSessionRunAs</code> tag so
            files are owned by the right account.
          </p>
        </ContentStep>
        <Flowchart
          title="Session Manager connection path"
          chart={`flowchart LR
  ENG[Engineer laptop or console] --> IAM[IAM allows StartSession]
  IAM --> SM[Session Manager]
  AG[SSM Agent on private EC2] -->|outbound 443| SM
  SM --> SHELL[Interactive shell]
  SM --> LOG[Logs to S3 and CloudWatch]
  SM --> CT[CloudTrail StartSession event]`}
        />
      </LessonSection>

      <LessonSection title="Controlling who can connect where">
        <p className="text-slate-300">
          The <code className="text-core-400">ssm:StartSession</code> permission can be limited by the
          target instance&apos;s tags. A common pattern: the data team may open sessions only on nodes tagged{' '}
          <code className="text-core-400">Team=data-platform</code>, and may terminate only their own
          sessions.
        </p>
        <Example title="IAM policy — sessions only on data-platform nodes" caption="Tag-based access control">
{`{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "ssm:StartSession",
      "Resource": "arn:aws:ec2:us-east-1:111122223333:instance/*",
      "Condition": {
        "StringEquals": { "ssm:resourceTag/Team": "data-platform" }
      }
    },
    {
      "Effect": "Allow",
      "Action": "ssm:StartSession",
      "Resource": "arn:aws:ssm:us-east-1:111122223333:document/SSM-SessionManagerRunShell"
    },
    {
      "Effect": "Allow",
      "Action": ["ssm:TerminateSession", "ssm:ResumeSession"],
      "Resource": "arn:aws:ssm:*:*:session/\${aws:username}-*"
    }
  ]
}`}
        </Example>
        <Callout variant="tip" title="Separate dev and prod">
          Give most engineers sessions on <code className="text-core-400">Env=dev</code> nodes freely and
          require a break-glass role for <code className="text-core-400">Env=prod</code>. The CloudTrail
          record of who assumed that role is exactly what auditors ask for.
        </Callout>
      </LessonSection>

      <LessonSection title="Logging and encryption — a teaser">
        <p className="text-slate-300">
          In <strong className="text-white">Session Manager preferences</strong> you can stream session
          transcripts to a CloudWatch Logs group and upload them to an S3 bucket when the session ends. You
          can also encrypt session data with a KMS key (your KMS lesson in action) and set an idle timeout —
          20 minutes by default. The advanced security lesson covers locking this down so logging cannot be
          bypassed.
        </p>
        <Callout variant="info">
          Transcript logging captures shell sessions; port-forwarding sessions carry raw TCP bytes, so only
          the connection itself — who, when, which target — is recorded. CloudTrail still logs the{' '}
          <code className="text-core-400">StartSession</code> API call for every session type.
        </Callout>
      </LessonSection>

      <LessonSection title="Session Manager vs SSH bastion">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Concern</th>
                <th className="px-4 py-3">SSH via bastion</th>
                <th className="px-4 py-3">Session Manager</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Inbound ports', 'Port 22 open on bastion and targets', 'None — agent connects outbound'],
                ['Credentials', 'SSH key pairs to distribute and rotate', 'IAM identity, MFA, Identity Center'],
                ['Access control', 'Whoever holds the key', 'IAM policies scoped by instance tags'],
                ['Audit', 'Bastion logs if someone set them up', 'CloudTrail plus full transcript to S3 or CloudWatch'],
                ['Extra infrastructure', 'Bastion EC2 to patch and pay for', 'VPC endpoints only'],
                ['Database access', 'SSH tunnel through bastion', 'Port forwarding session to RDS or Redshift'],
              ].map(([concern, ssh, ssm]) => (
                <tr key={concern} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{concern}</td>
                  <td className="px-4 py-3">{ssh}</td>
                  <td className="px-4 py-3">{ssm}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="insight">
          Many security teams now treat &quot;port 22 open to anything&quot; as a finding to remediate.
          Moving data hosts to Session Manager is often the quickest compliance win a DE team can deliver.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Session Manager gives a shell or tunnel to private nodes with no SSH keys, no port 22, and no bastion.',
          'Use aws ssm start-session --target with the Session Manager plugin installed for CLI access.',
          'IAM controls who may connect, scoped by instance tags such as Team or Env.',
          'Session transcripts can stream to S3 and CloudWatch Logs, encrypted with KMS; CloudTrail records every StartSession.',
          'Run As lets sessions start as a specific OS user instead of the default ssm-user.',
        ]}
      />
    </LessonArticle>
  )
}
