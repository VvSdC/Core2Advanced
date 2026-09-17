import {
  Callout,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function Memory() {
  return (
    <LessonArticle>
      <Definition term="Stateless memory">
        <p>
          An LLM API call has <strong className="text-white">no session</strong>. The model does not remember
          the previous turn, the user&apos;s name, or anything you said five seconds ago — unless you send that
          history again as part of the next request. <span className="text-genai-400">Stateless memory</span> is
          the pattern of storing conversation (and other state) <em>outside</em> the model, then injecting the
          right slice into each call.
        </p>
        <p className="mt-2 text-slate-300">
          The model is the CPU. Your store is the disk. Every request reloads what the CPU is allowed to see.
        </p>
      </Definition>

      <Callout variant="beginner" title="Why LangChain memory exists">
        By default, each <code className="font-mono text-sm">chain.invoke()</code> is one independent HTTP call.
        Memory in LangChain is not a special model feature — it is this load → inject → save loop, with helpers
        for buffers, windows, summaries, and retrieval over past turns.
      </Callout>

      <LessonSection title="The loop on every turn">
        <Flowchart
          title="Memory lives in your app, not in the model"
          chart={`flowchart LR
  U[User message] --> LOAD[Load history by session_id]
  LOAD --> PROMPT[Build messages: system + history + new turn]
  PROMPT --> LLM[Stateless LLM call]
  LLM --> SAVE[Append user + assistant turns]
  SAVE --> STORE[(Redis / Postgres / LangChain memory)]`}
        />
        <ContentStep number={1} title="Load">
          <p className="text-slate-300">
            Look up this conversation by <code className="font-mono text-sm">session_id</code> (and usually{' '}
            <code className="font-mono text-sm">user_id</code>). If nothing exists, start empty.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Inject">
          <p className="text-slate-300">
            Build the prompt the model actually sees: system instructions, then prior messages, then the new user
            turn. That array <em>is</em> the entire world for this call.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Save">
          <p className="text-slate-300">
            After the reply, append both the user message and the assistant message. The next request will load
            this updated list. If you forget to save, the model “forgets” even though your UI still shows the chat.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Where stateless memory is the right design">
        <p className="text-slate-300">
          Most production chat and agent backends should stay stateless at the model layer. You scale, isolate, and
          audit from the store — not from a process that happens to still be running.
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Multi-turn chat</strong> — support bots, copilots, any UI that looks
            like a conversation.
          </li>
          <li>
            <strong className="text-white">Serverless and many replicas</strong> — any instance can serve any
            request if history is in Redis or Postgres, not in local RAM.
          </li>
          <li>
            <strong className="text-white">User isolation and audit</strong> — history is keyed per session; you
            can redact, export, or delete it without touching model weights.
          </li>
          <li>
            <strong className="text-white">Short-to-medium sessions</strong> — the last N turns still fit in the
            context window (see <em>Context Windows &amp; the KV Cache</em>).
          </li>
        </ul>
        <Callout variant="insight" title="When this is not enough">
          Long agent jobs that must resume mid-graph (which node, which tool result) need{' '}
          <strong className="text-white">checkpointed state</strong> — LangGraph persistence, covered later — not
          only a chat transcript. Hierarchical “OS-style” memory (MemGPT) is for histories far larger than the
          context window. Do not confuse either with the KV cache: that is inference speed inside one request, not
          conversation memory across requests.
        </Callout>
      </LessonSection>

      <LessonSection title="How to implement it">
        <p className="text-slate-300">
          You can do this with a few dozen lines and a key-value store. LangChain&apos;s memory classes are the same
          idea with extra policies for how much history to inject.
        </p>
        <Example title="Framework-agnostic: store, load, inject, save">{`# messages table: session_id, role, content, created_at
def reply(session_id: str, user_text: str) -> str:
    history = db.load_messages(session_id)          # prior turns only
    messages = [{"role": "system", "content": SYSTEM}] + history
    messages.append({"role": "user", "content": user_text})

    answer = llm.chat(messages)                     # stateless HTTP call

    db.append(session_id, "user", user_text)
    db.append(session_id, "assistant", answer)
    return answer`}</Example>
        <p className="mt-4 text-slate-300">
          As the chat grows, you cannot keep stuffing every turn into the prompt. Pick a policy:
        </p>
        <div className="mt-3 overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Policy</th>
                <th className="px-4 py-3">What you inject</th>
                <th className="px-4 py-3">Use when</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Full buffer', 'Every message', 'Short chats, debugging'],
                ['Window', 'Last K turns', 'Most production chat — cheap and predictable'],
                ['Summary + tail', 'A running summary of old turns + recent raw turns', 'Long sessions that must keep the gist'],
                ['Retrieve', 'Only past turns similar to the current question', 'Large histories that jump topics'],
              ].map(([policy, inject, when]) => (
                <tr key={policy}>
                  <td className="px-4 py-3 font-semibold text-white">{policy}</td>
                  <td className="px-4 py-3 text-slate-400">{inject}</td>
                  <td className="px-4 py-3 text-slate-400">{when}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip" title="Hardening the store">
          Never mix two users&apos; sessions. Encrypt or redact secrets before they land in history. Cap list
          length so a runaway session cannot blow the context window or your bill.
        </Callout>
      </LessonSection>

      <LessonSection title="ConversationBufferMemory">
        <p className="text-slate-300">
          LangChain&apos;s buffer is the full-history policy: save after each turn, inject everything on the next{' '}
          <code className="font-mono text-sm">invoke</code> via a <code className="font-mono text-sm">MessagesPlaceholder</code>.
        </p>
        <Example title="Store full conversation history">{`from langchain.memory import ConversationBufferMemory
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

      <LessonSection title="LangChain memory types">
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
        <Example title="Keep only the last 5 exchanges">{`from langchain.memory import ConversationBufferWindowMemory

memory = ConversationBufferWindowMemory(
    k=5,                # last 5 turn pairs
    return_messages=True,
)`}</Example>
      </LessonSection>

      <Callout variant="tip">
        For production chatbots, prefer <strong className="text-white">window memory</strong> (k=5–10) or{' '}
        <strong className="text-white">summary memory</strong> to avoid exceeding the context window. Persist the
        store (Redis, Postgres) so replicas share the same session. LangGraph checkpointing is the next step when
        you need to resume a multi-step agent, not only a chat log.
      </Callout>

      <KeyTakeaways
        items={[
          'The model is stateless: it only sees what you put in this request. Memory is your store plus inject-on-every-turn.',
          'Use that pattern for multi-turn chat, serverless scale, and per-user isolation — not as a substitute for graph checkpoints or the KV cache.',
          'Implement load → inject → complete → save; then cap history with a window, a summary, or retrieval.',
          'LangChain buffer / window / summary / vector memory are policies on top of the same loop. MessagesPlaceholder injects history into the prompt.',
        ]}
      />
    </LessonArticle>
  )
}
