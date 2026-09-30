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

export function AuditingDataAccess() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="&quot;Who read the customer PII last quarter?&quot;">
        Privacy officers, auditors, and incident responders all eventually ask this, and management events alone
        cannot answer it. Data access on a lake is spread across layers: S3 objects, Glue Catalog lookups, Lake
        Formation credential vending, Athena queries, Redshift sessions, RDS connections. Each layer has its own
        audit source — and not all of them are CloudTrail. This lesson maps them so you can build one report.
      </Callout>

      <Definition term="Data access audit trail">
        <p>
          The combined record of <strong className="text-white">who read or changed which data, when, and
          how</strong>. On AWS it is assembled from CloudTrail data events (S3 object reads and writes),
          CloudTrail management events (Glue, Lake Formation, Athena API calls), and engine-native logs (Redshift
          audit logs, RDS audit logs or Database Activity Streams) that capture SQL-level activity CloudTrail does
          not see.
        </p>
      </Definition>

      <LessonSection title="S3: data events on sensitive prefixes">
        <ContentStep number={1} title="Log only what is sensitive">
          <p className="text-slate-300">
            Logging every S3 data event on a busy lake is expensive — billions of <code className="text-core-400">GetObject</code>{' '}
            calls from Spark jobs. Advanced event selectors let <code className="text-core-400">org-trail-prod</code>{' '}
            (or a dedicated data-events trail) capture reads only under{' '}
            <code className="text-core-400">acme-lake-prod/gold/pii/</code> and writes to the whole gold zone.
          </p>
        </ContentStep>
        <Example title="Advanced event selectors" caption="Management events plus targeted S3 data events">
{`aws cloudtrail put-event-selectors --trail-name org-trail-prod \\
  --advanced-event-selectors '[
    { "Name": "All management events",
      "FieldSelectors": [ { "Field": "eventCategory", "Equals": ["Management"] } ] },
    { "Name": "Reads of PII objects",
      "FieldSelectors": [
        { "Field": "eventCategory", "Equals": ["Data"] },
        { "Field": "resources.type", "Equals": ["AWS::S3::Object"] },
        { "Field": "readOnly", "Equals": ["true"] },
        { "Field": "resources.ARN", "StartsWith": ["arn:aws:s3:::acme-lake-prod/gold/pii/"] } ] },
    { "Name": "Writes and deletes in gold",
      "FieldSelectors": [
        { "Field": "eventCategory", "Equals": ["Data"] },
        { "Field": "resources.type", "Equals": ["AWS::S3::Object"] },
        { "Field": "readOnly", "Equals": ["false"] },
        { "Field": "resources.ARN", "StartsWith": ["arn:aws:s3:::acme-lake-prod/gold/"] } ] }
  ]'`}
        </Example>
        <ContentStep number={2} title="S3 server access logs as a cheaper complement">
          <p className="text-slate-300">
            Server access logs record requests to a bucket at no charge beyond storage, delivered best effort and
            with less identity detail than CloudTrail. Many teams enable them on the whole lake bucket for broad
            coverage and reserve CloudTrail data events for PII prefixes where they need reliable, fully
            attributed records.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Catalog, Lake Formation, and Athena">
        <ContentStep number={1} title="Glue Data Catalog">
          <p className="text-slate-300">
            <code className="text-core-400">GetTable</code>, <code className="text-core-400">GetPartitions</code>,{' '}
            <code className="text-core-400">UpdateTable</code>, and <code className="text-core-400">DeleteTable</code>{' '}
            are management events from <code className="text-core-400">glue.amazonaws.com</code>. Reads show
            which principals looked up <code className="text-core-400">gold.customers</code> metadata — a useful
            signal, but metadata access is not proof of data access.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Lake Formation GetDataAccess">
          <p className="text-slate-300">
            When Athena, Glue, Redshift Spectrum, or EMR read an LF-governed table, Lake Formation vends temporary
            credentials and records a <code className="text-core-400">GetDataAccess</code> event naming the table
            and the principal the access was on behalf of. This is the best single signal for &quot;who queried
            this governed table&quot;, and it works even though the S3 reads use LF-vended credentials.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Athena StartQueryExecution">
          <p className="text-slate-300">
            Athena API calls are management events, and <code className="text-core-400">StartQueryExecution</code>{' '}
            includes the SQL text in <code className="text-core-400">requestParameters.queryString</code> plus the
            workgroup. You can literally search for queries that selected{' '}
            <code className="text-core-400">ssn</code> or <code className="text-core-400">email</code> columns.
          </p>
        </ContentStep>
        <Example title="Queries touching the customers table" caption="From the security.cloudtrail_org table">
{`SELECT eventtime,
       useridentity.arn AS who,
       json_extract_scalar(requestparameters, '$.workGroup')   AS workgroup,
       json_extract_scalar(requestparameters, '$.queryString') AS sql_text
FROM security.cloudtrail_org
WHERE dt BETWEEN '2026/07/01' AND '2026/09/30'
  AND eventsource = 'athena.amazonaws.com'
  AND eventname = 'StartQueryExecution'
  AND lower(json_extract_scalar(requestparameters, '$.queryString')) LIKE '%gold.customers%'
ORDER BY eventtime;`}
        </Example>
      </LessonSection>

      <LessonSection title="Databases log SQL themselves — not in CloudTrail">
        <ContentStep number={1} title="Redshift audit logging">
          <p className="text-slate-300">
            CloudTrail records Redshift API calls such as <code className="text-core-400">CreateCluster</code> or
            Data API calls, not the SQL run inside a JDBC session. Redshift audit logging produces the connection
            log, user log, and user activity log (the last requires the{' '}
            <code className="text-core-400">enable_user_activity_logging</code> parameter), exported to S3 or
            CloudWatch Logs. System tables such as <code className="text-core-400">SYS_QUERY_HISTORY</code> help
            too but have limited retention.
          </p>
        </ContentStep>
        <ContentStep number={2} title="RDS and Aurora">
          <p className="text-slate-300">
            Use engine audit features — pgaudit for PostgreSQL, the MariaDB audit plugin for MySQL — published to
            CloudWatch Logs, or Database Activity Streams for supported engines, which push a near-real-time
            activity stream to Kinesis, encrypted with KMS and separated from DBA control.
          </p>
        </ContentStep>
        <Flowchart
          title="Building a who read PII report"
          chart={`flowchart TB
  S3DE[S3 data events on gold pii]
  LF[Lake Formation GetDataAccess]
  ATH[Athena StartQueryExecution]
  RS[Redshift user activity log]
  RDS[RDS audit logs]
  LAKE[(Audit tables in security account)]
  RPT[Who read PII report]
  S3DE --> LAKE
  LF --> LAKE
  ATH --> LAKE
  RS --> LAKE
  RDS --> LAKE
  LAKE --> RPT`}
        />
        <Callout variant="tip">
          Normalize every source into one schema — <code className="text-core-400">event_time</code>,{' '}
          <code className="text-core-400">principal</code>, <code className="text-core-400">dataset</code>,{' '}
          <code className="text-core-400">action</code>, <code className="text-core-400">source_system</code> — with a
          scheduled Glue job. The quarterly PII access report then becomes one Athena query instead of five
          investigations.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Use advanced event selectors to log S3 data events only on sensitive prefixes such as gold/pii.',
          'S3 server access logs are a cheap, best-effort complement for broad bucket coverage.',
          'Glue Catalog, Lake Formation GetDataAccess, and Athena StartQueryExecution (with queryString) are CloudTrail events.',
          'Redshift SQL activity lives in audit logs to S3 or CloudWatch; RDS uses engine audit logs or Database Activity Streams.',
          'Normalize all sources into one audit schema to answer who read PII with a single query.',
        ]}
      />
    </LessonArticle>
  )
}
