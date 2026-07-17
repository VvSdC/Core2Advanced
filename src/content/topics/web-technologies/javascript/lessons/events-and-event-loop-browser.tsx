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

export function EventsAndEventLoopBrowser() {
  return (
    <LessonArticle>
      <Definition term="Events">
        <p>
          An <strong className="text-white">event</strong> is something that happened in the page:
          a click, a key press, a form submit, a timer finishing. You register{' '}
          <strong className="text-white">listeners</strong> so JavaScript can react.
        </p>
        <p className="mt-2 text-slate-300">
          The browser keeps a queue of work. Your click handler runs when it is that handler&apos;s
          turn — that scheduling story is the event loop at a beginner level.
        </p>
      </Definition>

      <Callout variant="beginner" title="Plain idea">
        HTML draws the button. JS says &quot;when this is clicked, run this function.&quot; That
        pairing is the heart of interactive pages.
      </Callout>

      <LessonSection title="addEventListener basics">
        <Flowchart
          title="User action → handler"
          chart={`flowchart LR
  A[User clicks] --> B[Browser creates Event]
  B --> C[Listener queue]
  C --> D[Your handler runs]`}
        />
        <CodeBlock title="Click, input, and submit">
{`const btn = document.querySelector("#save");
const field = document.querySelector("#email");
const form = document.querySelector("#signup");

btn.addEventListener("click", () => {
  console.log("Saved");
});

field.addEventListener("input", (event) => {
  console.log("Typing:", event.target.value);
});

form.addEventListener("submit", (event) => {
  event.preventDefault(); // stop full page reload
  console.log("Form data handled in JS");
});`}
        </CodeBlock>
        <ContentStep number={1} title="click">
          <p className="text-slate-300">
            Pointer activation on buttons, links, and almost any element.
          </p>
        </ContentStep>
        <ContentStep number={2} title="input">
          <p className="text-slate-300">
            Fires as the user types or changes a control — great for live validation.
          </p>
        </ContentStep>
        <ContentStep number={3} title="submit">
          <p className="text-slate-300">
            Form send attempt. Use{' '}
            <span className="font-mono text-sm text-web-400">preventDefault</span> when you handle
            the form in JavaScript instead of a classic full reload.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="The Event object">
        <p className="text-slate-300">
          Handlers receive an <span className="font-mono text-sm text-web-400">event</span> argument
          with details: which element was involved, mouse coords, key pressed, and helpers like{' '}
          <span className="font-mono text-sm text-web-400">preventDefault()</span>.
        </p>
        <CodeBlock title="Inspect a click">
{`document.querySelector("#box").addEventListener("click", (event) => {
  console.log(event.type);          // "click"
  console.log(event.target);        // deepest element clicked
  console.log(event.currentTarget); // element with the listener
  event.preventDefault();           // cancel default action if any
});`}
        </CodeBlock>
        <Example title="Common defaults you often cancel">
{`submit  → page navigation / reload
a click  → follow the href
keydown  → sometimes browser shortcuts
drag     → browser drag behaviors`}
        </Example>
        <Callout variant="tip" title="Named functions help">
          Prefer named handlers when you might remove them later with{' '}
          <span className="font-mono text-sm text-web-400">removeEventListener</span>. Anonymous
          arrows are harder to unregister.
        </Callout>
      </LessonSection>

      <LessonSection title="Bubbling (first look)">
        <p className="text-slate-300">
          After a handler on the target runs, many events{' '}
          <strong className="text-white">bubble</strong> up to parents. A click on a{' '}
          <span className="font-mono text-sm text-web-400">&lt;span&gt;</span> inside a{' '}
          <span className="font-mono text-sm text-web-400">&lt;div&gt;</span> can also notify the
          div — unless you stop it.
        </p>
        <CodeBlock title="See the bubble path">
{`document.body.addEventListener("click", (e) => {
  console.log("body heard click on", e.target.tagName);
});

document.querySelector("#card").addEventListener("click", (e) => {
  console.log("card handler");
  // e.stopPropagation(); // would stop the body listener
});`}
        </CodeBlock>
        <Callout variant="insight" title="Event loop teaser">
          Click handlers, timers, and fetch callbacks are scheduled work. JS runs one turn at a
          time on the main thread — long sync loops freeze the UI until they finish.
        </Callout>
        <Example title="Timer is also an event-ish callback">
{`console.log("A");
setTimeout(() => console.log("C (later)"), 0);
console.log("B");
// Order: A, B, then C`}
        </Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'addEventListener wires user actions to your functions.',
          'The event object describes what happened; preventDefault stops defaults.',
          'click, input, and submit cover most beginner UI work.',
          'Many events bubble to parents — the start of delegation and debugging.',
        ]}
      />
    </LessonArticle>
  )
}
