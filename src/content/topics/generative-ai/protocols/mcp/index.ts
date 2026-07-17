import type { SubTopic } from '../../../../types'

import { BuildingYourFirstMcpServer } from './lessons/building-your-first-mcp-server'
import { CapabilityNegotiation } from './lessons/capability-negotiation'
import { CommonPitfallsMcp } from './lessons/common-pitfalls-mcp'
import { ConnectingClientsAndHosts } from './lessons/connecting-clients-and-hosts'
import { HostsClientsServers } from './lessons/hosts-clients-servers'
import { JsonRpcMessageModel } from './lessons/json-rpc-message-model'
import { McpAndA2aTogether } from './lessons/mcp-and-a2a-together'
import { McpInAgentFrameworks } from './lessons/mcp-in-agent-frameworks'
import { McpVsFunctionCalling } from './lessons/mcp-vs-function-calling'
import { MultiServerArchitectures } from './lessons/multi-server-architectures'
import { ProductionMcpPatterns } from './lessons/production-mcp-patterns'
import { PuttingItTogetherMcp } from './lessons/putting-it-together-mcp'
import { SamplingRootsAndContext } from './lessons/sampling-roots-and-context'
import { SecurityAuthAndPermissions } from './lessons/security-auth-and-permissions'
import { ToolsResourcesPrompts } from './lessons/tools-resources-prompts'
import { TransportsStdioHttp } from './lessons/transports-stdio-http'
import { WhatIsMcp } from './lessons/what-is-mcp'
import { WhyAiProtocols } from './lessons/why-ai-protocols'

const foundationsLessons = [
  {
    id: 'what-is-mcp',
    title: 'What Is MCP?',
    description: 'Model Context Protocol — the USB-C of AI tools, data, and prompts.',
    readTime: '12 min',
    component: WhatIsMcp,
  },
  {
    id: 'why-ai-protocols',
    title: 'Why AI Protocols Exist',
    description: 'The N×M integration mess — why standards beat one-off tool wiring.',
    readTime: '12 min',
    component: WhyAiProtocols,
  },
  {
    id: 'mcp-vs-function-calling',
    title: 'MCP vs Function Calling',
    description: 'Built-in tool schemas vs reusable MCP servers any host can plug into.',
    readTime: '14 min',
    component: McpVsFunctionCalling,
  },
  {
    id: 'hosts-clients-servers',
    title: 'Hosts, Clients & Servers',
    description: 'Who talks to whom — Host, Client, and Server roles mapped clearly.',
    readTime: '12 min',
    component: HostsClientsServers,
  },
]

const coreLessons = [
  {
    id: 'tools-resources-prompts',
    title: 'Tools, Resources & Prompts',
    description: 'The three MCP primitives — actions, readable context, and reusable prompt templates.',
    readTime: '14 min',
    component: ToolsResourcesPrompts,
  },
  {
    id: 'json-rpc-message-model',
    title: 'JSON-RPC Message Model',
    description: 'Requests, responses, and notifications — how MCP messages look on the wire.',
    readTime: '14 min',
    component: JsonRpcMessageModel,
  },
  {
    id: 'transports-stdio-http',
    title: 'Transports: stdio & HTTP',
    description: 'Local process pipes vs remote Streamable HTTP / SSE-style transports.',
    readTime: '14 min',
    component: TransportsStdioHttp,
  },
  {
    id: 'capability-negotiation',
    title: 'Capability Negotiation',
    description: 'Initialize handshake — advertise what client and server can do.',
    readTime: '12 min',
    component: CapabilityNegotiation,
  },
]

const buildingLessons = [
  {
    id: 'building-your-first-mcp-server',
    title: 'Building Your First MCP Server',
    description: 'Minimal tool server walkthrough — from zero to a callable tool.',
    readTime: '16 min',
    component: BuildingYourFirstMcpServer,
  },
  {
    id: 'connecting-clients-and-hosts',
    title: 'Connecting Clients & Hosts',
    description: 'Wire a server into Claude Desktop, Cursor-style hosts, and agent apps.',
    readTime: '14 min',
    component: ConnectingClientsAndHosts,
  },
  {
    id: 'sampling-roots-and-context',
    title: 'Sampling, Roots & Context',
    description: 'Advanced primitives — when servers ask models, and how roots scope filesystem context.',
    readTime: '14 min',
    component: SamplingRootsAndContext,
  },
  {
    id: 'security-auth-and-permissions',
    title: 'Security, Auth & Permissions',
    description: 'Least privilege, auth, and why open tool servers are dangerous by default.',
    readTime: '14 min',
    component: SecurityAuthAndPermissions,
  },
]

const advancedLessons = [
  {
    id: 'multi-server-architectures',
    title: 'Multi-Server Architectures',
    description: 'Compose many MCP servers — gateways, routing, and failure isolation.',
    readTime: '14 min',
    component: MultiServerArchitectures,
  },
  {
    id: 'mcp-in-agent-frameworks',
    title: 'MCP in Agent Frameworks',
    description: 'Use MCP tools from LangChain, LangGraph, and custom agents.',
    readTime: '14 min',
    component: McpInAgentFrameworks,
  },
  {
    id: 'production-mcp-patterns',
    title: 'Production MCP Patterns',
    description: 'Versioning, observability, tool gating, and safe rollout.',
    readTime: '14 min',
    component: ProductionMcpPatterns,
  },
  {
    id: 'mcp-and-a2a-together',
    title: 'MCP and A2A Together',
    description: 'Layered stack — A2A between agents, MCP for each agent’s tools.',
    readTime: '12 min',
    component: McpAndA2aTogether,
  },
  {
    id: 'common-pitfalls-mcp',
    title: 'Common Pitfalls',
    description: 'Schema drift, over-privileged tools, transport mistakes — debugging guide.',
    readTime: '12 min',
    component: CommonPitfallsMcp,
  },
  {
    id: 'putting-it-together-mcp',
    title: 'Putting It Together',
    description: 'Mastery checklist — then continue to the A2A track for agent-to-agent.',
    readTime: '12 min',
    component: PuttingItTogetherMcp,
  },
]

export const mcpSubTopic: SubTopic = {
  id: 'mcp',
  title: 'MCP',
  description:
    'Model Context Protocol from absolute zero to production — hosts/clients/servers, tools/resources/prompts, transports, security, and how MCP pairs with A2A.',
  lessonTracks: [
    {
      id: 'foundations',
      title: 'Foundations',
      sections: [{ id: 'foundations-lessons', title: 'Lessons', lessons: foundationsLessons }],
    },
    {
      id: 'core',
      title: 'Core Protocol',
      sections: [{ id: 'core-lessons', title: 'Lessons', lessons: coreLessons }],
    },
    {
      id: 'building',
      title: 'Building with MCP',
      sections: [{ id: 'building-lessons', title: 'Lessons', lessons: buildingLessons }],
    },
    {
      id: 'advanced',
      title: 'Advanced & Production',
      sections: [{ id: 'advanced-lessons', title: 'Lessons', lessons: advancedLessons }],
    },
  ],
}
