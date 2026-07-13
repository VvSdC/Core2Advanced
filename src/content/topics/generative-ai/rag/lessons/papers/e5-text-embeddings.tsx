import {
  Callout,
  ContentStep,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
  ResearchPaperHeader,
} from '../../../../../../components/content'

const PAPER_URL = 'https://arxiv.org/abs/2212.03533'

export function E5TextEmbeddings() {
  return (
    <LessonArticle>
      <ResearchPaperHeader
        title="Text Embeddings by Weakly-Supervised Contrastive Learning"
        authors="Wang et al. (Microsoft)"
        year="2022"
        venue="E5"
        url={PAPER_URL}
      >
        Trained embedding models on <strong className="text-white">1 billion text pairs</strong> with contrastive
        learning — producing E5, one of the best open-source embedding families for RAG.
      </ResearchPaperHeader>

      <Callout variant="beginner" title="Read this after">
        Read <em>Sentence-BERT</em> (previous paper) and <em>Open-Source Embeddings</em>. E5 is the direct
        successor with better training data and asymmetric query/passage prefixes.
      </Callout>

      <LessonSection title="What this paper means in plain English">
        <p>
          Sentence-BERT showed <em>how</em> to make sentence embeddings. E5 shows <em>how to train them better</em>
          — with vastly more data and a small trick that makes search more accurate. Instead of relying on
          small hand-labelled datasets, the E5 team mined about a billion text pairs from the web.
        </p>
        <p>
          They also introduced a simple prefix convention: prepend <code className="font-mono text-sm">query:</code>{' '}
          to search questions and <code className="font-mono text-sm">passage:</code> to stored documents. This
          tells the model "I am looking for something" vs "I am something to be found" — like labelling envelopes
          "question" and "answer" so the mail sorter knows which is which.
        </p>
        <p>
          The result is an open-source embedding family that rivals paid APIs. If you are picking an embedding
          model for your first RAG project, E5 is one of the safest choices — and this paper explains why it
          works so well.
        </p>
      </LessonSection>

      <LessonSection title="How E5 improves on SBERT">
        <ContentStep number={1} title="Weakly-supervised data at scale">
          <p>
            Instead of small hand-labelled datasets, E5 mined ~1 billion text pairs from the web using{' '}
            <em>weakly-supervised</em> learning (training on automatically collected pairs that are probably
            related, without human labelling) — query-page pairs, title-body pairs, paraphrases — with automatic
            filtering for quality.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Contrastive learning">
          <p>
            <em>In-batch negatives</em>: for each positive pair (query, relevant passage), all other passages
            in the training batch serve as negatives. <em>Contrastive learning</em> (training the model to
            distinguish relevant from irrelevant pairs) works at massive scale this way.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Asymmetric prefixes">
          <p>
            Introduced <code className="font-mono text-sm">query:</code> and{' '}
            <code className="font-mono text-sm">passage:</code> <em>asymmetric prefixes</em> (different labels
            for search queries vs stored documents) — telling the model whether input is a search query or a
            stored document. Improves retrieval accuracy by 5–15%.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Key results">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>E5-large outperformed OpenAI ada-002 on BEIR benchmark (18 diverse retrieval datasets).</li>
          <li>E5-mistral (7B) matched or beat commercial APIs on MTEB leaderboard.</li>
          <li>query:/passage: prefix convention adopted by BGE and other models.</li>
        </ul>
      </LessonSection>

      <LessonSection title="Connection to Embeddings lessons">
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
                ['Open-Source Embeddings', 'E5-large-v2 is a top production choice — this paper explains the query:/passage: prefix trick'],
                ['Commercial Embedding Models', 'E5-large beat OpenAI ada-002, proving open-source can match paid APIs'],
                ['Popular Questions', 'The query:/passage: prefix convention is explained in Q7 of Popular Questions'],
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
        When using E5 (or BGE, which copied this trick), always prefix your query with <code className="font-mono text-sm">query:</code>{' '}
        and your documents with <code className="font-mono text-sm">passage:</code> — it is a free accuracy boost.
      </Callout>

      <KeyTakeaways
        items={[
          'E5 trains on 1B weakly-supervised pairs with contrastive in-batch negatives.',
          'query:/passage: prefixes for asymmetric search — use at index and query time.',
          'E5-large competitive with commercial APIs; foundation for modern open-source RAG embeddings.',
        ]}
      />
    </LessonArticle>
  )
}
