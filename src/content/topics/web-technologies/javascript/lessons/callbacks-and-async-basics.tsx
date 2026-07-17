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

export function CallbacksAndAsyncBasics() {
  return (
    <LessonArticle>
      <Definition term="Asynchronous code">
        <p>
          <strong className="text-white">Async</strong> work finishes later — network requests,
          timers, file reads — while JavaScript keeps the page responsive. You schedule a{' '}
          <strong className="text-white">callback</strong> (a function to run when the work is
          done) instead of freezing until the result arrives.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: you order coffee and get a buzzer. You do not stand frozen at the counter; when
          the buzzer rings, you pick up the cup.
        </p>
      </Definition>

      <Callout variant="beginner" title="Why async is needed">
        A single long wait on the main thread freezes clicks and animations. Timers and network
        APIs hand work to the browser, then call you back later.
      </Callout>

      <LessonSection title="Sync vs async feeling">
        <Flowchart
          title="Timer schedules a later turn"
          chart={`flowchart LR
  A[Run line 1] --> B[setTimeout schedules]
  B --> C[Run remaining sync lines]
  C --> D[Later: callback runs]`}
        />
        <CodeBlock title="setTimeout is the classic demo">
{`console.log("1) start");

setTimeout(() => {
  console.log("3) after 500ms");
}, 500);

console.log("2) still running sync code");
// Order: 1, 2, then later 3`}
        </CodeBlock>
        <ContentStep number={1} title="Register interest">
          <p className="text-slate-300">
            Pass a function to an API like{' '}
            <span className="font-mono text-sm text-web-400">setTimeout</span> or a click listener.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Continue immediately">
          <p className="text-slate-300">
            The rest of your sync code keeps going — the callback has not run yet.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Callback later">
          <p className="text-slate-300">
            When the timer or event fires, your function runs on a future turn of the event loop.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Callbacks as a pattern">
        <CodeBlock title="Named callback style">
{`function fetchUserFake(id, onDone) {
  setTimeout(() => {
    onDone({ id, name: "Ada" });
  }, 300);
}

fetchUserFake(1, (user) => {
  console.log("Got", user.name);
});`}
        </CodeBlock>
        <Example title="Error-first style (Node classic)">
{`function readFake(path, callback) {
  setTimeout(() => {
    if (!path) return callback(new Error("No path"));
    callback(null, "file contents");
  }, 100);
}

readFake("notes.txt", (err, data) => {
  if (err) return console.error(err);
  console.log(data);
});`}
        </Example>
        <Callout variant="insight" title="Callback hell teaser">
          Nesting callbacks inside callbacks becomes a pyramid of doom — hard to read and harder to
          handle errors. Promises and async/await were invented to flatten that story.
        </Callout>
        <CodeBlock title="The pyramid (what to avoid)">
{`doA((a) => {
  doB(a, (b) => {
    doC(b, (c) => {
      doD(c, (d) => {
        console.log(d);
      });
    });
  });
});`}
        </CodeBlock>
      </LessonSection>

      <LessonSection title="Clear a timer">
        <CodeBlock title="setTimeout / clearTimeout">
{`const id = setTimeout(() => console.log("never"), 2000);
clearTimeout(id);

let ticks = 0;
const intervalId = setInterval(() => {
  ticks += 1;
  console.log("tick", ticks);
  if (ticks === 3) clearInterval(intervalId);
}, 200);`}
        </CodeBlock>
        <Callout variant="tip" title="Next lessons">
          Promises wrap async success/failure in a standard object. async/await makes that object
          feel almost like sync code — with try/catch.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Async work finishes later so the UI can stay responsive.',
          'A callback is the function you want run when work completes.',
          'setTimeout demonstrates scheduling without blocking sync code.',
          'Deep nesting (callback hell) motivates Promises and async/await.',
        ]}
      />
    </LessonArticle>
  )
}
