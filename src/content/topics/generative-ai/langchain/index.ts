import type { SubTopic } from '../../../types'
import { ChainsAndLcel } from './lessons/chains-and-lcel'
import { IntroductionToLangchain } from './lessons/introduction-to-langchain'
import { Memory } from './lessons/memory'
import { ModelsAndInference } from './lessons/models-and-inference'
import { OutputParsers } from './lessons/output-parsers'
import { PromptTemplates } from './lessons/prompt-templates'
import { PuttingItTogether } from './lessons/putting-it-together'
import { RagWithLangchain } from './lessons/rag-with-langchain'
import { ReactAgents } from './lessons/react-agents'
import { Tools } from './lessons/tools'
import { GorillaLlmApis } from './lessons/papers/gorilla-llm-apis'
import { HuggingGpt } from './lessons/papers/hugginggpt'
import { ReactLangchainAgents } from './lessons/papers/react-langchain-agents'
import { Toolformer } from './lessons/papers/toolformer'

const coreConceptLessons = [
  {
    id: 'introduction-to-langchain',
    title: 'Introduction to LangChain',
    description: 'What LangChain is, its component map, and how LCEL composes LLM pipelines.',
    readTime: '8 min',
    component: IntroductionToLangchain,
  },
  {
    id: 'prompt-templates',
    title: 'Prompt Templates',
    description: 'ChatPromptTemplate, variables, and reusable prompt skeletons.',
    readTime: '10 min',
    component: PromptTemplates,
  },
  {
    id: 'models-and-inference',
    title: 'Models & Inference',
    description: 'ChatOpenAI, streaming, temperature/top-p, and swapping providers.',
    readTime: '10 min',
    component: ModelsAndInference,
  },
  {
    id: 'chains-and-lcel',
    title: 'Chains & LCEL',
    description: 'The pipe operator, RunnableParallel, RunnablePassthrough, and composition.',
    readTime: '12 min',
    component: ChainsAndLcel,
  },
  {
    id: 'output-parsers',
    title: 'Output Parsers',
    description: 'StrOutputParser, JsonOutputParser, and Pydantic structured output.',
    readTime: '10 min',
    component: OutputParsers,
  },
  {
    id: 'memory',
    title: 'Memory',
    description: 'Conversation history — buffer, window, and summary memory types.',
    readTime: '10 min',
    component: Memory,
  },
  {
    id: 'rag-with-langchain',
    title: 'RAG with LangChain',
    description: 'Full RAG pipeline in code — loaders, splitters, embeddings, vector stores, retrievers.',
    readTime: '14 min',
    component: RagWithLangchain,
  },
  {
    id: 'tools',
    title: 'Tools',
    description: '@tool decorator, Pydantic schemas, and built-in community tools.',
    readTime: '10 min',
    component: Tools,
  },
  {
    id: 'react-agents',
    title: 'ReAct Agents',
    description: 'create_react_agent, AgentExecutor, and the Thought → Action → Observation loop.',
    readTime: '12 min',
    component: ReactAgents,
  },
  {
    id: 'putting-it-together',
    title: 'Putting It Together',
    description: 'Pattern selection, inference presets, and common mistakes.',
    readTime: '8 min',
    component: PuttingItTogether,
  },
]

const researchPaperLessons = [
  {
    id: 'react-langchain-agents',
    title: 'ReAct',
    description: 'Agents — the Thought → Action → Observation loop behind LangChain agents.',
    readTime: '12 min',
    component: ReactLangchainAgents,
  },
  {
    id: 'toolformer',
    title: 'Toolformer',
    description: 'Tools — LLMs that teach themselves when and how to call APIs.',
    readTime: '12 min',
    component: Toolformer,
  },
  {
    id: 'hugginggpt',
    title: 'HuggingGPT',
    description: 'Orchestration — LLM as controller dispatching tasks to expert models.',
    readTime: '10 min',
    component: HuggingGpt,
  },
  {
    id: 'gorilla-llm-apis',
    title: 'Gorilla',
    description: 'API calling — RAG over API docs for accurate function generation.',
    readTime: '10 min',
    component: GorillaLlmApis,
  },
]

export const langchainSubTopic: SubTopic = {
  id: 'langchain',
  title: 'LangChain',
  description:
    'Build LLM applications with LangChain — prompt templates, chains, RAG, tools, ReAct agents, and code snippets throughout.',
  lessonSections: [
    {
      id: 'core-concepts',
      title: 'Core Concepts',
      lessons: coreConceptLessons,
    },
    {
      id: 'research-papers',
      title: 'Research Papers',
      lessons: researchPaperLessons,
    },
  ],
}
