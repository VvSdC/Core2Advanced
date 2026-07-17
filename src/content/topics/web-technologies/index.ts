import type { Topic } from '../../types'
import { createEmptySubTopic } from '../../create-empty-subtopic'
import { javascriptSubTopic } from './javascript'
import { typescriptSubTopic } from './typescript'

const reactJsSubTopic = createEmptySubTopic(
  'react-js',
  'React.js',
  'UI components, hooks, state, and building interactive frontends.',
)

const nodeJsSubTopic = createEmptySubTopic(
  'node-js',
  'Node.js',
  'JavaScript on the server — event loop, modules, and backend foundations.',
)

const expressJsSubTopic = createEmptySubTopic(
  'express-js',
  'Express.js',
  'HTTP APIs with Express — routing, middleware, and REST patterns.',
)

const flaskSubTopic = createEmptySubTopic(
  'flask',
  'Flask',
  'Lightweight Python web apps and APIs with Flask.',
)

const fastapiSubTopic = createEmptySubTopic(
  'fastapi',
  'FastAPI',
  'Modern Python APIs — typing, async, OpenAPI, and high-performance services.',
)

export const webTechnologiesTopic: Topic = {
  id: 'web-technologies',
  title: 'Web Technologies',
  description:
    'Frontend and backend web stack — JavaScript, TypeScript, React, Node, Express, Flask, and FastAPI.',
  accent: 'web',
  catalog: [
    { type: 'subTopic', subTopicId: 'javascript' },
    { type: 'subTopic', subTopicId: 'typescript' },
    { type: 'subTopic', subTopicId: 'react-js' },
    { type: 'subTopic', subTopicId: 'node-js' },
    { type: 'subTopic', subTopicId: 'express-js' },
    { type: 'subTopic', subTopicId: 'flask' },
    { type: 'subTopic', subTopicId: 'fastapi' },
  ],
  subTopics: [
    javascriptSubTopic,
    typescriptSubTopic,
    reactJsSubTopic,
    nodeJsSubTopic,
    expressJsSubTopic,
    flaskSubTopic,
    fastapiSubTopic,
  ],
}
