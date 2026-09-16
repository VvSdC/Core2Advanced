import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function PuttingItTogetherGlue() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Glue is your serverless ETL spine on the lake">
        You covered crawlers, job sizing, PySpark/DynamicFrames, transforms, workflows, data quality, Spark
        tuning, incremental/CDC, monitoring, orchestration with Lambda/EventBridge/Step Functions, medallion
        patterns, connections, and cost. This checkpoint ties intermediate and advanced Glue lessons together
        before VPC — where private JDBC networking goes deep.
      </Callout>

      <Definition term="Glue mental model for data engineering">
        <p>
          AWS Glue is <strong className="text-white">managed Spark + catalog + orchestration</strong> for S3
          lake ETL. Success requires: partitioned Parquet silver/gold, bookmarked or CDC incremental loads,
          workflow or Step Functions orchestration, Data Quality gates, CloudWatch observability, and right-sized
          workers after data layout is sound — not before.
        </p>
      </Definition>

      <LessonSection title="Glue sub-topic map">
        <Flowchart
          title="Glue lesson map — intermediate through advanced"
          chart={`flowchart TB
  START[Glue complete path]
  START --> CRAWL[Crawlers deep dive]
  START --> JOB[Job types sizing]
  START --> PS[PySpark DynamicFrames]
  START --> XFORM[ApplyMapping transforms]
  START --> CONN[Connections VPC teaser]
  START --> WF[Workflows triggers]
  START --> DQ[Data Quality Schema Registry]
  START --> OPT[Spark optimization]
  START --> COST[Performance and cost]
  START --> INC[Incremental CDC]
  START --> ERR[Error handling monitoring]
  START --> ORCH[Lambda EventBridge Step Functions]
  START --> MED[Medallion architecture]
  CRAWL --> VPCNEXT
  JOB --> VPCNEXT
  PS --> VPCNEXT
  XFORM --> VPCNEXT
  CONN --> VPCNEXT
  WF --> VPCNEXT
  DQ --> VPCNEXT
  OPT --> VPCNEXT
  COST --> VPCNEXT
  INC --> VPCNEXT
  ERR --> VPCNEXT
  ORCH --> VPCNEXT
  MED --> VPCNEXT
  VPCNEXT[VPC — private networking next]`}
        />
      </LessonSection>

      <LessonSection title="Full Glue checkpoint — can you explain…">
        <ContentStep number={1} title="Catalog and crawlers">
          <p className="text-slate-300">
            What does a crawler do vs a Glue ETL job? When crawl S3 vs JDBC? How partition discovery helps
            Athena pruning? When stop using crawlers on curated data?
          </p>
        </ContentStep>
        <ContentStep number={2} title="Jobs and runtime">
          <p className="text-slate-300">
            Spark vs Python Shell? G.1X vs G.2X? What are job parameters and transformation_ctx for bookmarks?
            What does job.commit() do?
          </p>
        </ContentStep>
        <ContentStep number={3} title="Transforms and API">
          <p className="text-slate-300">
            Order ResolveChoice → ApplyMapping → Join? When Relationalize? When convert DynamicFrame to
            DataFrame and back?
          </p>
        </ContentStep>
        <ContentStep number={4} title="Scale and cost">
          <p className="text-slate-300">
            Broadcast vs shuffle join? repartition vs coalesce? Small file problem fix? DPU cost levers in
            priority order?
          </p>
        </ContentStep>
        <ContentStep number={5} title="Incremental and quality">
          <p className="text-slate-300">
            Bookmarks vs CDC vs timestamp incremental? Schema evolution strategy? Data Quality fail →
            quarantine flow?
          </p>
        </ContentStep>
        <ContentStep number={6} title="Orchestration and medallion">
          <p className="text-slate-300">
            Glue workflow vs Step Functions? Bronze/silver/gold Glue responsibilities? EventBridge on job
            failure?
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Interview-style quick checks">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Question</th>
                <th className="px-4 py-3">Strong answer sketch</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                [
                  'Crawler vs ETL job?',
                  'Crawler infers schema/partitions into catalog; ETL job transforms and writes data.',
                ],
                [
                  'DynamicFrame vs DataFrame?',
                  'DynamicFrame flexible schema + Glue transforms; DataFrame fixed schema + Spark SQL — convert at boundary.',
                ],
                [
                  'Job bookmark purpose?',
                  'Persist incremental state per transformation_ctx — process only new S3/JDBC data; requires job.commit().',
                ],
                [
                  'Why Glue connection?',
                  'VPC ENI to reach private RDS/Redshift JDBC — S3 jobs do not need it.',
                ],
                [
                  'Small files problem?',
                  'Too many tiny Parquet files — slow reads; fix with coalesce/compaction job targeting 128–512 MB.',
                ],
                [
                  'When Python Shell?',
                  'Single-node small data/script — not distributed Spark transforms.',
                ],
                [
                  'Glue vs Athena for transform?',
                  'Glue Spark for TB joins/complex ETL; Athena CTAS for GB-scale SQL materialization.',
                ],
                [
                  'CDC vs bookmark JDBC?',
                  'CDC captures deletes/updates via log; bookmark timestamp incremental misses hard deletes.',
                ],
                [
                  'Workflow trigger types?',
                  'Scheduled cron, event (S3), conditional on predecessor success/failure.',
                ],
                [
                  'Cost optimize order?',
                  'Partition prune → compact files → reduce shuffle → then worker count/type.',
                ],
              ].map(([question, answer]) => (
                <tr key={question} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{question}</td>
                  <td className="px-4 py-3">{answer}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip" title="Ready for VPC when…">
          You can whiteboard medallion Glue flow, explain JDBC connection + SG requirements, describe bookmark
          incremental vs CDC, and prioritize partition/file optimization before adding workers — without opening
          the docs.
        </Callout>
      </LessonSection>

      <LessonSection title="What comes next — VPC">
        <p className="text-slate-300">
          Glue JDBC and hybrid jobs depend on subnets, security groups, NAT, and VPC endpoints. The{' '}
          <strong className="text-white">VPC sub-topic</strong> deep-dives private networking so RDS extract,
          Redshift UNLOAD paths, and Glue ENI placement are debuggable under on-call pressure — building on
          the connections teaser from this Glue path.
        </p>
        <Flowchart
          title="After Glue — course thread"
          chart={`flowchart LR
  S3[S3 lake zones]
  GLUE[Glue checkpoint]
  VPC[VPC networking]
  EB[EventBridge]
  SF[Step Functions]
  S3 --> GLUE
  GLUE --> VPC
  VPC --> GLUE
  GLUE --> EB
  EB --> SF`}
        />
        <Callout variant="insight">
          Revisit this checkpoint when onboarding DEs, tuning a new silver job, or investigating DPU cost
          spikes — answers usually trace to partitions, small files, shuffle, or missing bookmarks covered in
          these lessons.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Glue: crawlers for catalog discovery, Spark ETL for medallion transforms, workflows for orchestration.',
          'Intermediate: job sizing, DynamicFrames/transforms, connections teaser — hands-on lake promotion.',
          'Advanced: optimization, incremental/CDC, quality/registry, monitoring, cross-service orchestration, cost.',
          'Use checkpoint questions and interview table before VPC — JDBC failures are usually network not SQL.',
          'Next sub-topic: VPC — subnets, SGs, endpoints for private Glue/RDS/Redshift data-plane access.',
        ]}
      />
    </LessonArticle>
  )
}
