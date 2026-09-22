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

export function MissingValuesDeepDive() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Empty cells are information">
        A blank is not always &ldquo;noise.&rdquo; Sometimes it means the user never did something,
        a form field was optional, or a join failed. Treating every blank the same way is how
        beginners quietly break models.
      </Callout>

      <Definition term="Missingness">
        <p>
          Missingness is any cell without a usable observed value — true blanks,{' '}
          <code className="text-slate-200">NaN</code>, empty strings, or <strong className="text-white">sentinels</strong>{' '}
          like −1 / 999 that secretly mean &ldquo;unknown.&rdquo;
        </p>
      </Definition>

      <LessonSection title="Three classic reasons values are missing">
        <p className="text-slate-300">
          Statisticians name three mechanisms. You do not need the acronyms to start — you need the
          stories:
        </p>
        <div className="mt-3 overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Mechanism</th>
                <th className="px-4 py-3">Plain story</th>
                <th className="px-4 py-3">Danger if you ignore it</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                [
                  'MCAR — missing completely at random',
                  'A sensor randomly drops packets; coin-flip survey skip',
                  'Usually mild; simple imputation often OK',
                ],
                [
                  'MAR — missing at random (given other fields)',
                  'Younger users skip income; mobile users skip desktop-only fields',
                  'Missingness depends on observed features — model that pattern',
                ],
                [
                  'MNAR — missing not at random',
                  'High-income people refuse to report income; sick patients skip a health form',
                  'Missingness depends on the hidden value itself — bias is hard; domain help needed',
                ],
              ].map(([m, story, danger]) => (
                <tr key={m}>
                  <td className="px-4 py-3 font-semibold text-white">{m}</td>
                  <td className="px-4 py-3 text-slate-400">{story}</td>
                  <td className="px-4 py-3 text-slate-400">{danger}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="insight" title="You rarely prove the mechanism">
          In practice you hypothesize from domain knowledge and from plots of{' '}
          <em>missingness vs other columns</em>. The goal of EDA is to notice the pattern before you
          impute in feature engineering.
        </Callout>
      </LessonSection>

      <LessonSection title="First: find missingness — including fake numbers">
        <ContentStep number={1} title="True blanks and NaN">
          <p>
            Count <code className="text-slate-200">isna()</code> per column. Rank columns by missing %.
            Anything above ~5–10% deserves a sentence in the data note.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Empty strings and whitespace">
          <p>
            Categorical exports often use <code className="text-slate-200">&quot;&quot;</code> instead of
            null. Treat them as missing after stripping spaces.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Sentinels">
          <p>
            Document codes from the data dictionary: −1, 0, 999, &ldquo;NA&rdquo;, &ldquo;Unknown&rdquo;.
            Recode to true missing <em>before</em> computing means.
          </p>
        </ContentStep>
        <Example title="House data — age sentinel">
{`age_years:  28,  35,  −1,  41,  −1,  22
If you average as-is: mean is dragged down by −1.
Correct EDA step: replace −1 → missing, then report mean of known ages.`}
        </Example>
      </LessonSection>

      <LessonSection title="Patterns that matter — not just percentages">
        <Flowchart
          title="Missingness investigation loop"
          chart={`flowchart TD
  A[List missing % per column] --> B{Any column > 5%?}
  B -->|Yes| C[Is missing correlated with target?]
  B -->|No| D[Still check sentinels]
  C --> E[Is missing correlated with other features?]
  E --> F[Write mechanism hypothesis]
  F --> G[Decide: drop / impute / keep missing flag]
  D --> G`}
        />
        <p className="mt-3 text-slate-300">
          Build a binary &ldquo;is_missing&rdquo; indicator for high-missing columns and compare its rate
          across target classes or numeric bins. If missing income predicts churn better than income
          itself, that is a finding — keep the flag later.
        </p>
      </LessonSection>

      <LessonSection title="What EDA decides vs what FE does">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">In EDA you…</th>
                <th className="px-4 py-3">In Feature Engineering you…</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Count, map patterns, find sentinels', 'Impute (median/mode/model), add missing flags'],
                ['Decide if a column is too empty to keep', 'Drop or retain based on that decision'],
                ['Check if dropping rows would bias the target', 'Apply row filters only with a written policy'],
                ['Never fill using the whole dataset blindly', 'Fit imputers on train only, apply to val/test'],
              ].map(([eda, fe]) => (
                <tr key={eda}>
                  <td className="px-4 py-3 text-slate-300">{eda}</td>
                  <td className="px-4 py-3 text-slate-400">{fe}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip" title="Dropping rows is a product decision">
          Deleting every incomplete row can silently delete one class of users (e.g. people who
          refuse income questions). Always check the target rate before vs after a drop.
        </Callout>
      </LessonSection>

      <LessonSection title="Column-level vs row-level missingness">
        <ContentStep number={1} title="Column mostly empty">
          <p>
            90% missing on one feature: often drop the column, or keep only{' '}
            <code className="text-slate-200">was_provided</code> if that flag is predictive.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Row mostly empty">
          <p>
            A row missing 80% of fields may be a broken export or a bot. Inspect a sample before
            mass-deleting — you may be removing an important segment.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Structured blocks">
          <p>
            Whole groups of columns missing together (e.g. all &ldquo;spouse_*&rdquo; fields blank) often
            means a skipped form section — one missingness reason, many columns.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Worked problems">
        <ContentStep number={1} title="Problem 1 — Mean trap">
          <p>
            Column hours_online uses 0 for &ldquo;unknown&rdquo; and also for people who truly never logged
            in. Can you tell them apart from the column alone?
          </p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>No. You need another signal (last_login null? account_created same day?) or a better schema.</div>
            <div>EDA action: flag the ambiguity in the data note; do not pretend 0 is clean.</div>
          </div>
        </ContentStep>

        <ContentStep number={2} title="Problem 2 — Target-linked missingness">
          <p>
            Income is missing for 40% of churners and 10% of non-churners. Filling income with the
            global median — what goes wrong conceptually?
          </p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Missingness itself carries churn signal. Median fill erases that and invents fake incomes.</div>
            <div>Better: keep is_income_missing (+ careful imputation). Investigate why churners skip the field.</div>
          </div>
        </ContentStep>

        <ContentStep number={3} title="Problem 3 — Dropping incompletes">
          <p>m = 10 000. Dropping any row with a blank leaves 6 000. Fraud rate rises from 1% to 3%. Thoughts?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Dropping changed the population — incomplete rows were less often fraud (or the opposite story).</div>
            <div>Your evaluation set no longer matches production if production still has blanks.</div>
          </div>
        </ContentStep>

        <ContentStep number={4} title="Problem 4 — MAR story">
          <p>Desktop users fill &ldquo;company size&rdquo;; mobile users leave it blank. Mechanism?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Likely MAR given device type (observed). Model/impute conditional on device; include device as a feature.</div>
          </div>
        </ContentStep>

        <ContentStep number={5} title="Problem 5 — Nearly empty column">
          <p>optional_survey_score is present for 4% of users. Keep for modelling?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Usually drop the raw score or only keep a binary “answered survey” flag.</div>
            <div>Imputing 96% of values invents a fake complete survey.</div>
          </div>
        </ContentStep>

        <ContentStep number={6} title="Problem 6 — Train-only rule">
          <p>You compute the median income on the full CSV, then split train/test. Why is that wrong?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Test rows leaked into the imputer. Fit median on train only; transform val/test with that median.</div>
          </div>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Python — missing map and sentinel cleanup">
        <Example
          title="Find NaNs, empty strings, and −1 sentinels"
          output={`missing %:
age      0.40
city     0.20
income   0.00
is_age_missing rate by churn:
churn
0    0.25
1    0.67`}
        >{`import numpy as np
import pandas as pd

df = pd.DataFrame({
    "age": [28, -1, 35, -1, 41],
    "city": ["HYD", "", "BLR", "DEL", None],
    "income": [50, 60, 55, 80, 70],
    "churn": [0, 1, 0, 1, 0],
})

df["age"] = df["age"].replace(-1, np.nan)
df["city"] = df["city"].replace("", np.nan).replace({None: np.nan})

print("missing %:")
print((df.isna().mean()).round(2).to_string())

df["is_age_missing"] = df["age"].isna().astype(int)
print("is_age_missing rate by churn:")
print(df.groupby("churn")["is_age_missing"].mean().round(2).to_string())`}</Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Missingness includes NaN, blanks, empty strings, and sentinels that pretend to be numbers.',
          'MCAR / MAR / MNAR are stories about why blanks appear — use them to choose careful vs naive fixes.',
          'Always rank columns by missing %, then check whether missingness correlates with the target or other features.',
          'EDA diagnoses; FE imputes. Fit any imputer on train only.',
          'Dropping incomplete rows can change the class balance — measure before and after.',
          'A missingness flag is often more predictive than a poorly imputed number.',
        ]}
      />
    </LessonArticle>
  )
}
