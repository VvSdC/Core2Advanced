import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function MissingAndOutliers() {
  return (
    <LessonArticle>
      <Definition term="Cleaning after EDA">
        <p>
          EDA found holes and tails. Feature engineering <strong className="text-white">decides
          what the model will see</strong> — and every decision is fit on train only. A median
          computed on all rows, including test, is a quiet leak.
        </p>
      </Definition>

      <LessonSection title="Missing values — four honest options">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Move</th>
                <th className="px-4 py-3">When</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Drop the column', 'Mostly missing, or missingness is not usable'],
                ['Drop the row', 'Rare missing and m is huge; never drop a rare-class row lightly'],
                ['Impute + missing indicator', 'Default: median/mean (numeric), mode or “missing” level (cat)'],
                ['Model-based / iterative impute', 'When you can afford it and MAR is plausible'],
              ].map(([m, w]) => (
                <tr key={m}>
                  <td className="px-4 py-3 font-semibold text-white">{m}</td>
                  <td className="px-4 py-3 text-slate-400">{w}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="insight" title="Missingness is sometimes the feature">
          “Income not reported” predicts better than the imputed rupees. Add a 0/1 indicator,
          then impute. Trees can split on the indicator; linear models get both a fill and a
          flag.
        </Callout>
      </LessonSection>

      <LessonSection title="Outliers — error, tail, or a second population">
        <ul className="list-disc space-y-1 pl-5 text-slate-300">
          <li>Impossible values: recode or drop after you confirm they are bugs.</li>
          <li>Heavy tails you believe: log / winsorise (clip to the train 1st–99th percentile) for linear models; trees care less.</li>
          <li>A second population (enterprise vs SMB): a flag or a separate model beats clipping them into the middle.</li>
        </ul>
      </LessonSection>

      <LessonSection title="Worked problems">
        <ContentStep number={1} title="Problem 1 — Fit the imputer">
          <p>Train ages 22, 30, 41. Test age NaN. What median do you fill?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>30 — the train median. Never recompute on train+test.</div>
          </div>
        </ContentStep>
        <ContentStep number={2} title="Problem 2 — Structural missing">
          <p>prior_amount is NaN iff never_bought. Impute 0 or the median of buyers?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>0 (or a dedicated level) plus a never_bought flag. Buyer-median pretends they bought the typical order.</div>
          </div>
        </ContentStep>
        <ContentStep number={3} title="Problem 3 — Winsorise">
          <p>Train 99th percentile of spend is 12 000. A test row has 90 000. What does a linear model see if you winsorise?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>12 000 — clip using train quantiles. The model never saw 90k in training either.</div>
          </div>
        </ContentStep>
        <ContentStep number={4} title="Problem 4 — Drop-row tax">
          <p>8% of rows miss income; those rows are 30% of the fraud class. Drop them?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>No — you just deleted the rare class. Impute + indicator, or a model that natively handles NaN (many trees).</div>
          </div>
        </ContentStep>
        <ContentStep number={5} title="Problem 5 — Tree vs linear (ML flavour)">
          <p>Why can XGBoost skip median impute that Ridge cannot?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Trees can send NaN down a learned default direction. Ridge needs a number in every cell.</div>
            <div>You still want the missing indicator if the hole is informative.</div>
          </div>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Python — train median, test transform">
        <Example
          title="Impute + missing flag, fit on train only"
          output={`train fill 30.0
test ages after impute [30. 35.]
test missing flag      [1.  0.]`}
        >{`import numpy as np
import pandas as pd

train = pd.Series([22.0, 30.0, 41.0, np.nan])
test = pd.Series([np.nan, 35.0])
fill = train.median()
print(f"train fill {fill}")
print("test ages after impute", test.fillna(fill).to_numpy())
print("test missing flag     ", test.isna().astype(float).to_numpy())`}</Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Fit every imputer and clip threshold on train; apply those numbers to val/test. That is the same rule as StandardScaler.',
          'Default: median/mode + a missing indicator. Structural missing (never happened) wants a 0 or a dedicated level, not the buyer median.',
          'Do not drop rows that carry the rare class. Do not drop columns until you know missingness is useless.',
          'Outliers: fix errors, winsorise or log real tails for linear models, flag a second population instead of crushing it.',
          'Trees tolerate NaN and tails better than linear models. The indicator is still useful when “they didn’t fill the form” is signal.',
        ]}
      />
    </LessonArticle>
  )
}
