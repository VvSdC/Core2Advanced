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

export function PuttingItTogetherEc2Beginner() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Checkpoint before EBS and security groups deep dive">
        You now know what EC2 is, instance types and pricing, AMIs and the launch wizard, networking
        addresses, user data bootstrap, and SSH access. This lesson ties those threads into a{' '}
        <strong className="text-white">launch checklist</strong> for a beginner data engineering sandbox
        — a safe place to run Python ETL against S3 before production patterns and serverless alternatives
        enter the picture.
      </Callout>

      <Definition term="DE sandbox EC2">
        <p>
          A <strong className="text-white">DE sandbox instance</strong> is a small, tagged, On-Demand Linux
          box in a dev account: IAM role for S3 read/write on a dev bucket prefix, security group locked to
          your IP, user data that installs Python deps, and a habit of stopping the instance when idle. It
          is not production — it is where you learn without risking the lake.
        </p>
      </Definition>

      <LessonSection title="Launch checklist — beginner DE sandbox">
        <ContentStep number={1} title="Account and Region">
          <p className="text-slate-300">
            Use a dev account or dedicated OU. Pick the same Region as your dev S3 bucket (e.g.{' '}
            <code className="text-core-400">us-east-1</code>). Set a billing alarm if you have not already.
          </p>
        </ContentStep>
        <ContentStep number={2} title="IAM before launch">
          <p className="text-slate-300">
            Create a role <code className="text-core-400">EC2DevETLRole</code> trusting{' '}
            <code className="text-core-400">ec2.amazonaws.com</code> with a policy allowing{' '}
            <code className="text-core-400">s3:ListBucket</code>,{' '}
            <code className="text-core-400">s3:GetObject</code>,{' '}
            <code className="text-core-400">s3:PutObject</code> on{' '}
            <code className="text-core-400">arn:aws:s3:::company-lake-dev/*</code> only — least privilege
            from the IAM sub-topic.
          </p>
        </ContentStep>
        <ContentStep number={3} title="AMI and instance type">
          <p className="text-slate-300">
            Amazon Linux 2023 or Ubuntu 22.04. Type: <code className="text-core-400">t3.small</code> or{' '}
            <code className="text-core-400">t3.micro</code> for Free Tier experiments. On-Demand pricing.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Key pair">
          <p className="text-slate-300">
            Create <code className="text-core-400">de-sandbox-yourname</code>, download .pem once,{' '}
            <code className="text-core-400">chmod 400</code>, never commit to git.
          </p>
        </ContentStep>
        <ContentStep number={5} title="Network">
          <p className="text-slate-300">
            Default VPC public subnet is fine for learning. Enable auto-assign public IP. Security group:
            inbound TCP 22 from <strong className="text-white">My IP</strong> only; outbound all (default).
          </p>
        </ContentStep>
        <ContentStep number={6} title="Storage">
          <p className="text-slate-300">
            Root gp3 volume 20–30 GB. Durable datasets belong in S3, not only on local disk.
          </p>
        </ContentStep>
        <ContentStep number={7} title="Advanced on launch">
          <p className="text-slate-300">
            Attach <code className="text-core-400">EC2DevETLRole</code> instance profile. Paste user data
            to install Python 3 and boto3. Require IMDSv2 if the launch option is available.
          </p>
        </ContentStep>
        <ContentStep number={8} title="Tags">
          <p className="text-slate-300">
            <code className="text-core-400">Name=de-sandbox-yourname</code>,{' '}
            <code className="text-core-400">Environment=dev</code>,{' '}
            <code className="text-core-400">Owner=you@company.com</code>.
          </p>
        </ContentStep>
        <Flowchart
          title="Sandbox launch checklist flow"
          chart={`flowchart TD
  A[IAM role for S3 dev prefix]
  A --> B[AMI plus t3.small On-Demand]
  B --> C[Key pair and SG SSH from My IP]
  C --> D[Public subnet plus EBS gp3]
  D --> E[User data install Python deps]
  E --> F[Tags and IMDSv2 required]
  F --> G[Launch SSH verify aws s3 ls]
  G --> H[Run test ETL stop instance]`}
        />
      </LessonSection>

      <LessonSection title="First hour on the box">
        <Example title="Sanity script" caption="After SSH — prove the sandbox works">
{`# On the instance (role attached — no aws configure needed)
aws s3 ls s3://company-lake-dev/
python3 -c "import boto3; print(boto3.client('s3').list_buckets())"

# Tiny ETL test: copy a sample file between prefixes
aws s3 cp s3://company-lake-dev/raw/sample.csv \\
          s3://company-lake-dev/processed/sample-copy.csv

# Schedule later with cron or trigger from Airflow — not on day one`}
        </Example>
        <Callout variant="tip" title="Stop when done">
          EC2 On-Demand bills per second while <strong className="text-white">running</strong>. Stopping
          the instance pauses compute charges; EBS storage still costs a few cents. Terminate when you
          finish the course module and snapshot anything worth keeping to S3.
        </Callout>
      </LessonSection>

      <LessonSection title="Mini scenario — nightly CSV to Parquet">
        <p className="text-slate-300">
          You will eventually run a cron job at 2 a.m.: read yesterday&apos;s CSV from{' '}
          <code className="text-core-400">s3://company-lake-dev/raw/</code>, convert to Parquet with
          pandas/pyarrow, write to <code className="text-core-400">processed/</code>, log row counts to
          CloudWatch. On this sandbox EC2, that script is a file in{' '}
          <code className="text-core-400">/opt/de-etl/</code> invoked manually first, then via{' '}
          <code className="text-core-400">cron</code>. Later lessons compare running the same logic on
          Glue (managed Spark) or Lambda (event-driven, short jobs).
        </p>
        <ContentStep number={1} title="Why EC2 for this exercise">
          <p className="text-slate-300">
            Full shell access, easy pip installs, and visible logs teach the data path before abstraction
            hides details in managed services.
          </p>
        </ContentStep>
        <ContentStep number={2} title="When to graduate off EC2">
          <p className="text-slate-300">
            If the job runs reliably for weeks and you want zero OS patching, move to Glue or containerize
            on ECS/Fargate. If it must stay custom but scale out, add Auto Scaling and Spot workers.
          </p>
        </ContentStep>
        <Callout variant="insight">
          Airflow teaser: this sandbox could become a single-node Airflow install — scheduler and worker
          on one t3.medium, DAGs triggering Glue jobs and this EC2 cron script. Orchestration lessons
          connect the dots; EC2 is the footing.
        </Callout>
      </LessonSection>

      <LessonSection title="Self-check — can you explain these?">
        <ContentStep number={1} title="Why attach IAM role instead of access keys?">
          <p className="text-slate-300">
            Temporary credentials rotate automatically; no secrets on disk; policy scoped to dev bucket
            prefix; revoke by detaching role — IAM sub-topic applied to compute.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Why not SSH 0.0.0.0/0?">
          <p className="text-slate-300">
            Entire internet can attempt brute force and exploit SSH vulnerabilities. Restrict to your IP or
            use Session Manager later.
          </p>
        </ContentStep>
        <ContentStep number={3} title="On-Demand vs Spot for this sandbox?">
          <p className="text-slate-300">
            On-Demand — predictable, no interruption while learning. Spot is for batch ETL with retry once
            you understand interruptions.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Where does user data fit?">
          <p className="text-slate-300">
            First-boot automation installs Python deps so every relaunch is consistent; check{' '}
            <code className="text-core-400">/var/log/cloud-init-output.log</code> if packages missing.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="What comes next">
        <p className="text-slate-300">
          The next lessons in the EC2 track go deeper on topics this beginner pass introduced:
        </p>
        <ContentStep number={1} title="EBS — persistent storage">
          <p className="text-slate-300">
            Volume types (gp3, io2), resize, snapshots, and attaching extra disks for local staging before
            bulk S3 upload. Understand when data must live on EBS vs S3.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Security Groups — rules that stick">
          <p className="text-slate-300">
            Inbound/outbound rules, referencing other SGs (Airflow worker to metadata DB), and least
            privilege for JDBC sources and Redis.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Auto Scaling Groups (ASG)">
          <p className="text-slate-300">
            Launch templates, health checks, scaling policies — run ten Spot workers for backfill, one
            On-Demand coordinator for Airflow.
          </p>
        </ContentStep>
        <p className="mt-4 text-slate-300">
          After EC2 solidifies, the course moves to <strong className="text-white">S3</strong> in depth —
          where your ETL reads and writes — then <strong className="text-white">Lambda</strong> for
          serverless ingestion. The sandbox you launched here becomes the client that lists buckets, syncs
          prefixes, and compares managed vs self-managed compute.
        </p>
        <Callout variant="insight">
          Strong EC2 beginners do not memorize every instance type. They ask: How long does the job run?
          Need SSH or Session Manager? Where is data durable (S3)? Who is the IAM role? Those questions
          pick the right compute and network layout before cost optimization.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'DE sandbox checklist: dev IAM role → small Linux On-Demand → key pair → SG SSH from My IP → user data → tags → stop when idle.',
          'Prove setup with aws s3 ls and a tiny copy/transform script before scheduling cron or Airflow.',
          'Next in EC2 track: EBS volumes, security group deep dive, Auto Scaling Groups and Spot fleets.',
          'Then S3 and Lambda — same data paths, different compute models; hybrid pipelines are normal.',
        ]}
      />
    </LessonArticle>
  )
}
