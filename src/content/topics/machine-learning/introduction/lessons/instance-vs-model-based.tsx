import {
  Callout,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function InstanceVsModelBased() {
  return (
    <LessonArticle>
      <Definition term="Instance-Based vs Model-Based Learning">
        <p>
          <strong className="text-white">Instance-based</strong> methods remember training examples
          and compare new points to them at prediction time.{' '}
          <strong className="text-white">Model-based</strong> methods compress the training data into
          a smaller set of parameters (a model) and discard the raw examples for inference.
        </p>
      </Definition>

      <LessonSection title="Instance-based — “learn by remembering”">
        <p className="text-slate-300">
          Training is mostly storing examples. Prediction looks up similar past cases and copies or
          averages their labels. The classic algorithm is{' '}
          <strong className="text-white">k-Nearest Neighbors (k-NN)</strong>.
        </p>
        <Flowchart
          title="k-NN style prediction"
          chart={`flowchart TB
  A[New example] --> B[Find k closest training examples]
  B --> C[Look at their labels]
  C --> D[Vote or average]
  D --> E[Prediction]`}
        />
        <Example title="Intuition — recommending a movie">
{`You want to guess if Alex will like a film.
Find 5 people with similar taste history (neighbors).
If 4 of 5 liked it → predict "like".

No equation was fit — similarity did the work.`}
        </Example>
        <ContentStep number={1} title="Pros">
          <p className="text-slate-300">
            Simple idea, adapts when you add examples, and makes few assumptions about the shape of
            the pattern.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Cons">
          <p className="text-slate-300">
            Prediction can be slow on huge datasets (must search neighbors). Needs a good distance
            measure. Sensitive to irrelevant features and scale of features.
          </p>
        </ContentStep>
        <Callout variant="beginner">
          Instance-based is sometimes called <strong className="text-white">memory-based</strong> or{' '}
          <strong className="text-white">lazy learning</strong> — most work happens at prediction
          time, not during a long training phase.
        </Callout>
      </LessonSection>

      <LessonSection title="Model-based — “learn a compact rule”">
        <p className="text-slate-300">
          Training builds a model with parameters — a line, a tree, a neural net. After training you
          mainly need those parameters to predict, not the full dataset.
        </p>
        <Flowchart
          title="Fit a model, then use it"
          chart={`flowchart TB
  A[Training data] --> B[Choose model family]
  B --> C[Fit parameters]
  C --> D[Compact model]
  E[New example] --> D
  D --> F[Prediction]
  D -.-> G[Training examples no longer required]`}
        />
        <Example title="Linear regression as model-based">
{`Assume: price ≈ a × sqft + b

Training finds best a and b from past sales.
Prediction: plug in new sqft — no need to scan all houses.

The pair (a, b) is the model.`}
        </Example>
        <ContentStep number={1} title="Pros">
          <p className="text-slate-300">
            Fast predictions, small memory footprint after training, and you can inspect or regularize
            the model structure.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Cons">
          <p className="text-slate-300">
            If you pick a bad model family (e.g. a straight line for a curved pattern), no amount of
            data will fix that mismatch — this is{' '}
            <strong className="text-white">model bias</strong>.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Side-by-side comparison">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3"></th>
                <th className="px-4 py-3">Instance-based</th>
                <th className="px-4 py-3">Model-based</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['What is stored', 'Training examples', 'Parameters / structure'],
                ['Heavy work when?', 'Mostly at prediction', 'Mostly during training'],
                ['Example', 'k-Nearest Neighbors', 'Linear models, trees, neural nets'],
                ['New data arrives', 'Just add examples', 'Usually retrain / update params'],
                ['Interpretability', '“Similar to these cases”', 'Depends on model type'],
              ].map(([row, inst, model]) => (
                <tr key={row} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{row}</td>
                  <td className="px-4 py-3">{inst}</td>
                  <td className="px-4 py-3">{model}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="insight" title="Both are machine learning">
          The goal is the same — generalize to new examples. The difference is whether generalization
          happens by comparing to stored cases or by applying a fitted function.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Instance-based methods remember examples and compare new points to them (e.g. k-NN).',
          'Model-based methods fit parameters and predict with a compact model.',
          'Instance-based is often lazy (work at prediction); model-based does heavy work at training.',
          'Choosing a model family that can represent the pattern is critical for model-based learning.',
        ]}
      />
    </LessonArticle>
  )
}
