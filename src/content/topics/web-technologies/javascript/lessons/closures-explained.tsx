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

export function ClosuresExplained() {
  return (
    <LessonArticle>
      <Definition term="Closure">
        <p>
          A <strong className="text-white">closure</strong> is a function that still remembers
          variables from the place where it was created — even after that outer function has
          finished running.
        </p>
        <p className="mt-2 text-slate-300">
          Easy analogy: you leave a backpack with a friend. Later, when they &quot;run,&quot; they
          still open <em>your</em> backpack — the values you packed — not a random stranger&apos;s.
        </p>
      </Definition>

      <Callout variant="beginner" title="You already used them">
        Event handlers and callbacks that read variables from surrounding code are closures. The
        word is new; the pattern is familiar.
      </Callout>

      <LessonSection title="Function remembering outer variables">
        <Flowchart
          title="Outer finishes, inner keeps the bag"
          chart={`flowchart LR
  A[outer runs] --> B[Creates inner + bag of vars]
  B --> C[outer returns inner]
  C --> D[Later: inner still has the bag]`}
        />
        <CodeBlock title="Minimal closure">
{`function makeGreeter(name) {
  // 'name' lives in makeGreeter's scope
  return function greet() {
    console.log("Hi, " + name);
  };
}

const hiAda = makeGreeter("Ada");
const hiGrace = makeGreeter("Grace");

hiAda();   // Hi, Ada
hiGrace(); // Hi, Grace
// Each returned function closed over its own 'name'.`}
        </CodeBlock>
        <ContentStep number={1} title="Create">
          <p className="text-slate-300">
            An outer function defines local variables and returns (or passes) an inner function.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Remember">
          <p className="text-slate-300">
            The inner function keeps a lasting link to those outer variables — not a one-time copy
            of a snapshot unless you design it that way.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Reuse">
          <p className="text-slate-300">
            Call the inner function later; it still sees and can update those closed-over values.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Practical: counter factory">
        <CodeBlock title="Private-ish state with a closure">
{`function createCounter(start = 0) {
  let count = start; // not reachable from outside directly

  return {
    next() {
      count += 1;
      return count;
    },
    value() {
      return count;
    },
  };
}

const a = createCounter();
const b = createCounter(10);

console.log(a.next(), a.next()); // 1, 2
console.log(b.next());           // 11
console.log(a.value());          // 2
// a and b each have their own 'count' backpack.`}
        </CodeBlock>
        <Callout variant="insight" title="Encapsulation without classes">
          Outside code cannot touch <span className="font-mono text-sm text-web-400">count</span>{' '}
          except through the returned methods. That is a classic closure pattern for simple
          private-ish state.
        </Callout>
        <Example title="Factory that customizes behavior">
{`function multiplyBy(factor) {
  return (n) => n * factor;
}

const double = multiplyBy(2);
const triple = multiplyBy(3);
console.log(double(5), triple(5)); // 10, 15`}
        </Example>
      </LessonSection>

      <LessonSection title="Interview classic — explained gently">
        <p className="text-slate-300">
          The famous loop-plus-
          <span className="font-mono text-sm text-web-400">setTimeout</span> puzzle confuses people
          because every callback closed over the <em>same</em>{' '}
          <span className="font-mono text-sm text-web-400">var i</span>.
        </p>
        <CodeBlock title="The surprising version">
{`for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
// Prints 3, 3, 3 — one shared 'i', already finished at 3`}
        </CodeBlock>
        <CodeBlock title="Clear fixes">
{`// 1) let creates a fresh binding per iteration
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
// 0, 1, 2

// 2) Or capture with an outer function / IIFE parameter
for (var i = 0; i < 3; i++) {
  ((n) => setTimeout(() => console.log(n), 0))(i);
}`}
        </CodeBlock>
        <Callout variant="tip" title="What interviewers want">
          Show you know closures keep live bindings, and that{' '}
          <span className="font-mono text-sm text-web-400">var</span> vs{' '}
          <span className="font-mono text-sm text-web-400">let</span> changes how many bindings the
          loop creates.
        </Callout>
        <Example title="DOM handler closure">
{`function setupButton(label) {
  const btn = document.createElement("button");
  btn.textContent = label;
  btn.addEventListener("click", () => {
    console.log("Clicked", label); // remembers label
  });
  document.body.append(btn);
}

setupButton("Save");
setupButton("Cancel");`}
        </Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'A closure is a function plus the outer variables it still needs.',
          'Factories can hide state (counters, configs) behind returned functions.',
          'Closures keep live bindings — updates are visible later.',
          'The loop/setTimeout puzzle is about shared var vs per-iteration let.',
        ]}
      />
    </LessonArticle>
  )
}
