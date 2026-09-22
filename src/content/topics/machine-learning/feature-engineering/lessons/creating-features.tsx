import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function CreatingFeatures() {
  return (
    <LessonArticle>
      <Definition term="Feature creation">
        <p>
          New columns that make the hypothesis class’s job easier: a ratio the line can use,
          a weekday a tree can split, a lag that is actually known at prediction time. Good
          features are cheaper than a fancier algorithm.
        </p>
      </Definition>

      <LessonSection title="Patterns that keep showing up">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Idea</th>
                <th className="px-4 py-3">Example</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Ratios and rates', 'spend / visits, errors / requests — size-free'],
                ['Interactions', 'x₁x₂ when the effect of A depends on B (poly lesson)'],
                ['Bins / piecewise', 'age bands a linear model can give different slopes via dummies'],
                ['Datetime parts', 'hour, dow, is_holiday, months since signup'],
                ['Lags & rolling', 'mean spend last 7d, known at t, not including t+1'],
                ['Aggregates by entity', 'user’s historical rate — computed from past rows only'],
                ['Text (light)', 'length, has_link, bag-of-words / TF-IDF before a linear SVM'],
              ].map(([idea, ex]) => (
                <tr key={idea}>
                  <td className="px-4 py-3 font-semibold text-white">{idea}</td>
                  <td className="px-4 py-3 text-slate-400">{ex}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip" title="The clock test again">
          A rolling 7-day mean that includes today’s label-day is leakage. Shift(1) so every
          aggregate uses strictly earlier rows. Group aggregates (mean target by city) are
          target encoding — use the OOF rule.
        </Callout>
      </LessonSection>

      <LessonSection title="When not to invent columns">
        <p className="text-slate-300">
          Random crosses of 40 categoricals will overfit and explode dimension. Create features
          that EDA or domain knowledge already hinted (“the U in residual vs age”, “weekends
          spike”). Then let model selection decide if they stay.
        </p>
      </LessonSection>

      <LessonSection title="Worked problems">
        <ContentStep number={1} title="Problem 1 — Ratio">
          <p>You have spend and n_orders. Why spend_per_order for a linear churn model?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>A line cannot invent a quotient. High spend from one huge order vs many small ones is a different story.</div>
          </div>
        </ContentStep>
        <ContentStep number={2} title="Problem 2 — Datetime">
          <p>A timestamp ts. Which parts are usually safe at inference?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>hour, dow, month, is_weekend — functions of ts. Not “days until event_end” if event_end is after the label.</div>
          </div>
        </ContentStep>
        <ContentStep number={3} title="Problem 3 — Leakage lag">
          <p>target = sales[t]. Feature = mean(sales[t-6 : t]). Inclusive of t?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>If the window includes t, you leaked today’s sales. Use [t-7 : t-1].</div>
          </div>
        </ContentStep>
        <ContentStep number={4} title="Problem 4 — Interaction">
          <p>Discount only works for carts &gt; ₹2 000. What feature helps a linear model?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>discount × 1[cart &gt; 2000], or discount × cart. A tree can learn the split unaided.</div>
          </div>
        </ContentStep>
        <ContentStep number={5} title="Problem 5 — User history (ML flavour)">
          <p>user_churn_rate_so_far including the current month’s label. Legal?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>No. History must stop before the label month. First month of a user gets a global prior, not NaN magic.</div>
          </div>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Python — a safe lag and a ratio">
        <Example
          title="shift(1) then rolling — no today’s y"
          output={`   day  sales  lag1  roll3_past  spend_per_order
0    1     10   NaN         NaN              5.0
1    2     12  10.0        10.0              4.0
2    3      9  12.0        11.0              9.0`}
        >{`import pandas as pd

df = pd.DataFrame({
    "day": [1, 2, 3],
    "sales": [10, 12, 9],
    "spend": [20, 16, 18],
    "orders": [4, 4, 2],
})
df["lag1"] = df.sales.shift(1)
df["roll3_past"] = df.sales.shift(1).rolling(2, min_periods=1).mean()
df["spend_per_order"] = df.spend / df.orders
print(df[["day", "sales", "lag1", "roll3_past", "spend_per_order"]].to_string())`}</Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Create features that your hypothesis class cannot invent: ratios, interactions, calendar parts, strictly-past lags.',
          'Every aggregate and lag must pass the clock test — only information known before the label.',
          'User-level history is gold and also a leakage magnet. Compute it from earlier rows; smooth the cold start toward a global prior.',
          'Trees invent some interactions via splits. Linear models need you to write the product or the bin.',
          'Do not brute-force every cross of 40 categoricals. Start from EDA hints and domain rules, then let selection drop the rest.',
        ]}
      />
    </LessonArticle>
  )
}
