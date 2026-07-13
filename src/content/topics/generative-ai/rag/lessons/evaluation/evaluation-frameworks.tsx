import {
  Callout,
  ContentStep,
  Definition,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function EvaluationFrameworks() {
  return (
    <LessonArticle>
      <LessonSection title="Why use a framework instead of manual scoring?">
        <p className="text-slate-300">
          You <em>can</em> evaluate RAG by hand — read each answer, check each retrieved chunk, score
          faithfulness yourself. For 20 questions, that works. For 200 questions across 10 pipeline iterations,
          you need automation. Evaluation frameworks are tools that score your RAG pipeline programmatically,
          so you can measure improvements after every change.
        </p>
        <Callout variant="beginner" title="Think of it like fitness apps">
          You could track workouts in a notebook. But an app that logs reps, charts progress, and alerts you
          when form is off is faster and more reliable. Evaluation frameworks do the same for RAG quality.
        </Callout>
      </LessonSection>

      <Definition term="RAGAS">
        <p>
          <strong className="text-white">RAGAS</strong> (Retrieval Augmented Generation Assessment) is the most
          popular open-source RAG evaluation toolkit. Think of it as the "MyFitnessPal of RAG" — feed it your
          questions, retrieved chunks, and generated answers, and it scores four dimensions automatically using
          LLM-as-judge under the hood.
        </p>
        <p>
          Best part: RAGAS can score faithfulness and relevance <em>without</em> ground-truth answers for every
          question. It uses the LLM to judge whether the answer is supported by context and addresses the
          question.
        </p>
      </Definition>

      <LessonSection title="RAGAS — the four metrics it computes">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">RAGAS metric</th>
                <th className="px-4 py-3">What it checks</th>
                <th className="px-4 py-3">Plain-language analogy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                [
                  'Context precision',
                  'Of the retrieved chunks, how many are actually relevant to the question?',
                  'Did the librarian bring useful books, or mostly irrelevant ones?',
                ],
                [
                  'Context recall',
                  'Did retrieval find all the information needed to answer?',
                  'Did the librarian find every book chapter that covers this topic?',
                ],
                [
                  'Faithfulness',
                  'Is every claim in the answer supported by the retrieved chunks?',
                  'Did the student only use facts from the textbook?',
                ],
                [
                  'Answer relevancy',
                  'Does the answer actually address the question asked?',
                  'Did the student answer the exam question, not a different one?',
                ],
              ].map(([metric, checks, analogy]) => (
                <tr key={metric} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{metric}</td>
                  <td className="px-4 py-3 text-slate-400">{checks}</td>
                  <td className="px-4 py-3 text-slate-400">{analogy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip">
          RAGAS is free, open-source, and pip-installable. Start here if you are evaluating RAG for the first
          time. It handles the LLM-as-judge prompts so you do not have to write them yourself.
        </Callout>
      </LessonSection>

      <LessonSection title="Other frameworks — recommending apps to a friend">
        <p className="text-slate-300">
          Each framework has a personality. Here is how I would recommend them based on what you need:
        </p>

        <div className="mt-4 space-y-4">
          <div className="rounded-xl border border-surface-600 bg-surface-800/50 p-5">
            <p className="text-base font-semibold text-white">DeepEval — "the unit test runner"</p>
            <p className="mt-2 text-sm text-slate-400">
              If you are a developer who wants RAG quality checks in your CI/CD pipeline — like pytest but for
              hallucinations — this is your tool. Write test cases with expected behaviours, run them on every
              deploy, fail the build if faithfulness drops below 0.9.
            </p>
            <p className="mt-2 text-sm text-genai-400">
              Recommend when: you want automated RAG tests that run on every code change.
            </p>
          </div>

          <div className="rounded-xl border border-surface-600 bg-surface-800/50 p-5">
            <p className="text-base font-semibold text-white">TruLens — "the flight recorder"</p>
            <p className="mt-2 text-sm text-slate-400">
              Records every RAG call — what was retrieved, what was generated, how long it took — and lets you
              attach feedback functions that score each step. Integrates natively with LangChain. Like a black
              box recorder for your RAG pipeline: when something goes wrong, replay the exact retrieval and
              generation steps.
            </p>
            <p className="mt-2 text-sm text-genai-400">
              Recommend when: you are already using LangChain and want tracing + evaluation in one place.
            </p>
          </div>

          <div className="rounded-xl border border-surface-600 bg-surface-800/50 p-5">
            <p className="text-base font-semibold text-white">LangSmith — "the LangChain dashboard"</p>
            <p className="mt-2 text-sm text-slate-400">
              LangChain's official platform for tracing, datasets, and evaluation. If your entire RAG pipeline
              is built in LangChain, LangSmith is the path of least resistance — one-click eval datasets,
              side-by-side run comparison, and production monitoring. Paid service with a generous free tier.
            </p>
            <p className="mt-2 text-sm text-genai-400">
              Recommend when: you are all-in on LangChain and want the official integrated experience.
            </p>
          </div>

          <div className="rounded-xl border border-surface-600 bg-surface-800/50 p-5">
            <p className="text-base font-semibold text-white">Phoenix (by Arize) — "the X-ray machine"</p>
            <p className="mt-2 text-sm text-slate-400">
              Visualises your embedding space — plot chunks as dots, colour by cluster, see which queries land
              near which documents. Invaluable for debugging <em>why</em> retrieval fails: are refund chunks
              clustering far from refund queries? Is chunking splitting related content apart? Open-source with
              a local UI.
            </p>
            <p className="mt-2 text-sm text-genai-400">
              Recommend when: retrieval recall is low and you need to understand embedding/clustering problems visually.
            </p>
          </div>
        </div>
      </LessonSection>

      <LessonSection title="Framework comparison at a glance">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Framework</th>
                <th className="px-4 py-3">Best for</th>
                <th className="px-4 py-3">Cost</th>
                <th className="px-4 py-3">Setup effort</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['RAGAS', 'First-time eval; faithfulness + relevance scoring', 'Free (open-source)', 'Low — pip install + 20 lines of code'],
                ['DeepEval', 'CI/CD automated RAG tests', 'Free (open-source)', 'Medium — write test cases'],
                ['TruLens', 'LangChain tracing + feedback', 'Free (open-source)', 'Medium — instrument pipeline'],
                ['LangSmith', 'LangChain-native eval + monitoring', 'Free tier + paid', 'Low if already on LangChain'],
                ['Phoenix', 'Embedding visualisation + retrieval debugging', 'Free (open-source)', 'Low — pip install + local UI'],
              ].map(([framework, bestFor, cost, effort]) => (
                <tr key={framework} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{framework}</td>
                  <td className="px-4 py-3 text-slate-400">{bestFor}</td>
                  <td className="px-4 py-3 text-slate-400">{cost}</td>
                  <td className="px-4 py-3 text-slate-400">{effort}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Recommended eval workflow — step by step">
        <ContentStep number={1} title="Build a test set (30–100 questions)">
          <p>
            Collect real user questions. Label the correct chunks and write ground-truth answers. Store as a CSV
            or JSON — most frameworks accept this format directly.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Measure Recall@5">
          <p>
            Run retrieval on every test question. Check if labelled chunks appear in top-5. Do this manually for
            your first 20 questions, then automate with RAGAS context recall for larger sets.
          </p>
        </ContentStep>
        <ContentStep number={3} title="If recall ≥ 80%, measure faithfulness">
          <p>
            Run the full pipeline (retrieval + generation). Score faithfulness and answer relevancy with RAGAS or
            LLM-as-judge. Investigate any question scoring below 0.8.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Iterate on the weakest layer">
          <p>
            Low recall? Fix chunking or retrieval. Low faithfulness? Fix prompts and temperature. Re-run the
            full eval after each change. Track scores over time in a spreadsheet or dashboard.
          </p>
        </ContentStep>
        <ContentStep number={5} title="Automate with CI/CD (optional)">
          <p>
            Once your pipeline is stable, add DeepEval tests that run on every deploy. Fail the build if
            faithfulness drops below your threshold. This prevents regressions as you add features.
          </p>
        </ContentStep>
        <Callout variant="insight">
          You do not need all five frameworks. A typical progression: start with RAGAS for scoring, add Phoenix
          if retrieval is confusing, add DeepEval when you want CI/CD guards. Pick one, learn it well, then add
          others only when you hit a specific need.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'RAGAS: start here — free, pip-installable, scores faithfulness and relevance without ground truth.',
          'DeepEval for CI/CD tests; TruLens/LangSmith for LangChain tracing; Phoenix for embedding debugging.',
          'Workflow: test set → Recall@5 → faithfulness → iterate on weakest layer → automate.',
          'Pick one framework, learn it well. Add others only when you hit a specific gap.',
        ]}
      />
    </LessonArticle>
  )
}
