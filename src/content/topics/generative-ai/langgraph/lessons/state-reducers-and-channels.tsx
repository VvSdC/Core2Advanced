import {
  Callout,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function StateReducersAndChannels() {
  return (
    <LessonArticle>
      <LessonSection title="What are reducers?">
        <p>
          When multiple nodes update the same state key, a <strong className="text-white">reducer</strong> defines
          how updates merge. Without a reducer, the last write wins. With a reducer, updates combine intelligently.
        </p>
      </LessonSection>

      <LessonSection title="add_messages — the most common reducer">
        <Example
          title="Messages auto-append instead of replace"
        >{`from typing import Annotated
from langgraph.graph.message import add_messages

class State(TypedDict):
    # New messages APPEND to the list — not replace
    messages: Annotated[list, add_messages]`}</Example>
        <p className="mt-3 text-slate-300">
          Node A returns <code className="font-mono text-sm">{'{"messages": [human_msg]}'}</code>. Node B returns{' '}
          <code className="font-mono text-sm">{'{"messages": [ai_msg]}'}</code>. Final state has{' '}
          <strong className="text-white">both</strong> messages in order — essential for conversation history.
        </p>
      </LessonSection>

      <LessonSection title="Custom reducers">
        <Example
          title="Sum reducer for counters"
        >{`def add_ints(existing: int, new: int) -> int:
    return existing + new

class State(TypedDict):
    total_tokens: Annotated[int, add_ints]`}</Example>
      </LessonSection>

      <LessonSection title="State channels compared">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Channel</th>
                <th className="px-4 py-3">Reducer</th>
                <th className="px-4 py-3">Use case</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['messages', 'add_messages', 'Conversation history'],
                ['retry_count', 'none (overwrite)', 'Loop counter'],
                ['plan_steps', 'custom append', 'Multi-step plan tracking'],
                ['errors', 'custom append', 'Collect failures across nodes'],
              ].map(([ch, red, use]) => (
                <tr key={ch} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-mono text-genai-400">{ch}</td>
                  <td className="px-4 py-3 text-slate-400">{red}</td>
                  <td className="px-4 py-3 text-slate-400">{use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <Callout variant="tip">
        Design state schema upfront — list every piece of data agents need to share, and pick the right reducer
        for each key.
      </Callout>

      <KeyTakeaways
        items={[
          'Reducers control how node updates merge into shared state.',
          'add_messages appends to conversation history — never use plain list for messages.',
          'Custom reducers for counters, plans, and error collections.',
        ]}
      />
    </LessonArticle>
  )
}
