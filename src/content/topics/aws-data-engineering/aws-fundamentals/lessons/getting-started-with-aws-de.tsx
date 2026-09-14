import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function GettingStartedWithAwsDe() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Welcome to AWS Data Engineering">
        This track assumes you are curious about data and comfortable with basic computer ideas — files,
        folders, maybe a little Python or SQL. You do <strong className="text-white">not</strong> need
        prior cloud experience. We start with plain English, then introduce AWS terms one at a time.
      </Callout>

      <Definition term="What is AWS Data Engineering?">
        <p>
          <strong className="text-white">AWS Data Engineering</strong> is the practice of moving,
          storing, transforming, and serving data using Amazon Web Services — S3 lakes, Glue ETL,
          Athena queries, Redshift warehouses, Lambda triggers, and the security and networking that
          hold it all together.
        </p>
        <p className="mt-2 text-slate-300">
          Think of it as building <span className="text-core-400">reliable data highways</span> in the
          cloud: sources in, clean tables out, with monitoring and guardrails along the way.
        </p>
      </Definition>

      <LessonSection title="How to study this track">
        <ContentStep number={1} title="Follow the catalog order">
          <p className="text-slate-300">
            Sub-topics are arranged from fundamentals → identity (IAM) → storage and compute → ETL and
            query services → orchestration → a capstone end-to-end project. Skipping ahead is fine only
            after IAM and S3 feel familiar — almost everything touches those two.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Read the English before the console">
          <p className="text-slate-300">
            Every lesson starts with a concept in words. Understand the goal, then try the AWS Console,
            CLI, or a small script. Clicking without context leads to expensive confusion.
          </p>
        </ContentStep>
        <ContentStep number={3} title="One service per sitting">
          <p className="text-slate-300">
            AWS has hundreds of services. Focus on one lesson at a time. If S3 lifecycle rules feel heavy,
            stop and come back tomorrow. Data engineering is built by repetition, not cramming.
          </p>
        </ContentStep>
        <Flowchart
          title="Full course path"
          chart={`flowchart TB
  A[AWS Fundamentals] --> B[IAM]
  B --> C[EC2]
  C --> D[S3]
  D --> E[Lambda]
  E --> F[CloudWatch & SNS]
  F --> G[Athena & Redshift]
  G --> H[RDS & Glue]
  H --> I[VPC & EventBridge]
  I --> J[CloudFormation]
  J --> K[DynamoDB & SQS]
  K --> L[Step Functions]
  L --> M[Secrets & KMS]
  M --> N[CloudTrail & Systems Manager]
  N --> O[End-to-End Project]`}
        />
      </LessonSection>

      <LessonSection title="Words you will hear (no stress)">
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
                ['Region', 'A geographic area where AWS runs data centers — e.g. us-east-1'],
                ['Availability Zone (AZ)', 'An isolated data center within a Region — use multiple for resilience'],
                ['Bucket', 'An S3 container for objects (files) — like a top-level folder in the cloud'],
                ['ETL', 'Extract, Transform, Load — pull data in, clean it, store it where analysts need it'],
                ['Data lake', 'Cheap storage (often S3) holding raw and processed data in many formats'],
                ['Data warehouse', 'Structured store optimized for SQL analytics — e.g. Redshift'],
              ].map(([word, meaning]) => (
                <tr key={word} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{word}</td>
                  <td className="px-4 py-3">{meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip" title="Free Tier caution">
          AWS offers free usage for many services, but limits and time windows vary. Always set a billing
          alert before experimenting. We cover account setup and budgets in a later lesson in this
          sub-topic.
        </Callout>
      </LessonSection>

      <LessonSection title="What you will be able to do after AWS Fundamentals">
        <ContentStep number={1} title="Speak cloud confidently">
          <p className="text-slate-300">
            Explain cloud computing, IaaS/PaaS/SaaS, deployment models, and AWS global infrastructure
            without memorizing every acronym.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Navigate AWS safely">
          <p className="text-slate-300">
            Understand accounts, the Console, Free Tier categories, CLI/SDK basics, and the shared
            responsibility model — the safety rails before you touch production data.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Ready for IAM and pipelines">
          <p className="text-slate-300">
            Move into IAM knowing why roles beat root users, and into S3/Glue knowing why Regions and
            encryption choices matter for a data lake.
          </p>
        </ContentStep>
        <Callout variant="insight">
          You are not behind if AWS feels overwhelming on day one. Every later lesson reuses the same
          few ideas: Region, identity, storage, compute, and who is responsible for security.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'This track moves from AWS fundamentals through IAM, storage, compute, ETL, orchestration, and an end-to-end project.',
          'Study in catalog order; read concepts before clicking in the Console; practice one service at a time.',
          'Core starter vocabulary: Region, AZ, bucket, ETL, data lake, data warehouse.',
          'After this sub-topic you will understand cloud basics, AWS infrastructure, and safe account habits.',
        ]}
      />
    </LessonArticle>
  )
}
