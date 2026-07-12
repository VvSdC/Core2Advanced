import {
  Callout,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function ChoosingInferenceSettings() {
  return (
    <LessonArticle>
      <LessonSection title="How parameters interact">
        <p>
          Parameters are applied in a fixed order at each token step. Changing one affects how the others
          behave:
        </p>
        <Flowchart
          title="Processing order per token"
          chart={`flowchart LR
  A[Raw logits] --> B[Temperature]
  B --> C[logit_bias]
  C --> D[frequency / presence penalty]
  D --> E[Top-k filter]
  E --> F[Top-p filter]
  F --> G[Sample token]
  G --> H{Stop or max_tokens?}`}
        />
        <Callout variant="insight">
          Temperature flattens or sharpens first; top-k/top-p then cut the tail. Penalties act on tokens already
          generated. This is why high temperature + high top_p together can produce chaotic output.
        </Callout>
      </LessonSection>

      <LessonSection title="Recommended presets">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Task</th>
                <th className="px-4 py-3">temp</th>
                <th className="px-4 py-3">top_p</th>
                <th className="px-4 py-3">top_k</th>
                <th className="px-4 py-3">max_tokens</th>
                <th className="px-4 py-3">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Code generation', '0.0 – 0.2', '0.1 – 0.5', '—', '500 – 2000', 'Greedy or near-greedy'],
                ['JSON / extraction', '0.0 – 0.2', '0.1', '—', '100 – 500', 'Add stop at end brace'],
                ['Factual Q&A', '0.1 – 0.3', '0.5 – 0.8', '—', '100 – 300', 'Low creativity'],
                ['General chat', '0.7', '0.9', '—', '1000', 'Balanced default'],
                ['Creative writing', '0.9 – 1.2', '0.95', '—', '2000+', 'presence_penalty 0.3'],
                ['Brainstorming', '1.0 – 1.5', '0.95', '—', '500', 'High variety'],
                ['CoT reasoning', '0.2 – 0.5', '0.9', '—', '500 – 1000', 'Room for steps'],
              ].map(([task, temp, topP, topK, maxTok, notes]) => (
                <tr key={task} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{task}</td>
                  <td className="px-4 py-3 font-mono">{temp}</td>
                  <td className="px-4 py-3 font-mono">{topP}</td>
                  <td className="px-4 py-3 font-mono">{topK}</td>
                  <td className="px-4 py-3 font-mono">{maxTok}</td>
                  <td className="px-4 py-3 text-slate-400">{notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Common mistakes">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li><strong className="text-white">High temperature + high top_p together</strong> — double randomness; pick one to tune.</li>
          <li><strong className="text-white">max_tokens too low for CoT</strong> — reasoning gets cut off before the answer.</li>
          <li><strong className="text-white">temperature=0 for creative tasks</strong> — output is identical every run and often bland.</li>
          <li><strong className="text-white">Ignoring stop sequences</strong> — model runs past the answer into made-up follow-up questions.</li>
        </ul>
      </LessonSection>

      <Callout variant="tip">
        Start with a preset, generate 5 outputs, inspect failures, then adjust <em>one parameter at a time</em>.
        This carries directly into <em>Prompt Engineering → Getting the Best Results</em>.
      </Callout>

      <KeyTakeaways
        items={[
          'Parameters are applied in order: temperature → penalties → top-k → top-p → sample.',
          'Use presets as starting points; tune one parameter at a time.',
          'Factual/code: low temp + low top_p. Creative: higher temp + presence_penalty.',
          'Always set max_tokens with headroom and stop sequences for clean endings.',
        ]}
      />
    </LessonArticle>
  )
}
