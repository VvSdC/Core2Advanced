import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function BucketsObjectsKeys() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="The object model — everything in S3 is a key">
        Before uploading a single CSV, understand how S3 names and stores data. Unlike EBS on EC2, there
        are no mount points or block devices — only buckets full of objects addressed by string keys. Data
        engineers who master this model design clean lake prefixes and write IAM policies that match.
      </Callout>

      <Definition term="Bucket">
        <p>
          A <strong className="text-white">bucket</strong> is a top-level container with a{' '}
          <strong className="text-white">globally unique name</strong> across all of AWS (not just your
          account). You choose a Region when creating it; all objects in that bucket live in that Region
          unless you enable cross-Region replication. Typical DE names:{' '}
          <code className="text-core-400">acme-lake-dev</code>,{' '}
          <code className="text-core-400">acme-lake-prod</code>,{' '}
          <code className="text-core-400">acme-athena-results</code>.
        </p>
      </Definition>

      <Definition term="Object and object key">
        <p>
          An <strong className="text-white">object</strong> is the combination of{' '}
          <strong className="text-white">data</strong> (bytes) and{' '}
          <strong className="text-white">metadata</strong> (content type, encryption, tags, user-defined
          headers). The <strong className="text-white">object key</strong> is the unique name of that
          object within the bucket — up to 1,024 UTF-8 characters. There is no separate &quot;filename&quot;
          field; the key <em>is</em> the path.
        </p>
        <p className="mt-2 text-slate-300">
          Example key:{' '}
          <code className="text-core-400">raw/events/year=2024/month=01/day=15/part-00000.parquet</code>
        </p>
      </Definition>

      <LessonSection title="Prefix — the folder illusion">
        <p className="text-slate-300">
          The S3 Console shows a folder tree because humans think in directories. Under the hood, S3 is a
          flat key-value store. Keys that share a common prefix{' '}
          <code className="text-core-400">raw/orders/</code> <em>behave</em> like a folder when you list
          with a delimiter, but no directory object exists unless you explicitly create a zero-byte
          &quot;folder marker&quot; object (rare in modern lakes).
        </p>
        <ContentStep number={1} title="Why prefixes matter for DE">
          <p className="text-slate-300">
            Partition columns in Athena and Glue map to key prefixes:{' '}
            <code className="text-core-400">year=2024/</code> lets queries skip other years. IAM policies
            often scope to <code className="text-core-400">arn:aws:s3:::acme-lake-dev/raw/*</code> so ETL
            roles cannot touch <code className="text-core-400">curated/</code>.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Listing is prefix-based">
          <p className="text-slate-300">
            <code className="text-core-400">aws s3 ls s3://bucket/raw/</code> returns objects whose keys
            start with that prefix. Trailing slash on a prefix is a convention, not a requirement — but
            using it consistently avoids surprises when filtering.
          </p>
        </ContentStep>
        <Callout variant="insight">
          Two objects can share a prefix without sharing a &quot;parent folder&quot; object.{' '}
          <code className="text-core-400">raw/a.csv</code> and{' '}
          <code className="text-core-400">raw/b.csv</code> are siblings because their keys share the prefix{' '}
          <code className="text-core-400">raw/</code> — nothing else is required.
        </Callout>
      </LessonSection>

      <LessonSection title="Bucket naming rules (high level)">
        <p className="text-slate-300">
          Bucket names must be 3–63 characters, lowercase letters, numbers, dots, and hyphens only. They
          must start and end with a letter or number. No underscores. Because names are global,{' '}
          <code className="text-core-400">company-lake</code> is almost certainly taken — use a company
          prefix plus environment: <code className="text-core-400">acme-corp-lake-dev-us-east-1</code>.
        </p>
        <div className="mt-4 overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Rule</th>
                <th className="px-4 py-3">Why DE teams care</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Globally unique', 'Dev and prod need different bucket names — not just different accounts with the same name'],
                ['Lowercase only', 's3://My-Bucket and typos break scripts; standardize lowercase in docs and Terraform'],
                ['No sensitive data in the name', 'Bucket names can appear in logs and URLs — avoid embedding project codenames that leak context'],
                ['Pick Region at creation', 'Data residency and latency — match your EC2, Glue, and Redshift Region'],
                ['DNS-compatible', 'Enables virtual-hosted-style HTTPS URLs and static website hosting patterns'],
              ].map(([rule, why]) => (
                <tr key={rule} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{rule}</td>
                  <td className="px-4 py-3">{why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip" title="Dev vs prod buckets">
          Separate buckets (or at minimum separate top-level prefixes with strict IAM) prevent a test script
          from overwriting production curated tables. Many teams use{' '}
          <code className="text-core-400">*-dev</code>, <code className="text-core-400">*-staging</code>,{' '}
          <code className="text-core-400">*-prod</code> naming from day one.
        </Callout>
      </LessonSection>

      <LessonSection title="S3 URLs — s3:// and HTTPS">
        <p className="text-slate-300">
          Data engineers reference S3 locations in three common forms. Know all three — Glue job arguments,
          Athena DDL, and IAM ARNs each pick a slightly different style.
        </p>
        <ContentStep number={1} title="S3 URI (most common in DE)">
          <Example title="s3:// pattern" caption="Used in CLI, Spark, Glue, and boto3">
{`s3://acme-lake-dev/raw/orders/2024-01-15/part-000.parquet
s3://acme-lake-dev/processed/
s3://acme-athena-results/`}
          </Example>
          <p className="mt-2 text-slate-300">
            Format: <code className="text-core-400">s3://bucket-name/key/path</code>. No Region in the URI
            — the SDK resolves the bucket&apos;s Region on first access (small latency hit if wrong Region
            configured).
          </p>
        </ContentStep>
        <ContentStep number={2} title="HTTPS — virtual-hosted style">
          <Example title="Browser and signed URL pattern">
{`https://acme-lake-dev.s3.us-east-1.amazonaws.com/raw/orders/part-000.parquet
https://acme-lake-dev.s3.amazonaws.com/raw/orders/part-000.parquet`}
          </Example>
          <p className="mt-2 text-slate-300">
            Bucket name appears as the subdomain. Region-specific endpoint is recommended for clarity and
            compliance. Presigned URLs for temporary download links use this form.
          </p>
        </ContentStep>
        <ContentStep number={3} title="HTTPS — path-style (legacy)">
          <Example title="Older path-style URL">
{`https://s3.us-east-1.amazonaws.com/acme-lake-dev/raw/orders/part-000.parquet`}
          </Example>
          <p className="mt-2 text-slate-300">
            Still supported in many Regions but virtual-hosted style is the modern default. You may see
            path-style in old scripts — migrate when you touch them.
          </p>
        </ContentStep>
        <ContentStep number={4} title="IAM and ARN references">
          <p className="text-slate-300">
            Policies reference buckets and objects by ARN, not s3:// URI:
          </p>
          <Example title="IAM resource ARNs">
{`arn:aws:s3:::acme-lake-dev
arn:aws:s3:::acme-lake-dev/raw/*
arn:aws:s3:::acme-lake-dev/processed/sales/*`}
          </Example>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Object metadata DE teams use">
        <ContentStep number={1} title="Content-Type">
          <p className="text-slate-300">
            Set <code className="text-core-400">application/parquet</code> or{' '}
            <code className="text-core-400">text/csv</code> on upload so browsers and some tools infer
            format correctly. Glue and Athena rely on file extension and SerDe more than Content-Type.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Tags">
          <p className="text-slate-300">
            Key-value tags on objects (<code className="text-core-400">Environment=dev</code>,{' '}
            <code className="text-core-400">CostCenter=analytics</code>) feed cost allocation reports
            alongside bucket-level tags.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Size and etag">
          <p className="text-slate-300">
            Each object has a size in bytes and an entity tag (etag) used for integrity checks and
            conditional writes. Incremental pipelines sometimes compare etag or LastModified to skip
            unchanged files.
          </p>
        </ContentStep>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Bucket = globally unique container in a Region; object = bytes + metadata addressed by a key.',
          'Prefixes like raw/ are naming conventions — S3 is flat; the Console folder view is a listing trick.',
          'Name buckets lowercase with company and environment; never reuse prod names in dev.',
          'Reference data with s3:// URIs in pipelines, HTTPS for presigned links, ARNs in IAM policies.',
        ]}
      />
    </LessonArticle>
  )
}
