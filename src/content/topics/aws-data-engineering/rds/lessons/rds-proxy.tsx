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

export function RdsProxy() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Connection pooling for serverless and bursty workloads">
        Amazon RDS Proxy sits between applications and RDS/Aurora, pooling and reusing database connections.
        For data engineers, RDS Proxy matters when{' '}
        <strong className="text-white">Lambda functions</strong>, microservices, or event-driven ETL open
        thousands of short-lived connections that would otherwise exhaust RDS{' '}
        <code className="text-core-400">max_connections</code>.
      </Callout>

      <Definition term="RDS Proxy">
        <p>
          RDS Proxy is a fully managed, highly available database proxy that maintains a{' '}
          <strong className="text-white">connection pool</strong> to the underlying RDS or Aurora instance.
          Applications connect to the proxy endpoint; the proxy multiplexes many client connections onto a
          smaller set of backend DB connections — reducing connection overhead and improving failover
          behavior.
        </p>
      </Definition>

      <LessonSection title="Why connection pooling matters">
        <ContentStep number={1} title="The connection exhaustion problem">
          <p className="text-slate-300">
            Each Lambda invocation traditionally opens a new JDBC connection. At 500 concurrent invocations,
            you hit Postgres default limits (~100–500 depending on instance class). RDS Proxy holds open
            backend connections and hands them to clients — amortizing TCP+auth handshake cost.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Failover awareness">
          <p className="text-slate-300">
            During Multi-AZ failover, RDS Proxy queues or reroutes requests to the new primary without
            clients needing immediate reconnect logic — reduces error storms in serverless extract
            micro-batches triggered by S3 events.
          </p>
        </ContentStep>
        <ContentStep number={3} title="IAM auth integration">
          <p className="text-slate-300">
            Proxy can authenticate via Secrets Manager or IAM DB auth — centralizes credential handling for
            fleets of Lambda extract functions without embedding passwords in environment variables.
          </p>
        </ContentStep>
        <Flowchart
          title="RDS Proxy connection pooling"
          chart={`flowchart TB
  L1[Lambda fn 1]
  L2[Lambda fn 2]
  L3[Lambda fn N]
  PROXY[RDS Proxy endpoint]
  POOL[Connection pool]
  RDS[RDS / Aurora primary]
  L1 --> PROXY
  L2 --> PROXY
  L3 --> PROXY
  PROXY --> POOL
  POOL -->|multiplexed| RDS`}
        />
      </LessonSection>

      <LessonSection title="Why DE and serverless apps care">
        <ContentStep number={1} title="Event-driven micro-ETL">
          <p className="text-slate-300">
            S3 ObjectCreated → Lambda → INSERT metadata row in RDS audit table. High event volume means
            connection spikes. Proxy prevents audit DB from becoming the pipeline bottleneck.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Not a replacement for batch extract">
          <p className="text-slate-300">
            Long-running Glue jobs with one persistent JDBC connection do not need Proxy — overhead adds
            latency without benefit. Proxy targets many short connections, not single long ETL sessions.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Read/write splitting">
          <p className="text-slate-300">
            Proxy can route read-only sessions to read replicas (Aurora/RDS configuration dependent) — useful
            for read-heavy microservices, less common for bulk DE extract which should use DMS or snapshot
            export instead of hammering replicas.
          </p>
        </ContentStep>
        <Example title="When to add RDS Proxy" caption="Decision matrix">
{`Add Proxy:
  - Dozens+ concurrent Lambda DB touches per minute
  - Microservices fleet sharing one small RDS instance
  - Frequent connection timeout errors on max_connections

Skip Proxy:
  - Single Glue JDBC job with one connection for 2 hours
  - DMS CDC (uses its own replication connection model)
  - Batch snapshot export (no live connections)`}
        </Example>
      </LessonSection>

      <LessonSection title="RDS Proxy vs alternatives">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Approach</th>
                <th className="px-4 py-3">Best for</th>
                <th className="px-4 py-3">Limitation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                [
                  'RDS Proxy',
                  'Serverless, many short connections, failover smoothing',
                  'Extra cost; not for long-running single connections',
                ],
                [
                  'App-side pool (HikariCP)',
                  'Long-lived app servers with stable process count',
                  'Lambda cannot pool across invocations without Proxy',
                ],
                [
                  'Scale up max_connections',
                  'Temporary relief',
                  'Memory per connection; does not fix Lambda churn',
                ],
                [
                  'Move writes to SQS + batch worker',
                  'Decouple event volume from DB',
                  'Architecture change — higher latency',
                ],
              ].map(([approach, best, limit]) => (
                <tr key={approach} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{approach}</td>
                  <td className="px-4 py-3">{best}</td>
                  <td className="px-4 py-3">{limit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="insight">
          Interview answer: RDS Proxy pools connections for serverless/bursty apps — prevents max_connections
          exhaustion. DE bulk extract via Glue/DMS typically bypasses Proxy; use it for Lambda audit lookups
          and micro-ETL touching operational RDS.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'RDS Proxy multiplexes many client connections onto fewer backend DB connections — solves serverless connection storms.',
          'Ideal for Lambda and microservices; not for long-running Glue jobs with a single persistent JDBC session.',
          'Integrates with Secrets Manager and IAM DB auth — centralizes credentials for connection-heavy fleets.',
          'Improves failover behavior during Multi-AZ promotion — queues/reroutes without client-side reconnect storms.',
          'DE bulk extract should prefer DMS/snapshot export over many concurrent JDBC connections — Proxy is for app-tier patterns.',
        ]}
      />
    </LessonArticle>
  )
}
