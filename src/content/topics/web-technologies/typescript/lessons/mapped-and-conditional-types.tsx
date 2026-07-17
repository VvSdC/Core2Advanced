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

export function MappedAndConditionalTypes() {
  return (
    <LessonArticle>
      <Definition term="Mapped and conditional types">
        <p>
          A <strong className="text-white">mapped type</strong> walks every key of an object type
          and builds a new shape. A <strong className="text-white">conditional type</strong> picks
          one of two results based on a type test.
        </p>
        <p className="mt-2 text-slate-300">
          You already saw utilities like Partial — under the hood many of them are mapped types.
        </p>
      </Definition>

      <Callout variant="beginner" title="Easy analogy">
        Mapped types are like <span className="font-mono text-sm text-web-400">.map()</span> for
        object keys. Conditional types are like a ternary{' '}
        <span className="font-mono text-sm text-web-400">?</span> but for types, not values.
      </Callout>

      <LessonSection title="Mapped types intro">
        <Flowchart
          title="For each key → new property"
          chart={`flowchart LR
  A[Keys of T] --> B[For each K]
  B --> C[Build new property type]
  C --> D[New object type]`}
        />
        <CodeBlock title="Homemade Partial">
{`type MyPartial<T> = {
  [K in keyof T]?: T[K];
};

type User = { id: string; name: string };
type UserDraft = MyPartial<User>;
// { id?: string; name?: string }`}
        </CodeBlock>
        <ContentStep number={1} title="[K in keyof T]">
          <p className="text-slate-300">
            Loop over every key name. <span className="font-mono text-sm text-web-400">K</span> is
            each key in turn.
          </p>
        </ContentStep>
        <ContentStep number={2} title="T[K]">
          <p className="text-slate-300">
            Keep the original value type for that key (or wrap it — e.g. make it a Promise).
          </p>
        </ContentStep>
        <Example title="Make every field a getter type">
{`type Getters<T> = {
  [K in keyof T]: () => T[K];
};

type Point = { x: number; y: number };
type PointGetters = Getters<Point>;
// { x: () => number; y: () => number }`}
        </Example>
        <CodeBlock title="Readonly map (homemade)">
{`type MyReadonly<T> = {
  readonly [K in keyof T]: T[K];
};

type Config = { host: string; port: number };
type FrozenConfig = MyReadonly<Config>;
// host and port cannot be reassigned`}
        </CodeBlock>
        <Callout variant="tip" title="You already used these">
          Built-in <span className="font-mono text-sm text-web-400">Partial</span> and{' '}
          <span className="font-mono text-sm text-web-400">Readonly</span> are mapped types. Reading
          the pattern helps you invent small helpers when utilities are not enough.
        </Callout>
      </LessonSection>

      <LessonSection title="Conditional types">
        <p className="text-slate-300">
          Form: <span className="font-mono text-sm text-web-400">T extends U ? X : Y</span> —
          &quot;If T is assignable to U, use X; otherwise Y.&quot;
        </p>
        <CodeBlock title="Basic conditional">
{`type IsString<T> = T extends string ? true : false;

type A = IsString<"hi">;  // true
type B = IsString<42>;    // false`}
        </CodeBlock>
        <ContentStep number={3} title="Read it like a ternary">
          <p className="text-slate-300">
            Same shape as <span className="font-mono text-sm text-web-400">cond ? a : b</span>, but
            the condition is a type relationship, not a runtime value.
          </p>
        </ContentStep>
        <CodeBlock title="Unwrap a Promise">
{`type Unwrap<T> = T extends Promise<infer U> ? U : T;

type P = Unwrap<Promise<number>>; // number
type N = Unwrap<string>;          // string`}
        </CodeBlock>
        <Callout variant="insight" title="infer in one sentence">
          <span className="font-mono text-sm text-web-400">infer U</span> means &quot;match this
          pattern and capture the inner type as U.&quot; Useful but optional for day-one reading.
        </Callout>
        <CodeBlock title="Practical: non-null helper type">
{`type NonNullableField<T> = T extends null | undefined ? never : T;

type C = NonNullableField<string | null>; // string
type D = NonNullableField<undefined>;     // never`}
        </CodeBlock>
        <Example title="Pick a message type by kind">
{`type Ok = { ok: true; value: string };
type Err = { ok: false; error: string };
type Result = Ok | Err;

type DataOf<T> = T extends { ok: true; value: infer V } ? V : never;

type OnlyValue = DataOf<Result>; // string`}
        </Example>
        <Callout variant="tip" title="Do not overdo it">
          Prefer built-in utilities and simple mapped types first. Deep conditional gymnastics are
          for library authors — apps rarely need them.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          <>Mapped types rebuild object shapes key-by-key with <span className="font-mono text-sm text-web-400">[K in keyof T]</span>.</>,
          <>Conditionals use <span className="font-mono text-sm text-web-400">T extends U ? X : Y</span>.</>,
          <><span className="font-mono text-sm text-web-400">infer</span> extracts inner types from patterns like Promise.</>,
          <>Many built-in utilities are mapped/conditional types under the hood.</>,
        ]}
      />
    </LessonArticle>
  )
}
