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

export function ResourcesMethodsStages() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Reading an invoke URL like a map">
        A URL such as{' '}
        <code className="text-core-400">https://abc123.execute-api.us-east-1.amazonaws.com/prod/ingest/shopify</code>{' '}
        looks like noise at first. It is actually three ideas stacked together: the{' '}
        <strong className="text-white">API</strong> (<code className="text-core-400">abc123</code>), the{' '}
        <strong className="text-white">stage</strong> (<code className="text-core-400">prod</code>), and
        the <strong className="text-white">resource path</strong> (
        <code className="text-core-400">/ingest/shopify</code>). Add the HTTP method — say{' '}
        <code className="text-core-400">POST</code> — and you know exactly which integration runs.
      </Callout>

      <Definition term="Resources, methods, and stages">
        <p>
          A <strong className="text-white">resource</strong> is a path segment in the API&apos;s URL tree. A{' '}
          <strong className="text-white">method</strong> is an HTTP verb attached to a resource, and each
          method points at one integration. A <strong className="text-white">deployment</strong> is a
          snapshot of all resources and methods, and a <strong className="text-white">stage</strong> is a
          named, callable pointer to one deployment — such as <code className="text-core-400">dev</code> or{' '}
          <code className="text-core-400">prod</code>. HTTP APIs use the word{' '}
          <strong className="text-white">route</strong> for the method-plus-path pair, e.g.{' '}
          <code className="text-core-400">{'POST /ingest/{source}'}</code>.
        </p>
      </Definition>

      <LessonSection title="Resources and methods">
        <p className="text-slate-300">
          Resources form a tree under the root <code className="text-core-400">/</code>. A segment in
          braces is a <strong className="text-white">path parameter</strong> — a placeholder that captures
          whatever the caller sends in that position. With{' '}
          <code className="text-core-400">{'/ingest/{source}'}</code>, a call to{' '}
          <code className="text-core-400">/ingest/shopify</code> gives your backend{' '}
          <code className="text-core-400">source = shopify</code>.
        </p>
        <Example title="Resource tree for acme-ingest-api" caption="Each line is a resource; verbs are methods on it">
{`/
├── /ingest
│   └── /ingest/{source}          POST    → Lambda acme-ingest-handler
├── /datasets
│   └── /datasets/{name}          GET     → Lambda acme-dataset-reader
│       └── /datasets/{name}/runs GET     → Lambda acme-run-history
└── /backfill                     POST    → Step Functions StartExecution`}
        </Example>
        <ContentStep number={1} title="GET — read">
          <p className="text-slate-300">
            Fetch a dataset summary or run status. Should never change data, so it is safe to retry.
          </p>
        </ContentStep>
        <ContentStep number={2} title="POST — send new data">
          <p className="text-slate-300">
            The workhorse for ingestion: webhooks and partner pushes almost always arrive as{' '}
            <code className="text-core-400">POST</code> with a JSON body.
          </p>
        </ContentStep>
        <ContentStep number={3} title="PUT and DELETE — replace and remove">
          <p className="text-slate-300">
            Less common in DE APIs; used for managing config records such as a partner&apos;s allowed
            datasets. Design them to be idempotent — calling twice gives the same result.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="The REST API request flow">
        <p className="text-slate-300">
          In a REST API, each method has four configurable stages. With a Lambda proxy integration most of
          them pass straight through, but knowing the names helps you read the console and error logs.
        </p>
        <Flowchart
          title="Method request to method response"
          chart={`flowchart LR
  C[Client] --> MR[Method request]
  MR --> IR[Integration request]
  IR --> BE[Backend Lambda or AWS service]
  BE --> IRS[Integration response]
  IRS --> MRS[Method response]
  MRS --> C`}
        />
        <ContentStep number={1} title="Method request">
          <p className="text-slate-300">
            What the client must send: authorization, required headers or query strings, API key, and an
            optional JSON schema model for validation.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Integration request">
          <p className="text-slate-300">
            How API Gateway calls the backend: integration type (Lambda proxy, AWS service, HTTP, mock) and
            optional mapping templates that reshape the payload.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Integration response and method response">
          <p className="text-slate-300">
            How backend output becomes the HTTP reply: status code mapping, headers, and response models.
            HTTP APIs hide most of this — you configure a route and an integration and you are done.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Deployments and stages">
        <p className="text-slate-300">
          Editing a REST API in the console changes a draft. Nothing is live until you{' '}
          <strong className="text-white">deploy</strong> it to a stage — a classic beginner surprise is
          &quot;I fixed the method but the URL still returns the old behavior.&quot; HTTP APIs can use a{' '}
          <code className="text-core-400">$default</code> stage with automatic deployment, but many teams
          still deploy explicitly for prod.
        </p>
        <ContentStep number={1} title="Stages per environment">
          <p className="text-slate-300">
            A common pattern is one API per environment (<code className="text-core-400">acme-ingest-api-dev</code>,{' '}
            <code className="text-core-400">acme-ingest-api-prod</code>), each built by CloudFormation. Some
            teams instead use <code className="text-core-400">dev</code> and{' '}
            <code className="text-core-400">prod</code> stages on one API — simpler, but a shared blast radius.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Stage variables — a teaser">
          <p className="text-slate-300">
            REST stages can carry key-value <strong className="text-white">stage variables</strong>, e.g.{' '}
            <code className="text-core-400">lambdaAlias = live</code>, so the same deployment calls a
            different Lambda alias per stage. The advanced module covers them with canary deployments.
          </p>
        </ContentStep>
        <Callout variant="tip" title="Console walkthrough — first REST API">
          Create API → REST API → name <code className="text-core-400">acme-ingest-api-dev</code>, Regional →
          Create resource <code className="text-core-400">ingest</code> → Create child resource{' '}
          <code className="text-core-400">{'{source}'}</code> → Create method POST, integration Lambda, proxy
          on → Deploy API to new stage <code className="text-core-400">dev</code> → copy the invoke URL and
          test with curl.
        </Callout>
        <Example title="Same steps with the AWS CLI, then curl" caption="Placeholder IDs — abc123 is the API, r1 and r2 are resource IDs">
{`aws apigateway create-rest-api --name acme-ingest-api-dev \\
  --endpoint-configuration types=REGIONAL
aws apigateway get-resources --rest-api-id abc123          # find root id
aws apigateway create-resource --rest-api-id abc123 --parent-id root1 --path-part ingest
aws apigateway create-resource --rest-api-id abc123 --parent-id r1 --path-part '{source}'
aws apigateway put-method --rest-api-id abc123 --resource-id r2 \\
  --http-method POST --authorization-type AWS_IAM
aws apigateway put-integration --rest-api-id abc123 --resource-id r2 \\
  --http-method POST --type AWS_PROXY --integration-http-method POST \\
  --uri arn:aws:apigateway:us-east-1:lambda:path/2015-03-31/functions/arn:aws:lambda:us-east-1:111122223333:function:acme-ingest-handler/invocations
aws apigateway create-deployment --rest-api-id abc123 --stage-name dev

curl -X POST https://abc123.execute-api.us-east-1.amazonaws.com/dev/ingest/shopify \\
  -H "Content-Type: application/json" -d '{"order_id": "1001"}'`}
        </Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Invoke URL = API id + region + stage + resource path, e.g. https://abc123.execute-api.region.amazonaws.com/prod/ingest.',
          'Resources form a tree; path parameters like /ingest/{source} capture values from the URL for your backend.',
          'Methods (GET, POST, PUT, DELETE) attach to resources; HTTP APIs call the verb-plus-path pair a route.',
          'REST flow: method request → integration request → backend → integration response → method response.',
          'Changes are not live until deployed to a stage; stage variables let one deployment behave differently per stage.',
        ]}
      />
    </LessonArticle>
  )
}
