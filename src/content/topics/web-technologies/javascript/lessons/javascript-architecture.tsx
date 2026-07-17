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

export function JavascriptArchitecture() {
  return (
    <LessonArticle>
      <Definition term="JavaScript architecture">
        <p>
          When your code runs, three layers work together: the{' '}
          <strong className="text-white">engine</strong> (e.g. V8) understands JS, the{' '}
          <strong className="text-white">runtime</strong> adds APIs and scheduling, and the{' '}
          <strong className="text-white">host</strong> (browser or Node) provides the environment.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: the engine is the motor, the runtime is the car&apos;s dashboard and pedals, and
          the host is the <span className="text-web-400">road</span> you drive on.
        </p>
      </Definition>

      <Callout variant="beginner" title="Why architecture matters">
        Errors like &quot;document is not defined&quot; mean you are in Node (no DOM), not that JS
        itself is broken. Knowing where code runs saves hours of confusion.
      </Callout>

      <LessonSection title="Engine, runtime, and host">
        <Flowchart
          title="JavaScript architecture (critical overview)"
          chart={`flowchart TB
  CODE[Your .js source]
  ENG[JS Engine e.g. V8]
  RT[Runtime — event loop, timers, APIs]
  HOST[Host — Browser or Node.js]
  HEAP[Heap — objects / memory]
  STACK[Call stack — running functions]
  CODE --> ENG
  ENG --> HEAP
  ENG --> STACK
  ENG --> RT
  RT --> HOST
  HOST -->|DOM / fetch / fs| RT`}
        />
        <ContentStep number={1} title="Engine (V8 and friends)">
          <p className="text-slate-300">
            Parses, compiles, and executes your code. Chrome and Node use{' '}
            <span className="font-mono text-sm text-web-400">V8</span>; Firefox uses SpiderMonkey.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Runtime">
          <p className="text-slate-300">
            Wraps the engine with timers (
            <span className="font-mono text-sm text-web-400">setTimeout</span>), the event loop, and
            Web/Node APIs so async work can finish later.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Host">
          <p className="text-slate-300">
            Browser = pages, DOM, <span className="font-mono text-sm text-web-400">fetch</span>.
            Node = files, processes, servers. Same engine family; different tools on the belt.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Heap and call stack">
        <p className="text-slate-300">
          The <strong className="text-white">call stack</strong> tracks which function is running
          now (plates stacked — top plate is current). The{' '}
          <strong className="text-white">heap</strong> is a big memory yard where objects and arrays
          live.
        </p>
        <Example
          title="Call stack in action"
          output={`start
inside greet
Hi, Sam
done`}
        >
{`function greet(name) {
  console.log('inside greet');
  console.log('Hi, ' + name);
}

console.log('start');
greet('Sam');
console.log('done');`}
        </Example>
        <CodeBlock title="Objects live on the heap">
{`const user = { name: 'Sam', score: 10 };
// user variable is a reference; the object sits in the heap
console.log(user.name); // Sam`}
        </CodeBlock>
        <Callout variant="tip" title="Mental model">
          Stack = &quot;what am I doing right now?&quot; Heap = &quot;where do my bags of data
          sit?&quot; Long-running stack frames or huge heap objects are common performance clues.
        </Callout>
      </LessonSection>

      <LessonSection title="Put it together">
        <p className="text-slate-300">
          You write source → the engine parses and runs it → values land on the heap → function
          calls push/pop the stack → the host&apos;s APIs let you touch the page or the filesystem.
        </p>
        <Callout variant="info" title="Keep this diagram in your head">
          Almost every later lesson (async, closures, modules) plugs into engine + runtime + host.
        </Callout>
        <Example title="Same language idea, different host APIs">
{`// Browser
document.querySelector('h1').textContent = 'Hello';

// Node
const fs = require('fs'); // or import in ESM
console.log(fs.existsSync('./package.json'));`}
        </Example>
        <CodeBlock title="Shared language core (works in both hosts)">
{`function sum(list) {
  let total = 0;
  for (const n of list) total += n;
  return total;
}
console.log(sum([1, 2, 3])); // 6`}
        </CodeBlock>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Engine (V8) executes JS; runtime adds scheduling and APIs; host is browser or Node.',
          'Call stack tracks active functions; heap stores objects and arrays.',
          'Host APIs differ: DOM in the browser, files/network tools in Node.',
          '“document is not defined” usually means wrong host — not broken JavaScript.',
        ]}
      />
    </LessonArticle>
  )
}
