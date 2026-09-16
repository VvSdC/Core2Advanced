import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function SchemaRegistryEventbridge() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Events need contracts — Schema Registry documents them">
        Custom and partner events carry JSON payloads that evolve as pipelines add fields.{' '}
        <strong className="text-white">EventBridge Schema Registry</strong> discovers, versions, and exports
        schemas for event patterns — helping data teams prevent breaking changes when ingest publishes new{' '}
        <span className="font-mono text-sm">detail-type</span> shapes to the bus.
      </Callout>

      <Definition term="EventBridge Schema Registry">
        <p>
          A managed registry attached to event buses that ingests event samples, infers JSON Schema (OpenAPI
          3 format for events), tracks versions, and generates code bindings (Java, Python, TypeScript). Distinct
          from Glue Schema Registry (Avro/Protobuf for Kafka/Kinesis records) but solves the same contract
          problem for application events on EventBridge.
        </p>
      </Definition>

      <LessonSection title="How Schema Registry works with EventBridge">
        <ContentStep number={1} title="Schema discovery">
          <p className="text-slate-300">
            Enable schema discovery on a bus — EventBridge samples incoming events and builds schemas grouped
            by <span className="font-mono text-sm">source</span> and{' '}
            <span className="font-mono text-sm">detail-type</span>. Review inferred schema in console; promote
            to registered version when stable. Producers publishing{' '}
            <span className="font-mono text-sm">CuratedPartitionReady</span> get documented{' '}
            <span className="font-mono text-sm">detail</span> fields automatically over time.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Registered schemas and versions">
          <p className="text-slate-300">
            Register schema manually or from discovery — each edit creates new version. Consumers code against
            generated types or validate inbound events in Lambda before StartJobRun. Breaking change: remove
            required field — coordinate version bump and dual-publish period with analytics subscribers.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Export and codegen">
          <p className="text-slate-300">
            Download OpenAPI 3 event schema; generate Python dataclasses or Java POJOs for type-safe PutEvents
            publishers and rule test fixtures. IaC teams embed schema ARN in documentation modules — onboarding
            lists required <span className="font-mono text-sm">detail</span> keys per pipeline stage.
          </p>
        </ContentStep>
        <Flowchart
          title="Schema lifecycle on custom data bus"
          chart={`flowchart TB
  PUB[Ingest Lambda PutEvents]
  BUS[Custom bus schema discovery on]
  DISC[Inferred schema draft]
  REG[Registered schema v2]
  CON1[Analytics rule author]
  CON2[Lambda validator]
  CODE[Generated Python types]
  PUB --> BUS
  BUS --> DISC
  DISC --> REG
  REG --> CON1
  REG --> CODE
  CODE --> PUB
  REG --> CON2
  CON2 -->|invalid| DLQ[Reject or DLQ]
  CON2 -->|valid| GLUE[Glue StartJobRun]`}
        />
      </LessonSection>

      <LessonSection title="DE practices and Glue Schema Registry contrast">
        <ContentStep number={1} title="Event contracts for orchestration">
          <p className="text-slate-300">
            Standardize pipeline events: <span className="font-mono text-sm">BronzeIngestComplete</span>,{' '}
            <span className="font-mono text-sm">SilverQualityPassed</span>,{' '}
            <span className="font-mono text-sm">GoldMaterialized</span> — each with schema documenting table,
            partition, row_count, run_id. Downstream rules match detail-type; Step Functions input validated
            against schema before expensive Glue invocation.
          </p>
        </ContentStep>
        <ContentStep number={2} title="EventBridge vs Glue Schema Registry">
          <p className="text-slate-300">
            <strong className="text-white">EventBridge Schema Registry</strong>: JSON events on buses — orchestration
            and microservice-style pipeline signals.{' '}
            <strong className="text-white">Glue Schema Registry</strong>: serialized stream records (Avro/JSON
            on Kinesis/Kafka) inside Glue streaming ETL. Lake teams often use both — Glue registry for stream
            deserialization, EventBridge registry for bus contracts.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Governance workflow">
          <p className="text-slate-300">
            Platform team owns registry in prod bus; PR review for schema version bumps like API changes.
            Sandbox discovery mode freely; prod requires registered schema before new detail-type goes live.
            Pair with EventBridge archive for replay when schema migration needs reprocessing historical events.
          </p>
        </ContentStep>
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Registry</th>
                <th className="px-4 py-3">Primary use in DE</th>
                <th className="px-4 py-3">Format</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                [
                  'EventBridge Schema Registry',
                  'Bus orchestration events, PutEvents contracts',
                  'JSON Schema / OpenAPI 3 events',
                ],
                [
                  'Glue Schema Registry',
                  'Kinesis/Kafka Glue streaming deserialize',
                  'Avro, JSON, Protobuf',
                ],
              ].map(([registry, use, format]) => (
                <tr key={registry} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{registry}</td>
                  <td className="px-4 py-3">{use}</td>
                  <td className="px-4 py-3">{format}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="insight">
          Schema discovery infers from traffic — rare events may lack schema until sampled. Publish synthetic
          canary events after deploying new detail-type so registry captures full shape before prod traffic.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'EventBridge Schema Registry: discover, version, export JSON event schemas per source and detail-type.',
          'Enable discovery on custom bus; register stable schemas; codegen for type-safe publishers and validators.',
          'Pipeline contracts: BronzeIngestComplete, SilverQualityPassed — document partition, row_count, run_id.',
          'Distinct from Glue Schema Registry (stream Avro/JSON) — use both for bus orchestration vs stream records.',
          'Govern schema versions like APIs; canary PutEvents so discovery captures new detail-types early.',
        ]}
      />
    </LessonArticle>
  )
}
