import {
  Callout,
  ContentStep,
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
        title="Text Embeddings by Weakly-Supervised Contrastive Learning"
        authors="Wang et al. (Microsoft)"
        year="2022"
        venue="E5"
        url={PAPER_URL}
      >
        Trained embedding models on <strong className="text-white">1 billion text pairs</strong> with contrastive
        learning — producing E5, one of the best open-source embedding families for RAG.
      </ResearchPaperHeader>

      <Callout variant="beginner" title="Read this after">
        Read <em>Sentence-BERT</em> (previous paper) and <em>Open-Source Embeddings</em>. E5 is the direct
        successor with better training data and asymmetric query/passage prefixes.
      </Callout>

      <LessonSection title="How E5 improves on SBERT">
        <ContentStep number={1} title="Weakly-supervised data at scale">
          <p>
            Instead of small hand-labelled datasets, E5 mined ~1 billion text pairs from the web — query-page
            pairs, title-body pairs, paraphrases — with automatic filtering for quality.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Contrastive learning">
          <p>
            In-batch negatives: for each positive pair (query, relevant passage), all other passages in the batch
            serve as negatives. The model learns to distinguish relevant from irrelevant at scale.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Asymmetric prefixes">
          <p>
            Introduced <code className="font-mono text-sm">query:</code> and{' '}
            <code className="font-mono text-sm">passage:</code> prefixes — telling the model whether input is a
            search query or a stored document. Improves retrieval accuracy by 5–15%.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Key results">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>E5-large outperformed OpenAI ada-002 on BEIR benchmark (18 diverse retrieval datasets).</li>
          <li>E5-mistral (7B) matched or beat commercial APIs on MTEB leaderboard.</li>
          <li>query:/passage: prefix convention adopted by BGE and other models.</li>
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
                ['Open-Source Embeddings', 'E5-large-v2 is a top production choice — prefixes documented here'],
                ['Commercial Embedding Models', 'E5-large beat ada-002 — open-source can match commercial quality'],
                ['Popular Questions', 'query:/passage: prefixes explained in Q7 of Popular Questions'],
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
          'E5 trains on 1B weakly-supervised pairs with contrastive in-batch negatives.',
          'query:/passage: prefixes for asymmetric search — use at index and query time.',
          'E5-large competitive with commercial APIs; foundation for modern open-source RAG embeddings.',
        ]}
      />
    </LessonArticle>
  )
}
