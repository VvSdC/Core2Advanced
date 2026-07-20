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

export function TheMlWorkflow() {
  return (
    <LessonArticle>
      <Definition term="The Machine Learning Workflow">
        <p>
          Real ML work is a <strong className="text-white">pipeline</strong>, not a single algorithm
          call. You frame the problem, gather and clean data, create features, train models, evaluate
          honestly, then deploy and monitor — and often loop back when something breaks.
        </p>
      </Definition>

      <LessonSection title="End-to-end map">
        <Flowchart
          title="A practical ML lifecycle"
          chart={`flowchart TB
  A[1. Define the problem] --> B[2. Collect data]
  B --> C[3. Explore & clean]
  C --> D[4. Engineer features]
  D --> E[5. Train models]
  E --> F[6. Evaluate]
  F --> G{Good enough?}
  G -- No --> D
  G -- Yes --> H[7. Deploy]
  H --> I[8. Monitor]
  I --> B`}
        />
        <Callout variant="beginner">
          Beginners often jump to step 5. Pros spend most of their time on steps 1–4 and 6–8.
        </Callout>
      </LessonSection>

      <LessonSection title="Walk through each stage">
        <ContentStep number={1} title="Define the problem">
          <p className="text-slate-300">
            What decision will this model support? What is success (accuracy, revenue, fewer false
            alarms)? Is it classification, regression, ranking, or something else?
          </p>
          <Example title="Problem framing checklist">
{`Who uses the prediction?
What happens if the model is wrong?
Do we have (or can we get) labels?
What baseline already exists (rules / human / mean)?`}
          </Example>
        </ContentStep>

        <ContentStep number={2} title="Collect data">
          <p className="text-slate-300">
            Pull from databases, logs, sensors, or public datasets. Check coverage: do examples
            represent the real situations you will see in production?
          </p>
        </ContentStep>

        <ContentStep number={3} title="Explore and clean">
          <p className="text-slate-300">
            Plot distributions, find missing values, outliers, duplicates, and leakage (features that
            accidentally reveal the label). Cleaning here prevents garbage-in, garbage-out.
          </p>
        </ContentStep>

        <ContentStep number={4} title="Engineer features">
          <p className="text-slate-300">
            Transform raw fields into signals the model can use — ratios, bins, embeddings, text
            counts. This step often moves the needle more than switching algorithms.
          </p>
        </ContentStep>

        <ContentStep number={5} title="Train models">
          <p className="text-slate-300">
            Start simple (linear model or small tree). Compare a few approaches. Tune carefully using
            validation data — not the final test set.
          </p>
        </ContentStep>

        <ContentStep number={6} title="Evaluate">
          <p className="text-slate-300">
            Measure with metrics that match the business goal. A 99% accurate spam filter can still
            be terrible if it deletes important mail (false positives).
          </p>
        </ContentStep>

        <ContentStep number={7} title="Deploy and monitor">
          <p className="text-slate-300">
            Serve predictions via an API or batch job. Watch for drift: input distributions change,
            performance drops, or the world shifts. Retrain when needed.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Always beat a baseline">
        <Flowchart
          title="Is the fancy model worth it?"
          chart={`flowchart TB
  A[Simple baseline] --> B[Measure metric]
  C[Your ML model] --> D[Measure same metric]
  B --> E{ML clearly better?}
  D --> E
  E -- No --> F[Keep baseline / improve data]
  E -- Yes --> G[Consider deploying ML]`}
        />
        <Callout variant="tip" title="Baselines keep you honest">
          Predicting the average price, always guessing the majority class, or a short rule set are
          powerful reality checks.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'ML is a lifecycle: problem → data → features → train → evaluate → deploy → monitor.',
          'Most impact often comes from problem framing, data quality, and features.',
          'Evaluate with metrics that match real costs of mistakes.',
          'Always compare against a simple baseline before celebrating a complex model.',
        ]}
      />
    </LessonArticle>
  )
}
