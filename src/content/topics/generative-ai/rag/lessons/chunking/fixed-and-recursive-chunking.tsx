import {
  Callout,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function FixedAndRecursiveChunking() {
  return (
    <LessonArticle>
      <LessonSection title="Fixed-size chunking">
        <p>
          Split every <strong className="text-white">N characters or tokens</strong> regardless of content
          boundaries. Simple and predictable.
        </p>
        <div className="mt-4 rounded-xl border border-surface-600 bg-surface-900 p-4 text-sm">
          <div className="text-xs font-medium text-slate-400">Example — 100-char fixed chunks</div>
          <div className="mt-2 font-mono text-slate-200">
            <div className="border-l-2 border-genai-500 pl-3">Chunk 1: "Our refund policy allows returns within 30 days of purchase. Customers must provide proof of"</div>
            <div className="mt-2 border-l-2 border-amber-500 pl-3">Chunk 2: "purchase. Customers must provide proof of purchase and the original packaging. Refunds are pro"</div>
            <div className="mt-2 text-slate-400 text-xs">↑ sentence cut mid-word — fixed-size weakness</div>
          </div>
        </div>
      </LessonSection>

      <LessonSection title="Recursive character splitting">
        <p>
          Try splitting on <strong className="text-white">paragraphs → sentences → words</strong> until chunks
          fit the size limit. Respects natural boundaries. The most common production default.
        </p>
        <div className="mt-4 rounded-xl border border-surface-600 bg-surface-900 p-4 text-sm">
          <div className="text-xs font-medium text-slate-400">Same document — recursive splitting</div>
          <div className="mt-2 font-mono text-slate-200">
            <div className="border-l-2 border-genai-500 pl-3">Chunk 1: "Our refund policy allows returns within 30 days of purchase."</div>
            <div className="mt-2 border-l-2 border-genai-500 pl-3">Chunk 2: "Customers must provide proof of purchase and the original packaging."</div>
            <div className="mt-2 border-l-2 border-genai-500 pl-3">Chunk 3: "Refunds are processed within 5–7 business days."</div>
          </div>
        </div>
      </LessonSection>

      <LessonSection title="Comparison">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Strategy</th>
                <th className="px-4 py-3">Pros</th>
                <th className="px-4 py-3">Cons</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Fixed-size', 'Simple, uniform chunk lengths', 'Cuts sentences and words in half'],
                ['Recursive', 'Respects paragraphs and sentences', 'Slightly variable chunk sizes'],
              ].map(([strategy, pros, cons]) => (
                <tr key={strategy} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{strategy}</td>
                  <td className="px-4 py-3 text-slate-400">{pros}</td>
                  <td className="px-4 py-3 text-slate-400">{cons}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <Callout variant="tip">Default recommendation: recursive splitting, chunk_size=500 tokens, overlap=50.</Callout>

      <KeyTakeaways
        items={[
          'Fixed-size is simple but cuts mid-sentence; recursive respects structure.',
          'Recursive character splitting is the production default.',
          'Typical starting point: 500 tokens, 50 overlap, recursive separators.',
        ]}
      />
    </LessonArticle>
  )
}
