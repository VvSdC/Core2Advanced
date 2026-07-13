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

      <LessonSection title="What this paper means in plain English">
        <p>
          Users ask short questions like "refund policy?" but your stored documents are long paragraphs of
          declarative prose. Embedding models struggle with this mismatch — a three-word query lands in a
          different region of "meaning space" than any stored chunk. It is like searching a library catalogue
          with a sticky note when every book is summarised as a full chapter.
        </p>
        <p>
          HyDE's trick: ask an LLM to write a <em>hypothetical answer</em> to the query — a fake document that
          reads like a real chunk. Then embed that hypothetical and search with its vector. The fake answer
          looks like your stored documents, so it lands much closer to the right chunks in embedding space.
        </p>
        <p>
          The hallucinated document is never shown to the user. It is just a search bridge. Real chunks are
          retrieved using the hypothetical's vector, and the final answer is generated from those real sources.
          Think of it as asking a friend "what would the answer probably say?" and then searching for documents
          that match that guess.
        </p>
      </LessonSection>

      <LessonSection title="The query-document asymmetry problem">
        <p>
          User queries are short ("refund policy?"). Document chunks are long declarative prose. Embedding models
          trained on query-passage pairs still struggle when queries are very short or vague — the query vector
          lands in a different region of <em>embedding space</em> (the multi-dimensional map where similar
          meanings sit close together) than any stored chunk.
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

      <LessonSection title="Connection to Retrieval Strategies lessons">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Lesson</th>
                <th className="px-4 py-3">How this paper connects</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Advanced Retrieval Strategies', 'HyDE is the research behind the query-expansion technique taught in that lesson'],
                ['Dense Retrieval', 'Fixes the short-query vs long-document mismatch that dense retrieval struggles with'],
                ['What Are Embeddings?', 'Shows a creative workaround when query and document embeddings do not align naturally'],
              ].map(([lesson, connection]) => (
                <tr key={lesson} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{lesson}</td>
                  <td className="px-4 py-3 text-slate-400">{connection}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <Callout variant="beginner" title="Key insight for beginners">
        When short or vague queries fail to find good chunks, HyDE generates a fake answer paragraph and
        searches with that instead. Use it for hard queries — not every query — because it costs an extra
        LLM call.
      </Callout>

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
