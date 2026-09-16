import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function ApplymappingAndTransforms() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Glue transforms are the ETL vocabulary for lake pipelines">
        Between raw landing and curated Parquet, Glue DynamicFrame transforms reshape schema, filter rows,
        join sources, and flatten nested JSON. Each transform maps to a common lake ETL step — knowing{' '}
        <strong className="text-white">when</strong> to use which transform separates prototype scripts from
        production-grade silver builds.
      </Callout>

      <Definition term="ApplyMapping">
        <p>
          Declares a target schema by mapping source fields to destination names and types — the primary tool
          for promoting bronze JSON/CSV to typed silver columns. Equivalent to a explicit SELECT cast list in
          SQL, but handles nested paths and renames in one transform node.
        </p>
      </Definition>

      <LessonSection title="Core transforms overview">
        <ContentStep number={1} title="ApplyMapping">
          <p className="text-slate-300">
            Use after crawling or reading messy landing data. Map{' '}
            <span className="font-mono text-sm">(source_field, source_type)</span> to{' '}
            <span className="font-mono text-sm">(target_field, target_type)</span>. Example: rename{' '}
            <span className="font-mono text-sm">cust_id</span> to{' '}
            <span className="font-mono text-sm">customer_id</span>, cast string dates to{' '}
            <span className="font-mono text-sm">timestamp</span>, drop unused vendor columns by omission.
            Foundation of every silver-layer Glue job.
          </p>
        </ContentStep>
        <ContentStep number={2} title="ResolveChoice">
          <p className="text-slate-300">
            Resolves <strong className="text-white">choice</strong> types when the same column appears as
            int in one file and string in another. Strategies: cast to string, pick first non-null, or match
            catalog. Run before ApplyMapping when crawler left ambiguous types — otherwise mapping fails on
            inconsistent schemas.
          </p>
        </ContentStep>
        <ContentStep number={3} title="DropFields and RenameField">
          <p className="text-slate-300">
            <strong className="text-white">DropFields</strong> removes PII or unused columns before write —
            shrinks Parquet and downstream Athena scan.{' '}
            <strong className="text-white">RenameField</strong> standardizes names without full remapping
            when types already match. Prefer DropFields in silver to enforce column governance.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Filter">
          <p className="text-slate-300">
            Row-level predicates: drop null keys, exclude test accounts, bound date ranges for incremental
            runs. In lake ETL, filter early after read to reduce shuffle in later joins — predicate pushdown
            on Parquet sources helps, but JSON landing often needs explicit Filter transform.
          </p>
        </ContentStep>
        <ContentStep number={5} title="Join">
          <p className="text-slate-300">
            Equi-join two DynamicFrames on keys — enrich events with dimension tables from catalog or second
            S3 source. Watch for skew on high-cardinality keys; convert to DataFrame for broadcast hint on
            small dims. Lake pattern: join raw facts to slowly changing dim loaded from JDBC or dim Parquet.
          </p>
        </ContentStep>
        <ContentStep number={6} title="SelectFields">
          <p className="text-slate-300">
            Project subset of columns — lighter than ApplyMapping when no type change needed. Use before write
            to enforce gold mart column lists or before Join to drop wide unused fields and cut shuffle size.
          </p>
        </ContentStep>
        <ContentStep number={7} title="Relationalize">
          <p className="text-slate-300">
            Flattens nested arrays and structs into parent-child DynamicFrames with foreign-key stubs — e.g.
            order header + line items from nested JSON. Essential for clickstream and API payloads before
            normalized silver tables. Tradeoff: more tables to manage in catalog vs one wide denormalized file.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="When each helps in lake ETL">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Lake stage</th>
                <th className="px-4 py-3">Typical transforms</th>
                <th className="px-4 py-3">Outcome</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                [
                  'Bronze ingest',
                  'ResolveChoice, Filter (quarantine bad rows)',
                  'Stable enough schema to map',
                ],
                [
                  'Bronze → silver',
                  'ApplyMapping, DropFields, RenameField',
                  'Typed Parquet, PII removed, standard names',
                ],
                [
                  'Nested JSON',
                  'Relationalize, then ApplyMapping per child',
                  'Normalized fact + dimension tables',
                ],
                [
                  'Silver enrich',
                  'Join dim, SelectFields, Filter business rules',
                  'Analytics-ready wide or star tables',
                ],
                [
                  'Gold aggregate',
                  'Convert to DataFrame, groupBy — or Filter + write',
                  'Smaller mart files for BI',
                ],
              ].map(([stage, transforms, outcome]) => (
                <tr key={stage} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{stage}</td>
                  <td className="px-4 py-3">{transforms}</td>
                  <td className="px-4 py-3">{outcome}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Pipeline ordering pattern">
        <Example title="Recommended transform order — raw events">
{`1. Read from_catalog (raw.events_json)
2. ResolveChoice — unify ambiguous columns
3. Filter — event_date >= run_date, drop null event_id
4. Relationalize — explode nested items[] if needed
5. ApplyMapping — cast types, rename to silver schema
6. DropFields — remove raw_payload, ip_address (PII policy)
7. Join — dim_product on product_id
8. toDF() → aggregate → fromDF() → write Parquet partitionBy event_date`}
        </Example>
        <Callout variant="tip">
          Glue Studio visual jobs compile to the same transforms — learn the names so you can debug generated
          scripts and move hot paths to hand-tuned PySpark when Studio abstractions limit tuning.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'ApplyMapping: cast and rename to silver schema — core bronze-to-silver step.',
          'ResolveChoice before mapping when crawler left mixed types; Filter early to cut shuffle cost.',
          'DropFields/RenameField for governance; SelectFields for lightweight projection.',
          'Join enriches facts with dims; Relationalize normalizes nested JSON arrays and structs.',
          'Order: read → resolve → filter → relationalize → map → drop → join → Spark agg → partitioned write.',
        ]}
      />
    </LessonArticle>
  )
}
