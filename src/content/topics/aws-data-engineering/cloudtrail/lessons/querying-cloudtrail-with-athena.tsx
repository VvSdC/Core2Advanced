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

export function QueryingCloudtrailWithAthena() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Your audit logs are already a data lake — query them like one">
        The org trail drops gzipped JSON into <code className="text-core-400">acme-cloudtrail-logs-archive</code>{' '}
        every few minutes. That is exactly the shape you have been querying all course: files in S3, a Glue
        table on top, SQL in Athena. Once the table exists, &quot;who deleted{' '}
        <code className="text-core-400">silver.orders</code>?&quot; becomes a ten-second query instead of an
        afternoon of clicking through Event history.
      </Callout>

      <Definition term="CloudTrail table with partition projection">
        <p>
          An Athena external table that reads CloudTrail log files using the CloudTrail input format (records are
          wrapped in a top-level <code className="text-core-400">Records</code> array) and a JSON SerDe, with{' '}
          <strong className="text-white">partition projection</strong> computing account, Region, and date
          partitions from table properties — no crawler and no <code className="text-core-400">MSCK REPAIR</code>{' '}
          as new days arrive.
        </p>
      </Definition>

      <LessonSection title="Create the table">
        <ContentStep number={1} title="Point at the org trail prefix">
          <p className="text-slate-300">
            Create the table in the security account (or wherever the security Athena workgroup lives) with
            cross-account read on the archive bucket and decrypt on the trail key. Project three partitions that
            mirror the key layout: <code className="text-core-400">account</code>,{' '}
            <code className="text-core-400">region</code>, and <code className="text-core-400">dt</code>.
          </p>
        </ContentStep>
        <Example title="CloudTrail table DDL" caption="Trimmed column list — the AWS docs table has every field">
{`CREATE EXTERNAL TABLE security.cloudtrail_org (
  eventversion STRING,
  useridentity STRUCT<
    type: STRING, principalid: STRING, arn: STRING, accountid: STRING,
    invokedby: STRING, accesskeyid: STRING, username: STRING,
    sessioncontext: STRUCT<
      attributes: STRUCT<mfaauthenticated: STRING, creationdate: STRING>,
      sessionissuer: STRUCT<type: STRING, principalid: STRING, arn: STRING,
                            accountid: STRING, username: STRING>>>,
  eventtime STRING,
  eventsource STRING,
  eventname STRING,
  awsregion STRING,
  sourceipaddress STRING,
  useragent STRING,
  errorcode STRING,
  errormessage STRING,
  requestparameters STRING,
  responseelements STRING,
  additionaleventdata STRING,
  requestid STRING,
  eventid STRING,
  readonly STRING,
  resources ARRAY<STRUCT<arn: STRING, accountid: STRING, type: STRING>>,
  eventtype STRING,
  recipientaccountid STRING,
  sharedeventid STRING,
  vpcendpointid STRING
)
PARTITIONED BY (account STRING, region STRING, dt STRING)
ROW FORMAT SERDE 'org.apache.hive.hcatalog.data.JsonSerDe'
STORED AS INPUTFORMAT 'com.amazon.emr.cloudtrail.CloudTrailInputFormat'
OUTPUTFORMAT 'org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat'
LOCATION 's3://acme-cloudtrail-logs-archive/AWSLogs/o-exampleorgid/'
TBLPROPERTIES (
  'projection.enabled' = 'true',
  'projection.account.type' = 'enum',
  'projection.account.values' = '111122223333,444455556666',
  'projection.region.type' = 'enum',
  'projection.region.values' = 'us-east-1,us-west-2,eu-west-1',
  'projection.dt.type' = 'date',
  'projection.dt.format' = 'yyyy/MM/dd',
  'projection.dt.range' = '2025/01/01,NOW',
  'projection.dt.interval' = '1',
  'projection.dt.interval.unit' = 'DAYS',
  'storage.location.template' =
    's3://acme-cloudtrail-logs-archive/AWSLogs/o-exampleorgid/\${account}/CloudTrail/\${region}/\${dt}'
);`}
        </Example>
        <Callout variant="info">
          Older tutorials use <code className="text-core-400">com.amazon.emr.hive.serde.CloudTrailSerde</code>;
          current AWS docs pair the CloudTrail input format with the Hive JSON SerDe. Either works — keep{' '}
          <code className="text-core-400">requestparameters</code> as a STRING and parse it with{' '}
          <code className="text-core-400">json_extract_scalar</code>, because its shape differs per API.
        </Callout>
      </LessonSection>

      <LessonSection title="Queries auditors actually ask">
        <ContentStep number={1} title="Who deleted a Glue table this week">
          <p className="text-slate-300">
            Glue Catalog calls are management events from <code className="text-core-400">glue.amazonaws.com</code>.
            The table name lives inside <code className="text-core-400">requestparameters</code>.
          </p>
        </ContentStep>
        <Example title="DeleteTable in the last 7 days" caption="Always filter on dt so projection prunes files">
{`SELECT eventtime,
       useridentity.arn AS caller,
       sourceipaddress,
       json_extract_scalar(requestparameters, '$.databaseName') AS db,
       json_extract_scalar(requestparameters, '$.name')         AS table_name
FROM security.cloudtrail_org
WHERE dt >= date_format(current_date - interval '7' day, '%Y/%m/%d')
  AND eventsource = 'glue.amazonaws.com'
  AND eventname IN ('DeleteTable', 'BatchDeleteTable')
ORDER BY eventtime DESC;`}
        </Example>
        <Example title="AccessDenied by principal and top APIs for a pipeline role" caption="Two everyday triage queries">
{`-- Who is hitting AccessDenied most (misconfigured jobs or probing)?
SELECT useridentity.arn, eventsource, eventname, count(*) AS denied
FROM security.cloudtrail_org
WHERE dt >= '2026/09/23' AND errorcode IN ('AccessDenied', 'Client.UnauthorizedOperation')
GROUP BY 1, 2, 3
ORDER BY denied DESC
LIMIT 25;

-- What does the Glue ETL role actually call? (input for least privilege)
SELECT eventsource, eventname, count(*) AS calls
FROM security.cloudtrail_org
WHERE dt >= '2026/09/01'
  AND useridentity.sessioncontext.sessionissuer.arn =
      'arn:aws:iam::111122223333:role/glue-etl-orders-prod'
GROUP BY 1, 2
ORDER BY calls DESC;`}
        </Example>
        <Example title="Everything one assumed-role session did" caption="Session name comes after the role in the assumed-role ARN">
{`SELECT eventtime, eventsource, eventname, errorcode,
       json_extract_scalar(requestparameters, '$.bucketName') AS bucket
FROM security.cloudtrail_org
WHERE dt = '2026/09/30'
  AND useridentity.arn =
      'arn:aws:sts::111122223333:assumed-role/de-analyst/priya@acme.com'
ORDER BY eventtime;`}
        </Example>
      </LessonSection>

      <LessonSection title="Keep it fast and cheap">
        <ContentStep number={1} title="Partition filters are mandatory">
          <p className="text-slate-300">
            A year of org-wide CloudTrail can be terabytes of gzipped JSON. Without a{' '}
            <code className="text-core-400">dt</code> (and ideally <code className="text-core-400">account</code>{' '}
            or <code className="text-core-400">region</code>) predicate, Athena scans everything at per-TB pricing.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Workgroup guardrails">
          <p className="text-slate-300">
            Run audit queries in a dedicated <code className="text-core-400">security-audit</code> workgroup with a
            per-query data-scanned limit, enforced result location, and encrypted results. For heavy recurring
            reports, a nightly Glue job can compact the last day into Parquet partitioned the same way.
          </p>
        </ContentStep>
        <Flowchart
          title="From API call to audit answer"
          chart={`flowchart LR
  API[API call in any account]
  TRAIL[org-trail-prod]
  S3[(acme-cloudtrail-logs-archive)]
  TBL[security.cloudtrail_org projected table]
  WG[security-audit workgroup]
  ANS[Audit answer]
  API --> TRAIL
  TRAIL --> S3
  S3 --> TBL
  TBL --> WG
  WG --> ANS`}
        />
      </LessonSection>

      <KeyTakeaways
        items={[
          'CloudTrail logs in S3 are a data lake: CloudTrail input format plus JSON SerDe, queried with Athena.',
          'Partition projection on account, region, and dt removes crawlers and MSCK REPAIR entirely.',
          'Parse requestparameters with json_extract_scalar — its fields differ per API such as DeleteTable or PutBucketPolicy.',
          'Classic queries: DeleteTable by caller, AccessDenied by principal, APIs used by a pipeline role, one session timeline.',
          'Always filter on dt and run in a workgroup with scan limits to keep audit queries cheap.',
        ]}
      />
    </LessonArticle>
  )
}
