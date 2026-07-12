import {
  Callout,
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
        A systematic study testing <strong className="text-white">every major RAG design choice</strong> —
        chunk size, overlap, embedding model, retrieval strategy, reranking — with measurable results.
      </ResearchPaperHeader>

      <Callout variant="beginner" title="Read this after">
        Complete the <em>Chunking Strategies</em> lessons first. This paper empirically validates (and sometimes
        challenges) the tuning advice from those lessons.
      </Callout>

      <LessonSection title="What they tested">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>Chunk sizes: 256, 512, 1024 tokens.</li>
          <li>Chunk overlap: 0%, 10%, 20%.</li>
          <li>Embedding models: OpenAI, Cohere, open-source.</li>
          <li>Retrieval: dense, BM25, hybrid.</li>
          <li>Reranking: with and without cross-encoder rerankers.</li>
          <li>Query expansion: HyDE, multi-query.</li>
        </ul>
      </LessonSection>

      <LessonSection title="Key findings for chunking">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Finding</th>
                <th className="px-4 py-3">Recommendation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Optimal chunk size is dataset-dependent', 'Test 256, 512, 1024 on your own data — no universal winner'],
                ['10% overlap helps on most datasets', 'Matches our 10–20% recommendation'],
                ['Hybrid retrieval beats dense-only', 'Add BM25 when docs contain exact terms or IDs'],
                ['Reranking consistently improves top-k precision', 'Add after tuning chunking and retrieval'],
                ['HyDE helps on short/vague queries', 'Use in Advanced Retrieval for ambiguous questions'],
              ].map(([finding, rec]) => (
                <tr key={finding} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 text-slate-400">{finding}</td>
                  <td className="px-4 py-3 font-semibold text-white">{rec}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Connection to Chunking lessons">
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
                ['Chunk Size & Overlap', 'Empirical validation of tuning workflow — test on your data'],
                ['Fixed & Recursive Splitting', 'Confirms recursive splitting as strong default'],
                ['Semantic Chunking', 'Tested alongside fixed-size — dataset-dependent winner'],
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
          'Systematic benchmark of chunk size, overlap, embeddings, retrieval, and reranking.',
          'No universal chunk size — always benchmark on your own documents and queries.',
          'Hybrid retrieval + reranking are the strongest upgrades after basic chunking.',
        ]}
      />
    </LessonArticle>
  )
}
