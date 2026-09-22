import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

/** Tiny helper: render a mini dataset table inside a case study. */
function DataTable({
  headers,
  rows,
}: {
  headers: string[]
  rows: (string | number | null)[][]
}) {
  return (
    <div className="mt-3 overflow-x-auto rounded-xl border border-surface-600">
      <table className="w-full min-w-[640px] text-left text-xs text-slate-300 md:text-sm">
        <thead>
          <tr className="border-b border-surface-600 bg-surface-800 text-xs uppercase tracking-wider text-slate-400">
            {headers.map((h) => (
              <th key={h} className="whitespace-nowrap px-3 py-2 font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-600 font-mono">
          {rows.map((row, i) => (
            <tr key={i} className="hover:bg-surface-800/50">
              {row.map((cell, j) => (
                <td
                  key={j}
                  className={`whitespace-nowrap px-3 py-2 ${
                    cell === null || cell === ''
                      ? 'italic text-rose-400/90'
                      : 'text-slate-200'
                  }`}
                >
                  {cell === null ? 'null' : cell === '' ? '""' : cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function TypeGrid({
  items,
}: {
  items: { col: string; dtype: string; note: string }[]
}) {
  return (
    <div className="mt-3 overflow-x-auto rounded-xl border border-surface-600">
      <table className="w-full text-sm text-slate-300">
        <thead>
          <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
            <th className="px-4 py-3">Column</th>
            <th className="px-4 py-3">Modelling type</th>
            <th className="px-4 py-3">EDA note</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-600">
          {items.map((it) => (
            <tr key={it.col}>
              <td className="px-4 py-3 font-semibold text-white">{it.col}</td>
              <td className="px-4 py-3 text-emerald-400/90">{it.dtype}</td>
              <td className="px-4 py-3 text-slate-400">{it.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function EdaCaseStudies() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Practice the whole EDA loop">
        Each case is a tiny table (10–15 rows) with real mess: nulls, sentinels, skew, rare
        categories, and one trap. Work in order: grain → types → univariate → missingness →
        target relationships → data-note bullets. Then compare with the walkthrough.
      </Callout>

      <Definition term="EDA case study">
        <p>
          A short, complete pass on one dataset: classify every column, describe distributions,
          map missingness, relate features to the target, and write decisions for feature
          engineering — without fitting a model yet.
        </p>
      </Definition>

      <LessonSection title="How to use this lesson">
        <ContentStep number={1} title="Cover the table">
          <p>Read only the business question and the raw rows. Do not scroll to the answer yet.</p>
        </ContentStep>
        <ContentStep number={2} title="Write your own data note">
          <p>
            Grain, target, types, missing %, skew / levels, one relationship finding, one risk
            (leakage / split / duplicate).
          </p>
        </ContentStep>
        <ContentStep number={3} title="Uncover the walkthrough">
          <p>Check your notes against the typed findings and the Python sketch.</p>
        </ContentStep>
      </LessonSection>

      {/* ───────── CASE 1 ───────── */}
      <LessonSection title="Case 1 — House prices (regression)">
        <p className="text-slate-300">
          <strong className="text-white">Goal:</strong> predict listing <code className="text-slate-200">price</code>{' '}
          (₹). <strong className="text-white">Grain:</strong> one row = one house listing.
        </p>
        <DataTable
          headers={['id', 'sqft', 'beds', 'city', 'year_built', 'age_years', 'price']}
          rows={[
            [1, 850, 2, 'HYD', 2001, 23, 4200000],
            [2, 1200, 3, 'BLR', 2015, 9, 7800000],
            [3, null, 2, 'HYD', 1998, 26, 5100000],
            [4, 1600, 3, 'DEL', 2020, 4, 12500000],
            [5, 1100, 2, 'BLR', 2010, 14, 6900000],
            [6, 980, 2, 'HYD', 2005, null, 4800000],
            [7, 2200, 4, 'DEL', 2018, 6, 15800000],
            [8, 750, 1, 'BLR', 1995, 29, 3900000],
            [9, 1400, 3, '', 2012, 12, 8200000],
            [10, 1050, 2, 'HYD', 2008, 16, 5500000],
            [11, 3100, 5, 'DEL', 2021, 3, 24500000],
            [12, 900, 2, 'BLR', 2003, 21, null],
          ]}
        />
        <Callout variant="tip" title="Your turn first">
          Classify types. Spot missing cells. Is price skewed? Is <code className="text-slate-200">id</code> a
          feature? What split would you demand?
        </Callout>

        <h3 className="mt-6 text-base font-semibold text-white">Walkthrough</h3>
        <TypeGrid
          items={[
            { col: 'id', dtype: 'Identifier', note: 'Key only — never a model input' },
            { col: 'sqft', dtype: 'Numeric continuous', note: '1 null (row 3); right-skewed if luxury in mix' },
            { col: 'beds', dtype: 'Numeric discrete / count', note: 'Complete; small integers' },
            { col: 'city', dtype: 'Categorical (nominal)', note: 'Empty string on row 9 → treat as null' },
            { col: 'year_built', dtype: 'Numeric / datetime-year', note: 'Complete; can derive age' },
            { col: 'age_years', dtype: 'Numeric continuous', note: '1 null; should ≈ now − year_built' },
            { col: 'price', dtype: 'Target (continuous)', note: '1 null (row 12); long right tail (DEL 3BHK+)' },
          ]}
        />
        <ContentStep number={1} title="Distributions">
          <p>
            <code className="text-slate-200">price</code>: median around 6–7L range in this toy set; mean
            pulled up by 1.58Cr and 2.45Cr rows → <strong className="text-white">right skew</strong>. Log
            later for linear models. <code className="text-slate-200">sqft</code> same story (3100 outlier).
          </p>
        </ContentStep>
        <ContentStep number={2} title="Missingness">
          <p>
            sqft null once, age_years null once, city blank once, price null once. Price-null row cannot
            train a supervised model — drop for training or hold for semi-supervised later. City blank ≠
            a real city level.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Relationships">
          <p>
            Larger sqft / more beds / DEL tend toward higher price. age_years should anticorrelate with
            year_built (redundant pair — keep one).
          </p>
        </ContentStep>
        <ContentStep number={4} title="Data-note bullets">
          <p>
            Grain = listing. Target = price (skewed). Drop id. Recode city &quot;&quot; → null. Prefer median
            over mean for fills. Random split OK if listings are independent (no repeated seller id here).
          </p>
        </ContentStep>
        <Example
          title="Python sketch — Case 1"
          output={`shape: (12, 7)
missing %: {'sqft': 8.3, 'city': 8.3, 'age_years': 8.3, 'price': 8.3}
price: mean≈8.3M  median≈6.9M  → right skew
city levels: {'HYD': 4, 'BLR': 4, 'DEL': 3}`}
        >{`import numpy as np
import pandas as pd

df = pd.DataFrame({
    "id": range(1, 13),
    "sqft": [850, 1200, np.nan, 1600, 1100, 980, 2200, 750, 1400, 1050, 3100, 900],
    "beds": [2, 3, 2, 3, 2, 2, 4, 1, 3, 2, 5, 2],
    "city": ["HYD", "BLR", "HYD", "DEL", "BLR", "HYD", "DEL", "BLR", "", "HYD", "DEL", "BLR"],
    "year_built": [2001, 2015, 1998, 2020, 2010, 2005, 2018, 1995, 2012, 2008, 2021, 2003],
    "age_years": [23, 9, 26, 4, 14, np.nan, 6, 29, 12, 16, 3, 21],
    "price": [4.2e6, 7.8e6, 5.1e6, 12.5e6, 6.9e6, 4.8e6, 15.8e6, 3.9e6, 8.2e6, 5.5e6, 24.5e6, np.nan],
})
df["city"] = df["city"].replace("", np.nan)
print("missing %:", (df.isna().mean() * 100).round(1).to_dict())
p = df["price"].dropna()
print(f"price: mean≈{p.mean()/1e6:.1f}M  median≈{p.median()/1e6:.1f}M")
print("city levels:", df["city"].value_counts().to_dict())`}</Example>
      </LessonSection>

      {/* ───────── CASE 2 ───────── */}
      <LessonSection title="Case 2 — Customer churn (binary classification)">
        <p className="text-slate-300">
          <strong className="text-white">Goal:</strong> predict <code className="text-slate-200">churn_next</code>{' '}
          (1 = cancels next month). <strong className="text-white">Grain:</strong> customer × month.
        </p>
        <DataTable
          headers={['customer_id', 'month', 'age', 'plan', 'tenure_m', 'spend', 'tickets', 'churn_next']}
          rows={[
            [101, '2024-01', 28, 'basic', 4, 120, 0, 0],
            [101, '2024-02', 28, 'basic', 5, 80, 1, 1],
            [102, '2024-01', 35, 'plus', 18, 200, 0, 0],
            [103, '2024-01', -1, 'basic', 2, 50, 3, 1],
            [103, '2024-02', -1, 'basic', 3, null, 2, 1],
            [104, '2024-01', 41, 'plus', 24, 90, 0, 0],
            [104, '2024-02', 41, 'plus', 25, 95, 0, 0],
            [105, '2024-01', 22, 'basic', 1, 40, 4, 1],
            [106, '2024-01', 55, 'plus', 36, 310, 0, 0],
            [106, '2024-02', 55, 'plus', 37, 280, 1, 0],
            [107, '2024-01', null, 'basic', 6, 70, 0, 0],
            [108, '2024-01', 33, 'plus', 12, 150, null, 0],
            [108, '2024-02', 33, 'plus', 13, 155, 0, 1],
          ]}
        />
        <h3 className="mt-6 text-base font-semibold text-white">Walkthrough</h3>
        <TypeGrid
          items={[
            { col: 'customer_id', dtype: 'Identifier / group key', note: 'Split by customer — not a feature' },
            { col: 'month', dtype: 'Datetime / period', note: 'Part of grain; time-aware CV later' },
            { col: 'age', dtype: 'Numeric continuous', note: '−1 is a sentinel; also true nulls' },
            { col: 'plan', dtype: 'Categorical', note: 'basic / plus — complete' },
            { col: 'tenure_m', dtype: 'Numeric count', note: 'Complete; often predictive' },
            { col: 'spend', dtype: 'Numeric continuous', note: '1 null; mild right skew (310)' },
            { col: 'tickets', dtype: 'Numeric count', note: '1 null; zero-inflated (many 0s)' },
            { col: 'churn_next', dtype: 'Target (binary)', note: '≈5/13 ≈ 38% here — still check in full data' },
          ]}
        />
        <ContentStep number={1} title="Distributions & sentinels">
          <p>
            Replace age <code className="text-slate-200">-1 → null</code> before any mean. tickets spike at 0 —
            note zero-inflation. spend has a high tail (310) vs many 40–150 values.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Missingness vs target">
          <p>
            Rows with age missing / sentinel (103, 107) include churners — missingness may carry signal.
            Keep <code className="text-slate-200">is_age_missing</code> later.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Relationships">
          <p>
            Higher tickets → more churn in this toy. basic appears riskier than plus. tenure low among
            churners (1–5 months).
          </p>
        </ContentStep>
        <ContentStep number={4} title="Split trap">
          <p>
            Customer 101, 103, 104, 106, 108 have two months. A random row split leaks the person into
            both sides. <strong className="text-white">Group-split by customer_id</strong> (and prefer
            time order if predicting next month from history).
          </p>
        </ContentStep>
        <Example
          title="Python sketch — Case 2"
          output={`age missing after sentinel fix: 3
churn rate by plan: basic≈0.57  plus≈0.17
tickets mean by churn: 0→0.25  1→2.0`}
        >{`import numpy as np
import pandas as pd

df = pd.DataFrame({
    "customer_id": [101,101,102,103,103,104,104,105,106,106,107,108,108],
    "month": ["2024-01","2024-02","2024-01","2024-01","2024-02","2024-01","2024-02",
              "2024-01","2024-01","2024-02","2024-01","2024-01","2024-02"],
    "age": [28,28,35,-1,-1,41,41,22,55,55,np.nan,33,33],
    "plan": ["basic","basic","plus","basic","basic","plus","plus","basic","plus","plus","basic","plus","plus"],
    "tenure_m": [4,5,18,2,3,24,25,1,36,37,6,12,13],
    "spend": [120,80,200,50,np.nan,90,95,40,310,280,70,150,155],
    "tickets": [0,1,0,3,2,0,0,4,0,1,0,np.nan,0],
    "churn_next": [0,1,0,1,1,0,0,1,0,0,0,0,1],
})
df["age"] = df["age"].replace(-1, np.nan)
print("age missing:", int(df["age"].isna().sum()))
print(df.groupby("plan")["churn_next"].mean().round(2).to_dict())
print(df.groupby("churn_next")["tickets"].mean().round(2).to_dict())`}</Example>
      </LessonSection>

      {/* ───────── CASE 3 ───────── */}
      <LessonSection title="Case 3 — Support ticket handle time (regression, skewed)">
        <p className="text-slate-300">
          <strong className="text-white">Goal:</strong> predict <code className="text-slate-200">handle_min</code>{' '}
          (minutes to resolve). <strong className="text-white">Grain:</strong> one ticket.
        </p>
        <DataTable
          headers={['ticket_id', 'channel', 'priority', 'agent_exp_y', 'words', 'reopens', 'handle_min']}
          rows={[
            ['T01', 'email', 'low', 2, 40, 0, 25],
            ['T02', 'chat', 'medium', 5, 12, 0, 8],
            ['T03', 'email', 'high', 1, 220, 2, 180],
            ['T04', 'phone', 'medium', null, 30, 0, 45],
            ['T05', 'chat', 'low', 4, 8, 0, 6],
            ['T06', 'email', 'high', 3, null, 1, 95],
            ['T07', 'phone', 'low', 6, 15, 0, 20],
            ['T08', 'email', 'medium', 2, 90, 0, 55],
            ['T09', 'chat', 'high', 1, 25, 3, 240],
            ['T10', 'email', 'low', 8, 50, 0, 18],
            ['T11', 'phone', 'medium', 3, 22, null, 40],
            ['T12', 'email', 'high', 2, 300, 1, 400],
            ['T13', '', 'low', 4, 10, 0, 12],
            ['T14', 'chat', 'medium', 5, 18, 0, null],
          ]}
        />
        <h3 className="mt-6 text-base font-semibold text-white">Walkthrough</h3>
        <TypeGrid
          items={[
            { col: 'ticket_id', dtype: 'Identifier', note: 'Key only' },
            { col: 'channel', dtype: 'Categorical', note: 'Blank on T13 → null; 3 levels' },
            { col: 'priority', dtype: 'Ordinal', note: 'low < medium < high — order is real' },
            { col: 'agent_exp_y', dtype: 'Numeric continuous', note: '1 null' },
            { col: 'words', dtype: 'Numeric count', note: '1 null; right-skewed (220, 300)' },
            { col: 'reopens', dtype: 'Numeric count', note: '1 null; zero-inflated' },
            { col: 'handle_min', dtype: 'Target (continuous)', note: '1 null; heavy right skew (400)' },
          ]}
        />
        <ContentStep number={1} title="Distributions">
          <p>
            handle_min: many tickets under 60, a few at 180 / 240 / 400 → classic support skew. Mean ≫
            median. Candidate for <code className="text-slate-200">log1p</code> on y for linear models.
            words same shape.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Ordinal encoding foreshadow">
          <p>
            priority is ordinal — do not one-hot blindly if you believe equal spacing is OK for a first
            linear model; trees can use ordinal codes or one-hot. Document the order in the data note.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Relationships">
          <p>
            high priority and reopens ≥ 1 sit with long handle times. chat often short unless high +
            reopens (T09).
          </p>
        </ContentStep>
        <Example
          title="Python sketch — Case 3"
          output={`handle_min: mean≈95  median≈40  → strong right skew
priority vs median handle: low=18  medium=42.5  high=180`}
        >{`import numpy as np
import pandas as pd

df = pd.DataFrame({
    "channel": ["email","chat","email","phone","chat","email","phone","email","chat","email","phone","email","","chat"],
    "priority": ["low","medium","high","medium","low","high","low","medium","high","low","medium","high","low","medium"],
    "handle_min": [25,8,180,45,6,95,20,55,240,18,40,400,12,np.nan],
})
df["channel"] = df["channel"].replace("", np.nan)
h = df["handle_min"].dropna()
print(f"handle_min: mean≈{h.mean():.0f}  median≈{h.median():.0f}")
print(df.groupby("priority")["handle_min"].median().to_dict())`}</Example>
      </LessonSection>

      {/* ───────── CASE 4 ───────── */}
      <LessonSection title="Case 4 — Store × SKU daily demand (time series style)">
        <p className="text-slate-300">
          <strong className="text-white">Goal:</strong> forecast next-day{' '}
          <code className="text-slate-200">units_sold</code>.{' '}
          <strong className="text-white">Grain:</strong> store × sku × date.
        </p>
        <DataTable
          headers={['store', 'sku', 'date', 'promo', 'price', 'units_sold', 'holiday']}
          rows={[
            ['S1', 'A', '2024-03-01', 0, 99, 12, 0],
            ['S1', 'A', '2024-03-02', 0, 99, 10, 0],
            ['S1', 'A', '2024-03-03', 1, 79, 28, 0],
            ['S1', 'B', '2024-03-01', 0, 49, 5, 0],
            ['S1', 'B', '2024-03-02', null, 49, 4, 0],
            ['S1', 'B', '2024-03-03', 1, 39, 15, 0],
            ['S2', 'A', '2024-03-01', 0, 99, 8, 0],
            ['S2', 'A', '2024-03-02', 0, 99, null, 0],
            ['S2', 'A', '2024-03-03', 1, 79, 22, 0],
            ['S2', 'B', '2024-03-01', 0, 49, 3, 0],
            ['S2', 'B', '2024-03-02', 0, 49, 2, 0],
            ['S2', 'B', '2024-03-03', 1, 39, 11, 1],
            ['S1', 'A', '2024-03-01', 0, 99, 12, 0],
          ]}
        />
        <Callout variant="insight" title="Spot the duplicate">
          Last row repeats S1 / A / 2024-03-01 exactly. Exact duplicate — remove before any metric.
        </Callout>
        <h3 className="mt-6 text-base font-semibold text-white">Walkthrough</h3>
        <TypeGrid
          items={[
            { col: 'store, sku, date', dtype: 'Composite key', note: 'Must be unique after dedupe' },
            { col: 'promo', dtype: 'Boolean / binary', note: '1 null; 1 = discount day' },
            { col: 'price', dtype: 'Numeric continuous', note: 'Complete; drops on promo days' },
            { col: 'units_sold', dtype: 'Target (count)', note: '1 null; higher on promo' },
            { col: 'holiday', dtype: 'Boolean', note: 'Rare 1 — tiny n, do not over-trust' },
          ]}
        />
        <ContentStep number={1} title="Distributions">
          <p>
            units_sold: small integers, jumps on promo (28, 22, 15, 11). Not Gaussian — count-like.
            holiday almost always 0 in this window.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Relationships">
          <p>
            promo=1 ↔ lower price ↔ higher units. price and promo are near-redundant for a tiny model —
            note multicollinearity.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Split">
          <p>
            Never shuffle days. Train on earlier dates, test on later (here: train Mar 1–2, test Mar 3).
            Features at day t must not use units from day t+1.
          </p>
        </ContentStep>
        <Example
          title="Python sketch — Case 4"
          output={`exact duplicate rows: 1
key uniqueness after drop: True
mean units promo=0: ~6.3   promo=1: ~19.0`}
        >{`import numpy as np
import pandas as pd

df = pd.DataFrame({
    "store": ["S1"]*6 + ["S2"]*6 + ["S1"],
    "sku": ["A","A","A","B","B","B","A","A","A","B","B","B","A"],
    "date": ["2024-03-01","2024-03-02","2024-03-03"]*4 + ["2024-03-01"],
    "promo": [0,0,1,0,np.nan,1,0,0,1,0,0,1,0],
    "price": [99,99,79,49,49,39,99,99,79,49,49,39,99],
    "units_sold": [12,10,28,5,4,15,8,np.nan,22,3,2,11,12],
    "holiday": [0,0,0,0,0,0,0,0,0,0,0,1,0],
})
print("exact duplicates:", int(df.duplicated().sum()))
df = df.drop_duplicates()
print("key unique:", not df.duplicated(["store","sku","date"]).any())
print(df.groupby("promo")["units_sold"].mean().round(1).to_dict())`}</Example>
      </LessonSection>

      {/* ───────── CASE 5 ───────── */}
      <LessonSection title="Case 5 — Loan default (rare event + leakage smell)">
        <p className="text-slate-300">
          <strong className="text-white">Goal:</strong> predict <code className="text-slate-200">defaulted</code>{' '}
          at application time. <strong className="text-white">Grain:</strong> one loan application.
        </p>
        <DataTable
          headers={['loan_id', 'income', 'credit_score', 'loan_amt', 'emp_years', 'purpose', 'recovery_amt', 'defaulted']}
          rows={[
            ['L01', 720000, 710, 200000, 5, 'home', 0, 0],
            ['L02', 480000, 640, 150000, 2, 'auto', 0, 0],
            ['L03', null, 580, 300000, 1, 'personal', 45000, 1],
            ['L04', 900000, 750, 250000, 8, 'home', 0, 0],
            ['L05', 360000, 610, 120000, null, 'auto', 0, 0],
            ['L06', 520000, 590, 400000, 0, 'personal', 120000, 1],
            ['L07', 1100000, 780, 500000, 12, 'home', 0, 0],
            ['L08', 400000, 560, 180000, 1, 'auto', 80000, 1],
            ['L09', 650000, 700, 220000, 4, 'home', 0, 0],
            ['L10', '', 620, 160000, 3, 'personal', 0, 0],
            ['L11', 550000, null, 210000, 2, 'auto', 0, 0],
            ['L12', 300000, 540, 350000, 0, 'personal', 200000, 1],
            ['L13', 800000, 730, 280000, 6, 'home', 0, 0],
            ['L14', 450000, 600, 190000, 2, '', 15000, 1],
            ['L15', 980000, 760, 320000, 9, 'home', 0, 0],
          ]}
        />
        <h3 className="mt-6 text-base font-semibold text-white">Walkthrough</h3>
        <TypeGrid
          items={[
            { col: 'loan_id', dtype: 'Identifier', note: 'Key only' },
            { col: 'income', dtype: 'Numeric continuous', note: 'null + empty string; right skew' },
            { col: 'credit_score', dtype: 'Numeric continuous', note: '1 null; lower among defaults' },
            { col: 'loan_amt', dtype: 'Numeric continuous', note: 'Complete' },
            { col: 'emp_years', dtype: 'Numeric continuous', note: '1 null; 0 = new / unemployed?' },
            { col: 'purpose', dtype: 'Categorical', note: '1 blank → null' },
            { col: 'recovery_amt', dtype: 'LEAKAGE — post-default', note: 'Known only after default/collections' },
            { col: 'defaulted', dtype: 'Target (binary)', note: '5/15 = 33% here; real portfolios are rarer' },
          ]}
        />
        <ContentStep number={1} title="Freeze-time test">
          <p>
            <code className="text-slate-200">recovery_amt</code> is money recovered after a default. At
            application time it is always 0 / unknown. It nearly encodes the label (nonzero ↔ defaulted).
            <strong className="text-white"> Drop it from features.</strong> Suspiciously perfect AUC if you keep it.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Distributions">
          <p>
            income: empty string on L10 — parse as null. Defaults cluster at lower credit_score and higher
            loan_amt / income ratio. emp_years = 0 among several defaults — define whether 0 means
            &ldquo;missing&rdquo; or &ldquo;zero tenure.&rdquo;
          </p>
        </ContentStep>
        <ContentStep number={3} title="Class rate">
          <p>
            Even in this toy, write the positive rate. In production, defaults may be 2–5% — accuracy is
            the wrong headline metric.
          </p>
        </ContentStep>
        <Example
          title="Python sketch — Case 5"
          output={`recovery_amt > 0 only when defaulted=1 → leakage smell
corr-like: mean credit_score default0≈710  default1≈574`}
        >{`import numpy as np
import pandas as pd

df = pd.DataFrame({
    "income": [720e3,480e3,np.nan,900e3,360e3,520e3,1100e3,400e3,650e3,"",550e3,300e3,800e3,450e3,980e3],
    "credit_score": [710,640,580,750,610,590,780,560,700,620,np.nan,540,730,600,760],
    "recovery_amt": [0,0,45000,0,0,120000,0,80000,0,0,0,200000,0,15000,0],
    "defaulted": [0,0,1,0,0,1,0,1,0,0,0,1,0,1,0],
})
df["income"] = pd.to_numeric(df["income"], errors="coerce")
print("recovery>0 rows:", df.loc[df["recovery_amt"] > 0, "defaulted"].tolist())
print(df.groupby("defaulted")["credit_score"].mean().round(0).to_dict())`}</Example>
      </LessonSection>

      {/* ───────── CASE 6 ───────── */}
      <LessonSection title="Case 6 — Course completion (mixed types + MNAR hint)">
        <p className="text-slate-300">
          <strong className="text-white">Goal:</strong> predict{' '}
          <code className="text-slate-200">completed</code> (finished the course).{' '}
          <strong className="text-white">Grain:</strong> one learner enrollment.
        </p>
        <DataTable
          headers={['user_id', 'track', 'hours_watched', 'quiz_avg', 'forum_posts', 'device', 'nps', 'completed']}
          rows={[
            [1, 'python', 12.5, 78, 2, 'desktop', 9, 1],
            [2, 'sql', 3.0, 55, 0, 'mobile', null, 0],
            [3, 'python', 20.0, 88, 5, 'desktop', 10, 1],
            [4, 'ml', 1.5, null, 0, 'mobile', null, 0],
            [5, 'sql', 8.0, 70, 1, 'desktop', 7, 1],
            [6, 'ml', 15.0, 82, 3, 'desktop', 8, 1],
            [7, 'python', 0.5, null, 0, 'mobile', null, 0],
            [8, 'sql', 6.5, 60, 0, 'tablet', 6, 0],
            [9, 'ml', 11.0, 75, null, 'desktop', 9, 1],
            [10, 'python', 4.0, 50, 0, 'mobile', null, 0],
            [11, 'sql', null, 65, 1, 'desktop', 8, 1],
            [12, 'ml', 2.0, 40, 0, 'mobile', null, 0],
            [13, 'python', 18.0, 91, 4, 'desktop', 10, 1],
            [14, 'sql', 9.0, 72, 2, '', 7, 1],
            [15, 'ml', 0.0, null, 0, 'mobile', null, 0],
          ]}
        />
        <h3 className="mt-6 text-base font-semibold text-white">Walkthrough</h3>
        <TypeGrid
          items={[
            { col: 'user_id', dtype: 'Identifier', note: 'Key; one row per enrollment here' },
            { col: 'track', dtype: 'Categorical', note: 'python / sql / ml' },
            { col: 'hours_watched', dtype: 'Numeric continuous', note: '1 null; zero-inflated (0.0, 0.5)' },
            { col: 'quiz_avg', dtype: 'Numeric continuous', note: 'Many nulls among non-completers' },
            { col: 'forum_posts', dtype: 'Numeric count', note: '1 null; zero-inflated' },
            { col: 'device', dtype: 'Categorical', note: 'Blank → null; mobile vs desktop split' },
            { col: 'nps', dtype: 'Ordinal 0–10', note: 'Missing mostly when completed=0' },
            { col: 'completed', dtype: 'Target (binary)', note: '~8/15 completed in toy sample' },
          ]}
        />
        <ContentStep number={1} title="MNAR-style story">
          <p>
            NPS and quiz_avg are blank mainly for people who never finished — they never saw the survey /
            never took quizzes. Filling NPS with the global mean invents happy scores for dropouts.
            Prefer missing flags; only impute within the population that could have answered.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Distributions">
          <p>
            hours_watched separates classes cleanly (completers mostly &gt; 6h). mobile + low hours ↔
            incomplete. forum_posts mostly 0 for dropouts.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Data-note bullets">
          <p>
            Recode device &quot;&quot; → null. Do not treat nps as MCAR. hours_watched is the strongest
            simple signal — still check it is measured before the completion label cutoff (freeze time).
          </p>
        </ContentStep>
        <Example
          title="Python sketch — Case 6"
          output={`nps missing rate: completed0=1.00  completed1≈0.12
hours median: completed0=2.0  completed1=11.75`}
        >{`import numpy as np
import pandas as pd

df = pd.DataFrame({
    "hours_watched": [12.5,3,20,1.5,8,15,0.5,6.5,11,4,np.nan,2,18,9,0],
    "nps": [9,np.nan,10,np.nan,7,8,np.nan,6,9,np.nan,8,np.nan,10,7,np.nan],
    "device": ["desktop","mobile","desktop","mobile","desktop","desktop","mobile","tablet",
              "desktop","mobile","desktop","mobile","desktop","","mobile"],
    "completed": [1,0,1,0,1,1,0,0,1,0,1,0,1,1,0],
})
df["device"] = df["device"].replace("", np.nan)
print(df.groupby("completed")["nps"].apply(lambda s: s.isna().mean()).round(2).to_dict())
print(df.groupby("completed")["hours_watched"].median().to_dict())`}</Example>
      </LessonSection>

      <LessonSection title="Cross-case checklist (print this)">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Check</th>
                <th className="px-4 py-3">Cases that hammer it</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Grain + primary key', '1, 2, 4'],
                ['IDs are not features', 'All'],
                ['Sentinels (−1) vs true null', '2'],
                ['Empty string ≠ a category', '1, 3, 5, 6'],
                ['Right skew / log later', '1, 3, 5'],
                ['Zero-inflation', '2, 3, 6'],
                ['Ordinal vs nominal', '3 (priority), 6 (nps)'],
                ['Missingness linked to target', '2, 6'],
                ['Duplicates', '4'],
                ['Time / group split', '2, 4'],
                ['Target leakage column', '5 (recovery_amt)'],
                ['Drop rows with null target', '1, 3'],
              ].map(([check, cases]) => (
                <tr key={check}>
                  <td className="px-4 py-3 font-semibold text-white">{check}</td>
                  <td className="px-4 py-3 text-slate-400">{cases}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Six tiny tables cover the full EDA loop: types, distributions, missingness, relationships, and traps.',
          'Always classify modelling type before you trust a mean, a one-hot, or a correlation.',
          'null, "", and sentinels like −1 are different bugs — normalize them before summaries.',
          'Skew, zero-inflation, and ordinal columns change what “typical” means and what FE will do next.',
          'Missingness that tracks the target is a finding, not just a hole to fill.',
          'Duplicates, group/time splits, and post-outcome columns (leakage) decide whether your score is real.',
          'End every case with a short data note — that is the handoff to Feature Engineering.',
        ]}
      />
    </LessonArticle>
  )
}
