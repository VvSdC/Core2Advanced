import {
  Callout,
  ContentStep,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
  ResearchPaperHeader,
} from '../../../../../../components/content'

const PAPER_URL = 'https://arxiv.org/abs/2007.01282'

export function FusionInDecoder() {
  return (
    <LessonArticle>
      <ResearchPaperHeader
        title="Leveraging Passage Retrieval with Generative Models for Open Domain QA"
        authors="Izacard & Grave (Facebook AI / Inria)"
        year="2020"
        venue="FiD"
        url={PAPER_URL}
      >
        <strong className="text-white">Fusion-in-Decoder (FiD)</strong> — feed multiple retrieved passages into
        the decoder at once, instead of retrieving one passage per generated token.
      </ResearchPaperHeader>

      <Callout variant="beginner" title="Read this after">
        Read <em>RAG Architecture</em> and the <em>RAG (Lewis et al.)</em> paper. FiD simplifies how retrieved
        context reaches the generator.
      </Callout>

      <LessonSection title="The problem FiD solves">
        <p>
          Lewis et al.'s RAG-Token picks a different document per generated token — flexible but complex. FiD
          asks: what if we retrieve top-k passages once and let the decoder{' '}
          <strong className="text-white">fuse them all in a single forward pass</strong>?
        </p>
      </LessonSection>

      <LessonSection title="How FiD works">
        <ContentStep number={1} title="Retrieve once">
          <p>DPR retrieves top-k passages (e.g. k=100, truncated to fit context).</p>
        </ContentStep>
        <ContentStep number={2} title="Encode each passage separately">
          <p>Each passage is concatenated with the question and encoded by the encoder independently.</p>
        </ContentStep>
        <ContentStep number={3} title="Decoder attends to all">
          <p>The decoder cross-attends to <em>all</em> encoded passages simultaneously — fusing evidence from
          multiple sources in one generation.</p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Key results">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>Outperformed RAG on open-domain QA benchmarks with simpler architecture.</li>
          <li>Scaling k (more passages) improved results — more context helps when fused properly.</li>
          <li>Became the template for modern RAG: retrieve many, feed all to the LLM prompt.</li>
        </ul>
      </LessonSection>

      <LessonSection title="Connection to Fundamentals lessons">
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
                ['RAG Architecture', 'FiD is the query-pipeline pattern: retrieve k passages → fuse in one prompt'],
                ['Augmentation & Generation', 'Multiple chunks in the context block mirrors FiD fusion'],
                ['Introduction to RAG', 'Shows evolution from RAG-Token complexity to practical multi-passage RAG'],
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
          'FiD retrieves top-k passages once and fuses them in a single decoder pass.',
          'Simpler than RAG-Token; scaling k improves QA accuracy.',
          'Direct ancestor of modern multi-chunk RAG prompts.',
        ]}
      />
    </LessonArticle>
  )
}
