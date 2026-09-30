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

export function CachingAndPerformance() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="A data API is not a download server">
        An analyst app calls <code className="text-core-400">GET /datasets/orders/daily-summary</code> 2,000
        times a minute, and every call runs the same Athena query. Another team tries to pull 400 MB of results
        through the API and gets a timeout. Both are design problems: cache repeated reads at the gateway, and
        move big results out of the request path entirely.
      </Callout>

      <Definition term="API Gateway response cache">
        <p>
          A dedicated cache instance attached to a <strong className="text-white">REST API stage</strong>. When
          enabled, API Gateway stores integration responses keyed by path and selected parameters and serves
          repeats without calling the backend. You choose a size from 0.5 GB up to 237 GB and pay per hour for it
          — caching is not free and not available on HTTP APIs.
        </p>
      </Definition>

      <LessonSection title="Response caching on REST APIs">
        <ContentStep number={1} title="TTL and per-method settings">
          <p className="text-slate-300">
            Default TTL is 300 seconds; the maximum is 3600, and 0 disables caching. Only GET methods are cached by
            default. Override per method: cache{' '}
            <code className="text-core-400">GET /datasets/orders/daily-summary</code> for 15 minutes while leaving
            {' '}<code className="text-core-400">POST /ingest/orders</code> uncached — writes must never be cached.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Cache keys">
          <p className="text-slate-300">
            Add the parameters that change the answer — for example query strings{' '}
            <code className="text-core-400">date</code> and <code className="text-core-400">region</code>, and the
            path parameter {'{dataset}'}. Forget one and users get each other&apos;s results; add too many and the
            hit rate collapses. If responses differ per user, include the identity header or do not cache.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Invalidation">
          <p className="text-slate-300">
            A client can bypass and refresh an entry by sending{' '}
            <code className="text-core-400">Cache-Control: max-age=0</code>, but only if its role has{' '}
            <code className="text-core-400">execute-api:InvalidateCache</code> — configure the stage to reject or
            ignore unauthorized invalidation, otherwise anyone can defeat the cache. After a daily Glue job
            refreshes the summary table, a pipeline step can flush the whole stage cache.
          </p>
        </ContentStep>
        <Flowchart
          title="Cached GET path"
          chart={`flowchart LR
  C[Analyst app]
  GW[REST API stage]
  CACHE[Stage cache]
  LAM[Query Lambda]
  ATH[Athena]
  C --> GW
  GW --> CACHE
  CACHE -->|hit| C
  CACHE -->|miss| LAM
  LAM --> ATH
  LAM -->|store with TTL| CACHE`}
        />
      </LessonSection>

      <LessonSection title="Hard limits to design around">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Limit</th>
                <th className="px-4 py-3">Value (verify current quotas)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Request or response payload', '10 MB for REST and HTTP APIs'],
                ['REST integration timeout', '50 ms to 29 s by default; Regional and private REST APIs can request more'],
                ['HTTP API integration timeout', 'Up to 30 s'],
                ['Lambda synchronous response', '6 MB — smaller than the API limit'],
                ['Cache TTL', 'Default 300 s, maximum 3600 s'],
              ].map(([limit, value]) => (
                <tr key={limit} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{limit}</td>
                  <td className="px-4 py-3">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ContentStep number={1} title="The timeout increase has a cost">
          <p className="text-slate-300">
            Since mid-2024, Regional and private REST APIs can raise the integration timeout past 29 seconds via a
            Service Quotas request, but AWS may lower your account&apos;s Region throttle in exchange. Edge-optimized
            and HTTP APIs keep their limits. Long waits also hold client connections open — async patterns are
            usually better.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Compression">
          <p className="text-slate-300">
            REST APIs can compress responses when you set a minimum compression size and clients send{' '}
            <code className="text-core-400">Accept-Encoding: gzip</code>. JSON compresses well, so a 9 MB response
            may travel as 1 MB — but the 10 MB limit applies to the uncompressed payload.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Patterns for big or slow results">
        <ContentStep number={1} title="Return a presigned URL">
          <p className="text-slate-300">
            Athena already writes results to <code className="text-core-400">s3://acme-athena-results-prod/</code>.
            Instead of streaming rows through the API, return a presigned GET URL to the CSV or Parquet output with
            a 15-minute expiry. The client downloads straight from S3 — no size limit, no API bandwidth.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Async job pattern">
          <p className="text-slate-300">
            <code className="text-core-400">POST /exports</code> starts a Step Functions execution or Athena query
            and returns <code className="text-core-400">202</code> with a job id.{' '}
            {'GET /exports/{jobId}'} returns status, and when done, a presigned URL. No request ever waits more than
            a second.
          </p>
        </ContentStep>
        <Example title="Async export exchange" caption="Client polls status, then downloads from S3">
{`POST /exports
{ "dataset": "orders", "from": "2026-09-01", "to": "2026-09-30" }
→ 202 { "job_id": "exp-7f3a", "status_url": "/exports/exp-7f3a" }

GET /exports/exp-7f3a
→ 200 { "status": "RUNNING" }

GET /exports/exp-7f3a
→ 200 { "status": "SUCCEEDED", "download_url": "https://acme-athena-results-prod.s3.amazonaws.com/...&X-Amz-Expires=900" }`}
        </Example>
        <ContentStep number={3} title="Read latency metrics correctly">
          <p className="text-slate-300">
            <code className="text-core-400">Latency</code> is total time API Gateway spent on the request;{' '}
            <code className="text-core-400">IntegrationLatency</code> is time waiting on the backend. A large gap
            between them points at authorizers, mapping templates, or cache misses — a small gap means the backend
            is the bottleneck.
          </p>
        </ContentStep>
        <Callout variant="insight">
          Cache what is read often and changes rarely; hand off what is large to S3; make anything slow async. The
          API itself should almost always answer in under a second.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'REST stage caches serve repeat GETs; TTL defaults to 300 s, maximum 3600 s, and costs per hour by size.',
          'Choose cache keys carefully and require execute-api:InvalidateCache for Cache-Control invalidation.',
          'Payloads cap at 10 MB; integration timeouts are 29 s for REST by default and 30 s for HTTP APIs.',
          'Large results go out as presigned S3 URLs; slow work follows POST job, poll status, download.',
          'Latency minus IntegrationLatency shows gateway overhead; the rest is your backend.',
        ]}
      />
    </LessonArticle>
  )
}
