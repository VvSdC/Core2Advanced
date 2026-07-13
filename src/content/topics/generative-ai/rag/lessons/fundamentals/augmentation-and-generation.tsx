import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function AugmentationAndGeneration() {
  return (
    <LessonArticle>
      <LessonSection title="The librarian hands over the books — now what?">
        <p className="mb-4 text-slate-300">
          In the previous lesson, retrieval found the right chunks from your documents. But you cannot just dump
          those passages at the LLM and hope for the best. Imagine handing a student a pile of loose book pages
          and saying "answer this question" without telling them which pages matter most, how to cite sources, or
          what to do if the pages do not contain the answer.
        </p>
        <p className="mb-4 text-slate-300">
          <strong className="text-white">Augmentation</strong> is the step where you carefully organise the
          retrieved evidence into a structured message. <strong className="text-white">Generation</strong> is
          where the LLM reads that message and writes the final answer. Together, they turn raw chunks into a
          helpful, trustworthy response.
        </p>
      </LessonSection>

      <Definition term="Augmentation and generation">
        <p>
          <strong className="text-white">Augmentation</strong> means inserting retrieved document chunks into a
          prompt alongside the user's question — giving the LLM evidence to work from.{' '}
          <strong className="text-white">Generation</strong> means the LLM reading that augmented prompt and
          producing a natural language answer grounded in the evidence it was given.
        </p>
      </Definition>

      <LessonSection title="How a RAG prompt is structured">
        <p className="mb-4 text-slate-300">
          A well-built RAG prompt has three layers, always in this order. The LLM reads top to bottom:
        </p>

        <Flowchart
          title="Prompt structure for RAG"
          chart={`flowchart TB
  A["System instructions: rules and behaviour"] --> B["Context block: retrieved chunks with sources"]
  B --> C["User question"]
  C --> D["LLM generates the answer"]`}
        />

        <ContentStep number={1} title="System instructions — setting the rules">
          <p>
            This is where you tell the LLM <em>how</em> to behave. It is not visible to the end user, but it
            shapes every answer. Typical rules for a RAG system:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-400">
            <li>Answer only using the provided context — do not use outside knowledge</li>
            <li>If the context does not contain the answer, say "I don't have that information" instead of guessing</li>
            <li>Cite the source document and page number when stating facts</li>
            <li>Keep answers concise and professional</li>
          </ul>
        </ContentStep>

        <ContentStep number={2} title="Context block — the retrieved evidence">
          <p>
            The chunks found during retrieval are formatted with their source metadata so the LLM (and the user)
            know where each fact came from. Chunks are separated clearly — never run together.
          </p>
        </ContentStep>

        <ContentStep number={3} title="User question — asked last">
          <p>
            The original question goes at the end, after all the evidence. This ordering matters: the LLM reads
            the facts first, then sees what it needs to answer. Putting the question before the context often
            leads to worse answers.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="A complete example prompt — read this top to bottom">
        <p className="mb-4 text-slate-300">
          Here is what the full prompt looks like when an employee asks about refunds. This is exactly what the
          LLM receives — nothing hidden, nothing mysterious:
        </p>

        <div className="space-y-4">
          <div className="rounded-xl border border-surface-600 bg-surface-900 p-4 text-sm text-slate-300">
            <div className="text-xs font-semibold uppercase tracking-wider text-violet-400">
              Layer 1 — System instructions
            </div>
            <div className="mt-3 space-y-2 text-slate-200">
              <p>You are a helpful assistant for Acme Corp employees.</p>
              <p>Answer questions using ONLY the context provided below.</p>
              <p>If the context does not contain enough information to answer, say: "I could not find that information in the handbook. Please contact HR."</p>
              <p>Always cite the source document and page number for factual claims.</p>
              <p>Do not make up policies, numbers, or contact details.</p>
            </div>
          </div>

          <div className="rounded-xl border border-surface-600 bg-surface-900 p-4 text-sm text-slate-300">
            <div className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Layer 2 — Context block (retrieved chunks)
            </div>
            <div className="mt-3 space-y-4 text-slate-200">
              <div>
                <div className="text-xs text-slate-400">[Source: Acme_Employee_Handbook.pdf, page 34]</div>
                <p className="mt-1">
                  Refund Policy — Company Store: Items purchased from the Acme company store may be returned
                  within 30 days of the purchase date for a full refund. Items must be in original condition
                  with receipt.
                </p>
              </div>
              <div className="border-t border-surface-600 pt-4">
                <div className="text-xs text-slate-400">[Source: Acme_Employee_Handbook.pdf, page 35]</div>
                <p className="mt-1">
                  To initiate a refund, email support@acme.com with your order number and reason for return.
                  Refunds are processed within 5–7 business days to the original payment method.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-surface-600 bg-surface-900 p-4 text-sm text-slate-300">
            <div className="text-xs font-semibold uppercase tracking-wider text-accent-400">
              Layer 3 — User question
            </div>
            <div className="mt-3 text-slate-200">
              <p>Can I get a refund if I bought something from the company store 25 days ago?</p>
            </div>
          </div>

          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-slate-300">
            <div className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              LLM generates → final answer
            </div>
            <div className="mt-3 text-slate-200">
              <p>
                Yes — you are within the 30-day refund window. Items purchased from the Acme company store can
                be returned within 30 days of purchase for a full refund, provided they are in original
                condition with receipt (Handbook, page 34). To start your refund, email support@acme.com with
                your order number and reason for return. Processing takes 5–7 business days (Handbook, page 35).
              </p>
            </div>
          </div>
        </div>

        <Callout variant="beginner" title="What to notice">
          The answer only contains facts from the two retrieved chunks. The 30-day window, the email address,
          and the processing time all come directly from the handbook text — not from the model's training
          memory. The citations tell the user exactly where to verify.
        </Callout>
      </LessonSection>

      <LessonSection title="Generation settings — controlling how the LLM writes">
        <p className="mb-4 text-slate-300">
          When the LLM generates its answer, you can adjust a few settings. The most important one for RAG is{' '}
          <strong className="text-white">temperature</strong>.
        </p>

        <Definition term="Temperature">
          <p>
            <strong className="text-white">Temperature</strong> controls how creative vs predictable the LLM's
            word choices are. It ranges from 0 to 1 (sometimes up to 2). Think of it like a dial between
            "strictly by the book" and "freestyle improvisation."
          </p>
        </Definition>

        <ContentStep number={1} title="Low temperature (0 to 0.2) — use this for RAG">
          <p>
            The model picks the most likely word at every step. Answers are consistent, factual, and stick close
            to the retrieved context. Ask the same question twice and you get nearly the same answer.
          </p>
          <p className="mt-3">
            <strong className="text-white">Everyday analogy:</strong> A news anchor reading a teleprompter —
            precise, predictable, no improvisation.
          </p>
        </ContentStep>

        <ContentStep number={2} title="High temperature (0.7 to 1.0) — avoid for factual RAG">
          <p>
            The model considers less likely word choices, producing more varied and creative output. Useful for
            brainstorming or creative writing — but dangerous for factual Q&A because the model is more likely
            to paraphrase loosely or add details not in the context.
          </p>
          <p className="mt-3">
            <strong className="text-white">Everyday analogy:</strong> An improvisational comedian — entertaining,
            but you would not trust them to read your refund policy accurately.
          </p>
        </ContentStep>

        <p className="mt-4 text-slate-300">
          Two other settings matter less but are worth knowing:
        </p>
        <ul className="mt-2 list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Top-p</strong> (nucleus sampling) — another creativity dial. At 0.9
            (a common default), the model considers the top 90% most likely words. For RAG factual Q&A, the
            default is usually fine when temperature is already low.
          </li>
          <li>
            <strong className="text-white">Max tokens</strong> — the maximum length of the generated answer. Set
            it to roughly twice your expected answer length. Too short truncates the answer; too long wastes cost.
          </li>
        </ul>

        <Callout variant="tip">
          For factual RAG: temperature 0–0.2, top-p 0.9, max_tokens sized to your expected answer. These are
          safe defaults for support bots, handbook Q&A, and policy lookup.
        </Callout>
      </LessonSection>

      <LessonSection title="When something goes wrong — diagnosing failures">
        <p className="mb-4 text-slate-300">
          RAG systems fail in predictable ways. The symptom tells you which layer to fix. Here are the most
          common problems, what they look like to a user, and where to look:
        </p>

        <ContentStep number={1} title='Symptom: "The answer is wrong and the right info isn&apos;t there at all"'>
          <p>
            <strong className="text-white">What the user sees:</strong> They ask about the dress code and get an
            answer about vacation policy — or the model says "I don't know" when the handbook clearly covers the
            topic.
          </p>
          <p className="mt-3">
            <strong className="text-white">Likely cause — retrieval problem:</strong> The system did not fetch the
            right chunk. The correct passage never reached the LLM. Check chunking (is the dress code section in
            its own chunk?), embedding model (does "dress code" match "attire requirements"?), and retrieval
            strategy.
          </p>
        </ContentStep>

        <ContentStep number={2} title='Symptom: "The right info is there but the answer ignores it"'>
          <p>
            <strong className="text-white">What the user sees:</strong> You inspect the prompt and the correct
            chunk about the 30-day refund window is present — but the model answers "60 days" anyway.
          </p>
          <p className="mt-3">
            <strong className="text-white">Likely cause — generation problem:</strong> The model is not following
            the context. Check your system instructions (do they clearly say "use only the provided context"?),
            temperature (is it too high?), and whether too many irrelevant chunks are diluting the important one.
          </p>
        </ContentStep>

        <ContentStep number={3} title='Symptom: "The answer just copies the chunk word-for-word"'>
          <p>
            <strong className="text-white">What the user sees:</strong> Instead of a natural answer, the response
            is a raw paste of the handbook paragraph — awkward and unreadable.
          </p>
          <p className="mt-3">
            <strong className="text-white">Likely cause — prompt problem:</strong> The system instructions may be
            too restrictive (e.g. "reproduce the context exactly") or temperature is set to 0 with a prompt that
            discourages rephrasing. Loosen the instructions to say "answer in clear, natural language."
          </p>
        </ContentStep>

        <ContentStep number={4} title='Symptom: "The answer adds details that aren&apos;t in any chunk"'>
          <p>
            <strong className="text-white">What the user sees:</strong> The model says "contact refund@acme.com"
            but no retrieved chunk mentions that email — the real one is support@acme.com. This is a{' '}
            <strong className="text-white">hallucination</strong>.
          </p>
          <p className="mt-3">
            <strong className="text-white">Likely cause — generation problem:</strong> Temperature is too high,
            the system instructions do not forbid guessing, or too many irrelevant chunks are confusing the model.
            Lower temperature and strengthen the "do not make up information" rule.
          </p>
        </ContentStep>

        <div className="mt-6 overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Symptom</th>
                <th className="px-4 py-3">User sees</th>
                <th className="px-4 py-3">Fix this layer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                [
                  'Wrong or missing facts',
                  'Answer about topic A when user asked about topic B',
                  'Retrieval — chunking, embeddings, or search strategy',
                ],
                [
                  'Correct chunk, wrong answer',
                  'Handbook says 30 days, model says 60 days',
                  'Generation — prompt instructions or temperature',
                ],
                [
                  'Verbatim copy',
                  'Raw paragraph pasted instead of a natural answer',
                  'Prompt — loosen "reproduce exactly" instructions',
                ],
                [
                  'Made-up details',
                  'Email addresses or numbers not in any chunk',
                  'Generation — lower temperature, strengthen anti-guessing rules',
                ],
              ].map(([symptom, userSees, layer]) => (
                <tr key={symptom} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{symptom}</td>
                  <td className="px-4 py-3 text-slate-400">{userSees}</td>
                  <td className="px-4 py-3 text-slate-400">{layer}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Callout variant="beginner" title="The golden rule of RAG debugging">
          Missing context → retrieval problem. Context present but ignored → generation problem. Always check
          the prompt first (what did the LLM actually see?) before blaming the model or the documents.
        </Callout>
      </LessonSection>

      <LessonSection title="What makes a good RAG answer">
        <ul className="list-disc space-y-3 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Grounded</strong> — every fact in the answer appears in a retrieved
            chunk. No outside knowledge sneaks in.
          </li>
          <li>
            <strong className="text-white">Cited</strong> — the user can verify by checking the source document
            and page number.
          </li>
          <li>
            <strong className="text-white">Honest</strong> — if the chunks do not contain the answer, the model
            says so instead of guessing.
          </li>
          <li>
            <strong className="text-white">Readable</strong> — written in natural language, not a raw copy-paste
            of the source text.
          </li>
        </ul>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Augmentation = organising retrieved chunks into a prompt. Generation = the LLM writing the answer.',
          'Prompt structure: system rules → context chunks with sources → user question (always in this order).',
          'Temperature 0–0.2 for factual RAG — low creativity keeps answers faithful to the evidence.',
          'Missing context = retrieval problem. Context ignored = generation problem. Always inspect the prompt first.',
          'A good RAG answer is grounded, cited, honest when information is missing, and readable.',
        ]}
      />
    </LessonArticle>
  )
}
