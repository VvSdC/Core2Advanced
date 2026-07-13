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

      <LessonSection title="What this paper means in plain English">
        <p>
          RAG has a lot of knobs to turn: chunk size, overlap, embedding model, keyword vs semantic search,
          reranking, query expansion. Beginners often ask "what are the best settings?" This paper actually
          tested every major choice systematically and measured the results — like a cooking experiment that
          tries different oven temperatures and reports which cake turned out best.
        </p>
        <p>
          The biggest lesson: there is no one-size-fits-all answer. The best chunk size depends on your
          documents. But some patterns hold across most datasets — a little overlap helps, combining keyword and
          semantic search beats either alone, and reranking consistently improves results.
        </p>
        <p>
          Think of this paper as a reality check for the tuning advice you learned in the Chunking lessons.
          It confirms some recommendations and reminds you to always test on your own data before assuming
          defaults will work.
        </p>
      </LessonSection>

      <LessonSection title="What they tested">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>Chunk sizes: 256, 512, 1024 tokens.</li>
          <li>Chunk overlap: 0%, 10%, 20%.</li>
          <li>Embedding models: OpenAI, Cohere, open-source.</li>
          <li>Retrieval: dense (meaning-based), BM25 (keyword), hybrid (both combined).</li>
          <li>Reranking: with and without <em>cross-encoder rerankers</em> (a slower but more accurate model that reads query and document together).</li>
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
                ['Chunk Size & Overlap', 'Confirms you should test 256, 512, and 1024 tokens on your own data — no universal winner'],
                ['Fixed & Recursive Splitting', 'Validates recursive splitting as a strong default starting point'],
                ['Semantic Chunking', 'Tested alongside fixed-size — which wins depends on your dataset'],
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
        There is no magic default for chunk size or retrieval method. Test on your own documents, but start
        with hybrid search plus reranking — that upgrade helps on most datasets.
      </Callout>

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
