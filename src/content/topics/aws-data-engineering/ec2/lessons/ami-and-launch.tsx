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

export function AmiAndLaunch() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Launching is like cloning a computer">
        You do not install Linux from scratch on every server. AWS gives you an{' '}
        <strong className="text-white">AMI</strong> — a ready-made template — and the launch wizard asks a
        few questions: how big, which network, how much disk, who can SSH in. Five minutes later you have
        a machine ready for <code className="text-core-400">pip install pandas</code> and your first S3
        sync script.
      </Callout>

      <Definition term="AMI (Amazon Machine Image)">
        <p>
          An <strong className="text-white">AMI</strong> is a template that defines the operating system,
          initial storage layout, and optional pre-installed software for a new EC2 instance. AWS publishes
          AMIs (Amazon Linux, Ubuntu, Windows); you can also create custom AMIs from a configured instance
          — useful when your DE team standardizes on Python 3.11, JDBC drivers, and monitoring agents.
        </p>
        <p className="mt-2 text-slate-300">
          Think of an AMI as a <span className="text-core-400">photograph of a disk</span> at a point in
          time. Launching from it creates a fresh instance with that snapshot as its root volume.
        </p>
      </Definition>

      <LessonSection title="Why AMIs matter for data engineering">
        <ContentStep number={1} title="Repeatable environments">
          <p className="text-slate-300">
            Bake an AMI after installing Airflow, dbt, and corporate CA certificates. Every new worker
            launches identical — no manual setup drift between dev and prod.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Region-specific">
          <p className="text-slate-300">
            AMIs live in a Region. You cannot launch a us-east-1 AMI directly in eu-west-1 — copy the AMI
            first. Keep data pipelines and AMIs in the same Region as your S3 buckets to avoid cross-Region
            transfer costs.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Owned by account or AWS">
          <p className="text-slate-300">
            Quick Start AMIs from AWS Marketplace may include licensed software. For learning, stick to
            free Amazon Linux or Ubuntu images marked eligible for Free Tier where applicable.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Launch wizard — mental model">
        <p className="text-slate-300">
          The EC2 Launch Instance wizard walks through seven decision areas. You do not need every advanced
          option on day one — defaults plus a few conscious choices are enough for a DE sandbox.
        </p>
        <ContentStep number={1} title="Name and tags">
          <p className="text-slate-300">
            Name the instance <code className="text-core-400">de-sandbox-alice</code> and tag{' '}
            <code className="text-core-400">Environment=dev</code>,{' '}
            <code className="text-core-400">Project=lake-etl</code>. Tags feed cost reports — essential
            when finance asks which team spent on compute.
          </p>
        </ContentStep>
        <ContentStep number={2} title="AMI and instance type">
          <p className="text-slate-300">
            Pick Amazon Linux 2023 or Ubuntu 22.04, then a type like{' '}
            <code className="text-core-400">t3.small</code>. This sets OS and hardware size.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Key pair">
          <p className="text-slate-300">
            Create or select a key pair. AWS stores the public key on the instance; you keep the private{' '}
            <code className="text-core-400">.pem</code> file locally. Without it, you cannot SSH to Linux.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Network settings">
          <p className="text-slate-300">
            Choose a VPC and subnet. For learning, a public subnet with auto-assign public IP lets you
            SSH from home. Attach a security group allowing SSH (port 22) from your IP only — not from
            the entire internet.
          </p>
        </ContentStep>
        <ContentStep number={5} title="Storage">
          <p className="text-slate-300">
            Root EBS volume size (often 8–30 GB for a sandbox) and type (gp3 is the modern default).
            Increase size if you will cache large local datasets — but prefer S3 for durable data.
          </p>
        </ContentStep>
        <ContentStep number={6} title="Advanced — IAM role and user data">
          <p className="text-slate-300">
            Attach an <strong className="text-white">IAM instance profile</strong> so the instance can call
            S3 without access keys in code. Optional <strong className="text-white">user data</strong>{' '}
            script runs on first boot (install packages — covered in a later lesson).
          </p>
        </ContentStep>
        <Flowchart
          title="Launch wizard flow"
          chart={`flowchart TD
  A[Select AMI — OS template]
  A --> B[Instance type — CPU and RAM]
  B --> C[Key pair — SSH identity]
  C --> D[Network — VPC subnet public IP]
  D --> E[Security group — firewall rules]
  E --> F[Storage — EBS root volume]
  F --> G[IAM role — S3 without keys]
  G --> H[User data — optional bootstrap]
  H --> I[Launch — instance running]`}
        />
      </LessonSection>

      <LessonSection title="Key pair and SSH overview">
        <Definition term="Key pair">
          <p>
            A <strong className="text-white">key pair</strong> is an asymmetric cryptography pair: AWS
            places the <strong className="text-white">public key</strong> on the instance (in{' '}
            <code className="text-core-400">~/.ssh/authorized_keys</code> for the default user); you
            download the <strong className="text-white">private key</strong> once at creation. SSH uses
            the private key to prove you are allowed in — no password sent over the network.
          </p>
        </Definition>
        <ContentStep number={1} title="Default Linux users">
          <p className="text-slate-300">
            Amazon Linux often uses <code className="text-core-400">ec2-user</code>; Ubuntu uses{' '}
            <code className="text-core-400">ubuntu</code>. The AMI documentation states the correct username
            for SSH.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Example SSH command (after launch)">
          <p className="text-slate-300">
            From your laptop (paths vary by OS):
          </p>
          <Example title="SSH to a new instance" caption="Replace IP and key path">
{`ssh -i ~/keys/de-sandbox.pem ec2-user@203.0.113.42

# First connection asks to verify host fingerprint — type yes
# You should land at a shell prompt on the instance`}
          </Example>
        </ContentStep>
        <Callout variant="tip" title="Download the .pem exactly once">
          AWS does not let you re-download the same private key. Lost key = launch a new instance or use
          Session Manager (later lesson) if configured. Store the file in a secure folder with restricted
          permissions.
        </Callout>
        <Callout variant="insight">
          Attach an IAM role at launch so your first ETL test can run{' '}
          <code className="text-core-400">aws s3 ls</code> without configuring{' '}
          <code className="text-core-400">aws configure</code> access keys on the box — least privilege
          from minute one.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'AMI = template (OS + disk snapshot) for launching identical instances; copy AMIs per Region.',
          'Launch wizard: AMI → type → key pair → network/SG → EBS → IAM role → optional user data.',
          'Key pair: public key on instance, private .pem on your machine — required for Linux SSH.',
          'Tag instances for cost tracking; attach IAM instance profile at launch for S3 access without embedded keys.',
        ]}
      />
    </LessonArticle>
  )
}
