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

export function EventDelegation() {
  return (
    <LessonArticle>
      <Definition term="Event delegation">
        <p>
          <strong className="text-white">Event delegation</strong> means attaching one listener to
          a parent, then deciding what to do based on which child was actually clicked (or
          activated). You lean on bubbling instead of wiring every child separately.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: one receptionist for the whole floor — they look at who walked in, then route
          the request — instead of a doorbell on every office.
        </p>
      </Definition>

      <Callout variant="beginner" title="When it shines">
        Dynamic lists, tables, and menus that add or remove rows often. New items are covered
        automatically because the parent listener never left.
      </Callout>

      <LessonSection title="Why delegate">
        <Flowchart
          title="Many children, one listener"
          chart={`flowchart TB
  A[Parent ul] -->|bubble| B[Single click listener]
  C[li Item A] --> A
  D[li Item B] --> A
  E[li Item C later] --> A
  B --> F[Check event.target]`}
        />
        <ContentStep number={1} title="Fewer listeners">
          <p className="text-slate-300">
            Hundreds of buttons do not each need their own handler. Memory and setup stay simpler.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Works for future nodes">
          <p className="text-slate-300">
            Items created after page load still bubble to the same parent — no re-binding loop.
          </p>
        </ContentStep>
        <ContentStep number={3} title="One place to maintain">
          <p className="text-slate-300">
            Behavior lives in one function. Easier to read than sprinkling handlers everywhere.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="target vs currentTarget">
        <p className="text-slate-300">
          <span className="font-mono text-sm text-web-400">event.target</span> is the deepest
          element that received the event.{' '}
          <span className="font-mono text-sm text-web-400">event.currentTarget</span> is the
          element whose listener is running (usually the parent you attached to).
        </p>
        <Example title="Click a span inside a button">
{`<button id="wrap"><span>Label</span></button>

// If listener is on #wrap:
// target        → <span> (or whatever was clicked)
// currentTarget → <button id="wrap">`}
        </Example>
        <CodeBlock title="Log both to feel the difference">
{`const list = document.querySelector("#menu");

list.addEventListener("click", (event) => {
  console.log("target:", event.target);
  console.log("currentTarget:", event.currentTarget);
});`}
        </CodeBlock>
        <Callout variant="tip" title="closest is your friend">
          Clicks may hit nested text or icons. Use{' '}
          <span className="font-mono text-sm text-web-400">event.target.closest(&quot;selector&quot;)</span>{' '}
          to find the meaningful parent row or button.
        </Callout>
      </LessonSection>

      <LessonSection title="Real pattern: todo list">
        <CodeBlock title="One listener for delete buttons">
{`const list = document.querySelector("#todos");

list.addEventListener("click", (event) => {
  const btn = event.target.closest("[data-action='delete']");
  if (!btn || !list.contains(btn)) return;

  const item = btn.closest("li");
  item?.remove();
});

// Later, new items still work:
function addTodo(text) {
  const li = document.createElement("li");
  li.innerHTML = \`
    <span></span>
    <button type="button" data-action="delete">×</button>
  \`;
  li.querySelector("span").textContent = text;
  list.append(li);
}

addTodo("Write delegation lesson");
addTodo("Practice with a list");`}
        </CodeBlock>
        <Callout variant="insight" title="Guard the match">
          Always check that the click came from something you care about. Ignoring unrelated
          clicks keeps the handler calm and correct.
        </Callout>
        <Example title="Delegation checklist">
{`1. Attach listener to a stable parent
2. On event, find the actionable element (closest)
3. Confirm it belongs under that parent
4. Run the action (toggle, delete, select…)`}
        </Example>
        <CodeBlock title="Toggle active tab with delegation">
{`const tabs = document.querySelector("[data-tabs]");

tabs.addEventListener("click", (event) => {
  const tab = event.target.closest("[data-tab]");
  if (!tab) return;

  tabs.querySelectorAll("[data-tab]").forEach((el) => {
    el.classList.toggle("is-active", el === tab);
  });
});`}
        </CodeBlock>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Delegation uses bubbling: one parent listener serves many children.',
          'target is what was clicked; currentTarget is the listener element.',
          'closest() finds the actionable ancestor when clicks hit nested nodes.',
          'Dynamic lists stay interactive without re-attaching handlers.',
        ]}
      />
    </LessonArticle>
  )
}