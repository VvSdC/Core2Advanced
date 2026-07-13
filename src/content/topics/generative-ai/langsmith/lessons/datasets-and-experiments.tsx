import {
  Callout,
  ContentStep,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function DatasetsAndExperiments() {
  return (
    <LessonArticle>
      <LessonSection title="What are datasets and experiments?">
        <p className="text-slate-300">
          A <strong className="text-white">dataset</strong> is a fixed set of test inputs (and optional expected
          outputs) you run repeatedly. An <strong className="text-white">experiment</strong> runs your chain or
          agent against that dataset with a specific prompt, model, or config — then compares results side by side.
          Think of it as offline benchmarking before you touch production.
        </p>
      </LessonSection>

      <LessonSection title="Create a dataset">
        <ContentStep number={1} title="From production traces">
          <p>
            In LangSmith, filter traces: low faithfulness score, user thumbs down, or errors. Select them and click{' '}
            <strong className="text-white">Add to Dataset</strong>. You capture real failure cases — the hardest
            tests to write manually.
          </p>
        </ContentStep>
        <ContentStep number={2} title="From CSV upload">
          <p>
            Upload a spreadsheet with columns like <code className="font-mono text-sm">question</code>,{' '}
            <code className="font-mono text-sm">context</code>, and{' '}
            <code className="font-mono text-sm">expected_answer</code>. Good for golden sets built by domain
            experts before launch.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Curate over time">
          <p>
            Add new rows every sprint as you discover edge cases. A living dataset beats a one-time test file that
            rots in a repo.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Run experiments with evaluate()">
        <p className="text-slate-300">
          LangSmith's <code className="font-mono text-sm">evaluate()</code> (or{' '}
          <code className="font-mono text-sm">run_on_dataset</code>) runs your chain on every dataset row, logs
          traces, and applies evaluators — all in one call.
        </p>
        <Example title="evaluate() workflow">{`from langsmith import evaluate

results = evaluate(
    lambda inputs: chain.invoke(inputs),
    data="support-rag-golden-set",      # dataset name in LangSmith
    evaluators=[faithfulness_evaluator],
    experiment_prefix="prompt-v4-gpt4o", # labels this run for comparison
)

# Results appear in LangSmith UI — compare with prior experiments`}</Example>
        <Flowchart
          title="Experiment workflow"
          chart={`flowchart TB
  D[Dataset: 50 support questions]
  D --> E1[Experiment A: prompt v3 + GPT-4o]
  D --> E2[Experiment B: prompt v4 + GPT-4o]
  D --> E3[Experiment C: prompt v4 + GPT-4o-mini]
  E1 --> R[Compare: latency, cost, faithfulness]
  E2 --> R
  E3 --> R
  R --> P[Promote winner to production]`}
        />
      </LessonSection>

      <LessonSection title="Compare chain versions and catch regressions">
        <div className="mt-4 overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Compare</th>
                <th className="px-4 py-3">Example</th>
                <th className="px-4 py-3">What you learn</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Prompt v3 vs v4', 'Same model, different Hub commit', 'Did new instructions improve faithfulness?'],
                ['GPT-4o vs GPT-4o-mini', 'Same prompt, different model', 'Can we cut cost 10× with acceptable quality?'],
                ['Retrieval k=3 vs k=5', 'Same prompt, different RAG config', 'More chunks help or add noise?'],
              ].map(([compare, example, learn]) => (
                <tr key={compare} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{compare}</td>
                  <td className="px-4 py-3 text-slate-400">{example}</td>
                  <td className="px-4 py-3 text-slate-400">{learn}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="beginner">
          <strong className="text-white">Regression detection:</strong> open two experiments side by side in the UI.
          Filter rows where v4 scored lower than v3. Fix those cases, re-run, then promote. Never ship a prompt
          change without this check.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Datasets = fixed test inputs; experiments = run chain variants against them offline.',
          'Build datasets from production traces (failures) or CSV golden sets.',
          'Use evaluate() / run_on_dataset to run chains and evaluators in one step.',
          'Compare prompt versions, models, or configs side by side before deploy.',
        ]}
      />
    </LessonArticle>
  )
}
