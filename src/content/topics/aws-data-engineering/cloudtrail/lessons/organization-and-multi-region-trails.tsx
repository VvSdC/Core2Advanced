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

export function OrganizationAndMultiRegionTrails() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="One trail per account per Region does not scale — and attackers love the gaps">
        A single-Region trail in <code className="text-core-400">us-east-1</code> tells you nothing about the
        crypto-mining EC2 fleet someone launched in <code className="text-core-400">ap-southeast-3</code>, and a
        trail created by each team is a trail each team can delete. Production data platforms run{' '}
        <strong className="text-white">one multi-Region organization trail</strong>, owned centrally, delivering
        every member account&apos;s events to a locked-down log-archive bucket.
      </Callout>

      <Definition term="Organization trail">
        <p>
          A trail created in the AWS Organizations management account (or a registered CloudTrail delegated
          administrator account) that automatically logs events for <strong className="text-white">every member
          account</strong> — including accounts added later. Member accounts can see the trail but cannot modify,
          stop, or delete it. Combined with the multi-Region setting, one trail such as{' '}
          <code className="text-core-400">org-trail-prod</code> covers all accounts in all enabled Regions.
        </p>
      </Definition>

      <LessonSection title="Multi-Region trails and global service events">
        <ContentStep number={1} title="Why log Regions you do not use">
          <p className="text-slate-300">
            Your lake runs in <code className="text-core-400">us-east-1</code>, but a leaked key works in every
            enabled Region. A multi-Region trail records activity everywhere and automatically picks up newly
            enabled Regions. Unused-Region activity is itself a high-signal alert — nobody on the data team should
            be calling <code className="text-core-400">RunInstances</code> in São Paulo.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Global service events land in us-east-1">
          <p className="text-slate-300">
            IAM, STS global endpoint calls, and CloudFront are global services; their events are recorded as if
            they happened in <code className="text-core-400">us-east-1</code>. A multi-Region trail includes
            global service events by default, delivered once — so a{' '}
            <code className="text-core-400">CreateAccessKey</code> on a pipeline user shows up under the
            us-east-1 prefix even if every pipeline runs in eu-west-1. Remember this when writing Athena filters.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Avoid duplicate trails">
          <p className="text-slate-300">
            Each account gets one free copy of management events; additional trails logging the same management
            events are billed. Teams that each create their own trail on top of the org trail pay twice and still
            leave gaps. Standardize on the org trail plus targeted data-event selectors where needed.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Organization trails and the log-archive account">
        <ContentStep number={1} title="Who creates it">
          <p className="text-slate-300">
            Enable trusted access for CloudTrail in AWS Organizations, then create the trail from the management
            account — or register a security tooling account as CloudTrail delegated administrator so day-to-day
            work stays out of the management account. Logs for all member accounts flow automatically.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Dedicated log-archive account">
          <p className="text-slate-300">
            The AWS Control Tower pattern: a separate <strong className="text-white">Log Archive</strong> account
            owns <code className="text-core-400">acme-cloudtrail-logs-archive</code>. Workload accounts —
            where the data platform, Glue jobs, and Redshift live — never get write or delete rights on it. An
            attacker with admin in the analytics account cannot erase the evidence of what they did.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Object key layout">
          <p className="text-slate-300">
            Org trail logs land under{' '}
            <code className="text-core-400">AWSLogs/o-exampleorgid/111122223333/CloudTrail/us-east-1/2026/09/30/</code>{' '}
            — organization ID, then account ID, Region, and date. This layout is what Athena partition projection
            will key off in the next lessons.
          </p>
        </ContentStep>
        <Flowchart
          title="Organization trail delivery"
          chart={`flowchart LR
  MGMT[Management or delegated admin account]
  TRAIL[org-trail-prod multi Region]
  A1[Analytics account]
  A2[Ingest account]
  A3[Sandbox account]
  ARCH[Log archive account]
  S3[(acme-cloudtrail-logs-archive)]
  MGMT --> TRAIL
  A1 --> TRAIL
  A2 --> TRAIL
  A3 --> TRAIL
  TRAIL --> S3
  ARCH -->|owns and locks| S3`}
        />
      </LessonSection>

      <LessonSection title="Bucket policy and creation">
        <ContentStep number={1} title="Grant only the CloudTrail service, only for your trail">
          <p className="text-slate-300">
            The archive bucket policy allows the <code className="text-core-400">cloudtrail.amazonaws.com</code>{' '}
            service principal to read the bucket ACL and put objects — scoped with{' '}
            <code className="text-core-400">aws:SourceArn</code> to the exact trail ARN. That condition blocks the
            confused-deputy problem where some other account&apos;s trail writes into your bucket.
          </p>
        </ContentStep>
        <Example title="Log-archive bucket policy" caption="acme-cloudtrail-logs-archive in account 444455556666">
{`{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AWSCloudTrailAclCheck",
      "Effect": "Allow",
      "Principal": { "Service": "cloudtrail.amazonaws.com" },
      "Action": "s3:GetBucketAcl",
      "Resource": "arn:aws:s3:::acme-cloudtrail-logs-archive",
      "Condition": { "StringEquals": {
        "aws:SourceArn": "arn:aws:cloudtrail:us-east-1:111122223333:trail/org-trail-prod" } }
    },
    {
      "Sid": "AWSCloudTrailWrite",
      "Effect": "Allow",
      "Principal": { "Service": "cloudtrail.amazonaws.com" },
      "Action": "s3:PutObject",
      "Resource": [
        "arn:aws:s3:::acme-cloudtrail-logs-archive/AWSLogs/111122223333/*",
        "arn:aws:s3:::acme-cloudtrail-logs-archive/AWSLogs/o-exampleorgid/*"
      ],
      "Condition": { "StringEquals": {
        "s3:x-amz-acl": "bucket-owner-full-control",
        "aws:SourceArn": "arn:aws:cloudtrail:us-east-1:111122223333:trail/org-trail-prod" } }
    }
  ]
}`}
        </Example>
        <Example title="Create the org trail with the CLI" caption="Run from the management or delegated admin account">
{`aws organizations enable-aws-service-access \\
  --service-principal cloudtrail.amazonaws.com

aws cloudtrail create-trail \\
  --name org-trail-prod \\
  --s3-bucket-name acme-cloudtrail-logs-archive \\
  --is-organization-trail \\
  --is-multi-region-trail \\
  --include-global-service-events \\
  --enable-log-file-validation \\
  --kms-key-id arn:aws:kms:us-east-1:444455556666:key/1234abcd-12ab-34cd-56ef-1234567890ab

aws cloudtrail start-logging --name org-trail-prod`}
        </Example>
        <Example title="Same trail in CloudFormation" caption="Deployed by the platform team, not workload teams">
{`Resources:
  OrgTrail:
    Type: AWS::CloudTrail::Trail
    Properties:
      TrailName: org-trail-prod
      S3BucketName: acme-cloudtrail-logs-archive
      IsLogging: true
      IsMultiRegionTrail: true
      IsOrganizationTrail: true
      IncludeGlobalServiceEvents: true
      EnableLogFileValidation: true
      KMSKeyId: !Ref TrailKmsKeyArn`}
        </Example>
        <Callout variant="tip">
          Pair the org trail with a service control policy that denies{' '}
          <code className="text-core-400">cloudtrail:StopLogging</code>,{' '}
          <code className="text-core-400">cloudtrail:DeleteTrail</code>, and{' '}
          <code className="text-core-400">cloudtrail:UpdateTrail</code> for everyone except a break-glass role —
          belt and braces on top of the built-in member-account protection.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Multi-Region trails catch activity in Regions you never use — often the first sign of a leaked key.',
          'Global service events such as IAM and STS are recorded in us-east-1; filter accordingly.',
          'Organization trails from the management or delegated admin account cover every member account, and members cannot disable them.',
          'Deliver to a dedicated log-archive account and bucket so workload admins cannot delete evidence.',
          'Scope the bucket policy to cloudtrail.amazonaws.com with aws:SourceArn pinned to the trail ARN.',
        ]}
      />
    </LessonArticle>
  )
}
