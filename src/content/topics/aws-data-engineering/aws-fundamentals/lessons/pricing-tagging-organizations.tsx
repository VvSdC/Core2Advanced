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

export function PricingTaggingOrganizations() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Everyday idea">
        AWS bills like a detailed restaurant receipt — every EC2 hour, every GB in S3, every Athena scan.
        Without labels on who ordered what, one team&apos;s experiment looks like everyone&apos;s problem.
        <strong className="text-white"> Pricing models</strong>, <strong className="text-white">tags</strong>
        , and <strong className="text-white">Organizations</strong> help you predict spend, split costs, and
        keep production separate from playground accounts.
      </Callout>

      <Definition term="AWS pricing models (overview)">
        <p>
          Most AWS services charge on a <strong className="text-white">pay-as-you-go</strong> basis — no
          upfront contract required. Common variations data engineers encounter:
        </p>
        <ul className="mt-2 list-inside list-disc space-y-1 text-slate-300">
          <li>
            <strong className="text-white">On-Demand</strong> — default hourly/per-request pricing; maximum
            flexibility, highest unit cost for steady 24/7 workloads.
          </li>
          <li>
            <strong className="text-white">Reserved capacity / Savings Plans</strong> — commit to consistent
            usage (1 or 3 years) for lower rates on EC2, Lambda, SageMaker, and related compute.
          </li>
          <li>
            <strong className="text-white">Spot Instances</strong> — spare EC2 capacity at steep discount;
            AWS can reclaim with short notice — great for fault-tolerant batch Spark, risky for singleton
            databases.
          </li>
        </ul>
      </Definition>

      <LessonSection title="Pricing models in DE context">
        <ContentStep number={1} title="On-Demand — default choice for variable load">
          <p className="text-slate-300">
            Glue jobs that run twice a day, Athena ad hoc queries, and dev Redshift clusters fit on-demand
            well — you pay only when jobs run (plus storage always-on for S3).
          </p>
        </ContentStep>
        <ContentStep number={2} title="Savings Plans / Reserved — steady baseline">
          <p className="text-slate-300">
            If baseline EC2 or Lambda spend is predictable after six months of Cost Explorer data, a
            Compute Savings Plan can cut 20–40%+ off on-demand rates. Commit only after measuring —
            over-committing wastes money.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Spot — batch at discount">
          <p className="text-slate-300">
            EMR or Spark on Spot for idempotent transforms: checkpoint to S3, tolerate node loss. Do not
            run primary RDS on Spot — interruption is by design.
          </p>
        </ContentStep>
        <Example title="Cost estimation mindset" caption="Before launching a new pipeline">
{`1. List services: S3 storage GB, Glue DPU-hours, Athena TB scanned, data transfer
2. Use AWS Pricing Calculator (calculator.aws) for a monthly estimate
3. Add 20–30% buffer for dev reruns and schema mistakes
4. Set Budgets + alerts at 50%, 80%, 100% of estimate`}
        </Example>
        <Callout variant="tip" title="AWS Pricing Calculator">
          The public <strong className="text-white">AWS Pricing Calculator</strong> builds shareable estimates
          without touching your account. Use it in design reviews when stakeholders ask &quot;what will this
          lake cost?&quot;
        </Callout>
      </LessonSection>

      <Definition term="Tagging for chargeback">
        <p>
          <strong className="text-white">Tags</strong> are key-value labels on resources (and often
          propagated to billing). Consistent tags let Cost Explorer show spend by team, project, or
          environment — essential for chargeback and finding rogue dev clusters.
        </p>
      </Definition>

      <LessonSection title="Recommended tag strategy">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Tag key</th>
                <th className="px-4 py-3">Example values</th>
                <th className="px-4 py-3">Why it matters</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Environment', 'dev, staging, prod', 'Separate experimental spend from production SLAs'],
                ['Project', 'customer-360, finance-mart', 'Allocate lake/warehouse cost to product lines'],
                ['Owner', 'team-data-platform', 'Who to ping when spend spikes'],
                ['CostCenter', 'CC-1042', 'Finance chargeback and budget ownership'],
              ].map(([key, values, why]) => (
                <tr key={key} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{key}</td>
                  <td className="px-4 py-3">{values}</td>
                  <td className="px-4 py-3">{why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ContentStep number={1} title="Enforce with policy">
          <p className="text-slate-300">
            Use SCPs or tag policies in Organizations to require tags on create — untagged S3 buckets and
            EC2 instances become visible in reports as &quot;untagged&quot; debt to fix.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Activate cost allocation tags">
          <p className="text-slate-300">
            In the billing console, activate user-defined tags for Cost Explorer. Without activation, tags
            exist on resources but do not appear on invoices.
          </p>
        </ContentStep>
      </LessonSection>

      <Definition term="AWS Organizations">
        <p>
          <strong className="text-white">AWS Organizations</strong> centrally manages multiple AWS
          accounts under one organization unit (OU) tree — consolidated billing, Service Control Policies
          (SCPs), and cross-account IAM roles.
        </p>
        <p className="mt-2 text-slate-300">
          A common <strong className="text-white">multi-account landing zone</strong> pattern: separate
          accounts for prod data platform, non-prod, security audit (CloudTrail log archive), and sandbox
          — blast radius containment and clearer cost attribution.
        </p>
      </Definition>

      <LessonSection title="Organizations — high-level DE layout">
        <Flowchart
          title="Multi-account landing zone (teaser)"
          chart={`flowchart TB
  ORG[AWS Organization]
  ORG --> MGMT[Management account]
  ORG --> PROD[Prod account — lake + warehouse]
  ORG --> NONPROD[Non-prod account — Glue dev]
  ORG --> LOG[Log archive account — CloudTrail]
  ORG --> SANDBOX[Sandbox account — experiments]
  MGMT --> BILL[Consolidated billing + SCPs]`}
        />
        <Callout variant="insight">
          You do not need Organizations on day one of learning, but production DE platforms almost always
          outgrow a single account. IAM and CloudTrail lessons connect here — cross-account roles for
          Glue reading prod S3 from a tooling account, etc.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'On-Demand for flexibility; Savings Plans/Reserved for steady compute; Spot for interruptible batch — match model to workload.',
          'Estimate with AWS Pricing Calculator; tag resources (Environment, Project, Owner, CostCenter) and activate cost allocation tags.',
          'AWS Organizations enables multi-account landing zones — prod/non-prod/log archive separation with consolidated billing.',
        ]}
      />
    </LessonArticle>
  )
}
