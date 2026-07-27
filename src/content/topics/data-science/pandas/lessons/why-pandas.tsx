import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function WhyPandas() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Take a breath — this is a story, not a lecture">
        Imagine a customer spreadsheet: names, ages, signup dates, purchase amounts, and a few blank
        cells. You need averages by city and a clean table for a chart. Plain Python lists and nested
        loops can do it — but the code grows fast and breaks easily. Pandas is the structured way.
      </Callout>

      <Definition term="Why reach for Pandas?">
        <p>
          For <strong className="text-white">tabular data</strong> — rows as records, columns as
          fields — Pandas gives you a single object (DataFrame) with labels, mixed column types, and
          battle-tested tools for loading, cleaning, and summarizing at scale.
        </p>
      </Definition>

      <LessonSection title="Four reasons teams choose Pandas">
        <ContentStep number={1} title="Load large datasets efficiently">
          <p className="text-slate-300">
            Read millions of rows from CSV or SQL into memory (or in chunks) without hand-writing
            parsers. Pandas handles parsing, types, and missing values in one step.
          </p>
        </ContentStep>

        <ContentStep number={2} title="Streamlined table representation">
          <p className="text-slate-300">
            A DataFrame looks and feels like a spreadsheet: named columns, row index, preview with{' '}
            <code className="font-mono text-xs">head()</code>, quick stats with{' '}
            <code className="font-mono text-xs">describe()</code>. Less boilerplate than building
            your own data structures.
          </p>
        </ContentStep>

        <ContentStep number={3} title="Heterogeneous columns">
          <p className="text-slate-300">
            One column can be text (names), another integers (scores), another dates — each column
            keeps its own dtype. NumPy arrays want one type per array; real tables rarely cooperate.
          </p>
          <Example title="Mixed types in one table">
{`import pandas as pd

df = pd.DataFrame({
    "name": ["Ana", "Ben", "Cara"],
    "score": [88, 92, 79],
    "active": [True, False, True],
})
print(df.dtypes)
# name      object
# score      int64
# active      bool`}
          </Example>
        </ContentStep>

        <ContentStep number={4} title="Rich manipulation features">
          <p className="text-slate-300">
            Filter, sort, group, pivot, merge, fill missing, apply functions — express data tasks in
            a few lines instead of custom classes and loops.
          </p>
          <Example title="Group summary in one line">
{`print(df.groupby("active")["score"].mean())
# active
# False    92.0
# True     83.5`}
          </Example>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Plain Python vs NumPy alone vs Pandas">
        <p className="text-slate-300">
          Each tool has a sweet spot. For tabular work, Pandas fills the gap between “flexible but
          slow” and “fast but one-type-only.”
        </p>
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Tool</th>
                <th className="px-4 py-3">Good for</th>
                <th className="px-4 py-3">Tabular pain point</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                [
                  'Plain Python (lists, dicts)',
                  'Small scripts, mixed logic',
                  'No labels, verbose loops for filter/group/join',
                ],
                [
                  'NumPy alone',
                  'Fast numeric arrays, one dtype',
                  'No column names, awkward mixed-type tables',
                ],
                [
                  'Pandas',
                  'Real datasets: load, clean, analyze',
                  'Heavier than NumPy for pure numeric kernels',
                ],
              ].map(([tool, good, pain]) => (
                <tr key={tool} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{tool}</td>
                  <td className="px-4 py-3">{good}</td>
                  <td className="px-4 py-3">{pain}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip" title="When lists or NumPy are still fine">
          A handful of numbers and one calculation? NumPy or a list is perfect. A CSV with ten
          columns and missing values? Reach for Pandas.
        </Callout>
      </LessonSection>

      <LessonSection title="The tradeoff in one sentence">
        <p className="text-slate-300">
          You learn Pandas’s table vocabulary (index, columns, groupby, merge) and gain the ability
          to handle real-world datasets with less custom code — at the cost of a slightly heavier
          library than raw NumPy.
        </p>
        <Callout variant="insight">
          NumPy is the engine; Pandas is the dashboard. Most data science workflows use both.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Pandas loads and represents large, messy tables efficiently.',
          'Mixed column types and labeled rows/columns match real data better than NumPy alone.',
          'Rich built-ins for filter, group, merge, and clean beat hand-rolled Python for tabular work.',
        ]}
      />
    </LessonArticle>
  )
}
