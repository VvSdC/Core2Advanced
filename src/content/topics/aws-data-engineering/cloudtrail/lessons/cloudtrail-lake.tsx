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

export function CloudtrailLake() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="What if AWS ran the audit lake for you?">
        The previous lesson built a do-it-yourself audit lake: trail, bucket, Glue table, Athena workgroup.{' '}
        <strong className="text-white">CloudTrail Lake</strong> is the managed alternative — events go straight
        into an immutable, SQL-queryable store with retention built in. Worth knowing both, because you will meet
        each in real accounts and interviews, and because AWS has recently changed who can adopt Lake.
      </Callout>

      <Definition term="Event data store">
        <p>
          The CloudTrail Lake storage unit: an immutable collection of events (CloudTrail management and data
          events, and optionally AWS Config configuration items, Audit Manager evidence, or events from outside
          AWS) selected by advanced event selectors. CloudTrail converts events to columnar ORC internally and you
          query them with SQL in the console or API. An <strong className="text-white">organization event data
          store</strong> ingests from every member account, similar to an org trail.
        </p>
      </Definition>

      <Callout variant="info" title="Availability change — verify before designing around Lake">
        AWS closed CloudTrail Lake to new customers starting May 31, 2026. Existing customers can keep using it,
        but it now receives only critical bug fixes and security updates, and AWS points new adopters toward
        CloudTrail ingestion into Amazon CloudWatch for similar capabilities. Trails, Insights, and the S3 plus
        Athena pattern are unaffected. Check the current CloudTrail documentation before committing to Lake.
      </Callout>

      <LessonSection title="How CloudTrail Lake works">
        <ContentStep number={1} title="Pricing options and retention">
          <p className="text-slate-300">
            At the time of writing there are two billing modes. <strong className="text-white">One-year extendable
            retention</strong> (the default) prices ingestion by event type, includes the first 366 days of
            storage, and allows retention up to about 10 years at pay-as-you-go storage cost after year one.{' '}
            <strong className="text-white">Seven-year retention</strong> prices ingestion by volume, includes storage
            for up to 7 years, and AWS recommends it above roughly 25 TB ingested per month. Queries are billed per
            compressed data scanned. Confirm current rates on the CloudTrail pricing page.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Ingesting from the organization">
          <p className="text-slate-300">
            Create an organization event data store from the management or delegated admin account so new member
            accounts are included automatically. Use advanced event selectors to keep only what matters — for
            example management events plus S3 data events on{' '}
            <code className="text-core-400">acme-lake-prod/gold/</code>. You can also copy historical trail
            events from S3 into a store; the uncompressed size is roughly 10x the gzipped S3 size, which drives cost.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Federation to Athena and Lake Formation">
          <p className="text-slate-300">
            Lake query federation registers an event data store in the Glue Data Catalog, governed by Lake
            Formation, so analysts can query it from Athena and join it with other tables — for example joining
            Glue <code className="text-core-400">DeleteTable</code> events with your dataset ownership table.
          </p>
        </ContentStep>
        <Example title="CloudTrail Lake SQL" caption="FROM clause uses the event data store ID; always bound eventTime">
{`SELECT eventTime,
       userIdentity.arn AS caller,
       sourceIPAddress,
       element_at(requestParameters, 'databaseName') AS db,
       element_at(requestParameters, 'name')         AS table_name
FROM a1b2c3d4-5678-90ab-cdef-EXAMPLE11111
WHERE eventTime >= '2026-09-23 00:00:00'
  AND eventTime <  '2026-10-01 00:00:00'
  AND eventSource = 'glue.amazonaws.com'
  AND eventName IN ('DeleteTable', 'BatchDeleteTable')
ORDER BY eventTime DESC`}
        </Example>
        <Flowchart
          title="CloudTrail Lake data flow"
          chart={`flowchart LR
  ORG[All member accounts]
  EDS[(Org event data store)]
  SQL[Lake SQL console or API]
  FED[Glue Catalog federation]
  ATH[Athena joins]
  ORG --> EDS
  EDS --> SQL
  EDS --> FED
  FED --> ATH`}
        />
      </LessonSection>

      <LessonSection title="Lake vs S3 trail plus Athena">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Dimension</th>
                <th className="px-4 py-3">CloudTrail Lake</th>
                <th className="px-4 py-3">S3 trail plus Athena DIY</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Setup', 'Create event data store; query immediately', 'Bucket, policies, KMS, Glue table, projection, workgroup'],
                ['Immutability', 'Managed, immutable store', 'You build it: Object Lock, digests, separate account'],
                ['Retention', 'Up to 7 or about 10 years depending on billing mode', 'Anything — S3 lifecycle to Glacier tiers'],
                ['Cost model', 'Per GB ingested plus storage beyond included period plus scans', 'Trail delivery plus S3 storage plus Athena per TB scanned'],
                ['Flexibility', 'Lake SQL dialect; federation for joins', 'Full Athena, Spark, Glue, Parquet compaction, any tool'],
                ['Non-AWS sources', 'Built-in integrations', 'Your own ingestion into the lake'],
                ['Availability', 'Closed to new customers since May 31, 2026', 'Generally available'],
              ].map(([dim, lake, diy]) => (
                <tr key={dim} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{dim}</td>
                  <td className="px-4 py-3">{lake}</td>
                  <td className="px-4 py-3">{diy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="When each fits">
        <ContentStep number={1} title="Lake fits when">
          <p className="text-slate-300">
            You are an existing Lake customer, the security team wants SQL over audit events with no pipeline to
            maintain, and fixed multi-year immutable retention satisfies compliance with little engineering effort.
          </p>
        </ContentStep>
        <ContentStep number={2} title="S3 plus Athena fits when">
          <p className="text-slate-300">
            You already run a lake (you do), you need very long or tiered retention, you want to join audit events
            with pipeline metadata in Spark or Athena freely, or you are a new customer who cannot enable Lake. Most
            data platforms keep the org trail to S3 regardless — it is the durable system of record.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Migration path">
          <p className="text-slate-300">
            AWS documents exporting Lake event data to CloudWatch and enabling direct CloudTrail ingestion there.
            If you inherit a Lake setup, keep the org trail to S3 running so history is never locked to one query
            engine.
          </p>
        </ContentStep>
        <Callout variant="insight">
          Whatever the query layer, the trail to a locked S3 bucket is the foundation. Lake, CloudWatch, and Athena
          are views over audit data; the archive bucket is the evidence.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'CloudTrail Lake event data stores are managed, immutable, SQL-queryable collections of audit events.',
          'Two billing modes: one-year extendable (default, up to about 10 years) and seven-year fixed retention — verify current pricing.',
          'Organization event data stores cover all member accounts; federation exposes stores to Athena via Glue and Lake Formation.',
          'Lake closed to new customers on May 31, 2026; AWS suggests CloudWatch for similar needs.',
          'S3 trail plus Athena remains the flexible, lake-native default and the durable evidence store.',
        ]}
      />
    </LessonArticle>
  )
}
