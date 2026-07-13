import type { SubTopic } from '../../../types'

import { AnnotationQueuesAndFeedback } from './lessons/annotation-queues-and-feedback'
import { DatasetsAndExperiments } from './lessons/datasets-and-experiments'
import { EvaluatorsAndLlmAsJudge } from './lessons/evaluators-and-llm-as-judge'
import { FilteringAndDebuggingTraces } from './lessons/filtering-and-debugging-traces'
import { IntroductionToLangsmith } from './lessons/introduction-to-langsmith'
import { LangsmithDataModel } from './lessons/langsmith-data-model'
import { LangsmithVsLangfuse } from './lessons/langsmith-vs-langfuse'
import { MonitoringAndDeployment } from './lessons/monitoring-and-deployment'
import { OnlineEvaluations } from './lessons/online-evaluations'
import { PlaygroundAndPromptTesting } from './lessons/playground-and-prompt-testing'
import { PromptHub } from './lessons/prompt-hub'
import { PuttingItTogetherLangsmith } from './lessons/putting-it-together-langsmith'
import { SetupAndTracing } from './lessons/setup-and-tracing'
import { TraceableDecoratorAndCustomCode } from './lessons/traceable-decorator-and-custom-code'
import { TracingLangchainApps } from './lessons/tracing-langchain-apps'
import { TracingLanggraphWorkflows } from './lessons/tracing-langgraph-workflows'

const fundamentalsLessons = [
  { id: 'introduction-to-langsmith', title: 'Introduction to LangSmith', description: 'What LangSmith is, why it is required for LangChain/LangGraph apps, and six platform capabilities.', readTime: '10 min', component: IntroductionToLangsmith },
  { id: 'langsmith-vs-langfuse', title: 'LangSmith vs Langfuse', description: 'When to use each — LangChain-native vs open-source, self-hosting, and pricing.', readTime: '8 min', component: LangsmithVsLangfuse },
  { id: 'langsmith-data-model', title: 'Projects, Runs & Traces', description: 'Projects, traces, runs, child runs, and feedback scores — the LangSmith data model.', readTime: '10 min', component: LangsmithDataModel },
]

const observabilityLessons = [
  { id: 'setup-and-tracing', title: 'Setup & First Trace', description: 'LANGSMITH_TRACING, API key, project name — your first trace with zero code changes.', readTime: '10 min', component: SetupAndTracing },
  { id: 'tracing-langchain-apps', title: 'Tracing LangChain Apps', description: 'Automatic tracing for LCEL chains, RAG pipelines, and AgentExecutor.', readTime: '12 min', component: TracingLangchainApps },
  { id: 'tracing-langgraph-workflows', title: 'Tracing LangGraph Workflows', description: 'Each graph node as a run — debug supervisor routing and agent loops.', readTime: '12 min', component: TracingLanggraphWorkflows },
  { id: 'traceable-decorator-and-custom-code', title: '@traceable & Custom Code', description: 'Instrument non-LangChain Python with @traceable and OpenAI wrappers.', readTime: '10 min', component: TraceableDecoratorAndCustomCode },
  { id: 'filtering-and-debugging-traces', title: 'Filtering & Debugging Traces', description: 'Filter by error, latency, tags — find bad runs and inspect the run tree.', readTime: '10 min', component: FilteringAndDebuggingTraces },
]

const evaluationLessons = [
  { id: 'prompt-hub', title: 'Prompt Hub', description: 'Version prompts in LangSmith, pull from hub in LangChain code, commit history.', readTime: '10 min', component: PromptHub },
  { id: 'datasets-and-experiments', title: 'Datasets & Experiments', description: 'Create test sets from traces, run experiments, compare chain versions.', readTime: '12 min', component: DatasetsAndExperiments },
  { id: 'evaluators-and-llm-as-judge', title: 'Evaluators & LLM-as-a-Judge', description: 'Built-in templates, custom evaluators, faithfulness and relevancy scoring.', readTime: '12 min', component: EvaluatorsAndLlmAsJudge },
  { id: 'annotation-queues-and-feedback', title: 'Annotation Queues & Feedback', description: 'Human review queues, run.feedback() API, QA team workflows.', readTime: '10 min', component: AnnotationQueuesAndFeedback },
]

const productionLessons = [
  { id: 'playground-and-prompt-testing', title: 'Playground & Prompt Testing', description: 'Test prompts on dataset rows in UI — compare models without redeploying.', readTime: '10 min', component: PlaygroundAndPromptTesting },
  { id: 'online-evaluations', title: 'Online Evaluations', description: 'Auto-score production traces — sampling rules and drift detection.', readTime: '10 min', component: OnlineEvaluations },
  { id: 'monitoring-and-deployment', title: 'Monitoring & Deployment', description: 'Dashboards, cost tracking, LangGraph Platform deployment integration.', readTime: '10 min', component: MonitoringAndDeployment },
  { id: 'putting-it-together-langsmith', title: 'Putting It Together', description: 'Full LangChain stack lifecycle — build, trace, eval, deploy, monitor.', readTime: '10 min', component: PuttingItTogetherLangsmith },
]

export const langsmithSubTopic: SubTopic = {
  id: 'langsmith',
  title: 'LangSmith',
  description:
    'LangChain\'s native observability platform — automatic tracing, Prompt Hub, datasets, evaluators, online monitoring, and the full agent engineering loop.',
  lessonSections: [
    { id: 'fundamentals', title: 'Fundamentals', lessons: fundamentalsLessons },
    { id: 'observability-and-tracing', title: 'Observability & Tracing', lessons: observabilityLessons },
    { id: 'evaluation', title: 'Evaluation & Prompts', lessons: evaluationLessons },
    { id: 'production', title: 'Production', lessons: productionLessons },
  ],
}
