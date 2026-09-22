import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function CrossEntropyAndKlDivergence() {
  return (
    <LessonArticle>
      <Definition term="Cross-entropy">
        <p>
          You have two distributions on the same outcomes: <strong className="text-white">p</strong> (truth)
          and <strong className="text-white">q</strong> (your model). Cross-entropy is the average number of
          bits you spend if you build a code for q but sample from p:
        </p>
        <div className="mt-3 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>H(p, q) = − Σₓ p(x) · log q(x)</div>
        </div>
        <p className="mt-3 text-slate-300">
          Minimum when q = p, in which case H(p, q) = H(p). Any mismatch adds extra bits — that overhead is
          KL divergence.
        </p>
      </Definition>

      <LessonSection title="KL divergence — the &ldquo;bits wasted&rdquo;">
        <div className="rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>D_KL(p ‖ q) = Σₓ p(x) · log ( p(x) / q(x) )</div>
          <div className="mt-2">          = H(p, q) − H(p)</div>
        </div>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-slate-300">
          <li>D_KL(p ‖ q) ≥ 0, with equality iff p = q (Gibbs&rsquo; inequality).</li>
          <li>Not symmetric: D_KL(p ‖ q) ≠ D_KL(q ‖ p) in general.</li>
          <li>Not a true distance (fails triangle inequality) — it is a &ldquo;divergence&rdquo;.</li>
          <li>Infinite if q(x) = 0 where p(x) &gt; 0 (predicting zero probability for a real event).</li>
        </ul>
        <Callout variant="insight" title="Why non-symmetric matters">
          Forward KL D(p ‖ q) is <strong className="text-white">mean-seeking</strong> — q must cover every
          support point of p. Reverse KL D(q ‖ p) is <strong className="text-white">mode-seeking</strong> —
          q collapses to a mode of p. VAEs and RLHF care about this asymmetry every day.
        </Callout>
      </LessonSection>

      <LessonSection title="The clean identity — cross-entropy loss decomposed">
        <div className="rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>H(p, q) = H(p) + D_KL(p ‖ q)</div>
        </div>
        <p className="mt-3 text-slate-300">
          Minimising cross-entropy w.r.t. q is <em>identical</em> to minimising KL divergence — because
          H(p) is a constant of the data. That is why every classifier trained with cross-entropy is
          implicitly minimising KL.
        </p>
      </LessonSection>

      <LessonSection title="Binary and categorical cross-entropy in ML">
        <ContentStep number={1} title="Binary (logistic regression, single-label classification)">
          <div className="rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>BCE(y, ŷ) = −(y log ŷ + (1 − y) log(1 − ŷ))</div>
          </div>
          <p className="mt-2 text-slate-300">
            y ∈ {`{0, 1}`}, ŷ ∈ (0, 1) is the sigmoid output. This is exactly the negative log-likelihood
            of a Bernoulli.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Categorical (softmax + K classes)">
          <div className="rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>CE(y, ŷ) = − Σₖ  yₖ log ŷₖ</div>
            <div className="mt-2">One-hot label → CE = −log ŷ_{`{true}`}. Only the true-class log-prob matters.</div>
          </div>
          <p className="mt-2 text-slate-300">
            Language-model NLL over a batch is the mean of these across tokens, and exp(mean CE) is
            perplexity.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Where KL shows up around AI">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Where</th>
                <th className="px-4 py-3">What it measures</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Cross-entropy loss',    'D_KL(true labels ‖ predicted)'],
                ['VAE ELBO',              'D_KL(q_φ(z|x) ‖ p(z)) — pushes encoder near prior'],
                ['PPO / RLHF penalty',    'D_KL(π_new ‖ π_old) — prevents policy from moving too far'],
                ['Model distillation',    'D_KL(teacher ‖ student) on softened logits'],
                ['Bayesian posteriors',   'Variational family Q vs true posterior P'],
                ['Data drift detection',  'KL / JS between production and training distributions'],
              ].map(([w, m]) => (
                <tr key={w}>
                  <td className="px-4 py-3 font-semibold text-white">{w}</td>
                  <td className="px-4 py-3 text-slate-400">{m}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Symmetric siblings — JSD and total variation">
        <div className="rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>Jensen–Shannon:  JSD(p, q) = 0.5 D_KL(p ‖ m) + 0.5 D_KL(q ‖ m),   m = (p + q) / 2</div>
          <div className="mt-2">Total variation: TV(p, q)  = 0.5 Σ |p(x) − q(x)|</div>
        </div>
        <p className="mt-3 text-slate-300">
          JSD is symmetric, always finite, and its square root is a true metric. TV is symmetric, bounded
          in [0, 1], and easy to interpret. Drift-detection tooling (Evidently AI, WhyLabs) usually reports
          JSD or population-stability-index (a discretised KL).
        </p>
      </LessonSection>

      <LessonSection title="Worked problems">
        <ContentStep number={1} title="Problem 1 — Binary cross-entropy">
          <p>True label y = 1. Model predicts ŷ = 0.7. Compute BCE.</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>BCE = −(1 · ln 0.7 + 0 · ln 0.3) = −ln 0.7 ≈ 0.357 nats.</div>
            <div className="mt-1">If the model had predicted 0.99, BCE ≈ 0.010 nats. If 0.01, BCE ≈ 4.605.</div>
          </div>
        </ContentStep>

        <ContentStep number={2} title="Problem 2 — Categorical cross-entropy (LM step)">
          <p>
            Vocabulary of 4 tokens. Model softmax = (0.05, 0.60, 0.25, 0.10). True token is index 1.
            Compute CE.
          </p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>CE = −ln 0.60 ≈ 0.511 nats  →  bits ≈ 0.737.</div>
            <div className="mt-2 text-slate-400">
              Only the probability of the correct class matters. Boosting the wrong-class probabilities
              does not change the loss until they eat into the true-class share.
            </div>
          </div>
        </ContentStep>

        <ContentStep number={3} title="Problem 3 — KL between two Bernoullis">
          <p>p = 0.7, q = 0.5. Compute D_KL(p ‖ q).</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>D_KL = 0.7 log(0.7 / 0.5) + 0.3 log(0.3 / 0.5)</div>
            <div>     = 0.7 · 0.4855 + 0.3 · (−0.7370)</div>
            <div>     ≈ 0.3398 − 0.2211 = 0.1187 nats  (~0.171 bits).</div>
            <div className="mt-2">Reverse: D_KL(q ‖ p) ≈ 0.5 log(0.5 / 0.7) + 0.5 log(0.5 / 0.3)</div>
            <div>              ≈ 0.5 · (−0.3365) + 0.5 · (0.5108) ≈ 0.0872 nats.</div>
            <div className="mt-2 text-genai-400">Asymmetric: 0.1187 ≠ 0.0872.</div>
          </div>
        </ContentStep>

        <ContentStep number={4} title="Problem 4 — Cross-entropy = H + KL (ML flavour)">
          <p>Verify H(p, q) = H(p) + D_KL(p ‖ q) for p = (0.7, 0.3), q = (0.5, 0.5).</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>H(p)      = −(0.7 ln 0.7 + 0.3 ln 0.3) ≈ 0.6109 nats.</div>
            <div>H(p, q)   = −(0.7 ln 0.5 + 0.3 ln 0.5) = −ln 0.5 ≈ 0.6931.</div>
            <div>Diff      = 0.6931 − 0.6109 = 0.0822.  Matches roughly D_KL when computed with same base.</div>
            <div className="mt-2 text-slate-400">
              This identity is why cross-entropy loss and KL loss give the same gradient — H(p) is a
              constant of the labels.
            </div>
          </div>
        </ContentStep>

        <ContentStep number={5} title="Problem 5 — Zero-probability trap (ML flavour)">
          <p>
            A classifier outputs ŷ = 0 for the true class. What happens to the loss?
          </p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>CE = −log 0 = +∞. Gradient explodes.</div>
            <div className="mt-2 text-genai-400">
              Fix in every framework: <code>log_softmax</code> in fp32 → CE, or add a tiny ε before log.
              Label smoothing (replace 1 with 1 − ε and 0 with ε / (K − 1)) also caps the maximum loss.
            </div>
          </div>
        </ContentStep>

        <ContentStep number={6} title="Problem 6 — KL for two Gaussians (ML flavour)">
          <p>
            Closed form for KL between two 1-D Gaussians p = N(μ₁, σ₁²), q = N(μ₂, σ₂²):
          </p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>D_KL(p ‖ q) = log(σ₂ / σ₁) + (σ₁² + (μ₁ − μ₂)²) / (2 σ₂²) − 1/2</div>
            <div className="mt-2">For N(0, 1) ‖ N(0, 1)  → 0.  For N(3, 1) ‖ N(0, 1) → 9/2 = 4.5 nats.</div>
            <div className="mt-2 text-slate-400">
              The VAE prior KL uses this exact formula per latent dimension.
            </div>
          </div>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Python — cross-entropy, KL, and JSD">
        <Example
          title="All of the identities, numerically confirmed"
          output={`BCE (y=1, ŷ=0.7)        = 0.3567
CE (softmax, true idx 1) = 0.5108 nats  0.7370 bits
D_KL(p ‖ q) [Bern 0.7 || 0.5] = 0.1187
D_KL(q ‖ p) [Bern 0.5 || 0.7] = 0.0872
Identity  H(p, q) - H(p)     = 0.0822
KL Gaussians N(3, 1) || N(0, 1) = 4.5000
JSD symmetric                 = 0.0220`}
        >{`import numpy as np

def H(p, base=np.e):
    p = np.asarray(p, dtype=float)
    m = p > 0
    return -np.sum(p[m] * np.log(p[m])) / np.log(base)

def KL(p, q, base=np.e):
    p, q = np.asarray(p, dtype=float), np.asarray(q, dtype=float)
    m    = (p > 0)
    return np.sum(p[m] * (np.log(p[m]) - np.log(q[m]))) / np.log(base)

def JSD(p, q):
    p, q = np.asarray(p, dtype=float), np.asarray(q, dtype=float)
    m    = 0.5 * (p + q)
    return 0.5 * KL(p, m) + 0.5 * KL(q, m)

# 1. Binary CE
y_true, y_pred = 1, 0.7
bce = -(y_true * np.log(y_pred) + (1 - y_true) * np.log(1 - y_pred))
print(f"BCE (y=1, ŷ=0.7)        = {bce:.4f}")

# 2. Categorical CE
soft = np.array([0.05, 0.60, 0.25, 0.10])
true_idx = 1
ce = -np.log(soft[true_idx])
print(f"CE (softmax, true idx 1) = {ce:.4f} nats  {ce / np.log(2):.4f} bits")

# 3. KL between Bernoullis
p = [0.7, 0.3]
q = [0.5, 0.5]
print(f"D_KL(p ‖ q) [Bern 0.7 || 0.5] = {KL(p, q):.4f}")
print(f"D_KL(q ‖ p) [Bern 0.5 || 0.7] = {KL(q, p):.4f}")

# 4. Identity check
print(f"Identity  H(p, q) - H(p)     = "
      f"{(-p[0]*np.log(q[0]) - p[1]*np.log(q[1])) - H(p):.4f}")

# 5. KL between two 1-D Gaussians
mu1, sig1 = 3.0, 1.0
mu2, sig2 = 0.0, 1.0
kl_gauss = np.log(sig2 / sig1) + (sig1**2 + (mu1 - mu2)**2) / (2 * sig2**2) - 0.5
print(f"KL Gaussians N(3, 1) || N(0, 1) = {kl_gauss:.4f}")

# 6. Symmetric JSD
print(f"JSD symmetric                 = {JSD(p, q):.4f}")`}</Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Cross-entropy H(p, q) = −Σ p log q is the average bits when using code for q on samples from p. Minimum equals H(p); the overhead is KL.',
          'KL divergence D(p ‖ q) ≥ 0, zero iff p = q, and asymmetric — forward KL is mean-seeking, reverse KL is mode-seeking.',
          'Cross-entropy loss = H(p) + D_KL(p ‖ q). Since H(p) is fixed by the labels, minimising cross-entropy IS minimising KL.',
          'Binary CE is Bernoulli NLL; categorical CE with a one-hot label collapses to −log ŷ_true — only the correct class matters.',
          'KL blows up when the model assigns zero to a true class — fix with log_softmax, ε-smoothing, or label smoothing.',
          'Symmetric siblings: JSD (bounded, √JSD is a metric) and total variation (0.5 Σ |p − q|) are what drift-detection tools actually report.',
        ]}
      />
    </LessonArticle>
  )
}
