import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function FargateVsEc2LaunchTypes() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Same task definition, different engine room">
        ECS decides <em>what</em> runs; you still choose <em>where</em> it runs. The two classic choices are{' '}
        <strong className="text-white">Fargate</strong>, where AWS supplies the compute per task, and{' '}
        <strong className="text-white">EC2</strong>, where your tasks run on instances in your own Auto
        Scaling group. For most data engineering jobs, Fargate is the default — this lesson explains why and
        when to deviate.
      </Callout>

      <Definition term="Launch type and capacity provider">
        <p>
          A <strong className="text-white">launch type</strong> (FARGATE or EC2) is the simplest way to tell
          ECS where to run a task. A <strong className="text-white">capacity provider</strong> is the more
          flexible version: it links a cluster to Fargate, Fargate Spot, or an EC2 Auto Scaling group and can
          split tasks across them with weights. Same idea — where the containers physically execute.
        </p>
      </Definition>

      <LessonSection title="Fargate — serverless containers">
        <ContentStep number={1} title="No hosts to manage">
          <p className="text-slate-300">
            No AMIs, no patching, no cluster capacity planning. Each task runs inside its own isolation
            boundary — it does not share an underlying kernel, CPU, or memory with other tasks.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Pay per second for what the task requests">
          <p className="text-slate-300">
            Billing is per vCPU-second and GB-second from image pull until the task stops (with a one-minute
            minimum). A 40-minute export at 2 vCPU and 8 GB costs only those 40 minutes.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Size limits — check current docs">
          <p className="text-slate-300">
            Common sizes range from 0.25 vCPU up to 16 vCPU with up to 120 GB of memory, and AWS now lists a
            larger 32 vCPU tier as well. Ephemeral storage defaults to 20 GiB and can be raised to 200 GiB per
            task. Limits grow over time, so confirm them in the Fargate documentation before sizing.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Startup time — seconds, not milliseconds">
          <p className="text-slate-300">
            A Fargate task typically needs tens of seconds to provision, pull the image, and start. That is
            irrelevant for a 40-minute nightly export but matters for sub-second request handling — one more
            reason tiny event handlers stay on Lambda. Smaller images start faster.
          </p>
        </ContentStep>
        <Callout variant="info" title="Fargate Spot">
          Fargate Spot runs tasks on spare capacity at a steep discount, but AWS can reclaim it with a
          two-minute warning. It suits retryable batch jobs and backfills — covered in the cost optimization
          lesson.
        </Callout>
      </LessonSection>

      <LessonSection title="EC2 capacity — and Managed Instances">
        <ContentStep number={1} title="EC2 launch type or Auto Scaling group capacity provider">
          <p className="text-slate-300">
            You run container instances — EC2 machines with the ECS agent — in an Auto Scaling group. ECS
            packs tasks onto them. You own the AMI, patching, and scaling, but gain full control of instance
            types.
          </p>
        </ContentStep>
        <ContentStep number={2} title="When EC2 is worth it">
          <p className="text-slate-300">
            GPUs for ML inference or training, instance sizes bigger than Fargate offers, very large steady
            fleets where Reserved Instances or Savings Plans on packed hosts beat Fargate pricing, and{' '}
            <strong className="text-white">daemon</strong> tasks that must run one per host, such as a log or
            monitoring agent.
          </p>
        </ContentStep>
        <ContentStep number={3} title="ECS Managed Instances — the middle ground">
          <p className="text-slate-300">
            A newer option where ECS provisions, patches, and scales EC2 instances for you while you still
            choose instance attributes — including GPU families. Think &quot;EC2 flexibility with less host
            management.&quot; It is still evolving, so check current docs for supported features and
            pricing before adopting it.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Side-by-side comparison">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Aspect</th>
                <th className="px-4 py-3">Fargate</th>
                <th className="px-4 py-3">EC2 capacity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Servers to manage', 'None', 'Auto Scaling group, AMIs, patching'],
                ['Billing', 'Per task vCPU and memory per second', 'Per instance, whether full or idle'],
                ['Isolation', 'Per-task boundary', 'Tasks share the host kernel'],
                ['GPUs', 'Not supported', 'Supported'],
                ['Max task size', 'Bounded by Fargate tiers', 'Up to the largest instance type'],
                ['Daemon tasks', 'Not supported', 'Supported'],
                ['Best DE fit', 'Batch ETL, dbt, workers, connectors', 'GPU jobs, huge steady fleets, special hardware'],
              ].map(([aspect, fargate, ec2]) => (
                <tr key={aspect} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{aspect}</td>
                  <td className="px-4 py-3">{fargate}</td>
                  <td className="px-4 py-3">{ec2}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Flowchart
          title="Choosing capacity for a DE workload"
          chart={`flowchart TD
  START[New container workload] --> GPU{Needs GPU or special instance}
  GPU -->|yes| MI[EC2 capacity or Managed Instances]
  GPU -->|no| BIG{Fits Fargate CPU and memory}
  BIG -->|no| MI
  BIG -->|yes| STEADY{Huge steady 24x7 fleet with ops team}
  STEADY -->|yes| EVAL[Compare EC2 with Savings Plans]
  STEADY -->|no| FG[Fargate default]
  FG --> SPOT{Retryable batch job}
  SPOT -->|yes| FGS[Consider Fargate Spot]`}
        />
        <Callout variant="insight">
          Interview framing: &quot;We default to Fargate for data jobs because nobody on the data team wants
          to patch container hosts. We only move to EC2 capacity for GPUs, oversized tasks, or when a steady
          fleet is large enough that packing instances clearly saves money.&quot;
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Launch types and capacity providers decide where tasks run — Fargate, Fargate Spot, EC2, or ECS Managed Instances.',
          'Fargate: no hosts, per-task isolation, per-second billing; sizes up to 16 vCPU / 120 GB are common and ephemeral storage reaches 200 GiB.',
          'EC2 capacity: you manage instances but get GPUs, larger sizes, daemon tasks, and cheap packing for big steady fleets.',
          'ECS Managed Instances offers EC2 choice with AWS-managed hosts — newer, so verify features before adopting.',
          'The DE default is Fargate; deviate only with a clear hardware, size, or cost reason.',
        ]}
      />
    </LessonArticle>
  )
}
