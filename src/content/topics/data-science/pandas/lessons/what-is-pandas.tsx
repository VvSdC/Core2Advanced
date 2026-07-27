import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function WhatIsPandas() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Everyday idea">
        You export a sales report from Excel, filter out bad rows, compute totals by region, and
        hand a summary to your team. Pandas is how data people do that in Python — on files with
        thousands or millions of rows, not just ten.
      </Callout>

      <Definition term="What is Pandas?">
        <p>
          <strong className="text-white">Pandas</strong> (Panel Data) is an open-source Python library
          for working with structured, tabular data. It gives you two main objects —{' '}
          <strong className="text-white">Series</strong> (one column) and{' '}
          <strong className="text-white">DataFrame</strong> (a full table) — plus tools to load,
          clean, transform, and analyze data from many sources.
        </p>
      </Definition>

      <LessonSection title="Why it matters in data science">
        <ContentStep number={1} title="Real data is messy">
          <p className="text-slate-300">
            Missing cells, mixed types, duplicate rows, dates in odd formats — Pandas is built for
            that reality, not for perfect toy tables.
          </p>
        </ContentStep>
        <ContentStep number={2} title="The glue between files and models">
          <p className="text-slate-300">
            Before machine learning or charts, you almost always load a table, clean it, and explore
            it. Pandas is the standard step in that pipeline.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Readable, expressive code">
          <p className="text-slate-300">
            Operations like “keep rows where age is over 18” or “average score by department” become
            short, readable lines instead of nested loops.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Built on NumPy">
        <p className="text-slate-300">
          Under the hood, Pandas stores numeric columns as NumPy arrays and uses NumPy’s fast math.
          You get spreadsheet convenience <em>plus</em> the speed of array operations. If you
          completed the NumPy track, you already know the engine — Pandas adds labels, columns, and
          table-shaped tools on top.
        </p>
        <Callout variant="insight">
          Think of NumPy as fast numbers in a grid. Pandas names the rows and columns and adds
          “spreadsheet verbs”: filter, group, merge, fill missing.
        </Callout>
      </LessonSection>

      <LessonSection title="What people use Pandas for">
        <ContentStep number={1} title="Cleaning">
          <p className="text-slate-300">
            Fix types, drop duplicates, fill or drop missing values, standardize text.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Transformation">
          <p className="text-slate-300">
            Add computed columns, parse dates, bin ages into groups, one-hot encode categories.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Manipulation">
          <p className="text-slate-300">
            Sort, filter, pivot, stack, join two tables, reshape wide ↔ long.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Analysis">
          <p className="text-slate-300">
            Summaries by group, rolling averages, correlation checks, quick stats before modeling.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Data sources Pandas can read">
        <p className="text-slate-300">
          One library, many formats — you usually call a single{' '}
          <code className="font-mono text-xs">read_*</code> function and get a DataFrame back:
        </p>
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3">Typical use</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['CSV', 'Exports from spreadsheets, logs, open data'],
                ['Excel (.xlsx)', 'Business reports and shared workbooks'],
                ['JSON', 'API responses and web app data'],
                ['SQL', 'Query a database, load results into a table'],
                ['Time series', 'Dates as index — stock prices, sensor readings'],
              ].map(([source, use]) => (
                <tr key={source} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{source}</td>
                  <td className="px-4 py-3">{use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip">
          Loading from each format gets its own lesson later. For now, remember: Pandas turns files
          and queries into one familiar table object.
        </Callout>
      </LessonSection>

      <LessonSection title="A typical analysis workflow">
        <Flowchart
          title="From raw file to insight"
          chart={`flowchart TB
  A[Load data — read_csv / read_sql] --> B[Explore — head, info, describe]
  B --> C[Clean — types, missing, duplicates]
  C --> D[Select & filter rows/columns]
  D --> E[Transform — new columns, groupby]
  E --> F[Combine — merge / concat]
  F --> G[Summarize or plot]`}
        />
      </LessonSection>

      <KeyTakeaways
        items={[
          'Pandas = labeled tables in Python for cleaning, transforming, and analyzing data.',
          'It builds on NumPy for speed and adds row/column labels plus table operations.',
          'Works with CSV, Excel, JSON, SQL, and time series — one workflow for many sources.',
        ]}
      />
    </LessonArticle>
  )
}
