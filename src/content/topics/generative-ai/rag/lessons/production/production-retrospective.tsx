import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function ProductionRetrospective() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Why this lesson exists">
        This is the lesson the other lessons build toward: <em>"You built a RAG system — what would you do differently?"</em>{' '}
        It's the most common senior-level interview question, and the answer is a tour of everything that bites teams in
        production.
      </Callout>

      <Definition term="RAG retrospective">
        <p>
          A <strong className="text-white">retrospective</strong> is an honest look back at what worked, what didn't, and
          what you'd change. For RAG, most pain comes not from the model but from the{' '}
          <strong className="text-white">boring parts</strong> — data quality, chunking, evaluation, and the gap between
          your test set and real users.
        </p>
      </Definition>

      <LessonSection title="The pattern behind most RAG failures">
        <p>
          Teams overwhelmingly spend their first weeks tuning the LLM and prompt, when the real leverage is upstream. The
          usual order of blame is exactly backwards:
        </p>
        <Flowchart
          title="Where the problem usually is vs where teams look"
          chart={`flowchart TB
  A["Teams look here first: the LLM + prompt"] --> B["...but the fix is usually upstream"]
  B --> C["Retrieval quality"]
  C --> D["Chunking + data cleaning"]
  D --> E["Evaluation (or the lack of it)"]`}
        />
        <Callout variant="insight">
          The single biggest lesson from real deployments: <strong className="text-white">RAG quality is a retrieval and
          data problem far more than a generation problem.</strong> If the right chunk isn't retrieved, no prompt or model
          can save the answer.
        </Callout>
      </LessonSection>

      <LessonSection title="What didn't work — common regrets">
        <ContentStep number={1} title="No evaluation set until it was too late">
          <p>
            Shipping on "it looks good in the demo" is the classic mistake. Without a golden set, every change is a guess
            and you can't tell if a tweak helped or hurt. <strong className="text-white">Do differently:</strong> build a
            30–100 query golden set on day one and re-run it on every change.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Default chunking, never revisited">
          <p>
            "1000 characters, no overlap" is a fine start and a terrible finish. Bad chunk boundaries split answers in
            half so the right passage can never be retrieved whole. <strong className="text-white">Do differently:</strong>{' '}
            use structure-aware chunking, tune size/overlap against the golden set, and check that answers live inside
            single chunks.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Adding reranking and hybrid search too late">
          <p>
            Many "the model is dumb" complaints are really "the right chunk was at rank 8". A cross-encoder reranker and
            hybrid (BM25 + dense) search are cheap wins often delayed for months.{' '}
            <strong className="text-white">Do differently:</strong> add reranking early once recall is decent but MRR is
            low; add BM25 when users search exact IDs, codes, or names.
          </p>
        </ContentStep>
        <ContentStep number={4} title="No fallback — the system guessed instead of refusing">
          <p>
            Without similarity thresholds and a refusal path, the system answered confidently even when retrieval found
            nothing relevant — the fastest way to lose user trust.{' '}
            <strong className="text-white">Do differently:</strong> gate on a threshold and wire in an honest "I couldn't
            find this" fallback (see <em>Handling Bad Retrieval</em>).
          </p>
        </ContentStep>
        <ContentStep number={5} title="Ignoring metadata and freshness">
          <p>
            Serving outdated or wrong-tenant documents produced answers that were "correct" for the wrong context, and a
            stale index kept surfacing deleted policies. <strong className="text-white">Do differently:</strong> store
            rich metadata (source, date, tenant, version), filter on it, and set up re-indexing when documents change.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="The bottlenecks you actually hit">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Bottleneck</th>
                <th className="px-4 py-3">Symptom</th>
                <th className="px-4 py-3">Lesson learned</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Test set ≠ production queries', 'Great offline scores, poor real answers', 'Sample queries from real users, refresh the golden set'],
                ['Messy source data', 'Retrieval finds junk (headers, boilerplate, OCR errors)', 'Cleaning data beats tuning the model'],
                ['Generation latency', 'Slow responses under load', 'Stream output; cache answers for repeat queries'],
                ['Cost at scale', 'LLM bill balloons with traffic', 'Rerank to fewer chunks, cache, right-size the model'],
                ['Stale index', 'Answers cite deleted/old docs', 'Automate re-indexing + cache invalidation'],
              ].map(([bottleneck, symptom, lesson]) => (
                <tr key={bottleneck} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{bottleneck}</td>
                  <td className="px-4 py-3 text-slate-400">{symptom}</td>
                  <td className="px-4 py-3 text-slate-400">{lesson}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="The tradeoffs you'd reconsider">
        <ul className="mt-2 list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">More chunks vs cleaner context</strong> — stuffing more context feels safer but
            usually lowers accuracy and raises cost. Fewer, reranked chunks win.
          </li>
          <li>
            <strong className="text-white">Bigger model vs better retrieval</strong> — upgrading the LLM is the expensive
            fix; improving retrieval is usually cheaper and more effective.
          </li>
          <li>
            <strong className="text-white">Managed vs self-hosted vector DB</strong> — self-hosting saves money until ops
            time (scaling, backups, replication) costs more than the managed bill.
          </li>
          <li>
            <strong className="text-white">RAG vs fine-tuning</strong> — RAG for changing facts and traceability;
            fine-tuning for style/format. Reaching for fine-tuning to "teach facts" is a common misstep.
          </li>
          <li>
            <strong className="text-white">Latency vs quality</strong> — reranking and multi-query improve answers but add
            time; decide per use case what users will tolerate.
          </li>
        </ul>
      </LessonSection>

      <LessonSection title="A build-it-again checklist">
        <Callout variant="tip" title="If I built it again, in this order">
          <ol className="list-decimal space-y-1 pl-5">
            <li>Golden evaluation set before any tuning.</li>
            <li>Clean the source data; structure-aware chunking.</li>
            <li>Solid embedding model chosen by A/B on the golden set.</li>
            <li>Hybrid retrieval + reranking once recall is decent.</li>
            <li>Similarity threshold + honest refusal fallback.</li>
            <li>Grounded prompt + runtime output validation.</li>
            <li>Metadata filtering + automated re-indexing.</li>
            <li>Caching + streaming for latency and cost.</li>
            <li>Continuous eval + human review on real traffic.</li>
          </ol>
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'RAG quality is mostly a retrieval and data problem, not a generation problem — look upstream first.',
          'The top regret is shipping without a golden evaluation set; build it on day one and re-run it on every change.',
          'Default chunking, late reranking/hybrid, and no fallback are the most common avoidable mistakes.',
          'Real bottlenecks: test-set/production mismatch, messy data, generation latency and cost, and stale indexes.',
          'Prefer better retrieval and cleaner, fewer chunks over bigger models and more context; add caching/streaming for scale.',
        ]}
      />
    </LessonArticle>
  )
}
