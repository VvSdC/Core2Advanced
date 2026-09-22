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

export function FirstLookAtData() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="This lesson is the first hour with a new file">
        Before histograms and correlations, you need three boring facts: how big the table is, what
        one row means, and what the target column is. Skip these and every later plot will be
        ambiguous.
      </Callout>

      <Definition term="First look">
        <p>
          The first look is a structured pass over <strong className="text-white">shape</strong>,{' '}
          <strong className="text-white">grain</strong>, <strong className="text-white">column types</strong>,
          and the <strong className="text-white">target</strong>. You are building a mental model of the
          spreadsheet as a list of examples a machine will learn from.
        </p>
      </Definition>

      <LessonSection title="Picture a spreadsheet — that is the dataset">
        <p className="text-slate-300">
          In classical ML, almost everything starts as a table:
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Rows</strong> = examples (one house, one email, one customer-month).
          </li>
          <li>
            <strong className="text-white">Columns</strong> = fields. Most are features (inputs). One is often
            the label / target (the answer).
          </li>
          <li>
            <strong className="text-white">Cells</strong> = values. Numbers, text, dates, or empty.
          </li>
        </ul>
        <Example title="House prices — five rows">
{`row  sqft  beds  city   year_built  price
1    850   2     HYD    2001        4200000
2    1200  3     BLR    2015        7800000
3    980   2     HYD    1998        5100000
4    1600  3     DEL    2020        12500000
5    1100  2     BLR    2010        6900000

Features: sqft, beds, city, year_built
Target:   price
Grain:    one row = one house listing`}
        </Example>
        <Flowchart
          title="From file to learning problem"
          chart={`flowchart LR
  A[Raw table] --> B[Name the grain]
  B --> C[Find the target]
  C --> D[Classify each column]
  D --> E[Data note draft]`}
        />
      </LessonSection>

      <LessonSection title="Shape — how much data do you have?">
        <p className="text-slate-300">
          Shape is simply <code className="text-slate-200">(number of rows, number of columns)</code>. It
          tells you whether you are in a &ldquo;tiny careful&rdquo; regime or a &ldquo;large messy&rdquo; regime.
        </p>
        <div className="mt-3 overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Rough size</th>
                <th className="px-4 py-3">What it usually implies</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['< 500 rows', 'Simple models, strong regularisation, beware overfitting'],
                ['Thousands', 'Most classical algorithms are comfortable'],
                ['Hundreds of thousands+', 'Watch memory, duplicates, and slow plots — sample for visuals'],
                ['Many columns, few rows', 'High risk of nonsense correlations — need selection / domain filters'],
              ].map(([size, imply]) => (
                <tr key={size}>
                  <td className="px-4 py-3 font-semibold text-white">{size}</td>
                  <td className="px-4 py-3 text-slate-400">{imply}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip" title="Head, tail, and sample">
          Always print the first few rows, the last few rows, and a random sample. Bugs love to hide at
          the end of a file (a footer, a total row, a truncated export).
        </Callout>
      </LessonSection>

      <LessonSection title="Grain — the most important sentence you will write">
        <Definition term="Grain">
          <p>
            The grain is the answer to: <strong className="text-white">&ldquo;What does one row uniquely
            represent?&rdquo;</strong> Until this is clear, metrics, joins, and splits are all fuzzy.
          </p>
        </Definition>
        <div className="mt-3 overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Business question</th>
                <th className="px-4 py-3">Likely grain</th>
                <th className="px-4 py-3">Common mistake</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Will this customer churn next month?', 'customer × month', 'Treating every login as a row'],
                ['Will this claim be fraudulent?', 'one claim', 'Mixing claim lines and claim headers'],
                ['What will tomorrow’s demand be?', 'store × day (or SKU × day)', 'Shuffling days randomly'],
                ['Is this email spam?', 'one email', 'Concatenating thread messages incorrectly'],
              ].map(([q, g, m]) => (
                <tr key={q}>
                  <td className="px-4 py-3 text-slate-300">{q}</td>
                  <td className="px-4 py-3 font-semibold text-white">{g}</td>
                  <td className="px-4 py-3 text-slate-400">{m}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-slate-300">
          Practical test: name the columns that should be unique together (a primary key). If{' '}
          <code className="text-slate-200">customer_id + month</code> still has duplicates, your grain is
          broken or your export is.
        </p>
      </LessonSection>

      <LessonSection title="Column types — what kind of information is this?">
        <p className="text-slate-300">
          Computers store dtypes (int, float, object, datetime). Humans need a modelling type:
        </p>
        <div className="mt-3 overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Modelling type</th>
                <th className="px-4 py-3">Examples</th>
                <th className="px-4 py-3">Beginner rule</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Numeric continuous', 'price, temperature, age', 'Can average; watch units and skew'],
                ['Numeric discrete / count', 'num_logins, rooms', 'Often skewed; 0 may mean “never”'],
                ['Categorical (nominal)', 'city, colour, browser', 'Names without order'],
                ['Ordinal', 'education level, ticket tier', 'Order matters (S < M < L)'],
                ['Datetime', 'signup_at, order_date', 'Turn into parts / lags later — keep timezone notes'],
                ['Identifier', 'user_id, order_id', 'Key for joins/splits — not a raw feature'],
                ['Text', 'review body, ticket title', 'Needs special handling later'],
                ['Boolean', 'is_premium', 'Already almost a feature'],
              ].map(([t, ex, rule]) => (
                <tr key={t}>
                  <td className="px-4 py-3 font-semibold text-white">{t}</td>
                  <td className="px-4 py-3 text-slate-400">{ex}</td>
                  <td className="px-4 py-3 text-slate-400">{rule}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="insight" title="Dtype lies">
          A ZIP code stored as an integer is not a quantity you should average. A category stored as
          1/2/3 is not automatically ordinal. Always ask what the number <em>means</em>, not only how
          pandas typed it.
        </Callout>
      </LessonSection>

      <LessonSection title="Meet the target first">
        <p className="text-slate-300">
          After grain, stare at the target before other features. You need to know what &ldquo;success&rdquo;
          looks like.
        </p>
        <ContentStep number={1} title="Regression target (a number)">
          <p>
            Check min, max, median, units, and impossible values (negative prices, ages of 300). A long
            right tail (many small values, few huge ones) is common for money — you will often log it later.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Classification target (a category)">
          <p>
            Count each class. If one class is 1% of rows, accuracy is a dangerous headline. Write the
            class rate into the data note on day one.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Definition clarity">
          <p>
            &ldquo;Churn&rdquo; might mean cancelled, unpaid, or inactive for 30 days. Different definitions
            change every feature and every metric. Get the written definition from the business owner.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Constant, empty, and ID-like columns">
        <ul className="list-disc space-y-1 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Constant column</strong> — every row the same. Drop it; it cannot
            help prediction and will break if a new value appears later.
          </li>
          <li>
            <strong className="text-white">Almost empty</strong> — 95%+ missing. Note it; often drop or keep
            only a missingness flag (next lessons).
          </li>
          <li>
            <strong className="text-white">ID-like</strong> — unique (or nearly unique) per row. Great as a
            key. Terrible as a one-hot feature (the model memorises identities).
          </li>
        </ul>
      </LessonSection>

      <LessonSection title="Worked problems">
        <ContentStep number={1} title="Problem 1 — Shape reading">
          <p>A file has shape (250, 180). What worry should jump out?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Many columns, few rows. Easy to overfit and find fake correlations.</div>
            <div>Plan: strong domain filtering, regularisation, or dimensionality reduction — and humble metrics.</div>
          </div>
        </ContentStep>

        <ContentStep number={2} title="Problem 2 — Pick the grain">
          <p>
            Table columns: store_id, date, sku, units_sold, promo_flag. Goal: forecast next-day units for
            each product in each store. Grain?
          </p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>store_id × sku × date.</div>
            <div>Primary key should be unique on those three. Split must respect time (train past, test future).</div>
          </div>
        </ContentStep>

        <ContentStep number={3} title="Problem 3 — Wrong type">
          <p>Column rating takes values &ldquo;low&rdquo;, &ldquo;medium&rdquo;, &ldquo;high&rdquo;. Someone encodes them as 0, 1, 2 for linear regression. Fine?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Only if you believe the gaps are equal (medium−low = high−medium).</div>
            <div>If unsure, treat as ordinal carefully or one-hot. Trees can split on 0/1/2 more safely than linear models can.</div>
          </div>
        </ContentStep>

        <ContentStep number={4} title="Problem 4 — Target health">
          <p>Binary fraud label: 400 positives out of 200 000 rows. What do you write immediately?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Positive rate = 0.2%. Stratified split. Metric ≠ accuracy (prefer PR-AUC / recall at a cost threshold).</div>
          </div>
        </ContentStep>

        <ContentStep number={5} title="Problem 5 — Is user_id a feature?">
          <p>Churn table includes user_id. Should the model receive it as an input column?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>No as a raw one-hot / numeric code — that memorizes people.</div>
            <div>Yes as a grouping key for the split, and maybe later as a source of historical aggregates (past months only).</div>
          </div>
        </ContentStep>

        <ContentStep number={6} title="Problem 6 — Footer contamination">
          <p>The last row of a CSV has sqft blank and price = &ldquo;TOTAL&rdquo;. What happened?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>An export footer. Drop it before any analysis. This is why you inspect head and tail.</div>
          </div>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Python — first-look checklist">
        <Example
          title="Shape, grain key, dtypes, target summary"
          output={`shape: (5, 6)
key uniqueness (customer_id, month): True
dtypes:
customer_id     int64
month          object
age           float64
plan           object
spend           int64
churn           int64
target rate: 0.40
nunique: {'customer_id': 3, 'plan': 2, 'month': 3}`}
        >{`import pandas as pd

df = pd.DataFrame({
    "customer_id": [1, 1, 2, 3, 3],
    "month": ["2024-01", "2024-02", "2024-01", "2024-01", "2024-02"],
    "age": [28.0, 28.0, 35.0, None, 41.0],
    "plan": ["basic", "basic", "plus", "basic", "plus"],
    "spend": [120, 80, 200, 50, 90],
    "churn": [0, 1, 0, 0, 1],
})

print(f"shape: {df.shape}")
key_ok = not df.duplicated(["customer_id", "month"]).any()
print(f"key uniqueness (customer_id, month): {key_ok}")
print("dtypes:\\n" + df.dtypes.astype(str).to_string())
print(f"target rate: {df['churn'].mean():.2f}")
print("nunique:", df[["customer_id", "plan", "month"]].nunique().to_dict())`}</Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'A dataset is a table: rows are examples, columns are features or the target. Start by seeing it that way.',
          'Shape tells you the regime (tiny vs huge, wide vs tall). Always inspect head, tail, and a sample.',
          'Grain is the sentence “one row = …”. Name the unique key. Broken grain breaks everything downstream.',
          'Assign a modelling type to each column (numeric, categorical, ordinal, datetime, ID, text). Do not trust dtypes blindly.',
          'Study the target early: units, range, class rate, and the exact business definition.',
          'Drop constants; treat IDs as keys not features; note near-empty columns for later decisions.',
        ]}
      />
    </LessonArticle>
  )
}
