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

export function TypeAssertionsAndGuards() {
  return (
    <LessonArticle>
      <Definition term="Assertions vs guards">
        <p>
          A <strong className="text-white">type assertion</strong> (
          <span className="font-mono text-sm text-web-400">as Type</span>) tells TypeScript to
          treat a value as a type — without a runtime check.
        </p>
        <p className="mt-2 text-slate-300">
          A <strong className="text-white">type guard</strong> is a real runtime check that also
          narrows the type for the compiler.
        </p>
      </Definition>

      <Callout variant="beginner" title="Assertion ≠ conversion">
        <span className="font-mono text-sm text-web-400">as number</span> does not convert a string
        to a number. It only changes how TS thinks about the value.
      </Callout>

      <LessonSection title="as Type (and angle brackets)">
        <Flowchart
          title="Assertion vs guard"
          chart={`flowchart TB
  A[Value] --> B{How do you narrow?}
  B -->|as Type| C[Compile-time only — can lie]
  B -->|typeof / is| D[Runtime check + narrowing]`}
        />
        <CodeBlock title="Assertion syntax">
{`const raw: unknown = JSON.parse('{"n":1}');

// Prefer this form in TSX files
const obj = raw as { n: number };

// Angle-bracket form — avoid in .tsx (looks like JSX)
const obj2 = <{ n: number }>raw;`}
        </CodeBlock>
        <ContentStep number={1} title="Use sparingly">
          <p className="text-slate-300">
            Assertions are for when you know more than the compiler — DOM nodes you own, config
            you control.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Avoid in .tsx">
          <p className="text-slate-300">
            Prefer <span className="font-mono text-sm text-web-400">value as Type</span> — angle
            brackets clash with JSX.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="satisfies — modern and useful">
        <p className="text-slate-300">
          <span className="font-mono text-sm text-web-400">satisfies</span> checks that a value
          matches a type <em>without</em> widening it to that type. You keep precise inferred
          literals.
        </p>
        <CodeBlock title="satisfies vs annotation">
{`type Palette = Record<string, string>;

// Annotation widens keys to string
const colorsAnnotated: Palette = {
  primary: "#0ea5e9",
  danger: "#ef4444",
};
// colorsAnnotated.primary — ok, but keys are just string

const colors = {
  primary: "#0ea5e9",
  danger: "#ef4444",
} satisfies Palette;

// Still checked against Palette…
colors.primary; // "#0ea5e9" (literal kept)
// colors.missing; // error — property does not exist`}
        </CodeBlock>
        <Callout variant="insight" title="Best of both">
          Validate the shape, keep narrow inferred types. Great for config objects and route maps.
        </Callout>
      </LessonSection>

      <LessonSection title="Custom type guards (is)">
        <CodeBlock title="value is Type">
{`type Cat = { kind: "cat"; meow(): void };
type Dog = { kind: "dog"; bark(): void };
type Pet = Cat | Dog;

function isCat(pet: Pet): pet is Cat {
  return pet.kind === "cat";
}

function speak(pet: Pet): void {
  if (isCat(pet)) {
    pet.meow(); // narrowed to Cat
  } else {
    pet.bark(); // Dog
  }
}`}
        </CodeBlock>
        <Example title="Guard for unknown">
{`function isStringArray(value: unknown): value is string[] {
  return (
    Array.isArray(value) &&
    value.every((item) => typeof item === "string")
  );
}

const data: unknown = ["a", "b"];
if (isStringArray(data)) {
  console.log(data.join(", "));
}`}
        </Example>
        <Callout variant="tip" title="Built-in helpers">
          <span className="font-mono text-sm text-web-400">typeof</span>,{' '}
          <span className="font-mono text-sm text-web-400">instanceof</span>, and{' '}
          <span className="font-mono text-sm text-web-400">Array.isArray</span> already act as
          guards — custom <span className="font-mono text-sm text-web-400">is</span> functions
          extend the same idea.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          <><span className="font-mono text-sm text-web-400">as</span> asserts at compile time; it does not convert values.</>,
          <>Prefer <span className="font-mono text-sm text-web-400">as</span> over angle brackets in TSX.</>,
          <><span className="font-mono text-sm text-web-400">satisfies</span> validates shape while keeping precise inference.</>,
          <>Custom guards return <span className="font-mono text-sm text-web-400">value is Type</span> and narrow safely.</>,
        ]}
      />
    </LessonArticle>
  )
}
