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

export function FunctionsInTypescript() {
  return (
    <LessonArticle>
      <Definition term="Functions in TypeScript">
        <p>
          You type a function&apos;s <strong className="text-white">parameters</strong> and{' '}
          <strong className="text-white">return value</strong> so callers pass the right inputs and
          use the output safely.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: a vending machine slot that only accepts coins of the right size —{' '}
          <span className="text-web-400">wrong input never starts the machine</span>.
        </p>
      </Definition>

      <Callout variant="beginner" title="Same function styles as JS">
        Declarations, expressions, and arrows all work. You mainly add{' '}
        <span className="font-mono text-sm text-web-400">: type</span> on parameters and after the
        parameter list for the return type.
      </Callout>

      <LessonSection title="Parameter and return types">
        <Flowchart
          title="Typed function shape"
          chart={`flowchart TB
  IN[Parameters with types]
  BODY[Function body]
  OUT[Return type]
  IN --> BODY --> OUT`}
        />
        <Example title="Annotate inputs and output">
{`function add(a: number, b: number): number {
  return a + b;
}

console.log(add(2, 3)); // 5
// add(2, '3'); // Error`}
        </Example>
        <CodeBlock title="Arrow functions">
{`const multiply = (a: number, b: number): number => a * b;

const toLabel = (n: number): string => 'score:' + n;

console.log(multiply(4, 5), toLabel(20));`}
        </CodeBlock>
        <ContentStep number={1} title="Return type inference">
          <p className="text-slate-300">
            Often you can omit the return annotation — TS infers it. Keep it when the contract
            matters (public APIs).
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Optional and default parameters">
        <p className="text-slate-300">
          Optional params use <span className="font-mono text-sm text-web-400">?</span>. Defaults
          use <span className="font-mono text-sm text-web-400">=</span> — same idea as JS, with
          types.
        </p>
        <Example title="Optional parameter">
{`function greet(name: string, title?: string): string {
  if (title) {
    return title + ' ' + name;
  }
  return 'Hello, ' + name;
}

console.log(greet('Ada'));
console.log(greet('Ada', 'Dr.'));`}
        </Example>
        <CodeBlock title="Default parameter">
{`function pad(text: string, width: number = 10): string {
  return text.padEnd(width, '.');
}

console.log(pad('hi'));      // hi........
console.log(pad('hi', 5));   // hi...`}
        </CodeBlock>
        <Callout variant="tip" title="Order matters">
          Required parameters come before optional ones. Defaults can sit at the end like in JS.
        </Callout>
      </LessonSection>

      <LessonSection title="void, never, and function type aliases">
        <p className="text-slate-300">
          <span className="font-mono text-sm text-web-400">void</span> means &quot;returns no useful
          value.&quot; <span className="font-mono text-sm text-web-400">never</span> means
          &quot;this function never finishes normally&quot; (always throws or loops forever).
        </p>
        <Example title="void and never">
{`function logMessage(msg: string): void {
  console.log(msg);
  // no return value
}

function fail(message: string): never {
  throw new Error(message);
}

logMessage('ok');
// fail('boom'); // throws — return type is never`}
        </Example>
        <CodeBlock title="Function type aliases">
{`type BinaryOp = (a: number, b: number) => number;

const sum: BinaryOp = (a, b) => a + b;
const product: BinaryOp = (a, b) => a * b;

function run(op: BinaryOp, x: number, y: number): number {
  return op(x, y);
}

console.log(run(sum, 2, 3));     // 5
console.log(run(product, 2, 3)); // 6`}
        </CodeBlock>
        <Callout variant="info" title="Callbacks stay typed">
          Passing functions around (map, event handlers, custom helpers) is safer when the callback
          type is named and reused.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Annotate parameters (and often returns) so calls stay correct.',
          'Optional (?) and default (=) parameters work like JS with types.',
          'void = no useful return; never = does not complete normally.',
          'Function type aliases describe callbacks and reusable operation shapes.',
        ]}
      />
    </LessonArticle>
  )
}
