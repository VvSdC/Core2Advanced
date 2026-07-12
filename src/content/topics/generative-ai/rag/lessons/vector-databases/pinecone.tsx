import {
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function PineconeDb() {
  return (
    <LessonArticle>
      <LessonSection title="What is Pinecone?">
        <p>
          <strong className="text-white">Pinecone</strong> is a fully managed cloud vector database. No servers to
          run, no index tuning — upload vectors via API and query with millisecond latency at billion-vector scale.
        </p>
      </LessonSection>

      <LessonSection title="Basic → Advanced">
        <div className="space-y-4">
          <div className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
            <p className="text-sm font-semibold text-white">Level 1 — Serverless index</p>
            <p className="mt-2 text-sm text-slate-400">Create an index, upsert vectors with metadata, query by similarity. Pay per usage. Free tier for prototyping.</p>
          </div>
          <div className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
            <p className="text-sm font-semibold text-white">Level 2 — Namespaces</p>
            <p className="mt-2 text-sm text-slate-400">Partition data by tenant, project, or environment within one index. Logical isolation without separate indexes.</p>
          </div>
          <div className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
            <p className="text-sm font-semibold text-white">Level 3 — Metadata filtering</p>
            <p className="mt-2 text-sm text-slate-400">Pre-filter by metadata before vector search. Combine with hybrid search (sparse + dense) in Pinecone 2.0.</p>
          </div>
          <div className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
            <p className="text-sm font-semibold text-white">Level 4 — Production at scale</p>
            <p className="mt-2 text-sm text-slate-400">Pod-based indexes for sustained high QPS. Integrated reranking. SOC2 compliance for enterprise.</p>
          </div>
        </div>
      </LessonSection>

      <LessonSection title="When to choose Pinecone">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>Production RAG without DevOps overhead.</li>
          <li>Multi-tenant SaaS needing namespace isolation.</li>
          <li>Teams that prefer API-first over self-hosting.</li>
          <li>Skip if: data must stay on-premise, or budget is very tight at high volume.</li>
        </ul>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Pinecone = managed cloud vector DB; zero ops, scales to billions.',
          'Namespaces for multi-tenancy; metadata filtering built in.',
          'Best for production RAG when you want managed infrastructure.',
          'Free tier for prototyping; serverless pricing for variable workloads.',
        ]}
      />
    </LessonArticle>
  )
}
