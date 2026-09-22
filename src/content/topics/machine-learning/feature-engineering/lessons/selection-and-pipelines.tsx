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

export function SelectionAndPipelines() {
  return (
    <LessonArticle>
      <Definition term="Selection and pipelines">
        <p>
          After you invent columns, you still have to <strong className="text-white">choose
          and apply</strong> them the same way in CV and in production. Feature selection
          picks a subset. A pipeline is the object that fits every step on train and
          transforms val / test / live rows with those fitted pieces.
        </p>
      </Definition>

      <LessonSection title="Three families of selection">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Family</th>
                <th className="px-4 py-3">How</th>
                <th className="px-4 py-3">Catch</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Filter', 'Score each column vs y (corr, MI, χ²) and keep the top k', 'Ignores interactions; cheap'],
                ['Wrapper', 'Add/drop columns by CV score (RFE, forward select)', 'Expensive; overfits the CV if you search too hard'],
                ['Embedded', 'The model zeros weights (Lasso) or ranks splits (trees)', 'Tied to that model family'],
              ].map(([f, how, c]) => (
                <tr key={f}>
                  <td className="px-4 py-3 font-semibold text-white">{f}</td>
                  <td className="px-4 py-3 text-slate-400">{how}</td>
                  <td className="px-4 py-3 text-slate-400">{c}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="insight" title="SelectKBest on all rows is leakage">
          Ranking features with y on the full dataset, then CV, lets every fold see which
          columns won using the val labels. Put selection inside the pipeline so each fold
          ranks on its own train piece.
        </Callout>
      </LessonSection>

      <LessonSection title="The pipeline is the model">
        <Flowchart
          title="What gets fit on a train fold"
          chart={`flowchart LR
  A[Impute] --> B[Encode]
  B --> C[Scale]
  C --> D[Select]
  D --> E[Estimator]`}
        />
        <p className="mt-3 text-slate-300">
          sklearn’s <code className="text-slate-200">Pipeline</code> +{' '}
          <code className="text-slate-200">ColumnTransformer</code> (numeric vs categorical
          branches) is how you stop applying the test-set median by accident. At serve time
          you load the same fitted pipeline — not a notebook you re-run by hand.
        </p>
      </LessonSection>

      <LessonSection title="Worked problems">
        <ContentStep number={1} title="Problem 1 — Filter vs the U">
          <p>You keep the top 5 Pearson columns. age vs cost is a U, |ρ| ≈ 0. Drop age?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Filter just dropped the real signal. Use MI, or a plot, or a wrapper with a model that can bend.</div>
          </div>
        </ContentStep>
        <ContentStep number={2} title="Problem 2 — Select then CV">
          <p>You SelectKBest(X, y) on all 10 000 rows, then 5-fold a logistic. Honest?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>No. Selection saw every label. Nested: select inside each train fold.</div>
          </div>
        </ContentStep>
        <ContentStep number={3} title="Problem 3 — Two branches">
          <p>age needs a median + scaler; city needs “other” + one-hot. One StandardScaler on the whole frame?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>No — you would scale dummy 0/1 as if they were z-scores of age. ColumnTransformer: numeric vs categorical pipes.</div>
          </div>
        </ContentStep>
        <ContentStep number={4} title="Problem 4 — Production">
          <p>You ship a pickle of the logistic θ only. New city appears. What fails?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>The dummy columns will not line up. Ship the fitted pipeline (encoder vocab + scaler + model).</div>
          </div>
        </ContentStep>
        <ContentStep number={5} title="Problem 5 — Lasso as selection (ML flavour)">
          <p>Lasso zeros 40 of 60 columns on train. You drop them, then refit Ridge on the same train. Extra cheat?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Mild: the kept set was chosen with those labels. Prefer Lasso-inside-CV, or accept Lasso as the final model.</div>
          </div>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Python — a pipeline-shaped sketch">
        <Example
          title="Numeric median+scale and a one-hot, fit on train"
          output={`train X shape (3, 4)
test  X shape (2, 4)
columns aligned: True`}
        >{`import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler

train = pd.DataFrame({"age": [22, None, 41], "city": ["HYD", "BLR", "HYD"]})
test = pd.DataFrame({"age": [35, None], "city": ["PUNE", "HYD"]})

pipe = ColumnTransformer([
    ("num", Pipeline([
        ("imp", SimpleImputer(strategy="median")),
        ("sc", StandardScaler()),
    ]), ["age"]),
    ("cat", OneHotEncoder(handle_unknown="ignore"), ["city"]),
])
Xtr = pipe.fit_transform(train)
Xte = pipe.transform(test)
print("train X shape", Xtr.shape)
print("test  X shape", Xte.shape)
print("columns aligned:", Xtr.shape[1] == Xte.shape[1])`}</Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Filter, wrapper, embedded: cheap scores vs CV search vs “the model zeros it.” Filters miss U-shapes; wrappers can overfit the search.',
          'Any selection that uses y must live inside each CV train fold — never SelectKBest on the whole table first.',
          'A pipeline (impute → encode → scale → select → model) is what you fit, pickle, and serve. θ alone is not deployable.',
          'ColumnTransformer keeps numeric and categorical branches from scaling each other’s dummies.',
          'You are now allowed to open the regression chapter: the table has a grain, a split, and a reproducible transform path.',
        ]}
      />
    </LessonArticle>
  )
}
