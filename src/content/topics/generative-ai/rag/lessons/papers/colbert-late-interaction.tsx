import {
  Callout,
  ContentStep,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
  ResearchPaperHeader,
} from '../../../../../../components/content'

const PAPER_URL = 'https://arxiv.org/abs/2004.12832'

export function ColbertLateInteraction() {
  return (
    <LessonArticle>
      <ResearchPaperHeader
        title="ColBERT: Efficient and Effective Passage Search via Contextualized Late Interaction"
        authors="Khattab & Zaharia (Stanford)"
        year="2020"
        url={PAPER_URL}
      >
        <strong className="text-white">ColBERT</strong> — keep per-token embeddings and score query-document
        similarity with <em>late interaction</em>. More accurate than bi-encoders, faster than cross-encoders.
      </ResearchPaperHeader>

      <Callout variant="beginner" title="Read this after">
        Read <em>Dense Retrieval</em>, <em>MMR & Reranking</em>, and the <em>DPR</em> paper first. ColBERT
        sits between bi-encoder retrieval (fast but coarse) and cross-encoder reranking (accurate but slow) —
        this lesson walks through the full paper so you understand where it fits in a real RAG pipeline.
      </Callout>

      <LessonSection title="What this paper means in plain English">
        <p>
          When you build a RAG system, retrieval is usually the first bottleneck. You have millions of document
          chunks in a vector database, and a user asks a question. You need to find the best chunks fast — but
          also accurately. The problem is that these two goals pull in opposite directions. The fastest approach
          (bi-encoders like DPR) squashes an entire document into a single vector. That is quick to compare, but
          it throws away word-level detail. The most accurate approach (cross-encoders) reads the query and
          document together through a full transformer, catching subtle matches — but you cannot run that on a
          million documents at query time.
        </p>
        <p>
          ColBERT, short for <strong className="text-white">Contextualized Late Interaction over BERT</strong>,
          finds a middle path the authors call <em>late interaction</em>. Instead of one vector per document,
          ColBERT stores one vector per <em>token</em> (roughly, per word) in each document. Those token vectors
          are pre-computed offline and stored in an index. At query time, ColBERT embeds each token in the
          question, then compares every query token to every document token, keeping the best match for each
          query word and summing those scores. You get fine-grained, word-level matching without re-reading the
          full document through a cross-encoder at search time.
        </p>
        <p>
          Think of it with a library analogy. A <em>bi-encoder</em> judges every book by its back-cover blurb —
          one summary per book, fast to scan thousands, but you miss what is inside. A <em>cross-encoder</em>{' '}
          reads the entire book side-by-side with your question for every single book — accurate, but impossibly
          slow at scale. ColBERT is like checking every chapter heading and keyword in each book against your
          question words, then scoring the book by how well its best-matching pieces align. You pre-read the
          headings once (offline indexing) and only do the word-matching at search time.
        </p>
        <p>
          This paper is why modern production RAG often uses two stages: a fast bi-encoder casts a wide net
          (high recall), then a ColBERT-style retriever or cross-encoder reranker re-scores the top 50–100
          candidates (high precision). ColBERT showed that late interaction can serve as either the first stage,
          the second stage, or both — depending on how much storage and compute you can afford.
        </p>
      </LessonSection>

      <LessonSection title="The problem before this paper">
        <p>
          By 2020, dense retrieval with bi-encoders (especially DPR) had replaced BM25 as the default for
          open-domain question answering. The recipe was simple: encode all passages offline into single vectors,
          encode the query at search time, find nearest neighbours. It worked well — but practitioners noticed
          consistent failure modes.
        </p>
        <p>
          Bi-encoders compress an entire passage into one fixed-size vector. If a passage mentions "refund
          policy" in sentence one and "thirty-day window" in sentence seven, both ideas get blended into a single
          average representation. A query asking specifically about the time window might not align strongly with
          that blended vector, even though the passage contains the answer. This is the <strong className="text-white">representation bottleneck</strong> — one vector per document loses token-level nuance.
        </p>
        <p>
          Cross-encoders solved the accuracy problem by feeding query and document together into BERT, letting
          every query token attend to every document token inside the model. MS MARCO leaderboards showed
          cross-encoders consistently beat bi-encoders. But a cross-encoder must run a full forward pass for
          every (query, document) pair. At 50 ms per pair, scoring one million documents takes over 14 hours.
          Cross-encoders were relegated to reranking the top 50–100 candidates after a fast first stage — they
          could not <em>be</em> the first stage.
        </p>
        <p>
          The open question ColBERT addressed: <em>can we keep the pre-computation benefit of bi-encoders while
          getting closer to cross-encoder accuracy?</em> The answer was yes — by delaying the interaction between
          query and document tokens until search time, rather than collapsing everything into one vector upfront.
        </p>
      </LessonSection>

      <LessonSection title="ColBERT architecture at a glance">
        <Flowchart
          title="Late interaction vs early interaction"
          chart={`flowchart TB
  subgraph bi["Bi-encoder (DPR) — early interaction"]
    B1[Query] --> B2[One query vector]
    B3[Document] --> B4[One document vector]
    B2 --> B5[Single similarity score]
    B4 --> B5
  end
  subgraph col["ColBERT — late interaction"]
    C1[Query tokens] --> C2[Query token vectors]
    C3[Document tokens] --> C4[Document token vectors — pre-computed offline]
    C2 --> C5[MaxSim: best match per query token]
    C4 --> C5
    C5 --> C6[Sum of max similarities = final score]
  end`}
        />
        <p className="mt-4 text-slate-300">
          In bi-encoders, query and document never "meet" until a single dot product. In ColBERT, they meet at
          search time — token by token — but document token vectors were pre-computed, so you skip the expensive
          cross-encoder forward pass over the full text.
        </p>
      </LessonSection>

      <LessonSection title="How it works — step by step">
        <ContentStep number={1} title="Shared BERT backbone with separate query and document pathways">
          <p>
            ColBERT starts from a BERT model but splits into two encoders: a <strong className="text-white">query
            encoder</strong> and a <strong className="text-white">document encoder</strong>. Both share the same
            architecture but are trained with different input formatting. The query is prefixed with a special{' '}
            <code className="font-mono text-sm">[Q]</code> marker; each document passage is prefixed with a{' '}
            <code className="font-mono text-sm">[D]</code> marker. This tells the model which role it is playing.
          </p>
        </ContentStep>

        <ContentStep number={2} title="Produce one embedding per token, not per document">
          <p>
            Instead of pooling all token outputs into one vector (mean pooling or CLS token), ColBERT keeps the
            contextualised embedding of <em>every token</em>. A 128-token passage produces 128 vectors, each
            128-dimensional (after a linear compression step). A 10-token query produces 10 vectors. Every vector
            captures the meaning of its token in context — "bank" near "river" gets a different vector than
            "bank" near "account."
          </p>
        </ContentStep>

        <ContentStep number={3} title="Offline indexing of document token embeddings">
          <p>
            All document token embeddings are pre-computed and stored in a specialised index (the paper uses a
            vector store organised for fast MaxSim lookups). This is the expensive step, but it runs once. At
            query time, you only encode the query — not the entire corpus again.
          </p>
        </ContentStep>

        <ContentStep number={4} title="MaxSim scoring at query time">
          <p>
            For each query token vector, ColBERT finds the document token vector with the highest cosine
            similarity. This operation is called <strong className="text-white">MaxSim</strong> (maximum
            similarity). Intuitively: for each word in your question, find the single best-matching word anywhere
            in the document, and record that score.
          </p>
          <p className="mt-2">
            Example: query = "refund time limit." ColBERT might match "refund" to "refund" (high score), "time"
            to "thirty-day" (moderate — contextual match), and "limit" to "window" (moderate). Bi-encoders
            cannot make these individual word-level matches because they only have one vector per side.
          </p>
        </ContentStep>

        <ContentStep number={5} title="Sum MaxSim scores for the final ranking">
          <p>
            The final relevance score is the <em>sum</em> of all per-query-token MaxSim scores. Documents where
            many query words find strong token matches rank higher. This aggregation is simple, fast, and
            surprisingly effective — it acts like a soft version of keyword matching, but with contextual
            embeddings instead of exact string overlap.
          </p>
        </ContentStep>

        <ContentStep number={6} title="Training with contrastive learning on MS MARCO">
          <p>
            ColBERT is trained on MS MARCO passage ranking data using a contrastive loss similar to DPR: for
            each query, one passage is labelled relevant (positive) and others in the batch are negatives. The
            model learns token embeddings where MaxSim scores are high for positive pairs and low for negatives.
            The paper also uses <em>cross-batch negatives</em> and hard negative mining to make training harder
            and embeddings more discriminative.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="What the researchers tested">
        <p>
          Khattab and Zaharia evaluated ColBERT on the standard passage retrieval benchmarks of the time,
          with a focus on comparing against both bi-encoder and cross-encoder baselines at realistic scale.
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">MS MARCO Passage Ranking</strong> — the primary benchmark: 8.8
            million passages, 500k training queries. This is the same dataset DPR was trained and evaluated on,
            enabling direct comparison.
          </li>
          <li>
            <strong className="text-white">Baselines</strong> — BM25 (keyword), doc2query + BM25, DPR
            bi-encoder, and cross-encoder rerankers (BERT-based). They measured both retrieval-only and
            retrieve-then-rerank pipelines.
          </li>
          <li>
            <strong className="text-white">Metrics</strong> — MRR@10 (mean reciprocal rank of the first correct
            passage), Recall@50, and Recall@1000 — standard MS MARCO metrics.
          </li>
          <li>
            <strong className="text-white">Efficiency measurements</strong> — query latency, index size, and
            throughput compared to bi-encoders and cross-encoders. The paper reports ColBERT is orders of
            magnitude faster than cross-encoders at similar accuracy levels.
          </li>
          <li>
            <strong className="text-white">Index compression experiments</strong> — storing one vector per token
            is storage-heavy. The paper explores residual compression and quantisation to make indexes practical
            for millions of documents (later improved significantly in ColBERTv2).
          </li>
        </ul>
      </LessonSection>

      <LessonSection title="Key results — what they found">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Beat DPR bi-encoder on MS MARCO.</strong> ColBERT achieved higher
            MRR@10 and Recall@k than DPR, confirming that token-level late interaction captures relevance
            signals bi-encoders miss.
          </li>
          <li>
            <strong className="text-white">Near cross-encoder accuracy at a fraction of the cost.</strong> ColBERT
            reached accuracy close to cross-encoder rerankers while being 10–100× faster, because document
            embeddings are pre-computed and MaxSim is a lightweight operation.
          </li>
          <li>
            <strong className="text-white">Effective as both retriever and reranker.</strong> ColBERT worked as
            a standalone first-stage retriever over the full corpus, and also as a reranker on top of BM25 or
            DPR candidates — flexible deployment depending on your latency budget.
          </li>
          <li>
            <strong className="text-white">Contextualised token embeddings matter.</strong> Ablations showed that
            using contextualised BERT token embeddings (not static word embeddings) and keeping all tokens (not
            pooling early) were both critical to the gains.
          </li>
          <li>
            <strong className="text-white">Storage trade-off is real.</strong> Token-level indexes are larger than
            single-vector-per-document indexes. The paper acknowledged this and motivated later work (ColBERTv2,
            PLAID) on compression and pruning.
          </li>
        </ul>
      </LessonSection>

      <LessonSection title="Limitations and what came after">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Index size.</strong> Storing 100–300 vectors per document instead of
            one adds significant storage and memory overhead. For a billion-document corpus, naive ColBERT indexing
            is impractical without compression.
          </li>
          <li>
            <strong className="text-white">MaxSim is still a heuristic.</strong> Summing best per-token matches
            does not capture complex semantic relationships that a full cross-encoder attention layer would. Some
            hard queries still need cross-encoder reranking on top.
          </li>
          <li>
            <strong className="text-white">Training requires labelled data.</strong> Unlike HyDE, ColBERT needs
            query-passage relevance pairs (MS MARCO style) to train. Zero-shot deployment requires using
            pre-trained checkpoints.
          </li>
          <li>
            <strong className="text-white">ColBERTv2 (2022).</strong> Introduced residual compression and
            denoised supervision, cutting index size roughly 6–10× while improving accuracy. This made
            million-passage indexes practical on commodity hardware.
          </li>
          <li>
            <strong className="text-white">PLAID (2022).</strong> Added centroid-based pruning so MaxSim skips
            obviously irrelevant document tokens at search time, dramatically speeding up query latency on large
            indexes.
          </li>
          <li>
            <strong className="text-white">Modern landscape.</strong> Today, production RAG commonly uses a
            three-tier stack: BM25 or bi-encoder for recall → ColBERT or monoT5/cross-encoder for reranking →
            LLM for generation. ColBERT's late interaction idea also influenced multi-vector retrievers in
            Vespa, Pinecone sparse-dense hybrids, and open-source tools like RAGatouille.
          </li>
        </ul>
      </LessonSection>

      <LessonSection title="Connection to lessons">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Lesson</th>
                <th className="px-4 py-3">How this paper connects</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                [
                  'Dense Retrieval',
                  'ColBERT is the accuracy upgrade when single-vector bi-encoder retrieval is not precise enough',
                ],
                [
                  'MMR & Reranking',
                  'ColBERT occupies the same second-stage reranking slot as cross-encoders, but with better speed',
                ],
                [
                  'DPR paper',
                  'DPR is the fast first stage (one vector per doc); ColBERT keeps multiple vectors and compares at search time',
                ],
                [
                  'Vector Databases Overview',
                  'ColBERT indexes are multi-vector — storage and search patterns differ from standard single-embedding indexes',
                ],
                [
                  'Advanced Retrieval Strategies',
                  'Two-stage retrieve-then-rerank pipelines taught there are directly motivated by ColBERT vs cross-encoder trade-offs',
                ],
              ].map(([lesson, connection]) => (
                <tr key={lesson} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{lesson}</td>
                  <td className="px-4 py-3 text-slate-400">{connection}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <Callout variant="beginner" title="Key insight for beginners">
        ColBERT is the "Goldilocks" retriever — more accurate than bi-encoders because it matches word by word,
        faster than cross-encoders because document vectors are pre-computed. In practice, cast a wide net with
        something fast, then rerank the top results with something ColBERT-like.
      </Callout>

      <KeyTakeaways
        items={[
          'ColBERT stores one contextualised embedding per token, not one vector per document.',
          'MaxSim scoring finds the best-matching document token for each query token, then sums those scores.',
          'More accurate than bi-encoders (DPR); 10–100× faster than cross-encoder rerankers at similar quality.',
          'Document token embeddings are pre-computed offline — only the query is encoded at search time.',
          'Index size is the main trade-off; ColBERTv2 and PLAID addressed compression and speed for production scale.',
        ]}
      />
    </LessonArticle>
  )
}
