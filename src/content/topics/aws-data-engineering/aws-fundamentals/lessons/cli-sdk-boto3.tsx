import {
  Callout,
  CodeBlock,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function CliSdkBoto3() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Clicking does not scale">
        The Console is great for learning and one-off fixes. Production data pipelines need{' '}
        <strong className="text-white">automation</strong> — repeatable scripts, CI/CD deploys, and
        scheduled jobs. That is where the AWS CLI and SDKs (Boto3 for Python) earn their place.
      </Callout>

      <Definition term="CLI and SDK">
        <p>
          The <strong className="text-white">AWS CLI</strong> is a command-line program that calls the
          same APIs as the Console. An <strong className="text-white">SDK</strong> (Software Development
          Kit) — <strong className="text-white">Boto3</strong> in Python — lets your code create buckets,
          start Glue jobs, or read S3 objects programmatically.
        </p>
      </Definition>

      <LessonSection title="Why data engineers automate">
        <ContentStep number={1} title="Repeatable deployments">
          <p className="text-slate-300">
            A script that creates landing buckets, enables versioning, and attaches a bucket policy runs
            the same in dev, staging, and prod — no missed checkbox in the UI.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Pipeline integration">
          <p className="text-slate-300">
            Airflow, Step Functions, or GitHub Actions invoke CLI commands or Boto3 calls to trigger
            Glue crawlers, copy files, or refresh Athena partitions after each load.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Bulk operations">
          <p className="text-slate-300">
            Listing thousands of prefixes, tagging objects, or rotating keys is tedious in the Console
            and fast in a loop with Boto3 paginators.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="AWS CLI — configure once">
        <p className="text-slate-300">
          Install the CLI v2 from AWS docs, then run{' '}
          <span className="font-mono text-sm text-core-400">aws configure</span>. It stores credentials
          and default Region in{' '}
          <span className="font-mono text-sm text-core-400">~/.aws/credentials</span> and{' '}
          <span className="font-mono text-sm text-core-400">~/.aws/config</span>. Use IAM access keys
          for a lab user — never root keys.
        </p>
        <Callout variant="tip" title="Never paste real secrets">
          Do not commit access keys to GitHub, screenshots, or chat. Use environment variables, IAM roles
          on EC2/Lambda, or AWS SSO. If a key leaks, deactivate it immediately in IAM.
        </Callout>
        <CodeBlock title="Configure and verify (example values only)">
{`aws configure
# AWS Access Key ID: AKIA...EXAMPLE
# AWS Secret Access Key: wJalr...EXAMPLE
# Default region: us-east-1
# Default output format: json

aws sts get-caller-identity`}
        </CodeBlock>
      </LessonSection>

      <LessonSection title="Boto3 toy example — list S3 buckets">
        <Example
          title="list_buckets.py"
          output={`Found buckets:
  my-company-raw-data
  my-company-analytics-staging`}
          caption="Requires boto3 installed and credentials configured"
        >
{`import boto3

s3 = boto3.client("s3")
response = s3.list_buckets()

print("Found buckets:")
for bucket in response["Buckets"]:
    print(f"  {bucket['Name']}")`}
        </Example>
        <p className="text-slate-300">
          The same pattern extends to uploading Parquet files, checking object metadata, or starting a
          Glue job run. Boto3 maps closely to AWS API names — if you know the service API, you can find
          the Boto3 method.
        </p>
        <Callout variant="insight">
          On Lambda or Glue, prefer an <strong className="text-white">IAM role</strong> attached to the
          function instead of long-lived access keys. Boto3 picks up role credentials automatically from
          the environment.
        </Callout>
      </LessonSection>

      <LessonSection title="Console vs CLI vs SDK">
        <Flowchart
          title="When to use which"
          chart={`flowchart TB
  Q[What are you doing?]
  Q -->|Learn / debug once| C[Console]
  Q -->|Shell script / DevOps| L[CLI]
  Q -->|Python pipeline code| B[Boto3 SDK]
  C --> R[Human-friendly]
  L --> S[Scriptable and CI-friendly]
  B --> T[Full logic in application]`}
        />
        <div className="mt-4 overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Tool</th>
                <th className="px-4 py-3">Best for</th>
                <th className="px-4 py-3">Weak for</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Console', 'Exploring services, visual IAM policy editor, quick tests', 'Bulk ops, version control, CI/CD'],
                ['CLI', 'Deploy scripts, jq piping, quick aws s3 sync', 'Complex branching logic inside Python ETL'],
                ['Boto3', 'Glue-adjacent Python, Lambda, notebooks, custom tooling', 'One-click learning when you do not know the API yet'],
              ].map(([tool, best, weak]) => (
                <tr key={tool} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{tool}</td>
                  <td className="px-4 py-3">{best}</td>
                  <td className="px-4 py-3">{weak}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <KeyTakeaways
        items={[
          'CLI and SDK automate what the Console does manually — essential for production DE pipelines.',
          'Configure CLI with IAM user keys (lab) or roles (Lambda/Glue); never commit secrets.',
          'Boto3 example: s3.list_buckets() — same API pattern for most AWS services.',
          'Console to learn, CLI for scripts and CI, Boto3 for Python pipeline logic.',
        ]}
      />
    </LessonArticle>
  )
}
