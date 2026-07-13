import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function RetrievalOverview() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Prerequisite">
        If you have not read <em>Fundamentals → Bi-Encoders & Cross-Encoders</em>, do that first. It explains the
        two architectures behind almost every retrieval strategy in this section.
      </Callout>

      <Definition term="Retrieval">
        <p>
          Retrieval is the <strong className="text-white">search step</strong> in RAG. A user asks a question,
          and your system hunts through thousands of document chunks to find the ones most likely to contain the
          answer. Those chunks get handed to the LLM as reference material — like giving a student index cards
          before an open-book exam.
        </p>
        <p>
          If retrieval picks the wrong cards, the LLM cannot produce a good answer — no matter how smart the
          model is. Retrieval is the bottleneck of every RAG system.
        </p>
      </Definition>

      <LessonSection title="Where retrieval sits in the pipeline">
        <p className="text-slate-300">
          By the time a question reaches retrieval, your documents are already split into chunks and stored in a
          vector database. Retrieval's job is to find the best chunks and pass them forward.
        </p>
        <Flowchart
          title="Retrieval in context"
          chart={`flowchart LR
  Q[User question] --> R[Retrieval strategy]
  R --> V[(Vector DB)]
  V --> K[Top-k chunks]
  K --> P[Augmented prompt]
  P --> LLM[Generate answer]`}
        />
        <ContentStep number={1} title="User asks a question">
          <p>
            "How do I get a refund?" arrives as plain text. Retrieval must translate this into a search that
            finds the right policy documents.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Search strategy runs">
          <p>
            Depending on your setup, this might be meaning-based search (dense), keyword search (BM25), or both
            combined (hybrid). The strategy decides <em>how</em> to hunt.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Top-k chunks are returned">
          <p>
            The database returns the <strong className="text-white">k</strong> best-matching chunks. These become
            the evidence the LLM reads before answering.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="What is k? — how many index cards to show the LLM">
        <p className="text-slate-300">
          <strong className="text-white">k</strong> is simply the number of chunks you retrieve. Think of it as
          deciding how many index cards to lay on the student's desk before the exam.
        </p>
        <div className="mt-4 space-y-3">
          <div className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
            <p className="text-sm font-semibold text-white">k = 1–3 — the focused student</p>
            <p className="mt-1 text-sm text-slate-400">
              Only a few cards. Fast and precise, but you might miss context spread across multiple chunks. A
              refund policy might mention the 30-day window in chunk 4 and the exceptions in chunk 9 — with k=2,
              you only get one of them.
            </p>
          </div>
          <div className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
            <p className="text-sm font-semibold text-white">k = 5–7 — the sweet spot</p>
            <p className="mt-1 text-sm text-slate-400">
              Enough cards to cover most questions without drowning the LLM in noise. This is where most
              production RAG systems start. You get related context (refund policy + shipping policy + warranty)
              without overwhelming the prompt.
            </p>
          </div>
          <div className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
            <p className="text-sm font-semibold text-white">k = 15+ — the overwhelmed student</p>
            <p className="mt-1 text-sm text-slate-400">
              Too many cards on the desk. The LLM struggles to find the relevant sentence buried in 15 chunks of
              text. Worse, irrelevant chunks can confuse the model into hallucinating. More is not always better.
            </p>
          </div>
        </div>
        <Callout variant="tip">
          Start with k=5. If answers miss context, increase k. If answers get noisy or contradictory, decrease k
          or add diversity techniques (MMR). Tune k using a labelled test set — not guesswork.
        </Callout>
      </LessonSection>

      <LessonSection title="The strategy landscape — six ways to search">
        <p className="text-slate-300">
          There is no single "best" retrieval method. Each strategy matches documents differently. The lessons
          ahead cover each one in depth; here is the map:
        </p>
        <div className="mt-4 overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Strategy</th>
                <th className="px-4 py-3">Analogy</th>
                <th className="px-4 py-3">Best for</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Dense / semantic', 'Asking a librarian who understands meaning', 'Paraphrases, concepts, "money back" → "refund"'],
                ['BM25 / keyword', 'Ctrl+F on steroids', 'Exact IDs, codes, product names, legal terms'],
                ['Hybrid + RRF', 'Two librarians vote on the best books', 'Production default — covers both meanings and keywords'],
                ['MMR', 'Picking diverse cards, not five copies of the same one', 'When top results are repetitive'],
                ['Cross-encoder rerank', 'A slow expert double-checks the fast search', 'When right chunks exist but rank too low'],
                ['HyDE / multi-query', 'Rephrasing the question five different ways', 'Vague questions, multi-hop reasoning'],
              ].map(([strategy, analogy, bestFor]) => (
                <tr key={strategy} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{strategy}</td>
                  <td className="px-4 py-3 text-slate-400">{analogy}</td>
                  <td className="px-4 py-3 text-slate-400">{bestFor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="How to choose a starting strategy">
        <Callout variant="beginner" title="Start simple, add complexity only when needed">
          Most teams should begin with dense retrieval (k=5). Only add BM25/hybrid if exact keyword matches
          fail. Only add reranking if the right chunks appear in results but not in the top 5. Advanced strategies
          like HyDE are last resorts — they add latency and cost.
        </Callout>
        <div className="mt-4 overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Your problem</th>
                <th className="px-4 py-3">Try this</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Just getting started', 'Dense retrieval, k=5'],
                ['Users search by product ID or error code', 'Add BM25 → hybrid search'],
                ['Top 5 results all say the same thing', 'Add MMR for diversity'],
                ['Right chunk is in top 20 but not top 5', 'Add cross-encoder reranking'],
                ['Short, vague questions retrieve nothing', 'Try HyDE or multi-query'],
              ].map(([problem, solution]) => (
                <tr key={problem} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 text-slate-400">{problem}</td>
                  <td className="px-4 py-3 font-semibold text-white">{solution}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Retrieval finds the top-k document chunks — think of k as how many index cards to show the LLM.',
          'k=5–7 is the sweet spot for most apps; tune with labelled test questions, not guesses.',
          'Start with dense retrieval; add hybrid, MMR, or reranking only when you see a specific failure mode.',
          'Bad retrieval cannot be fixed by a better LLM — fix search before touching the model.',
        ]}
      />
    </LessonArticle>
  )
}
