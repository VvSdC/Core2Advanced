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

export function FeaturesLabelsAndData() {
  return (
    <LessonArticle>
      <Definition term="Features & Labels">
        <p>
          A <strong className="text-white">feature</strong> is one piece of input information about
          an example (size, age, word count…). A <strong className="text-white">label</strong> is the
          answer you want the model to predict for that example (price, spam/ham, disease/no disease).
        </p>
        <p className="mt-2 text-slate-300">
          Together, features + labels form <strong className="text-white">labeled training data</strong>.
          Features alone are what you feed the model at prediction time.
        </p>
      </Definition>

      <LessonSection title="One row = one example">
        <p className="text-slate-300">
          Think of a spreadsheet. Each <strong className="text-white">row</strong> is one example
          (one house, one email, one patient). Each <strong className="text-white">column</strong>{' '}
          (except the label) is a feature.
        </p>
        <Example title="House price dataset (tiny)">
{`sqft   bedrooms   age_years   price      ← label
800    2          40          180000
1200   3          15          250000
1600   3          8           310000
1400   2          20          ???        ← predict this`}
        </Example>
        <Flowchart
          title="From a table to a prediction"
          chart={`flowchart TB
  A[Features: sqft, bedrooms, age] --> B[Model]
  B --> C[Predicted label: price]
  D[Historical rows with known price] --> E[Training]
  E --> B`}
        />
      </LessonSection>

      <LessonSection title="Types of features you will meet">
        <ContentStep number={1} title="Numeric">
          <p className="text-slate-300">
            Continuous or countable numbers: temperature, income, click count. Models often use these
            directly (sometimes after scaling).
          </p>
        </ContentStep>
        <ContentStep number={2} title="Categorical">
          <p className="text-slate-300">
            Named groups: city, color, product type. Usually converted to numbers (one-hot encoding,
            embeddings) before most algorithms can consume them.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Text, images, audio">
          <p className="text-slate-300">
            Raw media is turned into numeric features (bag-of-words, pixels, spectrograms, embeddings)
            so algorithms can work with vectors of numbers.
          </p>
        </ContentStep>
        <Callout variant="tip" title="Feature engineering">
          Choosing and transforming features — often more important than picking a fancy algorithm —
          is called <strong className="text-white">feature engineering</strong>. Good features make
          patterns easier to learn.
        </Callout>
      </LessonSection>

      <LessonSection title="Labeled vs unlabeled data">
        <Flowchart
          title="Do we know the answer for each example?"
          chart={`flowchart TB
  A[Dataset] --> B{Labels available?}
  B -- Yes --> C[Supervised learning possible]
  B -- No --> D[Unsupervised / self-supervised paths]
  C --> E[Learn to map features → label]
  D --> F[Find structure: groups, anomalies, compression]`}
        />
        <Example title="Same emails, different setups">
{`Labeled (supervised):
  features = words, links, sender…
  label    = spam or ham

Unlabeled (unsupervised):
  features = words, links, sender…
  label    = (none) — maybe cluster similar emails`}
        </Example>
        <Callout variant="beginner">
          Labels are expensive — humans must tag spam, draw boxes on images, or diagnose cases. That
          is why unlabeled data is abundant and labeled data is precious.
        </Callout>
      </LessonSection>

      <LessonSection title="Instances, datasets, and vectors">
        <p className="text-slate-300">
          Each example is also called an <strong className="text-white">instance</strong> or{' '}
          <strong className="text-white">sample</strong>. Features for one instance are often written
          as a vector <span className="font-mono text-sm text-machine-learning-400">x</span>; the
          label as <span className="font-mono text-sm text-machine-learning-400">y</span>. A whole
          dataset is many <span className="font-mono text-sm text-machine-learning-400">(x, y)</span>{' '}
          pairs.
        </p>
        <Example title="Notation you will see everywhere">
{`x  = feature vector for one example
y  = label for that example
X  = matrix of all feature rows
y  = vector of all labels
ŷ  = model's prediction ("y-hat")`}
        </Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Features are inputs; labels are the answers you want to predict.',
          'Each row is one example; columns (except the label) are features.',
          'Features can be numeric, categorical, or derived from text/images/audio.',
          'Labeled data enables supervised learning; unlabeled data still has structure to discover.',
        ]}
      />
    </LessonArticle>
  )
}
