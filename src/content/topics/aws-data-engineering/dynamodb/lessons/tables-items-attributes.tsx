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

export function TablesItemsAttributes() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Three words — one mental model">
        DynamoDB organizes everything into <strong className="text-white">tables</strong>, each holding
        many <strong className="text-white">items</strong>, each item made of{' '}
        <strong className="text-white">attributes</strong> (name-value pairs). If you have used JSON or
        Python dictionaries, you already understand 80% of the model — the difference is that every item
        must have a unique primary key within its table, and AWS spreads items across partitions by that
        key.
      </Callout>

      <Definition term="Table">
        <p>
          A <strong className="text-white">table</strong> is a top-level container for items — analogous to
          one spreadsheet or one collection in MongoDB, but with a defined primary key structure. DE teams
          often create separate tables per concern:{' '}
          <code className="text-core-400">de-pipeline-state</code>,{' '}
          <code className="text-core-400">de-idempotency-keys</code>,{' '}
          <code className="text-core-400">de-vendor-config</code> — rather than one giant table for
          everything.
        </p>
      </Definition>

      <Definition term="Item">
        <p>
          An <strong className="text-white">item</strong> is a single record in a table — one job bookmark,
          one idempotency entry, one vendor config row. Items are uniquely identified by their primary key
          (partition key alone, or partition key plus sort key). Maximum item size is 400 KB — plenty for
          metadata, far too small for raw CSV payloads (those stay in S3).
        </p>
      </Definition>

      <Definition term="Attribute">
        <p>
          An <strong className="text-white">attribute</strong> is a name-value pair on an item — e.g.{' '}
          <code className="text-core-400">status: &quot;RUNNING&quot;</code>,{' '}
          <code className="text-core-400">last_watermark: 1694800000</code>. Attribute names are strings;
          values can be string, number, binary, boolean, null, string set, number set, list, or map. Items
          in the same table need not share the same attributes — only the primary key is required on every
          item.
        </p>
      </Definition>

      <LessonSection title="JSON-like item mental model">
        <p className="text-slate-300">
          Picture each DynamoDB item as a JSON document with one special rule: two attributes form the{' '}
          <strong className="text-white">primary key</strong> and cannot change after the item is created
          (without delete and re-insert). Everything else is mutable with{' '}
          <code className="text-core-400">UpdateItem</code>.
        </p>
        <Example title="Pipeline state item — JSON mental model" caption="Table: de-pipeline-state">
{`{
  "job_id": "orders-nightly",          ← partition key (PK)
  "run_date": "2026-09-16",              ← sort key (SK) if composite key table
  "status": "SUCCEEDED",
  "last_watermark_ts": 1694822400,
  "last_s3_key": "raw/orders/part-00042.parquet",
  "rows_processed": 1250000,
  "config": {
    "target_bucket": "acme-lake-prod",
    "silver_prefix": "silver/orders/"
  },
  "updated_at": "2026-09-16T02:14:33Z"
}`}
        </Example>
        <ContentStep number={1} title="Primary key attributes are special">
          <p className="text-slate-300">
            In a simple key table, one attribute is the partition key (here{' '}
            <code className="text-core-400">job_id</code>). In a composite key table, add a sort key (here{' '}
            <code className="text-core-400">run_date</code>) so multiple items share the same partition key
            — one row per nightly run under the same job.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Non-key attributes are flexible">
          <p className="text-slate-300">
            Tomorrow you add <code className="text-core-400">error_message</code> on failed runs only — no
            migration script. Other succeeded items simply omit that attribute. This flexibility suits
            evolving pipeline metadata better than rigid RDS columns for rarely used fields.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Nested maps and lists">
          <p className="text-slate-300">
            Store small structured config as a map attribute instead of flattening into{' '}
            <code className="text-core-400">config_target_bucket</code>,{' '}
            <code className="text-core-400">config_silver_prefix</code>, etc. Keep nesting shallow for
            clarity; very large nested documents approach the 400 KB item limit.
          </p>
        </ContentStep>
        <Flowchart
          title="Table → items → attributes hierarchy"
          chart={`flowchart TB
  T[Table de-pipeline-state]
  T --> I1[Item PK job_id orders-nightly SK 2026-09-15]
  T --> I2[Item PK job_id orders-nightly SK 2026-09-16]
  T --> I3[Item PK job_id inventory-hourly SK 2026-09-16]
  I2 --> A1[status SUCCEEDED]
  I2 --> A2[last_watermark_ts number]
  I2 --> A3[config map nested]`}
        />
      </LessonSection>

      <LessonSection title="Tables in a DE platform — how teams organize">
        <ContentStep number={1} title="One table per access domain">
          <p className="text-slate-300">
            Idempotency keys and job state have different lifecycles and TTL needs — separate tables simplify
            IAM (Lambda dedup role read-only on idempotency table) and capacity tuning (hot idempotency writes
            vs steady state reads).
          </p>
        </ContentStep>
        <ContentStep number={2} title="Naming and environments">
          <p className="text-slate-300">
            <code className="text-core-400">de-pipeline-state-dev</code> vs{' '}
            <code className="text-core-400">de-pipeline-state-prod</code> — or one table with{' '}
            <code className="text-core-400">env</code> in the partition key prefix. CloudFormation
            parameterizes table names per stack; avoid prod Lambdas pointing at dev tables.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Item size discipline">
          <p className="text-slate-300">
            Store S3 paths and timestamps in DynamoDB; store file bytes in S3. If an item grows with embedded
            error stack traces or sample rows, trim or archive to S3 — oversized items fail writes at 400 KB.
          </p>
        </ContentStep>
        <Callout variant="tip" title="Console vs code">
          The DynamoDB console shows items in a table view with attribute columns — convenient for ops. Under
          the hood it is still schemaless items; empty cells mean that attribute is absent on that item, not
          SQL NULL in a fixed column.
        </Callout>
      </LessonSection>

      <LessonSection title="Supported attribute types — quick reference">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">DE example</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['String (S)', 'job_id, status, s3_key, iso timestamp strings'],
                ['Number (N)', 'last_watermark_ts, rows_processed, retry_count'],
                ['Boolean (BOOL)', 'enabled, is_backfill'],
                ['Map (M)', 'nested config object with bucket and prefix'],
                ['List (L)', 'list of failed file keys from last run'],
                ['String Set (SS)', 'allowed vendor codes — unique strings'],
              ].map(([type, example]) => (
                <tr key={type} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{type}</td>
                  <td className="px-4 py-3">{example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="insight">
          Prefer numeric epoch or ISO strings consistently for timestamps — mixing formats in one table makes
          application sorting and debugging painful. Document the convention in your platform runbook.
        </Callout>
      </LessonSection>

      <LessonSection title="CRUD operations — how items move">
        <ContentStep number={1} title="PutItem — create or replace whole item">
          <p className="text-slate-300">
            Writes the entire item. Overwrites if the key already exists unless you use a condition expression
            — critical for idempotency (&quot;put only if key does not exist&quot;).
          </p>
        </ContentStep>
        <ContentStep number={2} title="GetItem — read one item by primary key">
          <p className="text-slate-300">
            Lambda reads bookmark before starting Glue — single key, single item, lowest latency access
            pattern.
          </p>
        </ContentStep>
        <ContentStep number={3} title="UpdateItem — patch attributes">
          <p className="text-slate-300">
            Change <code className="text-core-400">status</code> to SUCCEEDED and bump{' '}
            <code className="text-core-400">last_watermark</code> without sending the whole document — atomic
            at the item level.
          </p>
        </ContentStep>
        <ContentStep number={4} title="DeleteItem — remove one item">
          <p className="text-slate-300">
            Clear idempotency keys after TTL window (or use DynamoDB TTL for automatic expiry — covered in
            advanced lessons).
          </p>
        </ContentStep>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Table = container; item = one record (max 400 KB); attribute = name-value field on an item.',
          'Think JSON document with a required primary key — flexible non-key attributes, nested maps and lists OK.',
          'DE practice: separate tables per concern, store metadata not file payloads, consistent timestamp formats.',
          'Core ops: PutItem, GetItem, UpdateItem, DeleteItem — all keyed by primary key for predictable performance.',
        ]}
      />
    </LessonArticle>
  )
}
