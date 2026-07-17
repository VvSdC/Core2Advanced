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

export function TsWithReactAndNodePreview() {
  return (
    <LessonArticle>
      <Definition term="TypeScript beyond the browser tutorial">
        <p>
          Real apps use TypeScript with <strong className="text-white">React</strong> (
          <span className="font-mono text-sm text-web-400">.tsx</span> components) and{' '}
          <strong className="text-white">Node.js</strong> (servers, CLIs, tooling).
        </p>
        <p className="mt-2 text-slate-300">
          This lesson is a short preview — mental models only. Deep tracks live under React.js and
          Node.js.
        </p>
      </Definition>

      <Callout variant="beginner" title="Same language, new hosts">
        Types still erase. React and Node run JavaScript; TypeScript only checks before you ship.
      </Callout>

      <LessonSection title=".tsx and typing props">
        <Flowchart
          title="Props as a type"
          chart={`flowchart LR
  A[Props type] --> B[Component]
  B --> C[JSX uses props safely]
  C --> D[Wrong prop = compile error]`}
        />
        <CodeBlock title="Minimal typed component">
{`// Button.tsx
type ButtonProps = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
};

export function Button({ label, onClick, disabled = false }: ButtonProps) {
  return (
    <button type="button" disabled={disabled} onClick={onClick}>
      {label}
    </button>
  );
}

// Usage
<Button label="Save" onClick={() => console.log("saved")} />
// <Button label={42} onClick={() => {}} /> // error — label must be string`}
        </CodeBlock>
        <ContentStep number={1} title=".tsx = TS + JSX">
          <p className="text-slate-300">
            The file extension tells the compiler (and tooling) that JSX is allowed alongside
            types.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Props mental model">
          <p className="text-slate-300">
            Describe the component&apos;s inputs as a type or interface. Destructure with defaults
            for optionals.
          </p>
        </ContentStep>
        <Example title="Children briefly">
{`type CardProps = {
  title: string;
  children: React.ReactNode;
};

function Card({ title, children }: CardProps) {
  return (
    <section>
      <h2>{title}</h2>
      {children}
    </section>
  );
}`}
        </Example>
        <Callout variant="info" title="Next: React.js track">
          Events, hooks, context, and generic components are covered in the React track with
          TypeScript woven in.
        </Callout>
      </LessonSection>

      <LessonSection title="Node + TypeScript briefly">
        <CodeBlock title="Build or run">
{`// package.json scripts (typical patterns)
{
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc -p tsconfig.json",
    "start": "node dist/index.js"
  }
}

// src/index.ts
import { readFile } from "node:fs/promises";

async function main(): Promise<void> {
  const text = await readFile("./data.txt", "utf8");
  console.log(text.length);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});`}
        </CodeBlock>
        <Callout variant="tip" title="ts-node / tsx / build">
          Dev tools like <span className="font-mono text-sm text-web-400">tsx</span> or{' '}
          <span className="font-mono text-sm text-web-400">ts-node</span> run TypeScript directly.
          Production often compiles with <span className="font-mono text-sm text-web-400">tsc</span>{' '}
          (or a bundler) to plain JS first.
        </Callout>
        <Callout variant="info" title="Next: Node.js track">
          Modules, HTTP servers, env config, and typing Express/Fastify belong in the Node.js
          track — bring your TypeScript foundations there.
        </Callout>
        <ContentStep number={3} title="@types/node">
          <p className="text-slate-300">
            Install <span className="font-mono text-sm text-web-400">@types/node</span> so{' '}
            <span className="font-mono text-sm text-web-400">process</span>,{' '}
            <span className="font-mono text-sm text-web-400">Buffer</span>, and{' '}
            <span className="font-mono text-sm text-web-400">node:fs</span> are typed.
          </p>
        </ContentStep>
      </LessonSection>

      <KeyTakeaways
        items={[
          <><span className="font-mono text-sm text-web-400">.tsx</span> files mix TypeScript with JSX.</>,
          <>Type React props as an object type; optionals use <span className="font-mono text-sm text-web-400">?</span>.</>,
          <>Node apps compile or use a TS runner; install <span className="font-mono text-sm text-web-400">@types/node</span> for builtins.</>,
          <>Continue in the React.js and Node.js tracks for full stack depth.</>,
        ]}
      />
    </LessonArticle>
  )
}
