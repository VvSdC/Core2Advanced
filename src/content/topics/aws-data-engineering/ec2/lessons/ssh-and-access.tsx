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

export function SshAndAccess() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Getting a shell on your instance">
        After launch, you need a way to log in and run commands — install packages, edit ETL scripts, check
        logs. For Linux EC2 that means <strong className="text-white">SSH</strong> (Secure Shell). For
        Windows it means <strong className="text-white">RDP</strong>. This lesson covers the habits that
        keep access secure while you build data pipelines on EC2.
      </Callout>

      <Definition term="SSH (Secure Shell)">
        <p>
          <strong className="text-white">SSH</strong> is an encrypted protocol for remote command-line access
          to Linux (and macOS) servers. On EC2, authentication typically uses your{' '}
          <strong className="text-white">private key</strong> (.pem file) matching the public key installed
          at launch — not a password typed over the network.
        </p>
      </Definition>

      <LessonSection title="SSH to Linux — step by step">
        <ContentStep number={1} title="Gather three pieces">
          <p className="text-slate-300">
            (1) Instance public IP or DNS from the EC2 Console. (2) Private key file path. (3) Correct
            username — <code className="text-core-400">ec2-user</code> for Amazon Linux,{' '}
            <code className="text-core-400">ubuntu</code> for Ubuntu.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Fix key file permissions">
          <p className="text-slate-300">
            SSH refuses overly open private keys. On macOS/Linux:{' '}
            <code className="text-core-400">chmod 400 ~/keys/de-sandbox.pem</code>. On Windows, use PuTTY
            with a converted .ppk or WSL with the same chmod rule.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Connect">
          <Example title="SSH command" caption="From your laptop terminal">
{`ssh -i ~/keys/de-sandbox.pem ec2-user@203.0.113.42

# Run your first DE sanity checks on the instance:
aws s3 ls                    # works if IAM role attached
python3 --version
df -h                        # disk space for local staging`}
          </Example>
        </ContentStep>
        <Flowchart
          title="SSH connection path"
          chart={`flowchart LR
  L[Laptop with private key]
  L --> I[Internet]
  I --> SG[Security group port 22]
  SG --> EC2[EC2 Linux instance]
  EC2 --> K[Public key in authorized_keys]
  K -->|Key match| SH[Shell prompt]`}
        />
        <Callout variant="tip" title="Connection timed out?">
          Timeout usually means network or security group — not wrong username. &quot;Permission denied
          (publickey)&quot; means you reached the box but the key or user is wrong.
        </Callout>
      </LessonSection>

      <LessonSection title="RDP for Windows instances (mention only)">
        <p className="text-slate-300">
          Windows EC2 uses <strong className="text-white">Remote Desktop Protocol (RDP)</strong> on port
          3389. You obtain the administrator password through the Console (decrypted with your key pair)
          or use Active Directory in enterprise setups. Most DE tutorials in this track target Linux; reach
          for Windows EC2 only when your stack requires it (SSIS, specific .NET tools).
        </p>
        <Callout variant="insight">
          Same security idea as SSH: restrict RDP in the security group to trusted IPs, never{' '}
          <code className="text-core-400">0.0.0.0/0</code> in production, and prefer VPN or bastion paths
          for admin access.
        </Callout>
      </LessonSection>

      <LessonSection title="Key pair hygiene">
        <ContentStep number={1} title="One key per person or per environment">
          <p className="text-slate-300">
            Do not email a shared <code className="text-core-400">team.pem</code> on Slack. Each engineer
            uses their own key or connects through a bastion/SSM. Shared keys make audit trails impossible
            when someone leaves the company.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Never commit .pem to git">
          <p className="text-slate-300">
            Add <code className="text-core-400">*.pem</code> to <code className="text-core-400">.gitignore</code>.
            Leaked keys in public GitHub repos are scanned within minutes. Rotate by launching new instances
            with a new key pair if exposure is suspected.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Protect the private key file">
          <p className="text-slate-300">
            Store keys in an encrypted password manager or OS keychain backup — not Desktop or Downloads
            indefinitely. On shared laptops, use a dedicated keys folder with restrictive ACLs.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Prefer roles over keys on the instance">
          <p className="text-slate-300">
            SSH gets you <em>onto</em> the box; the instance should use an <strong className="text-white">IAM
            instance profile</strong> for S3 and Glue — not long-lived access keys in{' '}
            <code className="text-core-400">~/.aws/credentials</code>.
          </p>
        </ContentStep>
        <Example title="Access anti-patterns" caption="Avoid in DE sandboxes and prod">
{`Bad                                    Better
SSH open to 0.0.0.0/0                  SSH from your.ip/32 only
Shared team.pem in repo                Individual keys or SSM Session Manager
aws configure with static keys on EC2  IAM instance profile for boto3
Root SSH login enabled                 Default ec2-user + sudo when needed
Password auth enabled on Linux         Key-based auth only`}
        </Example>
      </LessonSection>

      <LessonSection title="Session Manager teaser — SSH without open port 22">
        <Definition term="AWS Systems Manager Session Manager">
          <p>
            <strong className="text-white">Session Manager</strong> lets you open a shell or port-forward
            to an EC2 instance through the AWS API — no inbound SSH port, no bastion host, no public IP
            required on the target. The instance needs the SSM agent, an IAM role with SSM permissions,
            and outbound connectivity to SSM endpoints.
          </p>
        </Definition>
        <ContentStep number={1} title="Why DE teams adopt it">
          <p className="text-slate-300">
            ETL workers in private subnets stay locked down — security group has no port 22 from the
            internet. Engineers click &quot;Connect&quot; in the Console or run{' '}
            <code className="text-core-400">aws ssm start-session</code> with IAM credentials. Sessions
            can be logged to S3 for compliance.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Teaser for later">
          <p className="text-slate-300">
            The CloudTrail and Systems Manager module covers SSM setup, Run Command for patching, and
            Parameter Store for config. For now: know that production pipelines often{' '}
            <em>remove</em> open SSH in favor of Session Manager once IAM and VPC basics are solid.
          </p>
        </ContentStep>
        <Flowchart
          title="Traditional SSH vs Session Manager"
          chart={`flowchart TB
  subgraph Traditional["Traditional SSH"]
    T1[Engineer laptop] --> T2[Public IP port 22]
    T2 --> T3[EC2 in public or bastion path]
  end
  subgraph SSM["Session Manager"]
    S1[Engineer IAM user] --> S2[AWS SSM API]
    S2 --> S3[SSM agent on private EC2]
    S3 --> S4[Shell — no inbound 22]
  end`}
        />
        <Callout variant="tip" title="Learning path">
          Master SSH with a key pair in a dev sandbox first — you will debug cloud-init and ETL logs from
          the shell daily. Then adopt Session Manager for production-style private workers.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Linux EC2: SSH with private key (.pem), correct user (ec2-user/ubuntu), security group allowing port 22 from your IP only.',
          'Windows EC2: RDP on 3389 — less common for DE; same restrict-by-IP discipline.',
          'Key hygiene: no shared keys, no .pem in git, chmod 400, use IAM instance profiles on the box for AWS APIs.',
          'Session Manager (later): shell access without open SSH — ideal for private-subnet ETL workers.',
        ]}
      />
    </LessonArticle>
  )
}
