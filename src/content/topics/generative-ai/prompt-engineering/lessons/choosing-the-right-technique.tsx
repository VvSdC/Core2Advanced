import {
  Callout,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function ChoosingTheRightTechnique() {
  return (
    <LessonArticle>
      <LessonSection title="Decision guide">
        <Flowchart
          title="Which prompting technique should I use?"
          chart={`flowchart TB
  A([New task]) --> B{Simple fact or generation?}
  B -- yes --> C[Zero-shot with clear instructions]
  B -- no --> D{Need specific format or labels?}
  D -- yes --> E[Few-shot with 3-5 examples]
  D -- no --> F{Multi-step math or logic?}
  F -- yes --> G[Chain-of-thought]
  F -- no --> H{Building a chatbot or assistant?}
  H -- yes --> I[System / role prompt + zero-shot user messages]
  H -- no --> J{Output consumed by code?}
  J -- yes --> K[Structured output / JSON]
  J -- no --> C`}
        />
      </LessonSection>

      <LessonSection title="Technique comparison">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Technique</th>
                <th className="px-4 py-3">Token cost</th>
                <th className="px-4 py-3">Model size needed</th>
                <th className="px-4 py-3">Best for</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Zero-shot', 'Low', 'Any (better on large)', 'Simple tasks, Q&A, drafting'],
                ['Few-shot', 'Medium', 'Large (70B+)', 'Classification, extraction, custom formats'],
                ['Chain-of-thought', 'High', 'Large only', 'Math, logic, multi-step reasoning'],
                ['System / role', 'Low (once per chat)', 'Instruction-tuned', 'Persona, tone, constraints'],
                ['Structured output', 'Medium', 'Any', 'JSON, APIs, pipelines'],
                ['Self-consistency', 'Very high (N runs)', 'Large', 'High-stakes reasoning accuracy'],
              ].map(([technique, cost, size, best]) => (
                <tr key={technique} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{technique}</td>
                  <td className="px-4 py-3">{cost}</td>
                  <td className="px-4 py-3">{size}</td>
                  <td className="px-4 py-3 text-slate-400">{best}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Combining techniques">
        <p>Production prompts often stack multiple techniques:</p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-300">
          <li><strong className="text-white">System prompt</strong> + <strong className="text-white">few-shot</strong> user message — chatbot that classifies support tickets.</li>
          <li><strong className="text-white">System prompt</strong> + <strong className="text-white">CoT</strong> — coding assistant that reasons step by step.</li>
          <li><strong className="text-white">Few-shot</strong> + <strong className="text-white">structured output</strong> — extraction with a fixed JSON schema.</li>
        </ul>
        <Callout variant="insight">
          Start with the simplest technique that works. Add complexity only when zero-shot fails — every extra
          technique costs tokens and latency.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Match technique to task type — do not default to few-shot for everything.',
          'Start simple (zero-shot), escalate to few-shot or CoT only when needed.',
          'Stack techniques: system prompt for behaviour, user prompt for task specifics.',
          'Consider token cost and model size requirements before choosing.',
        ]}
      />
    </LessonArticle>
  )
}
