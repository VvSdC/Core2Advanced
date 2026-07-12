import {
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function PersistenceAndCheckpointing() {
  return (
    <LessonArticle>
      <LessonSection title="What is checkpointing?">
        <p>
          A <strong className="text-white">checkpointer</strong> saves the full graph state after every node
          execution. You can resume from any checkpoint — survive crashes, implement human-in-the-loop, or
          replay past decisions.
        </p>
      </LessonSection>

      <LessonSection title="Checkpointer options">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Checkpointer</th>
                <th className="px-4 py-3">Storage</th>
                <th className="px-4 py-3">Best for</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['MemorySaver', 'In-memory dict', 'Development and tests'],
                ['SqliteSaver', 'Local SQLite file', 'Single-server production'],
                ['PostgresSaver', 'PostgreSQL', 'Multi-user production, LangGraph Platform'],
              ].map(([cp, storage, best]) => (
                <tr key={cp} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-mono text-genai-400">{cp}</td>
                  <td className="px-4 py-3 text-slate-400">{storage}</td>
                  <td className="px-4 py-3 text-slate-400">{best}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Thread IDs — one conversation per thread">
        <Example
          title="Checkpointing with thread_id"
        >{`from langgraph.checkpoint.memory import MemorySaver

memory = MemorySaver()
app = graph.compile(checkpointer=memory)

# Each user session gets a unique thread_id
config = {"configurable": {"thread_id": "user-42-chat-1"}}

# Turn 1
app.invoke({"messages": [("human", "Hi")]}, config)

# Turn 2 — same thread_id loads previous state automatically
app.invoke({"messages": [("human", "What did I just say?")]}, config)
# Agent remembers "Hi" from checkpoint`}</Example>
      </LessonSection>

      <LessonSection title="Time travel debugging">
        <p>
          <code className="font-mono text-sm">get_state_history(config)</code> returns every checkpoint in order.
          You can inspect what the agent was thinking at step 3, or fork from an earlier checkpoint to try a
          different path — invaluable for debugging agent loops.
        </p>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Checkpointers save state after every node — Memory, SQLite, or Postgres.',
          'thread_id identifies a conversation — same ID resumes prior state.',
          'State history enables time-travel debugging and human-in-the-loop resumes.',
        ]}
      />
    </LessonArticle>
  )
}
