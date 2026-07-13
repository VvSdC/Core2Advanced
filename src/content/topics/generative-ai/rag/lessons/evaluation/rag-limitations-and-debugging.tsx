import {
  Callout,
  ContentStep,
  Definition,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function RagLimitationsAndDebugging() {
  return (
    <LessonArticle>
      <Definition term="RAG limitations">
        <p>
          RAG is powerful but not universal. Some questions cannot be answered by retrieving a few document
          chunks — no matter how good your retrieval, embeddings, or LLM. Knowing these limits saves you from
          weeks of tuning a pipeline that cannot possibly work for certain query types.
        </p>
      </Definition>

      <LessonSection title="When RAG cannot help — know the boundaries">
        <div className="space-y-3">
          <div className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
            <p className="text-sm font-semibold text-white">Multi-hop reasoning</p>
            <p className="mt-1 text-sm text-slate-400">
              "Who managed the team that built product X?" needs two lookups chained together. Standard RAG
              retrieves once and cannot connect facts across distant chunks. Fix: query decomposition (Advanced
              Retrieval) or agentic RAG with multiple retrieval steps.
            </p>
          </div>
          <div className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
            <p className="text-sm font-semibold text-white">Full-corpus summarisation</p>
            <p className="mt-1 text-sm text-slate-400">
              "Summarise all customer complaints this year" requires reading every document, not retrieving five
              chunks. RAG retrieves a sample; summarisation needs the whole dataset. Fix: use a different
              architecture (map-reduce, SQL aggregation).
            </p>
          </div>
          <div className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
            <p className="text-sm font-semibold text-white">Contradictory documents</p>
            <p className="mt-1 text-sm text-slate-400">
              Chunk A says "30-day refund" and chunk B says "60-day refund" (old vs updated policy). The LLM
              may blend them, pick one arbitrarily, or hallucinate a compromise. Fix: deduplicate and version
              your index; add metadata filters for "latest" documents.
            </p>
          </div>
          <div className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
            <p className="text-sm font-semibold text-white">Stale index</p>
            <p className="mt-1 text-sm text-slate-400">
              Documents were updated last week but the vector store still has last month's embeddings. Users get
              outdated answers confidently. Fix: set up a re-indexing pipeline triggered by document changes.
            </p>
          </div>
          <div className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
            <p className="text-sm font-semibold text-white">Tabular and numerical data</p>
            <p className="mt-1 text-sm text-slate-400">
              "What was Q3 revenue for the EMEA region?" lives in a spreadsheet, not prose. Embeddings poorly
              capture numbers in tables. Fix: route tabular queries to SQL or a structured data tool instead of
              RAG.
            </p>
          </div>
          <div className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
            <p className="text-sm font-semibold text-white">Very large single documents</p>
            <p className="mt-1 text-sm text-slate-400">
              A 200-page legal contract where the answer spans pages 40–60 with no clear section boundary.
              Chunking splits the answer across many pieces. Fix: structure-aware chunking or parent-document
              retrieval.
            </p>
          </div>
        </div>
      </LessonSection>

      <LessonSection title="The debugging playbook — symptom to fix">
        <p className="text-slate-300">
          When a RAG answer is wrong, do not guess what to fix. Follow this decision tree: check retrieval
          first, then generation, then infrastructure.
        </p>

        <ContentStep number={1} title="Wrong or missing answers — check retrieval first">
          <div className="mt-3 overflow-x-auto rounded-xl border border-surface-600">
            <table className="w-full text-sm text-slate-300">
              <thead>
                <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                  <th className="px-4 py-3">Symptom</th>
                  <th className="px-4 py-3">Check first</th>
                  <th className="px-4 py-3">Then try</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 text-slate-400">Answer is wrong or says "I don't know"</td>
                  <td className="px-4 py-3 font-semibold text-white">Is the correct chunk in top-k?</td>
                  <td className="px-4 py-3 text-slate-400">No → tune chunk size, then hybrid search, then reranker</td>
                </tr>
              </tbody>
            </table>
          </div>
        </ContentStep>

        <ContentStep number={2} title="Retrieves wrong domain — check metadata">
          <div className="mt-3 overflow-x-auto rounded-xl border border-surface-600">
            <table className="w-full text-sm text-slate-300">
              <tbody>
                <tr className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 text-slate-400 w-1/3">User asks about billing, gets HR policy</td>
                  <td className="px-4 py-3 font-semibold text-white w-1/3">Do chunks have category metadata?</td>
                  <td className="px-4 py-3 text-slate-400 w-1/3">Add metadata filters (department, date, product)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </ContentStep>

        <ContentStep number={3} title="Exact IDs not found — check keyword search">
          <div className="mt-3 overflow-x-auto rounded-xl border border-surface-600">
            <table className="w-full text-sm text-slate-300">
              <tbody>
                <tr className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 text-slate-400 w-1/3">"SKU-48291" returns nothing useful</td>
                  <td className="px-4 py-3 font-semibold text-white w-1/3">Is BM25 in the pipeline?</td>
                  <td className="px-4 py-3 text-slate-400 w-1/3">Add hybrid search with RRF</td>
                </tr>
              </tbody>
            </table>
          </div>
        </ContentStep>

        <ContentStep number={4} title="Good retrieval, bad answers — check generation">
          <div className="mt-3 overflow-x-auto rounded-xl border border-surface-600">
            <table className="w-full text-sm text-slate-300">
              <tbody>
                <tr className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 text-slate-400 w-1/3">Right chunks retrieved but answer hallucinates</td>
                  <td className="px-4 py-3 font-semibold text-white w-1/3">Temperature and prompt instructions?</td>
                  <td className="px-4 py-3 text-slate-400 w-1/3">Lower T to 0; add "only use provided context"</td>
                </tr>
              </tbody>
            </table>
          </div>
        </ContentStep>

        <ContentStep number={5} title="Slow responses — check where time is spent">
          <div className="mt-3 overflow-x-auto rounded-xl border border-surface-600">
            <table className="w-full text-sm text-slate-300">
              <tbody>
                <tr className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 text-slate-400 w-1/3">Answers take 5+ seconds</td>
                  <td className="px-4 py-3 font-semibold text-white w-1/3">Measure retrieve vs generate latency</td>
                  <td className="px-4 py-3 text-slate-400 w-1/3">ANN index tuning; reduce k; cache frequent queries</td>
                </tr>
              </tbody>
            </table>
          </div>
        </ContentStep>
      </LessonSection>

      <LessonSection title="The tuning order — never skip steps">
        <p className="text-slate-300">
          RAG has a natural fix order. Jumping to reranking when chunking is broken wastes time. Follow this
          sequence every time:
        </p>
        <ContentStep number={1} title="Chunking — size, overlap, strategy">
          <p>
            If the answer is split across chunk boundaries or chunks are too large to be precise, no retrieval
            method will help. Fix chunking first. Try 256–512 tokens with 10–20% overlap as a starting point.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Embeddings — model choice and prefixes">
          <p>
            A better embedding model can jump Recall@5 by 10–20 percentage points. Ensure you use the same model
            at index and query time. Some models need "query:" and "passage:" prefixes.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Retrieval — dense → hybrid → reranking">
          <p>
            Start with dense (k=5). Add BM25 hybrid if exact matches fail. Add reranking if right chunks rank
            too low. Add MMR if results are redundant. Add advanced strategies (HyDE, multi-query) only as a
            last resort.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Prompt and generation — grounding, temperature">
          <p>
            Only after retrieval passes Recall@5 ≥ 80%. Strengthen grounding instructions, lower temperature,
            and test faithfulness on your evaluation set.
          </p>
        </ContentStep>
        <Callout variant="insight">
          The #1 debugging mistake: blaming the LLM when retrieval never found the right chunk. Always inspect
          the retrieved chunks before reading the generated answer. Nine times out of ten, the fix is upstream.
        </Callout>
      </LessonSection>

      <LessonSection title="Quick diagnostic checklist">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Symptom</th>
                <th className="px-4 py-3">Most likely cause</th>
                <th className="px-4 py-3">First fix to try</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Answer is completely wrong', 'Correct chunk not in top-k', 'Fix chunking, then hybrid search'],
                ['Answer is partially right', 'Only some relevant chunks retrieved', 'Increase k or add multi-query'],
                ['Answer invents facts', 'LLM ignoring context', 'Lower temperature; strengthen grounding prompt'],
                ['Answer is outdated', 'Stale vector index', 'Re-index documents on change'],
                ['Answer about wrong topic', 'No metadata filtering', 'Add category/product filters'],
                ['Same answer for different questions', 'Chunks too large or redundant', 'Reduce chunk size; add MMR'],
                ['Works in testing, fails in production', 'Test set does not match real queries', 'Collect real user questions for eval set'],
              ].map(([symptom, cause, fix]) => (
                <tr key={symptom} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 text-slate-400">{symptom}</td>
                  <td className="px-4 py-3 text-slate-400">{cause}</td>
                  <td className="px-4 py-3 font-semibold text-white">{fix}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <Callout variant="beginner" title="Next up — LangChain">
        You now understand RAG end to end — from chunking through retrieval to evaluation. The{' '}
        <em>LangChain</em> sub-topic shows how to implement this entire pipeline in Python with real code.
      </Callout>

      <KeyTakeaways
        items={[
          'RAG fails on multi-hop reasoning, full-corpus summarisation, contradictions, stale indexes, and tabular data.',
          'Debug in order: chunking → embeddings → retrieval → generation. Never skip steps.',
          'Always check if the correct chunk is in top-k before blaming the LLM.',
          'Use the symptom → fix table as a decision tree, not a guessing game.',
        ]}
      />
    </LessonArticle>
  )
}
