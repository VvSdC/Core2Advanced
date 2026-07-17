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

export function GenericsAdvanced() {
  return (
    <LessonArticle>
      <Definition term="keyof and richer generics">
        <p>
          <span className="font-mono text-sm text-web-400">keyof</span> turns an object type into
          a union of its property names. Combined with generics, you can safely pick fields by
          name.
        </p>
        <p className="mt-2 text-slate-300">
          This lesson also covers default type parameters and a quick look at generic interfaces
          and classes.
        </p>
      </Definition>

      <Callout variant="beginner" title="Mental picture">
        If <span className="font-mono text-sm text-web-400">User</span> has{' '}
        <span className="font-mono text-sm text-web-400">id</span> and{' '}
        <span className="font-mono text-sm text-web-400">name</span>, then{' '}
        <span className="font-mono text-sm text-web-400">keyof User</span> is{' '}
        <span className="font-mono text-sm text-web-400">&quot;id&quot; | &quot;name&quot;</span>.
      </Callout>

      <LessonSection title="keyof basics">
        <Flowchart
          title="Object type → key union"
          chart={`flowchart LR
  A[type User] --> B[keyof User]
  B --> C["id" | "name" | "email"]`}
        />
        <CodeBlock title="Reading a property safely">
{`type User = {
  id: string;
  name: string;
  email: string;
};

type UserKey = keyof User; // "id" | "name" | "email"

function getProp<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const u: User = { id: "1", name: "Ada", email: "a@ex.com" };
const name = getProp(u, "name"); // string
// getProp(u, "age"); // error — "age" is not a key of User`}
        </CodeBlock>
        <ContentStep number={1} title="K extends keyof T">
          <p className="text-slate-300">
            Restricts <span className="font-mono text-sm text-web-400">K</span> to real keys of{' '}
            <span className="font-mono text-sm text-web-400">T</span>.
          </p>
        </ContentStep>
        <ContentStep number={2} title="T[K] indexed access">
          <p className="text-slate-300">
            The return type is whatever that property holds — not{' '}
            <span className="font-mono text-sm text-web-400">any</span>.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Default type parameters">
        <p className="text-slate-300">
          Like default function arguments, generics can have defaults when the caller omits them.
        </p>
        <CodeBlock title="Default = string">
{`type ApiResponse<T = string> = {
  ok: boolean;
  data: T;
};

const text: ApiResponse = { ok: true, data: "done" };
//                       ↑ T defaults to string

const nums: ApiResponse<number[]> = {
  ok: true,
  data: [1, 2, 3],
};`}
        </CodeBlock>
        <Example title="Create with a default">
{`function createBox<T = unknown>(value?: T) {
  return { value: value as T | undefined };
}

const empty = createBox();           // T = unknown
const labeled = createBox("ready");  // T = string`}
        </Example>
      </LessonSection>

      <LessonSection title="Generic interfaces and classes">
        <CodeBlock title="Interface">
{`interface Repository<T> {
  getById(id: string): T | undefined;
  save(item: T): void;
}

type Product = { id: string; title: string };

const products: Repository<Product> = {
  getById(id) {
    return id === "p1" ? { id: "p1", title: "Mug" } : undefined;
  },
  save(item) {
    console.log("saved", item.title);
  },
};`}
        </CodeBlock>
        <CodeBlock title="Class">
{`class Stack<T> {
  private items: T[] = [];

  push(item: T): void {
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.pop();
  }
}

const numbers = new Stack<number>();
numbers.push(3);
numbers.push(5);
const top = numbers.pop(); // number | undefined`}
        </CodeBlock>
        <Callout variant="insight" title="Same idea everywhere">
          Functions, interfaces, and classes all use{' '}
          <span className="font-mono text-sm text-web-400">&lt;T&gt;</span> the same way: one
          placeholder, filled at the use site.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          <><span className="font-mono text-sm text-web-400">keyof T</span> is a union of property names.</>,
          <><span className="font-mono text-sm text-web-400">K extends keyof T</span> + <span className="font-mono text-sm text-web-400">T[K]</span> unlocks safe field access.</>,
          <>Default type params fill in when callers omit them.</>,
          <>Generic interfaces and classes reuse the same &lt;T&gt; pattern.</>,
        ]}
      />
    </LessonArticle>
  )
}
