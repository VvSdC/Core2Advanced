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

export function CreatingFeatures() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Invent columns that a human would invent">
        Good features are often ratios, flags, time pieces, and &ldquo;what happened before for this
        entity?&rdquo; Bad features are post-outcome facts and future information. The clock test
        from EDA still rules.
      </Callout>

      <Definition term="Feature creation">
        <p>
          Deriving new columns from existing ones — arithmetic, interactions, datetime parts,
          aggregations — such that every value would be knowable at prediction time{' '}
          <strong className="text-white">T</strong>.
        </p>
      </Definition>

      <LessonSection title="Patterns that keep paying rent">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Pattern</th>
                <th className="px-4 py-3">Example</th>
                <th className="px-4 py-3">Watch</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Ratios / rates', 'loan_amt / income', 'Divide-by-zero → define ε or flag'],
                ['Differences', 'price − competitor_price', 'Units must match'],
                ['Interactions', 'promo × weekend', 'Can explode; start few'],
                ['Bins', 'age decades', 'Edges fit on train; trees may not need bins'],
                ['Datetime parts', 'hour, dow, month', 'Cyclical: sin/cos for hour/month'],
                ['Flags', 'is_mobile, has_avatar', 'From EDA spikes / structural zeros'],
                ['Lags', 'sales yesterday', 'Strictly past; align grain'],
                ['Entity history', 'user 30d spend', 'groupby + shift; no same-row leak'],
                ['Text light', 'len, has_url, digit_ratio', 'Before full NLP'],
              ].map(([p, ex, w]) => (
                <tr key={p}>
                  <td className="px-4 py-3 font-semibold text-white">{p}</td>
                  <td className="px-4 py-3 text-slate-400">{ex}</td>
                  <td className="px-4 py-3 text-slate-400">{w}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Flowchart
          title="Create only if leak-free"
          chart={`flowchart TD
  A[Candidate feature] --> B{Known at time T?}
  B -->|No| C[Reject — leakage]
  B -->|Yes| D{Adds signal beyond raw cols?}
  D -->|No| E[Skip — noise]
  D -->|Yes| F[Add + document in FE note]`}
        />
      </LessonSection>

      <LessonSection title="Datetime — parts and cycles">
        <ContentStep number={1} title="Calendar parts">
          <p>hour, day_of_week, month, is_weekend, is_month_start. Great for demand and traffic.</p>
        </ContentStep>
        <ContentStep number={2} title="Cyclical encoding">
          <p>
            Hour 23 and hour 0 are neighbors. Use{' '}
            <code className="text-slate-200">sin(2π h/24)</code>,{' '}
            <code className="text-slate-200">cos(2π h/24)</code> for linear models. Trees can split on
            raw hour if you also allow both ends.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Time since">
          <p>
            days_since_signup at scoring time T — compute from signup_at and T, never from a future
            event.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Lags and rolling history — the advanced core">
        <p className="text-slate-300">
          For each entity (store, user, SKU), features at time t may use only rows with time &lt; t
          (or ≤ t − horizon).
        </p>
        <Example title="Safe lag pattern">
{`# per store-sku, sorted by date
df["units_lag_1"] = df.groupby(["store","sku"])["units_sold"].shift(1)
df["units_roll7"] = (
    df.groupby(["store","sku"])["units_sold"]
      .transform(lambda s: s.shift(1).rolling(7).mean())
)
# shift(1) before rolling → no same-day leak`}
        </Example>
        <Callout variant="insight" title="The clock test again">
          If a feature uses information from after the label window — or from the label itself —
          delete it. &ldquo;Visits in the next 30 days&rdquo; is not a feature for a 30-day outcome.
        </Callout>
      </LessonSection>

      <LessonSection title="When not to invent">
        <ul className="list-disc space-y-1 pl-5 text-slate-300">
          <li>Hundreds of random polynomial terms — you will overfit and confuse selection.</li>
          <li>Encoding user_id as a raw number — memorisation, not generalisation.</li>
          <li>Anything EDA marked as leakage, even if it boosts offline AUC.</li>
          <li>Features you cannot compute in the live system (batch-only joins missing in API).</li>
        </ul>
        <Callout variant="tip" title="Train/serve parity">
          Every feature must be producible online or in the same batch job with the same definition.
          Notebook-only joins that never ship are a silent offline win.
        </Callout>
      </LessonSection>

      <LessonSection title="Worked problems">
        <ContentStep number={1} title="Problem 1 — Ratio">
          <p>loan_amt=0 rare rows. How do you build loan_to_income?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>loan_amt / (income + ε) or set null + flag when income missing/0. Document ε.</div>
          </div>
        </ContentStep>
        <ContentStep number={2} title="Problem 2 — Lag leak">
          <p>units_roll7 = rolling(7).mean() without shift. Predicting today&rsquo;s units. Bug?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Yes — today’s units enter the feature. Use shift(1) then rolling.</div>
          </div>
        </ContentStep>
        <ContentStep number={3} title="Problem 3 — Cyclical">
          <p>Why might raw month=12 and month=1 confuse a linear model?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>They look far apart (12 vs 1) but are adjacent in the year. sin/cos fixes that.</div>
          </div>
        </ContentStep>
        <ContentStep number={4} title="Problem 4 — Interaction">
          <p>discount helps only for category=electronics. FE move?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Create discount × is_electronics (or let a tree find the interaction).</div>
          </div>
        </ContentStep>
        <ContentStep number={5} title="Problem 5 — History window">
          <p>Predict churn next month. Feature: average spend including this month&rsquo;s spend when the label uses this month. OK?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Only if that spend is known before the churn decision boundary. Prefer strictly past months.</div>
          </div>
        </ContentStep>
        <ContentStep number={6} title="Problem 6 — Text light">
          <p>Ticket body available at open time. First FE before NLP?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>length, word_count, has_url, has_digits, language flag — cheap and often strong.</div>
          </div>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Python — ratio + safe lag">
        <Example
          title="loan_to_income and units_lag_1"
          output={`ratios: [0.4, 0.5, nan]
lags: [nan, 10.0, 12.0]`}
        >{`import numpy as np
import pandas as pd

loans = pd.DataFrame({
    "loan_amt": [200_000, 150_000, 100_000],
    "income": [500_000, 300_000, 0.0],
})
eps = 1.0
loans["lti"] = loans["loan_amt"] / (loans["income"] + eps)
loans.loc[loans["income"] <= 0, "lti"] = np.nan
print("ratios:", loans["lti"].round(2).tolist())

sales = pd.DataFrame({
    "store": ["S1", "S1", "S1"],
    "date": pd.to_datetime(["2024-03-01", "2024-03-02", "2024-03-03"]),
    "units": [10, 12, 9],
})
sales["units_lag_1"] = sales.groupby("store")["units"].shift(1)
print("lags:", sales["units_lag_1"].tolist())`}</Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Create ratios, flags, datetime parts, interactions, and entity history that pass the clock test.',
          'Lags and rolling stats must shift so the label row’s own target never enters the feature.',
          'Cyclical sin/cos helps linear models on hour/month; trees can use raw parts.',
          'Light text features are valid FE before heavy NLP.',
          'Reject leakage, ID memorisation, and features you cannot compute in production.',
          'Document each new column in the FE note — definition, time availability, and train/serve source.',
        ]}
      />
    </LessonArticle>
  )
}
