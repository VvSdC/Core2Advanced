import type { SubTopic } from '../../../types'
import { ApiGatewayForDataEngineering } from './lessons/api-gateway-for-data-engineering'
import { ApiGatewayPlusLambda } from './lessons/api-gateway-plus-lambda'
import { Authorization } from './lessons/authorization'
import { CachingAndPerformance } from './lessons/caching-and-performance'
import { CustomDomainsAndDeployment } from './lessons/custom-domains-and-deployment'
import { DirectServiceIntegrations } from './lessons/direct-service-integrations'
import { GettingStartedWithApiGateway } from './lessons/getting-started-with-api-gateway'
import { IngestionApisToTheLake } from './lessons/ingestion-apis-to-the-lake'
import { MonitoringLoggingAndTracing } from './lessons/monitoring-logging-and-tracing'
import { PrivateApisAndVpcLinks } from './lessons/private-apis-and-vpc-links'
import { PuttingItTogetherApiGateway } from './lessons/putting-it-together-api-gateway'
import { PuttingItTogetherApiGatewayBeginner } from './lessons/putting-it-together-api-gateway-beginner'
import { RequestValidationAndMapping } from './lessons/request-validation-and-mapping'
import { ResourcesMethodsStages } from './lessons/resources-methods-stages'
import { RestHttpWebsocketApis } from './lessons/rest-http-websocket-apis'
import { SecurityWafAndResourcePolicies } from './lessons/security-waf-and-resource-policies'
import { ThrottlingUsagePlansApiKeys } from './lessons/throttling-usage-plans-api-keys'
import { WhatIsApiGateway } from './lessons/what-is-api-gateway'

export const apiGatewaySubTopic: SubTopic = {
  id: 'api-gateway',
  title: 'API Gateway',
  description:
    'Front doors for data — REST and HTTP APIs, Lambda and direct integrations, auth, throttling, and ingestion endpoints that land in the lake.',
  lessonSections: [
    {
      id: 'beginner',
      title: 'Beginner',
      lessons: [
        {
          id: 'getting-started-with-api-gateway',
          title: 'Getting Started with API Gateway',
          description: 'Why API Gateway after Systems Manager — roadmap and vocabulary.',
          readTime: '11 min',
          component: GettingStartedWithApiGateway,
        },
        {
          id: 'what-is-api-gateway',
          title: 'What Is API Gateway?',
          description: 'A managed front door — requests in, integrations behind, no servers to run.',
          readTime: '10 min',
          component: WhatIsApiGateway,
        },
        {
          id: 'rest-http-websocket-apis',
          title: 'REST, HTTP & WebSocket APIs',
          description: 'Three API types — features, price, and which one to pick.',
          readTime: '11 min',
          component: RestHttpWebsocketApis,
        },
        {
          id: 'resources-methods-stages',
          title: 'Resources, Methods & Stages',
          description: 'Paths, HTTP verbs, deployments, and stage URLs like /prod.',
          readTime: '11 min',
          component: ResourcesMethodsStages,
        },
        {
          id: 'api-gateway-plus-lambda',
          title: 'API Gateway + Lambda',
          description: 'Proxy integration — the event shape in, the response shape out.',
          readTime: '12 min',
          component: ApiGatewayPlusLambda,
        },
        {
          id: 'api-gateway-for-data-engineering',
          title: 'API Gateway for Data Engineering',
          description: 'Ingestion webhooks, data APIs over the lake, and pipeline control endpoints.',
          readTime: '11 min',
          component: ApiGatewayForDataEngineering,
        },
        {
          id: 'putting-it-together-api-gateway-beginner',
          title: 'Beginner Checkpoint',
          description: 'Confirm API basics before auth, throttling, and direct integrations.',
          readTime: '9 min',
          component: PuttingItTogetherApiGatewayBeginner,
        },
      ],
    },
    {
      id: 'intermediate',
      title: 'Intermediate',
      lessons: [
        {
          id: 'authorization',
          title: 'Authorization',
          description: 'IAM, Cognito, JWT, and Lambda authorizers — who may call what.',
          readTime: '12 min',
          component: Authorization,
        },
        {
          id: 'throttling-usage-plans-api-keys',
          title: 'Throttling, Usage Plans & API Keys',
          description: 'Rate limits, bursts, per-partner quotas, and 429 responses.',
          readTime: '11 min',
          component: ThrottlingUsagePlansApiKeys,
        },
        {
          id: 'request-validation-and-mapping',
          title: 'Request Validation & Mapping',
          description: 'Reject bad payloads early and reshape requests with mapping templates.',
          readTime: '12 min',
          component: RequestValidationAndMapping,
        },
        {
          id: 'direct-service-integrations',
          title: 'Direct Service Integrations',
          description: 'Send straight to SQS, Kinesis, S3, DynamoDB, or Step Functions — no Lambda.',
          readTime: '12 min',
          component: DirectServiceIntegrations,
        },
      ],
    },
    {
      id: 'advanced',
      title: 'Advanced',
      lessons: [
        {
          id: 'ingestion-apis-to-the-lake',
          title: 'Ingestion APIs to the Lake',
          description: 'Webhooks and partner feeds → buffer → S3 bronze, at scale and idempotently.',
          readTime: '13 min',
          component: IngestionApisToTheLake,
        },
        {
          id: 'private-apis-and-vpc-links',
          title: 'Private APIs & VPC Links',
          description: 'Internal-only APIs and reaching services inside your VPC.',
          readTime: '12 min',
          component: PrivateApisAndVpcLinks,
        },
        {
          id: 'custom-domains-and-deployment',
          title: 'Custom Domains & Deployment',
          description: 'Domains, certificates, stage variables, canaries, and IaC.',
          readTime: '11 min',
          component: CustomDomainsAndDeployment,
        },
        {
          id: 'caching-and-performance',
          title: 'Caching & Performance',
          description: 'Response caching, timeouts, payload limits, and large downloads.',
          readTime: '11 min',
          component: CachingAndPerformance,
        },
        {
          id: 'monitoring-logging-and-tracing',
          title: 'Monitoring, Logging & Tracing',
          description: 'Access logs, execution logs, CloudWatch metrics, and X-Ray.',
          readTime: '11 min',
          component: MonitoringLoggingAndTracing,
        },
        {
          id: 'security-waf-and-resource-policies',
          title: 'Security, WAF & Resource Policies',
          description: 'IP allow-lists, AWS WAF rules, mTLS, and least-privilege integrations.',
          readTime: '12 min',
          component: SecurityWafAndResourcePolicies,
        },
        {
          id: 'putting-it-together-api-gateway',
          title: 'Putting It All Together',
          description: 'API Gateway checkpoint, interview quick checks, and what’s next (ECS).',
          readTime: '10 min',
          component: PuttingItTogetherApiGateway,
        },
      ],
    },
  ],
}
