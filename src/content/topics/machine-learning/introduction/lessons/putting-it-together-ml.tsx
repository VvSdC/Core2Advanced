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

export function PuttingItTogetherMl() {
  return (
    <LessonArticle>
      <Definition term="Your Mental Model of ML">
        <p>
          Machine learning turns <strong className="text-white">examples</strong> into a{' '}
          <strong className="text-white">model</strong> that predicts on new cases. You choose how
          much supervision you have, how the model updates, and how you prove it generalizes — then
          you run a careful workflow from problem to production.
        </p>
      </Definition>

      <LessonSection title="One flowchart to rule them all">
        <Flowchart
          title="Introduction to ML — big picture"
          chart={`flowchart TB
  P[Problem + metric] --> D[Data: features ± labels]
  D --> T{Learning type}
  T --> S[Supervised]
  T --> U[Unsupervised]
  T --> R[Reinforcement]
  S --> M[Train a model]
  U --> M
  R --> M
  M --> E[Validate & test]
  E --> G{Generalizes?}
  G -- No --> F[Fix data / capacity / regularization]
  F --> M
  G -- Yes --> Dep[Deploy + monitor]`}
        />
      </LessonSection>

      <LessonSection title="Quick self-check">
        <ContentStep number={1} title="Can you explain ML in one sentence?">
          <p className="text-slate-300">
            Computers learn patterns from data to make predictions — instead of relying only on
            hand-written rules.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Name the four technique families">
          <p className="text-slate-300">
            Supervised, unsupervised, semi-supervised, reinforcement — plus axes like batch vs online
            and instance-based vs model-based.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Why hold out a test set?">
          <p className="text-slate-300">
            To estimate performance on unseen data without fooling yourself during tuning.
          </p>
        </ContentStep>
        <Example title="Story: building a spam filter">
{`1. Problem: flag spam; metric: catch spam without deleting real mail
2. Data: labeled emails → features (words, links…) + label
3. Type: supervised binary classification
4. Model: start simple (logistic regression), maybe try trees
5. Split: train / val / test; watch overfitting
6. Ship: API scores new mail; monitor drift; retrain`}
        </Example>
      </LessonSection>

      <LessonSection title="What to learn next">
        <Flowchart
          title="Natural next steps in this Machine Learning topic"
          chart={`flowchart TB
  A[Introduction — you are here] --> B[Core algorithms]
  B --> C[Linear models & trees]
  C --> D[Evaluation metrics deep dive]
  D --> E[Feature engineering practice]
  E --> F[Projects with real datasets]`}
        />
        <Callout variant="tip" title="How to study from here">
          Re-read any lesson that felt fuzzy — especially features/labels, supervised vs unsupervised,
          and train/val/test. Those ideas appear in every later chapter.
        </Callout>
        <Callout variant="insight" title="Mindset">
          Amazing ML practitioners are curious about the data and ruthless about evaluation. Algorithms
          are tools; judgment is the craft.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'ML learns models from data to predict or discover structure.',
          'Pick the learning family from how feedback is provided (labels, none, rewards).',
          'Prove generalization with proper validation and a held-out test set.',
          'Workflow discipline — problem, data, features, evaluate, monitor — beats algorithm hype.',
        ]}
      />
    </LessonArticle>
  )
}
