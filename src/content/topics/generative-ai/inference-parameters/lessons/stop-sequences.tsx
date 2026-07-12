import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function StopSequences() {
  return (
    <LessonArticle>
      <Definition term="Stop Sequences">
        <p>
          <strong className="text-white">Stop sequences</strong> (also called <code className="font-mono text-sm">stop</code>{' '}
          or <code className="font-mono text-sm">stop_strings</code>) are strings that immediately halt generation
          when the model produces them. The stop string itself is usually not included in the final output.
        </p>
      </Definition>

      <LessonSection title="How the model behaves">
        <p>
          At each step the model generates the next token. After appending it, the API checks whether the output
          <em> ends with</em> any stop sequence. If yes, generation stops — even if max_tokens has not been reached.
        </p>
        <ContentStep number={1} title="Common use cases">
          <ul className="list-disc space-y-2 pl-5 text-slate-300">
            <li><strong className="text-white">End of answer marker</strong> — stop at <code className="font-mono text-sm">\n\n</code> to prevent the model from continuing into a new question.</li>
            <li><strong className="text-white">Structured output</strong> — stop at <code className="font-mono text-sm">```</code> after a code block closes.</li>
            <li><strong className="text-white">Multi-turn simulation</strong> — stop at <code className="font-mono text-sm">Human:</code> so the model does not impersonate the user.</li>
            <li><strong className="text-white">List boundaries</strong> — stop at a delimiter to get exactly N items.</li>
          </ul>
        </ContentStep>

        <Example
          title="Few-shot with stop sequence"
          output={`Paris`}
        >{`prompt = """Translate English to French.
English: hello → French: bonjour
English: thank you → French: merci
English: good morning → French:"""

# API call (conceptual):
# completion(prompt, stop=["\\n", "English:"])
# Model generates " bonjour" then hits stop at newline → returns "bonjour"
# Without stop, model might continue: "bonjour\\nEnglish: goodbye → French: ..." `}</Example>
      </LessonSection>

      <LessonSection title="Stop tokens vs stop strings">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Example</th>
                <th className="px-4 py-3">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['stop string', '"\\n\\n"', 'Halt when output ends with two newlines'],
                ['stop string', '"Human:"', 'Prevent role-play bleed in chat prompts'],
                ['special token', '<|endoftext|>', 'Model-specific end-of-sequence token (GPT)'],
                ['special token', '</s>', 'Llama family end-of-turn token'],
              ].map(([type, example, notes]) => (
                <tr key={example} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{type}</td>
                  <td className="px-4 py-3 font-mono">{example}</td>
                  <td className="px-4 py-3 text-slate-400">{notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <Callout variant="insight">
        Stop sequences give you <strong className="text-white">clean endings</strong> without guessing max_tokens.
        Use them together: set max_tokens as a safety ceiling and stop sequences for natural termination.
      </Callout>

      <KeyTakeaways
        items={[
          'Stop sequences halt generation the moment the output ends with a given string.',
          'The stop string is typically excluded from the returned text.',
          'Use to prevent run-on answers, role bleed, or to bound structured output.',
          'Combine with max_tokens: stop for clean endings, max_tokens as a safety net.',
        ]}
      />
    </LessonArticle>
  )
}
