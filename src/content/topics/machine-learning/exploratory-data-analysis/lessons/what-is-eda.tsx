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

export function WhatIsEda() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Start here — no math required yet">
        EDA is not a library and not a chart type. It is the careful habit of{' '}
        <strong className="text-white">understanding your table before you ask a model to learn from it</strong>.
        If you skip this, every algorithm you learned later will still run — and often look brilliant — while
        being wrong for quiet, boring reasons.
      </Callout>

      <Definition term="Exploratory Data Analysis (EDA)">
        <p>
          EDA means you open the dataset and answer plain questions in a fixed order: What is one row?
          What are we trying to predict? Which columns are numbers, names, dates, or IDs? What is broken,
          missing, duplicated, or suspiciously perfect?
        </p>
        <p className="mt-2 text-slate-300">
          You write those answers down. That short note becomes the blueprint for feature engineering and
          for choosing a model. Charts help you see. They are not the goal.
        </p>
      </Definition>

      <LessonSection title="A story before any jargon">
        <p className="text-slate-300">
          Imagine you join a team that wants to predict whether a customer will cancel next month. Someone
          drops a CSV on your desk with 40 columns and 200 000 rows. A teammate says &ldquo;just run XGBoost.&rdquo;
        </p>
        <p className="mt-3 text-slate-300">Without EDA you might ship a model that:</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-300">
          <li>uses a column that is filled only after the customer already cancelled,</li>
          <li>treats the same person&rsquo;s many months as independent rows and leaks them into train and test,</li>
          <li>treats age = −1 as a real age because a database used −1 for &ldquo;unknown,&rdquo;</li>
          <li>reports 99% accuracy because only 1% of customers cancel.</li>
        </ul>
        <p className="mt-3 text-slate-300">
          EDA is how you catch those before they become a production incident. The algorithm was never the
          hard part.
        </p>
        <Example title="The same file, two attitudes">
{`Attitude A (skip EDA):
  df = read_csv("churn.csv")
  model.fit(df.drop("churn"), df["churn"])
  print(accuracy)   # looks amazing
  # …later: business says the model is useless

Attitude B (do EDA):
  What is one row?           → one customer-month
  When is churn known?       → end of next month
  Which columns exist then?  → drop post-churn fields
  How rare is churn?         → 1.4% → do not trust accuracy
  Same customer many times?  → split by customer_id or by time
  THEN feature engineering, THEN a model`}
        </Example>
      </LessonSection>

      <LessonSection title="Where EDA sits in this Machine Learning track">
        <Flowchart
          title="The honest learning path"
          chart={`flowchart TB
  A[Introduction — features, labels, splits] --> B[EDA — understand the table]
  B --> C[Feature engineering — repair and enrich]
  C --> D[Regression / classification / unsupervised]
  D --> E[Model selection — CV, bias-variance]`}
        />
        <p className="mt-3 text-slate-300">
          Introduction taught vocabulary. Algorithms teach how models learn. EDA sits in between: it turns
          a messy file into a problem you can actually state. Feature engineering comes next and implements
          the repairs you discover here.
        </p>
      </LessonSection>

      <LessonSection title="What EDA is — and what it is not">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">EDA is</th>
                <th className="px-4 py-3">EDA is not</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Asking what a row represents', 'Plotting for the sake of pretty pictures'],
                ['Checking whether values are possible', 'Automatically “cleaning” without a reason'],
                ['Finding leakage and bad splits early', 'Tuning hyperparameters'],
                ['Deciding which metric can even make sense', 'Training the final model'],
                ['Writing a short data note for the team', 'A one-time ritual you never revisit'],
              ].map(([yes, no]) => (
                <tr key={yes}>
                  <td className="px-4 py-3 text-slate-300">{yes}</td>
                  <td className="px-4 py-3 text-slate-400">{no}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="insight" title="Tukey’s idea, in one line">
          John Tukey popularised EDA as detective work: look, summarise, notice the unexpected, then form
          a hypothesis. Confirmatory statistics and model fitting come after you know what world the numbers
          live in.
        </Callout>
      </LessonSection>

      <LessonSection title="The five questions every EDA must answer">
        <ContentStep number={1} title="What is one row?">
          <p>
            Customer, visit, day, click, invoice line? If you cannot say this in one sentence, you will
            double-count and leak. This is called the <strong className="text-white">grain</strong> of the
            table — covered in the next lesson.
          </p>
        </ContentStep>
        <ContentStep number={2} title="What is the target, and when is it known?">
          <p>
            Price, churn, fraud, next-day demand? Write the exact definition. Then ask: at the moment we
            must predict, does this label already exist? Features that are only known after the label are
            cheating.
          </p>
        </ContentStep>
        <ContentStep number={3} title="What do the columns look like alone?">
          <p>
            Types, ranges, missing holes, impossible values, rare categories. One column at a time —
            before you draw fancy relationships.
          </p>
        </ContentStep>
        <ContentStep number={4} title="How do features relate to the target — and to each other?">
          <p>
            Straight lines, U-shapes, rate tables, twin columns that say the same thing twice. This decides
            whether a linear model is even plausible.
          </p>
        </ContentStep>
        <ContentStep number={5} title="How could a model look good while being wrong?">
          <p>
            Duplicates across train and test, shuffled time series, IDs treated as features, a column that
            is the label in disguise. Advanced EDA is mostly hunting these traps.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Golden rule: freeze the test set, explore the train set">
        <p className="text-slate-300">
          If you look at the test set to choose a transform (&ldquo;test is more skewed, so I&rsquo;ll log
          everything&rdquo;), the test set is no longer an honest exam. The beginner-safe protocol:
        </p>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-slate-300">
          <li>Decide the split rule (random / stratified / by user / by time) from business logic.</li>
          <li>Hold out a test set and do not use it for decisions.</li>
          <li>Do EDA on training data (and optionally a validation fold).</li>
          <li>Only at the very end, score the finished pipeline on test once.</li>
        </ol>
        <Callout variant="tip" title="Mild vs fatal peeking">
          Checking that test has a similar class rate as train is mild sanity. Choosing clip limits,
          rare-category lists, or feature drops from test statistics is fatal leakage. When unsure,
          pretend test does not exist.
        </Callout>
      </LessonSection>

      <LessonSection title="The deliverable — a one-page data note">
        <p className="text-slate-300">
          EDA is finished when you can paste something like this into a PR or a notebook top cell:
        </p>
        <Example title="Template data note">
{`Dataset: churn_monthly_v3.csv
Grain: one row = one subscriber × calendar month
Target: churned_next_month (0/1), known at month end+30d
Prediction time: first day of month t (features must exist then)
Rows: 180k train / 20k test (time split: train ≤ 2024-06, test ≥ 2024-07)
Class rate: 1.4% churn → use PR-AUC / recall@precision, not accuracy
Issues found:
  1. age uses -1 for missing (4%)
  2. days_since_churn is post-outcome → drop for this task
  3. ~8k exact duplicate rows from a bad join
  4. plan="legacy" has only 17 rows → collapse to other
Next: feature engineering (impute age, lag features with shift, encode plan)`}
        </Example>
        <p className="mt-3 text-slate-300">
          That note is the contract between EDA and feature engineering. Without it, cleaning becomes random.
        </p>
      </LessonSection>

      <LessonSection title="Worked problems">
        <ContentStep number={1} title="Problem 1 — Name the grain">
          <p>
            A hospital CSV has columns patient_id, visit_date, diagnosis, readmitted_30d. Each patient can
            have many visits. What is the grain if the team wants to predict readmission after a visit?
          </p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Grain = one visit (or patient × visit_date), not one patient.</div>
            <div>But the split should still respect patient_id so the same person is not in train and test.</div>
          </div>
        </ContentStep>

        <ContentStep number={2} title="Problem 2 — Is EDA optional if accuracy is already high?">
          <p>Your first random-forest notebook hits 0.97 accuracy on an imbalanced fraud set. Skip EDA?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>No. High accuracy on a 1% positive class can mean &ldquo;always predict negative.&rdquo;</div>
            <div>EDA would have written the class rate and forced a better metric before you celebrated.</div>
          </div>
        </ContentStep>

        <ContentStep number={3} title="Problem 3 — Peeking">
          <p>
            You compute the 99th percentile of income on the full dataset (train+test) and clip there, then
            split. Is that honest?
          </p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>No. The clip limit used test rows. Fit percentiles on train only, then apply to test.</div>
          </div>
        </ContentStep>

        <ContentStep number={4} title="Problem 4 — What belongs in the data note?">
          <p>Which of these belong: learning rate, grain, AUROC of a leaking column, favourite colour of the analyst?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Grain and the leaking-column finding belong. Learning rate is model selection, not EDA.</div>
          </div>
        </ContentStep>

        <ContentStep number={5} title="Problem 5 — EDA vs feature engineering">
          <p>You notice age = −1 means missing. Is replacing −1 with the median still EDA?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Discovering and documenting −1 → missing is EDA.</div>
            <div>Choosing median imputation and coding it in a train-only pipeline is feature engineering.</div>
          </div>
        </ContentStep>

        <ContentStep number={6} title="Problem 6 — When to stop exploring">
          <p>You have plotted every pairwise scatter for 60 columns. Still no model. What went wrong?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>EDA without a stopping rule becomes endless tourism.</div>
            <div>Stop when the five questions have answers and the data note is written. Then engineer and model.</div>
            <div>You can return to EDA later if residuals or errors reveal a new mystery.</div>
          </div>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Python — open a file the EDA way">
        <Example
          title="First 30 seconds: shape, target rate, obvious holes"
          output={`shape: 6 rows × 5 columns
columns: ['customer_id', 'month', 'age', 'plan', 'churn_next']
churn rate: 0.333
missing %: {'age': 16.7}
duplicate full rows: 1`}
        >{`import pandas as pd

df = pd.DataFrame({
    "customer_id": [1, 1, 2, 3, 3, 3],
    "month": ["2024-01", "2024-02", "2024-01", "2024-01", "2024-01", "2024-02"],
    "age": [28, 28, None, 41, 41, 41],
    "plan": ["basic", "basic", "plus", "basic", "basic", "plus"],
    "churn_next": [0, 1, 0, 0, 0, 1],
})

print(f"shape: {df.shape[0]} rows × {df.shape[1]} columns")
print("columns:", list(df.columns))
print(f"churn rate: {df['churn_next'].mean():.3f}")
print("missing %:", (df.isna().mean() * 100).round(1).to_dict())
print("duplicate full rows:", int(df.duplicated().sum()))`}</Example>
        <Callout variant="beginner" title="What you just practiced">
          You did not fit a model. You learned: rows repeat customers, age has holes, churn is not rare in
          this tiny toy, and a duplicate exists. The next lessons teach you how to go deeper on each of those.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'EDA is detective work before modelling: understand the table so algorithms are applied to a real problem, not a broken file.',
          'It sits after Introduction and before Feature Engineering in this track — vocabulary → understand → repair → model → select.',
          'Always answer: grain, target timing, column health, relationships, and ways the score could cheat.',
          'Freeze test. Explore train. Choosing transforms from test statistics is leakage.',
          'Finish EDA with a one-page data note. That note is the contract that feature engineering implements.',
          'EDA is not endless plotting. Stop when the questions have answers, then move on — and return if new evidence appears.',
        ]}
      />
    </LessonArticle>
  )
}
