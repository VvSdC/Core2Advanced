import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function IntroductionToRag() {
  return (
    <LessonArticle>
      <LessonSection title="Imagine an open-book exam">
        <p className="mb-4 text-slate-300">
          Picture a student sitting a history exam. They studied for months, but the exam allows{' '}
          <strong className="text-white">one reference book</strong> on the desk. Before answering each question,
          they flip to the right chapter, read the relevant passage, and <em>then</em> write their answer using
          what they just read.
        </p>
        <p className="mb-4 text-slate-300">
          That is exactly what <strong className="text-white">RAG</strong> does for a language model. The model
          is the student. Your company documents are the reference book. And every time a user asks a question,
          the system finds the right pages, hands them to the model, and only then lets it answer.
        </p>
        <Callout variant="beginner" title="In simple terms">
          Without RAG, the model answers from memory alone — like a closed-book exam. With RAG, it looks up
          your documents first — like an open-book exam. The answers become grounded in <em>your</em> data, not
          just what the model happened to learn during training.
        </Callout>
      </LessonSection>

      <Definition term="Retrieval-Augmented Generation (RAG)">
        <p>
          <strong className="text-white">RAG</strong> is a technique where a{' '}
          <strong className="text-white">Large Language Model (LLM)</strong> — an AI system trained to read and
          write human language — first <strong className="text-white">retrieves</strong> (searches for and
          fetches) relevant passages from your documents, then <strong className="text-white">augments</strong>{' '}
          (adds) those passages to the question as extra context, and finally <strong className="text-white">generates</strong>{' '}
          (writes) an answer based on that evidence.
        </p>
        <p className="mt-3">
          The model does not memorise your handbook or wiki. It reads the relevant parts at question time — every
          single time someone asks.
        </p>
      </Definition>

      <LessonSection title="The problem RAG solves">
        <p className="mb-4 text-slate-300">
          To understand why RAG exists, you need to know two limitations every LLM has — even the most powerful
          ones.
        </p>

        <ContentStep number={1} title="Knowledge cutoff — the model's memory has an expiry date">
          <p>
            An LLM is trained on text collected up to a certain date. Everything after that date simply does not
            exist in the model's memory. If your company's refund policy was updated last month, the model has
            no idea — unless you give it the new policy at question time.
          </p>
          <p className="mt-3">
            <strong className="text-white">Everyday example:</strong> You ask ChatGPT about a product your company
            launched yesterday. It cannot know. It was not in the training data. RAG fixes this by handing the
            model your product page when the question arrives.
          </p>
        </ContentStep>

        <ContentStep number={2} title="Hallucination — confident answers that are simply wrong">
          <p>
            A <strong className="text-white">hallucination</strong> is when an LLM produces a fluent, confident
            answer that is factually incorrect or entirely made up. The model does not "lie" on purpose — it
            predicts the most likely next words based on patterns it learned, even when it has no real information.
          </p>
          <p className="mt-3">
            <strong className="text-white">Everyday example:</strong> You ask "What is our company's refund window?"
            without giving the model your handbook. It might answer "30 days" — sounding perfectly authoritative —
            when your actual policy is 14 days. RAG reduces this by putting the real policy text in front of the
            model before it answers.
          </p>
        </ContentStep>

        <Callout variant="beginner" title="Common confusion">
          RAG does not eliminate hallucinations entirely. If the system retrieves the wrong passage, or the
          model ignores the context, it can still make things up. RAG <em>reduces</em> hallucination by giving
          the model real evidence to work from — but retrieval and prompt design must be done well.
        </Callout>
      </LessonSection>

      <LessonSection title="What happens when a user asks a question">
        <p className="mb-4 text-slate-300">
          Let us walk through a concrete scenario. A customer support agent at Acme Corp types:{' '}
          <em>"Can I get a refund if I bought the product 25 days ago?"</em> Behind the scenes, a RAG system
          runs these steps:
        </p>

        <ContentStep number={1} title="The question arrives">
          <p>
            The user's message enters the RAG system. Nothing has been retrieved yet — the model has not seen
            any company documents.
          </p>
        </ContentStep>

        <ContentStep number={2} title="The system searches your documents">
          <p>
            The question is converted into a mathematical representation called an{' '}
            <strong className="text-white">embedding</strong> — a list of numbers that captures the{' '}
            <em>meaning</em> of the text. That embedding is compared against embeddings of pre-stored document
            pieces called <strong className="text-white">chunks</strong> (small passages your documents were
            split into earlier). The most relevant chunks are fetched.
          </p>
          <p className="mt-3">
            In our example, the system might retrieve two chunks from the employee handbook: one about the 30-day
            refund window, and one about how to initiate a refund.
          </p>
        </ContentStep>

        <ContentStep number={3} title="The evidence is added to the prompt">
          <p>
            The retrieved chunks are inserted into a structured message — the{' '}
            <strong className="text-white">prompt</strong> — along with the user's original question. The model
            now sees both the evidence and the question together.
          </p>
        </ContentStep>

        <ContentStep number={4} title="The LLM writes the answer">
          <p>
            The LLM reads the evidence and the question, then generates a response grounded in what it just read:
            <em>"Yes — Acme Corp offers refunds within 30 days of purchase. To start a refund, contact
            support@acme.com."</em>
          </p>
        </ContentStep>

        <Flowchart
          title="RAG at a glance — one question, four steps"
          chart={`flowchart LR
  A[User asks a question] --> B[Search your documents]
  B --> C[Add best passages to the prompt]
  C --> D[LLM writes the answer]
  D --> E[User sees the response]`}
        />

        <Callout variant="tip">
          Steps 2 and 3 happen in milliseconds. From the user's perspective, it feels like the chatbot simply
          "knows" your company policy. In reality, it looked it up fresh for that specific question.
        </Callout>
      </LessonSection>

      <LessonSection title="RAG vs fine-tuning vs long context">
        <p className="mb-4 text-slate-300">
          There are three common ways to make an LLM work with your own information. They solve overlapping
          problems but work very differently. Think of them as three ways to teach someone about your company:
        </p>

        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Approach</th>
                <th className="px-4 py-3">Everyday analogy</th>
                <th className="px-4 py-3">Best for</th>
                <th className="px-4 py-3">Trade-off</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                [
                  'RAG',
                  'Open-book exam — look up the answer each time',
                  'Q&A over handbooks, wikis, support docs, knowledge bases',
                  'Retrieval must find the right passage; adds a small delay per question',
                ],
                [
                  'Fine-tuning',
                  'Sending an employee to a week-long training course — knowledge gets baked in permanently',
                  'Changing how the model writes (tone, format) or teaching it a specialised task',
                  'Expensive and slow; updating facts means retraining',
                ],
                [
                  'Long context',
                  'Handing someone the entire handbook and saying "read all of this, then answer"',
                  'Small document sets that fit entirely in one prompt (a few dozen pages)',
                  'Costs more per question; model may overlook content buried in the middle',
                ],
              ].map(([approach, analogy, best, tradeoff]) => (
                <tr key={approach} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{approach}</td>
                  <td className="px-4 py-3 text-slate-400">{analogy}</td>
                  <td className="px-4 py-3 text-slate-400">{best}</td>
                  <td className="px-4 py-3 text-slate-400">{tradeoff}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Callout variant="beginner" title="Which one should I use?">
          For most document Q&A — "What does our handbook say about X?" — start with RAG. It is the cheapest to
          update (just add new documents), works with private data, and does not require retraining the model.
          Fine-tuning is for when you need the model to <em>behave</em> differently, not when you need it to
          <em>know</em> new facts. Long context works when your entire knowledge base fits in a single prompt,
          but gets expensive and unreliable as documents grow.
        </Callout>
      </LessonSection>

      <LessonSection title="Key terms you will see throughout this section">
        <ul className="list-disc space-y-3 pl-5 text-slate-300">
          <li>
            <strong className="text-white">LLM (Large Language Model)</strong> — the AI that reads your prompt
            and writes the answer. Examples: GPT-4, Claude, Gemini.
          </li>
          <li>
            <strong className="text-white">Embedding</strong> — a numerical fingerprint of text meaning, used to
            find similar passages. Covered in depth in the <em>Embeddings</em> section.
          </li>
          <li>
            <strong className="text-white">Chunk</strong> — a small piece of a larger document (a paragraph or
            page section), sized so the system can search and retrieve it precisely.
          </li>
          <li>
            <strong className="text-white">Vector</strong> — another word for an embedding; a list of numbers
            representing meaning in mathematical space.
          </li>
          <li>
            <strong className="text-white">Vector database</strong> — a specialised store that holds document
            chunks and their embeddings, enabling fast similarity search. Covered in <em>Vector Databases</em>.
          </li>
          <li>
            <strong className="text-white">Prompt</strong> — the full message sent to the LLM, including system
            instructions, retrieved context, and the user's question.
          </li>
        </ul>
      </LessonSection>

      <LessonSection title="How this sub-topic is organised">
        <p className="mb-4 text-slate-300">
          RAG is a system with many moving parts. This sub-topic breaks it into six areas — each with{' '}
          <strong className="text-white">Lessons</strong> and <strong className="text-white">Research Papers</strong>{' '}
          in the sidebar. Read them in order if you are learning for the first time:
        </p>
        <ContentStep number={1} title="Fundamentals (you are here)">
          <p>
            What RAG is, how the architecture works, how bi-encoders and cross-encoders score relevance, and how
            augmentation and generation fit together. Start here before anything else.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Embeddings">
          <p>How text becomes searchable numbers, and why the choice of embedding model matters.</p>
        </ContentStep>
        <ContentStep number={3} title="Chunking Strategies">
          <p>How to split large documents into pieces the system can search effectively.</p>
        </ContentStep>
        <ContentStep number={4} title="Vector Databases">
          <p>Where and how stored chunks are kept and searched at scale.</p>
        </ContentStep>
        <ContentStep number={5} title="Retrieval Strategies">
          <p>Different ways to find the best chunks — keyword search, semantic search, and hybrids.</p>
        </ContentStep>
        <ContentStep number={6} title="Evaluating RAG">
          <p>How to measure whether your system is actually working, and how to debug when it is not.</p>
        </ContentStep>

        <Callout variant="tip">
          These lessons are conceptual only — no code. When you are ready to build, head to the{' '}
          <em>LangChain</em> sub-topic for hands-on implementation.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'RAG lets an LLM look up your documents before answering — like an open-book exam.',
          'It solves knowledge cutoff (the model cannot know recent or private data) and reduces hallucination (made-up answers).',
          'For document Q&A, RAG is usually the best starting point — cheaper and faster to update than fine-tuning.',
          'Every question triggers: search documents → add evidence to prompt → LLM generates answer.',
          'This sub-topic walks through all six parts of a RAG system — start with Fundamentals, end with Evaluation.',
        ]}
      />
    </LessonArticle>
  )
}
