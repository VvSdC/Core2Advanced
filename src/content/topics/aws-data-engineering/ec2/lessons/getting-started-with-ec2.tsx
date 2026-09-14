import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function GettingStartedWithEc2() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Why EC2 comes right after IAM">
        You now know who is allowed to touch AWS resources — users, groups, roles, and policies. The next
        question every data pipeline raises is: <strong className="text-white">where does the code
        actually run?</strong> EC2 (Elastic Compute Cloud) gives you virtual servers in the cloud. It is
        the first compute service in this track because many data engineering workloads — custom ETL
        scripts, Airflow schedulers, long-running batch jobs — still need a machine you control end to
        end before we introduce serverless options like Lambda and managed Glue.
      </Callout>

      <Definition term="What is EC2?">
        <p>
          <strong className="text-white">EC2</strong> is AWS&apos;s service for renting virtual machines
          called <strong className="text-white">instances</strong>. You pick an operating system (usually
          Linux), CPU and memory size, storage, and networking — then SSH in and run Python, Spark, dbt,
          or an Airflow worker just like on a laptop, except the machine lives in an AWS data center.
        </p>
        <p className="mt-2 text-slate-300">
          Think of EC2 as <span className="text-core-400">a computer in the cloud you can start, stop,
          resize, and throw away</span> when a batch job finishes — without buying hardware or waiting for
          IT to rack a server.
        </p>
      </Definition>

      <LessonSection title="Roadmap for this sub-topic">
        <p className="text-slate-300">
          We build EC2 in layers so launch wizard details do not hit you on day one. Follow this order:
        </p>
        <ContentStep number={1} title="Concepts — what EC2 is and when DE uses it">
          <p className="text-slate-300">
            Understand virtual servers, Linux vs Windows at a high level, and why data engineers reach for
            EC2 when managed services are not enough — custom dependencies, long jobs, or orchestration
            tools like Airflow.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Instance types and pricing">
          <p className="text-slate-300">
            Learn instance families (general, compute, memory) and pricing models: On-Demand for
            sandboxes, Reserved for steady workloads, Spot for fault-tolerant batch ETL.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Launch, network, and access">
          <p className="text-slate-300">
            AMIs, the launch wizard, key pairs, public vs private IP, security groups (teaser), user data
            bootstrap scripts, and SSH — everything needed to get a beginner DE sandbox running.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Putting it together and what comes next">
          <p className="text-slate-300">
            A launch checklist, then deeper topics in later lessons: EBS volumes, security group rules,
            Auto Scaling Groups, and how EC2 compares to Lambda for serverless ETL.
          </p>
        </ContentStep>
        <Flowchart
          title="EC2 sub-topic path"
          chart={`flowchart LR
  A[Getting started] --> B[What is EC2]
  B --> C[Instance types and pricing]
  C --> D[AMI and launch]
  D --> E[Networking basics]
  E --> F[User data and metadata]
  F --> G[SSH and access]
  G --> H[Putting it together]
  H --> I[EBS and SG — next module]`}
        />
      </LessonSection>

      <LessonSection title="Vocabulary you will use every day">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Word</th>
                <th className="px-4 py-3">Friendly meaning</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Instance', 'A running virtual server — your EC2 machine with CPU, RAM, and an OS'],
                ['AMI', 'Amazon Machine Image — a template snapshot (OS + optional software) used to launch new instances'],
                ['Key pair', 'A public/private key pair for SSH login to Linux instances — like a lock and key instead of a password'],
                ['Security group', 'A virtual firewall attached to an instance — controls which inbound and outbound traffic is allowed'],
                ['EBS', 'Elastic Block Store — persistent disk volumes attached to instances; your scripts and data survive reboots'],
              ].map(([word, meaning]) => (
                <tr key={word} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{word}</td>
                  <td className="px-4 py-3">{meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip" title="Instance vs server — same idea">
          In AWS docs you will see &quot;instance&quot; everywhere. For beginners: instance = your virtual
          server. When someone says &quot;spin up an EC2,&quot; they mean launch a new instance from an AMI.
        </Callout>
      </LessonSection>

      <LessonSection title="How launching an instance fits together">
        <p className="text-slate-300">
          Before you click Launch in the Console, it helps to see the full path: pick a template, wire
          networking, attach storage, then connect. IAM roles (from the previous sub-topic) let the
          instance call S3 without embedding access keys in your ETL script.
        </p>
        <Flowchart
          title="Launch → network → storage → SSH"
          chart={`flowchart LR
  L[Choose AMI and instance type]
  L --> N[VPC subnet public or private IP]
  N --> S[EBS root volume size and type]
  S --> SG[Security group — allow SSH from your IP]
  SG --> KP[Key pair for Linux login]
  KP --> UD[Optional user data bootstrap script]
  UD --> R[IAM instance profile for S3 access]
  R --> SSH[SSH in and run ETL or Airflow]`}
        />
        <Callout variant="insight">
          A common beginner mistake: launch an instance with no security group rule for SSH, then wonder
          why connection times out. The instance is running — the firewall is blocking you. We cover
          security groups in depth later; for now, know they sit between the internet and your machine.
        </Callout>
      </LessonSection>

      <LessonSection title="Why data engineers care about EC2">
        <ContentStep number={1} title="Custom ETL when Glue is not enough">
          <p className="text-slate-300">
            Glue handles many Spark jobs, but sometimes you need a specific Python library version, a
            legacy JDBC driver, or a one-off migration script. EC2 gives you full control over the OS and
            packages.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Orchestration and long-running jobs">
          <p className="text-slate-300">
            Self-hosted Airflow, Prefect agents, or a nightly 6-hour batch that exceeds Lambda&apos;s
            timeout — these often live on EC2 (or containers on EC2). You pay while the machine runs, then
            stop it when idle.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Bridge before serverless">
          <p className="text-slate-300">
            Understanding EC2 makes Lambda and Fargate clearer later: same ideas (CPU, memory, network,
            IAM role), but AWS manages the server for you. Many teams run hybrid pipelines — Glue for
            Spark, EC2 for Airflow, Lambda for small triggers.
          </p>
        </ContentStep>
      </LessonSection>

      <KeyTakeaways
        items={[
          'EC2 follows IAM in the track — identity is settled; now you need a place to run ETL code, Airflow, and long batch jobs.',
          'This sub-topic moves from concepts → instance types/pricing → launch/network/access → putting it together.',
          'Core vocabulary: instance, AMI, key pair, security group, EBS.',
          'Launch path: AMI + type → network → EBS → security group → key pair → optional user data + IAM role → SSH.',
        ]}
      />
    </LessonArticle>
  )
}
