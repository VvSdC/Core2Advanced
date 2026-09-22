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

export function WhatIsFeatureEngineering() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Start here — EDA found the mess, FE fixes it for the model">
        Feature engineering is the craft of turning raw columns into the numbers a model can learn
        from — filling holes, scaling, encoding names, inventing useful ratios —{' '}
        <strong className="text-white">always fit on train only</strong>, then applied unchanged to
        new rows.
      </Callout>

      <Definition term="Feature engineering (FE)">
        <p>
          FE is the set of transforms that map a raw row to a feature vector{' '}
          <code className="text-slate-200">x</code>. EDA decides <em>what is true</em> about the
          table. FE decides <em>what the model will see</em>, and packages those decisions so
          production scoring uses the same recipe.
        </p>
      </Definition>

      <LessonSection title="A story — same CSV, two outcomes">
        <p className="text-slate-300">
          You finished EDA on a hotel-booking file. You know city has blanks, lead_time is skewed,
          and &ldquo;deposit_type&rdquo; has three levels. A teammate one-hots everything, fills
          blanks with the global mean from the whole CSV, and ships. Offline accuracy looks great.
          Live bookings from a new city crash the encoder.
        </p>
        <p className="mt-3 text-slate-300">Good FE would have:</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-300">
          <li>Fit the imputer and category vocabulary on <strong className="text-white">train only</strong>.</li>
          <li>Planned for unseen cities (an &ldquo;other&rdquo; bucket or hashing).</li>
          <li>Logged lead_time if a linear model needed it; left raw for a tree if not.</li>
          <li>Wrapped every step in one pipeline you can <code className="text-slate-200">transform</code> at serve time.</li>
        </ul>
        <Flowchart
          title="Where FE sits"
          chart={`flowchart LR
  A[EDA data note] --> B[Choose transforms]
  B --> C[Fit on train]
  C --> D[Transform val / test / live]
  D --> E[Model]
  E --> F[Metrics + iterate]`}
        />
      </LessonSection>

      <LessonSection title="EDA vs FE — same table, different job">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">EDA says…</th>
                <th className="px-4 py-3">FE does…</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['age uses −1 for unknown', 'Recode −1 → NaN, then impute + missing flag'],
                ['price is right-skewed', 'log1p(price) for linear models; maybe leave raw for trees'],
                ['city has 900 levels, 40% rare', 'Group rare → other, or target/frequency encode'],
                ['recovery_amt leaks the label', 'Drop the column — do not “engineer” it'],
                ['same user in many rows', 'Aggregates with shift; group-aware split already chosen'],
              ].map(([eda, fe]) => (
                <tr key={eda}>
                  <td className="px-4 py-3 text-slate-300">{eda}</td>
                  <td className="px-4 py-3 text-slate-400">{fe}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="The five FE families you will learn">
        <ContentStep number={1} title="Missing values & outliers">
          <p>Impute, add indicators, clip wild tails — without inventing a fake population.</p>
        </ContentStep>
        <ContentStep number={2} title="Scaling & numeric transforms">
          <p>When distance-based and linear models need comparable units; when log fixes skew.</p>
        </ContentStep>
        <ContentStep number={3} title="Encoding categoricals">
          <p>One-hot, ordinal, frequency, smoothed target encoding, hashing — and unseen levels.</p>
        </ContentStep>
        <ContentStep number={4} title="Creating features">
          <p>Ratios, interactions, datetime parts, strictly-past lags and group history.</p>
        </ContentStep>
        <ContentStep number={5} title="Selection & pipelines">
          <p>Drop useless columns, nest selection inside CV, deploy one fitted Pipeline object.</p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="The non-negotiable rule — fit on train">
        <Callout variant="insight" title="Any statistic that guides a transform is a model parameter">
          Median, mean, min/max for clipping, rare-category lists, target-encoding rates, PCA
          loadings — all must be estimated on training rows only, then frozen for validation, test,
          and production.
        </Callout>
        <Example title="Wrong vs right median fill">
{`# WRONG — peeks at test
median = df["income"].median()          # full CSV
df["income"] = df["income"].fillna(median)
train, test = split(df)

# RIGHT
train, test = split(df)
median = train["income"].median()
train["income"] = train["income"].fillna(median)
test["income"]  = test["income"].fillna(median)   # same median`}
        </Example>
      </LessonSection>

      <LessonSection title="What a good FE handoff looks like">
        <p className="text-slate-300">
          From the EDA data note you inherit grain, target, types, and traps. Your FE note adds:
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-300">
          <li>Per-column transform (impute how? scale? encode how?).</li>
          <li>New columns created (and why they are leak-free).</li>
          <li>Columns dropped (leakage, constants, ultra-rare).</li>
          <li>The pipeline object name / version you will serve.</li>
        </ul>
      </LessonSection>

      <LessonSection title="Worked problems">
        <ContentStep number={1} title="Problem 1 — Is this FE?">
          <p>You plot a histogram of age and write “right-skewed” in the data note. FE or EDA?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>EDA. Applying log1p(age) inside a train-fitted pipeline is FE.</div>
          </div>
        </ContentStep>
        <ContentStep number={2} title="Problem 2 — Global max clip">
          <p>You clip spend to the 99th percentile computed on train+test, then split. Bug?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Yes — test values influenced the clip threshold. Use train percentile only.</div>
          </div>
        </ContentStep>
        <ContentStep number={3} title="Problem 3 — Tree vs linear">
          <p>For XGBoost, must you standard-scale every numeric column?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>No. Trees split on thresholds; scale rarely helps. Linear / kNN / SVM usually need it.</div>
          </div>
        </ContentStep>
        <ContentStep number={4} title="Problem 4 — New city in production">
          <p>Train saw cities {'{A, B, C}'}. Live row has city D. What must FE have planned?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Unseen-level policy: map to “other”, ignore unknown one-hot, or hash. Never crash.</div>
          </div>
        </ContentStep>
        <ContentStep number={5} title="Problem 5 — Leakage column">
          <p>EDA flagged post_outcome_flag as leakage. Can FE “fix” it with clever encoding?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>No. Drop it. Engineering a leak still leaks.</div>
          </div>
        </ContentStep>
        <ContentStep number={6} title="Problem 6 — Why a pipeline?">
          <p>Why not paste transform code into the training notebook and copy-paste into the API?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Copy-paste drifts — different medians, forgotten steps, train/serve skew.</div>
            <div>One fitted Pipeline (or equivalent) is the contract between train and serve.</div>
          </div>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Python — the FE mindset in ten lines">
        <Example
          title="Split first, then fit a fill value"
          output={`train median income: 55.0
train incomes: [50.0, 55.0, 60.0]
test incomes:  [55.0, 55.0]`}
        >{`import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split

df = pd.DataFrame({
    "income": [50.0, np.nan, 60.0, np.nan, 70.0],
    "y": [0, 1, 0, 1, 0],
})
train, test = train_test_split(df, test_size=0.4, random_state=0)
median = train["income"].median()
print(f"train median income: {median}")
train = train.copy(); test = test.copy()
train["income"] = train["income"].fillna(median)
test["income"] = test["income"].fillna(median)
print("train incomes:", train["income"].tolist())
print("test incomes:", test["income"].tolist())`}</Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'FE turns the EDA data note into model-ready columns — impute, scale, encode, create, select.',
          'Every fitted statistic (median, vocabulary, clip quantile) is estimated on train only.',
          'Trees and linear models want different transforms; choose FE for the model family you will train.',
          'Unseen categories and train/serve parity are production requirements, not extras.',
          'Leakage columns are dropped, not creatively encoded.',
          'Package transforms in a pipeline so scoring uses the exact training recipe.',
        ]}
      />
    </LessonArticle>
  )
}
