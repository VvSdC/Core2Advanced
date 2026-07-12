import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function WhatAreModelParameters() {
  return (
    <LessonArticle>
      <Definition term="Model Parameters">
        <p>
          When someone says a model has <strong className="text-white">7 billion parameters</strong> or{' '}
          <strong className="text-white">1 trillion parameters</strong>, they mean the model contains that many
          learnable numbers — mostly <strong className="text-white">weights</strong> and a smaller number of{' '}
          <strong className="text-white">biases</strong> — that were tuned during training.
        </p>
        <p>
          Each parameter is a single floating-point number (e.g. <code className="font-mono text-sm">0.0342</code> or{' '}
          <code className="font-mono text-sm">−1.87</code>). Together they encode everything the model "knows" about
          language patterns.
        </p>
      </Definition>

      <LessonSection title="What is a parameter, physically?">
        <ContentStep number={1} title="Weights and biases in a tiny network">
          <p>
            Even a minimal neural network has parameters. Consider one neuron computing{' '}
            <code className="font-mono text-sm">output = w₁×x₁ + w₂×x₂ + b</code>:
          </p>
          <Example
            title="Counting parameters in one neuron"
            output={`Weights: w1=0.5, w2=-0.3
Bias: b=0.1
Total parameters in this neuron: 3`}
          >{`# One neuron: 2 inputs → 1 output
w1, w2 = 0.5, -0.3   # 2 weights
b = 0.1              # 1 bias
# Total: 3 parameters

print(f"Weights: w1={w1}, w2={w2}")
print(f"Bias: b={b}")
print(f"Total parameters in this neuron: 3")`}</Example>
          <p className="mt-3">
            Real language models stack millions of these operations in layers. A transformer layer with a{' '}
            <code className="font-mono text-sm">4096 × 4096</code> weight matrix alone has{' '}
            <strong className="text-white">16.7 million parameters</strong> in that single matrix.
          </p>
        </ContentStep>

        <ContentStep number={2} title="Scaling up — from millions to trillions">
          <div className="mt-2 overflow-x-auto rounded-xl border border-surface-600">
            <table className="w-full text-sm text-slate-300">
              <thead>
                <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                  <th className="px-4 py-3">Label</th>
                  <th className="px-4 py-3">Count</th>
                  <th className="px-4 py-3">Written as</th>
                  <th className="px-4 py-3">Rough memory (FP16)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-600">
                {[
                  ['Small', '1 billion', '1B', '~2 GB'],
                  ['Medium', '7 billion', '7B', '~14 GB'],
                  ['Large', '70 billion', '70B', '~140 GB'],
                  ['Very large', '405 billion', '405B', '~810 GB'],
                  ['Frontier', '1 trillion', '1T', '~2 TB'],
                ].map(([label, count, written, memory]) => (
                  <tr key={label} className="hover:bg-surface-800/50">
                    <td className="px-4 py-3 font-semibold text-white">{label}</td>
                    <td className="px-4 py-3">{count}</td>
                    <td className="px-4 py-3 font-mono">{written}</td>
                    <td className="px-4 py-3 text-slate-400">{memory}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Callout variant="insight">
            Memory estimate: each parameter stored as a 16-bit float (2 bytes). A 7B model needs ~14 GB just to hold
            the weights — before activations, optimiser state, or KV cache during inference.
          </Callout>
        </ContentStep>
      </LessonSection>

      <LessonSection title="What do more parameters enable?">
        <ContentStep number={1} title="Capacity — more knobs, richer patterns">
          <p>
            More parameters give the model more <strong className="text-white">capacity</strong> to store patterns:
            grammar in many languages, coding syntax, factual associations, reasoning shortcuts, and style.
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-300">
            <li>A <strong className="text-white">1B</strong> model can handle basic text completion and simple Q&A.</li>
            <li>A <strong className="text-white">7B</strong> model can follow instructions, write code, and reason over short contexts.</li>
            <li>A <strong className="text-white">70B+</strong> model shows stronger reasoning, nuance, and multi-step problem solving.</li>
          </ul>
        </ContentStep>

        <ContentStep number={2} title="More parameters ≠ automatically better">
          <p>
            Parameter count is only one factor. Training data quality, architecture, fine-tuning, and inference
            techniques matter enormously. A well-trained 8B model can outperform a poorly trained 70B model on
            specific tasks.
          </p>
          <Callout variant="tip">
            Think of parameters as <em>potential</em> — training data and compute determine how much of that potential
            is actually realised.
          </Callout>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Parameters vs other numbers people mention">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Term</th>
                <th className="px-4 py-3">What it means</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Parameters (7B)', '7 billion learned weights + biases stored in the model'],
                ['Tokens trained on', 'How many word-chunks the model read during training (e.g. 15T tokens)'],
                ['Context window', 'How many tokens the model can see at once during inference (e.g. 128k)'],
                ['FLOPs', 'Floating-point operations — measures compute used in training or inference'],
              ].map(([term, meaning]) => (
                <tr key={term} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-mono text-white">{term}</td>
                  <td className="px-4 py-3 text-slate-400">{meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <KeyTakeaways
        items={[
          'A parameter is a single learned number (weight or bias) tuned during training.',
          '7B = 7 billion parameters ≈ 14 GB of weight memory in FP16.',
          'More parameters = more capacity, but data quality and training matter just as much.',
          'Parameters ≠ tokens trained on ≠ context window — each measures something different.',
        ]}
      />
    </LessonArticle>
  )
}
