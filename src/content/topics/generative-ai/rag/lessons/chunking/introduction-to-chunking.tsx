import {
  Callout,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function IntroductionToChunking() {
  return (
    <LessonArticle>
      <LessonSection title="Why chunk at all?">
        <p>
          Documents are too large to embed as one vector — a 50-page PDF produces one vague embedding that matches
          everything weakly. <strong className="text-white">Chunking</strong> splits documents into focused
          passages so each chunk has a clear meaning and retrieves precisely.
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-300">
          <li>Chunks must fit inside the LLM context window alongside the question.</li>
          <li>Smaller chunks = precise retrieval; larger chunks = more context per hit.</li>
          <li>Bad chunking is the <strong className="text-white">#1 cause of poor RAG</strong> — tune this first.</li>
        </ul>
      </LessonSection>

      <LessonSection title="What a chunk contains">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li><strong className="text-white">Text</strong> — the passage content.</li>
          <li><strong className="text-white">Metadata</strong> — source file, page, section heading, timestamp.</li>
          <li><strong className="text-white">Parent reference</strong> — link back to the full document (used in parent-document retrieval).</li>
        </ul>
      </LessonSection>

      <Callout variant="insight">
        Think of chunking as deciding the <em>granularity of memory</em>. Too fine and you lose context; too coarse
        and retrieval becomes imprecise.
      </Callout>

      <KeyTakeaways
        items={[
          'Chunking splits documents into passages sized for embedding and retrieval.',
          'Each chunk needs text + metadata; optional parent document link.',
          'Bad chunking is the most common RAG failure — fix before changing models.',
          'Next lessons cover specific strategies and tuning.',
        ]}
      />
    </LessonArticle>
  )
}
