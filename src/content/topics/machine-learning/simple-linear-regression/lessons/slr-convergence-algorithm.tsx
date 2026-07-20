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

      <KeyTakeaways
        items={[
          'Gradient descent updates θ by stepping opposite the cost gradient.',
          'Learning rate α controls step size — tune by watching J over time.',
          'For SLR + MSE, gradients are means of residuals (and residual × x).',
          'Update θ₀ and θ₁ simultaneously each iteration until cost converges.',
        ]}
      />
    </LessonArticle>
  )
}
