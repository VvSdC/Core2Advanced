import {
  Callout,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function SemanticChunking() {
  return (
    <LessonArticle>
      <LessonSection title="What is semantic chunking?">
        <p>
          Instead of fixed sizes or headings, <strong className="text-white">semantic chunking</strong> groups
          sentences that are <em>about the same topic</em>. Boundaries form where meaning shifts — detected by
          embedding similarity between consecutive sentences.
        </p>
        <Flowchart
          title="Semantic boundary detection"
          chart={`flowchart LR
  S1["Sentence 1: Refund policy"] --> C1{"Similar to S2?"}
  C1 -- yes --> S2["Sentence 2: 30-day window"]
  S2 --> C2{"Similar to S3?"}
  C2 -- yes --> S3["Sentence 3: Proof required"]
  S3 --> C3{"Similar to S4?"}
  C3 -- no --> B[Boundary — new chunk]
  B --> S4["Sentence 4: Shipping costs"]`}
        />
      </LessonSection>

      <LessonSection title="How it works">
        <ol className="list-decimal space-y-2 pl-5 text-slate-300">
          <li>Split document into sentences.</li>
          <li>Embed each sentence.</li>
          <li>Compare consecutive sentence embeddings.</li>
          <li>Where similarity drops below a threshold → start a new chunk.</li>
          <li>Optionally merge very small chunks or cap max chunk size.</li>
        </ol>
      </LessonSection>

      <LessonSection title="Example">
        <div className="rounded-xl border border-surface-600 bg-surface-900 p-4 text-sm">
          <div className="text-xs font-medium text-slate-400">Similarity between consecutive sentences</div>
          <div className="mt-2 font-mono text-slate-200 space-y-1">
            <div>S1↔S2: 0.91 (refund → 30 days) <span className="text-genai-400">same chunk</span></div>
            <div>S2↔S3: 0.85 (30 days → proof) <span className="text-genai-400">same chunk</span></div>
            <div>S3↔S4: 0.34 (proof → shipping) <span className="text-amber-400">← boundary, new chunk</span></div>
            <div>S4↔S5: 0.88 (shipping → delivery) <span className="text-genai-400">same chunk</span></div>
          </div>
        </div>
      </LessonSection>

      <LessonSection title="Pros and cons">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Pros</th>
                <th className="px-4 py-3">Cons</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-surface-800/50">
                <td className="px-4 py-3 text-slate-400">Chunks are topically coherent; no mid-topic cuts</td>
                <td className="px-4 py-3 text-slate-400">Slower (embed every sentence); variable chunk sizes</td>
              </tr>
            </tbody>
          </table>
        </div>
      </LessonSection>

      <Callout variant="tip">
        Use semantic chunking when documents mix many topics in long paragraphs (reports, research papers).
        For structured docs with clear headings, structure-aware chunking is simpler and equally effective.
      </Callout>

      <KeyTakeaways
        items={[
          'Semantic chunking groups sentences by embedding similarity — boundaries where topics shift.',
          'Produces topically coherent chunks without fixed size limits.',
          'Slower than recursive splitting; best for mixed-topic unstructured prose.',
          'Threshold tuning matters — too low merges unrelated content; too high over-splits.',
        ]}
      />
    </LessonArticle>
  )
}
