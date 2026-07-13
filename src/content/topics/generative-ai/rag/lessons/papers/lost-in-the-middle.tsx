import {
  Callout,
  ContentStep,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
  ResearchPaperHeader,
} from '../../../../../../components/content'

const PAPER_URL = 'https://arxiv.org/abs/2307.03172'

export function LostInTheMiddle() {
  return (
    <LessonArticle>
      <ResearchPaperHeader
        title="Lost in the Middle: How Language Models Use Long Contexts"
        authors="Liu et al. (Stanford / UC Berkeley)"
        year="2023"
        url={PAPER_URL}
      >
        Showed that LLMs <strong className="text-white">pay most attention to the start and end</strong> of long
        prompts — and often ignore facts buried in the middle, with direct consequences for RAG chunk count and
        ordering.
      </ResearchPaperHeader>

      <Callout variant="beginner" title="Read this after">
        Read <em>Chunk Size & Overlap</em> and <em>Augmentation & Generation</em>. Those lessons teach how to
        retrieve and stuff context into the LLM. This paper explains why <em>perfect retrieval can still fail</em>{' '}
        if you send too many chunks or put the best one in the wrong position.
      </Callout>

      <LessonSection title="What this paper means in plain English">
        <p>
          In a RAG system, you might think: "If retrieval finds the right paragraph, the LLM will answer
          correctly." This paper proves that logic breaks down once the prompt gets long. Language models do not
          read your context like a human scanning every sentence equally. They tend to lean heavily on what
          appears at the <strong className="text-white">beginning</strong> and{' '}
          <strong className="text-white">end</strong> of the prompt — and under-use what sits in the{' '}
          <strong className="text-white">middle</strong>.
        </p>
        <p>
          Picture a student given a 20-page handout before a quiz. They read the first page carefully, skim the
          middle, and re-read the last page. If the exam answer was on page 11, they might miss it even though
          it was "in the materials." That is the <em>lost-in-the-middle</em> effect. The information was
          provided; the model's attention pattern failed to prioritise it.
        </p>
        <p>
          The researchers did not guess this from theory — they ran controlled experiments. They took
          multi-document question-ansering tasks, placed the one document that contained the answer at different
          positions in the context (first, second, middle, second-to-last, last), and measured accuracy. When the
          gold document landed in the middle slots, scores dropped sharply — even though retrieval was{' '}
          <em>perfect</em> by design. The failure was in <strong className="text-white">generation</strong>, not
          retrieval.
        </p>
        <p>
          For anyone building RAG: this means "retrieve more chunks for safety" can backfire. Flooding the
          prompt pushes the best evidence toward the middle, where models are weakest. The practical fixes —
          fewer chunks (k=3–7), aggressive reranking, and deliberate ordering — are direct responses to this
          paper's findings.
        </p>
      </LessonSection>

      <LessonSection title="The problem before this paper">
        <p>
          Through 2022–2023, LLM vendors raced to increase <strong className="text-white">context window</strong>{' '}
          size — 4k, 8k, 32k, 100k tokens. The implicit promise: longer context means you can stuff more
          retrieved documents into the prompt and the model will use all of them. RAG tutorials often recommended
          retrieving 10–20 chunks "to be safe."
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Assumption of uniform attention</strong> — teams treated every token
            in the context as equally available to the model, like a database row the LLM always reads.
          </li>
          <li>
            <strong className="text-white">Retrieval blamed for all failures</strong> — when answers were wrong,
            engineers tuned embeddings and chunk size, rarely questioning whether the LLM actually{' '}
            <em>used</em> the retrieved text.
          </li>
          <li>
            <strong className="text-white">No standard position test</strong> — benchmarks mixed retrieval and
            reasoning errors, hiding cases where the right doc was present but ignored.
          </li>
        </ul>
        <p className="mt-3">
          Liu et al. isolated the generation step: they <em>knew</em> the answer was in the prompt, and only
          moved it around. The U-shaped accuracy curve that emerged changed how serious RAG engineers think
          about k, reranking, and prompt layout.
        </p>
      </LessonSection>

      <LessonSection title="Multi-document QA setup — overview">
        <Flowchart
          title="How the lost-in-the-middle experiment works"
          chart={`flowchart TB
  A[User question] --> B[Build prompt with k documents]
  B --> C[One gold doc contains the answer]
  C --> D[Shuffle gold doc to position 1, middle, or last]
  D --> E[Fill other slots with distractor docs]
  E --> F[Send full prompt to LLM]
  F --> G{Where was gold doc?}
  G -->|Start or end| H[High accuracy]
  G -->|Middle positions| I[Sharp accuracy drop]
  H --> J[U-shaped attention curve]
  I --> J
  J --> K[RAG lesson: limit k, rerank order]`}
        />
        <p className="mt-4 text-slate-300">
          The key trick is <strong className="text-white">controlled shuffling</strong>: retrieval is bypassed
          or fixed so the correct document is always included — only its <em>position</em> changes. Any accuracy
          swing is therefore due to how the model consumes long context, not search quality.
        </p>
      </LessonSection>

      <LessonSection title="How it works — step by step">
        <ContentStep number={1} title="Pick multi-document QA tasks">
          <p>
            The authors used settings where answering requires reading one relevant passage among several — close
            to real RAG. Tasks included open-book QA with multiple provided documents and variants built from
            existing datasets (e.g. passages from Wikipedia or curated reading-comprehension splits). Each example
            has a question, one <strong className="text-white">gold document</strong> containing the answer, and
            several <strong className="text-white">distractor documents</strong> that look plausible but do not
            contain the answer.
          </p>
        </ContentStep>

        <ContentStep number={2} title="Construct long prompts with k documents">
          <p>
            They varied <strong className="text-white">k</strong> (how many documents appear in the prompt) —
            typically from 10 up to 20 or more, depending on the experiment. All k documents are concatenated
            into the model's context window, usually with clear separators (titles, "Document 1:", etc.). The
            total length is intentionally long enough to stress the model's attention, not just a single
            paragraph.
          </p>
        </ContentStep>

        <ContentStep number={3} title="Shuffle the gold document's position">
          <p>
            For each question, the gold document is placed at position 1 (start), position 2, position 3, … up
            to position k (end). Distractors fill the remaining slots in random order. The same question is
            evaluated multiple times — once per gold position — so the only variable is{' '}
            <em>where</em> the answer lives in the stack of chunks.
          </p>
        </ContentStep>

        <ContentStep number={4} title="Measure answer accuracy per position">
          <p>
            The model generates an answer; the researchers check exact match or standard QA metrics against the
            known correct answer. They plot accuracy vs. gold-document index. The result is a{' '}
            <strong className="text-white">U-shaped curve</strong>: high at the left edge (early in the prompt),
            low in the centre, high again at the right edge (late in the prompt). Middle positions can lose{' '}
            <em>20–40+ percentage points</em> compared to edge positions on the same model and question.
          </p>
        </ContentStep>

        <ContentStep number={5} title="Repeat across many models">
          <p>
            The effect appeared across <strong className="text-white">GPT-3.5-Turbo</strong>,{' '}
            <strong className="text-white">Claude</strong>, and multiple{' '}
            <strong className="text-white">open-source</strong> models (Llama-family, MPT, etc.). That
            consistency suggests the pattern is tied to how transformer attention and training data are structured
            — not a single vendor bug. Longer contexts did not automatically fix it; the U-shape persisted as k
            grew.
          </p>
        </ContentStep>

        <ContentStep number={6} title="Translate findings to RAG prompt design">
          <p>
            In production RAG, retrieved chunks are ordered (often by similarity score) and pasted into the
            prompt. If you retrieve k=15 and the best chunk ranks 8th, it likely sits in the{' '}
            <strong className="text-white">middle</strong> — exactly where the model is weakest. Fixes: retrieve
            fewer chunks (k=3–7), rerank so the best chunk is first or last, or use "lost-in-the-middle
            reranking" that places top chunks at both edges and lower-ranked chunks in the centre.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="What the researchers tested">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Multi-document QA</strong> — primary setting; gold vs. distractor
            docs with systematic position shuffling.
          </li>
          <li>
            <strong className="text-white">Key-value retrieval</strong> — synthetic tasks where the model must
            recall a specific key's value from a long list; middle keys were hardest.
          </li>
          <li>
            <strong className="text-white">Context length scaling</strong> — performance as total prompt length
            and document count increased.
          </li>
          <li>
            <strong className="text-white">Model families</strong> — closed API models (GPT-3.5, Claude) and
            open-weight models trained with different context lengths.
          </li>
          <li>
            <strong className="text-white">Query-aware vs. query-agnostic ordering</strong> — whether putting
            the most relevant doc first (simulating a good reranker) recovered edge-level accuracy.
          </li>
        </ul>
      </LessonSection>

      <LessonSection title="Key results — what they found">
        <ul className="list-disc space-y-3 pl-5 text-slate-300">
          <li>
            <strong className="text-white">U-shaped attention curve</strong> — accuracy is highest when the
            answer-bearing document is at the <em>start</em> or <em>end</em> of the context, lowest when it sits
            in the middle third. This held across models and tasks; it is the paper's central figure.
          </li>
          <li>
            <strong className="text-white">Large middle penalty</strong> — for k≈10–20 documents, middle
            positions could underperform edge positions by double-digit percentage points on the same example.
            The model had the answer in context and still failed.
          </li>
          <li>
            <strong className="text-white">More documents can make things worse</strong> — increasing k widens
            the "valley" in the middle. Retrieving 20 chunks does not mean 20 chances to succeed; it means the
            best chunk is more likely to be buried.
          </li>
          <li>
            <strong className="text-white">Reranking to position 1 helps a lot</strong> — when the gold doc
            was forced to the first slot, accuracy approached the best edge performance. This directly motivates
            cross-encoder rerankers before prompt assembly.
          </li>
          <li>
            <strong className="text-white">Not fixed by "bigger context" alone</strong> — models advertised with
            100k-token windows still showed position bias in the regimes tested. A larger bucket does not mean
            uniform attention inside it.
          </li>
        </ul>
      </LessonSection>

      <LessonSection title="Limitations and what came after">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Task-specific formatting</strong> — results depend on how documents
            are delimited in the prompt. Clear headers and structure help slightly but do not remove the U-shape.
          </li>
          <li>
            <strong className="text-white">Model updates</strong> — newer models (GPT-4 class, long-context
            fine-tuning) may reduce but not eliminate the effect; always re-test on your stack.
          </li>
          <li>
            <strong className="text-white">Interaction with retrieval errors</strong> — real RAG also misses
            documents; this paper isolates generation bias given perfect inclusion.
          </li>
          <li>
            <strong className="text-white">What came after</strong> — "lost-in-the-middle" reranking patterns,
            lower default k in frameworks, LongLoRA / positional interpolation research, and agentic RAG that
            reads documents in multiple passes instead of one giant prompt. The lesson stuck:{' '}
            <em>position in the prompt is a first-class hyperparameter</em>.
          </li>
        </ul>
      </LessonSection>

      <LessonSection title="Connection to lessons">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Lesson</th>
                <th className="px-4 py-3">Connection</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                [
                  'Chunk Size & Overlap',
                  'Smaller, focused chunks mean each retrieved unit carries less noise — but this paper shows count and order matter as much as chunk quality',
                ],
                [
                  'Introduction to Chunking',
                  'How you split documents determines how many chunks you need in the prompt; fewer, sharper chunks align with k=3–7 guidance',
                ],
                [
                  'Augmentation & Generation',
                  'Always sort retrieved chunks by relevance before pasting into the prompt — best chunk first or last, never buried in the middle by default',
                ],
                [
                  'Advanced Retrieval / Reranking',
                  'Cross-encoder reranking is justified not only for precision but to move the gold doc to an attention-favoured position',
                ],
                [
                  'Retrieval-Augmented Generation (original RAG paper)',
                  'Original RAG assumed retrieved passages would be used; this paper audits whether the LLM actually reads them uniformly',
                ],
              ].map(([lesson, conn]) => (
                <tr key={lesson} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{lesson}</td>
                  <td className="px-4 py-3 text-slate-400">{conn}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <Callout variant="beginner" title="Key insight for beginners">
        Even perfect retrieval fails if the answer chunk sits in the middle of a long prompt. Retrieve fewer
        chunks (aim for k=3–7), rerank so the best evidence is first or last, and never assume the LLM read
        everything you sent.
      </Callout>

      <KeyTakeaways
        items={[
          'LLMs use long context unevenly — highest attention at the start and end, weakest in the middle (U-shaped curve).',
          'Researchers proved this by shuffling the gold document’s position while holding retrieval perfect; middle slots dropped accuracy sharply.',
          'Flooding the prompt with k=15–20 chunks often buries the best evidence in the worst-attended region.',
          'Practical RAG fixes: lower k, aggressive reranking, put top chunks at edges, consider sandwich-style ordering.',
          'Effect seen across GPT-3.5, Claude, and open models — tune prompt layout, not just embeddings.',
        ]}
      />
    </LessonArticle>
  )
}
