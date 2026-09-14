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

export function InstanceTypesAndPricingModels() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Shopping for a virtual machine">
        Launching EC2 is like picking a laptop: more CPU for heavy computation, more RAM for big
        in-memory joins, faster disk for I/O-bound loads. AWS names instance types with a letter family
        and a size number — e.g. <code className="text-core-400">t3.medium</code>. You also choose{' '}
        <em>how</em> you pay: by the hour, with a discount for commitment, or at steep discount on spare
        capacity. Data engineers care about both because batch cost adds up fast.
      </Callout>

      <Definition term="Instance type">
        <p>
          An <strong className="text-white">instance type</strong> defines the combination of CPU, memory,
          network performance, and sometimes specialized hardware (GPU, high disk throughput) for an EC2
          instance. Types are grouped into <strong className="text-white">families</strong> identified
          by a letter prefix; the number after the dot indicates size within that family.
        </p>
        <p className="mt-2 text-slate-300">
          Example: <code className="text-core-400">m6i.large</code> —{' '}
          <code className="text-core-400">m</code> = general purpose,{' '}
          <code className="text-core-400">6i</code> = generation and processor line,{' '}
          <code className="text-core-400">large</code> = one step up from small in that family.
        </p>
      </Definition>

      <LessonSection title="Instance families — a teaser">
        <p className="text-slate-300">
          You do not need to memorize every type. Know the families and match them to workload shape:
        </p>
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Family</th>
                <th className="px-4 py-3">Balanced for</th>
                <th className="px-4 py-3">DE example</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['T (e.g. t3)', 'Burstable CPU — cheap baseline, burst when needed', 'Dev sandbox, Airflow scheduler with light DAGs'],
                ['M (e.g. m6i)', 'General purpose — even CPU and memory', 'Mid-size Python ETL, modest Spark driver'],
                ['C (e.g. c6i)', 'Compute optimized — more CPU per GB RAM', 'CPU-heavy transforms, compression, parsing'],
                ['R (e.g. r6i)', 'Memory optimized — large RAM', 'In-memory pandas, large joins before writing to S3'],
                ['I (e.g. i3)', 'Storage optimized — fast local NVMe', 'High-throughput staging before bulk S3 upload'],
                ['G / P', 'GPU accelerated', 'ML feature prep, deep learning (specialized DE paths)'],
              ].map(([family, balanced, example]) => (
                <tr key={family} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{family}</td>
                  <td className="px-4 py-3">{balanced}</td>
                  <td className="px-4 py-3">{example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip" title="Start small for learning">
          A <code className="text-core-400">t3.micro</code> or <code className="text-core-400">t3.small</code>{' '}
          in Free Tier is enough for SSH practice and tiny ETL scripts. Scale up when jobs OOM (out of
          memory) or run too long — not on day one.
        </Callout>
      </LessonSection>

      <LessonSection title="On-Demand — pay by the hour">
        <Definition term="On-Demand">
          <p>
            <strong className="text-white">On-Demand</strong> instances have no upfront commitment. You pay
            per second (with a one-minute minimum) while the instance runs. Stop or terminate anytime — no
            penalty, no planning required.
          </p>
        </Definition>
        <ContentStep number={1} title="Best for">
          <p className="text-slate-300">
            Learning sandboxes, unpredictable workloads, and jobs that run a few hours a week. Your first
            DE EC2 should almost always be On-Demand until you understand usage patterns.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Watch the clock">
          <p className="text-slate-300">
            Forgetting to stop a large instance over a weekend is a classic billing surprise. Set an alarm
            or use Instance Stop Schedule habits — we reinforce this in the putting-it-together lesson.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Reserved Instances and Savings Plans — commit for discount">
        <Definition term="Reserved / Savings Plans">
          <p>
            <strong className="text-white">Reserved Instances</strong> (and the more flexible{' '}
            <strong className="text-white">Compute Savings Plans</strong>) trade a one- or three-year
            commitment (or steady spend pledge) for lower hourly rates — often 30–70% off On-Demand.
          </p>
        </Definition>
        <ContentStep number={1} title="DE use case">
          <p className="text-slate-300">
            A production Airflow scheduler that runs 24/7 in the same Region and instance family is a
            strong candidate. You know the instance type will not change every week.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Not for experiments">
          <p className="text-slate-300">
            Do not buy Reserved capacity for a class project or a pipeline you have not run for a month.
            Wait until utilization is stable and finance agrees on the term length.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Spot Instances — spare capacity at steep discount">
        <Definition term="Spot">
          <p>
            <strong className="text-white">Spot Instances</strong> use AWS&apos;s unused capacity at up to
            90% discount versus On-Demand. The tradeoff: AWS can{' '}
            <strong className="text-white">interrupt</strong> (terminate) your instance with two minutes
            notice when capacity is needed elsewhere.
          </p>
        </Definition>
        <ContentStep number={1} title="Perfect for fault-tolerant batch">
          <p className="text-slate-300">
            Nightly ETL that writes idempotent partitions to S3, Spark jobs with checkpointing, or
            embarrassingly parallel transforms where one lost worker can retry — Spot saves serious money at
            scale.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Wrong for Airflow scheduler">
          <p className="text-slate-300">
            Do not run your only Airflow scheduler on Spot without failover. Interruption kills the
            orchestrator and stalls every downstream DAG until you recover.
          </p>
        </ContentStep>
        <Example title="Pricing model picker" caption="Plain English for DE">
{`Situation                              Model
Learning / ad-hoc debugging              On-Demand
24/7 Airflow scheduler (stable)          Reserved or Savings Plan
Nightly S3-to-S3 batch, retry OK         Spot (+ On-Demand fallback)
Unpredictable quarterly backfill         On-Demand or mixed Spot fleet
Production SLA, no interruptions         On-Demand or Reserved — not Spot alone`}
        </Example>
        <Flowchart
          title="Choosing a pricing model"
          chart={`flowchart TD
  Q[Is the job fault-tolerant and batch?]
  Q -->|Yes| S[Consider Spot with retry logic]
  Q -->|No| Q2[Runs 24/7 same size?]
  Q2 -->|Yes| R[Reserved or Savings Plan]
  Q2 -->|No| O[On-Demand — stop when done]
  S --> M[Mix Spot workers + On-Demand coordinator]`}
        />
        <Callout variant="insight">
          EMR and Auto Scaling Groups can blend Spot and On-Demand workers automatically — a pattern you
          will see when batch cost optimization becomes a team goal. For now, know Spot exists and fits
          retry-friendly ETL, not your only database server.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Instance types = CPU + RAM + network (+ sometimes GPU/disk); families T/M/C/R/I map to workload shape.',
          'On-Demand: no commitment, best for sandboxes and unpredictable jobs — stop instances to save money.',
          'Reserved / Savings Plans: discount for steady 24/7 workloads like a production Airflow scheduler.',
          'Spot: up to ~90% off for interruptible batch ETL with retry/idempotent writes — not for sole critical coordinators.',
        ]}
      />
    </LessonArticle>
  )
}
