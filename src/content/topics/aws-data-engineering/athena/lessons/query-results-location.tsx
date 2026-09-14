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

export function QueryResultsLocation() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Athena always writes output somewhere">
        Unlike a desktop SQL client that shows rows only on screen, Athena persists every query&apos;s
        output to <strong className="text-white">Amazon S3</strong>. You must configure a{' '}
        <strong className="text-white">query result location</strong> — an S3 path — before queries succeed.
        Think of it as the scratch folder where Athena saves CSV (or other format) result files, metadata,
        and manifest pointers your Console download button uses.
      </Callout>

      <Definition term="Query result location">
        <p>
          The <strong className="text-white">query result location</strong> is an S3 URI prefix — e.g.{' '}
          <code className="text-core-400">s3://acme-athena-results/</code> or{' '}
          <code className="text-core-400">s3://acme-athena-results/workgroup-analytics/</code> — where Athena
          writes output for each <code className="text-core-400">StartQueryExecution</code>. It is configured
          at the account level (Settings → Manage), per <strong className="text-white">workgroup</strong>, or
          overridden per query via API. Without a writable location, Athena returns an error immediately.
        </p>
      </Definition>

      <LessonSection title="Where Athena writes query results">
        <p className="text-slate-300">
          When a query succeeds, Athena creates a folder under your results prefix keyed by query execution
          ID. Files typically include <code className="text-core-400">.csv</code> result data (Console
          default), a <code className="text-core-400">.metadata</code> file, and sometimes manifest files for
          large outputs. The Console results grid reads from these objects — they are not stored only in
          your browser session.
        </p>
        <ContentStep number={1} title="Account default location">
          <p className="text-slate-300">
            Athena → Settings → Manage → Query result location and encryption. Set once for sandbox accounts
            where a single team shares one scratch bucket. Fastest path for your first{' '}
            <code className="text-core-400">SELECT</code>.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Workgroup override">
          <p className="text-slate-300">
            Production teams create workgroups per domain —{' '}
            <code className="text-core-400">analytics-wg</code>,{' '}
            <code className="text-core-400">data-eng-wg</code> — each with its own results prefix, encryption
            key, and CloudWatch logging. Analysts pick workgroup in the editor; API callers pass{' '}
            <code className="text-core-400">WorkGroup</code> parameter.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Per-query override (API)">
          <p className="text-slate-300">
            <code className="text-core-400">ResultConfiguration.OutputLocation</code> in{' '}
            <code className="text-core-400">StartQueryExecution</code> can point at a one-off prefix — useful
            for Lambda-generated reports landing next to downstream consumers.
          </p>
        </ContentStep>
        <Flowchart
          title="Query output path"
          chart={`flowchart LR
  SQL[Athena SQL execution]
  SQL --> ENG[Engine completes scan]
  ENG --> WRITE[Write results to S3 prefix]
  WRITE --> F1[query-id.csv]
  WRITE --> F2[query-id.csv.metadata]
  F2 --> UI[Console shows result grid]
  F1 --> DL[User downloads or BI tool reads]`}
        />
      </LessonSection>

      <LessonSection title="Why you must set an S3 output location">
        <ContentStep number={1} title="Distributed engine design">
          <p className="text-slate-300">
            Athena workers write partial results in parallel to S3 — a durable, shared store — then assemble
            the final output. There is no single server holding your million-row result set in RAM for the
            Console to peek at. S3 is the exchange buffer by architecture, not an optional export.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Large results exceed UI limits">
          <p className="text-slate-300">
            The Console previews a subset; full results always live in S3. BI tools, Lambda, and Step
            Functions read the S3 output path programmatically — especially for CTAS and INSERT jobs that
            materialize lake tables rather than human browsing.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Audit and re-fetch">
          <p className="text-slate-300">
            Query history stores execution ID linked to result location. Re-download weeks later without
            re-running SQL — if lifecycle has not expired the objects yet. Teams tune retention accordingly.
          </p>
        </ContentStep>
        <Callout variant="tip" title="Dedicated bucket or prefix">
          Use <code className="text-core-400">s3://acme-athena-results/</code> — not{' '}
          <code className="text-core-400">s3://acme-lake-dev/curated/</code>. Mixing scratch output with
          curated data complicates IAM (analysts need write on results), lifecycle (expire scratch in 7
          days, keep curated for years), and accidental data quality incidents.
        </Callout>
      </LessonSection>

      <LessonSection title="IAM and encryption requirements">
        <ContentStep number={1} title="Permissions on results prefix">
          <p className="text-slate-300">
            Caller needs <code className="text-core-400">s3:PutObject</code>,{' '}
            <code className="text-core-400">s3:GetObject</code>,{' '}
            <code className="text-core-400">s3:ListBucket</code> on the results bucket/prefix. Athena also
            needs <code className="text-core-400">s3:GetBucketLocation</code>. Missing PutObject is the #1
            IAM error after unset location.
          </p>
        </ContentStep>
        <ContentStep number={2} title="SSE-S3 or SSE-KMS">
          <p className="text-slate-300">
            Enable default encryption on the results bucket. Workgroups can enforce KMS CMK — match key
            policies so Athena service can encrypt output. Same hygiene as lake buckets from S3 security
            lessons.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Block Public Access">
          <p className="text-slate-300">
            Results may contain PII from production queries — keep buckets private, no public ACLs. Query
            output leakage is a common compliance finding when teams reuse overly permissive dev buckets.
          </p>
        </ContentStep>
        <Example title="Minimal IAM pattern sketch" caption="Analyst workgroup user">
{`Allow s3:PutObject, s3:GetObject on arn:aws:s3:::acme-athena-results/analytics/*
Allow s3:ListBucket on arn:aws:s3:::acme-athena-results with prefix analytics/*
Allow athena:StartQueryExecution on workgroup analytics-wg
Allow glue:Get* on catalog for table metadata`}
        </Example>
      </LessonSection>

      <LessonSection title="Lifecycle and cost hygiene">
        <ContentStep number={1} title="Expire scratch results">
          <p className="text-slate-300">
            S3 lifecycle rule: delete objects under{' '}
            <code className="text-core-400">athena-results/</code> after 7–30 days. Analysts re-run SQL if
            needed; you avoid paying storage for forgotten one-off exports forever.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Per-user or per-workgroup prefixes">
          <p className="text-slate-300">
            Layout like <code className="text-core-400">s3://acme-athena-results/wg-analytics/</code> and{' '}
            <code className="text-core-400">.../wg-data-eng/</code> simplifies IAM conditions and chargeback
            reports — which team generated how much scratch storage.
          </p>
        </ContentStep>
        <ContentStep number={3} title="CTAS output is different">
          <p className="text-slate-300">
            <code className="text-core-400">CREATE TABLE AS SELECT</code> writes durable curated data to the
            table&apos;s <code className="text-core-400">LOCATION</code>, not your scratch results prefix —
            but the query still produces temporary manifest entries. Do not confuse CTAS table locations
            with query result settings.
          </p>
        </ContentStep>
        <Callout variant="insight">
          Setting result location on day one is not bureaucracy — it is the same pattern as specifying
          Spark shuffle dirs or Redshift UNLOAD paths: every distributed SQL engine needs a known writable
          output place. Athena just makes that requirement visible upfront.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Every Athena query writes output files to S3 — configure query result location before the first run.',
          'Set at account default, workgroup, or per API call; use a dedicated scratch bucket/prefix separate from curated data.',
          'IAM must allow PutObject/GetObject on results path; encrypt and block public access — output may contain sensitive rows.',
          'Apply lifecycle expiration on scratch results; CTAS table LOCATION is separate from query result settings.',
        ]}
      />
    </LessonArticle>
  )
}
