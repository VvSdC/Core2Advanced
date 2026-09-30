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

export function KmsForDataEngineering() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Every box on your architecture diagram has a key">
        Look back at the pipelines you built across this track: S3 landing zones, Glue jobs and crawlers,
        Athena workgroups, Redshift, SQS queues, Secrets Manager, CloudWatch Logs. Each one stores data at
        rest, and each one lets you choose which KMS key protects it. This lesson maps{' '}
        <strong className="text-white">which DE resource gets which key</strong> and how to design a key
        strategy that is neither one giant key nor hundreds of tiny ones.
      </Callout>

      <Definition term="Key strategy">
        <p>
          A <strong className="text-white">key strategy</strong> is the documented plan for how many customer
          managed keys a platform has, what each one protects, and which roles may use it. A good DE strategy
          splits keys by <span className="text-core-400">environment</span> and by{' '}
          <span className="text-core-400">data domain or sensitivity</span> — so revoking access to PII does
          not break the orders pipeline, and a dev role can never decrypt prod.
        </p>
      </Definition>

      <LessonSection title="Map of DE resources to encryption">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Resource</th>
                <th className="px-4 py-3">What gets encrypted</th>
                <th className="px-4 py-3">Typical prod key</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['S3 lake buckets', 'Bronze, silver, and gold objects via bucket default SSE-KMS', 'alias/de-lake-prod or alias/de-lake-pii-prod'],
                ['Glue Data Catalog', 'Table and database metadata, plus connection passwords (separate setting)', 'alias/de-catalog-prod'],
                ['Glue security configuration', 'Job output to S3, CloudWatch Logs from the job, job bookmarks', 'alias/de-lake-prod for S3; platform key for logs'],
                ['Athena workgroup', 'Query result files in the results bucket', 'alias/de-lake-prod — results can contain the same PII'],
                ['Redshift', 'Provisioned cluster or Serverless namespace storage, snapshots', 'alias/de-redshift-prod'],
                ['SQS and SNS', 'Messages at rest with SSE', 'alias/de-platform-prod or SSE-SQS for low-risk queues'],
                ['DynamoDB', 'Pipeline state and idempotency tables', 'AWS owned default, or platform key if audited'],
                ['Secrets Manager', 'Database credentials and API tokens', 'alias/de-secrets-prod for cross-account secrets'],
                ['CloudWatch Logs', 'Log groups for Lambda, Glue, Step Functions', 'alias/de-platform-prod'],
                ['EBS for EMR and EC2', 'Local disks and shuffle spill', 'EMR security configuration or EBS default encryption key'],
              ].map(([resource, what, key]) => (
                <tr key={resource} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{resource}</td>
                  <td className="px-4 py-3">{what}</td>
                  <td className="px-4 py-3">{key}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="insight">
          The most common gap in lake audits is the Athena results bucket: the source tables are encrypted with
          a tightly controlled key, but query results — often full copies of PII columns — sit in a bucket with
          default encryption and broad read access.
        </Callout>
      </LessonSection>

      <LessonSection title="Designing the key strategy">
        <ContentStep number={1} title="Not one key for everything">
          <p className="text-slate-300">
            A single <code className="text-core-400">alias/acme-key</code> means every role that needs any
            data can decrypt all data. Revoking one team breaks everyone, and CloudTrail cannot tell you which
            dataset a Decrypt was for.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Not one key per bucket or table">
          <p className="text-slate-300">
            Hundreds of keys means hundreds of key policies to review, hundreds of dollars a month, and Glue
            roles with giant lists of key ARNs. Nobody can explain the design in a security review.
          </p>
        </ContentStep>
        <ContentStep number={3} title="One key per environment and domain or sensitivity">
          <p className="text-slate-300">
            Separate dev, staging, and prod keys — always. Within prod, split by domain or sensitivity:{' '}
            <code className="text-core-400">alias/de-lake-prod</code> for general lake data,{' '}
            <code className="text-core-400">alias/de-lake-pii-prod</code> for customer PII,{' '}
            <code className="text-core-400">alias/de-redshift-prod</code> for the warehouse, and a platform key
            for queues and logs. A handful of keys, each with a clear owner.
          </p>
        </ContentStep>
        <Flowchart
          title="Acme prod key layout"
          chart={`flowchart LR
  subgraph PROD[Prod account keys]
    LAKE[de-lake-prod]
    PII[de-lake-pii-prod]
    WH[de-redshift-prod]
    PLAT[de-platform-prod]
  end
  B[S3 bronze silver gold] --> LAKE
  ATH[Athena results] --> LAKE
  CUST[S3 acme-lake-pii-prod] --> PII
  RS[Redshift Serverless] --> WH
  Q[SQS SNS CloudWatch Logs] --> PLAT
  GLUE[Glue role orders-silver-etl] -. uses .-> LAKE
  ANALYST[Analyst role] -. uses .-> LAKE`}
        />
      </LessonSection>

      <LessonSection title="Writing the plan down">
        <p className="text-slate-300">
          Keep a small key inventory in the platform repo next to your CloudFormation templates. It becomes the
          first page on-call opens when a job fails with a KMS error.
        </p>
        <Example title="Key inventory for the Acme data platform" caption="One row per key — owner, scope, allowed roles">
{`alias/de-lake-prod        owner: data-platform   env: prod
  protects: acme-lake-prod (bronze, silver, gold), Athena results bucket
  encrypt:  glue-orders-silver-etl-role, glue-ingest-role
  decrypt:  glue roles above, athena-analyst-role

alias/de-lake-pii-prod    owner: data-platform   env: prod
  protects: acme-lake-pii-prod (customers, payments)
  decrypt:  glue-pii-etl-role, pii-analyst-role only

alias/de-redshift-prod    owner: warehouse-team  env: prod
  protects: Redshift Serverless namespace acme-dw, snapshots

alias/de-platform-prod    owner: data-platform   env: prod
  protects: SQS de-file-events-prod, SNS alerts, CloudWatch log groups`}
        </Example>
        <Callout variant="tip" title="Services need key policy entries too">
          Some services act as themselves, not as your role — CloudWatch Logs, for example, needs the key policy
          to allow its service principal before a log group can use the key. When a resource refuses to attach a
          key, check the key policy first — key policies open the intermediate section.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Every DE resource that stores data — S3, Glue, Athena, Redshift, SQS, SNS, DynamoDB, Secrets Manager, logs, EBS — can use a KMS key.',
          'Glue needs a security configuration for S3 output, CloudWatch Logs, and bookmarks; the Data Catalog has its own encryption settings.',
          'Encrypt Athena query results with the same care as the source data — results often contain PII.',
          'Key strategy: separate keys per environment and per domain or sensitivity — not one key for all, not one per bucket.',
          'Keep a key inventory with owner, scope, and allowed roles so KMS AccessDenied errors are quick to diagnose.',
        ]}
      />
    </LessonArticle>
  )
}
