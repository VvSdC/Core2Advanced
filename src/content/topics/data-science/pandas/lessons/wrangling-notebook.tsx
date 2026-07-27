import {
  Callout,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
  NotebookCell,
} from '../../../../../components/content'

export function WranglingNotebook() {
  return (
    <LessonArticle>
      <Definition term="Data wrangling">
        <p>
          <strong className="text-white">Wrangling</strong> is the hands-on work: group, merge,
          reshape, and sort until your table is ready for analysis or charts. This notebook chains
          the core moves in one session.
        </p>
      </Definition>

      <Callout variant="beginner" title="How to read this notebook">
        Each cell builds on the last. Run them in order. If a step feels fast, pause and change one
        line — e.g. switch <code className="font-mono text-xs">how=&quot;inner&quot;</code> to{' '}
        <code className="font-mono text-xs">how=&quot;left&quot;</code> — and watch the output change.
      </Callout>

      <LessonSection title="Flow">
        <Flowchart
          title="Mini wrangling pipeline"
          chart={`flowchart LR
  A[Load tables] --> B[groupby summary]
  B --> C[merge on key]
  C --> D[pivot / melt]
  D --> E[sort for report]`}
        />
      </LessonSection>

      <div className="space-y-6">
        <NotebookCell
          cell={1}
          title="Import and two small tables"
          code={`import pandas as pd

orders = pd.DataFrame({
    "order_id": [101, 102, 103, 104],
    "city": ["NYC", "NYC", "LA", "LA"],
    "amount": [50, 30, 40, 60],
})
customers = pd.DataFrame({
    "order_id": [101, 102, 103, 105],
    "customer": ["Ana", "Ben", "Cara", "Dan"],
})
print(orders)
print()
print(customers)`}
          output={`   order_id city  amount
0       101  NYC      50
1       102  NYC      30
2       103   LA      40
3       104   LA      60

   order_id customer
0       101      Ana
1       102      Ben
2       103     Cara
3       105      Dan`}
        />

        <NotebookCell
          cell={2}
          title="groupby — total amount per city"
          code={`city_totals = orders.groupby("city")["amount"].sum()
print(city_totals)`}
          output={`city
LA     100
NYC     80
Name: amount, dtype: int64`}
        />

        <NotebookCell
          cell={3}
          title="merge orders with customers"
          code={`merged = pd.merge(orders, customers, on="order_id", how="left")
print(merged)`}
          output={`   order_id city  amount customer
0       101  NYC      50      Ana
1       102  NYC      30      Ben
2       103   LA      40     Cara
3       104   LA      60      NaN`}
        >
          <p>Order 104 has no customer row — left join keeps the order and fills NaN.</p>
        </NotebookCell>

        <NotebookCell
          cell={4}
          title="pivot_table — amount by city and customer"
          code={`pivot = pd.pivot_table(
    merged.dropna(subset=["customer"]),
    index="city",
    columns="customer",
    values="amount",
    aggfunc="sum",
    fill_value=0,
)
print(pivot)`}
          output={`customer  Ana  Ben  Cara
city
LA          0    0    40
NYC        50   30     0`}
        />

        <NotebookCell
          cell={5}
          title="melt pivot back to long format"
          code={`long = pivot.reset_index().melt(
    id_vars="city",
    var_name="customer",
    value_name="amount",
)
print(long[long["amount"] > 0])`}
          output={`  city customer  amount
0  NYC      Ana      50
1  NYC      Ben      30
2   LA     Cara      40`}
        />

        <NotebookCell
          cell={6}
          title="sort for a readable report"
          code={`report = long[long["amount"] > 0].sort_values(
    ["city", "amount"],
    ascending=[True, False],
)
print(report.to_string(index=False))`}
          output={`city customer  amount
  LA     Cara      40
 NYC      Ana      50
 NYC      Ben      30`}
        />
      </div>

      <KeyTakeaways
        items={[
          'Real analysis chains groupby, merge, reshape, and sort.',
          'Left merge keeps your main table complete; pivot then melt changes shape on purpose.',
          'Sort last so humans (and exports) read the final table easily.',
        ]}
      />
    </LessonArticle>
  )
}
