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

export function ScopeAndLexicalEnvironment() {
  return (
    <LessonArticle>
      <Definition term="Scope">
        <p>
          <strong className="text-white">Scope</strong> decides where a variable name is visible.
          JavaScript looks up names using <strong className="text-white">lexical</strong> rules —
          based on where you wrote the code, not where you call it from.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: nested rooms. A variable declared in an inner room may see outer rooms, but the
          hallway cannot peek into a closed office.
        </p>
      </Definition>

      <Callout variant="beginner" title="Three everyday scopes">
        Global (whole file/script), function (inside a function), and block (inside curly braces
        with <span className="font-mono text-sm text-web-400">let</span>/
        <span className="font-mono text-sm text-web-400">const</span>).
      </Callout>

      <LessonSection title="Global, function, and block">
        <CodeBlock title="See the differences">
{`const appName = "Demo"; // global (module/script top level)

function greet(user) {
  const message = "Hello, " + user; // function scope
  if (user) {
    const shout = message.toUpperCase(); // block scope
    console.log(shout);
  }
  // console.log(shout); // ReferenceError
  return message;
}

greet("Ada");
console.log(appName);`}
        </CodeBlock>
        <ContentStep number={1} title="Global">
          <p className="text-slate-300">
            Declared outside functions. Reachable from nested scopes unless shadowed by a same-named
            inner binding.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Function">
          <p className="text-slate-300">
            <span className="font-mono text-sm text-web-400">var</span> and function parameters live
            for the whole function. Prefer{' '}
            <span className="font-mono text-sm text-web-400">let</span>/<span className="font-mono text-sm text-web-400">const</span>{' '}
            for clearer block limits.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Block">
          <p className="text-slate-300">
            <span className="font-mono text-sm text-web-400">let</span> and{' '}
            <span className="font-mono text-sm text-web-400">const</span> inside{' '}
            <span className="font-mono text-sm text-web-400">if</span>, loops, or plain braces stay
            inside that block.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Lexical scoping">
        <Flowchart
          title="Lookup walks outward"
          chart={`flowchart TB
  A[Inner block asks: where is x?] --> B[Check current scope]
  B -->|not found| C[Check enclosing function]
  C -->|not found| D[Check global / module]
  D -->|not found| E[ReferenceError]`}
        />
        <p className="text-slate-300">
          Nested functions remember the scope chain where they were <em>defined</em>. That is the
          foundation of closures in the next lessons.
        </p>
        <CodeBlock title="Inner function sees outer variables">
{`function outer() {
  const label = "outer";

  function inner() {
    console.log(label); // finds label in outer's scope
  }

  return inner;
}

const fn = outer();
fn(); // "outer"`}
        </CodeBlock>
        <Example title="Shadowing">
{`const color = "blue";

function paint() {
  const color = "red"; // shadows outer color
  console.log(color);  // "red"
}

paint();
console.log(color);    // "blue"`}
        </Example>
      </LessonSection>

      <LessonSection title="var vs let/const (practical)">
        <CodeBlock title="Block traps with var">
{`for (var i = 0; i < 3; i++) {
  // var i is function-scoped (or global), not per-iteration
}
console.log(typeof i); // "number" in non-module scripts

for (let j = 0; j < 3; j++) {
  // j dies with each block iteration pattern you expect
}
// console.log(j); // ReferenceError`}
        </CodeBlock>
        <Callout variant="tip" title="Default habit">
          Use <span className="font-mono text-sm text-web-400">const</span> by default,{' '}
          <span className="font-mono text-sm text-web-400">let</span> when reassignment is needed,
          and avoid <span className="font-mono text-sm text-web-400">var</span> in new code.
        </Callout>
        <Callout variant="insight" title="Lexical environment">
          Spec language calls each scope a lexical environment: a map of names plus a link to the
          outer environment. You do not need the formal name to use the idea.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Scope controls where a name is visible.',
          'JS uses lexical scoping: structure of the source decides lookup.',
          'Know global, function, and block scopes — prefer let/const.',
          'Inner functions can see outer variables; that enables closures.',
        ]}
      />
    </LessonArticle>
  )
}
