import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function SecurityGroupsIamAuth() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Network and identity gates before any extract runs">
        RDS lives in a VPC — only resources allowed by <strong className="text-white">security groups</strong>{' '}
        can reach the database port. Data engineering pipelines (Glue, Lambda in VPC, DMS, EC2 workers) need
        explicit inbound rules. <strong className="text-white">IAM database authentication</strong> offers an
        alternative to long-lived passwords for supported engines.
      </Callout>

      <Definition term="Security group for RDS">
        <p>
          A security group is a stateful virtual firewall attached to the RDS instance.{' '}
          <strong className="text-white">Inbound rules</strong> define which sources (other security groups,
          CIDR blocks) can connect on which ports — typically 5432 (PostgreSQL) or 3306 (MySQL). Outbound is
          usually unrestricted. RDS does not get a public IP unless you explicitly enable{' '}
          <em>publicly accessible</em> — DE pipelines should connect from private subnets.
        </p>
      </Definition>

      <LessonSection title="Security groups for database access">
        <ContentStep number={1} title="Least-privilege network access">
          <p className="text-slate-300">
            Allow inbound only from the security group of Glue connections, Lambda functions, DMS replication
            instances, or bastion hosts — not <code className="text-core-400">0.0.0.0/0</code>. Reference
            security groups by ID rather than IP ranges when sources are also in the VPC — IPs change on
            restart.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Cross-service wiring">
          <p className="text-slate-300">
            Glue JDBC connection in a VPC needs: Glue connection security group → allowed on RDS security
            group inbound; NAT gateway or VPC endpoints for Glue to reach S3; Secrets Manager VPC endpoint if
            credentials are fetched at runtime.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Publicly accessible — avoid for prod">
          <p className="text-slate-300">
            Public RDS endpoints simplify dev but expose attack surface. Production source systems should be
            private with VPN, Direct Connect, or SSM port forwarding for emergency DBA access — not open
            internet on 5432.
          </p>
        </ContentStep>
        <Example title="Typical DE inbound rules" caption="RDS security group">
{`Inbound:
  Type: PostgreSQL (5432)
  Source: sg-glue-etl        (Glue JDBC connection)
  Source: sg-dms-replication (DMS instance)
  Source: sg-lambda-vpc      (Lambda extract function)

NOT allowed:
  Source: 0.0.0.0/0          (internet — block for prod)`}
        </Example>
      </LessonSection>

      <LessonSection title="IAM database authentication overview">
        <ContentStep number={1} title="Token-based login">
          <p className="text-slate-300">
            For RDS PostgreSQL and MySQL, enable IAM DB authentication on the instance. Applications call{' '}
            <code className="text-core-400">rds.generate_db_auth_token</code> to obtain a short-lived (15
            min) auth token signed by IAM — used as the password in the JDBC/SSL connection. No static
            password in config files.
          </p>
        </ContentStep>
        <ContentStep number={2} title="IAM policy requirement">
          <p className="text-slate-300">
            The calling IAM role needs <code className="text-core-400">rds-db:connect</code> permission
            scoped to the DB user resource ARN. The database user must be created with{' '}
            <code className="text-core-400">rds_iam</code> role (Postgres) or equivalent — IAM auth maps to
            existing DB users, not automatic provisioning.
          </p>
        </ContentStep>
        <ContentStep number={3} title="DE pipeline fit">
          <p className="text-slate-300">
            Lambda and Glue jobs using execution roles can authenticate without Secrets Manager rotation for
            password-based users — tokens expire automatically. Trade-off: token generation adds startup
            latency; not all JDBC drivers/tools support IAM auth equally — test Glue and DMS compatibility
            before mandating it fleet-wide.
          </p>
        </ContentStep>
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Auth method</th>
                <th className="px-4 py-3">Pros</th>
                <th className="px-4 py-3">Cons</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                [
                  'Secrets Manager password',
                  'Universal JDBC support; automatic rotation',
                  'Secret sprawl if not centralized; rotation blips connections',
                ],
                [
                  'IAM DB auth token',
                  'No long-lived password; IAM audit trail',
                  '15-min token; engine/user setup required; tool support varies',
                ],
                [
                  'Static password in parameter store',
                  'Simple for legacy scripts',
                  'Anti-pattern — no rotation, broad blast radius',
                ],
              ].map(([method, pros, cons]) => (
                <tr key={method} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{method}</td>
                  <td className="px-4 py-3">{pros}</td>
                  <td className="px-4 py-3">{cons}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Layered security for extraction pipelines">
        <ContentStep number={1} title="Network + identity + encryption">
          <p className="text-slate-300">
            Security groups control <em>who can reach the port</em>. IAM DB auth or Secrets Manager controls{' '}
            <em>who can authenticate</em>. SSL/TLS (next lesson) protects data in transit. Layer all three —
            SG alone with a leaked password still compromises the database.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Dedicated extract users">
          <p className="text-slate-300">
            Create read-only DB users for ETL (<code className="text-core-400">etl_reader</code>) with
            SELECT on required schemas only — separate from app service accounts. Revoke DDL/DML. DMS and Glue
            should never use the application superuser.
          </p>
        </ContentStep>
        <Callout variant="tip" title="Connection debugging">
          <code className="text-core-400">Connection timed out</code> usually means security group or subnet
          routing — not bad password. <code className="text-core-400">Authentication failed</code> is
          credentials or IAM token. Check SG first before rotating secrets.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'RDS security groups are stateful firewalls — allow inbound only from Glue/Lambda/DMS SGs, not open internet.',
          'Production RDS should be private (not publicly accessible) — extract from VPC subnets with proper routing.',
          'IAM DB authentication: short-lived tokens via rds.generate_db_auth_token — no static passwords for supported engines.',
          'Layer network (SG) + identity (IAM auth or Secrets Manager) + SSL — SG alone is insufficient.',
          'Use dedicated read-only extract users with least-privilege SELECT — never app superuser for ETL.',
        ]}
      />
    </LessonArticle>
  )
}
