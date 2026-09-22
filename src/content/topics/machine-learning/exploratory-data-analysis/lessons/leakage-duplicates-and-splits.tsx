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

export function LeakageDuplicatesAndSplits() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="The advanced traps that make models look “brilliant”">
        If your offline score is amazing and production is disappointing, the villain is often
        leakage, duplicates, or a dishonest split — not the choice of algorithm. This lesson is the
        safety net before Feature Engineering.
      </Callout>

      <Definition term="Data leakage">
        <p>
          Leakage means the model saw information during training that it would <strong className="text-white">not
          have at prediction time</strong> in the real world — or that directly encodes the answer.
          Offline metrics become fiction.
        </p>
      </Definition>

      <LessonSection title="Three faces of leakage">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Face</th>
                <th className="px-4 py-3">Example</th>
                <th className="px-4 py-3">How EDA catches it</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                [
                  'Target leakage',
                  '“days_to_cancel” used to predict churn; or “refund_amount” to predict fraud',
                  'Ask: is this known before the event? Perfect AUC? Column name smells like outcome',
                ],
                [
                  'Train–test contamination',
                  'Scaler / imputer / rare-category map fit on full data including test',
                  'Any fit() that touched test rows — redo with train-only fits',
                ],
                [
                  'Group leakage',
                  'Same customer appears in train and test with nearly identical rows',
                  'Split by group id / time; check overlap of keys across folds',
                ],
              ].map(([face, ex, catchIt]) => (
                <tr key={face}>
                  <td className="px-4 py-3 font-semibold text-white">{face}</td>
                  <td className="px-4 py-3 text-slate-400">{ex}</td>
                  <td className="px-4 py-3 text-slate-400">{catchIt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="insight" title="The freeze-time test">
          Imagine you must score a row at time T. List every feature and ask: &ldquo;Would I know this at
          T?&rdquo; If no, it cannot train the model. Write T explicitly (application time, claim open
          time, click time).
        </Callout>
      </LessonSection>

      <LessonSection title="Duplicates — silent score inflation">
        <ContentStep number={1} title="Exact duplicate rows">
          <p>
            Same values repeated. If duplicates land in both train and test, the model memorises and
            &ldquo;generalises&rdquo; to a clone. Deduplicate with a policy (keep first? keep latest?).
          </p>
        </ContentStep>
        <ContentStep number={2} title="Near-duplicates">
          <p>
            Same customer, slightly different feature snapshots. Still a group-leakage risk if one
            goes to train and one to test.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Duplicate keys, conflicting labels">
          <p>
            Same id, different targets — a data bug. Resolve before modelling; do not average labels
            silently without a written rule.
          </p>
        </ContentStep>
        <Example title="Quick duplicate audit">
{`# exact row clones
df.duplicated().sum()

# same business key twice
df.duplicated(["customer_id", "month"]).sum()

# same key, different churn label
df.groupby("customer_id")["churn"].nunique().gt(1).sum()`}
        </Example>
      </LessonSection>

      <LessonSection title="Honest splits — the geometry of evaluation">
        <Flowchart
          title="Pick a split that matches reality"
          chart={`flowchart TD
  A[What breaks independence?] -->|Time| B[Train past → validate future]
  A -->|People / companies| C[Group split by id]
  A -->|IID rows| D[Random or stratified split]
  B --> E[Never shuffle time like IID]
  C --> E
  D --> F[Stratify on rare labels]
  E --> G[Lock test set — touch once]
  F --> G`}
        />
        <div className="mt-3 overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Problem type</th>
                <th className="px-4 py-3">Split</th>
                <th className="px-4 py-3">Why</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Forecasting / anything with time', 'Time-based', 'Future must not train on tomorrow’s news'],
                ['Multiple rows per user', 'Group by user_id', 'Same person in train and test overstates skill'],
                ['Rare positive class', 'Stratified', 'Keep class rate stable across splits'],
                ['Plain IID table', 'Random', 'OK only when rows truly independent'],
              ].map(([p, s, w]) => (
                <tr key={p}>
                  <td className="px-4 py-3 text-slate-300">{p}</td>
                  <td className="px-4 py-3 font-semibold text-white">{s}</td>
                  <td className="px-4 py-3 text-slate-400">{w}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip" title="Explore on train only">
          Do deep EDA and all fitting (medians, rare-category lists, PCA) on the training slice. You
          may glance at overall shape of the full raw extract once, but any statistic that guides
          modelling decisions should be train-only — or you leak.
        </Callout>
      </LessonSection>

      <LessonSection title="Advanced smells — when to stop celebrating">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">AUC ≈ 1.0</strong> on a messy human problem → audit features
            for post-outcome fields.
          </li>
          <li>
            <strong className="text-white">One feature dominates</strong> with a suspicious name
            (status, cancel_reason, settlement_flag).
          </li>
          <li>
            <strong className="text-white">Test score ≫ cross-val</strong> after many manual peeks at
            the test set — you overfit the holdout by iteration (holdout burnout).
          </li>
          <li>
            <strong className="text-white">IDs drive the model</strong> — you encoded user_id and
            memorised people.
          </li>
        </ul>
      </LessonSection>

      <LessonSection title="Worked problems">
        <ContentStep number={1} title="Problem 1 — Freeze time">
          <p>
            Predict hospital readmission within 30 days of discharge. Feature set includes
            &ldquo;number of follow-up visits in the next 30 days.&rdquo; Leakage?
          </p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Yes — those visits happen during the outcome window; unknown at discharge.</div>
            <div>Use only pre-discharge and historical features available at prediction time.</div>
          </div>
        </ContentStep>

        <ContentStep number={2} title="Problem 2 — Duplicate inflation">
          <p>Exact duplicates: 20% of rows. Random 80/20 split. What happens to test accuracy?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Many test rows are clones of train rows → optimistic accuracy. Deduplicate first (or split by key).</div>
          </div>
        </ContentStep>

        <ContentStep number={3} title="Problem 3 — Time shuffle">
          <p>Daily sales for 3 years. You shuffle rows and take a random 20% test. Why is that dishonest?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Test days sit between training days — the model peeks at neighboring future/past context unrealistically.</div>
            <div>Use a last-N-months holdout (and gap if needed).</div>
          </div>
        </ContentStep>

        <ContentStep number={4} title="Problem 4 — Group leakage">
          <p>Credit risk: 5 loans per customer. Random row split puts some of a customer’s loans in train, some in test.</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Model learns the person, not the loan. Split so each customer_id is entirely in train or test.</div>
          </div>
        </ContentStep>

        <ContentStep number={5} title="Problem 5 — Scaler contamination">
          <p>You run StandardScaler.fit_transform on the full matrix, then split. Name the bug.</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Train–test contamination: test means/variances leaked into train features.</div>
            <div>fit on train, transform train/val/test separately.</div>
          </div>
        </ContentStep>

        <ContentStep number={6} title="Problem 6 — Label proxy">
          <p>
            Fraud model includes &ldquo;chargeback_flag&rdquo; recorded when the bank reverses a charge —
            often after fraud is confirmed. Usable as a feature for live scoring at authorization?
          </p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>No for real-time auth — not known yet. It is essentially a delayed label. Classic target leakage.</div>
          </div>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Python — overlap and time split sketch">
        <Example
          title="Check id overlap; build a time holdout"
          output={`customer overlap train∩test: 0
time split: train months ['2024-01', '2024-02'] | test months ['2024-03']`}
        >{`import pandas as pd

df = pd.DataFrame({
    "customer_id": [1, 1, 2, 2, 3, 3],
    "month": ["2024-01", "2024-02", "2024-01", "2024-02", "2024-02", "2024-03"],
    "spend": [10, 12, 40, 38, 5, 7],
    "churn": [0, 0, 1, 1, 0, 1],
})

# group split by customer
train_ids = {1, 2}
train = df[df["customer_id"].isin(train_ids)]
test = df[~df["customer_id"].isin(train_ids)]
overlap = set(train["customer_id"]) & set(test["customer_id"])
print(f"customer overlap train∩test: {len(overlap)}")

# time split
months = sorted(df["month"].unique())
train_m, test_m = months[:-1], months[-1:]
print(f"time split: train months {train_m} | test months {test_m}")`}</Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Leakage = using information you would not have at prediction time, or a direct answer key. Offline scores become lies.',
          'Use the freeze-time test: every feature must be knowable at scoring time T.',
          'Duplicates and shared groups across train/test inflate metrics — dedupe and group-split when needed.',
          'Match the split to reality: time for temporal problems, groups for repeated entities, stratify for rare labels.',
          'Fit scalers, imputers, and encoders on train only. Explore primarily on train.',
          'AUC near 1.0, outcome-flavoured column names, and ID memorisation are red alerts — investigate before shipping.',
        ]}
      />
    </LessonArticle>
  )
}
