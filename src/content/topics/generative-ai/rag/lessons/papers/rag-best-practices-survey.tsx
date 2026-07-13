import {
  Callout,
  ContentStep,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
  ResearchPaperHeader,
} from '../../../../../../components/content'

const PAPER_URL = 'https://arxiv.org/abs/2402.07442'

export function RagBestPracticesSurvey() {
  return (
    <LessonArticle>
      <ResearchPaperHeader
        title="Searching for Best Practices in Retrieval-Augmented Generation"
        authors="Wang et al. (University of Waterloo)"
        year="2024"
        url={PAPER_URL}
      >
        A systematic benchmark of <strong className="text-white">every major RAG design knob</strong> — chunk
        size, overlap, embeddings, retrieval mode, reranking, query expansion — with measured wins and losses on
        real QA tasks.
      </ResearchPaperHeader>

      <Callout variant="beginner" title="Read this after">
        Complete the <em>Chunking Strategies</em> and <em>Retrieval Methods</em> lessons first. Those teach
        what each knob does; this paper reports what happens when you actually turn them in controlled
        experiments — so you know which defaults are worth your time.
      </Callout>

      <LessonSection title="What this paper means in plain English">
        <p>
          Building a RAG pipeline feels like tuning a soundboard: chunk size, overlap, embedding model, keyword
          vs semantic search, reranker on or off, HyDE, multi-query — dozens of sliders. Blog posts argue
          passionately for 512-token chunks or hybrid search, but rarely show systematic evidence on more than
          one dataset. This paper is the opposite: the authors picked representative QA benchmarks and varied{' '}
          <em>one design choice at a time</em> (or sensible combinations), measuring end-to-end answer quality.
        </p>
        <p>
          Think of it as a cooking experiment. Instead of saying "salt makes food better," they tried no salt,
          a pinch, and a tablespoon across many recipes, and recorded which dishes improved. Some results match
          intuition (reranking usually helps); others are humbling (no single chunk size wins everywhere). The
          biggest meta-lesson: <strong className="text-white">your documents and questions matter more than
          Twitter defaults</strong> — but certain upgrades (hybrid retrieval, reranking, modest overlap)
          consistently pay off across datasets.
        </p>
        <p>
          The paper does not invent a new RAG architecture. It is an <em>engineering map</em> for practitioners:
          start with a sane baseline, add hybrid search, add a reranker, benchmark chunk sizes on your own
          corpus, then consider query expansion for vague questions. If you read only one "how to tune RAG"
          paper, this is the one that ties chunking lessons to numbers you can explain to a teammate.
        </p>
        <p>
          For first-time learners: treat this as the bridge between theory (lessons) and your production
          system. You do not need to replicate every experiment — you need to copy the <em>method</em>: change
          one variable, measure, keep what helps on <em>your</em> data.
        </p>
      </LessonSection>

      <LessonSection title="The problem before this paper">
        <p>
          By early 2024, RAG advice was fragmented. Tutorials recommended fixed chunk sizes (256, 512, or 1024
          tokens) without saying which datasets those numbers came from. Teams debated dense vs BM25 vs hybrid
          from first principles, but few published apples-to-apples comparisons on the same generator model,
          same evaluation metric, and same query set.
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Myth of universal defaults</strong> — "always use 512 tokens" spread
            as folklore without per-domain evidence.
          </li>
          <li>
            <strong className="text-white">Component isolation missing</strong> — a better embedding and a better
            chunker were rarely tested independently on identical pipelines.
          </li>
          <li>
            <strong className="text-white">Advanced tricks oversold</strong> — HyDE and multi-query expansion
            were promoted as magic fixes without clear conditions for when they help or hurt latency and cost.
          </li>
          <li>
            <strong className="text-white">Reranking underestimated</strong> — many prototypes stopped at
            vector search, leaving accuracy on the table.
          </li>
        </ul>
        <p className="mt-3">
          Wang et al. built a modular RAG test harness and swept the hyperparameter space so beginners and
          teams could prioritise high-impact changes before chasing exotic optimisations.
        </p>
      </LessonSection>

      <LessonSection title="RAG benchmark harness — overview">
        <Flowchart
          title="How the survey isolates each RAG design choice"
          chart={`flowchart TB
  A[Fixed QA datasets + metrics] --> B[Baseline RAG pipeline]
  B --> C{Vary one knob}
  C --> D1[Chunk size: 256 / 512 / 1024]
  C --> D2[Overlap: 0% / 10% / 20%]
  C --> D3[Embedding model]
  C --> D4[Dense vs BM25 vs Hybrid]
  C --> D5[+/- Cross-encoder reranker]
  C --> D6[Query expansion: HyDE, multi-query]
  D1 --> E[Same generator LLM for all runs]
  D2 --> E
  D3 --> E
  D4 --> E
  D5 --> E
  D6 --> E
  E --> F[Measure answer correctness / retrieval quality]
  F --> G[Compare which knobs move the needle]`}
        />
        <p className="mt-4 text-slate-300">
          Holding the generator model and evaluation protocol steady is critical. Otherwise you cannot tell
          whether a gain came from better chunks or from a luckier LLM temperature.
        </p>
      </LessonSection>

      <LessonSection title="How it works — step by step">
        <ContentStep number={1} title="Define a modular baseline pipeline">
          <p>
            The authors implemented a standard RAG stack: ingest documents → chunk → embed → index → retrieve
            top-k → (optional rerank) → stuff context into prompt → LLM answer. Each stage is swappable. That
            modularity lets them change <em>only</em> chunk size, or <em>only</em> retrieval mode, while
            everything else stays fixed.
          </p>
        </ContentStep>

        <ContentStep number={2} title="Sweep chunk size and overlap">
          <p>
            They tested fixed chunk sizes of <strong className="text-white">256, 512, and 1024 tokens</strong>{' '}
            with overlap settings of <strong className="text-white">0%, 10%, and 20%</strong>. Smaller chunks
            retrieve more precise needles but fragment context; larger chunks preserve nuance but dilute relevance
            signals. Overlap reduces the chance that a sentence split across chunk boundaries gets lost. Results
            showed <em>no single winner</em> across all datasets — but ~10% overlap helped more often than 0%.
          </p>
        </ContentStep>

        <ContentStep number={3} title="Compare embedding models">
          <p>
            OpenAI embeddings, Cohere, and strong open-source models (contemporary to the paper) were compared
            under the same chunking and retrieval setup. Better embeddings improved recall@k — getting the right
            chunk into the candidate set — but could not fix bad chunking or a weak generator. The paper
            reinforces: embeddings are one layer, not the whole system.
          </p>
        </ContentStep>

        <ContentStep number={4} title="Dense vs BM25 vs hybrid retrieval">
          <p>
            <strong className="text-white">Dense</strong> (vector) search finds paraphrases and conceptual
            matches. <strong className="text-white">BM25</strong> (sparse keyword) excels at exact tokens — SKUs,
            error codes, rare names. <strong className="text-white">Hybrid</strong> fuses both scores (e.g.
            weighted sum or reciprocal rank fusion). Hybrid consistently beat dense-only on the benchmarks tested,
            especially when queries contained distinctive keywords.
          </p>
        </ContentStep>

        <ContentStep number={5} title="Add cross-encoder reranking">
          <p>
            First-stage retrieval returns a larger candidate set (e.g. top 50–100). A{' '}
            <strong className="text-white">cross-encoder reranker</strong> scores each (query, chunk) pair
            jointly — slower but more accurate — then keeps top 3–7 for the LLM. The survey found reranking
            one of the most reliable upgrades for <em>precision</em> (right chunk near the top), which also
            helps with lost-in-the-middle effects if you put rank-1 first.
          </p>
        </ContentStep>

        <ContentStep number={6} title="Test query expansion (HyDE, multi-query)">
          <p>
            <strong className="text-white">HyDE</strong> asks the LLM to hallucinate a hypothetical answer,
            embeds that text, and retrieves with it — useful when user queries are vague.{' '}
            <strong className="text-white">Multi-query</strong> paraphrases the question several times and merges
            retrieval results. Both can help on short or ambiguous queries but add latency and cost; the paper
            characterises when gains justify the overhead.
          </p>
        </ContentStep>

        <ContentStep number={7} title="Record end-to-end metrics">
          <p>
            Improvements are measured on full RAG outcomes — answer correctness and retrieval-centric scores —
            not embedding cosine alone. That closes the loop for practitioners: you see which knob actually
            moves user-visible quality, not just a leaderboard on embeddings.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="What the researchers tested">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Chunk sizes</strong> — 256, 512, 1024 tokens with multiple overlap
            percentages.
          </li>
          <li>
            <strong className="text-white">Splitting strategies</strong> — fixed-size vs recursive character
            splitting (and related baselines aligned with common frameworks).
          </li>
          <li>
            <strong className="text-white">Embedding providers</strong> — commercial APIs vs open-source models.
          </li>
          <li>
            <strong className="text-white">Retrieval modes</strong> — dense only, BM25 only, hybrid fusion.
          </li>
          <li>
            <strong className="text-white">Reranking</strong> — with and without cross-encoder second stage.
          </li>
          <li>
            <strong className="text-white">Query expansion</strong> — HyDE, multi-query variants.
          </li>
          <li>
            <strong className="text-white">Datasets</strong> — multiple open QA / knowledge-intensive benchmarks
            (domain mix varies; the paper emphasises cross-dataset patterns rather than one hero score).
          </li>
        </ul>
      </LessonSection>

      <LessonSection title="Key results — what they found">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Finding</th>
                <th className="px-4 py-3">What the numbers mean for you</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                [
                  'No universal best chunk size',
                  '256, 512, and 1024 each won on different datasets — swings of several points in answer accuracy. You must benchmark on your own docs, not copy one blog post.',
                ],
                [
                  '~10% overlap often helps',
                  'Compared to 0% overlap, 10% frequently improved recall when answers sat on chunk boundaries. 20% helped sometimes but increases storage and redundancy.',
                ],
                [
                  'Hybrid beats dense-only',
                  'Combining BM25 + vectors improved retrieval on keyword-heavy queries (IDs, names) while keeping semantic matches. Typical fusion: RRF or weighted score merge.',
                ],
                [
                  'Reranking is a reliable precision boost',
                  'Cross-encoder rerankers consistently moved the correct chunk into top-3 slots — high ROI after basic chunking and retrieval work.',
                ],
                [
                  'HyDE helps vague queries',
                  'When users ask one-word or underspecified questions, hypothetical-document expansion recovered recall dense search missed — at extra LLM + embed cost.',
                ],
                [
                  'Embeddings matter but do not replace tuning',
                  'Switching embedding model shifted recall, but chunk size and hybrid retrieval still changed rankings — system tuning is multidimensional.',
                ],
              ].map(([finding, meaning]) => (
                <tr key={finding} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{finding}</td>
                  <td className="px-4 py-3 text-slate-400">{meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-slate-300">
          Read these as <em>priorities</em>, not laws: first stabilise chunking and hybrid retrieval, add
          reranking, then micro-optimise chunk length on your evaluation set. Query expansion is tier-three
          unless you see many vague queries in logs.
        </p>
      </LessonSection>

      <LessonSection title="Limitations and what came after">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Dataset scope</strong> — benchmarks are mostly English QA corpora;
            legal PDFs, chat logs, or code repos may behave differently.
          </li>
          <li>
            <strong className="text-white">Fixed generator</strong> — results pair with specific LLMs; stronger
            models can mask retrieval errors or amplify reranking gains.
          </li>
          <li>
            <strong className="text-white">Cost not always central</strong> — reranking and HyDE improve quality
            but add milliseconds and dollars; production needs Pareto trade-offs the survey only partly explores.
          </li>
          <li>
            <strong className="text-white">Rapid model churn</strong> — embedding leaderboards (E5, BGE, etc.)
            evolved after publication; re-verify embedding comparisons with current models.
          </li>
          <li>
            <strong className="text-white">What came after</strong> — agentic RAG, graph RAG, and adaptive
            chunking research extend the idea of systematic evaluation; this paper remains the canonical
            chunk-and-retrieval tuning reference for classic flat-index RAG.
          </li>
        </ul>
      </LessonSection>

      <LessonSection title="Connection to lessons">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Lesson</th>
                <th className="px-4 py-3">Connection</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                [
                  'Chunk Size & Overlap',
                  'Empirically confirms you should test 256, 512, and 1024 on your data — and that ~10% overlap is a strong starting point',
                ],
                [
                  'Fixed & Recursive Splitting',
                  'Recursive splitting emerged as a practical default before domain-specific chunk tuning',
                ],
                [
                  'Semantic Chunking',
                  'Survey tested structure-aware approaches; wins are dataset-dependent, not automatic',
                ],
                [
                  'Dense vs Sparse',
                  'Provides measured evidence for hybrid retrieval over dense-only — the lesson’s recommendation in numbers',
                ],
                [
                  'Advanced Retrieval',
                  'HyDE and multi-query results justify the Advanced Retrieval lesson’s guidance on when to add expansion',
                ],
                [
                  'Lost in the Middle',
                  'Reranking to top-3 pairs with this paper’s k=3–7 prompt guidance — precision and attention alignment together',
                ],
              ].map(([lesson, conn]) => (
                <tr key={lesson} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{lesson}</td>
                  <td className="px-4 py-3 text-slate-400">{conn}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <Callout variant="beginner" title="Key insight for beginners">
        There is no magic default chunk size or retrieval mode. Benchmark on your own documents — but start with
        hybrid search plus a reranker before obsessing over exotic tricks. That two-step upgrade helps on most
        datasets this paper tested.
      </Callout>

      <KeyTakeaways
        items={[
          'Systematic RAG benchmark varying chunk size, overlap, embeddings, retrieval, reranking, and query expansion on shared QA tasks.',
          'No single chunk size wins everywhere — test 256, 512, and 1024 tokens on your corpus; ~10% overlap is a sensible default.',
          'Hybrid (dense + BM25) consistently beat dense-only; cross-encoder reranking reliably improved top-k precision.',
          'HyDE and multi-query help mainly on short or vague queries, with added latency and cost.',
          'Treat the paper as a tuning playbook: change one knob, measure end-to-end answers, keep what works on your data.',
        ]}
      />
    </LessonArticle>
  )
}
