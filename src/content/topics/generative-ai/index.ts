import type { Topic } from '../../types'

import { fundamentalsSubTopic } from './fundamentals'

import { inferenceParametersSubTopic } from './inference-parameters'

import { agentsSubTopic } from './agents'

import { langchainSubTopic } from './langchain'

import { langgraphSubTopic } from './langgraph'

import { promptEngineeringSubTopic } from './prompt-engineering'

import { ragSubTopic } from './rag'



export const generativeAiTopic: Topic = {

  id: 'generative-ai',

  title: 'Generative AI',

  description:

    'From model internals to RAG and LangChain — understand how language models work and how to build applications with them.',

  accent: 'genai',

  catalog: [

    { type: 'subTopic', subTopicId: 'fundamentals' },

    { type: 'subTopic', subTopicId: 'inference-parameters' },

    { type: 'subTopic', subTopicId: 'prompt-engineering' },

    { type: 'subTopic', subTopicId: 'rag' },

    { type: 'subTopic', subTopicId: 'langchain' },

    { type: 'subTopic', subTopicId: 'langgraph' },

    { type: 'subTopic', subTopicId: 'agents' },

  ],

  subTopics: [

    fundamentalsSubTopic,

    inferenceParametersSubTopic,

    promptEngineeringSubTopic,

    ragSubTopic,

    langchainSubTopic,

    langgraphSubTopic,

    agentsSubTopic,

  ],

}

