import {
  Callout,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
  ScatterPlot,
} from '../../../../../components/content'

export function SlrIntroduction() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Take a breath — this is simpler than it sounds">
        The name “simple linear regression” looks heavy. In plain English it means:{' '}
        <strong className="text-white">draw one straight line through your data</strong>, then use
        that line to guess new answers. That is the whole idea. Everything else is just careful
        detail so the line is a good one.
      </Callout>

      <Definition term="Simple Linear Regression (in plain words)">
        <p>
          You have one input number (like hours studied) and one output number (like exam score).
          You want a <strong className="text-white">straight-line rule</strong> that connects them
          so that when a new student tells you their hours, you can estimate their score.
        </p>
        <p className="mt-2 text-slate-300">
          “Regression” here just means “predict a number.” “Linear” means “a straight line.”
          “Simple” means “only one input.”
        </p>
      </Definition>

      <LessonSection title="Start with a story, not a formula">
        <p className="text-slate-300">
          Imagine you are a teacher. You wrote down how long each student studied and what score
          they got:
        </p>
        <Example title="A tiny class notebook">
{`Student   Hours studied   Exam score
A         1               45
B         2               52
C         3               61
D         4               68
E         5               74`}
        </Example>
        <p className="mt-4 text-slate-300">
          Looking at this, you can already feel a pattern: <em>more hours → higher score</em>. You
          could guess by eye. Machine learning does the same thing, but carefully and repeatably —
          by finding the best straight line through those points.
        </p>
        <Flowchart
          title="What we are trying to do"
          chart={`flowchart TB
  A[Collect past examples] --> B[See the trend]
  B --> C[Draw the best straight line]
  C --> D[Use the line to guess for a new student]`}
        />
        <Callout variant="tip" title="You already know this idea">
          If you ever said “roughly, every extra hour of study adds about 7 marks,” you already did
          informal linear regression. We are just making that guess precise.
        </Callout>
      </LessonSection>

      <LessonSection title="Picture the dots and the line">
        <p className="text-slate-300">
          Put hours on the horizontal axis and score on the vertical axis. Each student is a dot.
          Simple linear regression draws one straight line that stays as close as possible to those
          dots.
        </p>
        <ScatterPlot
          title="The five students and one straight line"
          points={[
            { x: 1, y: 45 },
            { x: 2, y: 52 },
            { x: 3, y: 61 },
            { x: 4, y: 68 },
            { x: 5, y: 74 },
          ]}
          line={{ slope: 7, intercept: 40 }}
          xLabel="Hours studied"
          yLabel="Exam score"
          caption="Blue dots are the real students. The green line is our guess machine — it does not touch every dot, but it stays close to all of them."
        />
        <ContentStep number={1} title="The dots are facts">
          <p className="text-slate-300">
            Real students, real scores. We do not change the dots. We only choose the line.
          </p>
        </ContentStep>
        <ContentStep number={2} title="The line is our guess machine">
          <p className="text-slate-300">
            For any hours value — even one we never saw — the line gives a predicted score.
          </p>
        </ContentStep>
        <ContentStep number={3} title="The line will not hit every dot">
          <p className="text-slate-300">
            Real life is messy. Some students score a bit high or low. That is fine. We want a line
            that is <em>close overall</em>, not perfect for one lucky student.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="The line in everyday language">
        <p className="text-slate-300">
          Every straight line on a plot can be described with two ideas:
        </p>
        <ContentStep number={1} title="Where it starts (intercept)">
          <p className="text-slate-300">
            “If someone studied zero hours, what score would our rule guess?” That starting height is
            the intercept. Later we call it θ₀ (theta-zero) — just a fancy name.
          </p>
        </ContentStep>
        <ContentStep number={2} title="How steep it is (slope)">
          <p className="text-slate-300">
            “For each extra hour of study, how many marks does the guess go up?” That steepness is
            the slope. Later we call it θ₁ (theta-one).
          </p>
        </ContentStep>
        <Example title="A friendly way to say the rule">
{`Predicted score ≈ starting score + (marks per hour × hours)

Example:
  starting score = 40
  marks per hour = 7
  for 3 hours → 40 + 7×3 = 61`}
        </Example>
        <Callout variant="beginner" title="About those Greek letters">
          ML notes love θ (theta). You can always read θ₀ as “starting value” and θ₁ as “how much
          we add per unit of x.” Do not let the symbols scare you — the idea is school-level
          straight-line algebra.
        </Callout>
      </LessonSection>

      <LessonSection title="What “best” line means (gently)">
        <p className="text-slate-300">
          Suppose two classmates draw different lines. How do we decide who is closer?
        </p>
        <ContentStep number={1} title="Check each student">
          <p className="text-slate-300">
            For every past student, look at: actual score vs what the line predicted. The difference
            is the mistake (also called error or residual).
          </p>
        </ContentStep>
        <ContentStep number={2} title="Prefer smaller mistakes overall">
          <p className="text-slate-300">
            Add up how bad the mistakes are across the whole class. The line with the smaller total
            “badness” wins. That total badness is what later lessons call a{' '}
            <strong className="text-white">cost function</strong> — just a score for “how wrong is
            this line?”
          </p>
        </ContentStep>
        <Flowchart
          title="Choosing a line (intuition)"
          chart={`flowchart TB
  A[Try a line] --> B[Predict every student's score]
  B --> C[See how far off we are]
  C --> D{Mistakes small enough?}
  D -- No --> E[Adjust the line]
  E --> B
  D -- Yes --> F[Use this line for new students]`}
        />
      </LessonSection>

      <LessonSection title="Why beginners should start here">
        <p className="text-slate-300">
          Because almost every ML model later follows the same three questions:
        </p>
        <ContentStep number={1} title="What is our guess rule?">
          <p className="text-slate-300">Here: a straight line.</p>
        </ContentStep>
        <ContentStep number={2} title="How do we score a bad guess?">
          <p className="text-slate-300">Here: total prediction error (cost).</p>
        </ContentStep>
        <ContentStep number={3} title="How do we improve the rule?">
          <p className="text-slate-300">Here: adjust the line until the cost is small.</p>
        </ContentStep>
        <Callout variant="insight" title="You are not behind">
          If formulas feel loud at first, stay with the story. Re-read this lesson once. The next
          lessons only name the pieces you already understand: the line, the mistakes, and how we
          shrink those mistakes.
        </Callout>
      </LessonSection>

      <LessonSection title="Roadmap for this sub-topic (easy pace)">
        <ContentStep number={1} title="Equations">
          <p className="text-slate-300">Write the line with symbols — slowly, with examples.</p>
        </ContentStep>
        <ContentStep number={2} title="Cost function">
          <p className="text-slate-300">Turn “how wrong” into one number we can minimize.</p>
        </ContentStep>
        <ContentStep number={3} title="Finding the best line">
          <p className="text-slate-300">First with calm math, then with step-by-step gradient descent.</p>
        </ContentStep>
        <ContentStep number={4} title="Metrics and notebooks">
          <p className="text-slate-300">How to report quality, then code you can follow cell by cell.</p>
        </ContentStep>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Simple linear regression = one input, one output, one straight-line rule.',
          'The line has a start height (intercept) and a steepness (slope).',
          'We choose the line that stays close to past examples overall.',
          'You already understand the story — later lessons only make it precise.',
        ]}
      />
    </LessonArticle>
  )
}
