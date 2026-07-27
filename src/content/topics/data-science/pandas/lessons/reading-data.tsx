import {
  Callout,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function ReadingData() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Everyday idea">
        You have a spreadsheet export, a database table, or a JSON file from an API. Pandas turns
        each into one familiar table — a DataFrame — so you can explore and clean it the same way
        every time.
      </Callout>

      <Definition term="read_* functions">
        <p>
          Pandas provides <strong className="text-white">read_*</strong> helpers for common sources.
          Each function loads data into a <strong className="text-white">DataFrame</strong> — rows and
          columns with labels, like a spreadsheet in Python.
        </p>
      </Definition>

      <LessonSection title="The main loaders">
        <p className="text-slate-300">
          You will see these four most often. The pattern is always: import pandas, call a{' '}
          <code className="font-mono text-xs">read_*</code> function, get a DataFrame back.
        </p>

        <Example
          title="read_csv — comma-separated text files"
          output={`   name  age city
0  Alice   28  NYC
1    Bob   34  LA
2  Carol   22  NYC`}
        >{`import pandas as pd

df = pd.read_csv("data/people.csv")
print(df)`}</Example>

        <Example
          title="read_excel — workbook sheets"
          output={`   product  price
0     Pen    1.5
1  Notebook   4.0`}
        >{`df = pd.read_excel("reports/sales.xlsx", sheet_name="Q1")
print(df)`}</Example>

        <Example
          title="read_sql — query a database"
          output={`   id  score
0   1     88
1   2     92
2   3     79`}
        >{`import sqlite3

conn = sqlite3.connect("school.db")
df = pd.read_sql("SELECT id, score FROM exams", conn)
print(df)`}</Example>

        <Example
          title="read_json — API or config files"
          output={`   city  temp
0  NYC    72
1  LA     81`}
        >{`df = pd.read_json("data/weather.json")
print(df)`}</Example>
      </LessonSection>

      <LessonSection title="Useful keyword arguments">
        <p className="text-slate-300">
          These optional arguments save time on real files. You pass them inside the parentheses of
          the read function.
        </p>

        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Argument</th>
                <th className="px-4 py-3">What it does</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['sep', 'Column separator (default ","). Use "\\t" for tab files.'],
                ['usecols', 'Load only named columns — faster on huge files.'],
                ['parse_dates', 'Turn date strings into real datetime columns.'],
                ['nrows', 'Read only the first N rows — great for a quick peek.'],
                ['index_col', 'Use a column as the row index instead of 0, 1, 2…'],
              ].map(([arg, meaning]) => (
                <tr key={arg} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-mono text-xs text-accent-400">{arg}</td>
                  <td className="px-4 py-3">{meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Example
          title="Combine kwargs on a CSV"
          output={`   order_date  amount
0 2024-01-05     120
1 2024-01-12      85
2 2024-01-19     200`}
        >{`df = pd.read_csv(
    "data/orders.tsv",
    sep="\\t",
    usecols=["order_date", "amount"],
    parse_dates=["order_date"],
    nrows=1000,
    index_col="order_date",
)
print(df.head(3))`}</Example>
      </LessonSection>

      <Callout variant="tip" title="Working directory and paths">
        <p>
          <code className="font-mono text-xs">"data/people.csv"</code> is a{' '}
          <strong className="text-white">relative path</strong> — relative to where your notebook or
          script is running. If the file is not found, check your current folder with{' '}
          <code className="font-mono text-xs">import os; print(os.getcwd())</code> or use an absolute
          path. In Jupyter, the working directory is usually the folder that contains the notebook.
        </p>
      </Callout>

      <KeyTakeaways
        items={[
          'read_csv, read_excel, read_sql, and read_json all return a DataFrame.',
          'Common kwargs: sep, usecols, parse_dates, nrows, index_col — combine them as needed.',
          'Use relative paths from your working directory; verify with os.getcwd() if a file is missing.',
        ]}
      />
    </LessonArticle>
  )
}
