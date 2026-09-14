import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function SortKeys() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Sort keys enable zone-map pruning — filter columns matter">
        Redshift stores columnar data in sorted order on disk.{' '}
        <span className="font-mono text-sm">SORTKEY</span> columns define that order so the engine skips
        1 MB blocks whose min/max zone maps fall outside your{' '}
        <span className="font-mono text-sm">WHERE</span> range — the warehouse equivalent of partition
        pruning on the lake.
      </Callout>

      <Definition term="Sort key">
        <p>
          Physical sort order of rows within each slice. Queries filtering on leading sort key columns read
          fewer blocks — critical for time-series facts (
          <span className="font-mono text-sm">order_date</span>,{' '}
          <span className="font-mono text-sm">event_ts</span>) and incremental ETL that deletes or merges
          recent windows. Sort key choice is independent of but complementary to distribution key.
        </p>
      </Definition>

      <LessonSection title="Compound vs interleaved sort keys">
        <ContentStep number={1} title="Compound sort key">
          <p className="text-slate-300">
            <span className="font-mono text-sm">SORTKEY (order_date, customer_id)</span> — rows sorted first by{' '}
            <span className="font-mono text-sm">order_date</span>, then{' '}
            <span className="font-mono text-sm">customer_id</span> within each date.{' '}
            <strong className="text-white">Leading column filters prune best.</strong> Filter on{' '}
            <span className="font-mono text-sm">order_date BETWEEN …</span> skips old blocks; filter only on{' '}
            <span className="font-mono text-sm">customer_id</span> without date may scan entire table. Default
            choice for event and transaction facts.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Interleaved sort key">
          <p className="text-slate-300">
            <span className="font-mono text-sm">INTERLEAVED SORTKEY (customer_id, product_id)</span> gives
            equal weight to multiple columns in zone maps — better when queries filter unpredictably on
            several dimensions. Maintenance cost:{' '}
            <span className="font-mono text-sm">VACUUM</span> and resort are heavier; AWS recommends compound
            for most new tables. Interleaved is legacy-specialized — know it for interviews and old clusters.
          </p>
        </ContentStep>
        <ContentStep number={3} title="DE query alignment">
          <p className="text-slate-300">
            Put the column you filter in <strong className="text-white">every production query</strong> first
            in compound sort — usually date or timestamp. BI dashboards scoped to last 30 days on{' '}
            <span className="font-mono text-sm">report_date</span> should have{' '}
            <span className="font-mono text-sm">SORTKEY (report_date, …)</span>, not the reverse.
          </p>
        </ContentStep>
        <Example title="Compound sort on daily fact">
{`CREATE TABLE fact_events (
  event_id     BIGINT,
  event_ts     TIMESTAMP,
  user_id      BIGINT,
  event_type   VARCHAR(64)
)
DISTSTYLE KEY
DISTKEY (user_id)
COMPOUND SORTKEY (event_ts, user_id);

-- Prunes blocks outside time window
SELECT event_type, COUNT(*)
FROM fact_events
WHERE event_ts >= '2026-03-01'
  AND event_ts < '2026-04-01'
GROUP BY event_type;`}
        </Example>
      </LessonSection>

      <LessonSection title="Automatic Table Optimization teaser">
        <Definition term="Automatic Table Optimization (ATO)">
          <p>
            Redshift can automatically adjust sort and distribution over time based on observed queries —
            part of the <strong className="text-white">ATO</strong> feature set on RA3 and serverless. It
            reduces manual DDL churn but does not replace understanding compound vs interleaved or validating
            with <span className="font-mono text-sm">SVV_TABLE_INFO</span> (
            <span className="font-mono text-sm">sortkey1</span>,{' '}
            <span className="font-mono text-sm">unsorted</span> percent).
          </p>
        </Definition>
        <ContentStep number={1} title="When ATO helps DE">
          <p className="text-slate-300">
            Evolving workloads where analysts add new filter patterns — ATO may shift sort key emphasis.
            Still monitor <span className="font-mono text-sm">unsorted</span> after heavy COPY/DELETE; run
            scheduled <span className="font-mono text-sm">VACUUM</span> on large mutable facts regardless of
            ATO.
          </p>
        </ContentStep>
        <ContentStep number={2} title="When you set keys explicitly">
          <p className="text-slate-300">
            Gold star-schema tables with known SLA queries — declare compound sort on date, KEY dist on join
            column at CREATE. Document in data catalog. ATO is a safety net, not a design substitute for
            pipeline-owned tables.
          </p>
        </ContentStep>
        <Callout variant="tip">
          <span className="font-mono text-sm">unsorted</span> above ~5% on a large fact table → schedule VACUUM
          after nightly COPY. High unsorted erodes zone-map benefit — queries scan more blocks even with
          correct WHERE clause.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Compound sort: leading column gets best zone-map pruning — put date/timestamp first for facts.',
          'Interleaved: multi-column equality in zone maps — heavier VACUUM; prefer compound for new tables.',
          'Sort key ≠ dist key — sort prunes blocks within slice; dist co-locates joins across nodes.',
          'Automatic Table Optimization can tune sort/dist — still monitor unsorted % and validate gold DDL.',
          'Align SORTKEY with production WHERE filters — misaligned sort is silent scan-cost inflation.',
        ]}
      />
    </LessonArticle>
  )
}
