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

export function ReadingACloudtrailEvent() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="The JSON looks scary — it is just five questions">
        A raw CloudTrail event is 40-plus lines of nested JSON, and most beginners skim past it. Do not. Once
        you know which six or seven fields matter, you can read an event in ten seconds and answer{' '}
        <strong className="text-white">who, what, when, where, and result</strong> — including the tricky
        case where the &quot;who&quot; is a role, not a person.
      </Callout>

      <Definition term="CloudTrail event record">
        <p>
          A <strong className="text-white">CloudTrail event record</strong> is one JSON object describing a
          single API call. Trails write many records into each log file under a top-level{' '}
          <code className="text-core-400">Records</code> array; event history and CloudTrail Lake show the
          same fields. The shape is consistent across services, while{' '}
          <code className="text-core-400">requestParameters</code> and{' '}
          <code className="text-core-400">responseElements</code> vary by API.
        </p>
      </Definition>

      <LessonSection title="A real-looking event — Glue DeleteTable">
        <p className="text-slate-300">
          Here is the event an on-call engineer at Acme found after{' '}
          <code className="text-core-400">silver.orders</code> disappeared from the Glue Data Catalog. Read it
          top to bottom before the field table below.
        </p>
        <Example title="Glue DeleteTable by an assumed role" caption="IDs shortened; account 111122223333 is a placeholder">
{`{
  "eventVersion": "1.09",
  "userIdentity": {
    "type": "AssumedRole",
    "principalId": "AROAEXAMPLEROLEID:priya.sharma",
    "arn": "arn:aws:sts::111122223333:assumed-role/de-dev-admin/priya.sharma",
    "accountId": "111122223333",
    "accessKeyId": "ASIAEXAMPLEKEY",
    "sessionContext": {
      "sessionIssuer": {
        "type": "Role",
        "principalId": "AROAEXAMPLEROLEID",
        "arn": "arn:aws:iam::111122223333:role/de-dev-admin",
        "accountId": "111122223333",
        "userName": "de-dev-admin"
      },
      "attributes": {
        "creationDate": "2026-09-29T21:02:44Z",
        "mfaAuthenticated": "true"
      }
    }
  },
  "eventTime": "2026-09-29T23:41:18Z",
  "eventSource": "glue.amazonaws.com",
  "eventName": "DeleteTable",
  "awsRegion": "us-east-1",
  "sourceIPAddress": "203.0.113.25",
  "userAgent": "aws-cli/2.17.0 Python/3.11.8 Windows/10",
  "requestParameters": {
    "catalogId": "111122223333",
    "databaseName": "silver",
    "name": "orders"
  },
  "responseElements": null,
  "requestID": "5f1c2a8e-EXAMPLE",
  "eventID": "b7d4e9a0-EXAMPLE",
  "readOnly": false,
  "eventType": "AwsApiCall",
  "managementEvent": true,
  "recipientAccountId": "111122223333",
  "eventCategory": "Management"
}`}
        </Example>
      </LessonSection>

      <LessonSection title="Field by field">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Field</th>
                <th className="px-4 py-3">What it tells you</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['eventTime', 'When the call happened — always UTC, so convert before telling the team it was 11:41 p.m.'],
                ['eventSource', 'Which service endpoint received it — glue.amazonaws.com, s3.amazonaws.com, kms.amazonaws.com'],
                ['eventName', 'The API action — DeleteTable, PutBucketPolicy, StartJobRun, ScheduleKeyDeletion'],
                ['awsRegion', 'The Region the request was sent to — important with multi-Region trails'],
                ['sourceIPAddress', 'Caller IP, or a service name such as glue.amazonaws.com for service-to-service calls'],
                ['userAgent', 'The tool used — console, aws-cli, boto3, Terraform, or an AWS service'],
                [
                  'userIdentity',
                  'Who called: type (IAMUser, AssumedRole, AWSService, Root), arn, accountId, accessKeyId, and for roles the sessionContext',
                ],
                [
                  'sessionContext.sessionIssuer',
                  'The IAM role behind an assumed-role session — tells you which role, while the session name hints at who',
                ],
                ['requestParameters', 'What was asked for — here the database and table name; for PutBucketPolicy the full new policy'],
                ['responseElements', 'What came back — often null for deletes, populated for creates such as a new job run ID'],
                ['errorCode / errorMessage', 'Present only when the call failed — AccessDenied, AccessDeniedException, EntityNotFoundException'],
                ['requestID / eventID', 'requestID matches the service request for support cases; eventID uniquely identifies this record'],
                ['readOnly', 'true for Get/List/Describe style calls, false for anything that changes state'],
                ['eventCategory', 'Management, Data, or Insight — which kind of event this is'],
              ].map(([field, meaning]) => (
                <tr key={field} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-mono text-xs text-white">{field}</td>
                  <td className="px-4 py-3">{meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Example title="What a denied call adds" caption="Only the differing fields — a pipeline role blocked by a bucket policy">
{`"eventSource": "s3.amazonaws.com",
"eventName": "PutBucketLifecycle",
"errorCode": "AccessDenied",
"errorMessage": "Access Denied",
"responseElements": null`}
        </Example>
      </LessonSection>

      <LessonSection title="Who really did it? Tracing an assumed role">
        <p className="text-slate-300">
          Most real events in a well-run account are <code className="text-core-400">AssumedRole</code>{' '}
          events, because humans sign in through IAM Identity Center or assume roles, and pipelines run as
          roles. The ARN <code className="text-core-400">assumed-role/de-dev-admin/priya.sharma</code> has
          two parts: the role name and the <strong className="text-white">session name</strong>.
        </p>
        <ContentStep number={1} title="Read the session issuer">
          <p className="text-slate-300">
            <code className="text-core-400">sessionIssuer.arn</code> tells you which role was used —{' '}
            <code className="text-core-400">de-dev-admin</code>. That already narrows it to people or services
            allowed to assume that role.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Read the session name">
          <p className="text-slate-300">
            With IAM Identity Center, roles are named like{' '}
            <code className="text-core-400">AWSReservedSSO_DataEngineerAdmin_abc123</code> and the session name
            is the user&apos;s sign-in name. For other roles, the session name is whatever the caller chose —
            helpful, but not proof on its own.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Find the matching AssumeRole event">
          <p className="text-slate-300">
            Search for the <code className="text-core-400">AssumeRole</code> (or{' '}
            <code className="text-core-400">AssumeRoleWithSAML</code>) event whose returned credentials match
            the <code className="text-core-400">accessKeyId</code> in the suspicious event. That event&apos;s{' '}
            <code className="text-core-400">userIdentity</code> is the real caller.
          </p>
        </ContentStep>
        <Flowchart
          title="From assumed-role event back to a person"
          chart={`flowchart LR
  EV[DeleteTable event] --> AK[accessKeyId ASIA key]
  EV --> SI[sessionIssuer de-dev-admin]
  AK --> AR[Matching AssumeRole event]
  AR --> WHO[Original caller identity]
  SI --> POL[Who may assume this role]`}
        />
        <Callout variant="tip" title="Make attribution easy up front">
          Require meaningful session names in trust policies, or use the{' '}
          <code className="text-core-400">sourceIdentity</code> attribute, which persists across role chaining.
          Future investigations become one lookup instead of three.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Every event answers who (userIdentity), what (eventSource + eventName), when (eventTime, UTC), where (awsRegion, sourceIPAddress), and result (errorCode).',
          'requestParameters shows exactly what was asked — table names, full bucket policies, job names.',
          'errorCode such as AccessDenied marks failed calls — the fastest clue when a pipeline role breaks.',
          'readOnly and eventCategory help you filter changes from reads and management from data events.',
          'For AssumedRole, use sessionIssuer for the role, the session name as a hint, and the matching AssumeRole event for the real person.',
        ]}
      />
    </LessonArticle>
  )
}
