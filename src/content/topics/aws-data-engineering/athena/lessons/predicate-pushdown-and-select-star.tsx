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

export function PredicatePushdownAndSelectStar() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Athena cost = bytes scanned from S3">
        The query result size barely matters for billing —{' '}
        <strong className="text-white">data scanned</strong> does.{' '}
        <strong className="text-white">Predicate pushdown</strong>,{' '}
        <strong className="text-white">partition pruning</strong>, and avoiding{' '}
        <span className="font-mono text-sm">SELECT *</span> are the three habits that separate expensive
        lake queries from production-grade SQL.
      </Callout>

      <Definition term="Predicate pushdown">
        <p>
          When your <span className="font-mono text-sm">WHERE</span> clause filters on columns stored in
          Parquet, the engine reads <strong className="text-white">row group statistics</strong> (min/max) and
          skips chunks that cannot match — data never leaves S3 for those chunks. Pushdown works on columns
          inside files; <strong className="text-white">partition pruning</strong> skips entire S3 prefixes when
          partition columns appear in WHERE.
        </p>
      </Definition>

      <LessonSection title="Partition pruning">
        <ContentStep number={1} title="Always filter partition columns">
          <p className="text-slate-300">
            Missing <span className="font-mono text-sm">year</span> and <span className="font-mono text-sm">month</span>{' '}
            in WHERE on a multi-year table can scan the full history. Use partition projection or enforce via
            views that embed date filters. BI tools must pass partition parameters — not optional at scale.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Functions on partition columns break pruning">
          <p className="text-slate-300">
            <span className="font-mono text-sm">WHERE year(date_col) = 2026</span> may fail to prune if{' '}
            <span className="font-mono text-sm">year</span> is the partition key — prefer{' '}
            <span className="font-mono text-sm">WHERE year = '2026'</span>. Casting partition columns or
            wrapping them in functions often forces full partition subtree scans.
          </p>
        </ContentStep>
        <Flowchart
          title="How a filtered query touches S3"
          chart={`flowchart TB
  SQL[SELECT cols FROM t WHERE year=2026 AND month=03 AND amount > 100]
  PLAN[Athena query planner]
  PRUNE[Partition pruning — skip other year/month prefixes]
  PUSH[Predicate pushdown — skip Parquet row groups]
  S3A[s3://lake/.../year=2026/month=03/]
  S3B[Skipped prefixes year=2025 etc]
  SCAN[Read only matching columns from matching row groups]
  SQL --> PLAN
  PLAN --> PRUNE
  PRUNE --> S3A
  PRUNE -.-> S3B
  S3A --> PUSH
  PUSH --> SCAN`}
        />
      </LessonSection>

      <LessonSection title="Avoid SELECT *">
        <ContentStep number={1} title="Column pruning in Parquet">
          <p className="text-slate-300">
            <span className="font-mono text-sm">SELECT *</span> reads every column in every scanned row group.
            A fifty-column event table where you need three metrics — listing explicit columns can reduce scan
            by 90%+. This is the easiest win in code review.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Downstream damage">
          <p className="text-slate-300">
            Views defined as <span className="font-mono text-sm">SELECT *</span> hide wide scans from analysts.
            CTAS that copies all columns perpetuates raw-width tables in curated. Enforce lint rules or SQL
            reviewers for production workgroups.
          </p>
        </ContentStep>
        <Example title="Bad vs good — same logical question">
{`-- BAD: full partition month, all columns (~800 GB scanned)
SELECT *
FROM curated.clickstream
WHERE year = '2026' AND month = '03';

-- GOOD: partition + column prune (~40 GB scanned)
SELECT user_id, page_url, event_ts
FROM curated.clickstream
WHERE year = '2026'
  AND month = '03'
  AND day BETWEEN '01' AND '07'
  AND event_type = 'purchase';`}
        </Example>
      </LessonSection>

      <LessonSection title="Cost: data scanned">
        <ContentStep number={1} title="Reading the query stats">
          <p className="text-slate-300">
            Athena console and <span className="font-mono text-sm">GetQueryExecution</span> return{' '}
            <span className="font-mono text-sm">Statistics.DataScannedInBytes</span>. Divide by 1 TB pricing
            tier for rough cost. Compare before/after optimization — partition + column prune often shows 10x+
            reduction in the same result set.
          </p>
        </ContentStep>
        <ContentStep number={2} title="What does not reduce scan">
          <p className="text-slate-300">
            <span className="font-mono text-sm">LIMIT 10</span> without filters still scans underlying data
            (unless engine optimizes via metadata — do not rely on it). Joins expand scan to all joined table
            inputs — optimize each side independently. Nested subqueries without pushdown may scan twice.
          </p>
        </ContentStep>
        <Callout variant="insight">
          CSV and JSON lack efficient column pruning — another reason curated Parquet is non-negotiable for
          tables queried more than once. Predicate pushdown on CSV is minimal compared to Parquet row groups.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Athena bills on data scanned — partition pruning skips S3 prefixes; predicate pushdown skips Parquet row groups.',
          'Filter partition columns directly (year=, month=) — avoid functions on partition keys that break pruning.',
          'Never SELECT * on wide curated tables — explicit columns exploit Parquet columnar storage.',
          'LIMIT alone does not cap scan cost; always combine with partition and column filters.',
          'Check DataScannedInBytes after every new dashboard query — the metric that drives lake SQL cost.',
        ]}
      />
    </LessonArticle>
  )
}
