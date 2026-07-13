import {
  Callout,
  ContentStep,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
  ResearchPaperHeader,
} from '../../../../../../components/content'

const PAPER_URL = 'https://arxiv.org/abs/2004.04906'

export function DensePassageRetrieval() {
  return (
    <LessonArticle>
      <ResearchPaperHeader
        title="Dense Passage Retrieval for Open-Domain Question Answering"
        authors="Karpukhin et al. (Facebook AI Research)"
        year="2020"
        url={PAPER_URL}
      >
        Showed that <strong className="text-white">embedding-based retrieval</strong> dramatically outperforms
        traditional keyword search (BM25) for finding relevant passages in open-domain QA.
      </ResearchPaperHeader>

      <Callout variant="beginner" title="Read this after">
        Read <em>What Are Embeddings?</em>, <em>Dense vs Sparse</em>, and <em>Retrieval Methods</em> first. DPR
        is the retrieval engine behind the original RAG paper and the ancestor of every vector-store retriever
        you will build.
      </Callout>

      <LessonSection title="What this paper means in plain English">
        <p>
          You run a help desk. A customer asks "How do I get my money back?" Your knowledge base has a page
          titled "Return and Refund Policy" that says "We offer a full money-back guarantee within 30 days." A
          keyword search for "money back" might miss this page because the exact phrase does not appear — the
          page says "money-back guarantee" and "refund policy" instead. The customer gets no answer. This is the
          everyday failure of keyword search, and it is exactly what DPR fixed.
        </p>
        <p>
          DPR trains two neural networks — a <strong className="text-white">question encoder</strong> and a{' '}
          <strong className="text-white">passage encoder</strong> — to map text into the same vector space. A
          relevant passage ends up close to its question, like pins on a map where related items cluster together.
          At search time, you encode the question, compare it against pre-stored passage vectors, and grab the
          nearest ones. No keyword matching required — the model understands that "money back" and "refund policy"
          mean similar things because it learned from thousands of question-answer training examples.
        </p>
        <p>
          Think of it as hiring a librarian who understands what you <em>mean</em>, not just what words you
          typed. This bi-encoder pattern — encode query and documents separately, compare later — is exactly how
          Pinecone, Qdrant, Weaviate, and every vector database retrieval pipeline works today. DPR proved it
          beats the decades-old keyword standard (BM25) by a wide margin, and Lewis et al. chose it as the
          retriever for the original RAG paper.
        </p>
      </LessonSection>

      <LessonSection title="The problem before this paper">
        <p>
          Open-domain question answering — answering any question using a large document collection like Wikipedia
          — relied on <strong className="text-white">BM25</strong> for retrieval. BM25 is a keyword ranking
          function: it counts how often query words appear in a document, with bonuses for rare words and
          penalties for very long documents. It is fast, interpretable, and requires no training. But it is
          fundamentally lexical — it matches surface forms of words, not meanings.
        </p>
        <p>
          BM25 fails on semantic mismatches. A question about "refund policy" will not find a passage about
          "money-back guarantee." A question using "automobile" will miss passages that say "car." A question
          in casual language ("who started Stripe?") may miss formal Wikipedia prose ("founded by Patrick
          Collison"). These are not edge cases — they are the majority of real user queries.
        </p>
        <p>
          Researchers had tried using BERT for retrieval, but the standard approach — cross-encoding question
          and passage together — was too slow for searching millions of documents. What was needed was a fast
          bi-encoder (like Sentence-BERT) specifically trained for question-passage matching. Karpukhin et al.
          built exactly that, showed it crushed BM25 on standard benchmarks, and established the embed-offline /
          search-online workflow that defines modern RAG retrieval.
        </p>
      </LessonSection>

      <LessonSection title="Architecture overview">
        <Flowchart
          title="DPR dual-encoder retrieval pipeline"
          chart={`flowchart TB
  subgraph training ["Training (contrastive learning)"]
    QTR["Question: 'Who founded Stripe?'"] --> QE[Question encoder<br/>BERT-based]
    PTR["Positive passage<br/>(contains answer)"] --> PE[Passage encoder<br/>BERT-based]
    NEG["Negative passages<br/>(in-batch + hard negatives)"] --> PE
    QE --> SIM[Similarity = dot product]
    PE --> SIM
    SIM --> LOSS[Contrastive loss<br/>maximise positive, minimise negatives]
  end
  subgraph inference ["Inference (offline index + online search)"]
    DOCS[All Wikipedia passages] --> PE2[Passage encoder]
    PE2 --> IDX[(Vector index<br/>21M passage vectors)]
    QNEW[New question] --> QE2[Question encoder]
    QE2 --> SEARCH[Nearest-neighbour search<br/>top-k by dot product]
    IDX -.-> SEARCH
    SEARCH --> TOP[Top-k relevant passages]
  end`}
        />
        <p className="mt-4 text-slate-300">
          Two separate BERT encoders — one for questions, one for passages — map text into the same 768-dimensional
          space. Relevance is measured by dot product. Passages are pre-encoded offline; only the question is
          encoded at query time.
        </p>
      </LessonSection>

      <LessonSection title="How it works — step by step">
        <ContentStep number={1} title="Two independent BERT encoders">
          <p>
            DPR uses two BERT-base encoders that do <em>not</em> share weights: a{' '}
            <strong className="text-white">question encoder</strong> (EQ) and a{' '}
            <strong className="text-white">passage encoder</strong> (EP). Each maps input text to a single
            768-dimensional vector — the [CLS] token's representation. Questions and passages live in the same
            vector space, so their dot product indicates relevance.
          </p>
          <p className="mt-2 text-slate-400">
            <strong className="text-white">Concrete example:</strong> EQ("Who founded Stripe?") → vector q.
            EP("Stripe was founded by Patrick and John Collison in 2010") → vector p. The dot product q · p is
            high because this passage answers the question.
          </p>
        </ContentStep>

        <ContentStep number={2} title="Contrastive training with positive and negative pairs">
          <p>
            DPR is trained on question-passage pairs from QA datasets (Natural Questions, TriviaQA). For each
            question, one passage contains the answer — this is the <strong className="text-white">positive</strong>.
            All other passages in the training batch are <strong className="text-white">negatives</strong>. The
            training objective (contrastive loss / negative log-likelihood) maximises the similarity between the
            question and its positive passage while minimising similarity to all negatives.
          </p>
        </ContentStep>

        <ContentStep number={3} title="In-batch negatives — free training signal">
          <p>
            A clever efficiency trick: in a training batch of B question-passage pairs, every other passage in
            the batch serves as a negative for every question. With batch size 128, each question gets 127 free
            negatives at no extra cost. This is called <strong className="text-white">in-batch negatives</strong>{' '}
            and is now standard practice in dual-encoder training (used by SBERT, E5, BGE, and others).
          </p>
          <p className="mt-2 text-slate-400">
            <strong className="text-white">Example:</strong> in a batch of 128 questions, question #1's positive
            is passage #1. Passages #2 through #128 are negatives for question #1. The model learns to distinguish
            the one correct passage from 127 distractors.
          </p>
        </ContentStep>

        <ContentStep number={4} title="Hard negative mining — the hard cases">
          <p>
            In-batch negatives are mostly easy (random passages are obviously irrelevant). DPR also uses{' '}
            <strong className="text-white">hard negatives</strong>: passages that BM25 ranks highly for a question
            but do not actually contain the answer. These are confusing cases — the passage looks relevant by
            keywords but is not — and training on them teaches the model to go beyond surface word overlap.
          </p>
        </ContentStep>

        <ContentStep number={5} title="Offline indexing — embed all passages once">
          <p>
            After training, every passage in the corpus (21 million Wikipedia passages in the paper) is encoded
            by EP and stored as a vector. This is the <strong className="text-white">offline indexing</strong>{' '}
            step — expensive, but done once. The vectors are stored in a search index supporting fast approximate
            nearest-neighbour lookup (via FAISS or similar).
          </p>
        </ContentStep>

        <ContentStep number={6} title="Online search — encode question, find nearest passages">
          <p>
            At query time, only the question is encoded by EQ (one forward pass). The question vector is compared
            against all stored passage vectors via dot product, and the top-k highest-scoring passages are
            returned. This takes milliseconds with optimised index structures — compared to seconds or minutes
            with cross-encoder approaches that must score each passage individually.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="What the researchers tested">
        <p>
          Karpukhin et al. evaluated DPR on open-domain QA retrieval — the task of finding passages that contain
          the answer to a question, from a corpus of millions of Wikipedia articles.
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Natural Questions (NQ)</strong> — real Google search queries paired
            with Wikipedia articles containing answers. The primary benchmark.
          </li>
          <li>
            <strong className="text-white">TriviaQA</strong> — trivia questions requiring diverse factual knowledge.
          </li>
          <li>
            <strong className="text-white">Retrieval accuracy at top-k</strong> — did any of the top-k retrieved
            passages contain the correct answer? Measured at k=20 and k=100.
          </li>
          <li>
            <strong className="text-white">BM25 baseline</strong> — the decades-old keyword retrieval standard,
            using the same Wikipedia corpus and evaluation protocol.
          </li>
          <li>
            <strong className="text-white">Ablations</strong> — effect of in-batch negatives alone vs adding hard
            negatives, single vs multi-dataset training, and comparison to ORQA (a concurrent dense retrieval
            approach).
          </li>
        </ul>
      </LessonSection>

      <LessonSection title="Key results — what they found">
        <p>
          DPR dramatically outperformed BM25. On Natural Questions,{' '}
          <strong className="text-white">top-20 retrieval accuracy</strong> (did the correct passage appear in
          the top 20 results?) was <strong className="text-white">78.4%</strong> for DPR versus{' '}
          <strong className="text-white">59.1%</strong> for BM25 — a <strong className="text-white">19.3
          percentage point</strong> absolute improvement. On TriviaQA, DPR achieved 79.4% top-20 accuracy
          compared to BM25's 66.9% — a 12.5 point gain. These are not incremental tweaks; DPR found the correct
          passage in roughly 4 out of 5 questions where BM25 succeeded only 3 out of 5.
        </p>
        <p>
          Hard negative mining was critical. DPR with only in-batch negatives scored 68.5% on NQ top-20 — better
          than BM25 but not by much. Adding BM25-mined hard negatives pushed it to 78.4%. The model needed to
          see confusing, keyword-overlapping but incorrect passages during training to learn true semantic relevance
          rather than surface word matching.
        </p>
        <p>
          DPR became the retriever of choice for subsequent systems. Lewis et al. used it in the original RAG
          paper. Izacard and Grave used it in FiD. The embed-offline / search-online pattern — encode all
          documents once, encode the query at search time, retrieve by vector similarity — became the universal
          architecture for dense retrieval in RAG, recommendation, and semantic search.
        </p>
      </LessonSection>

      <LessonSection title="Limitations and what came after">
        <p>
          DPR encodes questions and passages with separate models, so there is no token-level interaction at
          retrieval time — less accurate than cross-encoders for reranking. Production systems often use DPR-style
          bi-encoders for fast first-stage retrieval (top-100) and cross-encoders for precise second-stage
          reranking (top-5). DPR also requires training data of question-passage pairs, which may not exist for
          specialised domains.
        </p>
        <p>
          Later models improved on DPR's recipe: <strong className="text-white">Contriever</strong> (Izacard et
          al., 2022) used unsupervised contrastive learning without labelled QA pairs.{' '}
          <strong className="text-white">BGE</strong> and <strong className="text-white">E5</strong> scaled
          training data and model size. <strong className="text-white">ColBERT</strong> introduced late
          interaction (token-level matching with pre-computed vectors) for a middle ground between bi-encoder
          speed and cross-encoder accuracy.
        </p>
        <p>
          Hybrid retrieval — combining DPR-style dense search with BM25 keyword search — became standard practice.
          Dense retrieval catches semantic matches BM25 misses; BM25 catches exact entity names and rare terms
          that dense models sometimes overlook. The Retrieval Methods and Hybrid Search lessons in this course
          cover these production patterns built on DPR's foundation.
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
                  'DPR maps questions and passages to 768-dim vectors — the same embedding principle taught in that lesson',
                ],
                [
                  'Dense vs Sparse',
                  'DPR is the dense approach; BM25 is the sparse baseline it beat — read both to understand when to use each',
                ],
                [
                  'Retrieval Methods',
                  'DPR\'s offline indexing + online nearest-neighbour search is the core retrieval method in modern RAG',
                ],
                [
                  'Bi-Encoders and Cross-Encoders',
                  'DPR is a bi-encoder; production systems often add a cross-encoder reranker on top of DPR\'s first-stage results',
                ],
                [
                  'RAG (Lewis et al. paper)',
                  'DPR was the retriever Lewis et al. plugged into RAG — this paper explains the search half of that system',
                ],
                [
                  'Hybrid Search and RRF',
                  'Combining DPR dense retrieval with BM25 sparse retrieval is the hybrid pattern this paper\'s results motivate',
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
        DPR proved that meaning-based search beats keyword search for finding answers. The pattern — embed all
        documents once, embed the query at search time, grab the closest matches — is the core of every RAG
        retriever you will build. When someone says "vector search," this is what they mean.
      </Callout>

      <KeyTakeaways
        items={[
          'DPR uses dual BERT encoders — one for questions, one for passages — mapping both into the same 768-dim vector space.',
          'Trained with contrastive loss: in-batch negatives (free) plus BM25-mined hard negatives (confusing cases).',
          'Outperformed BM25 by 9–19 percentage points on top-20 retrieval accuracy — 78.4% vs 59.1% on Natural Questions.',
          'Offline indexing (embed all passages once) + online nearest-neighbour search — the modern vector store pattern.',
          'Used as the retriever in the original RAG paper; ancestor of all dense retrieval in production RAG systems today.',
        ]}
      />
    </LessonArticle>
  )
}
