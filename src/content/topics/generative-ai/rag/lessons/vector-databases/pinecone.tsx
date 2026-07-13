import {
  Callout,
  ContentStep,
  Definition,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function PineconeDb() {
  return (
    <LessonArticle>
      <Definition term="Pinecone">
        <p>
          <strong className="text-white">Pinecone</strong> is a fully managed vector database in the cloud. You
          never install software, tune indexes, or manage servers — you call an API to upload vectors and query
          them. Pinecone handles storage, scaling, and the HNSW search algorithm for you.
        </p>
      </Definition>

      <LessonSection title="Managed vs self-hosted — what that means for you">
        <p className="text-slate-300">
          With Chroma or FAISS, <em>you</em> run the process on your machine or server. With Pinecone,{' '}
          <em>Pinecone's team</em> runs the infrastructure. You get an API key, send HTTP requests, and pay per
          usage. The trade-off: less control, zero DevOps, automatic scaling.
        </p>
        <div className="mt-4 overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">You handle (self-hosted)</th>
                <th className="px-4 py-3">Pinecone handles (managed)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Install and update software', 'Always-on cloud service'],
                ['Scale when data grows', 'Auto-scales with your data'],
                ['Backups and uptime', 'Built-in redundancy and SLA'],
                ['Tune HNSW parameters', 'Pre-optimised indexes'],
              ].map(([you, pinecone], i) => (
                <tr key={i} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 text-slate-400">{you}</td>
                  <td className="px-4 py-3 text-slate-400">{pinecone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Pinecone vocabulary — four terms">
        <div className="space-y-3">
          <div className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
            <p className="text-sm font-semibold text-white">Index = your vector store in the cloud</p>
            <p className="mt-1 text-sm text-slate-400">
              Like a Chroma collection, but hosted remotely. You create one index per project (or per environment:
              dev, staging, prod). You specify vector dimensions (e.g. 1536 for OpenAI embeddings) at creation time.
            </p>
          </div>
          <div className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
            <p className="text-sm font-semibold text-white">Upsert = insert or update a vector</p>
            <p className="mt-1 text-sm text-slate-400">
              Send a vector id, the embedding numbers, and metadata (source file, page, customer_id). If the id
              already exists, it gets overwritten. Batch upsert thousands at once during indexing.
            </p>
          </div>
          <div className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
            <p className="text-sm font-semibold text-white">Namespace = logical partition inside one index</p>
            <p className="mt-1 text-sm text-slate-400">
              Separate tenants without separate indexes. Customer A's vectors live in namespace{' '}
              <code className="font-mono text-sm">"tenant_123"</code>, customer B in{' '}
              <code className="font-mono text-sm">"tenant_456"</code>. Queries only search within the specified namespace.
            </p>
          </div>
          <div className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
            <p className="text-sm font-semibold text-white">Query = similarity search via API</p>
            <p className="mt-1 text-sm text-slate-400">
              Send your query vector (or let Pinecone embed it), specify top_k and optional metadata filters.
              Get back matching ids, metadata, and similarity scores in milliseconds.
            </p>
          </div>
        </div>
      </LessonSection>

      <LessonSection title="Walkthrough — production RAG on Pinecone">
        <ContentStep number={1} title="Create an index">
          <p>Via dashboard or API. Set dimensions to match your embedding model (1536 for text-embedding-3-small).</p>
        </ContentStep>
        <ContentStep number={2} title="Index your documents">
          <p>
            Chunk → embed → upsert each vector with metadata like{' '}
            <code className="font-mono text-sm">{'{ "text": "Returns accepted...", "source": "policy.pdf" }'}</code>.
            Store the chunk text in metadata so you can retrieve it at query time.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Query at runtime">
          <p>
            Embed the user's question, call Pinecone query with top_k=5 and a namespace. Get back the 5 closest
            chunks with their text from metadata. Pass to the LLM.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Filter when needed">
          <p>
            Add a metadata filter: <code className="font-mono text-sm">{'{ "source": { "$eq": "policy.pdf" } }'}</code>{' '}
            so search only runs inside that file's vectors.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Serverless vs pods — pricing models">
        <div className="space-y-3">
          <div className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
            <p className="text-sm font-semibold text-white">Serverless — pay per read/write, scales to zero</p>
            <p className="mt-1 text-sm text-slate-400">
              Best for variable traffic and prototyping. Free tier available. You pay when you query, not for idle servers.
            </p>
          </div>
          <div className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
            <p className="text-sm font-semibold text-white">Pods — dedicated hardware for sustained high QPS</p>
            <p className="mt-1 text-sm text-slate-400">
              Fixed monthly cost, predictable latency. For production apps with thousands of queries per second.
            </p>
          </div>
        </div>
      </LessonSection>

      <LessonSection title="When Pinecone makes sense">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li><strong className="text-white">Yes</strong> — production RAG, no DevOps team, need cloud scaling and namespaces for multi-tenant SaaS.</li>
          <li><strong className="text-white">Yes</strong> — variable workloads where serverless pricing beats running your own servers.</li>
          <li><strong className="text-white">Skip</strong> — data must stay on-premise, or you are still prototyping locally (use Chroma instead).</li>
          <li><strong className="text-white">Skip</strong> — you already run Postgres and want one database (use pgvector instead).</li>
        </ul>
      </LessonSection>

      <Callout variant="tip">
        Pinecone stores vectors and metadata but not full document text by default — put the chunk text inside
        metadata fields (or store text in your app DB and use Pinecone ids to look it up).
      </Callout>

      <KeyTakeaways
        items={[
          'Pinecone = managed cloud vector DB. API in, similarity results out. Zero server management.',
          'Index = your store. Upsert = insert vectors. Namespace = tenant isolation. Query = top-k search.',
          'Serverless for prototyping and variable traffic; pods for high-QPS production.',
          'Choose when you want production scale without operating your own vector database.',
        ]}
      />
    </LessonArticle>
  )
}
