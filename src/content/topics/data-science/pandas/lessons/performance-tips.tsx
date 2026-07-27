import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
  NotebookCell,
} from '../../../../../components/content'

export function PerformanceTips() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Fast tables, less waiting">
        Pandas is fast when you let it work on whole columns at once. Slow code usually means Python
        loops over rows. These habits keep notebooks snappy even on larger CSVs.
      </Callout>

      <Definition term="Vectorization">
        <p>
          <strong className="text-white">Vectorization</strong> applies an operation to an entire
          column or array in one shot (often in C under the hood), instead of visiting each row in a
          Python <code className="font-mono text-xs">for</code> loop.
        </p>
      </Definition>

      <LessonSection title="Rules of thumb">
        <ContentStep number={1} title="Prefer built-in methods">
          <p className="text-slate-300">
            <code className="font-mono text-xs">df[&quot;col&quot;].str.lower()</code>,{' '}
            <code className="font-mono text-xs">df[&quot;a&quot;] + df[&quot;b&quot;]</code>,{' '}
            <code className="font-mono text-xs">groupby</code> — not row-by-row loops.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Use categorical for repeated strings">
          <p className="text-slate-300">
            Columns like country codes or product IDs repeat often — store them as{' '}
            <code className="font-mono text-xs">category</code> dtype to save memory and speed
            groupby.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Avoid chained assignment">
          <p className="text-slate-300">
            Do not write <code className="font-mono text-xs">df[mask][&quot;col&quot;] = x</code> — it
            may not update the original frame. Use <code className="font-mono text-xs">.loc</code>{' '}
            instead.
          </p>
        </ContentStep>
      </LessonSection>

      <div className="mt-6 space-y-6">
        <NotebookCell
          cell={1}
          title="Slow loop vs vectorized math"
          code={`import pandas as pd

df = pd.DataFrame({"price": [10, 20, 30, 40]})

# Slow — Python loop (fine for tiny data, bad at scale)
# for i in range(len(df)):
#     df.loc[i, "with_tax"] = df.loc[i, "price"] * 1.1

# Fast — vectorized
df["with_tax"] = df["price"] * 1.1
print(df)`}
          output={`   price  with_tax
0     10      11.0
1     20      22.0
2     30      33.0
3     40      44.0`}
        />

        <NotebookCell
          cell={2}
          title="Built-in string methods (.str)"
          code={`df = pd.DataFrame({"city": [" NYC ", "la", "Chicago"]})
df["city_clean"] = df["city"].str.strip().str.upper()
print(df["city_clean"])`}
          output={`0        NYC
1         LA
2    CHICAGO
Name: city_clean, dtype: object`}
        />

        <NotebookCell
          cell={3}
          title="Categorical dtype for repeated labels"
          code={`df = pd.DataFrame({
    "product": ["A", "B", "A", "A", "B", "A"] * 1000,
    "qty": range(6000),
})
df["product"] = df["product"].astype("category")
print(df["product"].dtype)
print("memory (bytes):", df["product"].memory_usage(deep=True))`}
          output={`category
memory (bytes): ...  # typically smaller than plain object strings`}
        >
          <p>groupby on categoricals is often faster because Pandas compares small integer codes.</p>
        </NotebookCell>

        <NotebookCell
          cell={4}
          title="Chained assignment pitfall"
          code={`df = pd.DataFrame({"score": [40, 55, 70, 90]})
# BAD — may not change df (SettingWithCopyWarning)
# df[df["score"] < 60]["score"] = 0

# GOOD — single .loc assignment
df.loc[df["score"] < 60, "score"] = 0
print(df)`}
          output={`   score
0      0
1      0
2     70
3     90`}
        />
      </div>

      <LessonSection title="Quick wins checklist">
        <Example title="Prefer this pattern">
{`df["new"] = df["a"] + df["b"]          # vectorized
df.groupby("key")["val"].sum()         # built-in agg
df.loc[mask, "col"] = value            # safe assign`}
        </Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Vectorized column ops beat Python row loops on real-sized data.',
          'Use .str, groupby, and numeric ops — they are optimized paths.',
          'astype("category") helps repeated strings; use .loc to assign safely.',
        ]}
      />
    </LessonArticle>
  )
}
