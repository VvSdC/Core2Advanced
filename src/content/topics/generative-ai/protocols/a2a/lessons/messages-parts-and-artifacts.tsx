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

export function MessagesPartsAndArtifacts() {
  return (
    <LessonArticle>
      <Definition term="Messages, parts, and artifacts">
        <p>
          In A2A, agents exchange <strong className="text-white">messages</strong> made of{' '}
          <strong className="text-white">parts</strong> — chunks that may be text, files, or structured data.
          When a task finishes, results often appear as <strong className="text-white">artifacts</strong>{' '}
          (durable outputs the client can store or pass along).
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: an email with a body, attachments, and a calendar invite JSON — one message, multiple part
          types. The final signed PDF is the artifact you file away.
        </p>
      </Definition>

      <Callout variant="beginner" title="Parts keep modalities honest">
        Not everything is a string. Files and structured data travel as typed parts so peers know how to parse
        them.
      </Callout>

      <LessonSection title="Common part kinds (conceptual)">
        <ContentStep number={1} title="Text parts">
          <p className="text-slate-300">
            Instructions, questions, intermediate reasoning summaries shared with the peer.
          </p>
        </ContentStep>
        <ContentStep number={2} title="File parts">
          <p className="text-slate-300">
            PDFs, images, code zips — often by URI or inline bytes depending on transport and size policy.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Structured data parts">
          <p className="text-slate-300">
            JSON-like payloads: forms, scores, booking records — machine-friendly without regexing prose.
          </p>
        </ContentStep>
        <Flowchart
          title="Message composition"
          chart={`flowchart TB
  M[Message] --> T[Text part]
  M --> F[File part]
  M --> D[Data / structured part]
  M --> Task[Attached to A2A task]
  Task --> Art[Artifacts on completion]`}
        />
      </LessonSection>

      <LessonSection title="Illustrative payload">
        <CodeBlock title="Conceptual message (not a locked schema)">
{`message = {
  "role": "user",  # client → peer
  "parts": [
    {"kind": "text", "text": "Extract risks from the attached report"},
    {"kind": "file", "uri": "https://files.example/q3.pdf", "mime": "application/pdf"},
    {"kind": "data", "mime": "application/json", "data": {"max_risks": 5}}
  ]
}`}
        </CodeBlock>
        <Callout variant="info" title="Schema caution">
          Exact property names (<span className="font-mono text-sm text-genai-400">kind</span> vs{' '}
          <span className="font-mono text-sm text-genai-400">type</span>, etc.) follow the live A2A spec —
          validate against official docs.
        </Callout>
      </LessonSection>

      <LessonSection title="Artifacts vs intermediate messages">
        <Example title="Research task timeline">
{`working: message "Scanning section 2…"
working: message "Found 3 candidate risks"
completed: artifact risks.json + summary text
Client stores artifacts; may discard noisy mid-status text.`}
        </Example>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Messages</strong> — conversation and progress along the task.
          </li>
          <li>
            <strong className="text-white">Artifacts</strong> — outputs meant to survive after completion
            (reports, tickets, structured results).
          </li>
        </ul>
      </LessonSection>

      <LessonSection title="Design tips for beginners">
        <ContentStep number={1} title="Prefer structured data for contracts">
          <p className="text-slate-300">
            If the client must parse a booking ID, send a data part — do not bury it in a poem of prose.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Respect peer modalities">
          <p className="text-slate-300">
            Agent Cards advertise what they accept. Sending a 2GB video to a text-only peer is a self-inflicted{' '}
            <span className="font-mono text-sm text-genai-400">failed</span> task.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Mind size and privacy">
          <p className="text-slate-300">
            Large files and PII need URIs with auth, retention rules, and redaction — protocol parts do not erase
            compliance.
          </p>
        </ContentStep>
        <Flowchart
          title="Choose a part type"
          chart={`flowchart TB
  Need[What must the peer receive?] --> Q{Human prose?}
  Q -->|Yes| Text[Text part]
  Q -->|Binary / doc| File[File part]
  Q -->|Machine fields| Data[Structured data part]
  Text --> Send[Attach to task message]
  File --> Send
  Data --> Send`}
        />
      </LessonSection>

      <KeyTakeaways
        items={[
          'A2A messages are composed of parts: text, files, and structured data.',
          'Artifacts are durable task outputs; messages also carry mid-flight progress.',
          'Match part types to Agent Card modalities; prefer data parts for machine contracts.',
          'Treat code samples as conceptual — confirm part schemas in official A2A docs.',
        ]}
      />
    </LessonArticle>
  )
}
