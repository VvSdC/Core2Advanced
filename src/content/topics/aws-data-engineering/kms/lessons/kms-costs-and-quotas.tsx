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

export function KmsCostsAndQuotas() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="The key is cheap — the requests are not always">
        A customer managed key costs about a dollar a month. Nobody notices that. What teams notice is a Spark
        job reading millions of small SSE-KMS objects that suddenly fails with{' '}
        <span className="font-mono text-sm">ThrottlingException</span>, or a KMS line item that jumped after a
        backfill. Both come from the same cause: one KMS request per object. This lesson shows how to predict and
        shrink that number.
      </Callout>

      <Definition term="KMS request quota">
        <p>
          A per-account, per-Region limit on how many KMS API calls per second you can make. Symmetric cryptographic
          operations — Encrypt, Decrypt, GenerateDataKey, ReEncrypt, and a few others — share{' '}
          <strong className="text-white">one pooled quota</strong> across all keys in the account and Region.
          Requests beyond it are rejected with ThrottlingException for the rest of that second. The quota is
          adjustable through Service Quotas.
        </p>
      </Definition>

      <LessonSection title="Pricing model">
        <ContentStep number={1} title="Two dimensions: keys and requests">
          <p className="text-slate-300">
            Customer managed keys are billed per key per month (currently about $1, prorated hourly), plus an extra
            charge for the first two rotations of retained key material. Requests are billed per 10,000 calls —
            roughly $0.03 for symmetric operations in most Regions, with a small monthly free tier. AWS managed keys
            have no monthly fee, but their requests are still billed. Always check the current KMS pricing page
            before quoting numbers.
          </p>
        </ContentStep>
        <ContentStep number={2} title="What generates requests in a lake">
          <p className="text-slate-300">
            Without Bucket Keys, every S3 PUT under SSE-KMS calls GenerateDataKey and every GET calls Decrypt. Glue
            and EMR tasks listing and reading small files, Athena scans, and Redshift COPY all multiply this. Secrets
            Manager and SQS with CMKs add their own calls — SQS mitigates with a data key reuse period.
          </p>
        </ContentStep>
        <Example title="Worked cost example" caption="Illustrative numbers — confirm current pricing">
{`Daily Spark workload on acme-lake-prod (no Bucket Keys):
  reads:  2,000,000 objects/day  -> 2,000,000 Decrypt
  writes:   500,000 objects/day  ->   500,000 GenerateDataKey
  monthly requests = 2,500,000 x 30 = 75,000,000
  request cost    = 75,000,000 / 10,000 x $0.03 = $225 / month

Same workload with S3 Bucket Keys (up to ~99% fewer calls):
  monthly requests ~ 750,000
  request cost     ~ $2.25 / month

Keys: alias/de-lake-prod + alias/de-pii-prod + 3 others
  5 keys x $1 = $5 / month (+ up to $2 per key after two rotations)`}
        </Example>
      </LessonSection>

      <LessonSection title="Quotas and throttling in big jobs">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Region group</th>
                <th className="px-4 py-3">Default symmetric crypto quota (shared)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['us-east-1, us-west-2, eu-west-1', 'About 100,000 requests per second'],
                ['Several large Regions (e.g. us-east-2, eu-central-1, ap-northeast-1)', 'About 20,000 requests per second'],
                ['Most other Regions', 'About 10,000 requests per second'],
              ].map(([region, quota]) => (
                <tr key={region} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{region}</td>
                  <td className="px-4 py-3">{quota}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="info">
          These defaults have been raised over time and vary by Region — treat the table as orders of magnitude and
          check the Service Quotas console for your account&apos;s actual values.
        </Callout>
        <ContentStep number={1} title="How a Spark job hits the ceiling">
          <p className="text-slate-300">
            A Glue job with 400 concurrent tasks, each opening 30 small files per second, makes 12,000 Decrypt calls
            per second — above a 10,000 quota before any other workload in the account runs. Throttled reads surface
            as S3 errors or task retries, so look for <span className="font-mono text-sm">ThrottlingException</span>{' '}
            from <span className="font-mono text-sm">kms.amazonaws.com</span> in CloudTrail.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Shared quota means noisy neighbours">
          <p className="text-slate-300">
            The pool is shared by every key, service, and team in the account and Region. A backfill in one pipeline
            can throttle Secrets Manager lookups or Lambda decrypts elsewhere — another reason to separate
            production data workloads into their own accounts.
          </p>
        </ContentStep>
        <Flowchart
          title="Reducing KMS request pressure"
          chart={`flowchart TB
  HIGH[High KMS request rate]
  BK[Enable S3 Bucket Keys]
  COMP[Compact small files]
  CACHE[Data key caching in Encryption SDK]
  RETRY[Exponential backoff with jitter]
  QUOTA[Request quota increase]
  HIGH --> BK
  HIGH --> COMP
  HIGH --> CACHE
  HIGH --> RETRY
  HIGH --> QUOTA`}
        />
      </LessonSection>

      <LessonSection title="Levers and monitoring">
        <ContentStep number={1} title="S3 Bucket Keys first">
          <p className="text-slate-300">
            The biggest lever for S3-based lakes. Enable on the bucket default encryption and re-copy hot prefixes so
            existing objects benefit. Remember the encryption context changes to the bucket ARN.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Fewer, larger files">
          <p className="text-slate-300">
            Compaction to 128–512 MB Parquet files helps Spark performance and cuts KMS calls proportionally. A
            nightly compaction job on <span className="font-mono text-sm">silver/orders/</span> often saves more than
            any quota increase.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Data key caching for custom encryption">
          <p className="text-slate-300">
            When your own code encrypts records with the AWS Encryption SDK, caching reuses a data key for a bounded
            number of messages or seconds instead of calling KMS every time. Set conservative limits — caching trades
            some isolation for fewer calls.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Watch usage metrics">
          <p className="text-slate-300">
            KMS publishes API call counts to the <span className="font-mono text-sm">AWS/Usage</span> CloudWatch
            namespace. Create an alarm at around 80% of the quota using Service Quotas utilization, and review Cost
            Explorer filtered to KMS after large backfills.
          </p>
        </ContentStep>
        <Callout variant="tip">
          Before a big backfill, estimate objects touched per second and compare with your Region quota. If it is
          close, enable Bucket Keys or request an increase days in advance.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'KMS charges per key per month and per 10,000 requests — request volume dominates for busy lakes.',
          'Symmetric cryptographic calls share one per-account, per-Region quota that varies by Region and is adjustable.',
          'Spark jobs reading millions of small SSE-KMS objects are the classic source of ThrottlingException.',
          'S3 Bucket Keys (up to ~99% fewer calls), file compaction, and data key caching are the main levers.',
          'Monitor AWS/Usage metrics and Service Quotas utilization; estimate request rates before large backfills.',
        ]}
      />
    </LessonArticle>
  )
}
