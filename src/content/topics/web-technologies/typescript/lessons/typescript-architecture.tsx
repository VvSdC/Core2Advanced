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

export function TypescriptArchitecture() {
  return (
    <LessonArticle>
      <Definition term="TypeScript architecture">
        <p>
          You write <span className="font-mono text-sm text-web-400">.ts</span> files. A{' '}
          <strong className="text-white">type checker</strong> validates them, then{' '}
          <span className="font-mono text-sm text-web-400">tsc</span> or a{' '}
          <strong className="text-white">bundler</strong> emits plain{' '}
          <span className="font-mono text-sm text-web-400">.js</span> that browsers and Node can run.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: types are the <span className="text-web-400">blueprint review</span>; the emitted
          JS is the finished building people walk through.
        </p>
      </Definition>

      <Callout variant="beginner" title="Two jobs, one pipeline">
        Type checking asks &quot;does this make sense?&quot; Emitting asks &quot;turn this into
        runnable JS.&quot; You can check without emitting, or both together.
      </Callout>

      <LessonSection title="From .ts to .js">
        <Flowchart
          title="Write TS → check → emit JS → run"
          chart={`flowchart TB
  WRITE[Write TypeScript .ts]
  CHECK[Type checker validates]
  EMIT[tsc or bundler emits .js]
  RUN[Browser or Node runs JS]
  WRITE --> CHECK
  CHECK -->|errors| FIX[Fix types / code]
  FIX --> WRITE
  CHECK -->|ok| EMIT --> RUN`}
        />
        <ContentStep number={1} title="Source (.ts / .tsx)">
          <p className="text-slate-300">
            Your code with optional type annotations. React projects often use{' '}
            <span className="font-mono text-sm text-web-400">.tsx</span> for JSX + types.
          </p>
        </ContentStep>
        <ContentStep number={2} title="tsc or bundler">
          <p className="text-slate-300">
            <span className="font-mono text-sm text-web-400">tsc</span> is the official compiler.
            Vite, webpack, esbuild, and others also strip types and bundle for the web.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Runtime host">
          <p className="text-slate-300">
            Only JavaScript executes — same engines (V8, etc.) you already know from the JS track.
          </p>
        </ContentStep>
        <CodeBlock title="Typical file pairing after tsc">
{`// src/greet.ts
export function greet(name: string): string {
  return 'Hi, ' + name;
}

// After compile → dist/greet.js (types erased)
// export function greet(name) {
//   return 'Hi, ' + name;
// }`}
        </CodeBlock>
      </LessonSection>

      <LessonSection title="Type checker vs runtime">
        <p className="text-slate-300">
          The <strong className="text-white">type checker</strong> works at{' '}
          <span className="text-web-400">compile / edit time</span>. The{' '}
          <strong className="text-white">runtime</strong> only sees values. Types do not add{' '}
          <span className="font-mono text-sm text-web-400">if</span> checks automatically.
        </p>
        <Example title="Checked now, erased later">
{`function double(n: number): number {
  return n * 2;
}

console.log(double(21)); // 42 at runtime

// Type checker rejects this before emit:
// double('21');

// At runtime there is no leftover "number" guard —
// you must validate untrusted input yourself if needed.`}
        </Example>
        <CodeBlock title="Untrusted input still needs runtime checks">
{`function parseAge(raw: unknown): number {
  if (typeof raw !== 'number' || Number.isNaN(raw)) {
    throw new Error('Expected a number');
  }
  return raw;
}

console.log(parseAge(30)); // 30
// JSON from an API is unknown until you validate it`}
        </CodeBlock>
        <Callout variant="tip" title="Boundary rule">
          Trust types inside your own modules. At the edges (API JSON, form fields,{' '}
          <span className="font-mono text-sm text-web-400">localStorage</span>), validate at
          runtime — then give the result a type.
        </Callout>
      </LessonSection>

      <LessonSection title="Where this fits with the JS engine">
        <p className="text-slate-300">
          TypeScript does not replace the engine. It sits{' '}
          <strong className="text-white">in front</strong> of the pipeline you already learned:
          parse → execute → heap / stack. Extra step: check types, then hand plain JS to that
          pipeline.
        </p>
        <Flowchart
          title="TS layer in front of the JS runtime"
          chart={`flowchart TB
  TS[.ts source]
  TC[TypeScript checker / emit]
  JS[.js output]
  ENG[JS engine — V8 etc.]
  TS --> TC --> JS --> ENG`}
        />
        <Callout variant="info" title="What you will configure next">
          Installing TypeScript and a{' '}
          <span className="font-mono text-sm text-web-400">tsconfig.json</span> tells{' '}
          <span className="font-mono text-sm text-web-400">tsc</span> which files to check and where
          to put the emitted JS.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          '.ts is checked and then compiled or bundled into .js.',
          'Type checker ≠ runtime: types vanish; engines only run JavaScript.',
          'Pipeline: write → type-check → emit JS → run in browser or Node.',
          'Validate untrusted data at runtime; types protect trusted code paths.',
        ]}
      />
    </LessonArticle>
  )
}
