import {
  Callout,
  InterviewQA,
  InterviewSection,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function PopularEmbeddingQuestions() {
  return (
    <LessonArticle>
      <LessonSection title="Popular questions">
        <p>
          These are the embedding questions that come up constantly in RAG projects, interviews, and debugging
          sessions. Each answer goes deep enough that you can apply it directly — not just a yes/no.
        </p>
        <Callout variant="beginner" title="Read this after">
          Work through the other <em>Embeddings</em> lessons first. This page ties together concepts from dense
          vs sparse, commercial vs open-source, and specialised models.
        </Callout>
      </LessonSection>

      <InterviewSection title="Popular Questions">
        <InterviewQA
          number={1}
          question='Will the embedding of "abc" and "ABC" be the same?'
        >
          <p>
            <strong className="text-white">No — the vectors are not identical.</strong> Different input strings
            always produce different floating-point vectors. Even a single character change alters the output.
          </p>
          <p>
            But they are <strong className="text-white">extremely similar</strong>. Modern embedding models
            understand that <code className="font-mono text-sm">abc</code> and{' '}
            <code className="font-mono text-sm">ABC</code> are the same word with different casing. Typical cosine
            similarity between them is <strong className="text-white">0.95–0.99</strong> — close enough that
            either query retrieves the same chunks in RAG.
          </p>
          <div className="rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div className="text-slate-400">Illustrative (text-embedding-3-small)</div>
            <div className="mt-2">embed("abc")  → [0.021, -0.034, 0.112, ...]  (1536 dims)</div>
            <div>embed("ABC")  → [0.019, -0.031, 0.109, ...]  (1536 dims)</div>
            <div className="mt-2 text-genai-400">cosine_similarity("abc", "ABC") ≈ 0.97</div>
            <div className="text-slate-400">cosine_similarity("abc", "xyz") ≈ 0.15</div>
          </div>
          <p>
            <strong className="text-white">Why not identical?</strong> The model tokenises input first. Depending
            on the tokenizer, <code className="font-mono text-sm">abc</code> and{' '}
            <code className="font-mono text-sm">ABC</code> may map to different tokens or the same token with
            different casing signals. The neural network still processes the raw character sequence, so the final
            pooled vector differs slightly.
          </p>
          <p>
            <strong className="text-white">Practical implication for RAG:</strong> you do not need to normalise
            casing before embedding for general prose. But for <em>case-sensitive identifiers</em> — product codes
            like <code className="font-mono text-sm">SKU-ABC</code> vs{' '}
            <code className="font-mono text-sm">SKU-abc</code>, API keys, or variable names — add BM25 keyword
            search alongside dense retrieval so exact casing can be matched when it matters.
          </p>
        </InterviewQA>

        <InterviewQA
          number={2}
          question="Can I use different embedding models for indexing and querying?"
        >
          <p>
            <strong className="text-white">No — never mix models.</strong> Each embedding model maps text into its
            own vector space with its own scale, orientation, and semantics. A query vector from OpenAI cannot be
            compared to document vectors from BGE — the cosine similarity score would be meaningless.
          </p>
          <p>
            Think of it like measuring distance in miles vs kilometres but also rotating the map 40° and using a
            different origin point. The numbers look comparable but are not.
          </p>
          <p>
            If you switch models, you must <strong className="text-white">re-embed your entire corpus</strong> and
            rebuild the vector index from scratch. There is no conversion formula between model spaces.
          </p>
        </InterviewQA>

        <InterviewQA
          number={3}
          question='Why do "refund policy" and "return policy" have high similarity, but "refund policy" and "refund policies" differ more than expected?'
        >
          <p>
            Embedding models capture <strong className="text-white">semantic meaning</strong>, not just shared words.
            "Refund policy" and "return policy" describe the same concept — high similarity (~0.85–0.92).
          </p>
          <p>
            But singular vs plural (<code className="font-mono text-sm">policy</code> vs{' '}
            <code className="font-mono text-sm">policies</code>) can shift the vector more than you expect (~0.75–0.85)
            because the model encodes grammatical number. For RAG this usually still retrieves the right chunks, but
            it is a reminder that <strong className="text-white">exact phrasing in your documents matters</strong> —
            if users search "refund policies" (plural) and your docs only say "refund policy" (singular), retrieval
            may rank slightly lower. Hybrid search with BM25 helps catch these cases.
          </p>
        </InterviewQA>

        <InterviewQA
          number={4}
          question="How many dimensions do I need? Is bigger always better?"
        >
          <p>
            More dimensions let the model encode finer distinctions, but with diminishing returns and higher storage
            cost.
          </p>
          <div className="mt-3 overflow-x-auto rounded-xl border border-surface-600">
            <table className="w-full text-sm text-slate-300">
              <thead>
                <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                  <th className="px-4 py-3">Dimensions</th>
                  <th className="px-4 py-3">Typical use</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-600">
                {[
                  ['384', 'Prototyping, edge devices — all-MiniLM-L6-v2'],
                  ['768–1024', 'Production RAG sweet spot — BGE, E5, nomic'],
                  ['1536', 'OpenAI text-embedding-3-small default'],
                  ['3072', 'Maximum quality — text-embedding-3-large; 2× storage vs 1536'],
                ].map(([dims, use]) => (
                  <tr key={dims} className="hover:bg-surface-800/50">
                    <td className="px-4 py-3 font-mono text-genai-400">{dims}</td>
                    <td className="px-4 py-3 text-slate-400">{use}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3">
            OpenAI v3 models support <strong className="text-white">Matryoshka dimension reduction</strong> — embed
            at 1536 but store at 512 with minimal quality loss. This saves vector DB storage without switching models.
          </p>
        </InterviewQA>

        <InterviewQA
          number={5}
          question='Do embeddings understand negation — e.g. "refundable" vs "non-refundable"?'
        >
          <p>
            <strong className="text-white">Partially — and this is a known weakness.</strong> Embedding models
            encode "non-refundable" and "refundable" as <em>related</em> (they share the root concept "refund") with
            cosine similarity around <strong className="text-white">0.6–0.75</strong> — closer than unrelated words
            but not opposites.
          </p>
          <p>
            Unlike humans, embeddings do not reliably encode logical negation. A query "Is this product refundable?"
            may retrieve a chunk saying "This product is <strong className="text-white">non-refundable</strong>"
            because the surrounding words are similar.
          </p>
          <p>
            <strong className="text-white">Mitigation:</strong> use cross-encoder reranking (which reads query +
            document together), strengthen LLM grounding prompts ("answer only from context; note negation carefully"),
            and test negation cases explicitly in your eval set.
          </p>
        </InterviewQA>

        <InterviewQA
          number={6}
          question="What is the maximum text length I can embed?"
        >
          <p>
            Every model has a <strong className="text-white">context window</strong> — text beyond it is truncated
            silently. You lose information without an error.
          </p>
          <div className="mt-3 overflow-x-auto rounded-xl border border-surface-600">
            <table className="w-full text-sm text-slate-300">
              <thead>
                <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                  <th className="px-4 py-3">Model</th>
                  <th className="px-4 py-3">Max tokens</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-600">
                {[
                  ['OpenAI text-embedding-3-small/large', '8,191'],
                  ['BGE-large-en-v1.5', '512'],
                  ['E5-large-v2', '512'],
                  ['nomic-embed-text-v1.5', '8,192'],
                  ['Cohere embed-v3', '512'],
                ].map(([model, tokens]) => (
                  <tr key={model} className="hover:bg-surface-800/50">
                    <td className="px-4 py-3 font-mono text-xs text-genai-400">{model}</td>
                    <td className="px-4 py-3 text-slate-400">{tokens}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3">
            This is exactly why <strong className="text-white">chunking exists</strong> — you should never embed a
            whole 50-page PDF as one vector. Split into passages that fit within the model's limit.
          </p>
        </InterviewQA>

        <InterviewQA
          number={7}
          question="Should I embed the question and the document differently?"
        >
          <p>
            <strong className="text-white">Yes — for best results, some models expect it.</strong> Questions and
            documents are different text styles. A question is short and interrogative; a document chunk is
            declarative prose.
          </p>
          <p>
            Models with asymmetric modes:
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li><strong className="text-white">E5</strong> — prefix <code className="font-mono text-sm">query:</code> at search time, <code className="font-mono text-sm">passage:</code> at index time.</li>
            <li><strong className="text-white">Cohere</strong> — <code className="font-mono text-sm">input_type="search_query"</code> vs <code className="font-mono text-sm">"search_document"</code>.</li>
            <li><strong className="text-white">BGE</strong> — prefix <code className="font-mono text-sm">Represent this sentence for searching relevant passages:</code> for queries.</li>
          </ul>
          <p>
            OpenAI models do not require different prefixes — same API call for queries and documents. But using
            asymmetric prefixes on models that support them can improve Recall@k by 5–15%.
          </p>
        </InterviewQA>

        <InterviewQA
          number={8}
          question="Dense embeddings vs BM25 — which should I use for RAG?"
        >
          <p>
            <strong className="text-white">Start with dense; add BM25 for hybrid.</strong>
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li><strong className="text-white">Dense only</strong> — great for natural language Q&A, paraphrased queries, conceptual search.</li>
            <li><strong className="text-white">BM25 only</strong> — great for exact IDs, codes, legal references, SKU lookups.</li>
            <li><strong className="text-white">Hybrid (both + RRF)</strong> — production default when your docs contain both prose and identifiers.</li>
          </ul>
          <p>
            If your users search "error code E404" or "Section 4.2.1", pure dense retrieval will underperform. If
            they ask "how do I reset my password?", pure BM25 will underperform. Hybrid covers both.
          </p>
        </InterviewQA>

        <InterviewQA
          number={9}
          question="How often should I re-embed my documents?"
        >
          <p>
            Re-embed when <strong className="text-white">any of these change</strong>:
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>Document content is added, updated, or deleted.</li>
            <li>You switch embedding models (mandatory full re-embed).</li>
            <li>You change chunking strategy (chunk boundaries shift → new vectors needed).</li>
            <li>The embedding model provider releases a new version (e.g. ada-002 → v3).</li>
          </ul>
          <p>
            You do <em>not</em> need to re-embed when you change the LLM, prompt template, temperature, or
            retrieval k — those are query-time settings that do not affect stored vectors.
          </p>
        </InterviewQA>

        <InterviewQA
          number={10}
          question="Why are my embeddings slow / expensive at scale?"
        >
          <p>
            Embedding cost scales with <strong className="text-white">total tokens embedded</strong>, not number of
            documents. A 10-page PDF chunked into 50 passages costs 50 API calls at index time.
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li><strong className="text-white">Batch embedding</strong> — send multiple chunks per API call (OpenAI supports up to 2048 inputs per request).</li>
            <li><strong className="text-white">Cache</strong> — hash chunk text; skip re-embedding unchanged chunks on re-index.</li>
            <li><strong className="text-white">Open-source local</strong> — one-time GPU cost, no per-token API fees at scale.</li>
            <li><strong className="text-white">Smaller model</strong> — text-embedding-3-small vs large; MiniLM for dev.</li>
          </ul>
        </InterviewQA>
      </InterviewSection>

      <KeyTakeaways
        items={[
          '"abc" and "ABC" produce different but nearly identical vectors (~0.97 similarity) — fine for prose, watch case-sensitive IDs.',
          'Never mix embedding models between index and query — re-embed everything on model change.',
          'Embeddings weakly handle negation — test "non-refundable" vs "refundable" in your eval set.',
          'Chunk to fit model token limits; use asymmetric query/passage prefixes when the model supports them.',
        ]}
      />
    </LessonArticle>
  )
}
