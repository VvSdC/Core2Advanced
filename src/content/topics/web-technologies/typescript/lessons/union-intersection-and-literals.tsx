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

export function UnionIntersectionAndLiterals() {
  return (
    <LessonArticle>
      <Definition term="Unions, intersections, and literals">
        <p>
          A <strong className="text-white">union</strong> (
          <span className="font-mono text-sm text-web-400">A | B</span>) means &quot;one of
          these.&quot; An <strong className="text-white">intersection</strong> (
          <span className="font-mono text-sm text-web-400">A &amp; B</span>) means &quot;both at
          once.&quot; <strong className="text-white">Literal types</strong> pin a value to exact
          strings or numbers like <span className="font-mono text-sm text-web-400">
            &apos;admin&apos;
          </span>
          .
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: union = cash <em>or</em> card; intersection = must be both a student{' '}
          <em>and</em> a library member; literals = only these exact ticket colors.
        </p>
      </Definition>

      <Callout variant="beginner" title="Why unions feel natural">
        Real data is often &quot;string or number&quot; (IDs) or &quot;success or error.&quot;
        Unions model that without giving up type safety.
      </Callout>

      <LessonSection title="Union types — A | B">
        <Flowchart
          title="Union means one branch at a time"
          chart={`flowchart TB
  U["string | number"]
  U --> S[Use as string after narrowing]
  U --> N[Use as number after narrowing]`}
        />
        <Example title="string | number">
{`function formatId(id: string | number): string {
  return 'id:' + String(id);
}

console.log(formatId('abc'));
console.log(formatId(42));`}
        </Example>
        <CodeBlock title="Narrow with typeof">
{`function double(value: string | number): string | number {
  if (typeof value === 'string') {
    return value + value; // value is string here
  }
  return value * 2; // value is number here
}

console.log(double('ha')); // haha
console.log(double(21));   // 42`}
        </CodeBlock>
        <ContentStep number={1} title="Narrow with in">
          <p className="text-slate-300">
            For objects, check whether a property exists with{' '}
            <span className="font-mono text-sm text-web-400">in</span> before using it.
          </p>
        </ContentStep>
        <Example title="Narrowing objects with in">
{`type Dog = { bark: () => void };
type Cat = { meow: () => void };

function speak(pet: Dog | Cat) {
  if ('bark' in pet) {
    pet.bark();
  } else {
    pet.meow();
  }
}

speak({ bark: () => console.log('woof') });
speak({ meow: () => console.log('meow') });`}
        </Example>
      </LessonSection>

      <LessonSection title="Intersection types — A & B">
        <p className="text-slate-300">
          Combine shapes: the result must satisfy every part. Handy for mixing mixins or shared
          fields.
        </p>
        <Example title="Merge two object types">
{`type Named = { name: string };
type Aged = { age: number };
type Person = Named & Aged;

const person: Person = { name: 'Sam', age: 30 };
console.log(person.name, person.age);`}
        </Example>
        <CodeBlock title="Intersection with existing aliases">
{`type WithId = { id: string };
type Timestamped = { createdAt: Date };
type Entity = WithId & Timestamped;

const row: Entity = {
  id: 'e1',
  createdAt: new Date(),
};
console.log(row.id);`}
        </CodeBlock>
        <Callout variant="tip" title="Union vs intersection">
          <span className="font-mono text-sm text-web-400">|</span> widens choices;{' '}
          <span className="font-mono text-sm text-web-400">&amp;</span> adds requirements. Mixing
          them up is a common beginner mix-up.
        </Callout>
      </LessonSection>

      <LessonSection title="Literal types">
        <p className="text-slate-300">
          Instead of any string, allow only specific ones — great for roles, statuses, and modes.
        </p>
        <Example title="'admin' | 'user'">
{`type Role = 'admin' | 'user';

function canDelete(role: Role): boolean {
  return role === 'admin';
}

console.log(canDelete('admin')); // true
console.log(canDelete('user'));  // false
// canDelete('superuser'); // Error`}
        </Example>
        <CodeBlock title="Numeric and boolean literals">
{`type Dice = 1 | 2 | 3 | 4 | 5 | 6;
type Switch = true | false; // same idea as boolean, but explicit

function roll(): Dice {
  return 4; // pretend RNG
}

const face: Dice = roll();
console.log(face);`}
        </CodeBlock>
        <Callout variant="info" title="Next lesson">
          Narrowing is how TypeScript follows your{' '}
          <span className="font-mono text-sm text-web-400">if</span> /{' '}
          <span className="font-mono text-sm text-web-400">switch</span> logic to refine unions
          automatically.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Unions (A | B) mean one of several types — narrow before using specifics.',
          'typeof and in are common narrowing tools for unions.',
          'Intersections (A & B) require all shapes at once.',
          "Literal types like 'admin' | 'user' lock values to exact choices.",
        ]}
      />
    </LessonArticle>
  )
}
