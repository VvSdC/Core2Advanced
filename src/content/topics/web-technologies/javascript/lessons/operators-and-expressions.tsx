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

export function OperatorsAndExpressions() {
  return (
    <LessonArticle>
      <Definition term="Operators and expressions">
        <p>
          An <strong className="text-white">expression</strong> is code that produces a value.
          <strong className="text-white"> Operators</strong> combine values — add numbers, compare
          strings, choose with a ternary.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: values are ingredients; operators are the kitchen tools that mix them into a
          new result (<span className="text-web-400">expression</span>).
        </p>
      </Definition>

      <Callout variant="beginner" title="Read aloud">
        <span className="font-mono text-sm text-web-400">3 + 4</span> &quot;three plus four&quot; →{' '}
        <span className="font-mono text-sm text-web-400">7</span>. If you can say what it evaluates
        to, you understand the expression.
      </Callout>

      <LessonSection title="Arithmetic, comparison, logical">
        <Example
          title="Arithmetic"
          output={`8
3
20
2
1`}
        >
{`console.log(5 + 3);
console.log(5 - 2);
console.log(4 * 5);
console.log(10 / 5);
console.log(10 % 3); // remainder`}
        </Example>
        <CodeBlock title="Comparison and logical">
{`console.log(5 > 3);          // true
console.log(5 >= 5);         // true
console.log('a' < 'b');      // true (dictionary order)

const age = 20;
console.log(age >= 18 && age < 65); // true — AND
console.log(age < 13 || age > 65);  // false — OR
console.log(!true);                 // false — NOT`}
        </CodeBlock>
        <ContentStep number={1} title="Ternary">
          <p className="text-slate-300">
            Short if/else as an expression:{' '}
            <span className="font-mono text-sm text-web-400">condition ? ifTrue : ifFalse</span>.
          </p>
        </ContentStep>
        <Example title="Ternary" output={`"adult"`}>
{`const age = 20;
const label = age >= 18 ? 'adult' : 'minor';
console.log(label);`}
        </Example>
      </LessonSection>

      <LessonSection title="== vs ===">
        <Flowchart
          title="Equality choice"
          chart={`flowchart TB
  Q{Need type coercion?}
  Q -->|Almost never| EQ[Use === and !==]
  Q -->|Rare legacy| LOOSE[== can surprise you]`}
        />
        <p className="text-slate-300">
          <span className="font-mono text-sm text-web-400">===</span> checks value{' '}
          <strong className="text-white">and</strong> type.{' '}
          <span className="font-mono text-sm text-web-400">==</span> coerces types first — often
          confusing.
        </p>
        <Example
          title="Loose vs strict"
          output={`true
false
true
false`}
        >
{`console.log(5 == '5');   // true  — string coerced to number
console.log(5 === '5');  // false — different types
console.log(0 == false); // true  — coercion
console.log(0 === false); // false`}
        </Example>
        <Callout variant="tip" title="Habit">
          Always reach for <span className="font-mono text-sm text-web-400">===</span> and{' '}
          <span className="font-mono text-sm text-web-400">!==</span> unless you have a rare,
          documented reason.
        </Callout>
      </LessonSection>

      <LessonSection title="Truthy and falsy">
        <p className="text-slate-300">
          In conditions, values act as <strong className="text-white">truthy</strong> or{' '}
          <strong className="text-white">falsy</strong>. Falsy list to memorize:{' '}
          <span className="font-mono text-sm text-web-400">false</span>,{' '}
          <span className="font-mono text-sm text-web-400">0</span>,{' '}
          <span className="font-mono text-sm text-web-400">-0</span>,{' '}
          <span className="font-mono text-sm text-web-400">0n</span>,{' '}
          <span className="font-mono text-sm text-web-400">&quot;&quot;</span>,{' '}
          <span className="font-mono text-sm text-web-400">null</span>,{' '}
          <span className="font-mono text-sm text-web-400">undefined</span>,{' '}
          <span className="font-mono text-sm text-web-400">NaN</span>.
        </p>
        <Example
          title="Truthy / falsy checks"
          output={`empty
has text
no score`}
        >
{`const name = '';
if (name) {
  console.log('has text');
} else {
  console.log('empty');
}

const msg = 'hi';
if (msg) console.log('has text');

const score = 0;
if (score) {
  console.log('scored');
} else {
  console.log('no score'); // 0 is falsy!
}`}
        </Example>
        <CodeBlock title="Boolean() makes intent clear">
{`console.log(Boolean(''));  // false
console.log(Boolean('x')); // true
console.log(Boolean([]));  // true — empty array is truthy!`}
        </CodeBlock>
        <Callout variant="info" title="Gotcha">
          Empty array <span className="font-mono text-sm text-web-400">[]</span> and empty object{' '}
          <span className="font-mono text-sm text-web-400">{'{}'}</span> are truthy. Check{' '}
          <span className="font-mono text-sm text-web-400">.length</span> when you mean
          &quot;empty.&quot;
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Operators build expressions that evaluate to values.',
          'Use === / !==; avoid == unless you truly want coercion.',
          'Ternary is a compact conditional expression.',
          'Falsy: false, 0, "", null, undefined, NaN (and a few relatives).',
        ]}
      />
    </LessonArticle>
  )
}
