import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function VacuumAnalyzeEncoding() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Loaded tables drift — VACUUM and ANALYZE restore performance">
        COPY, DELETE, and UPDATE leave dead rows and unsorted zones. The query planner stale-stats without{' '}
        <span className="font-mono text-sm">ANALYZE</span>. Column encodings left unoptimized waste disk and
        scan I/O. Maintenance is core DE ops on provisioned and serverless warehouses alike.
      </Callout>

      <Definition term="VACUUM">
        <p>
          Reclaims space from deleted rows and re-sorts data to restore{' '}
          <strong className="text-white">zone-map efficiency</strong> on sort keys.{' '}
          <span className="font-mono text-sm">VACUUM FULL</span> deep reorganization (locks table longer);{' '}
          <span className="font-mono text-sm">VACUUM DELETE ONLY</span> lighter reclaim. Auto-VACUUM exists
          but large facts often need scheduled maintenance windows after nightly ETL.
        </p>
      </Definition>

      <Definition term="ANALYZE">
        <p>
          Samples table data to update <strong className="text-white">pg_statistic</strong> — row counts,
          distinct values, min/max — so the optimizer picks correct join order, dist/broadcast decisions, and
          zone-map usage. Run after significant COPY/DELETE; use{' '}
          <span className="font-mono text-sm">ANALYZE table_name;</span> or enable STATUPDATE on COPY.
        </p>
      </Definition>

      <LessonSection title="VACUUM and ANALYZE in practice">
        <ContentStep number={1} title="Monitor unsorted and stats off">
          <p className="text-slate-300">
              <span className="font-mono text-sm">SELECT "table", unsorted, stats_off FROM svv_table_info WHERE unsorted &gt; 5;</span>{' '}
            — unsorted percent drives VACUUM priority; stats_off signals stale ANALYZE. Add to nightly ops
            dashboard alongside COPY success metrics.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Post-ETL routine">
          <p className="text-slate-300">
            Pipeline order: COPY staging → merge to fact → DELETE old window →{' '}
            <span className="font-mono text-sm">ANALYZE fact;</span> →{' '}
            <span className="font-mono text-sm">VACUUM fact;</span> (or rely on auto-vacuum for small delta).
            Run heavy VACUUM in batch WLM queue off-peak.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Interleaved tables">
          <p className="text-slate-300">
            Interleaved sort keys need <span className="font-mono text-sm">VACUUM REINDEX</span> periodically —
            expensive. Another reason to prefer compound sort on new tables; migrate legacy interleaved during
            table rebuilds.
          </p>
        </ContentStep>
        <Example title="Maintenance SQL sketch">
{`-- After nightly load
ANALYZE gold.fact_orders;
VACUUM gold.fact_orders;

-- Check table health
SELECT "table", diststyle, sortkey1, skew_rows, unsorted, stats_off
FROM svv_table_info
WHERE "schema" = 'gold';`}
        </Example>
      </LessonSection>

      <LessonSection title="Compression and encoding">
        <Definition term="Column encoding">
          <p>
            Redshift stores columns with encodings (AZ64, ZSTD, DELTA, BYTEDICT, etc.) chosen for compression
            and scan speed. <span className="font-mono text-sm">ENCODE AUTO</span> on CREATE lets Redshift
            pick; <span className="font-mono text-sm">ANALYZE COMPRESSION</span> suggests changes on existing
            tables. Wrong encoding → larger RMS footprint and slower I/O.
          </p>
        </Definition>
        <ContentStep number={1} title="When to analyze compression">
          <p className="text-slate-300">
            New table after representative data load:{' '}
            <span className="font-mono text-sm">ANALYZE COMPRESSION table_name;</span> then apply suggested
            encodings in rebuild DDL. On COPY, <span className="font-mono text-sm">COMPUPDATE OFF</span> skips
            per-load analysis — set encodings once at DDL time for stable facts.
          </p>
        </ContentStep>
        <ContentStep number={2} title="DE cost angle">
          <p className="text-slate-300">
            Better compression reduces RMS GB-months on RA3 and speeds scans (fewer bytes per block). Pair with
            sort-key pruning — encoding helps column I/O; sort helps block skipping.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Dist key and sort key tuning reminders">
        <ContentStep number={1} title="When maintenance is not enough">
          <p className="text-slate-300">
            Persistent <span className="font-mono text-sm">DS_BCAST_INNER</span> on core joins → revisit KEY
            alignment. Full-table scans despite date filter → check sort key leading column and unsorted %.
            High <span className="font-mono text-sm">skew_rows</span> → change dist key or pre-aggregate skewed
            dimension.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Rebuild vs ALTER">
          <p className="text-slate-300">
            Changing dist/sort on TB tables:{' '}
            <span className="font-mono text-sm">CREATE TABLE fact_new (…) AS SELECT …</span> swap names in
            maintenance window — cleaner than in-place ALTER DISTSTYLE on live BI tables.
          </p>
        </ContentStep>
        <Callout variant="insight">
          Ops checklist: COPY → ANALYZE → VACUUM → review svv_table_info monthly → EXPLAIN top 10 slow queries
          → adjust dist/sort/encoding before buying more nodes.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'VACUUM: reclaim deletes and restore sort order — watch unsorted % in svv_table_info.',
          'ANALYZE: refresh planner statistics after COPY/DELETE — STATUPDATE ON or explicit ANALYZE.',
          'Column encoding: AZ64/ZSTD/etc. — ANALYZE COMPRESSION at DDL; COMPUPDATE OFF on steady nightly COPY.',
          'Interleaved sort needs VACUUM REINDEX — prefer compound sort for new facts.',
          'If VACUUM+ANALYZE do not fix slowness, revisit dist/sort keys and EXPLAIN — then scale compute.',
        ]}
      />
    </LessonArticle>
  )
}
