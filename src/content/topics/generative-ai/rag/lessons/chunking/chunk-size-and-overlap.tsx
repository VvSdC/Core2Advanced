import {
  Callout,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function ChunkSizeAndOverlap() {
  return (
    <LessonArticle>
      <LessonSection title="The two knobs">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Parameter</th>
                <th className="px-4 py-3">Typical range</th>
                <th className="px-4 py-3">Effect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['chunk_size', '300–1000 tokens', 'Smaller = precise; larger = more context per hit'],
                ['chunk_overlap', '10–20% of size', 'Prevents boundary sentences from being lost'],
              ].map(([param, range, effect]) => (
                <tr key={param} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-mono text-genai-400">{param}</td>
                  <td className="px-4 py-3 text-slate-400">{range}</td>
                  <td className="px-4 py-3 text-slate-400">{effect}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Overlap visualised">
        <Flowchart
          title="Why overlap matters"
          chart={`flowchart LR
  C1["Chunk 1: ...within 30 days of purchase. Customers may..."]
  C2["Chunk 2: ...30 days of purchase. Customers may request..."]
  O["Overlap: '30 days of purchase. Customers may'"]`}
        />
        <p className="mt-4">
          A question about "30-day refund" might target a sentence sitting on a chunk boundary. Overlap ensures
          that sentence appears in two chunks — so retrieval finds it either way.
        </p>
      </LessonSection>

      <LessonSection title="Tuning by use case">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Use case</th>
                <th className="px-4 py-3">chunk_size</th>
                <th className="px-4 py-3">overlap</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['FAQ / short answers', '200–400', '20%'],
                ['General docs / wikis', '500–800', '10–15%'],
                ['Long reports / legal', '800–1200', '10%'],
                ['Code documentation', '300–500', '15–20%'],
              ].map(([use, size, overlap]) => (
                <tr key={use} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 text-slate-400">{use}</td>
                  <td className="px-4 py-3 font-mono text-genai-400">{size}</td>
                  <td className="px-4 py-3 font-mono text-genai-400">{overlap}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="How to tune">
        <ol className="list-decimal space-y-2 pl-5 text-slate-300">
          <li>Start with 500 tokens, 50 overlap, recursive splitting.</li>
          <li>Run 20–50 test questions with known answers in your docs.</li>
          <li>Check if the right chunk appears in top-5 retrieval.</li>
          <li>If answers are incomplete → increase chunk_size. If retrieval is imprecise → decrease it.</li>
          <li>If boundary questions fail → increase overlap.</li>
        </ol>
      </LessonSection>

      <Callout variant="insight">
        Chunk tuning is empirical — no universal optimum. Benchmark on <em>your</em> documents and <em>your</em> questions.
      </Callout>

      <KeyTakeaways
        items={[
          'Default: 500 tokens, 50 overlap, recursive splitting.',
          'Smaller chunks = precise retrieval; larger = more context per hit.',
          'Overlap prevents boundary sentences from falling between chunks.',
          'Tune empirically with labelled test questions on your own data.',
        ]}
      />
    </LessonArticle>
  )
}
