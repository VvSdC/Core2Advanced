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

export function InstallingAndTsconfig() {
  return (
    <LessonArticle>
      <Definition term="Installing TypeScript and tsconfig">
        <p>
          You add the <strong className="text-white">typescript</strong> package, then create a{' '}
          <span className="font-mono text-sm text-web-400">tsconfig.json</span> — a settings file
          that tells <span className="font-mono text-sm text-web-400">tsc</span> how strict to be
          and where files live.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: npm installs the tools;{' '}
          <span className="text-web-400">tsconfig is the recipe card</span> for how those tools
          cook your project.
        </p>
      </Definition>

      <Callout variant="beginner" title="You already know npm from JS tooling">
        Same habit as other Node projects:{' '}
        <span className="font-mono text-sm text-web-400">package.json</span> lists dependencies;{' '}
        you install TypeScript as a dev dependency.
      </Callout>

      <LessonSection title="Quick setup from zero">
        <Flowchart
          title="Minimal project setup"
          chart={`flowchart TB
  INIT[npm init -y]
  ADD[npm install -D typescript]
  CFG[npx tsc --init]
  SRC[Write src/index.ts]
  BUILD[npx tsc]
  INIT --> ADD --> CFG --> SRC --> BUILD`}
        />
        <ContentStep number={1} title="Create a package">
          <p className="text-slate-300">
            In an empty folder:{' '}
            <span className="font-mono text-sm text-web-400">npm init -y</span> creates{' '}
            <span className="font-mono text-sm text-web-400">package.json</span>.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Install TypeScript">
          <p className="text-slate-300">
            <span className="font-mono text-sm text-web-400">npm install -D typescript</span> adds{' '}
            the compiler locally. Use{' '}
            <span className="font-mono text-sm text-web-400">npx tsc</span> to run it.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Generate tsconfig">
          <p className="text-slate-300">
            <span className="font-mono text-sm text-web-400">npx tsc --init</span> writes a starter{' '}
            <span className="font-mono text-sm text-web-400">tsconfig.json</span> you can edit.
          </p>
        </ContentStep>
        <CodeBlock title="Commands to remember">
{`npm init -y
npm install -D typescript
npx tsc --init
npx tsc            # type-check and emit
npx tsc --noEmit   # check only, no .js output`}
        </CodeBlock>
      </LessonSection>

      <LessonSection title="Key tsconfig options (simple explanations)">
        <p className="text-slate-300">
          You do not need every option on day one. These five cover most beginner projects.
        </p>
        <ContentStep number={1} title="target">
          <p className="text-slate-300">
            Which JS version to emit — e.g.{' '}
            <span className="font-mono text-sm text-web-400">&quot;ES2020&quot;</span>. Newer
            targets keep modern syntax; older targets rewrite for older browsers.
          </p>
        </ContentStep>
        <ContentStep number={2} title="module">
          <p className="text-slate-300">
            Module format for imports/exports — e.g.{' '}
            <span className="font-mono text-sm text-web-400">&quot;ESNext&quot;</span> or{' '}
            <span className="font-mono text-sm text-web-400">&quot;CommonJS&quot;</span> for classic
            Node.
          </p>
        </ContentStep>
        <ContentStep number={3} title="strict">
          <p className="text-slate-300">
            Turns on a bundle of safer checks (
            <span className="font-mono text-sm text-web-400">strictNullChecks</span>, etc.). Start
            with <span className="font-mono text-sm text-web-400">true</span> — it teaches good
            habits.
          </p>
        </ContentStep>
        <ContentStep number={4} title="rootDir and outDir">
          <p className="text-slate-300">
            <span className="font-mono text-sm text-web-400">rootDir</span> = where your{' '}
            <span className="font-mono text-sm text-web-400">.ts</span> lives (often{' '}
            <span className="font-mono text-sm text-web-400">&quot;./src&quot;</span>).{' '}
            <span className="font-mono text-sm text-web-400">outDir</span> = where{' '}
            <span className="font-mono text-sm text-web-400">.js</span> is written (often{' '}
            <span className="font-mono text-sm text-web-400">&quot;./dist&quot;</span>).
          </p>
        </ContentStep>
        <Example title="Minimal tsconfig snippet">
{`{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "strict": true,
    "rootDir": "./src",
    "outDir": "./dist",
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*"]
}`}
        </Example>
        <Callout variant="tip" title="Bundlers vs bare tsc">
          Vite/Next often handle emit for you; you still keep a{' '}
          <span className="font-mono text-sm text-web-400">tsconfig.json</span> so the editor and
          type checker share the same rules.
        </Callout>
      </LessonSection>

      <LessonSection title="First file">
        <CodeBlock title="src/index.ts">
{`const message: string = 'TypeScript is ready';
console.log(message);

function add(a: number, b: number): number {
  return a + b;
}

console.log(add(2, 3)); // 5`}
        </CodeBlock>
        <Callout variant="info" title="Verify">
          Run <span className="font-mono text-sm text-web-400">npx tsc</span>, then open{' '}
          <span className="font-mono text-sm text-web-400">dist/index.js</span> — types should be
          gone, logic intact.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Install typescript as a dev dependency; run it with npx tsc.',
          'tsc --init creates tsconfig.json — the project’s type and emit settings.',
          'target / module control output JS; strict enables safer checks.',
          'rootDir and outDir separate source (.ts) from emitted (.js).',
        ]}
      />
    </LessonArticle>
  )
}
