import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function DataSharingAndFederated() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Share warehouse data without COPY — query OLTP in place with federation">
        <strong className="text-white">Redshift data sharing</strong> exposes live datashares across clusters,
        accounts, and AWS Regions — no duplicate ETL.{' '}
        <strong className="text-white">Redshift federated query</strong> runs SQL against operational RDS/Aurora
        from Redshift — useful for small lookups, dangerous for full-table scans. Know both for modern DE
        architectures.
      </Callout>

      <Definition term="Redshift data sharing">
        <p>
          Producer namespace/cluster creates a <strong className="text-white">datashare</strong> containing
          schemas, tables, and views. Consumer attaches the share and queries objects as read-only — data
          stays in producer storage (RMS). Cross-account sharing uses RAM invitations; Lake Formation can
          govern fine-grained access on shared Glue-linked objects.
        </p>
      </Definition>

      <Definition term="Redshift federated query">
        <p>
          External schema pointing at <strong className="text-white">RDS PostgreSQL, Aurora PostgreSQL, or
          MySQL</strong> — Redshift pushes down compatible predicates where possible. Good for dimension
          enrichment from operational store (product catalog, user flags); anti-pattern for extracting entire
          OLTP tables into analytics joins.
        </p>
      </Definition>

      <LessonSection title="Redshift Data Sharing">
        <ContentStep number={1} title="Producer / consumer model">
          <p className="text-slate-300">
            Central gold cluster (producer) publishes{' '}
            <span className="font-mono text-sm">datashare gold_share</span> with schema{' '}
            <span className="font-mono text-sm">analytics</span>. Dept sandbox serverless workgroup
            (consumer) runs{' '}
            <span className="font-mono text-sm">CREATE DATABASE gold FROM DATASHARE gold_share OF NAMESPACE '…';</span>{' '}
            — analysts query without COPY duplication.
          </p>
        </ContentStep>
        <ContentStep number={2} title="DE use cases">
          <p className="text-slate-300">
            Multi-team AWS org: one curated warehouse, many read-only consumers. SaaS vendor shares metrics
            datashare to customer Redshift. Avoids nightly UNLOAD/COPY between accounts — live consistency,
            lower egress and storage double-count.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Limits to remember">
          <p className="text-slate-300">
            Consumers read only — writes stay on producer. Cross-Region sharing adds latency. Not a replacement
            for lake zone ownership — external Spectrum tables in shares follow same S3 IAM rules.
          </p>
        </ContentStep>
        <Flowchart
          title="Data sharing — producer to consumer"
          chart={`flowchart LR
  PROD[Producer Redshift gold cluster]
  DS[Datashare analytics schema]
  CON1[Consumer serverless WG team A]
  CON2[Consumer cluster team B]
  BI1[QuickSight]
  BI2[JDBC analysts]
  PROD --> DS
  DS --> CON1
  DS --> CON2
  CON1 --> BI1
  CON2 --> BI2`}
        />
      </LessonSection>

      <LessonSection title="Redshift Federated Query overview">
        <ContentStep number={1} title="Setup pattern">
          <p className="text-slate-300">
            Create secret in Secrets Manager for RDS credentials.{' '}
            <span className="font-mono text-sm">CREATE EXTERNAL SCHEMA oltp FROM POSTGRES DATABASE 'appdb' URI '…' IAM_ROLE 'arn:…' SECRET_ARN 'arn:…';</span>{' '}
            Query <span className="font-mono text-sm">oltp.products</span> in JOIN with local facts.
          </p>
        </ContentStep>
        <ContentStep number={2} title="When DE uses federation">
          <p className="text-slate-300">
            Real-time product attributes not yet in lake; small reference tables (&lt; few million rows);
            operational flags for one-off investigation. Sync path for analytics still COPY/CDC into S3 →
            curated → warehouse on schedule.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Anti-patterns">
          <p className="text-slate-300">
            <span className="font-mono text-sm">SELECT * FROM oltp.orders JOIN fact_orders</span> on billion
            rows — hammers RDS and Redshift. No sort/dist on federated side. Prefer DMS/Glue CDC to lake,
            then COPY or Spectrum.
          </p>
        </ContentStep>
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Pattern</th>
                <th className="px-4 py-3">Data sharing</th>
                <th className="px-4 py-3">Federated query</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Direction', 'Redshift → Redshift read', 'Redshift → RDS/Aurora live'],
                ['Best for', 'Cross-team/account warehouse gold', 'Small OLTP lookups and enrichment'],
                ['Avoid', 'Expecting consumer writes', 'Large fact extracts from OLTP'],
                ['Governance', 'Datashare + RAM + LF', 'Secrets Manager + SG + IAM'],
              ].map(([pattern, sharing, federated]) => (
                <tr key={pattern} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{pattern}</td>
                  <td className="px-4 py-3">{sharing}</td>
                  <td className="px-4 py-3">{federated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip">
          Default analytics path: OLTP → CDC → S3 curated → COPY/Spectrum. Use federation for exceptions;
          use datashares when many Redshift consumers need the same gold without copying bytes.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Data sharing: producer datashare → consumer database — live read-only cross-cluster/account access.',
          'Avoid duplicate COPY/UNLOAD between teams — datashares cut storage and egress for shared gold.',
          'Federated query: external schema to RDS/Aurora — small joins and lookups only.',
          'Never federate full OLTP fact tables — CDC to lake, then COPY or Spectrum for analytics scale.',
          'Govern datashares with RAM/LF; federated with Secrets Manager, security groups, least-privilege IAM.',
        ]}
      />
    </LessonArticle>
  )
}
