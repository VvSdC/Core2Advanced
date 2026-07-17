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

export function ThisKeyword() {
  return (
    <LessonArticle>
      <Definition term="this">
        <p>
          <span className="font-mono text-sm text-web-400">this</span> is a special value that
          usually means <strong className="text-white">the object currently calling the
          function</strong>. It is set by <em>how</em> the function is called (for ordinary
          functions), not by where it was written.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: a name tag that changes depending on which team jersey you put on when you
          enter the field.
        </p>
      </Definition>

      <Callout variant="beginner" title="Start here">
        In a method like <span className="font-mono text-sm text-web-400">obj.method()</span>,{' '}
        <span className="font-mono text-sm text-web-400">this</span> is usually{' '}
        <span className="font-mono text-sm text-web-400">obj</span>. Arrow functions are the big
        exception — they borrow <span className="font-mono text-sm text-web-400">this</span> from
        the surrounding scope.
      </Callout>

      <LessonSection title="Methods, alone, and arrows">
        <Flowchart
          title="How this is chosen (simplified)"
          chart={`flowchart TB
  A[How was it called?] --> B["obj.fn() → this = obj"]
  A --> C["fn() alone → undefined in strict / window in sloppy"]
  A --> D["arrow → this from outer lexical scope"]
  A --> E["fn.call/apply/bind → you pick this"]`}
        />
        <CodeBlock title="Method call">
{`const user = {
  name: "Ada",
  hello() {
    console.log("Hi, " + this.name);
  },
};

user.hello(); // Hi, Ada  → this === user`}
        </CodeBlock>
        <CodeBlock title="Detached function loses the owner">
{`"use strict";
const user = {
  name: "Ada",
  hello() {
    console.log(this.name);
  },
};

const fn = user.hello;
fn(); // TypeError or undefined — this is not user anymore`}
        </CodeBlock>
        <ContentStep number={1} title="Ordinary functions">
          <p className="text-slate-300">
            <span className="font-mono text-sm text-web-400">this</span> depends on the call site:
            object before the dot, or default binding when called bare.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Arrow functions">
          <p className="text-slate-300">
            Arrows do not get their own{' '}
            <span className="font-mono text-sm text-web-400">this</span>. They close over the outer
            one — perfect for callbacks inside methods.
          </p>
        </ContentStep>
        <CodeBlock title="Arrow keeps outer this">
{`const timer = {
  label: "tick",
  start() {
    setTimeout(() => {
      console.log(this.label); // "tick" — arrow uses start's this
    }, 100);
  },
};

timer.start();`}
        </CodeBlock>
      </LessonSection>

      <LessonSection title="bind, call, and apply (briefly)">
        <p className="text-slate-300">
          These tools let you set <span className="font-mono text-sm text-web-400">this</span>{' '}
          explicitly for ordinary functions.
        </p>
        <Example title="Quick map">
{`fn.call(thisArg, a, b)   // call now with args listed
fn.apply(thisArg, [a, b]) // call now with args array
fn.bind(thisArg)          // return a new function locked to thisArg`}
        </Example>
        <CodeBlock title="Examples">
{`function intro(city) {
  console.log(this.name + " from " + city);
}

const person = { name: "Grace" };

intro.call(person, "London");
intro.apply(person, ["Paris"]);

const bound = intro.bind(person);
bound("Berlin"); // Grace from Berlin`}
        </CodeBlock>
        <Callout variant="tip" title="Handlers and this">
          Passing <span className="font-mono text-sm text-web-400">obj.method</span> as a callback
          often breaks <span className="font-mono text-sm text-web-400">this</span>. Fix with{' '}
          <span className="font-mono text-sm text-web-400">bind</span>, an arrow wrapper, or a class
          field arrow if you use classes.
        </Callout>
      </LessonSection>

      <LessonSection title="Class methods (preview)">
        <CodeBlock title="this inside a class instance">
{`class Counter {
  constructor() {
    this.n = 0;
  }
  bump() {
    this.n += 1;
    return this.n;
  }
}

const c = new Counter();
console.log(c.bump()); // 1`}
        </CodeBlock>
        <Callout variant="insight" title="Mental rule">
          Ask: &quot;Who called me, and am I an arrow?&quot; That question solves most beginner{' '}
          <span className="font-mono text-sm text-web-400">this</span> bugs.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'For normal functions, this depends on the call site.',
          'obj.method() usually sets this to obj; bare calls do not.',
          'Arrow functions inherit this lexically — great for callbacks.',
          'bind/call/apply set this explicitly when you need control.',
        ]}
      />
    </LessonArticle>
  )
}
