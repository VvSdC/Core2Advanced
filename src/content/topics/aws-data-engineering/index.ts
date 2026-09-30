import type { Topic } from '../../types'
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
import { sqsSubTopic } from './sqs'
import { stepFunctionsSubTopic } from './step-functions'
import { secretsAndParametersSubTopic } from './secrets-and-parameters'
import { kmsSubTopic } from './kms'
import { cloudTrailSubTopic } from './cloudtrail'
import { systemsManagerSubTopic } from './systems-manager'
import { apiGatewaySubTopic } from './api-gateway'
import { ecsSubTopic } from './ecs'

export const awsDataEngineeringTopic: Topic = {
  id: 'aws-data-engineering',
  title: 'AWS Data Engineering',
  description:
    'Beginner to production — AWS fundamentals through Glue, lakes, warehouses, orchestration, security, APIs, and containers.',
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
    { type: 'subTopic', subTopicId: 'api-gateway' },
    { type: 'subTopic', subTopicId: 'ecs' },
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
    secretsAndParametersSubTopic,
    kmsSubTopic,
    cloudTrailSubTopic,
    systemsManagerSubTopic,
    apiGatewaySubTopic,
    ecsSubTopic,
  ],
}
