import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function EventbridgeDrivenPipelines() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="EventBridge is the nervous system of modern lake orchestration">
        Mature data platforms combine <strong className="text-white">scheduled rules</strong> (nightly
        reconciliation), <strong className="text-white">S3 event patterns</strong> (real-time ingest), and{' '}
        <strong className="text-white">Glue state events</strong> (failure handling) on one bus — wiring
        Lambda, Step Functions, and Glue without cron EC2 or polling S3 prefixes.
      </Callout>

      <Definition term="EventBridge-driven pipeline">
        <p>
          An end-to-end data flow where EventBridge rules — not human triggers or single-purpose schedulers —
          initiate and coordinate stage transitions: land → validate → transform → quality check → publish
          curated partition → notify consumers. State lives in events, watermarks, and job bookmarks — not in
          a monolithic orchestrator VM.
        </p>
      </Definition>

      <LessonSection title="Combining schedule and event patterns">
        <ContentStep number={1} title="Event-driven path (S3)">
          <p className="text-slate-300">
            Vendor files arrive unpredictably — Object Created on{' '}
            <span className="font-mono text-sm">raw/orders/</span> triggers Lambda → Glue silver job within
            minutes of landing. Latency-sensitive dashboards and near-real-time silver depend on this path.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Schedule-driven path (cron)">
          <p className="text-slate-300">
            Nightly rule <span className="font-mono text-sm">cron(0 6 * * ? *)</span> starts Step Functions
            even if no files arrived — catch-up compaction, aggregate gold tables, Athena reconciliation vs
            source row counts. Schedules guarantee SLA windows independent of upstream delivery gaps.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Glue state as feedback loop">
          <p className="text-slate-300">
            Rule on Glue Job State Change SUCCESS for silver job → trigger gold Step Functions. FAILED → SNS
            and disable downstream rules via Lambda updating SSM parameter. EventBridge closes the loop
            between transform completion and next stage — no polling GetJobRun in Lambda loops.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Custom bus lifecycle events">
          <p className="text-slate-300">
            Silver job publishes <span className="font-mono text-sm">CuratedPartitionReady</span> to custom bus
            after quality pass — consumption team rules refresh materialized views and invalidate cache without
            coupling to Glue job internals.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="End-to-end architecture flowchart">
        <Flowchart
          title="Medallion pipeline — schedule + S3 + Glue events"
          chart={`flowchart TB
  subgraph triggers [EventBridge triggers]
    S3E[S3 Object Created rule raw prefix]
    CRON[Schedule rule cron 6 AM UTC]
    GLUEE[Glue Job State Change SUCCESS FAILED]
  end
  subgraph orchestration [Orchestration layer]
    SF[Step Functions medallion workflow]
    LAM[Lambda validate and watermark]
  end
  subgraph compute [Transform]
    GLUEB[Glue bronze to silver]
    GLUEG[Glue silver to gold]
  end
  subgraph storage [Lake]
    RAW[(S3 raw)]
    SIL[(S3 silver)]
    GOLD[(S3 gold)]
  end
  subgraph ops [Operations]
    SNS[SNS alerts]
    BUS[Custom bus CuratedPartitionReady]
  end
  RAW --> S3E
  S3E --> LAM
  LAM --> GLUEB
  GLUEB --> SIL
  CRON --> SF
  SF --> GLUEG
  GLUEB --> GLUEE
  GLUEE -->|SUCCESS silver| SF
  GLUEE -->|FAILED| SNS
  GLUEG --> GOLD
  SF --> BUS`}
        />
        <Callout variant="tip">
          Use EventBridge Scheduler for complex schedules (flexible windows, one-off backfills) alongside
          classic cron rules — both can target the same Step Functions ARN with InputConstant for pipeline
          parameters.
        </Callout>
      </LessonSection>

      <LessonSection title="Design principles">
        <ContentStep number={1} title="Idempotent stages">
          <p className="text-slate-300">
            S3 events and replays duplicate triggers — every stage overwrites partition or merges on key.
            Watermark table updated atomically after successful commit. Schedule and event path may both fire
            same day — dedupe on run_date + dataset in Lambda or Step Functions Choice state.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Failure domains">
          <p className="text-slate-300">
            Separate rules for ingest, transform, and notify — DLQ per critical target. Archive on prod bus.
            FAILED Glue event disables gold schedule via feature flag until ops clears — prevent bad aggregates
            propagating.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Observability">
          <p className="text-slate-300">
            Dashboard: rule Invocations, FailedInvocations, Lambda duration, Glue DPU, DLQ depth. Correlate
            event id in structured logs across Lambda and Glue for traceability from S3 key to gold partition.
          </p>
        </ContentStep>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Combine S3 event rules (real-time ingest), cron/Scheduler (SLA batch), Glue state rules (stage chaining).',
          'Architecture: S3 → validate Lambda → Glue silver → SUCCESS event → Step Functions gold → custom bus notify.',
          'Schedules catch compaction and reconciliation even when upstream sends no files.',
          'Custom bus lifecycle events decouple consumption team from Glue job implementation details.',
          'Idempotent partitions, per-target DLQ, bus archive, and FailedInvocations dashboard for production ops.',
        ]}
      />
    </LessonArticle>
  )
}
