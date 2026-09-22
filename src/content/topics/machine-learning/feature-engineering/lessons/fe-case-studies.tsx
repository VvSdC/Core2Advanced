import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

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

function FeGrid({
  items,
}: {
  items: { col: string; action: string; detail: string }[]
}) {
  return (
    <div className="mt-3 overflow-x-auto rounded-xl border border-surface-600">
      <table className="w-full text-sm text-slate-300">
        <thead>
          <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
            <th className="px-4 py-3">Column / new feature</th>
            <th className="px-4 py-3">FE action</th>
            <th className="px-4 py-3">Detail</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-600">
          {items.map((it) => (
            <tr key={it.col}>
              <td className="px-4 py-3 font-semibold text-white">{it.col}</td>
              <td className="px-4 py-3 text-emerald-400/90">{it.action}</td>
              <td className="px-4 py-3 text-slate-400">{it.detail}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function FeCaseStudies() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Different domains than EDA — now apply transforms">
        EDA case studies used houses, churn, tickets, demand, loans, and courses. Here you practice{' '}
        <strong className="text-white">FE decisions</strong> on new tables: impute + flag, scale/log,
        encode unseen levels, create leak-free features, and name the pipeline steps. Cover the
        table, write your FE plan, then read the walkthrough.
      </Callout>

      <Definition term="FE case study">
        <p>
          A raw mini-table plus a forced engineering plan: what to fit on train, what to create, what
          to drop, and how the live row will be transformed.
        </p>
      </Definition>

      <LessonSection title="How to use this lesson">
        <ContentStep number={1} title="Read goal + grain + rows">
          <p>Note nulls, skew, categoricals, and any post-outcome smell.</p>
        </ContentStep>
        <ContentStep number={2} title="Write an FE plan">
          <p>Per column: impute? scale? encode? create? drop? Then list pipeline order.</p>
        </ContentStep>
        <ContentStep number={3} title="Compare">
          <p>Check the walkthrough grid and Python sketch.</p>
        </ContentStep>
      </LessonSection>

      {/* ───── CASE 1 ───── */}
      <LessonSection title="Case 1 — Hotel booking cancellation">
        <p className="text-slate-300">
          <strong className="text-white">Goal:</strong> predict <code className="text-slate-200">canceled</code> at
          booking time. <strong className="text-white">Grain:</strong> one booking.
        </p>
        <DataTable
          headers={['book_id', 'lead_days', 'nights', 'adults', 'meal', 'country', 'adr', 'deposit', 'canceled']}
          rows={[
            ['H01', 120, 3, 2, 'BB', 'IN', 85, 'no_deposit', 0],
            ['H02', 5, 1, 1, 'BB', 'IN', 70, 'no_deposit', 0],
            ['H03', 200, 7, 2, 'HB', 'AE', 140, 'non_refund', 1],
            ['H04', null, 2, 2, 'BB', 'US', 110, 'no_deposit', 0],
            ['H05', 40, 4, 3, 'FB', '', 95, 'refundable', 0],
            ['H06', 15, 1, 1, 'BB', 'IN', null, 'no_deposit', 1],
            ['H07', 90, 5, 2, 'HB', 'GB', 130, 'non_refund', 0],
            ['H08', 3, 2, 2, 'BB', 'IN', 60, 'no_deposit', 0],
            ['H09', 180, 10, 4, 'FB', 'AE', 200, 'non_refund', 1],
            ['H10', 25, 3, 2, 'BB', 'IN', 80, '', 0],
            ['H11', 60, 2, 1, 'SC', 'US', 55, 'no_deposit', 1],
            ['H12', 0, 1, 2, 'BB', 'IN', 75, 'no_deposit', 0],
            ['H13', 150, 6, 2, 'HB', 'GB', 160, 'refundable', 1],
            ['H14', 10, 2, null, 'BB', 'IN', 65, 'no_deposit', 0],
          ]}
        />
        <h3 className="mt-6 text-base font-semibold text-white">FE walkthrough</h3>
        <FeGrid
          items={[
            { col: 'lead_days', action: 'median impute + flag; log1p', detail: 'Right skew (0–200); null on H04' },
            { col: 'nights, adults', action: 'median impute', detail: 'adults null once; small integers' },
            { col: 'meal', action: 'one-hot', detail: 'BB/HB/FB/SC — low cardinality' },
            { col: 'country', action: '""→null; rare→other; one-hot/freq', detail: 'Blank on H05; IN dominates' },
            { col: 'adr', action: 'median + flag; optional log1p', detail: 'Average daily rate; 1 null' },
            { col: 'deposit', action: '""→__missing__; one-hot', detail: 'Blank ≠ no_deposit' },
            { col: 'adr_per_adult', action: 'create ratio', detail: 'adr / max(adults,1) after impute' },
            { col: 'book_id', action: 'drop', detail: 'Identifier' },
          ]}
        />
        <ContentStep number={1} title="Pipeline order">
          <p>
            Clean sentinels/blanks → impute numerics + indicators → create adr_per_adult → one-hot
            meal/deposit/country → (if logistic) scale numerics. Trees can skip scaling.
          </p>
        </ContentStep>
        <Example
          title="Python sketch — Case 1"
          output={`lead median: 40.0
countries after rare-group: IN kept; others → other`}
        >{`import numpy as np
import pandas as pd

df = pd.DataFrame({
    "lead_days": [120,5,200,np.nan,40,15,90,3,180,25,60,0,150,10],
    "country": ["IN","IN","AE","US","","IN","GB","IN","AE","IN","US","IN","GB","IN"],
    "canceled": [0,0,1,0,0,1,0,0,1,0,1,0,1,0],
})
df["country"] = df["country"].replace("", np.nan)
train = df.iloc[:10]
med = train["lead_days"].median()
print("lead median:", med)
keep = train["country"].value_counts()
keep = set(keep[keep >= 3].index)
print("keep countries:", keep)`}</Example>
      </LessonSection>

      {/* ───── CASE 2 ───── */}
      <LessonSection title="Case 2 — Ride-hail ETA (regression)">
        <p className="text-slate-300">
          <strong className="text-white">Goal:</strong> predict <code className="text-slate-200">eta_sec</code> at
          request time. <strong className="text-white">Grain:</strong> one ride request.
        </p>
        <DataTable
          headers={['req_id', 'dist_km', 'hour', 'is_rain', 'surge', 'driver_exp_y', 'city_zone', 'eta_sec']}
          rows={[
            ['R01', 3.2, 8, 0, 1.0, 4, 'Z1', 420],
            ['R02', 1.1, 8, 0, 1.0, 2, 'Z1', 180],
            ['R03', 8.5, 18, 1, 1.8, 1, 'Z2', 1200],
            ['R04', 2.0, 18, 1, null, 5, 'Z2', 500],
            ['R05', 12.0, 22, 0, 2.2, null, 'Z3', 1500],
            ['R06', 0.8, 12, 0, 1.0, 6, 'Z1', 120],
            ['R07', 5.5, 9, 0, 1.2, 3, 'Z2', 700],
            ['R08', 4.0, 17, 1, 1.5, 2, 'Z3', 900],
            ['R09', null, 17, 0, 1.0, 4, 'Z1', 600],
            ['R10', 6.2, 23, 0, 1.4, 1, 'Z3', 800],
            ['R11', 2.5, 7, 0, 1.1, 8, '', 350],
            ['R12', 9.0, 19, 1, 2.0, 2, 'Z2', 1100],
            ['R13', 1.5, 14, 0, 1.0, 5, 'Z1', null],
            ['R14', 7.1, 21, 0, 1.6, 3, 'Z3', 950],
            ['R15', 3.8, 8, 0, 1.0, 4, 'Z1', 410],
          ]}
        />
        <h3 className="mt-6 text-base font-semibold text-white">FE walkthrough</h3>
        <FeGrid
          items={[
            { col: 'dist_km', action: 'median impute; keep raw (+ optional log1p)', detail: 'Strong linear signal for ETA' },
            { col: 'hour', action: 'cyclical sin/cos', detail: '23 near 0 — linear models need cycles' },
            { col: 'is_rain', action: 'as-is boolean', detail: 'Complete' },
            { col: 'surge', action: 'median impute + flag', detail: 'Null on R04' },
            { col: 'driver_exp_y', action: 'median + flag', detail: 'Null on R05' },
            { col: 'city_zone', action: '""→null; one-hot', detail: 'Blank on R11' },
            { col: 'dist_x_rain', action: 'create interaction', detail: 'Rain hurts long trips more' },
            { col: 'eta_sec', action: 'target; drop null rows for train', detail: 'Right skew — log1p(y) for linear' },
          ]}
        />
        <Example
          title="Python sketch — Case 2 (cyclical hour)"
          output={`hour_sin[0]≈0.87 for hour=8`}
        >{`import numpy as np
hour = np.array([8, 18, 23])
hour_sin = np.sin(2 * np.pi * hour / 24)
hour_cos = np.cos(2 * np.pi * hour / 24)
print("hour_sin:", hour_sin.round(2))
print("hour_cos:", hour_cos.round(2))`}</Example>
      </LessonSection>

      {/* ───── CASE 3 ───── */}
      <LessonSection title="Case 3 — Hospital length of stay">
        <p className="text-slate-300">
          <strong className="text-white">Goal:</strong> predict <code className="text-slate-200">los_days</code> at
          admission. <strong className="text-white">Grain:</strong> one admission.
        </p>
        <DataTable
          headers={['adm_id', 'age', 'sex', 'dept', 'bmi', 'prior_adm_365', 'elective', 'lab_missing_n', 'los_days']}
          rows={[
            ['A01', 67, 'F', 'cardio', 28.1, 1, 0, 0, 5],
            ['A02', 45, 'M', 'ortho', 24.0, 0, 1, 0, 2],
            ['A03', 72, 'F', 'cardio', null, 3, 0, 4, 12],
            ['A04', 33, 'M', 'gen', 22.5, 0, 1, 0, 1],
            ['A05', 58, 'F', 'onco', 26.0, 2, 0, 2, 9],
            ['A06', 81, 'M', 'cardio', 29.4, 4, 0, 5, 15],
            ['A07', 40, 'F', 'ortho', 31.0, 0, 1, 0, 3],
            ['A08', 55, 'M', 'gen', null, 1, 0, 3, 4],
            ['A09', 29, 'F', 'gen', 21.0, 0, 1, 0, 1],
            ['A10', 63, 'M', 'onco', 27.2, null, 0, 1, 8],
            ['A11', 70, 'F', 'cardio', 30.5, 2, 0, 2, 7],
            ['A12', 48, 'M', 'ortho', 25.1, 0, 1, 0, null],
            ['A13', 76, 'F', 'onco', 23.8, 5, 0, 6, 18],
            ['A14', 52, 'M', '', 26.4, 1, 0, 1, 3],
          ]}
        />
        <Callout variant="insight" title="Do not invent post-discharge features">
          Anything measured after discharge (bill total, post_op_complication_flag recorded at day 10)
          is leakage for admission-time LOS. This table stays honest — practice keeping it that way.
        </Callout>
        <FeGrid
          items={[
            { col: 'age', action: 'scale if linear', detail: 'Complete; important for LOS' },
            { col: 'sex', action: 'one-hot / binary', detail: 'Complete' },
            { col: 'dept', action: '""→null; one-hot', detail: 'Blank on A14' },
            { col: 'bmi', action: 'median + is_bmi_missing', detail: 'Missing may mean urgent skip — keep flag' },
            { col: 'prior_adm_365', action: 'fill 0 or median + flag', detail: 'Null once; 0 = none is plausible' },
            { col: 'elective', action: 'as-is', detail: 'Elective stays shorter here' },
            { col: 'lab_missing_n', action: 'as numeric feature', detail: 'Count of missing labs at admit — already a FE gift' },
            { col: 'los_days', action: 'target; log1p for linear', detail: 'Right skew (1–18)' },
          ]}
        />
        <Example
          title="Python sketch — Case 3"
          output={`bmi missing flag rate: ~0.14
log1p los median vs mean check`}
        >{`import numpy as np
import pandas as pd

bmi = pd.Series([28.1, 24.0, np.nan, 22.5, 26.0, 29.4, 31.0, np.nan, 21.0, 27.2, 30.5, 25.1, 23.8, 26.4])
los = pd.Series([5,2,12,1,9,15,3,4,1,8,7,np.nan,18,3])
flag = bmi.isna().astype(int)
print("bmi missing rate:", round(flag.mean(), 2))
y = np.log1p(los.dropna())
print("log1p(los) mean/median:", round(y.mean(), 2), round(y.median(), 2))`}</Example>
      </LessonSection>

      {/* ───── CASE 4 ───── */}
      <LessonSection title="Case 4 — Ad click-through">
        <p className="text-slate-300">
          <strong className="text-white">Goal:</strong> predict <code className="text-slate-200">clicked</code>.{' '}
          <strong className="text-white">Grain:</strong> one ad impression.
        </p>
        <DataTable
          headers={['imp_id', 'campaign', 'device', 'pos', 'hist_ctr', 'user_age', 'hour', 'clicked']}
          rows={[
            ['I01', 'c_shoes', 'mobile', 1, 0.04, 24, 21, 0],
            ['I02', 'c_shoes', 'desktop', 2, 0.04, 31, 14, 0],
            ['I03', 'c_gadgets', 'mobile', 1, 0.08, 19, 22, 1],
            ['I04', 'c_travel', 'mobile', 3, 0.02, null, 9, 0],
            ['I05', 'c_shoes', 'tablet', 1, 0.04, 45, 20, 0],
            ['I06', 'c_gadgets', 'mobile', 1, 0.08, 22, 23, 1],
            ['I07', 'c_travel', 'desktop', 2, 0.02, 38, 11, 0],
            ['I08', 'c_food', 'mobile', 1, null, 27, 19, 1],
            ['I09', 'c_shoes', 'mobile', 3, 0.04, 29, 8, 0],
            ['I10', 'c_gadgets', 'desktop', 1, 0.08, 33, 15, 0],
            ['I11', 'c_food', 'mobile', 2, 0.06, 21, 18, 1],
            ['I12', 'c_travel', 'mobile', 1, 0.02, 50, 7, 0],
            ['I13', 'c_newbrand', 'mobile', 1, 0.00, 26, 21, 0],
            ['I14', 'c_shoes', 'mobile', 1, 0.04, 24, 22, 1],
            ['I15', '', 'desktop', 2, 0.03, 40, 13, 0],
          ]}
        />
        <h3 className="mt-6 text-base font-semibold text-white">FE walkthrough</h3>
        <FeGrid
          items={[
            { col: 'campaign', action: 'freq or smoothed target encode', detail: 'c_newbrand rare; blank→other' },
            { col: 'device', action: 'one-hot', detail: 'mobile/desktop/tablet' },
            { col: 'pos', action: 'ordinal or one-hot', detail: 'Slot position 1–3' },
            { col: 'hist_ctr', action: 'median impute + flag', detail: 'Prior campaign CTR; null on I08' },
            { col: 'user_age', action: 'median + flag; bin optional', detail: 'Null on I04' },
            { col: 'hour', action: 'sin/cos or bucket', detail: 'Evening clicks higher in toy' },
            { col: 'is_mobile_x_pos1', action: 'interaction', detail: 'Mobile × top slot' },
            { col: 'imp_id', action: 'drop', detail: 'ID' },
          ]}
        />
        <Callout variant="tip" title="hist_ctr freeze time">
          hist_ctr must be computed from impressions <em>before</em> this one (prior window). If it
          includes the current click, you leaked.
        </Callout>
        <Example
          title="Python sketch — Case 4 (frequency encode)"
          output={`freq: c_shoes appears most in train slice`}
        >{`import pandas as pd
camp = pd.Series(["c_shoes","c_shoes","c_gadgets","c_travel","c_shoes",
                  "c_gadgets","c_travel","c_food","c_shoes","c_gadgets",
                  "c_food","c_travel","c_newbrand","c_shoes",""])
camp = camp.replace("", "other")
# fit on "train" = first 12
freq = camp.iloc[:12].value_counts()
encoded = camp.map(freq).fillna(0)
print(freq.to_dict())
print("I13 encoded count:", int(encoded.iloc[12]))`}</Example>
      </LessonSection>

      {/* ───── CASE 5 ───── */}
      <LessonSection title="Case 5 — Smart-meter next-hour kWh">
        <p className="text-slate-300">
          <strong className="text-white">Goal:</strong> forecast next-hour{' '}
          <code className="text-slate-200">kwh</code>. <strong className="text-white">Grain:</strong> meter ×
          hour.
        </p>
        <DataTable
          headers={['meter', 'ts', 'temp_c', 'is_weekend', 'kwh', 'kwh_lag1', 'kwh_roll3']}
          rows={[
            ['M1', '2024-06-01 18:00', 34, 1, 2.1, null, null],
            ['M1', '2024-06-01 19:00', 33, 1, 2.4, 2.1, null],
            ['M1', '2024-06-01 20:00', 32, 1, 2.8, 2.4, null],
            ['M1', '2024-06-01 21:00', 31, 1, 2.2, 2.8, 2.43],
            ['M1', '2024-06-01 22:00', null, 1, 1.5, 2.2, 2.47],
            ['M2', '2024-06-01 18:00', 34, 1, 0.9, null, null],
            ['M2', '2024-06-01 19:00', 33, 1, 1.0, 0.9, null],
            ['M2', '2024-06-01 20:00', 32, 1, 1.3, 1.0, null],
            ['M2', '2024-06-01 21:00', 31, 1, 1.1, 1.3, 1.07],
            ['M2', '2024-06-01 22:00', 30, 1, null, 1.1, 1.13],
            ['M1', '2024-06-02 18:00', 35, 1, 2.0, 1.5, 2.17],
            ['M1', '2024-06-02 19:00', 34, 1, 2.3, 2.0, 1.90],
            ['M2', '2024-06-02 18:00', 35, 1, 0.8, null, null],
            ['M2', '2024-06-02 19:00', 34, 1, 1.1, 0.8, null],
          ]}
        />
        <Callout variant="insight" title="Lags are already sketched — verify safety">
          kwh_lag1 and kwh_roll3 should use only past hours for that meter. First rows are null by
          construction — impute with train median or a &ldquo;cold start&rdquo; flag, do not peek at future
          kwh.
        </Callout>
        <FeGrid
          items={[
            { col: 'temp_c', action: 'median impute + flag', detail: 'Null on one evening row' },
            { col: 'is_weekend', action: 'as-is', detail: 'Binary' },
            { col: 'kwh_lag1 / roll3', action: 'keep; cold-start flag', detail: 'Null at series start' },
            { col: 'hour_of_day', action: 'parse from ts; sin/cos', detail: 'Create from timestamp' },
            { col: 'meter', action: 'one-hot or target encode', detail: 'Entity id — not a raw integer feature' },
            { col: 'kwh', action: 'target; time split', detail: 'Train past hours → test future' },
          ]}
        />
        <Example
          title="Python sketch — Case 5 (safe lag)"
          output={`lag1 first row null; second = previous kwh`}
        >{`import pandas as pd
s = pd.DataFrame({
    "meter": ["M1"]*5,
    "kwh": [2.1, 2.4, 2.8, 2.2, 1.5],
})
s["kwh_lag1"] = s.groupby("meter")["kwh"].shift(1)
s["kwh_roll3"] = s.groupby("meter")["kwh"].transform(
    lambda x: x.shift(1).rolling(3, min_periods=1).mean()
)
print(s.round(2))`}</Example>
      </LessonSection>

      {/* ───── CASE 6 ───── */}
      <LessonSection title="Case 6 — Warehouse pick time">
        <p className="text-slate-300">
          <strong className="text-white">Goal:</strong> predict <code className="text-slate-200">pick_sec</code>{' '}
          for a pick line. <strong className="text-white">Grain:</strong> one pick task.
        </p>
        <DataTable
          headers={['task_id', 'zone', 'weight_kg', 'lines', 'shift', 'worker_months', 'cart_type', 'pick_sec']}
          rows={[
            ['P01', 'A', 2.5, 1, 'day', 18, 'small', 45],
            ['P02', 'A', 8.0, 3, 'day', 18, 'large', 120],
            ['P03', 'B', 1.0, 1, 'night', 3, 'small', 60],
            ['P04', 'C', 15.0, 5, 'day', 24, 'large', 300],
            ['P05', 'B', null, 2, 'day', 6, 'small', 90],
            ['P06', 'A', 3.0, 1, 'night', null, 'small', 55],
            ['P07', 'C', 12.0, 4, 'day', 12, 'large', 240],
            ['P08', 'B', 2.0, 1, 'day', 9, '', 50],
            ['P09', 'A', 6.5, 2, 'day', 18, 'large', 100],
            ['P10', 'C', 20.0, 6, 'night', 2, 'large', 420],
            ['P11', 'B', 4.0, 2, 'day', 15, 'small', null],
            ['P12', 'A', 1.5, 1, 'day', 30, 'small', 35],
            ['P13', 'C', 9.0, 3, 'night', 4, 'large', 200],
            ['P14', 'B', 5.5, 2, 'day', 10, 'small', 80],
            ['P15', 'A', 0.5, 1, 'day', 18, 'small', 30],
          ]}
        />
        <FeGrid
          items={[
            { col: 'zone', action: 'one-hot', detail: 'A/B/C — distance proxy' },
            { col: 'weight_kg', action: 'median + flag; log1p', detail: 'Right skew; null on P05' },
            { col: 'lines', action: 'as count', detail: 'Items on the task' },
            { col: 'shift', action: 'one-hot', detail: 'day/night' },
            { col: 'worker_months', action: 'median + flag', detail: 'Null on P06' },
            { col: 'cart_type', action: '""→__missing__; one-hot', detail: 'Blank on P08' },
            { col: 'kg_per_line', action: 'create ratio', detail: 'weight / lines after impute' },
            { col: 'pick_sec', action: 'target; log1p linear', detail: 'Heavy skew (30–420)' },
          ]}
        />
        <ContentStep number={1} title="End-to-end pipeline list">
          <p>
            blanks→null → numeric impute+flags → kg_per_line → one-hot zone/shift/cart → log1p
            weight & target (if linear) → StandardScaler on numerics → model. Dump the whole pipe.
          </p>
        </ContentStep>
        <Example
          title="Python sketch — Case 6"
          output={`kg_per_line sample: [2.5, 2.67, ...]`}
        >{`import numpy as np
import pandas as pd
df = pd.DataFrame({
    "weight_kg": [2.5, 8.0, 1.0, 15.0, np.nan],
    "lines": [1, 3, 1, 5, 2],
})
med = df["weight_kg"].median()
df["weight_kg"] = df["weight_kg"].fillna(med)
df["kg_per_line"] = df["weight_kg"] / df["lines"]
print(df["kg_per_line"].round(2).tolist())`}</Example>
      </LessonSection>

      <LessonSection title="Cross-case FE checklist">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Skill</th>
                <th className="px-4 py-3">Cases</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Median impute + missing flag', '1, 2, 3, 4, 5, 6'],
                ['Empty string → missing level', '1, 2, 6'],
                ['log1p skew / target', '1, 2, 3, 6'],
                ['One-hot low cardinality', '1, 2, 3, 6'],
                ['Frequency / target encode high card', '4'],
                ['Cyclical hour', '2, 4, 5'],
                ['Ratios & interactions', '1, 2, 4, 6'],
                ['Safe lags / rolling', '5'],
                ['Time-based split mindset', '5'],
                ['Drop IDs; refuse leakage', 'All (esp. 3 note)'],
                ['Name pipeline step order', '1, 6'],
              ].map(([skill, cases]) => (
                <tr key={skill}>
                  <td className="px-4 py-3 font-semibold text-white">{skill}</td>
                  <td className="px-4 py-3 text-slate-400">{cases}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Six new domains force FE — not the same stories as the EDA case studies.',
          'Every case: clean blanks/sentinels → impute+flags → encode → create leak-free features → scale if needed.',
          'Cyclical time, ratios, interactions, and safe lags are the creation patterns to rehearse.',
          'High-cardinality ads need frequency/target encoding with an unseen policy.',
          'Meter forecasting lives or dies on honest lags and time splits.',
          'Write the pipeline order out loud — that list is what you implement and deploy.',
        ]}
      />
    </LessonArticle>
  )
}
