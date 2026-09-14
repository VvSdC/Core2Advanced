import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function DistributionStyles() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Distribution style decides which node owns each row">
        On CREATE TABLE,{' '}
        <span className="font-mono text-sm">DISTSTYLE</span> and optional{' '}
        <span className="font-mono text-sm">DISTKEY</span> control how rows spread across compute slices.
        Wrong choice → broadcast storms, skew, or duplicated storage. Join-heavy DE pipelines live or die on
        this decision.
      </Callout>

      <Definition term="Distribution style">
        <p>
          Redshift physically shards each table across nodes.{' '}
          <strong className="text-white">EVEN</strong> round-robins rows;{' '}
          <strong className="text-white">KEY</strong> hashes a column to co-locate matching join keys;{' '}
          <strong className="text-white">ALL</strong> copies the full table to every node;{' '}
          <strong className="text-white">AUTO</strong> lets Redshift pick (often KEY on suggested column or
          EVEN). Co-located KEY joins avoid shipping entire tables over the network.
        </p>
      </Definition>

      <LessonSection title="EVEN, KEY, ALL, AUTO">
        <ContentStep number={1} title="EVEN">
          <p className="text-slate-300">
            Rows distributed round-robin — no dist key. Good for large fact tables with no clear join key, staging
            tables loaded before final KEY assignment, or tables rarely joined. Joins to other tables usually
            trigger <span className="font-mono text-sm">DS_DIST_BOTH</span> or rehash — acceptable for
            infrequent joins, painful for hourly fact-dimension pipelines.
          </p>
        </ContentStep>
        <ContentStep number={2} title="KEY">
          <p className="text-slate-300">
            Hash on <span className="font-mono text-sm">DISTKEY (column)</span> — rows with same key land on
            same slice. Ideal when two large tables join frequently on that column (e.g.{' '}
            <span className="font-mono text-sm">order_id</span>,{' '}
            <span className="font-mono text-sm">customer_id</span>). Pick{' '}
            <strong className="text-white">high-cardinality, even</strong> keys — skewed keys (country code
            with 90% US) create hot nodes.
          </p>
        </ContentStep>
        <ContentStep number={3} title="ALL">
          <p className="text-slate-300">
            Full copy on every node — storage multiplied by node count. Use only for{' '}
            <strong className="text-white">small dimension tables</strong> joined to many facts (product
            category, calendar, status codes under ~few million rows). Eliminates broadcast for that dimension
            at cost of replicated storage.
          </p>
        </ContentStep>
        <ContentStep number={4} title="AUTO">
          <p className="text-slate-300">
            Redshift analyzes table and query patterns (with Automatic Table Optimization) to suggest EVEN vs
            KEY. Good starting point for new tables; production gold tables often need explicit KEY after
            profiling join graphs. Do not treat AUTO as permanent — validate with{' '}
            <span className="font-mono text-sm">SVV_TABLE_INFO</span> and EXPLAIN.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Join-heavy DE examples">
        <ContentStep number={1} title="Fact + dimension star schema">
          <p className="text-slate-300">
            <span className="font-mono text-sm">fact_orders</span> DISTKEY{' '}
            <span className="font-mono text-sm">(customer_id)</span> EVEN or KEY on{' '}
            <span className="font-mono text-sm">order_date</span> sort;{' '}
            <span className="font-mono text-sm">dim_customer</span> DISTKEY{' '}
            <span className="font-mono text-sm">(customer_id)</span> or DISTSTYLE ALL if tiny. Join on{' '}
            <span className="font-mono text-sm">customer_id</span> co-locates — no broadcast of million-row
            dimension.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Two large facts on shared grain">
          <p className="text-slate-300">
            <span className="font-mono text-sm">fact_clicks</span> and{' '}
            <span className="font-mono text-sm">fact_orders</span> both KEY on{' '}
            <span className="font-mono text-sm">session_id</span> if session-level funnel joins dominate.
            If orders join to products more than sessions, KEY on{' '}
            <span className="font-mono text-sm">product_id</span> for the order fact instead — pick the{' '}
            <strong className="text-white">highest-cost join</strong> in EXPLAIN plans.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Staging → final">
          <p className="text-slate-300">
            COPY into <span className="font-mono text-sm">staging_orders EVEN</span> (fast parallel load), then{' '}
            <span className="font-mono text-sm">INSERT INTO fact_orders SELECT …</span> to apply KEY distribution
            once per batch. Avoid ALTER DISTSTYLE on huge live tables during business hours — rebuild pattern
            is cleaner.
          </p>
        </ContentStep>
        <Example title="DDL sketch — fact and dimension">
{`CREATE TABLE fact_orders (
  order_id       BIGINT,
  customer_id    BIGINT,
  order_ts       TIMESTAMP,
  amount         DECIMAL(12,2)
)
DISTSTYLE KEY
DISTKEY (customer_id)
SORTKEY (order_ts);

CREATE TABLE dim_customer (
  customer_id    BIGINT PRIMARY KEY,
  segment        VARCHAR(32)
)
DISTSTYLE ALL;  -- small enough to replicate`}
        </Example>
        <Callout variant="tip">
          Check skew: <span className="font-mono text-sm">SELECT "table", diststyle, skew_rows FROM svv_table_info;</span>{' '}
          — <span className="font-mono text-sm">skew_rows</span> far above 1.0 means revisit dist key or switch
          problematic table to EVEN and accept rehash cost.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'EVEN: round-robin — staging or rare joins; KEY: hash co-location for frequent large joins.',
          'ALL: replicate small dimensions to every node — storage cost, zero broadcast on join.',
          'AUTO is a starting point — validate gold tables with SVV_TABLE_INFO skew and EXPLAIN.',
          'Align DISTKEY on both sides of your most expensive join — usually fact + dimension FK.',
          'Avoid skewed low-cardinality keys; use staging EVEN + INSERT for clean KEY on load.',
        ]}
      />
    </LessonArticle>
  )
}
