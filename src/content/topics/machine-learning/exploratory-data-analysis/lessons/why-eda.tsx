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

export function WhyEda() {
  return (
    <LessonArticle>
      <Definition term="Exploratory Data Analysis">
        <p>
          EDA is the habit of <strong className="text-white">looking at the data before you
          fit a model</strong> — types, missingness, distributions, relationships, and lies
          in the spreadsheet. You are not hunting for a pretty chart. You are answering
          questions that decide whether linear regression, a tree, or “go back to the data
          owner” is the next move.
        </p>
      </Definition>

      <LessonSection title="Why this sits here in the flow">
        <p className="text-slate-300">
          The introduction taught you features, labels, and honest splits. The algorithm
          chapters assume those columns already make sense. EDA is the missing middle: you
          meet the table, then feature engineering repairs it, then a model is allowed to
          touch it.
        </p>
        <Flowchart
          title="Where EDA lives"
          chart={`flowchart LR
  A[Introduction] --> B[EDA]
  B --> C[Feature engineering]
  C --> D[Regression / classification / …]
  D --> E[Model selection]`}
        />
        <Callout variant="beginner" title="Split first, then explore">
          If you peek at the test set to decide a transform (“oh, test has a huge outlier,
          I’ll clip to that”), the test set is no longer unseen. Split (or at least freeze a
          test set), then do EDA on train. Confirm the same issues exist on val without
          refitting your eyes to it.
        </Callout>
      </LessonSection>

      <LessonSection title="The questions EDA must answer">
        <ol className="list-decimal space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">What is a row?</strong> One customer? One day? One
            click? If you cannot say, you will leak and double-count.
          </li>
          <li>
            <strong className="text-white">What is the target?</strong> When was it known?
            Can a feature be computed only after the label exists?
          </li>
          <li>
            <strong className="text-white">What is missing, constant, or duplicate?</strong>
          </li>
          <li>
            <strong className="text-white">What is the shape vs the target?</strong> Linear
            smear, a U, two blobs, a rare class?
          </li>
          <li>
            <strong className="text-white">What would make a model look good by cheating?</strong>
            IDs, future timestamps, the label written twice under another name.
          </li>
        </ol>
      </LessonSection>

      <LessonSection title="A default tour — same order every time">
        <ContentStep number={1} title="Shape and types">
          <p>m rows, n columns, dtypes, cardinality of categoricals, ID-like columns.</p>
        </ContentStep>
        <ContentStep number={2} title="Target">
          <p>Histogram or class rates. Range, units, imbalance, impossible values.</p>
        </ContentStep>
        <ContentStep number={3} title="Missing and duplicates">
          <p>Per-column missing %, missing-together patterns, duplicate keys and duplicate rows.</p>
        </ContentStep>
        <ContentStep number={4} title="Univariate then vs target">
          <p>Each feature’s distribution, then a plot or table against y. That is the next two lessons.</p>
        </ContentStep>
        <ContentStep number={5} title="Write a data note">
          <p>
            Five bullets: what a row is, target definition, three problems you found, the
            split you will use. That note is the spec for feature engineering.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Worked problems">
        <ContentStep number={1} title="Problem 1 — What is a row?">
          <p>A table of hospital visits, one row per visit, target = “readmitted within 30 days.” You split rows at random. What is wrong?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>The same patient can land in train and test. Features (age, chronic conditions) leak.</div>
            <div>Split on patient id (group split). EDA should have asked “what is a row?” first.</div>
          </div>
        </ContentStep>
        <ContentStep number={2} title="Problem 2 — Target timing">
          <p>Column days_in_icu is highly correlated with “died in hospital.” Can you use it at admission time?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>No — it is measured during the stay. At prediction time it does not exist yet.</div>
            <div>EDA vs the clock: every feature needs a “known by when?” tag.</div>
          </div>
        </ContentStep>
        <ContentStep number={3} title="Problem 3 — Peeking">
          <p>You plot the test-set target to “check it looks similar,” then pick a log transform because test is more skewed. Allowed?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Checking similarity is mild. Choosing the transform from the test skew is leakage.</div>
            <div>Decide the transform on train (and maybe val). Test is only for the final number.</div>
          </div>
        </ContentStep>
        <ContentStep number={4} title="Problem 4 — Constant column">
          <p>country is “IN” for all 80 000 rows. Keep it?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Drop it. Zero variance, zero information, and it will explode if a new country appears later.</div>
          </div>
        </ContentStep>
        <ContentStep number={5} title="Problem 5 — Write the data note (ML flavour)">
          <p>Churn table: one row per subscriber-month, target churned_next_month, column last_month_churned. What goes in the note?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Row = subscriber × month. Target = churn in month t+1.</div>
            <div>Problem: last_month_churned may leak or be a lag feature — check timing.</div>
            <div>Split: time-based (train past months, test future), group by subscriber if needed.</div>
          </div>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Python — the five-minute header">
        <Example
          title="Shape, types, missing, target rate"
          output={`shape (5, 4)
missing %  {'age': 20.0, 'city': 0.0, 'churn': 0.0}
churn rate 0.40`}
        >{`import pandas as pd

df = pd.DataFrame({
    "user_id": [1, 1, 2, 3, 4],
    "age": [22, 22, None, 41, 35],
    "city": ["HYD", "HYD", "BLR", "HYD", "DEL"],
    "churn": [0, 1, 0, 1, 0],
})
print("shape", df.shape)
print("missing % ", (df.isna().mean() * 100).round(1).to_dict())
print("churn rate", df["churn"].mean())`}</Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'EDA is asking structured questions about rows, the target, missingness, shape, and cheating — before you pick an algorithm.',
          'In this topic it sits after the introduction and before feature engineering. Algorithms come only after the table is understood and then repaired.',
          'Split (or freeze a test set) first. Explore train. Do not choose transforms by staring at test.',
          'Write a short data note: what a row is, when the target is known, three problems, the split. That note is the FE spec.',
          'A constant column, a future-measured feature, and a random row split on repeated entities are the three most common “the model is a genius” traps.',
        ]}
      />
    </LessonArticle>
  )
}
