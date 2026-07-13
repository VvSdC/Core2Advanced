import {
  Callout,
  ContentStep,
  Definition,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function AdvancedRetrievalStrategies() {
  return (
    <LessonArticle>
      <LessonSection title="When basic retrieval is not enough">
        <p className="text-slate-300">
          Dense retrieval, hybrid search, MMR, and reranking handle most RAG use cases. But some questions defeat
          even a well-tuned basic pipeline: vague one-liners, multi-part questions, or queries where the
          document wording is nothing like how users ask.
        </p>
        <Callout variant="beginner" title="Important rule">
          Only reach for these advanced strategies <em>after</em> you have tuned chunking, embeddings, and
          hybrid search. They add latency, cost, and complexity. If Recall@5 is below 80%, fix the basics first
          — advanced tricks cannot retrieve chunks that basic search never finds.
        </Callout>
      </LessonSection>

      <Definition term="HyDE — Hypothetical Document Embeddings">
        <p>
          Instead of embedding the user's raw question, HyDE asks the LLM to <strong className="text-white">write
          a hypothetical answer</strong> first, then embeds <em>that</em>. A hypothetical answer looks much more
          like a stored document chunk than a short question — so it retrieves better matches.
        </p>
        <p>
          Analogy: instead of searching the library with "refund?", you first write a fake paragraph about refund
          policies, then search using that paragraph. The fake paragraph matches real documents far better than
          the one-word question.
        </p>
      </Definition>

      <LessonSection title="HyDE — walkthrough">
        <div className="mt-4 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div className="text-slate-400">User question:</div>
          <div className="mt-1">"What is the refund policy?"</div>
          <div className="mt-4 text-slate-400">LLM generates a hypothetical answer:</div>
          <div className="mt-1">
            "Customers may request a full refund within 30 days of purchase by contacting support via email or
            phone. Items must be in original packaging..."
          </div>
          <div className="mt-4 text-slate-400">Embed the hypothetical (not the question) → search vector DB</div>
          <div className="mt-1 text-genai-400">
            Much better match to actual policy chunks than embedding "What is the refund policy?" alone.
          </div>
        </div>
        <div className="mt-4 overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Use HyDE when</th>
                <th className="px-4 py-3">Skip HyDE when</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-surface-800/50">
                <td className="px-4 py-3 text-slate-400">
                  Queries are short or vague ("pricing?", "returns?"); chunks are long-form prose; basic dense
                  search returns low-relevance results
                </td>
                <td className="px-4 py-3 text-slate-400">
                  Queries already contain specific terms that match documents; you need exact ID lookups; latency
                  budget is tight (HyDE adds one LLM call per query)
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </LessonSection>

      <Definition term="Multi-query retrieval">
        <p>
          The LLM generates <strong className="text-white">several different search queries</strong> from one
          user question, runs retrieval for each, and merges the results. Different phrasings catch different
          chunks — broadening recall without changing your index.
        </p>
        <p>
          Analogy: if one Google search does not find what you need, you rephrase and search again. Multi-query
          automates that rephrasing.
        </p>
      </Definition>

      <LessonSection title="Multi-query — walkthrough">
        <div className="mt-4 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div className="text-slate-400">User question:</div>
          <div className="mt-1">"Can I return a broken item?"</div>
          <div className="mt-4 text-slate-400">LLM generates three search queries:</div>
          <div className="mt-2 space-y-1">
            <div>Query 1: "defective product return policy"</div>
            <div>Query 2: "warranty claim broken item procedure"</div>
            <div>Query 3: "refund damaged goods shipping label"</div>
          </div>
          <div className="mt-4 text-genai-400">
            Each query retrieves different chunks. Merge and deduplicate → broader evidence for the LLM.
          </div>
        </div>
        <div className="mt-4 overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Use multi-query when</th>
                <th className="px-4 py-3">Skip multi-query when</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-surface-800/50">
                <td className="px-4 py-3 text-slate-400">
                  Users phrase questions very differently from document text; single-query recall is low; you
                  have budget for 3–5 extra retrieval calls per question
                </td>
                <td className="px-4 py-3 text-slate-400">
                  Basic retrieval already finds the right chunks; latency is critical; queries are already
                  specific and well-formed
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </LessonSection>

      <Definition term="Parent-document retrieval">
        <p>
          Index <strong className="text-white">small chunks</strong> for precise retrieval, but return the{' '}
          <strong className="text-white">parent document</strong> (or a larger surrounding window) to the LLM.
          Small chunks find the exact right spot; the parent gives the model enough surrounding context to
          answer accurately.
        </p>
        <p>
          Analogy: use a pinpoint map to find the right building (small chunk), but hand the visitor the full
          floor plan (parent document) so they understand the layout.
        </p>
      </Definition>

      <LessonSection title="Parent-document — why small chunks retrieve but cannot answer">
        <ContentStep number={1} title="Small chunks retrieve precisely">
          <p>
            A 200-token chunk about "refund exceptions for electronics" scores high when someone asks about
            returning a laptop. Precise match.
          </p>
        </ContentStep>
        <ContentStep number={2} title="But the chunk lacks surrounding context">
          <p>
            The 200-token chunk says "electronics have a 14-day window" but does not mention the general 30-day
            policy, the restocking fee, or how to initiate a return. The LLM cannot give a complete answer.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Return the parent section instead">
          <p>
            Retrieve the small chunk, then fetch its parent (the full "Return Policies" section, maybe 1,500
            tokens). The LLM gets precise location + full context.
          </p>
        </ContentStep>
        <div className="mt-4 overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Use parent-document when</th>
                <th className="px-4 py-3">Skip parent-document when</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-surface-800/50">
                <td className="px-4 py-3 text-slate-400">
                  Small chunks find the right spot but answers lack context; parent documents are under 2,000
                  tokens; chunk boundaries split important information
                </td>
                <td className="px-4 py-3 text-slate-400">
                  Chunks are already large enough (500+ tokens); parent documents are huge (would flood the
                  prompt); each chunk is self-contained
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </LessonSection>

      <Definition term="Query decomposition">
        <p>
          For complex, multi-part questions, an LLM splits the query into <strong className="text-white">independent
          sub-questions</strong>, retrieves for each one separately, and merges the results. Essential when a
          single retrieval call cannot cover all the facts needed.
        </p>
        <p>
          Analogy: "Who managed the team that built product X?" requires two lookups — who built product X, then
          who managed that team. One search cannot answer both.
        </p>
      </Definition>

      <LessonSection title="Query decomposition — walkthrough">
        <div className="mt-4 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div className="text-slate-400">Complex question:</div>
          <div className="mt-1">"What is the return policy for electronics bought during the holiday sale?"</div>
          <div className="mt-4 text-slate-400">Decomposed into sub-questions:</div>
          <div className="mt-2 space-y-1">
            <div>Sub-Q 1: "return policy for electronics"</div>
            <div>Sub-Q 2: "holiday sale special terms and conditions"</div>
            <div>Sub-Q 3: "extended return window promotional periods"</div>
          </div>
          <div className="mt-4 text-genai-400">
            Retrieve for each sub-question → merge results → LLM synthesises a complete answer from all three
            evidence sets.
          </div>
        </div>
        <div className="mt-4 overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Use decomposition when</th>
                <th className="px-4 py-3">Skip decomposition when</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-surface-800/50">
                <td className="px-4 py-3 text-slate-400">
                  Multi-hop questions needing facts from different documents; compound questions with "and" /
                  "also" / "compared to"; single retrieval returns partial evidence
                </td>
                <td className="px-4 py-3 text-slate-400">
                  Questions are simple and single-topic; basic retrieval already returns complete evidence;
                  latency budget is very tight
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Decision guide — which advanced strategy to try">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Your symptom</th>
                <th className="px-4 py-3">Try this strategy</th>
                <th className="px-4 py-3">Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Short, vague queries retrieve nothing useful', 'HyDE', '1 extra LLM call per query'],
                ['Users phrase questions differently from docs', 'Multi-query', '3–5 extra retrieval calls'],
                ['Right spot found but chunk lacks context', 'Parent-document', 'Minimal — just fetch parent ID'],
                ['Multi-part questions need facts from multiple docs', 'Query decomposition', '1 LLM call + N retrieval calls'],
              ].map(([symptom, strategy, cost]) => (
                <tr key={symptom} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 text-slate-400">{symptom}</td>
                  <td className="px-4 py-3 font-semibold text-white">{strategy}</td>
                  <td className="px-4 py-3 text-slate-400">{cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip">
          You can combine strategies. A common advanced pipeline: multi-query generates 3 phrasings → each
          retrieval uses HyDE → parent-document expands the winning chunks → MMR deduplicates. Powerful, but
          expensive. Build up one strategy at a time and measure Recall@k after each addition.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'HyDE embeds a hypothetical answer instead of the raw query — best for short, vague questions.',
          'Multi-query generates several search phrasings per question — best when users and docs use different language.',
          'Parent-document retrieval: small chunks find the spot, large parent gives the LLM enough context.',
          'Query decomposition splits complex questions into sub-questions — essential for multi-hop reasoning.',
          'Only use advanced strategies after basic dense/hybrid retrieval is tuned and Recall@5 ≥ 80%.',
        ]}
      />
    </LessonArticle>
  )
}
