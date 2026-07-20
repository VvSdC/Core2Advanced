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

export function WhatIsMachineLearning() {
  return (
    <LessonArticle>
      <Definition term="Machine Learning">
        <p>
          <strong className="text-white">Machine Learning (ML)</strong> is a way for computers to{' '}
          <strong className="text-white">learn patterns from data</strong> instead of following only
          hand-written rules. You show the system many examples; it finds what those examples have in
          common; then it uses those patterns to make predictions on new data.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: teaching a child to recognize cats by showing many photos — not by writing a
          200-page rulebook of whiskers, ears, and fur.
        </p>
      </Definition>

      <Callout variant="beginner" title="Who this track is for">
        Absolute beginners. No math background required yet. We start with ideas and pictures, then
        build vocabulary you will reuse in every later ML topic.
      </Callout>

      <LessonSection title="Traditional programming vs machine learning">
        <p className="text-slate-300">
          In classical programming you write rules and feed in data; the computer produces answers.
          In machine learning you feed in data <em>and</em> answers (or feedback); the computer
          produces the rules — often called a <strong className="text-white">model</strong>.
        </p>
        <Flowchart
          title="Two ways to get answers from a computer"
          chart={`flowchart TB
  subgraph Traditional["Traditional programming"]
    R[Rules you write] --> P1[Program]
    D1[Data] --> P1
    P1 --> A1[Answers]
  end
  subgraph ML["Machine learning"]
    D2[Data] --> T[Training]
    A2[Answers / feedback] --> T
    T --> M[Model = learned rules]
    D3[New data] --> M
    M --> A3[Predictions]
  end`}
        />
        <ContentStep number={1} title="Rules get hard fast">
          <p className="text-slate-300">
            Spam filters, face recognition, and fraud detection have too many edge cases for humans
            to encode by hand. Patterns in data scale better than rule lists.
          </p>
        </ContentStep>
        <ContentStep number={2} title="The model is the learned program">
          <p className="text-slate-300">
            After training, the model is a compact description of what the data taught it. At
            prediction time you only need new inputs — not the original training labels.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="A tiny everyday example">
        <p className="text-slate-300">
          Suppose you want to guess house price from size. You collect past sales, then let an
          algorithm draw a simple line through the cloud of points. That line <em>is</em> the model.
        </p>
        <Example title="Mental picture — size → price">
{`Training data (examples):
  800 sq ft  → $180,000
  1,200 sq ft → $250,000
  1,600 sq ft → $310,000
  …

Learned idea (simplified):
  price ≈ a × size + b

New house: 1,400 sq ft → model predicts ~$280,000`}
        </Example>
        <Callout variant="insight" title="Learning means improving with experience">
          Tom Mitchell&apos;s classic definition: a program learns from experience{' '}
          <span className="font-mono text-sm text-machine-learning-400">E</span> with respect to
          task <span className="font-mono text-sm text-machine-learning-400">T</span> and performance
          measure <span className="font-mono text-sm text-machine-learning-400">P</span> if its
          performance on <span className="font-mono text-sm text-machine-learning-400">T</span>, as
          measured by <span className="font-mono text-sm text-machine-learning-400">P</span>, improves
          with <span className="font-mono text-sm text-machine-learning-400">E</span>.
        </Callout>
      </LessonSection>

      <LessonSection title="What you will learn in this sub-topic">
        <ContentStep number={1} title="Ideas first">
          <p className="text-slate-300">
            Why ML exists, how it differs from rules, and the words: features, labels, models,
            training, prediction.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Types of learning">
          <p className="text-slate-300">
            Supervised, unsupervised, and reinforcement learning — plus batch vs online and
            instance-based vs model-based.
          </p>
        </ContentStep>
        <ContentStep number={3} title="How good models are built">
          <p className="text-slate-300">
            The end-to-end workflow, common pitfalls, train/validation/test splits, and overfitting.
          </p>
        </ContentStep>
        <Example title="Vocabulary preview">
{`data       — examples the system learns from
feature    — one measurable input (size, age, pixels…)
label      — the answer you want to predict (price, spam/ham)
model      — the learned pattern / function
training   — adjusting the model using data
inference  — using the trained model on new data`}
        </Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Machine learning finds patterns in data instead of relying only on hand-written rules.',
          'Traditional code: rules + data → answers. ML: data + answers → a model that predicts.',
          'A model is the compact “program” learned from examples.',
          'This intro track builds vocabulary and mental models before algorithms and math.',
        ]}
      />
    </LessonArticle>
  )
}
