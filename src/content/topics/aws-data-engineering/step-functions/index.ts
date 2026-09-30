import type { SubTopic } from '../../../types'
import { AmazonStatesLanguage } from './lessons/amazon-states-language'
import { CallbacksAndHumanApproval } from './lessons/callbacks-and-human-approval'
import { ChoiceWaitParallel } from './lessons/choice-wait-parallel'
import { ErrorHandlingRetryCatch } from './lessons/error-handling-retry-catch'
import { GettingStartedWithStepFunctions } from './lessons/getting-started-with-step-functions'
import { InputOutputProcessing } from './lessons/input-output-processing'
import { MapAndDistributedMap } from './lessons/map-and-distributed-map'
import { ObservabilityAndDebugging } from './lessons/observability-and-debugging'
import { OrchestratingGlueAthenaRedshift } from './lessons/orchestrating-glue-athena-redshift'
import { PuttingItTogetherStepFunctions } from './lessons/putting-it-together-step-functions'
import { PuttingItTogetherStepFunctionsBeginner } from './lessons/putting-it-together-step-functions-beginner'
import { ServiceIntegrations } from './lessons/service-integrations'
import { StandardVsExpressWorkflows } from './lessons/standard-vs-express-workflows'
import { StatesAndTransitions } from './lessons/states-and-transitions'
import { StepFunctionsForDataEngineering } from './lessons/step-functions-for-data-engineering'
import { StepFunctionsVsGlueWorkflowsMwaa } from './lessons/step-functions-vs-glue-workflows-mwaa'
import { TriggersSchedulesEvents } from './lessons/triggers-schedules-events'
import { WhatIsStepFunctions } from './lessons/what-is-step-functions'

export const stepFunctionsSubTopic: SubTopic = {
  id: 'step-functions',
  title: 'Step Functions',
  description:
    'Orchestrate Lambda, Glue, Athena, and Redshift into production workflows — states, retries, Map, callbacks, and observability.',
  lessonSections: [
    {
      id: 'beginner',
      title: 'Beginner',
      lessons: [
        {
          id: 'getting-started-with-step-functions',
          title: 'Getting Started with Step Functions',
          description: 'Why orchestration after SQS — roadmap and vocabulary.',
          readTime: '11 min',
          component: GettingStartedWithStepFunctions,
        },
        {
          id: 'what-is-step-functions',
          title: 'What Is Step Functions?',
          description: 'Serverless state machines — orchestration vs choreography.',
          readTime: '10 min',
          component: WhatIsStepFunctions,
        },
        {
          id: 'states-and-transitions',
          title: 'States & Transitions',
          description: 'Task, Choice, Wait, Pass, Parallel, Map, Succeed, and Fail.',
          readTime: '12 min',
          component: StatesAndTransitions,
        },
        {
          id: 'amazon-states-language',
          title: 'Amazon States Language',
          description: 'Reading and writing the JSON definition behind every workflow.',
          readTime: '12 min',
          component: AmazonStatesLanguage,
        },
        {
          id: 'standard-vs-express-workflows',
          title: 'Standard vs Express Workflows',
          description: 'Long-running, exactly-once vs high-volume, short, at-least-once.',
          readTime: '11 min',
          component: StandardVsExpressWorkflows,
        },
        {
          id: 'step-functions-for-data-engineering',
          title: 'Step Functions for Data Engineering',
          description: 'Nightly ETL, multi-step ingest, and replacing cron + glue code.',
          readTime: '11 min',
          component: StepFunctionsForDataEngineering,
        },
        {
          id: 'putting-it-together-step-functions-beginner',
          title: 'Beginner Checkpoint',
          description: 'Confirm state machine basics before integrations and error handling.',
          readTime: '9 min',
          component: PuttingItTogetherStepFunctionsBeginner,
        },
      ],
    },
    {
      id: 'intermediate',
      title: 'Intermediate',
      lessons: [
        {
          id: 'service-integrations',
          title: 'Service Integrations',
          description: 'Request-response, .sync (run a job), and wait-for-callback patterns.',
          readTime: '12 min',
          component: ServiceIntegrations,
        },
        {
          id: 'input-output-processing',
          title: 'Input & Output Processing',
          description: 'InputPath, Parameters, ResultSelector, ResultPath, and OutputPath.',
          readTime: '12 min',
          component: InputOutputProcessing,
        },
        {
          id: 'error-handling-retry-catch',
          title: 'Retry & Catch',
          description: 'Backoff, error names, fallbacks, and failing loudly.',
          readTime: '12 min',
          component: ErrorHandlingRetryCatch,
        },
        {
          id: 'choice-wait-parallel',
          title: 'Choice, Wait & Parallel',
          description: 'Branching on data, pausing, and running steps side by side.',
          readTime: '11 min',
          component: ChoiceWaitParallel,
        },
      ],
    },
    {
      id: 'advanced',
      title: 'Advanced',
      lessons: [
        {
          id: 'map-and-distributed-map',
          title: 'Map & Distributed Map',
          description: 'Fan out over lists and millions of S3 objects with concurrency control.',
          readTime: '13 min',
          component: MapAndDistributedMap,
        },
        {
          id: 'orchestrating-glue-athena-redshift',
          title: 'Orchestrating Glue, Athena & Redshift',
          description: 'A full lake pipeline — crawl, transform, query, load.',
          readTime: '13 min',
          component: OrchestratingGlueAthenaRedshift,
        },
        {
          id: 'callbacks-and-human-approval',
          title: 'Callbacks & Human Approval',
          description: 'Task tokens, external systems, and approve-before-publish gates.',
          readTime: '12 min',
          component: CallbacksAndHumanApproval,
        },
        {
          id: 'triggers-schedules-events',
          title: 'Triggers, Schedules & Events',
          description: 'EventBridge rules, Scheduler, S3 landings, and SQS-driven starts.',
          readTime: '11 min',
          component: TriggersSchedulesEvents,
        },
        {
          id: 'observability-and-debugging',
          title: 'Observability & Debugging',
          description: 'Execution history, CloudWatch metrics, X-Ray, and redrive.',
          readTime: '12 min',
          component: ObservabilityAndDebugging,
        },
        {
          id: 'step-functions-vs-glue-workflows-mwaa',
          title: 'Step Functions vs Glue Workflows vs MWAA',
          description: 'Pick the right orchestrator for the team and the pipeline.',
          readTime: '12 min',
          component: StepFunctionsVsGlueWorkflowsMwaa,
        },
        {
          id: 'putting-it-together-step-functions',
          title: 'Putting It All Together',
          description: 'Step Functions checkpoint, interview quick checks, and what’s next (Secrets).',
          readTime: '10 min',
          component: PuttingItTogetherStepFunctions,
        },
      ],
    },
  ],
}
