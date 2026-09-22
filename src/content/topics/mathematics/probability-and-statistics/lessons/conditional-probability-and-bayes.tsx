import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function ConditionalProbabilityAndBayes() {
  return (
    <LessonArticle>
      <Definition term="Conditional probability">
        <p>
          <strong className="text-white">P(A | B)</strong> — read &ldquo;the probability of A given that B
          happened&rdquo; — is what the probability of A becomes once you know B is true.
        </p>
        <div className="mt-3 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>P(A | B) = P(A ∩ B) / P(B)     (assumes P(B) &gt; 0)</div>
        </div>
        <p className="mt-3 text-slate-300">
          Intuition: shrink the world down to just the outcomes where B is true, then ask what fraction of{' '}
          <em>those</em> are also A.
        </p>
      </Definition>

      <LessonSection title="The multiplication rule and the law of total probability">
        <ContentStep number={1} title="Multiplication rule — flip the definition">
          <div className="rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>P(A ∩ B) = P(A | B) · P(B) = P(B | A) · P(A)</div>
          </div>
          <p className="mt-2 text-slate-300">
            Cascade it for chains: <code>P(A ∩ B ∩ C) = P(A) · P(B | A) · P(C | A ∩ B)</code>. This is what
            underlies every autoregressive language model — one conditional factor per token.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Law of total probability — split by cases">
          <p>
            If B₁, B₂, …, Bₙ partition the sample space (disjoint and covering everything):
          </p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>P(A) = Σᵢ P(A | Bᵢ) · P(Bᵢ)</div>
          </div>
          <p className="mt-2 text-slate-300">
            Reads as: average P(A) across every possible &ldquo;branch&rdquo; of the world, weighted by how
            likely each branch is.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Bayes' theorem — the whole point">
        <p className="text-slate-300">
          Take the multiplication rule two ways and equate:
        </p>
        <div className="mt-3 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>P(A | B) = P(B | A) · P(A) / P(B)</div>
          <div className="mt-3">    posterior = likelihood × prior / evidence</div>
        </div>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-slate-300">
          <li><strong className="text-white">Prior P(A)</strong> — what you believed before seeing the data.</li>
          <li><strong className="text-white">Likelihood P(B | A)</strong> — how well hypothesis A explains the data.</li>
          <li><strong className="text-white">Evidence P(B)</strong> — the total probability of the data across all hypotheses (the normaliser).</li>
          <li><strong className="text-white">Posterior P(A | B)</strong> — updated belief after seeing the data.</li>
        </ul>
        <Callout variant="insight" title="Where Bayes shows up in ML">
          Naive Bayes classifiers, Bayesian networks, MAP estimation, Kalman filters, Gaussian processes,
          Thompson sampling, hallucination detection, spam filters, medical-test analysis — all the same
          formula in different clothes.
        </Callout>
      </LessonSection>

      <LessonSection title="The classic mistake — base-rate neglect">
        <p className="text-slate-300">
          People conflate P(A | B) with P(B | A). The famous medical-testing example shows why that is
          catastrophic — see Problem 2 below. In every real deployment, the base rate P(A) matters as much
          as the test&rsquo;s accuracy.
        </p>
      </LessonSection>

      <LessonSection title="Worked problems">
        <ContentStep number={1} title="Problem 1 — Two-card conditional">
          <p>
            Draw two cards from a 52-card deck without replacement. Given the first card is a King, what is
            the probability the second is also a King?
          </p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>After one King is drawn, 51 cards remain, 3 of them Kings.</div>
            <div className="mt-1">P(King₂ | King₁) = 3 / 51 ≈ 0.0588.</div>
          </div>
        </ContentStep>

        <ContentStep number={2} title="Problem 2 — Medical test (the base-rate classic)">
          <p>
            A disease afflicts 0.5% of the population. A test is 99% sensitive (P(+ | disease) = 0.99) and 95%
            specific (P(− | healthy) = 0.95). You test positive. What is P(disease | +)?
          </p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Prior:       P(D) = 0.005,          P(H) = 0.995</div>
            <div>Likelihoods: P(+ | D) = 0.99,        P(+ | H) = 0.05</div>
            <div className="mt-2">Evidence: P(+) = P(+ | D) P(D) + P(+ | H) P(H)</div>
            <div>            = 0.99 · 0.005 + 0.05 · 0.995 = 0.00495 + 0.04975 = 0.05470</div>
            <div className="mt-2">P(D | +) = 0.99 · 0.005 / 0.05470 = 0.00495 / 0.05470 ≈ 0.0905</div>
            <div className="mt-2 text-genai-400">
              Only ~9% chance you have the disease — because the disease is rare. Most positives are false
              positives.
            </div>
          </div>
        </ContentStep>

        <ContentStep number={3} title="Problem 3 — Law of total probability">
          <p>
            Factory has three production lines. Line 1 makes 50% of parts (2% defect), Line 2 makes 30% (3%
            defect), Line 3 makes 20% (5% defect). Pick a random part — what is the probability it is
            defective?
          </p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>P(D) = 0.02·0.5 + 0.03·0.3 + 0.05·0.2</div>
            <div>     = 0.010 + 0.009 + 0.010 = 0.029.</div>
            <div>Follow-up: which line most likely made the defective part? (Bayes)</div>
            <div className="mt-2">P(L₁ | D) = 0.010 / 0.029 ≈ 0.345</div>
            <div>P(L₂ | D) = 0.009 / 0.029 ≈ 0.310</div>
            <div>P(L₃ | D) = 0.010 / 0.029 ≈ 0.345</div>
          </div>
        </ContentStep>

        <ContentStep number={4} title="Problem 4 — Spam filter (ML flavour)">
          <p>
            Word &ldquo;free&rdquo; appears in 70% of spam and 5% of ham. 30% of email is spam. Email
            containing &ldquo;free&rdquo; arrives — probability it is spam?
          </p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>P(spam | free) = P(free | spam) P(spam) / P(free)</div>
            <div>P(free) = 0.70·0.30 + 0.05·0.70 = 0.210 + 0.035 = 0.245</div>
            <div>P(spam | free) = 0.210 / 0.245 ≈ 0.857</div>
            <div className="mt-2 text-genai-400">One word already raises the posterior from 30% to 86%.</div>
          </div>
        </ContentStep>

        <ContentStep number={5} title="Problem 5 — Chain rule for autoregressive models (ML flavour)">
          <p>
            An LLM assigns P(&ldquo;the&rdquo;) = 0.10, P(&ldquo;cat&rdquo; | &ldquo;the&rdquo;) = 0.06,
            P(&ldquo;sat&rdquo; | &ldquo;the cat&rdquo;) = 0.02. What is P(&ldquo;the cat sat&rdquo;)?
          </p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>P(seq) = P(w₁) · P(w₂ | w₁) · P(w₃ | w₁ w₂)</div>
            <div>       = 0.10 · 0.06 · 0.02 = 0.00012 = 1.2 × 10⁻⁴</div>
            <div className="mt-2 text-slate-400">
              Every language model computes sentence probability exactly this way — one conditional factor
              per token. Log-probability makes it a sum (no underflow).
            </div>
          </div>
        </ContentStep>

        <ContentStep number={6} title="Problem 6 — Monty Hall">
          <p>
            Three doors, one has a car, two have goats. You pick door 1. The host (who knows) opens door 3
            revealing a goat. Should you switch to door 2?
          </p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Prior on car:  P(car@1) = 1/3,   P(car@2) = 1/3,   P(car@3) = 1/3.</div>
            <div className="mt-2">Likelihood of the host opening door 3:</div>
            <div>  car@1 → host may open 2 or 3 → P(host=3 | car@1) = 1/2.</div>
            <div>  car@2 → host must open 3    → P(host=3 | car@2) = 1.</div>
            <div>  car@3 → host cannot open 3 → 0.</div>
            <div className="mt-2">P(host=3) = 1/2·1/3 + 1·1/3 + 0·1/3 = 1/6 + 1/3 = 1/2.</div>
            <div className="mt-2">P(car@1 | host=3) = (1/2)(1/3) / (1/2) = 1/3.</div>
            <div>P(car@2 | host=3) = (1)(1/3)   / (1/2) = 2/3.</div>
            <div className="mt-2 text-genai-400">Switch — you double your chance from 1/3 to 2/3.</div>
          </div>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Python — Bayes + Monte Carlo agreement">
        <Example
          title="Two hands-on verifications"
          output={`P(disease | +) analytic ≈ 0.0905
P(disease | +) MC       ≈ 0.0912  (n=100000)
Monty Hall stay wins   MC ≈ 0.3336
Monty Hall switch wins MC ≈ 0.6664
Spam | free            = 0.857`}
        >{`import numpy as np

rng = np.random.default_rng(0)
N   = 100_000

# ---- Disease test ----
prior     = 0.005
sens      = 0.99   # P(+ | D)
spec      = 0.95   # P(- | H)
p_plus    = sens * prior + (1 - spec) * (1 - prior)
posterior = sens * prior / p_plus
print(f"P(disease | +) analytic ≈ {posterior:.4f}")

# Simulate
has_disease = rng.random(N) < prior
tested_pos = np.where(has_disease,
                      rng.random(N) < sens,
                      rng.random(N) < (1 - spec))
mc = has_disease[tested_pos].sum() / tested_pos.sum()
print(f"P(disease | +) MC       ≈ {mc:.4f}  (n=100000)")

# ---- Monty Hall ----
car   = rng.integers(0, 3, N)                                           # car location
pick  = rng.integers(0, 3, N)                                           # initial guess
# host opens a goat door that is not your pick
def open_door(car_i, pick_i, r):
    # choose one of the doors that is neither the car nor your pick
    options = [d for d in range(3) if d != car_i and d != pick_i]
    return options[0] if len(options) == 1 else options[int(r < 0.5)]
opens = np.array([open_door(c, p, rng.random()) for c, p in zip(car, pick)])

stay_win   = np.mean(pick == car)
# switch: your new choice is the remaining door
switch     = np.array([[d for d in range(3) if d != p and d != o][0] for p, o in zip(pick, opens)])
switch_win = np.mean(switch == car)
print(f"Monty Hall stay wins   MC ≈ {stay_win:.4f}")
print(f"Monty Hall switch wins MC ≈ {switch_win:.4f}")

# ---- Spam filter ----
p_free_spam, p_free_ham, p_spam = 0.70, 0.05, 0.30
p_free = p_free_spam * p_spam + p_free_ham * (1 - p_spam)
print(f"Spam | free            = {p_free_spam * p_spam / p_free:.3f}")`}</Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Conditional probability shrinks the sample space to the "given" event: P(A | B) = P(A ∩ B) / P(B).',
          'Multiplication rule and its cascade P(x₁…xₙ) = ∏ P(xᵢ | x₁…xᵢ₋₁) is the entire skeleton of an autoregressive LM.',
          'Law of total probability: sum P(A | Bᵢ) P(Bᵢ) across a partition to get P(A). Bayes then flips it to compute P(Bᵢ | A).',
          'Bayes: posterior ∝ likelihood × prior. Never quote P(evidence | hypothesis) as if it were P(hypothesis | evidence) — the base rate matters.',
          'Medical-test problem: 99% sensitive test on a 0.5% disease still gives only ~9% posterior — the classic base-rate neglect.',
          'Monty Hall: switching wins with probability 2/3 — provable with Bayes and confirmable in 3 lines of simulation.',
        ]}
      />
    </LessonArticle>
  )
}
