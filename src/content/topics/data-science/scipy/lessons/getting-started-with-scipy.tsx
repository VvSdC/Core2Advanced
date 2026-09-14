import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function GettingStartedWithScipy() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="You are in the right place">
        This SciPy track assumes comfort with Python and the NumPy ideas from earlier lessons (arrays,
        shape, vectorized math). You do <strong className="text-white">not</strong> need calculus or
        advanced math yet. We start with plain English, then add code with outputs you can copy.
      </Callout>

      <Definition term="What is SciPy?">
        <p>
          <strong className="text-white">SciPy</strong> is a Python library for scientific computing —
          optimization, interpolation, integration, signal processing, and more. It builds on NumPy
          arrays and gives you trusted algorithms so you do not reinvent the math wheel.
        </p>
      </Definition>

      <LessonSection title="How to study this track">
        <ContentStep number={1} title="Follow the catalog order">
          <p className="text-slate-300">
            Sub-topics move from “what is SciPy?” → “why use it?” → optimization → interpolation →
            integration → curve fitting → signal processing → convolution → ML pipelines. Skip ahead
            only after NumPy arrays feel familiar.
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
            If a lesson feels long, stop after two or three cells. SciPy is muscle memory — small,
            repeated practice beats one long cram session.
          </p>
        </ContentStep>
        <Flowchart
          title="Your learning path"
          chart={`flowchart TB
  A[Intro — what is SciPy?] --> B[Optimization]
  B --> C[Interpolation]
  C --> D[Integration]
  D --> E[Curve fitting]
  E --> F[Signal processing]
  F --> G[Convolution]
  G --> H[ML pipelines]`}
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
                ['optimize', 'Find the best settings — lowest error, best fit, fastest result'],
                ['interpolate', 'Fill in missing or in-between values from known points'],
                ['integrate', 'Compute area under a curve or total change over time'],
                ['signal', 'A sequence of measurements over time — sensor, audio, stock price'],
                ['ndarray', 'NumPy array — the data container SciPy algorithms expect'],
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
{`pip install scipy

# then in Python / notebook:
import scipy
from scipy import optimize, interpolate, integrate, signal`}
        </Callout>
      </LessonSection>

      <LessonSection title="What “basic → advanced” means here">
        <ContentStep number={1} title="Basic">
          <p className="text-slate-300">
            Import SciPy submodules, fit a simple curve, fill gaps in a time series, compute area
            under a bell curve.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Comfortable">
          <p className="text-slate-300">
            Tune parameters with minimize, resample uneven data, solve a simple ODE, smooth noisy
            signals.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Advanced (still beginner-friendly)">
          <p className="text-slate-300">
            Chain SciPy steps into preprocessing pipelines that feed Pandas tables and sklearn
            models.
          </p>
        </ContentStep>
        <Callout variant="insight">
          You are not behind if terms feel new. Every later lesson reuses the same few ideas: NumPy
          arrays in, SciPy algorithm, useful numbers out.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'SciPy = trusted scientific algorithms on top of NumPy — optimization, interpolation, integration, and more.',
          'Follow the catalog order; read goals before code; practice in small sittings.',
          'optimize, interpolate, integrate, signal, and ndarray are the core vocabulary for this track.',
        ]}
      />
    </LessonArticle>
  )
}
