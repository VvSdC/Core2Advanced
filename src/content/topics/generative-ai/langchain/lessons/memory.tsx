import {
  Callout,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function Memory() {
  return (
    <LessonArticle>
      <LessonSection title="Why memory?">
        <p>
          By default, each <code className="font-mono text-sm">chain.invoke()</code> call is stateless — the model
          sees only the current input. <strong className="text-white">Memory</strong> persists conversation history
          across turns so the model can reference earlier messages.
        </p>
        <Flowchart
          title="Memory in a conversation"
          chart={`flowchart LR
  T1["Turn 1: Hi, I'm Alice"] --> M[Memory buffer]
  T2["Turn 2: What's my name?"] --> M
  M --> P[Prompt with full history]
  P --> LLM[Model]
  LLM --> R["Response: Your name is Alice"]`}
        />
      </LessonSection>

      <LessonSection title="ConversationBufferMemory">
        <Example
          title="Store full conversation history"
        >{`from langchain.memory import ConversationBufferMemory
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder

memory = ConversationBufferMemory(return_messages=True)

prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a friendly assistant."),
    MessagesPlaceholder(variable_name="history"),
    ("human", "{input}"),
])

chain = prompt | llm

# Turn 1
memory.save_context(
    {"input": "Hi, I'm Alice"},
    {"output": "Hello Alice! How can I help?"},
)

# Turn 2 — memory injects prior messages
history = memory.load_memory_variables({})
result = chain.invoke({
    "input": "What's my name?",
    "history": history["history"],
})
# "Your name is Alice!"`}</Example>
      </LessonSection>

      <LessonSection title="Memory types">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Behaviour</th>
                <th className="px-4 py-3">Best for</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['ConversationBufferMemory', 'Stores every message verbatim', 'Short conversations'],
                ['ConversationBufferWindowMemory', 'Keeps only last K turns', 'Long chats — prevents context overflow'],
                ['ConversationSummaryMemory', 'LLM summarises old turns', 'Very long sessions — saves tokens'],
                ['VectorStoreRetrieverMemory', 'Retrieves relevant past messages by similarity', 'Large histories with topical jumps'],
              ].map(([type, behaviour, best]) => (
                <tr key={type} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-mono text-xs text-genai-400">{type}</td>
                  <td className="px-4 py-3 text-slate-400">{behaviour}</td>
                  <td className="px-4 py-3 text-slate-400">{best}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Window memory — most common in production">
        <Example
          title="Keep only the last 5 exchanges"
        >{`from langchain.memory import ConversationBufferWindowMemory

memory = ConversationBufferWindowMemory(
    k=5,                # last 5 turn pairs
    return_messages=True,
)`}</Example>
      </LessonSection>

      <Callout variant="tip">
        For production chatbots, prefer <strong className="text-white">window memory</strong> (k=5–10) or{' '}
        <strong className="text-white">summary memory</strong> to avoid exceeding the context window. LangGraph
        (advanced) offers more flexible state management for complex agent conversations.
      </Callout>

      <KeyTakeaways
        items={[
          'Memory persists conversation history across chain invocations.',
          'MessagesPlaceholder injects history into the prompt template.',
          'Buffer = all messages; Window = last K turns; Summary = LLM-compressed history.',
          'Watch context window limits — unbounded memory will overflow on long chats.',
        ]}
      />
    </LessonArticle>
  )
}
