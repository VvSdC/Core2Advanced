import {
  Callout,
  ContentStep,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function GettingTheBestResults() {
  return (
    <LessonArticle>
      <LessonSection title="Prompt structure that works">
        <ContentStep number={1} title="Use a consistent template">
          <p>Most reliable prompts follow this order:</p>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-slate-300">
            <li><strong className="text-white">Context</strong> — background the model needs.</li>
            <li><strong className="text-white">Task</strong> — what to do, stated as a verb ("Summarise", "Classify", "Extract").</li>
            <li><strong className="text-white">Constraints</strong> — length, tone, what to avoid.</li>
            <li><strong className="text-white">Format</strong> — bullets, JSON, paragraphs.</li>
            <li><strong className="text-white">Input</strong> — the actual data, clearly delimited.</li>
          </ol>
        </ContentStep>

        <ContentStep number={2} title="Delimit user input">
          <p>
            Wrap user-provided content in clear markers so the model knows what is instruction vs data:
          </p>
          <Callout variant="beginner">
            Use triple quotes, XML tags (<code className="font-mono text-sm">&lt;document&gt;...&lt;/document&gt;</code>),
            or markdown fences. This reduces the model blending your instructions with the input text.
          </Callout>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Inference settings">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Setting</th>
                <th className="px-4 py-3">Low value</th>
                <th className="px-4 py-3">High value</th>
                <th className="px-4 py-3">Use low when</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Temperature', '0.0–0.3', '0.7–1.5', 'Factual answers, code, extraction, JSON'],
                ['Top-p', '0.1–0.5', '0.9–1.0', 'You need deterministic, focused output'],
                ['Max tokens', 'Short cap', 'Long cap', 'You want concise answers or lower cost'],
              ].map(([setting, low, high, useLow]) => (
                <tr key={setting} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{setting}</td>
                  <td className="px-4 py-3 font-mono">{low}</td>
                  <td className="px-4 py-3 font-mono">{high}</td>
                  <td className="px-4 py-3 text-slate-400">{useLow}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip">
          For creative writing or brainstorming, raise temperature. For anything you will parse or ship to
          users as fact, keep temperature at 0–0.3.
        </Callout>
      </LessonSection>

      <LessonSection title="Iteration workflow">
        <ol className="list-decimal space-y-2 pl-5 text-slate-300">
          <li><strong className="text-white">Start zero-shot</strong> — see if the model already understands the task.</li>
          <li><strong className="text-white">Inspect failures</strong> — wrong format? missing reasoning? hallucination?</li>
          <li><strong className="text-white">Add one technique at a time</strong> — examples, CoT, system prompt — and measure improvement.</li>
          <li><strong className="text-white">Test on edge cases</strong> — empty input, very long input, ambiguous cases.</li>
          <li><strong className="text-white">Freeze the winning prompt</strong> — version-control it like code.</li>
        </ol>
      </LessonSection>

      <LessonSection title="Model selection">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li><strong className="text-white">SLM (7B–13B)</strong> — zero-shot and simple extraction; fine-tune for specialised tasks.</li>
          <li><strong className="text-white">LLM (70B+)</strong> — few-shot, CoT, complex reasoning.</li>
          <li><strong className="text-white">Instruction-tuned</strong> — always prefer aligned models for user-facing prompts.</li>
          <li><strong className="text-white">If prompting fails on a small model</strong> — try a larger model before spending weeks on prompt tweaks.</li>
        </ul>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Use a consistent template: context → task → constraints → format → input.',
          'Low temperature for facts and JSON; higher for creativity.',
          'Iterate: start zero-shot, add techniques one at a time, test edge cases.',
          'Pick model size and alignment level to match task complexity.',
        ]}
      />
    </LessonArticle>
  )
}
