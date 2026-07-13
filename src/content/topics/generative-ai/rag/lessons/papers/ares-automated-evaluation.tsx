import {
  Callout,
  ContentStep,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
  ResearchPaperHeader,
} from '../../../../../../components/content'

const PAPER_URL = 'https://arxiv.org/abs/2311.09476'

export function AresAutomatedEvaluation() {
  return (
    <LessonArticle>
      <ResearchPaperHeader
        title="ARES: An Automated Evaluation Framework for Retrieval-Augmented Generation Systems"
        authors="Saad-Falcon et al. (Stanford)"
        year="2023"
        url={PAPER_URL}
      >
        <strong className="text-white">ARES</strong> — train lightweight judge models on synthetic data to evaluate
        RAG context relevance, answer faithfulness, and answer relevance at scale without expensive LLM calls per
        evaluation.
      </ResearchPaperHeader>

      <Callout variant="beginner" title="Read this after">
        Read the <em>RAGAS</em> paper and <em>Generation & Faithfulness Metrics</em> first. ARES solves the cost
        problem RAGAS has when you want to evaluate thousands of queries — like monitoring every production
        request instead of running an offline test batch.
      </Callout>

      <LessonSection title="What this paper means in plain English">
        <p>
          RAGAS gave the RAG world its report card: faithfulness, answer relevancy, context precision, context
          recall. Teams loved it for offline testing — run 100 questions through your pipeline, get scores, tune,
          repeat. But RAGAS uses a large LLM (typically GPT-4) as a judge for every single evaluation step. Claim
          extraction, claim verification, synthetic question generation — each metric burns multiple GPT-4 calls
          per test example. That is fine for a weekly test suite. It is prohibitively expensive if you want to
          score <em>every production query</em> in real time to catch quality drops before users complain.
        </p>
        <p>
          ARES (Automated RAG Evaluation System) asks a practical question: can we train a small, fast model to
          judge RAG quality almost as well as GPT-4, but at a fraction of the cost? The answer is yes — with a
          clever training pipeline. First, use GPT-4 once (offline) to generate thousands of synthetic evaluation
          examples with quality labels. Then fine-tune a lightweight model (DeBERTa-based classifiers) on that
          synthetic data to predict three quality dimensions: context relevance, answer faithfulness, and answer
          relevance. At evaluation time, the small judge runs in milliseconds on a CPU, not seconds on an API.
        </p>
        <p>
          Think of it as training an intern. A senior expert (GPT-4) grades thousands of practice examples.
          The intern (DeBERTa judge) studies those graded examples and learns to spot the same patterns. Once
          trained, the intern handles day-to-day reviews at 100× lower cost. ARES also uses a statistical
          technique called <em>prediction-powered inference</em> to correct for the fact that the intern is not
          perfect — giving you confidence intervals on final scores, not just point estimates.
        </p>
        <p>
          The result: continuous RAG monitoring becomes realistic. Instead of evaluating 100 test questions per
          week with RAGAS, you can score thousands of production queries per day with ARES judges and alert when
          faithfulness drops below a threshold. That is the shift from "we test before deploy" to "we watch quality
          every hour in production."
        </p>
      </LessonSection>

      <LessonSection title="The problem before this paper">
        <p>
          By late 2023, LLM-as-judge evaluation (pioneered by RAGAS and similar frameworks) was the best
          available approach for RAG quality measurement. But three problems blocked production-scale adoption.
        </p>
        <p>
          <strong className="text-white">Cost at scale.</strong> RAGAS-style evaluation with GPT-4 costs roughly
          $0.05–0.15 per test example (multiple LLM calls per metric). Evaluating 10,000 production queries per
          day means $500–1,500 daily — just for quality monitoring. Most teams could afford weekly test batches
          but not continuous surveillance.
        </p>
        <p>
          <strong className="text-white">Latency.</strong> GPT-4 judge calls take 2–10 seconds each. Real-time
          monitoring of live traffic requires millisecond-scoring, not API round-trips. You cannot put a GPT-4
          call in the hot path of every user request.
        </p>
        <p>
          <strong className="text-white">Human annotation does not scale either.</strong> The alternative —
          hiring human evaluators to rate RAG outputs — is even slower and more expensive. Synthetic data
          generation with LLMs offered a third path, but naive synthetic labels are noisy. ARES needed to
          show that synthetic-trained judges could still correlate with human preferences.
        </p>
        <p>
          ARES proposed: generate synthetic labelled data with GPT-4 once, train cheap specialised judges, and
          use statistical correction to ensure those judges align with human ratings — making continuous
          evaluation economically viable.
        </p>
      </LessonSection>

      <LessonSection title="ARES training and inference pipeline">
        <Flowchart
          title="From synthetic labels to production monitoring"
          chart={`flowchart TB
  A[GPT-4 generates synthetic RAG examples] --> B[Label: context relevance]
  A --> C[Label: answer faithfulness]
  A --> D[Label: answer relevance]
  B --> E[Fine-tune DeBERTa judge models]
  C --> E
  D --> E
  E --> F[Lightweight judges ready]
  G[Production RAG query] --> H[Collect question + context + answer]
  H --> F
  F --> I[Millisecond quality scores]
  I --> J[Prediction-powered inference with confidence intervals]
  J --> K[Alert if scores drop below threshold]`}
        />
      </LessonSection>

      <LessonSection title="How it works — step by step">
        <ContentStep number={1} title="Define three evaluation dimensions">
          <p>
            ARES evaluates the same three quality dimensions most RAG practitioners care about, aligned with
            RAGAS but named slightly differently:
          </p>
          <ul className="mt-2 list-disc space-y-2 pl-5 text-slate-300">
            <li>
              <strong className="text-white">Context relevance</strong> — are the retrieved passages relevant to
              the question? (Maps to RAGAS context precision.)
            </li>
            <li>
              <strong className="text-white">Answer faithfulness</strong> — is the generated answer supported by
              the retrieved context? (Maps to RAGAS faithfulness.)
            </li>
            <li>
              <strong className="text-white">Answer relevance</strong> — does the answer address the question?
              (Maps to RAGAS answer relevancy.)
            </li>
          </ul>
        </ContentStep>

        <ContentStep number={2} title="Generate synthetic training data with GPT-4">
          <p>
            For each dimension, GPT-4 generates thousands of synthetic (question, context, answer) triples with
            binary or graded quality labels. For faithfulness, GPT-4 creates pairs where the answer is fully
            supported by context and pairs where the answer contains unsupported claims. For context relevance,
            GPT-4 creates pairs with on-topic and off-topic retrieved passages. This synthetic dataset replaces
            expensive human annotation.
          </p>
          <p className="mt-2">
            The paper uses diverse source corpora (Wikipedia, news, specialised domains) to ensure judges
            generalise across RAG applications, not just one dataset.
          </p>
        </ContentStep>

        <ContentStep number={3} title="Fine-tune lightweight DeBERTa judge models">
          <p>
            For each dimension, a separate <strong className="text-white">DeBERTa-v3</strong> classifier is
            fine-tuned on the synthetic labels. DeBERTa is a small encoder model (~400M parameters) that runs
            on a single GPU or even CPU in milliseconds. Each judge takes the (question, context, answer) triple
            as input and outputs a relevance or quality score.
          </p>
          <p className="mt-2">
            Three separate models — one per dimension — because faithfulness, relevance, and context quality
            require different judgement patterns. A single multi-task model performed worse in their experiments.
          </p>
        </ContentStep>

        <ContentStep number={4} title="Validate judges against human preferences">
          <p>
            Before deployment, ARES validates each judge on a small set of human-annotated examples (the only
            human labelling required). The paper measures Kendall's tau and accuracy correlation between judge
            predictions and human ratings. Judges that fail to correlate are retrained with adjusted synthetic
            data.
          </p>
        </ContentStep>

        <ContentStep number={5} title="Prediction-powered inference for calibrated scores">
          <p>
            Synthetic labels from GPT-4 are imperfect — the fine-tuned judges inherit that noise. ARES applies{' '}
            <strong className="text-white">prediction-powered inference (PPI)</strong>, a statistical technique
            that combines a small number of gold-standard human labels with many cheap model predictions to
            produce calibrated final scores with confidence intervals.
          </p>
          <p className="mt-2">
            Intuitively: you trust the lightweight judge for bulk scoring, but you correct its systematic
            bias using a handful of human-rated examples. The result is an accurate aggregate score (e.g.,
            "faithfulness is 0.87 ± 0.03") rather than a potentially miscalibrated point estimate.
          </p>
        </ContentStep>

        <ContentStep number={6} title="Deploy for continuous production monitoring">
          <p>
            At inference time, each production RAG query is scored by all three DeBERTa judges in milliseconds.
            Scores are aggregated over sliding windows (hourly, daily) with PPI confidence intervals. If
            faithfulness drops below a threshold — say, after a document index update or model swap — the system
            alerts the team. No GPT-4 calls in the hot path.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="What the researchers tested">
        <p>
          Saad-Falcon et al. evaluated ARES judges across multiple RAG benchmarks and domains, with a focus on
          correlation with human ratings and comparison against GPT-4 judges and RAGAS.
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Benchmarks</strong> — KILT (knowledge-intensive language tasks),
            SuperGLUE subsets, and domain-specific RAG datasets including financial and biomedical corpora.
          </li>
          <li>
            <strong className="text-white">Baselines</strong> — GPT-4 as judge (RAGAS-style), smaller LLM judges
            (GPT-3.5), untrained DeBERTa, and human annotator ratings as the gold standard.
          </li>
          <li>
            <strong className="text-white">Correlation metrics</strong> — Kendall's tau, accuracy, and Pearson
            correlation between judge scores and human preferences on each of the three dimensions.
          </li>
          <li>
            <strong className="text-white">Cost and latency measurements</strong> — compared inference time and
            dollar cost per evaluation for ARES judges vs GPT-4 judges, at batch sizes from 100 to 100,000
            examples.
          </li>
          <li>
            <strong className="text-white">PPI ablation</strong> — measured how prediction-powered inference
            improved score calibration compared to raw judge outputs, using varying amounts of human-labelled
            correction data (10, 50, 100 examples).
          </li>
          <li>
            <strong className="text-white">Cross-domain generalisation</strong> — trained judges on synthetic
            Wikipedia data, tested on financial and biomedical RAG outputs to measure out-of-domain robustness.
          </li>
        </ul>
      </LessonSection>

      <LessonSection title="Key results — what they found">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">ARES judges matched GPT-4 judge quality.</strong> On context relevance,
            answer faithfulness, and answer relevance, fine-tuned DeBERTa judges achieved Kendall's tau
            correlation with human ratings comparable to GPT-4 — sometimes slightly better on specific domains.
          </li>
          <li>
            <strong className="text-white">100× cheaper per evaluation.</strong> DeBERTa inference costs fractions
            of a cent per example vs several cents for GPT-4 judge calls. At 10,000 daily evaluations, the
            difference is dollars vs hundreds of dollars.
          </li>
          <li>
            <strong className="text-white">Millisecond latency.</strong> ARES judges score a (question, context,
            answer) triple in under 50 ms on a single GPU — fast enough for inline production monitoring.
          </li>
          <li>
            <strong className="text-white">PPI improved calibration.</strong> Prediction-powered inference with
            as few as 50 human-labelled examples produced aggregate scores within confidence intervals that
            contained the true human-rated mean — correcting systematic judge bias.
          </li>
          <li>
            <strong className="text-white">Synthetic data was sufficient.</strong> Judges trained entirely on
            GPT-4-generated synthetic labels generalised to real RAG pipeline outputs across multiple domains,
            validating the "train on synthetic, deploy on real" approach.
          </li>
        </ul>
      </LessonSection>

      <LessonSection title="Limitations and what came after">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Initial setup cost.</strong> ARES requires generating synthetic data
            and fine-tuning three judge models before you can evaluate anything. RAGAS works out of the box with
            an API key. ARES pays off at scale, not for a one-time test of 20 questions.
          </li>
          <li>
            <strong className="text-white">Domain shift risk.</strong> Judges trained on Wikipedia-style synthetic
            data may underperform on highly specialised domains (legal, medical) unless you regenerate synthetic
            data for that domain and retrain.
          </li>
          <li>
            <strong className="text-white">Three separate models to maintain.</strong> Each quality dimension
            needs its own fine-tuned judge. Updating one requires retraining; there is no single unified judge.
          </li>
          <li>
            <strong className="text-white">Binary/scalar scores, not claim-level detail.</strong> Unlike RAGAS
            faithfulness (which shows which specific claims failed), ARES judges output an aggregate score. You
            know faithfulness dropped but not which sentence hallucinated — unless you add separate explainability
            tooling.
          </li>
          <li>
            <strong className="text-white">What came after.</strong> The lightweight-judge paradigm influenced
            tools like Galileo, Patronus AI, and custom fine-tuned evaluators in LangSmith. RAGAS v0.2 added
            support for local and fine-tuned judges. Research on unified multi-metric judges and online
            evaluation (scoring during live traffic with minimal overhead) continues. The broader lesson —
            separate offline evaluation (RAGAS) from production monitoring (ARES-style judges) — is now standard
            RAG ops practice.
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
                  'RAGAS paper',
                  'ARES solves the cost and latency problem RAGAS has — same quality dimensions, 100× cheaper judges',
                ],
                [
                  'Generation & Faithfulness Metrics',
                  'ARES judges faithfulness, relevance, and context quality — the same dimensions taught in that lesson',
                ],
                [
                  'RAG Evaluation Overview',
                  'Shows how to move from one-off offline evaluation (RAGAS) to continuous production monitoring',
                ],
                [
                  'Evaluation Frameworks',
                  'Prediction-powered inference is a practical technique for calibrating imperfect automated judges',
                ],
                [
                  'RAG Evaluation & Limitations',
                  'Continuous monitoring catches quality regressions that offline test suites miss — index updates, model swaps, doc drift',
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
        RAGAS is great for testing before you ship — run 50 questions, get detailed scores. ARES is for watching
        quality after you ship — score thousands of real queries cheaply. Most mature teams use both: RAGAS for
        deep offline debugging, lightweight judges for daily production health checks.
      </Callout>

      <KeyTakeaways
        items={[
          'ARES trains lightweight DeBERTa judge models on GPT-4-generated synthetic labels — three judges for three dimensions.',
          'Scores context relevance, answer faithfulness, and answer relevance at ~100× lower cost than GPT-4 judges.',
          'Prediction-powered inference calibrates imperfect judges using a small set of human-rated examples.',
          'Millisecond inference enables continuous production monitoring, not just offline test batches.',
          'Use RAGAS for deep pre-deploy testing; use ARES-style judges for ongoing production surveillance.',
        ]}
      />
    </LessonArticle>
  )
}
