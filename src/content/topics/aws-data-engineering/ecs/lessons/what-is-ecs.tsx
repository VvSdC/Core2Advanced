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

export function WhatIsEcs() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="You have an image — now who runs it?">
        Running one container on your laptop is easy: <code className="text-core-400">docker run</code>.
        Running dozens of pipeline containers in production is not — something has to pick a machine, start
        the container, restart it when it crashes, give it an IAM identity, put it in the right subnet, and
        ship its logs. That &quot;something&quot; is a{' '}
        <strong className="text-white">container orchestrator</strong>, and on AWS the native one is ECS.
      </Callout>

      <Definition term="Amazon ECS">
        <p>
          <strong className="text-white">Amazon Elastic Container Service (ECS)</strong> is a fully managed
          container orchestration service. You describe what to run (image, CPU, memory, roles, networking)
          and how many copies; ECS decides where to place them, starts them, watches their health, and
          replaces failed ones. It integrates natively with IAM, VPC, Elastic Load Balancing, CloudWatch,
          Secrets Manager, EventBridge, and Step Functions.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: ECS is{' '}
          <span className="text-core-400">airport ground control</span>. Planes are containers, gates and
          runways are compute capacity. Ground control does not fly the planes — it decides which gate each
          one uses, clears departures, and reroutes when a gate breaks.
        </p>
      </Definition>

      <LessonSection title="What an orchestrator actually does">
        <ContentStep number={1} title="Schedules containers onto capacity">
          <p className="text-slate-300">
            You ask for a task with 2 vCPU and 8 GB. ECS finds room — on Fargate it requests right-sized
            serverless capacity; on EC2 it picks an instance with enough free CPU and memory.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Restarts and replaces failures">
          <p className="text-slate-300">
            If a queue-worker container crashes or fails its health check, an ECS service starts a
            replacement automatically. Batch tasks are simply marked stopped with an exit code you can alarm
            on.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Scales and integrates">
          <p className="text-slate-300">
            Services scale the number of tasks with Application Auto Scaling — for example on SQS backlog.
            Each task gets its own IAM role, its own network interface in your VPC, and log streaming to
            CloudWatch Logs.
          </p>
        </ContentStep>
        <Flowchart
          title="You declare, ECS makes it true"
          chart={`flowchart LR
  YOU[You or scheduler] --> API[ECS control plane]
  API --> PLACE[Place task on capacity]
  PLACE --> FG[Fargate]
  PLACE --> EC2[EC2 container instances]
  FG --> RUN[Running container]
  EC2 --> RUN
  RUN --> HEALTH[Health and exit code watched]
  HEALTH -->|failed service task| PLACE`}
        />
      </LessonSection>

      <LessonSection title="Pricing and ECS vs EKS">
        <ContentStep number={1} title="The control plane is free">
          <p className="text-slate-300">
            ECS itself has no extra charge. You pay for the capacity your tasks use — Fargate vCPU and memory
            per second, or the EC2 instances in your cluster — plus normal charges for logs, data transfer,
            and ECR storage.
          </p>
        </ContentStep>
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Aspect</th>
                <th className="px-4 py-3">Amazon ECS</th>
                <th className="px-4 py-3">Amazon EKS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Model', 'AWS-native orchestrator', 'Managed Kubernetes'],
                ['Learning curve', 'Small — a few concepts', 'Large — pods, deployments, Helm, operators'],
                ['Control plane cost', 'No charge', 'Hourly fee per cluster'],
                ['Portability', 'AWS only', 'Kubernetes skills and manifests move across clouds'],
                ['Typical DE fit', 'Batch jobs and workers for AWS-first teams', 'Teams already standardized on Kubernetes, Spark on K8s'],
              ].map(([aspect, ecs, eks]) => (
                <tr key={aspect} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{aspect}</td>
                  <td className="px-4 py-3">{ecs}</td>
                  <td className="px-4 py-3">{eks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="insight">
          Interview framing: pick ECS when you want containers with the least operational overhead on AWS;
          pick EKS when the organization already runs Kubernetes or needs its ecosystem. Both can run on
          Fargate.
        </Callout>
      </LessonSection>

      <LessonSection title="A first glance at the console and CLI">
        <p className="text-slate-300">
          In the console, ECS shows clusters first; inside a cluster you see services, running tasks, and
          stopped tasks with their exit codes. The CLI mirrors the same nouns.
        </p>
        <Example title="List clusters and tasks" caption="Read-only commands — safe to try in any account">
{`aws ecs list-clusters
# {
#   "clusterArns": [
#     "arn:aws:ecs:us-east-1:111122223333:cluster/de-etl-cluster-prod"
#   ]
# }

aws ecs list-tasks --cluster de-etl-cluster-prod --desired-status STOPPED

aws ecs describe-tasks --cluster de-etl-cluster-prod \\
  --tasks arn:aws:ecs:us-east-1:111122223333:task/de-etl-cluster-prod/0a1b2c3d4e \\
  --query "tasks[0].containers[0].[exitCode,reason]"`}
        </Example>
        <Callout variant="tip" title="First place to look when a job fails">
          Check the stopped task&apos;s <code className="text-core-400">stoppedReason</code> and container{' '}
          <code className="text-core-400">exitCode</code>, then open its CloudWatch log stream. Image pull
          errors, out-of-memory kills, and application exceptions each look different there.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'ECS is AWS’s managed container orchestrator — it places, starts, restarts, and scales containers you describe.',
          'It integrates natively with IAM, VPC, load balancers, CloudWatch, Secrets Manager, EventBridge, and Step Functions.',
          'The ECS control plane is free; you pay for Fargate or EC2 capacity plus logs, transfer, and ECR storage.',
          'ECS favors AWS-native simplicity; EKS brings Kubernetes portability and ecosystem at higher complexity.',
          'Debug failed jobs from stoppedReason, exitCode, and the task’s CloudWatch log stream.',
        ]}
      />
    </LessonArticle>
  )
}
