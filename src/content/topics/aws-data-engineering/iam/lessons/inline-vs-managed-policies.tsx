import {
  Callout,
  ContentStep,
  Definition,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function InlineVsManagedPolicies() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Two ways to attach permissions">
        When you create a Glue job role or grant a data analyst access to Athena, you attach policies.
        Those policies can be <strong className="text-white">inline</strong> (embedded in the user or
        role) or <strong className="text-white">managed</strong> (standalone documents you attach by
        reference). The choice affects reuse, auditing, and how your platform team ships guardrails.
      </Callout>

      <Definition term="Inline vs managed policy">
        <p>
          An <strong className="text-white">inline policy</strong> exists only on one IAM user, group,
          or role — delete the role and the policy disappears with it. A{' '}
          <strong className="text-white">managed policy</strong> is its own IAM object with an ARN; you
          attach the same managed policy to many roles. Managed policies split into{' '}
          <strong className="text-white">AWS managed</strong> (written and maintained by AWS) and{' '}
          <strong className="text-white">customer managed</strong> (written by your organization).
        </p>
      </Definition>

      <LessonSection title="Inline policies">
        <ContentStep number={1} title="One-to-one lifecycle">
          <p className="text-slate-300">
            Inline policies are useful for truly unique permissions — a one-off EC2 bastion role that
            will never be cloned. They are harder to diff across environments because the JSON lives
            inside the role resource, not in a shared library.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Harder to reuse at scale">
          <p className="text-slate-300">
            If ten Glue jobs need identical S3 read rules, ten inline copies drift over time. Someone
            adds <span className="font-mono text-sm">s3:DeleteObject</span> to one job role by mistake
            and your least-privilege story breaks silently.
          </p>
        </ContentStep>
        <ContentStep number={3} title="When inline still makes sense">
          <p className="text-slate-300">
            Exception policies tightly coupled to a single principal — e.g. a break-glass admin role
            with a unique Deny/Allow combo. Even then, many teams prefer customer managed policies with
            strict naming conventions.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Managed policies — AWS vs customer">
        <ContentStep number={1} title="AWS managed policies">
          <p className="text-slate-300">
            Examples: <span className="font-mono text-sm">AmazonS3ReadOnlyAccess</span>,{' '}
            <span className="font-mono text-sm">AWSGlueServiceRole</span>,{' '}
            <span className="font-mono text-sm">AWSLambdaBasicExecutionRole</span>. AWS updates them
            when services add new required permissions — convenient but often broader than a production
            lake needs.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Customer managed policies">
          <p className="text-slate-300">
            Your platform team writes <span className="font-mono text-sm">DataLake-ReadCurated</span>{' '}
            or <span className="font-mono text-sm">GlueETL-RawToCurated</span> once and attaches them to
            every role in that tier. Version history, tags, and IaC modules (Terraform/CDK) reference
            the same ARN in dev, staging, and prod.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Policy size limits">
          <p className="text-slate-300">
            IAM enforces maximum policy sizes. Splitting reusable chunks into multiple customer managed
            policies (and attaching several to one role) keeps you under limits and mirrors how DE teams
            think: ingest policy + logging policy + KMS decrypt policy.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Why data engineering teams prefer customer managed">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Need</th>
                <th className="px-4 py-3">Customer managed advantage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Least privilege on S3 prefixes', 'One policy per data zone — raw, curated, exports — not AWSReadOnlyAccess'],
                ['Consistent Glue/Lambda roles', 'Same ARNs attached in every account via StackSets or Terraform'],
                ['Audit and compliance', 'Central repo shows who approved policy v3 and which roles still use v2'],
                ['Environment promotion', 'Attach DataLake-Prod-Write only in prod OU; dev gets DataLake-Dev-Write'],
                ['Separation of duties', 'Analyst policy separate from pipeline policy — no shared inline blob on one role'],
              ].map(([need, advantage]) => (
                <tr key={need} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{need}</td>
                  <td className="px-4 py-3">{advantage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip">
          Start from AWS managed policies when learning (e.g. Glue service role wizard), then replace
          broad AWS managed attachments with customer managed equivalents before production — especially
          anything with <span className="font-mono text-sm">*</span> on S3 resources.
        </Callout>
        <Callout variant="insight">
          Interview sound bite: &quot;Inline policies die with the principal; customer managed policies
          are reusable, versioned documents we attach to many pipeline roles for consistent least
          privilege.&quot;
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Inline policies are embedded in one user/group/role; managed policies are standalone documents attached by ARN.',
          'AWS managed policies are convenient defaults; customer managed policies encode your org\'s least-privilege standards.',
          'DE teams prefer customer managed for reusable S3 prefix rules, consistent Glue/Lambda roles, and audit-friendly versioning.',
          'Avoid ten copies of the same inline JSON — one customer managed policy per data zone or pipeline stage scales better.',
        ]}
      />
    </LessonArticle>
  )
}
