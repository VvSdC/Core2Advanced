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

export function CostOptimizationIntro() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Everyday idea">
        Leaving every light in the house on 24/7 gets expensive. Cloud is the same: resources you forget
        to turn off — idle EC2 instances, unbounded Athena scans, Redshift clusters running while nobody
        queries — show up on the bill. Cost optimization is not cheapness; it is spending deliberately on
        what delivers value.
      </Callout>

      <Definition term="Cost optimization (for data engineering)">
        <p>
          <strong className="text-white">Cost optimization</strong> means designing and operating data
          platforms so you pay for the performance and storage you actually need — no permanent
          over-provisioning, no surprise scan bills, no &quot;we will clean up S3 later&quot; forever.
        </p>
        <p className="mt-2 text-slate-300">
          Cost is a <strong className="text-white">design constraint</strong>, like latency or security.
          A pipeline that works but costs 10× the business value of the insights it enables will get
          shut down.
        </p>
      </Definition>

      <LessonSection title="Core habits — start here">
        <ContentStep number={1} title="Right-sizing">
          <p className="text-slate-300">
            Match instance types, Glue DPU counts, and Redshift node sizes to measured workload — not
            guesses from day one. If CPU averages 15%, you are likely paying for idle headroom. Downsize,
            or use autoscaling where available.
          </p>
          <Example title="Right-sizing question" caption="Ask this monthly">
{`Glue job: 20 DPUs, finishes in 20 min, CPU low
→ Try 10 DPUs — if runtime stays acceptable, halve compute cost

Redshift: ra3.xlarge cluster, disk 30% full, queries idle nights
→ Pause cluster or resize; use scheduled scaling for batch windows`}
          </Example>
        </ContentStep>
        <ContentStep number={2} title="Turn off idle resources">
          <p className="text-slate-300">
            Dev EC2 instances left running over weekends, old EMR clusters, forgotten NAT gateways, and
            Redshift clusters without auto-pause are classic leaks. Tag environments (dev/test/prod) and
            automate shutdown schedules for non-production.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Storage tiers (teaser)">
          <p className="text-slate-300">
            Not all S3 data needs instant access at Standard pricing. Lifecycle rules move cold partitions
            to Infrequent Access or Glacier; Intelligent-Tiering automates some of that. The S3 sub-topic
            goes deep — for now, remember: hot path cheap to query, cold archive cheap to store.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Serverless pay-per-use">
          <p className="text-slate-300">
            Lambda, Glue (per DPU-hour), Athena (per TB scanned), and S3 (per GB) charge for usage.
            Spiky or infrequent workloads often cost less serverless than always-on clusters — if you
            control scan size and concurrency.
          </p>
        </ContentStep>
        <Flowchart
          title="Cost as a design loop"
          chart={`flowchart TB
  A[Design pipeline] --> B[Estimate cost]
  B --> C[Build and measure]
  C --> D{Within budget?}
  D -->|No| E[Right-size / tier / schedule]
  E --> C
  D -->|Yes| F[Monitor and alert]
  F --> C`}
        />
      </LessonSection>

      <LessonSection title="Cost as a design constraint for DE">
        <ContentStep number={1} title="Partition and compress">
          <p className="text-slate-300">
            Athena bills by data scanned. Partitioning by date and using Parquet with Snappy compression
            can cut scan costs by orders of magnitude — a design choice, not a finance afterthought.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Separate dev from prod spend">
          <p className="text-slate-300">
            Use smaller samples in dev, separate accounts or budgets, and require tags so one team&apos;s
            experiment does not drain the whole org budget.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Align SLAs with spend">
          <p className="text-slate-300">
            Real-time dashboards cost more than daily batch marts. Negotiate with stakeholders: &quot;Hourly
            refresh needs X; daily refresh needs Y.&quot; Document the tradeoff instead of over-building
            silently.
          </p>
        </ContentStep>
        <Callout variant="tip" title="Billing alerts on day one">
          Set AWS Budgets and billing alarms before your first Glue job. A $50 surprise teaches more than
          a $5,000 one — but both hurt.
        </Callout>
      </LessonSection>

      <LessonSection title="Quick wins checklist">
        <ul className="list-inside list-disc space-y-2 text-slate-300">
          <li>Stop or schedule non-prod compute overnight and weekends</li>
          <li>Review top five services in Cost Explorer monthly</li>
          <li>Add S3 lifecycle rules for logs and raw dumps older than 90 days</li>
          <li>Limit Athena queries with partition filters in team runbooks</li>
          <li>Use Graviton or newer instance generations when workloads allow — often better price/performance</li>
        </ul>
        <Callout variant="insight">
          The Well-Architected Framework dedicates an entire pillar to cost optimization. Later lessons on
          S3 tiers, Redshift sizing, and tagging connect directly to habits you start here.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Cost optimization = paying for needed performance and storage, not accidental idle capacity.',
          'Core levers: right-sizing, turning off idle resources, storage tiers, and serverless pay-per-use where it fits.',
          'Treat cost like latency or security — partition data, tag environments, and align pipeline SLAs with budget.',
        ]}
      />
    </LessonArticle>
  )
}
