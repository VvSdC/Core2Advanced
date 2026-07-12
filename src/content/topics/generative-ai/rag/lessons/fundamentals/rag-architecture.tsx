import {
  Callout,
  ContentStep,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function RagArchitecture() {
  return (
    <LessonArticle>
      <LessonSection title="Two phases — index and query">
        <p>
          Every RAG system splits into an <strong className="text-white">offline indexing phase</strong> (run once
          or on document updates) and an <strong className="text-white">online query phase</strong> (run per user
          question). Understanding this split is the key to RAG architecture.
        </p>
        <Flowchart
          title="RAG system architecture"
          chart={`flowchart TB
  subgraph offline ["Offline — Indexing Pipeline"]
    A[Raw documents] --> B[Chunking]
    B --> C[Embedding]
    C --> D[(Vector Database)]
  end
  subgraph online ["Online — Query Pipeline"]
    E[User question] --> F[Embed query]
    F --> G[Retrieve top-k chunks]
    G --> H[Build augmented prompt]
    H --> I[LLM generates answer]
    I --> J([Response])
  end
  D -.-> G`}
        />
      </LessonSection>

      <LessonSection title="Indexing pipeline components">
        <ContentStep number={1} title="Document ingestion">
          <p>
            Raw sources — PDFs, wikis, web pages, databases — are loaded and normalised to plain text with
            metadata (source, page, date, author).
          </p>
        </ContentStep>
        <ContentStep number={2} title="Chunking">
          <p>
            Large documents are split into passages sized for embedding and context windows. Covered in depth in
            the <em>Chunking Strategies</em> section.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Embedding + storage">
          <p>
            Each chunk is converted to a vector and stored in a vector database alongside its text and metadata.
            Covered in <em>Embeddings</em> and <em>Vector Databases</em>.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Query pipeline components">
        <ContentStep number={1} title="Query embedding">
          <p>The user's question is embedded with the <em>same model</em> used during indexing.</p>
        </ContentStep>
        <ContentStep number={2} title="Retrieval">
          <p>
            The query vector is compared against stored vectors. Top-k chunks are returned. Strategy choice
            (dense, BM25, hybrid) is covered in <em>Retrieval Strategies</em>.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Augmentation + generation">
          <p>
            Chunks are inserted into a prompt template. The LLM reads context + question and generates a grounded
            answer. Covered in the next lesson.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Architecture decisions upfront">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Decision</th>
                <th className="px-4 py-3">Affects</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Embedding model', 'Retrieval quality — must be same at index and query time'],
                ['Chunk size & overlap', 'Precision vs context per chunk'],
                ['Vector database', 'Scale, latency, filtering, ops overhead'],
                ['Retrieval strategy', 'Semantic vs keyword vs hybrid recall'],
                ['k (top chunks)', 'How much context reaches the LLM'],
                ['Prompt template', 'Grounding, citation, refusal behaviour'],
              ].map(([decision, affects]) => (
                <tr key={decision} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{decision}</td>
                  <td className="px-4 py-3 text-slate-400">{affects}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <Callout variant="insight">
        RAG does not change model weights. It only changes <em>what the model reads</em>. The bottleneck is
        almost always retrieval — if the right chunk is not in the prompt, no LLM can answer correctly.
      </Callout>

      <KeyTakeaways
        items={[
          'RAG has two phases: offline indexing and online querying.',
          'Indexing: ingest → chunk → embed → store. Querying: embed → retrieve → augment → generate.',
          'Each component is a separate design decision with its own section in this sub-topic.',
          'Retrieval quality is the bottleneck — tune indexing before blaming the LLM.',
        ]}
      />
    </LessonArticle>
  )
}
