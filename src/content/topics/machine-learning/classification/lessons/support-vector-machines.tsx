import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function SupportVectorMachines() {
  return (
    <LessonArticle>
      <Definition term="Support vector machine">
        <p>
          A classifier that finds the <strong className="text-white">maximum-margin</strong>{' '}
          hyperplane between two classes. Only the points closest to the boundary — the{' '}
          <strong className="text-white">support vectors</strong> — define the plane. Everyone
          else can move a little and the solution does not change.
        </p>
        <div className="mt-3 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>Predict:  ŷ = sign(wᵀx + b)</div>
          <div>Hard-margin:  minimise ½‖w‖²   s.t.   yᵢ (wᵀxᵢ + b) ≥ 1</div>
        </div>
        <p className="mt-3 text-slate-300">
          Larger margin (smaller ‖w‖) is the inductive bias: the widest empty strip between
          classes tends to generalise. Soft-margin SVMs allow a few violations when the data is
          not perfectly separable.
        </p>
      </Definition>

      <LessonSection title="Intuition — the widest street">
        <p className="text-slate-300">
          Many lines separate two blobs. SVM picks the one whose nearest points are as far away
          as possible — a street with the points as kerbs. Those kerb points are the support
          vectors.
        </p>
        <Callout variant="insight" title="Hinge loss is the unconstrained twin">
          Soft-margin SVM minimises ½‖w‖² + C Σ max(0, 1 − yᵢ (wᵀxᵢ + b)). The hinge is zero
          once a point is on the correct side of the margin. C is “how angry we are at
          violations” — the inverse of a regularisation λ.
        </Callout>
      </LessonSection>

      <LessonSection title="Kernels — linear in a richer space">
        <p className="text-slate-300">
          If the classes are not linearly separable, map x → φ(x) and run the same max-margin
          problem. The kernel trick computes K(x, z) = φ(x)ᵀφ(z) without building φ:
        </p>
        <div className="mt-3 overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Kernel</th>
                <th className="px-4 py-3">K(x, z)</th>
                <th className="px-4 py-3">Use</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Linear', 'xᵀz', 'Already separable, or huge sparse text'],
                ['Polynomial', '(γ xᵀz + r)ᵈ', 'Low-degree interactions'],
                ['RBF / Gaussian', 'exp(−γ ‖x − z‖²)', 'Default non-linear — local blobs'],
                ['Sigmoid', 'tanh(γ xᵀz + r)', 'Rare; neural-net-ish'],
              ].map(([k, f, u]) => (
                <tr key={k}>
                  <td className="px-4 py-3 font-semibold text-white">{k}</td>
                  <td className="px-4 py-3 font-mono text-slate-400">{f}</td>
                  <td className="px-4 py-3 text-slate-400">{u}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-slate-300">
          Dual form: w = Σᵢ αᵢ yᵢ φ(xᵢ), only αᵢ &gt; 0 (the support vectors) survive. Prediction
          is Σ αᵢ yᵢ K(xᵢ, x) + b.
        </p>
      </LessonSection>

      <LessonSection title="When to use it">
        <ul className="list-disc space-y-1 pl-5 text-slate-300">
          <li>Medium m, high n (text, genomics) — linear SVM is a classic winner.</li>
          <li>Clear margin between classes, or a kernel that matches the geometry.</li>
          <li>You want a strong linear / kernel baseline with C and γ to tune.</li>
        </ul>
        <p className="mt-3 text-slate-300">
          Kernel SVM scales poorly (roughly O(m²)–O(m³)). For large tabular data, forests and
          boosting usually win. SVM probabilities need extra calibration (Platt scaling); do not
          treat the raw score as P(y = 1).
        </p>
      </LessonSection>

      <LessonSection title="Worked problems">
        <ContentStep number={1} title="Problem 1 — Which points are support vectors?">
          <p>Class +1 at x = 2 and 8; class −1 at x = −1 and 0. 1-D, hard margin. Who supports?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Closest opposite pair: 0 (−1) and 2 (+1). Margin midpoint = 1.</div>
            <div>Support vectors: 0 and 2. The far points −1 and 8 do not affect w, b.</div>
          </div>
        </ContentStep>
        <ContentStep number={2} title="Problem 2 — Soft vs hard">
          <p>One +1 point sits inside the −1 blob. Hard-margin SVM?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Infeasible — no hyperplane satisfies every yᵢ (wᵀxᵢ + b) ≥ 1.</div>
            <div>Soft margin (finite C) lets that point violate and keeps a useful street for the rest.</div>
          </div>
        </ContentStep>
        <ContentStep number={3} title="Problem 3 — C as a knob">
          <p>C → ∞ vs C → 0. What happens?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>C → ∞: almost hard margin, sensitive to outliers.</div>
            <div>C → 0: huge margin, many violations, underfit (w → 0).</div>
          </div>
        </ContentStep>
        <ContentStep number={4} title="Problem 4 — RBF γ">
          <p>Large γ vs small γ for an RBF kernel?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Large γ: K decays fast — each point is its own island, overfit.</div>
            <div>Small γ: K is almost constant — the model is nearly linear / underfit.</div>
          </div>
        </ContentStep>
        <ContentStep number={5} title="Problem 5 — Linear SVM vs logistic (ML flavour)">
          <p>Same linear boundary family. Why do they sometimes pick different w?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Logistic uses log-loss: every point pulls, far points still contribute a little.</div>
            <div>SVM uses hinge: points beyond the margin contribute 0. Only support vectors (and violators) shape w.</div>
          </div>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Python — a hard-margin 1-D SVM by inspection">
        <Example
          title="Support vectors and the street"
          output={`boundary at 1.0, margin width 2.0
support x = [0. 2.]
sign(x=3) = 1`}
        >{`import numpy as np

# −1 class: -1, 0     +1 class: 2, 8
# hard-margin 1-D: midpoint between 0 and 2
left, right = 0.0, 2.0
b_x = 0.5 * (left + right)
margin = right - left
w = 2.0 / margin          # so y(w x + b) = 1 at the supports
b = -w * b_x

def predict(x):
    return np.sign(w * x + b)

print(f"boundary at {b_x}, margin width {margin}")
print("support x =", np.array([left, right]))
print("sign(x=3) =", int(predict(3.0)))`}</Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'SVM maximises the margin. Only support vectors determine the hyperplane; other points can move freely inside their class.',
          'Soft-margin + hinge loss lets a few points violate. C is the “hate violations” knob (inverse regularisation).',
          'Kernels run the same algorithm in φ-space via K(x, z) = φ(x)ᵀφ(z). RBF is the default non-linear choice; tune γ.',
          'Linear SVM is a classic high-n, medium-m baseline (text). Kernel SVM does not scale to huge m.',
          'Raw SVM scores are not probabilities. Calibrate if you need P(y = 1). Logistic regression is the cousin that optimises log-loss instead of hinge.',
        ]}
      />
    </LessonArticle>
  )
}
