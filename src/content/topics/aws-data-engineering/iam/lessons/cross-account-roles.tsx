import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function CrossAccountRoles() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="The lake lives in one account — consumers live in others">
        Mature data platforms split accounts: a central <strong className="text-white">data lake account</strong>{' '}
        owns S3 buckets and Glue catalogs; <strong className="text-white">workload accounts</strong> run
        Redshift, SageMaker, or analytics tools. Cross-account IAM roles let Account A&apos;s pipeline
        assume a role in Account B to read curated Parquet — without copying data or sharing root passwords.
      </Callout>

      <Definition term="Cross-account IAM role">
        <p>
          A <strong className="text-white">cross-account role</strong> is an IAM role in Account B whose
          trust policy allows a principal from Account A (another account&apos;s role or user) to call{' '}
          <span className="font-mono text-sm">sts:AssumeRole</span>. Permissions live in Account B on
          that role — typically scoped S3 List/Get on shared prefixes or Glue catalog read. Account A&apos;s
          caller also needs <span className="font-mono text-sm">sts:AssumeRole</span> on the target role ARN.
        </p>
      </Definition>

      <LessonSection title="Trust in Account A, permissions in Account B">
        <ContentStep number={1} title="Account B — create the lake-read role">
          <p className="text-slate-300">
            Permission policy: Allow <span className="font-mono text-sm">s3:GetObject</span> and{' '}
            <span className="font-mono text-sm">s3:ListBucket</span> on{' '}
            <span className="font-mono text-sm">arn:aws:s3:::shared-lake/curated/*</span>. Trust policy:
            Allow <span className="font-mono text-sm">sts:AssumeRole</span> for{' '}
            <span className="font-mono text-sm">arn:aws:iam::ACCOUNT-A:role/RedshiftLoader</span>.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Account A — grant AssumeRole to the caller">
          <p className="text-slate-300">
            The Redshift loader role in Account A needs an Allow on{' '}
            <span className="font-mono text-sm">sts:AssumeRole</span> with Resource set to Account B&apos;s
            role ARN. Without this, the caller cannot even request temporary credentials.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Optional bucket policy in Account B">
          <p className="text-slate-300">
            Some teams duplicate Allow on the S3 bucket policy for the external role principal — defense
            in depth. Evaluation still requires no explicit Deny; both identity and resource policies can
            grant access for cross-account S3.
          </p>
        </ContentStep>
        <Flowchart
          title="Cross-account S3 read pattern"
          chart={`flowchart LR
  A[Account A — Redshift loader role]
  B[Account B — LakeReadRole]
  S3[S3 curated bucket in Account B]
  A -->|sts AssumeRole allowed by trust| B
  B -->|temp credentials| S3
  A -->|needs sts AssumeRole on B role ARN| B`}
        />
      </LessonSection>

      <LessonSection title="External ID — confused deputy prevention">
        <Definition term="Confused deputy problem">
          <p>
            Without safeguards, a malicious Account C could trick Account B into granting access to a role
            that Account C also uses — a <strong className="text-white">confused deputy</strong>. AWS
            mitigates this with <strong className="text-white">ExternalId</strong>: a shared secret string
            Account A and Account B agree on, passed in the AssumeRole call and required in the trust policy
            Condition.
          </p>
        </Definition>
        <ContentStep number={1} title="Simple analogy">
          <p className="text-slate-300">
            External ID is like a PIN for role assumption. Account B&apos;s trust policy says: &quot;I trust
            Account A&apos;s loader role <em>only if</em> they present ExternalId{' '}
            <span className="font-mono text-sm">data-platform-7f3a</span>.&quot; Random third parties
            cannot guess the PIN, so they cannot hijack the trust relationship.
          </p>
        </ContentStep>
        <ContentStep number={2} title="When DE teams use it">
          <p className="text-slate-300">
            SaaS vendors (ETL tools, observability) accessing your lake account, or multi-tenant platform
            teams onboarding a new consumer account. Each consumer gets a unique ExternalId in their trust
            policy condition.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Not a secret password">
          <p className="text-slate-300">
            ExternalId is a uniqueness token, not encryption. Still treat it like onboarding metadata —
            store in Secrets Manager or Terraform vars, not in public docs. Pair with least-privilege
            permissions on the role itself.
          </p>
        </ContentStep>
        <Callout variant="tip">
          For purely internal same-org cross-account (Account A → Account B both yours), ExternalId is
          recommended but not always enforced. Third-party access should always require it.
        </Callout>
      </LessonSection>

      <LessonSection title="Lake and shared-services patterns">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Pattern</th>
                <th className="px-4 py-3">Cross-account role purpose</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Central lake, spoke analytics', 'Spoke Redshift COPY assumes lake-read role for curated prefix'],
                ['Shared Glue catalog', 'Consumer account role assumes catalog-read role for GetDatabase/GetTable'],
                ['Logging / audit account', 'All accounts assume OrganizationAccountAccessRole variant for CloudTrail reads'],
                ['CI/CD deploy account', 'Pipeline role assumes cdk-deploy role in target account — minimal CloudFormation scope'],
              ].map(([pattern, purpose]) => (
                <tr key={pattern} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{pattern}</td>
                  <td className="px-4 py-3">{purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="insight">
          Interview sound bite: &quot;Cross-account access uses a role in the resource account — trust
          policy names who can assume, permission policy names what they can touch; ExternalId prevents
          confused deputy when third parties are involved.&quot;
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Cross-account roles live in the account that owns the resource (lake account); trust policy lists external principals.',
          'Caller in Account A needs sts:AssumeRole on the role ARN; role in Account B holds S3/Glue permissions.',
          'ExternalId in trust policy + AssumeRole call prevents confused deputy — especially for vendors and multi-tenant onboarding.',
          'DE pattern: central S3 + Glue catalog account with read roles assumed by Redshift, SageMaker, or spoke ETL accounts.',
        ]}
      />
    </LessonArticle>
  )
}
