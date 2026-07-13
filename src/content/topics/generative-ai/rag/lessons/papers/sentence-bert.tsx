import {
  Callout,
  ContentStep,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
  ResearchPaperHeader,
} from '../../../../../../components/content'

const PAPER_URL = 'https://arxiv.org/abs/1908.10084'

export function SentenceBert() {
  return (
    <LessonArticle>
      <ResearchPaperHeader
        title="Sentence-BERT: Sentence Embeddings using Siamese BERT-Networks"
        authors="Reimers & Gurevych (TU Darmstadt)"
        year="2019"
        url={PAPER_URL}
      >
        The paper that made <strong className="text-white">sentence-level embeddings</strong> practical — Siamese
        networks that map sentences to vectors where similarity equals semantic relatedness.
      </ResearchPaperHeader>

      <Callout variant="beginner" title="Read this after">
        Read <em>What Are Embeddings?</em> and <em>Dense vs Sparse</em> first. Sentence-BERT is the foundation
        of the entire open-source embedding ecosystem — BGE, E5, MiniLM, and every vector database retriever
        traces back to this paper.
      </Callout>

      <LessonSection title="What this paper means in plain English">
        <p>
          Imagine you run a customer support desk with 100,000 past tickets. A new ticket arrives: "My refund
          hasn't arrived yet." You want to find similar past tickets instantly — not by matching exact keywords,
          but by meaning. You need a way to turn every sentence into a single number-vector such that similar
          meanings end up close together in vector space. That is the problem Sentence-BERT solved.
        </p>
        <p>
          Regular BERT was not built for this. If you feed BERT the sentence "I want a refund" on its own, you
          get one vector per token — 768 numbers per word, not one vector for the whole sentence. Worse, the
          same sentence gets different vectors depending on what text comes before it (BERT is contextual). You
          cannot store a ticket's vector today and compare it to tomorrow's query because the vectors are not
          fixed or comparable across inputs.
        </p>
        <p>
          Sentence-BERT fixes this with <strong className="text-white">Siamese networks</strong> — two identical
          copies of BERT sharing the same weights. Sentence A goes through one copy, sentence B through the other.
          Each output is compressed into one fixed-size vector via pooling. Now you can compare them with cosine
          similarity — a single number from -1 to 1 measuring how aligned two meanings are. Embed all 100,000
          tickets once, store the vectors, and at search time just compare the new query vector to your stored
          vectors. That is <strong className="text-white">10,000× faster</strong> than running BERT on every
          possible pair. This paper is why the sentence-transformers library exists and why RAG retrieval is
          practical at all.
        </p>
      </LessonSection>

      <LessonSection title="The problem before this paper">
        <p>
          Before Sentence-BERT, finding semantically similar sentences required a painfully slow approach called{' '}
          <strong className="text-white">cross-encoding</strong>. You concatenate both sentences into one input —
          "[CLS] sentence A [SEP] sentence B [SEP]" — and feed them through BERT together. BERT's attention layers
          let every word in A interact with every word in B, producing a highly accurate similarity score. But
          you must run this full forward pass for <em>every pair</em> you want to compare.
        </p>
        <p>
          For 10,000 sentences, finding the most similar pair means 10,000 × 9,999 / 2 = ~50 million BERT
          forward passes. At ~100ms each, that takes over 58 days on a single GPU. Even finding the best match
          for one query against 10,000 candidates requires 10,000 forward passes (~17 minutes). Completely
          impractical for search, clustering, or retrieval at any real-world scale.
        </p>
        <p>
          What was needed was a <strong className="text-white">bi-encoder</strong> approach: encode each sentence
          independently into a fixed vector, then compare vectors with a cheap dot product or cosine similarity.
          But raw BERT outputs were not suitable — they were contextual, per-token, and not trained for similarity.
          Reimers and Gurevych showed how to fine-tune BERT with Siamese and triplet networks to produce
          high-quality sentence embeddings that could be pre-computed and compared in milliseconds.
        </p>
      </LessonSection>

      <LessonSection title="Architecture overview">
        <Flowchart
          title="Sentence-BERT Siamese architecture"
          chart={`flowchart TB
  SA["Sentence A<br/>'I want a refund'"] --> BERT1[BERT encoder<br/>shared weights]
  SB["Sentence B<br/>'Where is my money back?'"] --> BERT2[BERT encoder<br/>shared weights]
  BERT1 --> POOL1[Pooling<br/>mean / CLS / max]
  BERT2 --> POOL2[Pooling<br/>mean / CLS / max]
  POOL1 --> VA["Vector A<br/>(768-dim)"]
  POOL2 --> VB["Vector B<br/>(768-dim)"]
  VA --> SIM["Cosine similarity<br/>score: 0.87 (similar)"]
  VB --> SIM
  subgraph offline ["Offline — embed once"]
    DOC[All documents] --> BERT1
    BERT1 --> VDB[(Vector database)]
  end
  subgraph online ["Online — search"]
    Q[Query] --> BERT2
    BERT2 --> SEARCH[Compare to stored vectors]
    VDB -.-> SEARCH
  end`}
        />
        <p className="mt-4 text-slate-300">
          The two BERT copies share identical weights (Siamese = "twin"). Pooling collapses per-token vectors into
          one sentence vector. Documents are embedded offline; only the query is encoded at search time.
        </p>
      </LessonSection>

      <LessonSection title="How it works — step by step">
        <ContentStep number={1} title="Siamese BERT — twin networks with shared weights">
          <p>
            Sentence-BERT uses two BERT models with <strong className="text-white">identical, shared weights</strong>.
            Sentence A is fed through BERT copy 1; sentence B through copy 2. Because weights are tied, both
            sentences are mapped into the same vector space. This is the "Siamese" architecture — like identical
            twins who process different inputs using the same brain.
          </p>
          <p className="mt-2 text-slate-400">
            <strong className="text-white">Concrete example:</strong> "I want a refund" goes through BERT copy 1.
            "Where is my money back?" goes through copy 2. Both produce sequences of 768-dimensional token
            vectors. The next step collapses each sequence into one vector.
          </p>
        </ContentStep>

        <ContentStep number={2} title="Pooling — from token vectors to one sentence vector">
          <p>
            BERT outputs one vector per token. Sentence-BERT applies a <strong className="text-white">pooling</strong>{' '}
            operation to get a single fixed-size representation:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-400">
            <li><strong className="text-white">Mean pooling</strong> — average all token vectors. Simple, effective, became the default.</li>
            <li><strong className="text-white">CLS pooling</strong> — use only the [CLS] token's vector (BERT's classification token).</li>
            <li><strong className="text-white">Max pooling</strong> — take the maximum value across tokens for each dimension.</li>
          </ul>
          <p className="mt-2 text-slate-400">
            Mean pooling won in most benchmarks. The result: one 768-dimensional vector per sentence, regardless
            of sentence length.
          </p>
        </ContentStep>

        <ContentStep number={3} title="Training with labelled sentence pairs">
          <p>
            Sentence-BERT is fine-tuned on datasets of sentence pairs with similarity labels. The{' '}
            <strong className="text-white">Siamese network with cosine similarity loss</strong> pulls similar
            pairs together and pushes dissimilar pairs apart in vector space:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-400">
            <li><strong className="text-white">Paraphrase pairs</strong> (similar) — "I want a refund" / "Where is my money back?" → vectors should be close.</li>
            <li><strong className="text-white">Entailment pairs</strong> (similar) — "A man is playing guitar" / "A person is performing music" → close.</li>
            <li><strong className="text-white">Contradiction/unrelated pairs</strong> (dissimilar) — "I want a refund" / "The weather is sunny" → vectors should be far apart.</li>
          </ul>
        </ContentStep>

        <ContentStep number={4} title="Triplet loss — anchor, positive, negative">
          <p>
            An alternative training strategy uses <strong className="text-white">triplet networks</strong>: given
            an anchor sentence, a positive (similar) sentence, and a negative (dissimilar) sentence, the loss
            pushes the anchor closer to the positive than to the negative by at least a margin. This is especially
            effective for fine-grained semantic distinctions.
          </p>
          <p className="mt-2 text-slate-400">
            <strong className="text-white">Example triplet:</strong> anchor = "How do I reset my password?", positive
            = "I forgot my login credentials", negative = "What are your business hours?" The model learns that
            password questions are semantically closer to credential questions than to hours questions.
          </p>
        </ContentStep>

        <ContentStep number={5} title="Embed once, search fast">
          <p>
            After training, the workflow is: embed all documents offline (one forward pass each), store vectors
            in a database. At query time, embed the query (one forward pass), compute cosine similarity against
            all stored vectors (milliseconds with approximate nearest-neighbour search). Total: 1 + N cheap
            comparisons instead of N expensive cross-encoder passes.
          </p>
        </ContentStep>

        <ContentStep number={6} title="sentence-transformers library">
          <p>
            Reimers and Gurevych released the <strong className="text-white">sentence-transformers</strong> Python
            library alongside the paper. It provides pre-trained SBERT models, easy fine-tuning on custom datasets,
            and integration with vector databases. Models like all-MiniLM-L6-v2, all-mpnet-base-v2, and later BGE
            and E5 all build on this foundation. It remains the standard tool for open-source embedding models.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="What the researchers tested">
        <p>
          Reimers and Gurevych evaluated Sentence-BERT on a wide range of semantic similarity tasks and compared
          against cross-encoder baselines and other sentence embedding methods.
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Semantic Textual Similarity (STS)</strong> — benchmark where models
            score how similar two sentences are on a 0-5 scale. SBERT fine-tuned on STS data achieved Spearman
            correlation above 0.84.
          </li>
          <li>
            <strong className="text-white">Paraphrase detection</strong> — Microsoft Research Paraphrase Corpus
            and PAWS dataset. SBERT had to distinguish true paraphrases from adversarially similar non-paraphrases.
          </li>
          <li>
            <strong className="text-white">Clustering</strong> — group sentences by topic. SBERT embeddings
            produced coherent clusters without any task-specific training on the clustering data.
          </li>
          <li>
            <strong className="text-white">Speed benchmark</strong> — the headline result: finding the most
            similar pair among 10,000 sentences took ~5 seconds with SBERT versus ~65 hours with a cross-encoder.
            That is the ~10,000× speedup.
          </li>
          <li>
            <strong className="text-white">Pooling strategy ablation</strong> — compared mean, max, and CLS
            pooling to determine the best way to collapse token vectors into sentence vectors.
          </li>
        </ul>
      </LessonSection>

      <LessonSection title="Key results — what they found">
        <p>
          The speed result was the game-changer: Sentence-BERT reduced semantic similarity search from hours to
          seconds. Finding the most similar sentence among 10,000 candidates dropped from ~65 hours (cross-encoder)
          to ~5 seconds (bi-encoder with pre-computed vectors). For a single query against 10,000 documents,
          search time went from ~17 minutes to under 1 second. This made semantic search feasible at production
          scale for the first time.
        </p>
        <p>
          On quality, SBERT came remarkably close to cross-encoders despite being much faster. On STS benchmarks,
          fine-tuned SBERT models achieved Spearman correlations of{' '}
          <strong className="text-white">0.84–0.87</strong>, compared to ~0.87 for cross-encoders. You sacrifice
          a small amount of accuracy for a 10,000× speed improvement — a trade-off every production RAG system
          makes.
        </p>
        <p>
          The sentence-transformers library democratised access to quality embeddings. Before SBERT, building a
          semantic search system required deep NLP expertise. After SBERT, three lines of Python could embed
          documents and find similar ones. This directly enabled the vector database ecosystem (Pinecone, Qdrant,
          Weaviate, Chroma) and every open-source embedding model that followed — BGE, E5, GTE, Instructor, and
          dozens more all use the same Siamese fine-tuning recipe.
        </p>
      </LessonSection>

      <LessonSection title="Limitations and what came after">
        <p>
          Bi-encoders are less accurate than cross-encoders because sentences are encoded independently — no
          token-level interaction at comparison time. For high-stakes reranking (picking the best 5 from 100
          candidates), a cross-encoder second stage is still common. SBERT also inherits BERT's 512-token limit;
          long documents must be chunked before embedding.
        </p>
        <p>
          Mean pooling is a simple heuristic that throws away word order information. Later models improved on
          SBERT with better architectures: <strong className="text-white">E5</strong> (Microsoft, 2022) added
          instruction prefixes ("query:" vs "passage:"), <strong className="text-white">BGE</strong> (BAAI, 2023)
          used harder negatives and larger training data, and <strong className="text-white">GTE</strong> scaled
          to longer contexts. But all follow the same bi-encoder pattern SBERT established.
        </p>
        <p>
          For RAG specifically, DPR (Karpukhin et al., 2020) adapted the dual-encoder idea for question-passage
          matching rather than sentence-sentence similarity. The principle is identical: encode query and documents
          separately, compare via dot product, retrieve the closest. SBERT is the general-purpose foundation; DPR
          is the QA-specialised descendant.
        </p>
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
                  'What Are Embeddings?',
                  'SBERT\'s pooling step — collapsing token vectors into one sentence vector — is the core technique taught in that lesson',
                ],
                [
                  'Dense vs Sparse',
                  'SBERT is the dense approach: meaning-based vectors compared by cosine similarity, not keyword matching',
                ],
                [
                  'Open-Source Embeddings',
                  'BGE, E5, MiniLM all build on the sentence-transformers library and Siamese fine-tuning recipe that SBERT created',
                ],
                [
                  'Bi-Encoders and Cross-Encoders',
                  'SBERT is the canonical bi-encoder — this paper is the reason that lesson exists',
                ],
                [
                  'Dense Passage Retrieval (DPR paper)',
                  'DPR\'s dual-encoder architecture is SBERT\'s question-passage variant — same embed-separately-compare-later pattern',
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
        Sentence-BERT made semantic search fast: embed your documents once, store the vectors, then find similar
        ones with a simple comparison at query time. Every open-source embedding model and every vector database
        retriever in RAG traces back to this Siamese bi-encoder idea.
      </Callout>

      <KeyTakeaways
        items={[
          'BERT alone cannot produce comparable sentence vectors — SBERT fixes this with Siamese twin networks and pooling.',
          'Mean pooling (averaging token vectors) became the standard way to collapse a sentence into one fixed-size embedding.',
          '10,000× faster than cross-encoding every sentence pair — embed once, compare with cosine similarity at search time.',
          'Released the sentence-transformers library — still the standard tool for open-source embeddings (BGE, E5, MiniLM).',
          'Foundation of all bi-encoder retrieval: DPR, modern embedding models, and every vector database pipeline build on this pattern.',
        ]}
      />
    </LessonArticle>
  )
}
