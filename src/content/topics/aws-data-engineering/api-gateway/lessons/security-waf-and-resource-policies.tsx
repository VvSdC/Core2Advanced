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

export function SecurityWafAndResourcePolicies() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Authorization is one layer — production APIs need several">
        An authorizer checks tokens, but the request still reached you. For a partner ingestion endpoint you
        also want to say: only from the partner&apos;s network <code className="text-core-400">203.0.113.0/24</code>,
        only over modern TLS, only with their client certificate, and never more than a sane rate from any single
        IP. API Gateway, AWS WAF, and IAM together give you those layers.
      </Callout>

      <Definition term="Resource policy">
        <p>
          A JSON policy attached to a <strong className="text-white">REST API</strong> that controls who may call{' '}
          <code className="text-core-400">execute-api:Invoke</code> based on source IP, VPC endpoint, VPC, or AWS
          principal — evaluated before or alongside the authorizer. An explicit Deny in the resource policy blocks
          the call even if the authorizer would allow it. HTTP APIs do not support resource policies; use
          authorizers and network design there.
        </p>
      </Definition>

      <LessonSection title="Resource policies">
        <ContentStep number={1} title="IP allow-list for partners">
          <p className="text-slate-300">
            Deny <code className="text-core-400">execute-api:Invoke</code> on the ingest path when{' '}
            <code className="text-core-400">aws:SourceIp</code> is not in the partner CIDRs. Scope the Deny to
            the partner resource path so your health check and other routes are unaffected. Redeploy the stage
            after changing a REST resource policy.
          </p>
        </ContentStep>
        <ContentStep number={2} title="VPC endpoint and cross-account">
          <p className="text-slate-300">
            Private APIs restrict on <code className="text-core-400">aws:SourceVpce</code>. For cross-account IAM
            callers, allow the other account&apos;s role ARN as principal — the caller&apos;s identity policy must
            also allow <code className="text-core-400">execute-api:Invoke</code>, because cross-account access
            needs both sides.
          </p>
        </ContentStep>
        <Example title="Partner IP allow-list" caption="Deny the partner path unless the call comes from 203.0.113.0/24">
{`{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": "*",
      "Action": "execute-api:Invoke",
      "Resource": "execute-api:/*"
    },
    {
      "Effect": "Deny",
      "Principal": "*",
      "Action": "execute-api:Invoke",
      "Resource": "execute-api:/prod/POST/ingest/globex",
      "Condition": {
        "NotIpAddress": { "aws:SourceIp": ["203.0.113.0/24"] }
      }
    }
  ]
}`}
        </Example>
      </LessonSection>

      <LessonSection title="AWS WAF and transport security">
        <ContentStep number={1} title="WAF web ACL on the REST stage">
          <p className="text-slate-300">
            Associate a regional web ACL with the REST API stage (WAF does not attach directly to HTTP APIs).
            Start with AWS managed rule groups — core rule set, known bad inputs, and Amazon IP reputation list —
            in count mode, review hits, then switch to block.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Rate-based and geo rules">
          <p className="text-slate-300">
            A rate-based rule blocks any single IP exceeding, say, 2,000 requests in a 5-minute window — a backstop
            beyond per-key throttling that also catches unauthenticated floods. Geo match rules block countries
            where you have no partners. Blocked requests return 403 and never invoke your authorizer.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Mutual TLS and TLS policies">
          <p className="text-slate-300">
            For high-trust partners, enable mTLS on the regional custom domain: upload a truststore PEM of allowed
            CA certificates to S3, and API Gateway rejects clients without a valid certificate during the
            handshake. Disable the default execute-api endpoint so clients cannot bypass it. Set the domain
            security policy to <code className="text-core-400">TLS_1_2</code> or a newer policy offered in your
            Region.
          </p>
        </ContentStep>
        <Flowchart
          title="Layers a partner request passes"
          chart={`flowchart TB
  P[Partner 203.0.113.0 24]
  TLS[Custom domain TLS 1.2 plus mTLS]
  WAF[WAF managed rules rate and geo]
  RP[Resource policy IP allow-list]
  AUTH[Lambda authorizer]
  VAL[Request validator]
  INT[Integration role least privilege]
  Q[SQS de-webhooks-queue-prod]
  P --> TLS
  TLS --> WAF
  WAF --> RP
  RP --> AUTH
  AUTH --> VAL
  VAL --> INT
  INT --> Q`}
        />
      </LessonSection>

      <LessonSection title="Least privilege, CORS, and audit">
        <ContentStep number={1} title="Integration roles">
          <p className="text-slate-300">
            The API Gateway execution role for a direct SQS integration should allow{' '}
            <code className="text-core-400">sqs:SendMessage</code> on one queue ARN — not{' '}
            <code className="text-core-400">sqs:*</code>. Lambda integrations use a resource-based permission on
            the function scoped with <code className="text-core-400">SourceArn</code> to this API.
          </p>
        </ContentStep>
        <ContentStep number={2} title="CORS only where browsers call">
          <p className="text-slate-300">
            Server-to-server ingestion needs no CORS. For the analyst web app, allow the exact origin{' '}
            <code className="text-core-400">https://data.acme.com</code>, never <code className="text-core-400">*</code>{' '}
            with credentials. HTTP APIs have built-in CORS settings; with REST Lambda proxy integrations the Lambda
            must return the CORS headers itself.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Audit and logging hygiene">
          <p className="text-slate-300">
            CloudTrail records API Gateway management calls — <code className="text-core-400">UpdateStage</code>,{' '}
            <code className="text-core-400">CreateDeployment</code>, and <code className="text-core-400">UpdateRestApi</code>{' '}
            (which carries resource policy edits) — so you can alert on someone removing the IP allow-list. Invocations are not in CloudTrail; that is what access logs are for.
            Never log <code className="text-core-400">Authorization</code> headers, API keys, or request bodies with
            PII in access logs.
          </p>
        </ContentStep>
        <Example title="EventBridge rule — alert on API config changes" caption="Target SNS de-alerts-prod">
{`{
  "source": ["aws.apigateway"],
  "detail-type": ["AWS API Call via CloudTrail"],
  "detail": {
    "eventSource": ["apigateway.amazonaws.com"],
    "eventName": ["UpdateRestApi", "PutRestApi", "UpdateStage", "DeleteStage", "CreateDeployment"]
  }
}`}
        </Example>
        <Callout variant="insight">
          Defense in depth for ingestion: network filter (resource policy and WAF), identity (authorizer or mTLS),
          contract (validator), and blast radius (least-privilege integration role). Losing one layer should not
          open the lake.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'REST resource policies restrict callers by source IP, VPC endpoint, or principal — explicit Deny wins.',
          'Attach AWS WAF to REST stages with managed rule groups, rate-based rules, and geo rules.',
          'Use mTLS on custom domains for high-trust partners and disable the default endpoint to prevent bypass.',
          'Keep integration roles and Lambda permissions scoped to one target and one API.',
          'Alert on API config changes via CloudTrail; keep secrets and PII out of access logs.',
        ]}
      />
    </LessonArticle>
  )
}
