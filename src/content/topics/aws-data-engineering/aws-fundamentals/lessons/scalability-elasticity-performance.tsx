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

export function ScalabilityElasticityPerformance() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Everyday idea">
        A coffee shop that can add more baristas on a busy morning is <strong className="text-white">elastic</strong>.
        A shop that built a bigger building so it can serve more customers every day, year after year, is{' '}
        <strong className="text-white">scalable</strong>. Data pipelines need both ideas — handle spikes
        without breaking, and grow steadily as data volume increases.
      </Callout>

      <Definition term="Scalability">
        <p>
          <strong className="text-white">Scalability</strong> is the ability of a system to handle
          increasing workload by adding resources — more CPU, memory, storage, or parallel workers —
          without redesigning the entire architecture.
        </p>
        <p className="mt-2 text-slate-300">
          For data engineering, scalability means your nightly 500 GB batch job still finishes on time when
          it grows to 5 TB next year, because you can add Glue workers, bigger Redshift nodes, or more
          partition parallelism.
        </p>
      </Definition>

      <Definition term="Elasticity">
        <p>
          <strong className="text-white">Elasticity</strong> is the ability to{' '}
          <em>automatically</em> scale resources up during demand spikes and scale down when demand drops —
          often within minutes.
        </p>
        <p className="mt-2 text-slate-300">
          Elasticity is scalability with a time dimension: you pay for peak capacity only while you need
          it. A Lambda function that runs 10,000 times during an upload burst, then goes quiet, is elastic.
        </p>
      </Definition>

      <LessonSection title="Scalability vs elasticity — side by side">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Concept</th>
                <th className="px-4 py-3">Focus</th>
                <th className="px-4 py-3">AWS example</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                [
                  'Scalability',
                  'Can the design grow with load over time?',
                  'Partitioning S3 prefixes so Athena scans stay fast at petabyte scale',
                ],
                [
                  'Elasticity',
                  'Can capacity shrink and expand automatically with short-term demand?',
                  'Auto Scaling Group adding EC2 instances during a batch window, removing them after',
                ],
              ].map(([concept, focus, example]) => (
                <tr key={concept} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{concept}</td>
                  <td className="px-4 py-3">{focus}</td>
                  <td className="px-4 py-3">{example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="insight">
          Scalability is a design property. Elasticity is an operational behavior. A well-designed data
          platform is scalable; Auto Scaling, serverless, and on-demand services make it elastic.
        </Callout>
      </LessonSection>

      <LessonSection title="Performance mindset for data engineers">
        <p className="text-slate-300">
          &quot;Performance&quot; in software often means page load time. In data engineering, think in
          two metrics that drive pipeline SLAs:
        </p>
        <ContentStep number={1} title="Throughput">
          <p className="text-slate-300">
            How much data moves through the system per unit of time — rows per second, gigabytes per hour,
            files processed per minute. A Glue job that ingests 2 TB/hour has higher throughput than one
            at 200 GB/hour.
          </p>
          <Example title="Throughput in plain numbers" caption="Batch window math">
{`Pipeline must load 6 TB before 6 a.m.
Current throughput: 1 TB/hour → finishes in 6 hours ✓
Data doubles next quarter → need 2 TB/hour or a longer window`}
          </Example>
        </ContentStep>
        <ContentStep number={2} title="Latency">
          <p className="text-slate-300">
            How long one unit of work takes end to end — time from file landing in S3 to row appearing in
            the warehouse, or from event to dashboard refresh. Streaming pipelines optimize latency;
            batch pipelines often optimize throughput and cost instead.
          </p>
        </ContentStep>
        <ContentStep number={3} title="The tradeoff triangle">
          <p className="text-slate-300">
            Faster pipelines (low latency, high throughput) usually cost more — bigger clusters, more
            concurrent workers, premium storage. Slower, cheaper pipelines may miss tight SLAs. Your job
            is to pick the right point for each workload: raw ingestion can be lazy; fraud detection
            cannot.
          </p>
        </ContentStep>
        <Flowchart
          title="Pipeline performance levers"
          chart={`flowchart TB
  A[Incoming data volume] --> B{Goal?}
  B -->|Finish batch on time| C[Increase throughput]
  B -->|Fresh data quickly| D[Reduce latency]
  C --> E[More workers / partitions / bigger nodes]
  D --> F[Streaming / smaller batches / closer storage]
  E --> G[Watch cost]
  F --> G`}
        />
      </LessonSection>

      <LessonSection title="Everyday analogies and AWS examples">
        <ContentStep number={1} title="Highway lanes (horizontal scale)">
          <p className="text-slate-300">
            Adding lanes to a highway handles more cars without making each car faster — that is
            horizontal scaling. Running 20 Glue workers in parallel instead of 2 is the same idea: more
            parallel lanes for your data.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Auto Scaling Groups (elastic EC2)">
          <p className="text-slate-300">
            An <strong className="text-white">Auto Scaling Group (ASG)</strong> watches CPU or queue depth
            and launches or terminates EC2 instances automatically. A Spark cluster on EC2 can grow for
            the 2-hour ETL window and shrink overnight — elastic compute for custom jobs.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Serverless scale (Lambda, Glue, Athena)">
          <p className="text-slate-300">
            <strong className="text-white">Lambda</strong> scales concurrent executions without you
            provisioning servers. <strong className="text-white">AWS Glue</strong> adds DPU capacity per
            job run. <strong className="text-white">Athena</strong> scales query engines behind the scenes.
            You get elasticity by default — but you still must design for limits (Lambda timeout, Glue
            worker caps, Athena scan size).
          </p>
        </ContentStep>
        <Callout variant="tip" title="Design for scale early">
          Partition S3 by date, use columnar formats (Parquet), and avoid single hot keys in DynamoDB or
          Kinesis. These choices cost little upfront and prevent painful rewrites when data grows 100×.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Scalability = handling growth over time; elasticity = automatic up/down scaling for short-term demand.',
          'Data engineers care about throughput (volume per time) and latency (end-to-end delay) — often trading one against cost.',
          'AWS examples: ASG for elastic EC2 fleets; Lambda, Glue, and Athena for serverless scale without managing servers.',
          'Good pipeline design (partitioning, parallel workers, right-sized batches) matters as much as turning up instance size.',
        ]}
      />
    </LessonArticle>
  )
}
