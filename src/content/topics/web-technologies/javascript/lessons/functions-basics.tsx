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

export function FunctionsBasics() {
  return (
    <LessonArticle>
      <Definition term="Functions">
        <p>
          A <strong className="text-white">function</strong> is a reusable block of code with a
          name (or not), <strong className="text-white">parameters</strong> as inputs, and optional{' '}
          <span className="font-mono text-sm text-web-400">return</span> output.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: a kitchen gadget — put ingredients in (arguments), get a dish out (
          <span className="text-web-400">return value</span>).
        </p>
      </Definition>

      <Callout variant="beginner" title="Why functions">
        Without them you copy-paste the same lines everywhere. Functions name an idea once and
        call it many times.
      </Callout>

      <LessonSection title="Declarations, expressions, arrows">
        <Flowchart
          title="Three common styles"
          chart={`flowchart TB
  D[Function declaration]
  E[Function expression]
  A[Arrow function]
  D --> C[Callable with name]
  E --> C
  A --> C`}
        />
        <Example
          title="Declaration vs expression vs arrow"
          output={`5
5
5`}
        >
{`function add(a, b) {
  return a + b;
}

const addExpr = function (a, b) {
  return a + b;
};

const addArrow = (a, b) => a + b;

console.log(add(2, 3));
console.log(addExpr(2, 3));
console.log(addArrow(2, 3));`}
        </Example>
        <CodeBlock title="Arrow with a body block">
{`const greet = (name) => {
  const msg = 'Hi, ' + name;
  return msg;
};
console.log(greet('Ada')); // Hi, Ada`}
        </CodeBlock>
        <ContentStep number={1} title="Declaration hoisting">
          <p className="text-slate-300">
            Function declarations are available in their scope even above their line (prepared in
            creation phase). Expressions and arrows assigned to{' '}
            <span className="font-mono text-sm text-web-400">const</span> are not.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Parameters, return, defaults">
        <Example
          title="Defaults and return"
          output={`Hello, friend!
Hello, Sam!
10`}
        >
{`function hello(name = 'friend') {
  return 'Hello, ' + name + '!';
}

console.log(hello());
console.log(hello('Sam'));

function double(n) {
  return n * 2;
}
console.log(double(5));`}
        </Example>
        <CodeBlock title="No return → undefined">
{`function logOnly(x) {
  console.log(x);
  // missing return
}
console.log(logOnly('hi')); // prints hi, then undefined`}
        </CodeBlock>
        <Callout variant="tip" title="Return exits early">
          After <span className="font-mono text-sm text-web-400">return</span>, the rest of the
          function body does not run. Use that for guard clauses.
        </Callout>
      </LessonSection>

      <LessonSection title="Scope intro">
        <p className="text-slate-300">
          Variables declared inside a function are{' '}
          <strong className="text-white">local</strong> — invisible outside. Outer variables are
          visible inside (unless shadowed).
        </p>
        <Example
          title="Local vs outer"
          output={`inside: 1
10`}
        >
{`const level = 10;

function demo() {
  const level = 1; // shadows outer for this function
  console.log('inside:', level);
}

demo();
console.log(level); // 10 — outer unchanged`}
        </Example>
        <Callout variant="info" title="Next steps">
          Closures and <span className="font-mono text-sm text-web-400">this</span> come later.
          Master parameters, return, and local scope first.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Functions package reusable logic with parameters and return values.',
          'Styles: declaration, expression, and arrow — all callable.',
          'Default parameters fill in when an argument is missing/undefined.',
          'Inner variables are local; functions can read outer bindings (scope).',
        ]}
      />
    </LessonArticle>
  )
}
