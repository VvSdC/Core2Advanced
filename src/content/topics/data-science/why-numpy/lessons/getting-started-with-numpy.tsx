import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function GettingStartedWithNumpy() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="You are in the right place">
        This NumPy track assumes only a little Python (lists, variables, print). You do{' '}
        <strong className="text-white">not</strong> need calculus or linear algebra. We start slow,
        use plain English, then add code with outputs you can copy.
      </Callout>

      <Definition term="What is NumPy?">
        <p>
          <strong className="text-white">NumPy</strong> is a Python library for working with numbers
          in bulk — tables of scores, sensor readings, image pixels — quickly and with short code.
          Almost every data science tool in Python builds on it.
        </p>
      </Definition>

      <LessonSection title="How to use this track">
        <ContentStep number={1} title="Follow the catalog order">
          <p className="text-slate-300">
            The sub-topics are arranged from “why bother?” → “what is an array?” → “how do I look
            inside?” → “how do I build and summarize?” → “cool payoff: images.” Skip around only after
            the first three feel comfortable.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Read the English before the code">
          <p className="text-slate-300">
            Every notebook cell starts with a goal in words. Understand the goal, then glance at the
            code and output. Typing it yourself in Jupyter/Colab locks it in.
          </p>
        </ContentStep>
        <ContentStep number={3} title="One idea per sitting">
          <p className="text-slate-300">
            If a lesson feels long, stop after two or three cells. Come back tomorrow. NumPy is a
            skill built by repetition, not by rushing.
          </p>
        </ContentStep>
        <Flowchart
          title="Your learning path"
          chart={`flowchart TB
  A[Why NumPy?] --> B[Arrays & dimensions]
  B --> C[dtype & shape]
  C --> D[Indexing & slicing]
  D --> E[Creation helpers]
  E --> F[Broadcasting]
  F --> G[Mean / median]
  G --> H[Filtering]
  H --> I[Images as matrices]
  I --> J[Next: Pandas]`}
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
                ['array / ndarray', 'A block of numbers NumPy can process fast'],
                ['vector', 'A single row or column of numbers (1-D)'],
                ['matrix', 'A table of numbers (2-D)'],
                ['shape', 'How many rows, columns, … the array has'],
                ['vectorized', 'Do math on the whole array at once (no manual loop)'],
                ['slice', 'Take a window of values, like list[2:5]'],
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
{`pip install numpy

# then in Python / notebook:
import numpy as np`}
        </Callout>
      </LessonSection>

      <LessonSection title="What “basic → advanced” means here">
        <ContentStep number={1} title="Basic">
          <p className="text-slate-300">
            Create an array, check shape, pick one value, compute a mean.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Comfortable">
          <p className="text-slate-300">
            Slice blocks, filter with conditions, build arrays with arange/linspace/zeros.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Advanced (still beginner-friendly)">
          <p className="text-slate-300">
            Treat an image as a matrix, crop it, and transform pixels with the same tools.
          </p>
        </ContentStep>
        <Callout variant="insight">
          You are not behind if symbols feel new. Every later lesson reuses the same few ideas:
          array, shape, index, vectorized math.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'NumPy = fast bulk number work in Python — start with lists-vs-arrays, then practice.',
          'Follow the catalog order; read goals before code; practice in small sittings.',
          'array, shape, slice, and vectorized ops are the core vocabulary for the whole track.',
        ]}
      />
    </LessonArticle>
  )
}
