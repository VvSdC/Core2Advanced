import {
  Callout,
  ContentStep,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
  ResearchPaperHeader,
} from '../../../../../../components/content'

const PAPER_URL = 'https://arxiv.org/abs/2212.03533'

export function E5TextEmbeddings() {
  return (
    <LessonArticle>
      <ResearchPaperHeader
        title="Text Embeddings by Weakly-Supervised Contrastive Pre-training"
        authors="Wang et al. (Microsoft)"
        year="2022"
        venue="E5"
        url={PAPER_URL}
      >
        Trained embedding models on <strong className="text-white">roughly one billion text pairs</strong> mined
        from the web — producing the E5 family, one of the strongest open-source embedding lines for RAG.
      </ResearchPaperHeader>

      <Callout variant="beginner" title="Read this after">
        Read <em>Sentence-BERT</em> (the previous paper) and <em>Open-Source Embeddings</em>. Sentence-BERT
        showed <em>how</em> to build sentence vectors; E5 shows <em>how to train them at web scale</em> with
        better data and the <code className="font-mono text-sm">query:</code> /{' '}
        <code className="font-mono text-sm">passage:</code> prefix trick.
      </Callout>

      <LessonSection title="What this paper means in plain English">
        <p>
          Imagine you run a help desk and need a search box that understands questions, not just keywords. You
          need a model that turns every document chunk and every user question into a point in "meaning space,"
          so the closest points are the best matches. Before E5, teams mostly trained such models on small,
          hand-labelled datasets — a few hundred thousand question–answer pairs at best. That is like teaching
          a librarian using only one shelf of a library.
        </p>
        <p>
          The E5 team asked: what if we train on <em>automatically collected</em> pairs from the internet —
          search queries paired with clicked pages, article titles paired with bodies, paraphrases of the same
          idea — and filter out the junk? That is <strong className="text-white">weakly-supervised</strong>{' '}
          learning: the labels are noisy ("probably related") rather than perfect, but there are{' '}
          <em>billions</em> of them. Combined with <strong className="text-white">contrastive learning</strong>{' '}
          (pull matching pairs together, push non-matches apart), the model learns what "relevant" feels like
          across many domains.
        </p>
        <p>
          E5 also introduced a small but powerful convention: prepend{' '}
          <code className="font-mono text-sm">query:</code> to search questions and{' '}
          <code className="font-mono text-sm">passage:</code> to stored documents. The same underlying neural
          network handles both, but the prefix tells it which role the text plays — like stamping envelopes
          "INCOMING QUESTION" vs "FILED ANSWER" so the mail room sorts them correctly. This{' '}
          <em>asymmetric</em> setup improved retrieval accuracy by roughly 5–15% with zero extra model size.
        </p>
        <p>
          The headline result: open-source E5 models matched or beat expensive commercial embedding APIs on
          standard benchmarks — proving that scale plus smart training beats small, perfectly labelled datasets.
          If you pick an embedding model for your first RAG project, E5 (or descendants like BGE that copied
          the prefix idea) is one of the safest defaults — and this paper is the full story of why.
        </p>
      </LessonSection>

      <LessonSection title="The problem before this paper">
        <p>
          By 2022, Sentence-BERT and DPR had established the <em>architecture</em> for retrieval embeddings:
          encode queries and passages separately, compare with cosine similarity or dot product, search with a
          vector database. But most training still relied on <strong className="text-white">small supervised
          datasets</strong> — MS MARCO (roughly one million query–passage pairs), Natural Questions, NLI
          corpora. Those datasets are clean but narrow: mostly English web search or academic entailment tasks.
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Limited coverage</strong> — models trained only on MS MARCO struggle
            on legal, medical, or code documentation because they never saw those patterns during training.
          </li>
          <li>
            <strong className="text-white">Symmetric encoding</strong> — many models treated queries and
            documents identically. But a short question ("refund policy?") and a long paragraph are different
            <em> kinds</em> of text; one encoder role for both is suboptimal.
          </li>
          <li>
            <strong className="text-white">Commercial APIs led benchmarks</strong> — OpenAI's ada-002 and similar
            paid models topped leaderboards, and teams assumed open-source could not catch up without proprietary
            data.
          </li>
        </ul>
        <p className="mt-3">
          E5's bet: replace "small and perfect" with "huge and mostly right," add explicit query/passage roles,
          and let contrastive learning at scale do the rest.
        </p>
      </LessonSection>

      <LessonSection title="E5 training pipeline — overview">
        <Flowchart
          title="From raw web text to a retrieval-ready embedding model"
          chart={`flowchart TB
  A[Billions of raw web text pairs] --> B[Weak supervision filters]
  B --> C[High-quality pairs: query-page, title-body, paraphrase]
  C --> D[Add prefixes: query: or passage:]
  D --> E[Fine-tune text encoder with contrastive loss]
  E --> F[In-batch negatives: other passages in batch = wrong answers]
  F --> G[Trained E5 model]
  G --> H[Index: embed all passages with passage: prefix]
  G --> I[Search: embed user question with query: prefix]
  H --> J[Vector DB nearest-neighbour search]
  I --> J
  J --> K[Top-k relevant chunks for RAG]`}
        />
        <p className="mt-4 text-slate-300">
          The paper trains several model sizes (small, base, large; later work added E5-mistral at 7B). All
          share the same recipe: web-scale weak pairs, contrastive fine-tuning, and asymmetric prefixes at both
          index time and query time.
        </p>
      </LessonSection>

      <LessonSection title="How it works — step by step">
        <ContentStep number={1} title="Mine weakly-supervised text pairs from the web">
          <p>
            The researchers collected on the order of <strong className="text-white">one billion</strong> text
            pairs from public web sources without human annotators. Examples include: a search query paired with
            the page users clicked, a news headline paired with the article body, two sentences that paraphrase
            each other. These pairs are <em>imperfect</em> — sometimes the "match" is only loosely related —
            but automatic filters (length limits, language detection, deduplication, quality heuristics) remove
            the worst noise.
          </p>
          <p className="mt-2">
            This is the opposite of MS MARCO, where humans verified every label. Weak supervision trades label
            precision for volume, and contrastive learning at batch scale compensates for occasional bad pairs.
          </p>
        </ContentStep>

        <ContentStep number={2} title="Contrastive learning with in-batch negatives">
          <p>
            Training uses a <strong className="text-white">bi-encoder</strong> setup (same idea as DPR and
            Sentence-BERT): one forward pass embeds the query, another embeds the passage. For each positive
            pair in a training batch, every <em>other</em> passage in that batch is treated as a negative
            example. This is called <em>in-batch negatives</em> — you get thousands of "wrong answers" for free
            without labelling them.
          </p>
          <p className="mt-2">
            The loss function pushes the query vector closer to its correct passage and farther from all the
            others. At web scale, with large batches on many GPUs, the model sees an enormous variety of
            confusable wrong answers and learns sharper boundaries between relevant and irrelevant text.
          </p>
        </ContentStep>

        <ContentStep number={3} title="Asymmetric prefixes: query: vs passage:">
          <p>
            Before tokenization, every training query is prefixed with{' '}
            <code className="font-mono text-sm">query: </code> and every passage with{' '}
            <code className="font-mono text-sm">passage: </code>. The same transformer weights process both,
            but the prefix tokens shift the internal representation — the model learns two modes in one network.
          </p>
          <p className="mt-2">
            At deployment time you <strong className="text-white">must</strong> use the same prefixes: when
            building your vector index, prepend <code className="font-mono text-sm">passage:</code> to every
            chunk; when a user searches, prepend <code className="font-mono text-sm">query:</code> to their
            question. Skipping this step often costs several percentage points of retrieval accuracy for free.
          </p>
        </ContentStep>

        <ContentStep number={4} title="Optional second stage on labelled data">
          <p>
            The paper also experiments with a <em>two-stage</em> recipe: pre-train on the billion weak pairs,
            then fine-tune briefly on smaller supervised sets (MS MARCO, NLI). The weak stage provides breadth;
            the supervised stage sharpens search-specific behaviour. Even weak-only E5 models were already
            competitive — the supervised polish was icing, not the whole cake.
          </p>
        </ContentStep>

        <ContentStep number={5} title="Deploy: embed offline, search online">
          <p>
            Production RAG follows the standard vector-store pattern from DPR: encode all document chunks once
            (with <code className="font-mono text-sm">passage:</code>), store vectors in FAISS, Pinecone,
            pgvector, or similar. At query time, encode the user question (with{' '}
            <code className="font-mono text-sm">query:</code>), run approximate nearest-neighbour search, return
            top-k chunks to the LLM. E5 does not change the pipeline — it upgrades the quality of the vectors
            inside it.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="What the researchers tested">
        <p>
          The authors evaluated E5 on <strong className="text-white">BEIR</strong> (Benchmarking IR) — a
          collection of 18 diverse retrieval datasets spanning scientific papers, tweets, biomedical text,
          duplicate-question detection, and more. BEIR is deliberately <em>out-of-domain</em>: models are not
          fine-tuned on each task, so scores reflect generalisation, not memorisation.
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">BEIR nDCG@10</strong> — a ranking quality metric where 1.0 is
            perfect ordering and random guessing is near 0. Higher means the right documents appear near the top
            of the results list.
          </li>
          <li>
            <strong className="text-white">MTEB</strong> (Massive Text Embedding Benchmark) — a broader
            leaderboard covering retrieval, clustering, classification, and semantic similarity. Later E5
            variants (including E5-mistral) were evaluated here against commercial APIs.
          </li>
          <li>
            <strong className="text-white">Ablations</strong> — the paper systematically removed pieces (no
            prefixes, supervised-only training, smaller data) to show which design choices actually mattered.
          </li>
          <li>
            <strong className="text-white">Baselines</strong> — compared against BM25, DPR, Sentence-BERT
            derivatives, and OpenAI text-embedding-ada-002.
          </li>
        </ul>
      </LessonSection>

      <LessonSection title="Key results — what they found">
        <ul className="list-disc space-y-3 pl-5 text-slate-300">
          <li>
            <strong className="text-white">E5-large beat OpenAI ada-002 on BEIR average nDCG@10</strong> —
            the first widely cited proof that an open-source embedding model could outperform a popular commercial
            API on a rigorous, multi-domain benchmark. Exact numbers vary by BEIR subset, but the average gap was
            clearly in E5's favour after correct prefix usage.
          </li>
          <li>
            <strong className="text-white">Weak supervision scaled better than small supervised sets alone</strong>{' '}
            — models trained only on MS MARCO-level data plateaued on BEIR's unusual domains (e.g. medical
            queries). E5's web pairs improved robustness because the model had seen more varied writing styles
            during training.
          </li>
          <li>
            <strong className="text-white">query:/passage: prefixes gave a consistent 5–15% relative gain</strong>{' '}
            on retrieval tasks versus the same model without prefixes — one of the highest-ROI tricks in the
            entire RAG stack.
          </li>
          <li>
            <strong className="text-white">E5-mistral (7B parameters)</strong> later reached or exceeded
            commercial API scores on several MTEB retrieval tasks — showing the family scales with model size,
            not just data.
          </li>
          <li>
            <strong className="text-white">Industry adoption</strong> — BGE, GTE, and other open models adopted
            the same prefix convention, making <code className="font-mono text-sm">query:</code> /{' '}
            <code className="font-mono text-sm">passage:</code> a de facto standard in 2023–2024 RAG tutorials.
          </li>
        </ul>
      </LessonSection>

      <LessonSection title="Limitations and what came after">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Prefix sensitivity</strong> — if you forget prefixes at index or
            query time, performance drops sharply. This is easy to misconfigure in production pipelines.
          </li>
          <li>
            <strong className="text-white">English-centric training</strong> — most web pairs were English.
            Multilingual E5 variants exist, but domain-specific languages or jargon-heavy corpora may still need
            fine-tuning.
          </li>
          <li>
            <strong className="text-white">Bi-encoder ceiling</strong> — E5 encodes query and passage
            independently. Cross-encoders (e.g. ColBERT, rerankers) still beat bi-encoders on accuracy by reading
            query and document together — at the cost of speed. Production systems often use E5 for first-stage
            retrieval, then a reranker on top.
          </li>
          <li>
            <strong className="text-white">What came after</strong> — BGE and GTE extended the recipe with
            harder negatives and better fine-tuning; embedding-specific LLMs (E5-mistral, NV-Embed) pushed
            quality further; Matryoshka embeddings added flexible vector dimensions. The core E5 lessons — web
            scale, contrastive training, asymmetric prefixes — remain the template.
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
                  'Sentence-BERT',
                  'E5 inherits the bi-encoder + cosine similarity pattern SBERT popularised, but replaces small labelled sets with billion-scale weak pairs',
                ],
                [
                  'Open-Source Embeddings',
                  'E5-large-v2 is a top production default — this paper explains the query:/passage: prefix you must use with it',
                ],
                [
                  'Commercial Embedding Models',
                  'E5-large beating ada-002 showed open-source can match paid APIs without sending data to a vendor',
                ],
                [
                  'Dense vs Sparse',
                  'E5 is the dense retrieval side; pair it with BM25 hybrid search for documents heavy on exact IDs or rare terms',
                ],
                [
                  'Popular Questions',
                  'FAQ Q7 in Popular Questions walks through the query:/passage: convention introduced here',
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
        When using E5 (or BGE, which copied this trick), always prefix your query with{' '}
        <code className="font-mono text-sm">query:</code> and your documents with{' '}
        <code className="font-mono text-sm">passage:</code> — at both indexing time and search time. It costs
        nothing and is one of the largest free accuracy boosts in embedding-based RAG.
      </Callout>

      <KeyTakeaways
        items={[
          'E5 trains on ~1B weakly-supervised web pairs using contrastive learning and in-batch negatives — far more data than MS MARCO-style supervised sets.',
          'query:/passage: asymmetric prefixes tell one model whether text is a search question or a stored document; skipping them hurts retrieval badly.',
          'E5-large outperformed OpenAI ada-002 on BEIR, proving open-source embeddings can match commercial APIs for RAG retrieval.',
          'Deploy with the standard pattern: embed passages offline with passage:, embed queries online with query:, nearest-neighbour search in a vector DB.',
          'Later models (BGE, E5-mistral) extended the recipe, but web-scale contrastive pre-training plus prefixes remains the core idea.',
        ]}
      />
    </LessonArticle>
  )
}
