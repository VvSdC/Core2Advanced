import {
  Callout,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function IntroductionToInferenceParameters() {
  return (
    <LessonArticle>
      <Definition term="Inference Parameters">
        <p>
          After training, a language model outputs a <strong className="text-white">probability distribution</strong>{' '}
          over every possible next token. <strong className="text-white">Inference parameters</strong> (also called
          generation or sampling settings) control <em>how</em> one token is picked from that distribution — at
          every single step of generation.
        </p>
        <p>
          These are <em>not</em> the billions of learned weights from <em>What Are Model Parameters?</em> in
          Fundamentals. They are knobs you turn at runtime through an API or library.
        </p>
      </Definition>

      <Callout variant="beginner" title="Read this after">
        Complete <em>Fundamentals → How Language Models Work</em> first. You need to understand next-token
        probabilities before these settings make sense.
      </Callout>

      <LessonSection title="The generation pipeline">
        <Flowchart
          title="From model output to chosen token"
          chart={`flowchart TB
  A[Model outputs logits for every token] --> B[Softmax → probabilities summing to 1.0]
  B --> C{Inference parameters}
  C --> D[Temperature scales the distribution]
  D --> E[Top-k / top-p filter unlikely tokens]
  E --> F[Sample or pick one token]
  F --> G[Append token to output]
  G --> H{Stop or max_tokens reached?}
  H -- no --> A
  H -- yes --> I([Return complete text])`}
        />
        <p className="mt-4">
          This loop runs once per generated token. Changing temperature affects token 1, token 2, and every
          token after — which is why a small setting change can completely alter the output.
        </p>
      </LessonSection>

      <LessonSection title="Parameters covered in this sub-topic">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Parameter</th>
                <th className="px-4 py-3">What it controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['temperature', 'How peaked or flat the probability distribution is'],
                ['top_k', 'Keep only the K most likely tokens'],
                ['top_p', 'Keep the smallest set whose cumulative probability ≥ p'],
                ['max_tokens', 'Maximum number of tokens to generate'],
                ['stop', 'Strings that halt generation immediately'],
                ['frequency_penalty', 'Discourage tokens that already appeared often'],
                ['presence_penalty', 'Discourage any token that already appeared'],
                ['seed', 'Fix randomness for reproducible outputs'],
              ].map(([param, controls]) => (
                <tr key={param} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-mono text-genai-400">{param}</td>
                  <td className="px-4 py-3 text-slate-400">{controls}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Inference parameters control how a token is chosen from the probability distribution.',
          'They are runtime knobs — separate from the model\'s learned weight parameters.',
          'Every generated token goes through the same sampling pipeline.',
          'These settings are essential before moving on to Prompt Engineering.',
        ]}
      />
    </LessonArticle>
  )
}
