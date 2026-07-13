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
          These ten questions come up in almost every RAG project, interview, and debugging session. Each answer is
          written so you can apply it directly — with plain-language explanations and real-world analogies, not just
          yes/no shortcuts.
        </p>
        <Callout variant="beginner" title="Read this after">
          Work through the other <em>Embeddings</em> lessons first — What Are Embeddings, Dense vs Sparse, Commercial
          vs Open-Source, and Specialized Embeddings. This page ties all those concepts together into practical
          answers.
        </Callout>
      </LessonSection>

      <InterviewSection title="Popular Questions">
        <InterviewQA
          number={1}
          question='Will the embedding of "abc" and "ABC" be the same?'
        >
          <p>
            <strong className="text-white">No — the vectors are not identical.</strong> Every distinct input string
            produces a slightly different list of numbers. Changing even one character shifts the output.
          </p>
          <p>
            But they are <strong className="text-white">extremely close neighbours</strong> on the meaning map — like
            two houses on the same street with different house numbers. Modern models understand that{' '}
            <code className="font-mono text-sm">abc</code> and <code className="font-mono text-sm">ABC</code> mean the
            same thing despite different capitalisation. Typical cosine similarity between them is{' '}
            <strong className="text-white">0.95–0.99</strong> — close enough that either spelling retrieves the same
            document chunks in RAG.
          </p>
          <div className="rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div className="text-slate-400">Illustrative (text-embedding-3-small)</div>
            <div className="mt-2">embed("abc")  → [0.021, -0.034, 0.112, ...]  (1536 dims)</div>
            <div>embed("ABC")  → [0.019, -0.031, 0.109, ...]  (1536 dims)</div>
            <div className="mt-2 text-genai-400">cosine_similarity("abc", "ABC") ≈ 0.97</div>
            <div className="text-slate-400">cosine_similarity("abc", "xyz") ≈ 0.15</div>
          </div>
          <p>
            <strong className="text-white">Why not identical?</strong> The model chops text into tokens first.{' '}
            <code className="font-mono text-sm">abc</code> and <code className="font-mono text-sm">ABC</code> may
            become different tokens or carry different casing signals. The neural network processes the raw characters,
            so the final vector differs slightly — same street, different house number.
          </p>
          <p>
            <strong className="text-white">Practical takeaway:</strong> you do not need to normalise casing before
            embedding for regular prose. But for <em>case-sensitive identifiers</em> — product codes like{' '}
            <code className="font-mono text-sm">SKU-ABC</code> vs{' '}
            <code className="font-mono text-sm">SKU-abc</code>, API keys, or variable names — add BM25 keyword search
            alongside dense retrieval so exact casing can be matched when it matters.
          </p>
        </InterviewQA>

        <InterviewQA
          number={2}
          question="Can I use different embedding models for indexing and querying?"
        >
          <p>
            <strong className="text-white">No — never mix models.</strong> Each embedding model creates its own
            private meaning map with its own scale, orientation, and landmarks. A query vector from OpenAI lives on
            OpenAI's map; a document vector from BGE lives on BGE's map. Comparing them is meaningless.
          </p>
          <p>
            Think of it like this: you plotted some cities using Google Maps coordinates and others using an old paper
            atlas with a different scale, a rotated north, and a different origin point. The numbers look comparable
            — they are both "latitude and longitude" — but they are not.
          </p>
          <p>
            If you switch models, you must <strong className="text-white">re-embed your entire corpus</strong> and
            rebuild the vector index from scratch. There is no conversion formula, no adapter, and no shortcut between
            different model maps.
          </p>
        </InterviewQA>

        <InterviewQA
          number={3}
          question='Why do "refund policy" and "return policy" have high similarity, but "refund policy" and "refund policies" differ more than expected?'
        >
          <p>
            Embedding models capture <strong className="text-white">meaning</strong>, not just shared words. "Refund
            policy" and "return policy" describe the same business concept — they are neighbours on the map with
            similarity around <strong className="text-white">0.85–0.92</strong>. The model knows these phrases point
            to the same idea even though they share only one word.
          </p>
          <p>
            But singular vs plural (<code className="font-mono text-sm">policy</code> vs{' '}
            <code className="font-mono text-sm">policies</code>) shifts the vector more than you might expect
            (~0.75–0.85) because the model encodes grammatical number. It is like two houses on the same street vs
            two houses on parallel streets — close, but not next door.
          </p>
          <p>
            For RAG this usually still retrieves the right chunks, but it is a reminder that{' '}
            <strong className="text-white">exact phrasing in your documents matters</strong>. If users search "refund
            policies" (plural) and your docs only say "refund policy" (singular), retrieval may rank slightly lower.
            Hybrid search with BM25 helps catch these cases by matching the shared word "refund" regardless of
            grammatical number.
          </p>
        </InterviewQA>

        <InterviewQA
          number={4}
          question="How many dimensions do I need? Is bigger always better?"
        >
          <p>
            More dimensions let the model encode finer distinctions — like a map with more detail. But returns diminish
            quickly, and each extra dimension costs storage space and compute time. Bigger is not automatically better.
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
                  ['384', 'Prototyping and edge devices — all-MiniLM-L6-v2. Fast, small, good enough for testing.'],
                  ['768–1024', 'Production sweet spot — BGE, E5, nomic. Strong quality without excessive storage.'],
                  ['1536', 'OpenAI text-embedding-3-small default. The most common choice in commercial RAG.'],
                  ['3072', 'Maximum quality — text-embedding-3-large. 2× storage vs 1536; use when accuracy is critical.'],
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
            OpenAI v3 models support <strong className="text-white">Matryoshka dimension reduction</strong> — named after
            Russian nesting dolls. You embed at full size (1,536) but store a smaller version (512) with minimal quality
            loss. Like keeping a detailed map in your office but carrying a pocket-sized version in the field.
          </p>
        </InterviewQA>

        <InterviewQA
          number={5}
          question='Do embeddings understand negation — e.g. "refundable" vs "non-refundable"?'
        >
          <p>
            <strong className="text-white">Partially — and this is a known weakness.</strong> Embeddings see
            "non-refundable" and "refundable" as <em>related</em> because they share the root concept "refund." Cosine
            similarity between them is around <strong className="text-white">0.6–0.75</strong> — closer than unrelated
            words, but not opposites.
          </p>
          <p>
            Think of it like a map where "hospital" and "not a hospital" are in the same neighbourhood because they
            both mention hospitals — even though one is the building and the other is everything that is not. The model
            does not reliably flip meaning when it sees "non-" or "not."
          </p>
          <p>
            A user asking "Is this product refundable?" may retrieve a chunk saying "This product is{' '}
            <strong className="text-white">non-refundable</strong>" because the surrounding words are similar. The
            embedding found the right topic but missed the negation.
          </p>
          <p>
            <strong className="text-white">How to mitigate:</strong> use a cross-encoder reranker (which reads the
            query and document together and catches negation), strengthen your LLM prompt ("answer only from context;
            pay close attention to words like non-, not, without"), and test negation cases explicitly in your
            evaluation set.
          </p>
        </InterviewQA>

        <InterviewQA
          number={6}
          question="What is the maximum text length I can embed?"
        >
          <p>
            Every model has a <strong className="text-white">context window</strong> — a maximum number of tokens it
            can process. Text beyond that limit is silently cut off. You lose information without any error message,
            like mailing a letter where the last page got stuck in the printer and nobody told you.
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
            This is exactly why <strong className="text-white">chunking exists</strong>. You should never embed a
            whole 50-page PDF as one vector — most of it would be silently discarded. Split documents into passages
            that fit within the model's limit, then embed each passage separately. A typical chunk is 256–512 tokens
            with some overlap between adjacent chunks.
          </p>
        </InterviewQA>

        <InterviewQA
          number={7}
          question="Should I embed the question and the document differently?"
        >
          <p>
            <strong className="text-white">Yes — for best results, some models expect it.</strong> Questions and
            documents are different styles of text. A question is short and interrogative ("What is the refund policy?").
            A document chunk is declarative prose ("Refunds are available within 30 days of purchase."). Treating them
            identically is like asking a librarian the same way you'd label a shelf — it works, but a specialist
            approach works better.
          </p>
          <p>Models with built-in asymmetric modes:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong className="text-white">E5</strong> — prefix <code className="font-mono text-sm">query:</code> at
              search time, <code className="font-mono text-sm">passage:</code> at index time.
            </li>
            <li>
              <strong className="text-white">Cohere</strong> —{' '}
              <code className="font-mono text-sm">input_type="search_query"</code> vs{' '}
              <code className="font-mono text-sm">"search_document"</code>.
            </li>
            <li>
              <strong className="text-white">BGE</strong> — prefix{' '}
              <code className="font-mono text-sm">Represent this sentence for searching relevant passages:</code> for
              queries only.
            </li>
          </ul>
          <p>
            OpenAI models do not require different prefixes — the same API call works for queries and documents. But
            using asymmetric prefixes on models that support them can improve Recall@k by 5–15%. If your model supports
            it, use it.
          </p>
        </InterviewQA>

        <InterviewQA
          number={8}
          question="Dense embeddings vs BM25 — which should I use for RAG?"
        >
          <p>
            <strong className="text-white">Start with dense; add BM25 for hybrid.</strong> Remember the framing from
            the Dense vs Sparse lesson: dense searches by <em>meaning</em>, BM25 searches by <em>exact words</em>.
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong className="text-white">Dense only</strong> — great for natural language Q&A, paraphrased queries,
              and conceptual search. Like asking a smart librarian.
            </li>
            <li>
              <strong className="text-white">BM25 only</strong> — great for exact IDs, error codes, legal references,
              and SKU lookups. Like using Ctrl+F.
            </li>
            <li>
              <strong className="text-white">Hybrid (both + RRF)</strong> — the production default when your docs
              contain both prose and identifiers. Run both searches and merge results.
            </li>
          </ul>
          <p>
            If users search "error code E404" or "Section 4.2.1", pure dense retrieval will underperform — the model
            may find related error-handling prose but miss the exact code. If they ask "how do I reset my password?",
            pure BM25 will underperform — the docs might say "credential recovery" without using the word "password."
            Hybrid covers both scenarios.
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
            <li>
              <strong className="text-white">Document content changes</strong> — added, updated, or deleted. New text
              needs new coordinates on the meaning map.
            </li>
            <li>
              <strong className="text-white">You switch embedding models</strong> — mandatory full re-embed. Different
              map, different coordinates.
            </li>
            <li>
              <strong className="text-white">You change chunking strategy</strong> — chunk boundaries shift, so the
              text being embedded changes even if the source documents did not.
            </li>
            <li>
              <strong className="text-white">The model provider releases a new version</strong> — e.g. migrating from
              ada-002 to v3. Treat it like switching maps.
            </li>
          </ul>
          <p>
            You do <em>not</em> need to re-embed when you change the LLM, prompt template, temperature, or retrieval
            k — those are query-time settings that do not affect the stored vectors. Changing the librarian's
            personality does not require re-cataloguing the books.
          </p>
        </InterviewQA>

        <InterviewQA
          number={10}
          question="Why are my embeddings slow / expensive at scale?"
        >
          <p>
            Embedding cost scales with <strong className="text-white">total tokens embedded</strong>, not number of
            documents. A 10-page PDF chunked into 50 passages means 50 separate embedding operations at index time.
            Think of it like paying per word translated, not per document translated — a thick book costs more than a
            postcard.
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong className="text-white">Batch embedding</strong> — send multiple chunks in one API call. OpenAI
              supports up to 2,048 inputs per request. Like handing the translator a stack of pages at once instead of
              one page per trip.
            </li>
            <li>
              <strong className="text-white">Cache</strong> — hash each chunk's text; skip re-embedding unchanged
              chunks on re-index. Only translate pages that actually changed.
            </li>
            <li>
              <strong className="text-white">Open-source local</strong> — one-time GPU cost, no per-token API fees.
              Hosting your own translation service pays off at high volume.
            </li>
            <li>
              <strong className="text-white">Smaller model</strong> — text-embedding-3-small vs large; MiniLM for
              development. A pocket map costs less to print than a wall-sized one.
            </li>
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
