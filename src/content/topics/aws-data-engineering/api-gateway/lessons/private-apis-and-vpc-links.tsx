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

export function PrivateApisAndVpcLinks() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Two different problems: who can reach the API, and what the API can reach">
        Your team publishes a dataset lookup API that other internal teams call — it should never be on the
        internet. Separately, some of your backends run as containers or services in private subnets that API
        Gateway cannot reach by default. <strong className="text-white">Private APIs</strong> solve the first
        problem; <strong className="text-white">VPC links</strong> solve the second. They are independent and
        often used together.
      </Callout>

      <Definition term="Private API and VPC link">
        <p>
          A <strong className="text-white">private REST API</strong> has endpoint type{' '}
          <code className="text-core-400">PRIVATE</code> and is reachable only through an interface VPC endpoint
          for <code className="text-core-400">execute-api</code>, gated by a resource policy. A{' '}
          <strong className="text-white">VPC link</strong> is a managed connection that lets API Gateway send
          integration traffic <em>into</em> your VPC — to a Network Load Balancer, Application Load Balancer, or
          Cloud Map service — without making that backend public.
        </p>
      </Definition>

      <LessonSection title="Private REST APIs — inbound only from your VPCs">
        <ContentStep number={1} title="Create the execute-api interface endpoint">
          <p className="text-slate-300">
            In the consumer VPC, create an interface endpoint for{' '}
            <code className="text-core-400">com.amazonaws.us-east-1.execute-api</code> in private subnets, with a
            security group allowing HTTPS 443 from the callers. Private DNS makes the standard API hostname resolve
            to the endpoint — but it then applies to every execute-api hostname from that VPC, so public APIs
            called from there need a custom domain or the endpoint-specific hostname.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Lock it down with a resource policy">
          <p className="text-slate-300">
            A private API without a resource policy rejects all calls. Allow{' '}
            <code className="text-core-400">execute-api:Invoke</code> only when{' '}
            <code className="text-core-400">aws:SourceVpce</code> matches your endpoint id — or{' '}
            <code className="text-core-400">aws:SourceVpc</code> for a whole VPC. Pair with IAM auth so the caller
            role is also checked.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Cross-account consumers">
          <p className="text-slate-300">
            The analytics account creates its own execute-api endpoint and sends you the endpoint id. Add it to the
            resource policy and the private API is callable from their VPC with no peering or Transit Gateway.
            Custom domain names for private APIs are also supported in recent releases — verify availability in
            your Region.
          </p>
        </ContentStep>
        <Example title="Private API resource policy" caption="Only calls arriving through two approved VPC endpoints">
{`{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Deny",
      "Principal": "*",
      "Action": "execute-api:Invoke",
      "Resource": "execute-api:/*",
      "Condition": {
        "StringNotEquals": {
          "aws:SourceVpce": ["vpce-0a1b2c3d4e5f60001", "vpce-0f9e8d7c6b5a40002"]
        }
      }
    },
    {
      "Effect": "Allow",
      "Principal": "*",
      "Action": "execute-api:Invoke",
      "Resource": "execute-api:/*"
    }
  ]
}`}
        </Example>
      </LessonSection>

      <LessonSection title="VPC links — outbound into private subnets">
        <ContentStep number={1} title="Which load balancer for which API">
          <p className="text-slate-300">
            The original REST VPC link (v1) targets a Network Load Balancer only. HTTP APIs use VPC link v2, which
            targets ALBs, NLBs, and Cloud Map services. Since late 2025, REST APIs can also use VPC link v2 to reach
            an ALB directly without the extra NLB hop — check Regional availability.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Reaching ECS services and internal data APIs">
          <p className="text-slate-300">
            A typical target: a FastAPI service on ECS Fargate that serves curated metrics from Redshift or
            DynamoDB, behind an internal ALB in private subnets. The API Gateway route uses an{' '}
            <code className="text-core-400">HTTP_PROXY</code> integration with the VPC link and the listener ARN.
            Authorization, throttling, and logging stay at the gateway; the service stays private.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Security groups">
          <p className="text-slate-300">
            VPC link v2 places elastic network interfaces in your subnets with a security group you choose. The
            ALB security group should allow inbound only from that VPC link security group, and the ECS task
            security group only from the ALB. With v1 and an NLB, traffic arrives from the NLB, so restrict task
            security groups to the NLB security group or VPC CIDR.
          </p>
        </ContentStep>
        <Flowchart
          title="Private API plus VPC link to ECS"
          chart={`flowchart LR
  CONS[Analytics team Lambda]
  VPCE[execute-api VPC endpoint]
  API[Private REST API]
  LINK[VPC link]
  ALB[Internal ALB]
  ECS[ECS Fargate data service]
  RS[Redshift or DynamoDB]
  CONS --> VPCE
  VPCE --> API
  API --> LINK
  LINK --> ALB
  ALB --> ECS
  ECS --> RS`}
        />
      </LessonSection>

      <LessonSection title="Choosing the pattern">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Need</th>
                <th className="px-4 py-3">Use</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Only internal callers may reach the API', 'Private REST API plus execute-api endpoint and resource policy'],
                ['Public partners, backend in private subnets', 'Regional API plus VPC link to ALB or NLB'],
                ['Internal callers and private backend', 'Private REST API plus VPC link'],
                ['Backend is Lambda or an AWS service', 'No VPC link needed — integrations run over AWS APIs'],
                ['Service discovery for many ECS services', 'HTTP API VPC link v2 with Cloud Map'],
              ].map(([need, use]) => (
                <tr key={need} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{need}</td>
                  <td className="px-4 py-3">{use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="insight">
          Private endpoints are a REST API feature — HTTP APIs are always publicly addressable, though you can
          still restrict them with authorizers. If &quot;not on the internet&quot; is a hard requirement, pick REST.
        </Callout>
        <Callout variant="tip">
          Lambda integrations do not need a VPC link even when the Lambda itself runs in a VPC. VPC links are for
          HTTP backends behind load balancers or Cloud Map.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Private REST APIs are reachable only through execute-api interface endpoints and require a resource policy.',
          'Restrict with aws:SourceVpce or aws:SourceVpc; add endpoint ids from other accounts for cross-account access.',
          'VPC links carry integration traffic into private subnets: v1 to NLB, v2 to ALB, NLB, or Cloud Map.',
          'Chain security groups: VPC link to ALB to ECS tasks — nothing else inbound.',
          'Private inbound and private outbound are independent choices; combine them for internal data APIs.',
        ]}
      />
    </LessonArticle>
  )
}
