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

export function PuttingItTogetherS3Beginner() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Checkpoint before storage classes and lifecycle">
        You now know what S3 is, how buckets and keys work, Console upload/download, CLI ls/cp/sync, Boto3
        basics, and why data lakes live on S3 with raw/ processed/ curated prefixes. This lesson ties those
        threads into a <strong className="text-white">beginner lake checklist</strong> — a dev bucket you
        can use from your EC2 sandbox before encryption policies and Intelligent-Tiering enter the picture.
      </Callout>

      <Definition term="Beginner dev lake bucket">
        <p>
          A <strong className="text-white">beginner dev lake bucket</strong> is a single encrypted S3 bucket
          in your dev account with three top-level prefixes, block-public-access enabled, tags for cost
          tracking, and IAM roles (EC2, later Glue) scoped to that bucket only. It holds toy CSV and
          Parquet files — not production PII — while you learn list, copy, and catalog patterns.
        </p>
      </Definition>

      <LessonSection title="Setup checklist — dev lake in one afternoon">
        <ContentStep number={1} title="Bucket and Region">
          <p className="text-slate-300">
            Create <code className="text-core-400">yourname-lake-dev-2024</code> in the same Region as your
            EC2 sandbox. Enable default encryption (SSE-S3). Block all public access. Tag{' '}
            <code className="text-core-400">Environment=dev</code>.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Prefix layout">
          <p className="text-slate-300">
            Upload placeholder objects or small README files so prefixes exist in the Console:
          </p>
          <Example title="Initial keys" caption="Optional README per zone">
{`raw/README.txt
processed/README.txt
curated/README.txt`}
          </Example>
        </ContentStep>
        <ContentStep number={3} title="IAM role for EC2 (from IAM track)">
          <p className="text-slate-300">
            Policy allows <code className="text-core-400">s3:ListBucket</code> on the bucket ARN and{' '}
            <code className="text-core-400">s3:GetObject</code>,{' '}
            <code className="text-core-400">s3:PutObject</code>,{' '}
            <code className="text-core-400">s3:DeleteObject</code> on{' '}
            <code className="text-core-400">arn:aws:s3:::yourname-lake-dev-2024/*</code> — tighten to
            prefix-level denies on curated/ later for realism.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Prove three access paths">
          <p className="text-slate-300">
            From EC2 with instance profile: Console (browser),{' '}
            <code className="text-core-400">aws s3 ls</code>, and a five-line Boto3 upload script. All three
            should succeed without access keys on disk.
          </p>
        </ContentStep>
        <Flowchart
          title="Beginner lake verification flow"
          chart={`flowchart TD
  A[Create dev bucket encrypted]
  A --> B[Add raw processed curated prefixes]
  B --> C[Attach EC2 IAM role]
  C --> D[Console upload sample CSV to raw/]
  D --> E[aws s3 cp raw to processed on EC2]
  E --> F[Boto3 list prefix and log keys]
  F --> G[Self-check vocabulary and URLs]`}
        />
      </LessonSection>

      <LessonSection title="Mini scenario — one file through the zones">
        <p className="text-slate-300">
          Simulate a medallion pass with manual steps before automation:
        </p>
        <ContentStep number={1} title="Land in raw/">
          <p className="text-slate-300">
            Upload <code className="text-core-400">orders-2024-01-15.csv</code> to{' '}
            <code className="text-core-400">raw/orders/</code> via Console or{' '}
            <code className="text-core-400">aws s3 cp</code>.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Transform on EC2 (toy)">
          <Example title="Manual ETL stub" caption="Python on sandbox — not production pattern">
{`# On EC2 — read CSV, write Parquet to processed/
import pandas as pd
df = pd.read_csv("orders-2024-01-15.csv")
df.to_parquet("orders.parquet")
# Then: aws s3 cp orders.parquet \\
#   s3://yourname-lake-dev-2024/processed/orders/year=2024/month=01/orders.parquet`}
          </Example>
        </ContentStep>
        <ContentStep number={3} title="Publish to curated/ (concept)">
          <p className="text-slate-300">
            Copy aggregated output to{' '}
            <code className="text-core-400">curated/orders_daily/</code> — in a real lake, Glue job plus
            catalog table. For now, verify you can list both prefixes and explain which IAM principal should
            write where.
          </p>
        </ContentStep>
        <Callout variant="insight">
          The point is not pandas skill — it is seeing one dataset move through key paths you will later
          register in Glue and query with Athena.
        </Callout>
      </LessonSection>

      <LessonSection title="Self-check — can you explain these?">
        <ContentStep number={1} title="Bucket vs object vs key">
          <p className="text-slate-300">
            Bucket is the container; object is stored bytes; key is the full path string inside the bucket.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Why prefixes are not real folders">
          <p className="text-slate-300">
            Listing uses key prefix matching — no directory inode. IAM and Athena partition on prefix
            strings.
          </p>
        </ContentStep>
        <ContentStep number={3} title="s3:// vs HTTPS vs ARN">
          <p className="text-slate-300">
            s3:// for pipelines and CLI; HTTPS for presigned browser download; ARN in IAM policies.
          </p>
        </ContentStep>
        <ContentStep number={4} title="CLI sync vs cp">
          <p className="text-slate-300">
            cp for one file; sync for directory mirror with incremental compare — backfill pattern.
          </p>
        </ContentStep>
        <ContentStep number={5} title="Why Boto3 on EC2 needs no keys">
          <p className="text-slate-300">
            Instance profile supplies temporary credentials from STS — least privilege role from IAM track.
          </p>
        </ContentStep>
        <ContentStep number={6} title="Why lakes use S3">
          <p className="text-slate-300">
            Durable cheap storage decoupled from compute; multiple engines read same Parquet paths.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="What comes next">
        <p className="text-slate-300">
          The next lessons in the S3 track go deeper on topics this beginner pass introduced:
        </p>
        <ContentStep number={1} title="Storage classes">
          <p className="text-slate-300">
            S3 Standard for hot data, Infrequent Access for monthly reads, Glacier for archives — pick class
            by access pattern, not guesswork. Query-heavy curated stays Standard; old raw logs tier down.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Lifecycle rules">
          <p className="text-slate-300">
            Automatic transition from Standard to IA or Glacier after N days; expire Athena scratch prefixes
            after 7 days. Lifecycle is how lake cost stays predictable as volume grows.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Security and governance">
          <p className="text-slate-300">
            Bucket policies, SSE-KMS, versioning, S3 Object Lock for compliance, and access logging — align
            with IAM identity policies for defense in depth.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Glue and Athena (later course modules)">
          <p className="text-slate-300">
            Register <code className="text-core-400">processed/orders/</code> as a table, run SQL without
            loading into a database server. Your dev bucket becomes the hands-on lab for those services.
          </p>
        </ContentStep>
        <p className="mt-4 text-slate-300">
          After S3 solidifies, the course connects compute you already learned — EC2 cron, Lambda triggers,
          Glue Spark — all reading and writing the same bucket. Hybrid pipelines are normal: Firehose to{' '}
          <code className="text-core-400">raw/</code>, Glue to <code className="text-core-400">processed/</code>,
          Athena on <code className="text-core-400">curated/</code>.
        </p>
        <Callout variant="insight">
          Strong S3 beginners do not memorize every storage class on day one. They ask: What is the key path?
          Who has IAM access? What format and partition? What engine reads it? Those questions design a lake
          before cost optimization.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Dev lake checklist: encrypted bucket, raw/processed/curated prefixes, IAM role on EC2, verify Console + CLI + Boto3.',
          'Walk one file raw → processed → curated manually to connect keys to future Glue and Athena tables.',
          'Next in S3 track: storage classes, lifecycle rules, encryption, bucket policies, and versioning.',
          'S3 is the hub — EC2, Lambda, Glue, Athena, and Redshift Spectrum are spokes you will wire next.',
        ]}
      />
    </LessonArticle>
  )
}
