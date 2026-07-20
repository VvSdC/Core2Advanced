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

export function WhyMachineLearning() {
  return (
    <LessonArticle>
      <Definition term="When to use Machine Learning">
        <p>
          Use ML when writing exhaustive rules is <strong className="text-white">impractical</strong>,
          when the problem <strong className="text-white">changes over time</strong>, or when the
          signal lives in <strong className="text-white">complex patterns</strong> humans cannot
          easily list — but you have (or can collect) lots of examples.
        </p>
      </Definition>

      <LessonSection title="Three situations where ML shines">
        <ContentStep number={1} title="Problems too complex for hand-crafted rules">
          <p className="text-slate-300">
            Recognizing handwritten digits, detecting objects in photos, or ranking search results
            involves thousands of weak signals. Encoding them as <code className="font-mono text-sm">if</code>{' '}
            statements does not scale.
          </p>
          <Example title="Spam filter — rules vs learning">
{`Rule-based (fragile):
  if email contains "FREE $$$" → spam
  if sender is unknown → maybe spam
  … hundreds of brittle rules …

ML approach:
  show thousands of labeled emails (spam / not spam)
  model learns which combinations of words, links,
  and sender patterns actually predict spam`}
          </Example>
        </ContentStep>

        <ContentStep number={2} title="Problems that keep changing">
          <p className="text-slate-300">
            Fraud patterns, spam tricks, and user taste evolve. Retraining (or online updates) adapts
            the system without rewriting a giant rulebook every week.
          </p>
          <Flowchart
            title="Adaptation over time"
            chart={`flowchart TB
  A[New behavior appears] --> B{System type}
  B -- Fixed rules --> C[Engineers rewrite rules]
  B -- ML model --> D[Collect new labeled examples]
  D --> E[Retrain or update model]
  E --> F[Predictions stay current]
  C --> F`}
          />
        </ContentStep>

        <ContentStep number={3} title="Insights buried in data">
          <p className="text-slate-300">
            Clustering customers, finding unusual sensors readings, or discovering topics in
            documents can reveal structure nobody planned to look for.
          </p>
          <Callout variant="tip" title="ML is not always the answer">
            If a simple rule or SQL query already solves the problem reliably, start there. Machine
            learning adds power — and also data, monitoring, and failure modes.
          </Callout>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Concrete wins you already use">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">What ML does</th>
                <th className="px-4 py-3">Why rules struggle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Email spam filter', 'Classifies spam vs ham', 'Spammers invent new tricks daily'],
                ['Photo apps', 'Find faces / scenes', 'Pixels do not look like English rules'],
                ['Recommendations', 'Suggest next video / product', 'Taste is personal and shifting'],
                ['Voice assistants', 'Turn speech into text', 'Accents, noise, and phrasing vary'],
                ['Maps & traffic', 'Estimate travel time', 'Conditions change every minute'],
              ].map(([product, does, why]) => (
                <tr key={product} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{product}</td>
                  <td className="px-4 py-3">{does}</td>
                  <td className="px-4 py-3 text-slate-400">{why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="What you still need besides an algorithm">
        <Flowchart
          title="ML needs a whole stack of ingredients"
          chart={`flowchart TB
  A[Clear problem] --> E[Useful ML system]
  B[Enough relevant data] --> E
  C[Way to measure success] --> E
  D[Plan to monitor & update] --> E`}
        />
        <Callout variant="beginner">
          An algorithm alone is not enough. Bad data or a vague goal will beat a fancy model every
          time. Later lessons cover data quality and evaluation.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'ML helps when rules are too complex, too brittle, or change too often.',
          'Many everyday products — spam, recommendations, vision, speech — rely on learned patterns.',
          'Prefer a simple non-ML solution when it already works well.',
          'Success needs a clear problem, data, metrics, and a plan to maintain the model.',
        ]}
      />
    </LessonArticle>
  )
}
