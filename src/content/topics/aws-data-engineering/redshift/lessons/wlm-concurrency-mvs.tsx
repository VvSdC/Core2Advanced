import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function WlmConcurrencyMvs() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="WLM decides who waits — concurrency scaling adds burst capacity">
        Production warehouses serve BI dashboards, ETL COPY, and ad hoc SQL simultaneously.{' '}
        <strong className="text-white">Workload Management (WLM)</strong> queues and routes queries;
        <strong className="text-white"> concurrency scaling</strong> spins ephemeral capacity for spikes;{' '}
        <strong className="text-white">materialized views</strong> precompute expensive aggregates. Together
        they keep serve-layer SLAs without oversizing nodes 24/7.
      </Callout>

      <Definition term="Workload Management (WLM)">
        <p>
          WLM defines <strong className="text-white">queues</strong> with concurrency slots, memory
          allocation, and priority. Short BI queries land in a high-priority queue; long ETL transforms in a
          batch queue with fewer slots. Automatic WLM (default on modern clusters) adjusts slots based on
          workload — manual WLM still appears in legacy runbooks and interviews.
        </p>
      </Definition>

      <LessonSection title="Workload Management">
        <ContentStep number={1} title="Queues and slots">
          <p className="text-slate-300">
            Each queue has a concurrency level — max simultaneous queries. When slots fill, new queries wait
            in queue (visible in <span className="font-mono text-sm">STL_WLM_QUERY</span> and console). DE
            pattern: separate queue for COPY/VACUUM maintenance vs interactive SELECT.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Memory per query">
          <p className="text-slate-300">
            WLM allocates cluster memory across slots — heavy hash joins need more per slot or fewer
            concurrent queries. Spill to disk (<span className="font-mono text-sm">SVL_QUERY_REPORT</span>)
            signals under-provisioned memory for that queue.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Automatic WLM">
          <p className="text-slate-300">
            AWS recommends automatic WLM for most RA3/serverless workloads — dynamic slot assignment based
            on query classification. Monitor queue wait time; tune with query timeouts and separate
            read-only endpoints for reporting if waits persist.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Concurrency Scaling">
        <Definition term="Concurrency Scaling">
          <p>
            Adds temporary cluster capacity for seconds to minutes when WLM queues backlog. Billed per
            second of scaled capacity — cost control via max scaling clusters setting. Ideal for predictable
            lunch-hour dashboard spikes without permanently doubling node count.
          </p>
        </Definition>
        <ContentStep number={1} title="When DE enables it">
          <p className="text-slate-300">
            Production BI with strict p95 latency during business hours; ETL and BI share cluster. Less
            valuable if workload is steady batch-only — you are paying for idle burst headroom.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Not a tuning substitute">
          <p className="text-slate-300">
            Bad dist keys and missing sort filters still run slow on scaled nodes — fix plan first, enable
            scaling second. Track <span className="font-mono text-sm">ConcurrencyScalingSeconds</span> in
            Cost Explorer.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Materialized Views">
        <ContentStep number={1} title="Precomputed aggregates">
          <p className="text-slate-300">
            <span className="font-mono text-sm">CREATE MATERIALIZED VIEW mv_daily_revenue AS SELECT …</span>{' '}
            stores result physically — BI hits MV instead of scanning billion-row fact. Redshift can{' '}
            <strong className="text-white">auto-refresh</strong> incrementally when base tables change (where
            eligible).
          </p>
        </ContentStep>
        <ContentStep number={2} title="DE patterns">
          <p className="text-slate-300">
            Gold KPI tables refreshed after nightly COPY — MV on top of fact with GROUP BY date, region.
            Pair with datashare for cross-cluster read replicas. Drop and recreate when grain changes vs
            fragile ALTER.
          </p>
        </ContentStep>
        <Example title="Materialized view sketch">
{`CREATE MATERIALIZED VIEW gold.mv_orders_daily
AUTO REFRESH YES
AS
SELECT DATE_TRUNC('day', order_ts) AS order_day,
       region,
       COUNT(*) AS order_count,
       SUM(amount) AS revenue
FROM gold.fact_orders
GROUP BY 1, 2;`}
        </Example>
      </LessonSection>

      <LessonSection title="Query Monitoring Rules overview">
        <Definition term="Query Monitoring Rules (QMR)">
          <p>
            WLM rules that <strong className="text-white">abort, hop, or log</strong> queries exceeding
            thresholds — e.g. nested loop join row count, disk spill, runtime &gt; 15 minutes. Protects cluster
            from runaway <span className="font-mono text-sm">SELECT *</span> cross joins while allowing
            governed ETL in batch queue without global statement timeout.
          </p>
        </Definition>
        <ContentStep number={1} title="Typical DE rules">
          <p className="text-slate-300">
            Interactive queue: abort if runtime &gt; 10 min or return &gt; 100M rows. ETL queue: log-only on
            spill, abort at 60 min. Route repeat offenders to training on partition filters and dist keys.
          </p>
        </ContentStep>
        <Callout variant="tip">
          Combine MVs for dashboard hot paths, concurrency scaling for slot spikes, and QMR guardrails on
          ad hoc queues — the production triad for mixed BI + ETL clusters.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'WLM: queues, concurrency slots, memory — separate interactive BI from batch ETL/COPY.',
          'Concurrency Scaling: temporary burst capacity for queue backlogs — cost-cap max clusters.',
          'Materialized Views: precomputed gold aggregates with auto-refresh — shrink BI scan cost.',
          'Query Monitoring Rules: abort/log runaway queries by spill, rows, or runtime — per-queue policies.',
          'Fix dist/sort and MVs before scaling nodes forever — WLM waits often trace to bad plans not slot count.',
        ]}
      />
    </LessonArticle>
  )
}
