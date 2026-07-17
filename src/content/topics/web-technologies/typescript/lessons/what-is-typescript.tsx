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

export function WhatIsTypescript() {
  return (
    <LessonArticle>
      <Definition term="TypeScript">
        <p>
          <strong className="text-white">TypeScript</strong> is{' '}
          <strong className="text-white">JavaScript plus static types</strong> — you annotate (or
          let the compiler infer) what kind of value each name holds, then tools check those rules{' '}
          <em>before</em> the code runs.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: JS is writing freely in a notebook;{' '}
          <span className="text-web-400">TypeScript adds labeled columns</span> so you do not put
          a phone number in the &quot;name&quot; field by accident.
        </p>
      </Definition>

      <Callout variant="beginner" title="Who this track is for">
        You finished the JavaScript track (or know basic JS: variables, functions, objects,
        arrays). We focus on <strong className="text-white">why types exist</strong> and how they
        help — not on memorizing every advanced feature on day one.
      </Callout>

      <LessonSection title="TypeScript = JavaScript + types">
        <p className="text-slate-300">
          Almost every valid JS file is valid TypeScript. You add type information so editors and{' '}
          <span className="font-mono text-sm text-web-400">tsc</span> can catch mistakes early.
        </p>
        <Example title="Same idea: JS vs TS" output="Hello, Ada">
{`// JavaScript
function greet(name) {
  return 'Hello, ' + name;
}

// TypeScript — name must be a string
function greetTs(name: string): string {
  return 'Hello, ' + name;
}

console.log(greetTs('Ada')); // Hello, Ada
// greetTs(42); // Error: Argument of type 'number' is not assignable`}
        </Example>
        <CodeBlock title="Types are documentation that the compiler enforces">
{`const score: number = 10;
const label: string = 'points';
const active: boolean = true;

console.log(score, label, active);`}
        </CodeBlock>
      </LessonSection>

      <LessonSection title="Compiles to JavaScript — types are erased">
        <p className="text-slate-300">
          Browsers and Node run <strong className="text-white">JavaScript</strong>, not TypeScript
          types. A compiler (or bundler) turns{' '}
          <span className="font-mono text-sm text-web-400">.ts</span> into{' '}
          <span className="font-mono text-sm text-web-400">.js</span> and{' '}
          <strong className="text-white">strips the types away</strong>.
        </p>
        <Flowchart
          title="Write TS → check → emit plain JS"
          chart={`flowchart TB
  TS[Your .ts source with types]
  CHK[Type checker finds mistakes]
  EMIT[Emit .js — types erased]
  RUN[Browser / Node runs JS]
  TS --> CHK --> EMIT --> RUN`}
        />
        <ContentStep number={1} title="At build time">
          <p className="text-slate-300">
            Types help catch bugs and power autocomplete. Wrong types → red squiggles or a failed
            build.
          </p>
        </ContentStep>
        <ContentStep number={2} title="At runtime">
          <p className="text-slate-300">
            Only JS remains. There is no{' '}
            <span className="font-mono text-sm text-web-400">: string</span> left in memory — the
            engine never sees your type annotations.
          </p>
        </ContentStep>
        <CodeBlock title="What the compiler roughly emits">
{`// TypeScript you write
const title: string = 'Core2Advanced';

// JavaScript that runs (types gone)
const title = 'Core2Advanced';`}
        </CodeBlock>
        <Callout variant="tip" title="Mental model">
          Types are a <span className="text-web-400">safety net while you write</span>, not extra
          code that runs on the user&apos;s machine.
        </Callout>
      </LessonSection>

      <LessonSection title="Learning path for this TypeScript track">
        <ContentStep number={1} title="Why and how">
          <p className="text-slate-300">
            Motivation, architecture (.ts → .js), and installing TypeScript with a simple{' '}
            <span className="font-mono text-sm text-web-400">tsconfig.json</span>.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Core types">
          <p className="text-slate-300">
            Primitives, arrays, tuples, objects, interfaces, and typed functions — everyday tools.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Smarter types">
          <p className="text-slate-300">
            Unions, narrowing, and careful use of{' '}
            <span className="font-mono text-sm text-web-400">any</span> /{' '}
            <span className="font-mono text-sm text-web-400">unknown</span> /{' '}
            <span className="font-mono text-sm text-web-400">never</span>.
          </p>
        </ContentStep>
        <Callout variant="info" title="Relation to the JavaScript track">
          JS taught you how the language behaves at runtime. TS sits on top: same syntax and
          semantics, plus a type layer that shrinks whole classes of bugs before you ever hit
          &quot;Run&quot;.
        </Callout>
        <Example title="Vocabulary preview">
{`static types  — checked before the program runs
tsc           — TypeScript compiler (type-check + emit JS)
type erasure  — types disappear in the output .js
annotation    — writing : string, : number, etc.`}
        </Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'TypeScript is JavaScript plus static types — same language family, extra safety.',
          'Compilers erase types: browsers and Node only ever run JavaScript.',
          'This track assumes basic JS and teaches why types help, then how to use them.',
          'Types guide editors and catch bugs at build time; they are not runtime checks.',
        ]}
      />
    </LessonArticle>
  )
}
