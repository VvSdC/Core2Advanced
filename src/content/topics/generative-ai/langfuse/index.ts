import type { SubTopic } from '../../../types'

import { AnalyticsAndDashboards } from './lessons/analytics-and-dashboards'
import { DatasetsAndExperiments } from './lessons/datasets-and-experiments'
import { IntegrationsAndDeployment } from './lessons/integrations-and-deployment'
import { IntroductionToLangfuse } from './lessons/introduction-to-langfuse'
import { LangfuseDataModel } from './lessons/langfuse-data-model'
import { LlmAsJudgeEvaluators } from './lessons/llm-as-judge-evaluators'
import { PlaygroundAndDebugging } from './lessons/playground-and-debugging'
import { PromptManagement } from './lessons/prompt-management'
import { PuttingItTogetherLangfuse } from './lessons/putting-it-together-langfuse'
import { ScoresAndFeedback } from './lessons/scores-and-feedback'
import { SdkSetupAndFirstTrace } from './lessons/sdk-setup-and-first-trace'
import { SessionsUsersAndMetadata } from './lessons/sessions-users-and-metadata'
import { TracingAgentsAndLanggraph } from './lessons/tracing-agents-and-langgraph'
import { TracingLlmCalls } from './lessons/tracing-llm-calls'
import { TracingRagPipelines } from './lessons/tracing-rag-pipelines'
import { WhyLlmObservability } from './lessons/why-llm-observability'

const fundamentalsLessons = [
  { id: 'introduction-to-langfuse', title: 'Introduction to Langfuse', description: 'What Langfuse is, why it is required after building RAG/agents, and the six platform capabilities.', readTime: '10 min', component: IntroductionToLangfuse },
  { id: 'why-llm-observability', title: 'Why LLM Observability?', description: 'The black-box problem — debugging, cost, latency, and quality without structured traces.', readTime: '10 min', component: WhyLlmObservability },
  { id: 'langfuse-data-model', title: 'Traces, Spans & the Data Model', description: 'Traces, observations, generations, sessions, users, and scores explained.', readTime: '10 min', component: LangfuseDataModel },
]

const observabilityLessons = [
  { id: 'sdk-setup-and-first-trace', title: 'SDK Setup & First Trace', description: 'Cloud signup, API keys, @observe decorator, and your first trace in the dashboard.', readTime: '12 min', component: SdkSetupAndFirstTrace },
  { id: 'tracing-llm-calls', title: 'Tracing LLM Calls', description: 'Generations vs spans, token usage, cost tracking, and model parameters.', readTime: '10 min', component: TracingLlmCalls },
  { id: 'tracing-rag-pipelines', title: 'Tracing RAG Pipelines', description: 'Instrument embed, retrieval, and generate steps — debug retrieval failures.', readTime: '12 min', component: TracingRagPipelines },
  { id: 'tracing-agents-and-langgraph', title: 'Tracing Agents & LangGraph', description: 'Multi-step agent trace trees, tool spans, and LangChain CallbackHandler.', readTime: '12 min', component: TracingAgentsAndLanggraph },
  { id: 'sessions-users-and-metadata', title: 'Sessions, Users & Metadata', description: 'Multi-turn chat grouping, userId filtering, and custom metadata tags.', readTime: '8 min', component: SessionsUsersAndMetadata },
]

const promptsAndEvalLessons = [
  { id: 'prompt-management', title: 'Prompt Management', description: 'Version prompts in UI, production labels, fetch from SDK, link to traces.', readTime: '10 min', component: PromptManagement },
  { id: 'scores-and-feedback', title: 'Scores & Feedback', description: 'Human annotation, user thumbs, and programmatic scores on traces.', readTime: '10 min', component: ScoresAndFeedback },
  { id: 'llm-as-judge-evaluators', title: 'LLM-as-a-Judge Evaluators', description: 'Automated faithfulness and relevancy scoring on production traces.', readTime: '12 min', component: LlmAsJudgeEvaluators },
  { id: 'datasets-and-experiments', title: 'Datasets & Experiments', description: 'Build test sets from traces, compare prompt and model versions offline.', readTime: '12 min', component: DatasetsAndExperiments },
]

const productionLessons = [
  { id: 'analytics-and-dashboards', title: 'Analytics & Dashboards', description: 'Cost by model, latency percentiles, score trends, and metadata filters.', readTime: '8 min', component: AnalyticsAndDashboards },
  { id: 'playground-and-debugging', title: 'Playground & Debugging', description: 'Jump from a bad trace to the playground — reproduce and fix in minutes.', readTime: '10 min', component: PlaygroundAndDebugging },
  { id: 'integrations-and-deployment', title: 'Integrations & Deployment', description: 'LangChain, OpenTelemetry, OpenAI SDK — cloud vs self-hosted Docker.', readTime: '10 min', component: IntegrationsAndDeployment },
  { id: 'putting-it-together-langfuse', title: 'Putting It Together', description: 'Full lifecycle: build → trace → score → eval → experiment → deploy.', readTime: '10 min', component: PuttingItTogetherLangfuse },
]

export const langfuseSubTopic: SubTopic = {
  id: 'langfuse',
  title: 'Langfuse',
  description:
    'Observe, debug, and improve production LLM apps — tracing, prompt management, evaluation, datasets, analytics, and integrations with LangChain and LangGraph.',
  lessonSections: [
    { id: 'fundamentals', title: 'Fundamentals', lessons: fundamentalsLessons },
    { id: 'observability-and-tracing', title: 'Observability & Tracing', lessons: observabilityLessons },
    { id: 'prompts-and-evaluation', title: 'Prompts & Evaluation', lessons: promptsAndEvalLessons },
    { id: 'production', title: 'Production', lessons: productionLessons },
  ],
}
