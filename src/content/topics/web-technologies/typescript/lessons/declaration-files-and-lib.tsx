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

export function DeclarationFilesAndLib() {
  return (
    <LessonArticle>
      <Definition term="Declaration files (.d.ts)">
        <p>
          A <span className="font-mono text-sm text-web-400">.d.ts</span> file describes types for
          JavaScript code — APIs, libraries, or globals — without containing runnable
          implementation.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: a menu describes dishes; the kitchen (the <span className="font-mono text-sm text-web-400">.js</span>{' '}
          file) cooks them. TypeScript reads the menu.
        </p>
      </Definition>

      <Callout variant="beginner" title="Why they exist">
        Many npm packages ship JS only. Declaration files teach TypeScript the shapes of exports
        so you get autocomplete and errors.
      </Callout>

      <LessonSection title="What .d.ts contains">
        <Flowchart
          title="Types without runtime"
          chart={`flowchart LR
  A[.js library] --> B[Runtime behavior]
  C[.d.ts types] --> D[Compile-time checks]
  E[Your .ts] --> C
  E --> A`}
        />
        <CodeBlock title="Minimal ambient module">
{`// types/greeter.d.ts
declare module "greeter" {
  export function greet(name: string): string;
  export const version: string;
}

// app.ts
import { greet, version } from "greeter";
console.log(greet("Ada"), version);`}
        </CodeBlock>
        <ContentStep number={1} title="declare">
          <p className="text-slate-300">
            Says &quot;this exists somewhere at runtime&quot; — TypeScript will not emit JS for
            it.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Ship with packages">
          <p className="text-slate-300">
            Modern libraries include their own{' '}
            <span className="font-mono text-sm text-web-400">.d.ts</span> (or generate them with{' '}
            <span className="font-mono text-sm text-web-400">declaration: true</span>).
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="@types packages and DefinitelyTyped">
        <p className="text-slate-300">
          When a library has no types, the community often publishes{' '}
          <span className="font-mono text-sm text-web-400">@types/package-name</span> on npm.
          Those packages live in the <strong className="text-white">DefinitelyTyped</strong>{' '}
          repository.
        </p>
        <CodeBlock title="Install community types">
{`# Example: types for a JS library named "lodash"
npm install --save-dev @types/lodash

# Node built-ins
npm install --save-dev @types/node`}
        </CodeBlock>
        <Example title="Mental model">
{`Your code
   │
   ├─ imports lodash (JS from node_modules/lodash)
   └─ types from @types/lodash (or bundled types)

TypeScript merges: "I know the JS exists AND I know its types."`}
        </Example>
        <Callout variant="tip" title="Check before adding @types">
          Many packages already bundle types. Look for{' '}
          <span className="font-mono text-sm text-web-400">&quot;types&quot;</span> in{' '}
          <span className="font-mono text-sm text-web-400">package.json</span> — if present, you
          usually do not need <span className="font-mono text-sm text-web-400">@types/…</span>.
        </Callout>
        <CodeBlock title="lib — built-in environments">
{`// tsconfig.json (concept)
{
  "compilerOptions": {
    "lib": ["ES2022", "DOM"]
  }
}

// lib = which built-in type defs to include
// DOM → document, window, HTMLElement
// ES2022 → Promise, Array methods, etc.`}
        </CodeBlock>
        <ContentStep number={3} title="Ambient globals">
          <p className="text-slate-300">
            Some <span className="font-mono text-sm text-web-400">.d.ts</span> files declare
            globals (e.g. <span className="font-mono text-sm text-web-400">declare const</span>)
            for scripts without modules — less common in modern apps.
          </p>
        </ContentStep>
        <Example title="When you need a quick local declare">
{`// shim.d.ts — temporary bridge for an untyped plugin
declare module "legacy-widget" {
  const Widget: {
    mount(el: HTMLElement): void;
  };
  export default Widget;
}`}
        </Example>
        <Callout variant="insight" title="DefinitelyTyped in one line">
          A huge shared catalog of declaration files maintained for JS libraries that do not ship
          their own types.
        </Callout>
        <Callout variant="tip" title="Write your own sparingly">
          Prefer upstream types. Local{' '}
          <span className="font-mono text-sm text-web-400">.d.ts</span> shims are fine as a bridge
          — replace them when the package adds real types.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          <><span className="font-mono text-sm text-web-400">.d.ts</span> files describe types without runtime code.</>,
          <><span className="font-mono text-sm text-web-400">@types/…</span> packages fill gaps for untyped libraries.</>,
          <>DefinitelyTyped is the community home for many of those packages.</>,
          <><span className="font-mono text-sm text-web-400">lib</span> in tsconfig selects built-in environment typings (DOM, ES…).</>,
        ]}
      />
    </LessonArticle>
  )
}
