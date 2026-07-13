import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function ChunkSizeAndOverlap() {
  return (
    <LessonArticle>
      <Definition term="Chunk size and overlap">
        <p>
          <strong className="text-white">Chunk size</strong> is the maximum amount of text in each index card
          (measured in tokens). <strong className="text-white">Overlap</strong> is how much text is repeated
          between neighboring chunks — like writing the last sentence of one flashcard at the top of the
          next, so no idea falls through the crack.
        </p>
        <p>
          These are the two most important tuning knobs in any RAG system. Get them right and retrieval
          works. Get them wrong and even perfect documents fail to surface the right answer.
        </p>
      </Definition>

      <LessonSection title="Understanding tokens first">
        <p className="text-slate-300">
          LLMs and embedding models measure text in <strong className="text-white">tokens</strong> — small
          pieces of text, not quite words and not quite characters. A token might be a whole word ("refund"),
          part of a word ("ing" in "processing"), or a punctuation mark.
        </p>

        <Callout variant="beginner" title="The 4-char rule of thumb">
          You do not need to count tokens exactly. Use this shortcut:{' '}
          <strong className="text-white">~4 characters ≈ 1 token</strong>. So 500 tokens ≈ 2,000 characters
          ≈ one solid paragraph. "Hello world" ≈ 2 tokens. A full page of text ≈ 250–400 tokens.
        </Callout>

        <div className="mt-4 rounded-xl border border-surface-600 bg-surface-900 p-4 text-sm">
          <div className="text-xs font-medium text-slate-400">Token estimates for common text</div>
          <div className="mt-2 space-y-1 font-mono text-slate-200">
            <div>One sentence: "Returns are accepted within 30 days." → ~10 tokens (~40 chars)</div>
            <div>One paragraph: ~100–150 tokens (~400–600 chars)</div>
            <div>One page of a PDF: ~250–400 tokens (~1,000–1,600 chars)</div>
            <div>Entire blog post (800 words): ~1,000–1,200 tokens</div>
          </div>
        </div>
      </LessonSection>

      <LessonSection title="The two knobs explained">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Parameter</th>
                <th className="px-4 py-3">What it controls</th>
                <th className="px-4 py-3">Typical range</th>
                <th className="px-4 py-3">Effect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              <tr className="hover:bg-surface-800/50">
                <td className="px-4 py-3 font-mono text-genai-400">chunk_size</td>
                <td className="px-4 py-3 text-slate-400">Maximum text per index card</td>
                <td className="px-4 py-3 text-slate-400">300–1,000 tokens</td>
                <td className="px-4 py-3 text-slate-400">Smaller = precise retrieval; larger = more context per hit</td>
              </tr>
              <tr className="hover:bg-surface-800/50">
                <td className="px-4 py-3 font-mono text-genai-400">chunk_overlap</td>
                <td className="px-4 py-3 text-slate-400">Shared text between neighbors</td>
                <td className="px-4 py-3 text-slate-400">10–20% of chunk_size</td>
                <td className="px-4 py-3 text-slate-400">Prevents boundary sentences from being lost</td>
              </tr>
            </tbody>
          </table>
        </div>

        <Callout variant="insight">
          Think of chunk size as "how big is each textbook section on my index card?" and overlap as "how
          much of the previous section do I repeat so nothing gets lost at the seam?"
        </Callout>
      </LessonSection>

      <LessonSection title="Smaller chunks vs larger chunks">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-surface-600 bg-surface-900 p-4 text-sm">
            <div className="text-xs font-semibold uppercase tracking-wider text-genai-400">Small chunks (200–400 tokens)</div>
            <p className="mt-2 text-slate-300">
              Like index cards with one fact each. Retrieval is laser-focused — a question about refunds
              finds the refund card, not a card that also mentions shipping.
            </p>
            <p className="mt-2 text-xs text-amber-400">
              Risk: "30 days" without surrounding context about refunds may not match a refund question.
            </p>
          </div>
          <div className="rounded-xl border border-surface-600 bg-surface-900 p-4 text-sm">
            <div className="text-xs font-semibold uppercase tracking-wider text-genai-400">Large chunks (800–1,200 tokens)</div>
            <p className="mt-2 text-slate-300">
              Like index cards with a full textbook section. More context per hit — the LLM sees surrounding
              sentences that clarify the answer.
            </p>
            <p className="mt-2 text-xs text-amber-400">
              Risk: answer buried among unrelated topics; retriever picks the wrong section.
            </p>
          </div>
        </div>
      </LessonSection>

      <LessonSection title="Why overlap matters — a visual explanation">
        <p className="mb-4 text-slate-300">
          Without overlap, a critical sentence sitting right on a chunk boundary might get split in half.
          Neither chunk contains the complete thought, so retrieval misses it entirely.
        </p>

        <div className="rounded-xl border border-surface-600 bg-surface-900 p-4 text-sm">
          <div className="text-xs font-medium text-slate-400">Without overlap — boundary sentence is lost</div>
          <div className="mt-2 space-y-2 font-mono text-slate-200">
            <div className="border-l-2 border-amber-500 pl-3">
              Chunk 1: "...proof of purchase is required. Refunds are processed within"
            </div>
            <div className="border-l-2 border-amber-500 pl-3">
              Chunk 2: "5–7 business days. Contact support for expedited requests."
            </div>
          </div>
          <div className="mt-2 text-xs text-amber-400">
            "Refunds are processed within 5–7 business days" is split across two chunks. A question about
            refund timing may not match either one fully.
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-surface-600 bg-surface-900 p-4 text-sm">
          <div className="text-xs font-medium text-slate-400">With 50-token overlap — sentence appears in both chunks</div>
          <div className="mt-2 space-y-2 font-mono text-slate-200">
            <div className="border-l-2 border-genai-500 pl-3">
              Chunk 1: "...proof of purchase is required. Refunds are processed within 5–7 business days."
            </div>
            <div className="border-l-2 border-genai-500 pl-3">
              Chunk 2: "Refunds are processed within 5–7 business days. Contact support for expedited
              requests."
            </div>
          </div>
          <div className="mt-2 text-xs text-genai-400">
            The full sentence lives in both chunks. Retrieval finds it no matter which chunk is matched.
          </div>
        </div>

        <Flowchart
          title="How overlap bridges the gap"
          chart={`flowchart LR
  C1["Chunk 1: ...proof required. Refunds within 5–7 days."]
  O["Overlap zone: 'Refunds within 5–7 days.'"]
  C2["Chunk 2: Refunds within 5–7 days. Contact support..."]
  C1 --> O
  O --> C2`}
        />
      </LessonSection>

      <LessonSection title="Recommended settings by use case">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Use case</th>
                <th className="px-4 py-3">chunk_size</th>
                <th className="px-4 py-3">overlap</th>
                <th className="px-4 py-3">Why</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['FAQ / short answers', '200–400 tokens', '20% (~40–80)', 'Each answer is short; more overlap protects brief facts'],
                ['General docs / wikis', '500–800 tokens', '10–15% (~50–120)', 'Balanced precision and context — the default range'],
                ['Long reports / legal', '800–1,200 tokens', '10% (~80–120)', 'Sections are long; less overlap needed with big chunks'],
                ['Code documentation', '300–500 tokens', '15–20% (~45–100)', 'Functions are short; overlap keeps signatures with descriptions'],
              ].map(([use, size, overlap, why]) => (
                <tr key={use} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 text-slate-400">{use}</td>
                  <td className="px-4 py-3 font-mono text-genai-400">{size}</td>
                  <td className="px-4 py-3 font-mono text-genai-400">{overlap}</td>
                  <td className="px-4 py-3 text-slate-400">{why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Callout variant="tip">
          If you are unsure where to start: <strong className="text-white">500 tokens, 50 overlap, recursive
          splitting</strong>. That works well for most document types. Tune from there using the process below.
        </Callout>
      </LessonSection>

      <LessonSection title="How to tune — a practical 5-step process">
        <ContentStep number={1} title="Start with the defaults">
          <p>
            500 tokens chunk size, 50 token overlap (~10%), recursive character splitting. Index a sample of
            your documents.
          </p>
        </ContentStep>

        <ContentStep number={2} title="Write 20–50 test questions">
          <p>
            Use real questions your users would ask, with known correct answers in your documents. Example:
            "What is the refund window?" → answer should be "30 days."
          </p>
        </ContentStep>

        <ContentStep number={3} title="Check retrieval — does the right chunk appear?">
          <p>
            For each test question, run retrieval and check if the chunk containing the correct answer shows
            up in the top 5 results. Track your hit rate.
          </p>
        </ContentStep>

        <ContentStep number={4} title="Adjust chunk_size based on what you see">
          <p>
            Answers feel incomplete or missing context? <strong className="text-white">Increase</strong>{' '}
            chunk_size (try 800). Retrieval returns wrong or irrelevant chunks?{' '}
            <strong className="text-white">Decrease</strong> chunk_size (try 300).
          </p>
        </ContentStep>

        <ContentStep number={5} title="Adjust overlap for boundary failures">
          <p>
            Questions about facts that sit right between two chunks keep failing?{' '}
            <strong className="text-white">Increase overlap</strong> (try 15–20%). If overlap is already high
            and retrieval is still imprecise, the problem is likely chunk_size, not overlap.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Common mistakes to avoid">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Zero overlap</strong> — sentences on chunk boundaries get lost.
            Always use at least 10%.
          </li>
          <li>
            <strong className="text-white">Chunks too small</strong> — 50-token chunks lose context. "30
            days" alone does not embed well as a refund answer.
          </li>
          <li>
            <strong className="text-white">Chunks too large</strong> — embedding a whole chapter produces a
            vague vector that matches everything weakly.
          </li>
          <li>
            <strong className="text-white">Tuning by gut feel</strong> — always test with real questions from
            your documents. What works for legal PDFs fails for FAQs.
          </li>
          <li>
            <strong className="text-white">Ignoring overlap cost</strong> — overlap creates duplicate text
            across chunks, increasing storage and embedding cost. 10–20% is the sweet spot; 50% overlap
            doubles your index size for little gain.
          </li>
        </ul>
      </LessonSection>

      <Callout variant="insight">
        Chunk tuning is empirical — there is no universal optimum. A setting that works for one company's
        policy PDFs may fail for another's FAQ database. Benchmark on <em>your</em> documents and{' '}
        <em>your</em> questions.
      </Callout>

      <KeyTakeaways
        items={[
          'chunk_size controls how much text per index card; overlap repeats text at boundaries.',
          '~4 characters ≈ 1 token. Default starting point: 500 tokens, 50 overlap.',
          'Smaller chunks = precise retrieval; larger chunks = more context per hit.',
          'Overlap (10–20%) prevents boundary sentences from falling between chunks.',
          'Tune empirically: write test questions, check top-5 retrieval, adjust size then overlap.',
        ]}
      />
    </LessonArticle>
  )
}
