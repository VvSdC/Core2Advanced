import {
  Callout,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
  ResearchPaperHeader,
} from '../../../../../../components/content'

const PAPER_URL = 'https://arxiv.org/abs/2304.03442'

export function GenerativeAgentsPaper() {
  return (
    <LessonArticle>
      <ResearchPaperHeader
        title="Generative Agents: Interactive Simulacra of Human Behavior"
        authors="Park et al. (Stanford)"
        year="2023"
        url={PAPER_URL}
      >
        LLM agents with <strong className="text-white">memory, reflection, and planning</strong> that behave
        believably in a simulated town — foundational work on long-horizon agent behaviour.
      </ResearchPaperHeader>

      <Callout variant="beginner" title="Read this after">
        Complete <em>Introduction to Agents</em> and <em>Collaborative Multi-Agent</em>. This paper shows
        why agents need memory and reflection, not just tool loops.
      </Callout>

      <LessonSection title="Core architecture">
        <Flowchart
          title="Generative Agent memory stream"
          chart={`flowchart TB
  Obs[Observation] --> MS[Memory Stream]
  MS --> R[Retrieve relevant memories]
  R --> P[Plan next action]
  P --> Rf[Reflect on patterns]
  Rf --> MS
  P --> Act[Act / speak]`}
        />
        <p className="mt-4 text-slate-300">
          Each agent maintains a <strong className="text-white">memory stream</strong> of observations.
          Before acting, it retrieves relevant memories, plans, and periodically reflects to form higher-level
          insights — similar to LangGraph checkpointing + a reflection node.
        </p>
      </LessonSection>

      <LessonSection title="Connection to agent architectures">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Paper concept</th>
                <th className="px-4 py-3">Maps to</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Memory stream', 'LangGraph checkpointer + vector store for long-term memory'],
                ['Reflection node', 'Reflexion pattern — verbal self-critique after failure'],
                ['Planning', 'Plan-and-Execute architecture'],
                ['Multi-agent town', 'Collaborative / role-play multi-agent'],
              ].map(([concept, maps]) => (
                <tr key={concept} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{concept}</td>
                  <td className="px-4 py-3 text-slate-400">{maps}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Agents need memory streams and periodic reflection — not just ReAct loops.',
          'Retrieval over past observations grounds long-horizon behaviour.',
          'Inspiration for MemGPT and LangGraph checkpointing patterns.',
        ]}
      />
    </LessonArticle>
  )
}
