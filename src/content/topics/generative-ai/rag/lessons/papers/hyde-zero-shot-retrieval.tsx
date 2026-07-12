import {
  Callout,
  ContentStep,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
  ResearchPaperHeader,
} from '../../../../../../components/content'

const PAPER_URL = 'https://arxiv.org/abs/2212.10496'

export function HydeZeroShotRetrieval() {
  return (
    <LessonArticle>
      <ResearchPaperHeader
        title="Precise Zero-Shot Dense Retrieval without Relevance Labels"
        authors="Gao et al. (Princeton)"
        year="2022"
        venue="HyDE"
        url={PAPER_URL}
      >
        <strong className="text-white">HyDE</strong> — use an LLM to generate a hypothetical answer, then embed
        <em>that</em> for retrieval. Bridges the gap between short queries and long document chunks.
      </ResearchPaperHeader>

      <Callout variant="beginner" title="Read this after">
        Read <em>Advanced Retrieval Strategies</em> and <em>Dense Retrieval</em>. HyDE is the research behind
        the HyDE technique in that lesson.
      </Callout>

      <LessonSection title="The query-document asymmetry problem">
        <p>
          User queries are short ("refund policy?"). Document chunks are long declarative prose. Embedding models
          trained on query-passage pairs still struggle when queries are very short or vague — the query vector
          lands in a different region of embedding space than any stored chunk.
        </p>
      </LessonSection>

      <LessonSection title="How HyDE works">
        <ContentStep number={1} title="Generate hypothetical document">
          <p>
            An LLM reads the query and generates a plausible answer passage — even if hallucinated. This
            hypothetical reads like a real document chunk.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Embed the hypothetical">
          <p>
            The hypothetical passage (not the raw query) is embedded and used for vector search. It lands
            closer to real document chunks in embedding space.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Retrieve and generate">
          <p>
            Real chunks are retrieved using the hypothetical's vector. The final answer is generated from
            real retrieved context — the hallucinated doc is never shown to the user.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Key results">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>Improved zero-shot retrieval on 11 datasets without any relevance labels for training.</li>
          <li>Especially strong on ambiguous or underspecified queries.</li>
          <li>Trade-off: extra LLM call at query time adds latency and cost.</li>
        </ul>
      </LessonSection>

      <KeyTakeaways
        items={[
          'HyDE generates a hypothetical answer, embeds it, and searches with that vector.',
          'Fixes query-document length/style mismatch in dense retrieval.',
          'Extra LLM call per query — use for hard queries, not every query.',
        ]}
      />
    </LessonArticle>
  )
}
