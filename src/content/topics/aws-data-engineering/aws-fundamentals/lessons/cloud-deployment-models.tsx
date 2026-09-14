import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function CloudDeploymentModels() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Not all cloud looks the same">
        &quot;Moving to the cloud&quot; can mean a public AWS account, a private cloud inside your
        company, or a hybrid mix. The deployment model describes <em>who owns the infrastructure</em>{' '}
        and <em>who can use it</em> — not whether you use EC2 or S3.
      </Callout>

      <Definition term="Cloud deployment models">
        <p>
          <strong className="text-white">Public cloud</strong> — resources owned by a provider (AWS,
          Azure, GCP) and shared among many customers with logical isolation.{' '}
          <strong className="text-white">Private cloud</strong> — cloud-style APIs and automation, but
          dedicated to one organization on-premises or hosted exclusively for them.{' '}
          <strong className="text-white">Hybrid cloud</strong> — intentional integration between
          on-premises (or private) and public cloud workloads.
        </p>
      </Definition>

      <LessonSection title="Public cloud">
        <p className="text-slate-300">
          AWS is the canonical public cloud example. You create an account, launch S3 buckets and Glue
          jobs, and pay per use. Other tenants never see your data because isolation is enforced by IAM,
          VPC, and encryption — but the physical racks are shared at the provider level.
        </p>
        <ContentStep number={1} title="When public cloud fits DE">
          <p className="text-slate-300">
            Greenfield data lakes, variable batch workloads, startups without datacenters, and teams that
            want the full AWS service catalog without capital budgets.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Data engineering examples">
          <p className="text-slate-300">
            Landing zone on S3, Glue crawlers building a Data Catalog, Athena for ad hoc SQL,
            EventBridge schedules triggering Lambda — all native public AWS patterns.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Private cloud">
        <p className="text-slate-300">
          A bank might run OpenStack or VMware Cloud on hardware in its own facility. Developers still
          request VMs via self-service portals, but no other company shares that metal. Compliance teams
          sometimes require this when regulations demand physical control.
        </p>
        <ContentStep number={1} title="When private cloud fits DE">
          <p className="text-slate-300">
            Strict data sovereignty, legacy systems that cannot leave the building, or industries with
            mandates that public multi-tenant hosting cannot satisfy without extra controls.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Tradeoff">
          <p className="text-slate-300">
            You regain physical control but lose the instant global scale and managed service depth of
            public AWS. Many &quot;private cloud&quot; DE stacks are really Hadoop clusters with
            internal tooling — powerful, but more ops burden.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Hybrid cloud">
        <p className="text-slate-300">
          Hybrid connects on-premises sources to public cloud processing and storage. A factory keeps
          sensor data locally for latency, then syncs aggregates to S3 for enterprise analytics. AWS
          offers Direct Connect, VPN, Storage Gateway, and DMS to bridge the gap.
        </p>
        <ContentStep number={1} title="Hybrid lake example">
          <p className="text-slate-300">
            Oracle DB on-prem → AWS Database Migration Service or nightly exports → S3 raw zone → Glue
            ETL → Redshift for BI. Sensitive rows may stay on-prem; anonymized copies land in the lake.
          </p>
        </ContentStep>
        <ContentStep number={2} title="When hybrid fits DE">
          <p className="text-slate-300">
            Gradual migration, burst capacity to cloud while core ERP stays on-prem, or compliance that
            allows cloud analytics only after data is masked at the source.
          </p>
        </ContentStep>
        <Flowchart
          title="Hybrid data lake (conceptual)"
          chart={`flowchart LR
  A[On-prem OLTP / ERP] --> B[VPN or Direct Connect]
  B --> C[S3 landing bucket]
  C --> D[Glue ETL]
  D --> E[Redshift / Athena]
  E --> F[BI dashboards]`}
        />
      </LessonSection>

      <LessonSection title="Choosing a model — practical guide">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Model</th>
                <th className="px-4 py-3">Best when</th>
                <th className="px-4 py-3">Watch out for</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Public', 'Need speed, elasticity, full AWS catalog', 'Shared responsibility, egress costs'],
                ['Private', 'Hard compliance or legacy lock-in on-site', 'CapEx, slower scaling, fewer managed DE services'],
                ['Hybrid', 'Phased migration or split custody of data', 'Network complexity, dual ops skill sets'],
              ].map(([model, when, watch]) => (
                <tr key={model} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{model}</td>
                  <td className="px-4 py-3">{when}</td>
                  <td className="px-4 py-3">{watch}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="insight">
          Most learners in this track will work primarily in <strong className="text-white">public
          AWS</strong>, but interviews and real jobs often mention hybrid pipelines. Knowing where data
          originates is as important as knowing where it lands.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Public cloud = shared provider infrastructure (AWS); private = dedicated org infrastructure; hybrid = connected mix.',
          'DE examples: full public lake on S3/Glue; hybrid with on-prem sources feeding S3 via VPN or DMS.',
          'Pick public for elasticity and managed services; private for strict custody; hybrid for gradual migration or split data custody.',
        ]}
      />
    </LessonArticle>
  )
}
