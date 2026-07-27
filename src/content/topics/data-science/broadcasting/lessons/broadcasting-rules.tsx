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

export function BroadcastingRules() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Learn two rules, unlock most cases">
        You do not need to memorize every shape combo. Compare axes from the{' '}
        <strong className="text-white">right</strong>, and allow match-or-1.
      </Callout>

      <Definition term="Broadcasting rules">
        <p>
          NumPy compares shapes <strong className="text-white">right to left</strong>. For each pair of
          sizes: they must be equal, or one of them must be <strong className="text-white">1</strong>,
          or one array may be missing that axis (treated like size 1). Otherwise → error.
        </p>
      </Definition>

      <LessonSection title="The rules in plain English">
        <ContentStep number={1} title="Align shapes on the right">
          <Example title="Padding shorter shapes on the left">
{`shape A:       (3,)
shape B:    (2, 3)
# compare as:
#        (1, 3)   ← imagine a leading 1
#        (2, 3)
# OK — first axis 1 vs 2, second axis 3 vs 3`}
          </Example>
        </ContentStep>
        <ContentStep number={2} title="Each axis: equal, or one is 1">
          <div className="overflow-x-auto rounded-xl border border-surface-600">
            <table className="w-full text-sm text-slate-300">
              <thead>
                <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                  <th className="px-4 py-3">Axis sizes</th>
                  <th className="px-4 py-3">OK?</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-600">
                {[
                  ['3 and 3', 'Yes — same size'],
                  ['1 and 5', 'Yes — stretch the 1'],
                  ['5 and 1', 'Yes — stretch the 1'],
                  ['4 and 5', 'No — conflict'],
                ].map(([sizes, ok]) => (
                  <tr key={sizes} className="hover:bg-surface-800/50">
                    <td className="px-4 py-3 font-mono text-data-science-400">{sizes}</td>
                    <td className="px-4 py-3">{ok}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ContentStep>
        <ContentStep number={3} title="Result shape takes the max size on each axis">
          <Example title="Examples">
{`(2, 3) + (3,)     → (2, 3)
(2, 3) + (2, 1)   → (2, 3)
(4, 1, 3) + (1, 5, 1) → (4, 5, 3)`}
          </Example>
        </ContentStep>
        <Flowchart
          title="Checking compatibility"
          chart={`flowchart TB
  A[Write both shapes] --> B[Align from the right]
  B --> C{Each axis equal or 1?}
  C -- Yes --> D[Broadcast + compute]
  C -- No --> E[ValueError: fix reshape / newaxis]`}
        />
      </LessonSection>

      <LessonSection title="Common patterns to recognize">
        <ContentStep number={1} title="Scalar + anything">
          <p className="text-slate-300">Always works: <code className="font-mono text-xs">A + 5</code>.</p>
        </ContentStep>
        <ContentStep number={2} title="(n,) with (m, n)">
          <p className="text-slate-300">
            Row-sized vector applied to every row of a matrix (very common).
          </p>
        </ContentStep>
        <ContentStep number={3} title="(m, 1) with (m, n)">
          <p className="text-slate-300">
            Column vector applied across every column — use a shape like{' '}
            <code className="font-mono text-xs">(m, 1)</code>.
          </p>
        </ContentStep>
        <Callout variant="tip" title="Need a column?">
{`v = np.array([10, 20])
col = v[:, np.newaxis]   # shape (2, 1)
# or: v.reshape(2, 1)`}
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Compare shapes from the right; missing axes act like size 1.',
          'Axes must match exactly or one side must be 1.',
          'Scalars, row vectors, and column vectors (…, 1) are the everyday patterns.',
        ]}
      />
    </LessonArticle>
  )
}
