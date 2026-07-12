import {
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function HierarchicalMultiAgent() {
  return (
    <LessonArticle>
      <LessonSection title="Manager + workers pattern">
        <p>
          A <strong className="text-white">manager agent</strong> decomposes the task, assigns subtasks to{' '}
          <strong className="text-white">worker agents</strong>, collects results, and synthesises the final output.
          Workers do not talk to each other directly.
        </p>
        <Flowchart
          title="Hierarchical architecture"
          chart={`flowchart TB
  User --> M[Manager Agent]
  M --> W1[Worker: Research]
  M --> W2[Worker: Code]
  M --> W3[Worker: Design]
  W1 --> M
  W2 --> M
  W3 --> M
  M --> Output`}
        />
      </LessonSection>

      <LessonSection title="Manager responsibilities">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>Break the user request into subtasks with clear deliverables.</li>
          <li>Assign each subtask to the right worker (by role or capability).</li>
          <li>Review worker output — request revisions if quality is insufficient.</li>
          <li>Combine results into a coherent final answer.</li>
        </ul>
      </LessonSection>

      <LessonSection title="LangGraph pattern">
        <p>
          Manager is a node with conditional edges to worker subgraphs. Each worker is either a separate node or a
          compiled subgraph. State carries <code className="font-mono text-sm">subtasks: list</code> and{' '}
          <code className="font-mono text-sm">completed: dict</code>. Manager loops until all subtasks are done.
        </p>
      </LessonSection>

      <LessonSection title="Examples">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">System</th>
                <th className="px-4 py-3">Manager</th>
                <th className="px-4 py-3">Workers</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['MetaGPT', 'Product Manager', 'Architect, Engineer, QA'],
                ['ChatDev', 'CEO / CTO', 'Programmer, Reviewer, Tester'],
                ['Software team', 'Tech Lead', 'Backend, Frontend, DevOps'],
              ].map(([sys, mgr, workers]) => (
                <tr key={sys} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{sys}</td>
                  <td className="px-4 py-3 text-slate-400">{mgr}</td>
                  <td className="px-4 py-3 text-slate-400">{workers}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Hierarchical: manager decomposes, assigns, reviews, and synthesises.',
          'Workers are specialists — no direct worker-to-worker communication.',
          'MetaGPT and ChatDev are canonical examples — see Research Papers.',
        ]}
      />
    </LessonArticle>
  )
}
