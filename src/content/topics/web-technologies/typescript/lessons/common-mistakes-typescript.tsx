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
} from '../../../../../components/content'

export function CommonMistakesTypescript() {
  return (
    <LessonArticle>
      <Definition term="Common TypeScript pitfalls">
        <p>
          Most TypeScript pain is not exotic syntax — it is <strong className="text-white">any</strong>,
          dishonest assertions, and forgetting that{' '}
          <span className="font-mono text-sm text-web-400">?</span> and{' '}
          <span className="font-mono text-sm text-web-400">undefined</span> are still real at
          runtime.
        </p>
        <p className="mt-2 text-slate-300">
          Spotting these early keeps types honest and debugging short.
        </p>
      </Definition>

      <Callout variant="beginner" title="Goal">
        Use types as a flashlight, not a costume. If the type says string, the value should be a
        string when the code runs.
      </Callout>

      <LessonSection title="Overusing any">
        <CodeBlock title="any turns the checker off">
{`function summarize(data: any) {
  return data.items.map((x: any) => x.label);
}

// Prefer unknown + narrow, or a real type:
type Payload = { items: { label: string }[] };

function summarizeSafe(data: Payload) {
  return data.items.map((x) => x.label);
}

function summarizeUnknown(data: unknown) {
  if (
    typeof data === "object" &&
    data !== null &&
    Array.isArray((data as { items?: unknown }).items)
  ) {
    // still better: a proper guard or schema
  }
}`}
        </CodeBlock>
        <ContentStep number={1} title="any spreads">
          <p className="text-slate-300">
            One <span className="font-mono text-sm text-web-400">any</span> infects everything it
            touches — return values, callbacks, nested fields.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Prefer unknown">
          <p className="text-slate-300">
            <span className="font-mono text-sm text-web-400">unknown</span> forces a check before
            use. That is usually what you wanted from types.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Lying with assertions">
        <Example title="Looks typed, crashes later">
{`type User = { id: string; name: string };

const raw = JSON.parse('{"id":1}') as User;
// TS is happy — runtime: name is undefined, id is a number

console.log(raw.name.toUpperCase()); // boom`}
        </Example>
        <Callout variant="insight" title="as is a promise to the compiler">
          If you assert without validating, you are the bug source. Assert only when you truly
          control the value.
        </Callout>
      </LessonSection>

      <LessonSection title="Optional chaining vs possibly undefined">
        <CodeBlock title="?. avoids crashes — types still optional">
{`type Profile = {
  user?: { name?: string };
};

function label(p: Profile): string {
  // Safe at runtime, but result is string | undefined
  const name = p.user?.name;

  // Still must handle undefined if you need a string
  return name ?? "Anonymous";
}

// Wrong mindset: "I used ?. so it's definitely a string"
// Right mindset: "?." means 'maybe skip' — type stays optional`}
        </CodeBlock>
        <Flowchart
          title="Debug a type error"
          chart={`flowchart TB
  A[Type error] --> B{Is the value possibly null/undefined?}
  B -->|yes| C[Narrow: if check, ?? , guard]
  B -->|no| D{Did you assert or use any?}
  D -->|yes| E[Remove lie — model real shape]
  D -->|no| F[Read hover type — fix call site or annotation]
  C --> G[Recompile]
  E --> G
  F --> G`}
        />
        <Callout variant="tip" title="Hover is your friend">
          In the editor, hover the symbol. The shown type is what TypeScript believes — if it
          surprises you, that is the bug clue.
        </Callout>
        <CodeBlock title="Quick recovery checklist">
{`// 1. Hover the red squiggle — read the actual type
// 2. Ask: can this be null / undefined / any?
// 3. Prefer narrow over assert
// 4. Fix the source type (API, prop, return) not every call site
// 5. Restart TS server only after logic fixes fail`}
        </CodeBlock>
        <Callout variant="info" title="Extra smell: empty interfaces / loose objects">
          Prefer a named type with real fields over index signatures full of{' '}
          <span className="font-mono text-sm text-web-400">any</span> that accept everything.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          <>Avoid <span className="font-mono text-sm text-web-400">any</span>; prefer real types or <span className="font-mono text-sm text-web-400">unknown</span>.</>,
          <>Assertions can silence errors while leaving runtime bugs.</>,
          <><span className="font-mono text-sm text-web-400">?.</span> prevents crashes but does not remove undefined from the type.</>,
          <>Debug by hovering types, narrowing honestly, and fixing source shapes.</>,
        ]}
      />
    </LessonArticle>
  )
}
