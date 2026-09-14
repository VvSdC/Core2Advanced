import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function WellArchitectedFramework() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Everyday idea">
        Building a house involves more than walls — plumbing, electrical safety, insulation, and a budget
        all matter. The AWS <strong className="text-white">Well-Architected Framework</strong> is a
        checklist of six quality areas AWS recommends for any cloud workload, including data platforms.
        It helps you ask the right questions before production.
      </Callout>

      <Definition term="AWS Well-Architected Framework">
        <p>
          The <strong className="text-white">Well-Architected Framework</strong> is AWS guidance for
          designing and operating reliable, secure, efficient, and cost-effective systems. It organizes best
          practices into <strong className="text-white">six pillars</strong>. You can run formal
          Well-Architected Reviews in the console; even informally, the pillars give data engineers a
          shared vocabulary with architects and security teams.
        </p>
      </Definition>

      <LessonSection title="The six pillars — one DE example each">
        <ContentStep number={1} title="Operational Excellence">
          <p className="text-slate-300">
            Run and monitor systems to deliver business value; improve processes and procedures
            continuously.
          </p>
          <p className="mt-2 text-slate-300">
            <strong className="text-white">DE example:</strong> CloudWatch alarms on Glue job failures,
            runbooks for replaying a bad partition, Infrastructure as Code (CloudFormation) for pipeline
            stacks so changes are repeatable — not manual console clicks at midnight.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Security">
          <p className="text-slate-300">
            Protect information and systems; apply least privilege and defense in depth.
          </p>
          <p className="mt-2 text-slate-300">
            <strong className="text-white">DE example:</strong> IAM roles for Glue and Lambda (no long-lived
            keys in code), S3 bucket policies blocking public access, KMS encryption on lake buckets, VPC
            endpoints so traffic never crosses the public internet for sensitive extracts.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Reliability">
          <p className="text-slate-300">
            Recover from failures; meet demand; avoid incorrect processing through design and automation.
          </p>
          <p className="mt-2 text-slate-300">
            <strong className="text-white">DE example:</strong> Multi-AZ RDS for metadata, S3 versioning on
            curated tables, Step Functions retries with idempotent writes, regular restore tests from
            Redshift snapshots.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Performance Efficiency">
          <p className="text-slate-300">
            Use computing resources efficiently; scale with demand; adopt new services when they fit.
          </p>
          <p className="mt-2 text-slate-300">
            <strong className="text-white">DE example:</strong> Parquet + partition pruning for Athena,
            right-sized Glue worker types, Redshift distribution keys aligned to join patterns — measure
            before upsizing.
          </p>
        </ContentStep>
        <ContentStep number={5} title="Cost Optimization">
          <p className="text-slate-300">
            Avoid unnecessary spend; understand where money goes; optimize over the workload lifetime.
          </p>
          <p className="mt-2 text-slate-300">
            <strong className="text-white">DE example:</strong> S3 Intelligent-Tiering for aging lake
            zones, pausing dev Redshift clusters, Savings Plans for steady EC2/Glue baseline, Cost
            Explorer reviews tagged by project.
          </p>
        </ContentStep>
        <ContentStep number={6} title="Sustainability">
          <p className="text-slate-300">
            Minimize environmental impact of cloud workloads — often by using fewer resources more
            efficiently.
          </p>
          <p className="mt-2 text-slate-300">
            <strong className="text-white">DE example:</strong> Graviton instances for compatible Spark
            jobs, consolidating batch windows to avoid 24/7 idle clusters, deleting obsolete datasets
            instead of hoarding infinite S3 storage &quot;just in case.&quot;
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="How the pillars connect">
        <Flowchart
          title="Well-Architected pillars"
          chart={`flowchart TB
  WA[Well-Architected data platform]
  WA --> OE[Operational Excellence]
  WA --> SEC[Security]
  WA --> REL[Reliability]
  WA --> PERF[Performance Efficiency]
  WA --> COST[Cost Optimization]
  WA --> SUS[Sustainability]
  SEC --> REL
  REL --> OE
  PERF --> COST
  COST --> SUS`}
        />
        <Callout variant="insight">
          Pillars trade off against each other. Maximum security (every request through strict inspection)
          can hurt performance. Maximum cost cutting can hurt reliability. Document conscious choices —
          that is mature architecture.
        </Callout>
      </LessonSection>

      <LessonSection title="Using the framework without overwhelm">
        <ContentStep number={1} title="Pick one pillar per sprint">
          <p className="text-slate-300">
            New lake? Start with Security (IAM, encryption, public access block) and Reliability (backups,
            retries). Add Cost and Performance reviews after the first production month of metrics.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Ask review questions aloud">
          <p className="text-slate-300">
            &quot;What happens if this AZ fails?&quot; (Reliability) &quot;Who can delete this bucket?&quot;
            (Security) &quot;What does a full-day Athena scan cost?&quot; (Cost) — the framework is
            basically a structured interview with your own design.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Connect to later sub-topics">
          <p className="text-slate-300">
            IAM, S3, Glue, VPC, CloudFormation, KMS, and CloudTrail lessons each map to multiple pillars.
            Returning to this page after those modules helps you see the full picture.
          </p>
        </ContentStep>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Well-Architected Framework = six pillars: Operational Excellence, Security, Reliability, Performance Efficiency, Cost Optimization, Sustainability.',
          'Each pillar applies to DE: runbooks and IaC, IAM and encryption, backups and retries, partition tuning, tiering and tagging, efficient compute.',
          'Pillars interact and trade off — use them as a question checklist, not a one-time checkbox exercise.',
        ]}
      />
    </LessonArticle>
  )
}
