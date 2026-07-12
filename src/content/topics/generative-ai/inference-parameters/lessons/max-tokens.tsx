import {
  Callout,
  ContentStep,
  Definition,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function MaxTokens() {
  return (
    <LessonArticle>
      <Definition term="max_tokens">
        <p>
          <strong className="text-white">max_tokens</strong> sets the maximum number of tokens the model is
          allowed to <em>generate</em> in one response. It is a hard ceiling — generation stops the moment this
          count is reached, even mid-sentence.
        </p>
      </Definition>

      <LessonSection title="How the model behaves">
        <ContentStep number={1} title="Generation stops abruptly">
          <p>
            If <code className="font-mono text-sm">max_tokens=50</code> and the model is mid-explanation, it
            cuts off without warning. The output may end with an incomplete sentence or unclosed JSON bracket.
          </p>
          <Callout variant="beginner">
            max_tokens limits <em>output</em> only — not your input/prompt. Input tokens and output tokens are
            billed and counted separately. Together they must fit within the model's context window.
          </Callout>
        </ContentStep>

        <ContentStep number={2} title="Interaction with context window">
          <p>
            If a model has a 128k context window and your prompt uses 120k tokens, setting{' '}
            <code className="font-mono text-sm">max_tokens=4096</code> may fail — only 8k tokens remain. The
            API caps max_tokens at <em>context_window − prompt_tokens</em>.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Choosing a value">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Task</th>
                <th className="px-4 py-3">Suggested max_tokens</th>
                <th className="px-4 py-3">Why</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Yes/no classification', '1 – 10', 'Answer is one word or label'],
                ['Short Q&A', '100 – 300', 'A paragraph at most'],
                ['Code generation', '500 – 2000', 'Depends on function length'],
                ['Long essay / report', '2000 – 4096', 'Full document sections'],
                ['Chain-of-thought math', '500 – 1000', 'Room for reasoning steps'],
              ].map(([task, tokens, why]) => (
                <tr key={task} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{task}</td>
                  <td className="px-4 py-3 font-mono text-genai-400">{tokens}</td>
                  <td className="px-4 py-3 text-slate-400">{why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <Callout variant="tip">
        Set max_tokens slightly higher than you expect to need. Combine with <code className="font-mono text-sm">stop</code>{' '}
        sequences (next lesson) to end cleanly rather than truncating mid-thought.
      </Callout>

      <KeyTakeaways
        items={[
          'max_tokens is a hard ceiling on generated output tokens.',
          'Generation stops abruptly when reached — may cut off mid-sentence.',
          'Must leave room within the context window after your prompt tokens.',
          'Match to task: 10 for labels, 300 for Q&A, 2000+ for long content.',
        ]}
      />
    </LessonArticle>
  )
}
