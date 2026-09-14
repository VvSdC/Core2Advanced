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

export function UserDataAndMetadata() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="First boot automation">
        When an instance starts for the first time, you can hand it a short script called{' '}
        <strong className="text-white">user data</strong>. AWS runs it automatically — install Python
        packages, clone a repo, register with Airflow, or write a config file — before you SSH in. For
        data engineering, user data turns &quot;blank Linux box&quot; into &quot;ETL-ready worker&quot;
        without manual copy-paste on every launch.
      </Callout>

      <Definition term="User data">
        <p>
          <strong className="text-white">User data</strong> is configuration or a bootstrap script passed
          to an EC2 instance at launch. On Linux it is typically a shell script (starting with{' '}
          <code className="text-core-400">#!/bin/bash</code>) executed by the cloud-init service on first
          boot. It runs as root unless the script drops privileges.
        </p>
        <p className="mt-2 text-slate-300">
          User data is <em>not</em> secret storage — anyone with EC2 describe permissions can read it.
          Never embed passwords or API keys; use IAM roles and Secrets Manager instead.
        </p>
      </Definition>

      <LessonSection title="What user data can do for DE">
        <ContentStep number={1} title="Install runtime dependencies">
          <p className="text-slate-300">
            <code className="text-core-400">yum install python3.11</code>,{' '}
            <code className="text-core-400">pip install pandas pyarrow boto3</code>, or pull a corporate
            wheel from an internal artifact repo — all before the instance appears in your SSH client.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Register with orchestration">
          <p className="text-slate-300">
            An Airflow worker user-data script can install the Celery worker package and point at the
            scheduler URL. Auto Scaling Groups (later) launch N identical workers from the same user data
            — horizontal scale for backfill season.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Fetch job config from S3">
          <p className="text-slate-300">
            With an IAM instance profile attached, user data can{' '}
            <code className="text-core-400">aws s3 cp s3://company-config/etl/bootstrap.sh /opt/etl/</code>{' '}
            and execute it — centralize scripts in S3, keep launch template user data tiny.
          </p>
        </ContentStep>
        <Flowchart
          title="First boot with user data"
          chart={`flowchart LR
  L[Launch instance with user data]
  L --> B[Instance boots — cloud-init runs]
  B --> U[User data script executes]
  U --> P[pip install deps]
  U --> C[Clone ETL repo or pull from S3]
  U --> S[Start systemd service]
  S --> R[Ready for SSH or job queue]`}
        />
      </LessonSection>

      <LessonSection title="DE example — Python deps on first boot">
        <Example title="Minimal user data script" caption="Amazon Linux — install pandas and boto3">
{`#!/bin/bash
set -e
yum update -y
yum install -y python3.11 python3.11-pip git
pip3.11 install pandas pyarrow boto3 requests

# Create app directory and log bootstrap
mkdir -p /opt/de-etl/logs
echo "$(date -u) bootstrap complete" >> /opt/de-etl/logs/bootstrap.log

# Optional: pull nightly script from S3 (instance role required)
aws s3 cp s3://company-lake-dev/scripts/nightly_sync.py /opt/de-etl/
chown ec2-user:ec2-user /opt/de-etl/nightly_sync.py`}
        </Example>
        <Callout variant="tip" title="Check logs if bootstrap fails">
          On Amazon Linux, cloud-init logs live under{' '}
          <code className="text-core-400">/var/log/cloud-init-output.log</code>. SSH in and read that file
          before guessing why packages are missing.
        </Callout>
        <Callout variant="insight">
          User data runs on <strong className="text-white">first boot only</strong> by default on many
          AMIs. Changing user data on a stopped instance does not re-run it unless you configure cloud-init
          to do so. For updates, use configuration management, AMIs, or SSM Run Command — not relaunch
          confusion.
        </Callout>
      </LessonSection>

      <LessonSection title="Instance metadata — what the instance knows about itself">
        <Definition term="Instance Metadata Service (IMDS)">
          <p>
            Every EC2 instance can query a local HTTP endpoint (typically{' '}
            <code className="text-core-400">169.254.169.254</code>) for{' '}
            <strong className="text-white">instance metadata</strong>: instance ID, Region, AZ, private IP,
            IAM role name, and more. Scripts use metadata to self-configure without hard-coding IDs.
          </p>
        </Definition>
        <ContentStep number={1} title="DE use case — discover Region">
          <p className="text-slate-300">
            A generic ETL script fetches the Region from metadata and builds the S3 bucket name{' '}
            <code className="text-core-400">company-lake-{'${region}'}</code> — same AMI works in dev and
            prod Regions.
          </p>
        </ContentStep>
        <ContentStep number={2} title="IAM role credentials via metadata">
          <p className="text-slate-300">
            When an instance profile is attached, boto3 and the AWS CLI automatically retrieve temporary
            credentials from metadata — no <code className="text-core-400">aws configure</code> on disk.
            That is how user data can call S3 without embedded keys.
          </p>
        </ContentStep>
        <Example title="Query metadata (IMDSv2)" caption="Token-required pattern — safer default">
{`# Step 1: get a session token (IMDSv2)
TOKEN=$(curl -X PUT "http://169.254.169.254/latest/api/token" \\
  -H "X-aws-ec2-metadata-token-ttl-seconds: 21600")

# Step 2: use token on metadata requests
REGION=$(curl -H "X-aws-ec2-metadata-token: $TOKEN" \\
  http://169.254.169.254/latest/meta-data/placement/region)

echo "Running ETL in region: $REGION"`}
        </Example>
      </LessonSection>

      <LessonSection title="IMDSv2 — high-level safety tip">
        <p className="text-slate-300">
          Older <strong className="text-white">IMDSv1</strong> allowed simple GET requests to metadata — including
          IAM credentials — which SSRF vulnerabilities in web apps could abuse.{' '}
          <strong className="text-white">IMDSv2</strong> requires a session token obtained via HTTP PUT
          before any metadata read, blocking most blind SSRF attacks.
        </p>
        <ContentStep number={1} title="What you should do">
          <p className="text-slate-300">
            Launch new instances with <strong className="text-white">IMDSv2 required</strong> (a launch
            template or account default setting). AWS CLI and boto3 support IMDSv2 automatically on modern
            versions.
          </p>
        </ContentStep>
        <ContentStep number={2} title="What not to do">
          <p className="text-slate-300">
            Do not expose a web server on the same instance that proxies arbitrary URLs without blocking
            access to <code className="text-core-400">169.254.169.254</code>. Metadata credentials are as
            powerful as the attached IAM role — treat IMDS exposure as a credential leak.
          </p>
        </ContentStep>
        <Callout variant="tip" title="Beginner rule">
          Require IMDSv2 on all new instances; use IAM roles for S3 access; never put secrets in user data.
          Three habits that prevent most EC2 credential incidents in DE sandboxes.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'User data = bootstrap script at first boot (cloud-init) — install deps, pull scripts from S3, start services.',
          'Never store secrets in user data; use IAM instance profiles and Secrets Manager.',
          'Instance metadata (IMDS) exposes ID, Region, AZ, and role credentials — scripts use it to stay environment-agnostic.',
          'Require IMDSv2 (token-based) to reduce SSRF credential theft risk; check cloud-init logs if bootstrap fails.',
        ]}
      />
    </LessonArticle>
  )
}
