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

export function SlrDerivingPartialDerivatives() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="What we will do here">
        The next lessons use ∂J/∂θ₀ and ∂J/∂θ₁ a lot. This page shows{' '}
        <strong className="text-white">exactly how those formulas come from the cost</strong> — line
        by line. You only need two school rules: the derivative of u², and the chain rule.
      </Callout>

      <Definition term="Partial derivative of the cost">
        <p>
          <span className="font-mono text-sm text-white">∂J/∂θ₀</span> asks: “If I change only the
          intercept a tiny bit, how fast does cost change?”{' '}
          <span className="font-mono text-sm text-white">∂J/∂θ₁</span> asks the same for the slope.
          We derive both from J, not from memory.
        </p>
      </Definition>

      <LessonSection title="The only calculus rules we need">
        <ContentStep number={1} title="Power rule for a square">
          <p className="text-slate-300">
            If u is a number that depends on θ, then:
          </p>
          <p className="mt-2 font-mono text-sm text-white">d(u²) / du = 2u</p>
        </ContentStep>
        <ContentStep number={2} title="Chain rule">
          <p className="text-slate-300">
            If cost depends on u, and u depends on θ:
          </p>
          <p className="mt-2 font-mono text-sm text-white">d(cost) / dθ = (d(cost) / du) · (du / dθ)</p>
          <p className="mt-2 text-slate-300">
            In words: “how cost changes with u” times “how u changes with θ.”
          </p>
        </ContentStep>
        <Callout variant="tip" title="Why we put 1/2 in front of J">
          Cost uses (1/2) × (error)². Differentiating brings a 2 from the square, which cancels the
          1/2 — so the final slope formulas look clean (no leftover 2).
        </Callout>
      </LessonSection>

      <LessonSection title="Start from the cost">
        <p className="text-slate-300">Prediction and cost for m training rows:</p>
        <div className="mt-3 space-y-3 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-white">
          <p>ŷ⁽ⁱ⁾ = θ₀ + θ₁ · x⁽ⁱ⁾</p>
          <p>J(θ₀, θ₁) = (1 / 2m) · Σᵢ₌₁ᵐ (ŷ⁽ⁱ⁾ − y⁽ⁱ⁾)²</p>
        </div>
        <p className="mt-3 text-slate-300">
          Name the error for row i so the writing stays short:
        </p>
        <div className="mt-3 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-white">
          e⁽ⁱ⁾ = ŷ⁽ⁱ⁾ − y⁽ⁱ⁾ = θ₀ + θ₁ · x⁽ⁱ⁾ − y⁽ⁱ⁾
        </div>
        <p className="mt-3 text-slate-300">Then:</p>
        <div className="mt-3 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-white">
          J = (1 / 2m) · Σᵢ (e⁽ⁱ⁾)²
        </div>
        <Flowchart
          title="Derivation map"
          chart={`flowchart TB
  A[Write J with errors e] --> B[Differentiate one squared error]
  B --> C[Apply chain rule for θ₀ and θ₁]
  C --> D[Sum over all m rows]
  D --> E[Final ∂J/∂θ₀ and ∂J/∂θ₁]`}
        />
      </LessonSection>

      <LessonSection title="Warm-up — one row only">
        <p className="text-slate-300">
          Ignore the sum for a moment. Look at one term: (1/2) e², where e = θ₀ + θ₁x − y.
        </p>

        <ContentStep number={1} title="How e depends on θ₀">
          <p className="text-slate-300">
            If θ₀ increases by 1, e increases by 1 (x and y stay fixed). So:
          </p>
          <p className="mt-2 font-mono text-sm text-white">∂e / ∂θ₀ = 1</p>
        </ContentStep>

        <ContentStep number={2} title="How e depends on θ₁">
          <p className="text-slate-300">
            If θ₁ increases by 1, e increases by x (because e contains θ₁ · x). So:
          </p>
          <p className="mt-2 font-mono text-sm text-white">∂e / ∂θ₁ = x</p>
        </ContentStep>

        <ContentStep number={3} title="Differentiate (1/2)e² w.r.t. θ₀">
          <Example title="Chain rule for θ₀">
{`d/dθ₀ [ (1/2) e² ]
  = (1/2) · 2e · (∂e/∂θ₀)     # power rule + chain rule
  = e · 1
  = e
  = (θ₀ + θ₁x − y)`}
          </Example>
        </ContentStep>

        <ContentStep number={4} title="Differentiate (1/2)e² w.r.t. θ₁">
          <Example title="Chain rule for θ₁">
{`d/dθ₁ [ (1/2) e² ]
  = (1/2) · 2e · (∂e/∂θ₁)
  = e · x
  = (θ₀ + θ₁x − y) · x`}
          </Example>
        </ContentStep>
        <Callout variant="beginner">
          That is the whole trick. Squared error → bring down the error → multiply by how the error
          depends on the parameter.
        </Callout>
      </LessonSection>

      <LessonSection title="Now include all m rows">
        <p className="text-slate-300">
          Real cost averages over every training example. Differentiating a sum is the sum of
          derivatives, and the constant 1/m stays outside:
        </p>

        <ContentStep number={1} title="Partial with respect to θ₀">
          <div className="mt-2 space-y-3 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-xs leading-relaxed text-slate-200 sm:text-sm">
            <p className="text-white">J = (1 / 2m) · Σᵢ (e⁽ⁱ⁾)²</p>
            <p>∂J/∂θ₀ = (1 / 2m) · Σᵢ · 2 · e⁽ⁱ⁾ · (∂e⁽ⁱ⁾/∂θ₀)</p>
            <p>        = (1 / m) · Σᵢ · e⁽ⁱ⁾ · 1</p>
            <p className="text-machine-learning-400">
              ∂J/∂θ₀ = (1 / m) · Σᵢ (θ₀ + θ₁ · x⁽ⁱ⁾ − y⁽ⁱ⁾)
            </p>
          </div>
          <p className="mt-3 text-slate-300">
            In English: <strong className="text-white">average prediction error</strong> across all
            rows.
          </p>
        </ContentStep>

        <ContentStep number={2} title="Partial with respect to θ₁">
          <div className="mt-2 space-y-3 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-xs leading-relaxed text-slate-200 sm:text-sm">
            <p>∂J/∂θ₁ = (1 / 2m) · Σᵢ · 2 · e⁽ⁱ⁾ · (∂e⁽ⁱ⁾/∂θ₁)</p>
            <p>        = (1 / m) · Σᵢ · e⁽ⁱ⁾ · x⁽ⁱ⁾</p>
            <p className="text-machine-learning-400">
              ∂J/∂θ₁ = (1 / m) · Σᵢ (θ₀ + θ₁ · x⁽ⁱ⁾ − y⁽ⁱ⁾) · x⁽ⁱ⁾
            </p>
          </div>
          <p className="mt-3 text-slate-300">
            In English: <strong className="text-white">average of (error × x)</strong> — errors on
            large x get more weight when adjusting the slope.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Tiny numeric check (so it feels real)">
        <p className="text-slate-300">
          Two points, and a trial line θ₀ = 0, θ₁ = 0 (always predicts 0):
        </p>
        <Example title="Data">
{`x: 1, 2
y: 3, 5
m = 2
θ₀ = 0, θ₁ = 0
→ ŷ = 0, 0
→ errors e = 0−3, 0−5 = −3, −5`}
        </Example>
        <Example
          title="Plug into the derived formulas"
          output={`∂J/∂θ₀ = (−3 + −5) / 2 = −4
∂J/∂θ₁ = (−3·1 + −5·2) / 2 = −6.5`}
        >
{`∂J/∂θ₀ = mean(e)     = (-3 + -5) / 2 = -4
∂J/∂θ₁ = mean(e * x) = (-3*1 + -5*2) / 2 = -6.5`}
        </Example>
        <Callout variant="insight" title="What the signs tell you">
          Both derivatives are negative. Cost falls if we <em>increase</em> θ₀ and θ₁ (because the
          update is θ ← θ − α · derivative: minus a negative = plus). That matches intuition: our
          all-zero line under-predicts badly, so we should raise the line.
        </Callout>
      </LessonSection>

      <LessonSection title="How this connects to what comes next">
        <Flowchart
          title="Same derivatives, two uses"
          chart={`flowchart TB
  A["∂J/∂θ₀ and ∂J/∂θ₁"] --> B[Set both to 0]
  A --> C[Or step: θ ← θ − α · ∂J/∂θ]
  B --> D[OLS exact solution]
  C --> E[Gradient descent]`}
        />
        <ContentStep number={1} title="Optimal Parameters lesson">
          <p className="text-slate-300">
            Set these derivatives to zero and solve — that is the exact best line (OLS).
          </p>
        </ContentStep>
        <ContentStep number={2} title="Convergence lesson">
          <p className="text-slate-300">
            Keep the derivatives as “which way is downhill?” and walk step by step.
          </p>
        </ContentStep>
        <Callout variant="beginner">
          You do not need to re-derive this every time. Once you have seen the chain-rule story, the
          final two formulas are enough to use confidently.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'J = (1/2m) Σ e² with e = θ₀ + θ₁x − y.',
          'Chain rule: d(½e²)/dθ = e · (∂e/∂θ).',
          '∂e/∂θ₀ = 1 and ∂e/∂θ₁ = x, so ∂J/∂θ₀ = mean(e) and ∂J/∂θ₁ = mean(e·x).',
          'The 1/2 in J cancels the 2 from differentiating e² — that is why the formulas look clean.',
        ]}
      />
    </LessonArticle>
  )
}
