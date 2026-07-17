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

export function GenericsBasics() {
  return (
    <LessonArticle>
      <Definition term="Generics">
        <p>
          A <strong className="text-white">generic</strong> lets you write one function, type, or
          class that works with <em>many</em> types — without falling back to{' '}
          <span className="font-mono text-sm text-web-400">any</span>.
        </p>
        <p className="mt-2 text-slate-300">
          Think of <span className="font-mono text-sm text-web-400">T</span> as a blank label:
          &quot;I will fill this in when you call me.&quot;
        </p>
      </Definition>

      <Callout variant="beginner" title="Why bother?">
        Without generics, an identity function either loses type info (
        <span className="font-mono text-sm text-web-400">any</span>) or you rewrite it for every
        type. Generics keep both flexibility and safety.
      </Callout>

      <LessonSection title="The identity problem">
        <Flowchart
          title="any vs generic"
          chart={`flowchart LR
  A[Input value] --> B{How typed?}
  B -->|any| C[Output is any — unsafe]
  B -->|T| D[Output is same as input]`}
        />
        <CodeBlock title="Identity — wrong vs right">
{`// Loses type information
function identityAny(value: any): any {
  return value;
}
const n1 = identityAny(42); // type: any

// Keeps the call-site type
function identity<T>(value: T): T {
  return value;
}
const n2 = identity(42);        // number
const s2 = identity("hello");   // string
const b2 = identity(true);      // boolean`}
        </CodeBlock>
        <ContentStep number={1} title="Type parameter <T>">
          <p className="text-slate-300">
            <span className="font-mono text-sm text-web-400">T</span> is declared in angle
            brackets. TypeScript infers it from the argument when you call the function.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Explicit when needed">
          <p className="text-slate-300">
            You can write <span className="font-mono text-sm text-web-400">identity&lt;string&gt;(&quot;hi&quot;)</span>{' '}
            — useful when inference is unclear.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Array<T> and reusable helpers">
        <p className="text-slate-300">
          Built-in types are already generic:{' '}
          <span className="font-mono text-sm text-web-400">Array&lt;number&gt;</span> is the same
          idea as <span className="font-mono text-sm text-web-400">number[]</span>.
        </p>
        <CodeBlock title="Generic array helpers">
{`function first<T>(items: T[]): T | undefined {
  return items[0];
}

function last<T>(items: Array<T>): T | undefined {
  return items[items.length - 1];
}

const nums = [10, 20, 30];
const words = ["a", "b", "c"];

const a = first(nums);   // number | undefined
const b = last(words);   // string | undefined`}
        </CodeBlock>
        <Example title="Pair of values">
{`function pair<A, B>(left: A, right: B): [A, B] {
  return [left, right];
}

const p = pair("id", 7); // [string, number]
const [label, count] = p;`}
        </Example>
      </LessonSection>

      <LessonSection title="Constraints with extends">
        <p className="text-slate-300">
          Sometimes <span className="font-mono text-sm text-web-400">T</span> cannot be anything —
          it must have certain properties. Use{' '}
          <span className="font-mono text-sm text-web-400">extends</span>.
        </p>
        <CodeBlock title="T must have a length">
{`function longest<T extends { length: number }>(a: T, b: T): T {
  return a.length >= b.length ? a : b;
}

longest("hi", "hello");     // ok — strings have length
longest([1, 2], [1, 2, 3]); // ok — arrays have length
// longest(10, 20);         // error — numbers have no length`}
        </CodeBlock>
        <Callout variant="tip" title="Constraint = minimum shape">
          <span className="font-mono text-sm text-web-400">T extends Shape</span> means: T is at
          least Shape (and may have more fields).
        </Callout>
        <CodeBlock title="Constraint + property access">
{`interface HasId {
  id: string;
}

function byId<T extends HasId>(items: T[], id: string): T | undefined {
  return items.find((item) => item.id === id);
}

const users = [
  { id: "u1", name: "Ada" },
  { id: "u2", name: "Lin" },
];
const user = byId(users, "u1"); // { id: string; name: string } | undefined`}
        </CodeBlock>
      </LessonSection>

      <KeyTakeaways
        items={[
          <>Generics keep reuse without <span className="font-mono text-sm text-web-400">any</span>.</>,
          <>Declare <span className="font-mono text-sm text-web-400">T</span>; TS often infers it.</>,
          <><span className="font-mono text-sm text-web-400">Array&lt;T&gt;</span> is the classic built-in generic.</>,
          <><span className="font-mono text-sm text-web-400">extends</span> constrains what T is allowed to be.</>,
        ]}
      />
    </LessonArticle>
  )
}
