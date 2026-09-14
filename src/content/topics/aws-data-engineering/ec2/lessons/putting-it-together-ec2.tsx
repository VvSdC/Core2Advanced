import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function PuttingItTogetherEc2() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="EC2 is compute you own — use it deliberately">
        You covered instance families, EBS storage, networking, scaling, placement, monitoring, cost models,
        Python/Airflow patterns, and how EC2 compares to Lambda and Glue. EC2 remains the foundation when
        you need custom orchestration or long-running workers — but S3 is where the lake actually lives.
        This checkpoint ties the EC2 thread before you move to object storage.
      </Callout>

      <Definition term="EC2 mental model for data engineering">
        <p>
          Pick the <strong className="text-white">right family and size</strong>; persist state on{' '}
          <strong className="text-white">EBS or S3</strong>, not instance store alone; lock down{' '}
          <strong className="text-white">security groups</strong>; attach an{' '}
          <strong className="text-white">IAM instance profile</strong>; scale stateless workers with{' '}
          <strong className="text-white">ASG + Launch Templates</strong>; observe with CloudWatch Agent
          and SSM; optimize with Spot/Savings Plans and stop/terminate discipline.
        </p>
      </Definition>

      <LessonSection title="EC2 map — intermediate through advanced">
        <Flowchart
          title="EC2 sub-topic map"
          chart={`flowchart TB
  START[EC2 complete path]
  START --> FAM[Instance families — M C R I G]
  START --> EBS[EBS basics and volume types]
  START --> SNAP[Snapshots encryption AMI]
  START --> NET[ENI and Security Groups]
  START --> ASG[Auto Scaling and Launch Templates]
  START --> PLACE[Placement Dedicated Hibernate]
  START --> MON[Monitoring CloudWatch Agent SSM]
  START --> COST[Pricing optimization]
  START --> PY[Python ETL and Airflow on EC2]
  START --> CMP[EC2 vs Lambda vs Glue]
  FAM --> S3NEXT
  EBS --> S3NEXT
  SNAP --> S3NEXT
  NET --> S3NEXT
  ASG --> S3NEXT
  PLACE --> S3NEXT
  MON --> S3NEXT
  COST --> S3NEXT
  PY --> S3NEXT
  CMP --> S3NEXT
  S3NEXT[S3 — object storage next sub-topic]`}
        />
      </LessonSection>

      <LessonSection title="Full EC2 checkpoint — can you explain…">
        <ContentStep number={1} title="Instance selection">
          <p className="text-slate-300">
            When would you pick R over C for Spark executors? When is G family justified in a DE pipeline?
          </p>
        </ContentStep>
        <ContentStep number={2} title="Storage">
          <p className="text-slate-300">
            EBS vs instance store for Airflow logs vs Spark shuffle spill? When gp3 throughput vs io2 IOPS?
            What happens to EBS on terminate vs stop?
          </p>
        </ContentStep>
        <ContentStep number={3} title="Network">
          <p className="text-slate-300">
            Why are security groups stateful? How do you allow an EC2 worker to reach RDS without exposing
            Postgres to the internet?
          </p>
        </ContentStep>
        <ContentStep number={4} title="Scaling">
          <p className="text-slate-300">
            What does a Launch Template contain? How would you scale ETL workers on SQS backlog?
          </p>
        </ContentStep>
        <ContentStep number={5} title="Ops and cost">
          <p className="text-slate-300">
            What metrics require CloudWatch Agent? When Spot vs Savings Plans? Stop vs terminate cost impact?
          </p>
        </ContentStep>
        <ContentStep number={6} title="Architecture">
          <p className="text-slate-300">
            Sketch Airflow on EC2 with RDS metadata. How does instance profile replace access keys? When
            migrate a workload from EC2 to Glue?
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Interview-style quick checks">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Question</th>
                <th className="px-4 py-3">Strong answer sketch</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                [
                  'EBS vs instance store?',
                  'EBS persists across stop, network block storage; instance store ephemeral, fast local NVMe, lost on stop/terminate.',
                ],
                [
                  'Security group vs NACL?',
                  'SG: stateful, instance ENI level; NACL: stateless subnet level — DE interviews often focus on SG.',
                ],
                [
                  'Instance profile purpose?',
                  'Wraps IAM role for EC2; metadata service delivers temporary creds to boto3 — no static keys.',
                ],
                [
                  'ASG + Launch Template?',
                  'Template = AMI, type, profile, user data; ASG maintains capacity, health checks, scaling policies.',
                ],
                [
                  'Spot for ETL?',
                  'Yes for idempotent batch workers with checkpoint to S3; no for singleton scheduler without HA.',
                ],
                [
                  'Lambda vs Glue vs EC2?',
                  'Lambda: short event-driven; Glue: managed Spark/catalog; EC2: custom deps, Airflow, long/always-on.',
                ],
                [
                  'Default EBS encryption?',
                  'Encrypt by default at account level; snapshots inherit; KMS CMK for cross-account AMI sharing.',
                ],
                [
                  'Why Session Manager?',
                  'Shell without SSH port 22; IAM audited; works in private subnets.',
                ],
              ].map(([question, answer]) => (
                <tr key={question} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{question}</td>
                  <td className="px-4 py-3">{answer}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Next up: S3">
        <p className="text-slate-300">
          EC2 workers come and go; the lake persists in{' '}
          <strong className="text-white">Amazon S3</strong>. Next sub-topic: buckets, prefixes, storage
          classes, lifecycle policies, encryption, and event-driven ingest — the durability layer every
          pipeline you built on EC2, Lambda, and Glue writes to.
        </p>
        <Callout variant="tip">
          Before S3: verify you can draw one diagram — Airflow worker (EC2) with instance profile → read
          raw S3 → write curated S3 — with SG, private subnet, and no public DB ports. That single picture
          covers half of EC2 DE interviews.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'EC2 DE stack: right family, EBS persistence, SG + private subnet, instance profile IAM, ASG for stateless scale.',
          'Monitor memory/disk with CloudWatch Agent; operate with SSM Session Manager; optimize with Spot, Savings Plans, stop schedules.',
          'Airflow/Python on EC2 is valid; hybrid with Lambda ingest and Glue Spark is common at scale.',
          'Interview ready: EBS vs instance store, SG statefulness, profile creds, ASG scaling signals, EC2 vs Lambda vs Glue trade-offs.',
          'Next sub-topic: S3 — durable object storage at the center of the data lake.',
        ]}
      />
    </LessonArticle>
  )
}
