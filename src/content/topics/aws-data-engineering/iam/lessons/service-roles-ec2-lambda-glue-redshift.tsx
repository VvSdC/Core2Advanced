import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function ServiceRolesEc2LambdaGlueRedshift() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Every AWS service needs an identity">
        When Glue reads S3 or Lambda writes logs, AWS does not magic permissions from thin air — each
        service runs as an IAM role you configure (or accept from a wizard). Mixing these up — attaching
        a Lambda execution role to Glue, or forgetting S3 on a Redshift COPY role — is the fastest way
        to break a pipeline on day one.
      </Callout>

      <Definition term="Service role">
        <p>
          A <strong className="text-white">service role</strong> is an IAM role that an AWS service
          assumes on your behalf to reach other resources. Trust policy names the service principal (
          <span className="font-mono text-sm">ec2.amazonaws.com</span>,{' '}
          <span className="font-mono text-sm">lambda.amazonaws.com</span>, etc.). Permission policies
          grant the minimum S3, Glue, CloudWatch, or Redshift actions the workload needs.
        </p>
      </Definition>

      <LessonSection title="EC2 — instance profile">
        <ContentStep number={1} title="Role + instance profile wrapper">
          <p className="text-slate-300">
            EC2 cannot attach a role directly — you attach an <strong className="text-white">instance
            profile</strong>, a container that holds one role. Airflow workers, custom Spark on EMR/EC2,
            or legacy Python ETL boxes use this pattern so boto3 picks up credentials from the metadata
            service — no keys on disk.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Typical DE permissions">
          <p className="text-slate-300">
            Read/write specific S3 prefixes, publish to Kinesis, call Secrets Manager for JDBC passwords.
            Avoid <span className="font-mono text-sm">AmazonS3FullAccess</span> on a worker that only
            processes one landing zone.
          </p>
        </ContentStep>
        <Flowchart
          title="EC2 instance profile credential flow"
          chart={`flowchart LR
  EC2[EC2 ETL worker]
  IP[Instance profile]
  ROLE[EC2-ETL-Role]
  META[Instance metadata service]
  S3[S3 landing bucket]
  EC2 --> IP
  IP --> ROLE
  EC2 --> META
  META -->|AssumeRole| ROLE
  ROLE --> S3`}
        />
      </LessonSection>

      <LessonSection title="Lambda — execution role">
        <ContentStep number={1} title="One role per function (usually)">
          <p className="text-slate-300">
            Each Lambda function specifies an <strong className="text-white">execution role</strong>. Trust
            allows <span className="font-mono text-sm">lambda.amazonaws.com</span>. At invoke time Lambda
            assumes the role and injects credentials into the runtime environment.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Common permissions">
          <p className="text-slate-300">
            <span className="font-mono text-sm">AWSLambdaBasicExecutionRole</span> for CloudWatch Logs;
            plus S3 Get/Put for S3-triggered ingestion; plus{' '}
            <span className="font-mono text-sm">glue:StartJobRun</span> for orchestration Lambdas. Keep
            functions small in scope — one role for &quot;compress uploads&quot; and another for &quot;trigger
            Glue&quot; if their S3 paths differ.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Glue — service role and job role">
        <ContentStep number={1} title="Glue service role (account-level)">
          <p className="text-slate-300">
            Glue needs a service-linked or service role to manage crawlers, write logs, and access the
            Data Catalog on your behalf. Console setup wizard creates{' '}
            <span className="font-mono text-sm">AWSGlueServiceRole</span>-style attachments — review
            before production.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Job role (per ETL job)">
          <p className="text-slate-300">
            Each <strong className="text-white">Glue job role</strong> is what your Spark/Python script
            runs as for S3 I/O, JDBC connections, and DynamoDB targets. This is where you enforce raw vs
            curated prefix separation — the most important IAM knob in Glue ETL.
          </p>
        </ContentStep>
        <Flowchart
          title="Glue job role vs service role"
          chart={`flowchart TB
  GLUE[Glue service]
  SR[Glue service role — catalog logs]
  JR[Job role — your ETL script]
  RAW[S3 raw prefix]
  CUR[S3 curated prefix]
  GLUE --> SR
  GLUE --> JR
  JR --> RAW
  JR --> CUR`}
        />
      </LessonSection>

      <LessonSection title="Redshift — roles for COPY from S3">
        <ContentStep number={1} title="Cluster IAM role association">
          <p className="text-slate-300">
            Redshift clusters attach IAM roles (similar spirit to instance profiles). The{' '}
            <span className="font-mono text-sm">COPY</span> command uses those credentials to read from
            S3 — encrypted Parquet, gzip CSV, etc. Without an associated role with{' '}
            <span className="font-mono text-sm">s3:GetObject</span>, COPY fails even if the table owner
            is a superuser.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Spectrum and federated queries">
          <p className="text-slate-300">
            Redshift Spectrum external tables read S3 via the same associated roles. Scope roles to the
            curated prefix your warehouse team owns — not the entire lake account.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Cross-account COPY">
          <p className="text-slate-300">
            When the bucket lives in another account, combine Redshift role permissions, bucket policy
            Allows, and possibly cross-account AssumeRole — the full cross-account lesson applies here.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Comparison at a glance">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Role name in practice</th>
                <th className="px-4 py-3">Trust principal</th>
                <th className="px-4 py-3">Typical S3 use</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['EC2', 'Instance profile → role', 'ec2.amazonaws.com', 'Read landing, write staging'],
                ['Lambda', 'Execution role', 'lambda.amazonaws.com', 'Event-driven Get/Put on prefix'],
                ['Glue', 'Service role + job role', 'glue.amazonaws.com', 'Job role: raw → curated transform'],
                ['Redshift', 'Cluster associated IAM role', 'redshift.amazonaws.com', 'COPY / Spectrum on curated paths'],
              ].map(([service, roleName, trust, s3use]) => (
                <tr key={service} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{service}</td>
                  <td className="px-4 py-3">{roleName}</td>
                  <td className="px-4 py-3 font-mono text-xs">{trust}</td>
                  <td className="px-4 py-3">{s3use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip">
          Naming convention that scales: <span className="font-mono text-sm">de-glue-job-sales-etl</span>,{' '}
          <span className="font-mono text-sm">de-lambda-s3-ingest</span>,{' '}
          <span className="font-mono text-sm">de-redshift-copy-curated</span> — role name tells you the
          service and data zone in one glance.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'EC2 uses instance profiles; Lambda uses execution roles; Glue uses service role + per-job role; Redshift associates IAM roles for COPY/Spectrum.',
          'Trust policy must match the service principal — never reuse a Lambda role on Glue.',
          'Glue job role is the main lever for S3 least privilege in ETL; Redshift role must Allow s3:GetObject on COPY sources.',
          'Scope each role to prefixes and actions — avoid AWS managed *FullAccess on production pipeline identities.',
        ]}
      />
    </LessonArticle>
  )
}
