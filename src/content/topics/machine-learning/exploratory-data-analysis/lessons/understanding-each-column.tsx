import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function UnderstandingEachColumn() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="One column at a time">
        Before you draw feature-vs-target plots, make sure each column is understandable alone.
        Otherwise you will invent stories about &ldquo;age predicts churn&rdquo; when age is actually
        coded with −1 for missing.
      </Callout>

      <Definition term="Univariate EDA">
        <p>
          Univariate means <strong className="text-white">one variable</strong>. For each feature (and
          the target), you describe: what values appear, how often, what is typical, what is extreme,
          what is missing, and whether anything is illegal.
        </p>
      </Definition>

      <LessonSection title="Numeric columns — speak in plain summaries">
        <p className="text-slate-300">
          You do not need heavy statistics to start. For a numeric column, write down:
        </p>
        <div className="mt-3 overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Summary</th>
                <th className="px-4 py-3">Question it answers</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Count & missing %', 'How complete is this field?'],
                ['Min / max', 'What is the full range? Any impossible values?'],
                ['Mean & median', 'What is typical? If they differ a lot, the distribution is skewed'],
                ['Quartiles (25%, 75%)', 'Where is the middle half of the data?'],
                ['1% / 99% percentiles', 'How wild are the tails without staring at pure min/max?'],
              ].map(([s, q]) => (
                <tr key={s}>
                  <td className="px-4 py-3 font-semibold text-white">{s}</td>
                  <td className="px-4 py-3 text-slate-400">{q}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="beginner" title="Mean vs median — kitchen intuition">
          Five home prices: 50, 55, 60, 65, 500 (lakhs). The mean is pulled toward 500. The median
          stays near 60. When money or counts have a long tail, median is often the better &ldquo;typical&rdquo;
          number. That is also why we later log-transform some columns.
        </Callout>
      </LessonSection>

      <LessonSection title="Shape of a distribution — words you will use forever">
        <ContentStep number={1} title="Symmetric">
          <p>Left and right look similar (roughly like a bell). Mean ≈ median.</p>
        </ContentStep>
        <ContentStep number={2} title="Right-skewed (long right tail)">
          <p>
            Many small values, few huge ones — income, spend, dwell time. Mean &gt; median. Candidate
            for <code className="text-slate-200">log1p</code> later.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Left-skewed">
          <p>Long left tail — less common in business data. Mean &lt; median.</p>
        </ContentStep>
        <ContentStep number={4} title="Zero-inflated / spike at zero">
          <p>
            A tall bar at 0, then a smooth positive tail. Often two facts glued together: &ldquo;did they
            buy?&rdquo; and &ldquo;how much if they did?&rdquo;
          </p>
        </ContentStep>
        <ContentStep number={5} title="Multimodal">
          <p>
            Two or more peaks — maybe two customer populations mixed (students vs professionals). A single
            global mean is misleading; consider a segment flag.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Outliers — error or rare truth?">
        <p className="text-slate-300">
          An outlier is a value far from the rest. EDA&rsquo;s job is to <em>classify</em> it, not to
          delete it by reflex.
        </p>
        <div className="mt-3 overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Kind</th>
                <th className="px-4 py-3">Example</th>
                <th className="px-4 py-3">EDA action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Impossible / error', 'age = 140, probability = 1.07', 'Flag as data bug; fix or set missing'],
                ['Sentinel', 'age = −1 meaning unknown', 'Recode to missing (do not average as −1)'],
                ['Real rare tail', '₹2 crore house in a luxury area', 'Keep; maybe log/winsorise later for linear models'],
                ['Second population', 'enterprise accounts mixed with SMB', 'Consider a segment flag or separate model'],
              ].map(([k, ex, a]) => (
                <tr key={k}>
                  <td className="px-4 py-3 font-semibold text-white">{k}</td>
                  <td className="px-4 py-3 text-slate-400">{ex}</td>
                  <td className="px-4 py-3 text-slate-400">{a}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip" title="IQR rule of thumb (optional)">
          A common rule: values below Q1 − 1.5×IQR or above Q3 + 1.5×IQR are &ldquo;outside the box.&rdquo;
          Use it as a spotlight, not a death sentence. Heavy-tailed money data will always light up.
        </Callout>
      </LessonSection>

      <LessonSection title="Categorical columns — levels and rarity">
        <p className="text-slate-300">
          For a categorical column, list the unique values (levels) and their counts. Ask:
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-300">
          <li>How many levels? (2 is easy; 8 000 ZIP codes is not.)</li>
          <li>Are there typos / case variants? (&ldquo;Hyd&rdquo; vs &ldquo;HYD&rdquo; vs &ldquo;hyd&rdquo;)</li>
          <li>Are some levels extremely rare? (14 rows of &ldquo;blackberry&rdquo;)</li>
          <li>Is there a hidden order? (ticket tier) or not? (browser name)</li>
        </ul>
        <p className="mt-3 text-slate-300">
          <strong className="text-white">Cardinality</strong> = number of distinct levels. High cardinality
          needs grouping, target encoding, or hashing in feature engineering — not a naive one-hot of
          thousands of columns.
        </p>
      </LessonSection>

      <LessonSection title="Datetime and text — first-pass checks">
        <ContentStep number={1} title="Datetime">
          <p>
            Parse successfully? Timezone known? Any dates in the future relative to today? Any dates
            before the product existed? Sort and glance at the min/max.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Text">
          <p>
            Empty strings vs true missing, language mix, extreme length outliers, fields that are
            accidentally JSON dumps. For classical ML you often start with simple flags (length,
            has_url) before full NLP.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Worked problems">
        <ContentStep number={1} title="Problem 1 — Mean vs median">
          <p>Support ticket handle times (minutes): 5, 6, 7, 8, 120. Mean and median? Which would you quote to a manager as “typical”?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Mean = 29.2, median = 7. Quote the median (or both). The mean is dominated by one escalated ticket.</div>
          </div>
        </ContentStep>

        <ContentStep number={2} title="Problem 2 — Sentinel">
          <p>BMI column: min = −9, median = 24, max = 41, and 3% of rows equal −9. Interpretation?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>−9 is a missing sentinel. Recode to NaN before computing mean BMI.</div>
            <div>Leaving it will pull the mean down and create fake “low BMI” signal.</div>
          </div>
        </ContentStep>

        <ContentStep number={3} title="Problem 3 — Zero inflation">
          <p>sessions_last_week is 0 for 65% of users; the rest ranges from 1 to 40 smoothly. One feature?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Note it as zero-inflated. Later FE often creates is_active + log1p(sessions).</div>
            <div>A linear model struggles with the spike; a tree can split on =0 naturally.</div>
          </div>
        </ContentStep>

        <ContentStep number={4} title="Problem 4 — Cardinality triage">
          <p>m = 50 000. Columns: country (12 levels), city (900), device_id (49 000). Feature / ID / group?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>country: categorical feature.</div>
            <div>city: high-cardinality categorical — group rare cities or encode carefully.</div>
            <div>device_id: identifier — split/aggregation key, not a raw model input.</div>
          </div>
        </ContentStep>

        <ContentStep number={5} title="Problem 5 — Illegal values">
          <p>A column named ctr (click-through rate) has values −0.02 and 1.15. What do you do in EDA vs FE?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>EDA: mark as illegal / pipeline bug; count how many rows; alert the data producer.</div>
            <div>FE: only after policy — set missing, or clip to [0, 1] if the bug will keep shipping.</div>
          </div>
        </ContentStep>

        <ContentStep number={6} title="Problem 6 — Multimodal ages">
          <p>Age histogram shows peaks near 20 and near 45. What hypothesis belongs in the data note?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Possible mixture of segments (e.g. students vs working adults).</div>
            <div>Consider a segment feature or at least check relationships separately within each peak.</div>
          </div>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Python — describe one numeric and one categorical">
        <Example
          title="Summaries a beginner should always print"
          output={`spend: mean 186.0  median 90.0  min 10  max 800
spend skew hint: mean >> median → right skew
plan value counts:
basic    3
plus     2
nunique plan: 2`}
        >{`import numpy as np
import pandas as pd

df = pd.DataFrame({
    "spend": [10, 40, 90, 90, 800],
    "plan": ["basic", "basic", "plus", "basic", "plus"],
})

s = df["spend"]
print(f"spend: mean {s.mean():.1f}  median {s.median():.1f}  min {s.min()}  max {s.max()}")
print("spend skew hint: mean >> median → right skew" if s.mean() > 1.5 * s.median() else "not strongly right-skewed")
print("plan value counts:")
print(df["plan"].value_counts().to_string())
print("nunique plan:", df["plan"].nunique())`}</Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Univariate EDA makes each column trustworthy before you study relationships.',
          'For numbers: missing %, min/max, mean vs median, quartiles, and tail percentiles. Mean ≠ typical when skew is strong.',
          'Learn the shapes: symmetric, right/left skew, zero-inflated, multimodal — each suggests a different later fix.',
          'Outliers can be errors, sentinels, real tails, or a second population. Classify; do not auto-delete.',
          'For categories: levels, counts, typos, rarity, and whether order is real. Cardinality drives encoding choice later.',
          'Datetime and text need a first legality pass (parse, timezone, empties) even if deep NLP comes later.',
        ]}
      />
    </LessonArticle>
  )
}
