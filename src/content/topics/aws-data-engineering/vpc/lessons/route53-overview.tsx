import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function Route53Overview() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Stable names for moving data infrastructure">
        RDS endpoints, internal ETL APIs, and cross-VPC services need predictable DNS —{' '}
        <strong className="text-white">Amazon Route 53</strong> provides public and private DNS, health
        checks, and (with Cloud Map) service discovery. Data engineers rely on private hosted zones and
        resolver rules so JDBC URLs and orchestration hooks survive IP changes behind the scenes.
      </Callout>

      <Definition term="Route 53 private hosted zone">
        <p>
          A private hosted zone is a DNS namespace (for example{' '}
          <code className="text-core-400">data.platform.internal</code>) associated with one or more VPCs.
          Records resolve only from resources inside those VPCs (plus hybrid Resolver paths). Use it for
          internal load balancers, metadata services, and custom aliases when AWS-managed service hostnames
          are not enough.
        </p>
      </Definition>

      <LessonSection title="Route 53 for private hosted zones">
        <ContentStep number={1} title="Why not only AWS default DNS">
          <p className="text-slate-300">
            Managed services ship regional hostnames — RDS, Redshift, OpenSearch. Custom private zones add
            friendly CNAMEs: <code className="text-core-400">orders-db.data.internal</code> → RDS endpoint,
            simplifying config across environments. Switch blue/green database by updating one CNAME instead
            of redeploying every Glue job parameter set.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Multi-VPC association">
          <p className="text-slate-300">
            Associate the same private zone with ingest, process, and consume VPCs (same account or cross-account
            with authorization). Glue in process VPC resolves{' '}
            <code className="text-core-400">catalog.data.internal</code> to an internal ALB serving the
            metadata API — no hard-coded IPs in Spark scripts.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Split-horizon and hybrid">
          <p className="text-slate-300">
            Public zones serve internet clients; private zones serve VPC-only names. Route 53 Resolver
            inbound/outbound endpoints forward queries between on-prem AD and AWS — hybrid DE resolves{' '}
            <code className="text-core-400">erp.corp.local</code> from DMS instances in AWS for JDBC to
            on-prem sources connected via VPN/DX.
          </p>
        </ContentStep>
        <Example title="Private zone for ETL config">
{`Private zone: lake.prod.internal (associated with data VPC)

Records:
  orders-rds.lake.prod.internal  CNAME → mydb.xxx.rds.amazonaws.com
  orchestrator.lake.prod.internal ALIAS → internal ALB

Glue job JDBC URL uses orders-rds.lake.prod.internal
Cutover: update CNAME to new RDS endpoint — jobs unchanged`}
        </Example>
      </LessonSection>

      <LessonSection title="Resolver and hybrid DNS for DE">
        <ContentStep number={1} title="Resolver rules">
          <p className="text-slate-300">
            Forward rules send <code className="text-core-400">corp.local</code> queries to on-prem DNS IP
            via outbound Resolver endpoint. Conditional forwarding from on-prem to inbound Resolver lets
            factory systems resolve AWS private names — bidirectional hybrid discovery for split pipeline
            control (on-prem extract agent ↔ AWS orchestrator).
          </p>
        </ContentStep>
        <ContentStep number={2} title="DNS firewall (optional)">
          <p className="text-slate-300">
            Route 53 Resolver DNS Firewall blocks queries to known-malicious domains from VPC — defense for
            compromised ETL boxes attempting C2 callbacks. Complements Network Firewall and SG egress policies
            in zero-trust data platforms.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Service discovery teaser for DE">
        <ContentStep number={1} title="Cloud Map integration">
          <p className="text-slate-300">
            <strong className="text-white">AWS Cloud Map</strong> registers microservice instances (ECS, EKS,
            Lambda URLs) and publishes to Route 53 private DNS or SRV records. Emerging pattern: streaming
            ingest microservices register dynamically; Glue or Step Functions workflows discover current
            broker endpoints via <code className="text-core-400">ingest._tcp.data.internal</code> instead of
            static config — useful when containerized extract workers scale horizontally.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Health checks and failover">
          <p className="text-slate-300">
            Route 53 health checks on internal endpoints enable DNS failover records — route orchestration
            traffic to standby region metadata service if primary ALB fails. DE disaster-recovery runbooks
            tie health-checked CNAMEs to secondary Glue workflow endpoints in DR VPC.
          </p>
        </ContentStep>
        <ContentStep number={3} title="What DE must know today">
          <p className="text-slate-300">
            Use AWS service hostnames or private zone CNAMEs — never bake IPs into JDBC or SDK config. Understand
            private zone ↔ VPC association for multi-VPC platforms. Cloud Map is advanced — know it exists for
            containerized ingest; most batch Glue/RDS pipelines only need private zones and Resolver hybrid rules.
          </p>
        </ContentStep>
        <Callout variant="tip">
          Coordinate with network team on private zone naming standards before creating ad-hoc{' '}
          <code className="text-core-400">.internal</code> zones per project — centralized zones reduce Glue
          job parameter sprawl.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Route 53 private hosted zones: VPC-scoped DNS for internal names — CNAME to RDS/ALB for stable ETL config.',
          'Associate zones with multiple VPCs for ingest/process/consume; Resolver rules bridge on-prem corp.local for hybrid JDBC.',
          'Prefer service hostnames or CNAMEs over IPs — failover and clone restore change IPs silently.',
          'Cloud Map + Route 53: dynamic service discovery teaser for containerized ingest — SRV records for brokers.',
          'Health checks enable DNS failover for metadata/orchestration endpoints in multi-Region DE DR designs.',
        ]}
      />
    </LessonArticle>
  )
}
