import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function LeakageDuplicatesAndSplits() {
  return (
    <LessonArticle>
      <Definition term="Leakage smells in EDA">
        <p>
          A model that is “too good” on a random split is usually cheating. EDA’s last job is
          to find the cheats: duplicate rows, the label hidden in a feature, future information,
          and a split that is not a real-world cut.
        </p>
      </Definition>

      <LessonSection title="Duplicates — two different bugs">
        <ul className="list-disc space-y-1 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Exact duplicate rows</strong> — a join exploded or a
            file was appended twice. They overweight that example and can sit in both train and
            test.
          </li>
          <li>
            <strong className="text-white">Duplicate keys, different labels</strong> — two truths
            for one entity. That is a data-generating-process bug, not something to average away
            silently.
          </li>
        </ul>
      </LessonSection>

      <LessonSection title="Target leakage — the label in costume">
        <p className="text-slate-300">
          A feature that is only known once the label is known. Classic tells: name contains
          the target (is_churned_flag), almost-perfect AUC from one column, a timestamp after
          the event, a status field set by the same clerk who set the label.
        </p>
        <Callout variant="tip" title="The clock test">
          At the moment you must predict, is this column already in the database? If you have
          to wait for the outcome to compute it, it is not a feature.
        </Callout>
      </LessonSection>

      <LessonSection title="The split EDA recommends">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">You saw in EDA</th>
                <th className="px-4 py-3">Split</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['i.i.d. rows, balanced classes', 'Random, maybe stratified'],
                ['Rare class', 'Stratified'],
                ['Repeated user / patient / store', 'Group split on that id'],
                ['A timestamp that orders the world', 'Time split: train past, test future'],
                ['Both groups and time', 'Time split inside groups, or train on old users, test on new'],
              ].map(([saw, split]) => (
                <tr key={saw}>
                  <td className="px-4 py-3 font-semibold text-white">{saw}</td>
                  <td className="px-4 py-3 text-slate-400">{split}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Worked problems">
        <ContentStep number={1} title="Problem 1 — Duplicate leak">
          <p>2 000 of 10 000 rows are exact copies. Random 80/20. Why is test accuracy inflated?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Copies of training rows appear in test. The model memorises them.</div>
            <div>Dedup on the unit you will score (e.g. user_id + date) before splitting.</div>
          </div>
        </ContentStep>
        <ContentStep number={2} title="Problem 2 — Perfect AUROC">
          <p>One column risk_score gives AUROC 0.999 on a random split. First EDA move?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Read how it is built. If it is the vendor’s production model that saw y, it is leakage.</div>
            <div>If it is a legit prior score known at decision time, keep it — and be humble about “your” model’s skill.</div>
          </div>
        </ContentStep>
        <ContentStep number={3} title="Problem 3 — Time">
          <p>You train a demand model on shuffled days. Val RMSE is great. Next month fails. EDA miss?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>A date column existed and you treated rows as i.i.d. Time split was the data note.</div>
          </div>
        </ContentStep>
        <ContentStep number={4} title="Problem 4 — Two labels">
          <p>Same order_id, two rows, paid = 0 and paid = 1. What now?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Do not average. Find the grain (maybe refunds). Until it is one truth per key, stop modelling.</div>
          </div>
        </ContentStep>
        <ContentStep number={5} title="Problem 5 — Feature named like the label">
          <p>Columns: churned, churn_reason, days_since_churn. Target is churned. Keep the other two?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>churn_reason and days_since_churn are post-outcome. Drop for a pre-churn predictor.</div>
          </div>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Python — dupes and a leaking name">
        <Example
          title="Duplicate rate and a too-good column"
          output={`exact duplicate rows: 2
unique keys: 4 / 5
AUROC of leak_col: 1.00`}
        >{`import pandas as pd
from sklearn.metrics import roc_auc_score

df = pd.DataFrame({
    "user_id": [1, 1, 2, 3, 3],
    "spend": [10, 10, 4, 8, 9],
    "churn": [0, 0, 1, 0, 1],
    "leak_col": [0, 0, 1, 0, 1],
})
print("exact duplicate rows:", int(df.duplicated().sum()))
print("unique keys:", df.user_id.nunique(), "/", len(df))
print(f"AUROC of leak_col: {roc_auc_score(df.churn, df.leak_col):.2f}")`}</Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Deduplicate on the scoring unit before you split. Duplicate keys with different labels are a data bug, not a mean.',
          'Target leakage: the feature is only knowable after the outcome. The clock test catches most of it.',
          'A single column with AUROC ≈ 1 is guilty until proven to exist at prediction time.',
          'EDA chooses the split: random, stratified, grouped, or time. The model-selection chapter will implement it; you decide it here.',
          'When the grain of the table is unclear, stop. A confused row definition is how leakage and heroic metrics are born.',
        ]}
      />
    </LessonArticle>
  )
}
