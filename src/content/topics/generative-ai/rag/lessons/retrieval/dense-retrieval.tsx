import {
  Callout,
  ContentStep,
  Definition,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function DenseRetrieval() {
  return (
    <LessonArticle>
      <Definition term="Dense retrieval">
        <p>
          Dense retrieval is <strong className="text-white">meaning-based search</strong>. Instead of matching
          exact words, it converts text into numerical vectors (embeddings) and finds chunks whose vectors are
          closest to the query's vector. Two sentences that mean the same thing — even with completely different
          words — end up near each other in vector space.
        </p>
        <p>
          Analogy: a librarian who understands <em>what you mean</em>, not just the words you typed. Ask for
          "money back" and they find the refund policy, even though the word "refund" never appeared in your
          question.
        </p>
      </Definition>

      <LessonSection title="How dense retrieval works — three steps">
        <ContentStep number={1} title="Embed the user's question">
          <p>
            The same embedding model that converted your document chunks into vectors now converts the user's
            question into a vector. This vector captures the <em>meaning</em> of the question in hundreds of
            numbers.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Compare against every stored chunk">
          <p>
            The system computes similarity (usually cosine similarity) between the query vector and every chunk
            vector in the database. Chunks with similar meaning score high; unrelated chunks score low. Modern
            vector databases use approximate nearest-neighbor (ANN) indexes to do this in milliseconds, even with
            millions of chunks.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Return the top-k highest-scoring chunks">
          <p>
            The k chunks with the highest similarity scores are returned. These become the evidence the LLM
            reads before generating an answer.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Concrete example — the refund question">
        <p className="text-slate-300">
          A customer support bot has indexed your company's help articles. A user asks a question that uses
          completely different words from your documentation:
        </p>
        <div className="mt-4 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div className="text-slate-400">User question:</div>
          <div className="mt-1">"How do I get my money back?"</div>
          <div className="mt-4 text-slate-400">Chunk scores (cosine similarity):</div>
          <div className="mt-2 space-y-1">
            <div>
              Chunk A — "Our refund policy allows returns within 30 days of purchase…" →{' '}
              <span className="text-genai-400">0.91 ✓</span>
            </div>
            <div>Chunk B — "Shipping costs and delivery timelines vary by region…" → 0.23</div>
            <div>
              Chunk C — "We offer a money-back guarantee for defective items…" →{' '}
              <span className="text-genai-400">0.87 ✓</span>
            </div>
            <div>Chunk D — "Create an account to track your orders…" → 0.15</div>
          </div>
          <div className="mt-4 text-genai-400">
            Returns chunks A and C (with k=2) — semantic match without a single shared keyword.
          </div>
        </div>
        <Callout variant="insight">
          Notice: the user said "money back" but the best matches say "refund" and "money-back guarantee." Dense
          retrieval bridges this vocabulary gap automatically. Keyword search would have returned nothing useful.
        </Callout>
      </LessonSection>

      <LessonSection title="Why dense retrieval is the RAG default">
        <p className="text-slate-300">
          Real users rarely phrase questions the same way documents are written. They use slang, abbreviations,
          and paraphrases. Dense retrieval handles this naturally because it matches on meaning, not spelling.
        </p>
        <div className="mt-4 overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Strength</th>
                <th className="px-4 py-3">Example</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Paraphrase matching', '"cancel subscription" finds "terminate your plan"'],
                ['Conceptual similarity', '"Is it waterproof?" finds "IP68 rating details"'],
                ['Multilingual (with right model)', 'Spanish question finds English document'],
                ['Handles vague questions', '"Something wrong with my order" finds troubleshooting guides'],
              ].map(([strength, example]) => (
                <tr key={strength} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{strength}</td>
                  <td className="px-4 py-3 text-slate-400">{example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Where dense retrieval falls short">
        <p className="text-slate-300">
          Meaning-based search is powerful but blind to exact identifiers. When precision matters more than
          paraphrase, dense retrieval alone is not enough.
        </p>
        <div className="mt-4 overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Weakness</th>
                <th className="px-4 py-3">What goes wrong</th>
                <th className="px-4 py-3">Fix</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Exact IDs and codes', 'Query "SKU-48291" may not match the chunk containing that exact string', 'Add BM25 keyword search (hybrid)'],
                ['Rare proper nouns', 'Obscure product names get low similarity scores', 'Add BM25 or metadata filters'],
                ['Numbers and dates', 'Embeddings treat "30 days" and "60 days" as similar', 'Use structured metadata or keyword search'],
                ['Very short queries', 'One-word queries like "pricing" are ambiguous in vector space', 'Try multi-query or HyDE'],
              ].map(([weakness, problem, fix]) => (
                <tr key={weakness} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{weakness}</td>
                  <td className="px-4 py-3 text-slate-400">{problem}</td>
                  <td className="px-4 py-3 text-genai-400">{fix}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip">
          Dense retrieval is your starting point, not your finish line. When you see exact-match failures in your
          test set, pair dense search with BM25 in a hybrid pipeline — covered in the next lessons.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Dense retrieval matches by meaning, not keywords — "money back" finds "refund policy."',
          'Three steps: embed the query, compare vectors, return top-k highest scores.',
          'Default choice for RAG because users paraphrase; weak on exact IDs, codes, and rare names.',
          'Pair with BM25 (hybrid search) when your test set shows keyword-match failures.',
        ]}
      />
    </LessonArticle>
  )
}
