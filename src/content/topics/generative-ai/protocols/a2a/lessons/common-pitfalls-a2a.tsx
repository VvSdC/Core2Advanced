import {
  Callout,
  CodeBlock,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function CommonPitfallsA2a() {
  return (
    <LessonArticle>
      <Definition term="Common A2A pitfalls">
        <p>
          Most A2A failures are not exotic crypto bugs — they are{' '}
          <strong className="text-white">wrong abstractions</strong>: treating A2A like MCP, skipping discovery,
          ignoring lifecycle, or trusting any Agent Card on the internet.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: using a walkie-talkie channel plan as a power-tool manual. Both are useful; mix them up and
          you get noise, injury, or both.
        </p>
      </Definition>

      <Callout variant="beginner" title="Learn from others&apos; bruises">
        Skim this list before your first multi-vendor pilot. Each pitfall maps to a lesson you already saw.
      </Callout>

      <LessonSection title="Pitfall gallery">
        <ContentStep number={1} title="Using A2A instead of MCP for tools">
          <p className="text-slate-300">
            Calling a database through a fake &quot;DB agent&quot; adds latency and lifecycle ceremony for no
            autonomy benefit. Use MCP (or APIs) for tools.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Skipping Agent Cards">
          <p className="text-slate-300">
            Hard-coding peer URLs and guessing skills breaks when peers version. Discover cards; match skills.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Fire-and-forget without states">
          <p className="text-slate-300">
            Ignoring <span className="font-mono text-sm text-genai-400">working / failed</span> creates zombie
            jobs and angry users.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Stuffing everything into one text part">
          <p className="text-slate-300">
            IDs, files, and constraints buried in prose cause parse errors. Use structured data and file parts.
          </p>
        </ContentStep>
        <Flowchart
          title="Wrong vs right interface"
          chart={`flowchart TB
  Need[Need capability] --> Wrong{Fake everything as A2A?}
  Wrong -->|Yes| Pain[Latency + weak tool semantics]
  Wrong -->|No| Right{Agent or tool?}
  Right -->|Tool| MCP[MCP / API]
  Right -->|Agent| A2A[A2A card + task]`}
        />
      </LessonSection>

      <LessonSection title="Security and ops traps">
        <Example title="Hall of oops">
{`- Trusting unsigned public Agent Cards
- Minting god-mode tokens for every peer
- Streaming secrets in progress messages
- No cancel when user aborts
- Unlimited nested A2A hops (cost spiral)
- Pinning nothing — silent protocol drift`}
        </Example>
        <CodeBlock title="Guardrails checklist">
{`assert peer in approved_registry(card)
assert token.scopes <= least_privilege(peer.skills)
assert message.parts pass dlp_policy
assert hop_depth < MAX_HOPS
observe(task.id, states=["submitted","working","completed","failed"])
on_user_abort: a2a.cancel(task.id)`}
        </CodeBlock>
        <Callout variant="tip" title="Failed is a feature">
          Surface <strong className="text-white">failed</strong> with reasons. Silent retries without backoff
          can DDoS your own specialists.
        </Callout>
      </LessonSection>

      <LessonSection title="Product / UX traps">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Spinner forever</strong> — no streaming or progress mapping.
          </li>
          <li>
            <strong className="text-white">Leaking peer jargon</strong> — users should not see raw task dumps.
          </li>
          <li>
            <strong className="text-white">Over-delegation</strong> — hiring peers for trivia your local model
            handles.
          </li>
        </ul>
        <Flowchart
          title="Debug a stuck delegation"
          chart={`flowchart TB
  Stuck[Task seems stuck] --> Card{Card still accurate?}
  Card -->|No| Update[Refresh catalog / skills]
  Card -->|Yes| Auth{Auth / policy deny?}
  Auth -->|Yes| FixAuth[Fix identity / scopes]
  Auth -->|No| State{Check lifecycle state}
  State --> Working[Still working — wait / stream]
  State --> Failed[Failed — read error / retry policy]
  State --> Lost[Unknown — peer ops / trace id]`}
        />
      </LessonSection>

      <LessonSection title="Spec drift">
        <p className="text-slate-300">
          Tutorials (including this course) age. Fields rename; states expand. The pitfall is shipping parsers
          frozen to a blog sample. Bind to official A2A documentation and compatibility tests.
        </p>
        <Callout variant="insight" title="Concept over folklore">
          If you remember only cards, tasks, parts, streaming, and auth boundaries, you can re-learn wire
          details quickly when specs move.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Do not replace MCP with A2A for ordinary tools; use each for its job.',
          'Never skip cards, lifecycles, typed parts, cancel, or hop budgets.',
          'Secure the catalog, tokens, and streamed content — open protocol ≠ open trust.',
          'Avoid spec folklore; verify against current official A2A docs.',
        ]}
      />
    </LessonArticle>
  )
}
