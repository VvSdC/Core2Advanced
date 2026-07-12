import {
  Callout,
  ContentStep,
  Definition,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function SmallLanguageModels() {
  return (
    <LessonArticle>
      <Definition term="Small Language Model (SLM)">
        <p>
          A <strong className="text-white">small language model</strong> typically has fewer than{' '}
          <strong className="text-white">10 billion parameters</strong> — often in the 1B–8B range. SLMs are
          designed to run on consumer hardware, edge devices, or with minimal cloud cost while still handling
          useful language tasks.
        </p>
      </Definition>

      <LessonSection title="Where SLMs sit on the scale">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Model</th>
                <th className="px-4 py-3">Parameters</th>
                <th className="px-4 py-3">Typical use</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Gemma 2', '2B / 9B', 'On-device assistants, fast inference'],
                ['Phi-3 Mini', '3.8B', 'Strong reasoning for its size'],
                ['Llama 3.2', '1B / 3B', 'Mobile and edge deployment'],
                ['Mistral 7B', '7B', 'General-purpose open model'],
                ['Qwen 2.5', '0.5B–7B', 'Multilingual, scalable family'],
              ].map(([model, params, use]) => (
                <tr key={model} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{model}</td>
                  <td className="px-4 py-3 font-mono">{params}</td>
                  <td className="px-4 py-3 text-slate-400">{use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Strengths of SLMs">
        <ContentStep number={1} title="Speed and cost">
          <ul className="list-disc space-y-1 pl-5 text-slate-300">
            <li>Fewer parameters → fewer computations per token → faster responses.</li>
            <li>A 3B model can run on a laptop GPU or even CPU with quantisation.</li>
            <li>Cloud inference costs are a fraction of what a 70B model requires.</li>
          </ul>
        </ContentStep>

        <ContentStep number={2} title="Privacy and offline use">
          <ul className="list-disc space-y-1 pl-5 text-slate-300">
            <li>Small enough to run entirely on-device — no data leaves the phone or laptop.</li>
            <li>Works offline: autocomplete, summarisation, or chat without an internet connection.</li>
            <li>Ideal for regulated industries (healthcare, finance) where data cannot go to external APIs.</li>
          </ul>
        </ContentStep>

        <ContentStep number={3} title="Task-specific excellence">
          <p>
            A small model fine-tuned on one domain often beats a general-purpose giant. Examples:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-300">
            <li>Code completion on your company's codebase</li>
            <li>Customer-support replies in a fixed product catalogue</li>
            <li>Extracting fields from structured documents</li>
          </ul>
          <Callout variant="insight">
            "Small" does not mean "weak." Distillation and fine-tuning let SLMs punch well above their parameter count
            on focused tasks.
          </Callout>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Trade-offs">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li><strong className="text-white">Weaker general reasoning</strong> — multi-step math, complex planning, and rare knowledge are harder.</li>
          <li><strong className="text-white">Shorter effective context</strong> — may lose track in very long documents.</li>
          <li><strong className="text-white">More hallucination on niche topics</strong> — less capacity to store rare facts.</li>
        </ul>
        <Callout variant="tip">
          Use an SLM when latency, cost, or privacy matter and the task is well-defined. Reach for a larger model
          when you need broad knowledge or deep reasoning.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'SLMs are typically under 10B parameters — fast, cheap, and deployable on-device.',
          'Fine-tuned SLMs can outperform larger general models on specific tasks.',
          'Trade-off: less general knowledge and weaker complex reasoning.',
          'Examples: Gemma 2, Phi-3, Llama 3.2, Mistral 7B.',
        ]}
      />
    </LessonArticle>
  )
}
