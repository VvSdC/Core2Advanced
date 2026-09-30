import type { SubTopic } from '../../../types'
import { AuditingAndMonitoringSecrets } from './lessons/auditing-and-monitoring-secrets'
import { CachingAndLambdaExtension } from './lessons/caching-and-lambda-extension'
import { CloudformationDynamicReferences } from './lessons/cloudformation-dynamic-references'
import { CrossAccountAndMultiRegion } from './lessons/cross-account-and-multi-region'
import { GettingStartedWithSecretsAndParameters } from './lessons/getting-started-with-secrets-and-parameters'
import { GlueConnectionsAndSecrets } from './lessons/glue-connections-and-secrets'
import { IamAndResourcePolicies } from './lessons/iam-and-resource-policies'
import { ParameterHierarchiesAndEnvironments } from './lessons/parameter-hierarchies-and-environments'
import { PuttingItTogetherSecrets } from './lessons/putting-it-together-secrets'
import { PuttingItTogetherSecretsBeginner } from './lessons/putting-it-together-secrets-beginner'
import { ReadingSecretsInCode } from './lessons/reading-secrets-in-code'
import { SecretRotation } from './lessons/secret-rotation'
import { SecretsForDataEngineering } from './lessons/secrets-for-data-engineering'
import { SecretsInPipelines } from './lessons/secrets-in-pipelines'
import { SecretsManagerVsParameterStore } from './lessons/secrets-manager-vs-parameter-store'
import { WhatIsParameterStore } from './lessons/what-is-parameter-store'
import { WhatIsSecretsManager } from './lessons/what-is-secrets-manager'
import { WhyNotHardcodeSecrets } from './lessons/why-not-hardcode-secrets'

export const secretsAndParametersSubTopic: SubTopic = {
  id: 'secrets-and-parameters',
  title: 'Secrets Manager & Parameter Store',
  description:
    'Secure credentials and config for Glue, Lambda, and databases — storage, retrieval, rotation, IAM, and IaC references.',
  lessonSections: [
    {
      id: 'beginner',
      title: 'Beginner',
      lessons: [
        {
          id: 'getting-started-with-secrets-and-parameters',
          title: 'Getting Started with Secrets & Parameters',
          description: 'Why secrets management after Step Functions — roadmap and vocabulary.',
          readTime: '11 min',
          component: GettingStartedWithSecretsAndParameters,
        },
        {
          id: 'why-not-hardcode-secrets',
          title: 'Why Never Hardcode Credentials',
          description: 'Leaked keys in Git, logs, and job arguments — the real incidents.',
          readTime: '10 min',
          component: WhyNotHardcodeSecrets,
        },
        {
          id: 'what-is-secrets-manager',
          title: 'What Is Secrets Manager?',
          description: 'Encrypted secrets with versions, rotation, and fine-grained access.',
          readTime: '11 min',
          component: WhatIsSecretsManager,
        },
        {
          id: 'what-is-parameter-store',
          title: 'What Is Parameter Store?',
          description: 'SSM parameters — String, StringList, SecureString, and tiers.',
          readTime: '11 min',
          component: WhatIsParameterStore,
        },
        {
          id: 'secrets-manager-vs-parameter-store',
          title: 'Secrets Manager vs Parameter Store',
          description: 'Cost, rotation, size, and when DE teams use each.',
          readTime: '11 min',
          component: SecretsManagerVsParameterStore,
        },
        {
          id: 'secrets-for-data-engineering',
          title: 'Secrets for Data Engineering',
          description: 'Database creds, API keys, and pipeline config — who needs what.',
          readTime: '11 min',
          component: SecretsForDataEngineering,
        },
        {
          id: 'putting-it-together-secrets-beginner',
          title: 'Beginner Checkpoint',
          description: 'Confirm the basics before code, IAM, and rotation.',
          readTime: '9 min',
          component: PuttingItTogetherSecretsBeginner,
        },
      ],
    },
    {
      id: 'intermediate',
      title: 'Intermediate',
      lessons: [
        {
          id: 'reading-secrets-in-code',
          title: 'Reading Secrets in Code',
          description: 'Boto3 GetSecretValue and GetParameter from Lambda and Glue.',
          readTime: '11 min',
          component: ReadingSecretsInCode,
        },
        {
          id: 'parameter-hierarchies-and-environments',
          title: 'Parameter Hierarchies & Environments',
          description: 'Path naming like /de/prod/orders — GetParametersByPath and env parity.',
          readTime: '11 min',
          component: ParameterHierarchiesAndEnvironments,
        },
        {
          id: 'iam-and-resource-policies',
          title: 'IAM & Resource Policies',
          description: 'Least privilege on secret ARNs, paths, and kms:Decrypt.',
          readTime: '12 min',
          component: IamAndResourcePolicies,
        },
        {
          id: 'secret-rotation',
          title: 'Secret Rotation',
          description: 'Managed RDS rotation, rotation Lambdas, and schedules.',
          readTime: '12 min',
          component: SecretRotation,
        },
      ],
    },
    {
      id: 'advanced',
      title: 'Advanced',
      lessons: [
        {
          id: 'glue-connections-and-secrets',
          title: 'Glue Connections & Secrets',
          description: 'JDBC connections to RDS and Redshift backed by Secrets Manager.',
          readTime: '12 min',
          component: GlueConnectionsAndSecrets,
        },
        {
          id: 'caching-and-lambda-extension',
          title: 'Caching & the Lambda Extension',
          description: 'Avoid throttling and cost — client caching and the Parameters and Secrets extension.',
          readTime: '11 min',
          component: CachingAndLambdaExtension,
        },
        {
          id: 'cloudformation-dynamic-references',
          title: 'CloudFormation Dynamic References',
          description: 'resolve:secretsmanager and resolve:ssm — secrets without templates leaking them.',
          readTime: '11 min',
          component: CloudformationDynamicReferences,
        },
        {
          id: 'cross-account-and-multi-region',
          title: 'Cross-Account & Multi-Region',
          description: 'Sharing secrets safely and replicating for DR.',
          readTime: '12 min',
          component: CrossAccountAndMultiRegion,
        },
        {
          id: 'auditing-and-monitoring-secrets',
          title: 'Auditing & Monitoring Secrets',
          description: 'CloudTrail access logs, rotation failure alerts, and unused secrets.',
          readTime: '11 min',
          component: AuditingAndMonitoringSecrets,
        },
        {
          id: 'secrets-in-pipelines',
          title: 'Secrets in Pipelines',
          description: 'Patterns and anti-patterns — logs, env vars, job args, and Step Functions.',
          readTime: '12 min',
          component: SecretsInPipelines,
        },
        {
          id: 'putting-it-together-secrets',
          title: 'Putting It All Together',
          description: 'Secrets checkpoint, interview quick checks, and what’s next (KMS).',
          readTime: '10 min',
          component: PuttingItTogetherSecrets,
        },
      ],
    },
  ],
}
