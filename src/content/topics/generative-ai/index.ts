import type { Topic } from '../../types'

import { fundamentalsSubTopic } from './fundamentals'

import { inferenceParametersSubTopic } from './inference-parameters'

import { vllmSubTopic } from './inference-optimization/vllm'

import { llamaCppSubTopic } from './inference-optimization/llama-cpp'

import { agentsSubTopic } from './agents'

import { langchainSubTopic } from './langchain'

import { langfuseSubTopic } from './langfuse'

import { langgraphSubTopic } from './langgraph'

import { langsmithSubTopic } from './langsmith'

import { promptEngineeringSubTopic } from './prompt-engineering'

import { ragSubTopic } from './rag'



export const generativeAiTopic: Topic = {

  id: 'generative-ai',

  title: 'Generative AI',

  description:

    'From model internals to RAG, agents, observability, and inference optimization (vLLM, llama.cpp) — build, deploy, serve, and optimize production LLM systems.',

  accent: 'genai',

  catalog: [

    { type: 'subTopic', subTopicId: 'fundamentals' },

    { type: 'subTopic', subTopicId: 'inference-parameters' },

    { type: 'subTopic', subTopicId: 'prompt-engineering' },

    { type: 'subTopic', subTopicId: 'rag' },

    { type: 'subTopic', subTopicId: 'langchain' },

    { type: 'subTopic', subTopicId: 'langgraph' },

    { type: 'subTopic', subTopicId: 'agents' },

    { type: 'subTopic', subTopicId: 'langfuse' },

    { type: 'subTopic', subTopicId: 'langsmith' },

    {

      type: 'section',

      section: {

        id: 'inference-optimization',

        title: 'Inference Optimization',

        description:

          'Serve open-weight LLMs fast and cheap — datacenter GPU serving with vLLM and local/edge inference with llama.cpp.',

        subTopicIds: ['vllm', 'llama-cpp'],

      },

    },

  ],

  subTopics: [

    fundamentalsSubTopic,

    inferenceParametersSubTopic,

    promptEngineeringSubTopic,

    ragSubTopic,

    langchainSubTopic,

    langgraphSubTopic,

    agentsSubTopic,

    langfuseSubTopic,

    langsmithSubTopic,

    vllmSubTopic,

    llamaCppSubTopic,

  ],

}

