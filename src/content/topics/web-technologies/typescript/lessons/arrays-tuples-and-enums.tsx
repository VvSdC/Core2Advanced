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

export function ArraysTuplesAndEnums() {
  return (
    <LessonArticle>
      <Definition term="Arrays, tuples, and enums">
        <p>
          <strong className="text-white">Arrays</strong> hold many values of one type.{' '}
          <strong className="text-white">Tuples</strong> fix both length and each position&apos;s
          type. <strong className="text-white">Enums</strong> name a small set of related
          constants.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: an array is a bag of same-colored marbles; a tuple is a{' '}
          <span className="text-web-400">labeled pair</span> (name + score); an enum is a short
          menu of allowed choices.
        </p>
      </Definition>

      <Callout variant="beginner" title="Same arrays you know from JS">
        Runtime behavior matches JavaScript.{' '}
        <span className="font-mono text-sm text-web-400">push</span>, map, and loops still work —
        TypeScript adds element-type safety.
      </Callout>

      <LessonSection title="Typed arrays">
        <Flowchart
          title="Array type syntax"
          chart={`flowchart TB
  A["string[]"]
  B["Array<number>"]
  A --> S[Same idea: list of strings]
  B --> N[Same idea: list of numbers]`}
        />
        <Example title="Two equivalent spellings">
{`const tags: string[] = ['ts', 'js'];
const scores: Array<number> = [90, 85, 100];

tags.push('react');
scores.push(88);
// tags.push(1); // Error: number not assignable to string

console.log(tags, scores);`}
        </Example>
        <CodeBlock title="Arrays of objects">
{`type Point = { x: number; y: number };

const path: Point[] = [
  { x: 0, y: 0 },
  { x: 1, y: 2 },
];

console.log(path[1].x); // 1`}
        </CodeBlock>
        <ContentStep number={1} title="Prefer T[] for simple cases">
          <p className="text-slate-300">
            <span className="font-mono text-sm text-web-400">string[]</span> reads naturally.
            Use <span className="font-mono text-sm text-web-400">Array&lt;T&gt;</span> when the
            element type is long or nested.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Tuples — fixed positions">
        <p className="text-slate-300">
          A tuple type lists types in order:{' '}
          <span className="font-mono text-sm text-web-400">[string, number]</span> means index 0 is
          a string, index 1 is a number.
        </p>
        <Example title="Name and score pair">
{`const entry: [string, number] = ['Ada', 98];

const name = entry[0]; // string
const score = entry[1]; // number

console.log(name + ' scored ' + score);
// entry[0] = 10; // Error`}
        </Example>
        <CodeBlock title="Optional tuple slots and labels">
{`type CsvRow = [id: number, label: string, active?: boolean];

const row: CsvRow = [1, 'alpha', true];
const short: CsvRow = [2, 'beta'];
console.log(row, short);`}
        </CodeBlock>
        <Callout variant="tip" title="Tuples vs arrays">
          Use tuples for small, positional records (coordinates, CSV columns). Use arrays when
          length can grow freely.
        </Callout>
      </LessonSection>

      <LessonSection title="Enums and a modern alternative">
        <p className="text-slate-300">
          Numeric and string enums give named constants. Many teams prefer{' '}
          <span className="font-mono text-sm text-web-400">as const</span> objects for simpler
          emitted JS.
        </p>
        <Example title="Classic enum">
{`enum Role {
  Admin = 'admin',
  User = 'user',
  Guest = 'guest',
}

function canEdit(role: Role): boolean {
  return role === Role.Admin;
}

console.log(canEdit(Role.Admin)); // true
console.log(canEdit(Role.Guest)); // false`}
        </Example>
        <CodeBlock title="const enum and as const alternative">
{`// const enum — inlined by the compiler (use carefully with bundlers)
const enum Direction {
  Up,
  Down,
}
const move = Direction.Up;

// Popular alternative: const object + union type
const Status = {
  Idle: 'idle',
  Loading: 'loading',
  Done: 'done',
} as const;

type Status = (typeof Status)[keyof typeof Status];
// Status is 'idle' | 'loading' | 'done'

function setStatus(s: Status) {
  console.log(s);
}
setStatus(Status.Loading);`}
        </CodeBlock>
        <Callout variant="info" title="Beginner choice">
          Learn enum syntax so you can read it in codebases. For new code,{' '}
          <span className="font-mono text-sm text-web-400">as const</span> + a union type is often
          enough.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'string[] and Array<number> both mean “list of that element type.”',
          'Tuples fix length and per-index types, e.g. [string, number].',
          'Enums name related constants; const enum inlines values.',
          'as const objects plus union types are a common modern alternative to enums.',
        ]}
      />
    </LessonArticle>
  )
}
