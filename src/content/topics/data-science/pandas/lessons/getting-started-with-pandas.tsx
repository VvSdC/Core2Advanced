import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'
export function GettingStartedWithPandas() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="You are in the right place">
        This Pandas track assumes a little Python and comfort with the NumPy ideas from the earlier
        lessons (arrays, shape, vectorized math). You do{' '}
        <strong className="text-white">not</strong> need SQL or statistics yet. We start with
        spreadsheets-in-code, use plain English, then add notebook cells you can copy.
      </Callout>
      <Definition term="What is Pandas?">
        <p>
          <strong className="text-white">Pandas</strong> is a Python library for working with
          tabular data — rows and columns like Excel or a database table. It gives you labeled rows,
          mixed column types, and tools to clean, filter, and summarize real-world datasets without
          writing endless loops.
        </p>
      </Definition>
      <LessonSection title="How to use this track">
        <ContentStep number={1} title="Follow the catalog order">
          <p className="text-slate-300">
            Sub-topics move from “what is Pandas?” → “Series and DataFrame” → “load and explore” →
            “select rows/columns” → “clean missing values” → “reshape and combine” → “charts and
            insights.” Skip ahead only after Series and DataFrame feel familiar.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Read the English before the code">
          <p className="text-slate-300">
            Every notebook cell starts with a goal in words. Understand the goal, then read the code
            and output. Typing the same lines in Jupyter or Colab makes the ideas stick.
          </p>
        </ContentStep>
        <ContentStep number={3} title="One idea per sitting">
          <p className="text-slate-300">
            If a lesson feels long, stop after two or three cells. Pandas is muscle memory — small,
            repeated practice beats one long cram session.
          </p>
        </ContentStep>
        <Flowchart
          title="Your learning path"
          chart={`flowchart TB
  A[Intro — why Pandas?] --> B[Series & DataFrame]
  B --> C[Read & explore data]
  C --> D[Select rows & columns]
  D --> E[Clean missing values]
  E --> F[Wrangle & reshape]
  F --> G[Viz & insights]
  G --> H[Advanced topics]`}
        />
      </LessonSection>
      <LessonSection title="Words you will hear (no stress)">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Word</th>
                <th className="px-4 py-3">Friendly meaning</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Series', 'One labeled column of values (1-D)'],
                ['DataFrame', 'A full table — rows and columns (2-D)'],
                ['index', 'Row labels (often 0, 1, 2… or dates, names)'],
                ['column', 'A named field in the table, like “score” or “city”'],
                ['NaN', '“Missing value” placeholder — not zero, not empty string'],
                ['groupby', 'Split data into groups, then summarize each group'],
                ['merge', 'Join two tables on shared keys, like SQL JOIN'],
              ].map(([word, meaning]) => (
                <tr key={word} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{word}</td>
                  <td className="px-4 py-3">{meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip" title="Setup (one time)">
{`pip install pandas
# then in Python / notebook:
import pandas as pd`}
        </Callout>
      </LessonSection>
      <LessonSection title="What “basic → advanced” means here">
        <ContentStep number={1} title="Basic">
          <p className="text-slate-300">
            Create a Series and DataFrame, read a CSV, peek at the first rows, pick one column.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Comfortable">
          <p className="text-slate-300">
            Filter rows, handle missing values, sort, group and count, merge two tables.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Advanced (still beginner-friendly)">
          <p className="text-slate-300">
            Pivot tables, time-series indexing, and chaining steps into a readable analysis pipeline.
          </p>
        </ContentStep>
        <Callout variant="insight">
          You are not behind if terms feel new. Every later lesson reuses the same few ideas: table,
          index, column, select, clean, summarize.
        </Callout>
      </LessonSection>
      <KeyTakeaways
        items={[
          'Pandas = labeled tables in Python — the standard tool for real-world data work.',
          'Follow the catalog order; read goals before code; practice in small sittings.',
          'Series, DataFrame, index, column, NaN, groupby, and merge are the core vocabulary.',
        ]}
      />
    </LessonArticle>
  )
}
