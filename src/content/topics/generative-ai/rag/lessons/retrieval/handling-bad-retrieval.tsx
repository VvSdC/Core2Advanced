import {
  Callout,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function HandlingBadRetrieval() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Read this after">
        Complete <em>Retrieval → MMR &amp; Reranking</em> and <em>Fundamentals → Augmentation &amp; Generation</em> first.
        This lesson is about what to do when retrieval brings back the <em>wrong</em> chunks.
      </Callout>

      <Definition term="Bad retrieval">
        <p>
          <strong className="text-white">Bad retrieval</strong> is when the chunks returned for a query are irrelevant,
          low-quality, or simply not enough to answer. Because the generator can only work with what it is given,{' '}
          <strong className="text-white">bad retrieval is the single biggest cause of wrong or hallucinated RAG answers.</strong>
        </p>
        <p>
          The fix is a layered defense: stop bad chunks from reaching the model, and when they do slip through, fail
          gracefully instead of guessing.
        </p>
      </Definition>

      <LessonSection title="Why irrelevant chunks are dangerous">
        <p>
          Vector search <em>always</em> returns the top-k nearest chunks — even when nothing in your knowledge base is
          actually relevant. It has no built-in notion of "I found nothing good." Hand those weak chunks to the LLM and
          it will often <strong className="text-white">confidently answer from them anyway</strong>, producing a fluent
          but wrong response.
        </p>
        <Callout variant="insight">
          The mental model: retrieval is a search that never says "no results". Your job is to add the judgement that
          vector search lacks — decide whether the results are <em>good enough</em> before trusting them.
        </Callout>
      </LessonSection>

      <LessonSection title="Defense 1 — Similarity thresholds (gate on confidence)">
        <p>
          Every retrieved chunk comes with a similarity score (e.g. cosine similarity). A{' '}
          <strong className="text-white">similarity threshold</strong> rejects chunks whose score falls below a cutoff,
          so weak matches never reach the prompt. If <em>every</em> chunk is below the cutoff, you treat it as{' '}
          <strong className="text-white">"no relevant context found"</strong> and trigger a fallback instead of
          generating.
        </p>
        <Example
          title="Gating retrieval on a similarity threshold"
          output={`Query: "What is the refund window for store items?"
  chunk A  score 0.81  -> KEEP
  chunk B  score 0.74  -> KEEP
  chunk C  score 0.29  -> drop (below 0.6)
Kept 2 chunks -> proceed to generation

Query: "What is the CEO's dog's name?"
  best score 0.31  -> below 0.6
No chunk passed the threshold -> FALLBACK (refuse)`}
          caption="The threshold turns 'always returns something' into 'returns something only if it's good enough'."
        >{`THRESHOLD = 0.60   # tune per embedding model + dataset

def gate(results):
    kept = [(c, s) for c, s in results if s >= THRESHOLD]
    return kept

good = [("chunk A", 0.81), ("chunk B", 0.74), ("chunk C", 0.29)]
bad  = [("best", 0.31)]

for label, res in (("good", good), ("bad", bad)):
    kept = gate(res)
    if kept:
        print(f"{label}: keep {len(kept)} chunks -> generate")
    else:
        print(f"{label}: nothing passed -> FALLBACK (refuse)")`}</Example>
        <Callout variant="tip">
          Thresholds are <strong className="text-white">model- and dataset-specific</strong> — a "good" cosine score for
          one embedding model is different for another. Set the cutoff empirically: look at scores for known-good vs
          known-bad queries on your golden set and pick a value that separates them.
        </Callout>
      </LessonSection>

      <LessonSection title="Defense 2 — Metadata filtering (search the right subset)">
        <p>
          Often a chunk is semantically similar but <em>contextually</em> wrong — the right answer for the{' '}
          <em>wrong</em> document, tenant, language, or time period. <strong className="text-white">Metadata
          filtering</strong> applies hard filters <em>before or alongside</em> the vector search so only eligible chunks
          can be returned.
        </p>
        <Example
          title="Filter first, then rank by similarity"
          output={`Unfiltered top-3:
  [ProjectX, 2021]  score 0.88  <- similar but outdated + wrong project
  [ProjectY, 2024]  score 0.82
  [ProjectY, 2023]  score 0.80

With filter {project: 'ProjectY', year >= 2023}:
  [ProjectY, 2024]  score 0.82
  [ProjectY, 2023]  score 0.80`}
          caption="Metadata filters remove chunks that are similar in wording but wrong in context."
        >{`results = [
    {"text": "chunkA", "project": "ProjectX", "year": 2021, "score": 0.88},
    {"text": "chunkB", "project": "ProjectY", "year": 2024, "score": 0.82},
    {"text": "chunkC", "project": "ProjectY", "year": 2023, "score": 0.80},
]

def keep(r):
    return r["project"] == "ProjectY" and r["year"] >= 2023

filtered = [r for r in results if keep(r)]
for r in filtered:
    print(f"[{r['project']}, {r['year']}] score {r['score']}")`}</Example>
      </LessonSection>

      <LessonSection title="Defense 3 — Reranking (fix the ordering)">
        <p>
          Sometimes the right chunk <em>is</em> retrieved but ranked too low (say rank 8), so it gets cut when you keep
          only the top few. A <strong className="text-white">cross-encoder reranker</strong> re-scores the top ~20
          candidates by reading each chunk <em>together with</em> the query, pushing the truly relevant one to the top.
          (Full mechanics in <em>MMR &amp; Reranking</em>.)
        </p>
        <Callout variant="info">
          Order of operations matters: <strong className="text-white">filter → retrieve (over-fetch) → rerank → threshold →
          keep top-k</strong>. Over-fetch (e.g. 20) so the reranker has good candidates, then trim to the final 3–5.
        </Callout>
      </LessonSection>

      <LessonSection title="Defense 4 — Query rewriting (fix the question)">
        <p>
          Retrieval can fail because the <em>query</em> is a poor search key — too short, full of pronouns, misspelled,
          or phrased differently from the documents. <strong className="text-white">Query rewriting</strong> reshapes the
          question before searching:
        </p>
        <ul className="mt-2 list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Rewrite / expand</strong> — an LLM turns "how long do I have?" into "what is
            the refund time window for company store purchases?".
          </li>
          <li>
            <strong className="text-white">Multi-query</strong> — generate several phrasings, retrieve for each, and merge
            results (improves recall). See <em>Advanced Retrieval Strategies</em>.
          </li>
          <li>
            <strong className="text-white">Conversational rewrite</strong> — resolve "and what about that one?" into a
            standalone query using chat history.
          </li>
          <li>
            <strong className="text-white">HyDE</strong> — generate a hypothetical answer and search with <em>that</em>,
            since answers look more like documents than questions do.
          </li>
        </ul>
      </LessonSection>

      <LessonSection title="Putting it together — the fallback decision tree">
        <p>
          When confidence is low, don't force an answer. Escalate through cheaper-to-more-expensive recovery steps, and if
          all fail, refuse honestly.
        </p>
        <Flowchart
          title="Low-confidence fallback chain"
          chart={`flowchart TB
  A["Retrieve (with metadata filter)"] --> B{"Any chunk above threshold?"}
  B -- yes --> C["Rerank -> keep top-k -> generate"]
  B -- no --> D["Rewrite / expand query, retry once"]
  D --> E{"Now above threshold?"}
  E -- yes --> C
  E -- no --> F["Try hybrid (BM25 + dense) retry"]
  F --> G{"Above threshold?"}
  G -- yes --> C
  G -- no --> H["Refuse: 'I couldn't find this' + offer human handoff"]`}
        />
        <Callout variant="beginner" title="Refusing is a feature, not a failure">
          A system that says <em>"I couldn't find that in the handbook — please contact HR"</em> is more trustworthy than
          one that invents a confident wrong answer. Wire the refusal message into your system prompt (see{' '}
          <em>Augmentation &amp; Generation</em>) so the model has an approved way to say "I don't know".
        </Callout>
        <div className="mt-4 overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Failure signal</th>
                <th className="px-4 py-3">First remedy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Top score below threshold', 'Rewrite/expand query, then retry'],
                ['Right chunk retrieved but ranked low', 'Add a cross-encoder reranker'],
                ['Similar wording, wrong document/date', 'Metadata filtering'],
                ['Exact IDs/codes missed by semantic search', 'Hybrid (BM25 + dense)'],
                ['Nothing works after retries', 'Refuse honestly + human handoff'],
              ].map(([signal, remedy]) => (
                <tr key={signal} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{signal}</td>
                  <td className="px-4 py-3 text-slate-400">{remedy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Vector search always returns something — it never says "no good results", so you must add that judgement yourself.',
          'Similarity thresholds gate on confidence: drop weak chunks, and if none pass, trigger a fallback instead of generating.',
          'Metadata filtering removes chunks that are similar in wording but wrong in context (project, tenant, date, language).',
          'Reranking rescues the right chunk when it is retrieved but ranked too low; query rewriting fixes weak questions.',
          'Escalate low-confidence cases (rewrite → hybrid retry) and refuse honestly with a human handoff rather than inventing an answer.',
        ]}
      />
    </LessonArticle>
  )
}
