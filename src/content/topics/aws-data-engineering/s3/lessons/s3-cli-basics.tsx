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

export function S3CliBasics() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="aws s3 — the DE shell workhorse">
        The AWS CLI wraps S3 APIs in commands you can run from your laptop, EC2 sandbox, or CI pipeline.
        If you already ran <code className="text-core-400">aws configure</code> in the fundamentals track,
        you are one step away from listing buckets and syncing a local folder to{' '}
        <code className="text-core-400">raw/</code>.
      </Callout>

      <Definition term="aws s3 command group">
        <p>
          <strong className="text-white">aws s3</strong> is a high-level CLI subcommand for common object
          operations: list, copy, move, sync, and remove. Under the hood it calls S3 REST APIs. For
          low-level metadata (ACLs, versioning, replication), use{' '}
          <code className="text-core-400">aws s3api</code> instead — we focus on{' '}
          <code className="text-core-400">aws s3</code> here because DE daily work lives in ls, cp, and
          sync.
        </p>
      </Definition>

      <LessonSection title="Prerequisites — credentials and Region">
        <ContentStep number={1} title="Who am I?">
          <Example title="Verify identity">
{`aws sts get-caller-identity`}
          </Example>
          <p className="mt-2 text-slate-300">
            Returns account ID, user or role ARN, and session name. On EC2 with an instance profile, this
            shows the role — no access keys in <code className="text-core-400">~/.aws/credentials</code>.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Default Region">
          <p className="text-slate-300">
            Set <code className="text-core-400">AWS_DEFAULT_REGION=us-east-1</code> or configure in{' '}
            <code className="text-core-400">~/.aws/config</code>. Cross-Region bucket access works but adds
            latency; keep dev bucket and CLI default in the same Region.
          </p>
        </ContentStep>
        <Callout variant="tip" title="Never commit keys">
          Use IAM user keys only on a dev laptop. Pipelines on EC2, Glue, and Lambda should use roles.
          Rotate keys if they appear in git history.
        </Callout>
      </LessonSection>

      <LessonSection title="aws s3 ls — list buckets and prefixes">
        <Example title="Listing examples" caption="Replace bucket name with your dev bucket">
{`# List all buckets in the account
aws s3 ls

# List top-level prefixes and objects in a bucket
aws s3 ls s3://yourname-lake-dev-2024/

# List one prefix — like opening a folder
aws s3 ls s3://yourname-lake-dev-2024/raw/

# Recursive list — every object under raw/
aws s3 ls s3://yourname-lake-dev-2024/raw/ --recursive

# Human-readable sizes
aws s3 ls s3://yourname-lake-dev-2024/raw/ --recursive --human-readable --summarize`}
        </Example>
        <p className="text-slate-300">
          Output columns: date, time, size, key. Zero-byte &quot;folder&quot; markers show size 0. Use
          recursive listing sparingly on large buckets — it can take minutes and cost list API requests.
        </p>
      </LessonSection>

      <LessonSection title="aws s3 cp — copy one file">
        <Example title="Upload and download" caption="Toy paths for learning">
{`# Upload local file to S3 (creates or overwrites object)
aws s3 cp ./orders.csv s3://yourname-lake-dev-2024/raw/sample/orders.csv

# Download S3 object to local disk
aws s3 cp s3://yourname-lake-dev-2024/raw/sample/orders.csv ./orders-copy.csv

# Copy between buckets or prefixes (S3 to S3 — no local disk)
aws s3 cp \\
  s3://yourname-lake-dev-2024/raw/sample/orders.csv \\
  s3://yourname-lake-dev-2024/processed/sample/orders-copy.csv`}
        </Example>
        <ContentStep number={1} title="Useful flags">
          <p className="text-slate-300">
            <code className="text-core-400">--dryrun</code> prints what would happen without copying.{' '}
            <code className="text-core-400">--exclude</code> and{' '}
            <code className="text-core-400">--include</code> filter by wildcard when copying directories.{' '}
            <code className="text-core-400">--metadata-directive REPLACE</code> on S3-to-S3 copies updates
            metadata.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="aws s3 sync — mirror a directory">
        <Example title="Sync local staging to raw landing zone">
{`# Upload only new or changed files (compare size and mtime)
aws s3 sync ./local-staging/ s3://yourname-lake-dev-2024/raw/daily/

# Download processed output for local validation
aws s3 sync s3://yourname-lake-dev-2024/processed/sales/ ./local-verify/

# Preview sync actions
aws s3 sync ./local-staging/ s3://yourname-lake-dev-2024/raw/daily/ --dryrun`}
        </Example>
        <p className="text-slate-300">
          <code className="text-core-400">sync</code> is the command behind many ad hoc backfills and
          notebook-to-lake uploads. It does not delete extra objects on the destination unless you pass{' '}
          <code className="text-core-400">--delete</code> — use that flag carefully in prod.
        </p>
        <Callout variant="insight">
          A nightly cron on your EC2 sandbox might run{' '}
          <code className="text-core-400">aws s3 sync /data/out/ s3://bucket/raw/</code> after a local
          extract. Managed pipelines eventually replace cron with Glue or Step Functions — but sync teaches
          the same data movement pattern.
        </Callout>
      </LessonSection>

      <LessonSection title="When CLI beats Console for DE">
        <Flowchart
          title="Console vs CLI for common DE tasks"
          chart={`flowchart TB
  Q[Task type]
  Q -->|One file sanity check| C[Console OK]
  Q -->|Bulk upload or download| L[CLI sync or cp]
  Q -->|CI deploy landing bucket layout| L
  Q -->|Repeatable backfill script| L
  Q -->|Inspect IAM AccessDenied| B[Both — CLI shows error JSON]
  L --> R[Scriptable in bash Airflow shell task]
  C --> S[Visual browse prefixes]`}
        />
        <div className="mt-4 overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Scenario</th>
                <th className="px-4 py-3">Why CLI wins</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Initial lake prefix bootstrap', 'Shell script creates raw/, processed/, curated/ marker keys or README objects in one run'],
                ['Re-ingest last 30 days from on-prem', 'sync with exclude/include filters; resume after network blip'],
                ['Airflow BashOperator smoke test', 'One line aws s3 ls proves IAM role before Spark job starts'],
                ['GitHub Actions deploy', 'CI uploads config JSON to s3://config-bucket/pipelines/ on merge'],
                ['Compare two prefixes', 'Recursive ls piped to sort/diff — awkward in Console'],
              ].map(([scenario, why]) => (
                <tr key={scenario} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{scenario}</td>
                  <td className="px-4 py-3">{why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Common errors beginners see">
        <ContentStep number={1} title="AccessDenied">
          <p className="text-slate-300">
            IAM user or role lacks <code className="text-core-400">s3:ListBucket</code> on the bucket or{' '}
            <code className="text-core-400">s3:PutObject</code> on the prefix. Fix the policy — not the
            CLI command.
          </p>
        </ContentStep>
        <ContentStep number={2} title="NoSuchBucket">
          <p className="text-slate-300">
            Typo in bucket name or wrong Region endpoint. Bucket names are global but live in one Region.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Slow sync">
          <p className="text-slate-300">
            Millions of small files bottleneck on list and PUT rate. Later: transfer acceleration,
            parallel cp with xargs, or S3 Batch Operations for enterprise scale.
          </p>
        </ContentStep>
      </LessonSection>

      <KeyTakeaways
        items={[
          'aws s3 ls lists buckets and prefixes; --recursive for full key listing under a prefix.',
          'aws s3 cp moves one file local↔S3 or S3↔S3; aws s3 sync mirrors directories for backfills.',
          'CLI wins for bulk ops, CI/CD, cron on EC2, and repeatable scripts — Console for one-off browse.',
          'AccessDenied means IAM — align role or user policy with bucket ARN and prefix path.',
        ]}
      />
    </LessonArticle>
  )
}
