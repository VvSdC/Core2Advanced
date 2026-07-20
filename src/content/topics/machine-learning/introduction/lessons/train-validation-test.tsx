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

export function TrainValidationTest() {
  return (
    <LessonArticle>
      <Definition term="Train, Validation & Test Sets">
        <p>
          Split your labeled data so you can <strong className="text-white">learn</strong>,{' '}
          <strong className="text-white">tune</strong>, and <strong className="text-white">judge</strong>{' '}
          honestly. The <strong className="text-white">training set</strong> fits the model. The{' '}
          <strong className="text-white">validation set</strong> helps choose settings. The{' '}
          <strong className="text-white">test set</strong> is a final, untouched exam for generalization.
        </p>
      </Definition>

      <LessonSection title="Why splitting matters">
        <p className="text-slate-300">
          If you test on the same data you trained on, scores look great even when the model only
          memorized. New data is what counts — so you must hide some examples until the end.
        </p>
        <Flowchart
          title="Three roles for your labeled data"
          chart={`flowchart TB
  A[All labeled data] --> B[Training set]
  A --> C[Validation set]
  A --> D[Test set]
  B --> E[Fit model parameters]
  C --> F[Tune hyperparameters / pick model]
  D --> G[Final honest score — once]`}
        />
        <Callout variant="beginner">
          Think of training as homework, validation as practice tests while you study, and the test
          set as the final exam you only take once.
        </Callout>
      </LessonSection>

      <LessonSection title="Typical split sizes">
        <Example title="Common starting ratios">
{`Small / medium data:
  70% train  / 15% validation  / 15% test
  or 80% train / 20% test  (then use cross-validation)

Large data:
  95%+ train / small val / small test still OK
  (absolute counts matter more than percentages)`}
        </Example>
        <ContentStep number={1} title="Hold out the test set early">
          <p className="text-slate-300">
            Lock the test set away. Do not peek while inventing features or tuning — every peek
            burns a bit of honesty.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Validation guides choices">
          <p className="text-slate-300">
            Learning rate, tree depth, which features to keep — compare options on validation
            performance, then optionally retrain on train+val before the final test.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Cross-validation (when data is scarce)">
        <p className="text-slate-300">
          <strong className="text-white">k-fold cross-validation</strong> rotates which slice is used
          for validation so every example gets a turn as “held out.” You average the scores.
        </p>
        <Flowchart
          title="5-fold cross-validation idea"
          chart={`flowchart TB
  A[Fold 1: val on part 1, train on rest] --> F[Average scores]
  B[Fold 2: val on part 2, train on rest] --> F
  C[Fold 3: val on part 3, train on rest] --> F
  D[Fold 4: val on part 4, train on rest] --> F
  E[Fold 5: val on part 5, train on rest] --> F
  F --> G[More stable estimate]`}
        />
        <Callout variant="tip" title="Still keep a final test set">
          Even with cross-validation for tuning, many teams keep one untouched test set for the
          last report — especially for papers or production go/no-go decisions.
        </Callout>
      </LessonSection>

      <LessonSection title="Generalization is the real goal">
        <p className="text-slate-300">
          <strong className="text-white">Generalization</strong> means performing well on examples
          the model has never seen. Training score alone cannot prove it — validation and test scores
          can.
        </p>
        <Example title="Reading the scores">
{`Train accuracy:  99%
Val accuracy:    82%
Test accuracy:   81%

→ Model likely overfits training data.
→ Val ≈ test is a healthy sign that val guided you well.`}
        </Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Train to fit; validate to tune; test once to estimate real-world performance.',
          'Never use the test set for decisions during development.',
          'Cross-validation helps when you lack enough data for a large validation split.',
          'Generalization — not training score — is what makes a model useful.',
        ]}
      />
    </LessonArticle>
  )
}
