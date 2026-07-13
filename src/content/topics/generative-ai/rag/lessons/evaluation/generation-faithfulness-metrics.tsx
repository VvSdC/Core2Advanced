import {
  Callout,
  ContentStep,
  Definition,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function GenerationFaithfulnessMetrics() {
  return (
    <LessonArticle>
      <Definition term="Generation metrics">
        <p>
          Generation metrics evaluate the <strong className="text-white">LLM's output</strong> — not the search
          step. They answer: given the chunks we retrieved, did the model produce a correct, grounded, relevant
          answer? Only measure these <em>after</em> retrieval Recall@k is above 80%.
        </p>
      </Definition>

      <LessonSection title="The five generation metrics">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Metric</th>
                <th className="px-4 py-3">The question it asks</th>
                <th className="px-4 py-3">Analogy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                [
                  'Answer relevance',
                  'Does the answer address what the user actually asked?',
                  'A student answers the question on the exam, not a different one',
                ],
                [
                  'Faithfulness / groundedness',
                  'Is every claim in the answer supported by the retrieved chunks?',
                  'A student only states facts from the textbook, nothing invented',
                ],
                [
                  'Answer correctness',
                  'Does the answer match the ground-truth correct answer?',
                  "The student's answer matches the answer key",
                ],
                [
                  'Citation accuracy',
                  'Do cited sources actually contain the claimed information?',
                  'Footnotes point to real pages with the quoted text',
                ],
                [
                  'Refusal accuracy',
                  'Does the model say "I don\'t know" when the context lacks the answer?',
                  'A student says "not covered in the material" instead of guessing',
                ],
              ].map(([metric, question, analogy]) => (
                <tr key={metric} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{metric}</td>
                  <td className="px-4 py-3 text-slate-400">{question}</td>
                  <td className="px-4 py-3 text-slate-400">{analogy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Faithfulness — the anti-hallucination metric">
        <Definition term="Faithfulness">
          <p>
            Faithfulness measures whether <strong className="text-white">every fact in the generated answer can
            be traced back</strong> to a sentence in the retrieved context. If the context does not mention it,
            the answer should not either. This is the single most important generation metric for RAG.
          </p>
        </Definition>

        <ContentStep number={1} title="Set the scene — what the system retrieved">
          <div className="mt-3 rounded-xl border border-surface-600 bg-surface-900 p-4 text-sm">
            <div className="text-slate-400">User question:</div>
            <div className="mt-1 font-mono text-slate-200">"What is the refund policy?"</div>
            <div className="mt-4 text-slate-400">Retrieved context (the only evidence the LLM sees):</div>
            <div className="mt-1 font-mono text-slate-200">
              "Refunds are available within 30 days of purchase. Items must be unused and in original packaging.
              Shipping costs are non-refundable."
            </div>
          </div>
        </ContentStep>

        <ContentStep number={2} title="Faithful answer — every claim is supported">
          <div className="mt-3 rounded-xl border border-surface-600 bg-surface-900 p-4 text-sm">
            <div className="text-slate-400">Generated answer:</div>
            <div className="mt-1 font-mono text-slate-200">
              "You can get a refund within 30 days of purchase. The item must be unused and in its original
              packaging."
            </div>
            <div className="mt-3 text-genai-400 font-semibold">
              Faithful ✓ — "30 days," "unused," and "original packaging" all appear in the context.
            </div>
          </div>
        </ContentStep>

        <ContentStep number={3} title="Unfaithful answer — a made-up fact">
          <div className="mt-3 rounded-xl border border-surface-600 bg-surface-900 p-4 text-sm">
            <div className="text-slate-400">Generated answer:</div>
            <div className="mt-1 font-mono text-slate-200">
              "Refunds are available within 60 days of purchase. A restocking fee of 15% applies to opened
              items."
            </div>
            <div className="mt-3 space-y-1">
              <div className="text-red-400">
                "60 days" — <strong>Hallucination.</strong> Context says 30 days. The LLM invented a different
                number.
              </div>
              <div className="text-red-400">
                "15% restocking fee" — <strong>Hallucination.</strong> Context never mentions a restocking fee.
                The LLM fabricated a policy that does not exist.
              </div>
            </div>
            <div className="mt-3 text-red-400 font-semibold">
              Unfaithful ✗ — two claims have no support in the retrieved context.
            </div>
          </div>
        </ContentStep>

        <Callout variant="insight">
          Notice the unfaithful answer sounds <em>plausible</em>. That is what makes hallucinations dangerous —
          users trust confident, well-written answers. Faithfulness metrics catch claims that <em>sound right</em>{' '}
          but are not in your documents.
        </Callout>
      </LessonSection>

      <LessonSection title="Answer relevance vs faithfulness — related but different">
        <div className="mt-4 space-y-3">
          <div className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
            <p className="text-sm font-semibold text-white">Faithful but irrelevant</p>
            <p className="mt-1 text-sm text-slate-400">
              User asks about refunds. Answer faithfully quotes the shipping policy. Every claim is in the
              context, but none of it answers the question. Faithful ✓, relevant ✗.
            </p>
          </div>
          <div className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
            <p className="text-sm font-semibold text-white">Relevant but unfaithful</p>
            <p className="mt-1 text-sm text-slate-400">
              User asks about refunds. Answer discusses refunds but says "60 days" when the context says 30.
              Addresses the topic, but invents facts. Relevant ✓, faithful ✗.
            </p>
          </div>
          <div className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
            <p className="text-sm font-semibold text-white">Both faithful and relevant — the goal</p>
            <p className="mt-1 text-sm text-slate-400">
              Answer addresses the question and every claim is traceable to the retrieved context. This is what
              a production RAG system should produce.
            </p>
          </div>
        </div>
      </LessonSection>

      <LessonSection title="How to measure generation quality">
        <ContentStep number={1} title="Human evaluation — the gold standard">
          <p>
            Reviewers read the retrieved context and the generated answer, then score faithfulness and relevance
            on a 1–5 scale. Most accurate, but slow and expensive. Use for calibrating automated methods, not
            for every iteration.
          </p>
        </ContentStep>
        <ContentStep number={2} title="LLM-as-judge — fast and surprisingly accurate">
          <p>
            A strong LLM (GPT-4, Claude) reads the context and answer, then scores: "Is every claim in the answer
            supported by the context? Rate 0–1." Studies show LLM judges correlate well with human reviewers.
            Fast enough to run on every test question.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Automated frameworks — RAGAS, DeepEval, TruLens">
          <p>
            Open-source frameworks compute faithfulness, relevance, and correctness programmatically. They use
            LLM-as-judge under the hood but handle batching, scoring, and reporting for you. Covered in detail in
            the Evaluation Frameworks lesson.
          </p>
        </ContentStep>
        <Callout variant="tip">
          Start with LLM-as-judge on your 20–50 question test set. It takes minutes and gives you a faithfulness
          score per question. Investigate any question scoring below 0.8 — read the context and answer side by
          side to understand what went wrong.
        </Callout>
      </LessonSection>

      <LessonSection title="Fixing low faithfulness scores">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Cause</th>
                <th className="px-4 py-3">Fix</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['LLM invents facts not in context', 'Strengthen prompt: "Only use information from the provided context"'],
                ['LLM misreads numbers or dates', 'Lower temperature to 0; ask model to quote exact phrases'],
                ['Retrieved context is contradictory', 'Add MMR for diversity; instruct model to note contradictions'],
                ['Context lacks the answer entirely', 'Improve retrieval recall — this is a retrieval problem, not generation'],
                ['Model ignores context, uses training knowledge', 'Use a smaller context window model; add "If not in context, say I don\'t know"'],
              ].map(([cause, fix]) => (
                <tr key={cause} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 text-slate-400">{cause}</td>
                  <td className="px-4 py-3 font-semibold text-white">{fix}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Faithfulness: is every claim in the answer supported by retrieved context? The key anti-hallucination metric.',
          'Made-up facts (60 days instead of 30, invented restocking fee) are unfaithful even when they sound plausible.',
          'Faithfulness and relevance are different — an answer can be grounded but off-topic, or on-topic but hallucinated.',
          'Only evaluate generation after retrieval Recall@k ≥ 80%. Use LLM-as-judge or RAGAS for fast automated scoring.',
        ]}
      />
    </LessonArticle>
  )
}
