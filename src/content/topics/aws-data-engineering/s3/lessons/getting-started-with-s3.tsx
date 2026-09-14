import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function GettingStartedWithS3() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Why S3 is the heart of AWS data engineering">
        You now know who is allowed to touch AWS (IAM) and where custom code can run (EC2). The next
        question every data pipeline raises is: <strong className="text-white">where does the data
        live?</strong> Amazon S3 (Simple Storage Service) is the default answer. Raw CSV dumps, Parquet
        partitions, Iceberg tables, Athena query results, Glue catalog backups, and Redshift UNLOAD output
        all land in S3. It is the storage layer beneath almost every lake and warehouse pattern on AWS.
      </Callout>

      <Definition term="What is S3?">
        <p>
          <strong className="text-white">S3</strong> is AWS&apos;s object storage service. You create{' '}
          <strong className="text-white">buckets</strong> (containers) and upload{' '}
          <strong className="text-white">objects</strong> (files) identified by unique{' '}
          <strong className="text-white">keys</strong> (paths like{' '}
          <code className="text-core-400">raw/orders/2024/01/part-000.parquet</code>). There is no
          traditional filesystem on a single disk — S3 scales to exabytes and serves millions of requests
          per second when designed well.
        </p>
        <p className="mt-2 text-slate-300">
          Think of S3 as <span className="text-core-400">the durable filing cabinet for your entire data
          platform</span> — producers write in, consumers read out, and IAM decides who may open each
          drawer.
        </p>
      </Definition>

      <LessonSection title="Roadmap for this sub-topic">
        <p className="text-slate-300">
          We build S3 in layers so bucket policies and lifecycle rules do not hit you on day one. Follow
          this order:
        </p>
        <ContentStep number={1} title="Objects — buckets, keys, and prefixes">
          <p className="text-slate-300">
            Understand the object model, naming rules, s3:// URLs, and why &quot;folders&quot; in the
            Console are really key prefixes — the foundation for lake layout.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Getting data in and out">
          <p className="text-slate-300">
            Upload and download via the Console, then the same operations with the AWS CLI and Boto3 —
            the tools your pipelines and EC2 sandbox will use daily.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Mental model for data lakes">
          <p className="text-slate-300">
            Why lakes live on S3, how raw/ processed/ curated prefixes organize a medallion-style layout,
            and how Glue, Athena, and Redshift attach to the same bucket.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Storage classes, security, and lifecycle (next module)">
          <p className="text-slate-300">
            After this beginner pass: Standard vs Intelligent-Tiering vs Glacier, encryption, bucket
            policies, versioning, and lifecycle rules that move cold data cheaper over time.
          </p>
        </ContentStep>
        <Flowchart
          title="S3 sub-topic path"
          chart={`flowchart LR
  A[Getting started] --> B[Buckets objects keys]
  B --> C[Console upload download]
  C --> D[CLI basics]
  D --> E[Boto3 basics]
  E --> F[Mental model for lakes]
  F --> G[Putting it together]
  G --> H[Storage classes and lifecycle — next]`}
        />
      </LessonSection>

      <LessonSection title="Vocabulary you will use every day">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Word</th>
                <th className="px-4 py-3">Friendly meaning</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Bucket', 'A globally unique container for objects — like a top-level project name (company-lake-dev)'],
                ['Object', 'One stored file plus metadata — a CSV row dump, a Parquet part file, a JSON event batch'],
                ['Key', 'The full path name of an object inside a bucket — raw/sales/2024-01-15/events.json'],
                ['Prefix', 'The leading part of a key used like a folder — raw/ or processed/orders/ — S3 has no real directories'],
                ['Region', 'The AWS Region where the bucket is created — objects stay there unless you replicate elsewhere'],
              ].map(([word, meaning]) => (
                <tr key={word} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{word}</td>
                  <td className="px-4 py-3">{meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip" title="Bucket vs key — quick check">
          <code className="text-core-400">s3://company-lake-dev/raw/orders/part-001.parquet</code> breaks
          down as: bucket <code className="text-core-400">company-lake-dev</code>, key{' '}
          <code className="text-core-400">raw/orders/part-001.parquet</code>, prefixes{' '}
          <code className="text-core-400">raw/</code> and <code className="text-core-400">raw/orders/</code>.
          You will type this pattern in IAM policies, Glue jobs, and Athena queries constantly.
        </Callout>
      </LessonSection>

      <LessonSection title="How data flows through S3 in a lake">
        <p className="text-slate-300">
          S3 sits in the middle of most AWS data architectures. Producers land files; analytics services
          read them without copying everything into a database first. IAM roles (from the IAM sub-topic)
          and EC2/Glue/Lambda (compute) connect to the same buckets your analysts query.
        </p>
        <Flowchart
          title="Producers → S3 → consumers"
          chart={`flowchart LR
  subgraph Producers["Producers"]
    P1[Apps and APIs]
    P2[DB exports]
    P3[Streaming firehose]
  end
  S3[(S3 bucket — raw processed curated)]
  subgraph Consumers["Consumers"]
    C1[Glue ETL and catalog]
    C2[Athena SQL]
    C3[Redshift Spectrum]
    C4[EC2 custom scripts]
  end
  P1 --> S3
  P2 --> S3
  P3 --> S3
  S3 --> C1
  S3 --> C2
  S3 --> C3
  S3 --> C4`}
        />
        <Callout variant="insight">
          A common beginner mistake: treat S3 like a local hard drive and store only one giant file per
          day. Data lakes work best with many smaller objects (Parquet parts, date partitions) so Glue
          and Athena can scan only what they need. We explore prefix design in the lake mental model
          lesson.
        </Callout>
      </LessonSection>

      <LessonSection title="Why data engineers care about S3">
        <ContentStep number={1} title="Durability and decoupling">
          <p className="text-slate-300">
            S3 is designed for 11 nines of durability. Compute (EC2, Glue, Lambda) can fail and restart;
            the data in S3 remains. That separation — storage vs compute — is the core of modern lake
            architecture.
          </p>
        </ContentStep>
        <ContentStep number={2} title="One copy, many engines">
          <p className="text-slate-300">
            The same Parquet files under <code className="text-core-400">processed/sales/</code> can feed
            Athena for ad hoc SQL, Redshift Spectrum for warehouse joins, and Spark on Glue for heavy
            transforms — without maintaining three separate copies.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Cost and lifecycle">
          <p className="text-slate-300">
            Pay for what you store and request. Later lessons cover storage classes and lifecycle policies
            that automatically tier old raw logs to cheaper storage — critical when ingestion volume
            grows faster than your budget.
          </p>
        </ContentStep>
      </LessonSection>

      <KeyTakeaways
        items={[
          'S3 follows EC2 in the track — identity and compute are settled; now you need durable storage for the lake.',
          'This sub-topic moves from objects → Console/CLI/Boto3 access → lake mental model → putting it together.',
          'Core vocabulary: bucket, object, key, prefix, Region.',
          'Lake flow: producers write objects → S3 holds them → Glue, Athena, Redshift, and EC2 read the same keys.',
        ]}
      />
    </LessonArticle>
  )
}
