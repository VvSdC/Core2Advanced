import {
  Callout,
  ContentStep,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
  ResearchPaperHeader,
} from '../../../../../../components/content'

const PAPER_URL = 'https://arxiv.org/abs/2309.15217'

export function RagasEvaluation() {
  return (
    <LessonArticle>
      <ResearchPaperHeader
        title="RAGAS: Automated Evaluation of Retrieval Augmented Generation"
        authors="Es et al. (Exploding Gradients)"
        year="2023"
        url={PAPER_URL}
      >
        Introduced <strong className="text-white">RAGAS</strong> — a framework that scores RAG pipelines on
        faithfulness, relevance, and context quality using LLM-as-judge, without needing ground-truth answers
        for every question.
      </ResearchPaperHeader>

      <Callout variant="beginner" title="Read this after">
        Read <em>RAG Evaluation Overview</em> and <em>Evaluation Frameworks</em> first. RAGAS is the most widely
        used open-source implementation of those concepts — this lesson walks through the full paper so you
        understand what each metric actually measures and how the scoring works under the hood.
      </Callout>

      <LessonSection title="What this paper means in plain English">
        <p>
          You built a RAG chatbot over your company's internal docs. It looks great in demos. But how do you
          know it is actually working? You could manually read every answer — but that does not scale past a
          dozen test questions. You could write a perfect answer key for every possible question — but that is
          impossibly expensive and your docs change every week. Before RAGAS, teams mostly relied on gut feeling,
          occasional manual spot-checks, or generic NLP metrics like BLEU that do not capture what matters for
          RAG: Is the answer grounded in the retrieved context? Did retrieval find the right chunks? Does the
          answer actually address the question?
        </p>
        <p>
          RAGAS (Retrieval Augmented Generation Assessment) is a framework — and an open-source Python library —
          that automates these checks. For each test question, you run your RAG pipeline and collect four pieces
          of data: the question, the retrieved context chunks, the generated answer, and (optionally) a
          ground-truth reference answer. RAGAS then uses a large language model as a <em>judge</em> to score
          the pipeline on multiple dimensions. The clever part: two of the most important metrics — faithfulness
          and answer relevancy — work <em>without</em> any pre-written correct answer. You only need questions
          and your pipeline's outputs.
        </p>
        <p>
          For <strong className="text-white">faithfulness</strong>, RAGAS breaks the generated answer into
          individual factual claims and checks each one against the retrieved context — like a fact-checker
          verifying every sentence. For <strong className="text-white">answer relevancy</strong>, it checks
          whether the answer actually addresses what was asked, penalising verbose tangents. For{' '}
          <strong className="text-white">context precision</strong> and{' '}
          <strong className="text-white">context recall</strong>, it evaluates whether retrieval found the
          right material — precision without ground truth, recall with it.
        </p>
        <p>
          Think of RAGAS as a report card for your RAG pipeline. Run it on 50–100 test questions, get scores
          between 0 and 1 for each metric, tune your chunk size or retrieval strategy, run it again, and compare.
          It is the standard tool teams use to turn "it seems better" into "faithfulness went from 0.72 to
          0.89 after we switched to hybrid retrieval."
        </p>
      </LessonSection>

      <LessonSection title="The problem before this paper">
        <p>
          By 2023, RAG was everywhere in production LLM applications, but evaluation lagged far behind
          development. Teams knew their systems had problems — hallucinations, irrelevant retrieval, answers that
          ignored the question — but lacked systematic ways to measure and track them.
        </p>
        <p>
          <strong className="text-white">Generic NLP metrics did not fit.</strong> BLEU and ROUGE compare generated
          text to a reference answer word-by-word. They work for machine translation and summarisation with fixed
          references, but RAG answers can be correct while using completely different wording. A RAG system that
          paraphrases faithfully would score low on BLEU despite being good.
        </p>
        <p>
          <strong className="text-white">Retrieval and generation were evaluated separately.</strong> Information
          retrieval had its own metrics (nDCG, MRR, Recall@k) requiring labelled relevant documents. Text
          generation had its own metrics (perplexity, human ratings). Nobody had a unified framework that
          evaluated the <em>combined</em> RAG pipeline — how retrieval quality affects generation quality and
          vice versa.
        </p>
        <p>
          <strong className="text-white">Ground-truth answers are expensive.</strong> Creating a test set with
          expert-written correct answers for every question in every domain is slow and must be repeated when
          documents change. Teams needed metrics that could evaluate pipeline quality with minimal labelling —
          ideally just questions, without perfect answer keys.
        </p>
        <p>
          RAGAS proposed a reference-free evaluation paradigm: use LLMs as judges to assess faithfulness and
          relevancy from the pipeline's own outputs, plus optional ground-truth-dependent metrics when labels
          are available.
        </p>
      </LessonSection>

      <LessonSection title="RAGAS evaluation pipeline">
        <Flowchart
          title="What RAGAS needs and what it produces"
          chart={`flowchart TB
  A[Test question] --> B[Your RAG pipeline]
  B --> C[Retrieved context chunks]
  B --> D[Generated answer]
  A --> E[RAGAS evaluator]
  C --> E
  D --> E
  F[Optional ground-truth answer] --> E
  E --> G[Faithfulness score]
  E --> H[Answer relevancy score]
  E --> I[Context precision score]
  E --> J[Context recall score]`}
        />
        <p className="mt-4 text-slate-300">
          RAGAS sits outside your pipeline. It takes the inputs and outputs of a RAG run and scores them — it
          does not modify retrieval or generation. You can run it on historical logs or a dedicated test set.
        </p>
      </LessonSection>

      <LessonSection title="How it works — step by step">
        <ContentStep number={1} title="Collect the four RAGAS inputs per test case">
          <p>
            For each evaluation example, RAGAS needs: (1) the <strong className="text-white">question</strong>,
            (2) the <strong className="text-white">contexts</strong> your retriever returned (one or more
            chunks), (3) the <strong className="text-white">answer</strong> your generator produced, and (4)
            optionally a <strong className="text-white">ground-truth answer</strong> written by a human expert.
            You run your existing pipeline on a batch of test questions and collect these fields.
          </p>
        </ContentStep>

        <ContentStep number={2} title="Faithfulness — claim extraction and verification">
          <p>
            Faithfulness measures: <em>is every claim in the answer supported by the retrieved context?</em> Step
            one: an LLM judge breaks the generated answer into individual atomic statements (claims). "Paris is
            the capital of France and has 2.1 million residents" becomes two claims. Step two: for each claim,
            the LLM judge checks whether it can be inferred from the retrieved context — supported or not
            supported.
          </p>
          <p className="mt-2">
            <strong className="text-white">Score</strong> = (number of supported claims) / (total claims). A
            score of 1.0 means every claim is grounded. A score of 0.5 means half the answer is hallucinated.
            This metric needs <em>no ground-truth answer</em> — only the context and the generated answer.
          </p>
        </ContentStep>

        <ContentStep number={3} title="Answer relevancy — does the answer address the question?">
          <p>
            Answer relevancy measures: <em>does the generated answer actually address what was asked?</em> The LLM
            judge generates several synthetic questions that the given answer <em>could</em> be answering, then
            compares those synthetic questions to the original question using embedding similarity. If the answer
            is "Paris is known for the Eiffel Tower, croissants, and fashion" in response to "What is the capital
            of France?", the synthetic questions will drift from the original — low relevancy.
          </p>
          <p className="mt-2">
            This catches answers that are factually grounded (high faithfulness) but miss the point (low
            relevancy). Also reference-free — no ground-truth answer needed.
          </p>
        </ContentStep>

        <ContentStep number={4} title="Context precision — are retrieved chunks relevant?">
          <p>
            Context precision measures: <em>are the retrieved chunks actually useful for answering the
            question?</em> For each retrieved chunk (in rank order), the LLM judge assesses whether the chunk
            is relevant to the question. The score weights relevant chunks higher when they appear earlier in
            the ranked list — penalising retrievers that bury good chunks below irrelevant ones.
          </p>
          <p className="mt-2">
            With a ground-truth answer available, precision is computed against whether each chunk was necessary.
            Without ground truth, the judge uses the question and answer to estimate relevance.
          </p>
        </ContentStep>

        <ContentStep number={5} title="Context recall — did retrieval find everything needed?">
          <p>
            Context recall measures: <em>did the retriever find all the information needed to produce the correct
            answer?</em> The LLM judge compares the ground-truth answer against the retrieved chunks and checks
            whether each claim in the ground truth can be attributed to at least one chunk.
          </p>
          <p className="mt-2">
            This metric <strong className="text-white">requires a ground-truth answer</strong> — it is the one
            metric you cannot run fully reference-free. If recall is low, your retriever is missing important
            documents regardless of how good your generator is.
          </p>
        </ContentStep>

        <ContentStep number={6} title="Aggregate scores and track over time">
          <p>
            RAGAS computes per-example scores for each metric, then averages across your test set. The result is
            a dashboard: "faithfulness 0.85, answer relevancy 0.78, context precision 0.71, context recall
            0.62." Teams run this before and after changes (new chunk size, different embedding model, HyDE
            enabled) to measure impact quantitatively.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="What the researchers tested">
        <p>
          The RAGAS authors validated their metrics against human judgments and demonstrated the framework on
          real-world RAG datasets, focusing on whether automated LLM-judge scores correlate with what human
          evaluators would score.
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Human correlation study</strong> — compared RAGAS metric scores to
            human annotator ratings on faithfulness, answer relevancy, and context quality. Reported Pearson
            correlation coefficients showing moderate-to-strong alignment.
          </li>
          <li>
            <strong className="text-white">WikiEval dataset</strong> — created an evaluation set from Wikipedia-
            based RAG pipelines with human-annotated quality labels, used to benchmark metric reliability.
          </li>
          <li>
            <strong className="text-white">LLM judge models tested</strong> — primarily GPT-based models as judges,
            with analysis of how judge model capability affects scoring consistency.
          </li>
          <li>
            <strong className="text-white">Reference-free vs reference-based modes</strong> — demonstrated that
            faithfulness and answer relevancy work without ground truth, while context recall requires it.
            Showed the full four-metric suite on datasets with varying levels of labelling.
          </li>
          <li>
            <strong className="text-white">Comparison to existing metrics</strong> — showed BLEU/ROUGE poorly
            correlate with RAG-specific quality dimensions, while RAGAS metrics align better with human judgments
            of faithfulness and relevance.
          </li>
        </ul>
      </LessonSection>

      <LessonSection title="Key results — what they found">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">First unified RAG evaluation framework.</strong> RAGAS was the first
            widely adopted system to evaluate retrieval and generation together with metrics designed specifically
            for RAG — not borrowed from translation or summarisation.
          </li>
          <li>
            <strong className="text-white">Reference-free metrics work.</strong> Faithfulness and answer relevancy
            correlated meaningfully with human judgments without requiring expert-written answer keys — lowering
            the barrier to systematic RAG evaluation.
          </li>
          <li>
            <strong className="text-white">Claim-level faithfulness is interpretable.</strong> Breaking answers into
            claims and checking each one gives actionable debugging signal — you can see <em>which</em> statements
            hallucinated, not just that something went wrong.
          </li>
          <li>
            <strong className="text-white">Adopted as the de facto standard.</strong> The open-source{' '}
            <code className="font-mono text-sm">ragas</code> Python library integrated with LangChain, LangSmith,
            and LlamaIndex, becoming the default evaluation tool in the RAG ecosystem.
          </li>
          <li>
            <strong className="text-white">LLM judge quality matters.</strong> Weaker judge models produce noisier
            scores. GPT-4-class judges were more reliable; smaller models could still work for relative
            comparisons (before vs after a change) even if absolute scores drifted.
          </li>
        </ul>
      </LessonSection>

      <LessonSection title="Limitations and what came after">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Expensive at scale.</strong> Each metric requires multiple LLM calls per
            test example (claim extraction, verification, synthetic question generation). Evaluating 1,000
            examples with GPT-4 adds up quickly — fine for offline testing, expensive for continuous production
            monitoring.
          </li>
          <li>
            <strong className="text-white">Judge bias and inconsistency.</strong> LLM judges can be inconsistent
            across runs, biased toward verbose answers, and wrong on domain-specific facts the judge model does not
            know. Scores are useful for relative comparison, not absolute truth.
          </li>
          <li>
            <strong className="text-white">Context recall needs ground truth.</strong> The most retrieval-specific
            metric requires labelled correct answers — the expensive thing RAGAS tried to minimise elsewhere.
          </li>
          <li>
            <strong className="text-white">Does not evaluate latency or cost.</strong> RAGAS scores quality only.
            A pipeline with perfect faithfulness but 30-second response time is not production-ready — you need
            separate operational metrics.
          </li>
          <li>
            <strong className="text-white">What came after.</strong> ARES (next paper in this series) addressed
            the cost problem with fine-tuned lightweight judges. RAGAS itself expanded with additional metrics
            (answer correctness, context entity recall, summarisation scores). TruLens, Phoenix (Arize), and
            LangSmith offer complementary observability platforms. The LLM-as-judge paradigm RAGAS popularised
            became the foundation for most modern RAG evaluation.
          </li>
        </ul>
      </LessonSection>

      <LessonSection title="Connection to lessons">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Lesson</th>
                <th className="px-4 py-3">How this paper connects</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                [
                  'RAG Evaluation Overview',
                  'RAGAS is the open-source tool that implements the evaluation concepts from that lesson — this paper is the source',
                ],
                [
                  'Evaluation Frameworks',
                  'Faithfulness and answer relevancy are the core metrics taught there; RAGAS automates them with LLM judges',
                ],
                [
                  'Generation & Faithfulness Metrics',
                  'The claim-extraction approach to faithfulness — break answer into statements, verify each — comes directly from this paper',
                ],
                [
                  'Retrieval Overview',
                  'Context precision and context recall are how you measure whether your retriever is doing its job',
                ],
                [
                  'ARES paper',
                  'ARES builds on RAGAS by replacing expensive per-call GPT-4 judges with fine-tuned lightweight models',
                ],
              ].map(([lesson, connection]) => (
                <tr key={lesson} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{lesson}</td>
                  <td className="px-4 py-3 text-slate-400">{connection}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <Callout variant="beginner" title="Key insight for beginners">
        You cannot improve what you do not measure. RAGAS gives you automated faithfulness and relevancy scores
        without needing a perfect answer key for every question. Run it on 50 test questions before and after any
        tuning change — chunk size, embedding model, retrieval strategy — and compare the numbers.
      </Callout>

      <KeyTakeaways
        items={[
          'RAGAS evaluates RAG pipelines with four metrics: faithfulness, answer relevancy, context precision, context recall.',
          'Faithfulness uses LLM claim extraction + verification — no ground-truth answer needed.',
          'Answer relevancy checks whether the answer addresses the question, catching grounded but off-topic responses.',
          'Context recall requires ground truth; the other three metrics can run reference-free.',
          'Standard open-source framework — integrate with LangChain, LangSmith, or run standalone for before/after comparisons.',
        ]}
      />
    </LessonArticle>
  )
}
