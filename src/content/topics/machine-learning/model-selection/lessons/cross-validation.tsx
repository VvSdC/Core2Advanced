import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function CrossValidation() {
  return (
    <LessonArticle>
      <Definition term="Cross-validation">
        <p>
          A protocol for estimating generalisation when you cannot afford to waste a huge test
          set on every idea. The honest last word is still a held-out test set you touch once.
          CV is for <em>choosing</em> among ideas using the training pool.
        </p>
        <div className="mt-3 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>K-fold: split train into K folds. For each k, train on K−1, score on fold k.</div>
          <div>Report mean ± std of the K scores. Then refit the winner on all train data.</div>
        </div>
      </Definition>

      <LessonSection title="The menu">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Protocol</th>
                <th className="px-4 py-3">When</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Hold-out (one val split)', 'm is huge; you need speed, not a tight SE'],
                ['K-fold (K = 5 or 10)', 'Default for i.i.d. tabular data'],
                ['Stratified K-fold', 'Classification — keep class rates in every fold'],
                ['Leave-one-out (K = m)', 'Tiny m; high variance of the estimator, expensive'],
                ['Group / blocked CV', 'Rows share a user, hospital, or time — split on the group'],
                ['Time-series split', 'Train on the past, validate on the future. Never shuffle days.'],
                ['Nested CV', 'You are tuning AND claiming a performance number from the same pool'],
              ].map(([p, w]) => (
                <tr key={p}>
                  <td className="px-4 py-3 font-semibold text-white">{p}</td>
                  <td className="px-4 py-3 text-slate-400">{w}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip" title="Nested CV in one sentence">
          The inner loop picks λ. The outer loop scores the whole “fit + pick λ” recipe. If you
          pick λ on the same folds you report, the report is optimistic.
        </Callout>
      </LessonSection>

      <LessonSection title="Leakage — the silent invalidation">
        <ul className="list-disc space-y-1 pl-5 text-slate-300">
          <li>Scaling, PCA, imputation, feature selection fitted on all rows before splitting.</li>
          <li>The same user / time-window in train and val.</li>
          <li>Tuning 40 models and quoting the best fold-mean as “the” accuracy.</li>
        </ul>
        <p className="mt-3 text-slate-300">
          Fit every transform inside each fold (a sklearn Pipeline). Split groups, not rows, when
          rows are not independent. Save one test set for the number you publish.
        </p>
      </LessonSection>

      <LessonSection title="Worked problems">
        <ContentStep number={1} title="Problem 1 — 5-fold sizes">
          <p>m = 200. 5-fold CV. How many rows train / val in each round?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Val 40, train 160. Each row is val in exactly one fold.</div>
          </div>
        </ContentStep>
        <ContentStep number={2} title="Problem 2 — Why stratify">
          <p>1% fraud, 5-fold, unstratified. What can a fold look like?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>A fold can have 0 fraud rows. Recall is then 0 or undefined. Stratify.</div>
          </div>
        </ContentStep>
        <ContentStep number={3} title="Problem 3 — Scale-then-split">
          <p>You StandardScaler.fit(X_all) then KFold. Why is val accuracy a little high?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Val rows influenced the mean and std. Mild leakage; worse for SelectKBest / PCA.</div>
            <div>Pipeline: split → fit scaler on train fold → transform val fold.</div>
          </div>
        </ContentStep>
        <ContentStep number={4} title="Problem 4 — Time series">
          <p>Daily demand, randomly shuffled 5-fold. Val RMSE looks great. Production next month fails. Why?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Future days leaked into training. Use a rolling-origin / TimeSeriesSplit.</div>
          </div>
        </ContentStep>
        <ContentStep number={5} title="Problem 5 — Nested vs not (ML flavour)">
          <p>You grid-search C on 5-fold and report the winning fold-mean 0.91 as test accuracy. Honest?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>No. That 0.91 picked the luckiest C. Nested CV or a frozen test set after the search.</div>
          </div>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Python — a manual 4-fold mean">
        <Example
          title="Mean squared error of predicting the fold-mean"
          output={`fold MSEs [2.25, 0.25, 2.25, 6.25]  mean 2.75`}
        >{`import numpy as np

y = np.array([1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0])
K = 4
folds = np.array_split(np.arange(len(y)), K)
mses = []
for i in range(K):
    val = folds[i]
    train = np.concatenate([folds[j] for j in range(K) if j != i])
    pred = y[train].mean()
    mses.append(np.mean((y[val] - pred) ** 2))
print("fold MSEs", np.round(mses, 2), " mean", round(np.mean(mses), 2))`}</Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'K-fold CV scores a recipe on K rotating holdouts. Refit the chosen recipe on all training data. Keep a true test set for the number you publish.',
          'Stratify classification. Group-split when rows share an entity. Time-split when order matters. Never shuffle a time series.',
          'Fit scalers, PCA, and feature selectors inside each fold. Fit-on-all then split is leakage.',
          'Nested CV (or a separate test set) is required if you both tune and report from the same pool.',
          'K = 5 or 10 is the default. LOO is for tiny m. A single hold-out is fine when m is enormous.',
        ]}
      />
    </LessonArticle>
  )
}
