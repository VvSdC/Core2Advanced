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

export function ApiGatewayForDataEngineering() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Where APIs show up in a data platform">
        Web developers use API Gateway to build app backends. Data engineers use it differently: as the{' '}
        <strong className="text-white">intake valve</strong> for push-based sources, the{' '}
        <strong className="text-white">serving window</strong> for small curated answers, and the{' '}
        <strong className="text-white">control panel</strong> that lets other teams trigger pipelines
        safely. This lesson walks through the patterns you will actually build — and the ones to avoid.
      </Callout>

      <Definition term="API Gateway in data engineering">
        <p>
          In a DE platform, API Gateway is the <strong className="text-white">HTTPS boundary</strong> between
          external callers and the lake. It authenticates and throttles requests, then hands them to a
          short-lived integration — Lambda, SQS, Kinesis, or Step Functions — that either buffers the data
          on its way to S3 or reads a precomputed answer. The golden rule:{' '}
          <span className="text-core-400">accept fast, buffer, and process asynchronously</span>.
        </p>
      </Definition>

      <LessonSection title="Five patterns data engineers build">
        <ContentStep number={1} title="Ingestion webhooks">
          <p className="text-slate-300">
            Stripe payments, Shopify orders, GitHub events, or IoT readings arrive as{' '}
            <code className="text-core-400">POST</code> requests. API Gateway forwards to a Lambda that
            verifies the signature, or straight to SQS or Kinesis as a buffer; records land in{' '}
            <code className="text-core-400">s3://acme-lake-prod/bronze/</code> for Glue.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Partner push APIs with API keys">
          <p className="text-slate-300">
            Each partner gets an API key tied to a REST API usage plan with daily quotas, so one noisy
            partner cannot starve the rest. Combine keys with IAM or a Lambda authorizer for real
            authentication — API keys alone only identify the caller.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Data serving APIs">
          <p className="text-slate-300">
            A <code className="text-core-400">GET</code> route returns a customer&apos;s latest metrics from
            DynamoDB, or a small result that a scheduled Athena query already wrote to S3. Precompute the
            answer; do not run the query while the caller waits.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Pipeline control endpoints">
          <p className="text-slate-300">
            An internal <code className="text-core-400">POST /backfill</code> starts a Step Functions
            execution with the dataset and date range, and returns the execution ARN immediately. Callers
            poll a <code className="text-core-400">GET</code> status route — audited in CloudTrail, no
            console access needed.
          </p>
        </ContentStep>
        <ContentStep number={5} title="Presigned URLs for large uploads">
          <p className="text-slate-300">
            The API does not carry the file. It returns a short-lived S3 presigned URL, and the client
            uploads directly to S3 — gigabytes are fine, and S3 events kick off the pipeline.
          </p>
        </ContentStep>
        <Flowchart
          title="API Gateway patterns around the lake"
          chart={`flowchart LR
  WH[Webhook sources] --> GW[API Gateway]
  PT[Partners with API keys] --> GW
  GW --> Q[SQS or Kinesis buffer]
  Q --> B[S3 bronze]
  GW --> URL[Lambda issues presigned URL]
  URL -.-> CL[Client uploads direct to S3]
  CL --> B
  B --> G[Glue ETL]
  G --> DDB[DynamoDB serving table]
  GW --> RD[Lambda reader]
  RD --> DDB
  GW --> SF[Step Functions backfill]`}
        />
      </LessonSection>

      <LessonSection title="Presigned upload URL in practice">
        <p className="text-slate-300">
          The Lambda behind <code className="text-core-400">POST /uploads</code> needs{' '}
          <code className="text-core-400">s3:PutObject</code> on the landing prefix. The URL inherits that
          permission for a few minutes and then expires.
        </p>
        <Example title="Lambda that issues a presigned PUT URL" caption="The file never passes through API Gateway">
{`import json, uuid
import boto3

s3 = boto3.client("s3")

def handler(event, context):
    partner = event["pathParameters"]["partner"]
    key = f"landing/{partner}/{uuid.uuid4()}.csv"
    url = s3.generate_presigned_url(
        "put_object",
        Params={"Bucket": "acme-lake-prod", "Key": key, "ContentType": "text/csv"},
        ExpiresIn=900,                      # 15 minutes
    )
    return {"statusCode": 200,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({"upload_url": url, "s3_key": key})}`}
        </Example>
        <Example title="Client side — two calls" caption="Small JSON call to the API, then a large direct upload to S3">
{`# 1. Ask the API for an upload URL
curl -X POST https://abc123.execute-api.us-east-1.amazonaws.com/prod/uploads/partner-a

# 2. Upload the 2 GB file straight to S3 using the returned URL
curl -X PUT -H "Content-Type: text/csv" \\
  --upload-file orders_2026-09-30.csv "<upload_url from step 1>"`}
        </Example>
      </LessonSection>

      <LessonSection title="Anti-patterns to avoid">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Anti-pattern</th>
                <th className="px-4 py-3">Why it hurts</th>
                <th className="px-4 py-3">Do this instead</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Uploading large files through the API', 'API Gateway payloads are capped at 10 MB, and Lambda sync payloads are smaller still', 'Issue presigned S3 URLs and let clients upload directly'],
                ['Running long queries inside the request', 'The integration timeout is about 29 seconds; Athena or Redshift queries often run longer', 'Precompute results, or return a query ID and let the caller poll'],
                ['Calling Glue directly for every webhook', 'No buffering — bursts hit Glue concurrency limits and failed requests are lost', 'Buffer in SQS or Kinesis, land in S3, run Glue in batches'],
                ['API keys as the only security', 'Keys are sent in headers and easily leaked; they identify, not authenticate', 'Add IAM, JWT, or Lambda authorizers plus webhook HMAC signature checks'],
              ].map(([bad, why, fix]) => (
                <tr key={bad} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{bad}</td>
                  <td className="px-4 py-3">{why}</td>
                  <td className="px-4 py-3">{fix}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="insight">
          Interview framing: &quot;The API acknowledges in milliseconds, a queue absorbs bursts, and batch
          jobs do the heavy work.&quot; Decoupling the HTTP request from processing is what makes ingestion
          APIs survive a flash sale or a partner replaying a week of events.
        </Callout>
        <Callout variant="tip">
          Return <code className="text-core-400">202 Accepted</code> for ingestion — it tells the sender
          &quot;received and queued&quot; rather than &quot;fully processed,&quot; which is the honest
          contract for an asynchronous pipeline.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'DE uses API Gateway as intake (webhooks, partner pushes), serving window (small curated answers), and control panel (backfill triggers).',
          'Buffer between the API and heavy processing: API Gateway → Lambda or SQS or Kinesis → S3 bronze → Glue.',
          'Serve precomputed answers from DynamoDB or S3 — never run long Athena or Redshift queries inside the request.',
          'Large files go through S3 presigned URLs; API Gateway payloads are capped at 10 MB.',
          'API keys identify partners for usage plans; pair them with real authorization and signature checks.',
        ]}
      />
    </LessonArticle>
  )
}
