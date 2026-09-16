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

export function SecurityGroupsVsNacls() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Two firewalls, different jobs">
        When Glue cannot reach RDS on port 5432, engineers check{' '}
        <strong className="text-white">security groups</strong> first — stateful allow rules on each ENI.
        <strong className="text-white"> Network ACLs (NACLs)</strong> are optional subnet-level filters —
        stateless, numbered rules, deny-capable. DE platforms live in security groups day to day; NACLs are
        coarse guardrails or compliance baselines.
      </Callout>

      <Definition term="Security group">
        <p>
          A <strong className="text-white">security group (SG)</strong> acts as a virtual firewall for ENIs
          attached to RDS, EC2, Lambda in VPC, Glue connections, and Redshift.{' '}
          <strong className="text-white">Inbound rules</strong> define allowed sources and ports;{' '}
          <strong className="text-white">outbound</strong> is typically all traffic allowed by default. SGs are{' '}
          <strong className="text-white">stateful</strong>: if inbound from Glue SG on 5432 is allowed, return
          traffic is automatically permitted without a separate outbound rule.
        </p>
      </Definition>

      <LessonSection title="Security Groups vs NACL — comparison">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Property</th>
                <th className="px-4 py-3">Security group</th>
                <th className="px-4 py-3">Network ACL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Scope', 'ENI / instance level', 'Subnet level — all ENIs in subnet'],
                ['State', 'Stateful (return traffic auto-allowed)', 'Stateless (must allow return explicitly)'],
                ['Rules', 'Allow only — implicit deny', 'Allow and deny — first match wins by rule number'],
                ['Default', 'Deny all inbound; allow all outbound', 'Allow all inbound and outbound'],
                ['DE usage', 'Glue SG → RDS SG on 5432 — daily ops', 'Block CIDR ranges, compliance deny rules — occasional'],
              ].map(([prop, sg, nacl]) => (
                <tr key={prop} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{prop}</td>
                  <td className="px-4 py-3">{sg}</td>
                  <td className="px-4 py-3">{nacl}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Stateful vs stateless">
        <ContentStep number={1} title="Stateful security groups">
          <p className="text-slate-300">
            Glue opens TCP to RDS:5432. RDS SG allows inbound from Glue SG. Return packets from RDS to Glue
            are permitted automatically because the connection was established — you do not add outbound rules
            on RDS SG for ephemeral ports.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Stateless NACLs">
          <p className="text-slate-300">
            NACL must allow outbound ephemeral ports (1024-65535) for return traffic if you restrict inbound
            — easy to misconfigure. That is why DE teams fix SGs first when JDBC times out; NACL mistakes are
            rarer but painful.
          </p>
        </ContentStep>
        <Flowchart
          title="Glue → RDS connection through security groups"
          chart={`flowchart LR
  GLUE[Glue ENI sg-glue-etl]
  RDS[RDS ENI sg-rds-prod]
  GLUE -->|outbound TCP 5432 allowed| RDS
  RDS -->|return traffic stateful auto-allow| GLUE`}
        />
      </LessonSection>

      <LessonSection title="DE examples — allow Glue → RDS 5432">
        <ContentStep number={1} title="Reference security groups by ID">
          <p className="text-slate-300">
            Prefer <code className="text-core-400">sg-glue-etl</code> as source on RDS inbound — not Glue
            private IP <code className="text-core-400">10.0.1.50</code>. Glue ENI IPs change every job run;
            security group references stay stable.
          </p>
        </ContentStep>
        <ContentStep number={2} title="RDS security group inbound">
          <p className="text-slate-300">
            Type: PostgreSQL, Port: 5432, Source: Glue connection security group. Add DMS replication SG and
            Lambda extract SG as separate rules — least privilege per pipeline, not one mega-rule.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Glue connection security group outbound">
          <p className="text-slate-300">
            Default allow-all outbound on Glue SG is typical. Restrict outbound in high-compliance environments
            — but ensure S3 endpoint paths and RDS ports remain reachable.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Redshift port 5439">
          <p className="text-slate-300">
            Same pattern: orchestration Lambda SG or Glue SG allowed on Redshift cluster SG inbound 5439 —
            BI tools via VPN SG, never <code className="text-core-400">0.0.0.0/0</code> on prod.
          </p>
        </ContentStep>
        <Example title="Typical DE security group rules" caption="RDS PostgreSQL prod">
{`sg-rds-prod (attached to RDS instance):
  Inbound:
    PostgreSQL 5432  Source sg-glue-etl
    PostgreSQL 5432  Source sg-dms-replication
    PostgreSQL 5432  Source sg-lambda-vpc-extract
  Outbound: default (all)

sg-glue-etl (attached to Glue connection):
  Inbound: none required for JDBC client
  Outbound: default (all) — or restrict to 5432 + HTTPS as policy requires

NOT on prod RDS:
  PostgreSQL 5432  Source 0.0.0.0/0`}
        </Example>
      </LessonSection>

      <LessonSection title="When NACLs matter for DE">
        <ContentStep number={1} title="Explicit deny of known bad CIDR">
          <p className="text-slate-300">
            NACL rule #50 deny <code className="text-core-400">203.0.113.0/24</code> before allow-all — SGs
            cannot deny. Rare for internal ETL but appears in shared-services VPCs.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Subnet isolation tiers">
          <p className="text-slate-300">
            Some enterprises NACL-block traffic from dev CIDR into prod data subnets at subnet boundary —
            defense beyond SG if someone mis-associates a dev ENI with prod SG by mistake.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Ephemeral port gotcha">
          <p className="text-slate-300">
            Custom restrictive NACL on private data subnet without ephemeral allow breaks JDBC even when SGs
            are correct — symptoms identical to SG failure. Compare subnet NACL to AWS default when debugging.
          </p>
        </ContentStep>
        <Callout variant="tip" title="Debug order for connection timeout">
          Confirm route tables → RDS SG inbound from caller SG → caller can reach port → then check NACL.
          Ninety percent of DE JDBC issues stop at security group wiring.
        </Callout>
      </LessonSection>

      <LessonSection title="Self-check — SG vs NACL">
        <ContentStep number={1} title="Which is stateful?">
          <p className="text-slate-300">Security groups — return traffic for allowed inbound is automatic.</p>
        </ContentStep>
        <ContentStep number={2} title="Which supports deny rules?">
          <p className="text-slate-300">NACLs only — security groups are allow-list only with implicit deny.</p>
        </ContentStep>
        <ContentStep number={3} title="What should reference sg-glue-etl on RDS?">
          <p className="text-slate-300">RDS security group inbound rule — not NACL unless you have custom subnet policy.</p>
        </ContentStep>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Security groups are stateful ENI firewalls — primary DE tool for Glue→RDS on 5432; reference SG IDs not ephemeral IPs.',
          'NACLs are stateless subnet filters with allow/deny — secondary; misconfigured ephemeral rules can break JDBC.',
          'RDS inbound: allow Glue, DMS, and Lambda SGs on engine port; never 0.0.0.0/0 on prod databases.',
          'Debug path: routes → security groups → NACL; most pipeline timeouts resolve at the SG layer.',
        ]}
      />
    </LessonArticle>
  )
}
