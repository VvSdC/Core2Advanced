import {
  Callout,
  CodeBlock,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function EmbeddingAndRerankingModels() {
  return (
    <LessonArticle>
      <Definition term="Embedding models in llama.cpp">
        <p>
          Not every GGUF file is a chat model. <strong className="text-white">Embedding models</strong> convert text
          into dense vectors (numbers) that capture meaning. llama.cpp can run embedding GGUF files and expose them
          via <code className="font-mono text-sm">/v1/embeddings</code> — the same endpoint shape OpenAI uses.
        </p>
      </Definition>

      <LessonSection title="Embedding vs chat models">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Output</th>
                <th className="px-4 py-3">Typical use</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Chat / instruct', 'Generated text tokens', 'Q&A, agents, summarization'],
                ['Embedding', 'Fixed-size float vector', 'Search, clustering, RAG indexing'],
                ['Reranker', 'Relevance score per pair', 'Re-order search results'],
              ].map(([type, output, use]) => (
                <tr key={type} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{type}</td>
                  <td className="px-4 py-3 text-slate-400">{output}</td>
                  <td className="px-4 py-3 text-slate-400">{use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-slate-300">
          Download embedding GGUF files from Hugging Face (search for &quot;GGUF embedding&quot; or models like
          nomic-embed, bge-small). They are usually much smaller than 7B chat models.
        </p>
      </LessonSection>

      <LessonSection title="Run an embedding server">
        <Example title="llama-server with an embedding model">{`# Embedding-only model — no chat completions
./llama-server \\
  -m models/nomic-embed-text-v1.5-Q8_0.gguf \\
  --host 0.0.0.0 \\
  --port 8081 \\
  --embedding \\
  -c 2048`}</Example>
        <Callout variant="tip">
          The <code className="font-mono text-sm">--embedding</code> flag tells the server to operate in embedding
          mode. Some builds auto-detect from the model architecture — check your version&apos;s docs if the flag
          name differs.
        </Callout>
      </LessonSection>

      <LessonSection title="Call /v1/embeddings">
        <Example title="curl embedding request">{`curl http://localhost:8081/v1/embeddings \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "nomic-embed",
    "input": "llama.cpp runs quantized models efficiently on CPU and GPU."
  }'`}</Example>
        <CodeBlock title="Response shape (simplified)">{`{
  "data": [
    {
      "embedding": [0.012, -0.034, 0.089, ...],
      "index": 0
    }
  ],
  "model": "nomic-embed",
  "usage": { "prompt_tokens": 12, "total_tokens": 12 }
}`}</CodeBlock>
        <p className="mt-4 text-slate-300">
          Pass an array in <code className="font-mono text-sm">input</code> to embed multiple strings in one request.
          Vectors from the same model are comparable — similar text yields vectors that are close in cosine distance.
        </p>
      </LessonSection>

      <LessonSection title="RAG pipeline with llama.cpp">
        <Flowchart
          title="Two servers, one RAG flow"
          chart={`flowchart LR
  A[Documents] --> B[Chunk text]
  B --> C[Embedding server :8081]
  C --> D[(Vector store)]
  E[User question] --> F[Embed query]
  F --> C
  D --> G[Top-k chunks]
  G --> H[Chat server :8080]
  E --> H
  H --> I[Answer]`}
        />
        <p className="mt-4 text-slate-300">
          A typical <strong className="text-white">RAG</strong> setup runs two llama-server instances: one embedding
          model on port 8081, one chat model on port 8080. Index your documents offline; at query time, embed the
          question, retrieve similar chunks, and pass them in the chat prompt.
        </p>
        <Example title="Python: embed + chat (conceptual)">{`from openai import OpenAI

embed_client = OpenAI(base_url="http://localhost:8081/v1", api_key="x")
chat_client = OpenAI(base_url="http://localhost:8080/v1", api_key="x")

def embed(text: str) -> list[float]:
    r = embed_client.embeddings.create(model="nomic-embed", input=text)
    return r.data[0].embedding

query = "How does GPU offloading work?"
# In a real app: chunks = retrieve_top_k(embed(query), vector_store, k=3)
context = "Use -ngl to offload layers to the GPU; remaining layers run on CPU."

response = chat_client.chat.completions.create(
    model="llama",
    messages=[{
        "role": "user",
        "content": f"Context:\\n{context}\\n\\nQuestion: {query}"
    }],
)
print(response.choices[0].message.content)`}</Example>
      </LessonSection>

      <LessonSection title="Reranking models">
        <Definition term="Reranker">
          <p>
            A <strong className="text-white">reranker</strong> scores how well each document matches a query — more
            accurate than pure vector similarity but slower. llama.cpp supports reranking GGUF models for a second
            pass after cheap embedding retrieval: retrieve top 50 with embeddings, rerank to the best 5, then send
            those to the chat model.
          </p>
        </Definition>
        <Callout variant="beginner" title="Keep it simple at first">
          Start RAG with embeddings + cosine search only. Add a reranker when you notice irrelevant chunks slipping
          into the top results.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Embedding GGUF models output vectors, not chat text — use --embedding and /v1/embeddings.',
          'RAG often uses two llama-server instances: embedding for index/search, chat for answers.',
          'The OpenAI SDK embeddings.create() works with base_url pointed at your embedding server.',
          'Rerankers refine search results after initial embedding retrieval for better context quality.',
        ]}
      />
    </LessonArticle>
  )
}
