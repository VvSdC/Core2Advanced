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

export function SlrEquations() {
  return (
    <LessonArticle>
      <Definition term="Hypothesis / Model Equation">
        <p>
          The <strong className="text-white">hypothesis</strong> (prediction function) for simple
          linear regression is:
        </p>
        <p className="mt-3 font-mono text-base text-white">hθ(x) = θ₀ + θ₁ · x</p>
        <p className="mt-2 text-slate-300">
          Same as ŷ = θ₀ + θ₁x. Given x and the current parameters, this is the model&apos;s guess.
        </p>
      </Definition>

      <LessonSection title="Parameters you learn">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Symbol</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Meaning</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['θ₀ (theta-0)', 'Intercept / bias', 'Predicted y when x = 0'],
                ['θ₁ (theta-1)', 'Slope / weight', 'Change in ŷ when x increases by 1'],
                ['x', 'Feature / input', 'The single predictor variable'],
                ['y', 'Label / target', 'True numeric value'],
                ['ŷ or hθ(x)', 'Prediction', 'Model output for that x'],
              ].map(([sym, name, meaning]) => (
                <tr key={sym} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-mono text-machine-learning-400">{sym}</td>
                  <td className="px-4 py-3 font-medium text-white">{name}</td>
                  <td className="px-4 py-3">{meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="beginner">
          Training = finding good values for θ₀ and θ₁. After that, prediction is just plug in x.
        </Callout>
      </LessonSection>

      <LessonSection title="Worked numbers">
        <p className="text-slate-300">
          Suppose after training we have θ₀ = 40 and θ₁ = 7. For a student who studied 3 hours:
        </p>
        <Example title="One forward prediction" output={`ŷ = 40 + 7 × 3 = 61`}>
{`theta0 = 40
theta1 = 7
x = 3
y_hat = theta0 + theta1 * x
print(y_hat)`}
        </Example>
        <ContentStep number={1} title="Positive slope">
          <p className="text-slate-300">
            θ₁ &gt; 0 → as x grows, ŷ grows (more study → higher predicted score).
          </p>
        </ContentStep>
        <ContentStep number={2} title="Negative slope">
          <p className="text-slate-300">
            θ₁ &lt; 0 → as x grows, ŷ falls (e.g. predict fuel left from distance driven).
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Vector / matrix view (optional peek)">
        <p className="text-slate-300">
          Engineers often write x₀ = 1 for every example so both parameters sit in one vector:
        </p>
        <p className="mt-2 font-mono text-sm text-white">
          hθ(x) = θᵀ · x = θ₀·1 + θ₁·x₁
        </p>
        <Flowchart
          title="Same math, compact notation"
          chart={`flowchart TB
  A["x = [1, hours]"] --> C["θ · x"]
  B["θ = [θ₀, θ₁]"] --> C
  C --> D[Prediction ŷ]`}
        />
        <Callout variant="info" title="You do not need linear algebra yet">
          Keep using ŷ = θ₀ + θ₁x. The vector form just scales nicely when you add more features later.
        </Callout>
      </LessonSection>

      <LessonSection title="Closed-form vs iterative learning">
        <p className="text-slate-300">
          For simple linear regression you can sometimes solve θ₀, θ₁ with a formula (normal
          equation). In practice — and for learning ML — we often use{' '}
          <strong className="text-white">gradient descent</strong>, which also works for huge models
          where no closed form exists.
        </p>
        <Example title="Closed-form slope (intuition only)">
{`θ₁ ≈ Cov(x, y) / Var(x)
θ₀ ≈ mean(y) − θ₁ · mean(x)

# Nice for one feature — gradient descent generalizes better.`}
        </Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'The model equation is ŷ = θ₀ + θ₁x (also written hθ(x)).',
          'θ₀ shifts the line up/down; θ₁ controls the tilt.',
          'Prediction after training is a single multiply-and-add.',
          'We can solve analytically or learn parameters iteratively with gradient descent.',
        ]}
      />
    </LessonArticle>
  )
}
