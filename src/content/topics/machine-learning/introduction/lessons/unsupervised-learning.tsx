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

export function UnsupervisedLearning() {
  return (
    <LessonArticle>
      <Definition term="Unsupervised Learning">
        <p>
          In <strong className="text-white">unsupervised learning</strong>, the data has{' '}
          <strong className="text-white">no labels</strong>. The algorithm explores the data to find
          structure: natural groups, rare outliers, or a simpler way to represent the same information.
        </p>
      </Definition>

      <LessonSection title="Why unsupervised matters">
        <p className="text-slate-300">
          Most real-world data is unlabeled. Tagging millions of images or documents is expensive.
          Unsupervised methods still extract value — for exploration, compression, and anomaly alerts.
        </p>
        <Flowchart
          title="Labeled vs unlabeled paths"
          chart={`flowchart TB
  A[Raw data] --> B{Labels?}
  B -- Yes --> C[Supervised path]
  B -- No --> D[Unsupervised path]
  D --> E[Clusters]
  D --> F[Lower dimensions]
  D --> G[Anomalies]`}
        />
      </LessonSection>

      <LessonSection title="Clustering — discover groups">
        <p className="text-slate-300">
          <strong className="text-white">Clustering</strong> puts similar examples together and
          dissimilar ones apart — without being told the group names in advance.
        </p>
        <Example title="Customer segments">
{`You have purchase histories for 100,000 shoppers.
No "segment" label exists yet.

Clustering might reveal:
  Group A — frequent small orders
  Group B — rare big-ticket buyers
  Group C — seasonal shoppers

Marketing can then name and treat each group differently.`}
        </Example>
        <ContentStep number={1} title="How “similar” is defined">
          <p className="text-slate-300">
            Algorithms need a notion of distance or similarity in feature space. Nearby points (in
            that space) tend to join the same cluster.
          </p>
        </ContentStep>
        <ContentStep number={2} title="You choose k — sometimes">
          <p className="text-slate-300">
            Methods like k-means ask for the number of clusters. Others try to discover a hierarchy
            of groups. Choosing k is part art, part metric (elbow plots, domain knowledge).
          </p>
        </ContentStep>
        <Callout variant="beginner">
          Clustering does not invent true labels magically — it proposes groupings. Humans still
          interpret whether a cluster is meaningful.
        </Callout>
      </LessonSection>

      <LessonSection title="Dimensionality reduction — compress features">
        <p className="text-slate-300">
          High-dimensional data (thousands of pixels or genes) is hard to visualize and sometimes
          noisy. <strong className="text-white">Dimensionality reduction</strong> projects data into
          fewer dimensions while keeping as much useful structure as possible.
        </p>
        <Flowchart
          title="From many features to a few"
          chart={`flowchart TB
  A[1000 features] --> B[Reduction e.g. PCA]
  B --> C[2–50 informative axes]
  C --> D[Plot / speed up / denoise]
  C --> E[Optional: feed into another model]`}
        />
        <Callout variant="tip" title="Visualization bonus">
          Reducing to 2D or 3D lets you scatter-plot the data and literally see clusters or outliers.
        </Callout>
      </LessonSection>

      <LessonSection title="Anomaly detection — find the weird ones">
        <p className="text-slate-300">
          <strong className="text-white">Anomaly (outlier) detection</strong> flags examples that do
          not look like the rest — fraud, defective sensors, network intrusions.
        </p>
        <Example title="Credit card fraud intuition">
{`Normal:  groceries nearby, small amounts, usual hours
Anomaly:  sudden luxury purchase in another country

The model learns "normal" patterns from mostly clean data,
then scores how strange a new transaction looks.`}
        </Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Unsupervised learning works without labels to find structure in data.',
          'Clustering groups similar examples; humans interpret the groups.',
          'Dimensionality reduction compresses features for speed, noise reduction, or plots.',
          'Anomaly detection highlights rare or unusual points compared to the norm.',
        ]}
      />
    </LessonArticle>
  )
}
