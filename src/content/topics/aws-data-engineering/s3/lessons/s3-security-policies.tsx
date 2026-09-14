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

export function S3SecurityPolicies() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="The lake is public by default until you say otherwise">
        S3 authorization stacks <strong className="text-white">IAM identity policies</strong>,{' '}
        <strong className="text-white">bucket policies</strong>, optional{' '}
        <strong className="text-white">ACLs</strong>, and account-level{' '}
        <strong className="text-white">Block Public Access</strong>. Modern DE platforms favor Block Public
        Access + bucket/IAM policies — ACLs are legacy except for rare cross-account object ownership cases.
      </Callout>

      <Definition term="S3 authorization layers">
        <p>
          A request succeeds only if no explicit Deny applies and at least one policy Allows the action.
          <strong className="text-white"> Identity policies</strong> attach to IAM users/roles.{' '}
          <strong className="text-white">Bucket policies</strong> attach to the bucket resource — essential
          for cross-account access and condition keys on prefixes.{' '}
          <strong className="text-white">ACLs</strong> grant coarse object/bucket permissions — avoid for
          new lake design.
        </p>
      </Definition>

      <LessonSection title="IAM policy vs bucket policy vs ACL">
        <ContentStep number={1} title="IAM identity policy">
          <p className="text-slate-300">
            On the Glue job role, analyst SSO role, or Lambda execution role. Scopes what that principal
            can do across buckets. Best for{' '}
            <strong className="text-white">pipeline roles</strong> with predictable prefix needs: Allow{' '}
            <span className="font-mono text-sm">s3:GetObject</span> on{' '}
            <span className="font-mono text-sm">arn:aws:s3:::lake/curated/*</span>.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Bucket policy">
          <p className="text-slate-300">
            Resource-based policy on the bucket. Required patterns: cross-account Allow for external role
            ARNs, enforcing HTTPS (<span className="font-mono text-sm">aws:SecureTransport</span>), denying
            non-VPC endpoints, granting S3 service principals (logging, replication). Central lake team
            owns bucket policy; workload teams consume via roles.
          </p>
        </ContentStep>
        <ContentStep number={3} title="ACL — prefer not to">
          <p className="text-slate-300">
            S3 Object Ownership <strong className="text-white">Bucket owner enforced</strong> disables ACL
            grants — recommended default. ACLs remain in older buckets; migrate to policies during lake
            modernization. Exception: some legacy cross-account copy flows — prefer bucket owner + policies.
          </p>
        </ContentStep>
        <Flowchart
          title="Modern S3 access evaluation (simplified)"
          chart={`flowchart TD
  REQ[S3 API request]
  REQ --> BPA{Block Public Access allows?}
  BPA -->|No| DENY[Deny]
  BPA -->|Yes| POL[Evaluate IAM + bucket policy + SCP]
  POL --> D{Explicit Deny?}
  D -->|Yes| DENY
  D -->|No| A{Any Allow?}
  A -->|No| DENY
  A -->|Yes| ALLOW[Allow]`}
        />
      </LessonSection>

      <LessonSection title="Block Public Access">
        <Definition term="S3 Block Public Access (BPA)">
          <p>
            Account- and bucket-level settings that override public ACLs and public bucket policies.{' '}
            <strong className="text-white">Enable BPA at the organization/account level</strong> for all
            data lake accounts — then selectively open only what CloudFront OAI or CloudFront OAC needs via
            private bucket patterns, never <span className="font-mono text-sm">Principal: *</span> on prod data.
          </p>
        </Definition>
        <ContentStep number={1} title="Four BPA settings">
          <p className="text-slate-300">
            Block public ACLs, block public bucket policies, ignore public ACLs, restrict public bucket
            policies. Together they prevent accidental <span className="font-mono text-sm">AllUsers</span>{' '}
            reads — a top cause of lake breaches in news headlines.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Access Analyzer and audits">
          <p className="text-slate-300">
            Run IAM Access Analyzer on buckets after policy changes. DE CI/CD should fail deployments that
            introduce <span className="font-mono text-sm">Principal: *</span> without approval workflow.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Least privilege lake examples">
        <ContentStep number={1} title="ListBucket vs GetObject">
          <p className="text-slate-300">
            Athena and Glue need <span className="font-mono text-sm">s3:ListBucket</span> with{' '}
            <span className="font-mono text-sm">s3:prefix</span> condition matching{' '}
            <span className="font-mono text-sm">curated/sales/</span> — plus{' '}
            <span className="font-mono text-sm">s3:GetObject</span> on{' '}
            <span className="font-mono text-sm">curated/sales/*</span>. Listing entire bucket when analysts
            need one dataset is over-permission.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Ingest vs serve separation">
          <p className="text-slate-300">
            Lambda ingest role: <span className="font-mono text-sm">PutObject</span> on{' '}
            <span className="font-mono text-sm">landing/*</span> only — no Get on curated. Analyst SSO:
            Get/List on curated — no Put on raw. Glue transform: read raw, write curated — no DeleteBucket.
          </p>
        </ContentStep>
        <Example title="Minimal curated read policy (identity policy sketch)">
{`{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:GetObject"],
      "Resource": "arn:aws:s3:::company-lake/curated/sales/*"
    },
    {
      "Effect": "Allow",
      "Action": ["s3:ListBucket"],
      "Resource": "arn:aws:s3:::company-lake",
      "Condition": {
        "StringLike": { "s3:prefix": ["curated/sales/*"] }
      }
    }
  ]
}`}
        </Example>
        <Example title="Bucket policy — deny insecure transport">
{`{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Deny",
    "Principal": "*",
    "Action": "s3:*",
    "Resource": [
      "arn:aws:s3:::company-lake",
      "arn:aws:s3:::company-lake/*"
    ],
    "Condition": {
      "Bool": { "aws:SecureTransport": "false" }
    }
  }]
}`}
        </Example>
        <Callout variant="insight">
          Lake Formation can centralize table/column grants on top of S3 — but underlying bucket policy and
          IAM still matter for paths outside the catalog and for service principals.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Prefer Block Public Access + IAM/bucket policies; disable ACLs via bucket owner enforced.',
          'Identity policies on roles; bucket policies for cross-account, service principals, and global Deny (HTTPS).',
          'Explicit Deny wins; scope ListBucket with prefix conditions separate from GetObject ARNs.',
          'Split ingest/transform/serve permissions by prefix — least privilege is auditable in CloudTrail.',
          'Access Analyzer and CI policy checks catch accidental public lake exposure before prod.',
        ]}
      />
    </LessonArticle>
  )
}
