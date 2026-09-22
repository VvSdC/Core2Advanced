import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function EntropyAndInformation() {
  return (
    <LessonArticle>
      <Definition term="Information content">
        <p>
          A rare event carries more information than a common one. If P(x) is the probability of an
          outcome, the <strong className="text-white">self-information</strong> of x is:
        </p>
        <div className="mt-3 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>I(x) = − log P(x)          (in bits if log = log₂, nats if log = ln)</div>
        </div>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-slate-300">
          <li>Certain event (P = 1)     → I = 0 bits (no news).</li>
          <li>Fair coin (P = 0.5)       → I = 1 bit.</li>
          <li>1-in-a-million event      → I = log₂(10⁶) ≈ 19.9 bits.</li>
        </ul>
        <Callout variant="beginner" title="Bits, nats, hartleys">
          Base 2 → bits, base e → nats, base 10 → hartleys. Same idea, different units. ML papers switch
          between them; conversion is a constant factor.
        </Callout>
      </Definition>

      <LessonSection title="Shannon entropy — average information">
        <div className="rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>H(X) = − Σₓ P(x) · log P(x)         (with 0 log 0 = 0)</div>
        </div>
        <p className="mt-3 text-slate-300">
          Entropy is the <em>expected surprise</em> when you draw X once. Equivalently, the minimum average
          number of bits needed to encode X (Shannon&rsquo;s source-coding theorem).
        </p>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-slate-300">
          <li>Maximum: uniform distribution on n outcomes has H = log n.</li>
          <li>Minimum: a deterministic distribution has H = 0.</li>
          <li>Bits/token in language models = entropy per token; perplexity = 2^H.</li>
        </ul>
      </LessonSection>

      <LessonSection title="Joint and conditional entropy">
        <div className="rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>H(X, Y) = − Σ_{`{x,y}`} P(x, y) log P(x, y)                 (total surprise of the pair)</div>
          <div className="mt-2">H(Y | X) = − Σ_{`{x,y}`} P(x, y) log P(y | x)                (remaining surprise about Y once X is known)</div>
          <div className="mt-2">Chain rule:  H(X, Y) = H(X) + H(Y | X)</div>
        </div>
        <p className="mt-3 text-slate-300">
          Conditional entropy quantifies &ldquo;how much of Y&rsquo;s uncertainty is <em>not</em> resolved
          by knowing X&rdquo;. If Y is a function of X, H(Y | X) = 0.
        </p>
      </LessonSection>

      <LessonSection title="Mutual information — how much X tells you about Y">
        <div className="rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>I(X; Y) = H(X) − H(X | Y)</div>
          <div>       = H(Y) − H(Y | X)</div>
          <div>       = H(X) + H(Y) − H(X, Y)</div>
        </div>
        <p className="mt-3 text-slate-300">
          I(X; Y) is symmetric, non-negative, and zero iff X ⟂ Y. Unlike correlation, mutual information
          catches <em>non-linear</em> relationships (e.g. Y = X² with X ~ N(0, 1) has ρ = 0 but I &gt; 0).
        </p>
        <Callout variant="insight" title="ML places to know MI">
          Feature selection (rank features by MI with the label), decision-tree splits (information gain =
          MI), representation learning (InfoNCE ≈ lower bound on MI), and contrastive objectives.
        </Callout>
      </LessonSection>

      <LessonSection title="Information gain — decision-tree splits">
        <p className="text-slate-300">
          A tree splits a node on feature F if the split reduces label uncertainty most:
        </p>
        <div className="mt-3 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>IG(Y, F) = H(Y) − Σ_v  (|S_v| / |S|) · H(Y | F = v)</div>
        </div>
        <p className="mt-3 text-slate-300">
          Which is precisely the mutual information I(Y; F). ID3, C4.5, and every scikit-learn decision
          tree do exactly this.
        </p>
      </LessonSection>

      <LessonSection title="Worked problems">
        <ContentStep number={1} title="Problem 1 — Fair coin vs biased coin">
          <p>Compute H(X) for a fair coin and for a coin with P(H) = 0.9.</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Fair:   H = −(0.5 log₂ 0.5 + 0.5 log₂ 0.5)  = 1 bit.</div>
            <div>Biased: H = −(0.9 log₂ 0.9 + 0.1 log₂ 0.1) ≈ 0.469 bits.</div>
            <div className="mt-2 text-slate-400">Bias → less surprise → lower entropy → cheaper to encode.</div>
          </div>
        </ContentStep>

        <ContentStep number={2} title="Problem 2 — Language-model bits per token">
          <p>
            A language model achieves NLL = 2.05 nats/token on a held-out set. Convert to bits/token and to
            perplexity.
          </p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Bits/token   = 2.05 / ln 2 ≈ 2.958.</div>
            <div>Perplexity   = e^2.05      ≈ 7.769.</div>
            <div className="mt-2 text-genai-400">
              GPT-3 quoted ~1.5 bits/token on WebText — perplexity ≈ 2.83. Every drop of a bit is 2× fewer
              plausible next tokens on average.
            </div>
          </div>
        </ContentStep>

        <ContentStep number={3} title="Problem 3 — Joint / conditional entropy">
          <p>
            X, Y ∈ {`{0, 1}`} with joint P: (0, 0) = 0.4, (0, 1) = 0.1, (1, 0) = 0.2, (1, 1) = 0.3. Compute
            H(X), H(Y), H(X, Y), H(Y | X), and I(X; Y).
          </p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>P(X = 0) = 0.5,  P(X = 1) = 0.5 → H(X) = 1 bit.</div>
            <div>P(Y = 0) = 0.6,  P(Y = 1) = 0.4 → H(Y) ≈ 0.971 bits.</div>
            <div>H(X, Y) = −(0.4 log 0.4 + 0.1 log 0.1 + 0.2 log 0.2 + 0.3 log 0.3) ≈ 1.846 bits.</div>
            <div>H(Y | X) = H(X, Y) − H(X) = 0.846 bits.</div>
            <div>I(X; Y) = H(Y) − H(Y | X) = 0.971 − 0.846 ≈ 0.125 bits.</div>
            <div className="mt-2 text-slate-400">Weak but non-zero dependence — X tells us ~0.125 bits about Y.</div>
          </div>
        </ContentStep>

        <ContentStep number={4} title="Problem 4 — Non-linear MI (ML flavour)">
          <p>
            Discretise: X ∈ {`{−1, 0, 1}`} uniformly, and Y = X². Compute ρ(X, Y) vs I(X; Y).
          </p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>E[X] = 0, E[Y] = 2/3, E[X Y] = E[X³] = 0.</div>
            <div>Cov(X, Y) = 0 − 0 · 2/3 = 0  →  ρ = 0.</div>
            <div className="mt-2">H(X) = log₂ 3 ≈ 1.585.</div>
            <div>Y = 0 with prob 1/3, Y = 1 with prob 2/3  →  H(Y) ≈ 0.918.</div>
            <div>Y is fully determined by X → H(Y | X) = 0.</div>
            <div>I(X; Y) = H(Y) ≈ 0.918 bits.</div>
            <div className="mt-2 text-genai-400">
              Zero correlation but almost a full bit of MI. Feature selectors using correlation would drop
              this feature; MI-based selectors keep it.
            </div>
          </div>
        </ContentStep>

        <ContentStep number={5} title="Problem 5 — Information gain of a split (ML flavour)">
          <p>
            Data: 10 rows, 6 positives / 4 negatives. Split on Feature = A (6 rows: 5+/1−) vs Feature = B
            (4 rows: 1+/3−). Compute IG.
          </p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>H(root)  = −(0.6 log 0.6 + 0.4 log 0.4)     ≈ 0.971 bits.</div>
            <div>H(A)     = −(5/6 log 5/6 + 1/6 log 1/6)     ≈ 0.650 bits.</div>
            <div>H(B)     = −(1/4 log 1/4 + 3/4 log 3/4)     ≈ 0.811 bits.</div>
            <div className="mt-2">IG = 0.971 − (6/10 · 0.650 + 4/10 · 0.811)</div>
            <div>    = 0.971 − (0.390 + 0.324)</div>
            <div>    = 0.971 − 0.714 = 0.257 bits.</div>
            <div className="mt-2 text-slate-400">
              Every scikit-learn decision-tree split maximises this quantity across features.
            </div>
          </div>
        </ContentStep>

        <ContentStep number={6} title="Problem 6 — Maximum-entropy classifier (ML flavour)">
          <p>
            You know a categorical variable has 4 classes and average encoding cost must be minimised
            subject to no prior information. What is the max-entropy distribution?
          </p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Under only the normalisation constraint Σ pᵢ = 1, the entropy H = −Σ pᵢ log pᵢ is</div>
            <div>maximised at the uniform distribution pᵢ = 1/4.  H = log₂ 4 = 2 bits.</div>
            <div className="mt-2 text-slate-400">
              This is the principle of maximum entropy — behind logistic regression, softmax, and Bayesian
              priors in the absence of information.
            </div>
          </div>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Python — entropy and mutual information">
        <Example
          title="Numeric checks of every problem above"
          output={`H(fair coin)               = 1.0000 bits
H(biased 0.9)              = 0.4690 bits
Bits/token                 = 2.9575
Perplexity                 = 7.7679
H(X, Y)                    = 1.8464 bits
H(Y | X)                   = 0.8464 bits
I(X; Y) [joint]            = 0.1245 bits
Cov(X, Y=X²)               = 0.0000  ρ = 0.0000
I(X; Y=X²)                 = 0.9183 bits
IG(split A/B)              = 0.2557 bits`}
        >{`import numpy as np
from math import log2

def H(p):
    p = np.asarray(p, dtype=float)
    return -np.sum(p[p > 0] * np.log2(p[p > 0]))

# Coins
print(f"H(fair coin)               = {H([0.5, 0.5]):.4f} bits")
print(f"H(biased 0.9)              = {H([0.9, 0.1]):.4f} bits")

# Language-model conversions
nll = 2.05                                   # nats/token
print(f"Bits/token                 = {nll / np.log(2):.4f}")
print(f"Perplexity                 = {np.exp(nll):.4f}")

# Joint 2 × 2
J   = np.array([[0.4, 0.1], [0.2, 0.3]])
px  = J.sum(axis=1)
py  = J.sum(axis=0)
Hxy = H(J.flatten())
Hy_given_x = Hxy - H(px)
mi_joint   = H(py) - Hy_given_x
print(f"H(X, Y)                    = {Hxy:.4f} bits")
print(f"H(Y | X)                   = {Hy_given_x:.4f} bits")
print(f"I(X; Y) [joint]            = {mi_joint:.4f} bits")

# Y = X² with X ∈ {-1, 0, 1}
X = np.array([-1, 0, 1])
Y = X ** 2
cov = np.cov(X, Y, ddof=0)[0, 1]
rho = 0.0 if np.std(X) * np.std(Y) == 0 else cov / (np.std(X) * np.std(Y))
print(f"Cov(X, Y=X²)               = {cov:.4f}  ρ = {rho:.4f}")

py2 = {0: 1/3, 1: 2/3}
print(f"I(X; Y=X²)                 = {H(list(py2.values())):.4f} bits")

# Information gain of a split
h_root = H([0.6, 0.4])
h_a    = H([5/6, 1/6])
h_b    = H([1/4, 3/4])
ig     = h_root - (6/10) * h_a - (4/10) * h_b
print(f"IG(split A/B)              = {ig:.4f} bits")`}</Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Self-information I(x) = −log P(x) measures surprise. Entropy H(X) = E[I(X)] is average surprise — the minimum average bits to encode X (Shannon).',
          'Uniform on n outcomes maximises entropy at log n bits; deterministic distributions have entropy 0.',
          'Chain rule: H(X, Y) = H(X) + H(Y | X). Conditional entropy is what is LEFT after learning X.',
          'Mutual information I(X; Y) = H(Y) − H(Y | X) is symmetric, non-negative, zero iff independent — and catches non-linear relationships correlation misses.',
          'Decision-tree information gain IS the mutual information between the feature and the label. That is the split rule inside ID3, C4.5, and sklearn trees.',
          'Language-model quality: bits/token (entropy per token) and perplexity (exp of nats/token) are two dials on the same knob.',
        ]}
      />
    </LessonArticle>
  )
}
