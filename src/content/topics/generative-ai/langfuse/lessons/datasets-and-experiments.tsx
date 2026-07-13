import {
  Callout,
  ContentStep,
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
          outputs) you run repeatedly. An <strong className="text-white">experiment</strong> runs your pipeline
          against that dataset with a specific prompt version or model — then compares results side by side.
          Think of it as offline benchmarking before you touch production.
        </p>
      </LessonSection>

      <LessonSection title="Create a dataset">
        <ContentStep number={1} title="From production traces">
          <p>
            Filter traces in Langfuse: "faithfulness &lt; 0.5" or "user thumbs down". Select them and click{' '}
            <strong className="text-white">Add to Dataset</strong>. You get real failure cases — the hardest tests
            to write manually.
          </p>
        </ContentStep>
        <ContentStep number={2} title="From CSV upload">
          <p>
            Upload a spreadsheet with columns like <code className="font-mono text-sm">question</code>,{' '}
            <code className="font-mono text-sm">context</code>,{' '}
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

      <LessonSection title="Run experiments — compare versions">
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
  R --> P[Promote winner to production label]`}
        />
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
                ['Prompt v3 vs v4', 'Same model, different prompt label', 'Did the new instructions improve faithfulness?'],
                ['GPT-4o vs GPT-4o-mini', 'Same prompt, different model', 'Can we cut cost 10× with acceptable quality?'],
                ['Retrieval k=3 vs k=5', 'Same prompt, different pipeline config', 'More chunks help or add noise?'],
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
      </LessonSection>

      <LessonSection title="Offline benchmarking before deploy">
        <p className="text-slate-300">
          Never flip the <code className="font-mono text-sm">production</code> prompt label without running an
          experiment first. Run v4 against your dataset, check average faithfulness and cost, diff individual rows
          where v4 regressed, fix, re-run. Only then promote the label.
        </p>
        <Callout variant="beginner">
          Start with 20–50 rows from real production failures. That small set catches most regressions and runs in
          minutes. Expand to hundreds as your app matures.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Datasets = fixed test inputs; experiments = run pipeline variants against them offline.',
          'Build datasets from production traces (failures) or CSV golden sets.',
          'Compare prompt versions, models, or retrieval settings side by side before deploy.',
          'Always experiment before moving a prompt label to production.',
        ]}
      />
    </LessonArticle>
  )
}
