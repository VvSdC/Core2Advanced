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

export function FindingRelationships() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Now that columns are trustworthy…">
        Relationships ask: does this feature move with the target? Does it move with another feature?
        You are hunting for signal and for redundancy — carefully, with plots and simple numbers first.
      </Callout>

      <Definition term="Bivariate / multivariate EDA">
        <p>
          <strong className="text-white">Bivariate</strong> = two variables at a time (feature vs target,
          or feature vs feature). <strong className="text-white">Multivariate</strong> = looking at several
          together (heatmaps, pair plots, stratified slices). Start bivariate; add slices when a global
          plot lies.
        </p>
      </Definition>

      <LessonSection title="Always start from the target">
        <Flowchart
          title="Relationship pass"
          chart={`flowchart TD
  A[Target type?] -->|Numeric| B[Feature vs y: scatter / corr / group means]
  A -->|Category| C[Feature vs y: rate by level / box by class]
  B --> D[Feature vs feature: redundancy]
  C --> D
  D --> E[Slices: by segment / time]
  E --> F[Hypotheses in data note]`}
        />
        <p className="mt-3 text-slate-300">
          A feature that does not relate to the target might still matter in interactions later — but
          as a beginner priority, target relationships come first. Then prune near-duplicates among
          features.
        </p>
      </LessonSection>

      <LessonSection title="Numeric target — what to look at">
        <ContentStep number={1} title="Scatter + trend intuition">
          <p>
            Plot feature on x, target on y. Ask: upward? downward? flat? curved? a cloud with one
            weird cluster? A single correlation number cannot see a U-shape.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Correlation (linear association)">
          <p>
            Pearson correlation is a number from −1 to 1 for <em>linear</em> co-movement. 0 does not
            mean &ldquo;no relationship&rdquo; — it means &ldquo;no straight-line relationship.&rdquo;
          </p>
        </ContentStep>
        <ContentStep number={3} title="Group means for categories">
          <p>
            For a categorical feature predicting a numeric target: mean / median target per level.
            Huge gaps between cities&rsquo; average prices are a strong hint.
          </p>
        </ContentStep>
        <Callout variant="insight" title="Correlation ≠ causation">
          Ice cream sales and drowning deaths rise together in summer. A third variable (temperature /
          season) drives both. EDA finds association; domain knowledge and experiments argue cause.
        </Callout>
      </LessonSection>

      <LessonSection title="Categorical target — rates and separations">
        <ContentStep number={1} title="Rate by level">
          <p>
            For each category level, compute the positive-class rate. If plan=plus churns at 18% and
            plan=basic at 4%, that feature has signal — confirm with enough sample size per level.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Numeric feature by class">
          <p>
            Box plots or histograms of a numeric feature split by class. Overlap = weak separation;
            cleanly shifted distributions = useful feature for many classifiers.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Tiny levels lie">
          <p>
            A level with 12 rows and 100% churn is almost never a real pattern. Require a minimum
            count before you trust a rate (e.g. n ≥ 50, or use shrinkage later in encoding).
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Feature vs feature — redundancy and leakage cousins">
        <p className="text-slate-300">
          Two features that say the same thing waste capacity and confuse linear models (multicollinearity).
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Numeric vs numeric:</strong> correlation heatmap; drop or combine
            near-clones (radius_cm and diameter_cm).
          </li>
          <li>
            <strong className="text-white">Category vs category:</strong> crosstabs — if city perfectly
            determines region, one of them may be enough.
          </li>
          <li>
            <strong className="text-white">Proxy of the target:</strong> a &ldquo;feature&rdquo; computed from
            the label (or from post-outcome events) is leakage — covered in the next lesson.
          </li>
        </ul>
      </LessonSection>

      <LessonSection title="Slices — when the global plot is a liar">
        <p className="text-slate-300">
          Simpson&rsquo;s paradox style traps: overall, feature X looks useless; inside each city, X is
          strongly predictive. Or overall correlation is positive; within each year it is negative.
        </p>
        <Example title="Slice checklist">
{`1. Split by a major segment (region, plan, device).
2. Split by time (year, month) for drifting worlds.
3. Ask: does the story reverse inside a slice?
4. Write the slice finding in the data note — models may need an interaction or separate models.`}
        </Example>
      </LessonSection>

      <LessonSection title="Effect size and sample size — beginner discipline">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Trap</th>
                <th className="px-4 py-3">What to do</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Huge n, tiny correlation', 'Statistically “significant” but useless — prefer meaningful effect size'],
                ['Tiny n, huge looking gap', 'Do not trust; gather more data or regularise'],
                ['Many features screened', 'Some will look good by luck — hold out a true test set'],
                ['Target leakage in a “feature”', 'If AUC is suspiciously perfect, audit timestamps and definitions'],
              ].map(([trap, fix]) => (
                <tr key={trap}>
                  <td className="px-4 py-3 font-semibold text-white">{trap}</td>
                  <td className="px-4 py-3 text-slate-400">{fix}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Worked problems">
        <ContentStep number={1} title="Problem 1 — Flat correlation, real signal">
          <p>y = (x − 5)² + noise. Pearson corr(x, y) ≈ 0. Is x useless?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>No — the relationship is U-shaped. Scatter would show it; correlation alone would not.</div>
            <div>Trees can split; linear models need x² or other transforms.</div>
          </div>
        </ContentStep>

        <ContentStep number={2} title="Problem 2 — Rate with n=8">
          <p>City &ldquo;Tinyville&rdquo; has 8 customers, 6 churned (75%). City &ldquo;Metro&rdquo; has 8 000, churn 9%. Trust Tinyville?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Do not treat 75% as a reliable rate. Group rare cities into “other” or use smoothed encodings later.</div>
          </div>
        </ContentStep>

        <ContentStep number={3} title="Problem 3 — Redundant features">
          <p>temp_c and temp_f have correlation 1.0. Keep both for a linear model?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>No — perfect multicollinearity. Keep one. Trees can tolerate redundancy better but still waste splits.</div>
          </div>
        </ContentStep>

        <ContentStep number={4} title="Problem 4 — Slice reversal">
          <p>
            Overall, higher discount → higher return rate. Within each product category, higher discount →
            lower return rate. What happened?
          </p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Categories that get deep discounts are also categories with naturally high returns.</div>
            <div>Global plot mixes segments. Model with category + discount (interaction) or stratified analysis.</div>
          </div>
        </ContentStep>

        <ContentStep number={5} title="Problem 5 — Separation">
          <p>
            Histogram of days_since_last_login for churners sits far to the right of active users, little
            overlap. Interpretation for a first model?
          </p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Strong univariate signal — likely a top feature for trees and for logistic regression.</div>
            <div>Still check leakage: is “last login” measured after the churn label window?</div>
          </div>
        </ContentStep>

        <ContentStep number={6} title="Problem 6 — Perfect AUC smell">
          <p>A brand-new feature gives validation AUC 0.99 on a noisy business problem. First reaction?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Suspect leakage or a near-duplicate of the label. Audit how the feature is built and when it is known.</div>
          </div>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Python — target rates and a simple correlation">
        <Example
          title="Churn rate by plan + numeric association"
          output={`churn rate by plan:
plan
basic    0.25
plus     0.50
corr(spend, churn): 0.218`}
        >{`import pandas as pd

df = pd.DataFrame({
    "plan": ["basic", "basic", "plus", "basic", "plus", "plus", "basic", "plus"],
    "spend": [40, 50, 200, 60, 180, 220, 55, 90],
    "churn": [0, 0, 1, 1, 0, 1, 0, 1],
})

print("churn rate by plan:")
print(df.groupby("plan")["churn"].mean().round(2).to_string())
print(f"corr(spend, churn): {df['spend'].corr(df['churn']):.3f}")`}</Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Study feature↔target first, then feature↔feature redundancy, then slices that can reverse the story.',
          'Scatter and group rates beat a single correlation number — correlation only sees straight lines.',
          'For classification, compare positive rates by level and numeric distributions by class; demand enough n per level.',
          'Near-duplicate features confuse linear models; drop or combine them on purpose.',
          'Global associations can lie across segments or time — slice deliberately.',
          'Suspiciously perfect metrics usually mean leakage or a label proxy — investigate before celebrating.',
        ]}
      />
    </LessonArticle>
  )
}
