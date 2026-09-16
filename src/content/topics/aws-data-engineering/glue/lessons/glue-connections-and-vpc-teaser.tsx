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

export function GlueConnectionsAndVpcTeaser() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Lake jobs are public S3 — JDBC extract is private network">
        Reading and writing S3 needs IAM, not VPC. Extracting from{' '}
        <strong className="text-white">RDS</strong> or <strong className="text-white">Redshift</strong> in
        private subnets requires <strong className="text-white">Glue connections</strong> and VPC configuration.
        Most JDBC Glue failures are networking — not SQL.
      </Callout>

      <Definition term="Glue connection">
        <p>
          A named resource storing JDBC URL, VPC subnet list, security groups, and credential reference
          (Secrets Manager or inline for dev). Jobs and crawlers attach connections so Glue workers spawn
          ENIs inside your VPC to reach private database endpoints.
        </p>
      </Definition>

      <LessonSection title="Glue connections to RDS and Redshift">
        <ContentStep number={1} title="RDS extract">
          <p className="text-slate-300">
            Connection points to RDS endpoint in private subnet. Job uses{' '}
            <span className="font-mono text-sm">connection_type=&quot;jdbc&quot;</span> with connection name,
            table or custom query, optional bookmark column. Security group on RDS must allow ingress from Glue
            connection SG on DB port (5432, 3306, etc.). Prefer read replica or DMS for heavy history — do not
            full-table scan production primary without ops sign-off.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Redshift extract">
          <p className="text-slate-300">
            Similar JDBC connection to Redshift cluster endpoint. For large bulk unload, consider Redshift
            UNLOAD to S3 then Glue reads Parquet — faster than JDBC pull through Glue workers. Connection
            still useful for small dim syncs and catalog crawls.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Secrets and rotation">
          <p className="text-slate-300">
            Store credentials in Secrets Manager; IAM policy on Glue job role for{' '}
            <span className="font-mono text-sm">secretsmanager:GetSecretValue</span>. Rotate secrets without
            redeploying job script — connection resolves latest secret at runtime.
          </p>
        </ContentStep>
        <Example title="Connection vs public S3 job">
{`Public S3 only job:
  - No connection attached
  - Job role: s3:GetObject, s3:PutObject, glue:Catalog
  - Starts in seconds

RDS JDBC job:
  - Connection: subnet private-a, SG glue-jdbc-sg, secret rds/read_only
  - RDS SG: allow glue-jdbc-sg on 5432
  - Job role + connection → ENI setup → JDBC read
  - Cold start +30–90s typical`}
        </Example>
      </LessonSection>

      <LessonSection title="Why VPC matters">
        <ContentStep number={1} title="Private IP reachability">
          <p className="text-slate-300">
            RDS and Redshift in private subnets have no public routes. Glue runs on AWS-managed infrastructure
            by default outside your VPC — without a connection, JDBC to private hostname times out. Connection
            places job ENI in your subnet with route to database SG.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Subnet and ENI constraints">
          <p className="text-slate-300">
            Subnets need free IPs for Glue ENIs (one per worker in some configs). NAT gateway required if
            same job also calls public APIs — or split jobs: VPC JDBC extract vs public S3 transform. VPC
            endpoints for S3/Glue reduce NAT cost on hybrid jobs.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Security posture">
          <p className="text-slate-300">
            Least-privilege SG rules: Glue SG → DB SG only on required port. No 0.0.0.0/0 on database. Audit
            connection usage in CloudTrail. DE teams coordinate with network team — templates in IaC prevent
            drift.
          </p>
        </ContentStep>
        <Flowchart
          title="Glue JDBC through VPC"
          chart={`flowchart LR
  JOB[Glue Spark job]
  ENI[Worker ENI in private subnet]
  SG1[Glue connection SG]
  RDS[(RDS private subnet)]
  SG2[RDS SG ingress 5432]
  S3[S3 lake bucket]
  JOB --> ENI
  ENI --> SG1
  SG1 --> SG2
  SG2 --> RDS
  JOB -->|Parquet write| S3`}
        />
      </LessonSection>

      <LessonSection title="Deep dive deferred to VPC topic">
        <p className="text-slate-300">
          Subnet routing, NAT vs VPC endpoints, interface endpoints for Glue and Secrets Manager, and
          multi-AZ connection design are covered in the{' '}
          <strong className="text-white">VPC sub-topic</strong>. For Glue interviews today: explain connection
          components, SG flow, ENI cold start, and when DMS/UNLOAD beats JDBC — that satisfies intermediate
          DE expectations until VPC lessons land.
        </p>
        <Callout variant="tip">
          Troubleshooting checklist: connection subnet route table → RDS SG ingress → secret IAM → JDBC URL
          host matches private DNS → job actually has connection attached in job details.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Glue connections: JDBC URL + VPC subnet + SG + Secrets Manager — required for private RDS/Redshift.',
          'S3-only lake jobs need no connection; JDBC extract adds ENI setup latency and subnet IP planning.',
          'RDS SG must allow Glue connection SG on DB port; use read replica or DMS for large extracts.',
          'Redshift bulk: prefer UNLOAD to S3 over JDBC when moving TB-scale history.',
          'Full VPC routing, endpoints, and NAT — deep dive in VPC topic; debug SG + subnet + secret first.',
        ]}
      />
    </LessonArticle>
  )
}
