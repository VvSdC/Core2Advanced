import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function EncodingCategoricals() {
  return (
    <LessonArticle>
      <Definition term="Encoding">
        <p>
          Models want numbers. A categorical column becomes numbers without pretending the
          codes are a ruler — unless they really are ordered.
        </p>
      </Definition>

      <LessonSection title="The menu">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Encoder</th>
                <th className="px-4 py-3">Does</th>
                <th className="px-4 py-3">Use when</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['One-hot (dummy)', 'One 0/1 column per level (drop one for linear)', 'Low cardinality, linear models'],
                ['Ordinal', 'S < M < L → 0, 1, 2', 'True order; trees also accept it as a split'],
                ['Count / frequency', 'Replace level by train frequency', 'High cardinality, a cheap signal'],
                ['Target / mean encode', 'Replace level by mean y (smoothed, CV-safe)', 'Many levels; leakage if done naively'],
                ['Hashing', 'Hash into a fixed D bins', 'Huge / streaming vocabularies'],
              ].map(([name, does, when]) => (
                <tr key={name}>
                  <td className="px-4 py-3 font-semibold text-white">{name}</td>
                  <td className="px-4 py-3 text-slate-400">{does}</td>
                  <td className="px-4 py-3 text-slate-400">{when}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip" title="Unseen levels">
          A city that appears only in test must map to “other” or a zero dummy row — not crash.
          Fit the level list on train; everything else is unknown.
        </Callout>
      </LessonSection>

      <LessonSection title="Target encoding without leaking">
        <p className="text-slate-300">
          Naive mean(y | city) uses each row’s own label in that city’s average, then the model
          sees a feature that already peeked at y. Fixes: out-of-fold means (encode each fold
          from the other folds), plus smoothing toward the global mean so a city with 2 rows
          does not get 1.0 or 0.0.
        </p>
        <div className="mt-3 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>smoothed = (n · mean_city + m · mean_global) / (n + m)</div>
          <div>m is a prior strength (e.g. 10–50). Small n → pulled to the global rate.</div>
        </div>
      </LessonSection>

      <LessonSection title="Worked problems">
        <ContentStep number={1} title="Problem 1 — Dummy trap">
          <p>gender = {'{M, F}'} plus intercept, both dummies kept. What breaks in OLS?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>M + F = 1 = intercept column. Drop one level (regression lesson). Trees do not care.</div>
          </div>
        </ContentStep>
        <ContentStep number={2} title="Problem 2 — Rare level">
          <p>Train: HYD 8 000, BLR 1 900, GOA 4. One-hot GOA?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Collapse GOA → other (min_frequency on train). A 4-row dummy is a lottery ticket.</div>
          </div>
        </ContentStep>
        <ContentStep number={3} title="Problem 3 — Naive target encode">
          <p>A city with 1 row, y = 1. Naive mean encode = 1. What does the model learn?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>That feature equals the label for that row. Train metrics go to the moon. Use OOF + smoothing.</div>
          </div>
        </ContentStep>
        <ContentStep number={4} title="Problem 4 — Ordinal abuse">
          <p>You code Red=1, Blue=2, Green=3 for a linear model. What did you claim?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>That Green − Blue = Blue − Red. False. One-hot (or a tree).</div>
          </div>
        </ContentStep>
        <ContentStep number={5} title="Problem 5 — New city in production">
          <p>Serving sees city = “PUNE”, never in train. What should the encoder emit?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>The “other” / unknown bucket, or all-zero dummies — a declared default, not an exception.</div>
          </div>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Python — one-hot with an unknown bucket">
        <Example
          title="Train levels + other"
          output={`train cols ['city_BLR', 'city_HYD', 'city_other']
test row PUNE → [0, 0, 1]`}
        >{`import pandas as pd

train = pd.Series(["HYD", "HYD", "BLR", "HYD"])
test = pd.Series(["PUNE", "HYD"])
keep = train.value_counts()[lambda s: s >= 2].index  # HYD, BLR
tr = train.where(train.isin(keep), "other")
te = test.where(test.isin(keep), "other")
cols = pd.get_dummies(tr, prefix="city").columns
Xte = pd.get_dummies(te, prefix="city").reindex(columns=cols, fill_value=0)
print("train cols", list(cols))
print("test row PUNE →", Xte.iloc[0].to_list())`}</Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Low-cardinality unordered → one-hot (drop a level for linear). Ordered → ordinal. High-cardinality → frequency, smoothed target, or hashing.',
          'Fit the vocabulary on train. Unseen levels become “other” / zeros at serve time.',
          'Naive target encoding leaks the label. Use out-of-fold means and smooth small counts toward the global mean.',
          'Do not invent an order (Red=1, Blue=2) for a linear model. Trees can split integer codes, but the order still shapes the splits.',
          'Rare levels are noise. Collapse them before you dummy-encode.',
        ]}
      />
    </LessonArticle>
  )
}
