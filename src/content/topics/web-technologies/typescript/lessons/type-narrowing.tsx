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

export function TypeNarrowing() {
  return (
    <LessonArticle>
      <Definition term="Type narrowing">
        <p>
          <strong className="text-white">Narrowing</strong> is when TypeScript follows your control
          flow (<span className="font-mono text-sm text-web-400">if</span>,{' '}
          <span className="font-mono text-sm text-web-400">switch</span>, equality checks) and{' '}
          <strong className="text-white">shrinks a union</strong> to a more specific type inside a
          branch.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: a package marked &quot;book or mug&quot; — after you open it and see pages, you{' '}
          <span className="text-web-400">know it is a book</span> and stop treating it like a mug.
        </p>
      </Definition>

      <Callout variant="beginner" title="Control flow analysis">
        You write normal JS conditionals. TypeScript watches those conditions and updates what
        operations are allowed on the value in each branch.
      </Callout>

      <LessonSection title="typeof, instanceof, in, and equality">
        <Flowchart
          title="Check → narrower type in that branch"
          chart={`flowchart TB
  U[Union type]
  CHK[Runtime check]
  A[Branch A — type A]
  B[Branch B — type B]
  U --> CHK
  CHK --> A
  CHK --> B`}
        />
        <Example title="typeof narrowing">
{`function printLen(value: string | string[]) {
  if (typeof value === 'string') {
    console.log(value.length); // string
  } else {
    console.log(value.length); // string[]
    console.log(value.join(','));
  }
}

printLen('hi');
printLen(['a', 'b']);`}
        </Example>
        <CodeBlock title="instanceof and in">
{`function describe(x: Date | string) {
  if (x instanceof Date) {
    console.log(x.toISOString());
  } else {
    console.log(x.toUpperCase());
  }
}

describe(new Date());
describe('hello');

type Car = { drive: () => void };
type Boat = { sail: () => void };

function move(vehicle: Car | Boat) {
  if ('drive' in vehicle) {
    vehicle.drive();
  } else {
    vehicle.sail();
  }
}

move({ drive: () => console.log('vroom') });`}
        </CodeBlock>
        <ContentStep number={1} title="Equality narrowing">
          <p className="text-slate-300">
            Comparing to a literal or{' '}
            <span className="font-mono text-sm text-web-400">null</span> also narrows — e.g.{' '}
            <span className="font-mono text-sm text-web-400">if (x === null) return</span>.
          </p>
        </ContentStep>
        <Example title="Null check then use">
{`function upper(name: string | null): string {
  if (name === null) {
    return '';
  }
  return name.toUpperCase(); // name is string here
}

console.log(upper('ada'));
console.log(upper(null));`}
        </Example>
      </LessonSection>

      <LessonSection title="Discriminated unions (intro)">
        <p className="text-slate-300">
          Give each variant a shared <strong className="text-white">tag</strong> field (often{' '}
          <span className="font-mono text-sm text-web-400">kind</span> or{' '}
          <span className="font-mono text-sm text-web-400">type</span>). Switching on that tag
          narrows the whole object.
        </p>
        <Example title="kind as the discriminant">
{`type Success = { kind: 'success'; data: string };
type Failure = { kind: 'failure'; error: string };
type Result = Success | Failure;

function handle(result: Result) {
  switch (result.kind) {
    case 'success':
      console.log(result.data); // Success
      break;
    case 'failure':
      console.log(result.error); // Failure
      break;
  }
}

handle({ kind: 'success', data: 'ok' });
handle({ kind: 'failure', error: 'nope' });`}
        </Example>
        <CodeBlock title="Shape stays safe across branches">
{`type Circle = { kind: 'circle'; radius: number };
type Square = { kind: 'square'; size: number };
type Shape = Circle | Square;

function area(shape: Shape): number {
  if (shape.kind === 'circle') {
    return Math.PI * shape.radius ** 2;
  }
  return shape.size * shape.size;
}

console.log(area({ kind: 'circle', radius: 2 }).toFixed(2));
console.log(area({ kind: 'square', size: 3 }));`}
        </CodeBlock>
        <Callout variant="tip" title="Why tags help">
          Without a common discriminant, narrowing object unions is harder. One literal field
          makes <span className="font-mono text-sm text-web-400">switch</span> /{' '}
          <span className="font-mono text-sm text-web-400">if</span> obvious for humans and for TS.
        </Callout>
        <Callout variant="info" title="Coming next">
          <span className="font-mono text-sm text-web-400">never</span> pairs with discriminated
          unions for exhaustiveness checks — ensuring you handled every case.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Narrowing shrinks unions using control-flow checks.',
          'typeof, instanceof, in, and equality are everyday narrowing tools.',
          'Discriminated unions use a shared tag field like kind.',
          'After a successful check, TypeScript allows that branch’s operations.',
        ]}
      />
    </LessonArticle>
  )
}
