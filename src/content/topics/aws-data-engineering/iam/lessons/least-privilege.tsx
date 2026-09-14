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

export function LeastPrivilege() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Give only what is needed">
        <strong className="text-white">Least privilege</strong> means every identity — human, Glue job,
        Lambda function — gets the minimum permissions required to do its job, nothing more. It is the
        single most repeated security principle in AWS and the difference between a contained mistake and
        a headline about a deleted production data lake.
      </Callout>

      <Definition term="Principle of least privilege">
        <p>
          <strong className="text-white">Least privilege</strong> grants only the actions and resources
          necessary for a specific task, for the shortest practical time. Start narrow, expand deliberately
          when a real AccessDenied appears — never start with full admin and &quot;trim later.&quot;
        </p>
      </Definition>

      <LessonSection title="Why it matters for data engineering">
        <ContentStep number={1} title="Blast radius of a bug">
          <p className="text-slate-300">
            A Glue script with a wrong path deletes objects. If the role can only write{' '}
            <code className="text-core-400">processed/dev/</code>, prod data survives. If the role has{' '}
            <code className="text-core-400">s3:*</code> on the whole account, one typo wipes the lake.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Insider and credential risk">
          <p className="text-slate-300">
            Analyst credentials should read curated tables, not drop Redshift clusters. Least privilege
            limits damage from phishing, stolen laptops, or disgruntled access.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Compliance and audits">
          <p className="text-slate-300">
            SOC2, HIPAA, and PCI auditors ask who can access PII and how you prove it. Scoped policies
            with prefix conditions answer that question; AdministratorAccess does not.
          </p>
        </ContentStep>
        <Flowchart
          title="Least privilege in practice"
          chart={`flowchart TB
  START[New workload — Glue job Lambda user]
  START --> N[Start with zero or read-only baseline]
  N --> RUN[Run job or user attempts task]
  RUN --> DENY{AccessDenied?}
  DENY -->|Yes| ADD[Add specific Allow for that action and ARN]
  ADD --> RUN
  DENY -->|No| OK[Working — stop adding permissions]
  OK --> REV[Periodic review — remove unused Allows]`}
        />
      </LessonSection>

      <LessonSection title="Start narrow, expand carefully">
        <ContentStep number={1} title="Avoid AdministratorAccess in production">
          <p className="text-slate-300">
            AWS managed <code className="text-core-400">AdministratorAccess</code> is convenient for a
            sandbox account while learning. In production it violates every governance standard. Use
            scoped admin roles with MFA and break-glass procedures instead.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Use resource ARNs and prefixes">
          <p className="text-slate-300">
            Prefer <code className="text-core-400">arn:aws:s3:::lake/raw/*</code> over{' '}
            <code className="text-core-400">arn:aws:s3:::*</code>. Prefer a single Glue job ARN over{' '}
            <code className="text-core-400">glue:*</code> on <code className="text-core-400">*</code>.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Read CloudTrail AccessDenied events">
          <p className="text-slate-300">
            When a pipeline fails authorization, CloudTrail shows the exact{' '}
            <code className="text-core-400">eventName</code> and resource. Add that permission only — not
            a wildcard bundle from Stack Overflow.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Separate dev, staging, prod roles">
          <p className="text-slate-300">
            <code className="text-core-400">GlueETLRole-dev</code> writes to dev prefixes;{' '}
            <code className="text-core-400">GlueETLRole-prod</code> writes to prod. Never share one
            super-role across environments.
          </p>
        </ContentStep>
        <Callout variant="tip" title="IAM Access Analyzer">
          Access Analyzer flags resources shared externally and unused access in some setups. Use it
          alongside manual policy reviews before promoting pipelines to production.
        </Callout>
      </LessonSection>

      <LessonSection title="Data engineering examples">
        <Example title="Glue ETL job — scoped write" caption="Raw in, processed out">
{`GlueETLRole permissions (conceptual):

Allow s3:ListBucket on company-lake
  Condition: s3:prefix = raw/* OR processed/*

Allow s3:GetObject on arn:aws:s3:::company-lake/raw/*

Allow s3:PutObject on arn:aws:s3:::company-lake/processed/*

Explicitly NO:
  s3:DeleteObject on prod paths
  s3:* on other buckets
  iam:* or ec2:*`}
        </Example>
        <Example title="Analyst Athena access" caption="Read curated only">
{`DataAnalystGroup:

Allow athena:StartQueryExecution on workgroup analytics-wg
Allow glue:GetDatabase GetTable on catalog curated_db only
Allow s3:GetObject on arn:aws:s3:::company-lake/curated/*
Allow s3:PutObject on arn:aws:s3:::company-lake/athena-results/username/*

Deny s3:* on arn:aws:s3:::company-lake/raw/*  (PII landing zone)`}
        </Example>
        <Example title="Lambda file processor" caption="Single bucket trigger">
{`LambdaIngestRole:

Allow s3:GetObject on arn:aws:s3:::company-lake/landing/incoming/*
Allow s3:PutObject on arn:aws:s3:::company-lake/raw/*
Allow glue:StartJobRun on arn:aws:glue:region:acct:job/nightly-etl

No Redshift, no DeleteObject, no PassRole on admin roles`}
        </Example>
        <ContentStep number={1} title="Redshift COPY role">
          <p className="text-slate-300">
            Grant <code className="text-core-400">s3:GetObject</code> only on the staging prefix used for
            COPY, plus <code className="text-core-400">kms:Decrypt</code> on the specific CMK if encrypted.
            Analyst database users get SQL GRANTs inside Redshift — another layer of least privilege.
          </p>
        </ContentStep>
        <Callout variant="insight">
          Least privilege is iterative. Version-control your IAM policies like application code; pull
          requests for permission changes beat editing in the Console without review.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Least privilege = minimum permissions for the task — reduces blast radius from bugs and stolen credentials.',
          'Start with narrow Allows; expand only when AccessDenied proves a gap — never default to AdministratorAccess in prod.',
          'Scope by ARN and S3 prefix; separate dev/staging/prod roles; review CloudTrail and policies regularly.',
          'DE pattern: Glue reads raw/, writes processed/; analysts read curated/; Lambda scoped to landing → raw handoff.',
        ]}
      />
    </LessonArticle>
  )
}
