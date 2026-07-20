import {
  Callout,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
  NotebookCell,
} from '../../../../../components/content'

export function SlrPerformanceMetrics() {
  return (
    <LessonArticle>
      <Definition term="Regression Performance Metrics">
        <p>
          After (or while) fitting a line, we need numbers that say how good the predictions are.
          The three metrics every regression beginner should know are{' '}
          <strong className="text-white">MAE</strong>, <strong className="text-white">MSE</strong>, and{' '}
          <strong className="text-white">RMSE</strong> — all built from the gaps between true{' '}
          <span className="font-mono text-sm text-machine-learning-400">y</span> and predicted{' '}
          <span className="font-mono text-sm text-machine-learning-400">ŷ</span>.
        </p>
      </Definition>

      <Callout variant="beginner" title="Cost vs metric">
        During training we often minimize a cost (like MSE / 2). After training we{' '}
        <em>report</em> MAE, MSE, and RMSE on train and especially on{' '}
        <strong className="text-white">holdout / test</strong> data so we know how the model
        generalizes.
      </Callout>

      <LessonSection title="Residuals — the raw ingredient">
        <p className="text-slate-300">
          For each example: <span className="font-mono text-sm text-white">error = y − ŷ</span>{' '}
          (sometimes written ŷ − y; be consistent). Metrics summarize these errors across{' '}
          <span className="font-mono text-sm">m</span> examples.
        </p>
        <Flowchart
          title="From predictions to a scoreboard"
          chart={`flowchart TB
  A[True y] --> C[Residuals]
  B[Predicted ŷ] --> C
  C --> D[MAE]
  C --> E[MSE]
  C --> F[RMSE]
  D --> G[Compare models / report quality]
  E --> G
  F --> G`}
        />
      </LessonSection>

      <LessonSection title="MAE — Mean Absolute Error">
        <p className="mt-1 font-mono text-sm text-white md:text-base">
          MAE = (1/m) · Σ |y⁽ⁱ⁾ − ŷ⁽ⁱ⁾|
        </p>
        <ContentStep number={1} title="What it means">
          <p className="text-slate-300">
            Average size of the mistake, in the <strong className="text-white">same units</strong> as{' '}
            y (e.g. exam points, dollars). Easy to explain to non-ML stakeholders.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Behavior">
          <p className="text-slate-300">
            Treats a +10 and a −10 error the same (absolute value). Does{' '}
            <em>not</em> square, so a few huge outliers hurt less than they do with MSE/RMSE.
          </p>
        </ContentStep>
        <Example title="Hand calculation (3 points)" output={`MAE = (|10-12| + |20-18| + |30-29|) / 3 = (2+2+1)/3 ≈ 1.67`}>
{`y     = [10, 20, 30]
y_hat = [12, 18, 29]
# abs errors: 2, 2, 1
MAE = 5 / 3 ≈ 1.67`}
        </Example>
      </LessonSection>

      <LessonSection title="MSE — Mean Squared Error">
        <p className="mt-1 font-mono text-sm text-white md:text-base">
          MSE = (1/m) · Σ (y⁽ⁱ⁾ − ŷ⁽ⁱ⁾)²
        </p>
        <ContentStep number={1} title="What it means">
          <p className="text-slate-300">
            Average of <strong className="text-white">squared</strong> errors. Units are y² (e.g.
            “points²”), so the number is less intuitive to read aloud — but it matches what many
            trainers optimize.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Behavior">
          <p className="text-slate-300">
            Large errors dominate because of squaring. Useful when big mistakes are especially costly.
          </p>
        </ContentStep>
        <Callout variant="info" title="Link to the cost function lesson">
          Training cost was often J = (1/(2m)) Σ (ŷ − y)² — same squared idea as MSE, with a 1/2 for
          nicer derivatives. Reporting MSE usually uses 1/m without the 1/2.
        </Callout>
        <Example title="Same 3 points" output={`MSE = (2² + 2² + 1²) / 3 = 9/3 = 3.0`}>
{`squared errors: 4, 4, 1
MSE = 9 / 3 = 3.0`}
        </Example>
      </LessonSection>

      <LessonSection title="RMSE — Root Mean Squared Error">
        <p className="mt-1 font-mono text-sm text-white md:text-base">
          RMSE = √MSE = √[ (1/m) · Σ (y⁽ⁱ⁾ − ŷ⁽ⁱ⁾)² ]
        </p>
        <ContentStep number={1} title="What it means">
          <p className="text-slate-300">
            Square root brings the metric back to the <strong className="text-white">same units as
            y</strong> (like MAE), while still punishing large errors more (like MSE).
          </p>
        </ContentStep>
        <ContentStep number={2} title="Why people love it">
          <p className="text-slate-300">
            “Typical” error magnitude you can compare to the scale of the target — e.g. RMSE ≈ 2
            score points on a 0–100 exam.
          </p>
        </ContentStep>
        <Example title="Same 3 points" output={`RMSE = √3 ≈ 1.73`}>
{`MSE = 3.0
RMSE = sqrt(3) ≈ 1.73`}
        </Example>
      </LessonSection>

      <LessonSection title="MAE vs MSE vs RMSE — pick with intent">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Metric</th>
                <th className="px-4 py-3">Units</th>
                <th className="px-4 py-3">Outliers</th>
                <th className="px-4 py-3">Best when…</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['MAE', 'Same as y', 'More robust', 'You want a simple average error story'],
                ['MSE', 'y squared', 'Very sensitive', 'You optimize squared loss / need math convenience'],
                ['RMSE', 'Same as y', 'Sensitive', 'You want outlier-aware error in real units'],
              ].map(([metric, units, outliers, best]) => (
                <tr key={metric} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{metric}</td>
                  <td className="px-4 py-3">{units}</td>
                  <td className="px-4 py-3">{outliers}</td>
                  <td className="px-4 py-3 text-slate-400">{best}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip" title="Report more than one">
          In practice, publish MAE and RMSE together. If RMSE ≫ MAE, a few large misses are pulling
          the score up — investigate those rows.
        </Callout>
      </LessonSection>

      <LessonSection title="Notebook — compute all three">
        <p className="mb-4 text-slate-300">
          Using the study-hours line ŷ ≈ 39.27 + 6.92 · hours on all 10 training rows:
        </p>
        <div className="space-y-6">
          <NotebookCell
            cell={1}
            title="Predictions and residuals"
            code={`hours = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
scores = [45, 52, 61, 68, 74, 82, 88, 95, 100, 108]

theta0, theta1 = 39.2667, 6.9152
y_hat = [theta0 + theta1 * h for h in hours]
residuals = [y - yh for y, yh in zip(scores, y_hat)]

print("first 3 residuals:", [round(r, 2) for r in residuals[:3]])`}
            output={`first 3 residuals: [-1.18, -1.10, 0.99]`}
          >
            <p>Residual = actual − predicted. Positive means the model under-predicted that row.</p>
          </NotebookCell>

          <NotebookCell
            cell={2}
            title="MAE, MSE, and RMSE from scratch"
            code={`m = len(scores)

mae = sum(abs(r) for r in residuals) / m
mse = sum(r ** 2 for r in residuals) / m
rmse = mse ** 0.5

print("MAE  =", round(mae, 4))
print("MSE  =", round(mse, 4))
print("RMSE =", round(rmse, 4))`}
            output={`MAE  = 0.84
MSE  = 0.9006
RMSE = 0.949`}
          >
            <p>
              On average we are under ~0.84 score points (MAE). RMSE ~0.95 is a bit higher because
              squared penalties emphasize larger residuals.
            </p>
          </NotebookCell>

          <NotebookCell
            cell={3}
            title="Same metrics with scikit-learn"
            code={`from sklearn.metrics import mean_absolute_error, mean_squared_error

print("MAE  =", round(mean_absolute_error(scores, y_hat), 4))
print("MSE  =", round(mean_squared_error(scores, y_hat), 4))
print("RMSE =", round(mean_squared_error(scores, y_hat) ** 0.5, 4))`}
            output={`MAE  = 0.84
MSE  = 0.9006
RMSE = 0.949`}
          >
            <p>
              Library helpers match the formulas. Prefer computing metrics on a{' '}
              <strong className="text-white">test set</strong> when you have one — training metrics
              alone can hide overfitting.
            </p>
          </NotebookCell>
        </div>
      </LessonSection>

      <LessonSection title="How to use metrics well">
        <ContentStep number={1} title="Always compare against a baseline">
          <p className="text-slate-300">
            Predict the mean score for everyone. If your model&apos;s MAE is not clearly better, the
            fancy line is not helping yet.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Match the business cost">
          <p className="text-slate-300">
            If every point of error costs the same → MAE is natural. If large misses are disasters →
            lean on RMSE/MSE.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Lower is better (for these three)">
          <p className="text-slate-300">
            Unlike accuracy or R², MAE/MSE/RMSE should go <strong className="text-white">down</strong>{' '}
            as the model improves.
          </p>
        </ContentStep>
        <Callout variant="insight" title="Bonus: R²">
          R² (coefficient of determination) measures variance explained — 1.0 is a perfect fit on that
          set. It is popular in reports; still pair it with MAE/RMSE so you keep error in real units.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'MAE = average absolute error — same units as y, outlier-robust, easy to explain.',
          'MSE = average squared error — matches common training loss; units are y².',
          'RMSE = √MSE — outlier-sensitive like MSE, but back in the units of y.',
          'Report metrics on holdout data; compare MAE and RMSE to spot large-error cases.',
        ]}
      />
    </LessonArticle>
  )
}
