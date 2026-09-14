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

export function WhatIsEc2() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="In simple terms">
        EC2 is Amazon&apos;s way of giving you a <strong className="text-white">virtual computer</strong>{' '}
        in the cloud. You choose how powerful it is, what operating system it runs, and how long you keep
        it. When your ETL job finishes, you can stop the machine and stop paying for compute — the disk
        can stay attached if you need it tomorrow.
      </Callout>

      <Definition term="Elastic Compute Cloud (EC2)">
        <p>
          <strong className="text-white">EC2</strong> provides resizable compute capacity as virtual
          servers (<strong className="text-white">instances</strong>) in AWS Regions. &quot;Elastic&quot;
          means you can scale the number and size of instances up or down; &quot;Compute&quot; means CPU
          and memory for running code; &quot;Cloud&quot; means it runs in AWS data centers, not on your
          desk.
        </p>
        <p className="mt-2 text-slate-300">
          Unlike buying a physical server, you launch an instance in minutes, attach storage, assign an
          IAM role so it can read S3, and terminate it when the pipeline is done.
        </p>
      </Definition>

      <LessonSection title="Virtual servers in the cloud">
        <p className="text-slate-300">
          A physical server in an AWS data center hosts many EC2 instances. Hypervisor software isolates
          each customer&apos;s virtual machine — your Python ETL process cannot see your neighbor&apos;s
          database. You get a slice of CPU, RAM, and network bandwidth defined by the{' '}
          <strong className="text-white">instance type</strong> you select (covered in the next lesson).
        </p>
        <ContentStep number={1} title="You control the software stack">
          <p className="text-slate-300">
            Install pandas, Spark, ODBC drivers, or a specific Java version. Patch the OS on your schedule.
            This flexibility is why EC2 remains popular for data platforms that outgrow one-size-fits-all
            managed runtimes.
          </p>
        </ContentStep>
        <ContentStep number={2} title="AWS controls the hardware">
          <p className="text-slate-300">
            Power, cooling, physical security, and the hypervisor are AWS&apos;s responsibility under the
            shared responsibility model. You secure the OS, open ports wisely, and manage credentials.
          </p>
        </ContentStep>
        <Flowchart
          title="Your code on EC2 vs the data center"
          chart={`flowchart TB
  subgraph You["Your responsibility"]
    APP[ETL script Airflow worker]
    OS[OS patches and packages]
    FW[Security group rules]
  end
  subgraph AWS["AWS responsibility"]
    HV[Hypervisor and physical host]
    DC[Data center power and network]
  end
  APP --> OS
  OS --> HV
  FW --> APP
  HV --> DC`}
        />
      </LessonSection>

      <LessonSection title="Linux vs Windows instances (high level)">
        <p className="text-slate-300">
          When you launch an instance, the AMI determines the operating system. Most data engineering
          work on EC2 uses <strong className="text-white">Linux</strong> — Amazon Linux, Ubuntu, or
          RHEL — because Python, Spark, and open-source tooling are native there.
        </p>
        <ContentStep number={1} title="Linux — the default for DE">
          <p className="text-slate-300">
            Connect with <strong className="text-white">SSH</strong> using a key pair. Run bash scripts,
            cron jobs, systemd services for Airflow, and pip-install dependencies. This track assumes Linux
            unless noted otherwise.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Windows — when you need it">
          <p className="text-slate-300">
            Some teams run SSIS, .NET ETL, or tools that only support Windows. Connect with{' '}
            <strong className="text-white">RDP</strong> (Remote Desktop) using a password or key. Windows
            instances cost slightly more for the same size and licensing; use them when the workload
            requires it, not by default.
          </p>
        </ContentStep>
        <Callout variant="tip" title="Pick Linux for learning">
          For your first DE sandbox, choose an Amazon Linux or Ubuntu AMI. You will follow SSH tutorials
          in this sub-topic and match most open-source data stack documentation.
        </Callout>
      </LessonSection>

      <LessonSection title="When data engineering uses EC2">
        <ContentStep number={1} title="Custom ETL scripts">
          <p className="text-slate-300">
            A nightly Python job reads CSV from S3, applies business rules, writes Parquet to a processed
            prefix, and logs to CloudWatch. Glue could do this — but if you need a proprietary library or
            tight debugging with shell access, EC2 is the straightforward choice.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Airflow and orchestration">
          <p className="text-slate-300">
            Managed Airflow (MWAA) exists, but many teams self-host Apache Airflow on EC2 for cost control
            or custom plugins. The scheduler and workers run as long-lived instances; DAGs trigger Glue
            jobs, EMR clusters, or shell scripts on other EC2 boxes.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Long-running and heavy jobs">
          <p className="text-slate-300">
            Lambda caps execution at 15 minutes. A 4-hour deduplication job over terabytes, a one-time
            backfill, or a Spark driver node for a self-managed cluster — these belong on EC2 (or EMR,
            which is EC2 under the hood). You size the instance for peak memory and CPU.
          </p>
        </ContentStep>
        <Example title="DE workload fit" caption="EC2 vs managed vs serverless (preview)">
{`Workload                    Often on EC2?        Why
Custom Python ETL           Yes                  Full env control, SSH debug
Self-hosted Airflow         Yes                  Scheduler + workers on VMs
6-hour batch transform      Yes                  Exceeds Lambda timeout
Standard Spark ETL          Often Glue/EMR       Managed scaling
S3 trigger small transform  Lambda later         Event-driven, seconds not hours
Ad-hoc SQL analytics        Athena/Redshift      No server to maintain`}
        </Example>
        <Callout variant="insight">
          EC2 is not &quot;old&quot; and Lambda is not &quot;always better.&quot; Mature data platforms mix
          both: Lambda for lightweight ingestion, EC2 for orchestration and heavy custom code, Glue for
          managed Spark. Choosing compute is a design decision, not a loyalty test.
        </Callout>
      </LessonSection>

      <LessonSection title="What EC2 is not">
        <p className="text-slate-300">
          EC2 gives you a server — you still install software, patch the OS, and monitor disk space. It is
          not a data warehouse (that is Redshift), not object storage (that is S3), and not a managed Spark
          service (that is Glue or EMR). It <em>can</em> run all of those clients: your EC2 instance might
          execute <code className="text-core-400">aws s3 sync</code>, call the Athena API, or submit Spark
          jobs — but the server lifecycle is yours to manage unless you add automation later.
        </p>
      </LessonSection>

      <KeyTakeaways
        items={[
          'EC2 = virtual servers (instances) in AWS — elastic, pay-for-what-you-use compute you control at the OS level.',
          'Linux is the default for DE (SSH, Python, Airflow); Windows when SSIS or .NET tooling requires RDP.',
          'DE uses EC2 for custom ETL, self-hosted Airflow, and long-running jobs that need full environment control.',
          'EC2 complements managed Glue and serverless Lambda — hybrid pipelines are normal in production.',
        ]}
      />
    </LessonArticle>
  )
}
