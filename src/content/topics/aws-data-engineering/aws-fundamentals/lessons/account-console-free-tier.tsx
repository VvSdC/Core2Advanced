import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function AccountConsoleFreeTier() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Your AWS account is the front door">
        Everything in AWS — buckets, roles, bills — lives inside an <strong className="text-white">AWS
        account</strong>. One account can hold many users (via IAM, covered next sub-topic), but the
        account itself is the billing and security boundary. Treat account creation like opening a bank
        account: real identity, real payment method, real responsibility.
      </Callout>

      <Definition term="AWS account">
        <p>
          An <strong className="text-white">AWS account</strong> is a container for your resources,
          billing, and default security settings. It has a unique 12-digit account ID and an email that
          owns the <strong className="text-white">root user</strong> — the all-powerful login created
          at signup. Day-to-day work should use IAM users or roles, not root.
        </p>
      </Definition>

      <LessonSection title="Root user — handle with care">
        <ContentStep number={1} title="What root can do">
          <p className="text-slate-300">
            Root can delete any resource, change billing, close the account, and bypass IAM. There is no
            permission you can remove from root — only protect it with MFA and avoid using it for daily
            tasks.
          </p>
        </ContentStep>
        <ContentStep number={2} title="What to do instead">
          <p className="text-slate-300">
            After signup: enable MFA on root, create an admin IAM user or use AWS IAM Identity Center
            (SSO), then lock root credentials in a password manager for emergencies only. The IAM
            sub-topic walks through users, groups, and roles in detail.
          </p>
        </ContentStep>
        <Callout variant="tip" title="Preview: IAM is next">
          IAM (Identity and Access Management) answers &quot;who can do what?&quot; Root is the one
          identity you should almost never use. Every pipeline role, Glue job, and Lambda function will
          get its own IAM role — least privilege from the start.
        </Callout>
      </LessonSection>

      <LessonSection title="Console navigation mental model">
        <p className="text-slate-300">
          The AWS Management Console is a web UI at{' '}
          <span className="font-mono text-sm text-core-400">https://console.aws.amazon.com</span>.
          Learn three anchors and you will not get lost:
        </p>
        <ContentStep number={1} title="Services menu">
          <p className="text-slate-300">
            Top-left &quot;Services&quot; lists hundreds of products grouped by category — Storage (S3),
            Analytics (Glue, Athena), Security (IAM). Pin favorites you use daily.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Search bar">
          <p className="text-slate-300">
            Press <span className="font-mono text-sm text-core-400">Alt+S</span> (or click Search) and
            type &quot;S3&quot;, &quot;Glue&quot;, &quot;Billing&quot; — fastest route for beginners.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Region selector">
          <p className="text-slate-300">
            Top-right shows the active Region. Resources you create appear only there. Always verify
            Region before launching infrastructure.
          </p>
        </ContentStep>
        <Flowchart
          title="Console mental model"
          chart={`flowchart LR
  A[Sign in] --> B[Pick Region]
  B --> C[Search or Services menu]
  C --> D[Service dashboard — e.g. S3]
  D --> E[Create / configure resource]
  E --> F[Resource appears in that Region]`}
        />
      </LessonSection>

      <LessonSection title="AWS Free Tier — three categories">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Meaning</th>
                <th className="px-4 py-3">DE examples</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Always Free', 'Never expires within stated monthly limits', 'Lambda requests, DynamoDB RCU/WCU free tier'],
                ['12 Months Free', 'Free for new accounts first 12 months', 'Some EC2 t2/t3.micro hours, S3 storage limits'],
                ['Trials', 'Short trials of specific services', 'Redshift, SageMaker trial credits — read fine print'],
              ].map(([cat, meaning, examples]) => (
                <tr key={cat} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{cat}</td>
                  <td className="px-4 py-3">{meaning}</td>
                  <td className="px-4 py-3">{examples}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="beginner" title="Billing caution">
          Free Tier does <strong className="text-white">not</strong> mean everything is free. Leaving an
          EC2 instance running, storing terabytes in S3, or scanning huge tables in Athena generates
          charges. AWS bills the payment method on file. Always check the Free Tier page for current
          limits — they change over time.
        </Callout>
      </LessonSection>

      <LessonSection title="Budgets and alerts (high level)">
        <ContentStep number={1} title="AWS Budgets">
          <p className="text-slate-300">
            Set a monthly cost budget (even $5–10 for learning) and email alerts at 50%, 80%, and 100%.
            Search &quot;Budgets&quot; in the Console under Billing. Catching a runaway Glue job early
            saves stress.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Cost Explorer">
          <p className="text-slate-300">
            After a few days of use, Cost Explorer shows which service drove spend — often EC2, NAT
            Gateway, or Redshift if left on. Tag resources (project, env) so team lakes stay accountable.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Clean up labs">
          <p className="text-slate-300">
            End every practice session by deleting test buckets, stopping instances, and removing NAT
            gateways. Orphaned resources are the number-one surprise bill for beginners.
          </p>
        </ContentStep>
      </LessonSection>

      <KeyTakeaways
        items={[
          'An AWS account is the billing and security boundary; protect root with MFA and use IAM for daily work.',
          'Console: Services menu, search bar, and Region selector are your three navigation anchors.',
          'Free Tier has Always Free, 12-month, and Trial categories — exceeding limits bills your card.',
          'Set budgets and alerts; tag resources; tear down lab infrastructure when done.',
        ]}
      />
    </LessonArticle>
  )
}
