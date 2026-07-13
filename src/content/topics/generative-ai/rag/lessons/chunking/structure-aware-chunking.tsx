import {
  Callout,
  ContentStep,
  Definition,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function StructureAwareChunking() {
  return (
    <LessonArticle>
      <Definition term="Structure-aware chunking">
        <p>
          <strong className="text-white">Structure-aware chunking</strong> splits a document along its built-in
          organization — headings, pages, table rows, or database records — instead of counting characters.
          Each chunk maps to a logical unit the author already created, like a textbook chapter or a FAQ entry.
        </p>
        <p>
          If recursive chunking is "cut every 500 tokens at the nearest sentence," structure-aware chunking
          is "one index card per section heading the author wrote."
        </p>
      </Definition>

      <LessonSection title="Why structure beats character counts">
        <p className="text-slate-300">
          Many documents already have clear boundaries. A wiki has headings. A PDF has pages. A FAQ spreadsheet
          has one question-and-answer per row. Ignoring that structure and counting characters is like
          re-chaptering a textbook with a ruler instead of using the author's table of contents.
        </p>
        <p className="mt-4 text-slate-300">
          Structure-aware chunking produces chunks that are <em>self-contained by design</em>. A chunk titled
          "Refund Policy" contains everything under that heading — no unrelated shipping rules mixed in.
        </p>

        <Callout variant="beginner">
          Use structure-aware chunking when your documents have obvious sections. Use recursive character
          splitting (the previous lesson) when you have unstructured prose with no headings or layout.
        </Callout>
      </LessonSection>

      <LessonSection title="Heading-based splitting (Markdown and HTML)">
        <p className="mb-4 text-slate-300">
          Wikis, documentation sites, and README files use headings (<code className="text-genai-400">##</code>{' '}
          in Markdown, <code className="text-genai-400">&lt;h2&gt;</code> in HTML) to organize content. The
          splitter creates one chunk per heading section and stores the heading as metadata.
        </p>

        <div className="rounded-xl border border-surface-600 bg-surface-900 p-4 text-sm">
          <div className="text-xs font-medium text-slate-400">Before — one Markdown document</div>
          <div className="mt-2 space-y-2 font-mono text-slate-200">
            <div>## Refund Policy</div>
            <div>Returns are accepted within 30 days of purchase. Customers must provide proof of purchase
            and the original packaging. Refunds are processed within 5–7 business days.</div>
            <div className="mt-2">## Shipping Policy</div>
            <div>Free shipping on orders over $50. Standard delivery takes 3–5 business days. Express
            shipping is available for $15.</div>
            <div className="mt-2">## Warranty</div>
            <div>All products carry a 1-year manufacturer warranty covering defects.</div>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-surface-600 bg-surface-900 p-4 text-sm">
          <div className="text-xs font-medium text-slate-400">After — one index card per heading</div>
          <div className="mt-2 space-y-2 font-mono text-slate-200">
            <div className="border-l-2 border-genai-500 pl-3">
              Chunk 1 [heading: "Refund Policy"]: "Returns are accepted within 30 days of purchase.
              Customers must provide proof of purchase and the original packaging. Refunds are processed
              within 5–7 business days."
            </div>
            <div className="border-l-2 border-genai-500 pl-3">
              Chunk 2 [heading: "Shipping Policy"]: "Free shipping on orders over $50. Standard delivery
              takes 3–5 business days. Express shipping is available for $15."
            </div>
            <div className="border-l-2 border-genai-500 pl-3">
              Chunk 3 [heading: "Warranty"]: "All products carry a 1-year manufacturer warranty covering
              defects."
            </div>
          </div>
          <div className="mt-3 text-xs text-genai-400">
            User asks "How long do refunds take?" → Chunk 1 is retrieved with the heading attached. Perfect
            topical match.
          </div>
        </div>

        <Callout variant="tip">
          If a section under one heading is very long (more than ~1,000 tokens / ~4,000 characters), combine
          heading-based splitting with recursive splitting inside that section. First split by heading, then
          sub-split oversized sections at sentence boundaries.
        </Callout>
      </LessonSection>

      <LessonSection title="Page-based splitting (PDFs)">
        <p className="text-slate-300">
          For PDF documents — especially legal contracts, manuals, and reports — each page is a natural
          boundary. The splitter creates one chunk per page (or per group of 2–3 short pages) and stores the
          page number in metadata.
        </p>

        <ContentStep number={1} title="Why page numbers matter">
          <p>
            When the LLM cites a source, users expect "see page 12 of the contract." Page-based metadata
            makes that possible. Heading-based splitting does not work well on PDFs because headings are
            often just bold text with no machine-readable structure.
          </p>
        </ContentStep>

        <ContentStep number={2} title="Before and after">
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-3 font-mono text-sm text-slate-200">
            <div className="text-slate-400">Before: 47-page employment contract (1 blob)</div>
            <div className="mt-2 text-slate-400">After:</div>
            <div className="mt-1 border-l-2 border-genai-500 pl-3">
              Chunk 1 [page: 4]: "Section 3.2 — Termination. Either party may terminate with 30 days
              written notice..."
            </div>
            <div className="mt-1 border-l-2 border-genai-500 pl-3">
              Chunk 2 [page: 5]: "Section 3.3 — Non-compete. Employee agrees not to compete for 12
              months..."
            </div>
          </div>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Record-based splitting (FAQs and databases)">
        <p className="mb-4 text-slate-300">
          Structured data already comes in rows. A CSV of FAQs, a JSON array of product specs, or a database
          table — each row is one self-contained fact. <strong className="text-white">Record-based
          splitting</strong> makes one chunk per row.
        </p>

        <div className="rounded-xl border border-surface-600 bg-surface-900 p-4 text-sm">
          <div className="text-xs font-medium text-slate-400">Before — FAQ spreadsheet (3 rows)</div>
          <div className="mt-2 font-mono text-slate-200">
            <div>Row 1: Q="What is the refund window?" A="30 days from purchase date."</div>
            <div>Row 2: Q="Do you offer free shipping?" A="Yes, on orders over $50."</div>
            <div>Row 3: Q="What is the warranty period?" A="1 year from date of purchase."</div>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-surface-600 bg-surface-900 p-4 text-sm">
          <div className="text-xs font-medium text-slate-400">After — one index card per FAQ</div>
          <div className="mt-2 space-y-2 font-mono text-slate-200">
            <div className="border-l-2 border-genai-500 pl-3">
              Chunk 1: Q: "What is the refund window?" A: "30 days from purchase date."
            </div>
            <div className="border-l-2 border-genai-500 pl-3">
              Chunk 2: Q: "Do you offer free shipping?" A: "Yes, on orders over $50."
            </div>
            <div className="border-l-2 border-genai-500 pl-3">
              Chunk 3: Q: "What is the warranty period?" A: "1 year from date of purchase."
            </div>
          </div>
        </div>

        <Callout variant="insight">
          Always keep the question and answer together in the same chunk. If you split them apart, a user
          asking "What is the refund window?" might retrieve only the answer "30 days" with no context about
          refunds.
        </Callout>
      </LessonSection>

      <LessonSection title="Which splitter for which document?">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Document type</th>
                <th className="px-4 py-3">Best splitter</th>
                <th className="px-4 py-3">Why</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Wiki / Markdown docs', 'Heading-based', 'Authors already organized by sections'],
                ['Legal PDFs / contracts', 'Page-based', 'Page citations matter; no clean headings'],
                ['FAQ / CSV / database', 'Record-based', 'Each row is already one fact'],
                ['Blog posts / emails', 'Recursive character', 'No consistent structure to follow'],
                ['Long reports (mixed)', 'Heading + recursive', 'Headings first, then sub-split long sections'],
              ].map(([doc, splitter, why]) => (
                <tr key={doc} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 text-slate-400">{doc}</td>
                  <td className="px-4 py-3 font-semibold text-white">{splitter}</td>
                  <td className="px-4 py-3 text-slate-400">{why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Metadata is the hidden superpower">
        <p className="text-slate-300">
          Structure-aware chunking automatically gives you rich metadata — headings, page numbers, record IDs.
          This metadata does not get embedded, but it powers two critical features:
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Filtering</strong> — "Search only chunks from the 2024 policy,
            page 4–10" instead of searching everything.
          </li>
          <li>
            <strong className="text-white">Citations</strong> — the LLM can say "According to the Refund
            Policy section..." or "See page 12 of the contract."
          </li>
        </ul>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Structure-aware chunking splits on headings, pages, or records — not character counts.',
          'Each chunk is a self-contained section, like one textbook chapter or one FAQ card.',
          'Heading-based for wikis, page-based for PDFs, record-based for FAQs and databases.',
          'Store heading/page metadata for filtering and citations.',
          'For unstructured prose with no sections, fall back to recursive character splitting.',
        ]}
      />
    </LessonArticle>
  )
}
