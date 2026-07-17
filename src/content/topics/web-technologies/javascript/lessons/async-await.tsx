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

export function AsyncAwait() {
  return (
    <LessonArticle>
      <Definition term="async / await">
        <p>
          An <span className="font-mono text-sm text-web-400">async</span> function always returns
          a Promise. Inside it, <span className="font-mono text-sm text-web-400">await</span> pauses
          that function until another Promise settles — then continues with the value (or throws on
          rejection).
        </p>
        <p className="mt-2 text-slate-300">
          It is the same Promise machinery with syntax that reads top-to-bottom like sync code.
        </p>
      </Definition>

      <Callout variant="beginner" title="Translation tip">
        <span className="font-mono text-sm text-web-400">await promise</span> ≈{' '}
        <span className="font-mono text-sm text-web-400">promise.then(value =&gt; …)</span> with
        errors flowing to try/catch.
      </Callout>

      <LessonSection title="async functions and await">
        <Flowchart
          title="await yields until settled"
          chart={`flowchart LR
  A[async fn starts] --> B[await promise]
  B --> C[fn suspends]
  C --> D[promise settles]
  D --> E[fn resumes with value]`}
        />
        <CodeBlock title="Basic shape">
{`async function loadMessage() {
  const value = await Promise.resolve("hello");
  return value.toUpperCase();
}

loadMessage().then((msg) => console.log(msg)); // HELLO`}
        </CodeBlock>
        <ContentStep number={1} title="Mark async">
          <p className="text-slate-300">
            Put <span className="font-mono text-sm text-web-400">async</span> before the function.
            Callers receive a Promise even if you{' '}
            <span className="font-mono text-sm text-web-400">return</span> a plain string.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Await inside">
          <p className="text-slate-300">
            Only valid inside async functions (or at top level in modules). It unwraps fulfilled
            values.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Sequence steps">
          <p className="text-slate-300">
            Write linear steps instead of nesting{' '}
            <span className="font-mono text-sm text-web-400">then</span> callbacks.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="try / catch with await">
        <CodeBlock title="Errors become catchable throws">
{`async function getUser(id) {
  try {
    if (!id) throw new Error("id required");
    const user = await Promise.resolve({ id, name: "Ada" });
    return user;
  } catch (err) {
    console.error("Failed:", err.message);
    return null;
  } finally {
    console.log("getUser finished");
  }
}

await getUser(1);
await getUser(null);`}
        </CodeBlock>
        <Example title="Equivalent Promise chain">
{`// async/await style
async function double() {
  const n = await Promise.resolve(21);
  return n * 2;
}

// same idea with then
function doubleThen() {
  return Promise.resolve(21).then((n) => n * 2);
}`}
        </Example>
        <Callout variant="tip" title="Parallel when independent">
          Do not await in a slow series if tasks do not depend on each other. Start them, then{' '}
          <span className="font-mono text-sm text-web-400">await Promise.all([...])</span>.
        </Callout>
        <CodeBlock title="Sequential vs parallel">
{`async function sequential() {
  const a = await fetchSlow("a");
  const b = await fetchSlow("b"); // waits for a first
  return [a, b];
}

async function parallel() {
  const [a, b] = await Promise.all([
    fetchSlow("a"),
    fetchSlow("b"),
  ]);
  return [a, b];
}

function fetchSlow(label) {
  return new Promise((r) => setTimeout(() => r(label), 200));
}`}
        </CodeBlock>
      </LessonSection>

      <LessonSection title="Calling async from sync land">
        <p className="text-slate-300">
          Event handlers are often sync. Call an async function and handle its Promise — or make
          the handler async carefully.
        </p>
        <CodeBlock title="Button handler pattern">
{`async function save() {
  await Promise.resolve("saved");
  console.log("ok");
}

document.querySelector("#btn")?.addEventListener("click", () => {
  save().catch((err) => console.error(err));
});`}
        </CodeBlock>
        <Callout variant="insight" title="await does not block the whole page">
          Only the async function waits. Other scripts and UI events can still run while that
          Promise is pending.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'async functions return Promises; await unwraps other Promises.',
          'try/catch works naturally with await rejections.',
          'async/await is equivalent to then/catch, with clearer flow.',
          'Use Promise.all when independent awaits should run in parallel.',
        ]}
      />
    </LessonArticle>
  )
}
