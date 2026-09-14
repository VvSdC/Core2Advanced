import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function AutoScalingAndLaunchTemplates() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="More workers when the queue backs up">
        Fixed-size ETL fleets waste money at 3 a.m. and stall at month-end close.{' '}
        <strong className="text-white">Auto Scaling Groups (ASG)</strong> keep a desired count of identical
        instances — adding or removing workers based on CPU, custom metrics, or schedules.{' '}
        <strong className="text-white">Launch Templates</strong> define what each new worker looks like:
        AMI, instance type, IAM profile, user data, and EBS mappings.
      </Callout>

      <Definition term="Launch Template">
        <p>
          A <strong className="text-white">Launch Template</strong> is the versioned recipe for launching
          EC2 instances: AMI ID, instance type, key pair (optional), security groups, subnet (via ASG),
          IAM instance profile, user data bootstrap script, and block device mappings. Update version 2 to
          roll out a new Python runtime without editing the ASG directly — point the ASG to{' '}
          <span className="font-mono text-sm">$Latest</span> or a pinned version for controlled rollouts.
        </p>
      </Definition>

      <Definition term="Auto Scaling Group (ASG)">
        <p>
          An <strong className="text-white">Auto Scaling Group</strong> maintains capacity across subnets
          (usually multi-AZ): min, max, and desired capacity. It launches instances from a Launch Template
          and terminates extras when scaling in. Health checks replace unhealthy nodes. For DE, ASGs back
          pools of stateless ETL workers that pull work from SQS, run a batch, and exit — or long-lived
          Celery/Airflow workers that scale on queue depth.
        </p>
      </Definition>

      <LessonSection title="Launch Template contents for ETL workers">
        <ContentStep number={1} title="AMI + instance profile">
          <p className="text-slate-300">
            Golden AMI with Python, boto3, your ETL package. Attach instance profile{' '}
            <span className="font-mono text-sm">ec2-etl-worker-role</span> (S3 read/write on pipeline
            prefixes — from IAM lessons). No access keys in user data.
          </p>
        </ContentStep>
        <ContentStep number={2} title="User data bootstrap">
          <p className="text-slate-300">
            On first boot: register with orchestrator, pull latest config from SSM Parameter Store, start
            systemd unit for worker process. Keep idempotent — ASG may launch many nodes at once during
            scale-out.
          </p>
        </ContentStep>
        <ContentStep number={3} title="EBS and network">
          <p className="text-slate-300">
            gp3 data volume for scratch; instance in private subnet; SG allows egress to S3 endpoint and
            message queue. No public IP.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Scale out ETL workers — patterns">
        <ContentStep number={1} title="Target tracking on CPU">
          <p className="text-slate-300">
            Simple: maintain average CPU near 60% across the ASG. Works for CPU-bound transforms when
            queue depth correlates with CPU. Less ideal if workers wait on I/O.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Custom metric — SQS backlog">
          <p className="text-slate-300">
            Publish <span className="font-mono text-sm">ApproximateNumberOfMessagesVisible</span> from SQS
            to CloudWatch; ASG policy adds instances when backlog &gt; threshold. Classic pattern for
            fan-out ETL: Lambda or scheduler enqueues file batches; workers scale with queue depth.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Scheduled scaling">
          <p className="text-slate-300">
            Cron at 05:00 UTC: desired capacity 20 for morning SLA; scale down to 2 at 14:00. Predictable
            batch windows without waiting for metric reaction delay.
          </p>
        </ContentStep>
        <Flowchart
          title="ASG scaling ETL workers on queue depth"
          chart={`flowchart TB
  SCHED[Airflow / EventBridge schedule]
  Q[SQS — file batch queue]
  CW[CloudWatch — backlog metric]
  ASG[Auto Scaling Group]
  LT[Launch Template — ETL worker AMI]
  W1[Worker 1]
  W2[Worker 2]
  WN[Worker N]
  S3[(S3 raw)]
  CUR[(S3 curated)]
  SCHED -->|Enqueue jobs| Q
  Q --> CW
  CW -->|Scale out policy| ASG
  ASG --> LT
  LT --> W1
  LT --> W2
  LT --> WN
  W1 -->|Pull message| Q
  W1 --> S3
  W1 --> CUR
  W2 --> Q
  WN --> Q`}
        />
        <Callout variant="insight">
          Stateless workers only: any local state must flush to S3 before scale-in terminates an instance.
          Use ASG lifecycle hooks or graceful shutdown in your worker to finish the current batch before
          termination.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Launch Templates version the EC2 recipe: AMI, type, IAM profile, user data, EBS — ASGs launch from them.',
          'ASG maintains min/desired/max capacity with health checks and multi-AZ placement.',
          'Scale ETL workers on SQS backlog custom metrics, CPU target tracking, or scheduled capacity for batch windows.',
          'Workers must be stateless — persist results to S3; handle scale-in gracefully with lifecycle hooks.',
          'Pair with IAM instance profiles and private subnets — same identity pattern as fixed EC2 ETL boxes.',
        ]}
      />
    </LessonArticle>
  )
}
