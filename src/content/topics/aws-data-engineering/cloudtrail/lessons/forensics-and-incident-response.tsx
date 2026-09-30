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

export function ForensicsAndIncidentResponse() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Scenario: a leaked access key and a copied gold bucket">
        Friday 18:40. GuardDuty raises an S3 exfiltration finding and the S3 request bill has spiked. A
        contractor&apos;s notebook pushed <code className="text-core-400">AKIAIOSFODNN7EXAMPLE</code> — the access
        key of IAM user <code className="text-core-400">svc-legacy-export</code> — to a public repository. Your job
        as the data engineer on the incident bridge: reconstruct exactly what happened from CloudTrail, help
        contain it, and preserve evidence.
      </Callout>

      <Definition term="Incident timeline reconstruction">
        <p>
          Building an ordered, evidence-backed sequence of every action an attacker took — first use of the
          credential, discovery calls, privilege changes, role assumptions, data access, and persistence — from
          CloudTrail management and data events, keyed on identifiers such as{' '}
          <code className="text-core-400">userIdentity.accessKeyId</code>,{' '}
          <code className="text-core-400">sourceIPAddress</code>, and the{' '}
          <code className="text-core-400">sessionIssuer</code> of assumed roles.
        </p>
      </Definition>

      <LessonSection title="Reconstruct the timeline">
        <ContentStep number={1} title="Everything the leaked key did">
          <p className="text-slate-300">
            Start with the key ID across all accounts and Regions. Note the first event time, the source IPs that
            are not your office or NAT ranges, and the user agents — attacker tooling rarely looks like your Glue
            jobs.
          </p>
        </ContentStep>
        <Example title="All events for the access key" caption="Widen dt if first use predates the leak">
{`SELECT eventtime, awsregion, eventsource, eventname, errorcode,
       sourceipaddress, useragent,
       json_extract_scalar(responseelements, '$.credentials.accessKeyId') AS issued_key
FROM security.cloudtrail_org
WHERE dt >= '2026/09/20'
  AND useridentity.accesskeyid = 'AKIAIOSFODNN7EXAMPLE'
ORDER BY eventtime;`}
        </Example>
        <ContentStep number={2} title="Follow the AssumeRole chain">
          <p className="text-slate-300">
            Attackers pivot: the user calls <code className="text-core-400">sts:AssumeRole</code> into{' '}
            <code className="text-core-400">de-gold-reader</code>, receiving a temporary{' '}
            <code className="text-core-400">ASIA...</code> key. Actions under that role no longer show the original
            key — find them by the <code className="text-core-400">issued_key</code> from the AssumeRole response,
            or by the role session&apos;s <code className="text-core-400">sessionIssuer.arn</code> plus the attacker
            IPs.
          </p>
        </ContentStep>
        <Example title="Actions taken with the assumed role from attacker IPs" caption="Repeat for each hop in the chain">
{`SELECT eventtime, eventname, useridentity.accesskeyid AS temp_key,
       json_extract_scalar(requestparameters, '$.bucketName') AS bucket
FROM security.cloudtrail_org
WHERE dt >= '2026/09/20'
  AND useridentity.sessioncontext.sessionissuer.arn =
      'arn:aws:iam::111122223333:role/de-gold-reader'
  AND sourceipaddress IN ('203.0.113.45', '198.51.100.7')
ORDER BY eventtime;`}
        </Example>
        <ContentStep number={3} title="Size the data access">
          <p className="text-slate-300">
            If S3 data events were enabled on the gold zone, count <code className="text-core-400">GetObject</code>{' '}
            calls and sum bytes transferred per prefix. This is the number legal and privacy teams need. Without
            data events, fall back to S3 server access logs and CloudWatch request metrics — and write the gap
            into the post-incident report.
          </p>
        </ContentStep>
        <Example title="Objects read from the gold bucket" caption="bytesTransferredOut lives in additionaleventdata">
{`SELECT regexp_extract(json_extract_scalar(requestparameters, '$.key'), '^([^/]+/[^/]+)/') AS prefix,
       count(*) AS get_calls,
       sum(CAST(json_extract_scalar(additionaleventdata, '$.bytesTransferredOut') AS bigint)) AS bytes_out
FROM security.cloudtrail_org
WHERE dt BETWEEN '2026/09/25' AND '2026/09/26'
  AND eventsource = 's3.amazonaws.com'
  AND eventname = 'GetObject'
  AND json_extract_scalar(requestparameters, '$.bucketName') = 'acme-lake-prod'
  AND sourceipaddress IN ('203.0.113.45', '198.51.100.7')
GROUP BY 1
ORDER BY bytes_out DESC;`}
        </Example>
      </LessonSection>

      <LessonSection title="Contain, preserve, and fix">
        <ContentStep number={1} title="Containment">
          <p className="text-slate-300">
            Deactivate (do not delete yet) the access key with{' '}
            <code className="text-core-400">aws iam update-access-key --status Inactive</code>. Temporary
            credentials already issued stay valid until expiry, so use &quot;Revoke active sessions&quot; on{' '}
            <code className="text-core-400">de-gold-reader</code>, which adds a deny for tokens issued before now
            via <code className="text-core-400">aws:TokenIssueTime</code>. Look for persistence the attacker created
            — new IAM users, access keys, roles with external trust — and remove it. Rotate any secrets the
            identity could read in Secrets Manager.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Preserve evidence">
          <p className="text-slate-300">
            Run <code className="text-core-400">aws cloudtrail validate-logs</code> across the incident window and
            save the output. Export relevant query results to a locked evidence prefix. Object Lock on the archive
            bucket means the raw logs cannot be altered while legal decides on retention.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Post-incident fixes">
          <p className="text-slate-300">
            Replace long-lived IAM user keys with roles, add SCPs and data perimeter conditions (for example{' '}
            <code className="text-core-400">aws:SourceVpce</code> on the gold bucket policy), extend data events to
            all gold prefixes, and add EventBridge alerts for access-key creation. Record time-to-detect and
            time-to-contain.
          </p>
        </ContentStep>
        <Flowchart
          title="CloudTrail incident runbook"
          chart={`flowchart TB
  DET[GuardDuty finding or alert]
  KEY[Identify access key ID]
  ALL[Query all events for key]
  CHAIN[Follow AssumeRole chain]
  DATA[Count GetObject data events]
  CON[Deactivate key and revoke sessions]
  EVD[Validate logs and preserve evidence]
  FIX[Post incident fixes]
  DET --> KEY
  KEY --> ALL
  ALL --> CHAIN
  CHAIN --> DATA
  ALL --> CON
  DATA --> EVD
  CON --> EVD
  EVD --> FIX`}
        />
      </LessonSection>

      <LessonSection title="Where GuardDuty fits">
        <p className="text-slate-300">
          Amazon GuardDuty continuously analyzes CloudTrail management events, S3 data events (with S3 Protection),
          VPC Flow Logs, and DNS logs using threat intelligence and anomaly models — you do not need your own trail
          for it to work. It detects; CloudTrail explains. The finding tells you something is wrong with{' '}
          <code className="text-core-400">svc-legacy-export</code>; the Athena queries above tell you exactly what
          it did.
        </p>
        <Callout variant="insight">
          Rehearse this runbook before you need it: keep the queries saved in the security-audit workgroup, confirm
          the incident role can decrypt the trail key, and run a game day with a deliberately leaked sandbox key.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Start from the leaked access key ID and pull every event across accounts, Regions, IPs, and user agents.',
          'Follow AssumeRole chains via issued temporary keys and sessionIssuer — actions under roles hide the original key.',
          'S3 GetObject data events size the exfiltration; without them you have a documented gap.',
          'Contain by deactivating the key, revoking role sessions with aws:TokenIssueTime, removing persistence, rotating secrets.',
          'Validate logs to preserve evidence; GuardDuty detects, CloudTrail reconstructs.',
        ]}
      />
    </LessonArticle>
  )
}
