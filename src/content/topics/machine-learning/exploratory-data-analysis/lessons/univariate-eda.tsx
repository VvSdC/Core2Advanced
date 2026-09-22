import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function UnivariateEda() {
  return (
    <LessonArticle>
      <Definition term="Univariate EDA">
        <p>
          One column at a time: type, range, missingness, shape, and whether the values are
          even legal. You do this before crossing a feature with the target so you do not
          confuse “age is coded as 999” with “age predicts churn.”
        </p>
      </Definition>

      <LessonSection title="Type is a modelling decision">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Looks like</th>
                <th className="px-4 py-3">Treat as</th>
                <th className="px-4 py-3">Watch for</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Continuous number (price, age)', 'Numeric', 'Skew, units, sentinels (−1, 999)'],
                ['Small set of names (city, plan)', 'Categorical', 'Rare levels, typos, case'],
                ['Ordered labels (S / M / L)', 'Ordinal', 'Do not one-hot if the order matters'],
                ['High-cardinality ID (user_id, zip)', 'ID / drop / group', 'Not a feature unless you aggregate it'],
                ['Timestamp', 'Datetime → parts / lags', 'Timezone, future values'],
                ['Free text', 'Text → later FE', 'Language mix, empty strings'],
              ].map(([looks, treat, watch]) => (
                <tr key={looks}>
                  <td className="px-4 py-3 font-semibold text-white">{looks}</td>
                  <td className="px-4 py-3 text-slate-400">{treat}</td>
                  <td className="px-4 py-3 text-slate-400">{watch}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Shape: centre, spread, tail, holes">
        <p className="text-slate-300">
          For a numeric column report count, missing %, min / median / max, and a histogram or
          a few quantiles (1%, 99%). Skew (long right tail of income) is why the next chapter
          will log-transform. A spike at 0 plus a smooth tail is often “structural zero” (never
          bought) plus “amount if they did” — two features, not one.
        </p>
        <Callout variant="tip" title="Outlier vs error">
          A 140-year-old customer is an error. A ₹2 crore house in a luxury zip is a real tail.
          EDA’s job is to flag; feature engineering’s job is to decide (clip, log, separate
          model, keep). Do not delete tails just because they make a scatter ugly.
        </Callout>
      </LessonSection>

      <LessonSection title="Missingness is a pattern">
        <p className="text-slate-300">
          Missing at random (a sensor blip) vs missing because the event never happened
          (no prior purchase) vs missing because someone hid the value (high earners skip
          income). Plot missing % and, when two columns vanish together, write it down —
          that is often a process, not a hole.
        </p>
      </LessonSection>

      <LessonSection title="Worked problems">
        <ContentStep number={1} title="Problem 1 — Cardinality">
          <p>m = 10 000. city has 9 levels, zip has 8 400, user_id has 10 000. Feature, ID, or group?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>city: categorical feature. zip: high-cardinality — group rare zips or target-encode carefully.</div>
            <div>user_id: identifier. Never one-hot it. Use it only as a group key for the split.</div>
          </div>
        </ContentStep>
        <ContentStep number={2} title="Problem 2 — Sentinel">
          <p>age: min −1, median 34, max 120, 4% equal to −1. What is −1?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>A missing-value code, not a toddler. Recode to NaN before any mean or model.</div>
            <div>If you leave −1, the mean is pulled and trees grow a fake “age &lt; 0” split.</div>
          </div>
        </ContentStep>
        <ContentStep number={3} title="Problem 3 — Structural zero">
          <p>orders_90d is 0 for 70% of users; the rest is a smooth 1–40. One numeric feature?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Better as two: has_order_90d (0/1) and log1p(orders) among buyers — or keep 0 and let a tree split it.</div>
            <div>Linear models hate that spike; trees tolerate it.</div>
          </div>
        </ContentStep>
        <ContentStep number={4} title="Problem 4 — Illegal values">
          <p>probability_click column has values 1.07 and −0.02. Action?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Data bug. Clip only after you know the producer will keep sending garbage; otherwise fix the pipeline.</div>
            <div>Do not silently train on impossible probabilities.</div>
          </div>
        </ContentStep>
        <ContentStep number={5} title="Problem 5 — Rare category (ML flavour)">
          <p>device has 12 000 “ios”, 7 000 “android”, 14 “blackberry”. What do you write in the data note?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Collapse rare levels to “other” in FE (fit the list on train). A one-hot of 14 rows is noise.</div>
          </div>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Python — profile one frame">
        <Example
          title="Sentinels, missing, cardinality"
          output={`age −1 count: 1
nunique: {'city': 3, 'zip': 4, 'user_id': 4}
age without sentinel: mean 32.7`}
        >{`import numpy as np
import pandas as pd

df = pd.DataFrame({
    "user_id": [1, 2, 3, 4],
    "age": [22, -1, 41, 35],
    "city": ["HYD", "BLR", "HYD", "DEL"],
    "zip": ["500081", "560001", "500081", "110001"],
})
print("age −1 count:", int((df.age == -1).sum()))
print("nunique:", df[["city", "zip", "user_id"]].nunique().to_dict())
age = df.age.replace(-1, np.nan)
print(f"age without sentinel: mean {age.mean():.1f}")`}</Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Univariate EDA: type, legality, missingness, shape, cardinality. Do this before you plot vs the target.',
          'IDs are keys for splits, not features. High-cardinality categoricals need a grouping or a careful encoder, not a raw one-hot.',
          'Sentinels (−1, 999) are missing values in costume. Recode them before any statistic.',
          'A spike at zero plus a tail is often two phenomena. Linear models want that spelled out; trees can split it.',
          'Flag outliers as error vs real tail. Deleting the tail to beautify a histogram is not analysis.',
        ]}
      />
    </LessonArticle>
  )
}
