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

export function AsyncAndPromisesTyping() {
  return (
    <LessonArticle>
      <Definition term="Typing async work">
        <p>
          A <span className="font-mono text-sm text-web-400">Promise&lt;T&gt;</span> is a promise
          that will eventually produce a value of type{' '}
          <span className="font-mono text-sm text-web-400">T</span> (or reject with an error).
        </p>
        <p className="mt-2 text-slate-300">
          <span className="font-mono text-sm text-web-400">async</span> functions always return a
          Promise — TypeScript tracks what resolves inside.
        </p>
      </Definition>

      <Callout variant="beginner" title="T is the success value">
        <span className="font-mono text-sm text-web-400">Promise&lt;User&gt;</span> means
        &quot;when this finishes successfully, you get a User.&quot; Rejections are not modeled in
        the type (they are still runtime Errors).
      </Callout>

      <LessonSection title="Promise&lt;T&gt; and async returns">
        <Flowchart
          title="async → Promise"
          chart={`flowchart LR
  A[async function] --> B[Always returns Promise]
  B --> C[await unwraps T]
  C --> D[try/catch for errors]`}
        />
        <CodeBlock title="Explicit Promise types">
{`function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function loadLabel(): Promise<string> {
  return Promise.resolve("ready");
}

async function demo(): Promise<string> {
  await delay(100);
  const label = await loadLabel();
  return label.toUpperCase();
}`}
        </CodeBlock>
        <ContentStep number={1} title="Return type">
          <p className="text-slate-300">
            Write <span className="font-mono text-sm text-web-400">Promise&lt;string&gt;</span> on
            async functions (or let TS infer it from{' '}
            <span className="font-mono text-sm text-web-400">return</span>).
          </p>
        </ContentStep>
        <ContentStep number={2} title="await narrows">
          <p className="text-slate-300">
            <span className="font-mono text-sm text-web-400">await</span> turns{' '}
            <span className="font-mono text-sm text-web-400">Promise&lt;T&gt;</span> into{' '}
            <span className="font-mono text-sm text-web-400">T</span>.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Typing fetch JSON carefully">
        <p className="text-slate-300">
          <span className="font-mono text-sm text-web-400">response.json()</span> is typed as{' '}
          <span className="font-mono text-sm text-web-400">Promise&lt;any&gt;</span> in many setups
          — or you treat the body as <span className="font-mono text-sm text-web-400">unknown</span>.
          Never trust the network blindly.
        </p>
        <CodeBlock title="unknown first, then validate">
{`type Todo = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
};

function isTodo(value: unknown): value is Todo {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.id === "number" &&
    typeof v.title === "string" &&
    typeof v.completed === "boolean"
  );
}

async function fetchTodo(id: number): Promise<Todo> {
  const res = await fetch(
    "https://jsonplaceholder.typicode.com/todos/" + id
  );
  if (!res.ok) {
    throw new Error("HTTP " + res.status);
  }
  const data: unknown = await res.json();
  if (!isTodo(data)) {
    throw new Error("Unexpected JSON shape");
  }
  return data;
}`}
        </CodeBlock>
        <Example title="Quick assert (less safe)">
{`async function fetchTodoFast(id: number): Promise<Todo> {
  const res = await fetch(
    "https://jsonplaceholder.typicode.com/todos/" + id
  );
  if (!res.ok) throw new Error("HTTP " + res.status);
  // You are telling TS "trust me" — use only for trusted APIs
  return (await res.json()) as Todo;
}`}
        </Example>
        <Callout variant="insight" title="Prefer validate over assert">
          Guards and schema libraries (Zod, etc.) catch bad payloads at runtime. Assertions only
          silence the compiler.
        </Callout>
        <ContentStep number={3} title="Error handling stays runtime">
          <p className="text-slate-300">
            <span className="font-mono text-sm text-web-400">Promise&lt;T&gt;</span> does not type
            rejections. Still use <span className="font-mono text-sm text-web-400">try/catch</span>{' '}
            around await.
          </p>
        </ContentStep>
        <CodeBlock title="try/catch with typed success">
{`async function main(): Promise<void> {
  try {
    const todo = await fetchTodo(1);
    console.log(todo.title);
  } catch (err) {
    console.error(err instanceof Error ? err.message : err);
  }
}`}
        </CodeBlock>
      </LessonSection>

      <KeyTakeaways
        items={[
          <><span className="font-mono text-sm text-web-400">Promise&lt;T&gt;</span> describes the resolved value type.</>,
          <>async functions return Promises; await unwraps T.</>,
          <>Treat JSON as unknown, then validate before using fields.</>,
          <><span className="font-mono text-sm text-web-400">as Todo</span> is convenient but can lie — prefer type guards.</>,
        ]}
      />
    </LessonArticle>
  )
}
