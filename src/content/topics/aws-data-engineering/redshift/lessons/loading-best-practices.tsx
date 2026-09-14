import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function LoadingBestPractices() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Fast COPY is a file layout + IAM problem before it is a SQL problem">
        Production loads fail or crawl because of oversized single files, missing manifests, wrong IAM role,
        or loading wide CSV when Parquet exists. These practices apply to every nightly curated → warehouse
        pipeline you will operate.
      </Callout>

      <Definition term="Manifest file">
        <p>
          JSON manifest lists exact S3 object URLs for a COPY batch — use when loading a subset of a prefix,
          many small files from heterogeneous paths, or when you need explicit control after partial Glue
          output. <span className="font-mono text-sm">COPY … MANIFEST</span> reads only listed files,
          ignoring siblings in the folder.
        </p>
      </Definition>

      <LessonSection title="Manifests and file sizing">
        <ContentStep number={1} title="Target file size">
          <p className="text-slate-300">
            Aim for <strong className="text-white">1 MB to 125 MB per file</strong> after compression — one
            file per slice minimum, many files for large tables so every node stays busy. Glue/Spark{' '}
            <span className="font-mono text-sm">coalesce</span> or{' '}
            <span className="font-mono text-sm">repartition</span> before writing curated Parquet; thousands
            of 10 KB files hurt COPY and Spectrum equally.
          </p>
        </ContentStep>
        <ContentStep number={2} title="When to use MANIFEST">
          <p className="text-slate-300">
            Lambda/Glue writes a manifest per batch after validation — COPY references manifest path, not
            glob prefix. Prevents loading quarantined or in-progress objects. Required pattern when same
            prefix holds mixed ready/not-ready files.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Compression and format">
          <p className="text-slate-300">
            Parquet with Snappy from curated zone is default. GZIP CSV acceptable for legacy feeds — specify{' '}
            <span className="font-mono text-sm">GZIP</span>, delimiter, and{' '}
            <span className="font-mono text-sm">IGNOREHEADER 1</span>. JSON use{' '}
            <span className="font-mono text-sm">'auto'</span> or{' '}
            <span className="font-mono text-sm">'auto ignorecase'</span> with jsonpaths file for nested payloads.
          </p>
        </ContentStep>
        <Example title="COPY with manifest">
{`COPY staging.orders
FROM 's3://my-lake/curated/orders/manifests/batch-20260315.json'
IAM_ROLE 'arn:aws:iam::123456789012:role/de-redshift-copy-curated'
MANIFEST
FORMAT AS PARQUET
COMPUPDATE OFF
STATUPDATE ON;`}
        </Example>
      </LessonSection>

      <LessonSection title="COPY options — high level">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Option</th>
                <th className="px-4 py-3">Purpose</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['COMPUPDATE OFF', 'Skip automatic compression analysis on load — faster bulk nightly COPY'],
                ['STATUPDATE ON', 'Refresh planner stats during load — good after large append'],
                ['MAXERROR n', 'Allow n bad rows before fail — use in staging with quarantine review'],
                ['TRUNCATECOLUMNS', 'Truncate overlong VARCHAR instead of failing row'],
                ['TIMEFORMAT / DATEFORMAT', 'Parse non-ISO date strings in CSV loads'],
                ['ACCEPTINVCHARS', 'Replace invalid UTF-8 — last resort for messy vendor files'],
                ['GZIP / BZIP2', 'Declare compression on CSV/JSON text files'],
              ].map(([option, purpose]) => (
                <tr key={option} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-mono text-xs text-white">{option}</td>
                  <td className="px-4 py-3">{purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ContentStep number={1} title="Staging → merge workflow">
          <p className="text-slate-300">
            COPY into <span className="font-mono text-sm">staging_*</span> with{' '}
            <span className="font-mono text-sm">MAXERROR</span> tolerance, run data quality SQL, then INSERT
            into production fact. Staging can be EVEN dist without sort key — optimized for ingest speed only.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="IAM role for COPY">
        <Definition term="Cluster-associated IAM role">
          <p>
            Provisioned clusters and serverless namespaces attach one or more IAM roles. COPY references role
            ARN inline — Redshift assumes that role to read S3. Role trust policy allows{' '}
            <span className="font-mono text-sm">redshift.amazonaws.com</span> (or serverless service principal).
            Bucket policy must Allow the role on curated prefix; KMS key policy must Allow{' '}
            <span className="font-mono text-sm">kms:Decrypt</span> for SSE-KMS objects.
          </p>
        </Definition>
        <ContentStep number={1} title="Least privilege">
          <p className="text-slate-300">
            Role <span className="font-mono text-sm">de-redshift-copy-curated</span> — Allow{' '}
            <span className="font-mono text-sm">s3:GetObject</span> on{' '}
            <span className="font-mono text-sm">arn:aws:s3:::my-lake/curated/*</span> only, not entire bucket.
            Separate role for UNLOAD writes to <span className="font-mono text-sm">exports/</span> prefix with PutObject.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Cross-account lake">
          <p className="text-slate-300">
            Central data account owns S3; warehouse account role listed in bucket policy. Same pattern as Athena
            workgroup roles — document ARNs in runbooks. Test with{' '}
            <span className="font-mono text-sm">stl_load_errors</span> after first COPY.
          </p>
        </ContentStep>
        <Example title="Minimal IAM policy sketch for COPY source">
{`{
  "Effect": "Allow",
  "Action": ["s3:GetObject", "s3:ListBucket"],
  "Resource": [
    "arn:aws:s3:::my-lake",
    "arn:aws:s3:::my-lake/curated/*"
  ]
}`}
        </Example>
        <Callout variant="tip">
          After failed COPY, query{' '}
          <span className="font-mono text-sm">SELECT * FROM stl_load_errors ORDER BY starttime DESC LIMIT 20;</span>{' '}
          — column mismatch and IAM Access Denied are the top two DE tickets.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'File sizing: ~1–125 MB compressed files — enough parallelism for all compute slices.',
          'MANIFEST: explicit file list when prefix is mixed or batch-scoped — standard in validated pipelines.',
          'COPY options: COMPUPDATE OFF + STATUPDATE ON for nightly Parquet; MAXERROR in staging only.',
          'IAM role attached to cluster/namespace — GetObject + KMS decrypt on curated prefix, least privilege.',
          'Staging → QA → merge to prod fact; check stl_load_errors on every new feed or role change.',
        ]}
      />
    </LessonArticle>
  )
}
