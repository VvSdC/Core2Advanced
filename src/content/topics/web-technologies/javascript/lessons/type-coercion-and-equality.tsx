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

export function TypeCoercionAndEquality() {
  return (
    <LessonArticle>
      <Definition term="Type coercion">
        <p>
          <strong className="text-white">Type coercion</strong> is when JavaScript automatically
          converts a value from one type to another — often during math, string joining, or{' '}
          <span className="font-mono text-sm text-web-400">==</span> comparisons.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: a helpful but overeager translator who guesses the language mid-sentence —{' '}
          <span className="text-web-400">sometimes right, sometimes weird</span>.
        </p>
      </Definition>

      <Callout variant="beginner" title="Goal of this lesson">
        Spot implicit coercion traps, prefer explicit{' '}
        <span className="font-mono text-sm text-web-400">Number</span> /{' '}
        <span className="font-mono text-sm text-web-400">String</span> /{' '}
        <span className="font-mono text-sm text-web-400">Boolean</span>, and stick to{' '}
        <span className="font-mono text-sm text-web-400">===</span>.
      </Callout>

      <LessonSection title="Implicit coercion pitfalls">
        <Flowchart
          title="Danger zones"
          chart={`flowchart TB
  MIX[Mix types in + or ==]
  MIX --> SUR[Surprising result]
  SUR --> FIX[Convert explicitly + use ===]`}
        />
        <Example
          title="Classic surprises"
          output={`"52"
3
true
0`}
        >
{`console.log('5' + 2);   // "52" — + prefers strings
console.log('5' - 2);   // 3  — - forces numbers
console.log('' == false); // true — avoid ==
console.log(Number(''));  // 0`}
        </Example>
        <CodeBlock title="More footguns">
{`console.log([] + []);          // ""
console.log([] + {});          // "[object Object]"
console.log(null == undefined); // true with ==
console.log(null === undefined); // false with ===

console.log(Number('abc')); // NaN — Not a Number
console.log(NaN === NaN);   // false! use Number.isNaN(x)`}
        </CodeBlock>
        <Callout variant="tip" title="NaN check">
          Use <span className="font-mono text-sm text-web-400">Number.isNaN(value)</span>, not{' '}
          <span className="font-mono text-sm text-web-400">value === NaN</span>.
        </Callout>
      </LessonSection>

      <LessonSection title="Number(), String(), Boolean()">
        <ContentStep number={1} title="Number()">
          <p className="text-slate-300">
            Parse numeric text or convert booleans. Invalid input becomes{' '}
            <span className="font-mono text-sm text-web-400">NaN</span>.
          </p>
        </ContentStep>
        <Example
          title="Explicit Number"
          output={`10
1
0
NaN`}
        >
{`console.log(Number('10'));
console.log(Number(true));
console.log(Number(false));
console.log(Number('oops'));`}
        </Example>
        <ContentStep number={2} title="String() and Boolean()">
          <p className="text-slate-300">
            <span className="font-mono text-sm text-web-400">String(x)</span> makes text.{' '}
            <span className="font-mono text-sm text-web-400">Boolean(x)</span> applies truthy/falsy
            rules on purpose.
          </p>
        </ContentStep>
        <CodeBlock title="Explicit String / Boolean">
{`console.log(String(99));        // "99"
console.log(String(true));      // "true"
console.log(Boolean(0));        // false
console.log(Boolean('0'));      // true — non-empty string!
console.log(Boolean(undefined)); // false`}
        </CodeBlock>
      </LessonSection>

      <LessonSection title="Best practices">
        <Example title="Safe everyday pattern">
{`// Input from a form is always a string
const raw = '42';
const qty = Number(raw);

if (Number.isNaN(qty)) {
  console.log('Please enter a number');
} else if (qty === 0) {
  console.log('Zero items');
} else {
  console.log('Count:', qty);
}`}
        </Example>
        <Callout variant="info" title="Rules of thumb">
          Use <span className="font-mono text-sm text-web-400">===</span>. Convert on purpose
          before math. Treat form values as strings until you{' '}
          <span className="font-mono text-sm text-web-400">Number(...)</span> them. Avoid relying on{' '}
          <span className="font-mono text-sm text-web-400">==</span> magic.
        </Callout>
        <CodeBlock title="Unary + is also Number() — use carefully">
{`console.log(+'12'); // 12
// Clearer for beginners:
console.log(Number('12'));`}
        </CodeBlock>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Implicit coercion in + and == causes many beginner bugs.',
          'Prefer Number(), String(), Boolean() when converting.',
          'Always compare with === / !== in new code.',
          'Check NaN with Number.isNaN; remember "0" is a truthy string.',
        ]}
      />
    </LessonArticle>
  )
}
