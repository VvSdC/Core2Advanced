import {
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function StructureAwareChunking() {
  return (
    <LessonArticle>
      <LessonSection title="Split on document structure">
        <p>
          Instead of character counts, split on <strong className="text-white">logical document units</strong> —
          headings, sections, pages, or records. Each chunk is a self-contained section.
        </p>
      </LessonSection>

      <LessonSection title="Markdown / HTML headings">
        <div className="mt-3 rounded-xl border border-surface-600 bg-surface-900 p-4 text-sm">
          <div className="text-xs font-medium text-slate-400">Input document</div>
          <div className="mt-2 font-mono text-slate-200">
            <div>## Refund Policy</div>
            <div>Returns within 30 days...</div>
            <div className="mt-2">## Shipping Policy</div>
            <div>Free shipping on orders over $50...</div>
          </div>
          <div className="mt-4 text-xs font-medium text-slate-400">Resulting chunks</div>
          <div className="mt-2 font-mono text-slate-200">
            <div className="border-l-2 border-genai-500 pl-3">Chunk 1 [heading: Refund Policy]: "Returns within 30 days..."</div>
            <div className="mt-2 border-l-2 border-genai-500 pl-3">Chunk 2 [heading: Shipping Policy]: "Free shipping on orders over $50..."</div>
          </div>
        </div>
      </LessonSection>

      <LessonSection title="PDF page-based splitting">
        <p>
          One chunk per page (or per page group). Metadata stores page number. Works well for legal contracts,
          manuals, and reports where page references matter for citations.
        </p>
      </LessonSection>

      <LessonSection title="Record-based splitting">
        <p>
          For structured data — CSV rows, JSON records, database entries — one chunk per record. A FAQ row becomes
          one chunk: question + answer together.
        </p>
        <div className="mt-3 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>Chunk: Q: "What is the refund window?" A: "30 days from purchase date."</div>
        </div>
      </LessonSection>

      <LessonSection title="When to use">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Document type</th>
                <th className="px-4 py-3">Best splitter</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Wiki / Markdown docs', 'Heading-based'],
                ['Legal PDFs', 'Page-based'],
                ['FAQ / database', 'Record-based'],
                ['Unstructured prose', 'Recursive character'],
              ].map(([doc, splitter]) => (
                <tr key={doc} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 text-slate-400">{doc}</td>
                  <td className="px-4 py-3 font-semibold text-white">{splitter}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Structure-aware chunking splits on headings, pages, or records — not character counts.',
          'Preserves self-contained sections; metadata captures heading/page for citations.',
          'Best for wikis, legal docs, FAQs; use recursive for unstructured prose.',
        ]}
      />
    </LessonArticle>
  )
}
