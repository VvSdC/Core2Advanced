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

export function RtoRpoBackupDr() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Everyday idea">
        If your laptop dies at 3 p.m., <strong className="text-white">RPO</strong> asks: &quot;How much
        work since the last backup can we lose?&quot; <strong className="text-white">RTO</strong> asks:
        &quot;How long until you are working again on a new machine?&quot; Data platforms need the same
        answers — in minutes and rows, not feelings.
      </Callout>

      <Definition term="RPO — Recovery Point Objective">
        <p>
          <strong className="text-white">RPO (Recovery Point Objective)</strong> is the maximum acceptable
          amount of <em>data loss</em> measured in time. If RPO is 1 hour, you must be able to recover
          data as it existed no more than 1 hour before the failure.
        </p>
        <p className="mt-2 text-slate-300">
          Lower RPO requires more frequent backups, continuous replication, or dual writes — all cost
          more.
        </p>
      </Definition>

      <Definition term="RTO — Recovery Time Objective">
        <p>
          <strong className="text-white">RTO (Recovery Time Objective)</strong> is the maximum acceptable
          time to restore <em>service</em> after an outage. If RTO is 4 hours, pipelines and queries must
          be running again within 4 hours of a disaster declaration.
        </p>
        <p className="mt-2 text-slate-300">
          Lower RTO requires pre-provisioned DR infrastructure, automation, and tested runbooks — not
          &quot;we will figure it out when it happens.&quot;
        </p>
      </Definition>

      <LessonSection title="DE examples — pipeline and warehouse">
        <ContentStep number={1} title="Batch pipeline RPO">
          <p className="text-slate-300">
            Nightly job loads one day of sales into the warehouse at 2 a.m. If the lake bucket is
            corrupted at noon and your only backup is yesterday&apos;s snapshot, RPO is ~24 hours — you
            lose today&apos;s landed files unless you have continuous S3 replication or hourly incremental
            exports.
          </p>
          <Example title="Pipeline RPO scenario" caption="Business question to ask stakeholders">
{`Stakeholder: "We cannot lose more than 15 minutes of ingestion."
→ RPO = 15 min → need streaming buffer, frequent micro-batches, or CRR with short lag monitoring — not a single nightly dump.`}
          </Example>
        </ContentStep>
        <ContentStep number={2} title="Warehouse RTO">
          <p className="text-slate-300">
            Redshift cluster lost in a Region incident. Restoring from snapshot to a new cluster might take
            2 hours (RTO = 2h if that meets SLA). If executives need dashboards within 30 minutes, you need
            warm standby or cross-Region read replica — higher cost, lower RTO.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Metadata and orchestration">
          <p className="text-slate-300">
            Even perfect S3 backups fail if Glue Data Catalog, Step Functions state, or IAM roles are not
            documented. Include catalog exports and IaC templates in DR scope — recovery is more than
            restoring Parquet files.
          </p>
        </ContentStep>
        <Flowchart
          title="RPO vs RTO on a timeline"
          chart={`flowchart LR
  T0[Last good backup / replica point] --> FAIL[Failure occurs]
  FAIL --> REC[Service restored]
  T0 -.RPO window.-> FAIL
  FAIL -.RTO window.-> REC`}
        />
      </LessonSection>

      <LessonSection title="Backup vs full disaster recovery">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Aspect</th>
                <th className="px-4 py-3">Backup</th>
                <th className="px-4 py-3">Full DR program</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Purpose', 'Copy data for restore', 'Restore entire platform to meet RTO/RPO'],
                ['Scope', 'Snapshots, versioning, exports', 'Runbooks, DR Region, failover testing, comms plan'],
                ['DE tools', 'RDS/Redshift snapshots, S3 versioning, AWS Backup', 'CRR, pilot light cluster, Route 53 failover, multi-account isolation'],
                ['Testing', 'Occasional restore to sandbox', 'Scheduled game days and measured RTO/RPO drills'],
              ].map(([aspect, backup, dr]) => (
                <tr key={aspect} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{aspect}</td>
                  <td className="px-4 py-3">{backup}</td>
                  <td className="px-4 py-3">{dr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="insight">
          Backups without DR planning are like saving files with no spare computer. DR without tested
          backups is theater. You need both, sized to agreed RTO/RPO.
        </Callout>
      </LessonSection>

      <LessonSection title="Choosing targets — practical steps">
        <ContentStep number={1} title="Classify workloads">
          <p className="text-slate-300">
            Tier 1: revenue or compliance critical (strict RTO/RPO). Tier 2: internal analytics (hours
            acceptable). Tier 3: dev sandboxes (best effort). Not everything deserves 15-minute RPO.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Map targets to AWS patterns">
          <p className="text-slate-300">
            RPO 24h + RTO 8h → nightly snapshots + backup/restore DR. RPO 1h + RTO 2h → CRR + automated
            CloudFormation restore + warm Redshift. Document the mapping so finance understands the bill.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Measure and revise">
          <p className="text-slate-300">
            After each drill, record actual recovery time and data gap. Update architecture if you missed
            targets — or renegotiate SLAs if cost is prohibitive.
          </p>
        </ContentStep>
      </LessonSection>

      <KeyTakeaways
        items={[
          'RPO = max acceptable data loss (time); RTO = max acceptable downtime to restore service.',
          'Pipelines and warehouses need explicit targets — e.g. hourly landings vs nightly batch changes RPO design.',
          'Backups are one tool; full DR adds replication, runbooks, and testing — choose patterns that match agreed RTO/RPO tiers.',
        ]}
      />
    </LessonArticle>
  )
}
