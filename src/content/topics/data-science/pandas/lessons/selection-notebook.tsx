import {
  Callout,
  Definition,
  KeyTakeaways,
  LessonArticle,
  NotebookCell,
} from '../../../../../components/content'

export function SelectionNotebook() {
  return (
    <LessonArticle>
      <Definition term="Practice on a toy sales table">
        <p>
          We build a small sales DataFrame, then practice <code className="font-mono text-xs">loc</code>,{' '}
          <code className="font-mono text-xs">iloc</code>, and boolean filtering — the three skills from
          the previous lessons, in one notebook.
        </p>
      </Definition>

      <Callout variant="beginner" title="How to read this notebook">
        Each cell builds on the same <code className="font-mono text-xs">sales</code> table. Run cells
        in order so the DataFrame is always in memory.
      </Callout>

      <div className="mt-6 space-y-6">
        <NotebookCell
          cell={1}
          title="Create the sales DataFrame"
          code={`import pandas as pd

sales = pd.DataFrame({
    "product": ["Pen", "Notebook", "Pen", "Marker", "Notebook"],
    "units": [10, 5, 8, 12, 3],
    "price": [1.5, 4.0, 1.5, 2.0, 4.0],
    "region": ["East", "West", "East", "East", "West"],
})
print(sales)`}
          output={`    product  units  price region
0       Pen     10    1.5   East
1  Notebook      5    4.0   West
2       Pen      8    1.5   East
3    Marker     12    2.0   East
4  Notebook      3    4.0   West`}
        />

        <NotebookCell
          cell={2}
          title="Select columns with loc"
          code={`print(sales.loc[:, ["product", "units"]])`}
          output={`    product  units
0       Pen     10
1  Notebook      5
2       Pen      8
3    Marker     12
4  Notebook      3`}
        >
          <p>
            <code className="font-mono text-xs">loc[:, cols]</code> means all rows, named columns only.
          </p>
        </NotebookCell>

        <NotebookCell
          cell={3}
          title="Select rows by position with iloc"
          code={`print(sales.iloc[1:4, [0, 2, 3]])`}
          output={`    product  price region
1  Notebook    4.0   West
2       Pen    1.5   East
3    Marker    2.0   East`}
        >
          <p>
            Rows at positions 1, 2, 3 (iloc stop is exclusive). Columns 0, 2, 3 = product, price,
            region.
          </p>
        </NotebookCell>

        <NotebookCell
          cell={4}
          title="Filter rows — East region only"
          code={`east = sales[sales["region"] == "East"]
print(east)`}
          output={`  product  units  price region
0     Pen     10    1.5   East
2     Pen      8    1.5   East
3  Marker     12    2.0   East`}
        />

        <NotebookCell
          cell={5}
          title="Combine conditions — Pen in East with units > 5"
          code={`result = sales[
    (sales["product"] == "Pen")
    & (sales["region"] == "East")
    & (sales["units"] > 5)
]
print(result)`}
          output={`  product  units  price region
0     Pen     10    1.5   East
2     Pen      8    1.5   East`}
        />

        <NotebookCell
          cell={6}
          title="Same filter with query()"
          code={`result = sales.query('product == "Pen" and region == "East" and units > 5')
print(result)`}
          output={`  product  units  price region
0     Pen     10    1.5   East
2     Pen      8    1.5   East`}
        />
      </div>

      <KeyTakeaways
        items={[
          'loc picks by column names; iloc picks by row/column positions.',
          'Boolean masks filter rows: sales[sales["col"] == value].',
          'Chain conditions with & and parentheses, or use query() for readable strings.',
        ]}
      />
    </LessonArticle>
  )
}
