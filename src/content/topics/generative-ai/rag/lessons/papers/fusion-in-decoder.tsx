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

      <LessonSection title="What this paper means in plain English">
        <p>
          The original RAG paper had a fancy option where the model could switch to a different source document
          for every single word it writes. That is powerful but complicated — like a journalist rewriting their
          source citation mid-sentence. FiD asks a simpler question: what if we just grab several good sources
          upfront and let the writer read them all at once?
        </p>
        <p>
          FiD retrieves multiple passages (say, the top 10 or 100), encodes each one separately with the
          question, and then lets the decoder (the text-generating half of the model) look at all of them
          simultaneously when writing the answer. One search, one writing pass — much simpler to build and debug.
        </p>
        <p>
          This is exactly how most modern RAG apps work today: retrieve several chunks, stuff them into the
          prompt, and let the LLM synthesise an answer. FiD proved this simpler pattern actually works better
          than the more complex per-token approach.
        </p>
      </LessonSection>

      <LessonSection title="The problem FiD solves">
        <p>
          Lewis et al.'s RAG-Token picks a different document per generated token — flexible but complex. FiD
          asks: what if we retrieve top-k passages once and let the decoder{' '}
          <strong className="text-white">fuse them all in a single forward pass</strong> (one pass through the
          model where it reads every passage at the same time)?
        </p>
      </LessonSection>

      <LessonSection title="How FiD works">
        <ContentStep number={1} title="Retrieve once">
          <p>DPR retrieves top-k passages (e.g. k=100, the 100 most relevant chunks, truncated to fit context).</p>
        </ContentStep>
        <ContentStep number={2} title="Encode each passage separately">
          <p>Each passage is concatenated with the question and encoded by the encoder independently.</p>
        </ContentStep>
        <ContentStep number={3} title="Decoder attends to all">
          <p>The decoder <em>cross-attends</em> (looks back at and pulls information from) <em>all</em> encoded
          passages simultaneously — fusing evidence from multiple sources in one generation.</p>
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
                ['RAG Architecture', 'FiD is the practical pattern you will actually build: retrieve several chunks, put them all in one prompt'],
                ['Augmentation & Generation', 'Putting multiple chunks in your context block is exactly what FiD demonstrated works well'],
                ['Introduction to RAG', 'Shows how RAG evolved from a complex research idea to the simple multi-chunk prompts we use today'],
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
        You do not need fancy per-word document switching. Retrieve your best chunks once, put them all in the
        prompt, and let the LLM read everything together — that is the pattern FiD validated.
      </Callout>

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
