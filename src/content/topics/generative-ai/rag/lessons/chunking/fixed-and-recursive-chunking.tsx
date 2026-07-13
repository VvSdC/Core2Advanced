import {
  Callout,
  ContentStep,
  Definition,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function FixedAndRecursiveChunking() {
  return (
    <LessonArticle>
      <Definition term="Fixed-size chunking">
        <p>
          <strong className="text-white">Fixed-size chunking</strong> cuts a document every N characters or
          N tokens — like using a paper cutter set to exactly 100 characters, regardless of where sentences
          begin or end. It is the simplest strategy: predictable, fast, and easy to implement.
        </p>
      </Definition>

      <LessonSection title="How fixed-size chunking works">
        <p className="text-slate-300">
          You pick a number — say 100 characters or 500 tokens — and slice the document into equal-sized
          pieces. The splitter does not care about paragraphs, sentences, or meaning. It just counts and cuts.
        </p>
        <p className="mt-4 text-slate-300">
          Remember the token rule of thumb: <strong className="text-white">~4 characters ≈ 1 token</strong>.
          So 100 characters is roughly 25 tokens, and 500 tokens is roughly 2,000 characters (about one
          meaty paragraph).
        </p>

        <div className="mt-4 rounded-xl border border-surface-600 bg-surface-900 p-4 text-sm">
          <div className="text-xs font-medium text-slate-400">Original text (one paragraph)</div>
          <div className="mt-2 font-mono text-slate-200">
            "Our refund policy allows returns within 30 days of purchase. Customers must provide proof of
            purchase and the original packaging. Refunds are processed within 5–7 business days."
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-surface-600 bg-surface-900 p-4 text-sm">
          <div className="text-xs font-medium text-slate-400">After fixed-size splitting (100 characters)</div>
          <div className="mt-2 space-y-2 font-mono text-slate-200">
            <div className="border-l-2 border-amber-500 pl-3">
              Chunk 1: "Our refund policy allows returns within 30 days of purchase. Customers must provide
              proof of"
            </div>
            <div className="border-l-2 border-amber-500 pl-3">
              Chunk 2: "purchase. Customers must provide proof of purchase and the original packaging.
              Refunds are pro"
            </div>
            <div className="border-l-2 border-amber-500 pl-3">
              Chunk 3: "cessed within 5–7 business days."
            </div>
          </div>
          <div className="mt-3 text-xs text-amber-400">
            Problems: "proof of" and "purchase" are split apart. "Refunds are pro" is cut mid-word. Neither
            chunk makes complete sense on its own.
          </div>
        </div>

        <Callout variant="beginner">
          Fixed-size chunking is like tearing pages out of a textbook every 10 centimetres. Fast and uniform,
          but you will cut through the middle of diagrams, tables, and sentences.
        </Callout>
      </LessonSection>

      <Definition term="Recursive character splitting">
        <p>
          <strong className="text-white">Recursive character splitting</strong> tries to break the document at
          natural boundaries — paragraphs first, then sentences, then words — and only resorts to hard cuts
          when a section is still too long. It is the most common default in production RAG systems.
        </p>
      </Definition>

      <LessonSection title="How recursive splitting works">
        <p className="mb-4 text-slate-300">
          The algorithm works like a patient editor with a maximum word count. It tries the gentlest split
          first and gets more aggressive only when needed:
        </p>

        <ContentStep number={1} title="Try splitting on paragraph breaks (\n\n)">
          <p>
            If every resulting piece fits under the size limit, you are done. Each chunk is a full paragraph
            — clean and self-contained.
          </p>
        </ContentStep>

        <ContentStep number={2} title="If a piece is still too long, split on sentences (. ! ?)">
          <p>
            Long paragraphs get broken at sentence boundaries. "Our refund policy allows returns within 30
            days." stays intact as one chunk.
          </p>
        </ContentStep>

        <ContentStep number={3} title="If still too long, split on words (spaces)">
          <p>
            Very long sentences (common in legal text) get broken at word boundaries — never mid-word.
          </p>
        </ContentStep>

        <ContentStep number={4} title="Last resort: hard character cut">
          <p>
            Only if a single word exceeds the limit (rare) does the splitter cut by raw character count.
          </p>
        </ContentStep>

        <div className="mt-4 rounded-xl border border-surface-600 bg-surface-900 p-4 text-sm">
          <div className="text-xs font-medium text-slate-400">Same paragraph — recursive splitting (500 tokens)</div>
          <div className="mt-2 space-y-2 font-mono text-slate-200">
            <div className="border-l-2 border-genai-500 pl-3">
              Chunk 1: "Our refund policy allows returns within 30 days of purchase."
            </div>
            <div className="border-l-2 border-genai-500 pl-3">
              Chunk 2: "Customers must provide proof of purchase and the original packaging."
            </div>
            <div className="border-l-2 border-genai-500 pl-3">
              Chunk 3: "Refunds are processed within 5–7 business days."
            </div>
          </div>
          <div className="mt-3 text-xs text-genai-400">
            Every chunk is a complete sentence. Each one works as a standalone index card.
          </div>
        </div>
      </LessonSection>

      <LessonSection title="Side-by-side comparison">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Strategy</th>
                <th className="px-4 py-3">How it splits</th>
                <th className="px-4 py-3">Pros</th>
                <th className="px-4 py-3">Cons</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              <tr className="hover:bg-surface-800/50">
                <td className="px-4 py-3 font-semibold text-white">Fixed-size</td>
                <td className="px-4 py-3 text-slate-400">Every N chars/tokens, no exceptions</td>
                <td className="px-4 py-3 text-slate-400">Simple, fast, uniform chunk lengths</td>
                <td className="px-4 py-3 text-slate-400">Cuts sentences and words in half</td>
              </tr>
              <tr className="hover:bg-surface-800/50">
                <td className="px-4 py-3 font-semibold text-white">Recursive</td>
                <td className="px-4 py-3 text-slate-400">Paragraphs → sentences → words → chars</td>
                <td className="px-4 py-3 text-slate-400">Respects natural boundaries; production default</td>
                <td className="px-4 py-3 text-slate-400">Slightly variable chunk sizes</td>
              </tr>
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="When to use which">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Use fixed-size</strong> only for quick prototypes, log files, or
            data with no sentence structure (raw CSV dumps, code without comments).
          </li>
          <li>
            <strong className="text-white">Use recursive</strong> for almost everything else — wikis, policy
            docs, articles, emails, and any normal prose.
          </li>
        </ul>

        <Callout variant="tip">
          Default starting point for production: <strong className="text-white">recursive splitting</strong>{' '}
          with <strong className="text-white">chunk_size = 500 tokens</strong> (~2,000 characters) and{' '}
          <strong className="text-white">overlap = 50 tokens</strong> (~200 characters). The overlap lesson
          explains why that second number matters.
        </Callout>
      </LessonSection>

      <LessonSection title="A longer before/after example">
        <p className="mb-4 text-slate-300">
          Here is a three-paragraph company policy. Watch how each strategy handles it differently:
        </p>

        <div className="rounded-xl border border-surface-600 bg-surface-900 p-4 text-sm">
          <div className="text-xs font-medium text-slate-400">Original document</div>
          <div className="mt-2 space-y-3 font-mono text-slate-200">
            <div>
              Para 1: "All employees are entitled to 15 vacation days per calendar year. Days accrue at 1.25
              per month."
            </div>
            <div>
              Para 2: "Sick leave is separate from vacation. Employees receive 10 sick days annually with no
              rollover."
            </div>
            <div>
              Para 3: "Remote work is permitted up to 3 days per week with prior manager approval."
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-surface-600 bg-surface-900 p-4 text-sm">
          <div className="text-xs font-medium text-slate-400">Fixed-size (80 chars) — messy cuts</div>
          <div className="mt-2 space-y-1 font-mono text-slate-200">
            <div className="text-amber-400">"...1.25 per month. Sick leave is separ" | "ate from vacation. Employees recei" | ...</div>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-surface-600 bg-surface-900 p-4 text-sm">
          <div className="text-xs font-medium text-slate-400">Recursive (500 tokens) — clean paragraphs</div>
          <div className="mt-2 space-y-2 font-mono text-slate-200">
            <div className="border-l-2 border-genai-500 pl-3">Chunk 1: entire Para 1 (vacation days)</div>
            <div className="border-l-2 border-genai-500 pl-3">Chunk 2: entire Para 2 (sick leave)</div>
            <div className="border-l-2 border-genai-500 pl-3">Chunk 3: entire Para 3 (remote work)</div>
          </div>
        </div>

        <Callout variant="insight">
          When paragraphs fit within your size limit, recursive splitting often produces one chunk per
          paragraph — like writing one index card per textbook section. That is usually exactly what you want.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Fixed-size cuts every N tokens regardless of content — simple but splits mid-sentence.',
          'Recursive tries paragraphs → sentences → words before hard-cutting — the production default.',
          'Use recursive for normal prose; reserve fixed-size for unstructured logs or quick tests.',
          'Start with 500 tokens chunk size and 50 token overlap with recursive splitting.',
          '~4 characters ≈ 1 token: 500 tokens ≈ one solid paragraph of text.',
        ]}
      />
    </LessonArticle>
  )
}
