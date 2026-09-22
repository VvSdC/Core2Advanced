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
      <Callout variant="beginner" title="Too many columns → pick; then glue every step">
        Selection drops or down-weights useless features. A pipeline is the single object that
        remembers every FE step you fitted — so validation and production cannot drift from training.
      </Callout>

      <Definition term="Feature selection">
        <p>
          Choosing a subset (or weighted set) of features to feed the model — to fight noise,
          multicollinearity, cost, and overfitting —{' '}
          <strong className="text-white">nested inside cross-validation</strong> so the choice does
          not peek at the test fold.
        </p>
      </Definition>

      <Definition term="Pipeline">
        <p>
          An ordered chain: transforms → (optional selection) → estimator.{" "}
          <code className="text-slate-200">fit</code> on train learns all parameters;{" "}
          <code className="text-slate-200">predict</code> / <code className="text-slate-200">transform</code>{" "}
          applies the frozen recipe.
        </p>
      </Definition>

      <LessonSection title="Three families of selection">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Family</th>
                <th className="px-4 py-3">Idea</th>
                <th className="px-4 py-3">Examples</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Filter', 'Score features without the final model', 'Variance threshold, corr with y, mutual information, χ²'],
                ['Wrapper', 'Search subsets with model scores', 'Recursive feature elimination (RFE), forward select'],
                ['Embedded', 'Model picks while training', 'L1 (lasso), tree importances, Elastic Net'],
              ].map(([f, idea, ex]) => (
                <tr key={f}>
                  <td className="px-4 py-3 font-semibold text-white">{f}</td>
                  <td className="px-4 py-3 text-slate-400">{idea}</td>
                  <td className="px-4 py-3 text-slate-400">{ex}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="insight" title="SelectKBest on all rows is leakage">
          If you rank features using the full dataset (including test) then train, you peeked.
          Put selection inside the CV pipeline so each fold refits the ranking on its train piece only.
        </Callout>
      </LessonSection>

      <LessonSection title="Practical selection hygiene">
        <ContentStep number={1} title="Drop obvious junk first">
          <p>Constants, duplicate columns, pure IDs, leakage columns from the data note.</p>
        </ContentStep>
        <ContentStep number={2} title="Correlation twins">
          <p>
            If two numerics correlate at 0.99, keep one (domain pick) before trusting L1 to break the
            tie randomly.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Importance ≠ causality">
          <p>
            Tree importance and permutation importance are useful ranking tools — still validate on
            a holdout. Permutation importance is usually more trustworthy than impurity importance.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Cost-aware selection">
          <p>
            Prefer a slightly weaker feature that is free at serve time over a strong one that needs
            a 30-minute batch join you do not have in the API.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Pipelines — the deployable FE object">
        <Flowchart
          title="A typical sklearn-style pipeline"
          chart={`flowchart LR
  A[Raw columns] --> B[ColumnTransformer]
  B --> C[impute / scale / one-hot]
  C --> D[Optional SelectKBest]
  D --> E[Estimator]
  E --> F[predict]`}
        />
        <p className="mt-3 text-slate-300">
          <code className="text-slate-200">ColumnTransformer</code> applies different recipes to
          numeric vs categorical columns. The whole Pipeline is what you{" "}
          <code className="text-slate-200">joblib.dump</code> and load in the API.
        </p>
        <Callout variant="tip" title="Why not a notebook of cells?">
          Cell 3&rsquo;s median and cell 7&rsquo;s encoder drift from the Flask service&rsquo;s copy-paste.
          One fitted pipeline eliminates train/serve skew from forgotten steps.
        </Callout>
      </LessonSection>

      <LessonSection title="Advanced — nesting and custom steps">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">CV nests everything:</strong> impute + encode + select +
            model hyperparameters refit per fold.
          </li>
          <li>
            <strong className="text-white">Custom transformers:</strong> wrap domain logic (sentinel
            cleanup, ratio features) in a class with fit/transform so it joins the pipeline.
          </li>
          <li>
            <strong className="text-white">FeatureUnion:</strong> run parallel branches (e.g. text TF-IDF
            + numeric pipe) and concatenate.
          </li>
        </ul>
      </LessonSection>

      <LessonSection title="Worked problems">
        <ContentStep number={1} title="Problem 1 — Variance threshold">
          <p>A column is 1 for every train row. Keep it?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Drop — zero variance, no signal. Watch production if a new value appears later.</div>
          </div>
        </ContentStep>
        <ContentStep number={2} title="Problem 2 — Nested selection">
          <p>You run SelectKBest on all of X_train_full, pick 20 cols, then do CV only for the model. Honest?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Optimistic. Selection saw all training labels. Put SelectKBest inside each CV fold.</div>
          </div>
        </ContentStep>
        <ContentStep number={3} title="Problem 3 — What to pickle">
          <p>API receives raw city strings. Do you pickle the logistic regression alone?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>No — pickle the full Pipeline (encoder + scaler + model) so raw rows transform correctly.</div>
          </div>
        </ContentStep>
        <ContentStep number={4} title="Problem 4 — L1">
          <p>Lasso zeros 40 of 50 coefficients. Is selection “done”?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Embedded selection happened — still check stability across folds and domain sense of survivors.</div>
          </div>
        </ContentStep>
        <ContentStep number={5} title="Problem 5 — Twin columns">
          <p>temp_c and temp_f both present. Selection keeps both with tiny coeffs. Better FE?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Drop one deliberately before modelling.</div>
          </div>
        </ContentStep>
        <ContentStep number={6} title="Problem 6 — Serve-time cost">
          <p>Permutation importance loves a feature that needs a 2-hour warehouse query. Ship it?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Only if latency/cost allows. Otherwise prefer a weaker real-time proxy — document the tradeoff.</div>
          </div>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Python — ColumnTransformer + Pipeline sketch">
        <Example
          title="Numeric impute+scale; categorical one-hot; logistic"
          output={`pipeline steps: prep → clf
CV would wrap this whole pipe`}
        >{`from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler

num = ["age", "spend"]
cat = ["plan"]

prep = ColumnTransformer([
    ("num", Pipeline([
        ("imp", SimpleImputer(strategy="median")),
        ("sc", StandardScaler()),
    ]), num),
    ("cat", Pipeline([
        ("imp", SimpleImputer(strategy="most_frequent")),
        ("oh", OneHotEncoder(handle_unknown="ignore")),
    ]), cat),
])

pipe = Pipeline([
    ("prep", prep),
    ("clf", LogisticRegression(max_iter=1000)),
])
# pipe.fit(X_train, y_train); pipe.predict(X_test)
print("pipeline steps:", [n for n, _ in pipe.steps])`}</Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Filter / wrapper / embedded selection all help — nest them inside CV to avoid peeking.',
          'Drop constants, IDs, leakage, and obvious twins before fancy search.',
          'Permutation importance beats naive impurity ranks for “what mattered”.',
          'A Pipeline + ColumnTransformer is the unit you deploy — not a bare estimator.',
          'Custom domain transforms belong in fit/transform classes inside the pipe.',
          'Select for predictive value and for serve-time cost / availability.',
        ]}
      />
    </LessonArticle>
  )
}
