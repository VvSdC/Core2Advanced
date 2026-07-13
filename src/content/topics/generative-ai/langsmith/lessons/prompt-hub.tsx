import {
  Callout,
  ContentStep,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function PromptHub() {
  return (
    <LessonArticle>
      <LessonSection title="What is Prompt Hub?">
        <p className="text-slate-300">
          <strong className="text-white">Prompt Hub</strong> is LangSmith's central store for prompts. Instead of
          editing Python strings and redeploying, you version prompts in the UI and pull them into LangChain at
          runtime — the same idea as prompt templates, but managed outside your codebase.
        </p>
        <Callout variant="insight">
          If you already know <em>Prompt Engineering</em> techniques (few-shot, chain-of-thought, system roles)
          and <em>LangChain → Prompt Templates</em> (<code className="font-mono text-sm">ChatPromptTemplate</code>),
          Prompt Hub is where those prompts live in production — versioned, labeled, and linked to traces.
        </Callout>
      </LessonSection>

      <LessonSection title="Pull a prompt into LangChain">
        <p className="text-slate-300">
          Publish a prompt in LangSmith under your org (e.g. <code className="font-mono text-sm">my-team/support-rag</code>).
          In code, pull it with one line:
        </p>
        <Example title="Pull from Prompt Hub">{`from langchain import hub

# Pull latest version (or pin with a commit hash)
prompt = hub.pull("my-team/support-rag")

# Use like any LangChain prompt template
chain = prompt | llm
answer = chain.invoke({"context": chunks, "question": user_query})`}</Example>
        <Callout variant="tip">
          The pulled object is a LangChain prompt template — compatible with LCEL chains you built in the{' '}
          <em>LangChain</em> lessons. Variables like <code className="font-mono text-sm">{'{{context}}'}</code> and{' '}
          <code className="font-mono text-sm">{'{{question}}'}</code> work the same way.
        </Callout>
      </LessonSection>

      <LessonSection title="Version prompts in the LangSmith UI">
        <ContentStep number={1} title="Create and edit in the dashboard">
          <p>
            Go to <strong className="text-white">Prompts</strong> in LangSmith. Paste your system and user messages
            with placeholders. Each save creates a new version (v1, v2, v3…).
          </p>
        </ContentStep>
        <ContentStep number={2} title="Write commit messages">
          <p>
            Treat each version like a Git commit — add a short message:{' '}
            <em>"Added citation requirement"</em> or <em>"Fixed hallucination on empty context"</em>. Your team
            can see what changed and why without digging through code diffs.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Pin a version in code">
          <p>
            Pull latest for dev; pin a specific commit hash in production so deploys are predictable:{' '}
            <code className="font-mono text-sm">hub.pull("my-team/support-rag:abc123")</code>. Flip to a new hash
            after experiments pass — no app redeploy needed.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Why Hub beats hard-coded strings">
        <div className="mt-4 space-y-3">
          {[
            ['Trace linking', 'Every run shows which prompt version produced the answer — essential for debugging.'],
            ['Safe rollback', 'Bad v4? Pin back to v3 in the UI or code in seconds.'],
            ['Team collaboration', 'PMs and domain experts edit prompts without touching the repo.'],
          ].map(([title, detail]) => (
            <div key={title} className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
              <p className="text-sm font-semibold text-white">{title}</p>
              <p className="mt-1 text-sm text-slate-400">{detail}</p>
            </div>
          ))}
        </div>
      </LessonSection>

      <Callout variant="beginner" title="Connect to prior lessons">
        Design prompts with <em>Prompt Engineering</em> (techniques, system roles, few-shot examples). Structure
        them with <em>LangChain → Prompt Templates</em>. Store and version them in Prompt Hub. Test changes in the
        Playground and Datasets lessons before promoting to production.
      </Callout>

      <KeyTakeaways
        items={[
          'Prompt Hub = versioned prompt store; pull into LangChain with hub.pull("owner/prompt-name").',
          'Version each edit in the UI with commit messages — like Git for prompts.',
          'Pin commit hashes in production; roll back without redeploying application code.',
          'Builds on Prompt Engineering techniques and LangChain prompt templates.',
        ]}
      />
    </LessonArticle>
  )
}
