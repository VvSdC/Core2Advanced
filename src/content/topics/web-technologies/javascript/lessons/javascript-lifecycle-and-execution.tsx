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

export function JavascriptLifecycleAndExecution() {
  return (
    <LessonArticle>
      <Definition term="JavaScript lifecycle">
        <p>
          A script does not magically run. The engine{' '}
          <strong className="text-white">parses</strong> text into structure, may{' '}
          <strong className="text-white">compile</strong> hot paths (JIT), then{' '}
          <strong className="text-white">executes</strong> statements inside an{' '}
          <strong className="text-white">execution context</strong>.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: reading a recipe (parse), prepping ingredients (creation phase), then cooking
          step by step (<span className="text-web-400">execution phase</span>).
        </p>
      </Definition>

      <Callout variant="beginner" title="Why this lesson">
        Understanding parse → execute explains why typos fail early, why{' '}
        <span className="font-mono text-sm text-web-400">var</span> feels &quot;hoisted,&quot; and
        why order of script tags matters on a page.
      </Callout>

      <LessonSection title="Parse, compile (JIT), execute">
        <Flowchart
          title="Script lifecycle (critical overview)"
          chart={`flowchart TB
  LOAD[Browser loads HTML / script]
  PARSE[Parse — syntax check + AST]
  COMP[Compile / JIT optimize]
  CREATE[Creation phase — hoist bindings]
  EXEC[Execution phase — run line by line]
  LOAD --> PARSE
  PARSE --> COMP
  COMP --> CREATE
  CREATE --> EXEC`}
        />
        <ContentStep number={1} title="Parsing">
          <p className="text-slate-300">
            The engine reads characters and builds a tree of the program. A missing{' '}
            <span className="font-mono text-sm text-web-400">{'}'}</span> fails here before any
            line &quot;runs.&quot;
          </p>
        </ContentStep>
        <ContentStep number={2} title="Compilation (JIT)">
          <p className="text-slate-300">
            Engines start interpreting, then compile hot code to faster machine code. You still
            ship plain source — the JIT is automatic.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Execution">
          <p className="text-slate-300">
            Statements run top to bottom (with jumps for loops/functions). Side effects like{' '}
            <span className="font-mono text-sm text-web-400">console.log</span> happen here.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Global execution context">
        <p className="text-slate-300">
          Every script starts with a <strong className="text-white">global execution context</strong>
          . Inside it there are roughly two phases:{' '}
          <strong className="text-white">creation</strong> (set up variables/functions) and{' '}
          <strong className="text-white">execution</strong> (assign values, run code).
        </p>
        <Example
          title="Creation vs execution (simplified)"
          output={`function
fn ready
undefined
42`}
        >
{`console.log(typeof show); // "function" — declaration prepared early
show();

var score;           // created as undefined first
console.log(score);  // undefined during early execution
score = 42;
console.log(score);  // 42

function show() {
  console.log('fn ready');
}`}
        </Example>
        <CodeBlock title="Modern style still has a global context">
{`let title = 'Welcome';
const year = 2026;

function greet() {
  return title + ' ' + year;
}

console.log(greet()); // Welcome 2026`}
        </CodeBlock>
        <Callout variant="tip" title="let / const vs var">
          <span className="font-mono text-sm text-web-400">let</span> and{' '}
          <span className="font-mono text-sm text-web-400">const</span> are also prepared in
          creation, but you cannot use them before their line (temporal dead zone). Details come
          in the variables lesson.
        </Callout>
      </LessonSection>

      <LessonSection title="How a script loads on a page">
        <p className="text-slate-300">
          The browser parses HTML. When it hits a{' '}
          <span className="font-mono text-sm text-web-400">&lt;script&gt;</span>, it fetches (if{' '}
          <span className="font-mono text-sm text-web-400">src</span>) and runs the JS before
          continuing — unless you use{' '}
          <span className="font-mono text-sm text-web-400">defer</span> /{' '}
          <span className="font-mono text-sm text-web-400">async</span> or{' '}
          <span className="font-mono text-sm text-web-400">type=&quot;module&quot;</span>.
        </p>
        <Example title="Typical page wiring">
{`<!-- index.html -->
<!DOCTYPE html>
<html>
  <body>
    <h1 id="title">Hello</h1>
    <script src="app.js"></script>
  </body>
</html>

// app.js
const el = document.getElementById('title');
el.textContent = 'Hello from JS';
console.log('script finished');`}
        </Example>
        <Callout variant="info" title="Order matters">
          Put scripts after the HTML they touch, or use{' '}
          <span className="font-mono text-sm text-web-400">defer</span>, so elements exist when your
          code queries them.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Lifecycle: load → parse → (JIT) compile → create bindings → execute.',
          'Each run has an execution context; the first is the global one.',
          'Creation prepares variables/functions; execution assigns and runs statements.',
          'On a page, script tags control when JS runs relative to HTML parsing.',
        ]}
      />
    </LessonArticle>
  )
}
