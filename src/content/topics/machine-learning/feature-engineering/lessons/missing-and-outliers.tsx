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

export function MissingAndOutliers() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Holes and wild values — make them honest">
        After EDA mapped missingness and tails, FE chooses what the model sees: a filled number, a
        missing flag, a clipped value, or a dropped column. The wrong fill invents a fake world.
      </Callout>

      <Definition term="Imputation">
        <p>
          Imputation replaces missing entries with a planned value (constant, median, mode, or a
          model&rsquo;s guess). Pairing a fill with a{' '}
          <strong className="text-white">missing indicator</strong> often beats a silent fill alone —
          especially when missingness itself predicts the target.
        </p>
      </Definition>

      <LessonSection title="Four honest options (and when)">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Move</th>
                <th className="px-4 py-3">When</th>
                <th className="px-4 py-3">Watch out</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Drop the column', '≥80–90% missing, or no usable signal', 'You may still keep a was_present flag'],
                ['Drop the row', 'Rare holes, huge m, hole is MCAR-like', 'Can delete the rare class — check rates'],
                ['Impute + indicator', 'Default for most tabular work', 'Fit fill on train only'],
                ['Model-based impute', 'MAR plausible, budget for complexity', 'Must nest inside CV; easy to leak'],
              ].map(([m, w, o]) => (
                <tr key={m}>
                  <td className="px-4 py-3 font-semibold text-white">{m}</td>
                  <td className="px-4 py-3 text-slate-400">{w}</td>
                  <td className="px-4 py-3 text-slate-400">{o}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Flowchart
          title="Missing-value decision"
          chart={`flowchart TD
  A[Column missing %] -->|Very high| B[Drop or keep flag only]
  A -->|Moderate| C{Missing tracks target?}
  C -->|Yes| D[Impute + missing indicator]
  C -->|No| E[Simple impute may suffice]
  D --> F[Fit on train]
  E --> F`}
        />
      </LessonSection>

      <LessonSection title="What to fill with">
        <ContentStep number={1} title="Numeric — median is the beginner default">
          <p>
            Median resists outliers better than the mean. Mean is fine for symmetric, clean columns.
            Constant 0 is right only when 0 is a real structural meaning (never purchased).
          </p>
        </ContentStep>
        <ContentStep number={2} title="Categorical — mode or an explicit level">
          <p>
            Mode works for low-cardinality fields. Often better: a dedicated{' '}
            <code className="text-slate-200">&quot;__missing__&quot;</code> category so the model can
            learn &ldquo;blank&rdquo; as its own pattern.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Sentinels first">
          <p>
            Recode −1 / 999 / &quot;NA&quot; to true missing <em>before</em> computing the train median.
            Otherwise you average poison into the fill.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Structural missing">
          <p>
            If <code className="text-slate-200">spouse_age</code> is null iff unmarried, do not fill
            with the married population&rsquo;s median. Use 0 or a dedicated level + an{' '}
            <code className="text-slate-200">is_married</code> flag from EDA&rsquo;s story.
          </p>
        </ContentStep>
        <Callout variant="insight" title="Trees vs linear on missingness">
          Some tree libraries accept NaN and learn a default direction. Linear models and kNN do not —
          they need fills (and usually indicators). Match FE to the model family.
        </Callout>
      </LessonSection>

      <LessonSection title="Outliers — clip, transform, or segment">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Kind (from EDA)</th>
                <th className="px-4 py-3">FE action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Impossible / bug', 'Set to NaN then impute, or drop row after audit'],
                ['Sentinel', 'Recode to NaN — never clip as if it were a real tail'],
                ['Real heavy tail', 'log1p and/or winsorise (clip to train 1st–99th pct) for linear models'],
                ['Second population', 'Segment flag or separate model — clipping erases the segment'],
              ].map(([k, a]) => (
                <tr key={k}>
                  <td className="px-4 py-3 font-semibold text-white">{k}</td>
                  <td className="px-4 py-3 text-slate-400">{a}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip" title="Winsorise = clip using train quantiles">
          Compute lo, hi on train. Apply the same lo, hi to val/test/live. Do not recompute quantiles
          on each split&rsquo;s full fold unless you are inside a proper CV pipeline.
        </Callout>
      </LessonSection>

      <LessonSection title="Worked problems">
        <ContentStep number={1} title="Problem 1 — Fit the imputer">
          <p>Train ages: 22, 30, 41. Test age NaN. Which median fills the test row?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>30 — train median only.</div>
          </div>
        </ContentStep>
        <ContentStep number={2} title="Problem 2 — Structural zero">
          <p>prior_amount is NaN iff never_bought. Impute buyer-median or 0?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>0 (or dedicated level) + never_bought flag. Buyer-median pretends they bought.</div>
          </div>
        </ContentStep>
        <ContentStep number={3} title="Problem 3 — Winsorise">
          <p>Train 99th pct of spend = 12 000. Test row has 90 000. Linear model input after winsorise?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>12 000.</div>
          </div>
        </ContentStep>
        <ContentStep number={4} title="Problem 4 — Drop-row tax">
          <p>Dropping incomplete rows raises fraud rate from 1% to 3%. Ship that training set?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Dangerous — population shifted. Prefer impute; if you drop, evaluate on a sample that still has blanks like production.</div>
          </div>
        </ContentStep>
        <ContentStep number={5} title="Problem 5 — Indicator">
          <p>Income missing predicts churn. You median-fill only. What did you throw away?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>The missingness signal. Add is_income_missing (0/1) beside the filled income.</div>
          </div>
        </ContentStep>
        <ContentStep number={6} title="Problem 6 — Sentinel then median">
          <p>Ages: 20, 30, −1, 40. Someone takes median including −1 (= 25). Fix?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Replace −1→NaN first; median of 20,30,40 = 30; fill + is_missing flag.</div>
          </div>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Python — impute + indicator + winsorise">
        <Example
          title="Train-fitted median, flag, and clip"
          output={`train age: [28.0, 28.0, 35.0] flags [0, 1, 0]
test age: [28.0, 41.0] flags [1, 0]
winsorised spend test: [120, 500]`}
        >{`import numpy as np
import pandas as pd

train = pd.DataFrame({"age": [28.0, np.nan, 35.0], "spend": [40, 120, 800]})
test = pd.DataFrame({"age": [np.nan, 41.0], "spend": [120, 900]})

med = train["age"].median()
for d in (train, test):
    d["age_missing"] = d["age"].isna().astype(int)
    d["age"] = d["age"].fillna(med)

hi = train["spend"].quantile(0.95)
train["spend"] = train["spend"].clip(upper=hi)
test["spend"] = test["spend"].clip(upper=hi)

print("train age:", train["age"].tolist(), "flags", train["age_missing"].tolist())
print("test age:", test["age"].tolist(), "flags", test["age_missing"].tolist())
print("winsorised spend test:", test["spend"].tolist())`}</Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Impute after fixing sentinels; fit fill values on train only.',
          'Default numeric fill = median; categoricals often get an explicit __missing__ level.',
          'Add a missing indicator when EDA showed missingness tracks the target.',
          'Structural missing needs a domain story — not the other group’s median.',
          'Winsorise / clip with train quantiles; log heavy tails for linear models.',
          'Dropping incomplete rows can rewrite the class balance — measure before and after.',
        ]}
      />
    </LessonArticle>
  )
}
