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

export function CostOptimizationAndFargateSpot() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Fargate bills by the second — so idle and oversized tasks are pure waste">
        With Fargate you never pay for a server sitting idle between jobs, but you do pay for every vCPU and GB you{' '}
        <em>request</em> while a task runs, whether your code uses it or not. The biggest savings in DE container
        platforms come from four levers: request only what you use, run on cheaper capacity (Graviton and Spot),
        do not leave services running with nothing to do, and watch the network bill hiding in NAT gateways.
      </Callout>

      <Definition term="Fargate pricing model">
        <p>
          You pay for the vCPU and memory configured at the task level, per second, from the moment the image
          starts downloading until the task stops, with a one-minute minimum for Linux tasks. Ephemeral storage
          above the free 20 GiB is billed separately. Rates differ by Region and CPU architecture — ARM64 is
          cheaper per vCPU-hour than x86. Always check the Fargate pricing page for current numbers.
        </p>
      </Definition>

      <LessonSection title="Right-size and pick the cheaper chip">
        <ContentStep number={1} title="Right-size from Container Insights">
          <p className="text-slate-300">
            Look at peak memory and average CPU per task over a few weeks of runs. If{' '}
            <code className="text-core-400">orders-export</code> requests 4 vCPU and 16 GB but peaks at 1.2 vCPU and
            5 GB, drop to 2 vCPU and 8 GB — half the bill, still with headroom. Memory is the usual hard limit (an
            OOM kill fails the run); CPU only makes the job slower.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Graviton ARM64">
          <p className="text-slate-300">
            Setting <code className="text-core-400">runtimePlatform.cpuArchitecture</code> to{' '}
            <code className="text-core-400">ARM64</code> is often around 20% cheaper at list price, and pure-Python,
            pandas, and PyArrow workloads usually run fine because major libraries ship arm64 wheels. Build a
            multi-architecture image or an arm64-only one, and benchmark — a native dependency without arm64
            support is the usual blocker.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Fargate Spot via capacity providers">
        <ContentStep number={1} title="What Spot is">
          <p className="text-slate-300">
            <strong className="text-white">Fargate Spot</strong> runs tasks on spare AWS capacity at up to about a
            70% discount. AWS can reclaim it with a two-minute warning, delivered as a SIGTERM to your container and
            an ECS Task State Change event with <code className="text-core-400">stopCode</code> SpotInterruption.
            It supports both x86 and ARM64 Linux tasks.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Capacity provider strategy">
          <p className="text-slate-300">
            Instead of <code className="text-core-400">launchType</code>, a service or RunTask call passes a
            strategy mixing <code className="text-core-400">FARGATE</code> and{' '}
            <code className="text-core-400">FARGATE_SPOT</code>. <code className="text-core-400">base</code> sets a
            number of tasks that always run on regular Fargate; <code className="text-core-400">weight</code> splits
            the rest. Fargate does not automatically fall back to on-demand if Spot capacity is unavailable, so
            keep a base for anything latency-sensitive.
          </p>
        </ContentStep>
        <Example title="Queue workers: 1 on-demand, the rest mostly Spot" caption="Capacity provider strategy on the orders-worker service">
{`"capacityProviderStrategy": [
  { "capacityProvider": "FARGATE", "base": 1, "weight": 1 },
  { "capacityProvider": "FARGATE_SPOT", "weight": 3 }
]`}
        </Example>
        <ContentStep number={3} title="Make jobs interruption-safe">
          <p className="text-slate-300">
            Spot fits work you can redo: SQS workers (the message reappears), and idempotent batch tasks that
            overwrite one partition and are retried by Step Functions. Long single-shot jobs should checkpoint —
            for example, process files in chunks and record progress in DynamoDB — so a retry resumes rather than
            restarts. Avoid Spot for a 3-hour job with a hard morning deadline and no checkpoints.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Idle services, commitments, and the network bill">
        <ContentStep number={1} title="Scale to zero and kill zombies">
          <p className="text-slate-300">
            A dev worker service with <code className="text-core-400">desiredCount</code> 2 running all month costs
            the same as a busy one. Scale queue workers to zero when the queue is empty, prefer RunTask batch jobs
            over always-on services polling for work once a day, and tag everything with team and environment so
            Cost Explorer finds forgotten services.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Compute Savings Plans">
          <p className="text-slate-300">
            For a steady baseline, Compute Savings Plans apply to Fargate as well as EC2 and Lambda — commit to a
            dollar-per-hour spend for one or three years in exchange for a discount. Commit only to the floor you
            are sure of; cover bursts with on-demand and Spot.
          </p>
        </ContentStep>
        <ContentStep number={3} title="NAT gateway vs VPC endpoints">
          <p className="text-slate-300">
            Private tasks pulling a 1 GB image nightly and reading hundreds of GB from S3 through a NAT gateway pay
            NAT data processing on every byte. The S3 gateway endpoint is free and carries both image layers and lake
            traffic — add it first. Interface endpoints have their own hourly per-AZ charge, so they pay off at
            higher traffic or when you need to remove internet egress for security.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Worked example — monthly compute estimate">
        <p className="text-slate-300">
          Illustrative us-east-1 list prices at time of writing: x86 about $0.0405 per vCPU-hour and $0.0044 per
          GB-hour; ARM64 about $0.0324 per vCPU-hour and $0.0036 per GB-hour. Recheck before quoting numbers.
        </p>
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Workload</th>
                <th className="px-4 py-3">Setup</th>
                <th className="px-4 py-3">Approx. monthly cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['orders-export nightly, x86', '2 vCPU, 4 GB, 30 min per night, 30 nights', 'about $1.50'],
                ['orders-export nightly, ARM64', 'Same job on Graviton', 'about $1.20'],
                ['orders-worker always on, x86', '4 tasks, 1 vCPU, 2 GB, 730 hours each', 'about $144'],
                ['orders-worker autoscaled, ARM64', 'Average 1 task running, same size', 'about $29'],
                ['Same, 75% on Fargate Spot', 'Base 1 on-demand during peaks, rest Spot', 'lower still, varies with Spot price'],
              ].map(([workload, setup, cost]) => (
                <tr key={workload} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{workload}</td>
                  <td className="px-4 py-3">{setup}</td>
                  <td className="px-4 py-3">{cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="insight">
          Notice the scale: the nightly batch job costs about a dollar a month, while the idle-heavy worker service
          costs over a hundred. On Fargate, the question is rarely &quot;is the job too expensive?&quot; — it is
          &quot;what is running when nothing needs to?&quot; Two NAT gateways across two AZs can cost more than all
          your tasks combined.
        </Callout>
        <Flowchart
          title="Cost review checklist"
          chart={`flowchart TB
  START[Monthly ECS cost review]
  RS[Right size from Container Insights]
  ARM[Move to ARM64 Graviton]
  SPOT{Interruption safe}
  FS[Use Fargate Spot with base]
  OD[Keep on demand]
  IDLE[Scale idle services to zero]
  NET[Add S3 gateway endpoint]
  SP[Savings Plan for steady floor]
  START --> RS
  RS --> ARM
  ARM --> SPOT
  SPOT -->|yes| FS
  SPOT -->|no| OD
  FS --> IDLE
  OD --> IDLE
  IDLE --> NET
  NET --> SP`}
        />
      </LessonSection>

      <KeyTakeaways
        items={[
          'Fargate bills requested vCPU and memory per second with a one-minute minimum — right-size from real metrics.',
          'Graviton ARM64 is typically around 20% cheaper at list price when your dependencies support arm64.',
          'Fargate Spot offers up to about 70% off with a two-minute SIGTERM warning — use for idempotent, checkpointed work.',
          'Capacity provider strategies mix FARGATE base tasks with FARGATE_SPOT weight; there is no automatic fallback.',
          'Idle services and NAT data charges often dwarf batch compute; scale to zero and add the free S3 gateway endpoint.',
        ]}
      />
    </LessonArticle>
  )
}
