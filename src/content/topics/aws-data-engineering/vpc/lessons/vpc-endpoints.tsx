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

export function VpcEndpoints() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Keep lake traffic off NAT — endpoints pay for themselves">
        Private-subnet Glue workers reading S3 and writing Parquet should not hairpin through a NAT gateway.
        <strong className="text-white"> VPC endpoints</strong> connect your VPC to AWS services over the AWS
        backbone — no public internet, lower latency, and for S3/DynamoDB gateway endpoints,{' '}
        <strong className="text-white">no hourly interface charges or NAT data processing fees</strong>.
      </Callout>

      <Definition term="VPC endpoint">
        <p>
          A VPC endpoint enables resources in your VPC to communicate with supported AWS services without
          traversing the public internet or a NAT gateway. Two types matter for DE:{' '}
          <strong className="text-white">gateway endpoints</strong> (S3, DynamoDB — route table entries) and{' '}
          <strong className="text-white">interface endpoints</strong> (most other services — ENIs with private
          IPs in your subnets, powered by AWS PrivateLink).
        </p>
      </Definition>

      <LessonSection title="VPC Endpoints overview">
        <ContentStep number={1} title="Why DE platforms standardize on endpoints">
          <p className="text-slate-300">
            ETL jobs in private subnets need AWS API access: S3 read/write, Glue Data Catalog, Secrets Manager,
            STS, CloudWatch Logs, KMS. Without endpoints, every call exits via NAT — billable per GB and a
            choke point for TB-scale Spark shuffles to S3. Endpoints also satisfy compliance requirements that
            deny internet egress from data subnets.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Gateway vs interface — pick the right type">
          <p className="text-slate-300">
            Gateway endpoints are free, highly scalable, and attach to{' '}
            <strong className="text-white">route tables</strong> via prefix lists. Interface endpoints create
            billable ENIs per AZ, need security groups, and support private DNS override for the service
            hostname. You often deploy both in the same VPC: S3 gateway for lake I/O, interface endpoints for
            control-plane APIs.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Gateway endpoints: S3 and DynamoDB">
        <ContentStep number={1} title="S3 gateway endpoint">
          <p className="text-slate-300">
            Add an S3 gateway endpoint and associate it with route tables used by private subnets where Glue,
            EMR, Lambda, or Redshift Spectrum run. Traffic to S3 stays on the AWS network.{' '}
            <strong className="text-white">No NAT charges</strong> for GetObject, PutObject, ListBucket on
            paths covered by the endpoint route. Essential for every production data lake VPC.
          </p>
        </ContentStep>
        <ContentStep number={2} title="DynamoDB gateway endpoint">
          <p className="text-slate-300">
            Same mechanism for DynamoDB — route table prefix list to{' '}
            <code className="text-core-400">com.amazonaws.region.dynamodb</code>. Useful when CDC metadata,
            job state tables, or Kinesis Client Library leases live in DynamoDB and consumers run in private
            subnets. Also free at the endpoint layer.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Endpoint policies">
          <p className="text-slate-300">
            Gateway endpoints support resource policies restricting which buckets or tables are reachable
            through the endpoint — defense in depth alongside bucket policies and IAM. Data platform teams
            scope endpoints to prod lake buckets and deny exfiltration paths to personal account buckets.
          </p>
        </ContentStep>
        <Example title="Route table with S3 gateway endpoint">
{`Private subnet route table (simplified):
  10.0.0.0/16     → local
  0.0.0.0/0       → nat-0abc...        (internet / non-S3 AWS APIs)
  pl-63a5400a     → vpce-0s3gateway... (S3 prefix list — no NAT)

Glue worker in this subnet:
  s3://lake/bronze/... → gateway endpoint path
  secretsmanager API   → NAT or interface endpoint for SM`}
        </Example>
      </LessonSection>

      <LessonSection title="Interface endpoints">
        <ContentStep number={1} title="PrivateLink ENIs in your subnets">
          <p className="text-slate-300">
            Interface endpoints place elastic network interfaces with private IPs in subnets you choose (one
            per AZ for HA). Security group on the endpoint must allow HTTPS (443) from Glue connection SG,
            Lambda SG, or worker SG. Enable private DNS so{' '}
            <code className="text-core-400">secretsmanager.us-east-1.amazonaws.com</code> resolves inside the
            VPC.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Common DE interface endpoints">
          <p className="text-slate-300">
            Typical set: <strong className="text-white">Secrets Manager</strong>,{' '}
            <strong className="text-white">Glue</strong>, <strong className="text-white">STS</strong>,{' '}
            <strong className="text-white">CloudWatch Logs</strong>,{' '}
            <strong className="text-white">KMS</strong>,{' '}
            <strong className="text-white">ECR</strong> (if pulling container images for custom Spark). Cost
            scales with endpoints × AZs — consolidate shared networking VPC or use centralized egress VPC
            patterns in multi-account setups.
          </p>
        </ContentStep>
        <ContentStep number={3} title="SG on endpoint vs SG on client">
          <p className="text-slate-300">
            The endpoint SG allows inbound 443 from client SGs. Client SGs need outbound to endpoint SG or
            CIDR. Misconfigured endpoint SG causes TLS timeouts that look like IAM failures — verify both
            sides when JDBC jobs stall at secret fetch.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Why DE loves S3 gateway endpoints">
        <ContentStep number={1} title="Glue private subnet → S3 without NAT cost">
          <p className="text-slate-300">
            A Glue Spark job with a JDBC connection runs workers as ENIs in private subnets. Those workers
            read bronze Parquet and write curated tables to S3 — often terabytes per run. Without an S3 gateway
            endpoint, all that I/O crosses the NAT gateway at per-GB processing rates. Gateway endpoints
            eliminate that tax entirely while keeping subnets private.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Hybrid JDBC + lake pattern">
          <p className="text-slate-300">
            Standard pattern: connection subnets for RDS reachability (private IP), same route tables with S3
            gateway for lake I/O, interface endpoint for Secrets Manager for JDBC credentials — NAT only for
            truly external calls (vendor API, legacy FTP). Month-end job cost reviews often trace savings to
            S3 endpoint adoption.
          </p>
        </ContentStep>
        <Flowchart
          title="Private Glue job — S3 via gateway endpoint"
          chart={`flowchart TB
  GLUE[Glue Spark workers ENI private subnet]
  RT[Route table with S3 gateway endpoint]
  S3[(S3 lake bucket)]
  RDS[(RDS private subnet)]
  NAT[NAT gateway]
  EXT[External API optional]
  GLUE -->|JDBC private IP| RDS
  GLUE --> RT
  RT -->|Prefix list no NAT| S3
  GLUE -->|Non-S3 traffic| NAT
  NAT --> EXT`}
        />
        <Callout variant="insight">
          Redshift COPY/UNLOAD and Spectrum also benefit from S3 gateway endpoints on compute subnet route
          tables — same cost logic as Glue at warehouse scale.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'VPC endpoints connect private subnets to AWS services without internet — gateway (S3/DynamoDB) vs interface (PrivateLink ENIs).',
          'S3 gateway endpoint: free, route table prefix list — eliminates NAT data processing for lake Get/Put/List.',
          'Interface endpoints: Secrets Manager, Glue, STS, Logs, KMS — enable private DNS; SG must allow 443 from job SGs.',
          'DE standard: S3 gateway on all data subnet route tables + interface endpoints for control plane; NAT for external only.',
          'Glue JDBC in private subnets: RDS via private IP, lake via S3 endpoint — biggest cost win for TB-scale ETL.',
        ]}
      />
    </LessonArticle>
  )
}
