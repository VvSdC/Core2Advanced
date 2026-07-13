import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function BiEncodersAndCrossEncoders() {
  return (
    <LessonArticle>
      <LessonSection title="The question every retrieval system must answer">
        <p className="text-slate-300">
          At the heart of RAG retrieval is one repeated question:{' '}
          <strong className="text-white">"How relevant is this chunk to the user's question?"</strong> You have
          thousands of chunks and one question. You need a scoring method that ranks chunks from most to least
          relevant.
        </p>
        <p className="mt-3 text-slate-300">
          There are two fundamentally different ways to compute that score. They are called{' '}
          <strong className="text-white">bi-encoders</strong> and <strong className="text-white">cross-encoders</strong>.
          Almost every RAG system uses at least one of them — often both together. Understanding the difference
          early makes every later lesson (dense retrieval, reranking, MMR) click into place.
        </p>
        <Callout variant="beginner" title="Read this after">
          Complete <em>RAG Architecture</em> first — you should already know that retrieval compares a question
          against stored chunks. This lesson explains <em>how</em> that comparison is computed inside the model.
        </Callout>
      </LessonSection>

      <Definition term="Bi-encoder">
        <p>
          A <strong className="text-white">bi-encoder</strong> encodes the query and each document{' '}
          <em>separately</em> — in two independent passes — and produces one vector per text. Relevance is
          measured by how close those two vectors are (cosine similarity). The query is never read alongside
          the document inside the model.
        </p>
        <p className="mt-3">
          "Bi" means two encodings: one for the question, one for the chunk. Compare the numbers afterward.
        </p>
      </Definition>

      <LessonSection title="Bi-encoder architecture — encode separately, compare later">
        <Flowchart
          title="Bi-encoder (used in dense retrieval)"
          chart={`flowchart TB
  subgraph index ["At index time — once per chunk"]
    C[Chunk text] --> EM1[Embedding model]
    EM1 --> V1[Chunk vector stored in DB]
  end
  subgraph query ["At query time — once per question"]
    Q[User question] --> EM2[Same embedding model]
    EM2 --> V2[Query vector]
  end
  V2 --> SIM[Cosine similarity]
  V1 --> SIM
  SIM --> RANK[Rank all chunks by score]`}
        />
        <ContentStep number={1} title="Index time — embed every chunk once">
          <p>
            Each chunk is passed through the embedding model alone. The output is a vector (e.g. 1536 numbers)
            stored in the vector database alongside the chunk text. This happens once when you build the index.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Query time — embed the question once">
          <p>
            The user's question goes through the <em>same</em> model. You get one query vector. You never re-embed
            all chunks — their vectors are already stored.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Compare vectors — no model call per pair">
          <p>
            Cosine similarity compares the query vector to every stored chunk vector. This is pure math — fast
            enough to run over millions of chunks in milliseconds (with an ANN index). No neural network runs
            at query time except the single question embedding.
          </p>
        </ContentStep>

        <div className="mt-4 rounded-xl border border-surface-600 bg-surface-800/50 p-4">
          <p className="text-sm font-semibold text-white">Analogy — comparing fingerprints from across the room</p>
          <p className="mt-2 text-sm text-slate-400">
            Each book gets a fingerprint when it enters the library. When you ask a question, the librarian
            takes a fingerprint of your question and finds books with the closest fingerprints. Fast — but
            the fingerprint was taken without ever placing your question and the book side by side.
          </p>
        </div>

        <Callout variant="insight">
          <strong className="text-white">Dense retrieval</strong> in the Retrieval Strategies section is bi-encoder
          retrieval. When you embed chunks and search by cosine similarity, you are using a bi-encoder architecture.
        </Callout>
      </LessonSection>

      <Definition term="Cross-encoder">
        <p>
          A <strong className="text-white">cross-encoder</strong> feeds the query and a candidate chunk{' '}
          <em>together</em> into a single model in one forward pass. The model reads both texts simultaneously
          and outputs one relevance score. There are no separate vectors to compare later — the score comes
          directly from joint reading.
        </p>
        <p className="mt-3">
          "Cross" means the query and document cross paths inside the model — they attend to each other at every
          layer.
        </p>
      </Definition>

      <LessonSection title="Cross-encoder architecture — read together, score directly">
        <Flowchart
          title="Cross-encoder (used in reranking)"
          chart={`flowchart TB
  Q[User question] --> JOIN[Concatenate query + chunk]
  C[Candidate chunk] --> JOIN
  JOIN --> MODEL[Single transformer model]
  MODEL --> SCORE[One relevance score 0.0 – 1.0]
  SCORE --> RANK[Rank candidates by score]`}
        />
        <ContentStep number={1} title="Pair query with one candidate chunk">
          <p>
            For each candidate, the system builds one input: the question and one chunk text together (often
            separated by a special token). Example pair:{' '}
            <em>"What is the refund window?"</em> + <em>"Returns accepted within 30 days of purchase."</em>
          </p>
        </ContentStep>
        <ContentStep number={2} title="One model pass produces one score">
          <p>
            A transformer reads both texts jointly — every word in the question can influence how every word in
            the chunk is interpreted, and vice versa. The model outputs a single number: how well this chunk
            answers this question.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Repeat for each candidate in the shortlist">
          <p>
            You run this separately for each candidate chunk. Ten candidates = ten model passes. One million
            candidates = one million passes — far too slow for a full database search. That is why cross-encoders
            are used on a <em>shortlist</em>, not the entire index.
          </p>
        </ContentStep>

        <div className="mt-4 rounded-xl border border-surface-600 bg-surface-800/50 p-4">
          <p className="text-sm font-semibold text-white">Analogy — sitting down and reading the page together</p>
          <p className="mt-2 text-sm text-slate-400">
            Instead of comparing fingerprints from across the room, the librarian sits down with your question
            and reads the first page of each shortlisted book <em>while thinking about your question</em>. Much
            more accurate judgment — but they can only do this for a handful of books, not the entire library.
          </p>
        </div>
      </LessonSection>

      <LessonSection title="Side by side — why both exist">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Property</th>
                <th className="px-4 py-3">Bi-encoder</th>
                <th className="px-4 py-3">Cross-encoder</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['How query and chunk interact', 'Encoded separately — never seen together', 'Read together in one model pass'],
                ['Output', 'Two vectors → cosine similarity', 'One direct relevance score'],
                ['Speed at scale', 'Fast — compare millions of pre-computed vectors', 'Slow — one model call per candidate pair'],
                ['Accuracy', 'Good — misses subtle query–document relationships', 'Excellent — full cross-attention between query and chunk'],
                ['When it runs', 'Over the entire vector database', 'Over a shortlist of 20–100 candidates'],
                ['Typical role in RAG', 'First-stage retrieval (dense search)', 'Second-stage reranking (precision boost)'],
                ['Examples', 'OpenAI embeddings, BGE, E5, sentence-transformers', 'Cohere Rerank, bge-reranker, ms-marco-MiniLM'],
              ].map(([prop, bi, cross], i) => (
                <tr key={i} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{prop}</td>
                  <td className="px-4 py-3 text-slate-400">{bi}</td>
                  <td className="px-4 py-3 text-slate-400">{cross}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Why bi-encoders sometimes rank the wrong chunk first">
        <p className="text-slate-300">
          Because the query and chunk are encoded independently, the bi-encoder never sees them together. Subtle
          mismatches slip through:
        </p>
        <div className="mt-4 space-y-3">
          <div className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
            <p className="text-sm font-semibold text-white">Question: "Can I return a gift without a receipt?"</p>
            <p className="mt-1 text-sm text-slate-400">
              Chunk A (rank 1 by bi-encoder): "Our generous 30-day return policy covers all purchases." — vaguely
              about returns, does not mention gifts or receipts.
            </p>
            <p className="mt-1 text-sm text-slate-400">
              Chunk B (rank 8 by bi-encoder): "Gift returns require the original receipt or gift receipt within
              14 days." — exactly answers the question, but bi-encoder ranked it lower.
            </p>
            <p className="mt-2 text-sm text-genai-400">
              A cross-encoder reading both together would score Chunk B much higher — it sees "gift" and "receipt"
              in the question and matches them directly in the chunk.
            </p>
          </div>
        </div>
        <p className="mt-4 text-slate-300">
          This is the core reason production RAG adds a reranking step after bi-encoder retrieval.
        </p>
      </LessonSection>

      <LessonSection title="The two-stage pattern — how production RAG combines both">
        <Flowchart
          title="Bi-encoder retrieve → cross-encoder rerank"
          chart={`flowchart LR
  Q[User question] --> BE[Bi-encoder: search full DB]
  BE --> TOP50[Top 50 candidates]
  TOP50 --> CE[Cross-encoder: score each pair]
  CE --> TOP5[Top 5 chunks to LLM]`}
        />
        <ContentStep number={1} title="Stage 1 — cast a wide net (bi-encoder)">
          <p>
            Search the entire vector database. Fast. Returns ~50 candidates that are <em>probably</em> relevant.
            Some will be wrong — that is acceptable at this stage.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Stage 2 — precision filter (cross-encoder)">
          <p>
            Run the cross-encoder on those 50 pairs only. Re-score each (query, chunk) together. Keep the top 5.
            The right chunk that was at position 8 in stage 1 often jumps to position 1 here.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Optional Stage 3 — diversity (MMR)">
          <p>
            If the top 5 are still redundant (five copies of the same refund paragraph), apply MMR to diversify.
            Covered in the <em>MMR & Reranking</em> lesson — MMR uses bi-encoder-style vector similarity between
            chunks, not cross-encoders.
          </p>
        </ContentStep>

        <Callout variant="tip">
          Think of it as a hiring pipeline: bi-encoder is resume screening (fast, thousands of applicants). Cross-encoder
          is the in-person interview (slow, top 50 only, much better judgment).
        </Callout>
      </LessonSection>

      <LessonSection title="Where you will see these again">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Dense Retrieval</strong> — bi-encoder search in practice (embed query,
            compare to stored vectors).
          </li>
          <li>
            <strong className="text-white">MMR & Reranking</strong> — cross-encoder reranking fixes imprecise
            bi-encoder rankings; MMR fixes redundant results in the final set.
          </li>
          <li>
            <strong className="text-white">Embeddings section</strong> — embedding models (OpenAI, BGE, E5) are
            the bi-encoder component. They produce the vectors you store and search.
          </li>
          <li>
            <strong className="text-white">ColBERT paper</strong> — a middle-ground architecture (late interaction)
            that is more accurate than bi-encoders and faster than full cross-encoders.
          </li>
        </ul>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Bi-encoder: encode query and chunk separately → compare vectors. Fast, scales to millions — used for first-stage dense retrieval.',
          'Cross-encoder: read query + chunk together in one model → direct relevance score. Slow but precise — used to rerank a shortlist.',
          'Production pattern: bi-encoder finds top 50 from full DB → cross-encoder reranks to top 5 → optional MMR for diversity.',
          'When reranking fixes "right chunk at rank 8" and MMR fixes "five copies of the same paragraph" — different problems, both common.',
        ]}
      />
    </LessonArticle>
  )
}
