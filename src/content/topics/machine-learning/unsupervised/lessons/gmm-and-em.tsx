import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function GmmAndEm() {
  return (
    <LessonArticle>
      <Definition term="Gaussian mixture model">
        <p>
          Data is a <strong className="text-white">soft mixture</strong> of k Gaussians. Each
          component has a mean, a covariance, and a mixing weight. A point does not “belong” to
          one cluster — it has a responsibility (probability) under each component.
        </p>
        <div className="mt-3 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>p(x) = Σⱼ πⱼ  N(x | μⱼ, Σⱼ)</div>
          <div>Σⱼ πⱼ = 1,   πⱼ ≥ 0</div>
        </div>
        <p className="mt-3 text-slate-300">
          k-means is the hard, spherical, equal-variance special case. GMM lets clusters be
          ellipses of different sizes and overlap.
        </p>
      </Definition>

      <LessonSection title="Intuition — unlabeled points, labeled Gaussians">
        <p className="text-slate-300">
          You believe shoppers come from “bargain” and “premium” types, each roughly Gaussian in
          (age, spend). You do not know who is who, or the two clouds’ centres. EM guesses the
          memberships, then updates the clouds, and repeats — the same E / M dance as k-means,
          but with probabilities and full covariances.
        </p>
      </LessonSection>

      <LessonSection title="Expectation–Maximisation">
        <div className="rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>E-step:  γᵢⱼ = P(zᵢ = j | xᵢ) = πⱼ N(xᵢ | μⱼ, Σⱼ) / Σₖ πₖ N(xᵢ | μₖ, Σₖ)</div>
          <div className="mt-2">M-step:  Nⱼ = Σᵢ γᵢⱼ</div>
          <div>         πⱼ = Nⱼ / m</div>
          <div>         μⱼ = Σᵢ γᵢⱼ xᵢ / Nⱼ</div>
          <div>         Σⱼ = Σᵢ γᵢⱼ (xᵢ − μⱼ)(xᵢ − μⱼ)ᵀ / Nⱼ</div>
        </div>
        <p className="mt-3 text-slate-300">
          Each M-step maximises the expected complete-data log-likelihood. EM is guaranteed not
          to decrease that bound; it can still land in a local maximum. Several random inits
          (or k-means init) are standard.
        </p>
        <Callout variant="insight" title="Hard vs soft assignment">
          If you replace γᵢⱼ with a one-hot argmax and force Σⱼ = I, EM collapses to k-means.
          GMM keeps the uncertainty: a point between two blobs can be 60 / 40.
        </Callout>
      </LessonSection>

      <LessonSection title="When to use it">
        <ul className="list-disc space-y-1 pl-5 text-slate-300">
          <li>Clusters look elliptical and may overlap. You want soft memberships or a density.</li>
          <li>Anomaly scores: a point with tiny p(x) under the mixture is unusual.</li>
          <li>You need a generative model you can sample from.</li>
        </ul>
        <p className="mt-3 text-slate-300">
          Full covariances need enough points per component (otherwise Σ is singular — use
          tied / diagonal covariance or a stronger prior). k still has to be chosen (BIC / AIC
          are the usual likelihood penalties). Not for crescent shapes.
        </p>
      </LessonSection>

      <LessonSection title="Worked problems">
        <ContentStep number={1} title="Problem 1 — Responsibility by hand">
          <p>
            1-D. Two components: N(0, 1) and N(4, 1), π = (0.5, 0.5). Point x = 1. γ for
            component 1?
          </p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>N(1 | 0, 1) / N(1 | 4, 1) = exp(−0.5) / exp(−4.5) = e⁴ ≈ 54.6</div>
            <div>γ₁ = 54.6 / (54.6 + 1) ≈ 0.982. Almost surely component 1.</div>
          </div>
        </ContentStep>
        <ContentStep number={2} title="Problem 2 — Soft mean">
          <p>Two points x = 0, 4 with γ for component 1 equal to 0.9 and 0.1. Next μ₁?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>μ₁ = (0.9·0 + 0.1·4) / (0.9 + 0.1) = 0.4</div>
          </div>
        </ContentStep>
        <ContentStep number={3} title="Problem 3 — Singular covariance">
          <p>A component claims 2 points in 5-D. What happens to Σ?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Rank at most 1. Σ is singular; the Gaussian density blows up.</div>
            <div>Fix: diagonal / tied covariance, or a tiny ridge on the diagonal, or more data.</div>
          </div>
        </ContentStep>
        <ContentStep number={4} title="Problem 4 — BIC to pick k">
          <p>Why not pick the k with the highest training log-likelihood?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>More components always fit the sample better (same as more trees, higher degree).</div>
            <div>BIC ≈ −2 ℓ + p log m. Extra Gaussians pay a parameter tax.</div>
          </div>
        </ContentStep>
        <ContentStep number={5} title="Problem 5 — Anomaly score (ML flavour)">
          <p>A production event has p(x) = 1e-12 under a fitted 3-GMM of normal traffic. Alarm?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>It is a candidate. Threshold on a validation week of known-normal data, not on an arbitrary 1e-12.</div>
            <div>GMM density is a score, not a calibrated “probability of attack.”</div>
          </div>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Python — one E-step on two 1-D Gaussians">
        <Example
          title="Responsibilities at x = 1"
          output={`γ(x=1) ≈ [0.982 0.018]
soft mean of a 0.9/0.1 pair: 0.40`}
        >{`import numpy as np
from scipy.stats import norm

pi = np.array([0.5, 0.5])
mu = np.array([0.0, 4.0])
like = pi * norm.pdf(1.0, loc=mu, scale=1.0)
gamma = like / like.sum()
print("γ(x=1) ≈", np.round(gamma, 3))

w = np.array([0.9, 0.1])
xs = np.array([0.0, 4.0])
print(f"soft mean of a 0.9/0.1 pair: {(w * xs).sum() / w.sum():.2f}")`}</Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'A GMM is a weighted sum of Gaussians. Membership is soft: responsibilities γᵢⱼ, not a hard label.',
          'EM: E-step computes γ, M-step updates π, μ, Σ as weighted means and covariances. k-means is the hard spherical cousin.',
          'Use it for overlapping elliptical blobs, density estimates, and anomaly scores. Not for moons or rings.',
          'Full Σ needs enough points per component. Prefer diagonal / tied covariance or a ridge when n is large and m is shy.',
          'Pick k with BIC / AIC or a holdout likelihood — raw training likelihood always wants more components.',
        ]}
      />
    </LessonArticle>
  )
}
