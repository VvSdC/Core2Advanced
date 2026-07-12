import {
  Callout,
  ContentStep,
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
        Read <em>Dense Retrieval</em>, <em>MMR & Reranking</em>, and the <em>DPR</em> paper. ColBERT sits
        between bi-encoder retrieval and cross-encoder reranking.
      </Callout>

      <LessonSection title="Three retrieval architectures">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Speed</th>
                <th className="px-4 py-3">Accuracy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Bi-encoder (DPR)', 'Fast — pre-compute doc vectors', 'Good'],
                ['Cross-encoder (reranker)', 'Slow — encode query+doc together', 'Best'],
                ['Late interaction (ColBERT)', 'Medium — pre-compute token vectors', 'Better than bi-encoder'],
              ].map(([type, speed, acc]) => (
                <tr key={type} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{type}</td>
                  <td className="px-4 py-3 text-slate-400">{speed}</td>
                  <td className="px-4 py-3 text-slate-400">{acc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="How late interaction works">
        <ContentStep number={1} title="Token-level embeddings">
          <p>
            Instead of one vector per document, ColBERT stores a vector per <em>token</em>. A 100-token
            passage produces 100 vectors (compressed via residual encoding).
          </p>
        </ContentStep>
        <ContentStep number={2} title="MaxSim scoring">
          <p>
            For each query token, find the most similar document token (max similarity). Sum these max scores
            across all query tokens. This captures fine-grained term-level matches bi-encoders miss.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Key results">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>Outperformed DPR bi-encoder on MS MARCO and other benchmarks.</li>
          <li>10–100× faster than cross-encoder reranking at similar accuracy.</li>
          <li>ColBERTv2 improved compression — practical for million-document indexes.</li>
        </ul>
      </LessonSection>

      <KeyTakeaways
        items={[
          'ColBERT uses per-token embeddings with MaxSim late interaction scoring.',
          'More accurate than bi-encoders (DPR); faster than cross-encoder rerankers.',
          'Informs modern two-stage retrieval: bi-encoder recall → ColBERT/reranker precision.',
        ]}
      />
    </LessonArticle>
  )
}
