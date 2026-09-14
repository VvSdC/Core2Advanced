import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function RedshiftServerless() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Redshift Serverless — warehouse SQL without cluster sizing">
        <strong className="text-white">Amazon Redshift Serverless</strong> runs the same SQL engine and
        catalog concepts as provisioned Redshift, but AWS scales capacity in{' '}
        <strong className="text-white">Redshift Processing Units (RPUs)</strong> based on workload. You define
        workgroups, base/max RPU limits, and pay for capacity used — not 24/7 node hours on a fixed cluster.
      </Callout>

      <Definition term="Redshift Serverless">
        <p>
          Serverless exposes a <strong className="text-white">namespace</strong> (database + IAM identity
          boundary) and one or more <strong className="text-white">workgroups</strong> (compute endpoints).
          Queries auto-scale RPUs within configured bounds. COPY, Spectrum, materialized views, and Data API
          work similarly to provisioned — but there is no manual node count or classic resize window.
        </p>
      </Definition>

      <Definition term="RPU (Redshift Processing Unit)">
        <p>
          RPUs measure serverless compute capacity — higher RPU limits allow more parallel query throughput.
          Billing is on <strong className="text-white">RPU-hours</strong> consumed per workgroup. Setting{' '}
          <span className="font-mono text-sm">base_capacity</span> too low causes queueing;{' '}
          <span className="font-mono text-sm">max_capacity</span> caps spend during runaway BI queries.
        </p>
      </Definition>

      <LessonSection title="Serverless overview">
        <ContentStep number={1} title="Namespace and workgroup">
          <p className="text-slate-300">
            Namespace holds databases, users, and associated IAM roles for COPY/Spectrum. Workgroup is the
            JDBC/ODBC endpoint analysts hit — isolate dev vs prod with separate workgroups, RPU caps, and
            security groups. Snapshots and datashares attach at namespace level.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Auto-scaling behavior">
          <p className="text-slate-300">
            Idle periods scale toward base capacity; concurrent dashboard load spikes RPUs up to max. ETL
            COPY bursts and heavy CTAS consume RPUs like compute nodes would consume CPU — monitor{' '}
            <span className="font-mono text-sm">ServerlessDatabaseCapacity</span> and query duration in
            CloudWatch.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Same DE primitives">
          <p className="text-slate-300">
            Dist keys, sort keys, WLM (simplified), Spectrum external schemas, UNLOAD, and stored procedures
            still apply. Serverless removes cluster resize ops — not SQL tuning discipline. Automatic table
            optimization can run on serverless tables like provisioned RA3.
          </p>
        </ContentStep>
        <Flowchart
          title="Redshift Serverless architecture"
          chart={`flowchart TB
  NS[Namespace databases IAM roles]
  WG1[Workgroup dev base 8 max 32 RPU]
  WG2[Workgroup prod base 32 max 128 RPU]
  AUTO[Auto scale RPU pool]
  BI[QuickSight JDBC]
  ETL[Lambda COPY orchestration]
  SPEC[Spectrum external schema]
  NS --> WG1
  NS --> WG2
  WG1 --> AUTO
  WG2 --> AUTO
  BI --> WG2
  ETL --> WG2
  WG2 --> SPEC`}
        />
      </LessonSection>

      <LessonSection title="When DE picks serverless vs provisioned">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Choose serverless when</th>
                <th className="px-4 py-3">Choose provisioned RA3 when</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                [
                  'Spiky or unpredictable query load — dev sandboxes, POCs',
                  'Steady high concurrency BI with predictable node sizing',
                ],
                [
                  'Team wants zero resize/patch windows — ops-light',
                  'Need fine-grained WLM, concurrency scaling economics at fixed scale',
                ],
                [
                  'Workload idle nights/weekends — pay near-zero compute off-hours',
                  'Very large sustained ETL with fixed SLAs and reserved capacity planning',
                ],
                [
                  'New team without capacity planning history',
                  'Advanced custom maintenance windows, classic snapshot/restore playbooks',
                ],
              ].map(([serverless, provisioned], idx) => (
                <tr key={idx} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3">{serverless}</td>
                  <td className="px-4 py-3">{provisioned}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip">
          Hybrid pattern: serverless for ad hoc and dev; provisioned RA3 gold cluster for production dashboards
          with reserved concurrency. Both can share Glue-cataloged Spectrum tables on the same S3 curated zone.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Serverless: namespace + workgroups, auto-scale RPUs, pay for capacity used — no fixed node count.',
          'RPUs cap parallel throughput — set base and max on workgroups to balance latency vs cost.',
          'Same SQL, COPY, Spectrum, MVs as provisioned — tuning dist/sort keys still required.',
          'Pick serverless for spiky/idle workloads and ops-light teams; provisioned RA3 for steady high BI load.',
          'Monitor RPU-hours and query queue time — serverless is not auto-cheap without max RPU guardrails.',
        ]}
      />
    </LessonArticle>
  )
}
