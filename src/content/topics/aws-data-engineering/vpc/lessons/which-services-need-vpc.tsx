import {
  Callout,
  ContentStep,
  Definition,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function WhichServicesNeedVpc() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Not everything lives in your VPC — know what does">
        Misplacing services causes cost and complexity: putting Glue in VPC when only S3 is needed, or forgetting
        VPC on Lambda that JDBCs to RDS. This lesson maps{' '}
        <strong className="text-white">DE-relevant AWS services</strong> to whether they run in, connect to, or
        ignore your VPC.
      </Callout>

      <Definition term="VPC-required vs VPC-optional vs VPC-bypass">
        <p>
          <strong className="text-white">VPC-hosted:</strong> you choose subnets and SGs (RDS, Redshift, EC2,
          DMS instance). <strong className="text-white">VPC-connected:</strong> managed service uses your VPC
          via connections or ENIs (Glue JDBC, Lambda in VPC).{' '}
          <strong className="text-white">VPC-bypass:</strong> regional public endpoint + IAM only (S3, Athena,
          default Lambda to S3) — no subnet selection unless you add private endpoints or VPC attachment.
        </p>
      </Definition>

      <LessonSection title="Which AWS services require or use VPC">
        <ContentStep number={1} title="Always in your VPC (you design subnets)">
          <p className="text-slate-300">
            Amazon RDS, Aurora, Redshift, ElastiCache, OpenSearch (domain with VPC option), EC2, ECS/EKS
            worker nodes, DMS replication instances, Client VPN endpoints, NAT gateways, interface/gateway
            endpoints. DE sources and heavy workers live here — subnet groups and SG wiring are your responsibility.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Optional VPC attachment">
          <p className="text-slate-300">
            AWS Lambda (default no VPC), Glue jobs (default no connection — S3 only), EMR clusters (VPC required
            for cluster but S3 access via IAM), MWAA environments (VPC required). Attachment driven by private
            resource access, not by S3 reads.
          </p>
        </ContentStep>
        <ContentStep number={3} title="No VPC placement — IAM and endpoints">
          <p className="text-slate-300">
            S3, Athena, Glue Data Catalog API (control plane), EventBridge, Step Functions, Kinesis Data Streams
            (API layer), SNS/SQS — accessed via regional HTTPS endpoints. From private subnets use gateway/interface
            endpoints for traffic isolation; service itself is not &quot;in&quot; a subnet.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="DE-relevant comparison table">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">VPC relationship</th>
                <th className="px-4 py-3">Typical DE pattern</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                [
                  'S3',
                  'No VPC — IAM + bucket policy',
                  'Lake storage; gateway endpoint from private subnets for cost/compliance',
                ],
                [
                  'Athena',
                  'No VPC — queries via API',
                  'SQL on S3; no JDBC to RDS; optional interface endpoint in locked-down VPC',
                ],
                [
                  'Glue (S3 job)',
                  'No connection — workers outside your VPC',
                  'Bronze → curated transforms; IAM on job role only',
                ],
                [
                  'Glue (JDBC job)',
                  'Glue connection → ENIs in your subnets',
                  'Extract from private RDS/Redshift; SG + subnet + secret',
                ],
                [
                  'Lambda (S3 trigger)',
                  'Default: no VPC',
                  'Lightweight transform; fastest cold start',
                ],
                [
                  'Lambda (RDS)',
                  'VPC config required',
                  'Private JDBC; add S3 endpoint + RDS Proxy',
                ],
                [
                  'RDS / Aurora',
                  'Hosted in VPC subnet group',
                  'Private OLTP source; SG from Glue/Lambda/DMS',
                ],
                [
                  'Redshift',
                  'Hosted in VPC subnet group',
                  'Private OLAP; COPY from S3 with enhanced VPC routing',
                ],
                [
                  'DMS',
                  'Replication instance in VPC',
                  'CDC from RDS or on-prem via VPN/DX to same or peered VPC',
                ],
                [
                  'EMR',
                  'Cluster in VPC subnets',
                  'Big Spark on EC2; S3 via IAM + gateway endpoint',
                ],
                [
                  'Kinesis Data Firehose',
                  'No customer VPC for delivery stream',
                  'S3/Redshift delivery via service; Redshift must be reachable if VPC destination',
                ],
                [
                  'Secrets Manager',
                  'Regional API; interface endpoint optional',
                  'Glue/Lambda in VPC use endpoint for private credential fetch',
                ],
              ].map(([service, relationship, pattern]) => (
                <tr key={service} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{service}</td>
                  <td className="px-4 py-3">{relationship}</td>
                  <td className="px-4 py-3">{pattern}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="S3 / Athena / Lambda default vs RDS / Redshift / Glue connections">
        <ContentStep number={1} title="Lake-native path — no VPC">
          <p className="text-slate-300">
            S3 → Glue (no connection) → Athena validation → EventBridge schedule: entire path uses IAM roles
            and public regional endpoints. No subnet IP planning, no NAT, no ENI cold start. This is the default
            medallion batch pattern for file-only sources.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Hybrid OLTP path — VPC at the JDBC edge">
          <p className="text-slate-300">
            RDS in private subnets → Glue with connection (VPC ENIs) → S3 still via IAM (add S3 gateway endpoint
            on connection subnet route tables). Athena still no VPC. Only the extract leg crosses into your VPC
            — do not over-VPC the catalog or orchestration tiers.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Decision rule">
          <p className="text-slate-300">
            Ask: does this component open a TCP socket to a private RFC 1918 address? Yes → VPC config, SG, routes,
            endpoints. No → IAM only, optionally interface/gateway endpoints for policy. Redshift and RDS always yes
            for hosting; Glue/Lambda only when JDBC hostname resolves to private IP.
          </p>
        </ContentStep>
        <Callout variant="insight">
          Interview trap: &quot;Glue is serverless so it has no VPC&quot; — half true. S3-only Glue has no customer
          VPC; JDBC Glue absolutely uses your VPC via connections.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'RDS, Redshift, DMS, EC2, EMR clusters live in your VPC subnets — you own subnet groups and SGs.',
          'S3, Athena, default Glue/Lambda (S3-only) use IAM + regional APIs — no subnet unless you add endpoints.',
          'Glue JDBC and Lambda to private RDS require VPC connections/config — ENIs, SG, S3 gateway endpoint on same routes.',
          'Decision rule: TCP to private IP → VPC networking; object/API-only → IAM (+ optional endpoints for private subnets).',
          'Do not VPC-wrap entire pipeline when only JDBC extract needs it — keep lake transforms on default Glue/Lambda where possible.',
        ]}
      />
    </LessonArticle>
  )
}
