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

export function Promises() {
  return (
    <LessonArticle>
      <Definition term="Promise">
        <p>
          A <strong className="text-white">Promise</strong> is an object that represents a value
          that may arrive later. It starts <span className="font-mono text-sm text-web-400">pending</span>,
          then becomes <span className="font-mono text-sm text-web-400">fulfilled</span> with a
          result or <span className="font-mono text-sm text-web-400">rejected</span> with an error.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: a receipt for an online order — pending, delivered, or cancelled — that you can
          attach &quot;when delivered, do this&quot; instructions to.
        </p>
      </Definition>

      <Callout variant="beginner" title="Why Promises help">
        They standardize async success and failure, chain steps with{' '}
        <span className="font-mono text-sm text-web-400">then</span>, and collect errors with{' '}
        <span className="font-mono text-sm text-web-400">catch</span> instead of nested pyramids.
      </Callout>

      <LessonSection title="States and creation">
        <Flowchart
          title="Promise lifecycle"
          chart={`flowchart LR
  A[pending] --> B[fulfilled]
  A --> C[rejected]
  B --> D[then handlers]
  C --> E[catch handlers]
  B --> F[finally]
  C --> F`}
        />
        <CodeBlock title="new Promise">
{`const later = new Promise((resolve, reject) => {
  const ok = true;
  setTimeout(() => {
    if (ok) resolve("done");
    else reject(new Error("failed"));
  }, 200);
});

later
  .then((value) => console.log(value))
  .catch((err) => console.error(err.message))
  .finally(() => console.log("settled"));`}
        </CodeBlock>
        <ContentStep number={1} title="resolve">
          <p className="text-slate-300">
            Marks success and passes the result to the next{' '}
            <span className="font-mono text-sm text-web-400">then</span>.
          </p>
        </ContentStep>
        <ContentStep number={2} title="reject">
          <p className="text-slate-300">
            Marks failure; jumps to the nearest{' '}
            <span className="font-mono text-sm text-web-400">catch</span>.
          </p>
        </ContentStep>
        <ContentStep number={3} title="finally">
          <p className="text-slate-300">
            Runs after settle either way — useful for hiding spinners or cleanup.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="then chaining">
        <CodeBlock title="Pass values down the chain">
{`Promise.resolve(2)
  .then((n) => n * 3)
  .then((n) => {
    console.log(n); // 6
    return n + 1;
  })
  .then((n) => console.log(n)); // 7`}
        </CodeBlock>
        <Example title="Helpers you will see">
{`Promise.resolve(value)  // already fulfilled
Promise.reject(error)    // already rejected
fetch(url)               // returns a Promise in browsers`}
        </Example>
        <Callout variant="tip" title="Always catch">
          Unhandled rejections log scary console warnings. Attach{' '}
          <span className="font-mono text-sm text-web-400">.catch</span> or use try/catch with
          async/await in the next lesson.
        </Callout>
      </LessonSection>

      <LessonSection title="Promise.all intro">
        <p className="text-slate-300">
          <span className="font-mono text-sm text-web-400">Promise.all</span> waits for every
          promise in a list. If all succeed, you get an array of results. If any rejects, the whole
          all rejects.
        </p>
        <CodeBlock title="Run independent work together">
{`const user = Promise.resolve({ name: "Ada" });
const posts = Promise.resolve([1, 2, 3]);

Promise.all([user, posts]).then(([u, p]) => {
  console.log(u.name, "has", p.length, "posts");
});

// Promise.allSettled waits for all, even if some fail (newer, useful too)`}
        </CodeBlock>
        <Callout variant="insight" title="Mental model">
          A Promise is a placeholder + two mailboxes (success/failure). Methods register what to do
          when mail arrives. async/await is nicer syntax on top of the same mailboxes.
        </Callout>
        <CodeBlock title="Wrap a callback API in a Promise">
{`function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

wait(300).then(() => console.log("ready"));`}
        </CodeBlock>
        <Example title="Race vs all (quick map)">
{`Promise.all     — every promise must fulfill
Promise.race    — first to settle wins (success or fail)
Promise.any     — first fulfillment wins (ignores rejects until all fail)`}
        </Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Promises are pending, then fulfilled or rejected.',
          'then handles success, catch handles failure, finally always runs.',
          'Chaining flattens multi-step async flows.',
          'Promise.all waits for a list of promises (all must succeed).',
        ]}
      />
    </LessonArticle>
  )
}
