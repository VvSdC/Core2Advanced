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

export function ModulesAndNamespaces() {
  return (
    <LessonArticle>
      <Definition term="Modules and types">
        <p>
          Modern TypeScript projects use <strong className="text-white">ES modules</strong> —{' '}
          <span className="font-mono text-sm text-web-400">import</span> /{' '}
          <span className="font-mono text-sm text-web-400">export</span> — for both values and
          types.
        </p>
        <p className="mt-2 text-slate-300">
          <span className="font-mono text-sm text-web-400">namespace</span> exists for older code;
          prefer modules for anything new.
        </p>
      </Definition>

      <Callout variant="beginner" title="One file = one module">
        Each <span className="font-mono text-sm text-web-400">.ts</span> file with import/export is
        a module. Types and values share the same module system.
      </Callout>

      <LessonSection title="ES modules with types">
        <Flowchart
          title="Import graph"
          chart={`flowchart LR
  A[math.ts] -->|export| B[add, multiply]
  C[app.ts] -->|import| A
  D[types.ts] -->|export type| E[User]
  C -->|import type| D`}
        />
        <CodeBlock title="math.ts — values">
{`export function add(a: number, b: number): number {
  return a + b;
}

export const PI = 3.14159;

export type Pair = [number, number];`}
        </CodeBlock>
        <CodeBlock title="app.ts — consume">
{`import { add, PI, type Pair } from "./math";

const sum = add(2, 3);
const point: Pair = [1, 2];
console.log(sum, PI, point);`}
        </CodeBlock>
        <ContentStep number={1} title="Named exports">
          <p className="text-slate-300">
            Export functions, consts, classes, and types with{' '}
            <span className="font-mono text-sm text-web-400">export</span>.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Default export">
          <p className="text-slate-300">
            One default per file is allowed; named exports scale better for libraries.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="import type — type-only imports">
        <p className="text-slate-300">
          When you only need a type for annotations, use{' '}
          <span className="font-mono text-sm text-web-400">import type</span>. It is erased at
          compile time and never becomes a runtime require.
        </p>
        <CodeBlock title="Type-only import">
{`// user.ts
export type User = { id: string; name: string };
export function greet(u: User): string {
  return "Hi " + u.name;
}

// profile.ts
import type { User } from "./user";
import { greet } from "./user";

function show(user: User): void {
  console.log(greet(user));
}`}
        </CodeBlock>
        <Example title="Inline type modifier">
{`import { greet, type User } from "./user";

const ada: User = { id: "1", name: "Ada" };
greet(ada);`}
        </Example>
        <Callout variant="tip" title="Why it matters">
          Type-only imports avoid circular runtime dependencies and make intent clear: this import
          is for the type checker only.
        </Callout>
      </LessonSection>

      <LessonSection title="Namespaces — legacy note">
        <CodeBlock title="Old style (prefer modules instead)">
{`// Avoid in new code
namespace Geometry {
  export function area(w: number, h: number): number {
    return w * h;
  }
}

Geometry.area(3, 4);`}
        </CodeBlock>
        <Callout variant="insight" title="Prefer modules">
          Namespaces were useful before ES modules were standard. Today:{' '}
          <span className="font-mono text-sm text-web-400">export</span> /{' '}
          <span className="font-mono text-sm text-web-400">import</span> + folders. You may still
          see namespaces in older ambient declaration files.
        </Callout>
        <ContentStep number={3} title="Where namespaces still appear">
          <p className="text-slate-300">
            Legacy <span className="font-mono text-sm text-web-400">.d.ts</span> files and some
            global script patterns. For app code, stick to modules.
          </p>
        </ContentStep>
        <Callout variant="tip" title="Re-exports">
          Barrel files can re-export values with{' '}
          <span className="font-mono text-sm text-web-400">export {'{'} add {'}'} from &quot;./math&quot;</span>{' '}
          and types with{' '}
          <span className="font-mono text-sm text-web-400">export type</span> from the same pattern.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          <>Use ES modules for values and types in modern TypeScript.</>,
          <><span className="font-mono text-sm text-web-400">import type</span> imports types that erase at compile time.</>,
          <>You can mix <span className="font-mono text-sm text-web-400">type</span> modifiers in a normal import list.</>,
          <>Namespaces are legacy — prefer modules for new projects.</>,
        ]}
      />
    </LessonArticle>
  )
}
