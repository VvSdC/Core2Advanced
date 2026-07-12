import {
  Callout,
  ContentStep,
  Definition,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function OtherInferenceParameters() {
  return (
    <LessonArticle>
      <Definition term="Additional Parameters">
        <p>
          Beyond temperature, top-k, top-p, max_tokens, and stop sequences, APIs expose several more knobs that
          shape repetition, reproducibility, and token bias.
        </p>
      </Definition>

      <LessonSection title="frequency_penalty">
        <ContentStep number={1} title="What it does">
          <p>
            Reduces the probability of tokens proportional to how many times they have{' '}
            <strong className="text-white">already appeared</strong> in the generated output. A token used 5
            times is penalised more than one used once.
          </p>
          <p className="mt-2 font-mono text-sm text-slate-400">
            adjusted_logit(token) = logit(token) − frequency_penalty × count(token)
          </p>
          <Callout variant="beginner">
            Plain English: every time a token already appeared in the output, subtract a little more from its
            score. Used 5 times? Penalised 5× as much as a token used once.
          </Callout>
        </ContentStep>
        <ContentStep number={2} title="How the model behaves">
          <ul className="list-disc space-y-1 pl-5 text-slate-300">
            <li><strong className="text-white">0.0</strong> — no effect (default).</li>
            <li><strong className="text-white">0.5 – 1.0</strong> — reduces word repetition in long outputs.</li>
            <li><strong className="text-white">Too high</strong> — model avoids common words entirely; output sounds unnatural.</li>
          </ul>
        </ContentStep>
      </LessonSection>

      <LessonSection title="presence_penalty">
        <ContentStep number={1} title="What it does">
          <p>
            Penalises any token that has appeared <em>at least once</em>, regardless of how many times — a flat
            penalty per unique repeated token.
          </p>
          <p className="mt-2 font-mono text-sm text-slate-400">
            adjusted_logit(token) = logit(token) − presence_penalty × (1 if token seen else 0)
          </p>
          <Callout variant="beginner">
            Plain English: if a token appeared even once, subtract a fixed penalty — does not matter if it
            appeared 1 time or 10 times.
          </Callout>
        </ContentStep>
        <ContentStep number={2} title="How the model behaves">
          <ul className="list-disc space-y-1 pl-5 text-slate-300">
            <li>Encourages the model to <strong className="text-white">introduce new topics and vocabulary</strong>.</li>
            <li>Useful for brainstorming and creative writing.</li>
            <li>Can cause the model to drift off-topic if set too high.</li>
          </ul>
        </ContentStep>
        <Callout variant="beginner">
          <strong className="text-white">frequency_penalty</strong> fights "the the the" loops.{' '}
          <strong className="text-white">presence_penalty</strong> fights rehashing the same idea in different words.
        </Callout>
      </LessonSection>

      <LessonSection title="seed">
        <p>
          A fixed <strong className="text-white">seed</strong> makes random sampling reproducible — the same
          prompt with the same seed and parameters produces the same output. Without a seed, outputs differ on
          every run (when temperature &gt; 0).
        </p>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-slate-300">
          <li>Use for: testing, debugging prompts, demos.</li>
          <li>Not a guarantee across API versions or model updates.</li>
        </ul>
      </LessonSection>

      <LessonSection title="logit_bias">
        <p>
          <strong className="text-white">logit_bias</strong> lets you add a fixed value to specific token logits
          before sampling. Positive bias makes a token more likely; negative bias suppresses it.
        </p>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-slate-300">
          <li>Force JSON output by biasing toward <code className="font-mono text-sm">{'{'}</code> at the start.</li>
          <li>Suppress unwanted tokens (e.g. profanity token IDs).</li>
          <li>Requires knowing token IDs — rarely used directly in application code.</li>
        </ul>
      </LessonSection>

      <LessonSection title="n (number of completions)">
        <p>
          <code className="font-mono text-sm">n</code> requests multiple independent completions in one API call.
          Each uses the same prompt but samples differently. Used for self-consistency (generate N answers, majority
          vote) — see the Self-Consistency paper in Prompt Engineering.
        </p>
      </LessonSection>

      <LessonSection title="See it in action — beginner walkthrough">
        <p>
          The model has generated: <code className="font-mono text-sm">"The cat sat on the"</code> and is picking
          the next token. Two candidates remain with similar scores:
        </p>
        <div className="mt-3 overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Token</th>
                <th className="px-4 py-3">Already used?</th>
                <th className="px-4 py-3">Count in output</th>
                <th className="px-4 py-3">Effect of penalty = 0.5</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                [' the', 'yes', '2 times', 'frequency: −1.0, presence: −0.5'],
                [' mat', 'no', '0 times', 'no penalty applied'],
              ].map(([token, used, count, effect]) => (
                <tr key={token} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-mono">{token}</td>
                  <td className="px-4 py-3">{used}</td>
                  <td className="px-4 py-3">{count}</td>
                  <td className="px-4 py-3 text-slate-400">{effect}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3">
          Without penalties, the model might output <code className="font-mono text-sm">"The cat sat on the the"</code>.
          With <code className="font-mono text-sm">frequency_penalty=0.5</code>, " the" loses 1.0 from its score
          (0.5 × 2 uses) and " mat" wins instead. That is the entire mechanism — no harder than that.
        </p>
      </LessonSection>

      <KeyTakeaways
        items={[
          'frequency_penalty reduces tokens proportional to repeat count — fights loops.',
          'presence_penalty flatly discourages any token already used — encourages variety.',
          'seed fixes randomness for reproducible outputs during testing.',
          'logit_bias and n are advanced — used for token forcing and self-consistency.',
        ]}
      />
    </LessonArticle>
  )
}
