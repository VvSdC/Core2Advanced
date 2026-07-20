import {
  Callout,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function SlrConvergenceAlgorithm() {
  return (
    <LessonArticle>
      <Definition term="Gradient Descent">
        <p>
          <strong className="text-white">Gradient descent</strong> is the convergence algorithm we
          use to minimize the cost. Repeatedly: compute how J changes with each parameter (the{' '}
          <strong className="text-white">gradient</strong>), then take a small step opposite that
          direction — downhill on the cost surface.
        </p>
      </Definition>

      <Callout variant="beginner" title="How this relates to the math lesson">
        Setting ∂J/∂θ = 0 gives the exact optimum in one shot. Gradient descent uses the{' '}
        <em>same</em> derivatives, but walks downhill iteratively — essential when a closed form is
        hard or impossible (many modern models).
      </Callout>

      <LessonSection title="The update rule">
        <p className="mt-1 font-mono text-sm text-white md:text-base">
          θⱼ := θⱼ − α · ∂J/∂θⱼ
        </p>
        <p className="mt-3 text-slate-300">
          α (alpha) is the <strong className="text-white">learning rate</strong> — step size. Too
          small → slow learning. Too large → overshoot and diverge.
        </p>
        <Flowchart
          title="One training iteration"
          chart={`flowchart TB
  A[Current θ₀, θ₁] --> B[Predict all ŷ]
  B --> C[Compute gradients ∂J/∂θ]
  C --> D["θ ← θ − α · gradient"]
  D --> E{Cost still dropping?}
  E -- Yes --> B
  E -- No --> F[Stop — converged]`}
        />
      </LessonSection>

      <LessonSection title="Gradients for simple linear regression">
        <p className="text-slate-300">
          With MSE, the derivatives simplify to averages of residuals:
        </p>
        <Example title="Partial derivatives (what code implements)">
{`# m = number of examples
# residual for example i:  (θ₀ + θ₁·x⁽ⁱ⁾ − y⁽ⁱ⁾)

∂J/∂θ₀ = (1/m) · Σ (ŷ⁽ⁱ⁾ − y⁽ⁱ⁾)
∂J/∂θ₁ = (1/m) · Σ (ŷ⁽ⁱ⁾ − y⁽ⁱ⁾) · x⁽ⁱ⁾

# Then:
θ₀ ← θ₀ − α · ∂J/∂θ₀
θ₁ ← θ₁ − α · ∂J/∂θ₁
# Update BOTH using the OLD θ values (simultaneous update).`}
        </Example>
        <Callout variant="tip" title="Simultaneous update">
          Compute both gradients with the current θ, then apply both updates. Do not update θ₀ first
          and reuse the new θ₀ when computing the θ₁ step in the same iteration.
        </Callout>
      </LessonSection>

      <LessonSection title="Learning rate & convergence">
        <ContentStep number={1} title="Watch the cost over iterations">
          <p className="text-slate-300">
            Plot J after each step. Healthy training: J falls and flattens. Flat early → maybe α too
            small or already near a minimum. Rising/oscillating → α too large.
          </p>
        </ContentStep>
        <ContentStep number={2} title="When to stop">
          <p className="text-slate-300">
            Fixed number of epochs, or stop when the cost decrease is tinier than a threshold
            (convergence).
          </p>
        </ContentStep>
        <ContentStep number={3} title="Feature scaling (preview)">
          <p className="text-slate-300">
            If x has a huge range, gradients can be awkward. Scaling features (e.g. standardization)
            often makes descent smoother — more important when you add more features later.
          </p>
        </ContentStep>
        <Flowchart
          title="Diagnosing α"
          chart={`flowchart TB
  A[Run gradient descent] --> B{Cost curve}
  B -- Steadily decreases --> C[Good α]
  B -- Barely moves --> D[Increase α a bit]
  B -- Explodes / zigzags --> E[Decrease α]`}
        />
        <Callout variant="beginner">
          Convergence means parameters settled: more steps barely change θ or J. The line has
          essentially stopped improving on the training cost.
        </Callout>
      </LessonSection>

      <LessonSection title="Batch gradient descent">
        <p className="text-slate-300">
          Using <em>all</em> m examples for each gradient step is{' '}
          <strong className="text-white">batch gradient descent</strong>. Variants (mini-batch, SGD)
          use fewer examples per step — faster on huge data, noisier path. For our 10-row demo, batch
          is perfect.
        </p>
        <Example title="Pseudocode you will code next">
{`initialize θ₀, θ₁ (often 0)
for epoch in 1 … N:
    compute ŷ for all x
    g0 = mean(ŷ − y)
    g1 = mean((ŷ − y) * x)
    θ₀ -= α * g0
    θ₁ -= α * g1
    record J
return θ₀, θ₁`}
        </Example>
      </LessonSection>

      <LessonSection title="Worked example — gradient descent then OLS">
        <p className="text-slate-300">
          Same four rows as the <strong className="text-white">Optimal Parameters (Math)</strong>{' '}
          lesson. We run batch gradient descent by hand, then solve OLS — both should land on the same
          line.
        </p>

        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">x</th>
                <th className="px-4 py-3">y</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['1', '3'],
                ['2', '5'],
                ['3', '7'],
                ['4', '10'],
              ].map(([xv, yv]) => (
                <tr key={xv} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-mono">{xv}</td>
                  <td className="px-4 py-3 font-mono text-white">{yv}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ContentStep number={1} title="Start: θ₀ = 0, θ₁ = 0, α = 0.03">
          <p className="text-slate-300">
            Untrained line predicts 0 everywhere. Compute residuals, gradients, then update once.
          </p>
          <Example
            title="Iteration 1"
            output={`ŷ = [0, 0, 0, 0]
errors (ŷ − y) = [−3, −5, −7, −10]
∂J/∂θ₀ = mean(errors) = −6.25
∂J/∂θ₁ = mean(errors · x) = −18.5

θ₀ ← 0 − 0.03·(−6.25) = 0.1875
θ₁ ← 0 − 0.03·(−18.5) = 0.555
J ≈ 12.87`}
          >
{`m = 4
# predictions at θ = (0, 0): all ŷ = 0
g0 = (-3 + -5 + -7 + -10) / 4 = -6.25
g1 = (-3·1 + -5·2 + -7·3 + -10·4) / 4 = -18.5
θ0 = 0 - 0.03 * (-6.25) = 0.1875
θ1 = 0 - 0.03 * (-18.5) = 0.555`}
          </Example>
        </ContentStep>

        <ContentStep number={2} title="Keep iterating — cost falls">
          <div className="overflow-x-auto rounded-xl border border-surface-600">
            <table className="w-full text-sm text-slate-300">
              <thead>
                <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                  <th className="px-4 py-3">Epoch</th>
                  <th className="px-4 py-3">θ₀</th>
                  <th className="px-4 py-3">θ₁</th>
                  <th className="px-4 py-3">J</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-600">
                {[
                  ['1', '0.1875', '0.555', '12.87'],
                  ['10', '0.6998', '2.0939', '0.114'],
                  ['50', '0.7020', '2.2313', '0.041'],
                  ['500', '0.5267', '2.2909', '0.038'],
                  ['2000', '0.5000', '2.3000', '0.0375'],
                ].map(([ep, t0, t1, j]) => (
                  <tr key={ep} className="hover:bg-surface-800/50">
                    <td className="px-4 py-3 font-mono">{ep}</td>
                    <td className="px-4 py-3 font-mono">{t0}</td>
                    <td className="px-4 py-3 font-mono">{t1}</td>
                    <td className="px-4 py-3 font-mono text-white">{j}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Callout variant="beginner">
            J keeps dropping and θ settles — that is convergence. Gradients shrink toward 0 as we
            approach the bottom of the bowl.
          </Callout>
        </ContentStep>

        <ContentStep number={3} title="Same answer from OLS (closed form)">
          <p className="text-slate-300">
            Instead of looping, solve the normal equations from the math lesson:
          </p>
          <Example
            title="OLS on the same four points"
            output={`x̄ = 2.5,  ȳ = 6.25
θ₁ = Σ(x−x̄)(y−ȳ) / Σ(x−x̄)² = 11.5 / 5 = 2.3
θ₀ = ȳ − θ₁·x̄ = 6.25 − 5.75 = 0.5
J = 0.0375`}
          >
{`# sums from the Optimal Parameters lesson
θ1 = 11.5 / 5 = 2.3
θ0 = 6.25 - 2.3 * 2.5 = 0.5

# line: ŷ = 0.5 + 2.3x`}
          </Example>
        </ContentStep>

        <ContentStep number={4} title="Side-by-side proof">
          <div className="overflow-x-auto rounded-xl border border-surface-600">
            <table className="w-full text-sm text-slate-300">
              <thead>
                <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                  <th className="px-4 py-3">Method</th>
                  <th className="px-4 py-3">θ₀</th>
                  <th className="px-4 py-3">θ₁</th>
                  <th className="px-4 py-3">J</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-600">
                <tr className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">Gradient descent (2000 epochs)</td>
                  <td className="px-4 py-3 font-mono">0.5</td>
                  <td className="px-4 py-3 font-mono">2.3</td>
                  <td className="px-4 py-3 font-mono">0.0375</td>
                </tr>
                <tr className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">OLS closed form</td>
                  <td className="px-4 py-3 font-mono">0.5</td>
                  <td className="px-4 py-3 font-mono">2.3</td>
                  <td className="px-4 py-3 font-mono">0.0375</td>
                </tr>
              </tbody>
            </table>
          </div>
          <Flowchart
            title="Two paths, one optimum"
            chart={`flowchart TB
  A[Same 4 training rows] --> B[Gradient descent: repeat θ ← θ − α∇J]
  A --> C[OLS: solve ∂J/∂θ = 0]
  B --> D["θ₀=0.5, θ₁=2.3, J=0.0375"]
  C --> D`}
          />
          <Callout variant="insight">
            OLS jumps straight to the answer. Gradient descent walks there step by step using the{' '}
            <em>same</em> gradients you set to zero in calculus. Both are valid; GD scales when there
            is no simple formula.
          </Callout>
        </ContentStep>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Gradient descent updates θ by stepping opposite the cost gradient.',
          'Learning rate α controls step size — tune by watching J over time.',
          'For SLR + MSE, gradients are means of residuals (and residual × x).',
          'Worked example: GD and OLS both give θ₀=0.5, θ₁=2.3 on the same four points.',
          'Update θ₀ and θ₁ simultaneously each iteration until cost converges.',
        ]}
      />
    </LessonArticle>
  )
}
