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

      <LessonSection title="Background — BERT was not designed for similarity">
        <p>
          Raw BERT produces different vectors for the same sentence depending on what text comes before it
          (contextual). You cannot directly compare two BERT outputs with cosine similarity. Sentence-BERT
          fixed this with <strong className="text-white">Siamese twin networks</strong>.
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
            Mean pooling (average all token vectors) became the default — simple and effective. This pooled vector
            is what gets stored in your vector database.
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
                ['What Are Embeddings?', 'Pooling step in the embedding pipeline comes from Sentence-BERT'],
                ['Open-Source Embeddings', 'BGE, E5, MiniLM all descend from sentence-transformers / SBERT'],
                ['Popular Questions', 'Why abc/ABC are similar — SBERT training on paraphrase pairs'],
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
