import {
  Callout,
  ContentStep,
  Definition,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function RagEvaluationOverview() {
  return (
    <LessonArticle>
      <LessonSection title="Why evaluate RAG at all?">
        <p className="text-slate-300">
          You built a RAG pipeline. Users ask questions and get answers. But are the answers <em>correct</em>?
          Are they <em>grounded</em> in your documents, or is the LLM making things up? Without measurement,
          you are guessing — and RAG has two independent failure points that require separate diagnosis.
        </p>
        <Callout variant="beginner" title="The two-question test">
          Every RAG answer fails in one of two ways: (1) the system retrieved the wrong evidence, or (2) the
          system retrieved the right evidence but the LLM misread it. You must evaluate each dimension
          separately to know which to fix.
        </Callout>
      </LessonSection>

      <LessonSection title="Shared vocabulary — learn these terms first">
        <p className="text-slate-300">
          The evaluation lessons ahead all use the same vocabulary. Read these definitions once and the rest of
          the section will click into place.
        </p>

        <Definition term="Retrieval quality">
          <p>
            Did the system find the <strong className="text-white">right document chunks</strong> for this
            question? Measured <em>before</em> the LLM generates anything. If retrieval fails, no amount of
            prompt engineering will produce a correct answer.
          </p>
        </Definition>

        <Definition term="Generation quality">
          <p>
            Given the retrieved chunks, did the LLM produce a <strong className="text-white">correct, grounded
            answer</strong>? Measured <em>after</em> retrieval. A perfect retrieval with a careless LLM still
            produces hallucinations.
          </p>
        </Definition>

        <Definition term="Ground truth">
          <p>
            The <strong className="text-white">correct answer</strong> you wrote by hand for a test question.
            Example: for "What is the refund window?", ground truth is "30 days from purchase." You compare the
            system's answer against this known-correct response.
          </p>
        </Definition>

        <Definition term="Labelled chunks">
          <p>
            For each test question, the specific document chunks that <strong className="text-white">contain the
            answer</strong>. You label these by hand when building your test set. Example: chunks 14 and 27 of
            the refund policy document contain the answer to "What is the refund window?"
          </p>
        </Definition>

        <Definition term="Top-k">
          <p>
            The <strong className="text-white">k chunks</strong> retrieval returns (covered in the Retrieval
            lessons). In evaluation, you check whether the labelled correct chunks appear somewhere in those k
            results.
          </p>
        </Definition>

        <Definition term="Recall@k">
          <p>
            Of all your test questions, what <strong className="text-white">percentage had the correct chunk
            somewhere in the top-k results</strong>? The single most important retrieval metric. If Recall@5 is
            60%, retrieval fails on 40% of questions — fix that before touching the LLM.
          </p>
        </Definition>

        <Definition term="Faithfulness (groundedness)">
          <p>
            Is <strong className="text-white">every claim in the generated answer supported</strong> by the
            retrieved chunks? If the context says "30-day refund" and the answer says "60-day refund," that is
            unfaithful — a hallucination.
          </p>
        </Definition>

        <Definition term="Answer relevance">
          <p>
            Does the generated answer <strong className="text-white">actually address the question</strong> the
            user asked? A faithful answer about shipping policy is still bad if the user asked about refunds.
          </p>
        </Definition>

        <Definition term="Hallucination">
          <p>
            When the LLM states a <strong className="text-white">fact not supported by the retrieved
            context</strong> — inventing a 60-day refund when the document says 30 days, or citing a policy that
            does not exist. The primary failure mode RAG evaluation is designed to catch.
          </p>
        </Definition>

        <Definition term="Test set (evaluation dataset)">
          <p>
            A collection of <strong className="text-white">30–100 real or realistic questions</strong>, each
            with labelled correct chunks and a ground-truth answer. You run your full RAG pipeline on every
            question and measure retrieval and generation quality against these labels.
          </p>
        </Definition>
      </LessonSection>

      <LessonSection title="Two quality dimensions — evaluate separately">
        <div className="mt-4 overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Dimension</th>
                <th className="px-4 py-3">Core question</th>
                <th className="px-4 py-3">Key metric</th>
                <th className="px-4 py-3">Lesson</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Retrieval', 'Is the right chunk in top-k?', 'Recall@k', 'Retrieval Metrics'],
                ['Generation', 'Is the answer correct and grounded?', 'Faithfulness', 'Generation & Faithfulness Metrics'],
                ['System limits', 'When does RAG fail entirely?', 'Symptom → fix map', 'Limitations & Debugging'],
                ['Tooling', 'How to run evals at scale?', 'Framework scores', 'Evaluation Frameworks'],
              ].map(([dimension, question, metric, lesson]) => (
                <tr key={dimension} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{dimension}</td>
                  <td className="px-4 py-3 text-slate-400">{question}</td>
                  <td className="px-4 py-3 text-slate-400">{metric}</td>
                  <td className="px-4 py-3 text-genai-400">{lesson}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="insight">
          Always evaluate retrieval first. If Recall@5 is below 80%, fixing the LLM prompt is pointless — the
          model never saw the right evidence. Only evaluate generation after retrieval passes the bar.
        </Callout>
      </LessonSection>

      <LessonSection title="Building your first test set">
        <ContentStep number={1} title="Collect 30–100 real questions">
          <p>
            Pull from support tickets, search logs, or write realistic synthetic ones. Cover your most common
            question types — refunds, shipping, account issues, product specs. Diversity matters more than
            quantity.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Label the correct chunks">
          <p>
            For each question, open your source documents and mark which chunks contain the answer. This is
            manual work, but it is the foundation of every retrieval metric. Be precise — "chunk 14 of
            refund-policy.pdf" not "the refund document."
          </p>
        </ContentStep>
        <ContentStep number={3} title="Write the ground-truth answer">
          <p>
            For each question, write the correct answer in one or two sentences. This is what a perfect RAG
            system would return. Example: "Refunds are available within 30 days of purchase for unused items
            in original packaging."
          </p>
        </ContentStep>
        <ContentStep number={4} title="Run the pipeline and measure">
          <p>
            Feed each test question through your full RAG system. Measure retrieval (is the labelled chunk in
            top-k?) and generation (is the answer faithful and relevant?) separately. Record scores per
            question so you can inspect failures individually.
          </p>
        </ContentStep>
        <Callout variant="tip">
          Start with just 20 labelled questions. That is enough to reveal whether your problem is chunking,
          retrieval, or generation. Expand to 50–100 once you begin iterating on fixes.
        </Callout>
      </LessonSection>

      <LessonSection title="The evaluation order — what to fix first">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Step</th>
                <th className="px-4 py-3">What to measure</th>
                <th className="px-4 py-3">Target</th>
                <th className="px-4 py-3">If below target, fix</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['1', 'Recall@5 (retrieval)', '≥ 80%', 'Chunking → embeddings → hybrid search'],
                ['2', 'Faithfulness (generation)', '≥ 90%', 'Prompt grounding instructions, lower temperature'],
                ['3', 'Answer relevance', '≥ 85%', 'Prompt structure, reranking'],
                ['4', 'Answer correctness vs ground truth', '≥ 80%', 'All of the above + model choice'],
              ].map(([step, measure, target, fix]) => (
                <tr key={step} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{step}</td>
                  <td className="px-4 py-3 text-slate-400">{measure}</td>
                  <td className="px-4 py-3 text-genai-400">{target}</td>
                  <td className="px-4 py-3 text-slate-400">{fix}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <KeyTakeaways
        items={[
          'RAG quality splits into retrieval (right chunks?) and generation (grounded answer?) — evaluate separately.',
          'Learn the vocabulary upfront: ground truth, labelled chunks, Recall@k, faithfulness, hallucination.',
          'Build a test set of 30–100 questions with labelled chunks and ground-truth answers.',
          'Fix retrieval first (target Recall@5 ≥ 80%) before optimising generation or prompt engineering.',
        ]}
      />
    </LessonArticle>
  )
}
