import {
  Callout,
  ContentStep,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function PlaygroundAndPromptTesting() {
  return (
    <LessonArticle>
      <LessonSection title="The Playground — test without redeploying">
        <p className="text-slate-300">
          The LangSmith <strong className="text-white">Playground</strong> lets you edit prompts, swap models,
          and re-run with the same inputs — instantly in the browser. No code change, no deploy, no waiting for
          another user to hit the bug.
        </p>
        <Flowchart
          title="Playground workflow"
          chart={`flowchart LR
  A[Open Playground or trace] --> B[Edit prompt / model]
  B --> C[Run on single input or dataset row]
  C --> D{Better output?}
  D -- yes --> E[Save to Prompt Hub]
  D -- no --> B`}
        />
      </LessonSection>

      <LessonSection title="Test prompts on dataset rows">
        <ContentStep number={1} title="Load a dataset">
          <p>
            Open the Playground and select a dataset (e.g. <code className="font-mono text-sm">support-rag-golden-set</code>).
            Each row becomes a test case with pre-filled inputs.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Edit and run row by row">
          <p>
            Tweak the system prompt, adjust variables, change temperature. Run on one row to debug a failure, or
            batch-run across all rows to preview experiment results before calling{' '}
            <code className="font-mono text-sm">evaluate()</code>.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Save winning prompts to Hub">
          <p>
            When output looks good, save directly to Prompt Hub with a commit message. Pin the new version in
            code or run a full experiment to confirm across all rows.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Compare models side by side">
        <p className="text-slate-300">
          The Playground supports <strong className="text-white">model comparison</strong>: run the same prompt and
          inputs against GPT-4o, GPT-4o-mini, Claude, or others in parallel. See quality vs cost trade-offs
          before committing in production.
        </p>
        <div className="mt-4 overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Scenario</th>
                <th className="px-4 py-3">What to compare</th>
                <th className="px-4 py-3">Decision</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Cost reduction', 'GPT-4o vs GPT-4o-mini on 10 dataset rows', 'Mini good enough? Switch model.'],
                ['Quality boost', 'GPT-4o vs GPT-4.1 on hard failure cases', 'Worth the extra cost?'],
                ['Prompt iteration', 'v3 vs v4 system prompt, same model', 'Promote v4 to Hub?'],
              ].map(([scenario, compare, decision]) => (
                <tr key={scenario} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{scenario}</td>
                  <td className="px-4 py-3 text-slate-400">{compare}</td>
                  <td className="px-4 py-3 text-slate-400">{decision}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Jump from a bad trace">
        <p className="text-slate-300">
          Found a failing trace in the dashboard? Click <strong className="text-white">Open in Playground</strong>.
          LangSmith pre-fills the exact prompt, variables, and model from that run — you start from a perfect
          reproduction of the failure.
        </p>
        <Callout variant="beginner">
          Use the Playground for quick iteration; use <code className="font-mono text-sm">evaluate()</code> for
          formal before/after comparisons with evaluators and regression detection. Playground = fast; experiments
          = rigorous.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Playground lets you edit prompts and models in the UI — no redeploy required.',
          'Run against single inputs or full dataset rows before formal experiments.',
          'Compare models side by side to balance quality and cost.',
          'Open any bad trace in Playground for instant reproduction and fix iteration.',
        ]}
      />
    </LessonArticle>
  )
}
