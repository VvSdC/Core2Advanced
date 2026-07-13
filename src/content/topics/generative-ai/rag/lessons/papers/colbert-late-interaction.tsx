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

      <LessonSection title="What this paper means in plain English">
        <p>
          RAG retrieval has a speed-vs-accuracy trade-off. <em>Bi-encoders</em> (like DPR) are fast — you
          pre-compute one vector per document and compare at search time — but they miss fine details.
          <em> Cross-encoders</em> are accurate — they read the query and document together — but too slow to
          run on millions of documents.
        </p>
        <p>
          ColBERT finds a middle ground called <em>late interaction</em>. Instead of one vector per document,
          it stores one vector per <em>word</em> in the document. At search time, it compares each query word to
          the best-matching document word and sums those scores. You get finer matching than a bi-encoder, but
          you can still pre-compute document vectors offline.
        </p>
        <p>
          Think of bi-encoders as judging a book by its cover summary, cross-encoders as reading the whole
          book for every comparison, and ColBERT as skimming chapter headings and matching them word by word.
          That is why modern RAG often uses a fast bi-encoder first, then a ColBERT-style or cross-encoder
          reranker on the top results.
        </p>
      </LessonSection>

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
                ['Bi-encoder (DPR)', 'Fast — pre-compute one vector per document', 'Good'],
                ['Cross-encoder (reranker)', 'Slow — reads query and document together at search time', 'Best accuracy'],
                ['Late interaction (ColBERT)', 'Medium — pre-compute one vector per token, compare at search time', 'Better than bi-encoder'],
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
            For each query token, find the most similar document token using <em>MaxSim</em> (maximum similarity
            — take the best match per query word, then sum). This captures fine-grained term-level matches
            bi-encoders miss.
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
                ['Dense Retrieval', 'ColBERT is the accuracy upgrade when bi-encoder retrieval is not precise enough'],
                ['MMR & Reranking', 'ColBERT sits in the same "second stage" slot as cross-encoder rerankers'],
                ['DPR paper', 'DPR is the fast first stage; ColBERT is the more accurate second stage'],
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
        ColBERT is the "goldilocks" retriever — more accurate than bi-encoders, faster than cross-encoders.
        In practice, use a fast retriever first, then rerank the top results with something ColBERT-like.
      </Callout>

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
