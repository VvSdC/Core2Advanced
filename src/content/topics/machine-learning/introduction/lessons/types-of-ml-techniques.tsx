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

export function TypesOfMlTechniques() {
  return (
    <LessonArticle>
      <Definition term="Types of Machine Learning">
        <p>
          ML systems are often grouped by <strong className="text-white">how much human guidance</strong>{' '}
          they get during learning: <strong className="text-white">supervised</strong> (labeled
          answers), <strong className="text-white">unsupervised</strong> (no labels),{' '}
          <strong className="text-white">semi-supervised</strong> (few labels), and{' '}
          <strong className="text-white">reinforcement</strong> (reward signals from actions).
        </p>
      </Definition>

      <LessonSection title="The big map">
        <Flowchart
          title="Main families of ML techniques"
          chart={`flowchart TB
  ML[Machine Learning] --> S[Supervised]
  ML --> U[Unsupervised]
  ML --> SS[Semi-supervised]
  ML --> R[Reinforcement]
  S --> S1[Classification]
  S --> S2[Regression]
  U --> U1[Clustering]
  U --> U2[Dimensionality reduction]
  U --> U3[Anomaly detection]
  R --> R1[Agent learns via rewards]`}
        />
        <Callout variant="beginner">
          Start by asking: “Do I have correct answers for my examples?” If yes → supervised. If no →
          unsupervised. If the system learns by trial and error in an environment → reinforcement.
        </Callout>
      </LessonSection>

      <LessonSection title="Supervised learning — learn from answers">
        <p className="text-slate-300">
          You provide pairs of <strong className="text-white">features + labels</strong>. The model
          learns a mapping so it can label new examples. Two big flavors:
        </p>
        <ContentStep number={1} title="Classification — predict a category">
          <p className="text-slate-300">
            Output is discrete: spam/ham, cat/dog, disease/no disease. Multi-class means more than
            two categories (digit 0–9).
          </p>
        </ContentStep>
        <ContentStep number={2} title="Regression — predict a number">
          <p className="text-slate-300">
            Output is continuous: house price, temperature, demand forecast.
          </p>
        </ContentStep>
        <Example title="Quick tell">
{`Is the answer a category?     → classification
Is the answer a quantity?     → regression
Do I have labels for training? → supervised`}
        </Example>
      </LessonSection>

      <LessonSection title="Unsupervised learning — find structure">
        <p className="text-slate-300">
          No labels. The algorithm looks for patterns: groups of similar items, unusual points, or a
          simpler representation of the data.
        </p>
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Technique</th>
                <th className="px-4 py-3">Goal</th>
                <th className="px-4 py-3">Everyday analogy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Clustering', 'Group similar examples', 'Sorting laundry by color without labels'],
                ['Dimensionality reduction', 'Compress many features', 'Summarizing a long book into themes'],
                ['Anomaly detection', 'Flag rare / weird points', 'Spotting a forged bill in a stack'],
              ].map(([tech, goal, analogy]) => (
                <tr key={tech} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{tech}</td>
                  <td className="px-4 py-3">{goal}</td>
                  <td className="px-4 py-3 text-slate-400">{analogy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Semi-supervised & reinforcement (preview)">
        <ContentStep number={1} title="Semi-supervised">
          <p className="text-slate-300">
            Lots of unlabeled data + a little labeled data. Common when labeling is expensive (medical
            images, documents).
          </p>
        </ContentStep>
        <ContentStep number={2} title="Reinforcement learning">
          <p className="text-slate-300">
            An <strong className="text-white">agent</strong> takes actions in an environment and gets{' '}
            <strong className="text-white">rewards</strong>. It learns a policy that maximizes long-term
            reward — games, robots, some recommendation systems.
          </p>
        </ContentStep>
        <Flowchart
          title="Choosing a family (starter decision tree)"
          chart={`flowchart TB
  Q1{Have labels?}
  Q1 -- Many labels --> SUP[Supervised]
  Q1 -- Few labels --> SEMI[Semi-supervised]
  Q1 -- No labels --> Q2{Learn by acting?}
  Q2 -- No --> UNS[Unsupervised]
  Q2 -- Yes --> RL[Reinforcement]`}
        />
        <Callout variant="info" title="Coming next">
          The next three lessons zoom into supervised, unsupervised, and reinforcement learning with
          clearer examples and diagrams.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Supervised learning uses labeled examples to predict categories or numbers.',
          'Unsupervised learning finds structure without labels — clusters, anomalies, compression.',
          'Semi-supervised mixes a little labeled data with lots of unlabeled data.',
          'Reinforcement learning learns from rewards for actions in an environment.',
        ]}
      />
    </LessonArticle>
  )
}
