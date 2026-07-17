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

export function VariablesLetConstVar() {
  return (
    <LessonArticle>
      <Definition term="Variables">
        <p>
          A <strong className="text-white">variable</strong> is a named box that holds a value.
          Modern JavaScript uses <span className="font-mono text-sm text-web-400">let</span> and{' '}
          <span className="font-mono text-sm text-web-400">const</span>. Older code often uses{' '}
          <span className="font-mono text-sm text-web-400">var</span>.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: <span className="text-web-400">const</span> is a sealed jar (same jar, maybe
          mutable contents for objects), <span className="text-web-400">let</span> is a jar you can
          refill, <span className="text-web-400">var</span> is a leaky vintage jar with odd rules.
        </p>
      </Definition>

      <Callout variant="beginner" title="Default choice">
        Prefer <span className="font-mono text-sm text-web-400">const</span>. Use{' '}
        <span className="font-mono text-sm text-web-400">let</span> when you must reassign. Avoid{' '}
        <span className="font-mono text-sm text-web-400">var</span> in new code.
      </Callout>

      <LessonSection title="let, const, and var">
        <Flowchart
          title="Which keyword?"
          chart={`flowchart TB
  Q{Need to reassign the binding?}
  Q -->|No| C[const]
  Q -->|Yes| L[let]
  Q -->|Legacy only| V[var — avoid]`}
        />
        <Example
          title="let vs const"
          output={`1
2
Ada`}
        >
{`let count = 1;
count = 2; // OK — reassignment
console.log(count);

const name = 'Ada';
// name = 'Grace'; // TypeError: Assignment to constant variable
console.log(name);`}
        </Example>
        <CodeBlock title="const objects can still change inside">
{`const user = { name: 'Ada' };
user.name = 'Grace'; // OK — same object, property changed
console.log(user.name); // Grace
// user = {}; // Error — cannot rebind the variable`}
        </CodeBlock>
        <ContentStep number={1} title="Block scope (let / const)">
          <p className="text-slate-300">
            They live inside curly-brace blocks —{' '}
            <span className="font-mono text-sm text-web-400">if</span>, loops, or plain{' '}
            <span className="font-mono text-sm text-web-400">{'{ ... }'}</span> groups.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Function scope (var)">
          <p className="text-slate-300">
            <span className="font-mono text-sm text-web-400">var</span> ignores block braces and
            escapes to the enclosing function (or global). That causes sneaky bugs.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Temporal dead zone (TDZ)">
        <p className="text-slate-300">
          From the start of a block until the{' '}
          <span className="font-mono text-sm text-web-400">let</span> /{' '}
          <span className="font-mono text-sm text-web-400">const</span> line runs, the binding
          exists but is unusable — the <strong className="text-white">temporal dead zone</strong>.
          Accessing it throws.
        </p>
        <Example title="TDZ in action">
{`{
  // console.log(score); // ReferenceError — TDZ
  let score = 10;
  console.log(score); // 10
}

console.log(old); // undefined — var is initialized early
var old = 5;`}
        </Example>
        <CodeBlock title="var vs let in a loop (classic surprise)">
{`for (var i = 0; i < 3; i++) {
  /* var i is function-scoped */
}
console.log(i); // 3 — leaked!

for (let j = 0; j < 3; j++) {
  /* j stays in the loop block */
}
// console.log(j); // ReferenceError`}
        </CodeBlock>
        <Callout variant="tip" title="Remember">
          TDZ protects you from using a variable before its declaration line. Declare at the top of
          the block if you need clarity.
        </Callout>
      </LessonSection>

      <LessonSection title="Side-by-side summary">
        <Example title="Quick comparison">
{`Keyword   Reassign?   Scope     Before declaration
-------------------------------------------------
let       yes          block     TDZ → error
const     no (binding) block     TDZ → error
var       yes          function  undefined`}
        </Example>
        <Callout variant="info" title="Team habit">
          Start every new binding with{' '}
          <span className="font-mono text-sm text-web-400">const</span>. Switch to{' '}
          <span className="font-mono text-sm text-web-400">let</span> only when you hit a real
          reassignment need.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Prefer const; use let when reassignment is required; avoid var in new code.',
          'let and const are block-scoped; var is function-scoped.',
          'TDZ: accessing let/const before their line throws ReferenceError.',
          'const freezes the binding, not deep object contents.',
        ]}
      />
    </LessonArticle>
  )
}
