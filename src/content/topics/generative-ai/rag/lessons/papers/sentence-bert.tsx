import {
  Callout,
  ContentStep,
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
        networks that map sentences to vectors where similarity = semantic relatedness.
      </ResearchPaperHeader>

      <Callout variant="beginner" title="Read this after">
        Read <em>What Are Embeddings?</em> and <em>Dense vs Sparse</em> first. Sentence-BERT is the foundation
        of the entire open-source embedding ecosystem (BGE, E5, etc.).
      </Callout>

      <LessonSection title="What this paper means in plain English">
        <p>
          To search documents by meaning, you need a way to turn sentences into numbers (vectors) where similar
          meanings end up close together. Regular BERT was not built for this — the same sentence gets a
          different vector depending on what text comes before it, so you cannot reliably compare two sentences.
        </p>
        <p>
          Sentence-BERT fixes this with <em>twin networks</em> (two copies of the same model sharing weights).
          You feed sentence A through one copy and sentence B through the other. Each output gets compressed
          into one fixed-size vector. Now you can compare them with a simple similarity score — like checking
          how close two pins are on a map.
        </p>
        <p>
          The real-world payoff: embed all your documents once, store the vectors, and at search time just
          compare the query vector to your stored vectors. That is 10,000× faster than running BERT on every
          possible pair. This paper is why tools like sentence-transformers exist and why RAG retrieval is
          practical at all.
        </p>
      </LessonSection>

      <LessonSection title="Background — BERT was not designed for similarity">
        <p>
          Raw BERT produces different vectors for the same sentence depending on what text comes before it
          (it is <em>contextual</em> — each word's representation depends on surrounding words). You cannot
          directly compare two BERT outputs with <em>cosine similarity</em> (a score from 0 to 1 measuring
          how aligned two vectors are). Sentence-BERT fixed this with{' '}
          <strong className="text-white">Siamese twin networks</strong> (two identical models that share the
          same learned weights).
        </p>
      </LessonSection>

      <LessonSection title="How Sentence-BERT works">
        <ContentStep number={1} title="Siamese architecture">
          <p>
            Two identical BERT networks share weights. Sentence A goes through one; sentence B through the other.
            Both outputs are pooled to fixed-size vectors that can be compared directly.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Training with similarity labels">
          <p>
            Trained on sentence pairs labelled similar (paraphrases, entailment) or dissimilar (contradictions,
            unrelated). Cosine similarity loss pulls similar pairs together and pushes dissimilar pairs apart.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Pooling strategies">
          <p>
            Mean <em>pooling</em> (averaging all token vectors into one) became the default — simple and effective.
            This pooled vector is what gets stored in your vector database.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Key results">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>10,000× faster than cross-encoding every sentence pair for similarity search.</li>
          <li>Enabled semantic search at scale — embed once, compare with dot product.</li>
          <li>Released sentence-transformers library — still the standard tool for open-source embeddings.</li>
        </ul>
      </LessonSection>

      <LessonSection title="Connection to Embeddings lessons">
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
                ['What Are Embeddings?', 'The pooling step that turns tokens into one sentence vector comes from Sentence-BERT'],
                ['Open-Source Embeddings', 'BGE, E5, MiniLM all build on the sentence-transformers library that SBERT created'],
                ['Popular Questions', 'Why "abc" and "ABC" score as similar — SBERT trains on paraphrase pairs that teach case-insensitive matching'],
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
        Sentence-BERT made semantic search fast: embed your documents once, then find similar ones with a
        simple vector comparison. Every open-source embedding model you will use traces back to this idea.
      </Callout>

      <KeyTakeaways
        items={[
          'Siamese BERT networks produce fixed sentence vectors comparable via cosine similarity.',
          '10,000× faster than pairwise BERT encoding for retrieval.',
          'Foundation of sentence-transformers, BGE, E5, and all open-source RAG embeddings.',
        ]}
      />
    </LessonArticle>
  )
}
