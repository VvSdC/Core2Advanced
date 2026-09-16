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

export function SingleTableDesignOverview() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="One table, many entity types — access patterns drive everything">
        <strong className="text-white">Single-table design</strong> stores multiple entity types (customers,
        orders, line items, pipeline runs) in one DynamoDB table using composite keys and optional sort-key
        prefixes. For data engineers, the takeaway is not memorizing every adjacency list pattern — it is
        understanding why app teams choose one table, how that affects your Streams CDC and GSI Query paths,
        and when to push back on designs that make lake export painful.
      </Callout>

      <Definition term="Single-table design">
        <p>
          A modeling approach where related entities share one DynamoDB table, distinguished by key prefixes
          (e.g. <span className="font-mono text-sm">CUSTOMER#123</span>,{' '}
          <span className="font-mono text-sm">ORDER#456</span>) and optional{' '}
          <span className="font-mono text-sm">entity_type</span> attribute. Access patterns are enumerated
          first; keys and GSIs are designed to satisfy all Query paths — no relational normalization across
          tables, no SQL joins at read time.
        </p>
      </Definition>

      <LessonSection title="Core concepts — conceptual overview">
        <ContentStep number={1} title="Access pattern first">
          <p className="text-slate-300">
            List every Query the application and pipeline need: get customer by id, list orders for customer,
            get order by id, list failed pipeline runs by date. Each pattern maps to PK/SK or GSI — if a
            pattern does not fit, redesign before writing code. DE adds: export by entity type, filter MODIFY
            events for specific prefixes in stream consumer.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Composite keys and prefixes">
          <p className="text-slate-300">
            PK might be <span className="font-mono text-sm">CUSTOMER#customer_id</span>, SK{' '}
            <span className="font-mono text-sm">ORDER#order_id</span> — one Query returns all orders for
            customer. Metadata row: SK = <span className="font-mono text-sm">METADATA</span>. Overloading
            attribute names (same <span className="font-mono text-sm">data</span> field means different things
            per entity) is common — document schema for lake flattening.
          </p>
        </ContentStep>
        <ContentStep number={3} title="GSIs for inverted lookups">
          <p className="text-slate-300">
            GSI1PK = <span className="font-mono text-sm">ORDER#order_id</span>, GSI1SK ={' '}
            <span className="font-mono text-sm">CUSTOMER#customer_id</span> — lookup order without knowing
            customer PK. Single-table designs often carry 2–3 GSIs with overloaded names (GSI1PK, GSI1SK) —
            stream consumer routes by prefix in keys.
          </p>
        </ContentStep>
        <Flowchart
          title="Single-table entity layout (conceptual)"
          chart={`flowchart TB
  TBL[One DynamoDB table]
  TBL --> C1[PK CUSTOMER#123 SK METADATA]
  TBL --> C2[PK CUSTOMER#123 SK ORDER#456]
  TBL --> C3[PK CUSTOMER#123 SK ORDER#789]
  TBL --> P1[PK PIPELINE#orders SK RUN#2024-06-01]
  GSI[GSI1 lookup by ORDER id]
  C2 --> GSI`}
        />
      </LessonSection>

      <LessonSection title="What DE needs to know — not a modeling course">
        <ContentStep number={1} title="Stream consumer filtering">
          <p className="text-slate-300">
            Single-table Streams mix entity types — Lambda filters on PK/SK prefix or{' '}
            <span className="font-mono text-sm">entity_type</span> before landing to separate S3 prefixes (
            <span className="font-mono text-sm">bronze/orders/</span> vs{' '}
            <span className="font-mono text-sm">bronze/customers/</span>). Avoid one undifferentiated bronze
            folder — silver Glue schemas diverge per entity.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Denormalization in the lake">
          <p className="text-slate-300">
            Order row may embed customer fields — lake silver dedupes and normalizes for warehouse star schema.
            Expect duplicate customer attributes on many order stream events — MERGE logic in Glue, not surprise
            during first Athena query.
          </p>
        </ContentStep>
        <ContentStep number={3} title="When multi-table is fine">
          <p className="text-slate-300">
            DE-owned pipeline control tables (watermarks, locks, dedupe) rarely need single-table design —
            simple PK/SK per concern, separate tables for clarity. Single-table shines at app scale with
            tightly coupled entities — not mandatory for every DynamoDB use case in the platform.
          </p>
        </ContentStep>
        <Example title="Entity type routing in stream Lambda" caption="Prefix filter">
{`pk = record['dynamodb']['Keys']['pk']['S']
if pk.startswith('ORDER#'):
    landing_prefix = 'bronze/orders/'
elif pk.startswith('PIPELINE#'):
    landing_prefix = 'bronze/pipeline_control/'
else:
    return  # skip PROFILE rows not needed in lake`}
        </Example>
        <Callout variant="tip">
          Ask app team for access pattern list and entity-relationship diagram before building CDC — single-table
          keys look opaque in raw stream JSON without their cheat sheet.
        </Callout>
      </LessonSection>

      <LessonSection title="Trade-offs for data platforms">
        <ContentStep number={1} title="Pros for integrated systems">
          <p className="text-slate-300">
            One Streams subscription captures all entity changes — one Lambda mapping, one IAM role, one
            on-call surface. Transactional writes across related items in one table via TransactWriteItems.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Cons for analytics onboarding">
          <p className="text-slate-300">
            New analyst question &quot;all vendors&quot; may need new GSI — not ad hoc SQL. Lake team depends
            on app team for key semantics. Export to S3 is flat — entity separation is consumer responsibility.
          </p>
        </ContentStep>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Single-table design: multiple entity types in one table — composite PK/SK prefixes satisfy access patterns.',
          'Model access patterns first, then keys/GSIs — DE inherits key design in Streams CDC and lake routing.',
          'Filter stream records by PK/SK prefix or entity_type — land separate S3 prefixes per lake entity.',
          'DE control tables (watermarks, dedupe) usually stay simple multi-table — single-table is app-domain choice.',
          'Expect denormalized items — silver Glue normalizes for warehouse; get access pattern doc from app team.',
        ]}
      />
    </LessonArticle>
  )
}
