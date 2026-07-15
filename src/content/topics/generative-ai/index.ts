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

import { fineTuningSubTopic } from './fine-tuning'

import { reinforcementLearningSubTopic } from './reinforcement-learning'



export const generativeAiTopic: Topic = {

  id: 'generative-ai',

  title: 'Generative AI',

  description:

    'From model internals to RAG, model alignment (fine-tuning & RL), agents, observability, and inference optimization — build, specialize, align, deploy, and serve production LLM systems.',

  accent: 'genai',

  catalog: [

    { type: 'subTopic', subTopicId: 'fundamentals' },

    { type: 'subTopic', subTopicId: 'inference-parameters' },

    { type: 'subTopic', subTopicId: 'prompt-engineering' },

    { type: 'subTopic', subTopicId: 'rag' },

    {

      type: 'section',

      section: {

        id: 'model-alignment',

        title: 'Model Alignment',

        description:

          'Specialize and align open models — fine-tuning (SFT, LoRA, QLoRA, Unsloth) then reinforcement learning (RLHF, DPO, and related preference methods).',

        subTopicIds: ['fine-tuning', 'reinforcement-learning'],

      },

    },

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

    fineTuningSubTopic,

    reinforcementLearningSubTopic,

    langchainSubTopic,

    langgraphSubTopic,

    agentsSubTopic,

    langfuseSubTopic,

    langsmithSubTopic,

    vllmSubTopic,

    llamaCppSubTopic,

  ],

}
