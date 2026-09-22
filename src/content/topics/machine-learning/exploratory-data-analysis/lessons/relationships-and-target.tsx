import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function RelationshipsAndTarget() {
  return (
    <LessonArticle>
      <Definition term="Bivariate EDA">
        <p>
          Now cross each promising feature with the <strong className="text-white">target</strong>,
          and features with each other. You are looking for signal, for the wrong shape (a U
          that a line will miss), and for twins (two columns that say the same thing).
        </p>
      </Definition>

      <LessonSection title="Feature vs target — match the types">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Feature \ target</th>
                <th className="px-4 py-3">Numeric y</th>
                <th className="px-4 py-3">Class y</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Numeric x', 'Scatter, residual-vs-x later, correlation / MI', 'Box / density per class, or x binned vs rate'],
                ['Categorical x', 'Mean y per level + count', 'Rate table (crosstab, stacked bars)'],
              ].map(([f, num, cls]) => (
                <tr key={f}>
                  <td className="px-4 py-3 font-semibold text-white">{f}</td>
                  <td className="px-4 py-3 text-slate-400">{num}</td>
                  <td className="px-4 py-3 text-slate-400">{cls}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="insight" title="Correlation is linear; MI is not">
          From the information-theory lessons: ρ ≈ 0 can still hide y = x². If the scatter is a
          U, write “needs a transform or a tree,” not “no relationship.” Mutual information
          catches that; Pearson does not.
        </Callout>
      </LessonSection>

      <LessonSection title="Feature vs feature — twins and confounders">
        <p className="text-slate-300">
          Two size columns (sqft and sqm) are twins — multicollinearity for linear models,
          split importance for trees. Education and income both predict wage; that is a
          confounder story, not a reason to drop one during EDA. Note it. FE and the model
          family decide what to keep.
        </p>
      </LessonSection>

      <LessonSection title="Class imbalance is an EDA finding">
        <p className="text-slate-300">
          If 1.2% of rows are fraud, that is a fact you write down now. You do not SMOTE yet
          — you have not even picked a classifier. You <em>do</em> decide that accuracy is the
          wrong headline metric (classification-metrics lesson) and that the split must be
          stratified.
        </p>
      </LessonSection>

      <LessonSection title="Worked problems">
        <ContentStep number={1} title="Problem 1 — Read a rate table">
          <p>Churn: plan A 8% of 5 000, plan B 9% of 4 800, plan C 40% of 200. Is C a gold feature?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Maybe — 40% vs 8% is huge, but n = 200 is noisy. Keep it, collapse if C shrinks further, do not bet the model on 80 events.</div>
          </div>
        </ContentStep>
        <ContentStep number={2} title="Problem 2 — ρ = 0">
          <p>age vs cost: Pearson ≈ 0. Scatter is a U (kids and seniors cost more). Next?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Do not drop age. Add age², bin age, or use a tree. The relationship is real and non-linear.</div>
          </div>
        </ContentStep>
        <ContentStep number={3} title="Problem 3 — Twins">
          <p>temp_c and temp_f have ρ = 1. Both stay in a random forest?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>They split importance. Drop one. Linear models: XᵀX is singular-ish. EDA should have caught the clone.</div>
          </div>
        </ContentStep>
        <ContentStep number={4} title="Problem 4 — Simpson">
          <p>Overall, more study hours → lower pass rate. Per course, the opposite. What did the aggregate hide?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Confounding by course difficulty. Stratify the plot. A single ρ is a lie.</div>
          </div>
        </ContentStep>
        <ContentStep number={5} title="Problem 5 — Imbalance note">
          <p>y = 1 in 120 of 10 000 rows. What belongs in the data note, not yet in FE?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Rate 1.2%. Stratified split. Metric: PR / recall at a cost threshold, not accuracy.</div>
            <div>Class weights or resampling wait until a classifier exists.</div>
          </div>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Python — rate table and a fake U">
        <Example
          title="Churn by plan, and a U that Pearson misses"
          output={`churn by plan: {'A': 0.08, 'B': 0.09, 'C': 0.40}
Pearson(age, cost) ≈ 0.00  (U-shape, not 'no signal')`}
        >{`import numpy as np
import pandas as pd

df = pd.DataFrame({
    "plan": ["A"] * 50 + ["B"] * 48 + ["C"] * 20,
    "churn": [1] * 4 + [0] * 46 + [1] * 4 + [0] * 44 + [1] * 8 + [0] * 12,
})
print("churn by plan:", df.groupby("plan").churn.mean().round(2).to_dict())

age = np.linspace(10, 80, 80)
cost = (age - 45) ** 2 + np.random.default_rng(0).normal(0, 40, size=80)
print(f"Pearson(age, cost) ≈ {np.corrcoef(age, cost)[0, 1]:.2f}  (U-shape, not 'no signal')")`}</Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Cross each feature with the target using a plot or table that matches the types. That is how you choose a line vs a curve vs a tree.',
          'Pearson ρ only sees straight lines. A U-shape is a feature-engineering or algorithm clue, not “drop this column.”',
          'Twins (ρ ≈ 1) hurt linear models and split tree importance. Confounders are a story to stratify, not a delete key.',
          'Rare levels can look like gold features. Always pair a rate with a count.',
          'Imbalance is discovered here and written into the data note. The fix (weights, threshold, PR-AUC) lives with classification and model selection.',
        ]}
      />
    </LessonArticle>
  )
}
