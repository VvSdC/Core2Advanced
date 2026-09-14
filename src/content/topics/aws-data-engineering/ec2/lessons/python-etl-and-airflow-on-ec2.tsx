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

export function PythonEtlAndAirflowOnEc2() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Still the default for custom orchestration">
        Glue and Lambda cover much of the lake — but teams still run{' '}
        <strong className="text-white">Python ETL on EC2</strong> when they need arbitrary dependencies,
        long runtimes, or self-hosted <strong className="text-white">Apache Airflow</strong>. The pattern
        is always the same: stateless or orchestrated workers, credentials from an{' '}
        <strong className="text-white">IAM instance profile</strong>, data in S3, secrets in Secrets
        Manager — never long-lived keys on disk.
      </Callout>

      <Definition term="Python ETL on EC2">
        <p>
          A scheduled or triggered process (cron, systemd, Celery worker, Airflow task) runs Python on EC2,
          reads from S3/JDBC/API, transforms in memory or on local EBS scratch, writes curated outputs back
          to S3 or a warehouse. boto3 picks up credentials from the instance metadata service via the attached
          IAM role — the same instance profile pattern from IAM service roles lessons.
        </p>
      </Definition>

      <LessonSection title="Running Python ETL on EC2">
        <ContentStep number={1} title="Layout">
          <p className="text-slate-300">
            Code from git artifact or S3 zip; venv on EBS; config from SSM Parameter Store; logs to
            CloudWatch via agent. Idempotent runs keyed by partition date — safe to retry after Spot
            interrupt.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Data paths">
          <p className="text-slate-300">
            Read <span className="font-mono text-sm">s3://lake/raw/events/dt=2026-09-14/</span>, write{' '}
            <span className="font-mono text-sm">s3://lake/curated/events/</span>. Local disk only for
            temp sort/spill; durable output always S3.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Scheduling">
          <p className="text-slate-300">
            cron for simple jobs; Airflow/Celery for DAG dependencies; EventBridge triggering Lambda to
            start SSM Run Command on a worker ASG for heavier batches.
          </p>
        </ContentStep>
        <Example title="Minimal boto3 credential source">
          <p className="text-slate-300">
            No <span className="font-mono text-sm">AWS_ACCESS_KEY_ID</span> in env — boto3 default chain
            calls instance metadata, receives temporary role creds, refreshes automatically. Role policy
            scopes <span className="font-mono text-sm">s3:PutObject</span> to curated prefix only.
          </p>
        </Example>
      </LessonSection>

      <LessonSection title="Airflow on EC2 — architecture sketch">
        <ContentStep number={1} title="Components">
          <p className="text-slate-300">
            <strong className="text-white">Scheduler</strong> + <strong className="text-white">webserver</strong>{' '}
            on small HA pair (spread placement); <strong className="text-white">workers</strong> on ASG;
            <strong className="text-white"> metadata DB</strong> on RDS Postgres (not SQLite on EC2 for
            prod); <strong className="text-white">executor</strong> Celery or Kubernetes — Celery + Redis/RabbitMQ
            on EC2 is common stepping stone before MWAA.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Worker IAM">
          <p className="text-slate-300">
            Shared instance profile on workers: S3 pipeline prefixes, optional{' '}
            <span className="font-mono text-sm">glue:StartJobRun</span>, Secrets Manager read for JDBC.
            Scheduler role narrower — no S3 write if it only parses DAGs. Split roles if security review
            requires it.
          </p>
        </ContentStep>
        <ContentStep number={3} title="DAG tasks">
          <p className="text-slate-300">
            PythonOperator runs on worker; BashOperator invokes CLI tools; defer heavy Spark to EMR/Glue
            operators. Tasks must be retryable — worker can disappear on scale-in.
          </p>
        </ContentStep>
        <Flowchart
          title="Self-hosted Airflow on EC2 (Celery executor)"
          chart={`flowchart TB
  DEV[Engineer pushes DAGs to S3 or git]
  SCH[Scheduler EC2 — parses DAGs]
  RDS[(RDS Postgres — metadata)]
  REDIS[(ElastiCache Redis — Celery broker)]
  WEB[Webserver EC2 — UI]
  ASG[Worker ASG — Celery workers]
  IP[IAM instance profile — S3 Glue secrets]
  S3R[(S3 raw)]
  S3C[(S3 curated)]
  DEV --> SCH
  SCH --> RDS
  SCH --> REDIS
  WEB --> RDS
  REDIS --> ASG
  ASG --> IP
  IP --> S3R
  ASG --> S3C`}
        />
        <Callout variant="insight">
          Managed alternative: <strong className="text-white">Amazon MWAA</strong> removes scheduler/worker
          EC2 ops — keep this architecture in mind for interviews and migrations; many teams start on EC2
          then move to MWAA when ops burden exceeds savings.
        </Callout>
      </LessonSection>

      <LessonSection title="IAM role on the instance — tie back to IAM">
        <ContentStep number={1} title="Instance profile = role for the box">
          <p className="text-slate-300">
            Attach <span className="font-mono text-sm">ec2-airflow-worker-role</span> via instance profile.
            Trust: <span className="font-mono text-sm">ec2.amazonaws.com</span>. Permissions: pipeline-scoped
            S3, CloudWatch Logs, Secrets Manager — mirror the job-role split from IAM for data pipelines.
          </p>
        </ContentStep>
        <ContentStep number={2} title="No role sharing with humans">
          <p className="text-slate-300">
            Engineers use SSO for debugging in Console; workers use instance role for automation. CloudTrail
            shows distinct principals.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Cross-account S3">
          <p className="text-slate-300">
            Worker role in account A assumes role in account B for central lake read — sts:AssumeRole on
            worker role plus trust on central role (cross-account IAM lesson).
          </p>
        </ContentStep>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Python ETL on EC2: boto3 + instance profile, temp on EBS, durable output on S3, idempotent partition-based runs.',
          'Airflow on EC2: scheduler/web on HA pair, Celery workers on ASG, metadata on RDS — not SQLite for production.',
          'IAM instance profile delivers rotating credentials — no static keys; scope S3 prefixes like Glue job roles.',
          'DAG tasks must tolerate worker loss; heavy Spark belongs on EMR/Glue operators, not giant PythonOperator on one box.',
          'MWAA is the managed evolution — same DAG concepts, less scheduler/worker EC2 toil.',
        ]}
      />
    </LessonArticle>
  )
}
