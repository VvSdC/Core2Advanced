import {
  Callout,
  ContentStep,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
  ResearchPaperHeader,
} from '../../../../../../components/content'

const PAPER_URL = 'https://arxiv.org/abs/2212.10496'

export function HydeZeroShotRetrieval() {
  return (
    <LessonArticle>
      <ResearchPaperHeader
        title="Precise Zero-Shot Dense Retrieval without Relevance Labels"
        authors="Gao et al. (Princeton)"
        year="2022"
        venue="HyDE"
        url={PAPER_URL}
      >
        <strong className="text-white">HyDE</strong> — use an LLM to generate a hypothetical answer, then embed
        <em> that</em> for retrieval. Bridges the gap between short queries and long document chunks without
        any relevance labels for training.
      </ResearchPaperHeader>

      <Callout variant="beginner" title="Read this after">
        Read <em>Advanced Retrieval Strategies</em> and <em>Dense Retrieval</em> first. HyDE is the research
        paper behind the HyDE technique taught in those lessons — this walkthrough explains exactly what the
        researchers did and why it works.
      </Callout>

      <LessonSection title="What this paper means in plain English">
        <p>
          Imagine you walk into a library and ask the librarian: "refund policy?" That is three words. But every
          book on the shelf is written as full paragraphs — long, formal, declarative sentences like "Customers may
          request a full refund within thirty days of purchase if the item remains unused." A search system that
          compares your three-word question directly to those paragraphs has a problem: they do not look alike.
          Not in length, not in style, and often not even in the same region of <em>embedding space</em> (the
          multi-dimensional map where similar meanings sit close together).
        </p>
        <p>
          This paper, called <strong className="text-white">HyDE</strong> (Hypothetical Document Embeddings), asks
          a clever question: what if we stop embedding the raw query and instead embed something that <em>looks
          like</em> a real document? The researchers feed the user's short question to a large language model and
          ask it to write a <em>hypothetical answer</em> — a fake paragraph that reads like something you might
          actually find in your knowledge base. That paragraph might contain wrong facts (it is hallucinated),
          but that does not matter for search. What matters is that it has the same <em>shape</em> as your stored
          chunks: full sentences, explanatory tone, enough context to land near the right passages when embedded.
        </p>
        <p>
          The hypothetical document is never shown to the user. It is a search bridge only. The system embeds the
          fake answer, runs vector search against your real index, retrieves actual documents, and then generates
          the final response from those real sources. Think of it as asking a friend "what would the answer
          probably say?" and then searching your files for passages that match that guess. The friend might get
          details wrong, but the <em>topic and style</em> of their guess points you to the right shelf.
        </p>
        <p>
          The "zero-shot" part is important. Most retrieval systems need thousands of labelled examples — pairs
          of (question, correct document) — to train well on a new domain. HyDE needs none of that. You can point
          it at legal documents, medical notes, or internal wikis on day one, as long as you have a general
          LLM and an embedding model. The paper showed this works across eleven different datasets without any
          domain-specific fine-tuning.
        </p>
      </LessonSection>

      <LessonSection title="The problem before this paper">
        <p>
          Before HyDE, dense retrieval (meaning-based search with embeddings) had a well-known weakness called{' '}
          <strong className="text-white">query-document asymmetry</strong>. Embedding models are typically trained
          on pairs where a short question is matched to a longer passage. In practice, real user queries are often
          even shorter and messier than training data — typos, keywords, half-formed thoughts. Stored documents,
          meanwhile, are chunked into 200–500 token paragraphs of formal prose.
        </p>
        <p>
          A bi-encoder (the standard dense retrieval setup) compresses the entire query into one vector and the
          entire document into one vector, then measures distance between them. When the query is three words and
          the document is two hundred, those two vectors live in different "neighbourhoods" of embedding space.
          The query vector for "refund policy?" might sit near other short questions, while the correct passage
          vector sits near other explanatory paragraphs — and they never meet.
        </p>
        <p>
          Existing fixes each had trade-offs. <strong className="text-white">Query expansion</strong> adds
          synonyms or related terms, but still produces short text. <strong className="text-white">Cross-encoders</strong>{' '}
          read query and document together for accurate scoring, but are far too slow to run on millions of
          documents. <strong className="text-white">Fine-tuning</strong> on domain-specific labelled data works,
          but collecting relevance labels is expensive and must be repeated for every new corpus. HyDE proposed
          a fourth path: use generation to fix the format mismatch, with no labels required.
        </p>
      </LessonSection>

      <LessonSection title="HyDE pipeline at a glance">
        <Flowchart
          title="From short query to relevant chunks"
          chart={`flowchart TB
  A[User query: short question] --> B[LLM generates hypothetical document]
  B --> C[Embed the hypothetical — not the raw query]
  C --> D[Vector search against real document index]
  D --> E[Retrieve top-k real passages]
  E --> F[LLM generates final answer from real context]
  B -.->|never shown to user| G[Hallucinated bridge only]`}
        />
        <p className="mt-4 text-slate-300">
          The dashed line in the diagram is the key insight: the hypothetical document exists only inside the
          retrieval step. Users always see answers grounded in real retrieved passages.
        </p>
      </LessonSection>

      <LessonSection title="How it works — step by step">
        <ContentStep number={1} title="Take the user's query as input">
          <p>
            A user asks something short or vague — for example, "how do I return a defective product?" or even
            just "returns?" The system does <em>not</em> embed this query directly. That is the whole point of
            HyDE: the raw query is the wrong shape for comparison against document chunks.
          </p>
        </ContentStep>

        <ContentStep number={2} title="Prompt an LLM to write a hypothetical document">
          <p>
            The researchers use an instruction-tuned LLM (in their experiments, InstructGPT / GPT-3 variants)
            with a simple prompt: given this question, write a passage that would answer it. The model produces
            a paragraph of fluent, declarative prose — the same style as Wikipedia articles or help-centre docs.
          </p>
          <p className="mt-2">
            This paragraph may contain fabricated facts. The paper explicitly treats it as a <em>hypothesis</em>,
            not ground truth. A hypothetical answer to "Who discovered penicillin?" might correctly name Alexander
            Fleming, or it might hallucinate a date — either way, the paragraph's embedding tends to land near
            real passages about penicillin because it discusses the same topic in the same writing style.
          </p>
        </ContentStep>

        <ContentStep number={3} title="Embed the hypothetical document">
          <p>
            The hypothetical paragraph is passed through a <em>document encoder</em> (not the query encoder) from
            a standard dense retrieval model like Contriever or ANCE. This is a deliberate choice: the fake
            passage looks like a document, so it should be embedded with the document pathway.
          </p>
          <p className="mt-2">
            The result is a single vector (or, in some variants, multiple vectors) that sits much closer to real
            document chunks in embedding space than the original short query would have.
          </p>
        </ContentStep>

        <ContentStep number={4} title="Search the real index">
          <p>
            That vector is compared against pre-computed embeddings of all real documents in the corpus using
            standard approximate nearest-neighbour search (the same FAISS or HNSW machinery from your vector
            store lessons). The top-k closest <em>real</em> passages are retrieved.
          </p>
        </ContentStep>

        <ContentStep number={5} title="Optional: generate multiple hypotheses">
          <p>
            The paper also experiments with sampling multiple hypothetical documents from the LLM (different
            random completions) and averaging their embeddings, or retrieving against each and merging results.
            Multiple hypotheses can cover more angles of ambiguous queries, at the cost of more LLM calls.
          </p>
        </ContentStep>

        <ContentStep number={6} title="Generate the final answer from real context">
          <p>
            Retrieved passages are fed to a separate generator (or the same LLM in a RAG prompt) to produce the
            user-facing answer. Because the final step uses real documents, hallucinations from the hypothetical
            bridge do not propagate to the user — unless retrieval itself fails to find good passages.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="What the researchers tested">
        <p>
          The authors evaluated HyDE on <strong className="text-white">eleven retrieval benchmarks</strong>{' '}
          spanning diverse domains — open-domain QA (Natural Questions, TriviaQA, Web Questions), fact
          verification (FEVER), and specialised corpora (SciFact, ArguAna, DBPedia, and others). None of these
          evaluations used relevance labels to train HyDE itself.
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Embedding models tested</strong> — Contriever, ANCE, and other
            off-the-shelf dense retrievers, all used zero-shot (no fine-tuning on the target dataset).
          </li>
          <li>
            <strong className="text-white">LLM for hypothesis generation</strong> — InstructGPT variants of
            GPT-3, generating one or multiple hypothetical documents per query.
          </li>
          <li>
            <strong className="text-white">Baselines compared against</strong> — standard dense retrieval
            (embed the raw query), BM25 keyword search, and fine-tuned dense retrievers that <em>did</em> use
            relevance labels (representing the expensive supervised upper bound).
          </li>
          <li>
            <strong className="text-white">Metrics</strong> — nDCG@10, Recall@k, and MRR@10 (standard ranking
            metrics measuring whether the correct passage appears high in the retrieved list).
          </li>
          <li>
            <strong className="text-white">Query types</strong> — they specifically analysed performance on
            ambiguous, underspecified, and short queries where standard dense retrieval struggles most.
          </li>
        </ul>
      </LessonSection>

      <LessonSection title="Key results — what they found">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Large gains on zero-shot dense retrieval.</strong> HyDE improved
            retrieval quality across most of the eleven datasets, often closing much of the gap between zero-shot
            and supervised fine-tuned retrievers — without any labelled training data.
          </li>
          <li>
            <strong className="text-white">Strongest on hard queries.</strong> The technique shone brightest when
            queries were short, vague, or ambiguous — exactly the cases where query-document asymmetry hurts most.
            A keyword-like query that would have missed the right chunk often succeeded after HyDE rewriting.
          </li>
          <li>
            <strong className="text-white">Hypothetical text does not need to be factually correct.</strong> Even
            hallucinated details in the fake document still helped retrieval, because embedding similarity cares
            about topic and style overlap, not factual precision.
          </li>
          <li>
            <strong className="text-white">Document encoder, not query encoder.</strong> Embedding the hypothesis
            with the document-side encoder consistently beat embedding it with the query encoder — confirming
            that the fix is about making the search vector look like a document.
          </li>
          <li>
            <strong className="text-white">Cost trade-off.</strong> Every query requires at least one extra LLM
            call before search can begin. That adds latency (often 1–3 seconds) and API cost. The paper argues
            this is worthwhile for hard queries but wasteful if applied to every query indiscriminately.
          </li>
        </ul>
      </LessonSection>

      <LessonSection title="Limitations and what came after">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Latency and cost.</strong> The extra LLM generation step makes HyDE
            unsuitable as a default for every query in latency-sensitive applications. Production systems often
            use HyDE selectively — only when initial retrieval confidence is low, or for known-hard query
            patterns.
          </li>
          <li>
            <strong className="text-white">Depends on LLM quality.</strong> A weak or poorly instructed LLM
            produces vague hypothetical documents that do not bridge the gap. HyDE works best with capable
            instruction-following models.
          </li>
          <li>
            <strong className="text-white">Can retrieve confidently wrong passages.</strong> If the LLM
            hallucinates a plausible but wrong topic, the embedding may land near irrelevant documents with
            similar style. HyDE improves recall but does not guarantee precision.
          </li>
          <li>
            <strong className="text-white">Not a replacement for fine-tuning.</strong> On some datasets,
            supervised fine-tuned retrievers still won. HyDE is a strong zero-shot technique, not a universal
            ceiling-beater.
          </li>
          <li>
            <strong className="text-white">What came after.</strong> Follow-up work combined HyDE with
            reranking, hybrid sparse+dense search, and query routing (deciding per-query whether HyDE is worth
            the cost). Modern RAG frameworks like LangChain and LlamaIndex ship HyDE as an optional retrieval
            strategy. Research on <em>query rewriting</em> and <em>step-back prompting</em> explores related
            ideas — using LLMs to transform queries before search, each with different trade-offs.
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
                  'Advanced Retrieval Strategies',
                  'HyDE is the original research behind the query-expansion technique taught there — generate a fake document, embed it, search with that vector',
                ],
                [
                  'Dense Retrieval',
                  'Explains why short-query vs long-document mismatch causes dense retrieval failures, and one label-free fix',
                ],
                [
                  'What Are Embeddings?',
                  'Shows a creative workaround when query and document embeddings do not naturally align in the same region of vector space',
                ],
                [
                  'DPR paper',
                  'DPR established bi-encoder dense retrieval; HyDE patches its weakness on short or vague queries without retraining',
                ],
                [
                  'RAG Evaluation Overview',
                  'HyDE can improve retrieval recall — but you still need evaluation (like RAGAS) to confirm the final answers are faithful',
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
        When short or vague queries fail to find good chunks, do not blame your embedding model first — the query
        and your documents may simply be the wrong shape to compare. HyDE generates a fake answer paragraph that
        <em> looks like</em> your documents, embeds that, and searches with it. Use it for hard queries, not
        every query, because each one costs an extra LLM call.
      </Callout>

      <KeyTakeaways
        items={[
          'HyDE generates a hypothetical document from the query, embeds it with the document encoder, and searches with that vector.',
          'Fixes query-document length and style mismatch — the core reason short queries fail in dense retrieval.',
          'Works zero-shot across eleven datasets with no relevance labels, though supervised fine-tuning can still win on some tasks.',
          'The hallucinated bridge is never shown to users — final answers come from real retrieved passages.',
          'Extra LLM call per query adds latency and cost — deploy selectively, not as a default for every search.',
        ]}
      />
    </LessonArticle>
  )
}
