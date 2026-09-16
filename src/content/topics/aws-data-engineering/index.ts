import type { Topic } from '../../types'
import { createEmptySubTopic } from '../../create-empty-subtopic'
import { awsFundamentalsSubTopic } from './aws-fundamentals'
import { iamSubTopic } from './iam'
import { ec2SubTopic } from './ec2'
import { s3SubTopic } from './s3'
import { lambdaSubTopic } from './lambda'
import { cloudWatchSubTopic } from './cloudwatch'
import { snsSubTopic } from './sns'
import { athenaSubTopic } from './athena'
import { redshiftSubTopic } from './redshift'
import { rdsSubTopic } from './rds'
import { glueSubTopic } from './glue'
import { vpcSubTopic } from './vpc'
import { eventBridgeSubTopic } from './eventbridge'
import { cloudFormationSubTopic } from './cloudformation'
import { dynamoDbSubTopic } from './dynamodb'

const sqsSubTopic = createEmptySubTopic(
  'sqs',
  'Amazon SQS',
  'Queues for decoupling producers and consumers in data pipelines.',
)

const stepFunctionsSubTopic = createEmptySubTopic(
  'step-functions',
  'Step Functions',
  'Orchestrate Lambda, Glue, and retries into production workflows.',
)

const secretsSubTopic = createEmptySubTopic(
  'secrets-and-parameters',
  'Secrets Manager & Parameter Store',
  'Secure credentials and config for jobs, Lambda, and databases.',
)

const kmsSubTopic = createEmptySubTopic(
  'kms',
  'AWS KMS',
  'Encryption keys, policies, and protecting data at rest across services.',
)

const cloudTrailSubTopic = createEmptySubTopic(
  'cloudtrail',
  'CloudTrail',
  'API audit trails for security, compliance, and change forensics.',
)

const systemsManagerSubTopic = createEmptySubTopic(
  'systems-manager',
  'Systems Manager',
  'Session Manager, Run Command, and operational control of fleets.',
)

const endToEndSubTopic = createEmptySubTopic(
  'end-to-end-project',
  'End-to-End Project',
  'Full DE architecture, security, ops, IaC, and interview prep.',
)

export const awsDataEngineeringTopic: Topic = {
  id: 'aws-data-engineering',
  title: 'AWS Data Engineering',
  description:
    'Beginner to production — AWS fundamentals through Glue, lakes, warehouses, and end-to-end pipelines.',
  accent: 'aws-data-engineering',
  catalog: [
    { type: 'subTopic', subTopicId: 'aws-fundamentals' },
    { type: 'subTopic', subTopicId: 'iam' },
    { type: 'subTopic', subTopicId: 'ec2' },
    { type: 'subTopic', subTopicId: 's3' },
    { type: 'subTopic', subTopicId: 'lambda' },
    { type: 'subTopic', subTopicId: 'cloudwatch' },
    { type: 'subTopic', subTopicId: 'sns' },
    { type: 'subTopic', subTopicId: 'athena' },
    { type: 'subTopic', subTopicId: 'redshift' },
    { type: 'subTopic', subTopicId: 'rds' },
    { type: 'subTopic', subTopicId: 'glue' },
    { type: 'subTopic', subTopicId: 'vpc' },
    { type: 'subTopic', subTopicId: 'eventbridge' },
    { type: 'subTopic', subTopicId: 'cloudformation' },
    { type: 'subTopic', subTopicId: 'dynamodb' },
    { type: 'subTopic', subTopicId: 'sqs' },
    { type: 'subTopic', subTopicId: 'step-functions' },
    { type: 'subTopic', subTopicId: 'secrets-and-parameters' },
    { type: 'subTopic', subTopicId: 'kms' },
    { type: 'subTopic', subTopicId: 'cloudtrail' },
    { type: 'subTopic', subTopicId: 'systems-manager' },
    { type: 'subTopic', subTopicId: 'end-to-end-project' },
  ],
  subTopics: [
    awsFundamentalsSubTopic,
    iamSubTopic,
    ec2SubTopic,
    s3SubTopic,
    lambdaSubTopic,
    cloudWatchSubTopic,
    snsSubTopic,
    athenaSubTopic,
    redshiftSubTopic,
    rdsSubTopic,
    glueSubTopic,
    vpcSubTopic,
    eventBridgeSubTopic,
    cloudFormationSubTopic,
    dynamoDbSubTopic,
    sqsSubTopic,
    stepFunctionsSubTopic,
    secretsSubTopic,
    kmsSubTopic,
    cloudTrailSubTopic,
    systemsManagerSubTopic,
    endToEndSubTopic,
  ],
}
