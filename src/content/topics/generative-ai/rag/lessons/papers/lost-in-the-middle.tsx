import {
  Callout,
  ContentStep,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
  ResearchPaperHeader,
} from '../../../../../../components/content'

const PAPER_URL = 'https://arxiv.org/abs/2307.03172'

export function LostInTheMiddle() {
  return (
    <LessonArticle>
      <ResearchPaperHeader
        title="Lost in the Middle: How Language Models Use Long Contexts"
        authors="Liu et al. (Stanford / UC Berkeley)"
        year="2023"
        url={PAPER_URL}
      >
        Proved that LLMs <strong className="text-white">ignore information in the middle</strong> of long prompts
        — directly impacting how many chunks you retrieve and where you place them.
      </ResearchPaperHeader>

      <Callout variant="beginner" title="Read this after">
        Read <em>Chunk Size & Overlap</em> and <em>Augmentation & Generation</em>. This paper explains why
        retrieving too many chunks can hurt even when retrieval is perfect.
      </Callout>

      <LessonSection title="The discovery">
        <p>
          When relevant information is placed in the <strong className="text-white">middle</strong> of a long
          context, models often fail to use it. Performance is highest when the answer is at the{' '}
          <strong className="text-white">beginning or end</strong> of the prompt — a U-shaped attention curve.
        </p>
      </LessonSection>

      <LessonSection title="Experiments">
        <ContentStep number={1} title="Multi-document QA">
          <p>
            Retrieved documents were shuffled so the gold answer could appear at position 1, middle, or last.
            Accuracy dropped sharply when the answer document was in the middle positions.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Held across models">
          <p>
            GPT-3.5, Claude, and open-source models all showed the effect — it is architectural, not model-specific.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Implications for RAG">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li><strong className="text-white">Limit k</strong> — retrieving 20 chunks floods the middle; k=3–7 is safer.</li>
          <li><strong className="text-white">Rerank aggressively</strong> — put the best chunk first (or last) in the prompt.</li>
          <li><strong className="text-white">Smaller chunks</strong> — more focused context per chunk reduces noise in the middle.</li>
          <li><strong className="text-white">Lost-in-the-middle reranking</strong> — some pipelines deliberately sandwich key chunks at start and end.</li>
        </ul>
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
                ['Chunk Size & Overlap', 'Smaller focused chunks = less middle-context noise'],
                ['Introduction to Chunking', 'Why chunk granularity affects what the LLM actually reads'],
                ['Augmentation & Generation', 'Order chunks by relevance score before injecting into prompt'],
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
          'LLMs best use context at the start and end — middle content is often ignored.',
          'Directly motivates k=3–7, reranking, and careful chunk ordering in RAG prompts.',
          'Effect holds across GPT, Claude, and open-source models.',
        ]}
      />
    </LessonArticle>
  )
}
