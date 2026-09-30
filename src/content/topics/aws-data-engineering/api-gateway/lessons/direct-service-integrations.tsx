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

export function DirectServiceIntegrations() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="A Lambda that only forwards to SQS is a Lambda you do not need">
        Many ingestion APIs run a function whose entire job is{' '}
        <code className="text-core-400">sqs.send_message(body=event[&apos;body&apos;])</code>. That adds cold
        starts, concurrency limits, and a per-invocation bill. API Gateway can call SQS, Kinesis, Firehose, S3,
        DynamoDB, and Step Functions directly — the gateway signs the AWS API call itself with an IAM role you
        give it.
      </Callout>

      <Definition term="AWS service integration">
        <p>
          An integration type where API Gateway invokes an AWS service API action instead of a Lambda function
          or HTTP backend. On REST APIs this is the <code className="text-core-400">AWS</code> integration type
          with a VTL mapping template building the service request. On HTTP APIs it is a{' '}
          <strong className="text-white">first-class integration</strong>: pick a subtype like{' '}
          <code className="text-core-400">SQS-SendMessage</code> and map parameters — no VTL. Either way, an{' '}
          <strong className="text-white">execution role</strong> trusted by{' '}
          <code className="text-core-400">apigateway.amazonaws.com</code> grants the service permissions.
        </p>
      </Definition>

      <LessonSection title="REST API integrations for DE targets">
        <ContentStep number={1} title="SQS SendMessage — buffer webhooks">
          <p className="text-slate-300">
            The workhorse pattern. Integration URI points at the queue path, the request is form-encoded, and the
            mapping template sets <code className="text-core-400">Action=SendMessage</code> and{' '}
            <code className="text-core-400">MessageBody</code> from the request body. Consumers drain{' '}
            <code className="text-core-400">de-webhooks-queue-prod</code> at their own pace.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Kinesis Data Streams and Firehose PutRecord">
          <p className="text-slate-300">
            For ordered or high-volume streams, call Kinesis <code className="text-core-400">PutRecord</code> with a
            partition key such as the partner id. For direct-to-lake delivery, call Firehose{' '}
            <code className="text-core-400">PutRecord</code> — Firehose buffers, compresses, and writes to the
            bronze prefix with no consumer code at all. Both need the body base64-encoded in the template.
          </p>
        </ContentStep>
        <ContentStep number={3} title="S3, DynamoDB, Step Functions">
          <p className="text-slate-300">
            <code className="text-core-400">PutObject</code> to S3 works for small objects within the 10 MB payload
            limit — larger files use presigned URLs. DynamoDB <code className="text-core-400">PutItem</code> records
            a job request or dedupe key. Step Functions <code className="text-core-400">StartExecution</code> kicks
            off a backfill workflow and returns the execution ARN immediately.
          </p>
        </ContentStep>
        <Example title="REST API → SQS mapping template" caption="Content-Type application/x-www-form-urlencoded set on the integration request">
{`Action=SendMessage&MessageBody=$util.urlEncode($input.body)&MessageAttribute.1.Name=partner_id&MessageAttribute.1.Value.StringValue=$util.urlEncode($context.authorizer.partnerId)&MessageAttribute.1.Value.DataType=String

# Integration URI:
# arn:aws:apigateway:us-east-1:sqs:path/111122223333/de-webhooks-queue-prod`}
        </Example>
        <Example title="REST API → Firehose PutRecord template" caption="application/json template; Firehose expects base64 data">
{`{
  "DeliveryStreamName": "de-partner-events-to-bronze-prod",
  "Record": {
    "Data": "$util.base64Encode($input.json('$'))"
  }
}`}
        </Example>
      </LessonSection>

      <LessonSection title="HTTP API first-class integrations">
        <ContentStep number={1} title="Supported subtypes">
          <p className="text-slate-300">
            At time of writing, HTTP APIs support EventBridge <code className="text-core-400">PutEvents</code>, SQS
            send, receive, delete, and purge, AppConfig <code className="text-core-400">GetConfiguration</code>,
            Kinesis <code className="text-core-400">PutRecord</code>, and Step Functions start, start sync, and stop
            execution. Firehose, S3, and DynamoDB are not on the list — use a REST API or Lambda for those. Check the
            integration subtype reference for additions.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Parameter mapping instead of VTL">
          <p className="text-slate-300">
            Map <code className="text-core-400">QueueUrl</code> to a static value and{' '}
            <code className="text-core-400">MessageBody</code> to <code className="text-core-400">$request.body</code>.
            Simpler and cheaper than REST, but you lose request validation and complex transforms.
          </p>
        </ContentStep>
        <Example title="HTTP API SQS first-class integration" caption="CloudFormation snippet">
{`IngestIntegration:
  Type: AWS::ApiGatewayV2::Integration
  Properties:
    ApiId: !Ref IngestHttpApi
    IntegrationType: AWS_PROXY
    IntegrationSubtype: SQS-SendMessage
    PayloadFormatVersion: "1.0"
    CredentialsArn: !GetAtt ApiGatewaySqsRole.Arn
    RequestParameters:
      QueueUrl: https://sqs.us-east-1.amazonaws.com/111122223333/de-webhooks-queue-prod
      MessageBody: $request.body`}
        </Example>
      </LessonSection>

      <LessonSection title="Execution role and trade-offs">
        <ContentStep number={1} title="Least-privilege integration role">
          <p className="text-slate-300">
            One role per API, trusted by API Gateway, allowed exactly{' '}
            <code className="text-core-400">sqs:SendMessage</code> on one queue ARN — plus{' '}
            <code className="text-core-400">kms:GenerateDataKey</code> if the queue uses a customer managed key.
            Never reuse a broad pipeline role here.
          </p>
        </ContentStep>
        <Flowchart
          title="Lambda-free ingestion path"
          chart={`flowchart LR
  P[Partner POST]
  GW[API Gateway]
  ROLE[Execution role]
  Q[SQS de-webhooks-queue-prod]
  FH[Firehose stream]
  S3[S3 bronze prefix]
  WORK[Consumer Lambda or Glue]
  P --> GW
  GW -.assumes.-> ROLE
  GW -->|SendMessage| Q
  GW -->|PutRecord| FH
  FH --> S3
  Q --> WORK
  WORK --> S3`}
        />
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Aspect</th>
                <th className="px-4 py-3">Direct integration</th>
                <th className="px-4 py-3">Lambda in the middle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Cost', 'No Lambda invocation charge', 'Pay per invocation and duration'],
                ['Latency', 'No cold start, one hop', 'Cold starts and extra hop'],
                ['Scaling', 'Limited by gateway and target quotas', 'Also limited by Lambda concurrency'],
                ['Logic', 'VTL only — hard to test and debug', 'Full language, libraries, unit tests'],
                ['Validation', 'JSON Schema models on REST', 'Any rule you can code'],
              ].map(([aspect, direct, lambda]) => (
                <tr key={aspect} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{aspect}</td>
                  <td className="px-4 py-3">{direct}</td>
                  <td className="px-4 py-3">{lambda}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="insight">
          Rule of thumb: if the Lambda would only forward, go direct and push logic to the consumer side of the
          queue. If you need signature checks, enrichment lookups, or branching, keep the Lambda.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'API Gateway can call AWS service APIs directly — SQS, Kinesis, Firehose, S3, DynamoDB, Step Functions on REST.',
          'REST uses AWS integrations with VTL templates; HTTP APIs use first-class subtypes with parameter mapping.',
          'HTTP API subtypes cover EventBridge, SQS, AppConfig, Kinesis, and Step Functions — not Firehose, S3, or DynamoDB.',
          'An execution role trusted by apigateway.amazonaws.com grants only the single action on the single target.',
          'Direct integrations cut cost and cold starts; Lambda wins when you need real logic or testable code.',
        ]}
      />
    </LessonArticle>
  )
}
