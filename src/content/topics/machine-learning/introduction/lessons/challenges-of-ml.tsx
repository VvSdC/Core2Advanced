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

export function ChallengesOfMl() {
  return (
    <LessonArticle>
      <Definition term="Main Challenges of Machine Learning">
        <p>
          ML fails more often from <strong className="text-white">bad data</strong>,{' '}
          <strong className="text-white">wrong assumptions</strong>, or{' '}
          <strong className="text-white">poor evaluation</strong> than from picking the “wrong”
          fashionable algorithm. Knowing the traps helps you avoid them early.
        </p>
      </Definition>

      <LessonSection title="Data problems (the usual suspects)">
        <ContentStep number={1} title="Not enough data">
          <p className="text-slate-300">
            Complex patterns need many examples. With tiny datasets, models memorize noise or never
            see rare but important cases.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Non-representative data">
          <p className="text-slate-300">
            If you train on last year&apos;s users in one country, the model may fail on new regions
            or new behavior. Training data must look like production data.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Poor quality — noise and errors">
          <p className="text-slate-300">
            Mislabelled examples, broken sensors, and typos teach the model the wrong lessons.
            Cleaning and label audits pay off.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Irrelevant features">
          <p className="text-slate-300">
            Extra noisy columns make learning harder. Feature selection and domain knowledge help the
            signal stand out.
          </p>
        </ContentStep>
        <Example title="Sampling bias example">
{`Survey of "favorite transport" posted only in a cycling club app.
Result: almost everyone "loves bikes".
Model trained on this → useless for the whole city.`}
        </Example>
      </LessonSection>

      <LessonSection title="Overfitting and underfitting (preview)">
        <Flowchart
          title="Two ways to miss the real pattern"
          chart={`flowchart TB
  A[Model complexity] --> B{Fit to training data}
  B -- Too simple --> C[Underfitting: misses pattern]
  B -- Too complex --> D[Overfitting: memorizes noise]
  B -- Just right --> E[Generalizes to new data]`}
        />
        <Callout variant="info" title="Next lesson goes deeper">
          Overfitting and underfitting deserve their own lesson — including how train/test splits
          reveal them.
        </Callout>
      </LessonSection>

      <LessonSection title="Other practical traps">
        <ContentStep number={1} title="Data leakage">
          <p className="text-slate-300">
            Accidentally including information that would not be available at prediction time (e.g.
            “days until churn” when predicting churn). Scores look amazing — then production fails.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Wrong metric">
          <p className="text-slate-300">
            Optimizing accuracy on imbalanced data can ignore the minority class that matters most
            (fraud, disease).
          </p>
        </ContentStep>
        <ContentStep number={3} title="Changing world (concept drift)">
          <p className="text-slate-300">
            The relationship between features and labels shifts. Yesterday&apos;s great model becomes
            today&apos;s liability without monitoring.
          </p>
        </ContentStep>
        <Flowchart
          title="Healthy skepticism checklist"
          chart={`flowchart TB
  A[Great validation score] --> B{Leakage checked?}
  B -- No --> C[Inspect features carefully]
  B -- Yes --> D{Metric matches goal?}
  D -- No --> E[Pick better metric]
  D -- Yes --> F{Data like production?}
  F -- No --> G[Fix sampling]
  F -- Yes --> H[More trustworthy result]`}
        />
        <Callout variant="tip" title="Start simple">
          A simple model on clean, honest data beats a complex model on messy, leaked, or biased data.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Data quantity, representativeness, and quality usually dominate algorithm choice.',
          'Underfitting misses patterns; overfitting memorizes noise — both hurt new data.',
          'Watch for leakage, bad metrics, and concept drift.',
          'Skeptical evaluation and simple baselines protect you from false wins.',
        ]}
      />
    </LessonArticle>
  )
}
