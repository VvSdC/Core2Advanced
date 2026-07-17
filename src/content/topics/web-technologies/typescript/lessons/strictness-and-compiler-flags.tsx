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

export function StrictnessAndCompilerFlags() {
  return (
    <LessonArticle>
      <Definition term="Strict compiler flags">
        <p>
          TypeScript&apos;s usefulness depends on how strict the checker is. Flags like{' '}
          <span className="font-mono text-sm text-web-400">strict</span>,{' '}
          <span className="font-mono text-sm text-web-400">strictNullChecks</span>, and{' '}
          <span className="font-mono text-sm text-web-400">noImplicitAny</span> catch real bugs
          before runtime.
        </p>
        <p className="mt-2 text-slate-300">
          Loose settings feel easy at first; strict settings pay off as the codebase grows.
        </p>
      </Definition>

      <Callout variant="beginner" title="strict is a bundle">
        Turning on <span className="font-mono text-sm text-web-400">&quot;strict&quot;: true</span>{' '}
        enables several safer options at once — including null checks and no implicit any.
      </Callout>

      <LessonSection title="The big three">
        <Flowchart
          title="Safer by default"
          chart={`flowchart TB
  A[strict: true] --> B[strictNullChecks]
  A --> C[noImplicitAny]
  A --> D[other strict flags]
  B --> E[null | undefined must be handled]
  C --> F[missing types become errors]`}
        />
        <CodeBlock title="tsconfig sketch">
{`{
  "compilerOptions": {
    "strict": true,
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "noEmit": true
  }
}`}
        </CodeBlock>
        <ContentStep number={1} title="strictNullChecks">
          <p className="text-slate-300">
            <span className="font-mono text-sm text-web-400">null</span> and{' '}
            <span className="font-mono text-sm text-web-400">undefined</span> are not assignable to
            every type — you must narrow or allow them explicitly.
          </p>
        </ContentStep>
        <ContentStep number={2} title="noImplicitAny">
          <p className="text-slate-300">
            If TS cannot infer a type, it errors instead of quietly using{' '}
            <span className="font-mono text-sm text-web-400">any</span>.
          </p>
        </ContentStep>
        <CodeBlock title="What strict catches">
{`// With strictNullChecks
function len(text: string): number {
  return text.length;
}
// len(null); // error

function lenSafe(text: string | null): number {
  if (text === null) return 0;
  return text.length; // narrowed to string
}

// With noImplicitAny
// function add(a, b) { return a + b; } // error — params are implicit any
function add(a: number, b: number): number {
  return a + b;
}`}
        </CodeBlock>
      </LessonSection>

      <LessonSection title="Why teams turn strict on">
        <Example title="Bugs prevented">
{`// Without strictNullChecks, this looks fine to TS:
function greet(user: { name: string }) {
  return "Hi " + user.name.toUpperCase();
}
// greet(null); // runtime crash — strict would have blocked the call site

// Explicit optional forces handling:
function greetSafe(user: { name: string } | null) {
  if (!user) return "Hi guest";
  return "Hi " + user.name.toUpperCase();
}`}
        </Example>
        <Callout variant="insight" title="Types are a team contract">
          Strict mode makes invalid states harder to express. Reviews focus on logic, not
          &quot;did we forget null?&quot;
        </Callout>
      </LessonSection>

      <LessonSection title="Gradual migration tips">
        <CodeBlock title="Migrate without boiling the ocean">
{`// 1. Enable strict on new packages / folders first
// 2. Or turn on one flag at a time:
{
  "compilerOptions": {
    "strict": false,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}

// 3. Fix files with the most traffic (shared utils, API layer)
// 4. Allow temporary // @ts-expect-error with a ticket — delete later
// 5. Avoid "any" escapes that become permanent`}
        </CodeBlock>
        <Callout variant="tip" title="New code = strict code">
          Even if legacy files are loose, require strict for new modules. The safe island grows
          over time.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          <><span className="font-mono text-sm text-web-400">strict</span> turns on a suite of safer checks.</>,
          <><span className="font-mono text-sm text-web-400">strictNullChecks</span> forces real null/undefined handling.</>,
          <><span className="font-mono text-sm text-web-400">noImplicitAny</span> stops silent any parameters.</>,
          <>Migrate gradually — one flag or folder at a time — but prefer strict for new work.</>,
        ]}
      />
    </LessonArticle>
  )
}
