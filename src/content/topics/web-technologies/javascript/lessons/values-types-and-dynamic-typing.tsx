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

export function ValuesTypesAndDynamicTyping() {
  return (
    <LessonArticle>
      <Definition term="Values and types">
        <p>
          Every piece of data in JavaScript is a <strong className="text-white">value</strong> with
          a <strong className="text-white">type</strong> — number, string, boolean, and more.
          JavaScript is <strong className="text-white">dynamically typed</strong>: the same
          variable can hold different types over time.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: a labeled jar (<span className="text-web-400">variable</span>) can hold cookies
          today and coins tomorrow — the jar does not fix one content type forever.
        </p>
      </Definition>

      <Callout variant="beginner" title="No type annotations required">
        Unlike some languages, beginners write{' '}
        <span className="font-mono text-sm text-web-400">let x = 1</span> — not{' '}
        <span className="font-mono text-sm text-web-400">int x = 1</span>. Flexibility is powerful;
        later we learn careful habits so it does not surprise you.
      </Callout>

      <LessonSection title="Dynamic typing in action">
        <Example
          title="Same variable, new type"
          output={`number
string
hi`}
        >
{`let x = 1;
console.log(typeof x); // "number"

x = 'hi';
console.log(typeof x); // "string"
console.log(x);        // hi`}
        </Example>
        <Flowchart
          title="Value → type → typeof"
          chart={`flowchart TB
  V[Value in memory]
  T[Has a type]
  TO[typeof reports a string]
  V --> T --> TO
  TO --> N["number / string / boolean / ..."]`}
        />
        <CodeBlock title="More reassignments">
{`let data = true;
data = 42;
data = { ok: true };
console.log(typeof data); // "object"`}
        </CodeBlock>
      </LessonSection>

      <LessonSection title="typeof and the main types">
        <p className="text-slate-300">
          Use <span className="font-mono text-sm text-web-400">typeof</span> to ask &quot;what kind
          of value is this?&quot; It returns a string tag.
        </p>
        <Example
          title="typeof cheat sheet"
          output={`"number"
"string"
"boolean"
"undefined"
"object"
"object"
"function"
"bigint"
"symbol"`}
        >
{`console.log(typeof 42);
console.log(typeof 'hi');
console.log(typeof true);
console.log(typeof undefined);
console.log(typeof null);      // historical quirk: "object"
console.log(typeof { a: 1 });
console.log(typeof function () {});
console.log(typeof 10n);
console.log(typeof Symbol('id'));`}
        </Example>
        <ContentStep number={1} title="Primitives">
          <p className="text-slate-300">
            Single, immutable values: string, number, boolean, null, undefined, bigint, symbol.
            Assigning copies the value itself.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Objects">
          <p className="text-slate-300">
            Objects and arrays are reference types — variables point at a heap object. Functions
            are callable objects (
            <span className="font-mono text-sm text-web-400">typeof</span> says{' '}
            <span className="font-mono text-sm text-web-400">&quot;function&quot;</span>).
          </p>
        </ContentStep>
        <Callout variant="tip" title="null quirk">
          <span className="font-mono text-sm text-web-400">typeof null === &quot;object&quot;</span>{' '}
          is a long-standing bug-turned-feature. Check null with{' '}
          <span className="font-mono text-sm text-web-400">value === null</span>.
        </Callout>
      </LessonSection>

      <LessonSection title="Coercion teaser">
        <p className="text-slate-300">
          JavaScript sometimes <strong className="text-white">coerces</strong> (auto-converts)
          types when you mix them. We go deep later — for now, notice the surprise.
        </p>
        <Example title="Friendly vs surprising" output={`"42"
7
"52"`}>
{`console.log(String(42));   // intentional
console.log(3 + 4);         // number math
console.log('5' + 2);       // string concatenation → "52"`}
        </Example>
        <CodeBlock title="Prefer clarity early">
{`const n = Number('10'); // 10
const label = String(10); // "10"
console.log(n + 5);       // 15 — both numbers`}
        </CodeBlock>
        <Callout variant="info" title="Coming next">
          Variables (<span className="font-mono text-sm text-web-400">let</span> /{' '}
          <span className="font-mono text-sm text-web-400">const</span> /{' '}
          <span className="font-mono text-sm text-web-400">var</span>) control how you store these
          values safely.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'JS is dynamically typed: a variable can hold different types over time.',
          'typeof reports a type tag; remember the null → "object" quirk.',
          'Primitives are simple values; objects/arrays are references on the heap.',
          'Coercion can surprise you — prefer Number/String when mixing types.',
        ]}
      />
    </LessonArticle>
  )
}
