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

export function SupervisedLearning() {
  return (
    <LessonArticle>
      <Definition term="Supervised Learning">
        <p>
          In <strong className="text-white">supervised learning</strong>, every training example
          comes with the correct answer (the <strong className="text-white">label</strong>). The
          algorithm practices predicting those answers and is corrected when it is wrong — like a
          student with an answer key.
        </p>
      </Definition>

      <LessonSection title="The learning loop">
        <Flowchart
          title="Train → predict → compare → improve"
          chart={`flowchart TB
  A[Features x] --> B[Model]
  B --> C[Prediction ŷ]
  D[True label y] --> E[Compare ŷ vs y]
  C --> E
  E --> F[Adjust model parameters]
  F --> B`}
        />
        <Callout variant="beginner">
          “Supervised” means the labels supervise the learning. Without labels, this loop has nothing
          to compare against.
        </Callout>
      </LessonSection>

      <LessonSection title="Classification — pick a class">
        <p className="text-slate-300">
          The model outputs a <strong className="text-white">category</strong>. Binary classification
          has two classes; multi-class has more.
        </p>
        <Example title="Email: spam or not?">
{`Input features:  words, sender domain, link count…
Possible labels: spam | ham

Binary classification → one of two classes`}
        </Example>
        <ContentStep number={1} title="Decision boundary (intuition)">
          <p className="text-slate-300">
            Imagine plotting two features on a plane. A classifier draws a boundary that separates
            classes as well as possible. New points are labeled by which side they fall on.
          </p>
          <Flowchart
            title="Classification at a glance"
            chart={`flowchart TB
  A[New example] --> B[Compute features]
  B --> C[Model scores each class]
  C --> D[Pick highest score / probability]
  D --> E[Predicted class]`}
          />
        </ContentStep>
        <ContentStep number={2} title="Probabilities help">
          <p className="text-slate-300">
            Many classifiers also output confidence (e.g. 90% spam). You can set thresholds: only
            auto-delete if confidence is very high.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Regression — predict a number">
        <p className="text-slate-300">
          The model outputs a <strong className="text-white">continuous value</strong>. Error is often
          measured by how far the prediction is from the true number (absolute or squared error).
        </p>
        <Example title="Predict tomorrow's temperature">
{`Features:  season, humidity, wind, yesterday's temp…
Label:     temperature in °C  (a real number)

Regression → numeric target`}
        </Example>
        <Callout variant="tip" title="Classification vs regression cheat">
          Ask: “Could I put the answer on a number line where closeness matters?” If yes → often
          regression. If answers are names/tags with no natural distance → classification.
        </Callout>
      </LessonSection>

      <LessonSection title="Classic supervised algorithms (names only for now)">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Algorithm</th>
                <th className="px-4 py-3">Often used for</th>
                <th className="px-4 py-3">Beginner intuition</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Linear / logistic regression', 'Regression / binary class', 'Fit a straight line or simple curve'],
                ['Decision trees / forests', 'Both', 'Ask yes/no questions like a flowchart'],
                ['k-Nearest Neighbors', 'Both', 'Copy the labels of nearby examples'],
                ['SVM', 'Classification', 'Draw the widest safe gap between classes'],
                ['Neural nets', 'Both (complex data)', 'Stack flexible pattern detectors'],
              ].map(([algo, use, intuition]) => (
                <tr key={algo} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{algo}</td>
                  <td className="px-4 py-3">{use}</td>
                  <td className="px-4 py-3 text-slate-400">{intuition}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="info">
          You do not need to memorize these yet. Later topics teach them one by one. For now, know
          they all follow the same supervised idea: learn from labeled examples.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Supervised learning trains on features paired with known labels.',
          'Classification predicts categories; regression predicts numeric values.',
          'Training compares predictions to true labels and improves the model.',
          'Many algorithms exist; they share the same supervised learning goal.',
        ]}
      />
    </LessonArticle>
  )
}
