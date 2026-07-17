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

export function PuttingItTogetherTypescript() {
  return (
    <LessonArticle>
      <Definition term="TypeScript mastery map">
        <p>
          You move from <strong className="text-white">foundations</strong> (types, unions,
          narrowing) → <strong className="text-white">generics &amp; utilities</strong> →{' '}
          <strong className="text-white">DOM/async typing</strong> →{' '}
          <strong className="text-white">tooling</strong> (strictness,{' '}
          <span className="font-mono text-sm text-web-400">.d.ts</span>, modules).
        </p>
        <p className="mt-2 text-slate-300">
          One rule to keep forever: types erase — at runtime you still run JavaScript.
        </p>
      </Definition>

      <Callout variant="beginner" title="How to use this page">
        Skim the checklist. Anything fuzzy → reopen that lesson and retype one example from
        memory.
      </Callout>

      <LessonSection title="Mastery checklist">
        <Flowchart
          title="Foundations → generics → tooling"
          chart={`flowchart TB
  A[Foundations: types unions narrowing] --> B[Generics + utility types]
  B --> C[Classes modules DOM async]
  C --> D[Guards assertions satisfies]
  D --> E[strict + .d.ts + @types]
  E --> F[React TS / Node TS]`}
        />
        <ContentStep number={1} title="Foundations">
          <ul className="list-disc space-y-2 pl-5 text-slate-300">
            <li>Primitives, objects, unions, literals</li>
            <li>Narrowing with typeof, equality, guards</li>
            <li>Interfaces vs type aliases (comfortably)</li>
          </ul>
        </ContentStep>
        <ContentStep number={2} title="Generics & advanced types">
          <ul className="list-disc space-y-2 pl-5 text-slate-300">
            <li>
              <span className="font-mono text-sm text-web-400">&lt;T&gt;</span>, constraints,{' '}
              <span className="font-mono text-sm text-web-400">keyof</span>
            </li>
            <li>Partial, Pick, Omit, Record</li>
            <li>Mapped / conditional types at a reading level</li>
          </ul>
        </ContentStep>
        <ContentStep number={3} title="Practical typing">
          <ul className="list-disc space-y-2 pl-5 text-slate-300">
            <li>DOM elements and events</li>
            <li>
              <span className="font-mono text-sm text-web-400">Promise&lt;T&gt;</span> and fetch +
              unknown
            </li>
            <li>
              <span className="font-mono text-sm text-web-400">as</span>,{' '}
              <span className="font-mono text-sm text-web-400">satisfies</span>, custom{' '}
              <span className="font-mono text-sm text-web-400">is</span> guards
            </li>
          </ul>
        </ContentStep>
        <ContentStep number={4} title="Tooling">
          <ul className="list-disc space-y-2 pl-5 text-slate-300">
            <li>strict / null checks / noImplicitAny</li>
            <li>
              <span className="font-mono text-sm text-web-400">.d.ts</span>, @types, lib
            </li>
            <li>ES modules + import type</li>
          </ul>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Mental model: types erase">
        <CodeBlock title="Same JS after compile">
{`// TypeScript you write
function double(n: number): number {
  return n * 2;
}

// JavaScript that runs (simplified emit)
function double(n) {
  return n * 2;
}

// Types helped you catch double("x") before shipping.
// They are gone when Node or the browser executes.`}
        </CodeBlock>
        <Example title="Why validation still matters">
{`async function loadUser(url: string): Promise<{ name: string }> {
  const res = await fetch(url);
  const data: unknown = await res.json();
  if (
    typeof data === "object" &&
    data !== null &&
    "name" in data &&
    typeof (data as { name: unknown }).name === "string"
  ) {
    return { name: (data as { name: string }).name };
  }
  throw new Error("Invalid user JSON");
}

// Types describe intent; runtime checks protect the boundary.`}
        </Example>
        <Callout variant="insight" title="Compile-time + runtime">
          TypeScript guards your codebase. Network, forms, and{' '}
          <span className="font-mono text-sm text-web-400">JSON.parse</span> still need runtime
          honesty.
        </Callout>
      </LessonSection>

      <LessonSection title="You are ready when…">
        <Callout variant="tip" title="Self-check">
          You can write a generic helper, derive a type with Pick/Partial, type a DOM listener,
          type an async fetch with unknown + a guard, and explain why strict mode helps teams.
        </Callout>
        <Callout variant="info" title="Next: React with TS / Node with TS">
          Apply these skills in the <strong className="text-white">React.js</strong> track
          (props, hooks, components) and the <strong className="text-white">Node.js</strong>{' '}
          track (servers, tooling, @types/node). Same TypeScript — new platforms.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          <>Path: foundations → generics/utilities → DOM/async → tooling.</>,
          <>Types erase; runtime is still JavaScript.</>,
          <>Validate untrusted data; do not rely on assertions alone.</>,
          <>Next up: React with TypeScript and Node with TypeScript.</>,
        ]}
      />
    </LessonArticle>
  )
}
