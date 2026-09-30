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

export function CustomDomainsAndDeployment() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Partners should never see a1b2c3d4e5.execute-api.us-east-1.amazonaws.com">
        The default invoke URL changes if you rebuild the API, leaks the Region, and looks like a test system.
        Production ingestion endpoints live at a stable name like{' '}
        <code className="text-core-400">api.acme.com/ingest/v1</code>, ship through CloudFormation, and roll out
        changes gradually. This lesson covers domains, certificates, stage variables, canaries, and versioning.
      </Callout>

      <Definition term="Custom domain name">
        <p>
          An API Gateway resource that binds a hostname you own to one or more APIs and stages, using a TLS
          certificate from AWS Certificate Manager (ACM). <strong className="text-white">Base path mappings</strong>{' '}
          (REST) or <strong className="text-white">API mappings</strong> (HTTP) route a path prefix such as{' '}
          <code className="text-core-400">ingest/v1</code> to a specific API and stage. A Route 53 alias record
          points the hostname at the domain&apos;s target.
        </p>
      </Definition>

      <LessonSection title="Domains and certificates">
        <ContentStep number={1} title="Regional vs edge-optimized">
          <p className="text-slate-300">
            A <strong className="text-white">regional</strong> domain serves from the API&apos;s Region and needs an
            ACM certificate in that same Region — the usual choice for server-to-server ingestion. An{' '}
            <strong className="text-white">edge-optimized</strong> domain fronts the API with a CloudFront
            distribution managed by AWS and requires the certificate in{' '}
            <code className="text-core-400">us-east-1</code>, whatever Region the API is in.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Base path mappings">
          <p className="text-slate-300">
            One hostname, many APIs: <code className="text-core-400">api.acme.com/ingest/v1</code> maps to{' '}
            <code className="text-core-400">acme-ingest-api-prod</code> stage prod,{' '}
            <code className="text-core-400">api.acme.com/datasets</code> maps to the data catalog API. Multi-level
            paths like <code className="text-core-400">ingest/v1</code> are supported on regional domains. Disable
            the default execute-api endpoint once clients have moved, so the custom domain is the only way in.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Versioning strategy">
          <p className="text-slate-300">
            Put the major version in the path: <code className="text-core-400">/ingest/v1</code> and{' '}
            <code className="text-core-400">/ingest/v2</code> map to separate APIs or stages. Additive changes
            (new optional fields) stay in v1; breaking changes (renamed fields, new required auth) go to v2 with a
            published sunset date for v1. Bronze keeps a <code className="text-core-400">schema_version</code>{' '}
            column so Glue jobs handle both.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Stages, stage variables, and canaries">
        <ContentStep number={1} title="Stage variables">
          <p className="text-slate-300">
            Key-value pairs per stage that integrations can reference — for example a Lambda alias name or a queue
            name. The same API definition then points prod at <code className="text-core-400">live</code> and dev at{' '}
            <code className="text-core-400">dev</code> without duplication. Keep secrets out of stage variables;
            they are visible to anyone who can read the API configuration.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Canary deployments on REST APIs">
          <p className="text-slate-300">
            A canary sends a percentage of stage traffic — say 10 percent — to a new deployment while the rest
            stays on the current one. Canary logs and metrics are reported separately from the main release, so
            you can compare them. Watch 5XX and latency for an hour, then promote or roll back. HTTP APIs have no
            built-in canary; shift traffic with Lambda alias weights instead.
          </p>
        </ContentStep>
        <Example title="Integration URI with a stage variable" caption="REST Lambda integration resolves the alias per stage">
{`arn:aws:apigateway:us-east-1:lambda:path/2015-03-31/functions/arn:aws:lambda:us-east-1:111122223333:function:ingest-handler:\${stageVariables.lambdaAlias}/invocations

# Stage prod: lambdaAlias = live
# Stage dev:  lambdaAlias = dev
# Grant lambda:InvokeFunction to API Gateway on each alias`}
        </Example>
        <Flowchart
          title="Canary rollout on the prod stage"
          chart={`flowchart LR
  C[Partner traffic]
  ST[prod stage]
  CUR[Current deployment 90 percent]
  CAN[Canary deployment 10 percent]
  CW[CloudWatch canary metrics]
  OK[Promote canary]
  BAD[Roll back]
  C --> ST
  ST --> CUR
  ST --> CAN
  CAN --> CW
  CW -->|healthy| OK
  CW -->|errors rising| BAD`}
        />
      </LessonSection>

      <LessonSection title="Infrastructure as code and OpenAPI">
        <ContentStep number={1} title="SAM and CloudFormation">
          <p className="text-slate-300">
            Define the API, domain, mappings, and stage settings in the same stack as the Lambda and queue.{' '}
            <code className="text-core-400">AWS::Serverless::Api</code> (REST) and{' '}
            <code className="text-core-400">AWS::Serverless::HttpApi</code> wrap the lower-level{' '}
            <code className="text-core-400">AWS::ApiGateway::*</code> and{' '}
            <code className="text-core-400">AWS::ApiGatewayV2::*</code> resources and handle deployments for you.
          </p>
        </ContentStep>
        <ContentStep number={2} title="OpenAPI import and export">
          <p className="text-slate-300">
            API Gateway imports OpenAPI 3.0 with <code className="text-core-400">x-amazon-apigateway-*</code>{' '}
            extensions for integrations, validators, and authorizers. Export the prod stage as OpenAPI to publish
            partner documentation or generate client SDKs — the contract and the deployed API stay in sync.
          </p>
        </ContentStep>
        <Example title="SAM REST API with custom domain" caption="template.yaml excerpt">
{`IngestApi:
  Type: AWS::Serverless::Api
  Properties:
    Name: acme-ingest-api-prod
    StageName: prod
    EndpointConfiguration: REGIONAL
    TracingEnabled: true
    Domain:
      DomainName: api.acme.com
      CertificateArn: !Sub arn:aws:acm:\${AWS::Region}:\${AWS::AccountId}:certificate/REPLACE_ME
      EndpointConfiguration: REGIONAL
      BasePath: [ingest/v1]
      SecurityPolicy: TLS_1_2
      Route53:
        HostedZoneId: Z0123456789EXAMPLE
    MethodSettings:
      - ResourcePath: "/*"
        HttpMethod: "*"
        ThrottlingRateLimit: 500
        ThrottlingBurstLimit: 1000`}
        </Example>
        <Callout variant="tip">
          Every REST API change needs a new deployment to reach a stage — a common &quot;my change did nothing&quot;
          bug. SAM creates deployments automatically; with raw CloudFormation, change the deployment resource
          logical id or description on each update.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Custom domains give partners a stable hostname; regional certs live in the API Region, edge certs in us-east-1.',
          'Base path mappings route prefixes like ingest/v1 to APIs and stages; disable the default endpoint afterwards.',
          'Put major versions in the path and keep a schema_version column in bronze for mixed-version data.',
          'Stage variables parameterize integrations per stage; REST canaries shift a percentage of traffic safely.',
          'Manage APIs with SAM or CloudFormation and use OpenAPI for contracts, docs, and SDK generation.',
        ]}
      />
    </LessonArticle>
  )
}
