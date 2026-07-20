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

export function BatchVsOnlineLearning() {
  return (
    <LessonArticle>
      <Definition term="Batch vs Online Learning">
        <p>
          <strong className="text-white">Batch (offline) learning</strong> trains on the whole
          dataset at once, then ships a fixed model. <strong className="text-white">Online
          learning</strong> updates the model incrementally as new data arrives — sometimes one
          example or mini-batch at a time.
        </p>
      </Definition>

      <LessonSection title="Batch learning — train, then freeze">
        <Flowchart
          title="Classic offline cycle"
          chart={`flowchart TB
  A[Collect full dataset] --> B[Train model offline]
  B --> C[Deploy model]
  C --> D[Serve predictions]
  D --> E[Later: collect more data]
  E --> B`}
        />
        <ContentStep number={1} title="Strengths">
          <p className="text-slate-300">
            Stable, easier to test thoroughly, and a good fit when data does not change every minute
            and you can afford periodic retraining.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Limitations">
          <p className="text-slate-300">
            Retraining on huge datasets can be slow and expensive. The live model may go stale until
            the next training run.
          </p>
        </ContentStep>
        <Example title="Typical batch scenarios">
{`Nightly fraud model rebuild from yesterday's labeled cases
Weekly recommendation model refresh
Monthly demand forecast using the last year of sales`}
        </Example>
      </LessonSection>

      <LessonSection title="Online learning — learn as you go">
        <Flowchart
          title="Incremental updates"
          chart={`flowchart TB
  A[New example arrives] --> B[Update model a little]
  B --> C[Model stays current]
  C --> A`}
        />
        <ContentStep number={1} title="Strengths">
          <p className="text-slate-300">
            Adapts quickly to changing patterns, uses less memory for huge streams, and can run on
            continuous data (clicks, sensors, logs).
          </p>
        </ContentStep>
        <ContentStep number={2} title="Watch-outs">
          <p className="text-slate-300">
            Bad data can corrupt the model in real time. You need careful monitoring, learning-rate
            control, and sometimes the ability to roll back.
          </p>
        </ContentStep>
        <Callout variant="tip" title="Mini-batch middle ground">
          Many systems update on small batches rather than true single-example online updates —
          more stable than pure online, fresher than full batch.
        </Callout>
      </LessonSection>

      <LessonSection title="When to prefer which">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Situation</th>
                <th className="px-4 py-3">Lean toward</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Stable problem, clear train/eval cycle', 'Batch'],
                ['Huge streaming data that never fits in memory', 'Online / incremental'],
                ['Patterns drift quickly (spam, trends)', 'Online or frequent batch retrain'],
                ['Need heavy validation before every change', 'Batch'],
                ['Edge devices with continuous sensor input', 'Online / onboard updates'],
              ].map(([sit, lean]) => (
                <tr key={sit} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3">{sit}</td>
                  <td className="px-4 py-3 font-medium text-white">{lean}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="beginner">
          This axis is about <em>when</em> the model updates — not about supervised vs unsupervised.
          You can have batch supervised models and online unsupervised detectors.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Batch learning trains on a full dataset, then deploys a fixed model until the next retrain.',
          'Online learning updates the model continuously as new data arrives.',
          'Online adapts faster but needs stronger monitoring against bad updates.',
          'Mini-batches often sit between pure batch and pure online learning.',
        ]}
      />
    </LessonArticle>
  )
}
