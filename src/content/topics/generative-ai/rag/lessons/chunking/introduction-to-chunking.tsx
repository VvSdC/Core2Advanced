import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function IntroductionToChunking() {
  return (
    <LessonArticle>
      <Definition term="Chunking">
        <p>
          <strong className="text-white">Chunking</strong> is the step where you cut a long document into
          smaller pieces — called <strong className="text-white">chunks</strong> — before storing them in a
          vector database. Each chunk becomes one index card the system can search and retrieve independently.
        </p>
        <p>
          Think of a 50-page employee handbook. You would not file the entire book as a single index card.
          You would write separate cards for "Refund Policy," "Vacation Days," and "Remote Work Rules" so
          someone looking up refunds finds the right card immediately.
        </p>
      </Definition>

      <LessonSection title="Why you cannot skip chunking">
        <p className="text-slate-300">
          In <strong className="text-white">RAG</strong> (Retrieval-Augmented Generation), the system embeds
          each chunk — converts its text into a list of numbers that capture meaning — and stores it in a
          vector database. When a user asks a question, the system finds the most relevant chunks and pastes
          them into the prompt for the language model.
        </p>
        <p className="mt-4 text-slate-300">
          If you embed an entire 50-page PDF as one giant chunk, you get one vague embedding that loosely
          matches everything and precisely matches nothing. A question about refunds might retrieve a chunk
          that is mostly about shipping, health benefits, and parking — because the whole document got
          mashed into one number.
        </p>

        <div className="mt-4 rounded-xl border border-surface-600 bg-surface-900 p-4 text-sm">
          <div className="text-xs font-medium text-slate-400">Before chunking — one blob, poor retrieval</div>
          <div className="mt-2 font-mono text-slate-200">
            <div className="border-l-2 border-amber-500 pl-3">
              Whole document (1 chunk): "Our refund policy allows returns within 30 days... Free shipping on
              orders over $50... Employees receive 15 vacation days... Remote work requires manager
              approval..."
            </div>
            <div className="mt-2 text-xs text-amber-400">
              User asks: "What is the refund window?" → system retrieves this entire blob. The answer is buried
              in noise.
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-surface-600 bg-surface-900 p-4 text-sm">
          <div className="text-xs font-medium text-slate-400">After chunking — focused index cards</div>
          <div className="mt-2 space-y-2 font-mono text-slate-200">
            <div className="border-l-2 border-genai-500 pl-3">
              Chunk 1: "Our refund policy allows returns within 30 days of purchase. Customers must provide
              proof of purchase."
            </div>
            <div className="border-l-2 border-genai-500 pl-3">
              Chunk 2: "Free shipping on orders over $50. Standard delivery takes 3–5 business days."
            </div>
            <div className="border-l-2 border-genai-500 pl-3">
              Chunk 3: "Employees receive 15 vacation days per year, accrued monthly."
            </div>
            <div className="mt-2 text-xs text-genai-400">
              User asks: "What is the refund window?" → Chunk 1 is retrieved. Clean, precise hit.
            </div>
          </div>
        </div>
      </LessonSection>

      <LessonSection title="The textbook chapter analogy">
        <p className="text-slate-300">
          Chunking is like deciding how to divide a textbook for study. Cut too fine — one sentence per
          flashcard — and you lose the surrounding context that makes the sentence meaningful. Cut too
          coarse — one card per entire chapter — and you cannot quickly find the one paragraph about
          photosynthesis inside a chapter on "Plant Biology."
        </p>
        <p className="mt-4 text-slate-300">
          Good chunking finds the sweet spot: each piece is small enough to answer a specific question, but
          large enough to make sense on its own.
        </p>

        <Callout variant="beginner">
          Chunking decides the <em>granularity of memory</em> in your RAG system. Too fine = lost context.
          Too coarse = imprecise retrieval. The next lessons show you exactly how to split.
        </Callout>
      </LessonSection>

      <LessonSection title="What goes inside each chunk">
        <p className="mb-4 text-slate-300">
          Every chunk stored in your vector database is more than just text. Think of it as a complete index
          card with three parts:
        </p>

        <ContentStep number={1} title="Text — the actual passage">
          <p>
            The words that get embedded and later pasted into the LLM prompt. This is what the user
            ultimately reads in the answer.
          </p>
        </ContentStep>

        <ContentStep number={2} title="Metadata — labels on the card">
          <p>
            <strong className="text-white">Metadata</strong> is extra information attached to the chunk:
            source filename, page number, section heading, date, or author. It does not get embedded, but it
            helps with filtering ("search only the 2024 policy PDF") and citations ("see page 4").
          </p>
          <div className="mt-3 rounded-xl border border-surface-600 bg-surface-900 p-3 font-mono text-sm text-slate-200">
            <div>text: "Returns within 30 days of purchase."</div>
            <div>metadata: {'{ source: "policy.pdf", page: 4, heading: "Refund Policy" }'}</div>
          </div>
        </ContentStep>

        <ContentStep number={3} title="Parent reference — link to the full document (optional)">
          <p>
            Sometimes you store small chunks for precise retrieval but keep a link back to the full section
            or page. This is called <strong className="text-white">parent-document retrieval</strong> — find
            the small card, then pull the bigger chapter for the LLM to read.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Chunks must fit in the context window">
        <p className="text-slate-300">
          A <strong className="text-white">context window</strong> is how much text an LLM can read at once —
          its working memory limit. Retrieved chunks compete with the user's question, system instructions,
          and the model's answer for space inside that window.
        </p>
        <p className="mt-4 text-slate-300">
          If each chunk is too large, you can only fit one or two into the prompt. If chunks are reasonably
          sized, you can retrieve several relevant passages and give the model a fuller picture.
        </p>

        <Callout variant="insight">
          A quick rule of thumb for <strong className="text-white">tokens</strong> (the units LLMs count
          text in): roughly <strong className="text-white">4 characters ≈ 1 token</strong>. So 500 tokens
          is about 2,000 characters — roughly one solid paragraph or two short ones. "Hello world" is ~2
          tokens. A full page of text is roughly 250–400 tokens.
        </Callout>
      </LessonSection>

      <LessonSection title="Where chunking sits in the RAG pipeline">
        <Flowchart
          title="Chunking in context"
          chart={`flowchart LR
  A[Raw document] --> B[Chunking]
  B --> C[Embed each chunk]
  C --> D[(Vector database)]
  E[User question] --> F[Retrieve top chunks]
  D --> F
  F --> G[LLM generates answer]`}
        />
        <p className="mt-4 text-slate-300">
          Chunking happens <em>before</em> embedding and storage. You only get one chance to split the
          document correctly at index time. Bad chunks mean bad retrieval — no embedding model or vector
          database can fix a sentence that was cut in half.
        </p>
      </LessonSection>

      <LessonSection title="Why chunking is the #1 RAG fix">
        <p className="text-slate-300">
          When a RAG system gives wrong or incomplete answers, beginners often blame the LLM or the embedding
          model. In practice, <strong className="text-white">bad chunking is the most common root cause</strong>.
          The right information exists in your documents — it just lives in a chunk the retriever never finds.
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-300">
          <li>Sentence cut in half → embedding captures incomplete meaning → retrieval misses it.</li>
          <li>Chunk too large → answer buried among unrelated topics → LLM ignores the relevant sentence.</li>
          <li>Chunk too small → "30 days" without "refund" → question about refunds does not match.</li>
        </ul>

        <Callout variant="tip">
          Before swapping embedding models or LLMs, tune your chunking strategy first. The next four lessons
          cover the main approaches: fixed/recursive splitting, structure-aware splitting, semantic splitting,
          and size/overlap tuning.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Chunking splits documents into focused index cards — each one searchable on its own.',
          'One giant chunk produces vague retrieval; focused chunks produce precise hits.',
          'Each chunk stores text + metadata; optionally a link back to the parent document.',
          'Chunks must fit inside the LLM context window (~4 characters ≈ 1 token).',
          'Bad chunking is the #1 cause of poor RAG — fix this before changing models.',
        ]}
      />
    </LessonArticle>
  )
}
